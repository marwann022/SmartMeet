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
        :type="inputType"
        :class="[
          'w-full py-3 rounded-xl bg-white dark:bg-slate-950/60 border font-body text-sm text-brand-dark placeholder-brand-slate/40 focus:outline-none transition-all duration-300',
          error ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]' : (themeFocusClasses[theme] || themeFocusClasses.primary),
          $slots.icon ? 'pl-10' : 'px-4',
          (isPassword || $slots.rightIcon) ? 'pr-11' : 'pr-4'
        ]"
      />
      <button
        v-if="isPassword"
        type="button"
        @click="showPassword = !showPassword"
        tabindex="-1"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        class="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-slate opacity-60 hover:opacity-100 hover:text-primary transition-all duration-200 cursor-pointer p-1 rounded-md focus:outline-none flex items-center justify-center"
      >
        <PhEyeSlash v-if="showPassword" :size="18" weight="bold" />
        <PhEye v-else :size="18" weight="bold" />
      </button>
      <div v-else-if="$slots.rightIcon" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-slate">
        <slot name="rightIcon"></slot>
      </div>
    </div>
    <span v-if="error" class="text-[11px] text-red-500 font-semibold pl-1 animate-fadeIn">
      {{ error }}
    </span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PhEye, PhEyeSlash } from '@phosphor-icons/vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
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

const showPassword = ref(false)

const isPassword = computed(() => props.type === 'password')
const inputType = computed(() => {
  if (isPassword.value) {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const themeFocusClasses = {
  primary: 'border-black/8 dark:border-white/10 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)]',
  todo: 'border-primary/20 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)]',
  inprogress: 'border-amber-500/20 focus:border-amber-500/30 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.08)]',
  review: 'border-red-500/20 focus:border-red-500/30 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]',
  done: 'border-emerald-500/20 focus:border-emerald-500/30 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
}
</script>

