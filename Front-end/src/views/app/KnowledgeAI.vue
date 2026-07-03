<template>
  <div class="flex h-full text-left relative overflow-hidden bg-transparent pt-2 gap-6">
    
    <!-- BACKGROUND BACKDROP (closes drawer when clicked) -->
    <div 
      v-if="showHistory" 
      @click="showHistory = false" 
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
    ></div>

    <!-- LEFT DRAWER: CHAT SESSIONS HISTORY -->
    <div 
      class="fixed top-0 left-0 bottom-0 w-[280px] flex flex-col bg-white/95 dark:bg-slate-950 backdrop-blur-xl p-5 gap-4 border-r border-black/5 dark:border-white/5 z-50 transition-all duration-300 ease-out"
      :class="showHistory ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none pointer-events-none'"
    >
      <!-- Drawer Header -->
      <div class="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/5">
        <div class="flex items-center gap-2 text-sm font-bold text-brand-dark dark:text-white select-none">
          <PhClockClockwise :size="16" weight="bold" class="w-4 h-4 text-primary" />
          <span>Chat History</span>
        </div>
        <button 
          type="button" 
          @click="showHistory = false" 
          class="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-brand-slate hover:text-brand-dark dark:hover:text-white transition-colors cursor-pointer"
        >
          <PhX :size="16" weight="bold" class="w-4 h-4" />
        </button>
      </div>

      <!-- New Chat Button inside drawer -->
      <button 
        type="button"
        @click="startNewChat(); showHistory = false"
        :disabled="messages.length === 0"
        class="relative overflow-hidden group w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-[#5b72ff] hover:from-[#5b72ff] hover:to-primary disabled:from-slate-100 disabled:to-slate-200 dark:disabled:from-slate-800 dark:disabled:to-slate-900 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-header font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_4px_18_rgba(75,104,255,0.2)] hover:shadow-[0_4px_22px_rgba(75,104,255,0.35)] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        <span class="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        <PhPlus :size="14" weight="bold" class="transition-transform group-hover:rotate-90 duration-300" />
        <span>New Chat</span>
      </button>

      <!-- Sessions List grouped by date -->
      <div class="flex-1 overflow-y-auto flex flex-col gap-5 no-scrollbar pr-0.5 mt-2">
        <div 
          v-for="group in groupedSessions" 
          :key="group.title" 
          class="flex flex-col gap-2"
        >
          <!-- Category Header -->
          <div class="text-[10px] font-bold text-brand-slate/70 uppercase tracking-widest pl-2 mb-1 flex items-center gap-1.5 select-none">
            <span class="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
            {{ group.title }}
          </div>
          
          <!-- History Item -->
          <div 
            v-for="sess in group.items"
            :key="sess._id"
            @click="loadSession(sess._id); showHistory = false"
            class="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 border transition-all duration-300 cursor-pointer group relative overflow-hidden"
            :class="activeSessionId === sess._id 
              ? 'bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 text-primary shadow-[0_2px_10px_rgba(75,104,255,0.04)]'
              : 'bg-black/[0.02] dark:bg-white/[0.01] border-transparent text-brand-slate hover:text-brand-dark dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/5 dark:hover:border-white/5'"
          >
            <!-- Sleek active indicator bar on left border -->
            <div 
              class="absolute left-0 top-0 bottom-0 w-[3px] bg-primary transition-transform duration-300 rounded-r"
              :class="activeSessionId === sess._id ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50 group-hover:bg-primary/50'"
            ></div>

            <div class="flex items-center gap-2.5 truncate min-w-0">
              <PhChatTeardrop 
                :size="15" 
                :weight="activeSessionId === sess._id ? 'fill' : 'bold'"
                class="flex-shrink-0"
                :class="activeSessionId === sess._id ? 'text-primary' : 'text-brand-slate/60 group-hover:text-brand-slate'"
              />
              <span class="truncate pr-2 select-none">{{ sess.title }}</span>
            </div>
            
            <button 
              type="button"
              @click.stop="deleteSession(sess._id)"
              class="opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg p-1.5 ml-auto flex-shrink-0 transition-all duration-200"
              title="Delete Chat"
            >
              <PhTrash :size="12" />
            </button>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="sessions.length === 0" class="flex flex-col items-center justify-center py-12 px-4 text-center gap-3">
          <div class="w-10 h-10 rounded-full bg-slate-900/10 dark:bg-white/5 flex items-center justify-center text-brand-slate/40">
            <PhChatTeardrop :size="20" />
          </div>
          <p class="text-xs text-brand-slate/80 italic font-medium">No chat history yet</p>
        </div>
      </div>
    </div>

    <!-- MAIN CHAT AREA wrapper -->
    <div class="flex-1 flex flex-col min-h-0 relative mt-3">


      <!-- MAIN INTERACTIVE CANVAS -->
      <div class="flex-1 overflow-y-auto pr-[8px] scroll-container flex flex-col gap-[20px] pb-2" ref="chatContainer">

        <!-- WELCOME STATE (If no messages) -->
        <div v-if="messages.length === 0" class="flex-1 flex flex-col justify-center items-center w-full gap-[24px] pb-[20px] animate-fade-in">
          <div class="flex flex-col gap-[16px] items-center text-center">
            <div class="w-[52px] h-[52px] rounded-full bg-primary/8 border border-primary/15 flex items-center justify-center text-primary shadow-sm animate-pulse">
              <PhSparkle :size="26" weight="fill" />
            </div>
            <h2 class="text-[32px] sm:text-[40px] font-bold font-header text-brand-dark tracking-tight leading-[1.2]">
              Unlock your organizational<br/>memory.
            </h2>
            <p class="text-[14px] sm:text-[16px] text-brand-slate max-w-[550px] leading-relaxed">
              Ask me anything about your past meetings, documents, or team decisions.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-[16px] px-[80px] w-full mt-[8px]">
            <div
              v-for="(prompt, idx) in suggestedPrompts"
              :key="idx"
              @click="selectPrompt(prompt.query)"
              class="backdrop-blur-[6px] bg-white/40 dark:bg-slate-900/50 border border-white/70 dark:border-white/10 rounded-[16px] p-[20px] cursor-pointer hover:bg-white/70 dark:hover:bg-slate-900/80 hover:border-primary/20 hover:-translate-y-[2px] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col gap-[10px] text-left group"
            >
              <div class="w-[32px] h-[32px] rounded-[8px] bg-primary/6 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <component :is="prompt.icon" :size="16" weight="bold" />
              </div>
              <div class="flex flex-col gap-[2px]">
                <span class="text-[14px] font-bold font-header text-brand-dark dark:text-slate-100 leading-snug group-hover:text-primary transition-colors">"{{ prompt.text }}"</span>
                <span class="text-[11px] text-brand-slate dark:text-slate-400 leading-normal">{{ prompt.desc }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CHAT MESSAGE LOGS -->
        <div v-else class="flex flex-col gap-[20px] py-[10px]">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex gap-[16px] max-w-[90%] items-start animate-message-in"
            :class="msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'"
          >
            <div
              class="w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm select-none"
              :class="msg.role === 'user' ? 'bg-[#d8e2ff] border-primary/20 text-primary' : 'bg-grad-primary border-transparent text-white'"
            >
              <PhUser v-if="msg.role === 'user'" :size="16" weight="bold" />
              <PhSparkle v-else :size="16" weight="fill" />
            </div>

            <!-- Sleek Modern Chat Bubbles -->
            <div
              class="p-[10px] px-[16px] rounded-[20px] text-[13px] leading-relaxed font-body"
              :class="msg.role === 'user'
                ? 'bg-primary text-white rounded-tr-none shadow-[0_4px_16px_rgba(75,104,255,0.12)] text-left'
                : 'bg-white/70 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 text-brand-dark rounded-tl-none shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-md text-left'"
            >
              <span 
                class="block font-bold text-[10px] uppercase tracking-wider mb-[6px] select-none"
                :class="msg.role === 'user' ? 'text-white/60' : 'text-brand-slate'"
              >
                {{ msg.role === 'user' ? 'You' : 'SmartMeet AI' }} • {{ msg.time }}
              </span>
              <p class="whitespace-pre-line font-medium leading-relaxed">{{ msg.text }}</p>

              <!-- Render Attachments if any -->
              <div v-if="msg.attachments && msg.attachments.length > 0" class="mt-3 flex flex-wrap gap-2">
                <div 
                  v-for="(att, aIdx) in msg.attachments" 
                  :key="aIdx" 
                  class="flex items-center gap-2 border rounded-xl p-2 shadow-sm max-w-[200px]"
                  :class="msg.role === 'user' ? 'bg-white/10 border-white/10 text-white' : 'bg-white/70 border-black/5 text-brand-dark'"
                >
                  <img v-if="att.isImage" :src="att.previewUrl" class="w-10 h-10 rounded object-cover" />
                  <div 
                    v-else 
                    class="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                    :class="msg.role === 'user' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'"
                  >
                    <PhFileText :size="18" weight="bold" />
                  </div>
                  <div class="flex flex-col text-[10px] min-w-0 text-left">
                    <span class="font-bold truncate" :class="msg.role === 'user' ? 'text-white' : 'text-brand-dark'">{{ att.name }}</span>
                    <span :class="msg.role === 'user' ? 'text-white/60' : 'text-brand-slate'">{{ formatBytes(att.size) }}</span>
                  </div>
                </div>
              </div>

              <!-- Suggestion box for adding tasks -->
              <div v-if="msg.suggestion" class="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div class="flex items-center gap-2 text-primary">
                  <PhSparkle :size="16" weight="bold" class="animate-pulse" />
                  <span class="text-xs font-bold">AI Task Extraction Detected</span>
                </div>
                <button 
                  type="button"
                  @click="addTasksToPage(msg)"
                  class="px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer shadow-sm border border-transparent"
                  :class="msg.suggestion.added 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-primary hover:bg-[#3850e0] text-white'"
                  :disabled="msg.suggestion.adding || msg.suggestion.added"
                >
                  <span v-if="msg.suggestion.adding" class="flex items-center gap-1.5">
                    <span class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Adding Tasks...
                  </span>
                  <span v-else-if="msg.suggestion.added" class="flex items-center gap-1.5">
                    <PhCheckCircle :size="14" weight="bold" />
                    Added to Tasks Page
                  </span>
                  <span v-else>
                    {{ msg.suggestion.label }}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="aiTyping" class="flex gap-[16px] max-w-[85%] self-start text-left items-start animate-message-in">
            <div class="w-[36px] h-[36px] rounded-full bg-grad-primary flex items-center justify-center flex-shrink-0 text-white shadow-sm">
              <PhSparkle :size="16" weight="fill" />
            </div>
            <div class="backdrop-blur-[8px] p-[20px] rounded-[20px] rounded-tl-none border border-white/80 dark:border-white/10 bg-white/50 dark:bg-slate-900/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-center min-w-[80px]">
              <div class="flex items-center gap-[4px] py-[6px]">
                <span class="w-[8px] h-[8px] bg-primary rounded-full animate-bounce delay-100"></span>
                <span class="w-[8px] h-[8px] bg-primary rounded-full animate-bounce delay-200"></span>
                <span class="w-[8px] h-[8px] bg-primary rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- BOTTOM SECTION WITH BUTTONS BESIDE INPUT -->
      <div class="flex items-end gap-3 flex-shrink-0 w-full pt-5 pb-5">
        

        <!-- BOTTOM INPUT SECTION -->
        <div class="flex-1 flex flex-col gap-2 min-w-0">
        
        <!-- Active Attachments list -->
        <div v-if="attachments.length > 0" class="flex flex-wrap gap-2 px-4 py-2 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 animate-fade-in">
          <div v-for="(file, idx) in attachments" :key="idx" class="flex items-center gap-2 bg-white/90 dark:bg-slate-900/80 border border-black/5 dark:border-white/10 rounded-xl px-2.5 py-1.5 shadow-sm hover:border-red-200 transition-colors group relative">
            <!-- Image Thumbnail -->
            <img v-if="file.isImage" :src="file.previewUrl" class="w-8 h-8 rounded object-cover" />
            <!-- Doc Icon -->
            <div v-else class="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <PhFileText :size="16" weight="bold" />
            </div>
            
            <div class="flex flex-col text-[10px] max-w-[120px] text-left">
              <span class="font-bold text-brand-dark truncate">{{ file.name }}</span>
              <span class="text-brand-slate">{{ formatBytes(file.size) }}</span>
            </div>

            <!-- Ingest Button for .txt transcript files -->
            <button 
              v-if="file.isTranscript && !file.ingested"
              type="button"
              @click="ingestFile(file)"
              class="ml-1.5 p-1 rounded-lg bg-primary/10 hover:bg-primary text-primary hover:text-white transition-colors cursor-pointer"
              title="Ingest Transcript into AI Memory"
              :disabled="file.ingesting"
            >
              <PhSparkle v-if="!file.ingesting" :size="12" weight="bold" />
              <span v-else class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin block"></span>
            </button>
            <span v-else-if="file.ingested" class="text-[10px] text-green-500 font-bold ml-1.5 flex items-center gap-0.5" title="Ingested into Pinecone Memory">
              <PhCheckCircle :size="12" weight="bold" />
            </span>

            <!-- Delete attachment button -->
            <button 
              type="button" 
              @click="removeAttachment(idx)"
              class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center text-[10px] shadow cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <PhX :size="10" weight="bold" />
            </button>
          </div>
        </div>

        <!-- TEXT/AUDIO INPUT BAR -->
        <div 
          class="backdrop-blur-[20px] bg-white/80 dark:bg-slate-950/60 border rounded-[24px] p-[6px] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] flex items-center gap-[8px] transition-all duration-300 focus-within:border-primary/45 focus-within:shadow-[0_12px_36px_-5px_rgba(75,104,255,0.1)]"
          :class="listening ? 'border-red-500/30 bg-red-50/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-black/5 dark:border-white/10'"
        >
          <div class="flex-1 flex items-center gap-[8px] px-[12px] py-[8px]">
            <PhMagnifyingGlass :size="20" class="text-brand-slate/80" />
            <input
              v-model="inputQuery"
              @keydown.enter.prevent="submitQuery"
              type="text"
              :placeholder="listening ? 'Listening to your voice... Speak now' : 'Ask your organizational brain...'"
              class="w-full bg-transparent border-0 font-body text-[15px] text-brand-dark dark:text-slate-200 placeholder-brand-slate/40 dark:placeholder-slate-500 focus:outline-none"
              :disabled="aiTyping"
            />
          </div>
          <div class="flex items-center gap-[4px] pr-[4px]">
            <!-- Voice Record Button -->
            <button
              type="button"
              @click="toggleMicrophone"
              class="w-[38px] h-[38px] rounded-full hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center text-brand-slate hover:text-brand-dark dark:hover:text-white transition-colors cursor-pointer focus:outline-none relative"
              :title="listening ? 'Stop Recording' : 'Voice Command'"
            >
              <span v-if="listening" class="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></span>
              <PhMicrophone :size="20" :weight="listening ? 'fill' : 'bold'" :class="listening ? 'text-red-500' : ''" />
            </button>

            <!-- Attach File Button -->
            <button
              type="button"
              @click="attachFile"
              class="w-[38px] h-[38px] rounded-full hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center text-brand-slate hover:text-brand-dark dark:hover:text-white rotate-[45deg] transition-colors cursor-pointer focus:outline-none"
              title="Attach Document or Image"
            >
              <PhPaperclip :size="20" weight="bold" />
            </button>
            
            <input 
              ref="fileInput" 
              type="file" 
              class="hidden" 
              multiple 
              accept="image/*,.txt,.pdf" 
              @change="handleFileChange" 
            />

            <!-- Submit Button -->
            <button
              type="button"
              @click="submitQuery"
              class="w-[40px] h-[40px] rounded-[99px] bg-primary hover:bg-[#3850e0] text-white flex items-center justify-center transition-all duration-300 hover:shadow-md cursor-pointer focus:outline-none active:scale-95"
              :disabled="(!inputQuery.trim() && attachments.length === 0) || aiTyping"
            >
              <PhArrowUp :size="18" weight="bold" />
            </button>
          </div>
        </div>
        </div>
        
<!-- Action Buttons (beside the input section) -->
        <div class="flex items-center flex-shrink-0 mb-[6px]">
          <!-- New Chat Button -->
          <button
            type="button"
            @click="startNewChat"
            :disabled="messages.length === 0"
            class="h-10 px-3 sm:px-4 rounded-xl bg-primary hover:bg-[#3850e0] disabled:bg-slate-400 dark:disabled:bg-slate-800 disabled:text-slate-200 dark:disabled:text-slate-600 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed text-white text-xs font-bold font-header tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
            title="Start New Chat"
          >
            <PhPlus :size="14" weight="bold" />
            <span class="hidden sm:inline">New Chat</span>
          </button>
        </div>

      </div>
    </div>

    <!-- TOAST PERSISTENT CONTAINER -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'
import { useTaskStore } from '@/stores/task'
import { useNotificationStore } from '@/stores/notification'
import Toast from '@/components/ui/Toast.vue'
import { useToasts } from '@/composables/useToasts'
import {
  PhBrain,
  PhSparkle,
  PhClockClockwise,
  PhMagnifyingGlass,
  PhMicrophone,
  PhPaperclip,
  PhArrowRight,
  PhUser,
  PhFileText,
  PhX,
  PhCheckCircle,
  PhPlus,
  PhTrash,
  PhChatTeardrop,
  PhArrowUp
} from '@phosphor-icons/vue'

const authStore = useAuthStore()
const taskStore = useTaskStore()
const notificationStore = useNotificationStore()
const inputQuery = ref('')
const aiTyping = ref(false)
const listening = ref(false)
const chatContainer = ref(null)

// Toast alerts integration
const { success, error, info } = useToasts()

// Speech Recognition settings
const recognition = ref(null)

// Attachments states
const fileInput = ref(null)
const attachments = ref([])
const sessions = ref([])
const activeSessionId = ref(null)
const uiStore = useUiStore()
const showHistory = computed({
  get: () => uiStore.showChatHistory,
  set: (val) => { uiStore.showChatHistory = val }
})

// Group conversations dynamically by date category
const groupedSessions = computed(() => {
  const groups = {
    today: [],
    yesterday: [],
    lastSevenDays: [],
    older: []
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000
  const sevenDaysAgoStart = todayStart - 7 * 24 * 60 * 60 * 1000

  sessions.value.forEach(sess => {
    const updatedTime = new Date(sess.updatedAt || sess.createdAt).getTime()
    if (updatedTime >= todayStart) {
      groups.today.push(sess)
    } else if (updatedTime >= yesterdayStart) {
      groups.yesterday.push(sess)
    } else if (updatedTime >= sevenDaysAgoStart) {
      groups.lastSevenDays.push(sess)
    } else {
      groups.older.push(sess)
    }
  })

  return [
    { title: 'Today', items: groups.today },
    { title: 'Yesterday', items: groups.yesterday },
    { title: 'Previous 7 Days', items: groups.lastSevenDays },
    { title: 'Older', items: groups.older }
  ].filter(g => g.items.length > 0)
})

const activeSessionTitle = computed(() => {
  const current = sessions.value.find(s => s._id === activeSessionId.value)
  return current ? current.title : ''
})

const suggestedPrompts = [
  {
    text: "What were the key decisions in the last meeting?",
    query: "What were the key decisions made in the last meeting?",
    desc: "Review final agreements",
    icon: PhClockClockwise
  },
  {
    text: "Show my action items and deadlines",
    query: "What are my action items and deadlines from the recent discussions?",
    desc: "See assigned tasks",
    icon: PhCheckCircle
  },
  {
    text: "Summarize the latest project status updates",
    query: "Summarize the latest project status updates and progress discussed.",
    desc: "Get a quick recap",
    icon: PhFileText
  },
  {
    text: "Were there any critical blockers discussed?",
    query: "Were there any critical blockers or risks mentioned in the meetings?",
    desc: "Identify project risks",
    icon: PhBrain
  },
]

const messages = ref([])

onMounted(() => {
  initSpeech()
  loadSessions()
})

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Initialize browser native SpeechRecognition
const initSpeech = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (SpeechRecognition) {
    recognition.value = new SpeechRecognition()
    recognition.value.continuous = false
    recognition.value.interimResults = false
    recognition.value.lang = 'en-US'

    recognition.value.onstart = () => {
      listening.value = true
      info("Speech recognition started. Speak now...")
    }

    recognition.value.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      inputQuery.value = transcript
      success("Speech captured successfully!")
    }

    recognition.value.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        error("Microphone permission denied.")
      } else {
        error("Speech capture failed: " + event.error)
      }
      listening.value = false
    }

    recognition.value.onend = () => {
      listening.value = false
    }
  }
}

