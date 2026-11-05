ALTER TABLE public.recommendation_logs
  DROP CONSTRAINT IF EXISTS recommendation_logs_event_type_check;

ALTER TABLE public.recommendation_logs
  ADD CONSTRAINT recommendation_logs_event_type_check
  CHECK (event_type IN ('impression', 'refresh', 'play'));

ALTER TABLE public.recommendation_logs
  ADD CONSTRAINT recommendation_logs_source_check
  CHECK (source IN ('home', 'player', 'smart'));

CREATE INDEX IF NOT EXISTS recommendation_logs_user_source_created_at_idx
  ON public.recommendation_logs (user_id, source, created_at DESC);

GRANT SELECT ON public.recommendation_logs TO authenticated;

DROP POLICY IF EXISTS "Users read their own recommendation history" ON public.recommendation_logs;
CREATE POLICY "Users read their own recommendation history"
ON public.recommendation_logs FOR SELECT
TO authenticated
USING (user_id = auth.uid());
