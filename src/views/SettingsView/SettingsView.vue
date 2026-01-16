<template>
  <div class="settings-view">
    <div class="settings-container">
      <!-- Header -->
      <div class="settings-header">
        <div class="header-content">
          <h1 class="settings-title">
            <el-icon><Setting /></el-icon>
            Paramètres
          </h1>
          <p class="settings-subtitle">
            Configure ton expérience Jarvis
          </p>
        </div>

        <!-- Actions -->
        <div class="header-actions">
          <el-button
            v-if="settingsStore.hasUnsavedChanges"
            @click="settingsStore.discardChanges()"
            :icon="RefreshLeft"
          >
            Annuler
          </el-button>
          <el-button
            type="primary"
            @click="handleSave"
            :loading="isSaving"
            :disabled="!settingsStore.hasUnsavedChanges"
            :icon="Check"
          >
            Sauvegarder
          </el-button>
        </div>
      </div>

      <!-- Content -->
      <div class="settings-content">
        <!-- KG Pipeline V3 Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Share /></el-icon>
              Pipeline Knowledge Graph
            </h2>
            <p class="section-description">
              Configure les améliorations V3 pour l'extraction du graphe de connaissances
            </p>
          </div>

          <div class="settings-grid">
            <!-- Master V3 Toggle -->
            <SettingToggle
              v-model="settingsStore.settings.kgPipeline.useV3"
              title="Activer Pipeline V3"
              :badge="v3Badge"
              :badge-type="v3BadgeType"
              description="Active toutes les améliorations V3 pour une extraction de meilleure qualité (+44% relations, +57% propriétés). Note: 2.5x plus lent."
              :active-color="'#13ce66'"
            >
              <!-- Sub-options -->
              <div class="v3-suboptions">
                <el-alert
                  type="info"
                  :closable="false"
                  show-icon
                  class="v3-info"
                >
                  <template #title>
                    <strong>{{ settingsStore.v3FeatureCount }}/4 features activées</strong>
                  </template>
                  Les améliorations V3 incluent multi-pass (4 passes), graph-aware, résolution incrémentale, et chunking hiérarchique.
                </el-alert>

                <!-- Individual V3 Features -->
                <div class="v3-features">
                  <el-checkbox
                    v-model="settingsStore.settings.kgPipeline.useMultiPass"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.kgPipeline.useV3"
                  >
                    <div class="feature-label">
                      <strong>Multi-Pass Extraction</strong>
                      <span class="feature-desc">4 passes spécialisées (entities → explicit → implicit → validation)</span>
                    </div>
                  </el-checkbox>

                  <el-checkbox
                    v-model="settingsStore.settings.kgPipeline.useGraphAware"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.kgPipeline.useV3"
                  >
                    <div class="feature-label">
                      <strong>Graph-Aware Extraction</strong>
                      <span class="feature-desc">Utilise le graphe existant comme contexte (-75% duplicates)</span>
                    </div>
                  </el-checkbox>

                  <el-checkbox
                    v-model="settingsStore.settings.kgPipeline.useIncrementalResolution"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.kgPipeline.useV3"
                  >
                    <div class="feature-label">
                      <strong>Incremental Entity Resolution</strong>
                      <span class="feature-desc">Déduplication temps réel pendant l'extraction (cache actif)</span>
                    </div>
                  </el-checkbox>

                  <el-checkbox
                    v-model="settingsStore.settings.kgPipeline.useHierarchicalChunking"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.kgPipeline.useV3"
                  >
                    <div class="feature-label">
                      <strong>Hierarchical Chunking</strong>
                      <span class="feature-desc">Chunking conscient de la structure (sections, titres, hiérarchie)</span>
                    </div>
                  </el-checkbox>
                </div>

                <!-- Performance Warning -->
                <el-alert
                  v-if="settingsStore.isV3Enabled"
                  type="warning"
                  :closable="false"
                  show-icon
                  class="performance-warning"
                >
                  <template #title>
                    <strong>Impact Performance</strong>
                  </template>
                  V3 est 2.5x plus lent (20s vs 8s par batch) mais découvre 44% plus de relations et des entités 57% plus riches.
                </el-alert>
              </div>
            </SettingToggle>
          </div>
        </section>

        <!-- Entity Linking Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Link /></el-icon>
              Entity Linking Externe
            </h2>
            <p class="section-description">
              Enrichit les entités du KG avec Wikidata et DBpedia
            </p>
          </div>

          <div class="settings-grid">
            <!-- Master Entity Linking Toggle -->
            <SettingToggle
              v-model="settingsStore.settings.entityLinking.enabled"
              title="Activer Entity Linking"
              :badge="entityLinkingBadge"
              :badge-type="entityLinkingBadgeType"
              description="Lie les entités extraites aux bases de connaissances externes (Wikidata, DBpedia) pour les enrichir avec des descriptions, types et propriétés."
              :active-color="'#409eff'"
            >
              <!-- Sub-options -->
              <div class="entity-linking-suboptions">
                <el-alert
                  type="info"
                  :closable="false"
                  show-icon
                  class="el-info"
                >
                  <template #title>
                    <strong>{{ settingsStore.entityLinkingSourceCount }}/2 sources actives</strong>
                  </template>
                  L'Entity Linking recherche chaque entité dans les bases externes et enrichit le graphe avec des données supplémentaires.
                </el-alert>

                <!-- Sources -->
                <div class="el-sources">
                  <el-checkbox
                    v-model="settingsStore.settings.entityLinking.useWikidata"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.entityLinking.enabled"
                  >
                    <div class="feature-label">
                      <strong>Wikidata</strong>
                      <span class="feature-desc">Base de connaissances structurée (Q-IDs, propriétés, types)</span>
                    </div>
                  </el-checkbox>

                  <el-checkbox
                    v-model="settingsStore.settings.entityLinking.useDbpedia"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.entityLinking.enabled"
                  >
                    <div class="feature-label">
                      <strong>DBpedia</strong>
                      <span class="feature-desc">Données structurées extraites de Wikipedia (SPARQL)</span>
                    </div>
                  </el-checkbox>
                </div>

                <!-- Auto-run option -->
                <div class="el-auto-option">
                  <el-checkbox
                    v-model="settingsStore.settings.entityLinking.autoRun"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.entityLinking.enabled"
                  >
                    <div class="feature-label">
                      <strong>Exécution automatique</strong>
                      <span class="feature-desc">Lance le linking automatiquement après chaque extraction KG</span>
                    </div>
                  </el-checkbox>
                </div>

                <!-- Threshold slider -->
                <div class="el-threshold">
                  <label class="setting-label">
                    Seuil de similarité minimum: {{ settingsStore.settings.entityLinking.threshold }}%
                  </label>
                  <el-slider
                    v-model="settingsStore.settings.entityLinking.threshold"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.entityLinking.enabled"
                    :min="50"
                    :max="100"
                    :step="5"
                    show-stops
                    :marks="thresholdMarks"
                  />
                  <p class="threshold-hint">
                    Plus le seuil est élevé, plus les correspondances sont précises (moins de faux positifs)
                  </p>
                </div>

                <!-- Performance Warning -->
                <el-alert
                  v-if="settingsStore.settings.entityLinking.enabled && settingsStore.settings.entityLinking.autoRun"
                  type="warning"
                  :closable="false"
                  show-icon
                  class="performance-warning"
                >
                  <template #title>
                    <strong>Impact Performance</strong>
                  </template>
                  L'exécution automatique ajoute ~1-2s par entité (appels API externes). Pour de gros documents, préférez le mode manuel.
                </el-alert>
              </div>
            </SettingToggle>
          </div>
        </section>

        <!-- Orchestrator Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Connection /></el-icon>
              Orchestrateur Intelligent
            </h2>
            <p class="section-description">
              Active le routage conditionnel des requêtes basé sur l'intention détectée
            </p>
          </div>

          <div class="settings-grid">
            <SettingToggle
              v-model="settingsStore.settings.orchestrator.enabled"
              title="Activer l'Orchestrateur"
              :badge="orchestratorBadge"
              :badge-type="orchestratorBadgeType"
              description="L'orchestrateur analyse chaque requête pour déterminer le pipeline optimal: requête KG complète, conversation générale, ou réponse directe."
              :active-color="'#e6a23c'"
            >
              <!-- Sub-options -->
              <div class="orchestrator-suboptions">
                <el-alert
                  type="info"
                  :closable="false"
                  show-icon
                  class="orch-info"
                >
                  <template #title>
                    <strong>Routage Intelligent</strong>
                  </template>
                  L'orchestrateur optimise les performances en adaptant le pipeline selon le type de requête détecté.
                </el-alert>

                <!-- Options -->
                <div class="orch-options">
                  <el-checkbox
                    v-model="settingsStore.settings.orchestrator.intelligentMode"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.orchestrator.enabled"
                  >
                    <div class="feature-label">
                      <strong>Mode Intelligent</strong>
                      <span class="feature-desc">Active la conscience KG, décomposition des requêtes et routage adaptatif</span>
                    </div>
                  </el-checkbox>

                  <el-checkbox
                    v-model="settingsStore.settings.orchestrator.useIntentClassification"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.orchestrator.enabled"
                  >
                    <div class="feature-label">
                      <strong>Classification d'intention</strong>
                      <span class="feature-desc">Analyse chaque requête pour déterminer son type (KG, général, direct)</span>
                    </div>
                  </el-checkbox>

                  <el-checkbox
                    v-model="settingsStore.settings.orchestrator.skipKGForGeneral"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.orchestrator.enabled"
                  >
                    <div class="feature-label">
                      <strong>Skip KG pour requêtes générales</strong>
                      <span class="feature-desc">Passe directement au LLM pour les conversations générales (plus rapide)</span>
                    </div>
                  </el-checkbox>
                </div>

                <!-- Threshold slider -->
                <div class="orch-threshold">
                  <label class="setting-label">
                    Seuil de confiance: {{ (settingsStore.settings.orchestrator.confidenceThreshold * 100).toFixed(0) }}%
                  </label>
                  <el-slider
                    v-model="settingsStore.settings.orchestrator.confidenceThreshold"
                    @change="settingsStore.hasUnsavedChanges = true"
                    :disabled="!settingsStore.settings.orchestrator.enabled"
                    :min="0.5"
                    :max="1.0"
                    :step="0.1"
                    show-stops
                    :format-tooltip="(val: number) => `${(val * 100).toFixed(0)}%`"
                  />
                  <p class="threshold-hint">
                    Seuil minimum de confiance pour les réponses directes sans appel au KG
                  </p>
                </div>

                <!-- Performance Info -->
                <el-alert
                  v-if="settingsStore.settings.orchestrator.enabled"
                  type="success"
                  :closable="false"
                  show-icon
                  class="orch-perf"
                >
                  <template #title>
                    <strong>Gain de Performance</strong>
                  </template>
                  L'orchestrateur peut réduire la latence de 50-70% pour les conversations générales en skipant le pipeline KG.
                </el-alert>
              </div>
            </SettingToggle>
          </div>
        </section>

        <!-- API Keys Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Key /></el-icon>
              API Keys
            </h2>
            <p class="section-description">
              Configure tes clés API personnelles
            </p>
          </div>

          <div class="settings-grid">
            <div class="api-key-container">
              <div class="api-key-header">
                <div class="api-key-info">
                  <label class="setting-label">
                    OpenRouter API Key
                    <el-tag
                      v-if="settingsStore.hasOpenRouterKey"
                      type="success"
                      size="small"
                      class="key-status"
                    >
                      Configurée
                    </el-tag>
                    <el-tag
                      v-else
                      type="warning"
                      size="small"
                      class="key-status"
                    >
                      Non configurée
                    </el-tag>
                  </label>
                  <p class="api-key-description">
                    Nécessaire pour utiliser Claude via OpenRouter. Obtiens ta clé sur
                    <a href="https://openrouter.ai/keys" target="_blank" class="api-link">
                      openrouter.ai/keys
                    </a>
                  </p>
                </div>
              </div>

              <div class="api-key-input-group">
                <el-input
                  v-model="settingsStore.settings.apiKeys.openrouter"
                  @input="settingsStore.hasUnsavedChanges = true"
                  type="password"
                  placeholder="sk-or-v1-..."
                  show-password
                  clearable
                  class="api-key-input"
                >
                  <template #prefix>
                    <el-icon><Lock /></el-icon>
                  </template>
                </el-input>
              </div>

              <el-alert
                v-if="!settingsStore.hasOpenRouterKey"
                type="info"
                :closable="false"
                show-icon
                class="api-key-warning"
              >
                <template #title>
                  <strong>Clé API requise</strong>
                </template>
                Sans clé OpenRouter configurée, l'extraction KG ne fonctionnera pas. L'application utilise Claude 3.5 Sonnet via OpenRouter.
              </el-alert>

              <el-alert
                v-else
                type="success"
                :closable="false"
                show-icon
                class="api-key-success"
              >
                <template #title>
                  <strong>Clé configurée</strong>
                </template>
                Ta clé OpenRouter est configurée. Derniers caractères: {{ settingsStore.maskedOpenRouterKey }}
              </el-alert>
            </div>
          </div>
        </section>

        <!-- LLM Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><ChatDotRound /></el-icon>
              Modèle LLM
            </h2>
            <p class="section-description">
              Configure le modèle de langage utilisé
            </p>
          </div>

          <div class="settings-grid">
            <div class="setting-item">
              <label class="setting-label">Modèle</label>
              <el-select
                v-model="settingsStore.settings.llmModel"
                @change="settingsStore.hasUnsavedChanges = true"
                placeholder="Sélectionne un modèle"
                class="setting-select"
              >
                <el-option
                  label="Claude 3.5 Sonnet (Recommandé)"
                  value="anthropic/claude-3.5-sonnet"
                />
                <el-option
                  label="Claude 3 Opus"
                  value="anthropic/claude-3-opus"
                />
                <el-option
                  label="Claude 3 Haiku"
                  value="anthropic/claude-3-haiku"
                />
              </el-select>
            </div>

            <div class="setting-item">
              <label class="setting-label">Max Tokens</label>
              <el-input-number
                v-model="settingsStore.settings.llmMaxTokens"
                @change="settingsStore.hasUnsavedChanges = true"
                :min="100"
                :max="4000"
                :step="100"
                class="setting-number"
              />
            </div>
          </div>
        </section>

        <!-- STT Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Microphone /></el-icon>
              Speech-to-Text
            </h2>
            <p class="section-description">
              Configure le provider de transcription audio
            </p>
          </div>

          <div class="settings-grid">
            <SettingToggle
              :model-value="settingsStore.settings.sttProvider === 'groq'"
              @update:model-value="settingsStore.updateSTT($event ? 'groq' : 'whisper')"
              title="Groq STT (Recommandé)"
              badge="Rapide & Précis"
              badge-type="success"
              description="Active Groq pour la transcription (plus rapide et précis que Whisper Local)"
            >
              <template #sub-options>
                <el-alert
                  v-if="settingsStore.settings.sttProvider === 'whisper'"
                  type="warning"
                  :closable="false"
                  show-icon
                  class="stt-warning"
                >
                  <template #title>
                    <strong>Whisper Local actif</strong>
                  </template>
                  Le mode Whisper Local est plus lent et moins précis. Active Groq STT pour de meilleures performances.
                </el-alert>
              </template>
            </SettingToggle>
          </div>
        </section>

        <!-- TTS Section -->
        <section class="settings-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Headset /></el-icon>
              Text-to-Speech
            </h2>
          </div>

          <div class="settings-grid">
            <div class="setting-item">
              <label class="setting-label">Provider</label>
              <el-select
                v-model="settingsStore.settings.ttsProvider"
                @change="settingsStore.hasUnsavedChanges = true"
                class="setting-select"
              >
                <el-option label="Edge TTS" value="edge" />
                <el-option label="Coqui TTS" value="coqui" />
              </el-select>
            </div>

            <div class="setting-item">
              <label class="setting-label">Voix</label>
              <el-input
                v-model="settingsStore.settings.ttsVoice"
                @input="settingsStore.hasUnsavedChanges = true"
                placeholder="fr-FR-DeniseNeural"
              />
            </div>
          </div>
        </section>

        <!-- Reset Section -->
        <section class="settings-section">
          <el-button
            @click="handleReset"
            :icon="RefreshLeft"
            type="danger"
            plain
          >
            Réinitialiser aux valeurs par défaut
          </el-button>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Setting,
  Check,
  RefreshLeft,
  Share,
  ChatDotRound,
  Microphone,
  Headset,
  Key,
  Lock,
  Link,
  Connection
} from '@element-plus/icons-vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { SettingToggle } from '@/components/molecules'

