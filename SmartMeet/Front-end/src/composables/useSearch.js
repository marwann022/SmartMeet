import { ref, computed } from 'vue'

/**
 * Reusable search filtering logic.
 * @param {import('vue').Ref<Array>} items - Reactive array of items to filter
 * @param {Array<string>} searchKeys - Array of object property keys to match against
 */
export function useSearch(items, searchKeys = ['title']) {
  const searchQuery = ref('')

  const filteredItems = computed(() => {
    if (!searchQuery.value.trim()) {
      return items.value
    }
    
    const query = searchQuery.value.toLowerCase().trim()
    
    return items.value.filter(item => {
      return searchKeys.some(key => {
        const value = item[key]
        if (value === null || value === undefined) return false
        
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query)
        }
        
        if (Array.isArray(value)) {
          return value.some(val => typeof val === 'string' && val.toLowerCase().includes(query))
        }
        
        if (typeof value === 'number') {
          return String(value).includes(query)
        }
        
        return false
      })
    })
  })

  return {
    searchQuery,
    filteredItems
  }
}
