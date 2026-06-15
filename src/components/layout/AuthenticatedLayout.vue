<template>
  <div class="w-[100%] max-w-[100%] m-[0px] p-[0px] overflow-x-hidden">
    <div class="flex min-h-[100vh] w-[100%] bg-brand-bg relative text-left">
      <!-- Reusable Sidebar -->
      <Sidebar />
      
      <!-- MAIN SCROLLABLE CONTENT AREA -->
      <main class="flex-1 mt-[80px] ml-[260px] min-h-[100vh] px-[32px] sm:px-[48px] py-[32px] bg-brand-bg relative overflow-y-auto w-[calc(100%-260px)]">
        <!-- TOP INNER HEADER NAVIGATION -->
        <div class="fixed left-[260px] right-[0px] top-[20px] px-[32px] sm:px-[48px] z-[40]">
          <header class="flex items-center justify-between px-[28px] py-[10px] rounded-full bg-white/65 border border-white/70 shadow-glass backdrop-blur-[20px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-white/85 hover:bg-white/75 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.08),0_0_20px_rgba(75,104,255,0.05)]">
            <nav class="flex items-center gap-[24px]">
              <router-link to="/" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Home</router-link>
              <router-link to="/features" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Features</router-link>
              <router-link to="/pricing" class="text-[12px] font-semibold text-brand-slate hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Pricing</router-link>
              <router-link to="/dashboard" class="text-[12px] font-semibold py-[6px] px-[14px] rounded-full text-primary bg-primary/5 border border-primary/10">Dashboard</router-link>
            </nav>
            
            <div class="flex items-center gap-[16px] w-64 md:w-80">
              <!-- Reusable SearchBar -->
              <SearchBar 
                v-model="searchQuery" 
                placeholder="Search everything..." 
              />
              
              <button 
                class="px-[20px] py-[10px] rounded-full bg-white border border-black/8 text-brand-dark font-header font-bold text-[12px] tracking-wider uppercase hover:bg-black/5 hover:border-black/15 active:scale-[0.98] transition-all duration-300 cursor-pointer focus:outline-none flex-shrink-0"
                @click="logout"
              >
                Log Out
              </button>
            </div>
          </header>
        </div>

        <!-- Inner Route Page Outlet with transition -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in" @after-leave="onAfterLeave">
            <component :is="Component" :search-query="searchQuery" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import SearchBar from '../ui/SearchBar.vue'

const router = useRouter()
const searchQuery = ref('')

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
