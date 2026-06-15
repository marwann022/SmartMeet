<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-left">
    <!-- Left details controls (Col-8) -->
    <div class="lg:col-span-8 flex flex-col gap-6">
      
      <!-- Email Notifications Toggles -->
      <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
        <div class="flex items-center gap-3 pb-4 border-b border-black/5">
          <div class="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary">
            <PhEnvelope :size="20" weight="bold" />
          </div>
          <div class="flex flex-col">
            <h3 class="font-header font-bold text-lg text-brand-dark">Email Notifications</h3>
            <p class="text-xs text-brand-slate">Manage the frequency of meeting insight emails to your inbox.</p>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <!-- Toggle Row 1: Summaries -->
          <div class="flex items-center justify-between p-3.5 bg-white/40 border border-black/[0.03] rounded-2xl">
            <div class="flex flex-col w-[80%] text-left">
              <span class="text-sm font-bold text-brand-dark leading-tight">Meeting Summaries</span>
              <span class="text-xs text-brand-slate mt-0.5">Receive AI-generated summaries and tasks after every call</span>
            </div>
            <button 
              type="button"
              @click="notifForm.summaries = !notifForm.summaries"
              class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5"
              :class="notifForm.summaries ? 'bg-primary' : 'bg-brand-slate/30'"
            >
              <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: notifForm.summaries ? 'translateX(22px)' : 'translateX(3px)' }"></span>
            </button>
          </div>

          <!-- Toggle Row 2: Performance Reports -->
          <div class="flex items-center justify-between p-3.5 bg-white/40 border border-black/[0.03] rounded-2xl">
            <div class="flex flex-col w-[80%] text-left">
              <span class="text-sm font-bold text-brand-dark leading-tight">Performance Reports</span>
              <span class="text-xs text-brand-slate mt-0.5">Weekly analytics on meeting efficiency and velocity tracking</span>
            </div>
            <button 
              type="button"
              @click="notifForm.reports = !notifForm.reports"
              class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5"
              :class="notifForm.reports ? 'bg-primary' : 'bg-brand-slate/30'"
            >
              <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: notifForm.reports ? 'translateX(22px)' : 'translateX(3px)' }"></span>
            </button>
          </div>

          <!-- Toggle Row 3: Product Updates -->
          <div class="flex items-center justify-between p-3.5 bg-white/40 border border-black/[0.03] rounded-2xl">
            <div class="flex flex-col w-[80%] text-left">
              <span class="text-sm font-bold text-brand-dark leading-tight">Product Updates</span>
              <span class="text-xs text-brand-slate mt-0.5">New features releases, AI engine improvements, and templates tips</span>
            </div>
            <button 
              type="button"
              @click="notifForm.updates = !notifForm.updates"
              class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5"
              :class="notifForm.updates ? 'bg-primary' : 'bg-brand-slate/30'"
            >
              <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: notifForm.updates ? 'translateX(22px)' : 'translateX(3px)' }"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Quiet hours & Reminders -->
      <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
        <div class="flex items-center gap-3 pb-4 border-b border-black/5">
          <div class="w-10 h-10 rounded-xl bg-secondary/8 border border-secondary/15 flex items-center justify-center text-secondary">
            <PhBell :size="20" weight="bold" />
          </div>
          <div class="flex flex-col">
            <h3 class="font-header font-bold text-lg text-brand-dark">Meeting Reminders</h3>
            <p class="text-xs text-brand-slate">Fine-tune exactly when you should be disturbed.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <!-- Digest Time -->
          <div class="flex flex-col gap-2">
            <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Daily Digest Time</label>
            <select v-model="notifForm.digestTime" class="w-full px-4 py-3.5 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none cursor-pointer">
              <option value="08:00 AM">08:00 AM</option>
              <option value="09:00 AM">09:00 AM (Default)</option>
              <option value="10:00 AM">10:00 AM</option>
            </select>
          </div>

          <!-- Before Meeting Starts -->
          <div class="flex flex-col gap-2">
            <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Before Meeting Starts</label>
            <select v-model="notifForm.reminderWindow" class="w-full px-4 py-3.5 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none cursor-pointer">
              <option value="5m">5 minutes before</option>
              <option value="10m">10 minutes before (Default)</option>
              <option value="15m">15 minutes before</option>
            </select>
          </div>

          <!-- Quiet hours DND Dials -->
          <div class="flex flex-col gap-2 md:col-span-2 pt-2">
            <div class="flex items-center justify-between p-3 bg-white/40 border border-black/[0.03] rounded-2xl">
              <div class="flex flex-col">
                <span class="text-xs font-bold text-brand-dark leading-tight">Enable Quiet Hours (DND)</span>
                <span class="text-[10px] text-brand-slate mt-0.5">Suppress push notifications during selected timezone slot</span>
              </div>
              <button 
                type="button"
                @click="notifForm.quietHours = !notifForm.quietHours"
                class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5"
                :class="notifForm.quietHours ? 'bg-primary' : 'bg-brand-slate/30'"
              >
                <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: notifForm.quietHours ? 'translateX(22px)' : 'translateX(3px)' }"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Push settings & Calendar (Col-4) -->
    <div class="lg:col-span-4 flex flex-col gap-6">
      
      <!-- AI Insight banner -->
      <div class="bg-gradient-to-br from-primary/10 via-white/50 to-white/80 border border-primary/20 rounded-[24px] p-6 text-left flex flex-col gap-3">
        <div class="flex items-center gap-2 text-primary font-bold text-xs uppercase">
          <PhSparkle :size="16" weight="bold" />
          <span>AI Insights Recommendation</span>
        </div>
        <p class="text-xs text-brand-dark font-medium leading-relaxed">
          "SmartMeet AI suggests moving summaries to 'Daily Digest' to reduce notification fatigue during peak morning core hours."
        </p>
        <button @click="applyDigestRecommendation" class="py-2.5 mt-2 rounded-xl bg-grad-primary text-white text-[11px] font-bold tracking-wider uppercase hover:shadow-sm transition-all cursor-pointer">
          Apply
        </button>
      </div>

      <!-- Push settings card -->
      <div class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left border border-white/80 shadow-glass">
        <h3 class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5">Push Settings</h3>
        
        <div class="flex flex-col gap-3 mt-1">
          <!-- Desktop -->
          <div 
            @click="notifForm.pushDesktop = !notifForm.pushDesktop"
            class="flex items-center gap-3 cursor-pointer select-none"
          >
            <div class="w-[20px] h-[20px] rounded-[4px] border-[2px] border-brand-slate/40 flex items-center justify-center" :class="notifForm.pushDesktop ? 'border-primary bg-primary text-white' : ''">
              <PhCheck v-if="notifForm.pushDesktop" :size="12" weight="bold" />
            </div>
            <span class="text-xs font-semibold text-brand-dark">Desktop Notifications</span>
          </div>

          <!-- Mobile -->
          <div 
            @click="notifForm.pushMobile = !notifForm.pushMobile"
            class="flex items-center gap-3 cursor-pointer select-none"
          >
            <div class="w-[20px] h-[20px] rounded-[4px] border-[2px] border-brand-slate/40 flex items-center justify-center" :class="notifForm.pushMobile ? 'border-primary bg-primary text-white' : ''">
              <PhCheck v-if="notifForm.pushMobile" :size="12" weight="bold" />
            </div>
            <span class="text-xs font-semibold text-brand-dark">Mobile Push Alerts</span>
          </div>

          <!-- Browser -->
          <div 
            @click="notifForm.pushBrowser = !notifForm.pushBrowser"
            class="flex items-center gap-3 cursor-pointer select-none"
          >
            <div class="w-[20px] h-[20px] rounded-[4px] border-[2px] border-brand-slate/40 flex items-center justify-center" :class="notifForm.pushBrowser ? 'border-primary bg-primary text-white' : ''">
              <PhCheck v-if="notifForm.pushBrowser" :size="12" weight="bold" />
            </div>
            <span class="text-xs font-semibold text-brand-dark">Browser Pop-ups</span>
          </div>
        </div>
      </div>

      <!-- Calendar card -->
      <div class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left border border-white/80 shadow-glass">
        <h3 class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5">Google Calendar Sync</h3>
        
        <div class="flex items-center gap-3 py-1">
          <img :src="gcalIcon" alt="Google Calendar" class="w-9 h-9 object-contain" />
          <div class="flex flex-col">
            <span class="text-xs font-bold text-brand-dark">work-profile@smartmeet.ai</span>
            <span class="text-[10px] text-green-500 font-semibold uppercase tracking-wider mt-0.5">Connected</span>
          </div>
        </div>

        <button @click="handleManageSync" class="w-full py-2.5 rounded-xl bg-white border border-black/8 text-[11px] font-bold font-header tracking-wide uppercase text-brand-dark hover:bg-black/5 transition-all cursor-pointer">
          Manage Sync Settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { 
  PhEnvelope, 
  PhBell, 
  PhSparkle, 
  PhCheck 
} from '@phosphor-icons/vue'

// Import assets
import gcalIcon from '../../assets/Google.png'

const notifForm = reactive({
  summaries: true,
  reports: true,
  updates: false,
  digestTime: '09:00 AM',
  reminderWindow: '10m',
  quietHours: false,
  pushDesktop: true,
  pushMobile: true,
  pushBrowser: false
})

const applyDigestRecommendation = () => {
  notifForm.summaries = false
  notifForm.digestTime = '09:00 AM'
  alert('Successfully applied AI recommendation. Summaries have been scheduled to deliver in the 09:00 AM daily digest.')
}

const handleManageSync = () => {
  alert('Google Calendar sync connection details settings open.')
}
</script>
