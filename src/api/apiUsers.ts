import { supabase } from "@/lib/supabase"
import type { CreateUserInput, UserProfile, UserRole } from "@/types/database"

/**
 * Create a new user (agent or manager) WITHOUT signing them in.
 *
 * supabase.auth.signUp() implicitly signs the new user in, which swaps
 * the current admin's session for the new account — making the admin
 * "become" the user they just created. To prevent that, we snapshot the
 * admin's session before sign-up and restore it immediately after.
 */
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
    throw new Error(error.message)
  }

  // 3. Restore the admin's session — this is the line that fixes the swap.
  const { error: restoreError } = await supabase.auth.setSession({
    access_token: adminSession.access_token,
    refresh_token: adminSession.refresh_token,
  })

  if (restoreError) {
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

  if (error) throw new Error(error.message)
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
    throw new Error(error.message)
  }
  return data
}
