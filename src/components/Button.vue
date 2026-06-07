<template>
  <button
    :type="type"
    :class="[
      'inline-flex items-center justify-center px-6 py-3 rounded-xl font-header font-bold text-[11px] tracking-wider uppercase cursor-pointer relative overflow-hidden transition-all duration-300 select-none border border-transparent disabled:opacity-50 disabled:pointer-events-none group active:scale-[0.98] active:translate-y-0',
      variantClasses[variant],
      outlined ? 'bg-transparent border-black/10 text-brand-dark hover:bg-white/90 hover:border-primary/30 hover:text-primary' : '',
      {
        'opacity-50 pointer-events-none': disabled || loading
      }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <!-- Spinner for loading state -->
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spinner"></span>
    
    <!-- Button content slot -->
    <slot v-else></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary'
  },
  outlined: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
})

defineEmits(['click'])

const variantClasses = {
  primary: 'bg-grad-primary text-white shadow-[0_4px_15px_rgba(75,104,255,0.25),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:shadow-[0_6px_20px_rgba(75,104,255,0.35)] hover:-translate-y-[2px]',
  secondary: 'bg-white/80 text-brand-dark border border-black/8 hover:bg-white hover:border-primary/20 hover:shadow-[0_4px_15px_rgba(31,38,135,0.04)] hover:text-primary hover:-translate-y-[2px]',
  gradient: 'bg-grad-accent text-white shadow-[0_4px_15px_rgba(236,72,153,0.25)] hover:shadow-[0_6px_20px_rgba(236,72,153,0.35)] hover:-translate-y-[2px]',
  success: 'bg-green-500/10 text-green-700 border border-green-500/20 hover:bg-green-500 hover:text-white hover:shadow-[0_4px_12px_rgba(34,197,94,0.25)] hover:-translate-y-[2px]',
  fail: 'bg-red-500/10 text-red-700 border border-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-[0_4px_12px_rgba(239,68,68,0.25)] hover:-translate-y-[2px]',
}
</script>
