<template>
  <div
    :draggable="!isLocked"
    @dragstart="onDragStart"
    @click="$emit('click')"
    class="group relative border border-solid rounded-xl p-[17px] flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] select-none overflow-hidden"
    :class="[
      cardStyle,
      isLocked ? 'hover:cursor-default' : 'hover:cursor-grab active:cursor-grabbing'
    ]"
  >
    <!-- Top row: priority badge + AI/Manual tag + action buttons -->
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-1.5 flex-wrap">
        <Badge :type="badgeType">
          {{ formattedPriority }}
        </Badge>
        <span
          v-if="isAiGenerated"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-[0_0_6px_rgba(168,85,247,0.1)]"
        >
          <PhSparkle :size="10" weight="fill" />
          AI
        </span>
        <span
          v-else
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
        >
          <PhUser :size="10" weight="bold" />
          Manual
        </span>
        <span
          v-if="needsChanges"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20"
        >
          Needs Changes
        </span>
      </div>

      <!-- Right side actions container -->
      <div class="relative flex items-center justify-end h-6 min-w-[64px]">
        <!-- Default state: completion icon when done/review -->
        <div class="group-hover:opacity-0 group-hover:pointer-events-none transition-opacity duration-200 flex items-center justify-end w-full">
          <div v-if="task.status === 'done' || task.done" class="overflow-clip relative shrink-0 w-6 h-6 flex items-center justify-center">
            <PhCheckCircle :size="20" weight="fill" class="text-green-500" />
          </div>
          <div v-else-if="task.status === 'review'" class="overflow-clip relative shrink-0 w-6 h-6 flex items-center justify-center">
            <PhCheckCircle :size="20" weight="fill" class="text-red-500" />
          </div>
        </div>

        <!-- Hover state: move left / right / delete -->
        <div class="absolute right-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto flex items-center gap-1 transition-opacity duration-200">
          <button
            v-if="task.status !== 'todo' && !isLocked"
            @click.stop="$emit('move', -1)"
            class="w-6 h-6 rounded-lg bg-black/5 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-200 cursor-pointer"
            title="Move Left"
          >
            <PhArrowLeft :size="11" weight="bold" />
          </button>

          <button
            v-if="task.status !== 'done' && !task.done && !isLocked"
            @click.stop="$emit('move', 1)"
            class="w-6 h-6 rounded-lg bg-black/5 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-200 cursor-pointer"
            title="Move Right"
          >
            <PhArrowRight :size="11" weight="bold" />
          </button>

          <button
            @click.stop="$emit('delete')"
            class="w-6 h-6 rounded-lg bg-black/5 hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-all duration-200 cursor-pointer"
            title="Delete Task"
          >
            <PhTrash :size="11" weight="bold" />
          </button>
        </div>
      </div>
    </div>

    <!-- Title -->
    <div class="min-h-[40px] flex items-center py-0.5">
      <p
        class="font-header font-bold text-base leading-snug"
        :class="task.status === 'done' || task.done
          ? 'line-through text-brand-slate opacity-70'
          : task.priority.toLowerCase().includes('high')
            ? 'text-[#0b0f19] dark:text-slate-100'
            : 'text-[#3c3f47] dark:text-slate-200'"
      >
        {{ task.title }}
      </p>
    </div>

    <!-- Metadata -->
    <div class="border-t border-black/5 dark:border-white/5 pt-2.5 mt-0.5 flex flex-col gap-2">
      <!-- Assignee -->
      <div class="flex items-center gap-1.5">
        <UserAvatar :user="task.user" :name="task.assignee" size="xs" />
        <span class="text-xs font-semibold text-brand-dark/90 dark:text-slate-300">
          {{ task.assignee || 'Unassigned' }}
        </span>
      </div>

      <!-- Source -->
      <div class="flex items-center gap-1.5 text-xs text-brand-slate dark:text-slate-400">
        <PhVideoCamera v-if="isAiGenerated" :size="13" weight="bold" class="text-primary/70" />
        <PhFileText v-else :size="13" weight="bold" class="text-slate-400" />
        <span class="truncate font-semibold max-w-[180px]">{{ task.source }}</span>
      </div>

      <!-- Due Date (colour-coded by urgency) -->
      <div class="flex items-center gap-1.5 font-bold text-xs transition-colors duration-300" :class="deadlineColors.text">
        <PhCalendarBlank :size="13" weight="bold" />
        <span class="font-semibold">📅 {{ task.due || 'TBD' }}</span>
      </div>

      <!-- Live Countdown Badge -->
      <div v-if="countdown.label && !(task.status === 'done' || task.done)" class="flex">
        <span
          class="inline-flex items-center self-start px-2 py-0.5 rounded-full text-[10px] font-extrabold border transition-colors duration-300"
          :class="deadlineColors.badge"
        >
          {{ countdown.label }}
        </span>
      </div>
    </div>

    <!-- Progress Bar (time elapsed from creation → deadline) -->
    <div v-if="task.dueDate && !(task.status === 'done' || task.done)" class="mt-auto pt-1">
      <div class="w-full h-[3px] rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-700"
          :class="deadlineColors.bg"
          :style="{ width: progressPercent + '%' }"
        />
      </div>
    </div>

    <!-- Admin Review Actions on card: Approve / Reject (review only) -->
    <div
      v-if="task.status === 'review' && authStore.user?.role === 'admin'"
      class="border-t border-black/5 dark:border-white/5 pt-2.5 mt-1 flex gap-2"
      @click.stop
    >
      <button
        @click.stop="$emit('approve', task)"
        class="flex-1 px-3 py-1.5 rounded-lg bg-primary text-white text-[10px] font-extrabold transition-all duration-200 hover:bg-primary/90 hover:scale-[1.02] cursor-pointer"
      >
        <PhCheck :size="11" weight="bold" class="inline mr-1" />
        APPROVE
      </button>
      <button
        @click.stop="$emit('reject', task)"
        class="flex-1 px-3 py-1.5 rounded-lg border border-red-500/40 text-red-500 text-[10px] font-extrabold transition-all duration-200 hover:bg-red-500/10 hover:border-red-500 cursor-pointer"
      >
        <PhX :size="11" weight="bold" class="inline mr-1" />
        REJECT
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  PhCheckCircle,
  PhCheck,
  PhX,
  PhArrowLeft,
  PhArrowRight,
  PhTrash,
  PhCalendarBlank,
  PhSparkle,
  PhUser,
  PhVideoCamera,
  PhFileText,
} from '@phosphor-icons/vue'
import Badge from '../ui/Badge.vue'
import UserAvatar from '../common/UserAvatar.vue'
import { useAuthStore } from '../../stores/auth'
import { useNow } from '../../composables/useNow'
import { getCountdownInfo, getDeadlineColors, getProgressPercent } from '../../utils/taskDeadline'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

