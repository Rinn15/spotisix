create or replace function public.generate_room_code()
returns text
language sql
volatile
set search_path = pg_catalog
as $$
  select upper(
    substr(
      replace(pg_catalog.gen_random_uuid()::text, '-', ''),
      1,
      6
    )
  );
$$;
