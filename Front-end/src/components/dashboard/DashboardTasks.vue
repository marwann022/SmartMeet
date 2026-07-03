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

    <!-- Overall Priority Stats Widget -->
    <div class="flex items-center bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-[28px] p-5 py-4 shadow-sm w-fit mr-auto -mt-6">
      <div class="flex flex-col items-center px-6 border-r border-black/5 dark:border-white/10">
        <span class="text-[10px] uppercase font-extrabold tracking-wider text-brand-slate font-header">Total Tasks</span>
        <span class="text-[26px] font-header font-bold text-brand-dark leading-none mt-2">{{ taskStore.tasks.length }}</span>
      </div>
      <div class="flex flex-col items-center px-6 border-r border-black/5 dark:border-white/10">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"></span>
          <span class="text-[10px] uppercase font-extrabold tracking-wider text-brand-slate font-header">High</span>
        </div>
        <span class="text-[26px] font-header font-bold text-brand-dark leading-none mt-2">{{ highTasksCount }}</span>
      </div>
      <div class="flex flex-col items-center px-6 border-r border-black/5 dark:border-white/10">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(75,104,255,0.4)]"></span>
          <span class="text-[10px] uppercase font-extrabold tracking-wider text-brand-slate font-header">Medium</span>
        </div>
        <span class="text-[26px] font-header font-bold text-brand-dark leading-none mt-2">{{ mediumTasksCount }}</span>
      </div>
      <div class="flex flex-col items-center px-6">
        <div class="flex items-center gap-1.5">
          <span class="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]"></span>
          <span class="text-[10px] uppercase font-extrabold tracking-wider text-brand-slate font-header">Low</span>
        </div>
        <span class="text-[26px] font-header font-bold text-brand-dark leading-none mt-2">{{ lowTasksCount }}</span>
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
              @move="(dir) => handleMoveTask(task, dir)" 
              @delete="taskStore.removeTask(task.id || task._id)" 
              @toggle="taskStore.toggleTask(task)" 
              @click="selectedTask = task"
              @approve="handleCardApprove"
              @reject="handleCardReject"
            />
            
            <div 
              v-if="tasksByStatus(col.id).length === 0"
              :key="'empty-' + col.id"
              class="border border-dashed rounded-2xl flex flex-col items-center justify-center py-10 gap-2 w-full min-h-[150px] transition-all duration-300 bg-white/20 dark:bg-white/[0.01]"
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
    <Modal :show="!!selectedTask" title="" :theme="selectedTask?.status" @close="selectedTask = null; isEditingTask = false" maxWidth="lg">
      <div v-if="selectedTask" class="flex flex-col gap-4 text-left">
        <template v-if="isEditingTask">
          <h3 class="font-header font-bold text-lg text-brand-dark mb-2">Edit Task Details</h3>
          <Input v-model="editTaskForm.title" label="Task Title" theme="primary" />
          
          <div class="flex flex-col gap-1.5 w-full">
            <label class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate pl-1 font-header">Description</label>
            <textarea 
              v-model="editTaskForm.description" 
              rows="3"
              class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/50 border font-body text-sm text-brand-dark dark:text-slate-200 focus:outline-none transition-all duration-300 resize-none border-primary/20 dark:border-white/10 focus:border-primary/30"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Custom Assignee Dropdown -->
            <Select 
              v-model="editTaskForm.assigneeId" 
              :options="members.map(m => ({ value: m.id, label: m.name }))" 
              label="Assignee"
              theme="primary"
            />

            <!-- Custom Priority Dropdown -->
            <Select 
              v-model="editTaskForm.priority" 
              :options="priorityOptions" 
              label="Priority"
              theme="primary"
            />
          </div>

          <!-- Due Date + optional Due Time -->
          <div class="grid grid-cols-2 gap-4">
            <DatePicker
              v-model="editTaskForm.dueDate"
              label="Due Date"
              direction="up"
              theme="primary"
            />
            <TimePicker
              v-model="editTaskForm.dueTime"
              label="Due Time (optional)"
            />
          </div>

          <div class="flex gap-3 mt-4 border-t border-black/5 dark:border-white/10 pt-4">
            <Button variant="primary" class="flex-1" @click="saveTaskDetails">
              Save Details
            </Button>
            <Button variant="outline" class="flex-1" @click="cancelEditing">
              Cancel
            </Button>
          </div>
        </template>
        <template v-else>
          <!-- Title -->
          <h3 
            class="font-header font-bold text-xl text-brand-dark leading-snug"
            :class="selectedTask.status === 'done' || selectedTask.done ? 'line-through text-brand-slate opacity-70' : ''"
          >
            {{ selectedTask.title }}
          </h3>

          <div class="flex items-center gap-2.5">
            <Badge :type="badgeType(selectedTask)">
              {{ formatPriority(selectedTask.priority) }}
            </Badge>
            <span class="text-[10px] text-brand-slate dark:text-slate-400 font-body">· {{ selectedTask.source }}</span>
          </div>
          
          <p class="text-brand-slate dark:text-slate-300 text-sm leading-relaxed font-body">
            {{ selectedTask.description }}
          </p>
          
          <div class="flex items-center gap-4 text-sm border-t border-black/5 dark:border-white/10 pt-4">
            <div class="flex items-center gap-2">
              <UserAvatar :user="selectedTask.user" :name="selectedTask.assignee" size="sm" />
              <div class="flex flex-col">
                <span class="font-header font-bold text-xs text-brand-dark">{{ selectedTask.assignee }}</span>
                <span class="text-[11px] font-medium leading-tight" style="color: #4F7CFF">
                  {{ selectedTask.user?.role === 'admin' ? 'Community Admin' : 'Community Member' }}
                </span>
              </div>
            </div>
            <div class="flex items-center gap-1.5 text-[#5c5e65] dark:text-slate-400 font-header font-bold text-xs">
              <PhCalendarBlank :size="14" weight="bold" />
              {{ selectedTask.due }}
            </div>
          </div>

          <div v-if="selectedTask.createdBy" class="text-xs text-brand-slate/70 mt-1">
            Created by {{ selectedTask.createdBy?.name || 'Unknown' }}
          </div>

          <!-- Review History -->
          <div v-if="selectedTask.reviewHistory && selectedTask.reviewHistory.length > 0" class="flex flex-col gap-2 border-t border-black/5 dark:border-white/10 pt-4">
            <label class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate pl-1 font-header">Review History</label>
            <div class="flex flex-col gap-1.5">
              <div v-for="entry in selectedTask.reviewHistory" :key="entry._id || entry.timestamp" class="flex items-center gap-2 text-xs">
                <span class="w-2 h-2 rounded-full flex-shrink-0" :class="entry.action === 'approved' ? 'bg-emerald-500' : entry.action === 'rejected' ? 'bg-red-500' : 'bg-amber-500'"></span>
                <span class="font-semibold text-brand-dark">
                  {{ entry.action === 'submitted' ? 'Submitted for review' : entry.action === 'approved' ? 'Approved' : 'Rejected' }}
                </span>
                <span v-if="entry.comment" class="text-brand-slate truncate max-w-[200px]" :title="entry.comment">— "{{ entry.comment }}"</span>
                <span class="text-brand-slate/60 ml-auto flex-shrink-0">{{ formatReviewTime(entry.timestamp) }}</span>
              </div>
            </div>
          </div>

          <!-- Interactive Stage Switcher in Modal -->
          <div class="flex flex-col gap-2 border-t border-black/5 dark:border-white/10 pt-4">
            <label class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate pl-1 font-header">Move Stage</label>
            <div class="grid grid-cols-4 gap-2">
              <button 
                v-for="opt in statusOptions"
                :key="opt.value"
                @click="selectStatus(opt.value)"
                :disabled="isLocked"
                class="py-2 px-2 rounded-xl border font-bold text-xs transition-all duration-300 text-center cursor-pointer font-header"
                :class="[
                  selectedTask.status === opt.value
                    ? 'bg-primary text-white border-transparent shadow-[0_4px_12px_rgba(75,104,255,0.25)]'
                    : 'bg-white/50 dark:bg-slate-900/50 border-black/5 dark:border-white/10 hover:bg-white dark:hover:bg-slate-900/85 text-brand-dark dark:text-slate-200 hover:border-black/10',
                  isLocked ? 'cursor-not-allowed opacity-50' : ''
                ]"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
          


          <div class="flex gap-3 pt-4 border-t border-black/5 dark:border-white/10">
            <Button 
              v-if="selectedTask.status !== 'review'"
              class="flex-1"
              :variant="selectedTask.status === 'done' || selectedTask.done ? 'outline' : 'primary'"
              @click="handleToggleTask"
              :disabled="isLocked"
            >
              {{ selectedTask.status === 'done' || selectedTask.done ? 'Mark Incomplete' : 'Mark Complete ✓' }}
            </Button>
            <Button v-if="authStore.user?.role === 'admin'" variant="outline" @click="startEditing">
              Edit Details
            </Button>
            <Button variant="danger" :disabled="isLocked" @click="taskStore.removeTask(selectedTask.id || selectedTask._id); selectedTask = null">
              Delete
            </Button>
          </div>
        </template>
      </div>
    </Modal>

    <!-- Reusable Modal for Add Task -->
    <Modal :show="showAddModal" title="New Task" @close="showAddModal = false" maxWidth="md" theme="primary">
      <div class="flex flex-col gap-4 text-left">
        <Input v-model="newTask.title" label="Task Title" placeholder="What needs to be done?" theme="primary" />
        
        <div class="flex flex-col gap-1.5 w-full">
          <label class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate pl-1 font-header">Description</label>
          <textarea 
            v-model="newTask.description" 
            placeholder="Provide details..." 
            rows="3"
            class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/50 border font-body text-sm text-brand-dark dark:text-slate-200 placeholder-brand-slate/50 dark:placeholder-brand-slate/40 focus:outline-none transition-all duration-300 resize-none border-primary/20 dark:border-white/10 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)]"
          />
        </div>

        <!-- Assignment Selection for Admin -->
        <div v-if="authStore.user?.role === 'admin'" class="flex flex-col gap-3 border-t border-black/5 dark:border-white/10 pt-3">
          <Select 
            v-model="selectedAssignmentType"
            :options="assignmentTypeOptions"
            label="Assignee Configuration"
            theme="primary"
          />

          <!-- Single member assignment selection -->
          <div v-if="selectedAssignmentType === 'one'" class="mt-1">
            <Select 
              v-model="selectedAssigneeId"
              :options="members.map(m => ({ value: m.id, label: m.name }))"
              label="Select Assignee"
              theme="primary"
            />
          </div>

          <!-- Custom member selection checklist -->
          <div v-if="selectedAssignmentType === 'custom'" class="mt-1 flex flex-col gap-2.5 max-h-[140px] overflow-y-auto border border-black/5 dark:border-white/10 rounded-xl p-3 bg-white/20 dark:bg-slate-900/20">
            <label class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate font-header mb-1 block">Select Custom Assignees</label>
            <div v-for="m in members" :key="m.id" class="py-0.5">
              <Checkbox 
                v-model="customAssignmentMap[m.id]"
                :label="m.name"
              />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Custom Status Dropdown Component -->
          <Select 
            v-model="newTask.status" 
            :options="statusOptions" 
            label="Status"
            theme="primary"
          />

          <!-- Custom Priority Dropdown Component -->
          <Select 
            v-model="newTask.priority" 
            :options="priorityOptions" 
            label="Priority"
            theme="primary"
          />
        </div>

        <!-- Due Date + optional Due Time -->
        <div class="grid grid-cols-2 gap-4">
          <DatePicker
            v-model="newTask.dueDate"
            label="Due Date"
            direction="up"
            theme="primary"
          />
          <TimePicker
            v-model="newTask.dueTime"
            label="Due Time (optional)"
          />
        </div>

        <Button variant="primary" class="w-full mt-4" @click="addTask" theme="primary">
          <template #icon-left>
            <PhPlus :size="13" weight="bold" />
          </template>
          Create Task
        </Button>
      </div>
    </Modal>

    <!-- Review Confirmation Modal -->
    <Modal
      :show="showReviewConfirmModal"
      title="Request Task Review"
      max-width="sm"
      theme="review"
      @close="cancelReviewAction"
    >
      <div class="flex flex-col gap-4 text-left">
        <div class="flex items-center gap-3 text-red-500 font-bold font-header">
          <PhWarningCircle :size="24" weight="bold" />
          <span>Warning: Irreversible Action</span>
        </div>
        <p class="text-sm text-brand-slate leading-relaxed font-body">
          Are you sure you want to request a review? This action will notify the admin that this task needs to be reviewed to be done.
        </p>
        <p class="text-xs text-brand-slate/80 font-bold font-body">
          Once submitted, you will no longer be able to undo or change the task back to its previous state.
        </p>
        <div class="flex justify-end gap-3 mt-4">
          <Button
            variant="glass"
            @click="cancelReviewAction"
          >
            Cancel
          </Button>
          <button
            @click="confirmReviewAction"
            class="px-4 py-2 border border-red-500 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
          >
            Confirm Review
          </button>
        </div>
      </div>
    </Modal>

    <!-- Approve Confirmation Modal -->
    <Modal
      :show="showApproveConfirm"
      title="Approve Task?"
      max-width="sm"
      theme="primary"
      @close="showApproveConfirm = false"
    >
      <div class="flex flex-col gap-4 text-left">
        <p class="text-sm text-brand-slate leading-relaxed font-body">
          This will mark the task as <strong>Done</strong> and notify the assigned member. Are you sure?
        </p>
        <div class="flex justify-end gap-3 mt-4">
          <Button variant="glass" @click="showApproveConfirm = false">Cancel</Button>
          <Button variant="primary" @click="confirmApprove">Approve</Button>
        </div>
      </div>
    </Modal>

    <!-- Reject Dialog Modal -->
    <Modal
      :show="showRejectDialog"
      title="Reject Task"
      max-width="sm"
      theme="danger"
      @close="closeRejectDialog"
    >
      <div class="flex flex-col gap-4 text-left">
        <p class="text-sm text-brand-slate leading-relaxed font-body">
          This will move the task back to <strong>In Progress</strong>. Optionally add a comment for the assignee.
        </p>
        <div class="flex flex-col gap-1.5">
          <label class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate pl-1 font-header">Comment (optional)</label>
          <textarea
            v-model="rejectComment"
            rows="3"
            placeholder="What needs to be changed?..."
            class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/50 border font-body text-sm text-brand-dark dark:text-slate-200 focus:outline-none transition-all duration-300 resize-none border-red-500/20 dark:border-white/10 focus:border-red-500/30"
          />
        </div>
        <div class="flex justify-end gap-3 mt-4">
          <Button variant="glass" @click="closeRejectDialog">Cancel</Button>
          <Button variant="danger" @click="confirmReject">Reject</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  PhPlus, PhClock, PhArrowsClockwise, PhEye, PhCheckCircle,
  PhCalendarBlank, PhX, PhCheck, PhWarningCircle
} from '@phosphor-icons/vue'
import { useTaskStore } from '../../stores/task'
import TaskCard from './TaskCard.vue'
import Button from '../ui/Button.vue'
import Input from '../ui/Input.vue'
import Modal from '../ui/Modal.vue'
import Badge from '../ui/Badge.vue'
import Select from '../ui/Select.vue'
import DatePicker from '../ui/DatePicker.vue'
import TimePicker from '../ui/TimePicker.vue'
import SearchBar from '../ui/SearchBar.vue'
import Checkbox from '../ui/Checkbox.vue'
import { useAuthStore } from '../../stores/auth'
import UserAvatar from '../common/UserAvatar.vue'
import axios from 'axios'
import { sortByUrgency, formatDateDisplay, getTodayString } from '../../utils/taskDeadline'
import { getChatSocket } from '@/services/chatSocket'

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
  let list = taskStore.tasks.filter(t => t.status === status)
  if (localSearchQuery.value) {
    const q = localSearchQuery.value.toLowerCase()
    list = list.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)))
  }
  return sortByUrgency(list)
}

