-- =====================================================================
-- 02 Performance                              Run on: ____________
--
-- Same permissions as before. Only HOW the database checks them changes.
--
-- 1. auth.uid() and get_user_role() written plainly in a policy run once
--    PER ROW. Wrapped in (select ...) they run once PER QUERY.
-- 2. clients and viewings each had an ALL policy plus a SELECT policy
--    with the same rule. ALL already covers SELECT, so the duplicate
--    only made Postgres check the same thing twice.
-- 3. user_profiles had two UPDATE policies (own profile, admin).
--    Merged into one. The protect_profile_columns trigger still stops
--    non-admins changing role, is_active and email.
-- 4. Foreign keys without an index make joins and deletes slow.
--    viewings.client_id and viewings.property_id get one.
--    idx_user_profiles_user_id duplicated the unique index on user_id.
--
-- Safe to re-run.
-- =====================================================================

-- 1. Wrap function calls so they run once per query
alter policy "Only admins can update agency" on public.agencies
  using ((select public.get_user_role()) = 'admin')
  with check ((select public.get_user_role()) = 'admin');

alter policy "Agents can manage clients" on public.clients
  using ((select public.get_user_role()) in ('admin', 'manager')
         or assigned_agent_id = (select auth.uid()))
  with check ((select public.get_user_role()) in ('admin', 'manager')
         or assigned_agent_id = (select auth.uid()));

alter policy "Agents can create properties" on public.properties
  with check ((select public.get_user_role()) in ('admin', 'manager', 'agent')
         and agent_id = (select auth.uid()));

alter policy "Agents can update own properties" on public.properties
  using (agent_id = (select auth.uid())
         or (select public.get_user_role()) in ('admin', 'manager'))
  with check (agent_id = (select auth.uid())
         or (select public.get_user_role()) in ('admin', 'manager'));

alter policy "Users can view all profiles" on public.user_profiles
  using ((select public.get_user_role()) in ('admin', 'manager')
         or user_id = (select auth.uid()));

alter policy "Agents can manage own viewings" on public.viewings
  using (agent_id = (select auth.uid())
         or (select public.get_user_role()) in ('admin', 'manager'))
  with check (agent_id = (select auth.uid())
         or (select public.get_user_role()) in ('admin', 'manager'));

alter policy "Authenticated can delete property images" on storage.objects
  using (bucket_id = 'property-images'
         and (select public.get_user_role()) in ('admin', 'manager', 'agent'));

-- 2. Remove duplicate SELECT policies (the ALL policies cover reading)
drop policy if exists "Users can view clients based on role" on public.clients;
drop policy if exists "Users can view viewings based on role" on public.viewings;

-- 3. One UPDATE policy on user_profiles
drop policy if exists "Users can update own profile" on public.user_profiles;
drop policy if exists "Admins can update any profile" on public.user_profiles;
drop policy if exists "Own profile or admin can update" on public.user_profiles;
create policy "Own profile or admin can update" on public.user_profiles
  for update to authenticated
  using (user_id = (select auth.uid()) or (select public.get_user_role()) = 'admin')
  with check (user_id = (select auth.uid()) or (select public.get_user_role()) = 'admin');

-- 4. Indexes
create index if not exists idx_viewings_client_id on public.viewings (client_id);
create index if not exists idx_viewings_property_id on public.viewings (property_id);
drop index if exists public.idx_user_profiles_user_id;

-- Not changed ON PURPOSE:
-- idx_properties_city and idx_properties_price show as "unused" only
-- because the table is tiny. They help the property filters as data grows.
