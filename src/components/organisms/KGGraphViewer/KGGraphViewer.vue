<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useKGStore } from '@/stores/kgStore'
import BaseButton from '../../atoms/BaseButton.vue'

const kgStore = useKGStore()

// State
const activeTab = ref<'nodes' | 'edges'>('nodes')
const searchQuery = ref('')
const selectedLimit = ref(100)

// Computed
const filteredNodes = computed(() => {
  if (!kgStore.graphVisualization) return []

  const query = searchQuery.value.toLowerCase()
  return kgStore.graphVisualization.nodes.filter(node =>
    node.properties.name?.toLowerCase().includes(query) ||
    node.label.toLowerCase().includes(query)
  )
})

const filteredEdges = computed(() => {
  if (!kgStore.graphVisualization) return []

  const query = searchQuery.value.toLowerCase()
  return kgStore.graphVisualization.edges.filter(edge =>
    edge.type.toLowerCase().includes(query)
  )
})

const hasData = computed(() => {
  return kgStore.graphVisualization &&
         (kgStore.graphVisualization.nodes.length > 0 ||
          kgStore.graphVisualization.edges.length > 0)
})

// Methods
async function handleLoadData() {
  await kgStore.loadGraphVisualization(selectedLimit.value)
}

function getNodeName(node: any): string {
  return node.properties.name || node.id
}

function getNodeLabel(node: any): string {
  return node.label
}

function getEdgeLabel(edge: any): string {
  // Find node names
  const fromNode = kgStore.graphVisualization?.nodes.find(n => n.id === edge.from)
  const toNode = kgStore.graphVisualization?.nodes.find(n => n.id === edge.to)

  const fromName = fromNode?.properties.name || 'Unknown'
  const toName = toNode?.properties.name || 'Unknown'

  return `${fromName} → ${toName}`
}

function selectNode(nodeId: string) {
  kgStore.selectNode(nodeId)
}

function selectEdge(edgeId: string) {
  kgStore.selectEdge(edgeId)
}

onMounted(() => {
  if (!kgStore.graphVisualization) {
    handleLoadData()
  }
})
</script>

<template>
  <div class="kg-graph-viewer">
    <!-- Header -->
    <div class="viewer-header">
      <h2 class="viewer-title">
        <i class="el-icon-share" />
        Graph Data
      </h2>

      <div class="header-actions">
        <select v-model="selectedLimit" @change="handleLoadData" class="limit-select">
          <option :value="50">50 nodes</option>
          <option :value="100">100 nodes</option>
          <option :value="200">200 nodes</option>
          <option :value="500">500 nodes</option>
        </select>

        <BaseButton
          variant="secondary"
          @click="handleLoadData"
          :disabled="kgStore.isWorking"
        >
          <i class="el-icon-refresh" />
          Refresh
        </BaseButton>
      </div>
    </div>

    <!-- No Data State -->
    <div v-if="!hasData" class="no-data">
      <i class="el-icon-share" />
      <p>No graph data available</p>
      <p class="subtitle">Upload and process a document first</p>
    </div>

    <!-- Graph Data -->
    <div v-else class="graph-data">
      <!-- Search -->
      <div class="search-bar">
        <i class="el-icon-search" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search nodes or relationships..."
          class="search-input"
        />
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          class="tab"
          :class="{ active: activeTab === 'nodes' }"
          @click="activeTab = 'nodes'"
        >
          <i class="el-icon-coin" />
          Nodes ({{ filteredNodes.length }})
        </button>
        <button
          class="tab"
          :class="{ active: activeTab === 'edges' }"
          @click="activeTab = 'edges'"
        >
          <i class="el-icon-connection" />
          Relationships ({{ filteredEdges.length }})
        </button>
      </div>

      <!-- Nodes List -->
      <div v-if="activeTab === 'nodes'" class="content-list">
        <div
          v-for="node in filteredNodes"
          :key="node.id"
          class="list-item node-item"
          :class="{ selected: kgStore.selectedNodeId === node.id }"
          @click="selectNode(node.id)"
        >
          <div class="item-header">
            <span class="item-label" :class="`label-${node.label.toLowerCase()}`">
              {{ getNodeLabel(node) }}
            </span>
            <span class="item-name">{{ getNodeName(node) }}</span>
          </div>

          <div v-if="kgStore.selectedNodeId === node.id" class="item-details">
            <div class="properties">
              <div
                v-for="(value, key) in node.properties"
                :key="key"
                class="property"
              >
                <span class="property-key">{{ key }}:</span>
                <span class="property-value">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edges List -->
      <div v-if="activeTab === 'edges'" class="content-list">
        <div
          v-for="edge in filteredEdges"
          :key="edge.id"
          class="list-item edge-item"
          :class="{ selected: kgStore.selectedEdgeId === edge.id }"
          @click="selectEdge(edge.id)"
        >
          <div class="item-header">
            <span class="item-label relation-label">
              {{ edge.type }}
            </span>
            <span class="item-name">{{ getEdgeLabel(edge) }}</span>
          </div>

          <div v-if="kgStore.selectedEdgeId === edge.id" class="item-details">
            <div class="properties">
              <div
                v-for="(value, key) in edge.properties"
                :key="key"
                class="property"
              >
                <span class="property-key">{{ key }}:</span>
                <span class="property-value">{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Future: Interactive Visualization Placeholder -->
    <div class="future-viz-note">
      <i class="el-icon-info" />
      <span>Interactive D3.js visualization coming in Sprint 2!</span>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./KGGraphViewer.scss"></style>
