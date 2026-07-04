<template>
  <div class="flex flex-col gap-6 animate-fade-in text-left">
    <!-- Workspace Preferences Card -->
    <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
      <div class="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
        <div class="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary">
          <PhGear :size="20" weight="bold" />
        </div>
        <div class="flex flex-col">
          <h3 class="font-header font-bold text-lg text-brand-dark">Workspace Preferences</h3>
          <p class="text-xs text-brand-slate">Customize your interface theme and display language.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col gap-2">
          <Select
            v-model="generalForm.theme"
            :options="themeOptions"
            label="Interface Theme"
          />
        </div>
        <div class="flex flex-col gap-2">
          <Select
            v-model="generalForm.language"
            :options="languageOptions"
            label="Language"
          />
        </div>
      </div>
    </div>

    <!-- AI Insights Engine Card -->
    <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
      <div class="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
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
        <div class="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 rounded-2xl">
          <div class="flex flex-col w-[80%]">
            <span class="text-sm font-bold text-brand-dark leading-tight">Auto-Summarization</span>
            <span class="text-xs text-brand-slate mt-0.5">Automatically generate a concise summary and action items after every meeting</span>
          </div>
          <button 
            type="button"
            @click="generalForm.autoSummarize = !generalForm.autoSummarize"
            class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5 dark:border-white/10"
            :class="generalForm.autoSummarize ? 'bg-primary' : 'bg-brand-slate/30'"
          >
            <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: generalForm.autoSummarize ? 'translateX(22px)' : 'translateX(3px)' }"></span>
          </button>
        </div>

        <!-- Summary Detail Level -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <Select 
              v-model="generalForm.detailLevel" 
              :options="detailLevelOptions"
              label="Summary Detail Level"
            />
          </div>

          <div class="flex flex-col gap-2">
            <Select 
              v-model="generalForm.focusType" 
              :options="focusTypeOptions"
              label="AI Summary Focus"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import {
  PhGauge,
  PhShieldCheck,
  PhGear
} from '@phosphor-icons/vue'
import Select from '../ui/Select.vue'
import Checkbox from '../ui/Checkbox.vue'
import { useAlertStore } from '@/stores/alert'

const alertStore = useAlertStore()

const themeOptions = [
  { value: 'light', label: 'Light Mode (Glassmorphism)' },
  { value: 'dark', label: 'Dark Mode (Default)' },
  { value: 'system', label: 'System Synchronized' },
]

const languageOptions = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish (ES)' },
]

const detailLevelOptions = [
  { value: 'standard', label: 'Standard (Executive summary & key milestones)' },
  { value: 'comprehensive', label: 'Comprehensive (All items, transcript timestamps, speaker analysis)' }
]

const focusTypeOptions = [
  { value: 'tasks', label: 'Action Items & Deliverables' },
  { value: 'decisions', label: 'Decisions & Key Agreements' },
  { value: 'balanced', label: 'Balanced Recipient Summary' }
]

// Import assets
import notionIcon from '../../assets/Notion-logo.svg.png'
import slackIcon from '../../assets/slack.png'

const generalForm = reactive({
  theme: 'light',
  language: 'en-US',
  autoSummarize: true,
  detailLevel: 'standard',
  focusType: 'tasks',
  privacyFirst: true,
  autoDelete: false
})

const resetGeneral = async () => {
  generalForm.theme = 'light'
  generalForm.language = 'en-US'
  generalForm.autoSummarize = true
  generalForm.detailLevel = 'standard'
  generalForm.focusType = 'tasks'
  generalForm.privacyFirst = true
  generalForm.autoDelete = false
  await alertStore.showAlert('Discarded unsaved AI changes.', 'Discarded', 'primary')
}

const saveGeneral = async () => {
  await alertStore.showAlert('Successfully saved AI engine preferences!', 'Success', 'primary')
}

const handleSyncNow = async () => {
  await alertStore.showAlert('Knowledge database sync initialized. Fetching Notion databases & Slack threads...', 'Sync Initialized', 'primary')
}

const handleManageSync = async () => {
  await alertStore.showAlert('Google Calendar sync connection details settings open.', 'Calendar Settings', 'primary')
}
</script>
