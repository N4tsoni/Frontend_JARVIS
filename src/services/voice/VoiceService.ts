/**
 * Voice Service
 *
 * Handles voice processing and text-to-speech functionality.
 */

import { ApiService } from '../core'
import type { VoiceProcessResponse } from '@/models'

/**
 * Service for voice processing operations
 */
export class VoiceService extends ApiService {
  protected basePath = '/voice'

  /**
   * Process an audio recording
   */
  async processVoice(
    audioBlob: Blob,
    conversationId?: string
  ): Promise<VoiceProcessResponse> {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')

    const endpoint = conversationId
      ? `/process?conversation_id=${conversationId}`
      : '/process'

    return this.postForm<VoiceProcessResponse>(endpoint, formData)
  }

  /**
   * Process text input (without audio)
   */
  async processText(
    text: string,
    conversationId?: string
  ): Promise<VoiceProcessResponse> {
    return this.post<VoiceProcessResponse>('/text', {
      text,
      conversation_id: conversationId,
    })
  }

  /**
   * Get the full URL for an audio file
   */
  getAudioUrl(audioPath: string): string {
    return `/api${audioPath}`
  }
}

// Export singleton instance
export const voiceService = new VoiceService()
export default voiceService
