<template>
  <div class="page-shell">
    <Navbar activePage="tasks" @navigate="$emit('navigate', $event)" />

    <div class="flex flex-col gap-12 pb-20 pt-4">

      <!-- ═══ HEADER ═══ -->
      <section
        ref="heroRef"
        :class="['flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 transition-all duration-700', heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6']"
      >
        <div>
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary font-header font-bold text-[10px] tracking-wide mb-3 animate-pulse-soft">
            <PhCheckSquare :size="12" weight="fill" />
            AI Action Items
          </div>
          <h1 class="font-header font-bold text-4xl text-brand-dark leading-tight">Task Manager</h1>
          <p class="text-brand-slate text-sm mt-1.5">Action items extracted and prioritized by SmartMeet AI from your meetings.</p>
        </div>

        <!-- Stats row -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <div v-for="stat in stats" :key="stat.label"
            :class="['flex flex-col items-center px-5 py-3 rounded-2xl bg-glass-bg border border-white/70 shadow-glass backdrop-blur-glass text-center min-w-[80px] transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover', stat.color]"
          >
            <span class="font-header font-bold text-xl text-brand-dark">{{ stat.value }}</span>
            <span class="font-body text-[10px] text-brand-slate font-semibold uppercase tracking-wide mt-0.5">{{ stat.label }}</span>
          </div>
        </div>
      </section>

      <!-- ═══ TOOLBAR: Filters + Search + Add ═══ -->
      <section
        ref="toolbarRef"
        :class="['flex flex-col sm:flex-row items-start sm:items-center gap-4 -mt-4 transition-all duration-700', toolbarVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6']"
      >
        <!-- Filter chips -->
        <div class="flex items-center gap-2 flex-wrap">
          <button
            v-for="f in filters" :key="f.id"
            @click="activeFilter = f.id"
            :class="['px-4 py-2 rounded-full font-header font-bold text-[10px] tracking-wider uppercase transition-all duration-300 border cursor-pointer',
              activeFilter === f.id
                ? 'bg-primary text-white border-primary shadow-[0_4px_12px_rgba(75,104,255,0.3)] scale-105'
                : 'bg-glass-bg border-white/70 text-brand-slate hover:border-primary/25 hover:text-primary hover:bg-white/70']"
          >
            {{ f.label }}
            <span :class="['ml-1.5 px-1.5 py-0.5 rounded-full text-[9px]', activeFilter === f.id ? 'bg-white/25 text-white' : 'bg-black/8 text-brand-slate']">
              {{ f.count }}
            </span>
          </button>
        </div>

        <!-- Spacer -->
        <div class="flex-1"></div>

        <!-- Search -->
        <div class="relative group">
          <PhMagnifyingGlass :size="15" weight="bold"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate group-focus-within:text-primary transition-colors duration-200" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tasks..."
            class="pl-9 pr-4 py-2.5 rounded-xl bg-glass-bg border border-white/70 shadow-glass backdrop-blur-glass font-body text-sm text-brand-dark placeholder-brand-slate/60 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300 w-52"
          />
        </div>

        <!-- Add Task button -->
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer"
        >
          <PhPlus :size="14" weight="bold" />
          Add Task
        </button>
      </section>

      <!-- ═══ KANBAN COLUMNS ═══ -->
      <section
        ref="kanbanRef"
        :class="['grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-700', kanbanVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
      >
        <div v-for="(col, ci) in columns" :key="col.id"
          :class="['flex flex-col gap-4 transition-all duration-500', kanbanVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
          :style="`transition-delay: ${ci * 100}ms`"
        >
          <!-- Column header -->
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2.5">
              <div :class="['w-2.5 h-2.5 rounded-full', col.dot]"></div>
              <span class="font-header font-bold text-sm text-brand-dark">{{ col.label }}</span>
              <span class="px-2 py-0.5 rounded-full bg-black/6 font-header font-bold text-[10px] text-brand-slate">{{ filteredTasks(col.id).length }}</span>
            </div>
            <component :is="col.icon" :size="18" weight="bold" :class="col.iconColor" />
          </div>

          <!-- Drop zone -->
          <div class="flex flex-col gap-3 min-h-[120px]">
            <!-- Task cards -->
            <TransitionGroup name="task-card" tag="div" class="flex flex-col gap-3">
              <div
                v-for="(task, ti) in filteredTasks(col.id)"
                :key="task.id"
                :class="['group relative rounded-[20px] p-5 border shadow-glass backdrop-blur-glass cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover',
                  cardGradientStyle(task),
                  kanbanVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4']"
                :style="`transition-delay: ${ti * 60 + ci * 100 + 150}ms`"
                @click="selectTask(task)"
              >
                <!-- Priority dot -->
                <div class="flex items-center justify-between mb-3">
                  <span :class="['px-2 py-0.5 rounded-md font-header font-extrabold text-[9px] tracking-wider uppercase border', priorityStyle(task.priority)]">
                    {{ task.priority }}
                  </span>
                  <div class="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button @click.stop="moveTask(task, -1)" class="w-6 h-6 rounded-lg bg-black/5 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-200 cursor-pointer">
                      <PhArrowLeft :size="11" weight="bold" />
                    </button>
                    <button @click.stop="moveTask(task, 1)" class="w-6 h-6 rounded-lg bg-black/5 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all duration-200 cursor-pointer">
                      <PhArrowRight :size="11" weight="bold" />
                    </button>
                    <button @click.stop="deleteTask(task.id)" class="w-6 h-6 rounded-lg bg-black/5 hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-all duration-200 cursor-pointer">
                      <PhTrash :size="11" weight="bold" />
                    </button>
                  </div>
                </div>

                <h3 :class="['font-header font-bold text-sm text-brand-dark mb-1.5 leading-snug transition-all duration-200', task.done ? 'line-through text-brand-slate' : '']">
                  {{ task.title }}
                </h3>

                <p class="text-brand-slate text-xs font-body leading-relaxed mb-4 line-clamp-2">{{ task.description }}</p>

                <!-- Meta row -->
                <div class="flex items-center justify-between border-t border-black/5 pt-3">
                  <!-- Avatar + name -->
                  <div class="flex items-center gap-2">
                    <div :class="['w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0', task.avatarColor]">
                      {{ task.assignee[0] }}
                    </div>
                    <span class="text-[10px] font-semibold text-brand-slate">{{ task.assignee }}</span>
                  </div>
                  <!-- Due date -->
                  <div :class="['flex items-center gap-1 text-[10px] font-bold font-body', task.overdue ? 'text-red-500' : 'text-brand-slate']">
                    <PhCalendar :size="11" weight="bold" />
                    {{ task.due }}
                  </div>
                </div>

                <!-- Meeting source tag -->
                <div class="flex items-center gap-1.5 mt-3">
                  <PhVideoCamera :size="10" weight="bold" class="text-brand-slate/60" />
                  <span class="text-[9px] font-semibold text-brand-slate/70 truncate">{{ task.source }}</span>
                </div>

                <!-- Checkbox (done toggle) -->
                <button
                  @click.stop="toggleDone(task)"
                  :class="['absolute top-4 right-16 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100',
                    task.done ? 'border-primary bg-primary' : 'border-brand-slate/30 bg-transparent hover:border-primary']"
                >
                  <PhCheck v-if="task.done" :size="10" weight="bold" class="text-white" />
                </button>
              </div>
            </TransitionGroup>

            <!-- Empty state -->
            <div v-if="filteredTasks(col.id).length === 0"
              class="flex flex-col items-center justify-center py-10 rounded-[20px] border-2 border-dashed border-black/8 text-brand-slate/50 gap-2"
            >
              <component :is="col.icon" :size="28" weight="light" />
              <span class="text-xs font-semibold font-body">No tasks here</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══ AI SUMMARY CARD ═══ -->
      <section
        ref="aiRef"
        :class="['relative rounded-[28px] bg-glass-bg border border-white/70 shadow-glass backdrop-blur-glass overflow-hidden p-8 transition-all duration-700', aiVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
      >
        <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-secondary/[0.03] pointer-events-none"></div>
        <div class="absolute top-0 left-8 right-8 h-[2px] rounded-b-full bg-grad-primary opacity-30"></div>

        <div class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div class="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15 flex-shrink-0 animate-float">
            <PhBrain :size="28" weight="duotone" class="text-primary" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1.5">
              <h2 class="font-header font-bold text-xl text-brand-dark">AI Task Intelligence</h2>
              <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 border border-primary/10">
                <span class="relative flex h-1.5 w-1.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                <span class="text-[10px] font-bold text-primary font-header">Live</span>
              </div>
            </div>
            <p class="text-brand-slate text-sm leading-relaxed max-w-2xl">
              SmartMeet AI extracted <strong class="text-brand-dark">{{ tasks.length }} action items</strong> from your last 12 meetings.
              <span class="text-primary font-semibold">{{ tasks.filter(t => t.priority === 'High').length }} high-priority</span> items need your attention today.
              AI suggests tackling <strong class="text-brand-dark">DB latency fix</strong> and <strong class="text-brand-dark">API documentation</strong> first based on team dependencies.
            </p>
          </div>
          <button
            @click="$emit('navigate', 'dashboard')"
            class="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 cursor-pointer"
          >
            <PhLayout :size="14" weight="bold" />
            Open Dashboard
          </button>
        </div>
      </section>

    </div>

    <Footer @navigate="$emit('navigate', $event)" />

    <!-- ═══ TASK DETAIL MODAL ═══ -->
    <Transition name="modal">
      <div v-if="selectedTask" class="fixed inset-0 z-[200] flex items-center justify-center p-4" @click.self="selectedTask = null">
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-lg bg-white/90 border border-white/80 backdrop-blur-[24px] rounded-[28px] shadow-[0_32px_80px_rgba(31,38,135,0.12)] p-8 flex flex-col gap-5">
          <!-- Close -->
          <button @click="selectedTask = null" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer">
            <PhX :size="14" weight="bold" class="text-brand-slate" />
          </button>

          <!-- Priority badge -->
          <div class="flex items-center gap-3">
            <span :class="['px-2.5 py-1 rounded-md font-header font-extrabold text-[9px] tracking-wider uppercase border', priorityStyle(selectedTask.priority)]">
              {{ selectedTask.priority }} Priority
            </span>
            <span class="text-[10px] text-brand-slate font-body">from <strong>{{ selectedTask.source }}</strong></span>
          </div>

          <h2 class="font-header font-bold text-2xl text-brand-dark leading-tight">{{ selectedTask.title }}</h2>
          <p class="text-brand-slate text-sm leading-relaxed font-body">{{ selectedTask.description }}</p>

          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1 p-4 rounded-2xl bg-black/[0.025] border border-black/[0.04]">
              <span class="text-[9px] font-extrabold tracking-widest uppercase text-brand-slate font-header">Assignee</span>
              <div class="flex items-center gap-2 mt-1">
                <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white', selectedTask.avatarColor]">{{ selectedTask.assignee[0] }}</div>
                <span class="text-sm font-bold text-brand-dark">{{ selectedTask.assignee }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-1 p-4 rounded-2xl bg-black/[0.025] border border-black/[0.04]">
              <span class="text-[9px] font-extrabold tracking-widest uppercase text-brand-slate font-header">Due Date</span>
              <div :class="['flex items-center gap-2 mt-1', selectedTask.overdue ? 'text-red-500' : 'text-brand-dark']">
                <PhCalendar :size="16" weight="bold" />
                <span class="text-sm font-bold">{{ selectedTask.due }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="toggleDone(selectedTask); selectedTask = null"
              :class="['flex-1 py-3 rounded-xl font-header font-bold text-[11px] tracking-wider uppercase transition-all duration-300 cursor-pointer border',
                selectedTask.done
                  ? 'bg-brand-bg border-black/8 text-brand-slate hover:border-primary/20 hover:text-primary'
                  : 'bg-grad-primary text-white border-transparent shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.4)]']"
            >
              {{ selectedTask.done ? 'Mark Incomplete' : 'Mark Complete ✓' }}
            </button>
            <button @click="deleteTask(selectedTask.id); selectedTask = null"
              class="px-4 py-3 rounded-xl font-header font-bold text-[11px] tracking-wider uppercase border border-red-200 text-red-500 bg-red-50/50 hover:bg-red-50 hover:border-red-300 transition-all duration-300 cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══ ADD TASK MODAL ═══ -->
    <Transition name="modal">
      <div v-if="showAddModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4" @click.self="showAddModal = false">
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div class="relative w-full max-w-md bg-white/90 border border-white/80 backdrop-blur-[24px] rounded-[28px] shadow-[0_32px_80px_rgba(31,38,135,0.12)] p-8 flex flex-col gap-5">
          <button @click="showAddModal = false" class="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors cursor-pointer">
            <PhX :size="14" weight="bold" class="text-brand-slate" />
          </button>

          <h2 class="font-header font-bold text-2xl text-brand-dark">New Task</h2>

          <div class="flex flex-col gap-4">
            <input v-model="newTask.title" type="text" placeholder="Task title..."
              class="w-full px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark placeholder-brand-slate/50 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300"
            />
            <textarea v-model="newTask.description" placeholder="Description..." rows="3"
              class="w-full px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark placeholder-brand-slate/50 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300 resize-none"
            ></textarea>
            <div class="grid grid-cols-2 gap-3">
              <select v-model="newTask.priority"
                class="px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <input v-model="newTask.due" type="text" placeholder="Due: Jun 15"
                class="px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark placeholder-brand-slate/50 focus:outline-none focus:border-primary/30 transition-all duration-300"
              />
            </div>
          </div>

          <button @click="addTask"
            class="w-full py-3.5 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <PhPlus :size="13" weight="bold" class="inline mr-2" />
            Create Task
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  PhCheckSquare, PhPlus, PhCheck, PhArrowLeft, PhArrowRight,
  PhTrash, PhCalendar, PhVideoCamera, PhBrain, PhLayout,
  PhMagnifyingGlass, PhX, PhClock, PhSpinner, PhCheckCircle
} from '@phosphor-icons/vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

