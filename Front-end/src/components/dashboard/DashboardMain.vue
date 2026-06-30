<template>
  <div>
    <!-- Welcome header row -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[32px] gap-[16px] flex-wrap">
      <div>
        <h1 class="text-[30px] sm:text-[36px] font-bold font-header text-brand-dark tracking-tight mb-[8px]">Good morning, {{ firstName }}.</h1>
        <p class="text-[14px]">
          AI analyzed <span class="font-bold text-primary">{{ meetingStore.meetings.length + 8 }} meetings</span> this week. Productivity is up by 18%.
        </p>
      </div>
      <div class="flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <!-- Local Search Bar -->
        <SearchBar 
          v-model="localSearchQuery" 
          placeholder="Search dashboard..." 
          class="w-64"
        />
        
        <div class="inline-flex items-center gap-[8px] px-[14px] py-[6px] rounded-full bg-primary/8 border border-primary/10 shadow-sm text-[12px] font-bold text-primary select-none animate-pulse-soft flex-shrink-0">
          <span class="relative flex h-[8px] w-[8px]">
            <span class="animate-ping absolute inline-flex h-[100%] w-[100%] rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-[8px] w-[8px] bg-primary"></span>
          </span>
          <span>AI Live Syncing</span>
        </div>
      </div>
    </div>

    <!-- Section: Recent Meetings -->
    <section class="mb-[40px]">
      <div class="flex justify-between items-center mb-[20px]">
        <h2 class="text-[20px] sm:text-[24px] font-bold font-header text-brand-dark tracking-tight flex items-center gap-[8px]">
          <PhClock :size="22" weight="bold" class="text-primary" />
          Recent Meetings
        </h2>
        <Button variant="glass" @click="$router.push('/archive')">
          View All
        </Button>
      </div>

      <!-- Bento Meetings Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[24px] mb-[32px]">
        <!-- Standard Meeting Cards -->
        <MeetingCard 
          v-for="meeting in filteredStandardMeetings.slice(0, 2)" 
          :key="meeting.id" 
          :meeting="meeting"
          @click="openMeetingDetails(meeting)"
        />

        <!-- Daily Standup: Engineering Featured Card -->
        <div 
          v-if="engineeringStandup && matchesSearch(engineeringStandup)"
          @click="openMeetingDetails(engineeringStandup)"
          class="col-span-1 md:col-span-2 p-[24px] rounded-[28px] flex flex-col md:flex-row gap-[24px] items-center bg-gradient-to-br from-primary/5 via-white/40 to-white/70 border border-white/80 shadow-glass backdrop-blur-md transition-all duration-300 hover:shadow-card-hover hover:border-white/95 cursor-pointer text-left"
        >
          <div class="w-[100%] md:w-[220px] h-[140px] rounded-2xl bg-white/50 border border-black/5 flex items-center justify-center p-[12px] relative overflow-hidden flex-shrink-0">
            <img :src="activityTrendImg" alt="Activity Trend" class="w-[100%] h-[100%] object-contain filter drop-shadow-[0_2px_10px_rgba(75,104,255,0.08)]" />
          </div>
          <div class="flex-1 flex flex-col justify-between items-start gap-[16px] text-left w-[100%]">
            <div class="flex justify-between items-start w-[100%]">
              <h4 class="text-[18px] font-bold font-header text-brand-dark">{{ engineeringStandup.title }}</h4>
              <span class="inline-block text-[9px] font-extrabold px-[8px] py-[2px] rounded-md self-start tracking-wider uppercase border bg-red-500/8 border-red-500/15 text-red-500">Critical</span>
            </div>
            <p class="text-[12px] leading-relaxed text-brand-dark font-medium">
              <strong>AI Action Items:</strong> 
              <span v-for="(task, index) in engineeringStandup.tasks.slice(0, 3)" :key="task.id">
                {{ index + 1 }}. {{ task.title }} &nbsp;
              </span>
            </p>
            <div class="flex justify-between items-center border-t border-black/5 pt-[12px] w-[100%] mt-[8px]">
              <div class="flex items-center">
                <img :src="avatar1" alt="" class="w-[32px] h-[32px] rounded-full border border-white/90 shadow-sm object-cover -ml-[10px] first:ml-[0px]" />
                <div class="w-[32px] h-[32px] rounded-full border border-white/90 shadow-sm -ml-[10px] bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">JD</div>
                <img :src="avatar2" alt="" class="w-[32px] h-[32px] rounded-full border border-white/90 shadow-sm object-cover -ml-[10px]" />
                <div class="w-[32px] h-[32px] rounded-full border border-white/90 shadow-sm bg-white/80 flex items-center justify-center text-[10px] font-bold text-brand-slate -ml-[10px]">+5</div>
              </div>
              <span class="text-[11px] text-brand-slate font-semibold">{{ engineeringStandup.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Middle grid section: Activity Chart & Insights Panel -->
    <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-[24px] mb-[32px]">
      <!-- Productivity Overview Bar Chart -->
      <div class="card-glass rounded-[28px] p-[28px] flex flex-col justify-between h-[360px] border border-white/85 shadow-glass">
        <div class="flex justify-between items-start mb-[24px]">
          <div>
            <h3 class="text-[18px] sm:text-[20px] font-bold font-header text-brand-dark">Activity Overview</h3>
            <p class="text-[12px] text-brand-slate">Productivity metrics across workspaces</p>
          </div>
          <!-- Week / Month toggle -->
          <div class="flex bg-black/5 p-[4px] rounded-xl border border-black/[0.03] gap-[4px]">
            <button 
              class="px-[12px] py-[6px] rounded-lg text-[9px] font-extrabold tracking-wider uppercase text-brand-slate transition-all duration-300 hover:text-brand-dark cursor-pointer"
              :class="activeChartPeriod === 'week' ? 'bg-white text-primary border border-black/5 shadow-sm' : ''"
              @click="activeChartPeriod = 'week'"
            >
              Week
            </button>
            <button 
              class="px-[12px] py-[6px] rounded-lg text-[9px] font-extrabold tracking-wider uppercase text-brand-slate transition-all duration-300 hover:text-brand-dark cursor-pointer"
              :class="activeChartPeriod === 'month' ? 'bg-white text-primary border border-black/5 shadow-sm' : ''"
              @click="activeChartPeriod = 'month'"
            >
              Month
            </button>
          </div>
        </div>

        <!-- Animated Chart bars -->
        <div class="flex justify-between items-end gap-[10px] h-[160px] px-[10px] mb-[16px]">
          <div v-for="(val, idx) in currentChartValues" :key="idx" class="flex-1 flex flex-col items-center gap-[8px]">
            <div class="w-[18px] sm:w-[24px] h-[160px] bg-black/3 rounded-full relative overflow-hidden flex items-end">
              <div 
                class="w-[100%] bg-primary/30 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                :class="{ 'bg-grad-primary shadow-[0_2px_10px_rgba(75,104,255,0.15)]': idx === 3 }"
                :style="{ height: val + '%' }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Chart Days label row -->
        <div class="flex justify-between items-center text-[10px] font-bold text-brand-slate uppercase tracking-wide px-[10px]">
          <span v-for="day in chartLabels" :key="day" class="flex-1 text-center font-bold">{{ day }}</span>
        </div>
      </div>

      <!-- AI Insights Panel -->
      <div class="card-glass rounded-[28px] p-[28px] flex flex-col h-[360px] justify-between text-left border border-white/85 shadow-glass">
        <!-- Header -->
        <div class="flex items-center gap-[12px] mb-[24px]">
          <PhSparkle :size="22" weight="bold" class="text-primary" />
          <h3 class="text-[18px] sm:text-[20px] font-bold font-header text-brand-dark">AI Insights</h3>
        </div>

        <div class="flex flex-col gap-4 flex-grow justify-center mb-4">
          <!-- Peak 1 -->
          <div class="p-[16px] rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 flex flex-col gap-[6px] transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-900/60 hover:border-black/5 dark:hover:border-white/10">
            <div class="text-[8px] font-extrabold tracking-wider uppercase text-primary bg-primary/8 px-[8px] py-[2px] rounded border border-primary/10 self-start">CONCENTRATION PEAK</div>
            <p class="text-[12px] leading-relaxed text-brand-dark font-medium">
              Your deep work sessions are most effective between <span class="text-primary font-bold">9:00 AM - 11:30 AM</span>.
            </p>
          </div>

          <!-- Peak 2 -->
          <div class="p-[16px] rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 flex flex-col gap-[6px] transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-900/60 hover:border-black/5 dark:hover:border-white/10">
            <div class="text-[8px] font-extrabold tracking-wider uppercase text-secondary bg-secondary/8 px-[8px] py-[2px] rounded border border-secondary/10 self-start">MEETING BURNOUT RISK</div>
            <p class="text-[12px] leading-relaxed text-brand-dark font-medium">
              Scheduled back-to-back meetings tomorrow. AI suggests a <span class="text-secondary font-bold">15-minute gap</span> at 2 PM.
            </p>
          </div>
        </div>

        <!-- Action button -->
        <Button variant="glass" class="w-full" @click="exploreTrends">
          Explore Trends
        </Button>
      </div>
    </div>

    <!-- Bottom grid section: Upcoming schedule & Pending checklist -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-[24px] mb-[32px]">
      <!-- Upcoming Schedule Card -->
      <div class="card-glass rounded-[28px] p-[28px] flex flex-col text-left border border-white/85 shadow-glass">
        <h3 class="text-[18px] sm:text-[20px] font-bold font-header text-brand-dark mb-[20px]">Upcoming</h3>
        
        <div class="flex flex-col gap-[12px]">
          <div v-for="item in filteredUpcomingMeetings" :key="item.id" class="flex gap-[16px] items-center p-[12px] rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 transition-all duration-300 hover:bg-white/60 dark:hover:bg-slate-900/60 hover:border-black/5 dark:hover:border-white/10">
            <div 
              class="w-[44px] h-[44px] rounded-xl flex flex-col items-center justify-center flex-shrink-0 select-none"
              :class="item.featured ? 'bg-grad-primary text-white shadow-[0_2px_8px_rgba(75,104,255,0.15)]' : 'bg-brand-slate/10 border border-brand-slate/20 text-brand-dark shadow-none'"
            >
              <span class="text-[8px] font-extrabold uppercase tracking-wider">{{ item.month }}</span>
              <span class="text-[18px] font-bold font-header leading-none">{{ item.day }}</span>
            </div>
            <div class="flex-1 text-left">
              <h4 class="text-[14px] font-bold text-brand-dark mb-[4px]">{{ item.title }}</h4>
              <span class="text-[12px] text-brand-slate font-medium">{{ item.time }} • {{ item.location }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Tasks Card -->
      <div class="card-glass rounded-[28px] p-[28px] flex flex-col text-left border border-white/85 shadow-glass">
        <div class="flex justify-between items-center mb-[16px]">
          <h3 class="text-[18px] sm:text-[20px] font-bold font-header text-brand-dark">Pending Tasks</h3>
        </div>

        <!-- Deadline Summary Stats Widget -->
        <div class="flex items-center justify-between bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-[24px] p-4 shadow-sm mb-6 w-full text-center">
          <div class="flex flex-col items-center flex-1 border-r border-black/5 dark:border-white/10">
            <span class="text-[9px] uppercase font-extrabold tracking-wider text-brand-slate font-header">📋 Total</span>
            <span class="text-[20px] font-header font-bold text-brand-dark leading-none mt-1.5">{{ taskStore.tasks.length }}</span>
          </div>
          <div class="flex flex-col items-center flex-1 border-r border-black/5 dark:border-white/10">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.3)] animate-pulse"></span>
              <span class="text-[9px] uppercase font-extrabold tracking-wider text-brand-slate font-header">Due Today</span>
            </div>
            <span class="text-[20px] font-header font-bold text-amber-600 leading-none mt-1.5">{{ dueTodayCount }}</span>
          </div>
          <div class="flex flex-col items-center flex-1 border-r border-black/5 dark:border-white/10">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.3)] animate-pulse"></span>
              <span class="text-[9px] uppercase font-extrabold tracking-wider text-brand-slate font-header">Overdue</span>
            </div>
            <span class="text-[20px] font-header font-bold text-red-600 leading-none mt-1.5">{{ overdueCount }}</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></span>
              <span class="text-[9px] uppercase font-extrabold tracking-wider text-brand-slate font-header">Completed</span>
            </div>
            <span class="text-[20px] font-header font-bold text-emerald-600 leading-none mt-1.5">{{ completedCount }}</span>
          </div>
        </div>

        <!-- Task checklist list -->
        <div class="flex flex-col gap-[12px]">
          <div 
            v-for="task in filteredTasks.slice(0, 5)" 
            :key="task.id"
            class="flex items-center justify-between p-[14px] gap-3 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 transition-all duration-300 hover:bg-white/75 dark:hover:bg-slate-900/60 hover:border-black/8 dark:hover:border-white/10 select-none"
            :class="{ 'bg-white/20 dark:bg-slate-900/20 border-black/3 dark:border-white/[0.03] opacity-80': task.status === 'done' || task.done }"
          >
            <div class="flex items-center gap-[14px]">
              <!-- Checkbox on the left -->
              <Checkbox 
                :model-value="task.status === 'done' || task.done"
                :disabled="task.status === 'done' || task.done || isTaskLocked(task)"
                shape="circle"
                @update:model-value="markDone(task)"
                :title="task.status === 'done' || task.done ? 'Task completed' : 'Mark as Done'"
              />
              
              <div class="flex flex-col text-left">
                <span 
                  class="text-[12px] font-semibold text-brand-dark transition-all duration-300"
                  :class="{ 'line-through text-brand-slate': task.status === 'done' || task.done }"
                >
                  {{ task.title }}
                </span>
                <span class="text-[9px] text-brand-slate font-medium mt-0.5 flex items-center gap-1">
                  <PhSparkle v-if="task.source && task.source.startsWith('Meeting:')" :size="10" weight="fill" class="text-purple-500" />
                  <PhUser v-else :size="10" weight="bold" class="text-slate-400" />
                  {{ task.source }}
                </span>
              </div>
            </div>

            <!-- Status Tag + 2 arrows under it on the right -->
            <div class="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[80px]">
              <!-- Status Tag in one line -->
              <span 
                class="text-[9px] font-extrabold uppercase px-[8px] py-[2px] rounded-md tracking-wider border select-none transition-colors duration-300 block text-center min-w-[76px]"
                :class="statusTagStyle(task.status)"
              >
                {{ formatStatusLabel(task.status) }}
              </span>

              <!-- Left and Right Arrows under it (hidden if task is done or locked) -->
              <div v-if="task.status !== 'done' && !task.done && !isTaskLocked(task)" class="flex items-center gap-2">
                <button 
                  type="button"
                  @click.stop="moveStage(task, -1)"
                  :disabled="task.status === 'todo'"
                  class="w-5 h-5 rounded bg-black/5 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none"
                  title="Move Left"
                >
                  <PhArrowLeft :size="10" weight="bold" />
                </button>
                <button 
                  type="button"
                  @click.stop="moveStage(task, 1)"
                  class="w-5 h-5 rounded bg-black/5 hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                  title="Move Right"
                >
                  <PhArrowRight :size="10" weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PhClock, PhSparkle, PhArrowLeft, PhArrowRight, PhUser, PhWarningCircle } from '@phosphor-icons/vue'
