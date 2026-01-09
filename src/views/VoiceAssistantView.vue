<script setup lang="ts">
import { computed, ref } from 'vue'
import { Microphone, ChatDotRound } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import VoiceRecorder from '@/components/organisms/VoiceRecorder.vue'
import ConversationHistory from '@/components/organisms/ConversationHistory.vue'
import ConversationSidebar from '@/components/organisms/ConversationSidebar.vue'
import TextInput from '@/components/molecules/TextInput.vue'
import { useConversationStore } from '@/stores/conversation'
import { jarvisApi } from '@/services/api'

const conversationStore = useConversationStore()
const textInputRef = ref<InstanceType<typeof TextInput> | null>(null)

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

// Handle text message
async function handleTextMessage(text: string) {
  if (textInputRef.value) {
    textInputRef.value.setLoading(true)
  }

  try {
    // Ensure we have a conversation
    await conversationStore.ensureConversation()

    // Process text message
    const result = await jarvisApi.processText(
      text,
      conversationStore.currentConversationId || undefined
    )

    // Add messages to store with temporary IDs
    conversationStore.addMessage({
      id: Date.now(), // Temporary ID
      role: 'user',
      content: result.transcription,
      audio_url: null,
      created_at: new Date().toISOString(),
    })

    conversationStore.addMessage({
      id: Date.now() + 1, // Temporary ID
      role: 'assistant',
      content: result.response,
      audio_url: result.audio_url,
      created_at: new Date().toISOString(),
    })

    ElMessage.success('Message envoyé')
  } catch (error: any) {
    console.error('Text message error:', error)
    ElMessage.error(error.response?.data?.detail || 'Erreur lors de l\'envoi du message')
  } finally {
    if (textInputRef.value) {
      textInputRef.value.setLoading(false)
    }
  }
}
</script>

<template>
  <div class="voice-assistant-view">
    <!-- Main Grid Layout -->
    <div class="assistant-grid">
      <!-- Conversation Sidebar -->
      <div class="sidebar-section">
        <ConversationSidebar />
      </div>

      <!-- Voice Recorder Card -->
      <div class="recorder-section">
        <div class="recorder-card">
          <div class="card-title">
            <BaseIcon :size="24" color="#667eea">
              <Microphone />
            </BaseIcon>
            <span>Assistant Vocal</span>
          </div>

          <VoiceRecorder size="large" :show-waveform="true" :icon-size="56" />

          <p class="recorder-hint">
            Maintenez le bouton pour parler avec Jarvis
          </p>

          <!-- Text Input Alternative -->
          <div class="text-mode-divider">
            <span>ou</span>
          </div>

          <TextInput ref="textInputRef" @send="handleTextMessage" />
        </div>
      </div>

      <!-- Conversation Content -->
      <div class="content-section">
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

        <!-- Messages -->
        <div class="conversation-content">
          <ConversationHistory />
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
  padding: 2rem;
  overflow: hidden;
}

.assistant-grid {
  display: grid;
  grid-template-columns: 320px 420px 1fr;
  gap: 1.5rem;
  height: 100%;
  overflow: hidden;
}

.sidebar-section,
.recorder-section,
.content-section {
  @include glass-effect;
  border-radius: 1.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
}

.sidebar-section {
  overflow: hidden;
}

.recorder-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.recorder-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;

  .card-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }

  .recorder-hint {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    max-width: 280px;
  }

  .text-mode-divider {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 0.5rem 0;

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
    }

    span {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
}

.content-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.conversation-topbar {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);

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

.conversation-content {
  flex: 1;
  overflow: hidden;
  padding: 1.5rem;
  animation: fadeIn 0.3s ease;
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

@media (max-width: 1280px) {
  .assistant-grid {
    grid-template-columns: 280px 1fr;
    grid-template-rows: auto 1fr;

    .recorder-section {
      grid-column: 1 / -1;
    }

    .content-section {
      grid-column: 2 / -1;
    }
  }
}

@media (max-width: 768px) {
  .voice-assistant-view {
    padding: 1rem;
  }

  .assistant-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto 1fr;
    gap: 1rem;

    .sidebar-section {
      max-height: 200px;
    }

    .recorder-section,
    .content-section {
      grid-column: 1;
    }
  }
}
</style>