const settingsStore = useSettingsStore()
const isSaving = ref(false)

// Computed
const v3Badge = computed(() => {
  if (!settingsStore.isV3Enabled) return 'Désactivé'
  if (settingsStore.isV3FullyEnabled) return 'Complet'
  return `${settingsStore.v3FeatureCount}/4`
})

const v3BadgeType = computed(() => {
  if (!settingsStore.isV3Enabled) return 'info'
  if (settingsStore.isV3FullyEnabled) return 'success'
  return 'warning'
})

// Entity Linking computed
const entityLinkingBadge = computed(() => {
  if (!settingsStore.isEntityLinkingEnabled) return 'Désactivé'
  if (settingsStore.settings.entityLinking.autoRun) return 'Auto'
  return 'Manuel'
})

const entityLinkingBadgeType = computed(() => {
  if (!settingsStore.isEntityLinkingEnabled) return 'info'
  if (settingsStore.settings.entityLinking.autoRun) return 'success'
  return 'warning'
})

// Orchestrator computed
const orchestratorBadge = computed(() => {
  if (!settingsStore.isOrchestratorEnabled) return 'Désactivé'
  if (settingsStore.settings.orchestrator.intelligentMode) return 'Intelligent'
  if (settingsStore.settings.orchestrator.skipKGForGeneral) return 'Optimisé'
  return 'Actif'
})

const orchestratorBadgeType = computed(() => {
  if (!settingsStore.isOrchestratorEnabled) return 'info'
  if (settingsStore.settings.orchestrator.intelligentMode) return 'success'
  if (settingsStore.settings.orchestrator.skipKGForGeneral) return 'warning'
  return 'warning'
})

const thresholdMarks = {
  50: '50%',
  70: '70%',
  90: '90%',
  100: '100%'
}

// Actions
async function handleSave() {
  isSaving.value = true
  try {
    settingsStore.saveSettings()
    ElMessage.success('Paramètres sauvegardés avec succès!')
  } catch (error) {
    ElMessage.error('Erreur lors de la sauvegarde des paramètres')
  } finally {
    isSaving.value = false
  }
}

async function handleReset() {
  try {
    await ElMessageBox.confirm(
      'Cette action réinitialisera tous les paramètres. Continuer?',
      'Confirmation',
      {
        confirmButtonText: 'Réinitialiser',
        cancelButtonText: 'Annuler',
        type: 'warning'
      }
    )

    settingsStore.resetToDefaults()
    ElMessage.success('Paramètres réinitialisés!')
  } catch {
    // User cancelled
  }
}
</script>

<style lang="scss" scoped src="./SettingsView.scss"></style>
