/**
 * Health Service
 *
 * Handles health check operations for monitoring backend status.
 */

import { ApiService } from '../core'
import type { HealthCheckResponse } from '@/models'

/**
 * Service for health monitoring
 */
export class HealthService extends ApiService {
  protected basePath = ''

  /**
   * Check backend health status
   */
  async check(): Promise<HealthCheckResponse> {
    return super.get<HealthCheckResponse>('/health')
  }
}

// Export singleton instance
export const healthService = new HealthService()
export default healthService
