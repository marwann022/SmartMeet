import { ref } from 'vue'

const toasts = ref([])

const defaultDurations = {
  success: 3200,
  error: 4200,
  info: 3800
}

export function useToasts() {
  const removeToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const addToast = ({ type = 'info', title, message, duration }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const toast = {
      id,
      type,
      title,
      message,
      duration: duration ?? defaultDurations[type] ?? 3600
    }

    toasts.value = [toast, ...toasts.value].slice(0, 4)

    window.setTimeout(() => {
      removeToast(id)
    }, toast.duration)

    return id
  }

  const success = (message, title = 'Success') => addToast({ type: 'success', title, message })
  const error = (message, title = 'Action needed') => addToast({ type: 'error', title, message })
  const info = (message, title = 'Security tip') => addToast({ type: 'info', title, message })

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info
  }
}
