-- =====================================================================
-- 01 Security audit                          Run on: 2026-10-26 (done)
--
-- What this fixes and why:
-- 1. Managers could delete properties. Deleting is an admin job.
-- 2. A leftover policy let managers edit agent profiles. Team
--    management is admin only.
-- 3. Any signed-in user could overwrite or delete ANYONE's avatar.
--    Storage records owner_id on upload, so we check it.
-- 4. Deactivated users could still upload property images.
--    get_user_role() returns null for inactive users.
-- 5. SECURITY DEFINER functions run with the owner's rights and were
--    callable by signed-out visitors through /rest/v1/rpc.
--    Trigger functions are never called through the API at all.
-- 6. protect_profile_columns had no fixed search_path, and two old
--    dashboard functions were no longer used by the app.
--
-- Safe to re-run: every drop uses "if exists".
-- =====================================================================

-- 1. Only admins delete properties
drop policy if exists "Admin and manager can delete property" on public.properties;
drop policy if exists "Only admins can delete properties" on public.properties;
create policy "Only admins can delete properties"
  on public.properties for delete to authenticated
  using ((select public.get_user_role()) = 'admin');

-- 2. Team management is admin only
drop policy if exists "Managers can update agent profiles" on public.user_profiles;

-- 3. Avatars: anyone active can upload, only the owner can replace or delete
drop policy if exists "avatars_insert" on storage.objects;
drop policy if exists "avatars_update" on storage.objects;
drop policy if exists "avatars_delete" on storage.objects;

create policy "avatars_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (select public.get_user_role()) is not null);

create policy "avatars_update" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text);

create policy "avatars_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and owner_id = (select auth.uid())::text);

-- 4. Property images: only active users can upload
drop policy if exists "Authenticated can upload property images" on storage.objects;
drop policy if exists "Active users can upload property images" on storage.objects;
create policy "Active users can upload property images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'property-images' and (select public.get_user_role()) is not null);

-- 5. Nobody signed out can call these functions
revoke execute on function public.get_user_role() from public, anon;
revoke execute on function public.increment_property_views(bigint) from public, anon;

-- Trigger functions are never called through the API
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.protect_profile_columns() from public, anon, authenticated;

-- 6. Fixed search_path, drop unused functions
alter function public.protect_profile_columns() set search_path = public;
drop function if exists public.properties_by_status();
drop function if exists public.clients_by_stage();

-- Still flagged by the advisor ON PURPOSE (accepted):
-- get_user_role() and increment_property_views() are callable by
-- signed-in users. RLS needs the first, the app needs the second, and
-- get_user_role() only ever returns the caller's own role.