const highTasksCount = computed(() => taskStore.tasks.filter(t => (t.priority || '').toLowerCase().includes('high')).length)
const mediumTasksCount = computed(() => taskStore.tasks.filter(t => (t.priority || '').toLowerCase().includes('medium') || (t.priority || '').toLowerCase().includes('med')).length)
const lowTasksCount = computed(() => taskStore.tasks.filter(t => (t.priority || '').toLowerCase().includes('low')).length)

const formatPriority = (p) => {
  if (!p) return ''
  const lower = p.toLowerCase()
  if (lower.includes('high')) return 'High'
  if (lower.includes('medium') || lower.includes('med')) return 'Medium'
  if (lower.includes('low')) return 'Low'
  return p
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
  { value: 'High', label: 'High', color: 'bg-red-500' },
  { value: 'Medium', label: 'Medium', color: 'bg-primary' },
  { value: 'Low', label: 'Low', color: 'bg-purple-500' }
]

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' }
]

const localSearchQuery = ref('')

const columnThemes = {
  todo: {
    bg: 'bg-white/20 dark:bg-slate-900/30 hover:bg-white/30 dark:hover:bg-slate-900/50',
    border: 'border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10',
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
    bg: 'bg-white/20 dark:bg-slate-900/30 hover:bg-white/30 dark:hover:bg-slate-900/50',
    border: 'border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10',
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
    bg: 'bg-white/20 dark:bg-slate-900/30 hover:bg-white/30 dark:hover:bg-slate-900/50',
    border: 'border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10',
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
    bg: 'bg-white/20 dark:bg-slate-900/30 hover:bg-white/30 dark:hover:bg-slate-900/50',
    border: 'border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10',
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

const showReviewConfirmModal = ref(false)
let pendingReviewConfirmAction = null

const triggerReviewConfirmModal = (action) => {
  pendingReviewConfirmAction = action
  showReviewConfirmModal.value = true
}

const confirmReviewAction = () => {
  if (pendingReviewConfirmAction) {
    pendingReviewConfirmAction()
    pendingReviewConfirmAction = null
  }
  showReviewConfirmModal.value = false
}

const cancelReviewAction = () => {
  pendingReviewConfirmAction = null
  showReviewConfirmModal.value = false
}

const onDrop = (event, status) => {
  event.preventDefault()
  activeDragColumn.value = null
  const taskId = event.dataTransfer.getData('text/plain')
  if (taskId) {
    const task = taskStore.tasks.find(t => String(t.id) === String(taskId) || String(t._id) === String(taskId))
    if (task && status === 'review' && authStore.user?.role !== 'admin') {
      triggerReviewConfirmModal(() => {
        taskStore.setTaskStatus(taskId, status)
      })
    } else {
      taskStore.setTaskStatus(taskId, status)
    }
  }
}

const handleMoveTask = (task, direction) => {
  const statusOrder = ['todo', 'inprogress', 'review', 'done']
  const currentIndex = statusOrder.indexOf(task.status)
  const nextIndex = currentIndex + direction
  if (nextIndex >= 0 && nextIndex < statusOrder.length) {
    const nextStatus = statusOrder[nextIndex]
    if (nextStatus === 'review' && authStore.user?.role !== 'admin') {
      triggerReviewConfirmModal(() => {
        taskStore.moveTask(task, direction)
      })
    } else {
      taskStore.moveTask(task, direction)
    }
  }
}

const onDragEndGlobal = () => {
  activeDragColumn.value = null
}

onMounted(() => {
  window.addEventListener('dragend', onDragEndGlobal)
  taskStore.fetchTasks()
  loadMembers()

  const socket = getChatSocket()
  if (socket) {
    socket.on('task:notification', () => {
      taskStore.fetchTasks()
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('dragend', onDragEndGlobal)

  const socket = getChatSocket()
  if (socket) {
    socket.off('task:notification')
  }
})

const newTask = ref({
  title: '',
  description: '',
  priority: 'Medium',
  due: '',
  dueDate: getTodayString(),
  dueTime: '23:59',
  status: 'todo',
})

const authStore = useAuthStore()
const members = ref([])
const selectedAssignmentType = ref('one')
const selectedAssigneeId = ref('')
const customAssignmentMap = ref({})

const assignmentTypeOptions = [
  { value: 'all', label: 'Assign to All Members' },
  { value: 'one', label: 'Assign to One Member' },
  { value: 'custom', label: 'Assign to Custom Selected Members' }
]

const isEditingTask = ref(false)
const editTaskForm = ref({
  title: '',
  description: '',
  priority: 'Medium',
  assigneeId: '',
  dueDate: '',
  dueTime: '23:59',
})

const loadMembers = async () => {
  if (authStore.user?.role === 'admin') {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const { data } = await axios.get('http://localhost:5000/api/communities/members', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (data.success) {
        members.value = data.members
          .filter(m => m.role !== 'admin')
          .map(m => ({
            id: m._id || m.id,
            name: `${m.firstName} ${m.lastName}`.trim(),
            email: m.email
          }))
        if (members.value.length > 0 && !selectedAssigneeId.value) {
          selectedAssigneeId.value = members.value[0].id
        }
      }
    } catch (err) {
      console.error('Failed to load community members:', err)
    }
  }
}

const isLocked = computed(() => {
  if (!selectedTask.value) return false
  const isAdmin = authStore.user?.role === 'admin'
  return !isAdmin && (selectedTask.value.status === 'review' || selectedTask.value.status === 'done')
})

const showApproveConfirm = ref(false)
const showRejectDialog = ref(false)
const rejectComment = ref('')
const pendingCardTask = ref(null)

const handleCardApprove = (task) => {
  pendingCardTask.value = task
  showApproveConfirm.value = true
}

const confirmApprove = async () => {
  if (!pendingCardTask.value) return
  const id = pendingCardTask.value.id || pendingCardTask.value._id
  await taskStore.approveTask(id)
  showApproveConfirm.value = false
  pendingCardTask.value = null
}

const handleCardReject = (task) => {
  pendingCardTask.value = task
  rejectComment.value = ''
  showRejectDialog.value = true
}

const confirmReject = async () => {
  if (!pendingCardTask.value) return
  const id = pendingCardTask.value.id || pendingCardTask.value._id
  await taskStore.rejectTask(id, rejectComment.value)
  showRejectDialog.value = false
  rejectComment.value = ''
  pendingCardTask.value = null
}

const closeRejectDialog = () => {
  showRejectDialog.value = false
  rejectComment.value = ''
  pendingCardTask.value = null
}

const formatReviewTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const startEditing = () => {
  if (!selectedTask.value) return
  editTaskForm.value = {
    title: selectedTask.value.title,
    description: selectedTask.value.description || '',
    priority: formatPriority(selectedTask.value.priority),
    assigneeId: selectedTask.value.user?._id || selectedTask.value.user || '',
    dueDate: selectedTask.value.dueDate || '',
    dueTime: selectedTask.value.dueTime || '23:59',
  }
  isEditingTask.value = true
}

const saveTaskDetails = async () => {
  if (!selectedTask.value) return
  const payload = {
    id: selectedTask.value.id || selectedTask.value._id,
    title: editTaskForm.value.title,
    description: editTaskForm.value.description,
    priority: editTaskForm.value.priority,
    assigneeId: editTaskForm.value.assigneeId,
    dueDate: editTaskForm.value.dueDate,
    dueTime: editTaskForm.value.dueTime || '23:59',
    due: formatDateDisplay(editTaskForm.value.dueDate),
  }
  
  await taskStore.updateTask(payload)
  
  const updated = taskStore.tasks.find(t => t.id === payload.id || t._id === payload.id)
  if (updated) {
    selectedTask.value = updated
  }
  isEditingTask.value = false
}

const cancelEditing = () => {
  isEditingTask.value = false
}

const openAddModal = (status = 'todo') => {
  newTask.value = {
    title: '',
    description: '',
    priority: 'Medium',
    due: '',
    dueDate: getTodayString(),
    dueTime: '23:59',
    status,
  }
  selectedAssignmentType.value = 'one'
  selectedAssigneeId.value = authStore.user?._id || ''
  customAssignmentMap.value = {}
  showAddModal.value = true
}

const addTask = () => {
  if (!newTask.value.title.trim()) return
  
  let assigneeIds = []
  let assignToEveryone = false
  if (authStore.user?.role === 'admin') {
    if (selectedAssignmentType.value === 'all') {
      assignToEveryone = true
    } else if (selectedAssignmentType.value === 'one') {
      assigneeIds = [selectedAssigneeId.value]
    } else if (selectedAssignmentType.value === 'custom') {
      assigneeIds = Object.keys(customAssignmentMap.value).filter(id => customAssignmentMap.value[id])
    }
  } else {
    assigneeIds = [authStore.user?._id]
  }

  let assigneeName = 'Alex Chen'
  if (assigneeIds.length === 1) {
    const matched = members.value.find(m => m.id === assigneeIds[0])
    if (matched) assigneeName = matched.name
  }

  taskStore.addTask({
    title: newTask.value.title,
    description: newTask.value.description,
    priority: newTask.value.priority,
    status: newTask.value.status,
    due: formatDateDisplay(newTask.value.dueDate),
    dueDate: newTask.value.dueDate,
    dueTime: newTask.value.dueTime || '23:59',
    source: 'Manual Entry',
    assigneeIds,
    assignToEveryone,
    assignee: assigneeName,
  })
  showAddModal.value = false
}

const selectStatus = async (status) => {
  if (!selectedTask.value) return
  const id = selectedTask.value.id || selectedTask.value._id
  if (status === 'review' && authStore.user?.role !== 'admin') {
    triggerReviewConfirmModal(async () => {
      const success = await taskStore.setTaskStatus(id, status)
      if (success) {
        selectedTask.value.status = status
      }
    })
  } else {
    const success = await taskStore.setTaskStatus(id, status)
    if (success) {
      selectedTask.value.status = status
    }
  }
}

const handleToggleTask = async () => {
  if (!selectedTask.value) return
  const success = await taskStore.toggleTask(selectedTask.value)
  if (success) {
    selectedTask.value = null
  }
}
</script>

<style scoped>
.task-item-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.task-item-leave-active { transition: all 0.2s ease-in; position: absolute; width: 100%; }
.task-item-enter-from   { opacity: 0; transform: translateY(12px) scale(0.96); }
.task-item-leave-to     { opacity: 0; transform: translateY(-8px) scale(0.96); }
.task-item-move         { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }

</style>
