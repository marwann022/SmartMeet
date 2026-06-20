<template>
  <div class="flex flex-col gap-10">
    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h2 class="text-3xl font-bold font-header text-brand-dark tracking-tight">Tasks</h2>
        <p class="text-sm text-brand-slate mt-1">AI-extracted action items from your meetings</p>
      </div>
      
      <div class="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto">
        <!-- Local Search Bar -->
        <SearchBar 
          v-model="localSearchQuery" 
          placeholder="Search tasks..." 
          class="w-64"
        />
        
        <Button variant="primary" @click="openAddModal('todo')" class="flex-shrink-0">
          <template #icon-left>
            <PhPlus :size="14" weight="bold" />
          </template>
          Add Task
        </Button>
      </div>
    </div>

    <!-- Kanban Grid: 4 columns -->
    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
        <!-- Columns loop -->
        <div 
          v-for="col in columns" 
          :key="col.id" 
          class="group flex flex-col gap-4 rounded-[24px] p-4 border border-solid transition-all duration-300 relative"
          :class="[
            columnThemes[col.id].bg,
            columnThemes[col.id].border,
            columnThemes[col.id].accentBorder,
            activeDragColumn === col.id ? `${columnThemes[col.id].glowBorder} ${columnThemes[col.id].glowBg} scale-[1.01] shadow-[0_12px_36px_rgba(0,0,0,0.08)]` : 'shadow-[0_4px_20px_rgba(0,0,0,0.01)]'
          ]"
          @dragover.prevent
          @dragenter.prevent="activeDragColumn = col.id"
          @drop="onDrop($event, col.id)"
        >
          <div class="flex items-center justify-between px-1 pb-1">
            <div class="flex items-center gap-2">
              <!-- Animated Status Indicator Dot -->
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="columnThemes[col.id].dot"></span>
                <span class="relative inline-flex rounded-full h-2 w-2" :class="columnThemes[col.id].dot"></span>
              </span>
              
              <span class="font-header font-bold text-lg text-brand-dark leading-8 transition-colors duration-300" :class="columnThemes[col.id].labelColor">
                {{ col.label }}
              </span>
              
              <span class="font-header font-bold text-[11px] px-2 py-0.5 rounded-full transition-all duration-300 transform group-hover:scale-105" :class="columnThemes[col.id].badge">
                {{ tasksByStatus(col.id).length }}
              </span>
            </div>
          </div>

          <TransitionGroup name="task-item" tag="div" class="flex flex-col gap-4 min-h-[180px] relative w-full pb-10">
            <TaskCard 
              v-for="task in tasksByStatus(col.id)" 
              :key="task.id" 
              :task="task"
              @move="(dir) => taskStore.moveTask(task, dir)" 
              @delete="taskStore.removeTask(task.id)" 
              @toggle="taskStore.toggleTask(task)" 
              @click="selectedTask = task" 
            />
            
            <div 
              v-if="tasksByStatus(col.id).length === 0"
              :key="'empty-' + col.id"
              class="border border-dashed rounded-2xl flex flex-col items-center justify-center py-10 gap-2 w-full min-h-[150px] transition-all duration-300 bg-white/20"
              :class="columnThemes[col.id].emptyBorder"
            >
              <component :is="col.icon" :size="26" weight="light" class="transition-transform duration-300 group-hover:scale-110" />
              <span class="text-xs font-body font-medium">No tasks yet</span>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- Reusable Modal for Task Detail -->
    <Modal :show="!!selectedTask" :title="selectedTask?.title" @close="selectedTask = null" maxWidth="lg">
      <div v-if="selectedTask" class="flex flex-col gap-4 text-left">
        <div class="flex items-center gap-2.5">
          <Badge :type="badgeType(selectedTask)">
            {{ selectedTask.priority }}
          </Badge>
          <span class="text-[10px] text-brand-slate font-body">· {{ selectedTask.source }}</span>
        </div>
        
        <p class="text-brand-slate text-sm leading-relaxed font-body">
          {{ selectedTask.description }}
        </p>
        
        <div class="flex items-center gap-4 text-sm border-t border-black/5 pt-4">
          <div class="flex items-center gap-2">
            <img src="../../assets/User Profile.png" class="w-7 h-7 rounded-full object-cover border-2 border-white/85 shadow-sm" alt="assignee" />
            <span class="font-header font-bold text-xs text-brand-dark">{{ selectedTask.assignee }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-[#5c5e65] font-header font-bold text-xs">
            <PhCalendarBlank :size="14" weight="bold" />
            {{ selectedTask.due }}
          </div>
        </div>
        
        <div class="flex gap-3 pt-4 border-t border-black/5">
          <Button 
            class="flex-1"
            :variant="selectedTask.status === 'done' || selectedTask.done ? 'outline' : 'primary'"
            @click="taskStore.toggleTask(selectedTask); selectedTask = null"
          >
            {{ selectedTask.status === 'done' || selectedTask.done ? 'Mark Incomplete' : 'Mark Complete ✓' }}
          </Button>
          <Button variant="danger" @click="taskStore.removeTask(selectedTask.id); selectedTask = null">
            Delete
          </Button>
        </div>
      </div>
    </Modal>

    <!-- Reusable Modal for Add Task -->
    <Modal :show="showAddModal" :title="modalTitle" @close="showAddModal = false" maxWidth="md" :theme="modalTheme">
      <div class="flex flex-col gap-4 text-left">
        <Input v-model="newTask.title" label="Task Title" placeholder="What needs to be done?" :theme="modalTheme" />
        
        <div class="flex flex-col gap-1.5 w-full">
          <label class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate pl-1 font-header">Description</label>
          <textarea 
            v-model="newTask.description" 
            placeholder="Provide details..." 
            rows="3"
            class="w-full px-4 py-3 rounded-xl bg-white border font-body text-sm text-brand-dark placeholder-brand-slate/50 focus:outline-none transition-all duration-300 resize-none"
            :class="textareaThemeClasses[modalTheme]"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Custom Status Dropdown Component -->
          <Select 
            v-model="newTask.status" 
            :options="statusOptions" 
            label="Status"
            :theme="modalTheme"
          />

          <!-- Custom Priority Dropdown Component -->
          <Select 
            v-model="newTask.priority" 
            :options="priorityOptions" 
            label="Priority"
            :theme="modalTheme"
          />
        </div>

        <!-- Modern Date Picker Selector -->
        <DatePicker 
          v-model="newTask.dueDate" 
          label="Due Date" 
          direction="up"
          :theme="modalTheme"
        />

        <Button variant="primary" class="w-full mt-4" @click="addTask" :theme="modalTheme">
          <template #icon-left>
            <PhPlus :size="13" weight="bold" />
          </template>
          Create Task
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  PhPlus, PhClock, PhArrowsClockwise, PhEye, PhCheckCircle,
  PhCalendarBlank, PhX, PhCheck
} from '@phosphor-icons/vue'
import { useTaskStore } from '../../stores/task'
import TaskCard from './TaskCard.vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Modal from '../ui/Modal.vue'
import Badge from '../ui/Badge.vue'
import Select from '../ui/Select.vue'
import DatePicker from '../ui/DatePicker.vue'
import SearchBar from '../ui/SearchBar.vue'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const taskStore = useTaskStore()

const columns = [
  { id: 'todo', label: 'To Do', icon: PhClock },
  { id: 'inprogress', label: 'In Progress', icon: PhArrowsClockwise },
  { id: 'review', label: 'Review', icon: PhEye },
  { id: 'done', label: 'Done', icon: PhCheckCircle }
]

const tasksByStatus = (status) => {
  const list = taskStore.tasks.filter(t => t.status === status)
  if (!localSearchQuery.value) return list
  const q = localSearchQuery.value.toLowerCase()
  return list.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)))
}

