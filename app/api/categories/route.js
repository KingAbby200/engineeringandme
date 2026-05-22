import { connectDB } from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import { Tutorial } from '@/lib/models/Tutorial';
import { getAuthUser, apiError, apiResponse, slugify } from '@/lib/utils/auth';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isActive: true }).sort({ order: 1, name: 1 });
    // Count approved tutorials per category
    const counts = await Tutorial.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[c._id.toString()] = c.count; });
    const enriched = categories.map(cat => ({ ...cat.toObject(), tutorialCount: countMap[cat._id.toString()] || 0 }));
    return apiResponse({ categories: enriched });
  } catch (err) {
    return apiError('Server error', 500);
  }
}

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') return apiError('Unauthorized', 403);

    await connectDB();
    const { name, description, icon, color, order } = await request.json();
    if (!name) return apiError('Name required');

    const slug = slugify(name);
    const cat = new Category({ name, slug, description, icon, color: color || '#16a34a', order: order || 0 });
    await cat.save();
    return apiResponse({ category: cat }, 201);
  } catch (err) {
    if (err.code === 11000) return apiError('Category already exists');
    return apiError('Server error', 500);
  }
}
