<template>
  <div class="home-view py-10">
    <DashboardMain :search-query="searchQuery" />
  </div>
</template>

<script setup>
import DashboardMain from '@/components/dashboard/DashboardMain.vue'

defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})
</script>
