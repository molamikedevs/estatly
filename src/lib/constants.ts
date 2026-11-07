import type {
  ClientStatus,
  PropertyStatus,
  ViewingStatus,
} from "@/types/database"

export const PAGE_SIZE = 8
export const DESC_MAX = 2000
export const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h"]
export const SEARCH_DEBOUNCE_MS = 400

// Pages that show the search box in the header
export const SEARCH_PLACEHOLDERS: Record<string, string> = {
  "/properties": "Search by property title or city",
  "/viewings": "Search by property title or city",
}

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

// One list for the filter, the status menu and anywhere else
export const viewingStatusOptions: { value: ViewingStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "offer-made", label: "Offer made" },
  { value: "no-show", label: "No show" },
  { value: "cancelled", label: "Cancelled" },
]

// A viewing can be moved if it has not happened yet, or the client did not come
export const RESCHEDULABLE_STATUSES: ViewingStatus[] = ["scheduled", "no-show"]

// Pipeline order and colors: the clients board and the dashboard chart
export const CLIENT_STAGES: {
  status: ClientStatus
  label: string
  color: string
}[] = [
  { status: "active", label: "Active", color: "var(--primary)" },
  { status: "closed-won", label: "Closed, won", color: "var(--success)" },
  { status: "closed-lost", label: "Closed, lost", color: "var(--destructive)" },
  { status: "inactive", label: "Inactive", color: "var(--muted-foreground)" },
]

// Listing lifecycle order and colors: the dashboard chart
export const PROPERTY_STATUSES: {
  status: PropertyStatus
  label: string
  color: string
}[] = [
  {
    status: "pending-approval",
    label: "Pending approval",
    color: "var(--status-pending)",
  },
  { status: "published", label: "Published", color: "var(--status-published)" },
  {
    status: "under-offer",
    label: "Under offer",
    color: "var(--status-under-offer)",
  },
  { status: "rented", label: "Rented", color: "var(--status-rented)" },
  { status: "sold", label: "Sold", color: "var(--status-sold)" },
]

export const PROPERTY_STATUS: Record<
  PropertyStatus,
  { label: string; tone: string }
> = {
  published: { label: "Published", tone: "text-success" },
  "pending-approval": { label: "Pending approval", tone: "text-warning" },
  "under-offer": { label: "Under offer", tone: "text-info" },
  sold: { label: "Sold", tone: "text-chart-1" },
  rented: { label: "Rented", tone: "text-chart-4" },
}

// Viewing lengths in minutes, as strings for select fields
export const DURATIONS = ["15", "30", "45", "60", "90"] as const

// Record forces a label for every duration: add one above and
// TypeScript errors here until it has a label
const DURATION_LABELS: Record<(typeof DURATIONS)[number], string> = {
  "15": "15 minutes",
  "30": "30 minutes",
  "45": "45 minutes",
  "60": "1 hour",
  "90": "1.5 hours",
}

export const durationOptions = DURATIONS.map((value) => ({
  value,
  label: DURATION_LABELS[value],
}))

// "latest" and "soonest" stay as URL values, so old links keep working
export const viewingSortOptions = [
  { value: "latest", label: "Date: newest first" },
  { value: "soonest", label: "Date: oldest first" },
]
