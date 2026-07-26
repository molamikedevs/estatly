export class RequestError extends Error {
  statusCode: number
  errors?: Record<string, string[]>

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>
  ) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
    this.name = "RequestError"
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatFieldErrors(fieldErrors)
    super(400, message, fieldErrors)
    this.errors = fieldErrors
    this.name = "ValidationError"
  }

  static formatFieldErrors(errors: Record<string, string[]>): string {
    const formattedMessage = Object.entries(errors).map(([field, messages]) => {
      const fieldName = field.charAt(0).toUpperCase() + field.slice(1)
      const firstMessage = messages[0] ?? ""

      if (
        firstMessage === "Required" ||
        firstMessage.toLowerCase().includes("received undefined")
      ) {
        return `${fieldName} is required`
      }
      return messages.join(" and ")
    })

    return formattedMessage.join(", ")
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string = "NotFoundError") {
    super(404, `${resource} not found!`)
    this.name = "NotFoundError"
  }
}
export class ForbiddenError extends RequestError {
  constructor(message: string = "ForbiddenError") {
    super(403, message)
    this.name = "ForbiddenError"
  }
}
export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    super(401, message)
    this.name = "Unauthorized"
  }
}
