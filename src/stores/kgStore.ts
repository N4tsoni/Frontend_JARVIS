/**
 * Store Pinia pour Knowledge Graph Builder
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { kgService } from '@/services'
import { useSettingsStore } from './settingsStore'
import type {
  KGGraphStats,
  KGGraphVisualization,
  KGProcessingResult,
  KGUploadedFile,
  PipelineStage,
  BatchProcessingResult,
} from '@/models'

// Union type for processing results
type ProcessingResult = KGProcessingResult | BatchProcessingResult

export const useKGStore = defineStore('kg', () => {
  // ==================== State ====================

  // Upload & Processing
  const isUploading = ref(false)
  const isProcessing = ref(false)
  const uploadProgress = ref(0)
  const processingStatus = ref<string>('')
  const lastProcessingResult = ref<ProcessingResult | null>(null)
  const uploadError = ref<string | null>(null)

  // Pipeline Stages (for animated progress)
  const pipelineStages = ref<PipelineStage[]>([])
  const currentStageIndex = ref(0)

  // Graph Data
  const graphStats = ref<KGGraphStats | null>(null)
  const graphVisualization = ref<KGGraphVisualization | null>(null)
  const uploadedFiles = ref<KGUploadedFile[]>([])

  // UI State
  const selectedNodeId = ref<string | null>(null)
  const selectedEdgeId = ref<string | null>(null)
  const visualizationLimit = ref(100)

  // ==================== Getters ====================

  const hasGraph = computed(() => {
    return graphStats.value && graphStats.value.total_nodes > 0
  })

  const totalNodes = computed(() => graphStats.value?.total_nodes || 0)
  const totalRelationships = computed(() => graphStats.value?.total_relationships || 0)

  const nodesByLabel = computed(() => graphStats.value?.nodes_by_label || {})
  const relationshipsByType = computed(() => graphStats.value?.relationships_by_type || {})

  const isWorking = computed(() => isUploading.value || isProcessing.value)

  // ==================== Actions ====================

  /**
   * Initialize pipeline stages (default for full pipeline)
   */
  function initializePipelineStages() {
    pipelineStages.value = [
      { name: 'Parsing', status: 'pending' },
      { name: 'Chunking', status: 'pending' },
      { name: 'Embedding', status: 'pending' },
      { name: 'NER', status: 'pending' },
      { name: 'Extraction', status: 'pending' },
      { name: 'Transformation', status: 'pending' },
      { name: 'Enrichment', status: 'pending' },
      { name: 'Validation', status: 'pending' },
      { name: 'Storage', status: 'pending' },
    ]
    currentStageIndex.value = 0
  }

  /**
   * Update a specific stage status
   */
  function updateStageStatus(
    stageIndex: number,
    status: 'pending' | 'running' | 'completed' | 'error',
    error?: string
  ) {
    const stage = pipelineStages.value[stageIndex]
    if (stageIndex >= 0 && stageIndex < pipelineStages.value.length && stage) {
      stage.status = status
      if (error) {
        stage.error = error
      }
      if (status === 'running') {
        currentStageIndex.value = stageIndex
      }
    }
  }

  /**
   * Update stages from backend pipeline result (without resetting)
   */
  function updateStagesFromResult(result: KGProcessingResult) {
    if (!result.pipeline?.stages) {
      // No pipeline data from backend, mark all as completed
      pipelineStages.value.forEach((stage) => {
        if (stage.status !== 'error') {
          stage.status = 'completed'
        }
      })
      return
    }

    // Map backend stages to frontend stages
    const backendStages = result.pipeline.stages

    // Update based on backend results (DON'T reset existing status)
    backendStages.forEach((backendStage) => {
      // Find matching stage by name (case-insensitive partial match)
      const stageIndex = pipelineStages.value.findIndex((s) =>
        s.name.toLowerCase().includes(backendStage.name.toLowerCase()) ||
        backendStage.name.toLowerCase().includes(s.name.toLowerCase())
      )

      const stage = pipelineStages.value[stageIndex]
      if (stageIndex !== -1 && stage) {
        // Only update if backend has specific status info
        if (backendStage.status === 'failed') {
          stage.status = 'error'
          if (backendStage.error) {
            stage.error = backendStage.error
          }
        } else if (backendStage.status === 'completed') {
          stage.status = 'completed'
        }

        stage.duration = backendStage.duration
      }
    })
  }

  /**
   * Simulate progressive stage advancement during processing
   */
  function simulateStageProgress() {
    console.log('🏃 Starting stage simulation...')

    // Estimated time per stage (in ms) - realistic timing for backend processing
    const stageTiming = [
      { index: 0, delay: 1200 },   // Parsing
      { index: 1, delay: 2000 },   // Chunking
      { index: 2, delay: 3200 },   // Embedding
      { index: 3, delay: 2400 },   // NER
      { index: 4, delay: 6000 },   // Extraction (longest - LLM calls)
      { index: 5, delay: 1600 },   // Transformation
      { index: 6, delay: 2000 },   // Enrichment
      { index: 7, delay: 1200 },   // Validation
      { index: 8, delay: 2400 },   // Storage
    ]

    let cumulativeDelay = 0
    const timeouts: number[] = []

    stageTiming.forEach(({ index, delay }) => {
      cumulativeDelay += delay

      // Start stage
      const startTimeout = setTimeout(() => {
        const stage = pipelineStages.value[index]
        console.log(`⏱️ Stage ${index} timeout fired - current status: ${stage?.status}`)

        if (stage && stage.status === 'pending') {
          // Complete previous stage if still running
          const prevStage = index > 0 ? pipelineStages.value[index - 1] : null
          if (prevStage && prevStage.status === 'running') {
            console.log(`✅ Completing stage ${index - 1}`)
            prevStage.status = 'completed'
          }
          // Start current stage
          console.log(`▶️ Starting stage ${index}: ${stage.name}`)
          updateStageStatus(index, 'running')
          uploadProgress.value = Math.min(10 + (index / pipelineStages.value.length) * 85, 95)
        }
      }, cumulativeDelay)

      timeouts.push(startTimeout)
    })

    // Complete last stage after final delay
    const completeLastTimeout = setTimeout(() => {
      const lastIndex = pipelineStages.value.length - 1
      const lastStage = pipelineStages.value[lastIndex]
      if (lastStage?.status === 'running') {
        console.log(`✅ Completing final stage ${lastIndex}`)
        lastStage.status = 'completed'
      }
    }, cumulativeDelay + 200)

    timeouts.push(completeLastTimeout)

    // Return cleanup function
    return () => {
      console.log('🧹 Cleaning up simulation timers')
      timeouts.forEach(clearTimeout)
    }
  }

  /**
   * Upload and process a document
   */
  async function uploadAndProcess(file: File) {
    console.log('📤 Starting upload and process...')
    isUploading.value = true
    isProcessing.value = true
    uploadProgress.value = 0
    processingStatus.value = 'Uploading file...'
    uploadError.value = null

    // Get settings store to check V3 status and API key
    const settingsStore = useSettingsStore()
    const useV3 = settingsStore.isV3Enabled
    const openrouterApiKey = settingsStore.settings.apiKeys.openrouter

    console.log(`🔧 Settings: V3 ${useV3 ? 'Enabled' : 'Disabled'}`)
    if (useV3) {
      console.log(`   Features: Multi-Pass=${settingsStore.settings.kgPipeline.useMultiPass}, Graph-Aware=${settingsStore.settings.kgPipeline.useGraphAware}`)
    }
    if (openrouterApiKey) {
      console.log(`   OpenRouter API Key: Configured (ending with ...${openrouterApiKey.slice(-4)})`)
    } else {
      console.warn(`   ⚠️ OpenRouter API Key: Not configured (using env default)`)
    }

    // Initialize pipeline stages
    initializePipelineStages()
    console.log('📋 Initialized stages:', pipelineStages.value.map(s => s.name))

    // Start simulating stage progress
    const cleanupSimulation = simulateStageProgress()

    try {
      // Start upload
      uploadProgress.value = 10
      processingStatus.value = 'Starting pipeline...'

      console.log('🌐 Calling backend API...')
      // Upload and process with V3 setting and API key
      const result = await kgService.uploadAndProcess(file, useV3, openrouterApiKey)
      console.log('✅ Backend responded')

      // Update stages from actual backend result (doesn't reset simulation)
      console.log('📊 Updating stages from backend result...')
      updateStagesFromResult(result)

      // Wait a bit to let the simulation complete naturally
      console.log('⏳ Waiting for simulation to complete...')
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mark any remaining stages as completed
      console.log('✅ Marking remaining stages as completed...')
      pipelineStages.value.forEach((stage, index) => {
        if (stage.status === 'running' || stage.status === 'pending') {
          console.log(`  Stage ${index} (${stage.name}): ${stage.status} -> completed`)
          stage.status = 'completed'
        }
      })

      uploadProgress.value = 100
      processingStatus.value = 'Completed!'
      lastProcessingResult.value = result

      // Clean up simulation timers
      cleanupSimulation()

      // Refresh graph stats and viz
      await Promise.all([loadGraphStats(), loadGraphVisualization()])

      return result
    } catch (error: any) {
      console.error('❌ Upload and process failed:', error)
      uploadError.value = error.response?.data?.detail || error.message

      // Stop simulation
      cleanupSimulation()

      // Mark all running or pending stages as error
      pipelineStages.value.forEach((stage) => {
        if (stage.status === 'running' || stage.status === 'pending') {
          stage.status = 'error'
          stage.error = uploadError.value || 'Processing failed'
        }
      })

      throw error
    } finally {
      isUploading.value = false
      isProcessing.value = false
    }
  }

  /**
   * Upload and process multiple documents in a batch
   */
  async function uploadAndProcessBatch(files: File[]) {
    console.log(`📤 Starting batch upload and process: ${files.length} files...`)
    isUploading.value = true
    isProcessing.value = true
    uploadProgress.value = 0
    processingStatus.value = `Uploading ${files.length} files...`
    uploadError.value = null

    // Get settings store
    const settingsStore = useSettingsStore()
    const useV3 = settingsStore.isV3Enabled
    const openrouterApiKey = settingsStore.settings.apiKeys.openrouter

    console.log(`🔧 Batch Settings: V3 ${useV3 ? 'Enabled' : 'Disabled'}`)
    if (openrouterApiKey) {
      console.log(`   OpenRouter API Key: Configured`)
    }

    // Initialize pipeline stages
    initializePipelineStages()

    // Start simulating stage progress
    const cleanupSimulation = simulateStageProgress()

    try {
      // Start upload
      uploadProgress.value = 10
      processingStatus.value = `Processing ${files.length} files...`

      console.log('🌐 Calling batch upload API...')
      // Upload batch with V3 setting and API key
      const result = await kgService.uploadAndProcessBatch(files, {
        useV3,
        openrouterApiKey,
      })
      console.log('✅ Batch processing completed')

      // Update stages
      console.log('📊 Updating stages from batch result...')
      // Note: Batch result might have different structure
      // Just mark all as completed for now
      pipelineStages.value.forEach((stage) => {
        if (stage.status !== 'error') {
          stage.status = 'completed'
        }
      })

      await new Promise(resolve => setTimeout(resolve, 500))

      uploadProgress.value = 100
      processingStatus.value = 'Batch completed!'
      lastProcessingResult.value = result

      // Clean up simulation
      cleanupSimulation()

      // Refresh graph stats and viz
      await Promise.all([loadGraphStats(), loadGraphVisualization()])

      return result
    } catch (error: any) {
      console.error('❌ Batch upload and process failed:', error)
      uploadError.value = error.response?.data?.detail || error.message

      // Stop simulation
      cleanupSimulation()

      // Mark all running or pending stages as error
      pipelineStages.value.forEach((stage) => {
        if (stage.status === 'running' || stage.status === 'pending') {
          stage.status = 'error'
          stage.error = uploadError.value || 'Batch processing failed'
        }
      })

      throw error
    } finally {
      isUploading.value = false
      isProcessing.value = false
    }
  }

  /**
   * Load graph statistics
   */
  async function loadGraphStats() {
    try {
      graphStats.value = await kgService.getStats()
    } catch (error) {
      console.error('Failed to load graph stats:', error)
      graphStats.value = null
    }
  }

  /**
   * Load graph visualization data
   */
  async function loadGraphVisualization(limit?: number) {
    try {
      const limitToUse = limit || visualizationLimit.value
      graphVisualization.value = await kgService.getVisualization(limitToUse)
    } catch (error) {
      console.error('Failed to load graph visualization:', error)
      graphVisualization.value = null
    }
  }

  /**
   * Load uploaded files list
   */
  async function loadUploadedFiles() {
    try {
      const response = await kgService.listUploadedFiles()
      uploadedFiles.value = response.files
    } catch (error) {
      console.error('Failed to load uploaded files:', error)
      uploadedFiles.value = []
    }
  }

  /**
   * Clear the entire graph
   */
  async function clearGraph() {
    try {
      await kgService.clearGraph()

      // Reset local state
      graphStats.value = null
      graphVisualization.value = null
      lastProcessingResult.value = null

      // Reload fresh stats (should be empty)
      await Promise.all([
        loadGraphStats(),
        loadGraphVisualization()
      ])

      console.log('✅ Graph cleared successfully')
    } catch (error) {
      console.error('Failed to clear graph:', error)
      throw error
    }
  }

  /**
   * Select a node in the visualization
   */
  function selectNode(nodeId: string | null) {
    selectedNodeId.value = nodeId
    selectedEdgeId.value = null
  }

  /**
   * Select an edge in the visualization
   */
  function selectEdge(edgeId: string | null) {
    selectedEdgeId.value = edgeId
    selectedNodeId.value = null
  }

  /**
   * Reset processing state
   */
  function resetProcessingState() {
    isUploading.value = false
    isProcessing.value = false
    uploadProgress.value = 0
    processingStatus.value = ''
    uploadError.value = null
  }

  /**
   * Initialize store (load initial data)
   */
  async function initialize() {
    await Promise.all([
      loadGraphStats(),
      loadGraphVisualization(),
      loadUploadedFiles(),
    ])
  }

  // ==================== Return ====================

  return {
    // State
    isUploading,
    isProcessing,
    uploadProgress,
    processingStatus,
    lastProcessingResult,
    uploadError,
    graphStats,
    graphVisualization,
    uploadedFiles,
    selectedNodeId,
    selectedEdgeId,
    visualizationLimit,
    pipelineStages,
    currentStageIndex,

    // Getters
    hasGraph,
    totalNodes,
    totalRelationships,
    nodesByLabel,
    relationshipsByType,
    isWorking,

    // Actions
    uploadAndProcess,
    uploadAndProcessBatch,
    loadGraphStats,
    loadGraphVisualization,
    loadUploadedFiles,
    clearGraph,
    selectNode,
    selectEdge,
    resetProcessingState,
    initialize,
    initializePipelineStages,
    updateStageStatus,
    updateStagesFromResult,
  }
})
