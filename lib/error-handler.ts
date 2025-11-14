/**
 * Centralized error handling utilities
 */

import { NextResponse } from 'next/server'
import { logger } from './logger'

export interface ApiError {
  message: string
  statusCode: number
  code?: string
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage: string = 'An error occurred',
  defaultStatusCode: number = 500
): NextResponse {
  let message = defaultMessage
  let statusCode = defaultStatusCode

  if (error instanceof Error) {
    message = error.message
    logger.error('API Error:', error)
  } else {
    logger.error('Unknown error:', error)
  }

  return NextResponse.json(
    { error: message },
    { status: statusCode }
  )
}

/**
 * Handles Prisma errors
 */
export function handlePrismaError(error: unknown): NextResponse {
  if (error && typeof error === 'object' && 'code' in error) {
    const prismaError = error as { code: string; meta?: unknown }
    
    switch (prismaError.code) {
      case 'P2002':
        return createErrorResponse(
          error,
          'A record with this value already exists',
          409
        )
      case 'P2025':
        return createErrorResponse(
          error,
          'Record not found',
          404
        )
      default:
        return createErrorResponse(error, 'Database error', 500)
    }
  }

  return createErrorResponse(error)
}

