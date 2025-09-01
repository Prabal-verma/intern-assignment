import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import { sendOTPEmail } from '../utils/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Validation helper functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

const validateName = (name: string): boolean => {
  return Boolean(name && name.trim().length >= 2 && name.trim().length <= 50);
};

// Sign up - Send OTP for new user registration
export const signup = async (req: Request, res: Response) => {
  const { email, name, dob } = req.body;
  
  // Validation
  if (!email || !name) {
    return res.status(400).json({ message: 'Email and name are required' });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }
  
  if (!validateName(name)) {
    return res.status(400).json({ message: 'Name must be between 2 and 50 characters long' });
  }

  // Validate DOB if provided
  if (dob) {
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime()) || dobDate > new Date()) {
      return res.status(400).json({ message: 'Please enter a valid date of birth' });
    }
  }

  try {
    // Check if user already exists and is verified
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists. Please use login instead.' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (!user) {
      // Create new user
      const userData: any = { 
        email: email.toLowerCase().trim(), 
        name: name.trim(), 
        otp, 
        otpExpires,
        isVerified: false 
      };
      
      if (dob) {
        userData.dob = new Date(dob);
      }
      
      user = new User(userData);
    } else {
      // Update existing unverified user
      user.name = name.trim();
      user.otp = otp;
      user.otpExpires = otpExpires;
      if (dob) {
        user.dob = new Date(dob);
      }
    }

    await user.save();
    await sendOTPEmail(user.email, otp);
    
    res.json({ 
      message: 'OTP sent to your email address. Please verify to complete registration.',
      email: user.email 
    });
  } catch (err: any) {
    console.error('Signup error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Verify OTP and complete registration
export const verifySignupOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'Invalid request. Please request a new OTP.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Registration successful!',
      token, 
      user: { 
        id: user._id,
        email: user.email, 
        name: user.name,
        isVerified: user.isVerified
      } 
    });
  } catch (err) {
    console.error('Verify signup OTP error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Login - Send OTP for existing user
export const login = async (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'User not found. Please sign up first.' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(user.email, otp);
    
    res.json({ 
      message: 'OTP sent to your email address',
      email: user.email 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Verify login OTP
export const verifyLoginOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'User not found. Please sign up first.' });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    
    res.json({ 
      message: 'Login successful!',
      token, 
      user: { 
        id: user._id,
        email: user.email, 
        name: user.name,
        isVerified: user.isVerified
      } 
    });
  } catch (err) {
    console.error('Verify login OTP error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Resend OTP
export const resendOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(user.email, otp);
    
    res.json({ 
      message: 'New OTP sent to your email address',
      email: user.email 
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// Get user profile (protected route)
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = req.user; // Set by authentication middleware
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