// Toggle microphone recording state
const toggleMicrophone = () => {
  if (aiTyping.value) return

  if (!recognition.value) {
    error("Speech recognition is not supported in this browser. Try Google Chrome or Edge.")
    return
  }

  if (listening.value) {
    recognition.value.stop()
  } else {
    inputQuery.value = ''
    try {
      recognition.value.start()
    } catch (err) {
      console.error(err)
      listening.value = false
    }
  }
}

// Attachment functions
const attachFile = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

const handleFileChange = (e) => {
  const files = e.target.files
  if (!files || files.length === 0) return
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const isImage = file.type.startsWith('image/')
    const isTranscript = file.name.endsWith('.txt')
    
    const previewUrl = isImage ? URL.createObjectURL(file) : ''
    
    attachments.value.push({
      file,
      name: file.name,
      size: file.size,
      isImage,
      isTranscript,
      previewUrl,
      ingested: false,
      ingesting: false
    })
  }
  
  success(`Attached ${files.length} file(s).`)
  e.target.value = ''
}

const removeAttachment = (idx) => {
  const att = attachments.value[idx]
  if (att.previewUrl) {
    URL.revokeObjectURL(att.previewUrl)
  }
  attachments.value.splice(idx, 1)
}

// Ingest Transcript File into Pinecone/Database Memory
const ingestFile = async (att) => {
  if (att.ingested || att.ingesting) return
  
  att.ingesting = true
  info(`Ingesting "${att.name}" into organizational memory...`)
  
  try {
    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target.result
      
      const meetingId = 'FILE_' + Math.random().toString(36).substring(2, 9).toUpperCase()
      const title = att.name.replace(/\.[^/.]+$/, "") // Strip file extension
      
      try {
        await axios.post('/api/rag/ingest', {
          meetings: [
            {
              meetingId,
              teamId: 'team1',
              title,
              transcript: text
            }
          ]
        }, {
          headers: {
            Authorization: `Bearer ${authStore.token}`
          }
        })
        
        att.ingested = true
        success(`"${title}" successfully ingested and indexed!`)
      } catch (err) {
        console.error(err)
        error('Failed to ingest file: ' + (err.response?.data?.message || err.message))
      } finally {
        att.ingesting = false
      }
    }
    reader.readAsText(att.file)
  } catch (err) {
    console.error(err)
    error('Failed to read file contents.')
    att.ingesting = false
  }
}

