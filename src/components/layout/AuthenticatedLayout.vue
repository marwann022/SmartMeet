<template>
  <div class="min-h-screen bg-brand-bg relative overflow-x-hidden flex">
    <!-- Left Sidebar -->
    <Sidebar />
    
    <!-- MAIN SCROLLABLE CONTENT AREA -->
    <!-- Main content: offset by 260px desktop sidebar, 76px compact sidebar (always visible below 850px) -->
    <main 
      class="flex-1 mt-[80px] min-h-[calc(100vh-80px)] px-[32px] sm:px-[48px] pb-[16px] bg-brand-bg relative overflow-y-auto flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      :class="[
        uiStore.sidebarOpen ? 'ml-[260px] w-[calc(100%-260px)]' : 'ml-0 w-full',
        'compact:ml-[76px] compact:w-[calc(100%-76px)]'
      ]"
    >
      <!-- TOP INNER HEADER NAVIGATION -->
      <div 
        class="fixed right-[0px] top-[20px] px-[32px] sm:px-[48px] z-[40] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        :class="[
          uiStore.sidebarOpen ? 'left-[260px]' : 'left-[0px]',
          'compact:left-[76px]'
        ]"
      >
        <header class="flex items-center justify-between px-[28px] py-[10px] rounded-full bg-white/65 border border-white/70 shadow-glass backdrop-blur-[20px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-white/85 hover:bg-white/75 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.08),0_0_20px_rgba(75,104,255,0.05)]">
          <nav class="flex items-center gap-[24px]">


            <router-link to="/" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Home</router-link>
            <router-link to="/features" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Features</router-link>
            <router-link to="/pricing" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Pricing</router-link>
            <router-link to="/dashboard" class="text-[12px] font-semibold py-[6px] px-[14px] rounded-full text-primary bg-primary/5 border border-primary/10">Dashboard</router-link>
          </nav>
          
          <div class="flex items-center gap-[16px]">
            <button 
              class="px-[20px] py-[10px] rounded-full bg-white border border-black/8 text-brand-dark font-header font-bold text-[12px] tracking-wider uppercase hover:bg-black/5 hover:border-black/15 active:scale-[0.98] transition-all duration-300 cursor-pointer focus:outline-none flex-shrink-0"
              @click="logout"
            >
              Log Out
            </button>
          </div>
        </header>
      </div>

      <div class="flex-1 flex flex-col">
        <!-- Inner Route Page Outlet with transition -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in" @after-leave="onAfterLeave">
            <component :is="Component" :search-query="searchQuery" />
          </transition>
        </router-view>
      </div>

      <!-- Shared App Footer -->
      <footer class="flex justify-between items-center text-[9px] font-bold text-brand-slate tracking-wide uppercase mt-[48px] pt-[16px] pb-[4px] border-t border-black/5 flex-shrink-0 w-full">
        <span>© 2026 SmartMeet AI Inc. All rights reserved.</span>
        <div class="flex gap-[24px]">
          <a href="#" class="hover:text-primary transition-colors" @click.prevent>Terms of Service</a>
          <a href="#" class="hover:text-primary transition-colors" @click.prevent>Security</a>
          <a href="#" class="hover:text-primary transition-colors" @click.prevent>Cookies</a>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '../../stores/ui'
import Sidebar from './Sidebar.vue'

const router = useRouter()
const searchQuery = ref('')
const uiStore = useUiStore()

const logout = () => {
  router.push('/')
}

const onAfterLeave = () => {
  window.scrollTo(0, 0)
}
</script>

<style scoped>
/* Page transition effects */
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
