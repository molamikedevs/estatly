import { ForbiddenError, toRequestError } from "@/lib/errors"
import action from "@/lib/handler/action"
import { supabase } from "@/lib/supabase"
import { teamMemberSchema, type TeamMemberFormValues } from "@/lib/validation"
import type {
  CreatableRole,
  CreateUserInput,
  TeamMember,
  UserProfile,
} from "@/types/database"

// Admin creates a team member, then activates them with their role.
export async function createUserApi({
  full_name,
  email,
  password,
  role,
}: CreateUserInput) {
  // 1. signUp switches the session to the new user, so keep the admin's
  const { data: sessionData } = await supabase.auth.getSession()
  const adminSession = sessionData.session
  if (!adminSession)
    throw new Error("You must be signed in to add a team member")

  // 2. Create the account (the database makes it an inactive agent)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name } },
  })

  // 3. Switch back to the admin, whether signUp worked or not
  await supabase.auth.setSession({
    access_token: adminSession.access_token,
    refresh_token: adminSession.refresh_token,
  })

  if (error) throw toRequestError(error)
  if (!data.user) throw new Error("Account could not be created")

  // 4. As admin: give the role and activate
  const { error: activateError } = await supabase
    .from("user_profiles")
    .update({ role, is_active: true })
    .eq("user_id", data.user.id)

  if (activateError) throw toRequestError(activateError, "Team member")
}

// Each person plus their workload, in one request
export async function getTeamApi(role: CreatableRole): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select(
      `*,
       listings:properties!properties_agent_id_user_profiles_fkey(count),
       clients:clients!clients_assigned_agent_id_user_profiles_fkey(count),
       viewings:viewings!viewings_agent_id_user_profiles_fkey(count)`
    )
    .eq("role", role)
    // These filters apply to the counted rows, not to the people
    .eq("clients.status", "active")
    .eq("viewings.status", "scheduled")
    .gte("viewings.scheduled_at", new Date().toISOString())
    .order("full_name")

  if (error) throw toRequestError(error, "Team")

  // Without database types, Supabase guesses joins are arrays; counts come back as [{ count }]
  const rows = (data ?? []) as unknown as (UserProfile & {
    listings: { count: number }[]
    clients: { count: number }[]
    viewings: { count: number }[]
  })[]

  return rows.map(({ listings, clients, viewings, ...profile }) => ({
    ...profile,
    listing_count: listings[0]?.count ?? 0,
    active_client_count: clients[0]?.count ?? 0,
    upcoming_viewing_count: viewings[0]?.count ?? 0,
  }))
}

export async function updateTeamMemberApi({
  userId,
  values,
}: {
  userId: string
  values: TeamMemberFormValues
}) {
  const { params } = await action({ params: values, schema: teamMemberSchema })

  const { data, error } = await supabase
    .from("user_profiles")
    .update(params)
    .eq("user_id", userId)
    .select("id")

  if (error) throw toRequestError(error, "Team member")
  if (data.length === 0) {
    throw new ForbiddenError("Only admins can edit team members")
  }
}

// Deactivated people keep their records but lose all access (see get_user_role)
export async function setTeamMemberActiveApi({
  userId,
  isActive,
}: {
  userId: string
  isActive: boolean
}) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update({ is_active: isActive })
    .eq("user_id", userId)
    .select("id")

  if (error) throw toRequestError(error, "Team member")
  if (data.length === 0) {
    throw new ForbiddenError("Only admins can change access")
  }
}
