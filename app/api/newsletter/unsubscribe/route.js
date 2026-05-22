import { connectDB } from '@/lib/mongodb';
import Newsletter from '@/lib/models/Newsletter';
import { redirect } from 'next/navigation';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (token) {
    try {
      await connectDB();
      await Newsletter.findOneAndUpdate({ unsubscribeToken: token }, { isActive: false });
    } catch {}
  }
  redirect('/unsubscribed');
}
