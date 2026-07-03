<template>
  <div class="flex flex-col gap-1.5 w-full text-left">
    <label v-if="label" class="text-[11px] font-semibold text-brand-slate tracking-wide font-header pl-1">
      {{ label }}
    </label>
    <div class="relative w-full group">
      <div v-if="$slots.icon" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate transition-colors duration-200" :class="[error ? 'text-red-500' : 'group-focus-within:text-primary']">
        <slot name="icon"></slot>
      </div>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
        :class="[
          'w-full py-3 rounded-xl bg-white dark:bg-slate-950/60 border font-body text-sm text-brand-dark placeholder-brand-slate/40 focus:outline-none transition-all duration-300',
          error ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]' : (themeFocusClasses[theme] || themeFocusClasses.primary),
          $slots.icon ? 'pl-10 pr-4' : 'px-4'
        ]"
      />
    </div>
    <span v-if="error" class="text-[11px] text-red-500 font-semibold pl-1 animate-fadeIn">
      {{ error }}
    </span>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  theme: {
    type: String,
    default: 'primary'
  },
  error: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const themeFocusClasses = {
  primary: 'border-black/8 dark:border-white/10 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)]',
  todo: 'border-primary/20 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)]',
  inprogress: 'border-amber-500/20 focus:border-amber-500/30 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.08)]',
  review: 'border-red-500/20 focus:border-red-500/30 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]',
  done: 'border-emerald-500/20 focus:border-emerald-500/30 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
}
</script>
