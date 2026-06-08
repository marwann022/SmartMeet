<template>
  <div class="w-full bg-[#f1f3f9] min-h-screen pb-[60px] relative text-left overflow-x-hidden font-body">
    
    <!-- NAVIGATION HEADER BAR -->
    <div class="max-w-[1200px] mx-auto px-[24px] pt-[24px]">
      <Navbar activePage="features" @navigate="$emit('navigate', $event)" />
    </div>

    <!-- MAIN MARKETING SECTIONS BODY -->
    <div class="max-w-[1200px] mx-auto px-[24px] flex flex-col gap-[96px] mt-[48px]">
      
      <!-- ── SECTION 1: HERO SECTION ── -->
      <section class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-[64px] items-center relative py-[48px]">
        <!-- Left details col -->
        <div class="flex flex-col items-start text-left">
          <div class="backdrop-blur-[8px] bg-white/40 border border-white/80 rounded-[100px] px-[16px] py-[6px] shadow-[0_2px_10px_rgba(75,104,255,0.02)] flex items-center mb-[24px]">
            <span class="bg-grad-text bg-clip-text text-transparent font-header font-bold text-[13px] tracking-wide uppercase">
              NEW: SmartMeet Engine 2.0
            </span>
          </div>
          <h1 class="text-[36px] sm:text-[46px] lg:text-[54px] font-bold tracking-tight leading-[1.1] mb-[24px] font-header text-brand-dark">
            Intelligence for every<br/>interaction.
          </h1>
          <p class="text-[18px] leading-relaxed text-brand-slate max-w-[580px] mb-[36px]">
            Transform your meetings into actionable knowledge with our suite of AI-powered tools designed for high-performance enterprise teams.
          </p>
          <div class="flex flex-wrap items-center gap-[16px]">
            <button 
              @click="$emit('navigate', 'signup')"
              class="px-[28px] py-[16px] rounded-[100px] bg-grad-primary text-white font-header font-bold text-[16px] tracking-wide hover:shadow-[0_4px_15px_rgba(75,104,255,0.25)] active:scale-98 transition-all cursor-pointer"
            >
              Start Free Trial
            </button>
            <button 
              @click="playDemo"
              class="px-[28px] py-[16px] rounded-[100px] bg-[#252525] text-[#e6edff] font-header font-bold text-[16px] tracking-wide hover:bg-[#1a1a1a] active:scale-98 transition-all cursor-pointer border border-[#5f5f5f]/20"
            >
              Watch Demo
            </button>
          </div>
        </div>

        <!-- Right sphere/illustration col -->
        <div class="flex justify-center relative w-full">
          <div class="w-full max-w-[480px] h-[400px] rounded-[32px] relative overflow-hidden bg-white/45 border border-white/70 shadow-glass backdrop-blur-md flex flex-col justify-center items-center group transition-all duration-300 hover:translate-y-[-4px]">
            <!-- Glowing overlay bg -->
            <div class="absolute w-[200px] h-[200px] bg-primary/10 filter blur-[50px] rounded-full pointer-events-none opacity-60"></div>
            
            <div class="w-[80%] h-[80%] absolute flex items-center justify-center animate-float">
              <img :src="aiVisualization" alt="AI Network Sphere" class="w-full h-auto object-contain filter drop-shadow-[0_4px_20px_rgba(75,104,255,0.1)]" />
            </div>

            <!-- Bottom dynamic status popup wrapper -->
            <div class="absolute bottom-[24px] left-[24px] right-[24px] z-10">
              <div class="backdrop-blur-[10px] bg-white/80 border border-white/95 px-[20px] py-[16px] rounded-[16px] flex flex-col gap-[8px] shadow-[0_10px_30px_rgba(31,38,135,0.04)]">
                <div class="flex items-center gap-[8px]">
                  <PhSparkle :size="16" class="text-primary animate-spin-slow" weight="fill" />
                  <span class="font-header text-[12px] font-bold text-brand-dark">AI INSIGHT ENGINE active</span>
                </div>
                <p class="text-[12px] leading-relaxed text-brand-slate italic text-left">
                  "The meeting reached consensus on Q3 deliverables. Task checklists synchronized automatically."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── SECTION 2: REAL-TIME INTELLIGENCE ── -->
      <section class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-[64px] items-center py-[24px]">
        <!-- Left features list -->
        <div class="flex flex-col gap-[24px] items-start">
          <div class="flex items-center gap-[12px] pb-[8px]">
            <div class="w-[36px] h-[36px] rounded-full bg-primary/8 border border-primary/15 flex items-center justify-center text-primary">
              <PhPulse :size="20" weight="bold" />
            </div>
            <h2 class="font-header font-bold text-[26px] bg-grad-text bg-clip-text text-transparent inline">
              Real-time Intelligence
            </h2>
          </div>
          <p class="text-[18px] leading-relaxed text-brand-slate max-w-[540px]">
            Stay present in your conversations while our AI handles the documentation in real-time. Never miss a nuance or a speaker shift again.
          </p>

          <div class="flex flex-col gap-[20px] w-full mt-[16px]">
            <div v-for="(feat, i) in rtFeatures" :key="i" class="flex gap-[16px] items-start p-[16px] rounded-[16px] hover:bg-white/30 transition-all duration-200">
              <div class="w-[40px] h-[40px] rounded-[12px] bg-white/80 border border-black/5 flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                <component :is="feat.icon" :size="20" weight="bold" />
              </div>
              <div class="flex flex-col text-left">
                <h4 class="font-header font-bold text-[16px] text-brand-dark">{{ feat.title }}</h4>
                <p class="text-[14px] text-brand-slate leading-relaxed mt-[4px]">{{ feat.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right image visual mockup -->
        <div class="backdrop-blur-[6px] bg-white/40 border border-white/60 p-[8px] rounded-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.02)] w-full flex justify-center items-center overflow-hidden h-[380px]">
          <div class="w-full h-full rounded-[16px] overflow-hidden relative border border-black/5 bg-white/20">
            <img :src="workflowVisualization" alt="Workflow Visual" class="w-full h-full object-cover" />
            <div class="absolute top-[20px] left-[20px] backdrop-blur-[6px] bg-primary/20 border border-primary/30 rounded-[100px] px-[12px] py-[6px]">
              <span class="font-header font-extrabold text-[10px] text-primary uppercase tracking-[1px]">LIVE TRANSCRIPT FEED</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── SECTION 3: KNOWLEDGE SYNTHESIS BENTO GRID ── -->
      <section class="flex flex-col gap-[48px] py-[24px]">
        <div class="flex flex-col items-center text-center gap-[12px]">
          <h2 class="font-header font-bold text-[28px] bg-grad-text bg-clip-text text-transparent inline">
            Knowledge Synthesis
          </h2>
          <p class="text-[18px] text-brand-slate max-w-[600px]">
            From messy conversations to structured executive reports in seconds.
          </p>
        </div>

        <!-- Bento Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-[24px] items-stretch">
          <!-- Large Left Card (Col-7) -->
          <div class="lg:col-span-7 backdrop-blur-[6px] bg-white/50 border border-white/70 rounded-[24px] p-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between gap-[24px] text-left relative overflow-hidden">
            <div class="flex flex-col gap-[16px] relative z-10">
              <div class="w-[48px] h-[48px] rounded-[16px] bg-primary/8 border border-primary/15 flex items-center justify-center text-primary">
                <PhCheckSquare :size="24" weight="bold" />
              </div>
              <h3 class="font-header font-bold text-[22px] text-brand-dark">Automated Executive Summaries</h3>
              <p class="text-[15px] text-brand-slate leading-relaxed max-w-[500px]">
                Our custom LLMs extract the core essence of every meeting, providing context-aware summaries tailored specifically for leadership review.
              </p>
            </div>

            <!-- Visual loading recap mockup -->
            <div class="bg-white/40 border border-black/[0.03] rounded-[16px] p-[20px] mt-[12px] flex flex-col gap-[14px]">
              <div class="flex items-center gap-[10px]">
                <div class="w-[24px] h-[24px] rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <PhSparkle :size="12" weight="fill" />
                </div>
                <span class="text-[11px] font-extrabold text-primary uppercase tracking-wider">AI RECAP GENERATED</span>
              </div>
              <!-- Skeleton details -->
              <div class="flex flex-col gap-[8px]">
                <div class="w-full h-[8px] bg-black/5 rounded-[4px]"></div>
                <div class="w-[90%] h-[8px] bg-black/5 rounded-[4px]"></div>
                <div class="w-[70%] h-[8px] bg-black/5 rounded-[4px]"></div>
              </div>
            </div>
            <div class="absolute w-[200px] h-[200px] bg-secondary/5 filter blur-[40px] rounded-full top-0 right-0 pointer-events-none"></div>
          </div>

          <!-- Small Right Cards Stack (Col-5) -->
          <div class="lg:col-span-5 flex flex-col gap-[24px]">
            <!-- Stack Card 1 -->
            <div class="backdrop-blur-[6px] bg-white/50 border border-white/70 rounded-[24px] p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] text-left">
              <div class="w-[36px] h-[36px] rounded-[10px] bg-green-500/8 border border-green-500/15 flex items-center justify-center text-green-600">
                <PhCheck :size="18" weight="bold" />
              </div>
              <h4 class="font-header font-bold text-[18px] text-brand-dark">Action Item Extraction</h4>
              <p class="text-[14px] text-brand-slate leading-relaxed">
                Automatically detect promises made during the call, extract tasks, and assign them directly to the right teammate.
              </p>
            </div>

            <!-- Stack Card 2 -->
            <div class="backdrop-blur-[6px] bg-white/50 border border-white/70 rounded-[24px] p-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-[12px] text-left">
              <div class="w-[36px] h-[36px] rounded-[10px] bg-secondary/8 border border-secondary/15 flex items-center justify-center text-secondary">
                <PhBrain :size="18" weight="bold" />
              </div>
              <h4 class="font-header font-bold text-[18px] text-brand-dark">Semantic Topic Sync</h4>
              <p class="text-[14px] text-brand-slate leading-relaxed">
                Sync topics and agendas dynamically. Relate historical context across months of consecutive standups automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── SECTION 4: ORGANIZATIONAL MEMORY ── -->
      <section class="grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-[64px] items-center py-[24px]">
        <!-- Left lists -->
        <div class="flex flex-col gap-[24px] items-start">
          <div class="flex flex-col items-start gap-[8px]">
            <h2 class="font-header font-bold text-[28px] bg-grad-text bg-clip-text text-transparent inline">
              Organizational Memory
            </h2>
            <p class="text-[18px] text-brand-slate leading-relaxed">
              Stop asking "didn't we talk about this three months ago?". SmartMeet AI builds a permanent, searchable database of your team's collective intelligence.
            </p>
          </div>

          <div class="flex flex-col gap-[16px] w-full mt-[12px]">
            <div v-for="(memory, idx) in memories" :key="idx" class="backdrop-blur-[6px] bg-white/40 border border-white/70 rounded-[16px] p-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-left flex flex-col gap-[6px]">
              <div class="flex items-center gap-[10px]">
                <component :is="memory.icon" :size="18" class="text-primary" />
                <span class="font-header font-bold text-[15px] text-brand-dark">{{ memory.title }}</span>
              </div>
              <p class="text-[13px] text-brand-slate leading-relaxed pl-[28px]">{{ memory.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Right brain noodle badge display -->
        <div class="flex justify-center items-center">
          <div class="border-[2px] border-dashed border-primary/20 rounded-full p-[48px] w-full max-w-[420px] aspect-square flex items-center justify-center">
            <div class="backdrop-blur-[10px] bg-white/50 border border-white/80 rounded-full shadow-[0_16px_40px_rgba(31,38,135,0.04)] w-full h-full flex flex-col items-center justify-center p-[24px] relative group overflow-hidden">
              <div class="absolute inset-[0] bg-gradient-to-r from-primary/10 to-secondary/10 opacity-30 rounded-full"></div>
              
              <div class="w-[100px] h-[100px] rounded-full overflow-hidden border border-black/5 bg-white/60 flex items-center justify-center mb-[16px] relative z-10 transition-transform duration-500 group-hover:scale-105">
                <img :src="activityTrend" alt="Activity Grid" class="w-[70%] h-auto object-contain" />
              </div>
              
              <span class="font-header font-extrabold text-[24px] text-brand-dark tracking-wide relative z-10 uppercase select-none">brain_noodle</span>
              <span class="text-[11px] text-primary font-bold mt-[4px] uppercase tracking-wider relative z-10">Active Knowledge Sync</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── SECTION 5: INTELLIGENT AUTOMATION ── -->
      <section class="backdrop-blur-[6px] bg-white/40 border border-white/60 rounded-[32px] p-[48px] shadow-[0_8px_32px_rgba(31,38,135,0.02)] flex flex-col gap-[36px]">
        <div class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-[48px] items-center">
          <!-- Left specs details -->
          <div class="flex flex-col gap-[24px] items-start">
            <h2 class="font-header font-bold text-[28px] bg-grad-text bg-clip-text text-transparent inline">
              Intelligent Automation
            </h2>
            <p class="text-[18px] text-brand-slate leading-relaxed">
              SmartMeet doesn't just record; it acts. Seamlessly bridge the gap between your conversations and your execution tools.
            </p>

            <div class="grid grid-cols-2 gap-[16px] w-full mt-[12px]">
              <div class="backdrop-blur-[6px] border border-primary/20 bg-white/60 rounded-[12px] p-[20px] text-center shadow-[0_4px_15px_rgba(0,0,0,0.01)] flex flex-col items-center">
                <span class="font-header font-bold text-[26px] text-primary leading-tight">50+</span>
                <span class="text-[14px] text-brand-slate mt-[4px]">Integrations</span>
              </div>
              <div class="backdrop-blur-[6px] border border-primary/20 bg-white/60 rounded-[12px] p-[20px] text-center shadow-[0_4px_15px_rgba(0,0,0,0.01)] flex flex-col items-center">
                <span class="font-header font-bold text-[26px] text-primary leading-tight">10k+</span>
                <span class="text-[14px] text-brand-slate mt-[4px]">Workflows</span>
              </div>
            </div>
          </div>

          <!-- Right integrations checklists -->
          <div class="flex flex-col gap-[16px] w-full">
            <div 
              v-for="(auto, idx) in automations" 
              :key="idx"
              class="backdrop-blur-[6px] bg-white border border-white/90 rounded-[16px] p-[20px] shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex justify-between items-center hover:translate-x-[2px] transition-transform duration-200 cursor-pointer"
            >
              <div class="flex gap-[12px] items-center">
                <div class="w-[44px] h-[44px] rounded-full bg-primary/8 flex items-center justify-center text-primary">
                  <component :is="auto.icon" :size="20" weight="bold" />
                </div>
                <div class="flex flex-col text-left">
                  <span class="font-header font-bold text-[15px] text-brand-dark leading-tight">{{ auto.title }}</span>
                  <span class="text-[13px] text-brand-slate mt-[4px]">{{ auto.desc }}</span>
                </div>
              </div>
              <PhArrowRight :size="16" class="text-brand-slate" weight="bold" />
            </div>
          </div>
        </div>
      </section>

      <!-- ── SECTION 6: FINAL CTA CARD ── -->
      <section class="backdrop-blur-[6px] border border-primary/30 rounded-[24px] p-[48px] text-center flex flex-col gap-[20px] relative overflow-hidden" style="background-image: linear-gradient(105deg, rgba(64, 128, 245, 0.04) 0%, rgba(129, 96, 246, 0.04) 100%)">
        <h2 class="font-header font-bold text-[32px] sm:text-[36px] text-brand-dark tracking-tight">
          Ready to upgrade your meetings?
        </h2>
        <p class="text-[16px] sm:text-[18px] text-brand-slate max-w-[500px] mx-auto leading-relaxed">
          Join over 5,000 high-performance teams who have already eliminated meeting fatigue with SmartMeet AI.
        </p>
        <div class="mt-[12px]">
          <button 
            @click="$emit('navigate', 'signup')"
            class="px-[36px] py-[16px] rounded-[12px] bg-grad-primary text-white font-header font-bold text-[16px] shadow-[0_4px_15px_rgba(75,104,255,0.2)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.3)] active:scale-98 transition-all cursor-pointer"
          >
            Start Free Trial
          </button>
        </div>
      </section>

    </div>

    <!-- FOOTER NAV LINK SHELL -->
    <div class="max-w-[1200px] mx-auto px-[24px] mt-[48px]">
      <Footer @navigate="$emit('navigate', $event)" />
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  PhSparkle, 
  PhPulse, 
  PhCheck, 
  PhCheckSquare, 
  PhBrain, 
  PhClockClockwise, 
  PhArrowRight, 
  PhFolderSimple, 
  PhArrowsMerge, 
  PhEnvelopeSimple, 
  PhLightning, 
  PhGlobe, 
  PhHeartbeat,
  PhMagnifyingGlass
} from '@phosphor-icons/vue'

import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'

// Import assets
import aiVisualization from '../assets/AI Visualization.png'
import workflowVisualization from '../assets/Workflow Visualization.png'
import activityTrend from '../assets/Activity Trend.png'

defineEmits(['navigate'])

const playDemo = () => {
  alert('Playing SmartMeet Engine 2.0 demonstration...')
}

const rtFeatures = [
  { 
    title: "Live Transcription", 
    desc: "Advanced speaker identification with 99.9% accuracy across 40+ languages.", 
    icon: PhGlobe 
  },
  { 
    title: "Sentiment Analysis", 
    desc: "Track engagement levels and emotional resonance throughout the session.", 
    icon: PhHeartbeat 
  },
  { 
    title: "Rolling Summaries", 
    desc: "Summaries that evolve as the meeting progresses, perfect for late-joiners.", 
    icon: PhClockClockwise 
  }
]

const memories = [
  { 
    title: "Semantic Search", 
    desc: "Search by intent, not just keywords. Find 'that time we discussed the pricing strategy' even if the word 'pricing' wasn't used.", 
    icon: PhMagnifyingGlass 
  },
  { 
    title: "Knowledge Graph", 
    desc: "See how projects evolve through a visual map of interconnected meeting topics and decision nodes.", 
    icon: PhBrain 
  },
  { 
    title: "AI-Generated Folders", 
    desc: "Meetings automatically organize themselves into workspaces based on content, team, and project context.", 
    icon: PhFolderSimple 
  }
]

const automations = [
  { 
    title: "Auto-sync Ecosystem", 
    desc: "Push action items automatically to Notion, Jira, and Slack.", 
    icon: PhArrowsMerge 
  },
  { 
    title: "Automated Follow-ups", 
    desc: "AI drafts personalized follow-up emails for you to review and send.", 
    icon: PhEnvelopeSimple 
  },
  { 
    title: "Workflow Triggers", 
    desc: "Trigger custom webhooks and workflows based on meeting decisions.", 
    icon: PhLightning 
  }
]
</script>

<style scoped>
.bg-grad-primary {
  background: linear-gradient(135deg, #3c81f5 0%, #845ff6 100%);
}

.bg-grad-text {
  background: linear-gradient(135deg, #3c81f5 0%, #845ff6 100%);
}

.animate-spin-slow {
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

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
</style>
