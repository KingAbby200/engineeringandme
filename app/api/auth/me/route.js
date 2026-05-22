import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import Tutorial from '@/lib/models/Tutorial';
import { getAuthUser, apiError, apiResponse } from '@/lib/utils/auth';

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return apiError('Not authenticated', 401);

    await connectDB();
    const user = await User.findById(authUser.id)
      .select('-password -otp -otpExpiry -resetToken -resetTokenExpiry')
      .populate({ path: 'progress.tutorial', select: 'title slug coverImage totalPages' })
      .populate({ path: 'progress.lastPage', select: 'title slug order' });

    if (!user) return apiError('User not found', 404);
    return apiResponse({ user });
  } catch (err) {
    console.error('Me error:', err);
    return apiError('Server error', 500);
  }
}

export async function PUT(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return apiError('Not authenticated', 401);

    await connectDB();
    const { name, bio, avatar, courseOfInterest } = await request.json();
    const user = await User.findByIdAndUpdate(
      authUser.id,
      { ...(name && { name }), ...(bio !== undefined && { bio }), ...(avatar && { avatar }), ...(courseOfInterest && { courseOfInterest }) },
      { new: true }
    ).select('-password -otp -otpExpiry -resetToken -resetTokenExpiry');

    return apiResponse({ user });
  } catch (err) {
    return apiError('Server error', 500);
  }
}
