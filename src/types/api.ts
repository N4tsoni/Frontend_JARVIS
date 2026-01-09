// Types pour l'API Jarvis

export interface VoiceProcessRequest {
  audio: File | Blob
}

export interface VoiceProcessResponse {
  transcription: string
  response: string
  audioUrl: string
  processingTime?: number
}

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  audioUrl?: string
}

export interface KnowledgeNode {
  id: string
  label: string
  type: string
  properties: Record<string, any>
}

export interface KnowledgeEdge {
  id: string
  source: string
  target: string
  type: string
  properties: Record<string, any>
}

export interface KnowledgeGraph {
  nodes: KnowledgeNode[]
  edges: KnowledgeEdge[]
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  version?: string
  services?: {
    neo4j: boolean
    whisper: boolean
    tts: boolean
  }
}

// ==================== Conversation Types ====================

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

// ==================== Knowledge Graph Builder Types ====================

export interface KGDocument {
  filename: string
  format: 'csv' | 'json' | 'pdf' | 'txt' | 'xlsx' | 'xml'
  size_bytes: number
  status: 'pending' | 'parsing' | 'extracting_entities' | 'extracting_relations' | 'storing' | 'validating' | 'completed' | 'failed'
  progress: number
  entities_extracted: number
  relations_extracted: number
  error?: string
  uploaded_at?: string
  processed_at?: string
}

export interface KGUploadResponse {
  status: string
  filename: string
  format: string
  size_bytes: number
  path: string
}

export interface KGPipelineStage {
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  duration: number
  error?: string
}

export interface KGProcessingResult {
  status: string
  document: {
    filename: string
    format: string
    status: string
    progress: number
  }
  extraction: {
    entities_extracted: number
    relations_extracted: number
    entities_by_type: Record<string, number>
    relations_by_type: Record<string, number>
  }
  storage: {
    entities_stored: number
    relations_stored: number
  }
  graph_stats: KGGraphStats
  pipeline?: {
    duration_seconds: number
    stages: KGPipelineStage[]
    errors: string[]
  }
}

export interface KGGraphStats {
  total_nodes: number
  total_relationships: number
  nodes_by_label: Record<string, number>
  relationships_by_type: Record<string, number>
}

export interface KGGraphVisualization {
  nodes: Array<{
    id: string
    label: string
    properties: Record<string, any>
  }>
  edges: Array<{
    id: string
    from: string
    to: string
    type: string
    properties: Record<string, any>
  }>
}

export interface KGUploadedFile {
  filename: string
  size_bytes: number
  format: string
}

export interface KGHealthResponse {
  status: 'healthy' | 'unhealthy'
  neo4j: string
  total_nodes: string
  total_relationships: string
  error?: string
}
