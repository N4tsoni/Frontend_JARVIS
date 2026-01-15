// Service API pour communiquer avec le backend Jarvis

import axios, { type AxiosInstance } from 'axios'
import type {
  VoiceProcessResponse,
  KnowledgeGraph,
  HealthCheckResponse,
  Conversation,
  ConversationListResponse,
  ConversationCreateRequest,
  ConversationCreateResponse,
  ConversationRenameRequest,
  Message,
  KGUploadResponse,
  KGProcessingResult,
  KGGraphStats,
  KGGraphVisualization,
  KGUploadedFile,
  KGHealthResponse,
} from '@/types/api'

class JarvisAPI {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      timeout: 60000, // 60 secondes pour le traitement vocal
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Vérifie l'état de santé du backend
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await this.client.get<HealthCheckResponse>('/health')
    return response.data
  }

  /**
   * Traite un message vocal
   */
  async processVoice(
    audioBlob: Blob,
    conversationId?: string
  ): Promise<VoiceProcessResponse> {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'recording.webm')

    const url = conversationId
      ? `/voice/process?conversation_id=${conversationId}`
      : '/voice/process'

    const response = await this.client.post<VoiceProcessResponse>(
      url,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  }

  /**
   * Traite un message texte (sans audio)
   */
  async processText(
    text: string,
    conversationId?: string
  ): Promise<VoiceProcessResponse> {
    const response = await this.client.post<VoiceProcessResponse>(
      '/voice/text',
      {
        text,
        conversation_id: conversationId,
      }
    )

    return response.data
  }

  /**
   * Récupère le knowledge graph
   */
  async getKnowledgeGraph(): Promise<KnowledgeGraph> {
    const response = await this.client.get<KnowledgeGraph>('/knowledge/graph')
    return response.data
  }

  /**
   * Recherche dans le knowledge graph
   */
  async queryKnowledge(query: string): Promise<any> {
    const response = await this.client.post('/knowledge/query', { query })
    return response.data
  }

  /**
   * Télécharge l'audio de la réponse
   */
  getAudioUrl(audioPath: string): string {
    return `${this.client.defaults.baseURL}${audioPath}`
  }

  // ==================== Conversation Methods ====================

  /**
   * Créer une nouvelle conversation
   */
  async createConversation(
    request?: ConversationCreateRequest
  ): Promise<ConversationCreateResponse> {
    const response = await this.client.post<ConversationCreateResponse>(
      '/conversations',
      request || {}
    )
    return response.data
  }

  /**
   * Liste toutes les conversations
   */
  async listConversations(
    limit = 50,
    offset = 0
  ): Promise<ConversationListResponse> {
    const response = await this.client.get<ConversationListResponse>(
      `/conversations?limit=${limit}&offset=${offset}`
    )
    return response.data
  }

  /**
   * Récupère une conversation par ID
   */
  async getConversation(
    conversationId: string,
    includeMessages = true
  ): Promise<Conversation> {
    const response = await this.client.get<Conversation>(
      `/conversations/${conversationId}?include_messages=${includeMessages}`
    )
    return response.data
  }

  /**
   * Renomme une conversation
   */
  async renameConversation(
    conversationId: string,
    request: ConversationRenameRequest
  ): Promise<Conversation> {
    const response = await this.client.patch<Conversation>(
      `/conversations/${conversationId}`,
      request
    )
    return response.data
  }

  /**
   * Supprime une conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    await this.client.delete(`/conversations/${conversationId}`)
  }

  /**
   * Récupère les messages d'une conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await this.client.get<Message[]>(
      `/conversations/${conversationId}/messages`
    )
    return response.data
  }

  // ==================== Knowledge Graph Builder Methods ====================

  /**
   * Upload a document for KG processing
   */
  async uploadDocument(file: File): Promise<KGUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.client.post<KGUploadResponse>(
      '/kg/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  }

  /**
   * Process an uploaded document through the KG pipeline
   */
  async processDocument(filename: string): Promise<KGProcessingResult> {
    const response = await this.client.post<KGProcessingResult>(
      `/kg/process/${filename}`
    )
    return response.data
  }

  /**
   * Upload and process a document in one call
   */
  async uploadAndProcessDocument(
    file: File,
    useV3: boolean = false,
    openrouterApiKey?: string
  ): Promise<KGProcessingResult> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('use_v3', useV3.toString())

    if (openrouterApiKey) {
      formData.append('openrouter_api_key', openrouterApiKey)
    }

    const response = await this.client.post<KGProcessingResult>(
      '/kg/upload-and-process',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 180000, // 3 minutes for processing
      }
    )
    return response.data
  }

  /**
   * Upload and process multiple documents in a batch
   */
  async uploadAndProcessBatch(
    files: File[],
    useV3: boolean = true,
    openrouterApiKey?: string,
    deduplicate: boolean = true,
    inferCrossRelations: boolean = true
  ): Promise<any> {
    const formData = new FormData()

    // Append all files
    console.log(`📦 Preparing FormData with ${files.length} files`)
    files.forEach((file, index) => {
      console.log(`  - File ${index + 1}: ${file.name} (${file.size} bytes)`)
      formData.append('files', file)
    })

    // Append settings
    formData.append('use_v3', useV3.toString())
    formData.append('deduplicate', deduplicate.toString())
    formData.append('infer_cross_relations', inferCrossRelations.toString())

    if (openrouterApiKey) {
      formData.append('openrouter_api_key', openrouterApiKey)
    }

    // Log FormData entries
    console.log('📋 FormData entries:')
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name}`)
      } else {
        console.log(`  ${key}: ${value}`)
      }
    }

    console.log('🚀 Sending batch upload request...')

    const response = await this.client.post<any>(
      '/kg/batch/upload-and-process',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 600000, // 10 minutes for batch processing
      }
    )

    console.log('✅ Batch upload response received:', response.data)
    return response.data
  }

  /**
   * Get graph statistics
   */
  async getGraphStats(): Promise<KGGraphStats> {
    const response = await this.client.get<KGGraphStats>('/kg/graph/stats')
    return response.data
  }

  /**
   * Get graph visualization data
   */
  async getGraphVisualization(limit = 100): Promise<KGGraphVisualization> {
    const response = await this.client.get<KGGraphVisualization>(
      `/kg/graph/visualization?limit=${limit}`
    )
    return response.data
  }

  /**
   * Clear all graph data (use with caution!)
   */
  async clearGraph(): Promise<{ status: string; message: string }> {
    const response = await this.client.delete('/kg/graph/clear')
    return response.data
  }

  /**
   * Get KG service health
   */
  async getKGHealth(): Promise<KGHealthResponse> {
    const response = await this.client.get<KGHealthResponse>('/kg/health')
    return response.data
  }

  /**
   * List uploaded files
   */
  async listUploadedFiles(): Promise<{ count: number; files: KGUploadedFile[] }> {
    const response = await this.client.get('/kg/uploaded-files')
    return response.data
  }

  // ==================== Settings Methods ====================

  /**
   * Get user settings
   */
  async getSettings(): Promise<any> {
    const response = await this.client.get('/settings')
    return response.data
  }

  /**
   * Update user settings
   */
  async updateSettings(settings: any): Promise<any> {
    const response = await this.client.put('/settings', settings)
    return response.data
  }
}

// Export une instance singleton
export const jarvisApi = new JarvisAPI()
export default jarvisApi
