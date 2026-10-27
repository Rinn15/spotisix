-- Sửa lỗi "new row violates row-level security policy" khi đăng nhạc lên bucket community-music.
-- Storage upload chạy INSERT ... RETURNING trên storage.objects, nên ngoài policy INSERT
-- còn cần policy SELECT cho chính hàng vừa chèn. Migration trước chỉ có INSERT + DELETE.
-- Chạy file này trong Supabase Dashboard → SQL Editor của project vkfynhlhtaorlkzmlexc.

-- Đảm bảo bucket tồn tại và công khai.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-music',
  'community-music',
  true,
  52428800,
  array['audio/mpeg', 'audio/mp3', 'audio/mp4', 'audio/x-m4a', 'audio/wav', 'audio/x-wav', 'audio/flac', 'audio/ogg', 'audio/aac', 'audio/webm']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- INSERT: người dùng chỉ được tải vào thư mục mang uid của mình.
drop policy if exists "Users upload their own community music" on storage.objects;
create policy "Users upload their own community music"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'community-music'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- SELECT: cần cho INSERT ... RETURNING của Storage API (bucket vốn đã public).
drop policy if exists "Anyone can read community music" on storage.objects;
create policy "Anyone can read community music"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'community-music');

-- UPDATE: cho phép ghi đè tệp của chính mình (upsert).
drop policy if exists "Users update their own community music" on storage.objects;
create policy "Users update their own community music"
on storage.objects for update
to authenticated
using (
  bucket_id = 'community-music'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'community-music'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE: xoá tệp của chính mình.
drop policy if exists "Users delete their own community music" on storage.objects;
create policy "Users delete their own community music"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'community-music'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Bảng metadata: cũng cần SELECT cho insert(...).select() phía client.
alter table public.published_tracks enable row level security;
grant select on public.published_tracks to anon, authenticated;
grant insert, delete on public.published_tracks to authenticated;

drop policy if exists "Anyone can browse published music" on public.published_tracks;
create policy "Anyone can browse published music"
on public.published_tracks for select
to anon, authenticated
using (true);

drop policy if exists "Users publish their own music" on public.published_tracks;
create policy "Users publish their own music"
on public.published_tracks for insert
to authenticated
with check (uploader_id = auth.uid());
