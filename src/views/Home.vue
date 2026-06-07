<template>
  <div class="page-shell">
    <Navbar activePage="home" @navigate="$emit('navigate', $event)" />
    <div class="home-view">
      <Hero @navigate="$emit('navigate', $event)" />
      <BentoGrid />
      <Workflow />
      
      <Integrations />
      
      <Testimonials />
      <CTA @navigate="$emit('navigate', $event)" />
    </div>
    <Footer @navigate="$emit('navigate', $event)" />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import Hero from '../components/sections/Hero.vue'
import BentoGrid from '../components/sections/BentoGrid.vue'
import Workflow from '../components/sections/Workflow.vue'
import Integrations from '../components/sections/Integrations.vue'
import Testimonials from '../components/sections/Testimonials.vue'
import CTA from '../components/sections/CTA.vue'

defineEmits(['navigate'])
</script>
