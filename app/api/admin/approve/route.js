import { connectDB } from '@/lib/mongodb';
import { Tutorial } from '@/lib/models/Tutorial';
import { getAuthUser, apiError, apiResponse } from '@/lib/utils/auth';

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') return apiError('Unauthorized', 403);

    await connectDB();
    const { tutorialId, action, reason } = await request.json();
    if (!tutorialId || !['approve', 'reject'].includes(action)) return apiError('Invalid request');

    const update = action === 'approve'
      ? { status: 'approved', rejectionReason: '' }
      : { status: 'rejected', rejectionReason: reason || 'Does not meet quality standards' };

    const tutorial = await Tutorial.findByIdAndUpdate(tutorialId, update, { new: true });
    if (!tutorial) return apiError('Tutorial not found', 404);

    return apiResponse({ tutorial, message: `Tutorial ${action}d successfully` });
  } catch (err) {
    return apiError('Server error', 500);
  }
}
