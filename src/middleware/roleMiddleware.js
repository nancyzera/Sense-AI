/**
 * Role-based access control middleware
 */

/**
 * Check if user has specific subscription tier
 * @param {string|string[]} allowedTiers - Allowed subscription tiers
 */
export const requireSubscriptionTier = (allowedTiers) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userTier = req.user.subscriptionTier;
    const tiers = Array.isArray(allowedTiers) ? allowedTiers : [allowedTiers];

    if (!tiers.includes(userTier)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required subscription tier: ${tiers.join(' or ')}`,
        code: 'INSUFFICIENT_SUBSCRIPTION',
        requiredTiers: tiers,
        currentTier: userTier
      });
    }

    next();
  };
};

/**
 * Check if user is premium (alias for requireSubscriptionTier)
 */
export const requirePremium = requireSubscriptionTier(['premium']);

/**
 * Check if user is free tier or higher
 */
export const requireFreeOrHigher = requireSubscriptionTier(['free', 'premium']);

/**
 * Feature-based access control
 */
export const requireFeature = (feature) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const featureAccess = {
      voiceToText: ['premium'],
      textToSpeech: ['premium'],
      advancedAI: ['premium'],
      apiAccess: ['free', 'premium'],
      basicFeatures: ['free', 'premium']
    };

    const allowedTiers = featureAccess[feature];
    if (!allowedTiers) {
      return res.status(500).json({
        success: false,
        message: 'Feature access configuration error'
      });
    }

    if (!allowedTiers.includes(req.user.subscriptionTier)) {
      return res.status(403).json({
        success: false,
        message: `Feature '${feature}' requires premium subscription`,
        code: 'FEATURE_RESTRICTED',
        feature: feature,
        subscriptionTier: req.user.subscriptionTier
      });
    }

    next();
  };
};

/**
 * Usage-based access control
 */
export const checkUsageLimit = (feature) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has reached usage limit
    if (!req.user.checkUsageLimit(feature)) {
      return res.status(429).json({
        success: false,
        message: `Usage limit exceeded for ${feature}`,
        code: 'USAGE_LIMIT_EXCEEDED',
        feature: feature,
        subscriptionTier: req.user.subscriptionTier,
        usageMetrics: req.user.usageMetrics
      });
    }

    next();
  };
};

/**
 * Admin access control
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // For now, we don't have admin roles, but this can be extended
  if (req.user.subscriptionTier !== 'premium') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
      code: 'ADMIN_REQUIRED'
    });
  }

  next();
};

/**
 * Rate limiting based on subscription tier
 */
export const subscriptionBasedRateLimit = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  // Set rate limit based on subscription tier
  const rateLimits = {
    free: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // 100 requests per window
    },
    premium: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000 // 1000 requests per window
    }
  };

  const userLimit = rateLimits[req.user.subscriptionTier];
  req.rateLimit = userLimit;

  next();
};

/**
 * Check if user can access specific resource
 */
export const checkResourceAccess = (resourceType) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const resourceAccess = {
      voice: ['premium'],
      text: ['free', 'premium'],
      api: ['free', 'premium'],
      analytics: ['premium']
    };

    const allowedTiers = resourceAccess[resourceType];
    if (!allowedTiers) {
      return res.status(500).json({
        success: false,
        message: 'Resource access configuration error'
      });
    }

    if (!allowedTiers.includes(req.user.subscriptionTier)) {
      return res.status(403).json({
        success: false,
        message: `Access to ${resourceType} resources requires premium subscription`,
        code: 'RESOURCE_ACCESS_DENIED',
        resourceType: resourceType,
        subscriptionTier: req.user.subscriptionTier
      });
    }

    next();
  };
};
