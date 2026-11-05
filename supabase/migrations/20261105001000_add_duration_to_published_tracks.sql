ALTER TABLE public.published_tracks
  ADD COLUMN IF NOT EXISTS duration_seconds integer NOT NULL DEFAULT 0;

UPDATE public.published_tracks
SET duration_seconds = 0
WHERE duration_seconds IS NULL;
