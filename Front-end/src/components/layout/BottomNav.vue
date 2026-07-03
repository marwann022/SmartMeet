<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 border-t border-black/5 dark:border-white/5 backdrop-blur-lg px-6 py-2 hidden compact:flex items-center justify-between shadow-lg">
    <!-- Tab 1: Dashboard -->
    <router-link to="/dashboard" class="flex flex-col items-center gap-1 flex-1 py-1 text-brand-slate transition-colors duration-300" active-class="!text-primary">
      <PhLayout :size="20" weight="bold" />
      <span class="text-[9px] font-bold font-header uppercase tracking-wider">Dashboard</span>
    </router-link>

    <!-- Tab 2: Archive -->
    <router-link to="/archive" class="flex flex-col items-center gap-1 flex-1 py-1 text-brand-slate transition-colors duration-300" active-class="!text-primary">
      <PhArchive :size="20" weight="bold" />
      <span class="text-[9px] font-bold font-header uppercase tracking-wider">Archive</span>
    </router-link>

    <!-- Tab 3: Primary Action Button (FAB - New Meeting) -->
    <div class="flex-1 flex justify-center -mt-7 relative">
      <router-link to="/new-meeting" class="w-14 h-14 rounded-full bg-primary hover:bg-primary/95 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(75,104,255,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 border-4 border-brand-bg" active-class="bg-primary/90">
        <PhPlus :size="24" weight="bold" />
      </router-link>
    </div>

    <!-- Tab 4: Tasks -->
    <router-link to="/tasks" class="flex flex-col items-center gap-1 flex-1 py-1 text-brand-slate transition-colors duration-300" active-class="!text-primary">
      <PhCheckSquare :size="20" weight="bold" />
      <span class="text-[9px] font-bold font-header uppercase tracking-wider">Tasks</span>
    </router-link>

    <!-- Tab 5: Knowledge AI -->
    <router-link to="/knowledge-ai" class="flex flex-col items-center gap-1 flex-1 py-1 text-brand-slate transition-colors duration-300" active-class="!text-primary">
      <PhBrain :size="20" weight="bold" />
      <span class="text-[9px] font-bold font-header uppercase tracking-wider">AI Brain</span>
    </router-link>
  </div>
</template>

<script setup>
import { 
  PhLayout, 
  PhArchive, 
  PhPlus, 
  PhCheckSquare, 
  PhBrain 
} from '@phosphor-icons/vue'
</script>
