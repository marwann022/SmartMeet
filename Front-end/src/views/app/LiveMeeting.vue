<template>
  <div class="flex flex-col h-[calc(100vh-140px)] gap-6 text-brand-dark animate-fade-in mt-8">
    <!-- Header Row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          @click="confirmEnd"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 font-header font-bold text-xs tracking-wider uppercase text-red-600 hover:bg-red-500/20 transition-all duration-300 cursor-pointer"
        >
          <span class="relative flex h-2 w-2">
            <span v-if="isRecording" class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2" :class="isRecording ? 'bg-red-500' : 'bg-brand-slate'"></span>
          </span>
          <span>End Meeting</span>
        </button>
        <div class="h-6 w-[1px] bg-black/10"></div>
        <div class="flex flex-col items-start text-left">
          <span class="text-[10px] text-brand-slate font-extrabold uppercase tracking-wider">In-App Live Room</span>
          <h2 class="text-xl font-bold font-header text-brand-dark leading-tight">{{ meeting?.title }}</h2>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div v-if="isRecording" class="bg-red-500/8 border border-red-500/15 px-4 py-1.5 rounded-full flex items-center gap-2">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span class="text-[11px] font-bold text-red-500 uppercase tracking-wider">Recording {{ recordingDuration }}</span>
        </div>
        <div class="bg-primary/8 border border-primary/15 px-4 py-1.5 rounded-full flex items-center gap-2">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
          <span class="text-[11px] font-bold text-primary uppercase tracking-wider">Encrypted WebRTC Sync</span>
        </div>
      </div>
    </div>

    <!-- Processing Banner -->
    <div v-if="isProcessing" class="bg-primary/8 border border-primary/15 rounded-2xl p-4 flex items-center gap-3">
      <svg class="w-5 h-5 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      <span class="text-sm font-bold text-primary">AI is processing your meeting — transcribing, extracting decisions, and generating summary...</span>
    </div>

    <!-- Active Call Main Area -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6 h-full min-h-0">
      <!-- Video Container Frame -->
      <div class="bg-[#111214] rounded-[32px] border border-black/10 overflow-hidden flex flex-col justify-between shadow-2xl relative">
        <div id="meet-iframe-container" class="flex-1 w-full h-full bg-[#18191b]">
        </div>
      </div>

      <!-- SmartMeet AI Companion Panel -->
      <div class="card-glass rounded-[32px] p-6 flex flex-col justify-between h-full min-h-0 text-left shadow-glass relative overflow-hidden">
        <div class="flex flex-col gap-5 h-[90%] min-h-0">
          <div class="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/5">
            <div class="flex items-center gap-2.5">
              <PhSparkle :size="20" class="text-primary animate-pulse" />
              <div class="flex flex-col">
                <h3 class="font-header font-bold text-base text-brand-dark leading-none">SmartMeet AI Companion</h3>
                <span class="text-[9px] text-brand-slate font-extrabold uppercase mt-1 tracking-wider">AI Live Syncing</span>
              </div>
            </div>
            <!-- Language Selector Toggle -->
            <div class="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl text-[10px]">
              <button
                @click="setLanguage('en-US')"
                class="px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer select-none"
                :class="selectedLanguage === 'en-US' ? 'bg-primary text-white shadow-md' : 'text-brand-slate hover:text-brand-dark dark:hover:text-white'"
              >
                EN
              </button>
              <button
                @click="setLanguage('ar-EG')"
                class="px-2.5 py-0.5 rounded-lg font-bold transition-all cursor-pointer select-none"
                :class="selectedLanguage === 'ar-EG' ? 'bg-primary text-white shadow-md' : 'text-brand-slate hover:text-brand-dark dark:hover:text-white'"
              >
                AR
              </button>
            </div>
          </div>

          <!-- Transcript Stream Box -->
          <div class="flex-1 flex flex-col gap-3 min-h-0">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-extrabold text-brand-slate uppercase tracking-wide">AI Meeting Assistant Feed</span>
            </div>

            <div ref="transcriptContainer" class="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 scroll-container bg-black/[0.01] dark:bg-white/[0.01] rounded-2xl p-3 border border-black/[0.02] dark:border-white/[0.03]">
              <div
                v-for="(line, index) in activeTranscript"
                :key="index"
                class="flex flex-col gap-1 border-l-2 pl-3 py-0.5 animate-slide-up"
                :class="line.speaker === 'Marcus Wright' ? 'border-primary' : line.speaker === 'Sarah Jenkins' ? 'border-secondary' : 'border-accent'"
              >
                <div class="flex justify-between items-baseline">
                  <span class="text-[11px] font-extrabold" :class="line.speaker === 'Marcus Wright' ? 'text-primary' : line.speaker === 'Sarah Jenkins' ? 'text-secondary' : 'text-accent'">
                    {{ line.speaker }}
                  </span>
                  <span class="text-[9px] text-brand-slate font-medium">{{ line.time }}</span>
                </div>
                <p class="text-[12px] text-brand-dark leading-relaxed font-body font-medium">
                  {{ line.text }}
                </p>
              </div>

              <!-- Interim (real-time) spoken text -->
              <div v-if="interimText" class="flex flex-col gap-1 border-l-2 pl-3 py-0.5 border-brand-slate/40 opacity-70 animate-pulse">
                <div class="flex justify-between items-baseline">
                  <span class="text-[11px] font-extrabold text-brand-slate">
                    You (Live - speaking...)
                  </span>
                </div>
                <p class="text-[12px] text-brand-slate leading-relaxed font-body font-medium italic">
                  {{ interimText }}
                </p>
              </div>

              <div v-if="isRecording && !interimText" class="flex items-center gap-2 text-xs text-primary font-bold animate-pulse p-2">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>Listening — speak clearly for AI to capture your transcript...</span>
              </div>

              <div v-if="activeTranscript.length === 0" class="text-xs text-brand-slate/40 italic py-12 text-center flex flex-col items-center gap-2 justify-center h-full">
                <PhMicrophone :size="24" class="text-brand-slate/30" />
                <span>Start speaking and your transcript will appear here live.</span>
              </div>
            </div>
          </div>

          <!-- Actions Box -->
          <div class="h-[35%] min-h-[140px] flex flex-col gap-2.5 border-t border-black/5 dark:border-white/5 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-extrabold text-brand-slate uppercase tracking-wide">Real-time Tasks Extracted</span>
              <span class="bg-primary/10 border border-primary/20 text-primary font-bold text-[9px] px-2 py-0.5 rounded-full">{{ extractedTasks.length }} detected</span>
            </div>

            <div class="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scroll-container">
              <div
                v-for="task in extractedTasks"
                :key="task.id"
                class="bg-gradient-to-br from-white/90 to-white/50 dark:from-slate-900/60 dark:to-slate-800/40 border border-black/5 dark:border-white/5 p-3 rounded-xl flex items-start justify-between gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-slide-in-right"
              >
                <div class="flex flex-col gap-1">
                  <span class="text-[12px] font-bold text-brand-dark leading-snug">{{ task.title }}</span>
                  <div class="flex items-center gap-2 mt-0.5 text-[9px] text-brand-slate font-medium">
                    <span>Assignee: {{ task.assignee }}</span>
                    <span>•</span>
                    <span class="font-bold text-primary">{{ task.priority }}</span>
                  </div>
                </div>
                <div class="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 flex items-center justify-center">
                  <PhCheck :size="10" weight="bold" />
                </div>
              </div>
              <div v-if="extractedTasks.length === 0" class="text-[11px] text-brand-slate/40 italic py-6 text-center flex items-center justify-center h-full">
                Tasks will be extracted by AI after processing.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMeetingStore } from '@/stores/meeting'
