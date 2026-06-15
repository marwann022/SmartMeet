import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const isGlobalLoading = ref(false)
  const activeModal = ref(null) // e.g., 'addTask', 'meetingDetails', etc.

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const setSidebarState = (state) => {
    sidebarOpen.value = state
  }

  const setLoading = (loading) => {
    isGlobalLoading.value = loading
  }

  const openModal = (modalName) => {
    activeModal.value = modalName
  }

  const closeModal = () => {
    activeModal.value = null
  }

  return {
    sidebarOpen,
    isGlobalLoading,
    activeModal,
    toggleSidebar,
    setSidebarState,
    setLoading,
    openModal,
    closeModal
  }
})
