import type { UserRole } from "@/types/database"

// UI permissions: decide which buttons each role sees.
// Page access is set in App.tsx (RoleProtected). The database
// (RLS policies and triggers) is what actually enforces every rule.
export const can = {
  // Properties
  createProperty: (role: UserRole) =>
    ["admin", "manager", "agent"].includes(role),

  // RLS: admin and manager can update any property, agents only their own
  editAnyProperty: (role: UserRole) => ["admin", "manager"].includes(role),

  // RLS: admin only
  deleteProperty: (role: UserRole) => role === "admin",

  // UI only: RLS lets agents update their own listing, status included.
  publishProperty: (role: UserRole) => ["admin", "manager"].includes(role),

  // Agents can set sale statuses (offer, sold, rented) on their own listings
  setSaleStatus: (role: UserRole) =>
    ["admin", "manager", "agent"].includes(role),
  // Clients
  viewAllClients: (role: UserRole) => ["admin", "manager"].includes(role),

  // Viewings
  viewAllViewings: (role: UserRole) => ["admin", "manager"].includes(role),

  // Agents page
  accessAgentsPage: (role: UserRole) => ["admin", "manager"].includes(role),
  manageAgents: (role: UserRole) => role === "admin",

  // Settings
  accessSettings: (role: UserRole) => role === "admin",
}
