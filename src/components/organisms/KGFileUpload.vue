<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useKGStore } from '@/stores/kg'
import BaseButton from '@/components/atoms/BaseButton.vue'
import PipelineProgress from '@/components/molecules/PipelineProgress.vue'

const kgStore = useKGStore()

// State
const isDragging = ref(false)
const selectedFile = ref<File | null>(null)

// Supported formats
const supportedFormats = ['csv', 'json', 'pdf', 'txt', 'xlsx', 'xml']
const formatText = supportedFormats.map(f => `.${f}`).join(', ')

// Computed
const hasFile = computed(() => selectedFile.value !== null)

const fileSize = computed(() => {
  if (!selectedFile.value) return ''
  const bytes = selectedFile.value.size
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
})

// Methods
function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFileSelect(files[0])
  }
}

function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    handleFileSelect(target.files[0])
  }
}

function handleFileSelect(file: File) {
  // Validate file extension
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (!extension || !supportedFormats.includes(extension)) {
    ElMessage.error(`Unsupported file format. Please use: ${formatText}`)
    return
  }

  // Validate file size (max 50MB)
  if (file.size > 50 * 1024 * 1024) {
    ElMessage.error('File is too large. Maximum size is 50MB.')
    return
  }

  selectedFile.value = file
  ElMessage.success(`File selected: ${file.name}`)
}

function clearFile() {
  selectedFile.value = null
}

async function handleUpload() {
  if (!selectedFile.value) return

  try {
    await kgStore.uploadAndProcess(selectedFile.value)
    ElMessage.success('Document processed successfully!')
    selectedFile.value = null
  } catch (error: any) {
    ElMessage.error(error.response?.data?.detail || 'Upload failed')
  }
}

function triggerFileInput() {
  const input = document.getElementById('file-input') as HTMLInputElement
  input?.click()
}
</script>

<template>
  <div class="kg-file-upload">
    <!-- Upload Zone -->
    <div
      class="upload-zone"
      :class="{
        'is-dragging': isDragging,
        'has-file': hasFile,
        'is-disabled': kgStore.isWorking
      }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="!kgStore.isWorking && !hasFile && triggerFileInput()"
    >
      <input
        id="file-input"
        type="file"
        :accept="supportedFormats.map(f => `.${f}`).join(',')"
        @change="handleFileInput"
        :disabled="kgStore.isWorking"
        style="display: none"
      />

      <!-- Drag & Drop State -->
      <div v-if="!hasFile && !kgStore.isWorking" class="upload-prompt">
        <div class="upload-icon">
          <i class="el-icon-upload" />
        </div>
        <p class="upload-title">Drag & Drop your file here</p>
        <p class="upload-subtitle">or click to browse</p>
        <p class="upload-formats">Supported: {{ formatText }}</p>
      </div>

      <!-- File Selected -->
      <div v-else-if="hasFile && !kgStore.isWorking" class="file-info">
        <div class="file-icon">
          <i class="el-icon-document" />
        </div>
        <div class="file-details">
          <p class="file-name">{{ selectedFile?.name }}</p>
          <p class="file-size">{{ fileSize }}</p>
        </div>
        <button class="clear-button" @click.stop="clearFile" title="Remove file">
          <i class="el-icon-close" />
        </button>
      </div>

      <!-- Processing State with Pipeline Progress -->
      <div v-else-if="kgStore.isWorking" class="processing-state">
        <PipelineProgress
          :stages="kgStore.pipelineStages"
          :current-stage="kgStore.currentStageIndex"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="hasFile && !kgStore.isWorking" class="actions">
      <BaseButton variant="secondary" @click="clearFile">
        Cancel
      </BaseButton>
      <BaseButton variant="primary" @click="handleUpload">
        <i class="el-icon-upload2" />
        Upload & Process
      </BaseButton>
    </div>

    <!-- Error Message -->
    <div v-if="kgStore.uploadError" class="error-message">
      <i class="el-icon-warning" />
      {{ kgStore.uploadError }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/variables';
@import '@/styles/mixins';

.kg-file-upload {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-zone {
  @include glass-effect;
  border: 2px dashed rgba(102, 126, 234, 0.3);
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(.is-disabled) {
    border-color: rgba(102, 126, 234, 0.6);
    background: rgba(102, 126, 234, 0.05);
  }

  &.is-dragging {
    border-color: $primary;
    background: rgba(102, 126, 234, 0.1);
    transform: scale(1.02);
  }

  &.has-file {
    cursor: default;
    border-style: solid;
    border-color: $success;
  }

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.upload-prompt {
  .upload-icon {
    font-size: 4rem;
    color: $primary;
    margin-bottom: 1rem;

    i {
      font-size: 4rem;
    }
  }

  .upload-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.5rem;
  }

  .upload-subtitle {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
  }

  .upload-formats {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    font-family: 'Courier New', monospace;
  }
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  width: 100%;

  .file-icon {
    font-size: 3rem;
    color: $success;

    i {
      font-size: 3rem;
    }
  }

  .file-details {
    flex: 1;
    text-align: left;

    .file-name {
      font-size: 1.125rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.25rem;
      word-break: break-all;
    }

    .file-size {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .clear-button {
    background: rgba(239, 68, 68, 0.2);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: $error;

    &:hover {
      background: rgba(239, 68, 68, 0.3);
      transform: scale(1.1);
    }

    i {
      font-size: 1.25rem;
    }
  }
}

.processing-state {
  width: 100%;
  padding: 1rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.error-message {
  @include glass-effect;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid $error;
  color: $error;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  i {
    font-size: 1.25rem;
  }
}
</style>
