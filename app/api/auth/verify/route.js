import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { apiError, apiResponse, signToken } from '@/lib/utils/auth';
import { sendWelcomeEmail } from '@/lib/utils/email';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    await connectDB();
    const { email, otp } = await request.json();
    const user = await User.findOne({ email });

    if (!user) return apiError('User not found');
    if (user.isVerified) return apiError('Already verified');
    if (!user.otp || user.otp !== otp) return apiError('Invalid OTP');
    if (user.otpExpiry < new Date()) return apiError('OTP expired. Please register again.');

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.updateStreak();
    await user.save();

    await sendWelcomeEmail(email, user.name);

    const token = signToken({ id: user._id, role: user.role, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return apiResponse({
      message: 'Email verified successfully',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, courseOfInterest: user.courseOfInterest },
    });
  } catch (err) {
    console.error('Verify error:', err);
    return apiError('Server error', 500);
  }
}
