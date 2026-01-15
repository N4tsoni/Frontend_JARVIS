/**
 * Services Layer - Centralized API Communication
 *
 * This module provides domain-specific services for API communication.
 * All services extend the abstract ApiService class.
 *
 * Architecture:
 * ```
 * services/
 * ├── core/           # Base API service infrastructure
 * │   └── ApiService  # Abstract base class with HTTP methods
 * ├── voice/          # Voice processing (STT/TTS)
 * ├── conversation/   # Conversation CRUD
 * ├── kg/             # Knowledge Graph operations
 * ├── settings/       # User settings
 * └── health/         # Health monitoring
 * ```
 *
 * @example
 * // Import individual services
 * import { voiceService } from '@/services'
 * const response = await voiceService.processVoice(audioBlob)
 *
 * @example
 * // Or import from domain
 * import { conversationService } from '@/services/conversation'
 * const conversations = await conversationService.list()
 */

// Core
export { ApiService, type ApiError, type ApiResponse, type RequestOptions } from './core'

// Domain Services
export { VoiceService, voiceService } from './voice'
export { ConversationService, conversationService } from './conversation'
export { KGService, kgService } from './kg'
export { SettingsService, settingsService } from './settings'
export { HealthService, healthService } from './health'

// Re-export commonly used types from models
export type { BatchProcessingOptions, BatchProcessingResult } from '@/models'
