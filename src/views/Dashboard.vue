<template>
  <div class="w-[100%] max-w-[100%] m-[0px] p-[0px] overflow-x-hidden">
    <div class="flex min-h-[100vh] w-[100%] bg-brand-bg relative text-left">
      <!-- LEFT FIXED SIDEBAR -->
      <aside class="w-[260px] h-[100vh] fixed left-[0px] top-[0px] bottom-[0px] bg-white/75 border-r border-black/5 backdrop-blur-[20px] z-50 flex flex-col justify-between p-[24px]">
        <div class="flex flex-col gap-[32px]">
          <!-- Logo -->
          <div class="flex items-center transition-all duration-300 hover:scale-[1.02] cursor-pointer self-start" @click="$emit('navigate', 'home')">
            <img :src="logoWordmark" alt="SmartMeet" class="h-[64px] w-auto block" />
          </div>

          <!-- Menu items -->
          <div class="flex flex-col gap-[4px]">
            <!-- New meeting button wrapper -->
            <div class="mb-[16px]">
              <button class="inline-flex items-center justify-center gap-[8px] px-[24px] py-[12px] rounded-[12px] font-header font-bold text-[11px] tracking-wider uppercase bg-white/80 text-brand-dark border border-black/8 hover:bg-white hover:border-primary/20 hover:shadow-[0_4px_15px_rgba(31,38,135,0.04)] hover:text-primary hover:-translate-y-[2px] transition-all duration-300 w-[100%] cursor-pointer focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0" @click="createNewMeeting">
                <span>New Meeting</span>
                <PhPlus :size="14" weight="bold" />
              </button>
            </div>

            <!-- Tab Buttons -->
            <button 
              v-for="tab in menuTabs" 
              :key="tab.id"
              class="w-[100%] py-[14px] px-[16px] rounded-[12px] flex items-center gap-[14px] font-header font-bold text-[12px] tracking-wide transition-all duration-300 border border-transparent cursor-pointer group text-left focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
              :class="currentTab === tab.id ? 'bg-primary/8 text-primary border-primary/8 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]' : 'text-brand-slate hover:bg-primary/4 hover:text-primary hover:translate-x-[4px]'"
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
        <div class="flex items-center gap-[12px] pt-[16px] border-t border-black/5">
          <img :src="userProfileImg" alt="Profile" class="w-[44px] h-[44px] rounded-full object-cover border border-white/85 shadow-sm" />
          <div class="flex flex-col">
            <span class="text-[11px] font-bold text-brand-dark leading-tight">Alex Chen</span>
            <span class="text-[9px] font-extrabold text-primary tracking-wider uppercase">Pro Tier</span>
          </div>
        </div>
      </aside>

      <!-- MAIN SCROLLABLE CONTENT AREA -->
      <main class="flex-1 mt-[80px] ml-[260px] min-h-[100vh] px-[32px] sm:px-[48px] py-[32px] bg-brand-bg relative overflow-y-auto w-[calc(100%-260px)]">
        <!-- TOP INNER HEADER NAVIGATION -->
        <div class="fixed left-[260px] right-[0px] top-[20px] px-[32px] sm:px-[48px] z-[40]">
          <header class="flex items-center justify-between px-[28px] py-[10px] rounded-full bg-white/65 border border-white/70 shadow-glass backdrop-blur-[20px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-white/85 hover:bg-white/75 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.08),0_0_20px_rgba(75,104,255,0.05)]">
            <nav class="flex items-center gap-[24px]">
              <a href="#" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5" @click.prevent="$emit('navigate', 'home')">Home</a>
              <a href="#" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5" @click.prevent="$emit('navigate', 'features')">Features</a>
              <a href="#" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5" @click.prevent="$emit('navigate', 'pricing')">Pricing</a>
              <a href="#" class="text-[12px] font-semibold py-[6px] px-[14px] rounded-full text-primary bg-primary/5 border border-primary/10" @click.prevent>Dashboard</a>
            </nav>
            <div class="flex items-center gap-[16px]">
              <button class="px-[20px] py-[10px] rounded-full bg-white border border-black/8 text-brand-dark font-header font-bold text-[12px] tracking-wider uppercase hover:bg-black/5 hover:border-black/15 active:scale-[0.98] transition-all duration-300 cursor-pointer focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0" @click="$emit('navigate', 'home')">
                Log Out
              </button>
            </div>
          </header>
        </div>

        <!-- SUB VIEW: Tab switching -->
        <div v-if="currentTab === 'dashboard'">
          <!-- Welcome header row -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-[32px] gap-[16px]">
            <div>
              <h1 class="text-[30px] sm:text-[36px] font-bold font-header text-brand-dark tracking-tight mb-[8px]">Good morning, Alex.</h1>
              <p class="text-[14px]">
                AI analyzed <span class="font-bold text-primary">12 meetings</span> this week. Productivity is up by 18%.
              </p>
            </div>
            <div class="inline-flex items-center gap-[8px] px-[14px] py-[6px] rounded-full bg-primary/8 border border-primary/10 shadow-sm text-[12px] font-bold text-primary select-none">
              <span class="relative flex h-[8px] w-[8px]">
                <span class="animate-ping absolute inline-flex h-[100%] w-[100%] rounded-full bg-primary opacity-75"></span>
                <span class="relative inline-flex rounded-full h-[8px] w-[8px] bg-primary"></span>
              </span>
              <span>AI Live Syncing</span>
            </div>
          </div>

          <!-- Section: Recent Meetings -->
          <section class="mb-[40px]">
            <div class="flex justify-between items-center mb-[20px]">
              <h2 class="text-[20px] sm:text-[24px] font-bold font-header text-brand-dark tracking-tight flex items-center gap-[8px]">
                <PhClock :size="22" weight="bold" class="text-primary" />
                Recent Meetings
              </h2>
              <button class="inline-flex items-center justify-center gap-[8px] px-[16px] py-[6px] rounded-xl font-header font-bold text-[11px] tracking-wider uppercase bg-white/80 text-brand-dark border border-black/8 hover:bg-white hover:border-primary/20 hover:text-primary transition-all duration-300 cursor-pointer" @click="viewAllMeetings">View All</button>
            </div>

            <!-- Bento Meetings Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-[24px] mb-[32px]">
              <!-- Render first 2 meetings from reactive data (excluding Standup) -->
              <div 
                v-for="meeting in meetings.filter(m => m.title !== 'Daily Standup: Engineering').slice(0, 2)" 
                :key="meeting.id" 
                @click="openMeetingDetails(meeting)"
                class="card-glass rounded-[28px] p-[24px] flex flex-col justify-between min-h-[200px] hover:translate-y-[-2px] transition-all cursor-pointer text-left"
              >
                <div class="flex justify-between items-start">
                  <div class="w-[40px] h-[40px] rounded-xl bg-primary/6 border border-primary/15 flex items-center justify-center text-primary shadow-sm flex-shrink-0 transition-transform duration-300 hover:scale-105">
                    <PhVideoCamera v-if="meeting.type === 'Zoom' || meeting.type === 'Google Meet'" :size="20" weight="bold" />
                    <PhUser v-else :size="20" weight="bold" />
                  </div>
                  <span class="inline-block text-[9px] font-extrabold px-[8px] py-[2px] rounded-md self-start tracking-wider uppercase border bg-secondary/8 border-secondary/15 text-secondary">
                    {{ meeting.type }}
                  </span>
                </div>
                <div class="my-[16px]">
                  <h4 class="text-[18px] font-bold font-header text-brand-dark mb-[6px]">{{ meeting.title }}</h4>
                  <p class="text-[12px] sm:text-[14px] leading-relaxed text-brand-slate line-clamp-3">
                    AI Summary: {{ meeting.bullets ? meeting.bullets[0] : meeting.description }}
                  </p>
                </div>
                <div class="flex justify-between items-center border-t border-black/5 pt-[14px] text-[12px] text-brand-slate font-semibold">
                  <span>{{ meeting.duration }}</span>
                  <span>{{ meeting.participantsCount || meeting.participants?.length || 0 }} participants</span>
                </div>
              </div>

              <!-- Render Daily Standup: Engineering Featured Card -->
              <div 
                v-if="engineeringStandup"
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
            <div class="card-glass rounded-[28px] p-[28px] flex flex-col justify-between h-[360px]">
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
            <div class="card-glass rounded-[28px] p-[28px] flex flex-col h-[360px] justify-between text-left">
              <!-- Header -->
              <div class="flex items-center gap-[12px] mb-[24px]">
                <PhSparkle :size="22" weight="bold" class="text-primary" />
                <h3 class="text-[18px] sm:text-[20px] font-bold font-header text-brand-dark">AI Insights</h3>
              </div>

              <div class="flex flex-col gap-4 flex-grow justify-center mb-4">
                <!-- Peak 1 -->
                <div class="p-[16px] rounded-2xl bg-white/40 border border-black/[0.03] flex flex-col gap-[6px] transition-all duration-300 hover:bg-white/60 hover:border-black/5">
                  <div class="text-[8px] font-extrabold tracking-wider uppercase text-primary bg-primary/8 px-[8px] py-[2px] rounded border border-primary/10 self-start">CONCENTRATION PEAK</div>
                  <p class="text-[12px] leading-relaxed text-brand-dark font-medium">
                    Your deep work sessions are most effective between <span class="text-primary font-bold">9:00 AM - 11:30 AM</span>.
                  </p>
                </div>

                <!-- Peak 2 -->
                <div class="p-[16px] rounded-2xl bg-white/40 border border-black/[0.03] flex flex-col gap-[6px] transition-all duration-300 hover:bg-white/60 hover:border-black/5">
                  <div class="text-[8px] font-extrabold tracking-wider uppercase text-secondary bg-secondary/8 px-[8px] py-[2px] rounded border border-secondary/10 self-start">MEETING BURNOUT RISK</div>
                  <p class="text-[12px] leading-relaxed text-brand-dark font-medium">
                    Scheduled back-to-back meetings tomorrow. AI suggests a <span class="text-secondary font-bold">15-minute gap</span> at 2 PM.
                  </p>
                </div>
              </div>

              <!-- Action button -->
              <button class="inline-flex items-center justify-center gap-[8px] px-[24px] py-[12px] rounded-xl font-header font-bold text-[11px] tracking-wider uppercase bg-white/80 text-brand-dark border border-primary/20 hover:bg-white hover:border-primary/40 hover:text-primary transition-all duration-300 w-[100%] cursor-pointer" @click="exploreTrends">
                Explore Trends
              </button>
            </div>
          </div>

          <!-- Bottom grid section: Upcoming schedule & Pending checklist -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-[24px] mb-[32px]">
            <!-- Upcoming Schedule Card -->
            <div class="card-glass rounded-[28px] p-[28px] flex flex-col text-left">
              <h3 class="text-[18px] sm:text-[20px] font-bold font-header text-brand-dark mb-[20px]">Upcoming</h3>
              
              <div class="flex flex-col gap-[12px]">
                <div v-for="item in upcomingMeetings" :key="item.id" class="flex gap-[16px] items-center p-[12px] rounded-2xl bg-white/40 border border-black/[0.03] transition-all duration-300 hover:bg-white/60 hover:border-black/5">
                  <div 
                    class="w-[44px] h-[44px] rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0 select-none"
                    :class="item.featured ? 'bg-grad-primary shadow-[0_2px_8px_rgba(75,104,255,0.15)]' : 'bg-white/70 border border-black/5 text-brand-slate shadow-none'"
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
            <div class="card-glass rounded-[28px] p-[28px] flex flex-col text-left">
              <div class="flex justify-between items-center mb-[20px]">
                <h3 class="text-[18px] sm:text-[20px] font-bold font-header text-brand-dark">Pending Tasks</h3>
                <span class="inline-block text-[9px] font-extrabold px-[8px] py-[2px] rounded-md self-start tracking-wider uppercase border bg-red-500/8 border-red-500/15 text-red-500">
                  {{ tasks.filter(t => t.priority === 'HIGH PRIORITY' && t.status !== 'done').length }} High
                </span>
              </div>

              <!-- Task checklist list -->
              <div class="flex flex-col gap-[12px]">
                <div 
                  v-for="task in tasks.slice(0, 3)" 
                  :key="task.id"
                  class="flex items-center gap-[14px] p-[14px] rounded-2xl bg-white/40 border border-black/[0.03] cursor-pointer transition-all duration-300 hover:bg-white/75 hover:border-black/8 hover:translate-x-[4px] select-none"
                  :class="{ 'bg-white/20 border-black/3 opacity-80': task.status === 'done' }"
                  @click="toggleDashboardTask(task)"
                >
                  <div 
                    class="w-[20px] h-[20px] rounded-md border-2 border-brand-slate/40 flex items-center justify-center transition-all duration-300"
                    :class="task.status === 'done' ? 'border-primary bg-primary text-white' : ''"
                  >
                    <PhCheck v-if="task.status === 'done'" :size="14" weight="bold" class="text-white" />
                  </div>
                  <span 
                    class="text-[12px] font-semibold text-brand-dark transition-all duration-300"
                    :class="{ 'line-through text-brand-slate': task.status === 'done' }"
                  >
                    {{ task.title }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Inner Footer -->
          <footer class="flex justify-between items-center text-[9px] font-bold text-brand-slate tracking-wide uppercase mt-[48px] py-[24px] border-t border-black/5">
            <span>© 2026 SmartMeet AI Inc. All rights reserved.</span>
            <div class="flex gap-[24px]">
              <a href="#" class="hover:text-primary transition-colors" @click.prevent>Terms of Service</a>
              <a href="#" class="hover:text-primary transition-colors" @click.prevent>Security</a>
              <a href="#" class="hover:text-primary transition-colors" @click.prevent>Cookies</a>
            </div>
          </footer>
        </div>

        <!-- Tasks Tab -->
        <div v-else-if="currentTab === 'tasks'">
          <DashboardTasks v-model:tasks="tasks" @navigate="$emit('navigate', $event)" />
        </div>

        <!-- Archive Tab -->
        <div v-else-if="currentTab === 'archive'">
          <ArchiveView :meetings="meetings" v-model:initialSelectedMeeting="selectedArchiveMeeting" />
        </div>

        <!-- Settings Tab -->
        <div v-else-if="currentTab === 'settings'">
          <SettingsView />
        </div>

        <!-- Knowledge AI Tab -->
        <div v-else-if="currentTab === 'knowledge'">
          <KnowledgeAIView />
        </div>

        <!-- New Meeting Tab -->
        <div v-else-if="currentTab === 'new-meeting'">
          <NewMeetingView 
            @meetingCreated="handleMeetingCreated" 
            @goToDashboard="currentTab = 'dashboard'" 
            @joinCall="handleJoinLiveCall"
          />
        </div>

        <!-- Live Call Tab -->
        <div v-else-if="currentTab === 'live-call' && activeLiveMeeting">
          <EmbeddedMeeting :meeting="activeLiveMeeting" @close="currentTab = 'dashboard'; activeLiveMeeting = null" />
        </div>

        <!-- Default Placeholder fallback tab -->
        <div v-else class="card-glass rounded-[28px] p-[64px] text-center mt-[40px]">
          <h3 class="text-[24px] font-bold font-header text-brand-dark mb-[12px] capitalize">{{ currentTab }} View</h3>
          <p class="text-[14px] text-brand-slate max-w-[440px] mx-auto mb-[24px]">This section is coming soon.</p>
          <button class="px-[20px] py-[10px] rounded-xl bg-grad-primary text-white font-header font-bold text-[12px] tracking-wider uppercase cursor-pointer" @click="currentTab = 'dashboard'">Back to Dashboard</button>
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
import DashboardTasks from '../components/DashboardTasks.vue'

// Import newly created frontend layouts
import NewMeetingView from '../components/NewMeetingView.vue'
import ArchiveView from '../components/ArchiveView.vue'
import SettingsView from '../components/SettingsView.vue'
import KnowledgeAIView from '../components/KnowledgeAIView.vue'
import EmbeddedMeeting from '../components/EmbeddedMeeting.vue'

// Import assets
import logoWordmark from '../assets/new logo.png'
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

// Shared Reactive Meetings Database List (pre-populated with mock metrics matching Figma nodes)
const meetings = ref([
  {
    id: 101,
    title: 'Q3 Strategic Product Roadmap & Resource Allocation',
    description: 'A comprehensive review of upcoming feature priorities, team velocity, and technical debt reconciliation strategies for the second half of the year.',
    date: 'Nov 12, 2026',
    time: '09:30 AM',
    duration: '45 minutes',
    type: 'Google Meet',
    bullets: [
      'Confirmed the transition to a micro-frontend architecture by late August to support scaling needs.',
      'Allocated 20% of engineering bandwidth specifically for technical debt and documentation.',
      'Sarah voiced concerns about the current QA pipeline bottlenecks, leading to a dedicated review scheduled for next week.'
    ],
    timeline: [
      { time: '00:00', title: 'Kickoff' },
      { time: '12:30', title: 'Roadmap Review' },
      { time: '24:15', title: 'Resource Conflict' },
      { time: '38:45', title: 'Budget & Close' }
    ],
    tasks: [
      { id: 1, title: 'Update Q3 Feature Spreadsheet', assignee: 'Marcus Chen', priority: 'HIGH', checked: true },
      { id: 2, title: 'Draft technical debt reconciliation plan', assignee: 'Elena Rodriguez', priority: 'MED', checked: false },
      { id: 3, title: 'Schedule follow-up with Infrastructure team', assignee: 'Marcus Chen', priority: 'LOW', checked: false }
    ],
    decisions: [
      { status: 'APPROVED', text: 'Shift to "Core-First" feature release strategy for Q3.' },
      { status: 'PENDING REVIEW', text: 'Proposed migration to AWS SageMaker for AI training.' }
    ],
    transcript: [
      { speaker: 'Marcus Chen', timestamp: '12:04', text: 'We need to be really realistic about the bandwidth here. If we take on the micro-frontend migration now, the feature work stops for at least three weeks.' },
      { speaker: 'Sarah Kim', timestamp: '12:18', text: 'I agree. But the current technical debt is already causing a 10% dip in developer velocity. We are paying the price either way.' },
      { speaker: 'Elena Rodriguez', timestamp: '12:45', text: 'Let’s allocate a specific 20% slice of engineering capacity just for debt. That way we don’t freeze feature work completely.' }
    ]
  },
  {
    id: 102,
    title: 'Q4 Strategy Sync',
    description: 'Discussion focused on scaling GPU clusters and refining the model training pipeline.',
    date: 'Nov 14, 2026',
    time: '01:30 PM',
    duration: '45 minutes',
    type: 'Zoom',
    bullets: [
      'Reviewed scaling targets for GPU instances in AWS cluster.',
      'Refined the checkpoint frequency during LLM fine-tuning.',
      'Approved initial draft of model pipeline architecture diagram.'
    ],
    timeline: [
      { time: '00:00', title: 'Intro & GPUs' },
      { time: '15:00', title: 'Fine-Tuning Checkpoints' },
      { time: '30:00', title: 'Architecture Review' },
      { time: '40:00', title: 'Next Steps' }
    ],
    tasks: [
      { id: 4, title: 'Request quote for additional NVIDIA H100 instances', assignee: 'Alex Chen', priority: 'HIGH', checked: false },
      { id: 5, title: 'Update checkpoint parameters in training script', assignee: 'David Chen', priority: 'MED', checked: true }
    ],
    decisions: [
      { status: 'APPROVED', text: 'Scale GPU cluster sizes by 50% for Q4.' }
    ],
    transcript: [
      { speaker: 'Alex Chen', timestamp: '05:10', text: 'Our LLM fine-tuning runs are hitting VRAM caps. We either optimize batch sizes or get more compute.' },
      { speaker: 'David Chen', timestamp: '08:30', text: 'I can test lower batch sizes, but it will slow down training. Let’s request more H100 instances first.' }
    ]
  },
  {
    id: 103,
    title: 'Design Review: Nexus Pro',
    description: 'Client feedback session regarding user interface style guides and contrast ratios.',
    date: 'Nov 15, 2026',
    time: '10:00 AM',
    duration: '22 minutes',
    type: 'In-Person',
    bullets: [
      'Client loved the glassmorphism approach but requested higher contrast on text variables.',
      'Agreed to increase font weight on active navigation text elements.',
      'Sign-off on default color scheme patterns.'
    ],
    timeline: [
      { time: '00:00', title: 'UI Review' },
      { time: '10:00', title: 'Contrast Discussion' },
      { time: '18:00', title: 'Color Palette Sign-off' }
    ],
    tasks: [
      { id: 6, title: 'Increase text color contrast in CSS file', assignee: 'Alex Chen', priority: 'HIGH', checked: false },
      { id: 7, title: 'Update font weights in navbar component', assignee: 'Alex Chen', priority: 'LOW', checked: true }
    ],
    decisions: [
      { status: 'APPROVED', text: 'Default navbar design styling contrast updates.' }
    ],
    transcript: [
      { speaker: 'Client', timestamp: '02:30', text: 'The glass card outlines look extremely premium. But let’s make sure users can read the text easily.' },
      { speaker: 'Alex Chen', timestamp: '05:40', text: 'Makes sense. I will bump up the text color to a darker slate color for accessibility.' }
    ]
  },
  {
    id: 104,
    title: 'Daily Standup: Engineering',
    description: 'AI action items standup checkin.',
    date: 'Nov 16, 2026',
    time: '09:30 AM',
    duration: '15 minutes',
    type: 'Google Meet',
    bullets: [
      'Standup updates: DB latency patches, API documentation v2, security audit schedules.',
      'Infrastructure teams checked metrics logs.'
    ],
    timeline: [
      { time: '00:00', title: 'Syncup start' },
      { time: '05:00', title: 'DB patch discussions' },
      { time: '10:00', title: 'Security review plan' }
    ],
    tasks: [
      { id: 8, title: 'Patch DB latency issues', assignee: 'Jane Doe', priority: 'HIGH', checked: false },
      { id: 9, title: 'Finalize API documentation for v2', assignee: 'Alex Chen', priority: 'MED', checked: false },
      { id: 10, title: 'Schedule security audit', assignee: 'David Chen', priority: 'HIGH', checked: false }
    ],
    decisions: [
      { status: 'APPROVED', text: 'Roll out DB patch next Tuesday.' }
    ],
    transcript: [
      { speaker: 'Jane Doe', timestamp: '02:10', text: 'The DB latency issues are causing API timeouts. I have a patch ready for testing.' },
      { speaker: 'Alex Chen', timestamp: '04:15', text: 'Excellent, send me the draft so I can finalize API doc reviews.' }
    ]
  }
])

const engineeringStandup = computed(() => meetings.value.find(m => m.title === 'Daily Standup: Engineering'))

const selectedArchiveMeeting = ref(null)
const activeLiveMeeting = ref(null)

const handleJoinLiveCall = (meeting) => {
  activeLiveMeeting.value = meeting
  currentTab.value = 'live-call'
}

const openMeetingDetails = (meeting) => {
  selectedArchiveMeeting.value = meeting
  currentTab.value = 'archive'
}

// Upcoming events list
const upcomingMeetings = ref([
  { id: 1, month: 'NOV', day: '14', title: 'Marketing Sync', time: '1:30 PM', location: 'Zoom', featured: true },
  { id: 2, month: 'NOV', day: '15', title: 'Project Nexus Launch', time: '10:00 AM', location: 'In-Person', featured: false },
  { id: 3, month: 'NOV', day: '15', title: 'One-on-One: Sarah', time: '4:00 PM', location: 'Google Meet', featured: false }
])

// Shared Tasks State (elevated from DashboardTasks for proper synchronization)
const tasks = ref([
  { id: 1, title: 'Generate summary for Q3 Engineering Sync', priority: 'HIGH PRIORITY', status: 'todo', assignee: 'Alex Chen', due: 'Oct 12', description: 'Create a concise AI summary of the Q3 Engineering Sync meeting covering all action items and decisions.', source: 'Daily Standup: Engineering' },
  { id: 2, title: 'Review API documentation for new auth flow', priority: 'MEDIUM PRIORITY', status: 'todo', assignee: 'Alex Chen', due: 'Oct 12', description: 'Review and validate the updated API documentation for the new authentication flow before the team review.', source: 'Daily Standup: Engineering' },
  { id: 3, title: 'Update workspace brand assets', priority: 'LOW PRIORITY', status: 'todo', assignee: 'Alex Chen', due: 'Oct 12', description: 'Refresh all workspace branding assets to align with the new identity guidelines discussed in the Design Review.', source: 'Design Review: Nexus Pro' },
  { id: 4, title: 'Analyze competitor pricing models from transcript data', priority: 'HIGH PRIORITY', status: 'inprogress', assignee: 'Alex Chen', due: 'Oct 12', description: 'Use the SmartMeet AI transcript data from recent Q4 Strategy meetings to extract competitor pricing intelligence.', source: 'Q4 Strategy Sync' },
  { id: 5, title: 'Design system component audit', priority: 'MEDIUM PRIORITY', status: 'inprogress', assignee: 'Alex Chen', due: 'Oct 12', description: 'Audit all existing UI components against the updated design system and flag inconsistencies for the next sprint.', source: 'Design Review: Nexus Pro' },
  { id: 6, title: 'Onboarding flow wireframes', priority: 'MEDIUM PRIORITY', status: 'review', assignee: 'Alex Chen', due: 'Oct 12', description: 'Present wireframes for the new user onboarding flow to the product team for feedback and sign-off.', source: 'Q4 Strategy Sync' },
  { id: 7, title: 'Generate summary for Q3 Engineering Sync', priority: 'COMPLETED', status: 'done', assignee: 'Alex Chen', due: 'Oct 12', description: 'Completed: AI summary generated and distributed to all meeting participants.', source: 'Daily Standup: Engineering' }
])

const toggleDashboardTask = (task) => {
  task.status = task.status === 'done' ? 'todo' : 'done'
  if (task.status === 'done') {
    task.oldPriority = task.priority
    task.priority = 'COMPLETED'
  } else {
    task.priority = task.oldPriority || 'MEDIUM PRIORITY'
  }
}

// User Action simulation prompts
const createNewMeeting = () => {
  selectedArchiveMeeting.value = null // reset selection when creating new
  currentTab.value = 'new-meeting'
}

const handleMeetingCreated = (meeting) => {
  meetings.value.unshift(meeting)
}

const exploreTrends = () => {
  alert('Simulating direct link to full-scale team productivity trends & metrics reports page.')
}

const viewAllMeetings = () => {
  selectedArchiveMeeting.value = null // reset selection to show index list
  currentTab.value = 'archive'
}
</script>
