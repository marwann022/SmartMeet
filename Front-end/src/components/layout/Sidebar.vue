<template>
  <!--
    Responsive sidebar: full 260px on desktop (≥850px), compact 76px icon-only below 850px.
    `compact:` utilities apply only when screen width < 850px (see tailwind.config.js).
  -->
  <aside 
    class="w-[260px] h-[100vh] fixed top-[0px] bottom-[0px] bg-white/75 border-r border-black/5 backdrop-blur-[20px] z-50 flex flex-col justify-between p-[24px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] compact:w-[76px] compact:p-3 compact:px-2"
    :class="[
      uiStore.sidebarOpen ? 'left-[0px]' : 'left-[-260px]',
      'compact:left-0'
    ]"
  >
    <!-- Collapse toggle: desktop only — hidden in compact mode where sidebar stays fixed & visible -->
    <button 
      @click="uiStore.toggleSidebar"
      class="absolute top-[32px] w-[26px] h-[26px] rounded-full bg-white/90 border border-black/8 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(75,104,255,0.15)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary/20 active:scale-95 cursor-pointer focus:outline-none z-[100] compact:hidden"
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

    <div class="flex flex-col gap-[32px] compact:gap-4">
      <!-- Logo: full wordmark on desktop, cropped icon-only in compact mode -->
      <div class="flex items-center justify-between w-full compact:justify-center">
        <router-link to="/" class="flex items-center transition-all duration-300 hover:scale-[1.02] cursor-pointer self-start compact:self-center">
          <div class="compact:w-10 compact:h-10 compact:overflow-hidden compact:rounded-lg compact:flex compact:items-center compact:justify-center">
            <img 
              src="../../assets/new logo.png" 
              alt="SmartMeet" 
              class="h-[64px] w-auto block compact:h-10 compact:w-10 compact:object-cover compact:object-left" 
            />
          </div>
        </router-link>
      </div>

      <!-- Navigation menu -->
      <div class="flex flex-col gap-[4px] compact:gap-1">
        <!-- New Meeting: full button on desktop, 48×48 icon button in compact mode -->
        <div class="mb-[16px] compact:mb-2 compact:flex compact:justify-center">
          <router-link 
            to="/new-meeting"
            aria-label="New Meeting"
            class="relative group inline-flex items-center justify-center gap-[8px] px-[24px] py-[12px] rounded-[12px] font-header font-bold text-[11px] tracking-wider uppercase bg-white/80 text-brand-dark border border-black/8 hover:bg-white hover:border-primary/20 hover:shadow-[0_4px_15px_rgba(31,38,135,0.04)] hover:text-primary hover:-translate-y-[2px] transition-all duration-300 w-[100%] cursor-pointer focus:outline-none compact:w-12 compact:h-12 compact:p-0 compact:rounded-xl compact:gap-0 compact:hover:-translate-y-[2px]"
          >
            <span class="compact:hidden">New Meeting</span>
            <PhPlus :size="14" weight="bold" class="shrink-0 compact:scale-[1.3]" />
            <!-- Compact tooltip: page name beside sidebar -->
            <span class="sidebar-tooltip">New Meeting</span>
          </router-link>
        </div>

        <!-- Nav links: label + icon on desktop, icon-only with tooltip in compact mode -->
        <router-link 
          v-for="tab in menuTabs" 
          :key="tab.id"
          :to="tab.route"
          :aria-label="tab.label"
          class="relative group w-[100%] py-[14px] px-[16px] rounded-[12px] flex items-center gap-[14px] font-header font-bold text-[12px] tracking-wide transition-all duration-300 border border-transparent cursor-pointer text-left focus:outline-none compact:w-12 compact:h-12 compact:mx-auto compact:p-0 compact:justify-center compact:gap-0 compact:hover:translate-x-0 compact:hover:scale-105"
          :class="isActive(tab.route) ? 'bg-primary/8 text-primary border-primary/8 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]' : 'text-brand-slate hover:bg-primary/4 hover:text-primary hover:translate-x-[4px]'"
        >
          <component 
            :is="tab.icon" 
            :size="20" 
            weight="bold" 
            class="transition-colors duration-300"
            :class="isActive(tab.route) ? 'text-primary' : 'text-brand-slate group-hover:text-primary'"
          />
          <span class="compact:hidden">{{ tab.label }}</span>
          <!-- Compact tooltip: page name beside sidebar -->
          <span class="sidebar-tooltip">{{ tab.label }}</span>
        </router-link>
      </div>
    </div>

    <!-- User profile: full info on desktop, avatar-only centered in compact mode -->
    <div class="flex items-center gap-[12px] pt-[16px] border-t border-black/5 compact:justify-center compact:gap-0 compact:pt-3">
      <img
  :src="
    user?.avatar
      ? `http://localhost:5000/uploads/${user.avatar}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4B68FF&color=ffffff`
  "
  alt="Profile"
  class="w-[44px] h-[44px] rounded-full object-cover border border-white/85 shadow-sm compact:w-10 compact:h-10"
/>
      <div class="flex flex-col compact:hidden">
  <span class="text-[11px] font-bold text-brand-dark leading-tight">
    {{ user?.name || "Guest User" }}
  </span>

  <span class="text-[9px] font-extrabold text-primary tracking-wider uppercase">
    {{ user?.plan || "Free" }}
  </span>
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

import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const uiStore = useUiStore()

const authStore = useAuthStore()

const user = computed(() => authStore.user)
console.log("USER DATA:", user.value)

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

<style scoped>
/*
  Compact-mode tooltips (below 850px only).
  Positioned beside the sidebar; opacity transition on hover — no layout shift.
*/
.sidebar-tooltip {
  left: calc(100% + 12px);
  background-color: rgba(15, 23, 42, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%) scale(0.95);
  white-space: nowrap;
  border-radius: 8px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  font-family: "Montserrat", sans-serif;
  letter-spacing: 0.025em;
  padding: 6px 12px;
  opacity: 0;
  visibility: hidden;
  transition: all 200ms;
}

@media (max-width: 849px) {
  .group:hover .sidebar-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) scale(1);
  }
}
</style>
