<template>
  <section id="product" class="py-16 text-center border-t border-black/5">
    <div class="max-w-[650px] mx-auto mb-16 px-4">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold font-header tracking-tight mb-4 text-brand-dark">The Operating System for Meetings</h2>
      <p class="text-base text-brand-slate leading-relaxed">
        One platform to record, transcribe, and analyze every conversation
        with boardroom-grade precision.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[1.22fr_0.78fr] gap-7 mb-7">
      <!-- Main Dashboard Preview Mockup -->
      <div class="card-glass rounded-[28px] overflow-hidden flex flex-col h-[480px]">
        <div class="bg-white/40 border-b border-black/5 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-black/10"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-black/10"></span>
            <span class="w-2.5 h-2.5 rounded-full bg-black/10"></span>
          </div>
          <div class="mx-auto max-w-[280px] w-full text-center bg-white/50 border border-black/5 py-1 px-4 rounded-lg text-[10px] text-brand-slate tracking-wide font-mono select-none">
            dashboard.smartmeet.ai
          </div>
        </div>
        <div class="flex-1 bg-white/20 overflow-hidden relative">
          <img src="../../assets/Dashboard.png" alt="SmartMeet Dashboard" class="w-full h-auto object-cover" />
        </div>
      </div>

      <!-- Sentiment & Mood Analysis -->
      <div class="card-glass rounded-[28px] p-9 flex flex-col justify-between text-left h-[480px] group">
        <div class="flex flex-col gap-4">
          <div class="w-11 h-11 rounded-[14px] bg-primary/6 border border-primary/15 flex items-center justify-center text-primary mb-2 shadow-[0_4px_10px_rgba(75,104,255,0.02)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-108 group-hover:bg-primary/10 group-hover:border-primary/30">
            <PhPulse :size="20" weight="bold" />
          </div>
          <h3 class="text-xl font-bold font-header tracking-tight mb-2 text-brand-dark">Sentiment & Mood Analysis</h3>
          <p class="text-sm leading-relaxed text-brand-slate">
            AI detects team engagement and sentiment trends across every
            meeting, helping you understand the pulse of your workspace.
          </p>
        </div>

        <div class="flex flex-col gap-3.5 mt-7">
          <div class="flex justify-between items-center px-5 py-3.5 rounded-2xl bg-white/40 border border-black/[0.04] transition-all duration-300 border-green-500/20 bg-green-500/5">
            <span class="text-xs font-bold text-brand-dark">Positive Feedback</span>
            <span class="text-green-600 bg-green-500/12 py-1 px-2.5 rounded-full text-xs font-bold">84%</span>
          </div>
          <div class="flex justify-between items-center px-5 py-3.5 rounded-2xl bg-white/40 border border-black/[0.04] transition-all duration-300 border-primary/20 bg-primary/5">
            <span class="text-xs font-bold text-brand-dark">Alignment Score</span>
            <span class="text-primary bg-primary/12 py-1 px-2.5 rounded-full text-xs font-bold">92%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-7">
      <!-- Auto Action Items card -->
      <div class="card-glass rounded-[28px] p-9 flex flex-col justify-center gap-4 text-left group">
        <div class="w-11 h-11 rounded-[14px] bg-secondary/6 border border-secondary/15 flex items-center justify-center text-secondary mb-0 flex-shrink-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-108 group-hover:bg-secondary/10 group-hover:border-secondary/30">
          <PhCheckCircle :size="20" weight="bold" />
        </div>
        <h3 class="text-xl font-bold font-header tracking-tight mb-2 text-brand-dark">Auto-Action Items</h3>
        <p class="text-sm leading-relaxed text-brand-slate">
          Stop taking notes. SmartMeet automatically identifies and assigns
          tasks to the right people in Slack or Jira.
        </p>
      </div>

      <!-- Interactive Universal Knowledge Search -->
      <div class="card-glass rounded-[28px] p-9 flex flex-col justify-between text-left">
        <div class="flex flex-col lg:flex-row gap-8 items-center w-full">
          <div class="flex-1">
            <h3 class="text-xl font-bold font-header tracking-tight mb-2 text-brand-dark">Universal Knowledge Search</h3>
            <p class="text-sm leading-relaxed text-brand-slate">
              Ask questions like "What did Sarah say about the budget last month?" and get instant video timestamps and summaries.
            </p>
          </div>

          <div class="flex-1 w-full flex flex-col gap-4">
            <!-- Search input wrapper -->
            <div class="relative w-full">
              <div 
                class="w-full h-12 bg-white border border-black/8 rounded-xl px-11 flex items-center text-sm text-brand-dark relative transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)]"
                :class="{ 'border-primary shadow-[inset_0_1px_3px_rgba(0,0,0,0.03),0_0_12px_rgba(75,104,255,0.15)]': searchQuery.length > 0 || searching }"
              >
                <PhMagnifyingGlass 
                  :size="18" 
                  weight="bold" 
                  class="absolute left-3.5 top-[15px] transition-colors duration-300"
                  :class="searching || searchQuery.length > 0 ? 'text-primary' : 'text-brand-slate'"
                />

                <div v-if="searchQuery.length === 0 && !searching" class="text-brand-slate select-none pointer-events-none">
                  Search across 42 meetings...
                </div>
                <div v-else class="font-semibold flex items-center">
                  {{ searchQuery }}
                  <span class="w-[2px] h-4 bg-primary ml-1 animate-cursor-blink" v-if="searching"></span>
                </div>

                <div v-if="searching" class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spinner ml-auto"></div>
                <button v-if="searchQuery.length > 0 && !searching" class="ml-auto text-brand-slate hover:text-brand-dark cursor-pointer text-xs font-bold" @click="clearSearch">✕</button>
              </div>
            </div>

            <!-- Prompt pills -->
            <div class="flex flex-wrap gap-2">
              <div 
                v-for="(prompt, idx) in searchPrompts" 
                :key="idx" 
                class="text-[11px] font-semibold text-brand-slate bg-white/50 border border-black/5 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 hover:text-primary hover:bg-primary/5 hover:border-primary/10 select-none"
                :class="{ 'text-primary bg-primary/8 border-primary/20 shadow-sm': selectedPromptIndex === idx }"
                @click="runSearchDemo(idx)"
              >
                {{ prompt.text }}
              </div>
            </div>

            <!-- Search results preview -->
            <div class="min-h-[110px] flex flex-col justify-center border-t border-black/5 pt-5 text-left">
              <transition name="fade" mode="out-in">
                <div v-if="searchResult" class="flex flex-col gap-2.5 bg-primary/4 border border-primary/15 rounded-xl p-4 shadow-[0_2px_10px_rgba(31,38,135,0.02)]" :key="searchResult.timestamp">
                  <div class="flex justify-between items-center">
                    <span class="inline-block bg-primary/10 text-primary py-0.5 px-2 rounded text-[10px] font-bold uppercase tracking-wide">{{ searchResult.meeting }}</span>
                    <span class="text-[10px] font-bold text-brand-slate uppercase tracking-wide">At {{ searchResult.timestamp }}</span>
                  </div>
                  <p class="text-xs leading-relaxed text-brand-dark font-medium italic">"{{ searchResult.answer }}"</p>
                </div>
                <div v-else class="flex flex-col w-full" key="skeleton">
                  <div class="h-2.5 bg-black/5 rounded-full mb-2.5 animate-pulse w-full"></div>
                  <div class="h-2.5 bg-black/5 rounded-full mb-2.5 animate-pulse w-3/4"></div>
                  <div class="h-2.5 bg-black/5 rounded-full animate-pulse w-1/2"></div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { PhPulse, PhCheckCircle, PhMagnifyingGlass } from '@phosphor-icons/vue'

