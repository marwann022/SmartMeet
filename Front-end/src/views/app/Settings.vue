<template>
  <div class="flex flex-col gap-16 text-left mt-8">
    <!-- Page Header -->
    <div class="flex flex-col gap-2">
      <h2 class="text-3xl sm:text-4xl font-bold font-header text-brand-dark tracking-tight">Settings</h2>
      <p class="text-sm text-brand-slate max-w-2xl">
        Manage your personal information, team permissions, notification triggers, and advanced AI engine preferences.
      </p>
    </div>

    <!-- Profile Information Section -->
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary flex-shrink-0">
          <PhUserCircle :size="24" weight="bold" />
        </div>
        <div class="flex flex-col gap-0.5">
          <h3 class="font-header font-bold text-2xl text-brand-dark tracking-tight">Profile Information</h3>
          <p class="text-sm text-brand-slate">Update your personal details, avatar, and security settings.</p>
        </div>
      </div>
      <div class="h-px bg-black/5 dark:bg-white/8"></div>
      <Profile />
    </div>

    <!-- General Settings Section -->
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary flex-shrink-0">
          <PhGauge :size="24" weight="bold" />
        </div>
        <div class="flex flex-col gap-0.5">
          <h3 class="font-header font-bold text-2xl text-brand-dark tracking-tight">General Settings</h3>
          <p class="text-sm text-brand-slate">Configure your workspace preferences, AI engine behaviour, and data privacy.</p>
        </div>
      </div>
      <div class="h-px bg-black/5 dark:bg-white/8"></div>
      <General />
    </div>

    <!-- Notifications Section -->
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary flex-shrink-0">
          <PhBell :size="24" weight="bold" />
        </div>
        <div class="flex flex-col gap-0.5">
          <h3 class="font-header font-bold text-2xl text-brand-dark tracking-tight">Notifications</h3>
          <p class="text-sm text-brand-slate">Control email alerts, meeting reminders, and push notification preferences.</p>
        </div>
      </div>
      <div class="h-px bg-black/5 dark:bg-white/8"></div>
      <Notifications />
    </div>

    <!-- Subscription Section -->
    <div class="flex flex-col gap-6 pb-12">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary flex-shrink-0">
          <PhCreditCard :size="24" weight="bold" />
        </div>
        <div class="flex flex-col gap-0.5">
          <h3 class="font-header font-bold text-2xl text-brand-dark tracking-tight">Subscription</h3>
          <p class="text-sm text-brand-slate">Manage your plan, billing cycle, and upgrade options.</p>
        </div>
      </div>
      <div class="h-px bg-black/5 dark:bg-white/8"></div>
      <Subscription />
    </div>
  </div>
</template>

<script setup>
import {
  PhGauge,
  PhUserCircle,
  PhBell,
  PhCreditCard
} from '@phosphor-icons/vue'

import General from '@/components/settings/General.vue'
import Profile from '@/components/settings/Profile.vue'
import Notifications from '@/components/settings/Notifications.vue'
import Subscription from '@/components/settings/Subscription.vue'
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
