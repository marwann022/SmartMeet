<template>
  <label
    class="flex items-start gap-3 cursor-pointer select-none group/checkbox relative"
    :class="[
      disabled ? 'cursor-not-allowed opacity-60' : ''
    ]"
  >
    <div class="relative mt-0.5">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        @change="onChange"
        class="sr-only"
        v-bind="$attrs"
      />
      <!-- Custom visual Checkbox -->
      <div
        class="w-5 h-5 flex items-center justify-center transition-all duration-200 border-2"
        :class="[
          shape === 'circle' ? 'rounded-full' : 'rounded-lg',
          
          // Checked state styles
          modelValue
            ? (error ? 'border-brand-danger bg-brand-danger text-white shadow-[0_0_8px_rgba(239,68,68,0.25)]' : 'border-primary bg-primary text-white shadow-[0_0_8px_rgba(75,104,255,0.25)]')
            : (error ? 'border-brand-danger bg-transparent' : 'border-black/15 dark:border-white/20 bg-white dark:bg-slate-950/60'),

          // Hover states (if enabled)
          !disabled
            ? (modelValue
                ? (error ? 'group-hover/checkbox:bg-red-600 group-hover/checkbox:border-red-600' : 'group-hover/checkbox:bg-primary/90 group-hover/checkbox:border-primary/90')
                : (error ? 'group-hover/checkbox:border-brand-danger group-hover/checkbox:bg-brand-danger/5' : 'group-hover/checkbox:border-primary/50 group-hover/checkbox:bg-primary/5')
              )
            : '',

          // Focus ring when keyboard-focused
          'group-focus-within/checkbox:ring-2 group-focus-within/checkbox:ring-offset-2',
          error ? 'group-focus-within/checkbox:ring-brand-danger/50' : 'group-focus-within/checkbox:ring-primary/50',
          
          // Active state (micro-scale on press)
          'transform active:scale-95 duration-100'
        ]"
      >
        <PhCheck 
          v-if="modelValue" 
          :size="12" 
          weight="bold" 
          class="text-white transform transition-transform duration-200 scale-100" 
        />
      </div>
    </div>
    
    <div class="flex flex-col text-left">
      <span 
        v-if="label" 
        class="text-sm font-bold text-brand-dark transition-colors duration-200" 
        :class="[
          disabled ? 'text-brand-slate/60' : '',
          !disabled ? 'group-hover/checkbox:text-brand-dark/95' : ''
        ]"
      >
        {{ label }}
      </span>
      <span 
        v-if="description" 
        class="text-xs text-brand-slate leading-relaxed mt-1 transition-colors duration-200" 
        :class="[
          disabled ? 'text-brand-slate/40' : '',
          !disabled ? 'group-hover/checkbox:text-brand-slate/85' : ''
        ]"
      >
        {{ description }}
      </span>
      <slot></slot>
      <span v-if="error" class="text-[11px] text-brand-danger font-semibold mt-1.5 animate-fadeIn">
        {{ error }}
      </span>
    </div>
  </label>
</template>

<script setup>
import { PhCheck } from '@phosphor-icons/vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  shape: {
    type: String,
    default: 'square',
    validator: (v) => ['square', 'circle'].includes(v)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const onChange = (e) => {
  if (props.disabled) return
  emit('update:modelValue', e.target.checked)
  emit('change', e)
}
</script>
