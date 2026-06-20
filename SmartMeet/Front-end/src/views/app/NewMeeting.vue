<template>
  <div class="flex flex-col gap-8 text-left mt-8">
    <!-- Breadcrumb / Header -->
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase">
        <PhSparkle :size="16" weight="bold" />
        <span>Intelligent Scheduling</span>
      </div>
      <h2 class="text-3xl sm:text-4xl font-bold font-header text-brand-dark tracking-tight">Schedule New Meeting</h2>
      <p class="text-sm text-brand-slate max-w-2xl">
        Initialize your next session with AI-enhanced context preparation, automated documentation, and stakeholder alignment.
      </p>
    </div>

    <!-- Main Scheduler Form -->
    <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
      
      <!-- Left Column: Details & Intelligence Settings -->
      <div class="flex flex-col gap-8">
        
        <!-- Meeting details card -->
        <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 relative z-20">
          <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
            <PhInfo :size="20" class="text-primary" />
            <h3 class="font-header font-bold text-xl text-brand-dark">Meeting Details</h3>
          </div>

          <div class="flex flex-col gap-5">
            <!-- Title -->
            <div class="flex flex-col gap-2">
              <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Meeting Title</label>
              <input 
                v-model="form.title" 
                type="text" 
                placeholder="e.g. Q4 Product Roadmap Alignment" 
                class="w-full px-4 py-3.5 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark placeholder-brand-slate/40 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300"
                :class="{ 'border-red-400': errors.title }"
              />
              <span v-if="errors.title" class="text-[11px] text-red-500 font-semibold ml-1">{{ errors.title }}</span>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-2">
              <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Description</label>
              <textarea 
                v-model="form.description" 
                placeholder="What is the primary objective of this session?" 
                rows="4"
                class="w-full px-4 py-3.5 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark placeholder-brand-slate/40 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300 resize-none"
              ></textarea>
            </div>

            <!-- Meeting Type Select (Personal Discussion, Brainstorm) -->
            <div class="flex flex-col gap-2">
              <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Meeting Type</label>
              <div class="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  @click="form.type = 'Personal Discussion'" 
                  class="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer"
                  :class="form.type === 'Personal Discussion' ? 'bg-primary/8 border-primary text-primary font-bold shadow-sm' : 'bg-white border-black/8 text-brand-slate hover:bg-black/5'"
                >
                  <PhUser :size="24" class="text-primary" weight="bold" />
                  <span class="text-xs">Personal Discussion</span>
                </button>
                <button 
                  type="button"
                  @click="form.type = 'Brainstorm'" 
                  class="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer"
                  :class="form.type === 'Brainstorm' ? 'bg-primary/8 border-primary text-primary font-bold shadow-sm' : 'bg-white border-black/8 text-brand-slate hover:bg-black/5'"
                >
                  <PhBrain :size="24" class="text-primary" weight="bold" />
                  <span class="text-xs">Brainstorm</span>
                </button>
              </div>
            </div>

            <!-- Date, Time & Duration row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Date & Time Pickers side-by-side -->
              <div class="flex flex-col gap-1.5">
                <div class="grid grid-cols-2 gap-3">
                  <!-- Date Picker -->
                  <DatePicker 
                    v-model="form.date" 
                    label="Date"
                    :has-error="!!errors.datetime"
                  />
                  
                  <!-- Time Picker -->
                  <TimePicker 
                    v-model="form.time" 
                    label="Time"
                    :has-error="!!errors.datetime"
                    :is-today="isTodaySelected"
                  />
                </div>
                <span v-if="errors.datetime" class="text-[11px] text-red-500 font-semibold ml-1">{{ errors.datetime }}</span>
              </div>

              <!-- Duration -->
              <div class="flex flex-col gap-2">
                <Select 
                  v-model="form.duration" 
                  :options="durationOptions"
                  label="Duration"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Intelligence settings card -->
        <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
          <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
            <PhBrain :size="20" class="text-primary" />
            <h3 class="font-header font-bold text-xl text-brand-dark">Intelligence Settings</h3>
          </div>

          <div class="flex flex-col gap-5">
            <!-- AI Summary Style -->
            <div class="flex flex-col gap-2">
              <Select 
                v-model="form.summaryStyle" 
                :options="summaryStyleOptions"
                label="AI Summary Style"
              />
            </div>

            <!-- Custom Switches -->
            <div class="flex flex-col gap-4 pt-2">
              <!-- Switch 1: Record Meeting -->
              <div class="flex items-center justify-between p-3 bg-white/40 border border-black/[0.03] rounded-2xl">
                <div class="flex flex-col text-left">
                  <span class="text-sm font-bold text-brand-dark leading-tight">Record Meeting Video</span>
                  <span class="text-[11px] text-brand-slate mt-0.5">Store cloud recording securely for 30 days</span>
                </div>
                <button 
                  type="button"
                  @click="form.record = !form.record"
                  class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5"
                  :class="form.record ? 'bg-primary' : 'bg-brand-slate/30'"
                >
                  <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: form.record ? 'translateX(22px)' : 'translateX(3px)' }"></span>
                </button>
              </div>

              <!-- Switch 2: Real-time Transcription -->
              <div class="flex items-center justify-between p-3 bg-white/40 border border-black/[0.03] rounded-2xl">
                <div class="flex flex-col text-left">
                  <span class="text-sm font-bold text-brand-dark leading-tight">Real-time Transcription</span>
                  <span class="text-[11px] text-brand-slate mt-0.5">Live captions and speaker logging for attendees</span>
                </div>
                <button 
                  type="button"
                  @click="form.transcribe = !form.transcribe"
                  class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5"
                  :class="form.transcribe ? 'bg-primary' : 'bg-brand-slate/30'"
                >
                  <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: form.transcribe ? 'translateX(22px)' : 'translateX(3px)' }"></span>
                </button>
              </div>

              <!-- Switch 3: Auto-extract Tasks -->
              <div class="flex items-center justify-between p-3 bg-white/40 border border-black/[0.03] rounded-2xl">
                <div class="flex flex-col text-left">
                  <span class="text-sm font-bold text-brand-dark leading-tight">Auto-extract Tasks</span>
                  <span class="text-[11px] text-brand-slate mt-0.5">Automatically identify action items and sync with Tasks tab</span>
                </div>
                <button 
                  type="button"
                  @click="form.extractTasks = !form.extractTasks"
                  class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5"
                  :class="form.extractTasks ? 'bg-primary' : 'bg-brand-slate/30'"
                >
                  <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: form.extractTasks ? 'translateX(22px)' : 'translateX(3px)' }"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Participants & Sync Settings -->
      <div class="flex flex-col gap-8">
        
        <!-- Participants Card -->
        <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
          <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
            <PhUsersThree :size="20" class="text-primary" />
            <h3 class="font-header font-bold text-xl text-brand-dark">Participants</h3>
          </div>

          <div class="flex flex-col gap-4">
            <!-- Add participant input -->
            <div class="flex flex-col gap-2">
              <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Add Stakeholder</label>
              <div class="flex gap-2">
                <input 
                  v-model="participantInput" 
                  @keydown.enter.prevent="addParticipant"
                  type="text" 
                  placeholder="Enter name or email..." 
                  class="flex-1 px-4 py-2.5 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark placeholder-brand-slate/40 focus:outline-none focus:border-primary/30 transition-all duration-300"
                />
                <button 
                  type="button"
                  @click="addParticipant"
                  class="w-10 h-10 rounded-xl bg-primary hover:bg-[#3b52e3] text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <PhPlus :size="16" weight="bold" />
                </button>
              </div>
            </div>

            <!-- Added participants list tags -->
            <div class="flex flex-wrap gap-2 mt-2">
              <div 
                v-for="(p, index) in form.participants" 
                :key="index"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs text-primary font-bold transition-all duration-300 hover:bg-primary/12"
              >
                <span>{{ p }}</span>
                <button 
                  type="button"
                  @click="removeParticipant(index)" 
                  class="w-[18px] h-[18px] rounded-full hover:bg-primary/20 flex items-center justify-center text-primary/80 hover:text-primary transition-colors cursor-pointer"
                >
                  <PhX :size="10" weight="bold" />
                </button>
              </div>
              <div v-if="form.participants.length === 0" class="text-xs text-brand-slate italic p-1">
                No participants added yet.
              </div>
            </div>
          </div>
        </div>

        <!-- Integrations Card -->
        <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
          <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
            <PhArrowsMerge :size="20" class="text-primary" />
            <h3 class="font-header font-bold text-xl text-brand-dark">Integrations</h3>
          </div>

          <div class="flex flex-col gap-4">
            <!-- Sync Slack -->
            <div class="flex items-center justify-between p-3.5 bg-white/40 border border-black/[0.03] rounded-2xl">
              <div class="flex items-center gap-3 w-[70%]">
                <img :src="slackIcon" alt="Slack" class="w-8 h-8 object-contain flex-shrink-0" />
                <div class="flex flex-col text-left">
                  <span class="text-xs font-bold text-brand-dark leading-snug">Post Summary to Slack</span>
                  <span class="text-[9px] text-brand-slate leading-normal">Send post-meeting details to channel</span>
                </div>
              </div>
              <button 
                type="button"
                @click="form.syncSlack = !form.syncSlack"
                class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5"
                :class="form.syncSlack ? 'bg-[#4a154b]' : 'bg-brand-slate/30'"
              >
                <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: form.syncSlack ? 'translateX(22px)' : 'translateX(3px)' }"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Submit actions -->
        <div class="flex flex-col gap-3">
          <button 
            type="button"
            @click="submitMeeting" 
            :disabled="isSubmitting"
            class="w-full py-4 rounded-2xl bg-grad-primary text-white font-header font-bold text-xs tracking-wider uppercase shadow-[0_6px_20px_rgba(75,104,255,0.25)] hover:shadow-[0_8px_25px_rgba(75,104,255,0.35)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isSubmitting" class="animate-spinner h-4 w-4 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <PhSparkle v-else :size="16" weight="bold" />
            <span>{{ isSubmitting ? 'Creating Meeting...' : 'Create Intelligence-Enabled Meeting' }}</span>
          </button>
          <button 
            type="button"
            @click="goToDashboard" 
            class="w-full py-3.5 rounded-xl bg-white border border-black/8 font-header font-bold text-xs tracking-wider uppercase text-brand-dark hover:bg-black/5 transition-all duration-300 cursor-pointer"
          >
            Cancel and Discard
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMeetingStore } from '@/stores/meeting'
import { 
  PhSparkle, 
  PhInfo, 
  PhBrain, 
  PhUsersThree, 
  PhArrowsMerge, 
  PhPlus, 
  PhCheck, 
  PhX, 
  PhCalendar, 
  PhClock, 
  PhVideoCamera, 
  PhUser 
} from '@phosphor-icons/vue'
import Select from '@/components/ui/Select.vue'
import DatePicker from '@/components/ui/DatePicker.vue'
import TimePicker from '@/components/ui/TimePicker.vue'

