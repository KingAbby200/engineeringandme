import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';
import { getAuthUser, apiError, apiResponse } from '@/lib/utils/auth';
import { sendAuthorCreatedEmail } from '@/lib/utils/email';
import crypto from 'crypto';

export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') return apiError('Unauthorized', 403);

    await connectDB();
    const authors = await User.find({ role: 'author' })
      .select('name email avatar isActive createdAt bio')
      .sort({ createdAt: -1 });
    return apiResponse({ authors });
  } catch (err) {
    return apiError('Server error', 500);
  }
}

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') return apiError('Unauthorized', 403);

    await connectDB();
    const { name, email, bio } = await request.json();
    if (!name || !email) return apiError('Name and email are required');

    const existing = await User.findOne({ email });
    if (existing) return apiError('Email already in use');

    const tempPassword = crypto.randomBytes(8).toString('hex') + 'A1!';
    const author = new User({
      name, email, bio: bio || '',
      password: tempPassword,
      role: 'author',
      isVerified: true,
      courseOfInterest: 'electrical',
      createdBy: authUser.id,
    });
    await author.save();
    await sendAuthorCreatedEmail(email, name, tempPassword);

    return apiResponse({ message: 'Author created and credentials sent via email', author: { id: author._id, name, email } }, 201);
  } catch (err) {
    console.error('Create author error:', err);
    return apiError('Server error', 500);
  }
}

export async function PUT(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || authUser.role !== 'admin') return apiError('Unauthorized', 403);

    await connectDB();
    const { authorId, isActive } = await request.json();
    const author = await User.findByIdAndUpdate(authorId, { isActive }, { new: true }).select('name email isActive');
    return apiResponse({ author });
  } catch (err) {
    return apiError('Server error', 500);
  }
}
