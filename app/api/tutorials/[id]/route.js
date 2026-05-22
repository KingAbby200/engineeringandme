import { connectDB } from '@/lib/mongodb';
import { Tutorial, TutorialPage } from '@/lib/models/Tutorial';
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';
import { getAuthUser, apiError, apiResponse, slugify } from '@/lib/utils/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const tutorial = await Tutorial.findById(id)
      .populate('category', 'name slug color icon')
      .populate('author', 'name avatar bio');

    if (!tutorial) return apiError('Tutorial not found', 404);

    const pages = await TutorialPage.find({ tutorial: id }).sort({ order: 1 }).select('title slug order readingTime quiz.enabled');

    // Increment views
    await Tutorial.findByIdAndUpdate(id, { $inc: { views: 1 } });

    return apiResponse({ tutorial, pages });
  } catch (err) {
    return apiError('Server error', 500);
  }
}

export async function PUT(request, { params }) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || !['admin', 'author'].includes(authUser.role)) return apiError('Unauthorized', 403);

    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const tutorial = await Tutorial.findById(id);
    if (!tutorial) return apiError('Tutorial not found', 404);

    if (authUser.role !== 'admin' && tutorial.author.toString() !== authUser.id) {
      return apiError('Forbidden', 403);
    }

    const updates = { ...body };
    if (body.title && body.title !== tutorial.title) {
      const newSlug = slugify(body.title);
      updates.slug = newSlug;
    }
    if (authUser.role !== 'admin') {
      updates.status = 'pending'; // re-submit for review on edit
      delete updates.featured;
    }

    const updated = await Tutorial.findByIdAndUpdate(id, updates, { new: true });
    return apiResponse({ tutorial: updated });
  } catch (err) {
    return apiError('Server error', 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || !['admin', 'author'].includes(authUser.role)) return apiError('Unauthorized', 403);

    await connectDB();
    const { id } = await params;
    const tutorial = await Tutorial.findById(id);
    if (!tutorial) return apiError('Tutorial not found', 404);

    if (authUser.role !== 'admin' && tutorial.author.toString() !== authUser.id) {
      return apiError('Forbidden', 403);
    }

    await TutorialPage.deleteMany({ tutorial: id });
    await Tutorial.findByIdAndDelete(id);
    return apiResponse({ message: 'Tutorial deleted' });
  } catch (err) {
    return apiError('Server error', 500);
  }
}
