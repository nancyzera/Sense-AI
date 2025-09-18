import { verifyAccessToken, extractTokenFromHeader } from '../utils/tokenUtils.js';
import User from '../models/userModel.js';

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify the token
    const decoded = verifyAccessToken(token);

    // Find user by ID from token
    const user = await User.findById(decoded.userId).select('-password -refreshTokens');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Attach user to request object
    req.user = user;
    req.token = token;
    next();

  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        success: false,
        message: 'Access token has expired',
        code: 'TOKEN_EXPIRED'
      });
    } else if (error.message.includes('Invalid')) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token',
        code: 'TOKEN_INVALID'
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed',
        code: 'AUTH_FAILED'
      });
    }
  }
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.userId).select('-password -refreshTokens');
      
      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

/**
 * Middleware to check if user is premium
 */
export const requirePremium = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.isPremium) {
    return res.status(403).json({
      success: false,
      message: 'Premium subscription required',
      code: 'PREMIUM_REQUIRED',
      subscriptionTier: req.user.subscriptionTier
    });
  }

  next();
};

/**
 * Middleware to check subscription status
 */
export const checkSubscription = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Check if subscription has expired
  if (req.user.subscriptionTier === 'premium' && !req.user.isSubscriptionActive) {
    // Auto-downgrade to free tier
    req.user.subscriptionTier = 'free';
    req.user.subscriptionExpiry = null;
    req.user.save();
  }

  next();
};

/**
 * Middleware to check usage limits
 */
export const checkUsageLimit = (feature) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.checkUsageLimit(feature)) {
      return res.status(429).json({
        success: false,
        message: `Usage limit exceeded for ${feature}`,
        code: 'USAGE_LIMIT_EXCEEDED',
        feature: feature,
        subscriptionTier: req.user.subscriptionTier
      });
    }

    next();
  };
};

/**
 * Middleware to verify email
 */
export const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      code: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

/**
 * Middleware to check if user owns resource
 */
export const checkResourceOwnership = (resourceIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const resourceId = req.params[resourceIdParam];
    
    if (req.user._id.toString() !== resourceId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });
    }

    next();
  };
};