defineEmits(['navigate'])

// ─── Scroll-reveal ───────────────────────────────────
const heroRef    = ref(null); const heroVisible    = ref(false)
const toolbarRef = ref(null); const toolbarVisible = ref(false)
const kanbanRef  = ref(null); const kanbanVisible  = ref(false)
const aiRef      = ref(null); const aiVisible      = ref(false)

const observe = (el, vis, delay = 0) => {
  if (!el) return
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { setTimeout(() => { vis.value = true }, delay); io.disconnect() }
  }, { threshold: 0.08 })
  io.observe(el)
}

onMounted(() => {
  setTimeout(() => { heroVisible.value = true }, 80)
  setTimeout(() => { toolbarVisible.value = true }, 180)
  setTimeout(() => { kanbanVisible.value = true }, 280)
  observe(aiRef.value, aiVisible, 100)
})

// ─── Tasks state ─────────────────────────────────────
const tasks = ref([
  { id: 1, title: 'Patch DB latency issues', description: 'Identified in Daily Standup: P95 query time exceeds 800ms. Needs immediate fix before next deploy.', priority: 'High', status: 'todo', assignee: 'Alex Chen', avatarColor: 'bg-primary', due: 'Jun 10', overdue: true, done: false, source: 'Daily Standup: Engineering' },
  { id: 2, title: 'Finalize API docs for v2', description: 'All public endpoints need updated examples and error response tables. Share with front-end team by EOD Friday.', priority: 'High', status: 'todo', assignee: 'Sarah Kim', avatarColor: 'bg-secondary', due: 'Jun 12', overdue: false, done: false, source: 'Daily Standup: Engineering' },
  { id: 3, title: 'Schedule security audit', description: 'Coordinate with the infosec team to book a full penetration test on the new auth service before launch.', priority: 'Medium', status: 'todo', assignee: 'James Park', avatarColor: 'bg-accent', due: 'Jun 18', overdue: false, done: false, source: 'Q4 Strategy Sync' },
  { id: 4, title: 'Update UI contrast ratios', description: 'Client flagged low contrast on text variables during Design Review. Revise glassmorphic card text to meet AA standard.', priority: 'Medium', status: 'inprogress', assignee: 'Alex Chen', avatarColor: 'bg-primary', due: 'Jun 11', overdue: true, done: false, source: 'Design Review: Nexus Pro' },
  { id: 5, title: 'Draft roadmap v2.1', description: 'Compile feature proposals from Q3 retro, prioritize by engineering effort and business impact into a Notion doc.', priority: 'Low', status: 'inprogress', assignee: 'Sarah Kim', avatarColor: 'bg-secondary', due: 'Jun 20', overdue: false, done: false, source: 'Q4 Strategy Sync' },
  { id: 6, title: 'Scale GPU cluster config', description: 'Discuss with DevOps to increase A100 cluster from 8 to 16 nodes ahead of the model training sprint.', priority: 'High', status: 'inprogress', assignee: 'James Park', avatarColor: 'bg-accent', due: 'Jun 14', overdue: false, done: false, source: 'Q4 Strategy Sync' },
  { id: 7, title: 'Update security protocols', description: 'Review and update auth token expiry policies and rotate all production secrets after new compliance directive.', priority: 'High', status: 'done', assignee: 'Alex Chen', avatarColor: 'bg-primary', due: 'Jun 8', overdue: false, done: true, source: 'Daily Standup: Engineering' },
  { id: 8, title: 'Review Nexus transcript', description: 'Cross-reference the AI-generated transcript with the client\'s recorded feedback and identify discrepancies.', priority: 'Low', status: 'done', assignee: 'Sarah Kim', avatarColor: 'bg-secondary', due: 'Jun 9', overdue: false, done: true, source: 'Design Review: Nexus Pro' },
])

