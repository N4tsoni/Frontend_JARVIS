/**
 * KG Store Types
 */

export interface PipelineStage {
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  duration?: number
  error?: string
}
