import { connectDB } from '@/lib/mongodb';
import { Tutorial } from '@/lib/models/Tutorial';
import User from '@/lib/models/User';
import Category from '@/lib/models/Category';
import { getAuthUser, apiError, apiResponse, slugify } from '@/lib/utils/auth';

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status') || 'approved';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const author = searchParams.get('author');

    const query = {};
    if (status !== 'all') query.status = status;
    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (author) query.author = author;
    if (search) query.$text = { $search: search };

    const adminAndAuthorOnlyStatuses = ['all', 'pending', 'draft', 'rejected'];
    if (adminAndAuthorOnlyStatuses.includes(status) || author) {
      if (!authUser || !['admin', 'author'].includes(authUser.role)) {
        return apiError('Unauthorized', 403);
      }
      if (authUser.role === 'author') {
        query.author = authUser.id;
      }
    }

    const skip = (page - 1) * limit;
    const [tutorials, total] = await Promise.all([
      Tutorial.find(query)
        .populate('category', 'name slug color icon')
        .populate('author', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Tutorial.countDocuments(query),
    ]);

    return apiResponse({ tutorials, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('Get tutorials error:', err);
    return apiError('Server error', 500);
  }
}

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || !['admin', 'author'].includes(authUser.role)) {
      return apiError('Unauthorized', 403);
    }

    await connectDB();
    const body = await request.json();
    const { title, description, category, coverImage, tags, difficulty, metaTitle, metaDescription, metaKeywords } = body;

    if (!title || !description || !category) return apiError('Title, description, and category are required');

    const slug = slugify(title);
    const exists = await Tutorial.findOne({ slug });
    const finalSlug = exists ? `${slug}-${Date.now()}` : slug;

    const tutorial = new Tutorial({
      title, description, category, coverImage: coverImage || '',
      author: authUser.id,
      tags: tags || [],
      difficulty: difficulty || 'beginner',
      slug: finalSlug,
      status: authUser.role === 'admin' ? 'approved' : 'pending',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || description,
      metaKeywords: metaKeywords || tags || [],
    });

    await tutorial.save();
    return apiResponse({ tutorial, message: authUser.role === 'admin' ? 'Tutorial created' : 'Tutorial submitted for review' }, 201);
  } catch (err) {
    console.error('Create tutorial error:', err);
    return apiError('Server error', 500);
  }
}
