export interface EmptyState {
  title: string
  message: string
  button?: { text: string; href: string }
}

export const DEFAULT_ERROR = {
  title: "Something went wrong",
  message: "Check your connection and try again.",
}

export const DEFAULT_EMPTY: EmptyState = {
  title: "Nothing here yet",
  message: "When there is something to show, it will appear here.",
}

// ─── Dashboard ────────────────────────────────────────

export const EMPTY_PENDING: EmptyState = {
  title: "Nothing waiting",
  message: "New listings from agents appear here for approval.",
}

export const EMPTY_UPCOMING_VIEWINGS: EmptyState = {
  title: "No viewings scheduled",
  message: "Upcoming viewings will appear here.",
  button: { text: "Go to viewings", href: "/viewings" },
}

export const EMPTY_LISTINGS_BY_STATUS: EmptyState = {
  title: "No listings yet",
  message: "Listings will appear here once they are added.",
  button: { text: "Go to properties", href: "/properties" },
}

export const EMPTY_CLIENTS_BY_STAGE: EmptyState = {
  title: "No clients yet",
  message: "Clients will appear here once they are added.",
  button: { text: "Go to clients", href: "/clients" },
}

// ─── Viewings ─────────────────────────────────────────

export const EMPTY_VIEWINGS: EmptyState = {
  title: "No viewings yet",
  message: "Schedule a viewing to see it here.",
}

export const EMPTY_VIEWINGS_FILTERED: EmptyState = {
  title: "No viewings match",
  message: "Try another status or search, or choose All to clear the filter.",
}

// ─── Clients ──────────────────────────────────────────

export const EMPTY_CLIENTS: EmptyState = {
  title: "No clients yet",
  message: "Add your first client to start your pipeline.",
}

export const EMPTY_STAGE: EmptyState = {
  title: "No clients here",
  message: "Move a client here from its menu.",
}

// ─── Properties ───────────────────────────────────────

export const EMPTY_PROPERTIES: EmptyState = {
  title: "No properties yet",
  message: "Add your first listing with the Add property button.",
}

export const EMPTY_PROPERTIES_FILTERED: EmptyState = {
  title: "No properties match",
  message: "Try another listing type or search.",
  // The bare route drops every filter
  button: { text: "Clear filters", href: "/properties" },
}

export const EMPTY_PROPERTY: EmptyState = {
  title: "Property not found",
  message: "This listing may have been removed, or the link is wrong.",
  button: { text: "Back to properties", href: "/properties" },
}

// ─── Team ─────────────────────────────────────────────

export const EMPTY_AGENTS: EmptyState = {
  title: "No agents yet",
  message: "Agents you create will appear here.",
}

export const EMPTY_MANAGERS: EmptyState = {
  title: "No managers yet",
  message: "Managers you create will appear here.",
}
