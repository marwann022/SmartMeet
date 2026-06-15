<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left w-full">
    <div>
      <div v-if="tag" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/10 text-primary font-header font-bold text-[10px] tracking-wide mb-2">
        <slot name="tag-icon"></slot>
        {{ tag }}
      </div>
      <h2 class="font-header font-bold text-2xl sm:text-3xl text-brand-dark tracking-tight leading-tight">
        {{ title }}
      </h2>
      <p v-if="description" class="text-brand-slate text-sm mt-1">
        {{ description }}
      </p>
    </div>
    <div v-if="$slots.actions" class="flex items-center gap-3 flex-shrink-0">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  tag: {
    type: String,
    default: ''
  }
})
</script>
