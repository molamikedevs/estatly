import { isAuthError, type PostgrestError } from "@supabase/supabase-js"

// ── Error classes ──────────────────────────────

export class RequestError extends Error {
  statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = "RequestError"
  }
}

export class ValidationError extends RequestError {
  constructor(message = "Some of the details are not valid") {
    super(400, message)
    this.name = "ValidationError"
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message = "Your session has ended. Please sign in again") {
    super(401, message)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends RequestError {
  constructor(message = "You do not have permission to do this") {
    super(403, message)
    this.name = "ForbiddenError"
  }
}

export class NotFoundError extends RequestError {
  constructor(resource = "Item") {
    super(404, `${resource} not found`)
    this.name = "NotFoundError"
  }
}

export class ConflictError extends RequestError {
  constructor(message = "This conflicts with existing data") {
    super(409, message)
    this.name = "ConflictError"
  }
}

// ── Supabase error → our classes ──────────────

function isPostgrestError(error: unknown): error is PostgrestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "details" in error &&
    "hint" in error
  )
}

// Use in every API function: if (error) throw toRequestError(error, "Property")
export function toRequestError(
  error: unknown,
  resource = "Item"
): RequestError {
  if (error instanceof RequestError) return error

  // Supabase Auth: sign in, sign out, password changes
  if (isAuthError(error)) {
    if (error.code === "invalid_credentials") {
      return new UnauthorizedError("Email or password is incorrect")
    }
    if (error.status === 429) {
      return new RequestError(
        429,
        "Too many attempts. Wait a minute and try again"
      )
    }
    if (error.name === "AuthSessionMissingError") {
      return new UnauthorizedError()
    }
    return new RequestError(error.status ?? 400, error.message)
  }

  // Supabase database: Postgres and PostgREST error codes
  if (isPostgrestError(error)) {
    const name = resource.toLowerCase()

    switch (error.code) {
      case "PGRST116": // .single() found no row
        return new NotFoundError(resource)
      case "42501": // blocked by RLS on insert or update
        return new ForbiddenError()
      case "23505": // unique value already used
        return new ConflictError(`This ${name} already exists`)
      case "23503": // still referenced by other rows
        return new ConflictError(`This ${name} is linked to other records`)
      case "23502": // required column missing
      case "23514": // CHECK rule failed
      case "22P02": // wrong value type
        return new ValidationError()
    }
  }

  if (error instanceof Error) return new RequestError(500, error.message)

  return new RequestError(500, "Something went wrong. Please try again")
}

// For toasts: toast.error(getErrorMessage(error))
export function getErrorMessage(error: unknown) {
  return toRequestError(error).message
}

// React Query: do not retry errors that will fail again (401, 403, 404...)
export function shouldRetry(failureCount: number, error: unknown) {
  if (error instanceof RequestError && error.statusCode < 500) return false
  return failureCount < 2
}
