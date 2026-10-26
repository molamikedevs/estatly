// Shared test accounts for recruiters. The password is public on purpose:
// the database protects these accounts (sql/03-demo-accounts.sql).
export const DEMO_ACCOUNTS = {
  admin: "admin-test@gmail.com",
  manager: "manager-test@gmail.com",
  agent: "agenttest@gmail.com",
}

export type DemoRole = keyof typeof DEMO_ACCOUNTS

export const DEMO_PASSWORD: string = import.meta.env.VITE_DEMO_PASSWORD ?? ""

const DEMO_EMAILS: string[] = Object.values(DEMO_ACCOUNTS)

export function isDemoEmail(email?: string | null) {
  return DEMO_EMAILS.includes(email ?? "")
}

// Turns ?demo=admin into a role, or null for anything else
export function getDemoRole(value: string | null): DemoRole | null {
  if (value === "admin" || value === "manager" || value === "agent") {
    return value
  }
  return null
}
