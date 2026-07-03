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

    <!-- Data & Privacy Card -->
    <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
      <div class="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
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
        <div class="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 hover:bg-white/70 dark:hover:bg-slate-900/60 transition-all duration-200">
          <Checkbox 
            v-model="generalForm.privacyFirst"
            label="Privacy-First Learning"
            description="Allow SmartMeet to use anonymized transcripts to improve custom terminology recognition for your workspace. Your raw data is never shared."
          />
        </div>

        <!-- Checkbox 2: Auto-Delete Transcripts -->
        <div class="p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 hover:bg-white/70 dark:hover:bg-slate-900/60 transition-all duration-200">
          <Checkbox 
            v-model="generalForm.autoDelete"
            label="Auto-Delete Transcripts"
            description="Permanently delete transcript raw data from our servers 30 days after the meeting summary is generated."
          />
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
          <button @click="handleManageSync" class="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 text-xs font-bold font-header text-brand-dark hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer">
            Manage Sync
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 rounded-2xl">
          <div class="flex items-center gap-3.5">
            <img :src="notionIcon" alt="Notion" class="w-8 h-8 object-contain" />
            <div class="text-left">
              <span class="text-sm font-bold text-brand-dark leading-tight block">Notion Workspace</span>
              <span class="text-xs text-brand-slate">Connected: SmartMeet AI Sync</span>
            </div>
          </div>
          <span class="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border border-green-500/20 bg-green-500/10 text-green-600 uppercase">Active</span>
        </div>

        <div class="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 rounded-2xl">
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

    <!-- Footer Actions -->
    <div class="flex justify-end items-center gap-4 pt-4 border-t border-black/5 dark:border-white/5">
      <button @click="resetGeneral" class="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 font-header font-bold text-xs tracking-wider uppercase text-brand-dark hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer">Discard Changes</button>
      <button @click="saveGeneral" class="px-6 py-3 rounded-xl bg-grad-primary text-white font-header font-bold text-xs tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.2)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.3)] transition-all cursor-pointer">Save AI Preferences</button>
    </div>

    <!-- Admin-Only: Integrations & Environment Panel -->
    <template v-if="authStore.user?.role === 'admin'">
      <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
        <div class="flex items-center justify-between gap-3 pb-4 border-b border-black/5 dark:border-white/5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
              <PhShield :size="20" weight="bold" />
            </div>
            <div class="flex flex-col">
              <h3 class="font-header font-bold text-lg text-brand-dark">Admin: Integrations & Environment</h3>
              <p class="text-xs text-brand-slate">Manage API tokens, webhook URLs, and environment variables.</p>
            </div>
          </div>
          <button
            @click="adminPanelOpen = !adminPanelOpen"
            class="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <PhCaretDown :size="18" weight="bold" class="text-brand-slate transition-transform duration-300" :class="{ 'rotate-180': adminPanelOpen }" />
          </button>
        </div>

        <template v-if="adminPanelOpen">
          <!-- Environment Variables -->
          <div class="flex flex-col gap-3">
            <h4 class="font-header font-bold text-sm text-brand-dark">Environment Variables</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="(val, key) in envVars" :key="key" class="flex flex-col gap-1 p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5">
                <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">{{ key }}</span>
                <span class="text-xs font-mono text-brand-dark break-all">{{ val ? (val.length > 40 ? val.substring(0, 40) + '...' : val) : '—' }}</span>
              </div>
            </div>
          </div>

          <!-- Token Validation -->
          <div class="flex flex-col gap-3">
            <h4 class="font-header font-bold text-sm text-brand-dark">API Token Validation</h4>
            <div class="flex items-center gap-3">
              <input
                v-model="tokenTestValue"
                type="text"
                placeholder="Paste token to validate..."
                class="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-body text-xs text-brand-dark focus:outline-none focus:border-primary/30"
              />
              <button
                @click="validateToken"
                :disabled="tokenTesting"
                class="px-4 py-2.5 rounded-xl bg-primary text-white text-[10px] font-bold whitespace-nowrap transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
              >
                {{ tokenTesting ? 'Testing...' : 'Validate Token' }}
              </button>
            </div>
            <p v-if="tokenResult !== null" class="text-xs font-semibold" :class="tokenResult ? 'text-green-600' : 'text-red-500'">
              {{ tokenResult ? '✓ Token is valid' : '✗ Token is invalid or expired' }}
            </p>
            <p class="text-[10px] text-brand-slate">Enter a JWT token to verify its validity and check the associated user.</p>
          </div>

          <!-- Webhook Configuration -->
          <div class="flex flex-col gap-3">
            <h4 class="font-header font-bold text-sm text-brand-dark">Webhook URL</h4>
            <div class="flex items-center gap-3">
              <input
                v-model="webhookUrl"
                type="url"
                placeholder="https://hooks.example.com/smartmeet"
                class="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-body text-xs text-brand-dark focus:outline-none focus:border-primary/30"
              />
              <button
                @click="saveWebhook"
                :disabled="webhookSaving"
                class="px-4 py-2.5 rounded-xl bg-primary text-white text-[10px] font-bold whitespace-nowrap transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
              >
                {{ webhookSaving ? 'Saving...' : 'Save' }}
              </button>
              <button
                @click="testWebhook"
                :disabled="webhookTesting"
                class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 text-[10px] font-bold text-brand-dark transition-all hover:bg-black/5 cursor-pointer disabled:opacity-50"
              >
                {{ webhookTesting ? 'Testing...' : 'Test' }}
              </button>
            </div>
            <p class="text-[10px] text-brand-slate">Configure a webhook URL to receive meeting summaries and event notifications in real-time.</p>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import {
  PhGauge,
  PhShieldCheck,
  PhGear,
  PhShield,
  PhCaretDown
} from '@phosphor-icons/vue'
import Select from '../ui/Select.vue'
import Checkbox from '../ui/Checkbox.vue'
import { useAlertStore } from '@/stores/alert'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const alertStore = useAlertStore()
const authStore = useAuthStore()

