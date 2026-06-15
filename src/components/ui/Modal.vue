<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[300] flex items-center justify-center p-4" @click.self="$emit('close')">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        
        <!-- Content panel -->
        <div 
          :class="[
            'relative w-full bg-white/95 border border-white/80 backdrop-blur-[24px] rounded-[24px] shadow-[0_32px_80px_rgba(31,38,135,0.12)] p-8 flex flex-col gap-5 transition-all duration-300',
            maxWidthClass[maxWidth]
          ]"
        >
          <!-- Close button -->
          <button 
            @click="$emit('close')" 
            class="absolute top-5 right-5 w-[32px] h-[32px] rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <PhX :size="14" weight="bold" class="text-brand-slate" />
          </button>
          
          <h3 v-if="title" class="font-header font-bold text-xl text-brand-dark leading-snug">
            {{ title }}
          </h3>
          
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { PhX } from '@phosphor-icons/vue'

defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v)
  }
})

defineEmits(['close'])

const maxWidthClass = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
}
</script>

<style scoped>
.modal-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: all 0.2s ease-in; }
.modal-enter-from   { opacity: 0; transform: scale(0.93); }
.modal-leave-to     { opacity: 0; transform: scale(0.97); }
</style>
