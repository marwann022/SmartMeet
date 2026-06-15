<template>
  <div class="flex flex-col gap-1.5 w-full text-left">
    <label v-if="label" class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate font-header pl-1">
      {{ label }}
    </label>
    <div class="relative w-full group">
      <div v-if="$slots.icon" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate group-focus-within:text-primary transition-colors duration-200">
        <slot name="icon"></slot>
      </div>
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
        :class="[
          'w-full py-3 rounded-xl bg-white border font-body text-sm text-brand-dark placeholder-brand-slate/40 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300',
          $slots.icon ? 'pl-10 pr-4' : 'px-4'
        ]"
      />
    </div>
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
  }
})

defineEmits(['update:modelValue'])
</script>
