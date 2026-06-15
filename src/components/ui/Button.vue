<template>
  <button
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-xl font-header font-bold text-[11px] tracking-wider uppercase transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none',
      variantClasses[variant],
      sizeClasses[size],
      block ? 'w-full' : ''
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
  >
    <slot name="icon-left"></slot>
    <span v-if="loading" class="loading loading-spinner loading-xs mr-1"></span>
    <slot></slot>
    <slot name="icon-right"></slot>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'accent', 'outline', 'glass', 'danger'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  block: {
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
  }
})

const variantClasses = {
  primary: 'bg-grad-primary text-white shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.4)] hover:scale-[1.02]',
  secondary: 'bg-[#181b25] text-white hover:bg-black',
  accent: 'bg-grad-accent text-white shadow-[0_4px_15px_rgba(236,72,153,0.25)] hover:shadow-[0_6px_22px_rgba(236,72,153,0.4)] hover:scale-[1.02]',
  outline: 'bg-transparent border border-black/10 text-brand-dark hover:bg-black/5',
  glass: 'bg-white/80 text-brand-dark border border-black/8 hover:bg-white hover:border-primary/20 hover:text-primary hover:shadow-[0_4px_15px_rgba(31,38,135,0.04)] hover:-translate-y-[2px]',
  danger: 'border border-red-200 text-red-500 bg-red-50/60 hover:bg-red-50 hover:border-red-300'
}

const sizeClasses = {
  sm: 'px-4 py-2 text-[10px]',
  md: 'px-5 py-2.5 text-[11px]',
  lg: 'px-6 py-3.5 text-[12px]'
}
</script>
