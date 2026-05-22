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

export interface UpdateDataProps {
  full_name?: string
  password?: string
  avatar?: File
  bio?: string
  specialization?: string
  phone?: string
}

export interface CreateAgentFormValues {
  full_name: string
  email: string
  password: string
  role: Exclude<UserRole, "admin">
}

export type ListingType = "rent" | "sale"

export type PropertyType =
  | "apartment"
  | "villa"
  | "townhouse"
  | "penthouse"
  | "studio"
  | "office"
  | "land"

export type PropertyStatus = "published" | "draft" | "archived"

export interface PropertyAgent {
  full_name: string
  email: string
  avatar: string | null
}

export interface Property {
  id: number
  created_at: string
  title: string
  description: string
  listing_type: ListingType
  property_type: PropertyType
  price: number
  bedrooms: number
  bathrooms: number
  size_sqm: number
  city: string
  neighborhood: string
  address: string
  latitude?: number
  longitude?: number
  status: PropertyStatus
  features: string[]
  amenities: string[]
  main_image: string
  gallery_images: string[]
  year_built?: number
  furnished: boolean
  agent_id: string
  views_count: number
  // Joined agent data (from user_profiles via FK)
  agent?: PropertyAgent | null
}
