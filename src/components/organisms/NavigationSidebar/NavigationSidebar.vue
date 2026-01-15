<script setup lang="ts">
import { ref } from 'vue'
import {
  Headset,
  DataAnalysis,
  Setting,
  DArrowLeft,
  DArrowRight,
  InfoFilled,
  Share,
  Download,
  Service,
} from '@element-plus/icons-vue'
import BaseIcon from '../../atoms/BaseIcon.vue'

interface Props {
  currentPage: string
  isHealthy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isHealthy: false
})
const emit = defineEmits<{
  navigate: [page: string]
}>()

const isCollapsed = ref(false)

const navItems = [
  {
    id: 'jarvis',
    label: 'Jarvis',
    icon: Service,
  },
  {
    id: 'features',
    label: 'Features',
    icon: InfoFilled,
  },
  {
    id: 'voice',
    label: 'Voice Assistant',
    icon: Headset,
  },
  {
    id: 'kg-builder',
    label: 'KG Builder',
    icon: DataAnalysis,
  },
  {
    id: 'architecture',
    label: 'Architecture',
    icon: Share,
  },
  {
    id: 'data-collector',
    label: 'Data Collector',
    icon: Download,
  },
]

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

function navigateTo(page: string) {
  emit('navigate', page)
}
</script>

<template>
  <aside class="navigation-sidebar" :class="{ collapsed: isCollapsed }">
    <!-- Header -->
    <div class="sidebar-header">
      <div class="logo-section">
        <div class="logo-icon">
          <BaseIcon :size="28" color="white">
            <Headset />
          </BaseIcon>
        </div>
        <div v-if="!isCollapsed" class="logo-text">
          <div class="logo-title-row">
            <h1>JARVIS</h1>
            <div class="health-indicator" :class="{ healthy: isHealthy }" :title="isHealthy ? 'Connecte' : 'Deconnecte'" />
          </div>
          <p>AI Assistant</p>
        </div>
      </div>

      <button class="toggle-btn" @click="toggleSidebar">
        <BaseIcon :size="16">
          <DArrowRight v-if="isCollapsed" />
          <DArrowLeft v-else />
        </BaseIcon>
      </button>
    </div>

    <!-- Navigation Items -->
    <nav class="nav-items">
      <button
        v-for="item in navItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: currentPage === item.id }"
        @click="navigateTo(item.id)"
        :title="isCollapsed ? item.label : ''"
      >
        <div class="nav-icon">
          <BaseIcon :size="24">
            <component :is="item.icon" />
          </BaseIcon>
        </div>
        <span v-if="!isCollapsed" class="nav-label">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <button
        class="nav-item"
        :class="{ active: currentPage === 'settings' }"
        :title="isCollapsed ? 'Settings' : ''"
        @click="$emit('navigate', 'settings')"
      >
        <div class="nav-icon">
          <BaseIcon :size="24">
            <Setting />
          </BaseIcon>
        </div>
        <span v-if="!isCollapsed" class="nav-label">Settings</span>
      </button>
    </div>
  </aside>
</template>

<style lang="scss" scoped src="./NavigationSidebar.scss"></style>
