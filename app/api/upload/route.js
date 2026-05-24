import { uploadImage } from '@/lib/utils/cloudinary';
import { getAuthUser, apiError, apiResponse } from '@/lib/utils/auth';

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser || !['admin', 'author'].includes(authUser.role)) {
      return apiError('Unauthorized', 403);
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'tutorials';

    if (!file) return apiError('No file provided');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) return apiError('Invalid file type. Only images allowed.');

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) return apiError('File too large. Max 10MB.');

    const result = await uploadImage(file, folder);
    return apiResponse({ url: result.secure_url, publicId: result.public_id, width: result.width, height: result.height });
  } catch (err) {
    console.error('Upload error:', err);
    return apiError('Upload failed: ' + err.message, 500);
  }
}
