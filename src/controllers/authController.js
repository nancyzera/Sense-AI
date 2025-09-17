import User from '../models/userModel.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/tokenUtils.js';
import { validationResult } from 'express-validator';

/**
 * Register a new user
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmailOrPhone(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or phone'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Add refresh token to user's refresh tokens array
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save();

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshTokens;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        tokens
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `User already exists with this ${field}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmailOrPhone(email).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if user is local provider
    if (user.provider !== 'local') {
      return res.status(401).json({
        success: false,
        message: `Please use ${user.provider} login instead`
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Add refresh token to user's refresh tokens array
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save();

    // Remove sensitive data
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshTokens;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        tokens
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some(tokenObj => tokenObj.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const tokens = generateTokenPair(user);

    // Remove old refresh token and add new one
    user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken);
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save();

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token has expired'
      });
    } else if (error.message.includes('Invalid')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during token refresh'
    });
  }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user;

    if (refreshToken) {
      // Remove specific refresh token
      user.refreshTokens = user.refreshTokens.filter(tokenObj => tokenObj.token !== refreshToken);
      await user.save();
    } else {
      // Remove all refresh tokens (logout from all devices)
      user.refreshTokens = [];
      await user.save();
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during logout'
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving profile'
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const user = req.user;

    // Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `User already exists with this ${field}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error while updating profile'
    });
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Check if user is local provider
    if (user.provider !== 'local') {
      return res.status(400).json({
        success: false,
        message: 'Password change not available for OAuth users'
      });
    }

    // Get user with password
    const userWithPassword = await User.findById(user._id).select('+password');

    // Verify current password
    const isCurrentPasswordValid = await userWithPassword.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    // Remove all refresh tokens to force re-login
    userWithPassword.refreshTokens = [];
    await userWithPassword.save();

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while changing password'
    });
  }
};

/**
 * Google OAuth callback
 */
export const googleCallback = async (req, res) => {
  try {
    const user = req.user;
    
    // Generate tokens
    const tokens = generateTokenPair(user);

    // Add refresh token to user's refresh tokens array
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save();

    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?access_token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
  }
};

/**
 * GitHub OAuth callback
 */
export const githubCallback = async (req, res) => {
  try {
    const user = req.user;
    
    // Generate tokens
    const tokens = generateTokenPair(user);

    // Add refresh token to user's refresh tokens array
    user.refreshTokens.push({ token: tokens.refreshToken });
    await user.save();

    // Redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?access_token=${tokens.accessToken}&refresh_token=${tokens.refreshToken}`;
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('GitHub callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=Authentication failed`);
  }
};

/**
 * Delete user account
 */
export const deleteAccount = async (req, res) => {
  try {
    const user = req.user;

    // Soft delete - deactivate account
    user.isActive = false;
    user.refreshTokens = [];
    await user.save();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while deleting account'
    });
  }
};

/**
 * Get user usage metrics
 */
export const getUsageMetrics = async (req, res) => {
  try {
    const user = req.user;

    const limits = {
      free: {
        voiceMinutes: 10,
        textCharacters: 1000,
        apiCalls: 50
      },
      premium: {
        voiceMinutes: Infinity,
        textCharacters: Infinity,
        apiCalls: Infinity
      }
    };

    const userLimits = limits[user.subscriptionTier];

    res.json({
      success: true,
      message: 'Usage metrics retrieved successfully',
      data: {
        usage: user.usageMetrics,
        limits: userLimits,
        subscriptionTier: user.subscriptionTier
      }
    });

  } catch (error) {
    console.error('Get usage metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving usage metrics'
    });
  }
};
