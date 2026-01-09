<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import BaseButton from '@/components/atoms/BaseButton.vue'

// Events
const emit = defineEmits<{
  send: [text: string]
}>()

// State
const inputText = ref('')
const isSending = ref(false)

// Methods
function handleSend() {
  const text = inputText.value.trim()

  if (!text) {
    ElMessage.warning('Veuillez entrer un message')
    return
  }

  emit('send', text)
  inputText.value = ''
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSend()
  }
}

// Expose method for parent
defineExpose({
  setLoading: (loading: boolean) => {
    isSending.value = loading
  }
})
</script>

<template>
  <div class="text-input">
    <div class="input-container">
      <textarea
        v-model="inputText"
        :disabled="isSending"
        placeholder="Écrivez votre message ici..."
        class="text-area"
        rows="3"
        @keypress="handleKeyPress"
      />
      <BaseButton
        variant="primary"
        :disabled="!inputText.trim() || isSending"
        @click="handleSend"
        class="send-button"
      >
        <i v-if="!isSending" class="el-icon-s-promotion" />
        <span v-if="isSending" class="loading-spinner" />
        {{ isSending ? 'Envoi...' : 'Envoyer' }}
      </BaseButton>
    </div>
    <p class="input-hint">
      Appuyez sur Entrée pour envoyer, Maj+Entrée pour nouvelle ligne
    </p>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.text-input {
  width: 100%;
  margin-top: 1.5rem;
}

.input-container {
  @include glass-effect;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.text-area {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: white;
  font-size: 0.9375rem;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: $primary;
    background: rgba(255, 255, 255, 0.08);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.send-button {
  align-self: flex-end;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.125rem;
  }
}

.loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.input-hint {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .text-area {
    font-size: 0.875rem;
  }

  .input-hint {
    font-size: 0.6875rem;
  }
}
</style>
