<template>
  <div class="flex flex-col justify-between min-h-[720px] h-[calc(100vh-180px)] text-left relative gap-[20px]">
    
    <!-- TOP BAR (Reset / Clear chat) -->
    <div class="flex justify-between items-center pb-[12px] border-b border-black/5 flex-shrink-0">
      <div class="flex items-center gap-[8px]">
        <div class="w-[32px] h-[32px] rounded-[10px] bg-primary/8 border border-primary/15 flex items-center justify-center text-primary">
          <PhBrain :size="16" weight="bold" />
        </div>
        <div class="flex flex-col">
          <h3 class="font-header font-bold text-[18px] text-brand-dark leading-[22px]">Knowledge AI Engine</h3>
          <p class="text-[11px] text-brand-slate leading-[14px]">Query your team's collective intelligence</p>
        </div>
      </div>
      <button 
        v-if="messages.length > 0"
        @click="clearChat"
        class="inline-flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] bg-red-500/8 border border-red-500/15 text-red-500 text-[11px] font-header font-bold tracking-wide uppercase hover:bg-red-500/15 transition-all cursor-pointer focus:outline-none"
      >
        <PhTrash :size="12" weight="bold" />
        <span>Clear Chat</span>
      </button>
    </div>

    <!-- MAIN INTERACTIVE CANVAS -->
    <div class="flex-1 overflow-y-auto pr-[8px] scroll-container flex flex-col gap-[20px]">
      
      <!-- WELCOME STATE (If no messages) -->
      <div v-if="messages.length === 0" class="flex-1 flex flex-col justify-center items-center max-w-[810px] mx-auto w-full gap-[36px] py-[40px] animate-fade-in">
        <div class="flex flex-col gap-[24px] items-center text-center">
          <div class="w-[56px] h-[56px] rounded-full bg-primary/8 border border-primary/15 flex items-center justify-center text-primary shadow-sm animate-pulse">
            <PhSparkle :size="28" weight="fill" />
          </div>
          <h2 class="text-[36px] sm:text-[46px] font-bold font-header text-brand-dark tracking-tight leading-[1.15]">
            Unlock your organizational<br/>memory.
          </h2>
          <p class="text-[16px] sm:text-[18px] text-brand-slate max-w-[600px] leading-relaxed">
            Ask me anything about your past meetings, documents, or team decisions. I've indexed over 450 hours of workspace activity.
          </p>
        </div>

        <!-- Suggested Prompts Grid -->
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

      <!-- CHAT MESSAGE LOGS (If messages exist) -->
      <div v-else class="flex flex-col gap-[20px] py-[10px]">
        <div 
          v-for="msg in messages" 
          :key="msg.id"
          class="flex gap-[16px] max-w-[85%] items-start animate-message-in"
          :class="msg.role === 'user' ? 'self-end flex-row-reverse text-right' : 'self-start text-left'"
        >
          <!-- Avatar Icon -->
          <div 
            class="w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0 border shadow-sm select-none"
            :class="msg.role === 'user' ? 'bg-[#d8e2ff] border-primary/20 text-primary' : 'bg-grad-primary border-transparent text-white'"
          >
            <PhUser v-if="msg.role === 'user'" :size="16" weight="bold" />
            <PhSparkle v-else :size="16" weight="fill" />
          </div>

          <!-- Content bubble -->
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

        <!-- AI Typing Indicator -->
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

    <!-- BOTTOM INPUT BAR (Search field) -->
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
import { ref, reactive } from 'vue'
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
  PhTrash,
  PhFolderSimple,
  PhPulse
} from '@phosphor-icons/vue'

const inputQuery = ref('')
const aiTyping = ref(false)
const listening = ref(false)

const suggestedPrompts = [
  { 
    text: "What did we decide on the Nexus project?", 
    query: "What did we decide on the Nexus project?",
    desc: "Based on last week's strategic roadmap review", 
    icon: PhClockClockwise 
  },
  { 
    text: "Find all mentions of Q3 budget cuts.", 
    query: "Find all mentions of Q3 budget cuts.",
    desc: "Across 4 different department syncs", 
    icon: PhCurrencyDollar 
  }
]

const messages = ref([])

// Mock database to match responses to query keywords
const getMockResponse = (query) => {
  const q = query.toLowerCase()
  if (q.includes('nexus')) {
    return `During the last Strategy Sync on Nov 12, 2026, the team officially decided to:
1. **Shift to a "Core-First" feature release strategy** for Q3 to improve delivery stability.
2. **Transition to a micro-frontend architecture** by late August.
3. **Allocate a specific 20% slice of engineering capacity** exclusively for technical debt and documentation to offset the QA pipeline bottlenecks voiced by Sarah Jenkins.`
  }
  if (q.includes('budget') || q.includes('cut')) {
    return `I found mentions of Q3 budget updates in 2 separate workspace activities:
- **Finance Sync (Nov 12)**: David Chen reconciled seat licenses. The budget will cap the initial Q3 marketing tool spend at $12,500, routing the residual license funds to compute infrastructure.
- **Infrastructure Review**: David suggested scaling Amazon EC2 and AWS SageMaker resources up by 50% for Q4 LLM training runs, while keeping the standard team operations budget flat.`
  }
  if (q.includes('hello') || q.includes('hi ')) {
    return `Hello! I am your SmartMeet AI assistant. I have compiled and indexed all transcripts, decision logs, and action items from your past meetings. 

Ask me anything about past sessions, upcoming roadmap goals, or tasks assigned to you!`
  }
  
  // Default dynamic response
  return `I have scanned through 12 meetings (including "Q3 Strategic Product Roadmap", "Q4 Strategy Sync", and "Design Review: Nexus Pro") to answer: "${query}".

**Key Findings:**
- **Product Roadmap**: Engineering capacity has been adjusted, allocating 20% of the bandwidth to clean up database latencies and finalize the v2 API docs.
- **Next Steps**: Jane Doe has an open task to test the DB latency patch, and David Chen is coordinating the security audit.

Would you like me to pull the exact transcript timestamps or related action items for any of these points?`
}

const submitQuery = () => {
  const query = inputQuery.value.trim()
  if (!query || aiTyping.value) return

  // Format message time
  const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  // Add user query message
  messages.value.push({
    id: Date.now(),
    role: 'user',
    text: query,
    time: time
  })

  inputQuery.value = ''
  aiTyping.value = true

  // Simulate typing delay
  setTimeout(() => {
    const responseText = getMockResponse(query)
    const replyTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: responseText,
      time: replyTime
    })
    aiTyping.value = false
  }, 1200)
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
        inputQuery.value = 'What did we decide on the Nexus project?'
        listening.value = false
      }
    }, 1500)
  }
}

const attachFile = () => {
  alert('Simulating file attachments. You can upload meeting transcripts, PDFs, or spreadsheet reports to build custom AI knowledge.')
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
