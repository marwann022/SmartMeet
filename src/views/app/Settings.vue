<template>
  <div class="flex flex-col gap-8 text-left">
    <!-- Header -->
    <div class="flex flex-col gap-2">
      <h2 class="text-3xl sm:text-4xl font-bold font-header text-brand-dark tracking-tight">Settings</h2>
      <p class="text-sm text-brand-slate max-w-2xl">
        Manage your personal information, team permissions, notification triggers, and advanced AI engine preferences.
      </p>
    </div>

    <!-- Secondary Sub-Navigation (Tabs) -->
    <div class="bg-white/40 border border-black/5 rounded-2xl p-1.5 flex flex-wrap gap-1 items-center self-start">
      <button 
        v-for="subtab in subtabs" 
        :key="subtab.id"
        @click="activeSubtab = subtab.id"
        class="px-5 py-2.5 rounded-xl font-header font-bold text-xs tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer border"
        :class="activeSubtab === subtab.id ? 'bg-primary text-white border-transparent shadow-[0_2px_8px_rgba(75,104,255,0.15)]' : 'text-brand-slate border-transparent hover:bg-black/5 hover:text-brand-dark'"
      >
        <component :is="subtab.icon" :size="16" weight="bold" />
        <span>{{ subtab.label }}</span>
      </button>
    </div>

    <!-- SUB-TABS CONTENT -->
    <div class="w-full home-view py-10">
      <General v-if="activeSubtab === 'general'" />
      <Profile v-else-if="activeSubtab === 'profile'" />
      <TeamManagement v-else-if="activeSubtab === 'team'" />
      <Notifications v-else-if="activeSubtab === 'notifications'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  PhGauge, 
  PhUserCircle, 
  PhUsersThree, 
  PhBell 
} from '@phosphor-icons/vue'

import General from '@/components/settings/General.vue'
import Profile from '@/components/settings/Profile.vue'
import TeamManagement from '@/components/settings/TeamManagement.vue'
import Notifications from '@/components/settings/Notifications.vue'

// Subtabs definition
const subtabs = [
  { id: 'general', label: 'General Settings', icon: PhGauge },
  { id: 'profile', label: 'Profile Settings', icon: PhUserCircle },
  { id: 'team', label: 'Team Management', icon: PhUsersThree },
  { id: 'notifications', label: 'Notifications', icon: PhBell }
]

const activeSubtab = ref('general')
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.35s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
