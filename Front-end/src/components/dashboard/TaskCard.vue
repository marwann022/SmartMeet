<template>
  <div 
    draggable="true"
    @dragstart="onDragStart"
    @click="$emit('click')"
    class="group relative border border-solid rounded-xl p-[17px] flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] select-none hover:cursor-grab active:cursor-grabbing"
    :class="cardStyle"
  >
    <!-- Top row: priority badge + action buttons / done check icon -->
    <div class="flex items-start justify-between">
      <Badge :type="badgeType">
        {{ formattedPriority }}
      </Badge>
      
      <!-- Right side actions container -->
      <div class="relative flex items-center justify-end h-6 min-w-[64px]">
        <!-- Default State (when not hovered): show check icon only if task is done -->
        <div class="group-hover:opacity-0 group-hover:pointer-events-none transition-opacity duration-200 flex items-center justify-end w-full">
          <div v-if="task.status === 'done' || task.done" class="overflow-clip relative shrink-0 w-6 h-6 flex items-center justify-center">
            <PhCheckCircle :size="20" weight="fill" class="text-green-500" />
          </div>
        </div>
        
        <!-- Hover State (when hovered): show full action controls -->
        <div class="absolute right-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto flex items-center gap-1 transition-opacity duration-200">
          <button 
            v-if="task.status !== 'todo'"
            @click.stop="$emit('move', -1)" 
            class="w-6 h-6 rounded-lg bg-black/5 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-200 cursor-pointer"
            title="Move Left"
          >
            <PhArrowLeft :size="11" weight="bold" />
          </button>
          
          <button 
            v-if="task.status !== 'done' && !task.done"
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
    <div class="min-h-[44px] flex items-center py-1">
      <p 
        class="font-header font-normal text-lg leading-snug"
        :class="task.status === 'done' || task.done ? 'line-through text-brand-slate opacity-70' : task.priority.toLowerCase().includes('high') ? 'text-[#0b0f19] dark:text-slate-100' : 'text-[#3c3f47] dark:text-slate-200'"
      >
        {{ task.title }}
      </p>
    </div>

    <!-- Bottom row: avatar + date -->
    <div class="flex items-center justify-between pt-1">
      <!-- Avatar -->
      <div class="flex items-start">
        <div class="border-[2px] border-white/85 shadow-sm rounded-full w-[24px] h-[24px] overflow-hidden flex-shrink-0">
          <img src="../../assets/User Profile.png" alt="" class="w-full h-full object-cover" />
        </div>
      </div>
      <!-- Date -->
      <div 
        class="flex items-center gap-1.5 font-header font-bold text-[13px] transition-colors duration-300"
        :class="isOverdue ? 'text-red-500' : 'text-[#5c5e65] dark:text-slate-400'"
      >
        <PhWarningCircle v-if="isOverdue" :size="14" weight="fill" class="text-red-500 animate-pulse" />
        <PhCalendarBlank v-else :size="14" weight="bold" />
        <span>{{ task.due }}</span>
        <span v-if="isOverdue" class="text-[9px] font-extrabold uppercase tracking-wider bg-red-500/8 border border-red-500/15 px-1.5 py-0.5 rounded ml-1">Overdue</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { 
  PhCheckCircle, 
  PhArrowLeft, 
  PhArrowRight, 
  PhTrash, 
  PhCalendarBlank, 
  PhCheck,
  PhWarningCircle
} from '@phosphor-icons/vue'
import Badge from '../ui/Badge.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['move', 'delete', 'toggle', 'click'])

const onDragStart = (e) => {
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', String(props.task.id))
}

const isOverdue = computed(() => {
  if (props.task.status === 'done' || props.task.done) return false
  if (!props.task.dueDate) return false
  
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  const todayStr = `${yyyy}-${mm}-${dd}`
  
  return props.task.dueDate < todayStr
})

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
  if (status === 'todo') {
    return 'bg-gradient-to-br from-primary/5 via-white/50 dark:via-slate-900/40 to-white/80 dark:to-slate-900/60 border-primary/30 dark:border-primary/20 backdrop-blur-md hover:from-primary/10 hover:border-primary/50'
  }
  if (status === 'inprogress') {
    return 'bg-gradient-to-br from-amber-500/5 via-white/50 dark:via-slate-900/40 to-white/80 dark:to-slate-900/60 border-amber-500/30 dark:border-amber-500/20 backdrop-blur-md hover:from-amber-500/10 hover:border-amber-500/50'
  }
  if (status === 'review') {
    return 'bg-gradient-to-br from-red-500/5 via-white/50 dark:via-slate-900/40 to-white/80 dark:to-slate-900/60 border-red-500/30 dark:border-red-500/20 backdrop-blur-md hover:from-red-500/10 hover:border-red-500/50'
  }
  if (status === 'done') {
    return 'bg-gradient-to-br from-emerald-500/5 via-white/30 dark:via-slate-900/30 to-white/50 dark:to-slate-900/50 border-emerald-500/20 dark:border-emerald-500/10 opacity-75 blur-[0.2px] hover:from-emerald-500/10 hover:border-emerald-500/40'
  }
  return 'bg-gradient-to-br from-white/80 to-white/40 border-black/10'
})
</script>
