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
          ref="panelRef"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          :class="[
            'modal-panel relative w-full bg-white/95 dark:bg-slate-900/95 border border-black/5 dark:border-white/10 backdrop-blur-[24px] rounded-[24px] shadow-[0_32px_80px_rgba(31,38,135,0.12)] p-8 flex flex-col gap-5 z-10 transition-all duration-300',
            maxWidthClass[maxWidth],
            themeAccentBorder[theme] || ''
          ]"
        >
          <!-- Close button -->
          <button 
            @click="$emit('close')" 
            class="absolute top-5 right-5 w-[32px] h-[32px] rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
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
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { PhX } from '@phosphor-icons/vue'

const props = defineProps({
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

const emit = defineEmits(['close'])
const panelRef = ref(null)
let previouslyFocusedElement = null

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

const focusFirstElement = async () => {
  await nextTick()
  const focusable = panelRef.value?.querySelectorAll(focusableSelector)
  const target = focusable?.[0] || panelRef.value
  target?.focus()
}

const handleKeydown = (event) => {
  if (!props.show) return

  if (event.key === 'Escape') {
    emit('close')
    return
  }

  if (event.key !== 'Tab' || !panelRef.value) return

  const focusable = [...panelRef.value.querySelectorAll(focusableSelector)]
  if (!focusable.length) {
    event.preventDefault()
    panelRef.value.focus()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => props.show,
  (isShown) => {
    if (isShown) {
      previouslyFocusedElement = document.activeElement
      focusFirstElement()
    } else {
      previouslyFocusedElement?.focus?.()
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

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