import { useMeetingStore } from '../../stores/meeting'
import Checkbox from '../ui/Checkbox.vue'
import Modal from '../ui/Modal.vue'
import { useTaskStore } from '../../stores/task'
import MeetingCard from './MeetingCard.vue'
import Button from '../ui/Button.vue'
import SearchBar from '../ui/SearchBar.vue'
import { useAuthStore } from "@/stores/auth"
import { getCountdownInfo } from '../../utils/taskDeadline'

const authStore = useAuthStore()

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

const isTaskLocked = (task) => {
  const isAdmin = authStore.user?.role === 'admin'
  return !isAdmin && (task.status === 'review' || task.status === 'done')
}

const firstName = computed(() => {
  return authStore.user?.name?.split(" ")[0] || "User"
})


// Import assets
import activityTrendImg from '../../assets/Activity Trend.png'
import avatar1 from '../../assets/Background+Border.png'
import avatar2 from '../../assets/Background+Border-1.png'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const meetingStore = useMeetingStore()
const taskStore = useTaskStore()
const localSearchQuery = ref('')

onMounted(() => {
  taskStore.fetchTasks()
})

// Filtered Standard meetings list (synchronized with archive)
const filteredStandardMeetings = computed(() => {
  const list = meetingStore.meetings
  if (!localSearchQuery.value) return list
  const q = localSearchQuery.value.toLowerCase()
  return list.filter(m => m.title.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q)))
})

