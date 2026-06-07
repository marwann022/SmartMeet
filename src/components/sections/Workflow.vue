<template>
  <section id="workflow" class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-center py-20 border-t border-black/5">
    <div class="flex flex-col gap-6">
      <div class="text-left mb-6">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold font-header tracking-tight mb-4 text-brand-dark">Simple, automated execution.</h2>
        <p class="text-base text-brand-slate leading-relaxed">Three simple stages to unlock collective organization intelligence.</p>
      </div>
      
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="p-6 sm:p-7 rounded-[20px] bg-white/40 border border-white/70 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-left hover:bg-white/80 hover:border-black/10"
        :class="{ 'bg-white border-primary/25 shadow-glass scale-[1.02]': currentWorkflowStep === index }"
        @click="selectStep(index)"
      >
        <div class="flex items-center gap-4 mb-3">
          <span 
            class="w-8 h-8 rounded-full bg-black/5 border border-black/5 flex items-center justify-center text-xs font-extrabold text-brand-slate transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
            :class="{ 'bg-grad-primary border-transparent text-white shadow-[0_4px_10px_rgba(75,104,255,0.15)]': currentWorkflowStep === index }"
          >
            0{{ index + 1 }}
          </span>
          <h4 class="text-base sm:text-lg font-bold font-header text-brand-dark">{{ step.title }}</h4>
        </div>
        <p 
          class="text-xs sm:text-[13px] leading-relaxed text-brand-slate pl-12 transition-colors duration-300"
          :class="{ 'text-brand-dark font-medium': currentWorkflowStep === index }"
        >
          {{ step.desc }}
        </p>
      </div>
    </div>

    <div class="flex justify-center items-center relative h-[400px] w-full">
      <img src="../../assets/Workflow Visualization.png" alt="Workflow Visualization" class="h-full w-auto object-contain filter drop-shadow-[0_4px_25px_rgba(31,38,135,0.06)]" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentWorkflowStep = ref(0)
const steps = [
  {
    title: "Record & Transcribe",
    desc: "Seamlessly capture meetings on Zoom, Meet, or Teams with 99.9% accuracy across 40+ languages."
  },
  {
    title: "AI Synthesis",
    desc: "Our LLMs generate executive summaries, highlight key moments, and identify decisions in seconds."
  },
  {
    title: "Actionable Output",
    desc: "Sync insights with Notion, Slack, or Salesforce. Turn talk into actual business momentum."
  }
]

let workflowInterval = null

const selectStep = (index) => {
  currentWorkflowStep.value = index
  resetWorkflowTimer()
}

const startWorkflowTimer = () => {
  workflowInterval = setInterval(() => {
    currentWorkflowStep.value = (currentWorkflowStep.value + 1) % steps.length
  }, 5000)
}

const resetWorkflowTimer = () => {
  if (workflowInterval) clearInterval(workflowInterval)
  startWorkflowTimer()
}

onMounted(() => {
  startWorkflowTimer()
})

onUnmounted(() => {
  if (workflowInterval) clearInterval(workflowInterval)
})
</script>
