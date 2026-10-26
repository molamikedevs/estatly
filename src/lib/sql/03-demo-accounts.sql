-- =====================================================================
-- 03 Demo accounts                            Run on: ____________
--
-- The demo password is public (it ships in the frontend), so anyone can
-- sign in as these three accounts. They keep their role's full
-- permissions. Only the ACCOUNTS themselves are protected, so one
-- visitor can never lock out the next one:
-- 1. All three share one password (the same as VITE_DEMO_PASSWORD).
-- 2. Their role, active status and email can't be changed.
-- 3. Their password and email can't be changed through Supabase Auth.
--
-- Run step 1 BEFORE step 3 exists. To change the demo password later:
--   drop trigger protect_demo_logins on auth.users;  then step 1, then step 3.
-- If demo sign-in ever breaks, the first thing to try is dropping that trigger.
-- =====================================================================

-- 1. One shared password. Replace YOUR_DEMO_PASSWORD in the SQL editor only,
--    never in this file.
update auth.users
set encrypted_password = extensions.crypt('YOUR_DEMO_PASSWORD', extensions.gen_salt('bf'))
where email in ('admin-test@gmail.com', 'manager-test@gmail.com', 'agenttest@gmail.com');

-- 2. Demo profiles: role, active status and email are locked
create or replace function public.protect_demo_profiles()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.email in ('admin-test@gmail.com', 'manager-test@gmail.com', 'agenttest@gmail.com')
     and (new.role is distinct from old.role
          or new.is_active is distinct from old.is_active
          or new.email is distinct from old.email) then
    raise exception 'Demo accounts cannot be deactivated or changed';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_demo_profiles on public.user_profiles;
create trigger protect_demo_profiles
  before update on public.user_profiles
  for each row execute function public.protect_demo_profiles();

-- 3. Demo logins: password and email are locked
create or replace function public.protect_demo_logins()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.email in ('admin-test@gmail.com', 'manager-test@gmail.com', 'agenttest@gmail.com')
     and (new.encrypted_password is distinct from old.encrypted_password
          or new.email is distinct from old.email) then
    raise exception 'Demo account logins cannot be changed';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_demo_logins on auth.users;
create trigger protect_demo_logins
  before update on auth.users
  for each row execute function public.protect_demo_logins();

-- Trigger functions are never called through the API
revoke execute on function public.protect_demo_profiles() from public, anon, authenticated;
revoke execute on function public.protect_demo_logins() from public, anon, authenticated;
