create table if not exists public.recommendation_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  event_type text not null check (event_type in ('impression', 'refresh')),
  source text not null default 'home',
  recommendations jsonb not null default '[]'::jsonb
    check (jsonb_typeof(recommendations) = 'array'),
  created_at timestamptz not null default now()
);

create index if not exists recommendation_logs_user_created_at_idx
  on public.recommendation_logs (user_id, created_at desc);

alter table public.recommendation_logs enable row level security;
grant insert on public.recommendation_logs to authenticated;

drop policy if exists "Users log their own recommendations" on public.recommendation_logs;
create policy "Users log their own recommendations"
on public.recommendation_logs for insert
to authenticated
with check (user_id = auth.uid());
