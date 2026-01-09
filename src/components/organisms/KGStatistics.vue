<script setup lang="ts">
import { computed } from 'vue'
import { useKGStore } from '@/stores/kg'
import StatCard from '@/components/molecules/StatCard.vue'

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
      <div v-if="kgStore.lastProcessingResult" class="processing-result">
        <h3 class="section-title">
          <i class="el-icon-check" />
          Last Processing Result
        </h3>
        <div class="result-grid">
          <div class="result-item">
            <span class="result-label">Entities Extracted</span>
            <span class="result-value">
              {{ kgStore.lastProcessingResult.extraction.entities_extracted }}
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">Relations Extracted</span>
            <span class="result-value">
              {{ kgStore.lastProcessingResult.extraction.relations_extracted }}
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">Entities Stored</span>
            <span class="result-value success">
              {{ kgStore.lastProcessingResult.storage.entities_stored }}
            </span>
          </div>
          <div class="result-item">
            <span class="result-label">Relations Stored</span>
            <span class="result-value success">
              {{ kgStore.lastProcessingResult.storage.relations_stored }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.kg-statistics {
  width: 100%;
}

.no-data {
  @include glass-effect;
  padding: 3rem 2rem;
  border-radius: 1rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);

  i {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: rgba(102, 126, 234, 0.5);
  }

  p {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
  }
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detailed-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.stat-section {
  @include glass-effect;
  padding: 1.5rem;
  border-radius: 1rem;

  .section-title {
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

  .stat-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.5rem;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }

      .stat-label {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9375rem;
      }

      .stat-value {
        color: white;
        font-weight: 600;
        font-size: 1rem;
        padding: 0.25rem 0.75rem;
        background: rgba(102, 126, 234, 0.2);
        border-radius: 0.375rem;
      }
    }

    .empty-message {
      text-align: center;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.875rem;
      padding: 2rem 1rem;
    }
  }
}

.processing-result {
  @include glass-effect;
  padding: 1.5rem;
  border-radius: 1rem;

  .section-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: white;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    i {
      color: $success;
    }
  }

  .result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;

    .result-item {
      display: flex;
      flex-direction: column;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 0.5rem;
      text-align: center;

      .result-label {
        font-size: 0.8125rem;
        color: rgba(255, 255, 255, 0.6);
        margin-bottom: 0.5rem;
      }

      .result-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;

        &.success {
          color: $success;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .overview-grid,
  .detailed-stats {
    grid-template-columns: 1fr;
  }

  .result-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
