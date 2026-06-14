import type { User as SupabaseUser } from "@supabase/supabase-js"

// ─── Enums / Unions ───────────────────────────────────

export type UserRole = "admin" | "manager" | "agent"

export type ListingType = "rent" | "sale"

/** Roles that can be created in the app. Admin is the actor, never created. */
export type CreatableRole = "agent" | "manager"

export type ClientStatus = "active" | "closed-won" | "closed-lost" | "inactive"

export type PropertySort =
  | "newest"
  | "oldest"
  | "price-desc"
  | "price-asc"
  | "views-desc"

export type PropertyType =
  | "apartment"
  | "villa"
  | "townhouse"
  | "penthouse"
  | "studio"
  | "office"
  | "land"

export type PropertyStatus =
  | "pending-approval"
  | "published"
  | "rented"
  | "sold"
  | "under-offer"

export type ViewingStatus =
  | "scheduled"
  | "completed"
  | "cancelled"
  | "no-show"
  | "offer-made"

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

// ─── Create Agent ─────────────────────────────────────────
export interface CreateUserInput {
  full_name: string
  email: string
  password: string
  role: Exclude<UserRole, "admin">
}

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

export interface ClientAgent {
  full_name: string
  avatar: string | null
  email: string
}

export interface Client {
  id: number
  created_at: string
  full_name: string
  email: string
  phone: string | null
  nationality: string | null
  budget_min: number | null
  budget_max: number | null
  preferred_type: string | null
  preferred_locations: string[] | null
  notes: string | null
  assigned_agent_id: string | null
  status: ClientStatus
  // Joined
  agent: ClientAgent | null
}

export interface PropertyFormProps {
  property?: Property
  onClose: () => void
}
export interface ViewingFormProps {
  viewing?: Viewing
  onClose: () => void
}
export interface ClientFormProps {
  client?: Client
  onClose: () => void
}

export interface Settings {
  id: number
  created_at: string
  name: string
  commission_rate: number
  default_currency: string
  contact_email: string | null
  contact_phone: string | null
}

export interface ViewingsQueryParams {
  filter: ViewingStatus | "all"
  sortBy: "soonest" | "latest"
  page: number
  search: string
}
export interface PropertiesQueryParams {
  filter: ListingType | "all"
  sortBy: PropertySort | "newest"
  page: number
  search: string
}

export interface DashboardStats {
  totalProperties: number
  totalViewings: number
  publishedCount: number
  pendingCount: number
  underOfferCount: number
  activeClients: number
  upcomingViewings: number
}
