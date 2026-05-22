import { connectDB } from '@/lib/mongodb';
import Newsletter from '@/lib/models/Newsletter';
import { apiError, apiResponse } from '@/lib/utils/auth';
import { sendNewsletterWelcome } from '@/lib/utils/email';
import crypto from 'crypto';

export async function POST(request) {
  try {
    await connectDB();
    const { email, name } = await request.json();
    if (!email) return apiError('Email required');

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      if (existing.isActive) return apiError('Already subscribed');
      existing.isActive = true;
      await existing.save();
      return apiResponse({ message: 'Resubscribed successfully' });
    }

    const unsubscribeToken = crypto.randomBytes(32).toString('hex');
    const subscriber = new Newsletter({ email, name, unsubscribeToken });
    await subscriber.save();

    await sendNewsletterWelcome(email, name, unsubscribeToken);
    return apiResponse({ message: 'Subscribed successfully! Check your email.' }, 201);
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    return apiError('Server error', 500);
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    if (!token) return apiError('Token required');

    const subscriber = await Newsletter.findOneAndUpdate({ unsubscribeToken: token }, { isActive: false }, { new: true });
    if (!subscriber) return apiError('Invalid token');

    return apiResponse({ message: 'Unsubscribed successfully' });
  } catch (err) {
    return apiError('Server error', 500);
  }
}