// ─── Kanban columns ──────────────────────────────────
const columns = [
  { id: 'todo',       label: 'To Do',       dot: 'bg-brand-slate/50', icon: PhClock,       iconColor: 'text-brand-slate' },
  { id: 'inprogress', label: 'In Progress',  dot: 'bg-primary',        icon: PhSpinner,     iconColor: 'text-primary' },
  { id: 'done',       label: 'Done',         dot: 'bg-brand-success',  icon: PhCheckCircle, iconColor: 'text-brand-success' },
]

// ─── Filters ─────────────────────────────────────────
const activeFilter = ref('all')
const searchQuery  = ref('')

const filters = computed(() => [
  { id: 'all',    label: 'All',    count: tasks.value.length },
  { id: 'High',   label: 'High',   count: tasks.value.filter(t => t.priority === 'High').length },
  { id: 'Medium', label: 'Medium', count: tasks.value.filter(t => t.priority === 'Medium').length },
  { id: 'Low',    label: 'Low',    count: tasks.value.filter(t => t.priority === 'Low').length },
])

const filteredTasks = (status) => {
  return tasks.value.filter(t => {
    const matchStatus   = t.status === status
    const matchFilter   = activeFilter.value === 'all' || t.priority === activeFilter.value
    const matchSearch   = !searchQuery.value || t.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchFilter && matchSearch
  })
}

