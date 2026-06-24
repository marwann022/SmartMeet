<template>
  <div class="home-view relative z-10">
    <Hero />

    <BentoGrid />

    <Workflow />

    <Integrations />

    <Testimonials />

    <!-- Closing CTA Section (Light Premium Theme) -->
    <section class="cta-section py-20 relative overflow-hidden">
      <div class="max-w-4xl mx-auto px-4 text-center relative z-10">
        <!-- Harmonized Outer Radius: rounded-[32px] -->
        <div class="p-12 md:p-16 rounded-[32px] card-glass relative overflow-hidden">
          <!-- Subtle Grid overlay inside card -->
          <div class="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>
          
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-[10px] font-bold tracking-wider uppercase mb-6 font-header">
            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            Supercharge Your Team
          </span>
          
          <h2 class="text-3xl sm:text-5xl font-header font-bold text-brand-dark tracking-tight mb-4 leading-tight">
            Stop taking notes.<br>Start capturing knowledge.
          </h2>
          
          <p class="text-base sm:text-lg text-brand-slate max-w-xl mx-auto mb-10 leading-relaxed font-body">
            Join thousands of modern product, engineering, and sales teams using SmartMeet to automate meeting insights and build search-ready company alignment.
          </p>
          
          <div class="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button variant="primary" size="lg" @click="$router.push('/signup')">
              Start Free Trial
              <template #icon-right>
                <PhArrowRight :size="14" weight="bold" />
              </template>
            </Button>
            <span class="text-xs text-brand-slate font-semibold uppercase tracking-wider font-header">No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { PhArrowRight } from '@phosphor-icons/vue'
import Hero from '@/components/landing/Hero.vue'
import BentoGrid from '@/components/landing/BentoGrid.vue'
import Workflow from '@/components/landing/Workflow.vue'
import Integrations from '@/components/landing/Integrations.vue'
import Testimonials from '@/components/landing/Testimonials.vue'
import Button from '@/components/ui/Button.vue'
</script>

<style scoped>
/* High-performance non-clipped background glows */
.cta-section {
  background: radial-gradient(circle at 50% 50%, rgba(75, 104, 255, 0.04) 0%, rgba(255, 255, 255, 0) 65%);
}
</style>