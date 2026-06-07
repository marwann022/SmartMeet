<template>
  <div class="w-full max-w-full m-0 p-0 overflow-x-hidden">
    <div class="flex min-h-screen w-screen bg-brand-bg relative text-left">
      <!-- LEFT FIXED SIDEBAR -->
      <aside class="w-[260px] h-screen fixed left-0 top-0 bottom-0 bg-white/75 border-r border-black/5 backdrop-blur-[20px] z-50 flex flex-col justify-between p-6">
        <div class="flex flex-col gap-8">
          <!-- Logo -->
          <div class="flex items-center transition-all duration-300 hover:scale-[1.02] cursor-pointer self-start" @click="$emit('navigate', 'home')">
            <img :src="logoWordmark" alt="SmartMeet" class="h-16 w-auto block" />
          </div>

          <!-- Menu items -->
          <div class="flex flex-col gap-1">
            <!-- New meeting button wrapper -->
            <div class="mb-4">
              <button class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-header font-bold text-[11px] tracking-wider uppercase bg-white/80 text-brand-dark border border-black/8 hover:bg-white hover:border-primary/20 hover:shadow-[0_4px_15px_rgba(31,38,135,0.04)] hover:text-primary hover:-translate-y-[2px] transition-all duration-300 w-full cursor-pointer" @click="createNewMeeting">
                <span>New Meeting</span>
                <PhPlus :size="14" weight="bold" />
              </button>
            </div>

            <!-- Tab Buttons -->
            <button 
              v-for="tab in menuTabs" 
              :key="tab.id"
              class="w-full py-3.5 px-4 rounded-xl flex items-center gap-3.5 font-header font-bold text-xs tracking-wide transition-all duration-300 border border-transparent cursor-pointer group text-left"
              :class="currentTab === tab.id ? 'bg-primary/8 text-primary border-primary/8 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]' : 'text-brand-slate hover:bg-primary/4 hover:text-brand-dark hover:translate-x-1'"
              @click="currentTab = tab.id"
            >
              <component 
                :is="tab.icon" 
                :size="20" 
                weight="bold" 
                class="transition-colors duration-300"
                :class="currentTab === tab.id ? 'text-primary' : 'text-brand-slate group-hover:text-primary'"
              />
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <!-- User profile section at the bottom -->
        <div class="flex items-center gap-3 pt-4 border-t border-black/5">
          <img :src="userProfileImg" alt="Profile" class="w-11 h-11 rounded-full object-cover border border-white/85 shadow-sm" />
          <div class="flex flex-col">
            <span class="text-[11px] font-bold text-brand-dark leading-tight">Alex Chen</span>
            <span class="text-[9px] font-extrabold text-primary tracking-wider uppercase">Pro Tier</span>
          </div>
        </div>
      </aside>

      <!-- MAIN SCROLLABLE CONTENT AREA -->
      <main class="flex-1 ml-[260px] min-h-screen px-8 sm:px-12 py-8 bg-brand-bg relative overflow-y-auto w-[calc(100vw-260px)]">
        <!-- TOP INNER HEADER NAVIGATION -->
        <header class="flex items-center justify-between py-4 border-b border-black/5 mb-8">
          <nav class="flex items-center gap-6">
            <a href="#" class="text-xs font-semibold text-brand-slate hover:text-primary transition-colors py-1.5 px-3.5 rounded-full hover:bg-primary/5" @click.prevent="$emit('navigate', 'home')">Home</a>
            <a href="#" class="text-xs font-semibold text-brand-slate hover:text-primary transition-colors py-1.5 px-3.5 rounded-full hover:bg-primary/5" @click.prevent="$emit('navigate', 'home#product')">Features</a>
            <a href="#" class="text-xs font-semibold text-brand-slate hover:text-primary transition-colors py-1.5 px-3.5 rounded-full hover:bg-primary/5" @click.prevent="$emit('navigate', 'home#testimonials')">Pricing</a>
            <a href="#" class="text-xs font-semibold py-1.5 px-3.5 rounded-full text-primary bg-primary/5 border border-primary/10" @click.prevent>Dashboard</a>
          </nav>
          <div class="flex items-center gap-4">
            <a href="#" class="text-sm font-semibold text-brand-slate hover:text-primary transition-colors mr-2" @click.prevent="$emit('navigate', 'signin')">Login</a>
            <button class="px-5 py-2.5 rounded-full bg-grad-primary text-white font-header font-bold text-xs tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_20px_rgba(75,104,255,0.35)] active:scale-[0.98] transition-all duration-300 cursor-pointer" @click="$emit('navigate', 'signup')">
              Get Started
            </button>
          </div>
        </header>

        <!-- SUB VIEW: Simulated tab switching (we only render dashboard tab for Figma spec) -->
        <div v-if="currentTab === 'dashboard'">
          <!-- Welcome header row -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 class="text-3xl sm:text-4xl font-bold font-header text-brand-dark tracking-tight mb-2">Good morning, Alex.</h1>
              <p class="text-[14px]">
                AI analyzed <span class="font-bold text-primary">12 meetings</span> this week. Productivity is up by 18%.
              </p>
            </div>
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/10 shadow-sm text-xs font-bold text-primary select-none">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>AI Live Syncing</span>
            </div>
          </div>

          <!-- Section: Recent Meetings -->
          <section class="mb-10">
            <div class="flex justify-between items-center mb-5">
              <h2 class="text-xl sm:text-2xl font-bold font-header text-brand-dark tracking-tight flex items-center gap-2">
                <PhClock :size="22" weight="bold" class="text-primary" />
                Recent Meetings
              </h2>
              <button class="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-xl font-header font-bold text-[11px] tracking-wider uppercase bg-white/80 text-brand-dark border border-black/8 hover:bg-white hover:border-primary/20 hover:text-primary transition-all duration-300 cursor-pointer" @click="viewAllMeetings">View All</button>
            </div>

            <!-- Bento Meetings Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <!-- Card 1: Q4 Strategy Sync -->
              <div class="card-glass rounded-[28px] p-6 flex flex-col justify-between min-h-[200px]">
                <div class="flex justify-between items-start">
                  <div class="w-10 h-10 rounded-xl bg-primary/6 border border-primary/15 flex items-center justify-center text-primary shadow-sm flex-shrink-0 transition-transform duration-300 hover:scale-105">
                    <PhVideoCamera :size="20" weight="bold" />
                  </div>
                  <span class="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-md self-start tracking-wider uppercase border bg-secondary/8 border-secondary/15 text-secondary">Client</span>
                </div>
                <div class="my-4">
                  <h4 class="text-lg font-bold font-header text-brand-dark mb-1.5">Q4 Strategy Sync</h4>
                  <p class="text-xs sm:text-sm leading-relaxed text-brand-slate">
                    AI Summary: Discussion focused on scaling GPU clusters and refining the model training pipeline.
                  </p>
                </div>
                <div class="flex justify-between items-center border-t border-black/5 pt-3.5 text-xs text-brand-slate font-semibold">
                  <span>45m</span>
                  <span>6 participants</span>
                </div>
              </div>

              <!-- Card 2: Design Review: Nexus Pro -->
              <div class="card-glass rounded-[28px] p-6 flex flex-col justify-between min-h-[200px]">
                <div class="flex justify-between items-start">
                  <div class="w-10 h-10 rounded-xl bg-secondary/6 border border-secondary/15 flex items-center justify-center text-secondary shadow-sm flex-shrink-0 transition-transform duration-300 hover:scale-105">
                    <PhUser :size="20" weight="bold" />
                  </div>
                  <span class="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-md self-start tracking-wider uppercase border bg-secondary/8 border-secondary/15 text-secondary">Client</span>
                </div>
                <div class="my-4">
                  <h4 class="text-lg font-bold font-header text-brand-dark mb-1.5">Design Review: Nexus Pro</h4>
                  <p class="text-xs sm:text-sm leading-relaxed text-brand-slate">
                    AI Summary: Client loved the glassmorphism approach but requested higher contrast on text variables.
                  </p>
                </div>
                <div class="flex justify-between items-center border-t border-black/5 pt-3.5 text-xs text-brand-slate font-semibold">
                  <span>22m</span>
                  <span>3 participants</span>
                </div>
              </div>

              <!-- Featured Large Card: Daily Standup: Engineering -->
              <div class="col-span-1 md:col-span-2 p-6 rounded-[28px] flex flex-col md:flex-row gap-6 items-center bg-gradient-to-br from-primary/5 via-white/40 to-white/70 border border-white/80 shadow-glass backdrop-blur-md transition-all duration-300 hover:shadow-card-hover hover:border-white/95">
                <div class="w-full md:w-[220px] h-[140px] rounded-2xl bg-white/50 border border-black/5 flex items-center justify-center p-3 relative overflow-hidden flex-shrink-0">
                  <img :src="activityTrendImg" alt="Activity Trend" class="w-full h-full object-contain filter drop-shadow-[0_2px_10px_rgba(75,104,255,0.08)]" />
                </div>
                <div class="flex-1 flex flex-col justify-between items-start gap-4 text-left w-full">
                  <div class="flex justify-between items-start w-full">
                    <h4 class="text-lg font-bold font-header text-brand-dark">Daily Standup: Engineering</h4>
                    <span class="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-md self-start tracking-wider uppercase border bg-red-500/8 border-red-500/15 text-red-500">Critical</span>
                  </div>
                  <p class="text-xs leading-relaxed text-brand-dark font-medium">
                    <strong>AI Action Items:</strong> 1. Patch DB latency issues. 2. Finalize API documentation for v2. 3. Schedule security audit.
                  </p>
                  <div class="flex justify-between items-center border-t border-black/5 pt-3 w-full mt-2">
                    <div class="flex items-center">
                      <img :src="avatar1" alt="" class="w-8 h-8 rounded-full border border-white/90 shadow-sm object-cover -ml-2.5 first:ml-0" />
                      <div class="w-8 h-8 rounded-full border border-white/90 shadow-sm -ml-2.5 bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">JD</div>
                      <img :src="avatar2" alt="" class="w-8 h-8 rounded-full border border-white/90 shadow-sm object-cover -ml-2.5" />
                      <div class="w-8 h-8 rounded-full border border-white/90 shadow-sm bg-white/80 flex items-center justify-center text-[10px] font-bold text-brand-slate -ml-2.5">+5</div>
                    </div>
                    <span class="text-[11px] text-brand-slate font-semibold">Today, 09:30 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Middle grid section: Activity Chart & Insights Panel -->
          <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 mb-8">
            <!-- Productivity Overview Bar Chart -->
            <div class="card-glass rounded-[28px] p-7 flex flex-col justify-between h-[360px]">
              <div class="flex justify-between items-start mb-6">
                <div>
                  <h3 class="text-lg sm:text-xl font-bold font-header text-brand-dark">Activity Overview</h3>
                  <p class="text-xs text-brand-slate">Productivity metrics across workspaces</p>
                </div>
                <!-- Week / Month toggle -->
                <div class="flex bg-black/5 p-1 rounded-xl border border-black/[0.03] gap-1">
                  <button 
                    class="px-3 py-1.5 rounded-lg text-[9px] font-extrabold tracking-wider uppercase text-brand-slate transition-all duration-300 hover:text-brand-dark cursor-pointer"
                    :class="activeChartPeriod === 'week' ? 'bg-white text-primary border border-black/5 shadow-sm' : ''"
                    @click="activeChartPeriod = 'week'"
                  >
                    Week
                  </button>
                  <button 
                    class="px-3 py-1.5 rounded-lg text-[9px] font-extrabold tracking-wider uppercase text-brand-slate transition-all duration-300 hover:text-brand-dark cursor-pointer"
                    :class="activeChartPeriod === 'month' ? 'bg-white text-primary border border-black/5 shadow-sm' : ''"
                    @click="activeChartPeriod = 'month'"
                  >
                    Month
                  </button>
                </div>
              </div>

              <!-- Animated Chart bars -->
              <div class="flex justify-between items-end gap-2.5 h-[160px] px-2.5 mb-4">
                <div v-for="(val, idx) in currentChartValues" :key="idx" class="flex-1 flex flex-col items-center gap-2">
                  <div class="w-[18px] sm:w-[24px] h-[160px] bg-black/3 rounded-full relative overflow-hidden flex items-end">
                    <div 
                      class="w-full bg-primary/30 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      :class="{ 'bg-grad-primary shadow-[0_2px_10px_rgba(75,104,255,0.15)]': idx === 3 }"
                      :style="{ height: val + '%' }"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Chart Days label row -->
              <div class="flex justify-between items-center text-[10px] font-bold text-brand-slate uppercase tracking-wide px-2.5">
                <span v-for="day in chartLabels" :key="day" class="flex-1 text-center font-bold">{{ day }}</span>
              </div>
            </div>

            <!-- AI Insights Panel -->
            <div class="card-glass rounded-[28px] p-7 flex flex-col h-[360px] justify-between text-left">
              <!-- Header -->
              <div class="flex items-center gap-3 mb-6">
                <PhSparkle :size="22" weight="bold" class="text-primary" />
                <h3 class="text-lg sm:text-xl font-bold font-header text-brand-dark">AI Insights</h3>
              </div>

              <div class="flex flex-col gap-4 flex-grow justify-center mb-4">
                <!-- Peak 1 -->
                <div class="p-4 rounded-2xl bg-white/40 border border-black/[0.03] flex flex-col gap-1.5 transition-all duration-300 hover:bg-white/60 hover:border-black/5">
                  <div class="text-[8px] font-extrabold tracking-wider uppercase text-primary bg-primary/8 px-2 py-0.5 rounded border border-primary/10 self-start">CONCENTRATION PEAK</div>
                  <p class="text-xs leading-relaxed text-brand-dark font-medium">
                    Your deep work sessions are most effective between <span class="text-primary font-bold">9:00 AM - 11:30 AM</span>.
                  </p>
                </div>

                <!-- Peak 2 -->
                <div class="p-4 rounded-2xl bg-white/40 border border-black/[0.03] flex flex-col gap-1.5 transition-all duration-300 hover:bg-white/60 hover:border-black/5">
                  <div class="text-[8px] font-extrabold tracking-wider uppercase text-secondary bg-secondary/8 px-2 py-0.5 rounded border border-secondary/10 self-start">MEETING BURNOUT RISK</div>
                  <p class="text-xs leading-relaxed text-brand-dark font-medium">
                    Scheduled back-to-back meetings tomorrow. AI suggests a <span class="text-secondary font-bold">15-minute gap</span> at 2 PM.
                  </p>
                </div>
              </div>

              <!-- Action button -->
              <button class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-header font-bold text-[11px] tracking-wider uppercase bg-white/80 text-brand-dark border border-primary/20 hover:bg-white hover:border-primary/40 hover:text-primary transition-all duration-300 w-full cursor-pointer" @click="exploreTrends">
                Explore Trends
              </button>
            </div>
          </div>

          <!-- Bottom grid section: Upcoming schedule & Pending checklist -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <!-- Upcoming Schedule Card -->
            <div class="card-glass rounded-[28px] p-7 flex flex-col text-left">
              <h3 class="text-lg sm:text-xl font-bold font-header text-brand-dark mb-5">Upcoming</h3>
              
              <div class="flex flex-col gap-3">
                <div v-for="item in upcomingMeetings" :key="item.id" class="flex gap-4 items-center p-3 rounded-2xl bg-white/40 border border-black/[0.03] transition-all duration-300 hover:bg-white/60 hover:border-black/5">
                  <div 
                    class="w-11 h-11 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0 select-none"
                    :class="item.featured ? 'bg-grad-primary shadow-[0_2px_8px_rgba(75,104,255,0.15)]' : 'bg-white/70 border border-black/5 text-brand-slate shadow-none'"
                  >
                    <span class="text-[8px] font-extrabold uppercase tracking-wider">{{ item.month }}</span>
                    <span class="text-lg font-bold font-header leading-none">{{ item.day }}</span>
                  </div>
                  <div class="flex-1 text-left">
                    <h4 class="text-sm font-bold text-brand-dark mb-1">{{ item.title }}</h4>
                    <span class="text-xs text-brand-slate font-medium">{{ item.time }} • {{ item.location }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pending Tasks Card -->
            <div class="card-glass rounded-[28px] p-7 flex flex-col text-left">
              <div class="flex justify-between items-center mb-5">
                <h3 class="text-lg sm:text-xl font-bold font-header text-brand-dark">Pending Tasks</h3>
                <span class="inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-md self-start tracking-wider uppercase border bg-red-500/8 border-red-500/15 text-red-500">4 High</span>
              </div>

              <!-- Task checklist list -->
              <div class="flex flex-col gap-3">
                <div 
                  v-for="task in pendingTasks" 
                  :key="task.id"
                  class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/40 border border-black/[0.03] cursor-pointer transition-all duration-300 hover:bg-white/75 hover:border-black/8 hover:translate-x-1 select-none"
                  :class="{ 'bg-white/20 border-black/3 opacity-80': task.checked }"
                  @click="toggleTask(task.id)"
                >
                  <div 
                    class="w-5 h-5 rounded-md border-2 border-brand-slate/40 flex items-center justify-center transition-all duration-300"
                    :class="task.checked ? 'border-primary bg-primary text-white' : ''"
                  >
                    <PhCheck v-if="task.checked" :size="14" weight="bold" class="text-white" />
                  </div>
                  <span 
                    class="text-xs font-semibold text-brand-dark transition-all duration-300"
                    :class="{ 'line-through text-brand-slate': task.checked }"
                  >
                    {{ task.text }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Inner Footer -->
          <footer class="flex justify-between items-center text-[9px] font-bold text-brand-slate tracking-wide uppercase mt-12 py-6 border-t border-black/5">
            <span>© 2026 SmartMeet AI Inc. All rights reserved.</span>
            <div class="flex gap-6">
              <a href="#" class="hover:text-primary transition-colors" @click.prevent>Terms of Service</a>
              <a href="#" class="hover:text-primary transition-colors" @click.prevent>Security</a>
              <a href="#" class="hover:text-primary transition-colors" @click.prevent>Cookies</a>
            </div>
          </footer>
        </div>

        <!-- Tab placeholders -->
        <div v-else class="card-glass rounded-[28px] p-16 text-center mt-10">
          <h3 class="text-2xl font-bold font-header text-brand-dark mb-3 text-transform: capitalize">{{ currentTab }} View</h3>
          <p class="text-sm text-brand-slate max-w-[440px] mx-auto mb-6">
            This section represents a visual placeholder for the simulated SmartMeet workspace tab layout.
          </p>
          <Button variant="primary" @click="currentTab = 'dashboard'">Back to Dashboard</Button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  PhPlus, 
  PhLayout, 
  PhArchive, 
  PhCheckSquare, 
  PhBrain, 
  PhGear, 
  PhVideoCamera, 
  PhUser, 
  PhArrowClockwise, 
  PhClock, 
  PhSparkle, 
  PhCheck 
} from '@phosphor-icons/vue'

// Import assets
import logoWordmark from '../assets/Black logo.svg'
import userProfileImg from '../assets/User Profile.png'
import activityTrendImg from '../assets/Activity Trend.png'
import avatar1 from '../assets/Background+Border.png'
import avatar2 from '../assets/Background+Border-1.png'

defineEmits(['navigate'])

// Navigation Tab State
const currentTab = ref('dashboard')

// Menu Tab buttons Definition
const menuTabs = [
  { id: 'dashboard', label: 'Dashboard', icon: PhLayout },
  { id: 'archive', label: 'Archive', icon: PhArchive },
  { id: 'tasks', label: 'Tasks', icon: PhCheckSquare },
  { id: 'knowledge', label: 'Knowledge AI', icon: PhBrain },
  { id: 'settings', label: 'Settings', icon: PhGear }
]

// Productivity Chart State
const activeChartPeriod = ref('week')

const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Height percentages transitions
const currentChartValues = computed(() => {
  if (activeChartPeriod.value === 'week') {
    return [60, 45, 80, 95, 70, 55, 90] // MON-SUN percentages matching Figma mockup heights
  } else {
    return [45, 70, 58, 40, 85, 35, 66] // Simulated month heights
  }
})

// Upcoming events list
const upcomingMeetings = ref([
  { id: 1, month: 'NOV', day: '14', title: 'Marketing Sync', time: '1:30 PM', location: 'Zoom', featured: true },
  { id: 2, month: 'NOV', day: '15', title: 'Project Nexus Launch', time: '10:00 AM', location: 'In-Person', featured: false },
  { id: 3, month: 'NOV', day: '15', title: 'One-on-One: Sarah', time: '4:00 PM', location: 'Google Meet', featured: false }
])

// Reactive checklist
const pendingTasks = ref([
  { id: 1, text: 'Update security protocols', checked: true },
  { id: 2, text: 'Review transcript for Nexus', checked: false },
  { id: 3, text: 'Draft roadmap v2.1', checked: false }
])

const toggleTask = (id) => {
  const task = pendingTasks.value.find(t => t.id === id)
  if (task) {
    task.checked = !task.checked
  }
}

// User Action simulation prompts
const createNewMeeting = () => {
  alert('Starting SmartMeet live recording workspace session... Connecting bot...')
}

const exploreTrends = () => {
  alert('Simulating direct link to full-scale team productivity trends & metrics reports page.')
}

const viewAllMeetings = () => {
  alert('Opening recent recordings archive filter window.')
}
</script>
