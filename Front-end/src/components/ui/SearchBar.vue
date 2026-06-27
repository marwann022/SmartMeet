<template>
  <div class="relative w-full">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      :placeholder="placeholder"
      class="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-body text-xs text-brand-dark focus:outline-none focus:border-primary/30 transition-all duration-300"
    />
    <PhMagnifyingGlass :size="14" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate" />
    <button
      v-if="modelValue"
      @click="$emit('update:modelValue', '')"
      class="absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-black/5 flex items-center justify-center text-brand-slate hover:bg-black/10 cursor-pointer transition-colors"
      type="button"
    >
      <PhX :size="8" />
    </button>
  </div>
</template>

<script setup>
import { PhMagnifyingGlass, PhX } from '@phosphor-icons/vue'

defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  }
})

defineEmits(['update:modelValue'])
</script>
