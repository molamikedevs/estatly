import { supabase, supabaseUrl } from "@/lib/supabase"
import type { AuthUser, UserLogin, UserProfile } from "@/types/database"
import type { UpdateDataProps } from "@/types/global"

export async function loginApi({ email, password }: UserLogin) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message)

  return data
}

export async function getCurrentUserApi(): Promise<AuthUser | null> {
  // Step 1: Check if there's an active session
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) return null

  // Step 2: Get the auth user
  const { data, error } = await supabase.auth.getUser()
  if (error) throw new Error(error.message)
  if (!data.user) return null

  // Step 3: Fetch their profile from user_profiles table
  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", data.user.id)
    .single<UserProfile>()

  if (profileError) {
    console.error("Profile fetch error:", profileError)
    // Return auth user without profile rather than failing
    return data.user as AuthUser
  }

  // Step 4: Return user with profile attached
  return {
    ...data.user,
    user_profile: profile,
  }
}

export async function updateProfileApi({
  full_name,
  password,
  avatar,
  bio,
  specialization,
  phone,
}: UpdateDataProps) {
  // Get current user ID
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No authenticated user")

  // ---- 1. Update password (auth concern) ----
  if (password) {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw new Error(error.message)
  }

  // ---- 2. Upload avatar to storage if provided ----
  let avatarUrl: string | undefined

  if (avatar) {
    // Sanitize filename to avoid issues with spaces, special chars
    const fileExt = avatar.name.split(".").pop()
    const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatar, { upsert: true })

    if (uploadError) throw new Error(uploadError.message)

    avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`
  }

  // ---- 3. Update user_profiles table with everything else ----
  const profileUpdate: Partial<UserProfile> = {}

  if (full_name !== undefined) profileUpdate.full_name = full_name
  if (bio !== undefined) profileUpdate.bio = bio
  if (specialization !== undefined)
    profileUpdate.specialization = specialization
  if (phone !== undefined) profileUpdate.phone = phone
  if (avatarUrl !== undefined) profileUpdate.avatar = avatarUrl

  // Only update if there's actually something to update
  if (Object.keys(profileUpdate).length > 0) {
    const { data: updatedProfile, error: profileError } = await supabase
      .from("user_profiles")
      .update(profileUpdate)
      .eq("user_id", user.id)
      .select()
      .single()

    if (profileError) throw new Error(profileError.message)

    return updatedProfile
  }

  // If nothing changed in the profile, just return current profile
  const { data: currentProfile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return currentProfile
}

export async function logoutApi() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message)
}
