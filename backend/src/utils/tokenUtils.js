import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

/**
 * Generate access token
 * @param {Object} payload - User data to include in token
 * @returns {string} - JWT access token
 */
export const generateAccessToken = (payload) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
    issuer: 'sense-ai',
    audience: 'sense-ai-users'
  });
};

/**
 * Generate refresh token
 * @param {Object} payload - User data to include in token
 * @returns {string} - JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  if (!JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE,
    issuer: 'sense-ai',
    audience: 'sense-ai-users'
  });
};

/**
 * Verify access token
 * @param {string} token - JWT access token
 * @returns {Object} - Decoded token payload
 */
export const verifyAccessToken = (token) => {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'sense-ai',
      audience: 'sense-ai-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Verify refresh token
 * @param {string} token - JWT refresh token
 * @returns {Object} - Decoded token payload
 */
export const verifyRefreshToken = (token) => {
  if (!JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
  }

  try {
    return jwt.verify(token, JWT_REFRESH_SECRET, {
      issuer: 'sense-ai',
      audience: 'sense-ai-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Generate token pair (access + refresh)
 * @param {Object} user - User object
 * @returns {Object} - Object containing access and refresh tokens
 */
export const generateTokenPair = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    subscriptionTier: user.subscriptionTier,
    isPremium: user.isPremium
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} - Extracted token or null
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null
 */
export const getTokenExpiration = (token) => {
  const decoded = decodeToken(token);
  if (decoded && decoded.exp) {
    return new Date(decoded.exp * 1000);
  }
  return null;
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired
 */
export const isTokenExpired = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return true;
  return expiration < new Date();
};
