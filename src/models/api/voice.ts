/**
 * Voice API Types
 */

export interface VoiceProcessRequest {
  audio: File | Blob
}

export interface VoiceProcessResponse {
  transcription: string
  response: string
  audioUrl: string
  processingTime?: number
}
