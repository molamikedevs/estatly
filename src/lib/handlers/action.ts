import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { ZodError, type ZodSchema } from "zod"
import {
  RequestError,
  UnauthorizedError,
  ValidationError,
} from "../http-errors"

type ActionOptions<T> = {
  params?: T
  schema?: ZodSchema<T>
  authorize?: boolean
}

type ActionResult<T> =
  | ValidationError
  | UnauthorizedError
  | RequestError
  | { params: T | undefined; session: Session | null }

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>): Promise<ActionResult<T>> {
  // 1. Validation
  if (params && schema) {
    try {
      schema.parse(params)
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        )
      }
      return new RequestError(400, "Schema validation failed")
    }
  }

  // 2. Authorization
  let session: Session | null = null

  if (authorize) {
    const {
      data: { session: supabaseSession },
    } = await supabase.auth.getSession()

    if (!supabaseSession) {
      return new UnauthorizedError()
    }
    session = supabaseSession
  }

  // return session and params
  return { params, session }
}

export default action
