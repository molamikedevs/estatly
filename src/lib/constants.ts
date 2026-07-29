import { can } from "@/lib/permissions"
import type { UserRole } from "@/types/database"
import { Building2, Calendar, LayoutDashboard, Users } from "lucide-react"

export interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  visible: (role: UserRole) => boolean
}

export const PAGE_SIZE = 8
export const DESC_MAX = 2000
export const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"]
export const SEARCH_DEBOUNCE_MS = 400

export const workspaceItems: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    visible: () => true,
  },
  {
    to: "/properties",
    label: "Properties",
    icon: Building2,
    visible: () => true,
  },
  {
    to: "/agents",
    label: "Agents",
    icon: Users,
    visible: (role) => can.accessAgentsPage(role),
  },
  {
    to: "/viewings",
    label: "Viewings",
    icon: Calendar,
    visible: () => true,
  },
  {
    to: "/clients",
    label: "Clients",
    icon: Users,
    visible: () => true,
  },
]

export const propertyTypes = [
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "townhouse", label: "Townhouse" },
  { value: "penthouse", label: "Penthouse" },
  { value: "studio", label: "Studio" },
  { value: "office", label: "Office" },
  { value: "land", label: "Land" },
]

export const LISTING_TYPE_OPTIONS = [
  { value: "rent", label: "For rent" },
  { value: "sale", label: "For sale" },
]

export const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
]

export const ROLE_OPTIONS = [
  { value: "agent", label: "Agent" },
  { value: "manager", label: "Manager" },
]

export const durationOptions = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "45", label: "45 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
]

export const viewingStatusOptions = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no-show", label: "No show" },
]

export const CLIENT_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "closed-won", label: "Closed (won)" },
  { value: "closed-lost", label: "Closed (lost)" },
  { value: "inactive", label: "Inactive" },
]

export const currencyOptions = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "AED", label: "AED — UAE Dirham" },
]

export const DEFAULT_ERROR = {
  title: "Something went wrong",
  message: "Even our code has bad days. Give it another shot.",
}

export const EMPTY_PROPERTIES = {
  title: "No properties yet",
  message: "Add your first property to start building your portfolio.",
  button: { text: "Add property", href: "/properties/new" },
}

export const EMPTY_PROPERTIES_FILTERED = {
  title: "No matching properties",
  message: "Try adjusting your filters to see more listings.",
}

// lib/states.ts
export const EMPTY_VIEWINGS = {
  title: "No viewings scheduled",
  message: "Schedule your first property viewing to get started.",
  button: { text: "Schedule viewing", href: "/viewings/new" },
}

export const EMPTY_VIEWINGS_FILTERED = {
  title: "No matching viewings",
  message: "Try adjusting your filters to see more appointments.",
}

export const EMPTY_CLIENTS = { title: "No clients yet", message: "..." }
// etc. — one per route
