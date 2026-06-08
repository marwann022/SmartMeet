<template>
  <!-- Tasks Kanban Tab — embedded inside Dashboard -->
  <div class="flex flex-col gap-10">

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold font-header text-brand-dark tracking-tight">Tasks</h2>
        <p class="text-sm text-brand-slate mt-1">AI-extracted action items from your meetings</p>
      </div>
      <button
        @click="openAddModal"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer"
      >
        <PhPlus :size="14" weight="bold" />
        Add Task
      </button>
    </div>

    <!-- Kanban Grid: 2 rows × 2 cols = 4 columns -->
    <div class="flex flex-col gap-6">

      <!-- Row 1: To Do + In Progress -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- ── To Do ── -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between px-2">
            <div class="flex items-center gap-2">
              <span class="font-header font-bold text-2xl text-brand-dark leading-8">To Do</span>
              <span class="bg-[#181b25] text-[#b5b5b5] font-header font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">{{ tasksByStatus('todo').length }}</span>
            </div>
            <button @click="openAddModal('todo')" class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-brand-slate transition-all duration-200 cursor-pointer">
              <PhPlus :size="18" weight="bold" />
            </button>
          </div>
          <TransitionGroup name="task-item" tag="div" class="flex flex-col gap-4">
            <TaskCard v-for="task in tasksByStatus('todo')" :key="task.id" :task="task"
              @move="(d) => moveTask(task, d)" @delete="deleteTask(task.id)" @toggle="toggleDone(task)" @click="selectedTask = task" />
          </TransitionGroup>
          <div v-if="tasksByStatus('todo').length === 0"
            class="border-2 border-dashed border-black/8 rounded-xl flex flex-col items-center justify-center py-8 text-brand-slate/40 gap-2">
            <PhClock :size="24" weight="light" />
            <span class="text-xs font-body">No tasks yet</span>
          </div>
        </div>

        <!-- ── In Progress ── -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between px-2">
            <div class="flex items-center gap-2">
              <span class="font-header font-bold text-2xl text-brand-dark leading-8">In Progress</span>
              <span class="bg-[#181b25] text-[#b5b5b5] font-header font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">{{ tasksByStatus('inprogress').length }}</span>
            </div>
            <button @click="openAddModal('inprogress')" class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-brand-slate transition-all duration-200 cursor-pointer">
              <PhPlus :size="18" weight="bold" />
            </button>
          </div>
          <TransitionGroup name="task-item" tag="div" class="flex flex-col gap-4">
            <TaskCard v-for="task in tasksByStatus('inprogress')" :key="task.id" :task="task"
              @move="(d) => moveTask(task, d)" @delete="deleteTask(task.id)" @toggle="toggleDone(task)" @click="selectedTask = task" />
          </TransitionGroup>
          <div v-if="tasksByStatus('inprogress').length === 0"
            class="border-2 border-dashed border-black/8 rounded-xl flex flex-col items-center justify-center py-8 text-brand-slate/40 gap-2">
            <PhArrowsClockwise :size="24" weight="light" />
            <span class="text-xs font-body">Nothing in progress</span>
          </div>
        </div>
      </div>

      <!-- Row 2: Review + Done -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

        <!-- ── Review ── -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between px-2">
            <div class="flex items-center gap-2">
              <span class="font-header font-bold text-2xl text-brand-dark leading-8">Review</span>
              <span class="bg-[#181b25] text-[#b5b5b5] font-header font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">{{ tasksByStatus('review').length }}</span>
            </div>
            <button @click="openAddModal('review')" class="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-primary/10 hover:text-primary text-brand-slate transition-all duration-200 cursor-pointer">
              <PhPlus :size="18" weight="bold" />
            </button>
          </div>
          <TransitionGroup name="task-item" tag="div" class="flex flex-col gap-4">
            <TaskCard v-for="task in tasksByStatus('review')" :key="task.id" :task="task"
              @move="(d) => moveTask(task, d)" @delete="deleteTask(task.id)" @toggle="toggleDone(task)" @click="selectedTask = task" />
          </TransitionGroup>
          <div v-if="tasksByStatus('review').length === 0"
            class="border-2 border-dashed border-black/8 rounded-xl flex flex-col items-center justify-center py-8 text-brand-slate/40 gap-2">
            <PhEye :size="24" weight="light" />
            <span class="text-xs font-body">Nothing in review</span>
          </div>
        </div>

        <!-- ── Done ── -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between px-2">
            <div class="flex items-center gap-2">
              <span class="font-header font-bold text-2xl text-brand-dark leading-8">Done</span>
              <span class="bg-[#181b25] text-[#b5b5b5] font-header font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">{{ tasksByStatus('done').length }}</span>
            </div>
          </div>
          <TransitionGroup name="task-item" tag="div" class="flex flex-col gap-4">
            <TaskCard v-for="task in tasksByStatus('done')" :key="task.id" :task="task"
              @move="(d) => moveTask(task, d)" @delete="deleteTask(task.id)" @toggle="toggleDone(task)" @click="selectedTask = task" />
          </TransitionGroup>
          <div v-if="tasksByStatus('done').length === 0"
            class="border-2 border-dashed border-black/8 rounded-xl flex flex-col items-center justify-center py-8 text-brand-slate/40 gap-2">
            <PhCheckCircle :size="24" weight="light" />
            <span class="text-xs font-body">No completed tasks</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedTask" class="fixed inset-0 z-[300] flex items-center justify-center p-4" @click.self="selectedTask = null">
          <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div class="relative w-full max-w-lg bg-white/95 border border-white/80 backdrop-blur-[24px] rounded-[24px] shadow-[0_32px_80px_rgba(31,38,135,0.12)] p-8 flex flex-col gap-5">
            <button @click="selectedTask = null" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer">
              <PhX :size="14" weight="bold" class="text-brand-slate" />
            </button>
            <div class="flex items-center gap-2.5">
              <PriorityBadge :priority="selectedTask.priority" />
              <span class="text-[10px] text-brand-slate font-body">· {{ selectedTask.source }}</span>
            </div>
            <h3 class="font-header font-bold text-xl text-brand-dark leading-snug">{{ selectedTask.title }}</h3>
            <p class="text-brand-slate text-sm leading-relaxed font-body">{{ selectedTask.description }}</p>
            <div class="flex items-center gap-4 text-sm">
              <div class="flex items-center gap-2">
                <img :src="userProfileImg" class="w-7 h-7 rounded-full object-cover border-2 border-[#0b0f19]" alt="assignee" />
                <span class="font-header font-bold text-xs text-brand-dark">{{ selectedTask.assignee }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-[#5c5e65] font-header font-bold text-xs">
                <PhCalendarBlank :size="14" weight="bold" />
                {{ selectedTask.due }}
              </div>
            </div>
            <div class="flex gap-3 pt-1">
              <button @click="toggleDone(selectedTask); selectedTask = null"
                :class="['flex-1 py-3 rounded-xl font-header font-bold text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer border',
                  selectedTask.status === 'done'
                    ? 'bg-brand-bg border-black/8 text-brand-slate hover:text-primary hover:border-primary/20'
                    : 'bg-grad-primary text-white border-transparent shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.4)]']"
              >
                {{ selectedTask.status === 'done' ? 'Mark Incomplete' : 'Mark Complete ✓' }}
              </button>
              <button @click="deleteTask(selectedTask.id); selectedTask = null"
                class="px-5 py-3 rounded-xl font-header font-bold text-[11px] tracking-wider uppercase border border-red-200 text-red-500 bg-red-50/60 hover:bg-red-50 hover:border-red-300 transition-all duration-300 cursor-pointer"
              >Delete</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Add Task Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showAddModal" class="fixed inset-0 z-[300] flex items-center justify-center p-4" @click.self="showAddModal = false">
          <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          <div class="relative w-full max-w-md bg-white/95 border border-white/80 backdrop-blur-[24px] rounded-[24px] shadow-[0_32px_80px_rgba(31,38,135,0.12)] p-8 flex flex-col gap-5">
            <button @click="showAddModal = false" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer">
              <PhX :size="14" weight="bold" class="text-brand-slate" />
            </button>
            <h3 class="font-header font-bold text-xl text-brand-dark">New Task</h3>
            <div class="flex flex-col gap-3.5">
              <input v-model="newTask.title" type="text" placeholder="Task title..."
                class="w-full px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark placeholder-brand-slate/50 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300" />
              <textarea v-model="newTask.description" placeholder="Description (optional)..." rows="3"
                class="w-full px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark placeholder-brand-slate/50 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300 resize-none" />
              <div class="grid grid-cols-2 gap-3">
                <select v-model="newTask.priority"
                  class="px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all duration-300 cursor-pointer">
                  <option value="HIGH PRIORITY">High</option>
                  <option value="MEDIUM PRIORITY">Medium</option>
                  <option value="LOW PRIORITY">Low</option>
                </select>
                <input v-model="newTask.due" type="text" placeholder="Due: Oct 12"
                  class="px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark placeholder-brand-slate/50 focus:outline-none focus:border-primary/30 transition-all duration-300" />
              </div>
            </div>
            <button @click="addTask"
              class="w-full py-3.5 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
              <PhPlus :size="13" weight="bold" class="inline mr-2" />
              Create Task
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, defineComponent, h } from 'vue'
import {
  PhPlus, PhClock, PhArrowsClockwise, PhEye, PhCheckCircle,
  PhX, PhCalendarBlank, PhCheck, PhTrash, PhArrowLeft, PhArrowRight
} from '@phosphor-icons/vue'
import userProfileImg from '../assets/User Profile.png'

