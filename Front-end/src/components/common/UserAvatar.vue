<template>
  <img
    :src="avatarSrc"
    :alt="displayName"
    class="rounded-full object-cover border border-white/80 shadow-sm flex-shrink-0"
    :class="sizeClass"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: { type: Object, default: null },
  name: { type: String, default: '' },
  size: { type: String, default: 'sm' } // 'xs' | 'sm' | 'md' | 'lg'
})

const displayName = computed(() => props.user?.name || props.name || 'User')

const avatarSrc = computed(() => {
  if (props.user?.avatar) {
    return `http://localhost:5000/uploads/${props.user.avatar}`
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName.value)}&background=4B68FF&color=fff`
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-6 h-6'
    case 'sm': return 'w-7 h-7'
    case 'md': return 'w-9 h-9'
    case 'lg': return 'w-11 h-11'
    default:   return 'w-7 h-7'
  }
})
</script>
