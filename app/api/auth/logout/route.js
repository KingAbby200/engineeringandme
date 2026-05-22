import { apiResponse } from '@/lib/utils/auth';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  return apiResponse({ message: 'Logged out' });
}