const badgeType = (task) => {
  const p = task.priority.toLowerCase()
  if (task.status === 'done' || task.done) return 'completed'
  if (p.includes('high')) return 'high'
  if (p.includes('medium') || p.includes('med')) return 'medium'
  if (p.includes('low')) return 'low'
  return 'default'
}

const selectedTask = ref(null)
const showAddModal = ref(false)
const priorityOptions = [
  { value: 'HIGH PRIORITY', label: 'High', color: 'bg-red-500' },
  { value: 'MEDIUM PRIORITY', label: 'Medium', color: 'bg-primary' },
  { value: 'LOW PRIORITY', label: 'Low', color: 'bg-purple-500' }
]

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' }
]

const modalTitle = computed(() => {
  const col = columns.find(c => c.id === newTask.value.status)
  return col ? `New Task (${col.label})` : 'New Task'
})

const localSearchQuery = ref('')

const columnThemes = {
  todo: {
    bg: 'bg-white/20 hover:bg-white/30',
    border: 'border-black/5 hover:border-black/10',
    glowBorder: 'border-primary',
    glowBg: 'bg-primary/[0.03]',
    badge: 'bg-primary/8 text-primary border border-primary/10',
    dot: 'bg-primary shadow-[0_0_8px_rgba(60,129,245,0.4)]',
    buttonHover: 'hover:bg-primary/10 hover:text-primary hover:border-primary/20',
    labelColor: 'group-hover:text-primary',
    accentBorder: 'border-t-[3px] border-t-primary/70',
    emptyBorder: 'border-primary/15 text-primary/40'
  },
  inprogress: {
    bg: 'bg-white/20 hover:bg-white/30',
    border: 'border-black/5 hover:border-black/10',
    glowBorder: 'border-amber-500',
    glowBg: 'bg-amber-500/[0.03]',
    badge: 'bg-amber-500/8 text-amber-600 border border-amber-500/10',
    dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]',
    buttonHover: 'hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/20',
    labelColor: 'group-hover:text-amber-600',
    accentBorder: 'border-t-[3px] border-t-amber-500/70',
    emptyBorder: 'border-amber-500/15 text-amber-600/40'
  },
  review: {
    bg: 'bg-white/20 hover:bg-white/30',
    border: 'border-black/5 hover:border-black/10',
    glowBorder: 'border-red-500',
    glowBg: 'bg-red-500/[0.03]',
    badge: 'bg-red-500/8 text-red-500 border border-red-500/10',
    dot: 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]',
    buttonHover: 'hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20',
    labelColor: 'group-hover:text-red-500',
    accentBorder: 'border-t-[3px] border-t-red-500/70',
    emptyBorder: 'border-red-500/15 text-red-500/40'
  },
  done: {
    bg: 'bg-white/20 hover:bg-white/30',
    border: 'border-black/5 hover:border-black/10',
    glowBorder: 'border-emerald-500',
    glowBg: 'bg-emerald-500/[0.03]',
    badge: 'bg-emerald-500/8 text-emerald-600 border border-emerald-500/10',
    dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
    buttonHover: 'hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/20',
    labelColor: 'group-hover:text-emerald-600',
    accentBorder: 'border-t-[3px] border-t-emerald-500/70',
    emptyBorder: 'border-emerald-500/15 text-emerald-600/40'
  }
}

