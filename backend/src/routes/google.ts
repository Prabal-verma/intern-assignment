import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import '../config/passport';

const router = Router();

// Start Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
  // @ts-ignore
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  
  const userObj = typeof (user as any).toObject === 'function' ? (user as any).toObject() : user;
  const token = jwt.sign({ userId: userObj._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
  
  // Redirect to frontend with token and user info
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/google?token=${token}&email=${encodeURIComponent(userObj.email)}&name=${encodeURIComponent(userObj.name || '')}`;
  res.redirect(redirectUrl);
});

export default router;
