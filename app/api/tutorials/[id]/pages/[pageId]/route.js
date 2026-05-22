import { connectDB } from '@/lib/mongodb';
import { Tutorial, TutorialPage } from '@/lib/models/Tutorial';
import { getAuthUser, apiError, apiResponse, slugify, generateReadingTime } from '@/lib/utils/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id, pageId } = await params;
    const page = await TutorialPage.findOne({ _id: pageId, tutorial: id });
    if (!page) return apiError('Page not found', 404);
    return apiResponse({ page });
  } catch (err) {
    return apiError('Server error', 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || !['admin', 'author'].includes(authUser.role)) return apiError('Unauthorized', 403);

    await connectDB();
    const { id, pageId } = await params;
    const tutorial = await Tutorial.findById(id);
    if (!tutorial) return apiError('Tutorial not found', 404);
    if (authUser.role !== 'admin' && tutorial.author.toString() !== authUser.id) return apiError('Forbidden', 403);

    const { title, content, order, quiz, metaDescription } = await request.json();
    const updates = {};
    if (title) { updates.title = title; updates.slug = `${slugify(title)}-${pageId.slice(-6)}`; }
    if (content) { updates.content = content; updates.readingTime = generateReadingTime(content); }
    if (order !== undefined) updates.order = order;
    if (quiz !== undefined) updates.quiz = quiz;
    if (metaDescription !== undefined) updates.metaDescription = metaDescription;

    const page = await TutorialPage.findByIdAndUpdate(pageId, updates, { new: true });
    return apiResponse({ page });
  } catch (err) {
    return apiError('Server error', 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || !['admin', 'author'].includes(authUser.role)) return apiError('Unauthorized', 403);

    await connectDB();
    const { id, pageId } = await params;
    const tutorial = await Tutorial.findById(id);
    if (!tutorial) return apiError('Tutorial not found', 404);
    if (authUser.role !== 'admin' && tutorial.author.toString() !== authUser.id) return apiError('Forbidden', 403);

    await TutorialPage.findByIdAndDelete(pageId);
    const remaining = await TutorialPage.countDocuments({ tutorial: id });
    await Tutorial.findByIdAndUpdate(id, { totalPages: remaining });

    return apiResponse({ message: 'Page deleted' });
  } catch (err) {
    return apiError('Server error', 500);
  }
}
