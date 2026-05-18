import { profileSchema } from "@/lib/validation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { z } from "zod"

export type ProfileFormValues = z.infer<typeof profileSchema>

export type UserRole = "admin" | "manager" | "agent"

export interface UserProfile {
  id: number
  user_id: string
  role: UserRole
  full_name: string
  email: string
  phone?: string
  avatar?: string
  bio?: string
  specialization?: string
  is_active: boolean
  created_at: string
}

export interface AuthUser extends SupabaseUser {
  user_profile?: UserProfile
}

export interface UserLogin {
  email: string
  password: string
}
