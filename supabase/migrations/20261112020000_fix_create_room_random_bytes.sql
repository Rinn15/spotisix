create or replace function public.create_room()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
    v_user uuid := auth.uid();
    v_code text;
    v_room_id uuid;
    v_name text;
begin
    if v_user is null then
        raise exception 'Bạn cần đăng nhập.';
    end if;

    if exists (
        select 1 from public.room_members
        where user_id = v_user and left_at is null
    ) then
        raise exception 'Bạn đang ở trong một phòng khác.';
    end if;

    v_name := coalesce(
        nullif(auth.jwt() -> 'user_metadata' ->> 'display_name', ''),
        nullif(auth.jwt() ->> 'email', ''),
        'Người nghe'
    );

    loop
        v_code := public.generate_room_code();

        insert into public.rooms(room_code, host_id)
        values (v_code, v_user)
        on conflict (room_code) do nothing
        returning id into v_room_id;

        exit when v_room_id is not null;
    end loop;

    insert into public.room_members(room_id, user_id, display_name, role)
    values (v_room_id, v_user, v_name, 'host');

    return jsonb_build_object(
        'success', true,
        'room_id', v_room_id,
        'room_code', v_code,
        'status', 'waiting',
        'member_count', 1,
        'max_members', 6,
        'invite_url', 'https://rinn15.github.io/spotisix/?room=' || v_code
    );
end;
$$;
