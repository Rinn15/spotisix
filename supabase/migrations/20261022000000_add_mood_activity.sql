ALTER TABLE public.published_tracks
ADD COLUMN IF NOT EXISTS mood TEXT,
ADD COLUMN IF NOT EXISTS activity TEXT;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'published_tracks'
  AND column_name IN ('mood', 'activity');

