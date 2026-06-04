import { supabase } from "@/lib/supabase"
import type { UserProfile } from "@/types/database"

export async function getManagersApi() {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("role", "manager")

  if (error) throw new Error(error.message)

  return data
}

export async function getManagerApi(userId: string): Promise<UserProfile> {
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
