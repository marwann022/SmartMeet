<template>
  <!--
    Responsive sidebar: full 260px on desktop (≥850px), compact 76px icon-only below 850px.
    `compact:` utilities apply only when screen width < 850px (see tailwind.config.js).
  -->
  <aside 
    class="w-[260px] h-[100vh] fixed top-[0px] bottom-[0px] bg-white/75 dark:bg-slate-900/75 border-r border-black/5 dark:border-white/5 backdrop-blur-[20px] z-50 flex flex-col justify-between p-[24px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] compact:hidden"
    :class="[
      uiStore.sidebarOpen ? 'left-[0px]' : 'left-[-260px]'
    ]"
  >
    <!-- Collapse toggle: desktop only — hidden in compact mode where sidebar stays fixed & visible -->
    <button 
      @click="uiStore.toggleSidebar"
      class="absolute top-[32px] w-[26px] h-[26px] rounded-full bg-white/90 dark:bg-slate-800/90 border border-black/8 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(75,104,255,0.15)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-primary/20 active:scale-95 cursor-pointer focus:outline-none z-[100] compact:hidden"
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
      <div class="flex items-center justify-center w-full">
        <router-link to="/" class="flex items-center justify-center transition-all duration-300 hover:scale-[1.02] cursor-pointer self-center">
          <div class="compact:w-10 compact:h-10 compact:overflow-hidden compact:rounded-lg compact:flex compact:items-center compact:justify-center">
            <img 
              src="../../assets/logo_clean.png" 
              alt="SmartMeet" 
              class="h-9 w-36 block compact:h-9 compact:w-9 compact:object-cover compact:object-left" 
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
            class="relative group inline-flex items-center justify-center gap-[8px] px-[24px] py-[12px] rounded-[12px] font-header font-bold text-[11px] tracking-wider uppercase bg-white/80 dark:bg-slate-800/80 text-brand-dark border border-black/8 dark:border-white/10 hover:bg-white dark:hover:bg-slate-700 hover:border-primary/20 hover:shadow-[0_4px_15px_rgba(31,38,135,0.04)] hover:text-primary hover:-translate-y-[2px] transition-all duration-300 w-[100%] cursor-pointer focus:outline-none compact:w-12 compact:h-12 compact:p-0 compact:rounded-xl compact:gap-0 compact:hover:-translate-y-[2px]"
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
    <router-link
      to="/settings?tab=profile"
      class="flex items-center gap-[12px] pt-[16px] border-t border-black/5 dark:border-white/5 compact:justify-center compact:gap-0 compact:pt-3 cursor-pointer group transition-opacity duration-300 hover:opacity-80"
    >
      <UserAvatar
        :user="user"
        :name="user?.name"
        size="lg"
        class="compact:w-10 compact:h-10 transition-transform duration-300 group-hover:scale-105"
      />
      <div class="flex flex-col compact:hidden">
        <span class="text-[11px] font-bold text-brand-dark leading-tight">
          {{ user?.name || "Guest User" }}
        </span>
        <div class="flex items-center gap-2 mt-1">
          <RoleBadge :role="user?.role || 'member'" />
          <span class="text-[9px] font-extrabold text-primary dark:text-blue-400 tracking-wider uppercase leading-none">
            {{ user?.plan?.replace(/ \((Monthly|Annual)\)/, '') || "Free" }}
          </span>
        </div>
      </div>
    </router-link>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import {
  PhPlus,
  PhLayout,
  PhChatDots,
  PhArchive,
  PhCheckSquare,
  PhBrain,
  PhGear,
  PhCaretLeft,
  PhUsersThree
} from '@phosphor-icons/vue'
import { useUiStore } from '../../stores/ui'
import { useMeetingStore } from '../../stores/meeting'

import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useAlertStore } from '../../stores/alert'
import RoleBadge from '../common/RoleBadge.vue'
import UserAvatar from '../common/UserAvatar.vue'

const route = useRoute()
const router = useRouter()
const uiStore = useUiStore()
const meetingStore = useMeetingStore()

const authStore = useAuthStore()
const alertStore = useAlertStore()

const user = computed(() => authStore.user)
console.log("USER DATA:", user.value)

const startInstantMeeting = async () => {
  try {
    const now = new Date()
    const meetingTitle = `Instant Meeting ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    const duration = 30
    const meetingId = Date.now()

    const newMeeting = {
      title: meetingTitle,
      description: "Quick check-in meeting created instantly.",
      type: "Personal Discussion",
      startTime: now.toISOString(),
      duration: duration,
      meetLink: `https://meet.jit.si/SmartMeet_${meetingId}`,
      participants: []
    }

    const created = await meetingStore.createMeeting(newMeeting)
    meetingStore.activeLiveMeeting = created || {
      ...newMeeting,
      id: meetingId.toString()
    }
    router.push('/live-meeting')
  } catch (err) {
    console.error('Failed to start instant meeting:', err)
    await alertStore.showAlert('Failed to start instant meeting. Please try again.', 'Error', 'danger')
  }
}

const menuTabs = [
  { id: 'dashboard', label: 'Dashboard', route: '/dashboard', icon: PhLayout },
  { id: 'knowledge', label: 'Knowledge AI', route: '/knowledge-ai', icon: PhBrain },
  { id: 'team-management', label: 'Team Management', route: '/team-management', icon: PhUsersThree },
  { id: 'archive', label: 'Archive', route: '/archive', icon: PhArchive },
  { id: 'tasks', label: 'Tasks', route: '/tasks', icon: PhCheckSquare },
  { id: 'community-chat', label: 'Community Chat', route: '/community-chat', icon: PhChatDots },
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