const durationOptions = [
  { value: '15 minutes', label: '15 minutes (Quick Catch-up)' },
  { value: '30 minutes', label: '30 minutes (Standard)' },
  { value: '45 minutes', label: '45 minutes (Strategic Sync)' },
  { value: '60 minutes', label: '60 minutes (Deep Dive)' }
]

const summaryStyleOptions = [
  { value: 'Action-Oriented', label: 'Action-Oriented (Tasks & Decisions Focused)' },
  { value: 'Executive Brief', label: 'Executive Brief (High-level Summary)' },
  { value: 'Chronological Recurrent', label: 'Chronological Recurrent (Verbatim timeline transcript summary)' }
]

// Import assets
import slackIcon from '@/assets/slack.png'

const router = useRouter()
const meetingStore = useMeetingStore()

// Date & Time picker utility functions
const getTodayDateString = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const getDefaultTimeString = () => {
  const now = new Date()
  now.setHours(now.getHours() + 1)
  const hh = String(now.getHours()).padStart(2, '0')
  return `${hh}:00`
}

// Form reactive state
const form = reactive({
  title: '',
  description: '',
  type: 'Personal Discussion', // Default selection
  date: getTodayDateString(),
  time: getDefaultTimeString(),
  datetime: '',
  duration: '30 minutes',
  summaryStyle: 'Action-Oriented',
  record: true,
  transcribe: true,
  extractTasks: true,
  participants: ['Sarah Jenkins (s.jenkins@smartmeet.ai)', 'Marcus Wright (m.wright@smartmeet.ai)'],
  syncSlack: false
})

