import { auth } from '../firebase/config';

interface UploadResponse {
  url?: string;
  error?: string;
}

const allowedImageTypes = new Set([
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

export const uploadImageToSupabase = async (
  file: File,
  folder: 'properties' | 'updates',
  maxSizeBytes: number
): Promise<string> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY, then restart the dev server.');
  }

  if (!allowedImageTypes.has(file.type)) {
    throw new Error('Select a JPEG, PNG, WebP, GIF, or AVIF image.');
  }

  if (file.size > maxSizeBytes) {
    throw new Error(`Image size must be no more than ${Math.floor(maxSizeBytes / (1024 * 1024))}MB.`);
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('Sign in as the admin before uploading images.');
  }

  const idToken = await user.getIdToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  let response: Response;
  try {
    response = await fetch(`${supabaseUrl}/functions/v1/upload-property-image`, {
      method: 'POST',
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${idToken}`,
      },
      body: formData,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Cannot reach the Supabase upload function. Deploy "upload-property-image" to the configured Supabase project, then retry.');
    }
    throw error;
  }

  let result: UploadResponse;
  try {
    result = await response.json() as UploadResponse;
  } catch {
    if (response.status === 404) {
      throw new Error('Supabase function "upload-property-image" is not deployed. Deploy it to the configured project, then retry.');
    }
    throw new Error(`Supabase returned an unreadable upload response (${response.status}).`);
  }

  if (response.status === 404) {
    throw new Error('Supabase function "upload-property-image" is not deployed. Deploy it to the configured project, then retry.');
  }

  if (!response.ok) {
    throw new Error(result.error || `Image upload failed (${response.status}).`);
  }

  if (!result.url) {
    throw new Error('Image upload completed without returning a public URL.');
  }

  return result.url;
};
