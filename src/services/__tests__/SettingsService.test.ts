/**
 * Tests for SettingsService
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { SettingsService } from '../settings/SettingsService'

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn(),
      put: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn((successFn) => successFn) },
      },
    })),
  },
}))

describe('SettingsService', () => {
  let service: SettingsService
  let mockAxiosInstance: ReturnType<typeof axios.create>

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset the static axios instance
    ;(SettingsService as unknown as { axiosInstance: null }).axiosInstance = null
    service = new SettingsService()
    mockAxiosInstance = (service as unknown as { axios: ReturnType<typeof axios.create> }).axios
  })

  describe('fetch', () => {
    it('should fetch user settings', async () => {
      const mockResponse = {
        data: {
          kgPipeline: {
            useV3: true,
            useMultiPass: true,
            useGraphAware: false,
            useIncrementalResolution: true,
            useHierarchicalChunking: true,
          },
          entityLinking: {
            enabled: false,
            autoRun: false,
            useWikidata: true,
            useDbpedia: true,
            threshold: 70,
          },
          llmModel: 'anthropic/claude-3.5-sonnet',
          llmMaxTokens: 500,
          apiKeys: {
            openrouter: '',
          },
          sttProvider: 'groq',
          ttsProvider: 'edge',
          ttsVoice: 'fr-FR-DeniseNeural',
        },
      }

      vi.mocked(mockAxiosInstance.get).mockResolvedValueOnce(mockResponse)

      const result = await service.fetch()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/settings', expect.any(Object))
      expect(result.kgPipeline.useV3).toBe(true)
      expect(result.llmModel).toBe('anthropic/claude-3.5-sonnet')
    })
  })

  describe('save', () => {
    it('should save user settings', async () => {
      const settingsToSave = {
        kgPipeline: {
          useV3: true,
          useMultiPass: false,
          useGraphAware: true,
          useIncrementalResolution: false,
          useHierarchicalChunking: true,
        },
        entityLinking: {
          enabled: true,
          autoRun: true,
          useWikidata: true,
          useDbpedia: false,
          threshold: 80,
        },
        llmModel: 'openai/gpt-4',
        llmMaxTokens: 1000,
        apiKeys: {
          openrouter: 'sk-test-key',
        },
        sttProvider: 'whisper',
        ttsProvider: 'coqui',
        ttsVoice: 'en-US-Guy',
      }

      const mockResponse = {
        data: settingsToSave,
      }

      vi.mocked(mockAxiosInstance.put).mockResolvedValueOnce(mockResponse)

      const result = await service.save(settingsToSave)

      expect(mockAxiosInstance.put).toHaveBeenCalledWith(
        '/settings',
        settingsToSave,
        expect.any(Object)
      )
      expect(result.kgPipeline.useGraphAware).toBe(true)
      expect(result.llmModel).toBe('openai/gpt-4')
    })
  })

})
