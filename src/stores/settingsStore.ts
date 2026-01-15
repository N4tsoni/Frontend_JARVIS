/**
 * Settings Store - Gestion des paramètres de l'application
 *
 * Gère les paramètres utilisateur incluant:
 * - Pipeline V3 (Multi-Pass, Graph-Aware, etc.)
 * - Modèles LLM
 * - Providers STT/TTS
 * - Voix TTS
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { settingsService } from '@/services'
import type { KGPipelineSettings, EntityLinkingSettings, AppSettings } from '@/models'

const DEFAULT_SETTINGS: AppSettings = {
  kgPipeline: {
    useV3: false,
    useMultiPass: false,
    useGraphAware: false,
    useIncrementalResolution: false,
    useHierarchicalChunking: false
  },
  entityLinking: {
    enabled: false,
    autoRun: false,
    useWikidata: true,
    useDbpedia: true,
    threshold: 70
  },
  llmModel: 'anthropic/claude-3.5-sonnet',
  llmMaxTokens: 500,
  apiKeys: {
    openrouter: ''
  },
  sttProvider: 'groq',
  ttsProvider: 'edge',
  ttsVoice: 'fr-FR-DeniseNeural'
}

export const useSettingsStore = defineStore('settings', () => {
  // State
  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS })
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const hasUnsavedChanges = ref(false)

  // Getters
  const isV3Enabled = computed(() => settings.value.kgPipeline.useV3)

  const isV3FullyEnabled = computed(() => {
    const kg = settings.value.kgPipeline
    return kg.useV3 && kg.useMultiPass && kg.useGraphAware && kg.useIncrementalResolution
  })

  const v3FeatureCount = computed(() => {
    const kg = settings.value.kgPipeline
    let count = 0
    if (kg.useMultiPass) count++
    if (kg.useGraphAware) count++
    if (kg.useIncrementalResolution) count++
    if (kg.useHierarchicalChunking) count++
    return count
  })

  const hasOpenRouterKey = computed(() => {
    return settings.value.apiKeys.openrouter.length > 0
  })

  const maskedOpenRouterKey = computed(() => {
    const key = settings.value.apiKeys.openrouter
    if (!key || key.length < 8) return key
    return '•'.repeat(key.length - 4) + key.slice(-4)
  })

  // Entity Linking getters
  const isEntityLinkingEnabled = computed(() => settings.value.entityLinking.enabled)

  const entityLinkingSourceCount = computed(() => {
    const el = settings.value.entityLinking
    let count = 0
    if (el.useWikidata) count++
    if (el.useDbpedia) count++
    return count
  })

  // Actions
  async function loadSettings() {
    isLoading.value = true
    error.value = null

    try {
      const data = await settingsService.fetch()
      settings.value = { ...DEFAULT_SETTINGS, ...data }
      hasUnsavedChanges.value = false
    } catch (err) {
      console.error('Failed to load settings:', err)
      error.value = 'Impossible de charger les paramètres depuis le serveur'

      // Fallback to localStorage for offline mode
      try {
        const stored = localStorage.getItem('jarvis-settings')
        if (stored) {
          const parsed = JSON.parse(stored)
          settings.value = { ...DEFAULT_SETTINGS, ...parsed }
        }
      } catch (localErr) {
        console.error('Failed to load from localStorage:', localErr)
      }
    } finally {
      isLoading.value = false
    }
  }

  async function saveSettings() {
    isLoading.value = true
    error.value = null

    try {
      const data = await settingsService.save(settings.value)
      settings.value = { ...DEFAULT_SETTINGS, ...data }
      hasUnsavedChanges.value = false

      // Also save to localStorage as backup
      localStorage.setItem('jarvis-settings', JSON.stringify(settings.value))
    } catch (err) {
      console.error('Failed to save settings:', err)
      error.value = 'Impossible de sauvegarder les paramètres sur le serveur'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  function updateKGPipeline(updates: Partial<KGPipelineSettings>) {
    settings.value.kgPipeline = { ...settings.value.kgPipeline, ...updates }
    hasUnsavedChanges.value = true
  }

  function toggleV3() {
    const newV3State = !settings.value.kgPipeline.useV3

    if (newV3State) {
      // Enable all V3 features
      settings.value.kgPipeline = {
        useV3: true,
        useMultiPass: true,
        useGraphAware: true,
        useIncrementalResolution: true,
        useHierarchicalChunking: true
      }
    } else {
      // Disable all V3 features
      settings.value.kgPipeline = {
        useV3: false,
        useMultiPass: false,
        useGraphAware: false,
        useIncrementalResolution: false,
        useHierarchicalChunking: false
      }
    }

    hasUnsavedChanges.value = true
  }

  function updateLLM(model: string, maxTokens?: number) {
    settings.value.llmModel = model
    if (maxTokens !== undefined) {
      settings.value.llmMaxTokens = maxTokens
    }
    hasUnsavedChanges.value = true
  }

  function updateSTT(provider: 'groq' | 'whisper') {
    settings.value.sttProvider = provider
    hasUnsavedChanges.value = true
  }

  function updateTTS(provider: 'edge' | 'coqui', voice?: string) {
    settings.value.ttsProvider = provider
    if (voice) {
      settings.value.ttsVoice = voice
    }
    hasUnsavedChanges.value = true
  }

  function updateApiKey(provider: 'openrouter', key: string) {
    settings.value.apiKeys[provider] = key
    hasUnsavedChanges.value = true
  }

  function updateEntityLinking(updates: Partial<EntityLinkingSettings>) {
    settings.value.entityLinking = { ...settings.value.entityLinking, ...updates }
    hasUnsavedChanges.value = true
  }

  function toggleEntityLinking() {
    const newState = !settings.value.entityLinking.enabled
    settings.value.entityLinking.enabled = newState
    hasUnsavedChanges.value = true
  }

  function resetToDefaults() {
    settings.value = { ...DEFAULT_SETTINGS }
    hasUnsavedChanges.value = true
  }

  async function discardChanges() {
    await loadSettings()
    hasUnsavedChanges.value = false
  }

  // Initialize on store creation
  loadSettings()

  return {
    // State
    settings,
    isLoading,
    error,
    hasUnsavedChanges,

    // Getters
    isV3Enabled,
    isV3FullyEnabled,
    v3FeatureCount,
    hasOpenRouterKey,
    maskedOpenRouterKey,
    isEntityLinkingEnabled,
    entityLinkingSourceCount,

    // Actions
    loadSettings,
    saveSettings,
    updateKGPipeline,
    toggleV3,
    updateLLM,
    updateSTT,
    updateTTS,
    updateApiKey,
    updateEntityLinking,
    toggleEntityLinking,
    resetToDefaults,
    discardChanges
  }
})
