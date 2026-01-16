<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { useKGStore } from '@/stores/kgStore'
import { kgService } from '@/services'
import { KGFileUpload } from '@/components/organisms/KGFileUpload'
import { KGStatistics } from '@/components/organisms/KGStatistics'
import { KGGraphViewer } from '@/components/organisms/KGGraphViewer'
import { BaseButton } from '@/components/atoms'

const kgStore = useKGStore()
const activeSection = ref<'upload' | 'stats' | 'graph'>('upload')
const isClearing = ref(false)
const isExporting = ref(false)

// Initialize store on mount
onMounted(async () => {
  await kgStore.initialize()
})

// Methods
async function handleClearGraph() {
  try {
    await ElMessageBox.confirm(
      'Cela supprimera TOUS les nœuds et relations du graphe. Cette action est irréversible.',
      'Effacer le Graphe',
      {
        confirmButtonText: 'Effacer',
        cancelButtonText: 'Annuler',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    isClearing.value = true
    await kgStore.clearGraph()

    ElMessage.success({
      message: 'Graphe effacé avec succès',
      type: 'success',
      duration: 3000
    })
  } catch (error) {
    // User cancelled
    if (error !== 'cancel') {
      ElMessage.error({
        message: 'Erreur lors de l\'effacement du graphe',
        type: 'error',
        duration: 3000
      })
    }
  } finally {
    isClearing.value = false
  }
}

function navigateTo(section: 'upload' | 'stats' | 'graph') {
  activeSection.value = section
}

async function handleExport(format: 'json' | 'csv' | 'graphml') {
  try {
    isExporting.value = true

    switch (format) {
      case 'json':
        await kgService.downloadJsonExport()
        ElMessage.success('Export JSON téléchargé')
        break
      case 'csv':
        await kgService.downloadCsvExport()
        ElMessage.success('Export CSV téléchargé')
        break
      case 'graphml':
        await kgService.downloadGraphMLExport()
        ElMessage.success('Export GraphML téléchargé')
        break
    }
  } catch (error) {
    console.error('Export failed:', error)
    ElMessage.error('Erreur lors de l\'export')
  } finally {
    isExporting.value = false
  }
}
</script>

<template>
  <div class="kg-builder-view">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <i class="el-icon-data-analysis" />
            Knowledge Graph Builder
          </h1>
          <p class="page-subtitle">
            Build and explore your knowledge graph using AI-powered entity and relationship extraction
          </p>
        </div>

        <div class="header-actions">
          <!-- Export Dropdown -->
          <ElDropdown
            v-if="kgStore.hasGraph"
            trigger="click"
            :disabled="kgStore.isWorking || isExporting"
            @command="handleExport"
          >
            <BaseButton
              variant="secondary"
              :disabled="kgStore.isWorking || isExporting"
              :loading="isExporting"
            >
              <i v-if="!isExporting" class="el-icon-download" />
              {{ isExporting ? 'Export...' : 'Exporter' }}
              <i class="el-icon-arrow-down" style="margin-left: 6px" />
            </BaseButton>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem command="json">
                  <i class="el-icon-document" />
                  JSON (avec embeddings)
                </ElDropdownItem>
                <ElDropdownItem command="csv">
                  <i class="el-icon-document-copy" />
                  CSV (ZIP)
                </ElDropdownItem>
                <ElDropdownItem command="graphml">
                  <i class="el-icon-share" />
                  GraphML (Gephi, yEd)
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>

          <!-- Clear Graph Button -->
          <BaseButton
            v-if="kgStore.hasGraph"
            variant="error"
            @click="handleClearGraph"
            :disabled="kgStore.isWorking || isClearing"
            :loading="isClearing"
          >
            <i v-if="!isClearing" class="el-icon-delete" />
            {{ isClearing ? 'Effacement...' : 'Effacer le Graphe' }}
          </BaseButton>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="nav-tabs">
        <button
          class="nav-tab"
          :class="{ active: activeSection === 'upload' }"
          @click="navigateTo('upload')"
        >
          <i class="el-icon-upload" />
          <span>Upload</span>
        </button>
        <button
          class="nav-tab"
          :class="{ active: activeSection === 'stats' }"
          @click="navigateTo('stats')"
        >
          <i class="el-icon-data-line" />
          <span>Statistics</span>
          <span v-if="kgStore.totalNodes > 0" class="badge">
            {{ kgStore.totalNodes }}
          </span>
        </button>
        <button
          class="nav-tab"
          :class="{ active: activeSection === 'graph' }"
          @click="navigateTo('graph')"
        >
          <i class="el-icon-share" />
          <span>Graph</span>
        </button>
      </nav>
    </header>

    <!-- Content -->
    <main class="page-content">
      <!-- Upload Section -->
      <section v-show="activeSection === 'upload'" class="content-section">
        <div class="section-intro">
          <h2 class="section-title">Upload Document</h2>
          <p class="section-description">
            Upload a CSV, JSON, PDF, or TXT file to extract entities and relationships.
            The AI will automatically identify people, organizations, events, and their connections.
          </p>
        </div>

        <KGFileUpload />

        <!-- Instructions -->
        <div class="instructions-card">
          <h3>
            <i class="el-icon-info" />
            How it works
          </h3>
          <ol>
            <li>Upload a structured or unstructured document</li>
            <li>AI agents (Claude) analyze the content</li>
            <li>Entities and relationships are extracted</li>
            <li>Data is stored in Neo4j graph database</li>
            <li>Explore your knowledge graph visually</li>
          </ol>
        </div>
      </section>

      <!-- Statistics Section -->
      <section v-show="activeSection === 'stats'" class="content-section">
        <div class="section-intro">
          <h2 class="section-title">Graph Statistics</h2>
          <p class="section-description">
            Overview of your knowledge graph with entity and relationship counts.
          </p>
        </div>

        <KGStatistics />
      </section>

      <!-- Graph Section -->
      <section v-show="activeSection === 'graph'" class="content-section">
        <div class="section-intro">
          <h2 class="section-title">Graph Explorer</h2>
          <p class="section-description">
            Browse and search through nodes and relationships in your knowledge graph.
          </p>
        </div>

        <KGGraphViewer />
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped src="./KGBuilderView.scss"></style>