import { useAuthStore } from '@/stores/auth'
import {
  PhSparkle,
  PhMicrophone,
  PhCheck
} from '@phosphor-icons/vue'

const router = useRouter()
const route = useRoute()
const meetingStore = useMeetingStore()
const authStore = useAuthStore()

const meeting = computed(() => meetingStore.activeLiveMeeting)

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

let jitsiApi = null
let recognition = null
const isRecording = ref(true)
const isProcessing = ref(false)
const activeTranscript = ref([])
const extractedTasks = ref([])
const transcriptContainer = ref(null)
const recordingDuration = ref('00:00')
const selectedLanguage = ref('en-US')

let recordingTimer = null
let recordingSeconds = 0
let restartTimeout = null
let consecutiveErrors = 0

const interimText = ref('')
const processedResultIndices = new Set()
let inactivityTimer = null

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimer)
  if (isRecording.value) {
    inactivityTimer = setTimeout(() => {
      console.log('No speech recognition activity for 25 seconds. Forcing restart to prevent zombie state...')
      if (recognition) {
        try {
          recognition.stop()
        } catch (err) {
          console.error('Failed to stop recognition on inactivity timeout:', err)
        }
      }
    }, 25000)
  }
}

// Demo simulation speakers — lines from these are filtered out before sending to backend
const DEMO_SPEAKERS = new Set(['Marcus Wright', 'Sarah Jenkins', 'Alex Chen'])

const setLanguage = (lang) => {
  if (selectedLanguage.value === lang) return
  selectedLanguage.value = lang
  if (recognition) {
    recognition.onend = null // disable auto-restart listener during transition
    recognition.stop()
    setTimeout(() => {
      startSpeechRecognition()
    }, 300)
  }
}

const startSpeechRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    console.warn('Speech recognition not supported in this browser.')
    return
  }

  // Properly abort and clean up previous instance
  if (recognition) {
    try {
      recognition.onstart = null
      recognition.onerror = null
      recognition.onend = null
      recognition.onresult = null
      recognition.abort()
    } catch (err) {
      console.warn('Failed to clean up previous speech recognition instance:', err)
    }
  }

  processedResultIndices.clear()
  interimText.value = ''
  resetInactivityTimer()

  recognition = new SpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = selectedLanguage.value

  recognition.onresult = async (event) => {
    resetInactivityTimer()
    let interim = ''

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i]
      const text = result[0].transcript.trim()

      if (result.isFinal) {
        if (text) {
          if (!processedResultIndices.has(i)) {
            processedResultIndices.add(i)

            activeTranscript.value.push({
              speaker: 'You (Live)',
              text: text,
              time: formatTime(recordingSeconds)
            })

            nextTick(() => {
              if (transcriptContainer.value) {
                transcriptContainer.value.scrollTop = transcriptContainer.value.scrollHeight
              }
            })

            // Query AI to extract task from text snippet
            try {
              const res = await meetingStore.extractLiveTask(text)
              if (res.success && res.tasks.length > 0) {
                res.tasks.forEach(t => {
                  extractedTasks.value.unshift({
                    id: Date.now() + Math.random(),
                    title: t.title,
                    assignee: t.assignee || 'You',
                    priority: t.priority || 'MED'
                  })
                })
              }
            } catch (err) {
              console.error('Failed to extract live tasks:', err)
            }
          }
        }
      } else {
        interim += result[0].transcript
      }
    }

    interimText.value = interim.trim()
  }

  recognition.onstart = () => {
    consecutiveErrors = 0
    resetInactivityTimer()
  }

  recognition.onerror = (e) => {
    console.error('Speech recognition error:', e.error)
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
      console.warn('Microphone permission blocked or service unavailable. Will retry automatically shortly...')
    }
    // Do not count silence timeouts (no-speech) or manual/automatic aborts as consecutive errors
    if (e.error !== 'no-speech' && e.error !== 'aborted') {
      consecutiveErrors++
    }
  }

  recognition.onend = () => {
    clearTimeout(inactivityTimer)
    interimText.value = ''
    if (isRecording.value) {
      // Re-create the recognition instance rather than calling start() on the same instance
      // to bypass Chrome internal/server state lockouts (very common in Arabic/non-English)
      const delay = consecutiveErrors > 3 ? 5000 : 100
      console.log(`Speech recognition ended. Recreating and restarting in ${delay}ms... (consecutive errors: ${consecutiveErrors})`)
      
      clearTimeout(restartTimeout)
      restartTimeout = setTimeout(() => {
        if (isRecording.value) {
          startSpeechRecognition()
        }
      }, delay)
    }
  }

  try {
    recognition.start()
  } catch (err) {
    console.error('Failed to start speech recognition:', err)
  }
}

const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

const startRecording = () => {
  // Raw mic audio is disabled to prevent conflicts between Jitsi, MediaRecorder, and SpeechRecognition.
  // Only the timer runs to track duration displayed in the header.
  recordingSeconds = 0
  recordingTimer = setInterval(() => {
    recordingSeconds++
    recordingDuration.value = formatTime(recordingSeconds)
  }, 1000)
  isRecording.value = true
}

const confirmEnd = async () => {
  if (isProcessing.value) return

  isRecording.value = false
  isProcessing.value = true

  const meetingId = meeting.value?._id || meeting.value?.id
  if (!meetingId) {
    router.push('/dashboard')
    return
  }

  clearInterval(recordingTimer)

  // Build transcript from live speech lines only — filter out demo simulation speakers
  const currentUserName = authStore.user?.name || 'Marwan Elgammal'
  const liveTranscriptText = activeTranscript.value
    .filter(line => !DEMO_SPEAKERS.has(line.speaker)) // exclude demo simulation entries
    .map(line => {
      const speaker = line.speaker === 'You (Live)' ? currentUserName : line.speaker
      return `[${line.time}] ${speaker}: ${line.text}`
    })
    .join('\n')

  try {
    // Process meeting using the high-accuracy browser live transcript
    await meetingStore.processMeeting(meetingId, liveTranscriptText)
    // Fetch updated details and patch into meetings list
    const details = await meetingStore.fetchMeetingDetails(meetingId)
    if (details) {
      const idx = meetingStore.meetings.findIndex(m => m.id === meetingId || m._id === meetingId)
      if (idx !== -1) {
        meetingStore.meetings[idx] = { ...meetingStore.meetings[idx], ...details }
      }
    }
    // Also refresh meetings list to get the updated status
    await meetingStore.fetchMeetings()
  } catch (err) {
    console.error('Processing failed:', err)
  }

  meetingStore.activeLiveMeeting = null
  isProcessing.value = false
  router.push('/dashboard')
}

