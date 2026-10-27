# Cloudflare R2 upload setup for SpotiSix

This project can use Cloudflare R2 for uploaded audio files while keeping Supabase for auth and metadata.

## 1) Create R2 bucket

1. Open Cloudflare dashboard.
2. Go to R2.
3. Create a bucket, for example `spotisix-community`.
4. Enable public access if you want direct public URLs.
5. Copy your bucket public endpoint, for example:
   `https://<accountid>.r2.dev`

## 2) Create Cloudflare Worker

Use the file in `cloudflare/upload-worker.js`.

Set the following bindings:
- `R2_BUCKET` -> your bucket
- `PUBLIC_URL` -> `https://<accountid>.r2.dev/<bucket-name>`
- `ALLOWED_ORIGIN` -> `https://your-app-domain.com` (optional but recommended)

Example worker route:
- `/upload`

## 3) Update app config

Edit `supabase-config.js`:

```js
window.SPOTISIX_CLOUDFLARE_CONFIG = {
  enabled: true,
  publicUrl: 'https://<accountid>.r2.dev/<bucket-name>',
  uploadEndpoint: 'https://your-worker.example.com/upload',
  objectPrefix: 'community-music',
};
```

Leave Supabase config as-is for auth.

## 4) Frontend behavior

The app will:
- try Cloudflare R2 when enabled
- otherwise fall back to Supabase storage

This keeps Supabase as the auth/metadata layer and avoids the 1GB storage limit issue for music files.

## 5) Important security note

Do not expose Cloudflare API keys or secret credentials in the browser. Upload must be handled by the Worker, not directly from the frontend.

## 6) Optional JWT verification

If you want stronger auth, add verification in the worker using the Supabase JWT from the Authorization header before accepting uploads.

## 7) Example worker request from frontend

```js
const formData = new FormData();
formData.append('file', file, file.name);
formData.append('objectKey', `community-music/${userId}/${crypto.randomUUID()}-${safeName}`);

const response = await fetch('https://your-worker.example.com/upload', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```
