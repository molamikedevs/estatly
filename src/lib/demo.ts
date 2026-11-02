// Shared test accounts for recruiters. The password is public on purpose:
// the database protects these accounts (sql/03-demo-accounts.sql).
export const DEMO_ACCOUNTS = {
  admin: "admin-test@gmail.com",
  manager: "manager-test@gmail.com",
  agent: "agenttest@gmail.com",
}

// "admin" | "manager" | "agent", built from the object's keys
export type DemoRole = keyof typeof DEMO_ACCOUNTS

export const DEMO_PASSWORD: string = import.meta.env.VITE_DEMO_PASSWORD ?? ""

const DEMO_EMAILS: string[] = Object.values(DEMO_ACCOUNTS)

// Used to block password changes on the shared demo accounts
export function isDemoEmail(email?: string | null) {
  return DEMO_EMAILS.includes(email ?? "")
}
