import { connectDB } from '@/lib/mongodb';
import { Tutorial, TutorialPage } from '@/lib/models/Tutorial';
import { getAuthUser, apiError, apiResponse, slugify, generateReadingTime } from '@/lib/utils/auth';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const pages = await TutorialPage.find({ tutorial: id }).sort({ order: 1 });
    return apiResponse({ pages });
  } catch (err) {
    return apiError('Server error', 500);
  }
}

export async function POST(request, { params }) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || !['admin', 'author'].includes(authUser.role)) return apiError('Unauthorized', 403);

    await connectDB();
    const { id } = await params;
    const tutorial = await Tutorial.findById(id);
    if (!tutorial) return apiError('Tutorial not found', 404);

    if (authUser.role !== 'admin' && tutorial.author.toString() !== authUser.id) return apiError('Forbidden', 403);

    const { title, content, order, quiz, metaDescription } = await request.json();
    if (!title || !content) return apiError('Title and content required');

    const slug = slugify(title);
    const existingPages = await TutorialPage.countDocuments({ tutorial: id });
    const readingTime = generateReadingTime(content);

    const page = new TutorialPage({
      tutorial: id,
      title, content,
      slug: `${slug}-${Date.now()}`,
      order: order || existingPages + 1,
      quiz: quiz || { enabled: false, questions: [] },
      metaDescription,
      readingTime,
    });

    await page.save();
    await Tutorial.findByIdAndUpdate(id, { totalPages: existingPages + 1 });

    return apiResponse({ page }, 201);
  } catch (err) {
    console.error('Create page error:', err);
    return apiError('Server error', 500);
  }
}
