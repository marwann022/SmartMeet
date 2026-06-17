<template>
  <div class="mt-8">
    <DashboardTasks :search-query="searchQuery" />
  </div>
</template>

<script setup>
import DashboardTasks from '@/components/dashboard/DashboardTasks.vue'

defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})
</script>
