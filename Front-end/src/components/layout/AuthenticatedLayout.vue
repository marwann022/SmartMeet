<template>
  <div class="min-h-screen bg-brand-bg relative overflow-x-hidden flex">
    <!-- Left Sidebar -->
    <Sidebar />
    
    <!-- Bottom Navigation Bar for Mobile -->
    <BottomNav />
    
    <!-- MAIN SCROLLABLE CONTENT AREA -->
    <!-- Main content: offset by 260px desktop sidebar, hidden below 850px -->
    <main 
      class="flex-1 mt-[80px] bg-brand-bg relative flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      :class="[
        uiStore.sidebarOpen ? 'ml-[260px] w-[calc(100%-260px)]' : 'ml-0 w-full',
        'compact:ml-0 compact:w-full',
        $route.path === '/knowledge-ai' ? 'overflow-y-hidden h-[calc(100vh-80px)] pb-0 px-[32px] sm:px-[48px] compact:h-[calc(100vh-80px-72px)] compact:pb-0' : 'overflow-y-auto min-h-[calc(100vh-80px)] px-[32px] sm:px-[48px] pb-[16px] compact:pb-24'
      ]"
    >
      <!-- TOP INNER HEADER NAVIGATION -->
      <div 
        class="fixed right-[0px] top-[20px] px-[32px] sm:px-[48px] compact:px-[16px] z-[40] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        :class="[
          uiStore.sidebarOpen ? 'left-[260px]' : 'left-[0px]',
          'compact:left-[0px]'
        ]"
      >
        <header class="flex items-center justify-between px-[28px] py-[10px] rounded-full bg-white/65 dark:bg-slate-900/65 border border-white/70 dark:border-slate-800/80 shadow-glass backdrop-blur-[20px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-white/85 dark:hover:border-slate-700 hover:bg-white/75 dark:hover:bg-slate-800/75 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.08),0_0_20px_rgba(75,104,255,0.05)] w-full">
          <!-- Mobile Brand Title -->
          <div class="hidden compact:flex items-center gap-2">
            <span class="font-header font-extrabold text-sm tracking-tight text-primary">SmartMeet</span>
          </div>

          <nav class="flex items-center gap-[24px] compact:hidden">
            <router-link to="/" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Home</router-link>
            <router-link to="/features" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Features</router-link>
            <router-link to="/pricing" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Pricing</router-link>
            <router-link to="/dashboard" class="text-[12px] font-semibold py-[6px] px-[14px] rounded-full text-primary bg-primary/5 border border-primary/10">Dashboard</router-link>
          </nav>
          
          <div class="flex items-center gap-[16px]">
            <!-- Mobile Settings Shortcut -->
            <router-link 
              to="/settings"
              class="group bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 rounded-full items-center justify-center w-9 h-9 cursor-pointer text-brand-slate hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105 transition-all duration-300 hidden compact:flex"
              title="Settings"
            >
              <PhGear :size="16" weight="bold" class="text-brand-slate group-hover:text-primary" />
            </router-link>

            <!-- Theme Toggle Button -->
            <button
              @click="uiStore.toggleTheme"
              class="group bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center w-9 h-9 cursor-pointer text-brand-slate hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105 focus:outline-none transition-all duration-300"
              :title="uiStore.theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
            >
              <span class="sr-only">Toggle theme</span>
              <!-- Moon Icon -->
              <svg
                v-if="uiStore.theme === 'light'"
                class="w-[16px] h-[16px] text-brand-slate group-hover:text-primary"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
              <!-- Sun Icon -->
              <svg
                v-else
                class="w-[16px] h-[16px] text-brand-slate group-hover:text-primary"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.072-7.072 5 5 0 01-7.072 7.072z"
                />
              </svg>
            </button>

            <button 
              class="px-[20px] py-[10px] rounded-full bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 text-brand-dark font-header font-bold text-[12px] tracking-wider uppercase hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/15 active:scale-[0.98] transition-all duration-300 cursor-pointer focus:outline-none flex-shrink-0"
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
      <footer v-if="$route.path !== '/knowledge-ai'" class="flex justify-between items-center text-[9px] font-bold text-brand-slate tracking-wide uppercase mt-[48px] pt-[16px] pb-[4px] border-t border-black/5 flex-shrink-0 w-full">
        <span>© 2026 SmartMeet AI Inc. All rights reserved.</span>
        <div class="flex gap-[24px]">
          <a href="#" class="hover:text-primary transition-colors" @click.prevent>Terms of Service</a>
          <a href="#" class="hover:text-primary transition-colors" @click.prevent>Security</a>
          <a href="#" class="hover:text-primary transition-colors" @click.prevent>Cookies</a>
        </div>
      </footer>
    </main>
    
    <!-- Reusable Modal for Logout Confirmation -->
    <Modal :show="showLogoutModal" title="Confirm Log Out" @close="showLogoutModal = false" maxWidth="sm">
      <div class="flex flex-col gap-4 text-left">
        <p class="text-brand-slate text-sm font-body">
          Are you sure you want to log out of your SmartMeet account? Any unsaved changes may be lost.
        </p>
        
        <div class="flex gap-3 pt-2">
          <Button variant="danger" class="flex-1" @click="confirmLogout">
            Log Out
          </Button>
          <Button variant="outline" class="flex-1" @click="showLogoutModal = false">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '../../stores/ui'
import Sidebar from './Sidebar.vue'
import BottomNav from './BottomNav.vue'
import { useAuthStore } from '@/stores/auth'
import { PhGear } from '@phosphor-icons/vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const searchQuery = ref('')
const uiStore = useUiStore()
const authStore = useAuthStore()

const showLogoutModal = ref(false)

const logout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  authStore.logout()
  showLogoutModal.value = false
  router.replace('/')
  window.location.reload()
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
