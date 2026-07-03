<template>
  <Teleport to="body">
    <div class="fixed right-4 top-4 z-[400] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="card-glass flex items-start gap-3 rounded-2xl border border-white/80 dark:border-white/8 bg-white/85 dark:bg-slate-900/95 p-4 text-left shadow-glass backdrop-blur-[24px]"
          :class="toastShellClasses[toast.type]"
          role="status"
        >
          <div
            class="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl"
            :class="toastIconClasses[toast.type]"
          >
            <component :is="toastIcons[toast.type]" :size="18" weight="bold" />
          </div>

          <div class="min-w-0 flex-1">
            <p class="font-header text-xs font-bold uppercase tracking-wider text-brand-dark">
              {{ toast.title }}
            </p>
            <p class="mt-1 font-body text-xs leading-relaxed text-brand-slate">
              {{ toast.message }}
            </p>
          </div>

          <button
            type="button"
            class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-brand-slate transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Dismiss notification"
            @click="removeToast(toast.id)"
          >
            <PhX :size="13" weight="bold" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { PhCheckCircle, PhInfo, PhWarningCircle, PhX } from '@phosphor-icons/vue'
import { useToasts } from '../../composables/useToasts'

const { toasts, removeToast } = useToasts()

const toastIcons = {
  success: PhCheckCircle,
  error: PhWarningCircle,
  info: PhInfo
}

const toastShellClasses = {
  success: 'border-l-4 border-l-emerald-500',
  error: 'border-l-4 border-l-red-500',
  info: 'border-l-4 border-l-primary'
}

const toastIconClasses = {
  success: 'bg-emerald-500/10 text-emerald-600',
  error: 'bg-red-500/10 text-red-500',
  info: 'bg-primary/10 text-primary'
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(18px) translateY(-6px) scale(0.98);
}

.toast-move {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
