<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useConversationStore } from '@/stores/conversationStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ChatDotRound,
  Plus,
  Delete,
  Edit,
  Check,
  Close,
} from '@element-plus/icons-vue'

const conversationStore = useConversationStore()

const editingConversationId = ref<string | null>(null)
const editingName = ref('')

onMounted(async () => {
  await conversationStore.loadConversations()
})

const sortedConversations = computed(() => {
  return [...conversationStore.conversations].sort((a, b) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  })
})

async function handleNewConversation() {
  try {
    await conversationStore.startNewConversation()
    ElMessage.success('Nouvelle conversation créée')
  } catch (error) {
    ElMessage.error('Erreur lors de la création de la conversation')
    console.error(error)
  }
}

async function handleSelectConversation(conversationId: string) {
  if (editingConversationId.value) return // Ne pas changer si on est en mode édition

  try {
    await conversationStore.selectConversation(conversationId)
  } catch (error) {
    ElMessage.error('Erreur lors du chargement de la conversation')
    console.error(error)
  }
}

function handleStartEdit(conversationId: string, currentName: string) {
  editingConversationId.value = conversationId
  editingName.value = currentName
}

function handleCancelEdit() {
  editingConversationId.value = null
  editingName.value = ''
}

async function handleSaveEdit(conversationId: string) {
  if (!editingName.value.trim()) {
    ElMessage.warning('Le nom ne peut pas être vide')
    return
  }

  try {
    await conversationStore.renameConversation(conversationId, editingName.value.trim())
    ElMessage.success('Conversation renommée')
    editingConversationId.value = null
    editingName.value = ''
  } catch (error) {
    ElMessage.error('Erreur lors du renommage')
    console.error(error)
  }
}

async function handleDeleteConversation(conversationId: string, conversationName: string) {
  try {
    await ElMessageBox.confirm(
      `Êtes-vous sûr de vouloir supprimer la conversation "${conversationName}" ?`,
      'Confirmation',
      {
        confirmButtonText: 'Supprimer',
        cancelButtonText: 'Annuler',
        type: 'warning',
      }
    )

    await conversationStore.deleteConversation(conversationId)
    ElMessage.success('Conversation supprimée')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('Erreur lors de la suppression')
      console.error(error)
    }
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins}min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}
</script>

<template>
  <div class="conversation-sidebar">
    <!-- Header -->
    <div class="sidebar-header">
      <h2 class="sidebar-title">
        <el-icon><ChatDotRound /></el-icon>
        <span>Conversations</span>
      </h2>
      <button @click="handleNewConversation" class="new-conversation-btn" title="Nouvelle conversation">
        <el-icon><Plus /></el-icon>
      </button>
    </div>

    <!-- Conversations List -->
    <div class="conversations-list">
      <div
        v-if="conversationStore.isLoading && sortedConversations.length === 0"
        class="loading-state"
      >
        <el-icon class="is-loading"><i class="el-icon-loading" /></el-icon>
        <span>Chargement...</span>
      </div>

      <div v-else-if="sortedConversations.length === 0" class="empty-state">
        <p>Aucune conversation</p>
        <p class="empty-hint">Cliquez sur + pour commencer</p>
      </div>

      <div
        v-for="conversation in sortedConversations"
        :key="conversation.id"
        :class="[
          'conversation-item',
          { active: conversation.id === conversationStore.currentConversationId },
        ]"
        @click="handleSelectConversation(conversation.id)"
      >
        <!-- Editing Mode -->
        <div v-if="editingConversationId === conversation.id" class="edit-mode" @click.stop>
          <input
            v-model="editingName"
            type="text"
            class="edit-input"
            @keyup.enter="handleSaveEdit(conversation.id)"
            @keyup.esc="handleCancelEdit"
            autofocus
          />
          <div class="edit-actions">
            <button @click="handleSaveEdit(conversation.id)" class="save-btn" title="Sauvegarder">
              <el-icon><Check /></el-icon>
            </button>
            <button @click="handleCancelEdit" class="cancel-btn" title="Annuler">
              <el-icon><Close /></el-icon>
            </button>
          </div>
        </div>

        <!-- Normal Mode -->
        <template v-else>
          <div class="conversation-content">
            <div class="conversation-name">{{ conversation.name }}</div>
            <div class="conversation-date">{{ formatDate(conversation.updated_at) }}</div>
          </div>
          <div class="conversation-actions" @click.stop>
            <button
              @click="handleStartEdit(conversation.id, conversation.name)"
              class="action-btn"
              title="Renommer"
            >
              <el-icon><Edit /></el-icon>
            </button>
            <button
              @click="handleDeleteConversation(conversation.id, conversation.name)"
              class="action-btn delete-btn"
              title="Supprimer"
            >
              <el-icon><Delete /></el-icon>
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./ConversationSidebar.scss"></style>
