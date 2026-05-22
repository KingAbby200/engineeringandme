import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { apiError, apiResponse, signToken } from '@/lib/utils/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) return apiError('Email and password required');

    // Admin login
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      let admin = await User.findOne({ email, role: 'admin' });
      if (!admin) {
        admin = new User({ name: 'Admin', email, password, role: 'admin', isVerified: true, courseOfInterest: 'electrical' });
        await admin.save();
      }
      admin.updateStreak();
      await admin.save();
      const token = signToken({ id: admin._id, role: 'admin', email });
      const cookieStore = await cookies();
      cookieStore.set('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });
      return apiResponse({ user: { id: admin._id, name: admin.name, email, role: 'admin' } });
    }

    const user = await User.findOne({ email });
    if (!user) return apiError('Invalid credentials');
    if (!user.isVerified) return apiError('Please verify your email first');
    if (!user.isActive) return apiError('Account deactivated. Contact admin.');

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return apiError('Invalid credentials');

    user.updateStreak();
    await user.save();

    const token = signToken({ id: user._id, role: user.role, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7, path: '/' });

    return apiResponse({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, courseOfInterest: user.courseOfInterest, streak: user.streak },
    });
  } catch (err) {
    console.error('Login error:', err);
    return apiError('Server error', 500);
  }
}
