<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { NavigationSidebar } from './components/organisms/NavigationSidebar'
import { healthService } from '@/services'

// Lazy load views for better initial performance
const JarvisView = defineAsyncComponent(() => import('./views/JarvisView'))
const FeaturesView = defineAsyncComponent(() => import('./views/FeaturesView'))
const VoiceAssistantView = defineAsyncComponent(() => import('./views/VoiceAssistantView'))
const KGBuilderView = defineAsyncComponent(() => import('./views/KGBuilderView'))
const ArchitectureView = defineAsyncComponent(() => import('./views/ArchitectureView'))
const DataCollectorView = defineAsyncComponent(() => import('./views/DataCollectorView'))
const SettingsView = defineAsyncComponent(() => import('./views/SettingsView'))
const HardwareView = defineAsyncComponent(() => import('./views/HardwareView'))

// State
const currentPage = ref('jarvis')
const isHealthy = ref(false)

// Methods
async function checkHealth() {
  try {
    const response = await healthService.check()
    isHealthy.value = response.status === 'healthy'
  } catch (error) {
    isHealthy.value = false
    console.error('Health check failed:', error)
  }
}

function handleNavigate(page: string) {
  currentPage.value = page
}

// Lifecycle
onMounted(() => {
  checkHealth()
  setInterval(checkHealth, 30000)
})
</script>

<template>
  <div class="app-container">
    <!-- Animated Background -->
    <div class="background-animation">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Navigation Sidebar -->
      <NavigationSidebar
        :current-page="currentPage"
        :is-healthy="isHealthy"
        @navigate="handleNavigate"
      />

      <!-- Main Content Area -->
      <main class="content-area">
        <!-- Page Content -->
        <div class="page-container">
          <transition name="page-fade" mode="out-in">
            <JarvisView v-if="currentPage === 'jarvis'" key="jarvis" @navigate="handleNavigate" />
            <FeaturesView v-else-if="currentPage === 'features'" key="features" />
            <VoiceAssistantView v-else-if="currentPage === 'voice'" key="voice" />
            <KGBuilderView v-else-if="currentPage === 'kg-builder'" key="kg-builder" />
            <ArchitectureView v-else-if="currentPage === 'architecture'" key="architecture" />
            <DataCollectorView v-else-if="currentPage === 'data-collector'" key="data-collector" />
            <SettingsView v-else-if="currentPage === 'settings'" key="settings" />
            <HardwareView v-else-if="currentPage === 'hardware'" key="hardware" />
          </transition>
        </div>
      </main>
    </div>
  </div>
</template>

<style lang="scss">
@use '@/styles/main.scss';
</style>

<style lang="scss" scoped>
@use '@/styles' as *;

.app-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: $dark;
  overflow: hidden;
}

.background-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.6;
  animation: float 20s ease-in-out infinite;

  &.orb-1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(99, 102, 241, 0) 70%);
    top: -200px;
    left: -200px;
    animation-delay: 0s;
  }

  &.orb-2 {
    width: 384px;
    height: 384px;
    background: radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0) 70%);
    bottom: -150px;
    right: -150px;
    animation-delay: 7s;
  }

  &.orb-3 {
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0) 70%);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 14s;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(100px, -100px) scale(1.1);
  }
  66% {
    transform: translate(-100px, 100px) scale(0.9);
  }
}

.main-layout {
  position: relative;
  z-index: 10;
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.page-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

// Page Transition
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
