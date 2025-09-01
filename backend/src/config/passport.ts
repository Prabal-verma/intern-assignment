import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      // Check if user exists with same email
      const existingUser = await User.findOne({ email: profile.emails?.[0].value });
      
      if (existingUser) {
        // Link Google account to existing user
        existingUser.googleId = profile.id;
        existingUser.isVerified = true; // Google users are auto-verified
        if (!existingUser.name) {
          existingUser.name = profile.displayName;
        }
        await existingUser.save();
        return done(null, existingUser);
      } else {
        // Create new user with Google account
        user = await User.create({
          googleId: profile.id,
          email: profile.emails?.[0].value,
          name: profile.displayName,
          isVerified: true, // Google users are auto-verified
        });
      }
    } else {
      // Update existing Google user info if needed
      if (!user.name && profile.displayName) {
        user.name = profile.displayName;
        await user.save();
      }
    }
    
    return done(null, user);
  } catch (err) {
    console.error('Google OAuth error:', err);
    return done(err, undefined);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
