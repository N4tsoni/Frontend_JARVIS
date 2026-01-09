<script setup lang="ts">
import { ref, computed } from 'vue'
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

// Text input
const textMessage = ref('')

async function handleTextMessage(message: string) {
  if (!message.trim()) return
  await conversationStore.sendTextMessage(message)
  textMessage.value = ''
}
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

        <!-- Input Controls at Bottom -->
        <div class="recorder-footer">
          <div class="input-wrapper">
            <textarea
              v-model="textMessage"
              placeholder="Écrivez votre message..."
              class="compact-textarea"
              rows="1"
              @keypress.enter.exact.prevent="handleTextMessage(textMessage)"
            />
          </div>
          <div class="controls-wrapper">
            <VoiceRecorder
              size="small"
              :show-waveform="false"
              :icon-size="28"
            />
            <button
              class="send-button"
              :disabled="!textMessage.trim()"
              @click="handleTextMessage(textMessage)"
            >
              Envoyer
            </button>
          </div>
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

// Input Controls Footer
.recorder-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.input-wrapper {
  flex: 1;
  max-width: 600px;
}

.compact-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  color: white;
  font-size: 0.875rem;
  font-family: inherit;
  resize: none;
  min-height: 36px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: $primary;
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
}

.controls-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.send-button {
  @include gradient-primary;
  border: none;
  border-radius: 0.375rem;
  padding: 0.375rem 0.75rem;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba($primary, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .input-wrapper {
    max-width: 100%;
  }

  .controls-wrapper {
    flex-direction: row;
    gap: 0.5rem;
  }
}
</style>
