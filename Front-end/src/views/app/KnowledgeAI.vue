<template>
  <div class="flex flex-col justify-between min-h-[720px] h-[calc(100vh-180px)] text-left relative gap-[20px]">

    <!-- MAIN INTERACTIVE CANVAS -->
    <div class="flex-1 overflow-y-auto pr-[8px] scroll-container flex flex-col gap-[20px]">

      <!-- WELCOME STATE (If no messages) -->
      <div v-if="messages.length === 0" class="flex-1 flex flex-col justify-center items-center max-w-[810px] mx-auto w-full gap-[36px] pb-[40px] animate-fade-in">
        <div class="flex flex-col gap-[24px] items-center text-center">
          <div class="w-[56px] h-[56px] rounded-full bg-primary/8 border border-primary/15 flex items-center justify-center text-primary shadow-sm animate-pulse">
            <PhSparkle :size="28" weight="fill" />
          </div>
          <h2 class="text-[36px] sm:text-[46px] font-bold font-header text-brand-dark tracking-tight leading-[1.15]">
            Unlock your organizational<br/>memory.
          </h2>
          <p class="text-[16px] sm:text-[18px] text-brand-slate max-w-[600px] leading-relaxed">
            Ask me anything about your past meetings, documents, or team decisions.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full mt-[12px]">
          <div
            v-for="(prompt, idx) in suggestedPrompts"
            :key="idx"
            @click="selectPrompt(prompt.query)"
            class="backdrop-blur-[6px] bg-white/40 border border-white/70 rounded-[16px] p-[24px] cursor-pointer hover:bg-white/70 hover:border-primary/20 hover:-translate-y-[2px] transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] text-left group"
          >
            <div class="w-[36px] h-[36px] rounded-[10px] bg-primary/6 border border-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <component :is="prompt.icon" :size="18" weight="bold" />
            </div>
            <div class="flex flex-col gap-[4px]">
              <span class="text-[16px] font-bold font-header text-brand-dark leading-snug group-hover:text-primary transition-colors">"{{ prompt.text }}"</span>
              <span class="text-[12px] text-brand-slate leading-normal">{{ prompt.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CHAT MESSAGE LOGS -->
      <div v-else class="flex flex-col gap-[20px] py-[10px]">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex gap-[16px] max-w-[85%] items-start animate-message-in"
          :class="msg.role === 'user' ? 'self-end flex-row-reverse text-right' : 'self-start text-left'"
        >
          <div
            class="w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm select-none"
            :class="msg.role === 'user' ? 'bg-[#d8e2ff] border-primary/20 text-primary' : 'bg-grad-primary border-transparent text-white'"
          >
            <PhUser v-if="msg.role === 'user'" :size="16" weight="bold" />
            <PhSparkle v-else :size="16" weight="fill" />
          </div>

          <div
            class="backdrop-blur-[8px] p-[20px] rounded-[20px] border shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-[14px] leading-relaxed font-body"
            :class="msg.role === 'user'
              ? 'bg-[#d8e2ff]/40 border-primary/10 text-brand-dark rounded-tr-none'
              : 'bg-white/50 border-white/80 text-brand-dark rounded-tl-none'"
          >
            <span class="block font-bold text-[11px] text-brand-slate uppercase tracking-wider mb-[6px] select-none">
              {{ msg.role === 'user' ? 'You' : 'SmartMeet AI' }} • {{ msg.time }}
            </span>
            <p class="whitespace-pre-line text-brand-dark">{{ msg.text }}</p>
          </div>
        </div>

        <div v-if="aiTyping" class="flex gap-[16px] max-w-[85%] self-start text-left items-start animate-message-in">
          <div class="w-[36px] h-[36px] rounded-full bg-grad-primary flex items-center justify-center flex-shrink-0 text-white shadow-sm">
            <PhSparkle :size="16" weight="fill" />
          </div>
          <div class="backdrop-blur-[8px] p-[20px] rounded-[20px] rounded-tl-none border border-white/80 bg-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-center min-w-[80px]">
            <div class="flex items-center gap-[4px] py-[6px]">
              <span class="w-[8px] h-[8px] bg-primary rounded-full animate-bounce delay-100"></span>
              <span class="w-[8px] h-[8px] bg-primary rounded-full animate-bounce delay-200"></span>
              <span class="w-[8px] h-[8px] bg-primary rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- BOTTOM INPUT BAR -->
    <div class="backdrop-blur-[20px] bg-white/60 border border-white/70 rounded-[24px] p-[8px] shadow-[0_16px_40px_rgba(31,38,135,0.05)] flex items-center gap-[8px] flex-shrink-0">
      <div class="flex-1 flex items-center gap-[8px] px-[12px] py-[10px]">
        <PhMagnifyingGlass :size="20" class="text-brand-slate/80" />
        <input
          v-model="inputQuery"
          @keydown.enter.prevent="submitQuery"
          type="text"
          placeholder="Ask your organizational brain..."
          class="w-full bg-transparent border-0 font-body text-[16px] text-brand-dark placeholder-brand-slate/40 focus:outline-none"
          :disabled="aiTyping"
        />
      </div>
      <div class="flex items-center gap-[4px] pr-[4px]">
        <button
          type="button"
          @click="toggleMicrophone"
          class="w-[40px] h-[40px] rounded-full hover:bg-black/5 flex items-center justify-center text-brand-slate hover:text-brand-dark transition-colors cursor-pointer focus:outline-none"
          title="Voice Command"
        >
          <PhMicrophone :size="20" :weight="listening ? 'fill' : 'bold'" :class="listening ? 'text-red-500 animate-pulse' : ''" />
        </button>
        <button
          type="button"
          @click="attachFile"
          class="w-[40px] h-[40px] rounded-full hover:bg-black/5 flex items-center justify-center text-brand-slate hover:text-brand-dark rotate-[45deg] transition-colors cursor-pointer focus:outline-none"
          title="Attach Document"
        >
          <PhPaperclip :size="20" weight="bold" />
        </button>
        <button
          type="button"
          @click="submitQuery"
          class="w-[44px] h-[44px] rounded-[16px] bg-primary hover:bg-[#3850e0] text-white flex items-center justify-center transition-all duration-300 hover:shadow-md cursor-pointer focus:outline-none active:scale-95"
          :disabled="!inputQuery.trim() || aiTyping"
        >
          <PhArrowRight :size="18" weight="bold" />
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import {
  PhBrain,
  PhSparkle,
  PhClockClockwise,
  PhCurrencyDollar,
  PhMagnifyingGlass,
  PhMicrophone,
  PhPaperclip,
  PhArrowRight,
  PhUser,
  PhTrash
} from '@phosphor-icons/vue'

const authStore = useAuthStore()
const inputQuery = ref('')
const aiTyping = ref(false)
const listening = ref(false)

const suggestedPrompts = [
  {
    text: "What decisions were made about authentication?",
    query: "What decisions were made about authentication?",
    desc: "Based on team discussions",
    icon: PhClockClockwise
  },
  {
    text: "Why was MongoDB chosen over PostgreSQL?",
    query: "Why was MongoDB chosen over PostgreSQL?",
    desc: "Database selection rationale",
    icon: PhBrain
  },
  {
    text: "Who is responsible for the dashboard redesign?",
    query: "Who is responsible for the dashboard redesign?",
    desc: "Task assignments from meetings",
    icon: PhUser
  },
  {
    text: "What API architecture was selected?",
    query: "What API architecture was selected?",
    desc: "REST vs GraphQL decision",
    icon: PhCurrencyDollar
  }
]

const messages = ref([])

const submitQuery = async () => {
  const query = inputQuery.value.trim()
  if (!query || aiTyping.value) return

  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  messages.value.push({
    id: Date.now(),
    role: 'user',
    text: query,
    time
  })

  inputQuery.value = ''
  aiTyping.value = true

  try {
    const response = await axios.post('/api/rag/query', {
      question: query,
      teamId: 'team1'
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
  } catch (error) {
    const replyTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: "An error occurred while communicating with SmartMeet memory logs.",
      time: replyTime
    })
    console.error("RAG Error:", error)
  } finally {
    aiTyping.value = false
  }
}

const selectPrompt = (query) => {
  inputQuery.value = query
  submitQuery()
}

const toggleMicrophone = () => {
  if (aiTyping.value) return
  listening.value = !listening.value
  if (listening.value) {
    inputQuery.value = 'Listening...'
    setTimeout(() => {
      if (listening.value) {
        inputQuery.value = 'What decisions were made about authentication?'
        listening.value = false
      }
    }, 1500)
  }
}

const attachFile = () => {
  alert('You can upload meeting transcripts to build custom AI knowledge.')
}

const clearChat = () => {
  messages.value = []
}
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
