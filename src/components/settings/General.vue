<template>
  <div class="flex flex-col gap-6 animate-fade-in text-left">
    <!-- AI Insights Engine Card -->
    <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
      <div class="flex items-center gap-3 pb-4 border-b border-black/5">
        <div class="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary">
          <PhGauge :size="20" weight="bold" />
        </div>
        <div class="flex flex-col">
          <h3 class="font-header font-bold text-lg text-brand-dark">AI Insights Engine</h3>
          <p class="text-xs text-brand-slate">Configure how SmartMeet processes and summarizes your meetings.</p>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <!-- Toggle Auto-Summarization -->
        <div class="flex items-center justify-between p-4 bg-white/40 border border-black/[0.03] rounded-2xl">
          <div class="flex flex-col w-[80%]">
            <span class="text-sm font-bold text-brand-dark leading-tight">Auto-Summarization</span>
            <span class="text-xs text-brand-slate mt-0.5">Automatically generate a concise summary and action items after every meeting</span>
          </div>
          <button 
            type="button"
            @click="generalForm.autoSummarize = !generalForm.autoSummarize"
            class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5"
            :class="generalForm.autoSummarize ? 'bg-primary' : 'bg-brand-slate/30'"
          >
            <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: generalForm.autoSummarize ? 'translateX(22px)' : 'translateX(3px)' }"></span>
          </button>
        </div>

        <!-- Summary Detail Level -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Summary Detail Level</label>
            <select 
              v-model="generalForm.detailLevel"
              class="w-full px-4 py-3.5 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <option value="standard">Standard (Executive summary & key milestones)</option>
              <option value="comprehensive">Comprehensive (All items, transcript timestamps, speaker analysis)</option>
            </select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">AI Summary Focus</label>
            <select 
              v-model="generalForm.focusType"
              class="w-full px-4 py-3.5 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all duration-300 cursor-pointer"
            >
              <option value="tasks">Action Items & Deliverables</option>
              <option value="decisions">Decisions & Key Agreements</option>
              <option value="balanced">Balanced Recipient Summary</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Data & Privacy Card -->
    <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
      <div class="flex items-center gap-3 pb-4 border-b border-black/5">
        <div class="w-10 h-10 rounded-xl bg-secondary/8 border border-secondary/15 flex items-center justify-center text-secondary">
          <PhShieldCheck :size="20" weight="bold" />
        </div>
        <div class="flex flex-col">
          <h3 class="font-header font-bold text-lg text-brand-dark">Data & Privacy</h3>
          <p class="text-xs text-brand-slate">Manage how your data is used to improve our AI models.</p>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <!-- Checkbox 1: Privacy-First Learning -->
        <div 
          @click="generalForm.privacyFirst = !generalForm.privacyFirst"
          class="flex items-start gap-4 p-4 rounded-2xl bg-white/40 border border-black/[0.03] cursor-pointer hover:bg-white/70 transition-all duration-200"
        >
          <div 
            class="w-[22px] h-[22px] rounded-lg border-2 border-brand-slate/40 flex items-center justify-center flex-shrink-0 mt-0.5"
            :class="generalForm.privacyFirst ? 'border-primary bg-primary text-white' : ''"
          >
            <PhCheck v-if="generalForm.privacyFirst" :size="12" weight="bold" />
          </div>
          <div class="flex-1">
            <span class="text-sm font-bold text-brand-dark block">Privacy-First Learning</span>
            <span class="text-xs text-brand-slate leading-relaxed mt-1 block">
              Allow SmartMeet to use anonymized transcripts to improve custom terminology recognition for your workspace. Your raw data is never shared.
            </span>
          </div>
        </div>

        <!-- Checkbox 2: Auto-Delete Transcripts -->
        <div 
          @click="generalForm.autoDelete = !generalForm.autoDelete"
          class="flex items-start gap-4 p-4 rounded-2xl bg-white/40 border border-black/[0.03] cursor-pointer hover:bg-white/70 transition-all duration-200"
        >
          <div 
            class="w-[22px] h-[22px] rounded-lg border-2 border-brand-slate/40 flex items-center justify-center flex-shrink-0 mt-0.5"
            :class="generalForm.autoDelete ? 'border-primary bg-primary text-white' : ''"
          >
            <PhCheck v-if="generalForm.autoDelete" :size="12" weight="bold" />
          </div>
          <div class="flex-1">
            <span class="text-sm font-bold text-brand-dark block">Auto-Delete Transcripts</span>
            <span class="text-xs text-brand-slate leading-relaxed mt-1 block">
              Permanently delete transcript raw data from our servers 30 days after the meeting summary is generated.
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Connected Knowledge Base -->
    <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
      <div class="flex justify-between items-start gap-4 flex-wrap">
        <div class="text-left">
          <h3 class="font-header font-bold text-lg text-brand-dark">Connected Knowledge Base</h3>
          <p class="text-xs text-brand-slate mt-1">
            Sync your AI preferences with Notion or Slack to automatically push summarized insights where your team works.
          </p>
        </div>
        
        <div class="flex items-center gap-3">
          <button @click="handleSyncNow" class="px-5 py-2.5 rounded-xl bg-grad-primary text-white text-xs font-bold font-header tracking-wide hover:shadow-[0_4px_12px_rgba(75,104,255,0.2)] active:scale-95 transition-all cursor-pointer">
            Sync Now
          </button>
          <button @click="handleManageSync" class="px-5 py-2.5 rounded-xl bg-white border border-black/8 text-xs font-bold font-header text-brand-dark hover:bg-black/5 transition-all cursor-pointer">
            Manage Sync
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center justify-between p-4 bg-white/40 border border-black/[0.03] rounded-2xl">
          <div class="flex items-center gap-3.5">
            <img :src="notionIcon" alt="Notion" class="w-8 h-8 object-contain" />
            <div class="text-left">
              <span class="text-sm font-bold text-brand-dark leading-tight block">Notion Workspace</span>
              <span class="text-xs text-brand-slate">Connected: SmartMeet AI Sync</span>
            </div>
          </div>
          <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-green-500/20 bg-green-500/10 text-green-600 uppercase">Active</span>
        </div>

        <div class="flex items-center justify-between p-4 bg-white/40 border border-black/[0.03] rounded-2xl">
          <div class="flex items-center gap-3.5">
            <img :src="slackIcon" alt="Slack" class="w-8 h-8 object-contain" />
            <div class="text-left">
              <span class="text-sm font-bold text-brand-dark leading-tight block">Slack Channel</span>
              <span class="text-xs text-brand-slate">Connected: #product-insights</span>
            </div>
          </div>
          <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-green-500/20 bg-green-500/10 text-green-600 uppercase">Active</span>
        </div>
      </div>
    </div>

    <!-- Google Calendar & Meet Integration Settings -->
    <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
      <div class="flex items-center gap-3 pb-4 border-b border-black/5">
        <div class="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary">
          <PhGoogleLogo :size="20" weight="bold" />
        </div>
        <div class="flex flex-col text-left">
          <h3 class="font-header font-bold text-lg text-brand-dark">Google Meet Integration</h3>
          <p class="text-xs text-brand-slate">Configure your Google credentials to enable real Google Meet call generation and calendar syncing.</p>
        </div>
      </div>

      <div class="flex flex-col gap-4 text-left">
        <div class="flex flex-col gap-2">
          <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Google OAuth Client ID</label>
          <input 
            v-model="googleClientId" 
            type="text" 
            placeholder="e.g. 1234567890-abcdefg.apps.googleusercontent.com" 
            class="w-full px-4 py-3.5 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all duration-300"
          />
          <span class="text-[11px] text-brand-slate leading-relaxed ml-1 mt-1 block">
            To generate a real Google Meet link client-side, create an OAuth 2.0 Web Application Client ID in the Google Cloud Console. Ensure you add <strong>http://localhost:5173</strong> (or your current workspace origin) to the <strong>Authorized JavaScript Origins</strong> list.
          </span>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="flex justify-end items-center gap-4 pt-4 border-t border-black/5">
      <button @click="resetGeneral" class="px-5 py-2.5 rounded-xl bg-white border border-black/8 font-header font-bold text-xs tracking-wider uppercase text-brand-dark hover:bg-black/5 transition-all cursor-pointer">Discard Changes</button>
      <button @click="saveGeneral" class="px-6 py-3 rounded-xl bg-grad-primary text-white font-header font-bold text-xs tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.2)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.3)] transition-all cursor-pointer">Save AI Preferences</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { 
  PhGauge, 
  PhShieldCheck, 
  PhGoogleLogo, 
  PhCheck 
} from '@phosphor-icons/vue'

// Import assets
import notionIcon from '../../assets/Notion-logo.svg.png'
import slackIcon from '../../assets/slack.png'

const generalForm = reactive({
  autoSummarize: true,
  detailLevel: 'standard',
  focusType: 'tasks',
  privacyFirst: true,
  autoDelete: false
})

const googleClientId = ref(localStorage.getItem('smartmeet_google_client_id') || '')

const resetGeneral = () => {
  generalForm.autoSummarize = true
  generalForm.detailLevel = 'standard'
  generalForm.focusType = 'tasks'
  generalForm.privacyFirst = true
  generalForm.autoDelete = false
  googleClientId.value = localStorage.getItem('smartmeet_google_client_id') || ''
  alert('Discarded unsaved AI changes.')
}

const saveGeneral = () => {
  localStorage.setItem('smartmeet_google_client_id', googleClientId.value)
  alert('Successfully saved AI engine & Google integration preferences!')
}

const handleSyncNow = () => {
  alert('Knowledge database sync initialized. Fetching Notion databases & Slack threads...')
}

const handleManageSync = () => {
  alert('Google Calendar sync connection details settings open.')
}
</script>
