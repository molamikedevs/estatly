import { toRequestError } from "@/lib/errors"
import action from "@/lib/handler/action"
import { supabase } from "@/lib/supabase"
import {
  forgotPasswordSchema,
  passwordSchema,
  type ForgotPasswordValues,
  type PasswordFormValues,
} from "@/lib/validation"
import type { AuthUser, UserLogin, UserProfile } from "@/types/database"

export async function loginApi({ email, password }: UserLogin) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // invalid_credentials becomes "Email or password is incorrect"
  if (error) throw toRequestError(error)

  // Deactivated accounts are signed straight back out
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_active")
    .eq("user_id", data.user.id)
    .single()

  if (!profile?.is_active) {
    await supabase.auth.signOut()
    throw new Error("Your account is not active. Contact your admin")
  }

  return data
}

export async function logoutApi() {
  const { error } = await supabase.auth.signOut()
  if (error) throw toRequestError(error)
}

// The signed-in user with their profile row attached
export async function getCurrentUserApi(): Promise<AuthUser | null> {
  const { data: session } = await supabase.auth.getSession()
  if (!session.session) return null

  const { data, error } = await supabase.auth.getUser()
  if (error) throw toRequestError(error)
  if (!data.user) return null

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", data.user.id)
    .single<UserProfile>()

  if (profileError) throw toRequestError(profileError, "Profile")

  return { ...data.user, user_profile: profile }
}

// Emails a one-time link that opens /reset-password
export async function sendPasswordResetApi(values: ForgotPasswordValues) {
  const { params } = await action({
    params: values,
    schema: forgotPasswordSchema,
  })

  const { error } = await supabase.auth.resetPasswordForEmail(params.email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  if (error) throw toRequestError(error)
}

// Used by the Profile page and by the reset link page
export async function changePasswordApi(values: PasswordFormValues) {
  const { params } = await action({ params: values, schema: passwordSchema })

  const { error } = await supabase.auth.updateUser({
    password: params.password,
  })
  if (error) throw toRequestError(error)
}
