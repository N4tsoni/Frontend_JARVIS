<script setup lang="ts">
interface Props {
  title: string
  description?: string
  badge?: string
  badgeType?: 'success' | 'warning' | 'danger' | 'info'
  modelValue: boolean
  disabled?: boolean
  loading?: boolean
  activeColor?: string
}

withDefaults(defineProps<Props>(), {
  badgeType: 'info',
  disabled: false,
  loading: false,
  activeColor: '#13ce66'
})

defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <div class="setting-toggle">
    <div class="setting-header">
      <div class="setting-info">
        <div class="setting-title">
          <span>{{ title }}</span>
          <el-tag v-if="badge" :type="badgeType" size="small" class="setting-badge">
            {{ badge }}
          </el-tag>
        </div>
        <p v-if="description" class="setting-description">
          {{ description }}
        </p>
      </div>
      <el-switch
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
        :disabled="disabled"
        :loading="loading"
        size="large"
        :active-color="activeColor"
      />
    </div>

    <!-- Sub-options (si activé) -->
    <div v-if="modelValue && $slots.default" class="setting-suboptions">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped src="./SettingToggle.scss"></style>
