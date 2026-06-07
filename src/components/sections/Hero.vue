<template>
  <section class="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-center py-10 lg:py-20 relative">
    <div class="flex flex-col items-start text-left">
      <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary font-header text-[10px] font-bold tracking-[0.12em] uppercase mb-7 shadow-[0_4px_12px_rgba(75,104,255,0.03)]">
        <span class="text-secondary text-[12px] animate-pulse">✦</span>
        NEXT-GEN INTELLIGENCE
      </span>
      <h1 class="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-7 font-header">
        Meetings that <span class="bg-grad-text bg-clip-text text-transparent animate-text-shine inline-block font-extrabold">work for you.</span>
      </h1>
      <p class="text-base sm:text-lg leading-relaxed text-brand-slate max-w-[550px] mb-10">
        Transform every conversation into actionable knowledge. Automate
        summaries, extract tasks, and search across all your organization’s
        voice data.
      </p>
      <div class="flex flex-wrap items-center gap-4">
        <Button variant="primary" @click="$emit('navigate', 'signup')">
          Start Free Trial
          <PhArrowRight :size="14" weight="bold" class="ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
        <Button variant="secondary" outlined @click="playDemoVideo">
          <PhPlay :size="14" weight="fill" class="mr-1.5 text-brand-dark group-hover:text-primary transition-colors duration-300" />
          Watch Demo
        </Button>
      </div>
    </div>

    <!-- Sphere Visual Portal -->
    <div class="flex justify-center relative w-full">
      <div class="w-full max-w-[440px] h-[480px] rounded-[28px] relative overflow-hidden bg-white/45 border border-white/60 shadow-glass backdrop-blur-md flex flex-col justify-center items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:translate-y-[-5px] hover:rotate-[1deg] hover:border-white/90 hover:shadow-card-hover">
        <div class="absolute w-[220px] h-[220px] bg-primary/15 filter blur-[60px] rounded-full pointer-events-none opacity-50 animate-pulse"></div>
        <div class="w-[85%] h-[85%] absolute flex items-center justify-center animate-float">
          <img src="../../assets/AI Visualization.png" alt="AI Network Sphere" class="w-full h-auto object-contain filter drop-shadow-[0_4px_20px_rgba(75,104,255,0.15)]" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-brand-bg/70 to-transparent pointer-events-none"></div>
        <div class="absolute bottom-6 left-6 right-6 z-10">
          <div class="backdrop-blur-lg bg-white/85 border border-white/90 px-5 py-3.5 rounded-2xl flex items-center gap-3.5 shadow-[0_10px_30px_rgba(31,38,135,0.05)]">
            <div class="w-9 h-9 rounded-full bg-grad-primary flex items-center justify-center flex-shrink-0 shadow-[0_4px_10px_rgba(75,104,255,0.15)]">
              <PhCheck :size="16" weight="bold" class="text-white" />
            </div>
            <div class="flex flex-col gap-1.5 flex-1 text-left">
              <span class="font-header text-[11px] font-bold text-brand-dark">Summarizing Strategy Sync...</span>
              <div class="w-full h-[5px] bg-black/5 rounded-full overflow-hidden">
                <div class="h-full w-[70%] bg-grad-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { PhArrowRight, PhPlay, PhCheck } from '@phosphor-icons/vue'
import Button from '../Button.vue'

defineEmits(['navigate'])

const playDemoVideo = () => {
  alert("Simulating SmartMeet product demo walkthrough video.")
}
</script>