// ─── Priority badge sub-component (matches Figma exactly) ─────────────────
const PriorityBadge = defineComponent({
  name: 'PriorityBadge',
  props: { priority: String },
  setup(props) {
    const styles = {
      'HIGH PRIORITY':   { wrap: 'bg-[rgba(147,0,10,0.2)] border border-[rgba(202,202,202,0.05)]', text: 'text-[#93000a]' },
      'MEDIUM PRIORITY': { wrap: 'bg-[rgba(77,142,255,0.3)] border border-[rgba(173,198,255,0.2)]', text: 'text-[#4d8eff]' },
      'LOW PRIORITY':    { wrap: 'bg-[rgba(87,27,193,0.3)] border border-[rgba(87,27,193,0.2)]',    text: 'text-[#494259]' },
    }
    return () => {
      const s = styles[props.priority] || styles['MEDIUM PRIORITY']
      return h('div', { class: `${s.wrap} px-2.5 py-0.5 rounded-md flex flex-col items-start` },
        [h('span', { class: `${s.text} font-header font-bold text-[10px] uppercase leading-[15px]` }, props.priority)]
      )
    }
  }
})

// ─── Task card sub-component (Figma card design) ──────────────────────────
const TaskCard = defineComponent({
  name: 'TaskCard',
  props: { task: Object },
  emits: ['move', 'delete', 'toggle', 'click'],
  setup(props, { emit }) {
    // Card border/bg per priority from Figma
    const cardStyle = (task) => {
      if (task.status === 'done') {
        return 'bg-gradient-to-br from-brand-slate/5 via-white/30 to-white/50 border-[#39a1b9] blur-[0.35px] opacity-70'
      }
      if (task.priority === 'HIGH PRIORITY') {
        return 'bg-gradient-to-br from-red-500/5 via-white/50 to-white/80 border-[#ffb4ab] hover:from-red-500/10'
      }
      if (task.priority === 'MEDIUM PRIORITY') {
        return 'bg-gradient-to-br from-primary/5 via-white/50 to-white/80 border-[#3c81f5] backdrop-blur-md hover:from-primary/10'
      }
      if (task.priority === 'LOW PRIORITY') {
        return 'bg-gradient-to-br from-[#571bc1]/5 via-white/50 to-white/80 border-[rgba(87,27,193,0.3)] backdrop-blur-md hover:from-[#571bc1]/10'
      }
      return 'bg-gradient-to-br from-white/80 to-white/40 border-black/10'
    }

    return () => h('div', {
      class: `group relative border border-solid rounded-xl p-[17px] flex flex-col gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.07)] ${cardStyle(props.task)}`,
      onClick: () => emit('click')
    }, [
      // Top row: priority badge + done check icon
      h('div', { class: 'flex items-start justify-between' }, [
        h(PriorityBadge, { priority: props.task.priority }),
        props.task.status === 'done'
          ? h('div', { class: 'overflow-clip relative shrink-0 w-6 h-6 flex items-center justify-center' },
              [h(PhCheckCircle, { size: 22, weight: 'regular', class: 'text-[#39a1b9]' })]
            )
          : h('div', {
              class: 'opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity duration-200'
            }, [
              h('button', { class: 'w-5 h-5 rounded flex items-center justify-center hover:bg-primary/10 hover:text-primary text-brand-slate/50 transition-colors cursor-pointer', onClick: (e) => { e.stopPropagation(); emit('move', -1) } }, [h(PhArrowLeft, { size: 10, weight: 'bold' })]),
              h('button', { class: 'w-5 h-5 rounded flex items-center justify-center hover:bg-primary/10 hover:text-primary text-brand-slate/50 transition-colors cursor-pointer', onClick: (e) => { e.stopPropagation(); emit('move', 1) } }, [h(PhArrowRight, { size: 10, weight: 'bold' })]),
              h('button', { class: 'w-5 h-5 rounded flex items-center justify-center hover:bg-red-50 hover:text-red-400 text-brand-slate/50 transition-colors cursor-pointer', onClick: (e) => { e.stopPropagation(); emit('delete') } }, [h(PhTrash, { size: 10, weight: 'bold' })]),
            ])
      ]),

      // Title
      h('div', { class: 'h-11 flex items-center' },
        [h('p', { class: `font-header font-normal text-lg leading-snug ${props.task.status === 'done' ? 'text-[#3c3f47]' : props.task.priority === 'HIGH PRIORITY' ? 'text-[#0b0f19]' : 'text-[#3c3f47]'}` }, props.task.title)]
      ),

      // Bottom row: avatar + date
      h('div', { class: 'flex items-center justify-between pt-1' }, [
        // Avatar
        h('div', { class: 'flex items-start' }, [
          h('div', { class: 'border-2 border-[#0b0f19] rounded-full w-6 h-6 overflow-hidden flex-shrink-0' }, [
            h('img', { src: userProfileImg, alt: '', class: 'w-full h-full object-cover' })
          ])
        ]),
        // Date
        h('div', { class: 'flex items-center gap-1.5 text-[#5c5e65] font-header font-bold text-[13px]' }, [
          h('svg', { class: 'w-[11px] h-3', viewBox: '0 0 12 13', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }, [
            h('path', { d: 'M9.5 2H2.5C1.67 2 1 2.67 1 3.5V10.5C1 11.33 1.67 12 2.5 12H9.5C10.33 12 11 11.33 11 10.5V3.5C11 2.67 10.33 2 9.5 2Z', stroke: '#5c5e65', 'stroke-width': '1.2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
            h('path', { d: 'M8 1V3M4 1V3M1 5H11', stroke: '#5c5e65', 'stroke-width': '1.2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
          ]),
          h('span', {}, props.task.due)
        ])
      ])
    ])
  }
})

// ─── Tasks state ──────────────────────────────────────
const tasks = ref([
  { id: 1, title: 'Generate summary for Q3 Engineering Sync', priority: 'HIGH PRIORITY', status: 'todo', assignee: 'Alex Chen', due: 'Oct 12', description: 'Create a concise AI summary of the Q3 Engineering Sync meeting covering all action items and decisions.', source: 'Daily Standup: Engineering' },
  { id: 2, title: 'Review API documentation for new auth flow', priority: 'MEDIUM PRIORITY', status: 'todo', assignee: 'Alex Chen', due: 'Oct 12', description: 'Review and validate the updated API documentation for the new authentication flow before the team review.', source: 'Daily Standup: Engineering' },
  { id: 3, title: 'Update workspace brand assets', priority: 'LOW PRIORITY', status: 'todo', assignee: 'Alex Chen', due: 'Oct 12', description: 'Refresh all workspace branding assets to align with the new identity guidelines discussed in the Design Review.', source: 'Design Review: Nexus Pro' },
  { id: 4, title: 'Analyze competitor pricing models from transcript data', priority: 'HIGH PRIORITY', status: 'inprogress', assignee: 'Alex Chen', due: 'Oct 12', description: 'Use the SmartMeet AI transcript data from recent Q4 Strategy meetings to extract competitor pricing intelligence.', source: 'Q4 Strategy Sync' },
  { id: 5, title: 'Design system component audit', priority: 'MEDIUM PRIORITY', status: 'inprogress', assignee: 'Alex Chen', due: 'Oct 12', description: 'Audit all existing UI components against the updated design system and flag inconsistencies for the next sprint.', source: 'Design Review: Nexus Pro' },
  { id: 6, title: 'Onboarding flow wireframes', priority: 'MEDIUM PRIORITY', status: 'review', assignee: 'Alex Chen', due: 'Oct 12', description: 'Present wireframes for the new user onboarding flow to the product team for feedback and sign-off.', source: 'Q4 Strategy Sync' },
  { id: 7, title: 'Generate summary for Q3 Engineering Sync', priority: 'COMPLETED', status: 'done', assignee: 'Alex Chen', due: 'Oct 12', description: 'Completed: AI summary generated and distributed to all meeting participants.', source: 'Daily Standup: Engineering' },
])

const tasksByStatus = (status) => tasks.value.filter(t => t.status === status)

const statusOrder = ['todo', 'inprogress', 'review', 'done']
const moveTask = (task, dir) => {
  const cur = statusOrder.indexOf(task.status)
  const next = cur + dir
  if (next >= 0 && next < statusOrder.length) {
    task.status = statusOrder[next]
    if (task.status === 'done') task.priority = 'COMPLETED'
  }
}
const toggleDone = (task) => {
  task.status = task.status === 'done' ? 'todo' : 'done'
  if (task.status === 'done') task.priority = 'COMPLETED'
}
const deleteTask = (id) => {
  const idx = tasks.value.findIndex(t => t.id === id)
  if (idx !== -1) tasks.value.splice(idx, 1)
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
  tasks.value.unshift({
    id: Date.now(),
    title: newTask.value.title,
    description: newTask.value.description || 'No description provided.',
    priority: newTask.value.priority,
    status: newTask.value.status,
    assignee: 'Alex Chen',
    due: newTask.value.due || 'TBD',
    source: 'Manual Entry',
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

.modal-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: all 0.2s ease-in; }
.modal-enter-from   { opacity: 0; transform: scale(0.93); }
.modal-leave-to     { opacity: 0; transform: scale(0.97); }
</style>
