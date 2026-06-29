<template>
  <div class="flex flex-col gap-8 text-left mt-8">
    <!-- Header -->
    <div class="flex flex-col gap-2">
      <h2 class="text-3xl sm:text-4xl font-bold font-header text-brand-dark tracking-tight">Settings</h2>
      <p class="text-sm text-brand-slate max-w-2xl">
        Manage your personal information, team permissions, notification triggers, and advanced AI engine preferences.
      </p>
    </div>

 <div class="bg-white/40 dark:bg-slate-900/50 border border-black/5 dark:border-white/10 rounded-2xl p-1.5 flex flex-wrap gap-1 items-center self-start w-fit max-w-full compact:p-1 compact:gap-0.5 compact:rounded-xl compact:max-w-[340px]">
  <button 
    v-for="subtab in subtabs" 
    :key="subtab.id"
    @click="activeSubtab = subtab.id"
    :aria-label="subtab.label"
    class="px-5 py-2.5 rounded-xl font-header font-bold text-xs tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer border compact:px-3 compact:py-1.5 compact:rounded-lg"
    :class="activeSubtab === subtab.id ? 'bg-primary text-white border-transparent shadow-[0_2px_8px_rgba(75,104,255,0.15)]' : 'text-brand-slate dark:text-slate-400 border-transparent hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-dark dark:hover:text-white'"
  >
    <component :is="subtab.icon" :size="14" class="compact:size-[14px]" weight="bold" />
    <span class="whitespace-nowrap">{{ subtab.label }}</span>
  </button>
</div>
    <!-- SUB-TABS CONTENT -->
    <div class="w-full home-view">
      <Profile v-if="activeSubtab === 'profile'" />
      <General v-else-if="activeSubtab === 'general'" />
      <TeamManagement v-else-if="activeSubtab === 'team'" />
      <Notifications v-else-if="activeSubtab === 'notifications'" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()

const subtabs = [
  { id: 'profile', label: 'Profile Settings', icon: PhUserCircle },
  { id: 'general', label: 'General Settings', icon: PhGauge },
  { id: 'team', label: 'Team Management', icon: PhUsersThree },
  { id: 'notifications', label: 'Notifications', icon: PhBell }
]

const activeSubtab = ref(route.query.tab || 'profile')

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    activeSubtab.value = newTab
  }
})
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
