import { Router } from 'express';
import { 
  signup, 
  verifySignupOTP, 
  login, 
  verifyLoginOTP, 
  resendOTP,
  getProfile 
} from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Sign up - request OTP for new user registration
router.post('/signup', signup);

// Verify OTP and complete registration
router.post('/verify-signup', verifySignupOTP);

// Login - request OTP for existing user
router.post('/login', login);

// Verify login OTP
router.post('/verify-login', verifyLoginOTP);

// Resend OTP
router.post('/resend-otp', resendOTP);

// Get user profile (protected route)
router.get('/profile', authenticateToken, getProfile);

export default router;