// ─── Demo simulation (only when ?demo=true in URL) ───────────────────────────
const dialogSteps = [
  { seconds: 3,  speaker: 'Marcus Wright', text: 'Hey Alex! Glad you could join the in-app room. Let\'s sync on the roadmap deliverables.', activeFor: 4 },
  { seconds: 9,  speaker: 'Sarah Jenkins', text: 'Perfect. Alex, can you compile the backend API contracts spreadsheet so we can unblock the frontend developers by tomorrow?', activeFor: 6, triggerTask: { id: Date.now() + 101, title: 'Compile Auth API contracts spreadsheet', assignee: 'Alex Chen', priority: 'HIGH PRIORITY' } },
  { seconds: 17, speaker: 'Alex Chen',     text: 'Yes, absolutely. I will coordinate with Marcus and compile the API sheet first thing tomorrow.', activeFor: 5 },
  { seconds: 24, speaker: 'Marcus Wright', text: 'Great. I will handle setting up the container resources in AWS as soon as you have that document ready.', activeFor: 5, triggerTask: { id: Date.now() + 102, title: 'Setup test container resources in AWS', assignee: 'Marcus Wright', priority: 'MEDIUM PRIORITY' } }
]

let simulationTimer = null
let currentSecond = 0

const startSimulation = () => {
  simulationTimer = setInterval(() => {
    if (!isRecording.value && !isProcessing.value) return
    currentSecond++

    const step = dialogSteps.find(s => s.seconds === currentSecond)
    if (step) {
      activeTranscript.value.push({
        speaker: step.speaker,
        text: step.text,
        time: formatTime(currentSecond)
      })

      if (step.triggerTask) {
        extractedTasks.value.unshift(step.triggerTask)
      }

      nextTick(() => {
        if (transcriptContainer.value) {
          transcriptContainer.value.scrollTop = transcriptContainer.value.scrollHeight
        }
      })
    }
  }, 1000)
}

onMounted(() => {
  if (!meeting.value) {
    router.push('/dashboard')
    return
  }

  if (window.JitsiMeetExternalAPI) {
    const domain = 'meet.jit.si'
    let roomName = 'SmartMeet_' + meeting.value.id
    if (meeting.value.meetLink) {
      const parts = meeting.value.meetLink.split('/')
      const code = parts[parts.length - 1]
      if (code) roomName = 'SmartMeet_' + code.replace(/-/g, '_')
    }

    const options = {
      roomName: roomName,
      parentNode: document.querySelector('#meet-iframe-container'),
      width: '100%',
      height: '100%',
      userInfo: { displayName: authStore.user?.name || 'User' },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinConfig: { enabled: false }
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        DEFAULT_BACKGROUND: '#18191b'
      }
    }

    jitsiApi = new window.JitsiMeetExternalAPI(domain, options)
    jitsiApi.addEventListener('videoConferenceLeft', () => {
      confirmEnd()
    })
  } else {
    document.querySelector('#meet-iframe-container').innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-white/50 p-6 text-center gap-3">
        <svg class="w-12 h-12 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="font-header font-bold text-sm">Initializing Embedded Call Server...</span>
        <span class="text-xs max-w-sm">Loading secure WebRTC signaling connection.</span>
      </div>`
  }

  startRecording()
  if (route.query.demo === 'true') {
    startSimulation()
  }
  // Stagger mic access to avoid OS/browser hardware conflicts with Jitsi
  setTimeout(() => {
    startSpeechRecognition()
  }, 1000)
})

onUnmounted(() => {
  try {
    if (jitsiApi) jitsiApi.dispose()
  } catch (err) {
    console.error('Error disposing Jitsi:', err)
  }

  try {
    clearInterval(simulationTimer)
    clearInterval(recordingTimer)
    clearTimeout(restartTimeout)
    clearTimeout(inactivityTimer)
  } catch (err) {
    console.error('Error clearing timers:', err)
  }

  try {
    if (recognition) {
      recognition.onend = null
      recognition.stop()
    }
  } catch (err) {
    console.error('Error stopping recognition:', err)
  }
})
</script>

<style scoped>
.scroll-container::-webkit-scrollbar { width: 4px; }
.scroll-container::-webkit-scrollbar-track { background: transparent; }
.scroll-container::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.08); border-radius: 99px; }
.scroll-container::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.15); }
.animate-fade-in { animation: fadeIn 0.35s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-slide-in-right { animation: slideInRight 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
@keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
</style>
