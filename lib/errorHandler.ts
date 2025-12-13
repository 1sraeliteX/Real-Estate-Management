import { AxiosError } from 'axios'

export interface AppError {
  message: string
  code?: string
  statusCode?: number
  details?: any
}

export class ErrorHandler {
  static handle(error: unknown): AppError {
    console.error('Error occurred:', error)

    // Axios errors (API calls)
    if (error instanceof AxiosError) {
      return {
        message: error.response?.data?.message || error.message || 'Network error occurred',
        code: error.code,
        statusCode: error.response?.status,
        details: error.response?.data
      }
    }

    // Validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return {
        message: error.message,
        code: 'VALIDATION_ERROR',
        statusCode: 400
      }
    }

    // Generic errors
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'GENERIC_ERROR',
        statusCode: 500
      }
    }

    // Unknown errors
    return {
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      statusCode: 500,
      details: error
    }
  }

  static logError(error: AppError, context?: string) {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      context,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details
      }
    }

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service (e.g., Sentry, LogRocket, etc.)
      console.error('Production Error:', logEntry)
    } else {
      console.error('Development Error:', logEntry)
    }
  }

  static isNetworkError(error: AppError): boolean {
    return error.code === 'NETWORK_ERROR' || error.statusCode === undefined
  }

  static isValidationError(error: AppError): boolean {
    return error.code === 'VALIDATION_ERROR' || error.statusCode === 400
  }

  static isAuthError(error: AppError): boolean {
    return error.statusCode === 401 || error.statusCode === 403
  }

  static isServerError(error: AppError): boolean {
    return (error.statusCode || 0) >= 500
  }
}

// Custom error classes
export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

// API Error Handler for Next.js API routes
export function handleApiError(error: unknown): Response {
  const appError = ErrorHandler.handle(error)
  ErrorHandler.logError(appError, 'API Route')
  
  return new Response(
    JSON.stringify({
      error: appError.message,
      code: appError.code,
      details: process.env.NODE_ENV === 'development' ? appError.details : undefined
    }),
    {
      status: appError.statusCode || 500,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}