const adminPanelOpen = ref(false)

const envVars = reactive({
  NODE_ENV: import.meta.env.VITE_NODE_ENV || process.env.NODE_ENV || 'development',
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
})

const tokenTestValue = ref('')
const tokenTesting = ref(false)
const tokenResult = ref(null)

const validateToken = async () => {
  if (!tokenTestValue.value.trim()) return
  tokenTesting.value = true
  tokenResult.value = null
  try {
    const { data } = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: `Bearer ${tokenTestValue.value.trim()}` }
    })
    tokenResult.value = data.success === true
  } catch {
    tokenResult.value = false
  } finally {
    tokenTesting.value = false
  }
}

const webhookUrl = ref('')
const webhookSaving = ref(false)
const webhookTesting = ref(false)

const saveWebhook = async () => {
  if (!webhookUrl.value.trim()) return
  webhookSaving.value = true
  try {
    await axios.post(
      'http://localhost:5000/api/settings/webhook',
      { url: webhookUrl.value.trim() },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    await alertStore.showAlert('Webhook URL saved successfully.', 'Webhook Saved', 'primary')
  } catch {
    await alertStore.showAlert('Failed to save webhook URL.', 'Error', 'danger')
  } finally {
    webhookSaving.value = false
  }
}

const testWebhook = async () => {
  if (!webhookUrl.value.trim()) return
  webhookTesting.value = true
  try {
    await axios.post(
      'http://localhost:5000/api/settings/webhook/test',
      { url: webhookUrl.value.trim() },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    await alertStore.showAlert('Webhook test payload sent successfully.', 'Webhook Test', 'primary')
  } catch {
    await alertStore.showAlert('Webhook test failed. Check the URL and try again.', 'Webhook Error', 'danger')
  } finally {
    webhookTesting.value = false
  }
}

onMounted(async () => {
  try {
    const { data } = await axios.get('http://localhost:5000/api/settings/webhook', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    if (data.success && data.url) {
      webhookUrl.value = data.url
    }
  } catch {}
})

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
