<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElScrollbar, ElMessageBox } from 'element-plus'
import { ChatLineRound, ChatDotRound, Delete, User, Cpu } from '@element-plus/icons-vue'
import { BaseButton, BaseIcon } from '../../atoms'
import { MessageBubble, AudioPlayer } from '../../molecules'
import { useConversationStore } from '@/stores/conversationStore'
import type { Message } from '@/models'

// Store
const conversationStore = useConversationStore()

// State
const playingMessageId = ref<number | null>(null)

// Computed
const messages = computed(() => conversationStore.currentMessages)

// Methods
function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isPlayingMessage(messageId: number): boolean {
  return playingMessageId.value === messageId
}

async function toggleAudio(message: Message) {
  if (!message.audio_url) return

  try {
    if (isPlayingMessage(message.id)) {
      conversationStore.stopAudio()
      playingMessageId.value = null
    } else {
      playingMessageId.value = message.id
      await conversationStore.playAudio(message.audio_url)
      playingMessageId.value = null
    }
  } catch (error) {
    console.error('Erreur lecture audio:', error)
    playingMessageId.value = null
  }
}

async function handleClear() {
  if (!conversationStore.currentConversationId) return

  try {
    await ElMessageBox.confirm(
      'Êtes-vous sûr de vouloir supprimer cette conversation ?',
      'Confirmation',
      {
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        type: 'warning',
      }
    )
    await conversationStore.deleteConversation(conversationStore.currentConversationId)
  } catch {
    // Cancelled
  }
}
</script>

<template>
  <div class="conversation-history flex flex-col h-full gap-4">
    <!-- Header -->
    <div v-if="messages.length > 0" class="flex items-center justify-between p-3 glass-effect rounded-xl">
      <div class="flex items-center gap-2 text-sm text-white/80">
        <BaseIcon :size="20" color="#667eea">
          <ChatLineRound />
        </BaseIcon>
        <span>{{ messages.length }} messages</span>
      </div>
      <BaseButton variant="ghost" size="sm" @click="handleClear">
        <BaseIcon :size="16" color="#ef4444">
          <Delete />
        </BaseIcon>
        Effacer
      </BaseButton>
    </div>

    <!-- Messages List -->
    <ElScrollbar v-if="messages.length > 0" class="flex-1">
      <div class="flex flex-col gap-4 p-2">
        <MessageBubble
          v-for="message in messages"
          :key="message.id"
          :role="message.role"
          :author="message.role === 'user' ? 'Vous' : 'Jarvis'"
          :content="message.content"
          :timestamp="formatTime(message.created_at)"
        >
          <template #icon>
            <User v-if="message.role === 'user'" />
            <Cpu v-else />
          </template>
          <template v-if="message.audio_url && message.role === 'assistant'" #actions>
            <AudioPlayer
              :is-playing="isPlayingMessage(message.id)"
              @toggle="() => toggleAudio(message)"
            />
          </template>
        </MessageBubble>
      </div>
    </ElScrollbar>

    <!-- Empty State -->
    <div v-else class="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div class="w-32 h-32 rounded-full glass-effect flex items-center justify-center">
        <BaseIcon :size="64" color="rgba(255, 255, 255, 0.3)">
          <ChatDotRound />
        </BaseIcon>
      </div>
      <h3 class="text-xl font-semibold text-white/80">Aucune conversation</h3>
      <p class="text-sm text-white/50 max-w-xs">
        Commencez à parler avec Jarvis pour voir l'historique apparaître ici
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./ConversationHistory.scss"></style>
