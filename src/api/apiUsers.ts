import { supabase } from "@/lib/supabase"
import type { CreateUserInput, UserProfile, UserRole } from "@/types/database"

//Create a new user (agent or manager) WITHOUT signing them in.

export async function createUserApi({
  full_name,
  email,
  password,
  role,
}: CreateUserInput) {
  // 1. Snapshot the admin's session BEFORE signUp swaps it.
  const { data: sessionData } = await supabase.auth.getSession()
  const adminSession = sessionData.session

  if (!adminSession) {
    throw new Error("You must be signed in to create a team member")
  }

  // 2. Create the new user. This swaps the active session to the new user.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name, avatar: "", role },
    },
  })

  if (error) {
    // Restore the admin even on failure, in case signUp partially mutated state.
    await supabase.auth.setSession({
      access_token: adminSession.access_token,
      refresh_token: adminSession.refresh_token,
    })
    throw new Error(
      `${role === "agent" ? "Agent was successfully created" : "Manager was successfully created"}`
    )
  }

  // 3. Restore the admin's session — this is the line that fixes the swap.
  const { error: restoreError } = await supabase.auth.setSession({
    access_token: adminSession.access_token,
    refresh_token: adminSession.refresh_token,
  })

  if (restoreError) {
    console.error("createUserApi:", error)
    throw new Error(
      "User created, but your session couldn't be restored. Please sign in again."
    )
  }

  return data
}

export async function getUsersByRoleApi(role: UserRole) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("role", role)

  if (error) {
    console.error("getUsersByRoleApi:", error)
    throw new Error("User role could not be loaded")
  }
  return data
}

export async function getUserApi(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("getUserApi error:", error)
    throw new Error("User could not be loaded")
  }
  return data
}
