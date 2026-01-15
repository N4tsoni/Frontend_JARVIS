<script setup lang="ts">
import { computed } from 'vue'
import BaseAvatar from '../../atoms/BaseAvatar.vue'

interface Props {
  role: 'user' | 'assistant'
  content: string
  author: string
  timestamp: string
}

const props = defineProps<Props>()

const avatarVariant = computed(() => {
  return props.role === 'user' ? 'user' : 'assistant'
})

const isUser = computed(() => props.role === 'user')
</script>

<template>
  <div :class="['message-bubble', `role-${role}`]" class="flex gap-3">
    <BaseAvatar
      v-if="!isUser"
      :variant="avatarVariant"
      size="md"
    >
      <template #icon>
        <slot name="icon" />
      </template>
    </BaseAvatar>

    <div class="message-content-wrapper flex flex-col gap-1 max-w-[70%]">
      <div class="message-header flex items-center gap-2 text-xs">
        <span class="message-author font-semibold text-white/90">
          {{ author }}
        </span>
        <span class="message-time text-white/40">
          {{ timestamp }}
        </span>
      </div>

      <div :class="['message-content', `content-${role}`]" class="p-3 rounded-2xl backdrop-blur-md border border-white/10 transition-all duration-300">
        {{ content }}
      </div>

      <div v-if="$slots.actions" class="message-actions">
        <slot name="actions" />
      </div>
    </div>

    <BaseAvatar
      v-if="isUser"
      :variant="avatarVariant"
      size="md"
    >
      <template #icon>
        <slot name="icon" />
      </template>
    </BaseAvatar>
  </div>
</template>

<style lang="scss" scoped src="./MessageBubble.scss"></style>
