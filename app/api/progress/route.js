import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { Tutorial, TutorialPage } from '@/lib/models/Tutorial';
import { getAuthUser, apiError, apiResponse } from '@/lib/utils/auth';

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return apiError('Not authenticated', 401);

    await connectDB();
    const { tutorialId, pageId } = await request.json();
    if (!tutorialId || !pageId) return apiError('tutorialId and pageId required');

    const user = await User.findById(authUser.id);
    if (!user) return apiError('User not found', 404);

    const tutorial = await Tutorial.findById(tutorialId);
    if (!tutorial) return apiError('Tutorial not found', 404);

    let progress = user.progress.find(p => p.tutorial.toString() === tutorialId);

    if (!progress) {
      user.progress.push({ tutorial: tutorialId, pagesCompleted: [pageId], lastPage: pageId, percentComplete: Math.round(1 / tutorial.totalPages * 100) });
    } else {
      if (!progress.pagesCompleted.map(p => p.toString()).includes(pageId)) {
        progress.pagesCompleted.push(pageId);
      }
      progress.lastPage = pageId;
      progress.percentComplete = Math.round(progress.pagesCompleted.length / tutorial.totalPages * 100);
      if (progress.percentComplete >= 100) progress.completedAt = new Date();
    }

    await user.save();
    return apiResponse({ message: 'Progress updated', progress: user.progress.find(p => p.tutorial.toString() === tutorialId) });
  } catch (err) {
    console.error('Progress error:', err);
    return apiError('Server error', 500);
  }
}
