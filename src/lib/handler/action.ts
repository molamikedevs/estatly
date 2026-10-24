import { UnauthorizedError, ValidationError } from "@/lib/errors"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import type { z } from "zod"

// Browser-side guard for API functions.
// It shapes and checks data before it is sent. The database (constraints + RLS)
// is what actually enforces the rules, because the browser can be bypassed.

interface ActionOptions<S extends z.ZodType> {
  params: unknown
  schema: S
  authorize?: boolean
}

export default async function action<S extends z.ZodType>({
  params,
  schema,
  authorize = false,
}: ActionOptions<S>): Promise<{ params: z.infer<S>; user: User | null }> {
  // 1. Validate, and use the schema's output (numbers, nulls, trimmed strings)
  const parsed = schema.safeParse(params)

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]
    throw new ValidationError(firstIssue?.message)
  }

  // 2. Signed-in user, for owner columns like agent_id
  let user: User | null = null

  if (authorize) {
    const { data } = await supabase.auth.getSession()
    if (!data.session) throw new UnauthorizedError()
    user = data.session.user
  }

  return { params: parsed.data, user }
}