const engineeringStandup = computed(() => {
  return meetingStore.meetings.find(m => m.title === 'Daily Standup: Engineering')
})

const matchesSearch = (meeting) => {
  if (!localSearchQuery.value) return true
  const q = localSearchQuery.value.toLowerCase()
  return meeting.title.toLowerCase().includes(q) || (meeting.description && meeting.description.toLowerCase().includes(q))
}

const filteredUpcomingMeetings = computed(() => {
  const list = meetingStore.upcomingMeetings
  if (!localSearchQuery.value) return list
  const q = localSearchQuery.value.toLowerCase()
  return list.filter(m => m.title.toLowerCase().includes(q))
})

const getPriorityWeight = (priority) => {
  const p = (priority || '').toLowerCase()
  if (p.includes('high')) return 3
  if (p.includes('medium') || p.includes('med')) return 2
  if (p.includes('low')) return 1
  return 0
}

const filteredTasks = computed(() => {
  let list = taskStore.tasks
  if (localSearchQuery.value) {
    const q = localSearchQuery.value.toLowerCase()
    list = list.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)))
  }
  return [...list].sort((a, b) => getPriorityWeight(b.priority) - getPriorityWeight(a.priority))
})

const dueTodayCount = computed(() =>
  taskStore.tasks.filter(t => getCountdownInfo(t).urgency === 'today').length
)

