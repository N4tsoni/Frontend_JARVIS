/**
 * Knowledge Graph API Types
 */

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
