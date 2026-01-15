/**
 * Abstract API Service Base Class
 *
 * Provides common HTTP functionality for all API services.
 * Each service inherits from this and defines its own endpoint prefix.
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import type { ApiError, RequestOptions } from '@/models'

// Re-export types for backward compatibility
export type { ApiError, ApiResponse, RequestOptions } from '@/models'

/**
 * Abstract base class for API services
 *
 * @example
 * class UserService extends ApiService {
 *   protected basePath = '/users'
 *
 *   async getUser(id: string) {
 *     return this.get<User>(`/${id}`)
 *   }
 * }
 */
export abstract class ApiService {
  /**
   * Axios instance shared across all services
   */
  protected static axiosInstance: AxiosInstance | null = null

  /**
   * Base path for this service's endpoints
   * Override in subclass: protected basePath = '/users'
   */
  protected abstract basePath: string

  /**
   * Base URL for all API requests
   */
  protected static readonly BASE_URL = '/api'

  /**
   * Default timeout in milliseconds
   */
  protected static readonly DEFAULT_TIMEOUT = 60000

  /**
   * Get or create the shared Axios instance
   */
  protected get axios(): AxiosInstance {
    if (!ApiService.axiosInstance) {
      ApiService.axiosInstance = axios.create({
        baseURL: ApiService.BASE_URL,
        timeout: ApiService.DEFAULT_TIMEOUT,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      // Add response interceptor for error handling
      ApiService.axiosInstance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => ApiService.handleErrorStatic(error)
      )
    }
    return ApiService.axiosInstance
  }

  /**
   * Static error handler for interceptor
   */
  private static handleErrorStatic(error: AxiosError): Promise<never> {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status || 500
    }

    if (error.response) {
      const data = error.response.data as Record<string, unknown>
      apiError.message = (data?.detail as string) || (data?.message as string) || error.message
      apiError.details = data
    } else if (error.request) {
      apiError.message = 'No response from server. Please check your connection.'
      apiError.code = 'NETWORK_ERROR'
    } else {
      apiError.message = error.message
      apiError.code = 'REQUEST_ERROR'
    }

    console.error('[ApiService] API Error:', apiError)
    return Promise.reject(apiError)
  }

  /**
   * Build the full endpoint path
   */
  protected buildUrl(endpoint: string = ''): string {
    // Remove leading slash from endpoint if basePath already has trailing
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${this.basePath}${cleanEndpoint === '/' ? '' : cleanEndpoint}`
  }

  /**
   * Handle API errors consistently
   */
  protected handleError(error: AxiosError): Promise<never> {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: error.response?.status || 500
    }

    if (error.response) {
      // Server responded with error
      const data = error.response.data as Record<string, unknown>
      apiError.message = (data?.detail as string) || (data?.message as string) || error.message
      apiError.details = data
    } else if (error.request) {
      // Request made but no response
      apiError.message = 'No response from server. Please check your connection.'
      apiError.code = 'NETWORK_ERROR'
    } else {
      // Error setting up request
      apiError.message = error.message
      apiError.code = 'REQUEST_ERROR'
    }

    console.error(`[${this.constructor.name}] API Error:`, apiError)
    return Promise.reject(apiError)
  }

  /**
   * GET request
   */
  protected async get<T>(
    endpoint: string = '',
    options: RequestOptions = {}
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      params: options.params,
      timeout: options.timeout,
      headers: options.headers
    }

    const response: AxiosResponse<T> = await this.axios.get(
      this.buildUrl(endpoint),
      config
    )
    return response.data
  }

  /**
   * POST request
   */
  protected async post<T, D = unknown>(
    endpoint: string = '',
    data?: D,
    options: RequestOptions = {}
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      timeout: options.timeout,
      headers: options.headers,
      params: options.params
    }

    const response: AxiosResponse<T> = await this.axios.post(
      this.buildUrl(endpoint),
      data,
      config
    )
    return response.data
  }

  /**
   * POST request with FormData (multipart/form-data)
   */
  protected async postForm<T>(
    endpoint: string = '',
    formData: FormData,
    options: RequestOptions = {}
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      timeout: options.timeout || 180000, // 3 min default for uploads
      headers: {
        'Content-Type': 'multipart/form-data',
        ...options.headers
      },
      params: options.params
    }

    const response: AxiosResponse<T> = await this.axios.post(
      this.buildUrl(endpoint),
      formData,
      config
    )
    return response.data
  }

  /**
   * PUT request
   */
  protected async put<T, D = unknown>(
    endpoint: string = '',
    data?: D,
    options: RequestOptions = {}
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      timeout: options.timeout,
      headers: options.headers,
      params: options.params
    }

    const response: AxiosResponse<T> = await this.axios.put(
      this.buildUrl(endpoint),
      data,
      config
    )
    return response.data
  }

  /**
   * PATCH request
   */
  protected async patch<T, D = unknown>(
    endpoint: string = '',
    data?: D,
    options: RequestOptions = {}
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      timeout: options.timeout,
      headers: options.headers,
      params: options.params
    }

    const response: AxiosResponse<T> = await this.axios.patch(
      this.buildUrl(endpoint),
      data,
      config
    )
    return response.data
  }

  /**
   * DELETE request
   */
  protected async delete<T>(
    endpoint: string = '',
    options: RequestOptions = {}
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      timeout: options.timeout,
      headers: options.headers,
      params: options.params
    }

    const response: AxiosResponse<T> = await this.axios.delete(
      this.buildUrl(endpoint),
      config
    )
    return response.data
  }
}

export default ApiService
