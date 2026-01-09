<script setup lang="ts">
import { ref } from 'vue'
import { Headset, DataAnalysis, Setting, DArrowLeft, DArrowRight } from '@element-plus/icons-vue'
import BaseIcon from '@/components/atoms/BaseIcon.vue'

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
    id: 'voice',
    label: 'Voice Assistant',
    icon: Headset,
  },
  {
    id: 'kg-builder',
    label: 'KG Builder',
    icon: DataAnalysis,
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
            <div class="health-indicator" :class="{ healthy: isHealthy }" :title="isHealthy ? 'Connecté' : 'Déconnecté'" />
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
      <button class="nav-item" :title="isCollapsed ? 'Settings' : ''">
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

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.navigation-sidebar {
  @include glass-effect;
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 100vh;
  padding: 1.5rem;
  gap: 2rem;
  transition: width 0.3s ease;
  position: relative;
  z-index: 100;

  &.collapsed {
    width: 88px;
    padding: 1.5rem 0.75rem;

    .sidebar-header {
      flex-direction: column;
      gap: 1rem;

      .logo-section {
        justify-content: center;
      }

      .toggle-btn {
        position: static;
        width: 100%;
      }
    }

    .nav-item {
      justify-content: center;
      padding: 0.875rem;
    }
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;

  .logo-section {
    display: flex;
    align-items: center;
    gap: 1rem;

    .logo-icon {
      width: 48px;
      height: 48px;
      @include gradient-primary;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba($primary, 0.4);
    }

    .logo-text {
      .logo-title-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      h1 {
        font-size: 1.5rem;
        font-weight: 800;
        @include gradient-primary;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: 2px;
        margin: 0;
      }

      .health-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: $error;
        box-shadow: 0 0 8px rgba($error, 0.6);
        transition: all 0.3s ease;

        &.healthy {
          background: $success;
          box-shadow: 0 0 8px rgba($success, 0.6);
        }
      }

      p {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.5);
        margin: 0;
        letter-spacing: 1px;
      }
    }
  }

  .toggle-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    i {
      font-size: 1rem;
    }
  }
}

.nav-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
  }
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid transparent;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 24px;
  }

  .nav-label {
    white-space: nowrap;
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
    transform: translateX(4px);
  }

  &.active {
    @include gradient-primary;
    color: white;
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 12px rgba($primary, 0.3);
  }
}

.sidebar-footer {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .navigation-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;

    &:not(.collapsed) {
      box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