defineEmits(['move', 'delete', 'toggle', 'click', 'approve', 'reject'])

const authStore = useAuthStore()
const { now } = useNow()

const isLocked = computed(() => {
  const isAdmin = authStore.user?.role === 'admin'
  return !isAdmin && (props.task.status === 'review' || props.task.status === 'done')
})

const isAiGenerated = computed(() =>
  props.task.source && props.task.source.startsWith('Meeting:')
)

const needsChanges = computed(() => {
  const t = props.task
  if (t.status !== 'inprogress') return false
  if (!t.reviewHistory || t.reviewHistory.length === 0) return false
  const last = t.reviewHistory[t.reviewHistory.length - 1]
  return last.action === 'returned' || last.action === 'rejected'
})

const onDragStart = (e) => {
  if (isLocked.value) {
    e.preventDefault()
    return
  }
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', String(props.task.id || props.task._id))
}

// Reactive every minute via shared useNow singleton
const countdown = computed(() => getCountdownInfo(props.task, now.value))
const deadlineColors = computed(() => getDeadlineColors(props.task, now.value))
const progressPercent = computed(() => getProgressPercent(props.task, now.value))

const formattedPriority = computed(() => {
  const p = props.task.priority || ''
  const lower = p.toLowerCase()
  if (lower.includes('high')) return 'High'
  if (lower.includes('medium') || lower.includes('med')) return 'Medium'
  if (lower.includes('low')) return 'Low'
  return p
})

const badgeType = computed(() => {
  const status = props.task.status
  if (status === 'todo') return 'primary'
  if (status === 'inprogress') return 'warning'
  if (status === 'review') return 'danger'
  if (status === 'done') return 'success'
  return 'default'
})

const cardStyle = computed(() => {
  const status = props.task.status
  const borderAccent = isAiGenerated.value
    ? 'border-l-[4px] border-l-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.05)]'
    : 'border-l-[4px] border-l-slate-400/40'

  let baseStyle = ''
  if (status === 'todo') {
    baseStyle = 'bg-gradient-to-br from-primary/5 via-white/50 dark:via-slate-900/40 to-white/80 dark:to-slate-900/60 border-primary/30 dark:border-primary/20 backdrop-blur-md hover:from-primary/10 hover:border-primary/50'
  } else if (status === 'inprogress') {
    baseStyle = 'bg-gradient-to-br from-amber-500/5 via-white/50 dark:via-slate-900/40 to-white/80 dark:to-slate-900/60 border-amber-500/30 dark:border-amber-500/20 backdrop-blur-md hover:from-amber-500/10 hover:border-amber-500/50'
  } else if (status === 'review') {
    baseStyle = 'bg-gradient-to-br from-red-500/5 via-white/50 dark:via-slate-900/40 to-white/80 dark:to-slate-900/60 border-red-500/30 dark:border-red-500/20 backdrop-blur-md hover:from-red-500/10 hover:border-red-500/50'
  } else if (status === 'done') {
    baseStyle = 'bg-gradient-to-br from-emerald-500/5 via-white/30 dark:via-slate-900/30 to-white/50 dark:to-slate-900/50 border-emerald-500/20 dark:border-emerald-500/10 opacity-75 blur-[0.2px] hover:from-emerald-500/10 hover:border-emerald-500/40'
  } else {
    baseStyle = 'bg-gradient-to-br from-white/80 to-white/40 border-black/10'
  }

  return `${baseStyle} ${borderAccent}`
})
</script>
