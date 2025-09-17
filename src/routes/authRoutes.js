import express from 'express';
import passport from '../config/passportConfig.js';
import rateLimit from 'express-rate-limit';
import {
  signup,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  googleCallback,
  githubCallback,
  deleteAccount,
  getUsageMetrics
} from '../controllers/authController.js';
import {
  validateSignup,
  validateLogin,
  validateRefreshToken,
  validateUpdateProfile,
  validateChangePassword
} from '../middleware/validationMiddleware.js';
import {
  authenticateToken,
  optionalAuth,
  requireEmailVerification
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Rate limiting for auth routes
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const strictAuthRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per window
  message: {
    success: false,
    message: 'Too many attempts, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes (no authentication required)

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', authRateLimit, validateSignup, signup);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', authRateLimit, validateLogin, login);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', validateRefreshToken, refreshToken);

/**
 * @route   GET /auth/google
 * @desc    Google OAuth login
 * @access  Public
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

/**
 * @route   GET /auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  googleCallback
);

/**
 * @route   GET /auth/github
 * @desc    GitHub OAuth login
 * @access  Public
 */
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}));

/**
 * @route   GET /auth/github/callback
 * @desc    GitHub OAuth callback
 * @access  Public
 */
router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  githubCallback
);

// Protected routes (authentication required)

/**
 * @route   POST /auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * @route   PUT /auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, validateUpdateProfile, updateProfile);

/**
 * @route   PUT /auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', 
  strictAuthRateLimit, 
  authenticateToken, 
  validateChangePassword, 
  changePassword
);

/**
 * @route   DELETE /auth/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', authenticateToken, deleteAccount);

/**
 * @route   GET /auth/usage
 * @desc    Get user usage metrics
 * @access  Private
 */
router.get('/usage', authenticateToken, getUsageMetrics);

// Optional auth routes (work with or without authentication)

/**
 * @route   GET /auth/me
 * @desc    Get current user (optional auth)
 * @access  Optional
 */
router.get('/me', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: 'User authenticated',
      data: {
        user: req.user
      }
    });
  } else {
    res.json({
      success: false,
      message: 'No user authenticated',
      data: {
        user: null
      }
    });
  }
});

export default router;
