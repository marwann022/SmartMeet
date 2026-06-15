<template>
  <div class="flex flex-col gap-10">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold font-header text-brand-dark tracking-tight">Tasks</h2>
        <p class="text-sm text-brand-slate mt-1">AI-extracted action items from your meetings</p>
      </div>
      <Button variant="primary" @click="openAddModal('todo')">
        <template #icon-left>
          <PhPlus :size="14" weight="bold" />
        </template>
        Add Task
      </Button>
    </div>

    <!-- Kanban Grid: 4 columns -->
    <div class="flex flex-col gap-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Columns loop -->
        <div v-for="col in columns" :key="col.id" class="flex flex-col gap-4">
          <div class="flex items-center justify-between px-2">
            <div class="flex items-center gap-2">
              <span class="font-header font-bold text-xl text-brand-dark leading-8">{{ col.label }}</span>
              <span class="bg-[#181b25] text-[#b5b5b5] font-header font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                {{ tasksByStatus(col.id).length }}
              </span>
            </div>
            <button 
              @click="openAddModal(col.id)" 
              class="w-[24px] h-[24px] flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-brand-slate transition-all duration-200 cursor-pointer"
            >
              <PhPlus :size="18" weight="bold" />
            </button>
          </div>

          <TransitionGroup name="task-item" tag="div" class="flex flex-col gap-4 min-h-[150px]">
            <TaskCard 
              v-for="task in tasksByStatus(col.id)" 
              :key="task.id" 
              :task="task"
              @move="(dir) => taskStore.moveTask(task, dir)" 
              @delete="taskStore.removeTask(task.id)" 
              @toggle="taskStore.toggleTask(task)" 
              @click="selectedTask = task" 
            />
          </TransitionGroup>

          <div 
            v-if="tasksByStatus(col.id).length === 0"
            class="border-2 border-dashed border-black/8 rounded-xl flex flex-col items-center justify-center py-8 text-brand-slate/40 gap-2"
          >
            <component :is="col.icon" :size="24" weight="light" />
            <span class="text-xs font-body">No tasks yet</span>
          </div>
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
    <Modal :show="showAddModal" title="New Task" @close="showAddModal = false" maxWidth="md">
      <div class="flex flex-col gap-4 text-left">
        <Input v-model="newTask.title" label="Task Title" placeholder="What needs to be done?" />
        
        <div class="flex flex-col gap-1.5 w-full">
          <label class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate pl-1">Description</label>
          <textarea 
            v-model="newTask.description" 
            placeholder="Provide details..." 
            rows="3"
            class="w-full px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark placeholder-brand-slate/50 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300 resize-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate pl-1">Priority</label>
            <select 
              v-model="newTask.priority"
              class="px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <option value="HIGH PRIORITY">High</option>
              <option value="MEDIUM PRIORITY">Medium</option>
              <option value="LOW PRIORITY">Low</option>
            </select>
          </div>
          
          <Input v-model="newTask.due" label="Due Date" placeholder="e.g., Jun 20" />
        </div>

        <Button variant="primary" class="w-full mt-4" @click="addTask">
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
import { ref } from 'vue'
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
  if (!props.searchQuery) return list
  const q = props.searchQuery.toLowerCase()
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
const newTask = ref({ title: '', description: '', priority: 'MEDIUM PRIORITY', due: '', status: 'todo' })

const openAddModal = (status = 'todo') => {
  newTask.value = { title: '', description: '', priority: 'MEDIUM PRIORITY', due: '', status }
  showAddModal.value = true
}

const addTask = () => {
  if (!newTask.value.title.trim()) return
  taskStore.addTask({
    title: newTask.value.title,
    description: newTask.value.description,
    priority: newTask.value.priority,
    status: newTask.value.status,
    due: newTask.value.due || 'TBD',
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
