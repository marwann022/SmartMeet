<template>
  <img
    v-if="avatarUrl && !imageError"
    :src="avatarUrl"
    :alt="displayName"
    @error="imageError = true"
    class="rounded-full object-cover border border-white/80 shadow-sm flex-shrink-0"
    :class="sizeClass"
  />
  <div
    v-else
    class="rounded-full flex items-center justify-center font-header font-bold text-white shadow-sm flex-shrink-0 select-none transition-transform duration-200"
    :class="[sizeClass, gradientClass]"
    :title="displayName"
  >
    <span>{{ initials }}</span>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  user: { type: Object, default: null },
  avatar: { type: String, default: '' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  size: { type: String, default: 'md' } // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
})

const imageError = ref(false)

const displayName = computed(() => {
  if (props.name) return props.name
  if (props.user?.name) return props.user.name
  if (props.user?.firstName) {
    return `${props.user.firstName} ${props.user.lastName || ''}`.trim()
  }
  return 'User'
})

const avatarUrl = computed(() => {
  const src = props.avatar || props.user?.avatar
  if (!src || typeof src !== 'string' || src.trim() === '') return null
  
  if (src.includes('User Profile.png')) return null

  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src
  }
  if (src.startsWith('/')) {
    return `http://localhost:5000${src}`
  }
  return `http://localhost:5000/uploads/${src}`
})

watch(avatarUrl, () => {
  imageError.value = false
})

const initials = computed(() => {
  const nameStr = displayName.value.trim()
  if (!nameStr) return '??'

  const parts = nameStr.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return nameStr.substring(0, 2).toUpperCase()
})

// Curated vibrant color gradients for team avatars
const gradients = [
  'bg-gradient-to-br from-indigo-500 to-blue-600',
  'bg-gradient-to-br from-violet-600 to-purple-700',
  'bg-gradient-to-br from-emerald-500 to-teal-700',
  'bg-gradient-to-br from-amber-500 to-orange-600',
  'bg-gradient-to-br from-rose-500 to-pink-600',
  'bg-gradient-to-br from-cyan-500 to-blue-600',
  'bg-gradient-to-br from-fuchsia-600 to-pink-600',
]

const gradientClass = computed(() => {
  const str = displayName.value || props.email || 'user'
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % gradients.length
  return gradients[index]
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-6 h-6 text-[10px]'
    case 'sm': return 'w-7 h-7 text-[11px]'
    case 'md': return 'w-9 h-9 text-xs tracking-wider'
    case 'lg': return 'w-11 h-11 text-sm tracking-wider'
    case 'xl': return 'w-14 h-14 text-base tracking-wider'
    default:   return 'w-9 h-9 text-xs tracking-wider'
  }
})
</script>

