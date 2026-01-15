/**
 * KG Service Types
 */

import type { KGProcessingResult } from '../api/kg'

export interface BatchProcessingOptions {
  useV3?: boolean
  openrouterApiKey?: string
  deduplicate?: boolean
  inferCrossRelations?: boolean
}

export interface BatchProcessingResult {
  status: string
  total_files: number
  processed: number
  failed: number
  results: KGProcessingResult[]
  cross_file_stats?: {
    duplicates_removed: number
    cross_relations_created: number
  }
}
