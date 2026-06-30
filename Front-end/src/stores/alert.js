import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAlertStore = defineStore('alert', () => {
  const isOpen = ref(false)
  const title = ref('Notice')
  const message = ref('')
  const theme = ref('primary') // 'primary', 'warning', 'review', 'danger', etc.
  let resolvePromise = null

  const showAlert = (msg, modalTitle = 'Notice', modalTheme = 'primary') => {
    message.value = msg
    title.value = modalTitle
    theme.value = modalTheme
    isOpen.value = true
    
    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  const closeAlert = () => {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  return {
    isOpen,
    title,
    message,
    theme,
    showAlert,
    closeAlert
  }
})
