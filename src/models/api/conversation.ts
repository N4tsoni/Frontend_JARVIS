/**
 * Conversation API Types
 */

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  audioUrl?: string
}

export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  audio_url: string | null
  created_at: string
}

export interface Conversation {
  id: string
  name: string
  created_at: string
  updated_at: string
  messages?: Message[]
}

export interface ConversationListResponse {
  conversations: Conversation[]
  total: number
}

export interface ConversationCreateRequest {
  name?: string
}

export interface ConversationCreateResponse {
  success: boolean
  conversation: Conversation
}

export interface ConversationRenameRequest {
  name: string
}
