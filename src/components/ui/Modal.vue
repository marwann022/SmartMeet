<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
          class="modal-backdrop absolute inset-0 bg-black/45 backdrop-blur-[6px]" 
          @click="$emit('close')"
        ></div>
        
        <!-- Content panel -->
        <div 
          :class="[
            'modal-panel relative w-full bg-white/95 border border-white/80 backdrop-blur-[24px] rounded-[24px] shadow-[0_32px_80px_rgba(31,38,135,0.12)] p-8 flex flex-col gap-5 z-10 transition-all duration-300',
            maxWidthClass[maxWidth],
            themeAccentBorder[theme] || ''
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
  },
  theme: {
    type: String,
    default: 'primary'
  }
})

defineEmits(['close'])

const maxWidthClass = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl'
}

const themeAccentBorder = {
  primary: '',
  todo: 'border-t-4 border-t-primary',
  inprogress: 'border-t-4 border-t-amber-500',
  review: 'border-t-4 border-t-red-500',
  done: 'border-t-4 border-t-emerald-500'
}
</script>

<style scoped>
/* Backdrop transitions - Fade only */
.modal-enter-active .modal-backdrop,
.modal-leave-active .modal-backdrop {
  transition: opacity 0.3s ease;
}
.modal-enter-from .modal-backdrop,
.modal-leave-to .modal-backdrop {
  opacity: 0;
}

/* Panel transitions - Bouncy scale and translation */
.modal-enter-active .modal-panel {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-leave-active .modal-panel {
  transition: all 0.25s ease-in;
}
.modal-enter-from .modal-panel {
  opacity: 0;
  transform: scale(0.9) translateY(16px);
}
.modal-leave-to .modal-panel {
  opacity: 0;
  transform: scale(0.95) translateY(12px);
}
</style>
