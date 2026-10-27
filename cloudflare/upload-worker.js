export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    const allowedOrigin = (env.ALLOWED_ORIGIN || '').trim();
    const origin = request.headers.get('Origin') || '';
    if (allowedOrigin && origin && origin !== allowedOrigin) {
      return json({ error: 'Origin not allowed' }, 403);
    }

    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!token) {
      return json({ error: 'Missing bearer token' }, 401);
    }

    const contentType = request.headers.get('Content-Type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return json({ error: 'Upload must be multipart/form-data' }, 400);
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const objectKeyInput = formData.get('objectKey')?.toString() || '';

    if (!(file instanceof File)) {
      return json({ error: 'No file provided' }, 400);
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'audio';
    const objectKey = (objectKeyInput || `community-music/${Date.now()}-${safeName}`).replace(/^\/+/, '');

    if (file.size <= 0) {
      return json({ error: 'File is empty' }, 400);
    }

    if (file.size > 50 * 1024 * 1024) {
      return json({ error: 'File exceeds 50 MB limit' }, 413);
    }

    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/mp4',
      'audio/x-m4a',
      'audio/wav',
      'audio/x-wav',
      'audio/flac',
      'audio/ogg',
      'audio/aac',
      'audio/webm',
      'audio/m4a',
    ];

    if (!allowedMimeTypes.includes(file.type)) {
      return json({ error: `Unsupported type: ${file.type || 'unknown'}` }, 415);
    }

    const object = await env.R2_BUCKET.put(objectKey, file, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=3600',
      },
    });

    if (!object) {
      return json({ error: 'Upload failed in R2' }, 500);
    }

    const publicUrl = `${env.PUBLIC_URL || 'https://<bucket-name>.r2.dev'}/${objectKey}`;

    return json({
      ok: true,
      objectKey,
      publicUrl,
      size: file.size,
      mimeType: file.type,
    }, 200);
  },
};

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    },
  });
}
