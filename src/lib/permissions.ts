import type { UserRole } from "@/types"

export const can = {
  // Properties
  createProperty: (role: UserRole) =>
    ["admin", "manager", "agent"].includes(role),
  editAnyProperty: (role: UserRole) => ["admin", "manager"].includes(role),
  deleteProperty: (role: UserRole) => ["admin", "manager"].includes(role),
  publishProperty: (role: UserRole) => ["admin", "manager"].includes(role),

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
