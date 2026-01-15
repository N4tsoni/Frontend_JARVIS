/**
 * Tests for KGService
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { KGService } from '../kg/KGService'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn((successFn) => successFn) },
      },
    })),
  },
}))

describe('KGService', () => {
  let service: KGService
  let mockAxiosInstance: ReturnType<typeof axios.create>

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the static axios instance
    ;(KGService as unknown as { axiosInstance: null }).axiosInstance = null
    service = new KGService()
    mockAxiosInstance = (service as unknown as { axios: ReturnType<typeof axios.create> }).axios
  })

  describe('getStats', () => {
    it('should get graph statistics', async () => {
      const mockResponse = {
        data: {
          total_nodes: 150,
          total_relationships: 200,
          nodes_by_label: { Person: 50, Organization: 30, Location: 70 },
          relationships_by_type: { WORKS_AT: 40, LOCATED_IN: 60 },
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.getStats()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/kg/graph/stats', expect.any(Object))
      expect(result.total_nodes).toBe(150)
      expect(result.total_relationships).toBe(200)
    })
  })

  describe('getVisualization', () => {
    it('should get visualization data with default limit', async () => {
      const mockResponse = {
        data: {
          nodes: [{ id: '1', label: 'Node 1', type: 'Person' }],
          edges: [{ id: 'e1', source: '1', target: '2', type: 'KNOWS' }],
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.getVisualization()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/kg/graph/visualization',
        expect.objectContaining({
          params: { limit: 100 },
        })
      )
      expect(result.nodes).toHaveLength(1)
    })

    it('should get visualization data with custom limit', async () => {
      const mockResponse = {
        data: {
          nodes: [],
          edges: [],
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      await service.getVisualization(50)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/kg/graph/visualization',
        expect.objectContaining({
          params: { limit: 50 },
        })
      )
    })
  })

  describe('clearGraph', () => {
    it('should clear all graph data', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          message: 'Graph cleared successfully',
        },
      }

      vi.mocked(mockAxiosInstance.delete).mockResolvedValueOnce(mockResponse)

      const result = await service.clearGraph()

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/kg/graph/clear',
        expect.any(Object)
      )
      expect(result.status).toBe('success')
    })
  })

  describe('getHealth', () => {
    it('should get KG service health', async () => {
      const mockResponse = {
        data: {
          status: 'healthy',
          neo4j: { connected: true },
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.getHealth()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/kg/health', expect.any(Object))
      expect(result.status).toBe('healthy')
    })
  })

  describe('listUploadedFiles', () => {
    it('should list uploaded files', async () => {
      const mockResponse = {
        data: {
          count: 2,
          files: [
            { filename: 'doc1.pdf', size: 1024, uploaded_at: '2026-01-15T12:00:00Z' },
            { filename: 'doc2.pdf', size: 2048, uploaded_at: '2026-01-15T11:00:00Z' },
          ],
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.listUploadedFiles()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/kg/uploaded-files',
        expect.any(Object)
      )
      expect(result.count).toBe(2)
      expect(result.files).toHaveLength(2)
    })
  })

  describe('uploadAndProcess', () => {
    it('should upload and process a file', async () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const mockResponse = {
        data: {
          status: 'success',
          extraction: { entities_extracted: 10, relations_extracted: 5 },
          storage: { entities_stored: 10, relations_stored: 5 },
        },
      }

      vi.mocked(mockAxiosInstance.post).mockResolvedValueOnce(mockResponse)

      const result = await service.uploadAndProcess(mockFile, true, 'test-api-key')

      expect(mockAxiosInstance.post).toHaveBeenCalled()
      expect(result.status).toBe('success')
    })
  })

})