const overdueCount = computed(() =>
  taskStore.tasks.filter(t => getCountdownInfo(t).urgency === 'overdue').length
)

const completedCount = computed(() =>
  taskStore.tasks.filter(t => t.status === 'done' || t.done).length
)

const markDone = async (task) => {
  if (task.status === 'done' || task.done) return
  const success = await taskStore.setTaskStatus(task.id || task._id, 'done')
  if (success) {
    task.status = 'done'
    task.done = true
  }
}

const moveStage = async (task, direction) => {
  if (task.status === 'done' || task.done) return
  
  const statusOrder = ['todo', 'inprogress', 'review', 'done']
  const currentIndex = statusOrder.indexOf(task.status || 'todo')
  const nextIndex = currentIndex + direction
  
  if (nextIndex >= 0 && nextIndex < statusOrder.length) {
    const nextStatus = statusOrder[nextIndex]
    if (nextStatus === 'review' && authStore.user?.role !== 'admin') {
      triggerReviewConfirmModal(async () => {
        const success = await taskStore.setTaskStatus(task.id || task._id, nextStatus)
        if (success) {
          task.status = nextStatus
          task.done = nextStatus === 'done'
        }
      })
    } else {
      const success = await taskStore.setTaskStatus(task.id || task._id, nextStatus)
      if (success) {
        task.status = nextStatus
        task.done = nextStatus === 'done'
      }
    }
  }
}