// ─── Stats ───────────────────────────────────────────
const stats = computed(() => [
  { label: 'Total',      value: tasks.value.length,                               color: '' },
  { label: 'Active',     value: tasks.value.filter(t => !t.done).length,          color: '' },
  { label: 'Done',       value: tasks.value.filter(t => t.done).length,           color: '' },
  { label: 'Overdue',    value: tasks.value.filter(t => t.overdue && !t.done).length, color: '' },
])

// ─── Priority styling ────────────────────────────────
const priorityStyle = (p) => ({
  'High':   'bg-red-50 border-red-200 text-red-500',
  'Medium': 'bg-amber-50 border-amber-200 text-amber-600',
  'Low':    'bg-emerald-50 border-emerald-200 text-emerald-600',
}[p] || '')

const cardGradientStyle = (task) => {
  if (task.done || task.status === 'done') {
    return 'bg-gradient-to-br from-brand-slate/5 via-white/30 to-white/50 border-brand-slate/10 opacity-70'
  }
  switch (task.priority) {
    case 'High':
      return 'bg-gradient-to-br from-red-500/5 via-white/50 to-white/80 border-red-200/60 hover:from-red-500/10 hover:border-red-300'
    case 'Medium':
      return 'bg-gradient-to-br from-primary/5 via-white/50 to-white/80 border-primary/20 hover:from-primary/10 hover:border-primary/30'
    case 'Low':
      return 'bg-gradient-to-br from-emerald-500/5 via-white/50 to-white/80 border-emerald-200/60 hover:from-emerald-500/10 hover:border-emerald-300'
    default:
      return 'bg-glass-bg border-white/70'
  }
}

