import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendOTPEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Your OTP for Note App Authentication',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Note App - Authentication Code</h2>
        <p>Hi there,</p>
        <p>You've requested to sign in to your Note App account. Please use the following One-Time Password (OTP) to complete your authentication:</p>
        <div style="background-color: #f5f5f5; padding: 20px; margin: 20px 0; text-align: center; border-radius: 5px;">
          <h1 style="color: #2563eb; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p><strong>Important:</strong></p>
        <ul>
          <li>This OTP is valid for 10 minutes only</li>
          <li>Don't share this code with anyone</li>
          <li>If you didn't request this, please ignore this email</li>
        </ul>
        <p>Best regards,<br>Note App Team</p>
      </div>
    `,
    text: `Your OTP for Note App is: ${otp}. This code is valid for 10 minutes. Don't share this code with anyone.`,
  };
  await transporter.sendMail(mailOptions);
};
