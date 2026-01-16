/**
 * Settings Store Types
 */

export interface KGPipelineSettings {
  useV3: boolean
  useMultiPass: boolean
  useGraphAware: boolean
  useIncrementalResolution: boolean
  useHierarchicalChunking: boolean
}

export interface EntityLinkingSettings {
  enabled: boolean
  autoRun: boolean
  useWikidata: boolean
  useDbpedia: boolean
  threshold: number
}

export interface OrchestratorSettings {
  enabled: boolean
  intelligentMode: boolean
  useIntentClassification: boolean
  skipKGForGeneral: boolean
  confidenceThreshold: number
}

export interface AppSettings {
  // KG Pipeline
  kgPipeline: KGPipelineSettings

  // Entity Linking
  entityLinking: EntityLinkingSettings

  // Orchestrator
  orchestrator: OrchestratorSettings

  // LLM
  llmModel: string
  llmMaxTokens: number

  // API Keys
  apiKeys: {
    openrouter: string
  }

  // STT (Speech-to-Text)
  sttProvider: 'groq' | 'whisper'

  // TTS (Text-to-Speech)
  ttsProvider: 'edge' | 'coqui'
  ttsVoice: string
}
