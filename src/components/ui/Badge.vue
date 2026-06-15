<template>
  <div 
    :class="[
      'px-2.5 py-0.5 rounded-md flex flex-col items-start font-header font-bold text-[10px] uppercase leading-[15px] border',
      typeClasses[type] || typeClasses.default
    ]"
  >
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'default',
    validator: (v) => ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'default', 'high', 'medium', 'low', 'completed'].includes(v)
  }
})

const typeClasses = {
  primary: 'bg-primary/8 border-primary/15 text-primary',
  secondary: 'bg-secondary/8 border-secondary/15 text-secondary',
  success: 'bg-green-500/10 border-green-500/15 text-green-600',
  warning: 'bg-yellow-500/10 border-yellow-500/15 text-yellow-600',
  danger: 'bg-red-500/10 border-red-500/15 text-red-500',
  info: 'bg-[#0491a3]/8 border-[#0491a3]/15 text-[#0491a3]',
  default: 'bg-brand-slate/10 border-black/5 text-brand-slate',
  
  // Custom Task Priorities
  high: 'bg-[rgba(147,0,10,0.2)] border border-[rgba(202,202,202,0.05)] text-[#93000a]',
  medium: 'bg-[rgba(77,142,255,0.3)] border border-[rgba(173,198,255,0.2)] text-[#4d8eff]',
  low: 'bg-[rgba(87,27,193,0.3)] border border-[rgba(87,27,193,0.2)] text-[#494259]',
  completed: 'bg-green-500/10 border-green-500/15 text-green-600'
}
</script>
