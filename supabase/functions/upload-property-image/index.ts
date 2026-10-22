import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createRemoteJWKSet, jwtVerify } from 'https://deno.land/x/jose@v5.9.6/index.ts';

const projectId = 'ahk-real-estate';
const adminUid = 'n8KRHByOOeWAr5WTHHx7DiOCxRr2';
const bucketName = 'ahkrealestatesproperties';
const maxFileSize = 10 * 1024 * 1024;
const allowedImageTypes = new Set([
  'image/avif',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const firebaseJwks = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (body: Record<string, string>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
  }

  const authorization = request.headers.get('Authorization');
  const idToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!idToken) {
    return jsonResponse({ error: 'Sign in as the admin before uploading images.' }, 401);
  }

  try {
    const { payload } = await jwtVerify(idToken, firebaseJwks, {
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
      algorithms: ['RS256'],
    });
    if (payload.sub !== adminUid) {
      return jsonResponse({ error: 'This account is not authorized to upload images.' }, 403);
    }
  } catch {
    return jsonResponse({ error: 'Your sign-in has expired. Sign in again and retry the upload.' }, 401);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > maxFileSize + 1024 * 1024) {
    return jsonResponse({ error: 'Image size must be no more than 10MB.' }, 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: 'Invalid image upload request.' }, 400);
  }

  const file = formData.get('file');
  const folder = formData.get('folder');
  if (!(file instanceof File) || (folder !== 'properties' && folder !== 'updates')) {
    return jsonResponse({ error: 'A valid image and upload folder are required.' }, 400);
  }
  if (!allowedImageTypes.has(file.type)) {
    return jsonResponse({ error: 'Select a JPEG, PNG, WebP, GIF, or AVIF image.' }, 400);
  }
  const folderLimit = folder === 'updates' ? 5 * 1024 * 1024 : maxFileSize;
  if (file.size > folderLimit) {
    return jsonResponse({ error: `Image size must be no more than ${folder === 'updates' ? '5' : '10'}MB.` }, 413);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const secretKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_SECRET_KEY');
  if (!supabaseUrl || !secretKey) {
    console.error('Supabase server configuration is missing.');
    return jsonResponse({ error: 'Image upload service is not configured. Contact the site administrator.' }, 500);
  }

  const extension = file.name.split('.').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'img';
  const objectPath = `${folder}/${crypto.randomUUID()}.${extension}`;
  const supabase = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(objectPath, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error('Supabase Storage upload failed:', uploadError.message);
    return jsonResponse({ error: 'Supabase could not store the image. Check the bucket configuration and try again.' }, 502);
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(objectPath);
  return jsonResponse({ url: data.publicUrl }, 200);
});
