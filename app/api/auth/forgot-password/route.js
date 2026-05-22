import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { apiError, apiResponse } from '@/lib/utils/auth';
import { sendPasswordResetEmail } from '@/lib/utils/email';
import crypto from 'crypto';

export async function POST(request) {
  try {
    await connectDB();
    const { email } = await request.json();
    const user = await User.findOne({ email });
    if (!user) return apiResponse({ message: 'If this email exists, a reset link has been sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);

    return apiResponse({ message: 'If this email exists, a reset link has been sent.' });
  } catch (err) {
    return apiError('Server error', 500);
  }
}
