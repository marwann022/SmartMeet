<template>
  <section
    class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center pb-20 relative"
  >
    <!-- Left Side -->
    <div class="flex flex-col items-start text-left">
      <span
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary font-header text-[10px] font-bold tracking-[0.14em] uppercase mb-8"
      >
        <span class="text-secondary animate-pulse"> ✦ </span>

        AI POWERED MEETING INTELLIGENCE
      </span>

      <h1
        class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-7 font-header"
      >
        Meetings become

        <span
          class="bg-grad-text bg-clip-text text-transparent animate-text-shine font-extrabold"
        >
          company knowledge.
        </span>
      </h1>

      <p class="text-lg leading-relaxed text-brand-slate max-w-[600px] mb-10">
        SmartMeet automatically captures decisions, generates action items, and
        creates a searchable memory layer for your organization.
      </p>

      <!-- Buttons -->
      <div class="flex flex-wrap gap-4 mb-8">
        <Button variant="primary" @click="$router.push('/signup')">
          Start Free Trial

          <template #icon-right>
            <PhArrowRight
              :size="14"
              weight="bold"
              class="ml-1.5 transition-transform duration-300 group-hover:translate-x-1"
            />
          </template>
        </Button>

        <Button variant="outline" @click="playDemoVideo">
          <template #icon-left>
            <PhPlay :size="14" weight="fill" class="mr-1.5" />
          </template>

          Watch Demo
        </Button>
      </div>

      <!-- Social Proof -->
      <div class="flex flex-wrap gap-6 text-sm text-brand-slate">
        <span>✓ 2,500+ Teams</span>
        <span>✓ 40,000 Meetings Processed</span>
        <span>✓ 120,000 Tasks Generated</span>
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex justify-center relative">
      <!-- Floating Card -->
      <div
        class="absolute top-8 -left-[150px] card-glass px-5 py-4 rounded-2xl animate-float-slow"
      >
        <div class="text-xs text-brand-slate mb-1">Alignment Score</div>

        <div class="text-xl font-bold text-primary">92%</div>
      </div>

      <!-- Floating Card -->
      <div
        class="absolute bottom-20 -right-[150px] card-glass px-5 py-4 rounded-2xl animate-float-reverse"
      >
        <div class="text-xs text-brand-slate mb-1">Tasks Generated</div>

        <div class="text-xl font-bold text-secondary">+18</div>
      </div>

      <!-- Main Visual -->
      <div
        class="w-full max-w-[500px] h-[520px] rounded-[32px] relative overflow-hidden bg-white/45 border border-white/60 shadow-glass backdrop-blur-md flex items-center justify-center transition-all duration-700 hover:-translate-y-2 hover:shadow-card-hover"
      >
        <!-- Glow -->
        <div
          class="absolute w-[260px] h-[260px] bg-primary/20 rounded-full blur-[90px] animate-pulse"
        ></div>

        <!-- Sphere -->
        <div class="w-[85%] animate-float">
          <img
            src="../../assets/AI Visualization.png"
            alt="AI Intelligence"
            class="w-full object-contain"
          />
        </div>

        <!-- Processing Card -->
        <div class="absolute bottom-6 left-6 right-6">
          <div
            class="backdrop-blur-xl bg-white/85 border border-white rounded-2xl p-4 flex items-center gap-4"
          >
            <div
              class="w-10 h-10 rounded-full bg-grad-primary flex items-center justify-center"
            >
              <PhCheck :size="16" weight="bold" class="text-white" />
            </div>

            <div class="flex-1">
              <div class="text-xs font-bold mb-2">
                AI Processing Strategy Sync
              </div>

              <div
                class="w-full h-[6px] bg-black/5 rounded-full overflow-hidden"
              >
                <div class="h-full w-[75%] bg-grad-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { PhArrowRight, PhPlay, PhCheck } from "@phosphor-icons/vue";

import Button from "../ui/Button.vue";

const playDemoVideo = () => {
  alert("SmartMeet demo");
};
</script>

<style scoped>
@keyframes floatAnim {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-12px);
  }
}

@keyframes floatReverse {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(12px);
  }
}

.animate-float {
  animation: floatAnim 5s ease-in-out infinite;
}

.animate-float-slow {
  animation: floatAnim 7s ease-in-out infinite;
}

.animate-float-reverse {
  animation: floatReverse 6s ease-in-out infinite;
}
</style>
