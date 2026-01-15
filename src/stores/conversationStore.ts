// Store Pinia pour gérer les conversations avec Jarvis

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Conversation, Message } from '@/models'
import { conversationService, voiceService } from '@/services'

export const useConversationStore = defineStore('conversation', () => {
  // State
  const conversations = ref<Conversation[]>([])
  const currentConversationId = ref<string | null>(null)
  const isRecording = ref(false)
  const isProcessing = ref(false)
  const isLoading = ref(false)
  const currentAudio = ref<HTMLAudioElement | null>(null)
  const error = ref<string | null>(null)

  // Getters
  const currentConversation = computed(() => {
    if (!currentConversationId.value) return null
    return conversations.value.find((c) => c.id === currentConversationId.value) || null
  })

  const currentMessages = computed(() => {
    return currentConversation.value?.messages || []
  })

  const messageCount = computed(() => currentMessages.value.length)

  const lastMessage = computed(() => {
    const msgs = currentMessages.value
    return msgs.length > 0 ? msgs[msgs.length - 1] : null
  })

  const isPlaying = computed(() => {
    return currentAudio.value && !currentAudio.value.paused
  })

  const hasActiveConversation = computed(() => currentConversationId.value !== null)

  // Actions

  /**
   * Charge toutes les conversations depuis l'API
   */
  async function loadConversations() {
    try {
      isLoading.value = true
      const response = await conversationService.list()
      conversations.value = response.conversations
      return response
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail || err.message || 'Erreur lors du chargement des conversations'
      setError(errorMsg)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Crée une nouvelle conversation
   */
  async function createConversation(name?: string) {
    try {
      isLoading.value = true
      const response = await conversationService.create(name ? { name } : undefined)

      // Ajouter à la liste locale
      conversations.value.unshift(response.conversation)

      // Définir comme conversation active
      currentConversationId.value = response.conversation.id

      return response.conversation
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail || err.message || 'Erreur lors de la création de la conversation'
      setError(errorMsg)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Sélectionne une conversation active
   */
  async function selectConversation(conversationId: string) {
    try {
      isLoading.value = true

      // Charger la conversation avec ses messages
      const conversation = await conversationService.getById(conversationId, true)

      // Mettre à jour la conversation dans la liste locale
      const index = conversations.value.findIndex((c) => c.id === conversationId)
      if (index >= 0) {
        conversations.value[index] = conversation
      } else {
        conversations.value.unshift(conversation)
      }

      // Définir comme conversation active
      currentConversationId.value = conversationId
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail || err.message || 'Erreur lors du chargement de la conversation'
      setError(errorMsg)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Renomme une conversation
   */
  async function renameConversation(conversationId: string, name: string) {
    try {
      const updated = await conversationService.rename(conversationId, { name })

      // Mettre à jour la conversation dans la liste locale
      const index = conversations.value.findIndex((c) => c.id === conversationId)
      const conversation = conversations.value[index]
      if (index >= 0 && conversation) {
        conversation.name = updated.name
        conversation.updated_at = updated.updated_at
      }

      return updated
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail || err.message || 'Erreur lors du renommage de la conversation'
      setError(errorMsg)
      throw err
    }
  }

  /**
   * Supprime une conversation
   */
  async function deleteConversation(conversationId: string) {
    try {
      await conversationService.remove(conversationId)

      // Retirer de la liste locale
      const index = conversations.value.findIndex((c) => c.id === conversationId)
      if (index >= 0) {
        conversations.value.splice(index, 1)
      }

      // Si c'était la conversation active, la désélectionner
      if (currentConversationId.value === conversationId) {
        currentConversationId.value = null
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        'Erreur lors de la suppression de la conversation'
      setError(errorMsg)
      throw err
    }
  }

  /**
   * Traite un message vocal
   */
  async function processVoiceMessage(audioBlob: Blob) {
    try {
      setProcessing(true)
      setError(null)

      // S'assurer qu'on a une conversation active, sinon en créer une
      if (!currentConversationId.value) {
        await createConversation()
      }

      // Envoyer l'audio pour traitement
      const response = await voiceService.processVoice(audioBlob, currentConversationId.value!)

      // Recharger la conversation pour avoir les nouveaux messages
      if (currentConversationId.value) {
        await selectConversation(currentConversationId.value)
      }

      // Jouer l'audio de la réponse automatiquement
      if (response.audioUrl) {
        await playAudio(response.audioUrl)
      }

      return response
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Erreur inconnue'
      setError(errorMsg)
      throw err
    } finally {
      setProcessing(false)
    }
  }

  /**
   * Envoie un message texte
   */
  async function sendTextMessage(text: string) {
    try {
      setProcessing(true)
      setError(null)

      // S'assurer qu'on a une conversation active, sinon en créer une
      if (!currentConversationId.value) {
        await createConversation()
      }

      // Envoyer le texte pour traitement
      const response = await voiceService.processText(text, currentConversationId.value!)

      // Recharger la conversation pour avoir les nouveaux messages
      if (currentConversationId.value) {
        await selectConversation(currentConversationId.value)
      }

      // Jouer l'audio de la réponse automatiquement
      if (response.audioUrl) {
        await playAudio(response.audioUrl)
      }

      return response
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Erreur inconnue'
      setError(errorMsg)
      throw err
    } finally {
      setProcessing(false)
    }
  }

  /**
   * Lecture d'un fichier audio
   */
  async function playAudio(audioUrl: string) {
    try {
      // Arrêter l'audio en cours si nécessaire
      if (currentAudio.value) {
        currentAudio.value.pause()
        currentAudio.value = null
      }

      const audio = new Audio(audioUrl)
      currentAudio.value = audio

      return new Promise((resolve, reject) => {
        audio.onended = () => {
          currentAudio.value = null
          resolve(true)
        }
        audio.onerror = () => {
          currentAudio.value = null
          reject(new Error('Erreur lors de la lecture audio'))
        }
        audio.play()
      })
    } catch (err) {
      console.error('Erreur lors de la lecture audio:', err)
      throw err
    }
  }

  /**
   * Arrête la lecture audio
   */
  function stopAudio() {
    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value = null
    }
  }

  /**
   * Définit l'état d'enregistrement
   */
  function setRecording(recording: boolean) {
    isRecording.value = recording
  }

  /**
   * Définit l'état de traitement
   */
  function setProcessing(processing: boolean) {
    isProcessing.value = processing
  }

  /**
   * Définit une erreur
   */
  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  /**
   * Commence une nouvelle conversation
   */
  async function startNewConversation() {
    await createConversation()
  }

  /**
   * S'assure qu'il existe une conversation active
   * Crée une nouvelle conversation si nécessaire
   */
  async function ensureConversation() {
    if (!currentConversationId.value) {
      await createConversation()
    }
  }

  /**
   * Ajoute un message localement (pour affichage immédiat)
   */
  function addMessage(message: Message) {
    if (!currentConversation.value) return

    // Ajouter le message à la conversation courante
    if (!currentConversation.value.messages) {
      currentConversation.value.messages = []
    }
    currentConversation.value.messages.push(message)
  }

  /**
   * Efface les messages de la conversation courante
   */
  function clearMessages() {
    if (!currentConversation.value) return
    currentConversation.value.messages = []
  }

  // Aliases for backward compatibility
  const messages = currentMessages

  return {
    // State
    conversations,
    currentConversationId,
    isRecording,
    isProcessing,
    isLoading,
    error,
    // Getters
    currentConversation,
    currentMessages,
    messageCount,
    lastMessage,
    isPlaying,
    hasActiveConversation,
    // Actions
    loadConversations,
    createConversation,
    selectConversation,
    renameConversation,
    deleteConversation,
    processVoiceMessage,
    sendTextMessage,
    playAudio,
    stopAudio,
    setRecording,
    setProcessing,
    setError,
    startNewConversation,
    ensureConversation,
    addMessage,
    clearMessages,
    // Aliases
    messages,
  }
})
