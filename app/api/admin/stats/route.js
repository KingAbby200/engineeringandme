import { connectDB } from '@/lib/mongodb';
import { Tutorial } from '@/lib/models/Tutorial';
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';
import { getAuthUser, apiError, apiResponse } from '@/lib/utils/auth';

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') return apiError('Unauthorized', 403);

    await connectDB();
    const [totalTutorials, pending, approved, totalUsers, totalAuthors, totalCategories, recentTutorials] = await Promise.all([
      Tutorial.countDocuments(),
      Tutorial.countDocuments({ status: 'pending' }),
      Tutorial.countDocuments({ status: 'approved' }),
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'author' }),
      Category.countDocuments(),
      Tutorial.find({ status: 'pending' }).populate('author', 'name').populate('category', 'name').sort({ createdAt: -1 }).limit(5).select('title author category createdAt status'),
    ]);

    return apiResponse({ stats: { totalTutorials, pending, approved, totalUsers, totalAuthors, totalCategories }, recentTutorials });
  } catch (err) {
    return apiError('Server error', 500);
  }
}
