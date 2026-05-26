import type { User as SupabaseUser } from "@supabase/supabase-js"

// ─── Enums / Unions ───────────────────────────────────

export type UserRole = "admin" | "manager" | "agent"

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

// ─── User / Auth ──────────────────────────────────────

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

// ─── Property ─────────────────────────────────────────

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

export type GalleryImage = {
  id: string
  url: string
  file?: File
}

export type ViewingStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no-show"
  | "offer-made"

export interface ViewingProperty {
  title: string
  city: string
  neighborhood: string
  main_image: string | null
}

export interface ViewingClient {
  full_name: string
  email: string
  phone: string | null
}

export interface ViewingAgent {
  full_name: string
  email: string
  avatar: string | null
}

export interface Viewing {
  id: number
  created_at: string
  property_id: number
  client_id: number
  agent_id: string
  scheduled_at: string
  duration_minutes: number
  status: ViewingStatus
  notes: string | null
  feedback: string | null
  property: ViewingProperty | null
  client: ViewingClient | null
  agent: ViewingAgent | null
}

export type ClientStatus = "active" | "closed-won" | "closed-lost" | "inactive"

export interface Client {
  id: number
  created_at: string
  full_name: string
  email: string
  phone?: string
  nationality?: string
  budget_min?: number
  budget_max?: number
  preferred_type?: string
  preferred_locations?: string[]
  notes?: string
  assigned_agent_id?: string
  status: ClientStatus
}

export interface PropertyFormProps {
  property?: Property
  onClose: () => void
}
export interface ViewingFormProps {
  viewing?: Viewing
  onClose: () => void
}
