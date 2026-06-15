<template>
  <div class="home-view py-10">
    <Hero />
    <BentoGrid />
    <Workflow />
    <Integrations />
    <Testimonials />
    <CTA />
  </div>
</template>

<script setup>
import Hero from '@/components/landing/Hero.vue'
import BentoGrid from '@/components/landing/BentoGrid.vue'
import Workflow from '@/components/landing/Workflow.vue'
import Integrations from '@/components/landing/Integrations.vue'
import Testimonials from '@/components/landing/Testimonials.vue'
import CTA from '@/components/landing/CTA.vue'
</script>
