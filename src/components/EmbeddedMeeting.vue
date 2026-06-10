<template>
  <div class="flex flex-col h-[calc(100vh-140px)] gap-6 text-brand-dark animate-fade-in">
    <!-- Header Row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button 
          @click="$emit('close')" 
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/8 font-header font-bold text-xs tracking-wider uppercase text-brand-dark hover:bg-black/5 hover:text-primary transition-all duration-300 cursor-pointer"
        >
          <PhArrowLeft :size="14" weight="bold" />
          <span>Leave Call & Dashboard</span>
        </button>
        <div class="h-6 w-[1px] bg-black/10"></div>
        <div class="flex flex-col items-start">
          <span class="text-[10px] text-brand-slate font-extrabold uppercase tracking-wider">In-App Live Room</span>
          <h2 class="text-xl font-bold font-header text-brand-dark leading-tight">{{ meeting?.title }}</h2>
        </div>
      </div>

      <div class="bg-primary/8 border border-primary/15 px-4 py-1.5 rounded-full flex items-center gap-2">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
        </span>
        <span class="text-[11px] font-bold text-primary uppercase tracking-wider">Encrypted WebRTC Sync</span>
      </div>
    </div>

    <!-- Active Call Main Area -->
    <div class="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-6 h-full min-h-0">
      
      <!-- Video Container Frame -->
      <div class="bg-[#111214] rounded-[32px] border border-black/10 overflow-hidden flex flex-col justify-between shadow-2xl relative">
        <div id="meet-iframe-container" class="flex-1 w-full h-full bg-[#18191b]">
          <!-- Jitsi Iframe mounts here dynamically -->
        </div>
      </div>

      <!-- SmartMeet AI Live Companion Panel -->
      <div class="card-glass rounded-[32px] p-6 flex flex-col justify-between h-full min-h-0 text-left border border-white/80 shadow-glass relative overflow-hidden">
        <div class="flex flex-col gap-5 h-[90%] min-h-0">
          <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
            <PhSparkle :size="20" class="text-primary animate-pulse" />
            <div class="flex flex-col">
              <h3 class="font-header font-bold text-base text-brand-dark leading-none">SmartMeet AI Companion</h3>
              <span class="text-[9px] text-brand-slate font-extrabold uppercase mt-1 tracking-wider">AI Live Syncing</span>
            </div>
          </div>

          <!-- Transcript Stream Box -->
          <div class="flex-1 flex flex-col gap-3 min-h-0">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-extrabold text-brand-slate uppercase tracking-wide">AI Meeting Assistant Feed</span>
              <button 
                @click="isListening = !isListening"
                class="px-3 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase border transition-all cursor-pointer"
                :class="isListening ? 'bg-primary/8 border-primary/20 text-primary' : 'bg-black/5 border-black/5 text-brand-slate hover:bg-black/8'"
              >
                {{ isListening ? 'Syncing Active' : 'Start AI Assist' }}
              </button>
            </div>

            <div ref="transcriptContainer" class="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 scroll-container bg-black/[0.01] rounded-2xl p-3 border border-black/[0.02]">
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
              
              <!-- Listening indicator -->
              <div v-if="isListening" class="flex items-center gap-2 text-xs text-primary font-bold animate-pulse p-2">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>AI is listening and extracting tasks...</span>
              </div>

              <div v-if="activeTranscript.length === 0 && !isListening" class="text-xs text-brand-slate/40 italic py-12 text-center flex flex-col items-center gap-2 justify-center h-full">
                <PhMicrophone :size="24" class="text-brand-slate/30" />
                <span>AI Assist is paused. Click 'Start AI Assist' to simulate live transcription.</span>
              </div>
            </div>
          </div>

          <!-- Actions Box -->
          <div class="h-[35%] min-h-[140px] flex flex-col gap-2.5 border-t border-black/5 pt-4">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-extrabold text-brand-slate uppercase tracking-wide">Real-time Tasks Extracted</span>
              <span class="bg-primary/10 border border-primary/20 text-primary font-bold text-[9px] px-2 py-0.5 rounded-full">{{ extractedTasks.length }} detected</span>
            </div>
            
            <div class="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scroll-container">
              <div 
                v-for="task in extractedTasks" 
                :key="task.id"
                class="bg-gradient-to-br from-white/90 to-white/50 border border-black/5 p-3 rounded-xl flex items-start justify-between gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] animate-slide-in-right"
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
                Waiting for dialogue tasks...
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { 
  PhArrowLeft, 
  PhSparkle, 
  PhMicrophone, 
  PhCheck 
} from '@phosphor-icons/vue'

