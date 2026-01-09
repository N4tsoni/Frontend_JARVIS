<script setup lang="ts">
import { computed } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import VoiceRecorder from '@/components/organisms/VoiceRecorder.vue'
import ConversationHistory from '@/components/organisms/ConversationHistory.vue'
import ConversationSidebar from '@/components/organisms/ConversationSidebar.vue'
import { useConversationStore } from '@/stores/conversation'

const conversationStore = useConversationStore()

const messageCount = computed(() => conversationStore.messageCount)
const conversationTitle = computed(() => {
  if (!conversationStore.currentConversationId) return 'Nouvelle conversation'
  const messages = conversationStore.currentMessages
  if (messages.length === 0) return 'Conversation vide'
  // Get first user message as title
  const firstUserMessage = messages.find(m => m.role === 'user')
  if (firstUserMessage) {
    const preview = firstUserMessage.content.substring(0, 50)
    return preview.length < firstUserMessage.content.length ? `${preview}...` : preview
  }
  return 'Conversation'
})
</script>

<template>
  <div class="voice-assistant-view">
    <!-- Main Layout: Sidebar + Chat -->
    <div class="assistant-layout">
      <!-- Left: Conversation Sidebar -->
      <div class="sidebar-section">
        <ConversationSidebar />
      </div>

      <!-- Right: Chat Interface -->
      <div class="chat-section">
        <!-- Top Bar -->
        <div class="conversation-topbar">
          <div class="topbar-content">
            <BaseIcon :size="20" color="#667eea">
              <ChatDotRound />
            </BaseIcon>
            <h2 class="conversation-title">{{ conversationTitle }}</h2>
            <div v-if="messageCount > 0" class="message-count">
              {{ messageCount }}
            </div>
          </div>
        </div>

        <!-- Messages Area (scrollable) -->
        <div class="messages-area">
          <ConversationHistory />
        </div>

        <!-- Voice Recorder at Bottom -->
        <div class="recorder-footer">
          <VoiceRecorder
            size="medium"
            :show-waveform="true"
            :icon-size="40"
          />
          <p class="recorder-hint">
            Maintenez le bouton pour parler avec Jarvis
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.voice-assistant-view {
  width: 100%;
  height: 100vh;
  padding: 1.5rem;
  overflow: hidden;
}

.assistant-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1.5rem;
  height: 100%;
  overflow: hidden;
}

// Left Sidebar
.sidebar-section {
  @include glass-effect;
  border-radius: 1.5rem;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
}

// Right Chat Section
.chat-section {
  @include glass-effect;
  border-radius: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
}

// Top Bar
.conversation-topbar {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  flex-shrink: 0;

  .topbar-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    .conversation-title {
      flex: 1;
      font-size: 1rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .message-count {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 28px;
      height: 28px;
      padding: 0 0.5rem;
      background: rgba($primary, 0.2);
      border: 1px solid rgba($primary, 0.4);
      border-radius: 14px;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.75rem;
      font-weight: 600;
    }
  }
}

// Messages Area (scrollable)
.messages-area {
  flex: 1;
  overflow: hidden;
  padding: 1.5rem;
  animation: fadeIn 0.3s ease;
}

// Voice Recorder Footer
.recorder-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;

  .recorder-hint {
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    margin: 0;
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

// Responsive Design
@media (max-width: 1024px) {
  .assistant-layout {
    grid-template-columns: 280px 1fr;
  }
}

@media (max-width: 768px) {
  .voice-assistant-view {
    padding: 1rem;
  }

  .assistant-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    gap: 1rem;

    .sidebar-section {
      max-height: 250px;
    }
  }

  .recorder-footer {
    padding: 1rem;
  }
}
</style>