const activeDragColumn = ref(null)

const onDrop = (event, status) => {
  event.preventDefault()
  activeDragColumn.value = null
  const taskId = event.dataTransfer.getData('text/plain')
  if (taskId) {
    taskStore.setTaskStatus(taskId, status)
  }
}

const onDragEndGlobal = () => {
  activeDragColumn.value = null
}

onMounted(() => {
  window.addEventListener('dragend', onDragEndGlobal)
})

onUnmounted(() => {
  window.removeEventListener('dragend', onDragEndGlobal)
})

const modalTheme = computed(() => {
  return newTask.value.status || 'todo'
})

const textareaThemeClasses = {
  todo: 'border-primary/20 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)]',
  inprogress: 'border-amber-500/20 focus:border-amber-500/30 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.08)]',
  review: 'border-red-500/20 focus:border-red-500/30 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]',
  done: 'border-emerald-500/20 focus:border-emerald-500/30 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
}

// Date picker utility functions
const getTodayDateString = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const formatDateString = (dateStr) => {
  if (!dateStr) return 'TBD'
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const date = new Date(parts[0], parts[1] - 1, parts[2])
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const newTask = ref({ 
  title: '', 
  description: '', 
  priority: 'MEDIUM PRIORITY', 
  due: '', 
  dueDate: getTodayDateString(), 
  status: 'todo' 
})

const openAddModal = (status = 'todo') => {
  newTask.value = { 
    title: '', 
    description: '', 
    priority: 'MEDIUM PRIORITY', 
    due: '', 
    dueDate: getTodayDateString(), 
    status 
  }
  showAddModal.value = true
}

const addTask = () => {
  if (!newTask.value.title.trim()) return
  taskStore.addTask({
    title: newTask.value.title,
    description: newTask.value.description,
    priority: newTask.value.priority,
    status: newTask.value.status,
    due: formatDateString(newTask.value.dueDate),
    dueDate: newTask.value.dueDate,
    source: 'Manual Entry'
  })
  showAddModal.value = false
}
</script>

<style scoped>
.task-item-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.task-item-leave-active { transition: all 0.2s ease-in; position: absolute; width: 100%; }
.task-item-enter-from   { opacity: 0; transform: translateY(12px) scale(0.96); }
.task-item-leave-to     { opacity: 0; transform: translateY(-8px) scale(0.96); }
.task-item-move         { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

</style>
