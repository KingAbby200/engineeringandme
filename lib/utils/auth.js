import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'fallback-secret';

export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getAuthUser(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateReadingTime(content) {
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export const ENGINEERING_COURSES = [
  { value: 'electrical', label: 'Electrical & Electronics Engineering' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'mechanical', label: 'Mechanical Engineering' },
  { value: 'computer', label: 'Computer Engineering' },
  { value: 'chemical', label: 'Chemical Engineering' },
  { value: 'petroleum', label: 'Petroleum Engineering' },
  { value: 'aerospace', label: 'Aerospace Engineering' },
  { value: 'structural', label: 'Structural Engineering' },
  { value: 'biomedical', label: 'Biomedical Engineering' },
  { value: 'environmental', label: 'Environmental Engineering' },
];

export function apiResponse(data, status = 200) {
  return Response.json(data, { status });
}

export function apiError(message, status = 400) {
  return Response.json({ error: message }, { status });
}
