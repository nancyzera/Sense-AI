import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/userModel.js';
import { generateTokenPair } from '../utils/tokenUtils.js';
import dotenv from 'dotenv';

dotenv.config();

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password -refreshTokens');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: profile.emails[0].value },
        { providerId: profile.id, provider: 'google' }
      ]
    });

    if (user) {
      // Update existing user with Google info if needed
      if (user.provider === 'local' && !user.providerId) {
        user.provider = 'google';
        user.providerId = profile.id;
        user.avatar = profile.photos[0].value;
        user.isEmailVerified = true;
        await user.save();
      }
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      provider: 'google',
      providerId: profile.id,
      avatar: profile.photos[0].value,
      isEmailVerified: true
    });

    return done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ 
      $or: [
        { email: profile.emails?.[0]?.value },
        { providerId: profile.id, provider: 'github' }
      ]
    });

    if (user) {
      // Update existing user with GitHub info if needed
      if (user.provider === 'local' && !user.providerId) {
        user.provider = 'github';
        user.providerId = profile.id;
        user.avatar = profile.photos?.[0]?.value;
        user.isEmailVerified = true;
        await user.save();
      }
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      name: profile.displayName || profile.username,
      email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
      provider: 'github',
      providerId: profile.id,
      avatar: profile.photos?.[0]?.value,
      isEmailVerified: true
    });

    return done(null, user);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return done(error, null);
  }
}));

export default passport;
