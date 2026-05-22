import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { apiError, apiResponse } from '@/lib/utils/auth';

export async function POST(request) {
  try {
    await connectDB();
    const { token, password } = await request.json();
    if (!token || !password || password.length < 8) return apiError('Invalid request');

    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: new Date() } });
    if (!user) return apiError('Invalid or expired reset token');

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return apiResponse({ message: 'Password reset successfully' });
  } catch (err) {
    return apiError('Server error', 500);
  }
}