const searchQuery = ref('')
const searching = ref(false)
const searchResult = ref(null)
const selectedPromptIndex = ref(-1)

const searchPrompts = [
  {
    text: "What did Sarah say about the budget?",
    query: "What did Sarah say about the budget last month?",
    answer: "Sarah recommended capping the initial Q3 marketing spend at $12,500 and allocating the remaining $7,500 to development licenses.",
    timestamp: "18:42",
    meeting: "Strategy Sync"
  },
  {
    text: "Summarize the feedback on landing page.",
    query: "Summarize the feedback on the new landing page.",
    answer: "The team agreed that the new hero animation is engaging, but recommended clarifying the pricing cards and including more client social proof.",
    timestamp: "05:15",
    meeting: "UX Critique"
  },
  {
    text: "Show action items assigned to Alex.",
    query: "Show action items assigned to Alex.",
    answer: "Alex to update the developer API documentation with new webhook payloads by Friday, and coordinate with Sarah on Jira #248.",
    timestamp: "32:10",
    meeting: "Engineering weekly"
  }
]

let searchTimeout = null

const runSearchDemo = (index) => {
  if (searching.value) return
  
  if (searchTimeout) clearTimeout(searchTimeout)
  
  selectedPromptIndex.value = index
  searchQuery.value = ''
  searching.value = true
  searchResult.value = null
  
  const targetText = searchPrompts[index].query
  let currentIdx = 0
  
  const typeLetter = () => {
    if (currentIdx < targetText.length) {
      searchQuery.value += targetText.charAt(currentIdx)
      currentIdx++
      searchTimeout = setTimeout(typeLetter, 30)
    } else {
      searchTimeout = setTimeout(() => {
        searching.value = false
        searchResult.value = searchPrompts[index]
      }, 700)
    }
  }
  
  typeLetter()
}

const clearSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchQuery.value = ''
  searchResult.value = null
  selectedPromptIndex.value = -1
  searching.value = false
}

onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
})
</script>
