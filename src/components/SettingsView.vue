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
    <div class="w-full">
      <!-- ─── SUB-TAB 1: GENERAL SETTINGS ─── -->
      <div v-if="activeSubtab === 'general'" class="flex flex-col gap-6 animate-fade-in">
        
        <!-- AI Insights Engine Card -->
        <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
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
        <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
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
        <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
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

        <!-- Footer Actions -->
        <div class="flex justify-end items-center gap-4 pt-4 border-t border-black/5">
          <button @click="resetGeneral" class="px-5 py-2.5 rounded-xl bg-white border border-black/8 font-header font-bold text-xs tracking-wider uppercase text-brand-dark hover:bg-black/5 transition-all cursor-pointer">Discard Changes</button>
          <button @click="saveGeneral" class="px-6 py-3 rounded-xl bg-grad-primary text-white font-header font-bold text-xs tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.2)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.3)] transition-all cursor-pointer">Save AI Preferences</button>
        </div>

      </div>

      <!-- ─── SUB-TAB 2: PROFILE SETTINGS ─── -->
      <div v-if="activeSubtab === 'profile'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
        <!-- Main profile form (Col-8) -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
            <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
              <PhUserCircle :size="20" class="text-primary" />
              <h3 class="font-header font-bold text-lg text-brand-dark">Profile Information</h3>
            </div>

            <div class="flex flex-col gap-6">
              <!-- Avatar Upload row -->
              <div class="flex items-center gap-5">
                <div class="relative w-20 h-20 rounded-full border-2 border-primary overflow-hidden flex-shrink-0 group cursor-pointer shadow-sm">
                  <img :src="profileForm.avatar" alt="Avatar" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <PhCamera :size="18" weight="bold" />
                  </div>
                </div>
                <div class="flex flex-col gap-1 items-start">
                  <button @click="triggerAvatarUpload" class="px-4 py-2 rounded-lg bg-primary/8 hover:bg-primary/15 text-primary text-xs font-bold tracking-wide transition-all cursor-pointer">
                    Change Photo
                  </button>
                  <span class="text-[10px] text-brand-slate mt-1">Accepts PNG, JPG or SVG. Max 2MB.</span>
                </div>
              </div>

              <!-- Form Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                <div class="flex flex-col gap-2">
                  <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Full Name</label>
                  <input v-model="profileForm.fullName" type="text" class="w-full px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Job Title</label>
                  <input v-model="profileForm.jobTitle" type="text" class="w-full px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Email Address</label>
                  <input v-model="profileForm.email" type="email" class="w-full px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Phone Number</label>
                  <input v-model="profileForm.phone" type="text" class="w-full px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all" />
                </div>
                <div class="flex flex-col gap-2 md:col-span-2">
                  <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Company</label>
                  <input v-model="profileForm.company" type="text" class="w-full px-4 py-3 rounded-xl bg-white border border-black/8 font-body text-sm text-brand-dark focus:outline-none focus:border-primary/30 transition-all" />
                </div>
              </div>

              <!-- Submit button -->
              <div class="pt-2">
                <button @click="saveProfile" class="px-6 py-3 rounded-xl bg-grad-primary text-white font-header font-bold text-xs tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.2)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.3)] transition-all cursor-pointer">
                  Save Profile Changes
                </button>
              </div>
            </div>
          </div>

          <!-- Security settings card -->
          <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
            <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
              <PhLockKey :size="20" class="text-primary" />
              <h3 class="font-header font-bold text-lg text-brand-dark">Security Settings</h3>
            </div>

            <div class="flex flex-col gap-5">
              <!-- 2FA Toggle -->
              <div class="flex items-center justify-between p-4 bg-white/40 border border-black/[0.03] rounded-2xl">
                <div class="flex flex-col w-[80%] text-left">
                  <span class="text-sm font-bold text-brand-dark leading-tight">Two-Factor Authentication</span>
                  <span class="text-xs text-brand-slate mt-0.5">Add an extra layer of security to your account</span>
                </div>
                <button 
                  type="button"
                  @click="profileForm.twoFactor = !profileForm.twoFactor"
                  class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5"
                  :class="profileForm.twoFactor ? 'bg-primary' : 'bg-brand-slate/30'"
                >
                  <span class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm" :style="{ transform: profileForm.twoFactor ? 'translateX(22px)' : 'translateX(3px)' }"></span>
                </button>
              </div>

              <!-- Change Password Button -->
              <div class="flex items-center justify-between p-4 bg-white/40 border border-black/[0.03] rounded-2xl">
                <div class="flex flex-col text-left">
                  <span class="text-sm font-bold text-brand-dark leading-tight">Change Account Password</span>
                  <span class="text-xs text-brand-slate mt-0.5">Ensure your account is protected with strong credentials</span>
                </div>
                <button @click="handleChangePassword" class="px-5 py-2.5 rounded-xl bg-white border border-black/8 hover:bg-black/5 text-xs font-bold font-header text-brand-dark transition-all cursor-pointer">
                  Update Password
                </button>
              </div>

              <!-- Device Sessions checklist -->
              <div class="flex flex-col gap-3 text-left mt-2">
                <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">Active Device Sessions</label>
                
                <div v-for="session in deviceSessions" :key="session.id" class="flex justify-between items-center p-3.5 bg-white/40 border border-black/[0.03] rounded-2xl">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center text-primary">
                      <PhLaptop v-if="session.device.includes('Mac')" :size="20" />
                      <PhDeviceMobile v-else :size="20" />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-xs font-bold text-brand-dark">{{ session.device }} - {{ session.location }}</span>
                      <span class="text-[10px] text-brand-slate mt-0.5">{{ session.status }} • {{ session.browser }}</span>
                    </div>
                  </div>
                  <button @click="revokeSession(session.id)" class="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase px-3 py-1.5 rounded-lg hover:bg-red-50 cursor-pointer">
                    {{ session.device.includes('Mac') ? 'This Device' : 'Revoke' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Details Billing Overview (Col-4) -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          <!-- Billing Overview Card -->
          <div class="card-glass rounded-[28px] p-6 flex flex-col gap-5">
            <div class="flex justify-between items-center pb-3 border-b border-black/5">
              <h3 class="font-header font-bold text-lg text-brand-dark">Billing Overview</h3>
              <span class="text-[9px] font-extrabold px-2.5 py-0.5 rounded-md border border-[#acedff]/30 bg-[#acedff]/10 text-primary uppercase">
                Pro Plan
              </span>
            </div>

            <div class="flex flex-col gap-4 text-left">
              <div class="flex justify-between items-baseline">
                <span class="text-xs font-semibold text-brand-slate">Monthly Total</span>
                <span class="text-xl font-bold font-header text-brand-dark">$149.00</span>
              </div>

              <div class="flex justify-between items-center text-xs text-brand-slate font-medium pt-2 border-t border-black/5">
                <div class="flex items-center gap-1.5">
                  <PhCalendar :size="14" class="text-primary" />
                  <span>Renewal Date</span>
                </div>
                <span class="font-semibold text-brand-dark">Oct 12, 2026</span>
              </div>

              <!-- Buttons -->
              <div class="flex flex-col gap-2 mt-2">
                <button @click="handleUpgrade" class="w-full py-3 rounded-xl bg-grad-primary text-white text-xs font-bold font-header tracking-wide hover:shadow-md active:scale-98 transition-all cursor-pointer">
                  Upgrade to Enterprise
                </button>
                <button @click="handleManageSub" class="w-full py-3 rounded-xl bg-white border border-black/8 text-xs font-bold font-header text-brand-slate hover:bg-black/5 transition-all cursor-pointer">
                  Manage Subscription
                </button>
              </div>
            </div>
          </div>

          <!-- Preferences Card -->
          <div class="card-glass rounded-[28px] p-6 flex flex-col gap-5">
            <div class="flex items-center gap-2.5 pb-3 border-b border-black/5">
              <PhGear :size="20" class="text-primary" />
              <h3 class="font-header font-bold text-lg text-brand-dark">Workspace Preferences</h3>
            </div>

            <div class="flex flex-col gap-4 text-left">
              <!-- Interface Theme -->
              <div class="flex flex-col gap-1.5">
                <label class="font-header font-bold text-[10px] tracking-wider uppercase text-brand-slate">Interface Theme</label>
                <select v-model="profileForm.theme" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/8 font-body text-xs text-brand-dark focus:outline-none transition-all cursor-pointer">
                  <option value="light">Light Mode (Glassmorphism)</option>
                  <option value="dark">Dark Mode (Default)</option>
                  <option value="system">System Synchronized</option>
                </select>
              </div>

              <!-- Language -->
              <div class="flex flex-col gap-1.5">
                <label class="font-header font-bold text-[10px] tracking-wider uppercase text-brand-slate">Language</label>
                <select v-model="profileForm.language" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/8 font-body text-xs text-brand-dark focus:outline-none transition-all cursor-pointer">
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es-ES">Spanish (ES)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ─── SUB-TAB 3: TEAM MANAGEMENT ─── -->
      <div v-if="activeSubtab === 'team'" class="flex flex-col gap-6 animate-fade-in">
        
        <!-- Stats Widgets row -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="stat in teamStats" :key="stat.id" class="card-glass rounded-2xl p-5 flex flex-col justify-between min-h-[120px] text-left">
            <div class="flex justify-between items-start">
              <div class="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                <component :is="stat.icon" :size="18" weight="bold" />
              </div>
              <span class="text-[10px] font-bold text-green-500 bg-green-500/8 px-1.5 py-0.5 rounded-md border border-green-500/10">{{ stat.change }}</span>
            </div>
            <div class="mt-4">
              <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider block">{{ stat.label }}</span>
              <span class="text-xl font-bold font-header text-brand-dark block mt-0.5">{{ stat.value }}</span>
            </div>
          </div>
        </div>

        <!-- Bento Column: Table & Invite panel -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- Members Table Card (Col-8) -->
          <div class="lg:col-span-8 card-glass rounded-[28px] p-6 flex flex-col gap-5">
            <div class="flex justify-between items-center pb-3 border-b border-black/5 flex-wrap gap-3">
              <h3 class="font-header font-bold text-lg text-brand-dark">Team Members</h3>
              
              <!-- Mini search input -->
              <div class="relative w-48">
                <input 
                  v-model="memberSearchQuery" 
                  type="text" 
                  placeholder="Search members..." 
                  class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-black/8 font-body text-xs text-brand-dark focus:outline-none"
                />
                <PhMagnifyingGlass :size="12" class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate" />
              </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
              <table class="w-full border-collapse text-left text-xs">
                <thead>
                  <tr class="border-b border-black/5 font-extrabold text-brand-slate uppercase pb-3">
                    <th class="pb-3 pr-4">Member</th>
                    <th class="pb-3 px-4">Role</th>
                    <th class="pb-3 px-4">Status</th>
                    <th class="pb-3 px-4">Last Active</th>
                    <th class="pb-3 pl-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-black/5">
                  <tr v-for="m in filteredMembers" :key="m.id" class="hover:bg-primary/[0.01]">
                    <!-- Member info -->
                    <td class="py-3 pr-4 flex items-center gap-2.5">
                      <img :src="m.avatar" :alt="m.name" class="w-8 h-8 rounded-full object-cover" />
                      <div class="flex flex-col">
                        <span class="font-bold text-brand-dark">{{ m.name }}</span>
                        <span class="text-[10px] text-brand-slate">{{ m.email }}</span>
                      </div>
                    </td>
                    <!-- Role badge -->
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase" :class="getRoleBadgeClass(m.role)">
                        {{ m.role }}
                      </span>
                    </td>
                    <!-- Status dot -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full" :class="m.status === 'Online' ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.3)]' : 'bg-brand-slate/40'"></span>
                        <span class="font-semibold text-brand-dark">{{ m.status }}</span>
                      </div>
                    </td>
                    <!-- Last active -->
                    <td class="py-3 px-4 font-semibold text-brand-slate">
                      {{ m.lastActive }}
                    </td>
                    <!-- Actions menu button -->
                    <td class="py-3 pl-4 text-right">
                      <button @click="handleMemberAction(m.id)" class="w-7 h-7 rounded-lg hover:bg-black/5 flex items-center justify-center text-brand-slate transition-colors cursor-pointer">
                        <PhDotsThreeOutlineVertical :size="14" weight="bold" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Invite Stakeholder Column (Col-4) -->
          <div class="lg:col-span-4 flex flex-col gap-6">
            
            <!-- Invite Member Card -->
            <div class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left">
              <h3 class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5">Invite Stakeholder</h3>
              
              <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] font-extrabold text-brand-slate uppercase">Full Name</label>
                  <input v-model="inviteForm.name" type="text" placeholder="Name..." class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/8 font-body text-xs text-brand-dark focus:outline-none" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] font-extrabold text-brand-slate uppercase">Email Address</label>
                  <input v-model="inviteForm.email" type="email" placeholder="Email..." class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/8 font-body text-xs text-brand-dark focus:outline-none" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] font-extrabold text-brand-slate uppercase">Workspace Role</label>
                  <select v-model="inviteForm.role" class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/8 font-body text-xs text-brand-dark focus:outline-none cursor-pointer">
                    <option value="Admin">Administrator</option>
                    <option value="Manager">Manager</option>
                    <option value="Member">Regular Member</option>
                  </select>
                </div>
                
                <button @click="sendInvite" class="w-full py-2.5 mt-2 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] uppercase tracking-wide transition-all cursor-pointer">
                  Send Invitation
                </button>
              </div>
            </div>

            <!-- Activity Feed card -->
            <div class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left">
              <h3 class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5">Workspace Activity</h3>
              
              <div class="flex flex-col gap-3.5 max-h-[200px] overflow-y-auto pr-1 scroll-container">
                <div v-for="(act, idx) in activityFeed" :key="idx" class="flex gap-2.5 items-start text-[11px]">
                  <div class="w-2.5 h-2.5 rounded-full bg-primary/40 mt-1 flex-shrink-0"></div>
                  <div class="flex flex-col">
                    <span class="font-semibold text-brand-dark leading-tight">{{ act.text }}</span>
                    <span class="text-brand-slate mt-0.5">{{ act.time }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- ─── SUB-TAB 4: NOTIFICATIONS ─── -->
      <div v-if="activeSubtab === 'notifications'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
        
        <!-- Left details controls (Col-8) -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          
          <!-- Email Notifications Toggles -->
          <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
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
          <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
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
          <div class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left">
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
          <div class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left">
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { 
  PhGear, 
  PhUserCircle, 
  PhUsersThree, 
  PhBell, 
  PhCheck, 
  PhCamera, 
  PhLaptop, 
  PhDeviceMobile, 
  PhCalendar, 
  PhEnvelope, 
  PhShieldCheck, 
  PhGauge, 
  PhMagnifyingGlass, 
  PhLockKey, 
  PhHourglassHigh, 
  PhClock, 
  PhPhoneCall, 
  PhNotebook, 
  PhDotsThreeOutlineVertical 
} from '@phosphor-icons/vue'

// Import assets
import notionIcon from '../assets/Notion-logo.svg.png'
import slackIcon from '../assets/slack.png'
import gcalIcon from '../assets/Google.png'
import userProfileImg from '../assets/User Profile.png'
import avatar1Img from '../assets/Background+Border.png'
import avatar2Img from '../assets/Background+Border-1.png'

// Subtabs definition
const subtabs = [
  { id: 'general', label: 'General Settings', icon: PhGauge },
  { id: 'profile', label: 'Profile Settings', icon: PhUserCircle },
  { id: 'team', label: 'Team Management', icon: PhUsersThree },
  { id: 'notifications', label: 'Notifications', icon: PhBell }
]

const activeSubtab = ref('general')

// ─── GENERAL SETTINGS STATE ───
const generalForm = reactive({
  autoSummarize: true,
  detailLevel: 'standard',
  focusType: 'tasks',
  privacyFirst: true,
  autoDelete: false
})

const resetGeneral = () => {
  generalForm.autoSummarize = true
  generalForm.detailLevel = 'standard'
  generalForm.focusType = 'tasks'
  generalForm.privacyFirst = true
  generalForm.autoDelete = false
  alert('Discarded unsaved AI changes.')
}

const saveGeneral = () => {
  alert('Successfully saved AI engine preferences!')
}

const handleSyncNow = () => {
  alert('Knowledge database sync initialized. Fetching Notion databases & Slack threads...')
}

// ─── PROFILE SETTINGS STATE ───
const profileForm = reactive({
  avatar: userProfileImg,
  fullName: 'Alexander Sterling',
  jobTitle: 'Principal Product Architect',
  email: 'alex.sterling@quantum-dynamics.io',
  phone: '+1 (555) 892-4410',
  company: 'Quantum Dynamics Global',
  twoFactor: false,
  theme: 'light',
  language: 'en-US'
})

const deviceSessions = ref([
  { id: 1, device: 'MacBook Pro 16"', location: 'San Francisco', status: 'Active Now', browser: 'Chrome' },
  { id: 2, device: 'iPhone 15 Pro', location: 'New York', status: '2 hours ago', browser: 'iOS App' }
])

const triggerAvatarUpload = () => {
  alert('Simulating native file upload selection dialog...')
}

const saveProfile = () => {
  alert('Successfully updated profile settings!')
}

const handleChangePassword = () => {
  alert('Opening password reset and security update flow...')
}

const revokeSession = (id) => {
  const session = deviceSessions.value.find(s => s.id === id)
  if (session) {
    if (session.device.includes('Mac')) {
      alert('Cannot revoke session for your currently active device.')
      return
    }
    deviceSessions.value = deviceSessions.value.filter(s => s.id !== id)
    alert(`Revoked active session for ${session.device}.`)
  }
}

const handleUpgrade = () => {
  alert('Redirecting to Enterprise quotation billing portal...')
}

const handleManageSub = () => {
  alert('Redirecting to Stripe subscription portal...')
}

// ─── TEAM MANAGEMENT STATE ───
const teamStats = [
  { id: 1, label: 'Total Members', value: '248', icon: PhUserCircle, change: '+12%' },
  { id: 2, label: 'Active Meetings', value: '14', icon: PhPhoneCall, change: 'Stable' },
  { id: 3, label: 'Video Hours', value: '1,420h', icon: PhHourglassHigh, change: '+8%' },
  { id: 4, label: 'Premium Seats', value: '28 / 50', icon: PhNotebook, change: '+4%' }
]

const members = ref([
  { id: 1, name: 'David Chen', email: 'david.c@smartmeet.ai', role: 'Admin', status: 'Online', lastActive: '2 mins ago', avatar: avatar1Img },
  { id: 2, name: 'Sarah Jenkins', email: 's.jenkins@smartmeet.ai', role: 'Manager', status: 'Online', lastActive: 'Just now', avatar: avatar2Img },
  { id: 3, name: 'Marcus Wright', email: 'm.wright@smartmeet.ai', role: 'Member', status: 'Offline', lastActive: '4 hours ago', avatar: userProfileImg }
])

const memberSearchQuery = ref('')

const filteredMembers = computed(() => {
  if (!memberSearchQuery.value.trim()) return members.value
  const q = memberSearchQuery.value.toLowerCase()
  return members.value.filter(m => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
})

const getRoleBadgeClass = (role) => {
  switch (role) {
    case 'Admin':
      return 'bg-red-500/10 border border-red-500/15 text-red-600'
    case 'Manager':
      return 'bg-purple-500/10 border border-purple-500/15 text-purple-600'
    case 'Member':
    default:
      return 'bg-blue-500/10 border border-blue-500/15 text-blue-600'
  }
}

const handleMemberAction = (id) => {
  const m = members.value.find(member => member.id === id)
  if (m) {
    alert(`Action menu toggled for ${m.name}. Options: Demote, Revoke Access, Force Logout.`)
  }
}

const inviteForm = reactive({
  name: '',
  email: '',
  role: 'Member'
})

const sendInvite = () => {
  if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
    alert('Please enter invitee name and email.')
    return
  }
  
  // Add to members list mockup
  members.value.push({
    id: Date.now(),
    name: inviteForm.name,
    email: inviteForm.email,
    role: inviteForm.role,
    status: 'Offline',
    lastActive: 'Invited just now',
    avatar: userProfileImg
  })
  
  // Add activity log
  activityFeed.value.unshift({
    text: `Sent workspace invitation to ${inviteForm.name} (${inviteForm.role})`,
    time: 'Just now'
  })

  alert(`Invitation sent to ${inviteForm.name} at ${inviteForm.email}!`)
  
  inviteForm.name = ''
  inviteForm.email = ''
  inviteForm.role = 'Member'
}

const activityFeed = ref([
  { text: 'Alexander Sterling updated AI insights model settings', time: '1 hour ago' },
  { text: 'Slack Integration connected to channel #product-insights', time: '2 hours ago' },
  { text: 'David Chen updated workspace billing settings', time: 'Yesterday' }
])

// ─── NOTIFICATIONS SETTINGS STATE ───
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

.scroll-container::-webkit-scrollbar {
  width: 4px;
}
.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 99px;
}
</style>
