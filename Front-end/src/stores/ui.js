import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const isGlobalLoading = ref(false)
  const activeModal = ref(null) // e.g., 'addTask', 'meetingDetails', etc.
  const theme = ref('light')

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

  const applyTheme = () => {
    if (theme.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? 'dark' : 'light'
    }
    applyTheme()
  }

  return {
    sidebarOpen,
    isGlobalLoading,
    activeModal,
    theme,
    toggleSidebar,
    setSidebarState,
    setLoading,
    openModal,
    closeModal,
    toggleTheme,
    initTheme
  }
})
