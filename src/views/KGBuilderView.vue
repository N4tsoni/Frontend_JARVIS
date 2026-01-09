<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useKGStore } from '@/stores/kg'
import KGFileUpload from '@/components/organisms/KGFileUpload.vue'
import KGStatistics from '@/components/organisms/KGStatistics.vue'
import KGGraphViewer from '@/components/organisms/KGGraphViewer.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const kgStore = useKGStore()
const activeSection = ref<'upload' | 'stats' | 'graph'>('upload')

// Initialize store on mount
onMounted(async () => {
  await kgStore.initialize()
})

// Methods
async function handleClearGraph() {
  try {
    await ElMessageBox.confirm(
      'This will delete ALL nodes and relationships from the graph. This action cannot be undone.',
      'Clear Graph',
      {
        confirmButtonText: 'Clear Graph',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )

    await kgStore.clearGraph()
    ElMessage.success('Graph cleared successfully')
  } catch (error) {
    // User cancelled
    if (error !== 'cancel') {
      ElMessage.error('Failed to clear graph')
    }
  }
}

function navigateTo(section: 'upload' | 'stats' | 'graph') {
  activeSection.value = section
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
          <BaseButton
            v-if="kgStore.hasGraph"
            variant="error"
            @click="handleClearGraph"
            :disabled="kgStore.isWorking"
          >
            <i class="el-icon-delete" />
            Clear Graph
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

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.kg-builder-view {
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.5);
    border-radius: 4px;

    &:hover {
      background: rgba(102, 126, 234, 0.7);
    }
  }
}

.page-header {
  margin-bottom: 2rem;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    .title-section {
      flex: 1;

      .page-title {
        font-size: 2.5rem;
        font-weight: 800;
        color: white;
        margin-bottom: 0.75rem;
        display: flex;
        align-items: center;
        gap: 1rem;

        i {
          @include gradient-primary;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 2.5rem;
        }
      }

      .page-subtitle {
        font-size: 1.125rem;
        color: rgba(255, 255, 255, 0.7);
        max-width: 600px;
      }
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
  }

  .nav-tabs {
    @include glass-effect;
    padding: 0.5rem;
    border-radius: 1rem;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;

    .nav-tab {
      flex: 1;
      min-width: 120px;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid transparent;
      border-radius: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      position: relative;

      i {
        font-size: 1.25rem;
      }

      .badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: $primary;
        color: white;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.125rem 0.5rem;
        border-radius: 1rem;
      }

      &:hover:not(.active) {
        background: rgba(255, 255, 255, 0.05);
        color: rgba(255, 255, 255, 0.8);
      }

      &.active {
        @include gradient-primary;
        color: white;
        border-color: rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
      }
    }
  }
}

.page-content {
  .content-section {
    animation: fadeIn 0.3s ease-in-out;

    .section-intro {
      margin-bottom: 2rem;

      .section-title {
        font-size: 1.75rem;
        font-weight: 700;
        color: white;
        margin-bottom: 0.5rem;
      }

      .section-description {
        font-size: 1rem;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.6;
      }
    }
  }
}

.instructions-card {
  @include glass-effect;
  padding: 1.5rem;
  border-radius: 1rem;
  margin-top: 2rem;
  border-left: 4px solid $primary;

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      color: $primary;
    }
  }

  ol {
    list-style-position: inside;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9375rem;
    line-height: 1.8;

    li {
      margin-bottom: 0.5rem;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .kg-builder-view {
    padding: 1rem;
  }

  .page-header {
    .header-content {
      flex-direction: column;
      align-items: stretch;

      .title-section .page-title {
        font-size: 2rem;
      }
    }

    .nav-tabs {
      .nav-tab {
        flex: 1 1 100%;
      }
    }
  }
}
</style>
