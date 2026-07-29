import type { ErrorResponse } from "@/types/global"
import { ZodError } from "zod"
import { RequestError, ValidationError } from "../http-errors"

function formatResponse(
  status: number,
  message: string,
  errors?: Record<string, string[]>
): ErrorResponse {
  return {
    success: false,
    error: { message, details: errors },
    status,
  }
}

export default function handleError(error: unknown): ErrorResponse {
  if (error instanceof RequestError) {
    return formatResponse(error.statusCode, error.message, error.errors)
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    )
    return formatResponse(
      validationError.statusCode,
      validationError.message,
      validationError.errors
    )
  }

  if (error instanceof Error) {
    return formatResponse(500, error.message)
  }

  return formatResponse(500, "An unexpected error occurred")
}