// ─── Actions ─────────────────────────────────────────
const statusOrder = ['todo', 'inprogress', 'done']

const moveTask = (task, dir) => {
  const cur = statusOrder.indexOf(task.status)
  const next = cur + dir
  if (next >= 0 && next < statusOrder.length) {
    task.status = statusOrder[next]
    task.done = task.status === 'done'
  }
}

const toggleDone = (task) => {
  task.done = !task.done
  task.status = task.done ? 'done' : 'todo'
}

const deleteTask = (id) => {
  const idx = tasks.value.findIndex(t => t.id === id)
  if (idx !== -1) tasks.value.splice(idx, 1)
}

// ─── Modal state ─────────────────────────────────────
const selectedTask = ref(null)
const selectTask = (task) => { selectedTask.value = task }

const showAddModal = ref(false)
const newTask = ref({ title: '', description: '', priority: 'Medium', due: '' })

const openAddModal = () => {
  newTask.value = { title: '', description: '', priority: 'Medium', due: '' }
  showAddModal.value = true
}

const addTask = () => {
  if (!newTask.value.title.trim()) return
  tasks.value.unshift({
    id: Date.now(),
    title:       newTask.value.title,
    description: newTask.value.description || 'No description provided.',
    priority:    newTask.value.priority,
    status:      'todo',
    assignee:    'Alex Chen',
    avatarColor: 'bg-primary',
    due:         newTask.value.due || 'TBD',
    overdue:     false,
    done:        false,
    source:      'Manual Entry',
  })
  showAddModal.value = false
}
</script>

<style scoped>
/* ─── Task card list transitions ─── */
.task-card-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.task-card-leave-active { transition: all 0.22s ease-in; }
.task-card-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
.task-card-leave-to   { opacity: 0; transform: translateY(-10px) scale(0.95); }
.task-card-move       { transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }

/* ─── Modal transition ─── */
.modal-enter-active { transition: all 0.32s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: all 0.2s ease-in; }
.modal-enter-from { opacity: 0; transform: scale(0.92); }
.modal-leave-to   { opacity: 0; transform: scale(0.96); }

/* ─── Soft pulse for AI badge ─── */
@keyframes pulse-soft {
  0%, 100% { box-shadow: 0 0 0 0 rgba(75,104,255,0); }
  50%       { box-shadow: 0 0 0 5px rgba(75,104,255,0.07); }
}
.animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }

/* ─── Float for brain icon ─── */
@keyframes float-anim {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-5px); }
}
.animate-float { animation: float-anim 3.5s ease-in-out infinite; }

/* ─── Line clamp ─── */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
