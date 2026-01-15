/**
 * Health Check API Types
 */

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  version?: string
  services?: {
    neo4j: boolean
    whisper: boolean
    tts: boolean
  }
}

export interface KGHealthResponse {
  status: 'healthy' | 'unhealthy'
  neo4j: string
  total_nodes: string
  total_relationships: string
  error?: string
}
