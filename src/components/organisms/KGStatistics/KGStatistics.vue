<script setup lang="ts">
import { computed } from 'vue'
import { useKGStore } from '@/stores/kgStore'
import { StatCard } from '../../molecules'

const kgStore = useKGStore()

// Computed
const nodesByLabelArray = computed(() => {
  return Object.entries(kgStore.nodesByLabel).map(([label, count]) => ({
    label,
    count
  }))
})

const relationshipsByTypeArray = computed(() => {
  return Object.entries(kgStore.relationshipsByType).map(([type, count]) => ({
    type,
    count
  }))
})

const hasStats = computed(() => kgStore.graphStats !== null)
</script>

<template>
  <div class="kg-statistics">
    <!-- No data state -->
    <div v-if="!hasStats" class="no-data">
      <i class="el-icon-data-analysis" />
      <p>No graph data available yet</p>
      <p class="subtitle">Upload a document to get started</p>
    </div>

    <!-- Stats Grid -->
    <div v-else class="stats-container">
      <!-- Overview Cards -->
      <div class="overview-grid">
        <StatCard
          label="Total Nodes"
          :value="kgStore.totalNodes"
          variant="primary"
        >
          <template #icon>
            <i class="el-icon-coin" />
          </template>
        </StatCard>
        <StatCard
          label="Total Relationships"
          :value="kgStore.totalRelationships"
          variant="success"
        >
          <template #icon>
            <i class="el-icon-connection" />
          </template>
        </StatCard>
      </div>

      <!-- Detailed Stats -->
      <div class="detailed-stats">
        <!-- Nodes by Label -->
        <div class="stat-section">
          <h3 class="section-title">
            <i class="el-icon-coin" />
            Nodes by Type
          </h3>
          <div class="stat-list">
            <div
              v-for="item in nodesByLabelArray"
              :key="item.label"
              class="stat-item"
            >
              <span class="stat-label">{{ item.label }}</span>
              <span class="stat-value">{{ item.count }}</span>
            </div>
            <div v-if="nodesByLabelArray.length === 0" class="empty-message">
              No nodes yet
            </div>
          </div>
        </div>

        <!-- Relationships by Type -->
        <div class="stat-section">
          <h3 class="section-title">
            <i class="el-icon-connection" />
            Relationships by Type
          </h3>
          <div class="stat-list">
            <div
              v-for="item in relationshipsByTypeArray"
              :key="item.type"
              class="stat-item"
            >
              <span class="stat-label">{{ item.type }}</span>
              <span class="stat-value">{{ item.count }}</span>
            </div>
            <div v-if="relationshipsByTypeArray.length === 0" class="empty-message">
              No relationships yet
            </div>
          </div>
        </div>
      </div>

      <!-- Last Processing Result -->
      <div v-if="kgStore.lastProcessingResult && 'extraction' in kgStore.lastProcessingResult" class="processing-result">
        <h3 class="section-title">
          <i class="el-icon-check" />
          Last Processing Result
        </h3>
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">Entities Extracted</span>
            <span class="result-value">
              {{ kgStore.lastProcessingResult.extraction?.entities_extracted ?? 0 }}
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">Relations Extracted</span>
            <span class="result-value">
              {{ kgStore.lastProcessingResult.extraction?.relations_extracted ?? 0 }}
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">Entities Stored</span>
            <span class="result-value success">
              {{ kgStore.lastProcessingResult.storage?.entities_stored ?? 0 }}
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">Relations Stored</span>
            <span class="result-value success">
              {{ kgStore.lastProcessingResult.storage?.relations_stored ?? 0 }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./KGStatistics.scss"></style>
