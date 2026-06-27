<template>
  <section id="product" class="bg-brand-bg py-10 relative w-full border-t border-black/5">
    <!-- Header -->
    <div class="max-w-[750px] mx-auto text-center mb-20 px-4 relative z-10">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/8 border border-secondary/15 text-secondary text-[10px] font-bold tracking-wider uppercase mb-5 font-header">
        ✦ Semantic Architecture ✦
      </span>
      
      <h2 class="text-3xl sm:text-5xl font-header font-bold text-brand-dark tracking-tight mb-5 leading-tight">
        Engineered for team intelligence.
      </h2>
      
      <p class="text-base sm:text-lg text-brand-slate font-body leading-relaxed max-w-[620px] mx-auto">
        SmartMeet compiles scattered vocal data into structured company assets, enabling instant retrieval and seamless collaboration.
      </p>
    </div>

    <!-- Editorial Bento Grid (Asymmetric 3-Column Layout) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1200px] mx-auto px-4 relative z-10">
      
      <!-- Block 1: Universal Search (Spans 2 columns on desktop) -->
      <div class="md:col-span-2 card-glass rounded-[28px] flex flex-col justify-between p-8 min-h-[420px] relative overflow-hidden group">
        <div class="absolute inset-0 rounded-[28px] bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        <div class="flex-shrink-0 mb-6">
          <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-500">
            <PhMagnifyingGlass :size="20" weight="bold" />
          </div>
          <h3 class="text-xl font-bold font-header text-brand-dark mb-2">Universal Semantic Search</h3>
          <p class="text-sm text-brand-slate font-body max-w-md">
            Query across your entire workspace history. Ask natural questions and get timestamped video snippets and summaries instantly.
          </p>
        </div>

        <!-- Interactive Search Emulator (Nested Radius: rounded-xl) -->
        <div class="w-full bg-slate-50/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl p-5 relative mt-auto shadow-sm">
          <div class="relative w-full mb-4">
            <!-- Inner Search Input (Nested Radius: rounded-lg) -->
            <div class="w-full h-11 bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 rounded-lg px-10 flex items-center text-xs text-brand-dark relative transition-all duration-350 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)]"
                 :class="{ 'border-primary shadow-[0_0_12px_rgba(75,104,255,0.1)]': searchQuery.length > 0 || searching }">
              <PhMagnifyingGlass :size="16" weight="bold" class="absolute left-3.5 top-[14px]" :class="searching || searchQuery.length > 0 ? 'text-primary' : 'text-brand-slate'" />
              
              <div v-if="searchQuery.length === 0 && !searching" class="text-brand-slate select-none pointer-events-none font-body">
                Search all meetings...
              </div>
              <div v-else class="font-semibold flex items-center font-body">
                {{ searchQuery }}
                <span class="w-[2px] h-3.5 bg-primary ml-1 animate-cursor-blink" v-if="searching"></span>
              </div>

              <div v-if="searching" class="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spinner ml-auto"></div>
              <button v-if="searchQuery.length > 0 && !searching" class="ml-auto text-brand-slate hover:text-brand-dark cursor-pointer font-header text-[10px]" @click="clearSearch">✕</button>
            </div>
          </div>

          <!-- Prompt Suggestions -->
          <div class="flex flex-wrap gap-2 mb-4">
            <button v-for="(prompt, idx) in searchPrompts" :key="idx" 
                    :aria-label="'Search for: ' + prompt.query"
                    class="text-[10px] font-bold font-header text-brand-slate bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 hover:text-primary hover:bg-primary/5 hover:border-primary/10 shadow-sm"
                    :class="{ 'text-primary bg-primary/10 dark:bg-primary/20 border-primary/20': selectedPromptIndex === idx }"
                    @click="runSearchDemo(idx)">
              "{{ prompt.text }}"
            </button>
          </div>

          <!-- Animated Search Result Box (Nested Radius: rounded-lg) -->
          <div class="min-h-[90px] flex flex-col justify-center border-t border-black/5 pt-4 text-left">
            <transition name="fade" mode="out-in">
              <div v-if="searchResult" class="flex flex-col gap-2 bg-primary/5 border border-primary/10 rounded-lg p-3.5 shadow-sm" :key="searchResult.timestamp">
                <div class="flex justify-between items-center">
                  <span class="inline-block bg-primary/10 text-primary py-0.5 px-2 rounded text-[9px] font-bold uppercase tracking-wider font-header">{{ searchResult.meeting }}</span>
                  <span class="text-[9px] font-bold text-brand-slate uppercase tracking-wider font-header">Timestamp {{ searchResult.timestamp }}</span>
                </div>
                <p class="text-xs leading-relaxed text-brand-dark italic font-body font-medium">"{{ searchResult.answer }}"</p>
              </div>
              
              <div v-else class="flex flex-col w-full py-2" key="skeleton">
                <div class="h-2 bg-black/5 rounded-full mb-2 animate-pulse w-full"></div>
                <div class="h-2 bg-black/5 rounded-full mb-2 animate-pulse w-4/5"></div>
                <div class="h-2 bg-black/5 rounded-full animate-pulse w-2/3"></div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Block 2: Multi-Language Voice Engine (Spans 1 column on desktop) -->
      <div class="card-glass rounded-[28px] flex flex-col justify-between p-8 min-h-[420px] relative group">
        <div class="absolute inset-0 rounded-[28px] bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        <div>
          <div class="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary mb-5 group-hover:scale-110 transition-transform duration-500">
            <PhWaveform :size="20" weight="bold" />
          </div>
          <h3 class="text-xl font-bold font-header text-brand-dark mb-2">Acoustic Engine</h3>
          <p class="text-sm text-brand-slate font-body">
            Auto-detects speaker identities and translates jargon on the fly with 99% accuracy across 40+ languages.
          </p>
        </div>

        <!-- Pulsing Orb soundwave simulation (Nested Radius: rounded-xl) -->
        <div class="h-44 bg-slate-50 dark:bg-slate-950/50 border border-black/5 dark:border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden mt-6 shadow-inner">
          <div class="absolute w-24 h-24 rounded-full bg-secondary/10 blur-xl animate-pulse"></div>
          <div class="relative flex items-center justify-center w-28 h-28">
            <svg class="w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" class="text-secondary opacity-80" stroke-width="2">
                <animate attributeName="r" values="15;38;15" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" class="text-secondary opacity-60" stroke-width="1.5">
                <animate attributeName="r" values="22;45;22" dur="3s" begin="0.75s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" begin="0.75s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="50" r="8" fill="currentColor" class="text-secondary select-none">
                <animate attributeName="r" values="8;11;8" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </svg>
            <span class="absolute text-[8px] font-bold tracking-widest text-slate-500 uppercase font-header">Capture</span>
          </div>
        </div>
      </div>

      <!-- Block 3: Auto Action Items (Spans 1 column on desktop) -->
      <div class="card-glass rounded-[28px] flex flex-col justify-between p-8 min-h-[420px] relative group">
        <div class="absolute inset-0 rounded-[28px] bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        <div>
          <div class="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-5 group-hover:scale-110 transition-transform duration-500">
            <PhCheckCircle :size="20" weight="bold" />
          </div>
          <h3 class="text-xl font-bold font-header text-brand-dark mb-2">Automated Tasks</h3>
          <p class="text-sm text-brand-slate font-body">
            Converts key decisions into action points, links owners, and deploys them to Slack, Jira, or Linear.
          </p>
        </div>

        <!-- Self-typing Checklist Simulator (Nested Radius: rounded-xl) -->
        <div class="h-44 bg-slate-50 dark:bg-slate-950/50 border border-black/5 dark:border-white/5 rounded-xl p-[18px] flex flex-col justify-center mt-6 shadow-inner">
          <div class="space-y-3.5 text-left">
            <div v-for="t in listDemoTasks" :key="t.id" class="flex items-center gap-3">
              <div class="w-[18px] h-[18px] rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all duration-300 shadow-sm"
                   :class="t.done ? 'bg-green-500 text-white' : 'bg-white dark:bg-slate-900 border border-black/10 dark:border-white/10 text-transparent'">
                <PhCheck :size="10" weight="bold" />
              </div>
              <span class="text-xs font-semibold font-body transition-colors duration-300" :class="t.done ? 'text-brand-slate line-through' : 'text-brand-dark'">
                {{ t.text }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Block 4: Connected Knowledge Graph (Spans 2 columns on desktop) -->
      <div class="md:col-span-2 card-glass rounded-[28px] flex flex-col justify-between p-8 min-h-[420px] relative group">
        <div class="absolute inset-0 rounded-[28px] bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
        
        <div class="flex-shrink-0 mb-6">
          <div class="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:scale-110 transition-transform duration-500">
            <PhBrain :size="20" weight="duotone" />
          </div>
          <h3 class="text-xl font-bold font-header text-brand-dark mb-2">Workspace Graph</h3>
          <p class="text-sm text-brand-slate font-body max-w-md">
            SmartMeet maps recurring themes, cross-references decisions, and constructs a visual database of interconnected team data.
          </p>
        </div>

        <!-- Glowing Network Graph Visualization (Nested Radius: rounded-xl) -->
        <div class="h-44 bg-slate-50 dark:bg-slate-950/50 border border-black/5 dark:border-white/5 rounded-xl flex items-center justify-center relative overflow-hidden mt-auto shadow-inner">
          <svg class="w-full h-full" viewBox="0 0 400 160">
            <!-- Connection Lines -->
            <line x1="80" y1="80" x2="200" y2="40" stroke="rgba(75, 104, 255, 0.12)" stroke-width="1.5" />
            <line x1="80" y1="80" x2="200" y2="120" stroke="rgba(75, 104, 255, 0.12)" stroke-width="1.5" />
            <line x1="200" y1="40" x2="320" y2="80" stroke="rgba(6, 182, 212, 0.12)" stroke-width="1.5" />
            <line x1="200" y1="120" x2="320" y2="80" stroke="rgba(6, 182, 212, 0.12)" stroke-width="1.5" />
            <line x1="200" y1="40" x2="200" y2="120" stroke="rgba(236, 72, 153, 0.08)" stroke-width="1.5" />

            <!-- Animated traveling pulses -->
            <circle cx="80" cy="80" r="3" fill="#4b68ff">
              <animate attributeName="cx" values="80;200" dur="4s" repeatCount="indefinite" />
              <animate attributeName="cy" values="80;40" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="120" r="3" fill="#06b6d4">
              <animate attributeName="cx" values="200;320" dur="5s" repeatCount="indefinite" />
              <animate attributeName="cy" values="120;80" dur="5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0" dur="5s" repeatCount="indefinite" />
            </circle>

            <!-- Nodes -->
            <g class="cursor-pointer">
              <circle cx="80" cy="80" r="14" fill="#ffffff" class="fill-white dark:fill-slate-900" stroke="#4b68ff" stroke-width="2" />
              <text x="80" y="83" fill="#64748b" class="fill-brand-slate font-bold" font-size="8" font-family="Montserrat" text-anchor="middle">VOICE</text>
            </g>
            <g class="cursor-pointer">
              <circle cx="200" cy="40" r="16" fill="#ffffff" class="fill-white dark:fill-slate-900" stroke="#ec4899" stroke-width="2" />
              <text x="200" y="43" fill="#64748b" class="fill-brand-slate font-bold" font-size="8" font-family="Montserrat" text-anchor="middle">THEMES</text>
            </g>
            <g class="cursor-pointer">
              <circle cx="200" cy="120" r="16" fill="#ffffff" class="fill-white dark:fill-slate-900" stroke="#06b6d4" stroke-width="2" />
              <text x="200" y="123" fill="#64748b" class="fill-brand-slate font-bold" font-size="8" font-family="Montserrat" text-anchor="middle">DECISIONS</text>
            </g>
            <g class="cursor-pointer">
              <circle cx="320" cy="80" r="18" fill="#ffffff" class="fill-white dark:fill-slate-900" stroke="#4b68ff" stroke-width="2">
                <animate attributeName="stroke" values="#4b68ff;#06b6d4;#4b68ff" dur="6s" repeatCount="indefinite" />
              </circle>
              <text x="320" y="83" fill="#4b68ff" font-size="8" font-family="Montserrat" font-weight="bold" text-anchor="middle">BRAIN</text>
            </g>
          </svg>
        </div>
      </div>
      
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { PhPulse, PhCheckCircle, PhMagnifyingGlass, PhWaveform, PhBrain, PhCheck } from '@phosphor-icons/vue'

const searchQuery = ref('')
const searching = ref(false)
const searchResult = ref(null)
const selectedPromptIndex = ref(-1)

const searchPrompts = [
  {
    text: "Q3 marketing budget",
    query: "What did Sarah suggest about Q3 marketing spend?",
    answer: "Sarah recommended capping the initial Q3 marketing spend at $12,500 and allocating the remaining $7,500 to dev tools.",
    timestamp: "18:42",
    meeting: "Strategy Sync"
  },
  {
    text: "Finalized landing page",
    query: "Summarize feedback on the new landing page.",
    answer: "The team approved the interactive visual mockups but requested a smoother pausable scrolling testimonial marquee.",
    timestamp: "05:15",
    meeting: "UX Critique"
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

// Self-typing Checklist Simulator Setup
const listDemoTasks = ref([
  { id: 1, text: 'Auto-compile API schemas', done: false },
  { id: 2, text: 'Deploy Vercel branch integrations', done: false },
  { id: 3, text: 'Approve final copy design system', done: false }
])

let checklistTimer = null

const startChecklistSimulation = () => {
  let step = 0
  checklistTimer = setInterval(() => {
    if (step < listDemoTasks.value.length) {
      listDemoTasks.value[step].done = true
      step++
    } else {
      listDemoTasks.value.forEach(t => t.done = false)
      step = 0
    }
  }, 2200)
}

onMounted(() => {
  startChecklistSimulation()
})

onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (checklistTimer) clearInterval(checklistTimer)
})
</script>

<style scoped>
/* High-performance non-clipped background glows */
.bento-section {
  background: radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.05) 0%, rgba(255, 255, 255, 0) 50%),
              radial-gradient(circle at 15% 85%, rgba(75, 104, 255, 0.06) 0%, rgba(255, 255, 255, 0) 50%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>