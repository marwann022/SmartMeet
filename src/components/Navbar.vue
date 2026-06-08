<template>
  <header class="sticky top-5 z-[100] flex items-center justify-between px-7 py-2.5 rounded-full bg-white/65 border border-white/70 shadow-glass backdrop-blur-[20px] mt-5 mb-8 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-white/85 hover:bg-white/75 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.08),0_0_20px_rgba(75,104,255,0.05)]">
    <!-- Logo -->
    <div class="flex items-center transition-all duration-300 hover:scale-[1.02] cursor-pointer" @click="$emit('navigate', 'home')">
      <img src="../assets/new logo.png" alt="SmartMeet" class="h-10 block" />
    </div>

    <!-- Navigation Links -->
    <nav class="flex items-center gap-6">
      <a 
        href="#product" 
        class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5" 
        :class="{ 'text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]': activePage === 'home' }" 
        @click.prevent="$emit('navigate', 'home')"
      >
        Home
      </a>
      <a 
        href="#product" 
        class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5" 
        @click.prevent="$emit('navigate', 'home#product')"
      >
        Features
      </a>
      <a 
        href="#pricing" 
        class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5" 
        :class="{ 'text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]': activePage === 'pricing' }" 
        @click.prevent="$emit('navigate', 'pricing')"
      >
        Pricing
      </a>
      <a 
        href="#dashboard" 
        class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5" 
        :class="{ 'text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]': activePage === 'dashboard' }" 
        @click.prevent="$emit('navigate', 'dashboard')"
      >
        Dashboard
      </a>
    </nav>

    <!-- Right section -->
    <div class="flex items-center gap-4">
      <button class="group bg-black/5 border border-black/10 rounded-full flex items-center justify-center w-9 h-9 cursor-pointer relative text-brand-slate transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105" aria-label="Notifications">
        <PhBell :size="18" weight="bold" class="transition-colors duration-300 text-brand-slate group-hover:text-primary" />
        <span class="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(75,104,255,1)]"></span>
      </button>

      <div class="flex items-center gap-2.5 cursor-pointer" @click="$emit('navigate', 'dashboard')" title="Go to Dashboard">
        <img src="../assets/User Profile.png" alt="Profile" class="w-9 h-9 rounded-full object-cover border border-white/80 shadow-sm transition-all duration-300 hover:scale-105" />
        <div class="flex flex-col text-left">
          <span class="text-[11px] font-bold text-brand-dark leading-tight">Alex Chen</span>
          <span class="text-[9px] font-extrabold text-primary tracking-wider uppercase">Pro Tier</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { PhBell } from '@phosphor-icons/vue'

defineProps({
  activePage: {
    type: String,
    default: 'home'
  }
})

defineEmits(['navigate'])
</script>
