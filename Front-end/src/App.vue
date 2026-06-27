<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useUiStore } from './stores/ui'

const uiStore = useUiStore()

onMounted(() => {
  uiStore.initTheme()
})
</script>

<style>
/* Global style overrides can be placed here if needed */
</style>

