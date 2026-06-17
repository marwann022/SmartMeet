<template>
  <aside 
    class="w-[260px] h-[100vh] fixed top-[0px] bottom-[0px] bg-white/75 border-r border-black/5 backdrop-blur-[20px] z-50 flex flex-col justify-between p-[24px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
    :class="uiStore.sidebarOpen ? 'left-[0px]' : 'left-[-260px]'"
  >
    <!-- Floating border collapse/expand toggle button -->
    <button 
      @click="uiStore.toggleSidebar"
      class="absolute top-[32px] w-[26px] h-[26px] rounded-full bg-white/90 border border-black/8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(75,104,255,0.15)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary/20 active:scale-95 cursor-pointer focus:outline-none z-[100]"
      :class="uiStore.sidebarOpen ? 'right-[-13px]' : 'right-[-32px]'"
      :title="uiStore.sidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'"
    >
      <PhCaretLeft 
        :size="12" 
        weight="bold" 
        class="text-brand-slate hover:text-primary transition-transform duration-300"
        :class="{ 'rotate-180': !uiStore.sidebarOpen }"
      />
    </button>

    <div class="flex flex-col gap-[32px]">
      <!-- Logo row -->
      <div class="flex items-center justify-between w-full">
        <router-link to="/" class="flex items-center transition-all duration-300 hover:scale-[1.02] cursor-pointer self-start">
          <img src="../../assets/new logo.png" alt="SmartMeet" class="h-[64px] w-auto block" />
        </router-link>
      </div>

      <!-- Menu items -->
      <div class="flex flex-col gap-[4px]">
        <!-- New meeting button wrapper -->
        <div class="mb-[16px]">
          <router-link 
            to="/new-meeting"
            class="inline-flex items-center justify-center gap-[8px] px-[24px] py-[12px] rounded-[12px] font-header font-bold text-[11px] tracking-wider uppercase bg-white/80 text-brand-dark border border-black/8 hover:bg-white hover:border-primary/20 hover:shadow-[0_4px_15px_rgba(31,38,135,0.04)] hover:text-primary hover:-translate-y-[2px] transition-all duration-300 w-[100%] cursor-pointer focus:outline-none"
          >
            <span>New Meeting</span>
            <PhPlus :size="14" weight="bold" />
          </router-link>
        </div>

        <!-- Navigation Links -->
        <router-link 
          v-for="tab in menuTabs" 
          :key="tab.id"
          :to="tab.route"
          class="w-[100%] py-[14px] px-[16px] rounded-[12px] flex items-center gap-[14px] font-header font-bold text-[12px] tracking-wide transition-all duration-300 border border-transparent cursor-pointer group text-left focus:outline-none"
          :class="isActive(tab.route) ? 'bg-primary/8 text-primary border-primary/8 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]' : 'text-brand-slate hover:bg-primary/4 hover:text-primary hover:translate-x-[4px]'"
        >
          <component 
            :is="tab.icon" 
            :size="20" 
            weight="bold" 
            class="transition-colors duration-300"
            :class="isActive(tab.route) ? 'text-primary' : 'text-brand-slate group-hover:text-primary'"
          />
          <span>{{ tab.label }}</span>
        </router-link>
      </div>
    </div>

    <!-- User profile section at the bottom -->
    <div class="flex items-center gap-[12px] pt-[16px] border-t border-black/5">
      <img src="../../assets/User Profile.png" alt="Profile" class="w-[44px] h-[44px] rounded-full object-cover border border-white/85 shadow-sm" />
      <div class="flex flex-col">
        <span class="text-[11px] font-bold text-brand-dark leading-tight">Alex Chen</span>
        <span class="text-[9px] font-extrabold text-primary tracking-wider uppercase">Pro Tier</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { 
  PhPlus, 
  PhLayout, 
  PhArchive, 
  PhCheckSquare, 
  PhBrain, 
  PhGear,
  PhCaretLeft
} from '@phosphor-icons/vue'
import { useUiStore } from '../../stores/ui'

const route = useRoute()
const uiStore = useUiStore()

const menuTabs = [
  { id: 'dashboard', label: 'Dashboard', route: '/dashboard', icon: PhLayout },
  { id: 'archive', label: 'Archive', route: '/archive', icon: PhArchive },
  { id: 'tasks', label: 'Tasks', route: '/tasks', icon: PhCheckSquare },
  { id: 'knowledge', label: 'Knowledge AI', route: '/knowledge-ai', icon: PhBrain },
  { id: 'settings', label: 'Settings', route: '/settings', icon: PhGear }
]

const isActive = (path) => {
  return route.path === path
}
</script>
