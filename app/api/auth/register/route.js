import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { generateOTP, apiError, apiResponse } from '@/lib/utils/auth';
import { sendOTPEmail } from '@/lib/utils/email';

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password, courseOfInterest } = await request.json();

    if (!name || !email || !password || !courseOfInterest) {
      return apiError('All fields are required');
    }
    if (password.length < 8) return apiError('Password must be at least 8 characters');

    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.isVerified) return apiError('Email already registered');
      // Resend OTP
      const otp = generateOTP();
      existing.otp = otp;
      existing.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      existing.name = name;
      existing.courseOfInterest = courseOfInterest;
      await existing.save();
      await sendOTPEmail(email, otp, name);
      return apiResponse({ message: 'OTP resent. Check your email.' });
    }

    const otp = generateOTP();
    const user = new User({
      name, email, password, courseOfInterest,
      otp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });
    await user.save();
    await sendOTPEmail(email, otp, name);

    return apiResponse({ message: 'Account created. Please verify your email.' }, 201);
  } catch (err) {
    console.error('Register error:', err);
    return apiError('Server error', 500);
  }
}
