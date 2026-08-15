import { ZodError } from "zod"
import { RequestError, ValidationError } from "../https-error"

interface ErrorResponse {
  message: string
  status: number
  errors?: Record<string, string[]>
}

function formatResponse({ message, errors, status }: ErrorResponse) {
  return {
    error: {
      message,
      details: errors,
    },
    status,
  }
}

export default function handleError(error: unknown) {
  if (error instanceof RequestError) {
    return formatResponse({
      message: error.message,
      status: error.statusCode,
      errors: error.errors,
    })
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    )

    return formatResponse({
      message: validationError.message,
      status: validationError.statusCode,
      errors: validationError.errors,
    })
  }

  if (error instanceof Error) {
    return formatResponse({
      message: error.message,
      status: 500,
    })
  }

  return formatResponse({
    message: "An unexpected error occurred",
    status: 500,
  })
}
