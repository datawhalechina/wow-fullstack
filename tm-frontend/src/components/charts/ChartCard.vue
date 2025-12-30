<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  loading?: boolean
}>()
</script>

<template>
  <el-card class="chart-card" shadow="hover">
    <template #header>
      <div class="chart-header">
        <div class="chart-title-area">
          <span class="chart-title">{{ title }}</span>
          <span v-if="subtitle" class="chart-subtitle">{{ subtitle }}</span>
        </div>
        <div class="chart-actions">
          <slot name="actions" />
        </div>
      </div>
    </template>
    <div v-loading="loading" class="chart-content">
      <slot />
    </div>
  </el-card>
</template>

<style scoped lang="scss">
.chart-card {
  height: 100%;

  :deep(.el-card__header) {
    padding: 16px 20px;
  }

  :deep(.el-card__body) {
    padding: 16px 20px;
    min-height: 200px;
  }
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.chart-title-area {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #f1f5f9;
}

.chart-subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.chart-actions {
  display: flex;
  gap: 8px;
}

.chart-content {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
