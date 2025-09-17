import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usageMetricsSchema = new mongoose.Schema({
  voiceMinutesUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  textCharactersUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  apiCallsUsed: {
    type: Number,
    default: 0,
    min: 0
  },
  lastResetDate: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  password: {
    type: String,
    required: function() {
      return this.provider === 'local';
    },
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Never include password in queries by default
  },
  phone: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true,
    match: [
      /^[\+]?[1-9][\d]{0,15}$/,
      'Please provide a valid phone number'
    ]
  },
  subscriptionTier: {
    type: String,
    enum: {
      values: ['free', 'premium'],
      message: 'Subscription tier must be either free or premium'
    },
    default: 'free'
  },
  subscriptionExpiry: {
    type: Date,
    default: null
  },
  usageMetrics: {
    type: usageMetricsSchema,
    default: () => ({})
  },
  provider: {
    type: String,
    enum: {
      values: ['local', 'google', 'github'],
      message: 'Provider must be local, google, or github'
    },
    default: 'local'
  },
  providerId: {
    type: String,
    sparse: true // For OAuth providers
  },
  avatar: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '7d' // Auto-delete after 7 days
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ providerId: 1 });
userSchema.index({ subscriptionTier: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for checking if subscription is active
userSchema.virtual('isSubscriptionActive').get(function() {
  if (this.subscriptionTier === 'free') return true;
  if (!this.subscriptionExpiry) return false;
  return this.subscriptionExpiry > new Date();
});

// Virtual for checking if user is premium
userSchema.virtual('isPremium').get(function() {
  return this.subscriptionTier === 'premium' && this.isSubscriptionActive;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and user is local provider
  if (!this.isModified('password') || this.provider !== 'local') {
    return next();
  }

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.provider !== 'local') {
    throw new Error('Password comparison not available for OAuth users');
  }
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to check usage limits
userSchema.methods.checkUsageLimit = function(feature) {
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

  const userLimits = limits[this.subscriptionTier];
  const currentUsage = this.usageMetrics;

  switch (feature) {
    case 'voice':
      return currentUsage.voiceMinutesUsed < userLimits.voiceMinutes;
    case 'text':
      return currentUsage.textCharactersUsed < userLimits.textCharacters;
    case 'api':
      return currentUsage.apiCallsUsed < userLimits.apiCalls;
    default:
      return false;
  }
};

// Instance method to update usage
userSchema.methods.updateUsage = function(feature, amount = 1) {
  if (!this.checkUsageLimit(feature)) {
    throw new Error(`Usage limit exceeded for ${feature}`);
  }

  switch (feature) {
    case 'voice':
      this.usageMetrics.voiceMinutesUsed += amount;
      break;
    case 'text':
      this.usageMetrics.textCharactersUsed += amount;
      break;
    case 'api':
      this.usageMetrics.apiCallsUsed += amount;
      break;
  }

  return this.save();
};

// Static method to find user by email or phone
userSchema.statics.findByEmailOrPhone = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier },
      { phone: identifier }
    ]
  });
};

// Static method to create OAuth user
userSchema.statics.createOAuthUser = function(profile, provider) {
  return this.create({
    name: profile.displayName || profile.name || profile.username,
    email: profile.emails?.[0]?.value || profile.email,
    provider: provider,
    providerId: profile.id,
    avatar: profile.photos?.[0]?.value || profile.avatar_url,
    isEmailVerified: true
  });
};

export default mongoose.model('User', userSchema);
