<template>
  <section id="workflow" class="bg-brand-bg py-10 relative w-full border-t border-black/5">
    <!-- Header -->
    <div class="max-w-[700px] mx-auto text-center mb-4 px-4 relative z-10">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-[10px] font-bold tracking-wider uppercase mb-5 font-header">
        How it Works
      </span>
      
      <h2 class="text-3xl sm:text-5xl font-header font-bold text-brand-dark tracking-tight mb-5 leading-tight">
        From dialogue to database.
      </h2>
      
      <p class="text-base sm:text-lg text-brand-slate font-body leading-relaxed max-w-[600px] mx-auto">
        Four simple steps to turn unstructured team conversations into a structured, searchable, and actionable organization knowledge base.
      </p>
    </div>

    <!-- Horizontal Desktop Timeline Wrapper -->
    <div class="max-w-[1000px] mx-auto px-4 relative z-10">
      <!-- Horizontal Line & Node Grid (Desktop View) -->
      <div class="relative hidden md:flex items-center justify-between px-10 h-24 mb-12">
        <!-- Connecting Dashed SVG Line Behind Nodes -->
        <div class="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-4 z-0">
          <svg class="w-full h-full" overflow="visible">
            <line x1="0" y1="8" x2="100%" y2="8" 
                  stroke="rgba(75, 104, 255, 0.2)" 
                  stroke-width="2" 
                  stroke-dasharray="8,6" 
                  stroke-linecap="round">
              <animate attributeName="stroke-dashoffset" values="28;0" dur="1.5s" repeatCount="indefinite" />
            </line>
          </svg>
        </div>

        <!-- Timeline Steps -->
        <button v-for="(step, idx) in steps" :key="idx"
             @click="selectStep(idx)"
             class="relative z-10 flex flex-col items-center group focus:outline-none cursor-pointer bg-transparent border-0">
          <!-- Step Circle -->
          <div class="w-14 h-14 rounded-full flex items-center justify-center font-header font-extrabold text-sm border-2 transition-all duration-500 ease-out"
               :class="activeStep === idx 
                 ? 'bg-grad-primary text-white border-primary shadow-[0_4px_15px_rgba(75,104,255,0.25)] scale-110' 
                 : 'bg-white text-brand-slate border-black/10 hover:border-black/15 hover:text-brand-dark group-hover:scale-105'">
            0{{ idx + 1 }}
          </div>
          <!-- Step Label -->
          <span class="absolute top-16 text-[10px] uppercase font-bold tracking-wider font-header mt-1 transition-colors duration-300 w-32 text-center min-h-[28px] leading-tight"
                :class="activeStep === idx ? 'text-primary font-extrabold' : 'text-brand-slate group-hover:text-brand-dark'">
            {{ step.shortTitle }}
          </span>
        </button>
      </div>

      <!-- Mobile Timeline Layout (Vertical fallback) -->
      <div class="md:hidden flex flex-col gap-4 mb-12">
        <button v-for="(step, idx) in steps" :key="'mob-' + idx"
             @click="selectStep(idx)"
             class="flex items-center gap-4 p-4 rounded-xl border text-left cursor-pointer focus:outline-none transition-all duration-300 bg-transparent"
             :class="activeStep === idx ? 'bg-primary/5 border-primary/20 text-brand-dark font-semibold' : 'bg-white/60 border-black/5 text-brand-slate'">
          <div class="w-10 h-10 rounded-full flex items-center justify-center font-header font-bold text-xs border"
               :class="activeStep === idx ? 'bg-grad-primary text-white border-primary' : 'bg-white border-black/10'">
            0{{ idx + 1 }}
          </div>
          <span class="text-xs uppercase font-bold font-header tracking-wider">{{ step.shortTitle }}</span>
        </button>
      </div>

      <!-- Interactive Step Mockup Card Details (Harmonized Outer Radius: rounded-[32px]) -->
      <div class="max-w-[760px] mx-auto">
        <transition name="fade-slide" mode="out-in">
          <div :key="activeStep" class="card-glass p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center min-h-[300px] rounded-[32px]">
            <!-- Text Content -->
            <div class="flex-1 text-left">
              <span class="text-[9px] font-bold font-header text-primary uppercase tracking-widest">Step 0{{ activeStep + 1 }}</span>
              <h3 class="text-2xl font-bold font-header text-brand-dark mt-2 mb-4">{{ steps[activeStep].title }}</h3>
              <p class="text-sm text-brand-slate font-body leading-relaxed mb-6">{{ steps[activeStep].desc }}</p>
              
              <!-- Check points -->
              <div class="space-y-2.5">
                <div v-for="(point, pIdx) in steps[activeStep].bulletPoints" :key="pIdx" class="flex items-center gap-2.5">
                  <div class="w-4 h-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <PhCheck :size="10" weight="bold" />
                  </div>
                  <span class="text-xs font-semibold font-body text-brand-dark opacity-90">{{ point }}</span>
                </div>
              </div>
            </div>

            <!-- Dynamic UI Mockup Panel (Nested Radius: rounded-2xl) -->
            <div class="flex-grow-0 flex-shrink-0 w-full md:w-[320px] flex items-center justify-center">
              <!-- Visual Mockup Container (Harmonized Radius: rounded-2xl) -->
              <div class="w-full h-[210px] bg-white border border-black/10 rounded-2xl p-4 shadow-glass relative overflow-hidden flex flex-col justify-between">
                <div class="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent"></div>
                
                <!-- Mockup Header -->
                <div class="flex justify-between items-center border-b border-black/5 pb-2.5">
                  <div class="flex items-center gap-2">
                    <div class="w-2.5 h-2.5 rounded-full bg-slate-200 flex items-center justify-center">
                      <span class="w-1.5 h-1.5 rounded-full" :class="activeStep === 0 ? 'bg-red-500 animate-pulse' : 'bg-slate-400'"></span>
                    </div>
                    <span class="text-[9px] font-mono text-brand-slate select-none">{{ steps[activeStep].mockupHeader }}</span>
                  </div>
                  <span class="text-[8px] font-bold font-header uppercase tracking-wider text-brand-slate opacity-75">{{ steps[activeStep].mockupMeta }}</span>
                </div>

                <!-- Mockup Dynamic Center -->
                <div class="flex-grow flex flex-col justify-center py-4">
                  <!-- Step 1: Capture Widget -->
                  <div v-if="activeStep === 0" class="flex flex-col gap-3 items-center">
                    <div class="text-xs font-bold text-brand-dark">Google Meet recording...</div>
                    <div class="flex gap-1.5 items-center">
                      <span class="w-2 h-4 bg-primary/80 rounded animate-voice-bounce" style="animation-delay: 0.1s"></span>
                      <span class="w-2 h-6 bg-primary/80 rounded animate-voice-bounce" style="animation-delay: 0.2s"></span>
                      <span class="w-2 h-8 bg-secondary/80 rounded animate-voice-bounce" style="animation-delay: 0.3s"></span>
                      <span class="w-2 h-5 bg-primary/80 rounded animate-voice-bounce" style="animation-delay: 0.4s"></span>
                      <span class="w-2 h-3 bg-primary/80 rounded animate-voice-bounce" style="animation-delay: 0.5s"></span>
                    </div>
                  </div>

                  <!-- Step 2: Digest Widget -->
                  <div v-else-if="activeStep === 1" class="space-y-2 text-left">
                    <div class="flex justify-between text-[8px] font-bold uppercase text-secondary">
                      <span>Analyzing Transcript</span>
                      <span>90% Complete</span>
                    </div>
                    <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div class="h-full w-4/5 bg-secondary rounded-full"></div>
                    </div>
                    <div class="text-[10px] text-brand-slate italic">"Finalizing deployment details next Tuesday..."</div>
                  </div>

                  <!-- Step 3: Sync Widget -->
                  <div v-else-if="activeStep === 2" class="flex items-center gap-3 justify-center">
                    <!-- Harmonized inner radius: rounded-lg -->
                    <div class="p-2 bg-slate-50 border border-black/5 rounded-lg text-center shadow-sm">
                      <span class="text-[8px] font-bold text-brand-slate block mb-1">SmartMeet</span>
                      <div class="w-8 h-8 rounded bg-primary flex items-center justify-center text-white text-xs font-bold font-header select-none">SM</div>
                    </div>
                    <!-- Traveling arrow -->
                    <div class="flex flex-col items-center">
                      <span class="text-[8px] font-bold text-green-600 uppercase tracking-widest mb-1">Syncing</span>
                      <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                        <path d="M0 6H34M34 6L29 1M34 6L29 11" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                          <animate attributeName="stroke-dasharray" values="40;0" dur="1s" repeatCount="indefinite" />
                        </path>
                      </svg>
                    </div>
                    <!-- Harmonized inner radius: rounded-lg -->
                    <div class="p-2 bg-slate-50 border border-black/5 rounded-lg text-center shadow-sm">
                      <span class="text-[8px] font-bold text-brand-slate block mb-1">Slack Dev</span>
                      <div class="w-8 h-8 rounded bg-[#4a154b] flex items-center justify-center text-white text-xs font-bold font-header select-none">S</div>
                    </div>
                  </div>

                  <!-- Step 4: AI Conversational Search -->
                  <div v-else-if="activeStep === 3" class="space-y-2 text-left">
                    <!-- Harmonized inner radius: rounded-lg -->
                    <div class="p-2 bg-slate-50 border border-black/5 rounded-lg flex gap-2">
                      <span class="text-[10px] font-bold text-primary">Q:</span>
                      <span class="text-[10px] font-medium text-brand-dark">What did we agree?</span>
                    </div>
                    <!-- Harmonized inner radius: rounded-lg -->
                    <div class="p-2 bg-primary/5 border border-primary/10 rounded-lg flex gap-2">
                      <span class="text-[10px] font-bold text-secondary">A:</span>
                      <span class="text-[9px] text-brand-dark leading-relaxed font-body">Launch on Wednesday post staging approval.</span>
                    </div>
                  </div>
                </div>

                <!-- Mockup Footer -->
                <div class="text-[8px] text-brand-slate font-mono flex justify-between border-t border-black/5 pt-2">
                  <span>SSL encrypted</span>
                  <span>ID: SM_0{{ activeStep + 1 }}</span>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { PhCheck } from '@phosphor-icons/vue'