const statusTagStyle = (status) => {
  if (status === 'todo') return 'bg-primary/8 border-primary/15 text-primary'
  if (status === 'inprogress') return 'bg-amber-500/8 border-amber-500/15 text-amber-600'
  if (status === 'review') return 'bg-red-500/8 border-red-500/15 text-red-500'
  if (status === 'done') return 'bg-emerald-500/8 border-emerald-500/15 text-emerald-600'
  return 'bg-brand-slate/8 border-brand-slate/15 text-brand-slate'
}

const formatStatusLabel = (status) => {
  if (status === 'todo') return 'To Do'
  if (status === 'inprogress') return 'In Progress'
  if (status === 'review') return 'Review'
  if (status === 'done') return 'Done'
  return status
}

// Productivity Chart State
const activeChartPeriod = ref('week')
const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const currentChartValues = computed(() => {
  if (activeChartPeriod.value === 'week') {
    return [60, 45, 80, 95, 70, 55, 90]
  } else {
    return [45, 70, 58, 40, 85, 35, 66]
  }
})

const openMeetingDetails = (meeting) => {
  meetingStore.selectedMeeting = meeting
  router.push('/archive')
}

const exploreTrends = async () => {
  await alertStore.showAlert('Simulating direct link to full-scale team productivity trends & metrics reports page.', 'Simulation Mode', 'primary')
}
</script>

<style scoped>
@keyframes pulse-soft {
  0%, 100% { box-shadow: 0 0 0 0 rgba(75,104,255,0); }
  50%       { box-shadow: 0 0 0 6px rgba(75,104,255,0.07); }
}
.animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
</style>
