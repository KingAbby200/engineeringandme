import { connectDB } from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import { getAuthUser, apiError, apiResponse, slugify } from '@/lib/utils/auth';

export async function PUT(request, { params }) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') return apiError('Unauthorized', 403);

    await connectDB();
    const { id } = await params;
    const { name, description, icon, color, order, isActive } = await request.json();

    const updates = {};
    if (name) { updates.name = name; updates.slug = slugify(name); }
    if (description !== undefined) updates.description = description;
    if (icon !== undefined) updates.icon = icon;
    if (color) updates.color = color;
    if (order !== undefined) updates.order = order;
    if (isActive !== undefined) updates.isActive = isActive;

    const cat = await Category.findByIdAndUpdate(id, updates, { new: true });
    return apiResponse({ category: cat });
  } catch (err) {
    return apiError('Server error', 500);
  }
}

export async function DELETE(request, { params }) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') return apiError('Unauthorized', 403);

    await connectDB();
    const { id } = await params;
    await Category.findByIdAndDelete(id);
    return apiResponse({ message: 'Category deleted' });
  } catch (err) {
    return apiError('Server error', 500);
  }
}
