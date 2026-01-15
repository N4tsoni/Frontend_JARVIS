/**
 * Knowledge Graph Service
 *
 * Handles KG document processing, graph management, and visualization.
 */

import { ApiService } from '../core'
import type {
  KGUploadResponse,
  KGProcessingResult,
  KGGraphStats,
  KGGraphVisualization,
  KGUploadedFile,
  KGHealthResponse,
  KnowledgeGraph,
  BatchProcessingOptions,
  BatchProcessingResult,
} from '@/models'

/**
 * Service for Knowledge Graph operations
 */
export class KGService extends ApiService {
  protected basePath = '/kg'

  /**
   * Upload a document for KG processing
   */
  async uploadDocument(file: File): Promise<KGUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)

    return this.postForm<KGUploadResponse>('/upload', formData)
  }

  /**
   * Process an uploaded document through the KG pipeline
   */
  async processDocument(filename: string): Promise<KGProcessingResult> {
    return this.post<KGProcessingResult>(`/process/${filename}`)
  }

  /**
   * Upload and process a document in one call
   */
  async uploadAndProcess(
    file: File,
    useV3 = false,
    openrouterApiKey?: string
  ): Promise<KGProcessingResult> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('use_v3', useV3.toString())

    if (openrouterApiKey) {
      formData.append('openrouter_api_key', openrouterApiKey)
    }

    return this.postForm<KGProcessingResult>('/upload-and-process', formData, {
      timeout: 180000, // 3 minutes for processing
    })
  }

  /**
   * Upload and process multiple documents in a batch
   */
  async uploadAndProcessBatch(
    files: File[],
    options: BatchProcessingOptions = {}
  ): Promise<BatchProcessingResult> {
    const {
      useV3 = true,
      openrouterApiKey,
      deduplicate = true,
      inferCrossRelations = true,
    } = options

    const formData = new FormData()

    // Append all files
    console.log(`📦 [KGService] Preparing batch upload: ${files.length} files`)
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

    console.log('🚀 [KGService] Sending batch upload request...')

    const result = await this.postForm<BatchProcessingResult>(
      '/batch/upload-and-process',
      formData,
      { timeout: 600000 } // 10 minutes for batch processing
    )

    console.log('✅ [KGService] Batch upload complete:', result)
    return result
  }

  /**
   * Get graph statistics
   */
  async getStats(): Promise<KGGraphStats> {
    return this.get<KGGraphStats>('/graph/stats')
  }

  /**
   * Get graph visualization data
   */
  async getVisualization(limit = 100): Promise<KGGraphVisualization> {
    return this.get<KGGraphVisualization>('/graph/visualization', {
      params: { limit },
    })
  }

  /**
   * Clear all graph data
   */
  async clearGraph(): Promise<{ status: string; message: string }> {
    return this.delete<{ status: string; message: string }>('/graph/clear')
  }

  /**
   * Get KG service health status
   */
  async getHealth(): Promise<KGHealthResponse> {
    return this.get<KGHealthResponse>('/health')
  }

  /**
   * List uploaded files
   */
  async listUploadedFiles(): Promise<{ count: number; files: KGUploadedFile[] }> {
    return this.get<{ count: number; files: KGUploadedFile[] }>('/uploaded-files')
  }

  /**
   * Get the legacy knowledge graph (for backward compatibility)
   * Uses /knowledge endpoint instead of /kg
   */
  async getLegacyKnowledgeGraph(): Promise<KnowledgeGraph> {
    // Temporarily override basePath for this request
    const response = await this.axios.get<KnowledgeGraph>('/knowledge/graph')
    return response.data
  }

  /**
   * Query the legacy knowledge graph
   */
  async queryLegacyKnowledge(query: string): Promise<unknown> {
    const response = await this.axios.post('/knowledge/query', { query })
    return response.data
  }
}

// Export singleton instance
export const kgService = new KGService()
export default kgService
