<template>
  <div 
    @click="$emit('click')"
    class="group relative border border-solid rounded-xl p-[17px] flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
    :class="cardStyle"
  >
    <!-- Top row: priority badge + done check icon -->
    <div class="flex items-start justify-between">
      <Badge :type="badgeType">
        {{ task.priority }}
      </Badge>
      
      <div v-if="task.status === 'done' || task.done" class="overflow-clip relative shrink-0 w-[24px] h-[24px] flex items-center justify-center">
        <PhCheckCircle :size="22" weight="regular" class="text-[#39a1b9]" />
      </div>
      <div v-else class="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-200">
        <button @click.stop="$emit('move', -1)" class="w-6 h-6 rounded-lg bg-black/5 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-200 cursor-pointer">
          <PhArrowLeft :size="11" weight="bold" />
        </button>
        <button @click.stop="$emit('move', 1)" class="w-6 h-6 rounded-lg bg-black/5 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-200 cursor-pointer">
          <PhArrowRight :size="11" weight="bold" />
        </button>
        <button @click.stop="$emit('delete')" class="w-6 h-6 rounded-lg bg-black/5 hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-all duration-200 cursor-pointer">
          <PhTrash :size="11" weight="bold" />
        </button>
      </div>
    </div>

    <!-- Title -->
    <div class="h-11 flex items-center">
      <p 
        class="font-header font-normal text-lg leading-snug"
        :class="task.status === 'done' || task.done ? 'line-through text-brand-slate opacity-70' : task.priority.toLowerCase().includes('high') ? 'text-[#0b0f19]' : 'text-[#3c3f47]'"
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
      <div class="flex items-center gap-1.5 text-[#5c5e65] font-header font-bold text-[13px]">
        <PhCalendarBlank :size="14" weight="bold" />
        <span>{{ task.due }}</span>
      </div>
    </div>

    <!-- Checkbox (done toggle) -->
    <button
      v-if="task.status !== 'done' && !task.done"
      @click.stop="$emit('toggle')"
      class="absolute top-4 right-16 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 border-brand-slate/30 bg-transparent hover:border-primary"
    >
      <PhCheck v-if="task.status === 'done' || task.done" :size="10" weight="bold" class="text-white" />
    </button>
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
  PhCheck 
} from '@phosphor-icons/vue'
import Badge from '../ui/Badge.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['move', 'delete', 'toggle', 'click'])

const badgeType = computed(() => {
  const p = props.task.priority.toLowerCase()
  if (props.task.status === 'done' || props.task.done) return 'completed'
  if (p.includes('high')) return 'high'
  if (p.includes('medium') || p.includes('med')) return 'medium'
  if (p.includes('low')) return 'low'
  return 'default'
})

const cardStyle = computed(() => {
  const t = props.task
  if (t.status === 'done' || t.done) {
    return 'bg-gradient-to-br from-brand-slate/5 via-white/30 to-white/50 border-[#39a1b9] blur-[0.35px] opacity-70'
  }
  const priorityLower = t.priority.toLowerCase()
  if (priorityLower.includes('high')) {
    return 'bg-gradient-to-br from-red-500/5 via-white/50 to-white/80 border-[#ffb4ab] hover:from-red-500/10'
  }
  if (priorityLower.includes('medium') || priorityLower.includes('med')) {
    return 'bg-gradient-to-br from-primary/5 via-white/50 to-white/80 border-[#3c81f5] backdrop-blur-md hover:from-primary/10'
  }
  if (priorityLower.includes('low')) {
    return 'bg-gradient-to-br from-[#571bc1]/5 via-white/50 to-white/80 border-[rgba(87,27,193,0.3)] backdrop-blur-md hover:from-[#571bc1]/10'
  }
  return 'bg-gradient-to-br from-white/80 to-white/40 border-black/10'
})
</script>