const activeStep = ref(0)

const steps = [
  {
    shortTitle: 'Record & Feed',
    title: 'Continuous Capture Engine',
    desc: 'Connect SmartMeet directly with Google Meet, Microsoft Teams, or Zoom. Audio streams are seamlessly grabbed and stored in a secure sandbox without distracting participants.',
    bulletPoints: [
      'Zero-bot joining or clean link sharing',
      'Dual-channel stereo audio separation',
      'Encrypted cloud storage buffers'
    ],
    mockupHeader: 'meet.google.com/xyz',
    mockupMeta: 'audio input active'
  },
  {
    shortTitle: 'Process & Extract',
    title: 'AI Semantic Decomposition',
    desc: 'Our model breaks down transcription outputs, clusters topics, maps speakers, identifies action owners, and generates structured executive summaries and timelines.',
    bulletPoints: [
      'Custom vocabulary training included',
      'Sentence mapping by intent categories',
      'Automated key decisions highlight logs'
    ],
    mockupHeader: 'analysis-engine.smartmeet.ai',
    mockupMeta: 'compiling weights'
  },
  {
    shortTitle: 'Sync & Integrate',
    title: 'Instant Downstream Dispatch',
    desc: 'Tasks and action points are dynamically mapped to owners and dispatched directly to project managers like Jira, Notion, Slack, and Linear.',
    bulletPoints: [
      'Automatic assignee detection',
      'Bilateral sync: updates in Jira sync back',
      'Formatted Markdown notifications'
    ],
    mockupHeader: 'integrations.smartmeet.ai',
    mockupMeta: 'webhook dispatch ok'
  },
  {
    shortTitle: 'Query & Retain',
    title: 'Team Conversational Memory',
    desc: 'Retrieve contextual details across months of historical meetings. Ask natural questions, jump to direct timestamps, and keep alignment high.',
    bulletPoints: [
      'Natural language conversation prompt',
      'Precise video playback time links',
      'Knowledge sharing across departments'
    ],
    mockupHeader: 'memory-search.smartmeet.ai',
    mockupMeta: 'index: 4,200 syncs'
  }
]

let stepInterval = null

const selectStep = (index) => {
  activeStep.value = index
  resetInterval()
}

const startInterval = () => {
  stepInterval = setInterval(() => {
    activeStep.value = (activeStep.value + 1) % steps.length
  }, 7000)
}

const resetInterval = () => {
  if (stepInterval) clearInterval(stepInterval)
  startInterval()
}

onMounted(() => {
  startInterval()
})

onUnmounted(() => {
  if (stepInterval) clearInterval(stepInterval)
})
</script>

<style scoped>
/* High-performance non-clipped background glows */
.workflow-section {
  background: radial-gradient(circle at 10% 20%, rgba(75, 104, 255, 0.05) 0%, rgba(255, 255, 255, 0) 50%),
              radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.05) 0%, rgba(255, 255, 255, 0) 50%);
}

/* Animations */
@keyframes voiceBounce {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.4); }
}

.animate-voice-bounce {
  animation: voiceBounce 1.2s ease-in-out infinite;
  transform-origin: center;
}

/* Fade Slide Transitions using cubic-bezier for buttery-smooth feeling */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.99);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-12px) scale(0.99);
}
</style>