const isTodaySelected = computed(() => {
  return form.date === getTodayDateString()
})

const participantInput = ref('')
const errors = reactive({
  title: '',
  datetime: ''
})

const successState = ref(false)
const createdMeeting = ref(null)

const isSubmitting = ref(false)
const accessToken = ref(sessionStorage.getItem('smartmeet_google_access_token') || '')

const getGoogleAccessToken = (callback, errorCallback) => {
  if (accessToken.value) {
    callback(accessToken.value)
    return
  }

  if (!window.google) {
    alert('Google Identity services are still loading. Scheduling with Jitsi embedded call instead.')
    errorCallback('not_loaded')
    return
  }

  const clientId = localStorage.getItem('smartmeet_google_client_id')
  if (!clientId) {
    alert('Google Client ID is not configured! Scheduling with Jitsi embedded call instead.')
    errorCallback('no_client_id')
    return
  }

  try {
    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.events',
      callback: (tokenResponse) => {
        if (tokenResponse.access_token) {
          sessionStorage.setItem('smartmeet_google_access_token', tokenResponse.access_token)
          accessToken.value = tokenResponse.access_token
          callback(tokenResponse.access_token)
        } else {
          errorCallback('no_token')
        }
      },
      error_callback: (err) => {
        console.error(err)
        alert('Failed to authorize Google Calendar access. Scheduling with Jitsi embedded call instead.')
        errorCallback(err)
      }
    })
    tokenClient.requestAccessToken({ prompt: '' })
  } catch (err) {
    console.error(err)
    alert('Failed to initialize Google Auth. Scheduling with Jitsi embedded call instead.')
    errorCallback(err)
  }
}

