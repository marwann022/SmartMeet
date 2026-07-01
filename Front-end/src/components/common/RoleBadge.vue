<template>
  <span 
    class="inline-flex items-center gap-[5px] h-[26px] px-[10px] rounded-full text-[11px] font-semibold border whitespace-nowrap shadow-sm transition-all duration-200 hover:brightness-95 leading-none"
    :class="roleClass"
  >
    <component :is="icon" :size="11" weight="bold" class="flex-shrink-0" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { PhShieldCheck, PhUser } from '@phosphor-icons/vue'

const props = defineProps({
  role: { type: String, default: 'member' },
  size: { type: String, default: 'sm' }
})

const normalizedRole = computed(() => (props.role || 'member').toLowerCase())

const label = computed(() => normalizedRole.value === 'admin' ? 'Admin' : 'Member')

const icon = computed(() => normalizedRole.value === 'admin' ? PhShieldCheck : PhUser)

const roleClass = computed(() => 
  normalizedRole.value === 'admin' 
    ? 'bg-red-50 dark:bg-red-500/10 border-red-300 dark:border-red-500/20 text-red-600 dark:text-red-400' 
    : 'bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/20 text-blue-600 dark:text-blue-400'
)
</script>

<style scoped>
/* Scoped styles replaced by Tailwind classes */
</style>
