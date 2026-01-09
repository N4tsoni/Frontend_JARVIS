<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useConversationStore } from '@/stores/conversation'
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

<style lang="scss" scoped>
.conversation-sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(26, 30, 63, 0.6);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(102, 126, 234, 0.2);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);

  .sidebar-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #fff;

    .el-icon {
      color: #667eea;
    }
  }

  .new-conversation-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    &:active {
      transform: scale(0.95);
    }
  }
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(102, 126, 234, 0.5);
    }
  }
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;

  .empty-hint {
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
}

.conversation-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  background: rgba(42, 46, 79, 0.4);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(42, 46, 79, 0.7);
    border-color: rgba(102, 126, 234, 0.3);

    .conversation-actions {
      opacity: 1;
    }
  }

  &.active {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
    border-color: rgba(102, 126, 234, 0.5);
  }

  .conversation-content {
    flex: 1;
    min-width: 0;

    .conversation-name {
      color: #fff;
      font-weight: 500;
      margin-bottom: 0.25rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .conversation-date {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .conversation-actions {
    display: flex;
    gap: 0.25rem;
    opacity: 0;
    transition: opacity 0.2s ease;

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border: none;
      border-radius: 4px;
      background: rgba(102, 126, 234, 0.2);
      color: #fff;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(102, 126, 234, 0.4);
      }

      &.delete-btn:hover {
        background: rgba(239, 68, 68, 0.4);
        color: #ef4444;
      }
    }
  }

  .edit-mode {
    flex: 1;
    display: flex;
    gap: 0.5rem;

    .edit-input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid rgba(102, 126, 234, 0.5);
      border-radius: 4px;
      background: rgba(10, 14, 39, 0.8);
      color: #fff;
      font-size: 0.875rem;
      outline: none;

      &:focus {
        border-color: #667eea;
      }
    }

    .edit-actions {
      display: flex;
      gap: 0.25rem;

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .save-btn {
        background: rgba(16, 185, 129, 0.3);
        color: #10b981;

        &:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      }

      .cancel-btn {
        background: rgba(239, 68, 68, 0.3);
        color: #ef4444;

        &:hover {
          background: rgba(239, 68, 68, 0.5);
        }
      }
    }
  }
}
</style>
