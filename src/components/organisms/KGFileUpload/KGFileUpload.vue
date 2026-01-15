<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useKGStore } from '@/stores/kgStore'
import { BaseButton } from '../../atoms'
import { PipelineProgress } from '../../molecules'

const kgStore = useKGStore()

// State
const isDragging = ref(false)
const selectedFiles = ref<File[]>([])

// Supported formats
const supportedFormats = ['csv', 'json', 'pdf', 'txt', 'xlsx', 'xml']
const formatText = supportedFormats.map(f => `.${f}`).join(', ')

// Computed
const hasFiles = computed(() => selectedFiles.value.length > 0)

const totalSize = computed(() => {
  if (selectedFiles.value.length === 0) return ''
  const totalBytes = selectedFiles.value.reduce((sum, file) => sum + file.size, 0)
  if (totalBytes < 1024) return totalBytes + ' B'
  if (totalBytes < 1024 * 1024) return (totalBytes / 1024).toFixed(2) + ' KB'
  return (totalBytes / (1024 * 1024)).toFixed(2) + ' MB'
})

function getFileSize(file: File): string {
  const bytes = file.size
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
}

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
    handleFilesSelect(Array.from(files))
  }
}

function handleFileInput(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    handleFilesSelect(Array.from(target.files))
  }
}

function handleFilesSelect(files: File[]) {
  const validFiles: File[] = []
  const errors: string[] = []

  for (const file of files) {
    // Validate file extension
    const extension = file.name.split('.').pop()?.toLowerCase()
    if (!extension || !supportedFormats.includes(extension)) {
      errors.push(`${file.name}: Unsupported format`)
      continue
    }

    // Validate file size (max 50MB per file)
    if (file.size > 50 * 1024 * 1024) {
      errors.push(`${file.name}: File too large (max 50MB)`)
      continue
    }

    validFiles.push(file)
  }

  // Check max files limit (10 files)
  if (selectedFiles.value.length + validFiles.length > 10) {
    ElMessage.error('Maximum 10 files allowed')
    return
  }

  if (validFiles.length > 0) {
    selectedFiles.value.push(...validFiles)
    ElMessage.success(`${validFiles.length} file(s) selected`)
  }

  if (errors.length > 0) {
    ElMessage.warning(errors.join('; '))
  }
}

function removeFile(index: number) {
  selectedFiles.value.splice(index, 1)
}

function clearAllFiles() {
  selectedFiles.value = []
}

async function handleUpload() {
  if (selectedFiles.value.length === 0) return

  try {
    if (selectedFiles.value.length === 1 && selectedFiles.value[0]) {
      // Single file upload (existing endpoint)
      await kgStore.uploadAndProcess(selectedFiles.value[0])
      ElMessage.success('Document processed successfully!')
    } else {
      // Multi-file batch upload (new endpoint)
      await kgStore.uploadAndProcessBatch(selectedFiles.value)
      ElMessage.success(`${selectedFiles.value.length} documents processed successfully!`)
    }
    selectedFiles.value = []
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
        'has-files': hasFiles,
        'is-disabled': kgStore.isWorking
      }"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
      @click="!kgStore.isWorking && !hasFiles && triggerFileInput()"
    >
      <input
        id="file-input"
        type="file"
        multiple
        :accept="supportedFormats.map(f => `.${f}`).join(',')"
        @change="handleFileInput"
        :disabled="kgStore.isWorking"
        style="display: none"
      />

      <!-- Drag & Drop State -->
      <div v-if="!hasFiles && !kgStore.isWorking" class="upload-prompt">
        <div class="upload-icon">
          <i class="el-icon-upload" />
        </div>
        <p class="upload-title">Drag & Drop your files here</p>
        <p class="upload-subtitle">or click to browse (max 10 files)</p>
        <p class="upload-formats">Supported: {{ formatText }}</p>
      </div>

      <!-- Files Selected -->
      <div v-else-if="hasFiles && !kgStore.isWorking" class="files-list">
        <div class="files-header">
          <div class="files-summary">
            <i class="el-icon-document" />
            <span>{{ selectedFiles.length }} file(s) - {{ totalSize }}</span>
          </div>
          <button class="add-more-button" @click.stop="triggerFileInput()" title="Add more files">
            <i class="el-icon-plus" />
          </button>
        </div>

        <div class="files-items">
          <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
            <div class="file-icon">
              <i class="el-icon-document" />
            </div>
            <div class="file-details">
              <p class="file-name">{{ file.name }}</p>
              <p class="file-size">{{ getFileSize(file) }}</p>
            </div>
            <button class="remove-button" @click.stop="removeFile(index)" title="Remove file">
              <i class="el-icon-close" />
            </button>
          </div>
        </div>
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
    <div v-if="hasFiles && !kgStore.isWorking" class="actions">
      <BaseButton variant="secondary" @click="clearAllFiles">
        Clear All
      </BaseButton>
      <BaseButton variant="primary" @click="handleUpload">
        <i class="el-icon-upload2" />
        Upload & Process {{ selectedFiles.length > 1 ? `(${selectedFiles.length} files)` : '' }}
      </BaseButton>
    </div>

    <!-- Error Message -->
    <div v-if="kgStore.uploadError" class="error-message">
      <i class="el-icon-warning" />
      {{ kgStore.uploadError }}
    </div>
  </div>
</template>

<style lang="scss" scoped src="./KGFileUpload.scss"></style>
