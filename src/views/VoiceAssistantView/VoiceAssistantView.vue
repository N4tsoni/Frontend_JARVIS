<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChatDotRound } from '@element-plus/icons-vue'
import { BaseIcon } from '@/components/atoms'
import { VoiceRecorder } from '@/components/organisms/VoiceRecorder'
import { ConversationHistory } from '@/components/organisms/ConversationHistory'
import { ConversationSidebar } from '@/components/organisms/ConversationSidebar'
import { useConversationStore } from '@/stores/conversationStore'

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
              placeholder="Ecrivez votre message..."
              class="compact-textarea"
              rows="1"
              @keypress.enter.exact.prevent="handleTextMessage(textMessage)"
            />
          </div>
          <button
            class="send-button"
            :disabled="!textMessage.trim()"
            @click="handleTextMessage(textMessage)"
          >
            Envoyer
          </button>
          <div class="voice-button-wrapper">
            <VoiceRecorder
              size="small"
              :show-waveform="false"
              :icon-size="18"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./VoiceAssistantView.scss"></style>
