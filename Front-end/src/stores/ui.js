import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const isGlobalLoading = ref(false)
  const activeModal = ref(null) // e.g., 'addTask', 'meetingDetails', etc.
  const theme = ref('light')

  const showChatHistory = ref(false)

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

  const toggleTheme = (event) => {
    const isAppearanceTransition = document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isAppearanceTransition) {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', theme.value)
      
      // Fallback: smooth transition class
      document.documentElement.classList.add('theme-transition')
      applyTheme()
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transition')
      }, 400)
      return
    }

    // Get click coordinates, or center of the screen
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    if (event instanceof MouseEvent) {
      x = event.clientX
      y = event.clientY
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      document.documentElement.classList.add('no-transitions')
      theme.value = theme.value === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', theme.value)
      applyTheme()
    })

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ]
      document.documentElement.animate(
        {
          clipPath: clipPath
        },
        {
          duration: 400,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
      )
    })

    transition.finished.then(() => {
      document.documentElement.classList.remove('no-transitions')
    })
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
    showChatHistory,
    toggleSidebar,
    setSidebarState,
    setLoading,
    openModal,
    closeModal,
    toggleTheme,
    initTheme
  }
})