// Actions
const addParticipant = () => {
  const input = participantInput.value.trim()
  if (input) {
    // Basic duplicates avoidance
    if (!form.participants.includes(input)) {
      form.participants.push(input)
    }
    participantInput.value = ''
  }
}

const removeParticipant = (index) => {
  form.participants.splice(index, 1)
}

const validateForm = () => {
  let isValid = true
  errors.title = ''
  errors.datetime = ''

  if (!form.title.trim()) {
    errors.title = 'Meeting title is required.'
    isValid = false
  }

  // Combine date and time to datetime format YYYY-MM-DDTHH:MM
  if (form.date && form.time) {
    form.datetime = `${form.date}T${form.time}`
  } else {
    form.datetime = ''
  }

  if (!form.datetime) {
    errors.datetime = 'Please choose a date & time.'
    isValid = false
  }

  return isValid
}

const goToDashboard = () => {
  router.push('/dashboard')
}

const joinLiveCall = (meeting) => {
  meetingStore.activeLiveMeeting = meeting
  router.push('/live-meeting')
}

const submitMeeting = () => {
  if (!validateForm()) return
  isSubmitting.value = true

  const dateObj = new Date(form.datetime)
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  const meetingId = Date.now()
  const newMeeting = {
    title: form.title,
    description: form.description,
    type: form.type,
    datetime: form.datetime,
    date: formattedDate,
    time: formattedTime,
    duration: form.duration,
    participantsCount: form.participants.length,
    meetLink: `https://meet.jit.si/SmartMeet_${meetingId}`,
    participants: [...form.participants],
    bullets: [],
    timeline: [],
    tasks: [],
    decisions: [],
    transcript: []
  }

  meetingStore.createMeeting(newMeeting)
  
  // Set the active live meeting with the created details
  const created = {
    ...newMeeting,
    id: meetingStore.meetings[0].id
  }
  meetingStore.activeLiveMeeting = created

  isSubmitting.value = false
  
  // Redirect directly to the live meeting page
  router.push('/live-meeting')
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.type = 'Personal Discussion'
  form.date = getTodayDateString()
  form.time = getDefaultTimeString()
  form.datetime = ''
  form.duration = '30 minutes'
  form.summaryStyle = 'Action-Oriented'
  form.record = true
  form.transcribe = true
  form.extractTasks = true
  form.participants = ['Sarah Jenkins (s.jenkins@smartmeet.ai)', 'Marcus Wright (m.wright@smartmeet.ai)']
  form.syncSlack = false
  
  successState.value = false
  createdMeeting.value = null
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
