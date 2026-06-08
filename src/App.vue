<template>
  <div class="w-full">
    <main class="min-h-[70vh]">
      <transition name="fade" mode="out-in" @after-leave="onAfterLeave">
        <component :is="activeComponent" @navigate="handleNavigate" />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Home from './views/Home.vue'
import SignIn from './views/SignIn.vue'
import SignUp from './views/SignUp.vue'
import Dashboard from './views/Dashboard.vue'
import Pricing from './views/Pricing.vue'

const currentPage = ref('home')

const activeComponent = computed(() => {
  switch (currentPage.value) {
    case 'signin':
      return SignIn
    case 'signup':
      return SignUp
    case 'dashboard':
      return Dashboard
    case 'pricing':
      return Pricing
    case 'home':
    default:
      return Home
  }
})

const handleNavigate = (page) => {
  if (page.includes('#')) {
    const [targetPage, targetId] = page.split('#')
    currentPage.value = targetPage
    setTimeout(() => {
      const el = document.getElementById(targetId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 120)
  } else {
    currentPage.value = page
  }
}

const onAfterLeave = () => {
  window.scrollTo(0, 0)
}
</script>

<style>
/* Page shell transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
