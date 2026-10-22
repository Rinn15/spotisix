ALTER TABLE public.published_tracks
ADD COLUMN IF NOT EXISTS mood TEXT,
ADD COLUMN IF NOT EXISTS activity TEXT;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'published_tracks'
  AND column_name IN ('mood', 'activity');
UPDATE public.published_tracks

  SET mood = 'chill',
      activity = 'Học tập'
WHERE id = (
    SELECT id
    FROM public.published_tracks
    ORDER BY created_at DESC
    LIMIT 1
);

SELECT id, title, artist, mood, activity
FROM public.published_tracks
ORDER BY created_at DESC;
