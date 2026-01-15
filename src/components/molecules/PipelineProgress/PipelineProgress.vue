<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  stages: Array<{
    name: string
    status: 'pending' | 'running' | 'completed' | 'error'
  }>
  currentStage: number
}

const props = defineProps<Props>()

const progress = computed(() => {
  const total = props.stages.length
  const completed = props.stages.filter(s => s.status === 'completed').length
  return (completed / total) * 100
})
</script>

<template>
  <div class="pipeline-progress">
    <!-- Running Man Animation -->
    <div class="runner-track">
      <div class="runner" :style="{ left: `${progress}%` }">
        <div class="runner-body">
          🏃‍♂️
        </div>
      </div>
      <div class="track-line" />
      <div class="track-progress" :style="{ width: `${progress}%` }" />
    </div>

    <!-- Pipeline Stages -->
    <div class="stages-list">
      <div
        v-for="(stage, index) in stages"
        :key="index"
        class="stage-item"
        :class="{
          'is-completed': stage.status === 'completed',
          'is-running': stage.status === 'running',
          'is-error': stage.status === 'error'
        }"
      >
        <div class="stage-icon">
          <div v-if="stage.status === 'completed'" class="icon-check">✓</div>
          <div v-else-if="stage.status === 'running'" class="icon-spinner" />
          <div v-else-if="stage.status === 'error'" class="icon-error">✗</div>
          <div v-else class="icon-pending">{{ index + 1 }}</div>
        </div>
        <div class="stage-name">{{ stage.name }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./PipelineProgress.scss"></style>
