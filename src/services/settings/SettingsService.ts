/**
 * Settings Service
 *
 * Handles user settings and preferences.
 */

import { ApiService } from '../core'
import type { KGPipelineSettings, EntityLinkingSettings, AppSettings } from '@/models'

/**
 * Service for settings operations
 */
export class SettingsService extends ApiService {
  protected basePath = '/settings'

  /**
   * Fetch user settings
   */
  async fetch(): Promise<AppSettings> {
    return super.get<AppSettings>('')
  }

  /**
   * Save user settings
   */
  async save(settings: Partial<AppSettings>): Promise<AppSettings> {
    return super.put<AppSettings>('', settings)
  }

  /**
   * Update KG Pipeline settings only
   */
  async updateKGPipeline(pipeline: Partial<KGPipelineSettings>): Promise<AppSettings> {
    return this.save({ kgPipeline: pipeline as KGPipelineSettings })
  }

  /**
   * Update Entity Linking settings only
   */
  async updateEntityLinking(entityLinking: Partial<EntityLinkingSettings>): Promise<AppSettings> {
    return this.save({ entityLinking: entityLinking as EntityLinkingSettings })
  }

  /**
   * Update API key
   */
  async updateApiKey(provider: 'openrouter', key: string): Promise<AppSettings> {
    return this.save({
      apiKeys: { [provider]: key },
    } as Partial<AppSettings>)
  }

  /**
   * Reset settings to defaults (server-side)
   */
  async reset(): Promise<AppSettings> {
    return super.delete<AppSettings>('')
  }
}

// Export singleton instance
export const settingsService = new SettingsService()
export default settingsService
