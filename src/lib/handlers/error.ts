import type { ErrorResponse } from "@/types/global"
import { ZodError } from "zod"
import { RequestError, ValidationError } from "../http-errors"

type ResponseType = "api" | "server"

function formatResponse(
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) {
  const responseContent: ErrorResponse = {
    success: false,
    error: {
      message,
      details: errors,
    },
  }

  return responseType === "api"
    ? Response.json(responseContent, { status })
    : { status, ...responseContent }
}

export function handleError(error: unknown, responseType: ResponseType) {
  if (error instanceof RequestError) {
    return formatResponse(
      responseType,
      error.statusCode,
      error.message,
      error.errors
    )
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    )

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    )
  }

  if (error instanceof Error) {
    return formatResponse(responseType, 500, error.message)
  }

  return formatResponse(responseType, 500, "An unexpected error occurred")
}