// Submit search query and handle RAG backend query
const submitQuery = async () => {
  const query = inputQuery.value.trim()
  if ((!query && attachments.value.length === 0) || aiTyping.value) return

  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  
  // Clone attachments to display in the user message badge
  const msgAttachments = [...attachments.value]
  attachments.value = []

  messages.value.push({
    id: Date.now(),
    role: 'user',
    text: query || `Uploaded ${msgAttachments.length} file(s)`,
    time,
    attachments: msgAttachments
  })

  inputQuery.value = ''
  aiTyping.value = true
  scrollToBottom()

  try {
    const response = await axios.post('/api/rag/query', {
      question: query || "What information is inside the attached transcript files?",
      teamId: 'team1',
      sessionId: activeSessionId.value
    }, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    const replyTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: response.data.answer,
      time: replyTime
    })

    if (response.data.sessionId) {
      activeSessionId.value = response.data.sessionId
    }
    await loadSessions()
  } catch (err) {
    console.error("RAG Query Error:", err)
    const replyTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: "An error occurred while communicating with SmartMeet memory logs. Please verify Pinecone database credentials.",
      time: replyTime
    })
  } finally {
    aiTyping.value = false
    scrollToBottom()
  }
}

const getTodayDateString = () => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

const formatDateString = (dateStr) => {
  if (!dateStr) return 'TBD'
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const date = new Date(parts[0], parts[1] - 1, parts[2])
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const addTasksToPage = async (msg) => {
  if (!msg.suggestion || msg.suggestion.added || msg.suggestion.adding) return
  msg.suggestion.adding = true
  info("Adding tasks to your Tasks page...")
  try {
    const tasks = msg.suggestion.tasks || []
    for (const t of tasks) {
      await taskStore.addTask({
        title: t.title,
        description: t.description || 'No description provided.',
        priority: 'MEDIUM PRIORITY',
        status: 'todo',
        assignee: authStore.user?.name || 'Marwan',
        due: formatDateString(getTodayDateString()),
        dueDate: getTodayDateString(),
        source: t.source || 'AI Extraction'
      })
    }
    msg.suggestion.added = true
    success(`Successfully added ${tasks.length} task(s) to your Tasks page!`)
  } catch (err) {
    console.error(err)
    error("Failed to add tasks to Tasks page.")
  } finally {
    msg.suggestion.adding = false
  }
}

const selectPrompt = (query) => {
  inputQuery.value = query
  submitQuery()
}

const loadSessions = async () => {
  try {
    const response = await axios.get('/api/rag/sessions', {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    if (response.data && response.data.sessions) {
      sessions.value = response.data.sessions
    }
  } catch (err) {
    console.error("Failed to load chat sessions:", err)
  }
}

const startNewChat = () => {
  activeSessionId.value = null
  messages.value = []
}

const loadSession = async (sessionId) => {
  activeSessionId.value = sessionId
  messages.value = []
  try {
    const response = await axios.get(`/api/rag/sessions/${sessionId}/messages`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    if (response.data && response.data.messages) {
      messages.value = response.data.messages.map(m => {
        const time = new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        return {
          id: m._id,
          role: m.role,
          text: m.text,
          time,
          sources: m.sources || []
        }
      })
      scrollToBottom()
    }
  } catch (err) {
    console.error("Failed to load session messages:", err)
    error("Failed to load conversation history.")
  }
}

const deleteSession = async (sessionId) => {
  if (!confirm("Are you sure you want to delete this conversation?")) return
  try {
    await axios.delete(`/api/rag/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })
    success("Conversation deleted.")
    if (activeSessionId.value === sessionId) {
      startNewChat()
    }
    await loadSessions()
  } catch (err) {
    console.error("Failed to delete session:", err)
    error("Failed to delete conversation.")
  }
}
</script>

<style scoped>
.scroll-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(100, 116, 139, 0.2) transparent;
}
.scroll-container::-webkit-scrollbar {
  width: 6px;
  display: block;
}
.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(100, 116, 139, 0.2);
  border-radius: 99px;
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.4);
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-message-in {
  animation: messageIn 0.3s ease-out forwards;
}

@keyframes messageIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
