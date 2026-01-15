/**
 * Tests for HealthService
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { HealthService } from '../health/HealthService'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn((successFn) => successFn) },
      },
    })),
  },
}))

describe('HealthService', () => {
  let service: HealthService
  let mockAxiosInstance: ReturnType<typeof axios.create>

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the static axios instance
    ;(HealthService as unknown as { axiosInstance: null }).axiosInstance = null
    service = new HealthService()
    mockAxiosInstance = (service as unknown as { axios: ReturnType<typeof axios.create> }).axios
  })

  describe('check', () => {
    it('should call GET /health endpoint', async () => {
      const mockResponse = {
        data: {
          status: 'healthy',
          service: 'Jarvis API',
          version: '1.0.0',
          services: {
            neo4j: true,
            stt: true,
            tts: true,
            agent: true,
          },
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.check()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/health', expect.any(Object))
      expect(result).toEqual(mockResponse.data)
    })

    it('should return health status with all services', async () => {
      const mockResponse = {
        data: {
          status: 'healthy',
          service: 'Jarvis Voice Assistant API',
          version: '0.1.0',
          services: {
            neo4j: true,
            stt: true,
            tts: true,
            agent: true,
          },
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.check()

      expect(result.status).toBe('healthy')
      expect(result.services).toBeDefined()
      expect(result.services.neo4j).toBe(true)
    })
  })

})
