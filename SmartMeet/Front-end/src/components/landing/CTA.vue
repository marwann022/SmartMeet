<template>
  <section id="cta" class="py-20 text-center w-full px-4">
    <div class="rounded-[32px] bg-grad-primary p-12 sm:p-16 text-white text-center relative overflow-hidden flex flex-col items-center gap-6 shadow-[0_15px_45px_rgba(75,104,255,0.2)]">
      <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold font-header tracking-tight text-white">Ready to make meetings productive?</h2>
      <p class="text-xs sm:text-sm leading-relaxed text-white/85 max-w-[500px]">
        Join 2,000+ teams using SmartMeet AI to reclaim their time and scale collective intelligence.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-4">
        <Button variant="glass" class="bg-white !text-primary hover:bg-white/95" @click="$router.push('/signup')">
          Start Free Trial
          <template #icon-right>
            <PhArrowRight :size="14" weight="bold" class="ml-1.5 transition-transform duration-300 group-hover:translate-x-1" />
          </template>
        </Button>
        <Button variant="outline" class="border-white/20 !text-white hover:bg-white/10 hover:border-white/40" @click="talkToSales">Talk to sales</Button>
      </div>
      
      <p class="text-[11px] text-white/60">No credit card required. Cancel anytime.</p>
    </div>
  </section>
</template>

<script setup>
import { PhArrowRight } from '@phosphor-icons/vue'
import Button from '../ui/Button.vue'

const talkToSales = () => {
  window.location.href = "mailto:sales@smartmeet.ai"
}
</script>
