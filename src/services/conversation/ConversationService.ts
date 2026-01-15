/**
 * Conversation Service
 *
 * Handles conversation CRUD operations and message management.
 */

import { ApiService } from '../core'
import type {
  Conversation,
  ConversationListResponse,
  ConversationCreateRequest,
  ConversationCreateResponse,
  ConversationRenameRequest,
  Message,
} from '@/models'

/**
 * Service for conversation operations
 */
export class ConversationService extends ApiService {
  protected basePath = '/conversations'

  /**
   * Create a new conversation
   */
  async create(request?: ConversationCreateRequest): Promise<ConversationCreateResponse> {
    return this.post<ConversationCreateResponse>('', request || {})
  }

  /**
   * List all conversations with pagination
   */
  async list(limit = 50, offset = 0): Promise<ConversationListResponse> {
    return this.get<ConversationListResponse>('', {
      params: { limit, offset },
    })
  }

  /**
   * Get a conversation by ID
   */
  async getById(
    conversationId: string,
    includeMessages = true
  ): Promise<Conversation> {
    return this.get<Conversation>(`/${conversationId}`, {
      params: { include_messages: includeMessages },
    })
  }

  /**
   * Rename a conversation
   */
  async rename(
    conversationId: string,
    request: ConversationRenameRequest
  ): Promise<Conversation> {
    return this.patch<Conversation>(`/${conversationId}`, request)
  }

  /**
   * Delete a conversation
   */
  async remove(conversationId: string): Promise<void> {
    return this.delete<void>(`/${conversationId}`)
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    return this.get<Message[]>(`/${conversationId}/messages`)
  }
}

// Export singleton instance
export const conversationService = new ConversationService()
export default conversationService
