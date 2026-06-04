import { supabase } from "@/lib/supabase"
import type { CreateAgentInput, UserProfile } from "@/types/database"

export async function createAgentApi({
  full_name,
  email,
  password,
  role,
}: CreateAgentInput) {
  // 1. Snapshot the admin's session.
  const { data: sessionData } = await supabase.auth.getSession()
  const adminSession = sessionData.session

  if (!adminSession) {
    throw new Error("You must be signed in to create an agent")
  }

  // 2. Create the new user. This will swap the active session.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name,
        avatar: "",
        role,
      },
    },
  })

  if (error) {
    // Best-effort: try to restore the admin even on failure, in case
    // signUp partially mutated the session.
    await supabase.auth.setSession({
      access_token: adminSession.access_token,
      refresh_token: adminSession.refresh_token,
    })
    throw new Error(error.message)
  }

  // 3. Restore the admin's session.
  const { error: restoreError } = await supabase.auth.setSession({
    access_token: adminSession.access_token,
    refresh_token: adminSession.refresh_token,
  })

  if (restoreError) {
    // We created the user but couldn't restore the admin. Surface it
    // so the UI can prompt a re-login rather than silently swap them.
    throw new Error(
      `Agent created, but your admin session couldn't be restored. Please sign in again.`
    )
  }

  return data
}

export async function getAgentsApi() {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("role", "agent")

  if (error) throw new Error(error.message)

  return data
}
export async function getAgentApi(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("getAgentApi error:", error)
    throw new Error("Agent could not be loaded")
  }
  return data
}
