/**
 * Core Service Types
 */

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: unknown
}

export interface ApiResponse<T> {
  data: T
  status: number
  success: boolean
}

export interface RequestOptions {
  timeout?: number
  headers?: Record<string, string>
  params?: Record<string, unknown>
}
