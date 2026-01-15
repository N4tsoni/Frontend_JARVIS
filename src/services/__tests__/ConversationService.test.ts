/**
 * Tests for ConversationService
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { ConversationService } from '../conversation/ConversationService'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn((successFn) => successFn) },
      },
    })),
  },
}))

describe('ConversationService', () => {
  let service: ConversationService
  let mockAxiosInstance: ReturnType<typeof axios.create>

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the static axios instance
    ;(ConversationService as unknown as { axiosInstance: null }).axiosInstance = null
    service = new ConversationService()
    mockAxiosInstance = (service as unknown as { axios: ReturnType<typeof axios.create> }).axios
  })

  describe('create', () => {
    it('should create a new conversation', async () => {
      const mockResponse = {
        data: {
          conversation: {
            id: 'test-id-123',
            name: 'Test Conversation',
            created_at: '2026-01-15T12:00:00Z',
            updated_at: '2026-01-15T12:00:00Z',
          },
        },
      }

      vi.mocked(mockAxiosInstance.post).mockResolvedValueOnce(mockResponse)

      const result = await service.create({ name: 'Test Conversation' })

      expect(mockAxiosInstance.post).toHaveBeenCalledWith(
        '/conversations',
        { name: 'Test Conversation' },
        expect.any(Object)
      )
      expect(result.conversation.id).toBe('test-id-123')
    })

    it('should create conversation without name', async () => {
      const mockResponse = {
        data: {
          conversation: {
            id: 'test-id-456',
            name: 'Conversation 2026-01-15',
            created_at: '2026-01-15T12:00:00Z',
            updated_at: '2026-01-15T12:00:00Z',
          },
        },
      }

      vi.mocked(mockAxiosInstance.post).mockResolvedValueOnce(mockResponse)

      const result = await service.create()

      expect(mockAxiosInstance.post).toHaveBeenCalled()
      expect(result.conversation).toBeDefined()
      expect(result.conversation.id).toBe('test-id-456')
    })
  })

  describe('list', () => {
    it('should list conversations with default parameters', async () => {
      const mockResponse = {
        data: {
          conversations: [
            { id: '1', name: 'Conv 1', created_at: '2026-01-15T12:00:00Z', updated_at: '2026-01-15T12:00:00Z' },
            { id: '2', name: 'Conv 2', created_at: '2026-01-15T11:00:00Z', updated_at: '2026-01-15T11:00:00Z' },
          ],
          total: 2,
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.list()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/conversations',
        expect.objectContaining({
          params: { limit: 50, offset: 0 },
        })
      )
      expect(result.conversations).toHaveLength(2)
    })

    it('should list conversations with custom limit and offset', async () => {
      const mockResponse = {
        data: {
          conversations: [],
          total: 0,
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      await service.list(10, 20)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/conversations',
        expect.objectContaining({
          params: { limit: 10, offset: 20 },
        })
      )
    })
  })

  describe('getById', () => {
    it('should get conversation by id with messages by default', async () => {
      const mockResponse = {
        data: {
          id: 'test-id',
          name: 'Test Conv',
          created_at: '2026-01-15T12:00:00Z',
          updated_at: '2026-01-15T12:00:00Z',
          messages: [
            { id: 1, role: 'user', content: 'Hello' },
            { id: 2, role: 'assistant', content: 'Hi there!' },
          ],
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.getById('test-id')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/conversations/test-id',
        expect.any(Object)
      )
      expect(result.id).toBe('test-id')
      expect(result.messages).toHaveLength(2)
    })

    it('should get conversation without messages when specified', async () => {
      const mockResponse = {
        data: {
          id: 'test-id',
          name: 'Test Conv',
          messages: [],
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.getById('test-id', false)

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/conversations/test-id',
        expect.any(Object)
      )
      expect(result.id).toBe('test-id')
    })
  })

  describe('rename', () => {
    it('should rename a conversation', async () => {
      const mockResponse = {
        data: {
          id: 'test-id',
          name: 'New Name',
          updated_at: '2026-01-15T13:00:00Z',
        },
      }

      vi.mocked(mockAxiosInstance.patch).mockResolvedValueOnce(mockResponse)

      const result = await service.rename('test-id', { name: 'New Name' })

      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(
        '/conversations/test-id',
        { name: 'New Name' },
        expect.any(Object)
      )
      expect(result.name).toBe('New Name')
    })
  })

  describe('remove', () => {
    it('should delete a conversation', async () => {
      vi.mocked(mockAxiosInstance.delete).mockResolvedValueOnce({ data: {} })

      await service.remove('test-id')

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(
        '/conversations/test-id',
        expect.any(Object)
      )
    })
  })

  describe('getMessages', () => {
    it('should get messages for a conversation', async () => {
      const mockResponse = {
        data: [
          { id: 1, role: 'user', content: 'Hello', created_at: '2026-01-15T12:00:00Z' },
          { id: 2, role: 'assistant', content: 'Hi!', created_at: '2026-01-15T12:01:00Z' },
        ],
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.getMessages('test-id')

      expect(mockAxiosInstance.get).toHaveBeenCalledWith(
        '/conversations/test-id/messages',
        expect.any(Object)
      )
      expect(result).toHaveLength(2)
    })
  })

})
