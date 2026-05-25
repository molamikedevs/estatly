import { supabase } from "@/lib/supabase"
import type { UserRole } from "@/types/database"

export async function createAgentApi({
  full_name,
  email,
  password,
  role = "agent",
}: {
  full_name: string
  email: string
  password: string
  role?: UserRole
}) {
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

  if (error) throw new Error(error.message)

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
