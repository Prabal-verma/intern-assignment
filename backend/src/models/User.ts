import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  googleId?: string;
  otp?: string;
  otpExpires?: Date;
  name?: string;
  dob?: Date;
  isVerified: boolean;
}

const userSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  googleId: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },
  name: { 
    type: String,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  dob: { 
    type: Date,
    validate: {
      validator: function(value: Date) {
        // Check if the date is not in the future
        return !value || value <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);