const props = defineProps({
  meeting: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'syncMeeting'])

let jitsiApi = null
const isListening = ref(true)
const activeTranscript = ref([])
const extractedTasks = ref([])
const transcriptContainer = ref(null)

// Format MM:SS helper
const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0')
  const s = (secs % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// Simulated active meeting scripts mapping
const dialogSteps = [
  {
    seconds: 3,
    speaker: 'Marcus Wright',
    text: 'Hey Alex! Glad you could join the in-app room. Let\'s sync on the roadmap deliverables.',
    activeFor: 4
  },
  {
    seconds: 9,
    speaker: 'Sarah Jenkins',
    text: 'Perfect. Alex, can you compile the backend API contracts spreadsheet so we can unblock the frontend developers by tomorrow?',
    activeFor: 6,
    triggerTask: {
      id: Date.now() + 101,
      title: 'Compile Auth API contracts spreadsheet',
      assignee: 'Alex Chen',
      priority: 'HIGH PRIORITY'
    }
  },
  {
    seconds: 17,
    speaker: 'Alex Chen',
    text: 'Yes, absolutely. I will coordinate with Marcus and compile the API sheet first thing tomorrow.',
    activeFor: 5
  },
  {
    seconds: 24,
    speaker: 'Marcus Wright',
    text: 'Great. I will handle setting up the container resources in AWS as soon as you have that document ready.',
    activeFor: 5,
    triggerTask: {
      id: Date.now() + 102,
      title: 'Setup test container resources in AWS',
      assignee: 'Marcus Wright',
      priority: 'MEDIUM PRIORITY'
    }
  }
]

let simulationTimer = null
let currentSecond = 0
const timeouts = []

// Start transcription simulation
const startSimulation = () => {
  simulationTimer = setInterval(() => {
    if (!isListening.value) return
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

// Mount and initialize Jitsi
onMounted(() => {
  // If Jitsi external_api is script loaded
  if (window.JitsiMeetExternalAPI) {
    const domain = 'meet.jit.si'
    
    // Extract room name from meetLink or create a unique one
    let roomName = 'SmartMeet_' + props.meeting.id
    if (props.meeting.meetLink) {
      const parts = props.meeting.meetLink.split('/')
      const code = parts[parts.length - 1]
      if (code) roomName = 'SmartMeet_' + code.replace(/-/g, '_')
    }

    const options = {
      roomName: roomName,
      parentNode: document.querySelector('#meet-iframe-container'),
      width: '100%',
      height: '100%',
      userInfo: {
        displayName: 'Alex Chen (Pro)'
      },
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
  } else {
    // Fallback if SDK is offline/loading fails
    document.querySelector('#meet-iframe-container').innerHTML = `
      <div class="flex flex-col items-center justify-center h-full text-white/50 p-6 text-center gap-3">
        <svg class="w-12 h-12 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="font-header font-bold text-sm">Initializing Embedded Call Server...</span>
        <span class="text-xs max-w-sm">Loading secure WebRTC signaling connection. Please verify meet.jit.si connection.</span>
      </div>
    `
  }

  startSimulation()
})

onUnmounted(() => {
  if (jitsiApi) {
    jitsiApi.dispose()
  }
  clearInterval(simulationTimer)
})
</script>

<style scoped>
.scroll-container::-webkit-scrollbar {
  width: 4px;
}
.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 99px;
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}

.animate-fade-in {
  animation: fadeIn 0.35s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-in-right {
  animation: slideInRight 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
