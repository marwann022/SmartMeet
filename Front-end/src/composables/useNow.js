import { ref, onMounted, onUnmounted } from 'vue'

// Singleton: one timer shared across all component instances.
// Every TaskCard that calls useNow() gets the same `now` ref,
// so a single setInterval drives all countdown computed properties.
const now = ref(new Date())
let consumers = 0
let timer = null

export function useNow(intervalMs = 60000) {
  onMounted(() => {
    consumers++
    if (consumers === 1) {
      timer = setInterval(() => {
        now.value = new Date()
      }, intervalMs)
    }
  })

  onUnmounted(() => {
    consumers--
    if (consumers === 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  })

  return { now }
}
