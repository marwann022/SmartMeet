<template>
  <div class="flex flex-col gap-6 animate-fade-in text-left">
    <template v-if="isLoading">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-[120px] rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse"></div>
      </div>
      <div class="h-[400px] rounded-[28px] bg-black/5 dark:bg-white/5 animate-pulse w-full"></div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="h-[300px] rounded-[28px] bg-black/5 dark:bg-white/5 animate-pulse w-full"></div>
        <div class="h-[300px] rounded-[28px] bg-black/5 dark:bg-white/5 animate-pulse w-full"></div>
      </div>
    </template>
    
    <template v-else-if="error">
      <div class="flex flex-col items-center justify-center py-20 gap-4 opacity-70">
        <PhWarningCircle :size="48" class="text-red-500" />
        <h3 class="font-header font-bold text-lg text-brand-dark">Failed to Load</h3>
        <p class="text-sm text-brand-slate text-center max-w-md">{{ error }}</p>
        <button @click="loadOverview" class="px-6 py-2 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all text-xs">
          Retry
        </button>
      </div>
    </template>
    
    <template v-else-if="isAdmin">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in teamStats"
          :key="stat.id"
          class="card-glass rounded-2xl p-5 flex flex-col justify-between min-h-[120px] text-left border border-white/80 shadow-glass"
        >
          <div class="flex justify-between items-start">
            <div
              class="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary"
            >
              <component :is="stat.icon" :size="18" weight="bold" />
            </div>
            <span
              v-if="stat.change"
              class="text-[10px] font-bold text-green-500 bg-green-500/8 px-1.5 py-0.5 rounded-md border border-green-500/10"
            >
              {{ stat.change }}
            </span>
          </div>
          <div class="mt-4 flex flex-col gap-2">
            <span
              class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider block"
              >{{ stat.label }}</span
            >
            <div class="flex items-center justify-between gap-2 mt-0.5">
              <span class="text-xl font-bold font-header text-brand-dark">
                {{ stat.value }}
              </span>
              <button
                v-if="stat.copyable"
                @click="copyCommunityCode"
                class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/8 text-primary font-header font-bold text-[10px] uppercase tracking-wide hover:bg-primary/15 active:scale-[0.97] transition-all duration-200 cursor-pointer flex-shrink-0"
              >
                <PhCopy :size="11" weight="bold" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>

      <p class="text-sm text-brand-slate">
        Manage your community members, invitations, statistics and communication.
      </p>

      <div
        class="card-glass rounded-[28px] p-6 flex flex-col gap-5 border border-white/80 shadow-glass"
      >
        <div
          class="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/5 flex-wrap gap-3"
        >
          <h3 class="font-header font-bold text-lg text-brand-dark">
            Team Members
          </h3>

          <div class="relative w-48">
            <input
              v-model="memberSearchQuery"
              type="text"
              placeholder="Search members..."
              class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-body text-xs text-brand-dark focus:outline-none"
            />
            <PhMagnifyingGlass
              :size="12"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left text-xs">
            <thead>
              <tr
                class="border-b border-black/5 dark:border-white/5 font-extrabold text-brand-slate uppercase pb-3"
              >
                <th class="pb-3 pr-4">Member</th>
                <th class="pb-3 px-4">Role</th>
                <th class="pb-3 px-4">Email</th>
                <th class="pb-3 px-4">Joined</th>
                <th class="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/5 dark:divide-white/5">
              <tr
                v-for="m in filteredMembers"
                :key="m.id"
                class="hover:bg-primary/[0.01] dark:hover:bg-white/[0.02]"
              >
                <td class="py-3 pr-4">
                  <div class="flex items-center gap-3">
                    <UserAvatar :name="m.name" :avatar="m.avatar" :email="m.email" size="md" />

                    <span class="font-bold text-brand-dark">
                      {{ m.name }}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <RoleBadge :role="m.role" />
                </td>
                <td class="py-3 px-4 text-brand-slate font-medium">
                  {{ m.email }}
                </td>
                <td class="py-3 px-4 font-semibold text-brand-slate">
                  {{ m.joined }}
                </td>
                <td class="py-3 pl-4 text-right relative">
                  <button
                    @click.stop="activeMemberDropdown = activeMemberDropdown === m.id ? null : m.id"
                    class="w-7 h-7 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 inline-flex ml-auto items-center justify-center text-brand-slate transition-colors cursor-pointer"
                  >
                    <PhDotsThreeOutlineVertical :size="14" weight="bold" />
                  </button>

                  <div
                    v-if="activeMemberDropdown === m.id"
                    class="absolute right-0 top-[80%] mt-2 z-50 w-[180px] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-black/8 dark:border-white/10 py-1"
                    @click.stop
                  >
                    <button
                      @click="copyMemberEmail(m)"
                      :disabled="actionLoading"
                      class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-brand-dark hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-pointer text-left disabled:opacity-50"
                    >
                      <PhEnvelopeSimple :size="14" weight="bold" />
                      Copy Email
                    </button>
                    <button
                      @click="handleChangeRole(m)"
                      :disabled="actionLoading"
                      class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-brand-dark hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors cursor-pointer text-left disabled:opacity-50"
                    >
                      <PhArrowArcLeft :size="14" weight="bold" />
                      {{ m.role === 'Admin' ? 'Change to Member' : 'Change to Admin' }}
                    </button>
                    <button
                      @click="handleRemoveMember(m)"
                      :disabled="actionLoading"
                      class="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors cursor-pointer text-left disabled:opacity-50"
                    >
                      <PhUserMinus :size="14" weight="bold" />
                      Remove from Community
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left border border-white/80 shadow-glass"
        >
          <h3
            class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5 dark:border-white/5"
          >
            Invite Member
          </h3>

          <div
            class="flex items-center justify-between bg-white/40 dark:bg-slate-900/40 border border-black/5 dark:border-white/10 rounded-xl px-4 py-3"
          >
            <div class="flex flex-col gap-0.5">
              <span
                class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider"
                >Community Code</span
              >
              <span
                class="text-lg font-bold font-header text-brand-dark tracking-wider"
              >
                {{ communityCode }}
              </span>
            </div>
            <button
              @click="copyCommunityCode"
              class="flex items-center gap-2 px-3 py-2 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] uppercase shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_20px_rgba(75,104,255,0.35)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <PhCopy :size="13" weight="bold" />
              Copy
            </button>
          </div>

          <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label
                class="text-[10px] font-extrabold text-brand-slate uppercase"
                >Full Name</label
              >
              <input
                v-model="inviteForm.fullName"
                type="text"
                placeholder="Name..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-body text-xs text-brand-dark focus:outline-none"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label
                class="text-[10px] font-extrabold text-brand-slate uppercase"
                >Email Address</label
              >
              <input
                v-model="inviteForm.email"
                type="email"
                placeholder="Email..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-body text-xs text-brand-dark focus:outline-none"
              />
            </div>
            <div class="flex flex-col gap-1">
              <Select
                v-model="inviteForm.role"
                :options="roleOptions"
                label="Role"
              />
            </div>

            <button
              @click="handleSendInvitation"
              :disabled="inviteLoading"
              class="w-full py-2.5 mt-2 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] uppercase tracking-wide transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {{ inviteLoading ? 'Sending…' : 'Send Invitation' }}
            </button>

            <p class="text-[10px] text-brand-slate text-center leading-relaxed">
              The invited member will receive an email with a secure link to complete registration.
            </p>
          </div>
        </div>

        <div
          class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left border border-white/80 shadow-glass"
        >
          <h3
            class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5 dark:border-white/5"
          >
            Community Chat
          </h3>

          <div class="flex flex-col gap-4 flex-1">
            <template v-if="chatLoading">
              <div v-for="i in 3" :key="'skel-chat-' + i" class="flex gap-2.5 items-start">
                <div class="w-2.5 h-2.5 rounded-full bg-black/5 dark:bg-white/5 animate-pulse mt-1.5 flex-shrink-0"></div>
                <div class="flex flex-col gap-1 w-full">
                  <div class="h-3 w-16 bg-black/5 dark:bg-white/5 animate-pulse rounded"></div>
                  <div class="h-3 w-32 bg-black/5 dark:bg-white/5 animate-pulse rounded"></div>
                </div>
              </div>
            </template>
            <template v-else-if="chatMessages.length === 0">
              <div class="flex flex-col items-center justify-center flex-1 py-4 opacity-50">
                <PhChatCenteredText :size="24" class="text-brand-slate mb-2" />
                <p class="text-xs text-brand-slate text-center max-w-[200px]">No community messages yet. Start the conversation by sending the first message.</p>
              </div>
            </template>
            <template v-else>
              <div v-for="msg in chatMessages" :key="msg._id" class="flex gap-2.5 items-start text-[11px]">
                <img :src="msg.sender?.avatar || userProfileImg" class="w-5 h-5 rounded-full mt-0.5 object-cover flex-shrink-0" />
                <div class="flex flex-col gap-0.5">
                  <span class="font-extrabold text-brand-dark text-[11px]">
                    {{ msg.sender?.firstName ? `${msg.sender.firstName} ${msg.sender.lastName || ''}`.trim() : (msg.sender?.name || 'User') }}
                  </span>
                  <span class="text-brand-dark leading-tight">{{ msg.message }}</span>
                  <span class="text-brand-slate text-[10px]">{{ formatTimeAgo(msg.createdAt) }}</span>
                </div>
              </div>
            </template>
          </div>
          <router-link
            to="/community-chat"
            class="w-full py-2.5 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] uppercase tracking-wide transition-all cursor-pointer text-center inline-block"
          >
            Open Chat
          </router-link>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in memberStats"
          :key="stat.id"
          class="card-glass rounded-2xl p-5 flex flex-col justify-between min-h-[120px] text-left border border-white/80 shadow-glass"
        >
          <div class="flex justify-between items-start">
            <div
              class="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary"
            >
              <component :is="stat.icon" :size="18" weight="bold" />
            </div>
          </div>
          <div class="mt-4 flex flex-col gap-2">
            <span
              class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider"
              >{{ stat.label }}</span
            >
            <span class="text-xl font-bold font-header text-brand-dark">
              {{ stat.value }}
            </span>
          </div>
        </div>
      </div>

      <div
        class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left border border-white/80 shadow-glass"
      >
        <h3
          class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5 dark:border-white/5"
        >
          Community Information
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">Name</span>
            <span class="text-sm font-bold text-brand-dark">{{ communityInfo?.name || '—' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">Code</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-brand-dark">{{ communityCode || '—' }}</span>
              <button
                @click="copyCommunityCode"
                class="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/8 text-primary font-header font-bold text-[9px] uppercase hover:bg-primary/15 transition-all duration-200 cursor-pointer"
              >
                <PhCopy :size="10" weight="bold" />
                Copy
              </button>
            </div>
          </div>
          <div class="flex flex-col gap-1 sm:col-span-2">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">Description</span>
            <span class="text-sm text-brand-dark">{{ communityInfo?.description || 'No description.' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">Owner</span>
            <span class="text-sm font-semibold text-brand-dark">{{ communityInfo?.owner?.name || '—' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">Created</span>
            <span class="text-sm font-semibold text-brand-dark">{{ communityInfo?.createdAt ? new Date(communityInfo.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">Members</span>
            <span class="text-sm font-semibold text-brand-dark">{{ communityInfo?.memberCount || 0 }}</span>
          </div>
        </div>
      </div>

      <div
        class="card-glass rounded-[28px] p-6 flex flex-col gap-5 border border-white/80 shadow-glass"
      >
        <div
          class="flex justify-between items-center pb-3 border-b border-black/5 dark:border-white/5 flex-wrap gap-3"
        >
          <h3 class="font-header font-bold text-lg text-brand-dark">
            Team Members
          </h3>

          <div class="relative w-48">
            <input
              v-model="memberSearchQuery"
              type="text"
              placeholder="Search members..."
              class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-body text-xs text-brand-dark focus:outline-none"
            />
            <PhMagnifyingGlass
              :size="12"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-brand-slate"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left text-xs">
            <thead>
              <tr
                class="border-b border-black/5 dark:border-white/5 font-extrabold text-brand-slate uppercase pb-3"
              >
                <th class="pb-3 pr-4">Member</th>
                <th class="pb-3 px-4">Role</th>
                <th class="pb-3 px-4">Email</th>
                <th class="pb-3 px-4">Joined</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/5 dark:divide-white/5">
              <tr
                v-for="m in filteredMembers"
                :key="m.id"
                class="hover:bg-primary/[0.01] dark:hover:bg-white/[0.02]"
              >
                <td class="py-3 pr-4">
                  <div class="flex items-center gap-3">
                    <UserAvatar :name="m.name" :avatar="m.avatar" :email="m.email" size="md" />
                    <span class="font-bold text-brand-dark">
                      {{ m.name }}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <RoleBadge :role="m.role" />
                </td>
                <td class="py-3 px-4 text-brand-slate font-medium">
                  {{ m.email }}
                </td>
                <td class="py-3 px-4 font-semibold text-brand-slate">
                  {{ m.joined }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left border border-white/80 shadow-glass"
      >
        <h3
          class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5 dark:border-white/5"
        >
          Community Chat
        </h3>

        <div class="flex flex-col gap-4 flex-1">
          <template v-if="chatLoading">
            <div v-for="i in 3" :key="'skel-chat-u-' + i" class="flex gap-2.5 items-start">
              <div class="w-2.5 h-2.5 rounded-full bg-black/5 dark:bg-white/5 animate-pulse mt-1.5 flex-shrink-0"></div>
              <div class="flex flex-col gap-1 w-full">
                <div class="h-3 w-16 bg-black/5 dark:bg-white/5 animate-pulse rounded"></div>
                <div class="h-3 w-32 bg-black/5 dark:bg-white/5 animate-pulse rounded"></div>
              </div>
            </div>
          </template>
          <template v-else-if="chatMessages.length === 0">
            <div class="flex flex-col items-center justify-center flex-1 py-4 opacity-50">
              <PhChatCenteredText :size="24" class="text-brand-slate mb-2" />
              <p class="text-xs text-brand-slate text-center max-w-[200px]">No community messages yet. Start the conversation by sending the first message.</p>
            </div>
          </template>
          <template v-else>
            <div v-for="msg in chatMessages" :key="msg._id" class="flex gap-2.5 items-start text-[11px]">
              <img :src="msg.sender?.avatar || userProfileImg" class="w-5 h-5 rounded-full mt-0.5 object-cover flex-shrink-0" />
              <div class="flex flex-col gap-0.5">
                <span class="font-extrabold text-brand-dark text-[11px]">
                  {{ msg.sender?.firstName ? `${msg.sender.firstName} ${msg.sender.lastName || ''}`.trim() : (msg.sender?.name || 'User') }}
                </span>
                <span class="text-brand-dark leading-tight">{{ msg.message }}</span>
                <span class="text-brand-slate text-[10px]">{{ formatTimeAgo(msg.createdAt) }}</span>
              </div>
            </div>
          </template>
        </div>
        <router-link
          to="/community-chat"
          class="w-full py-2.5 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] uppercase tracking-wide transition-all cursor-pointer text-center inline-block"
        >
          Open Chat
        </router-link>
      </div>
    </template>

    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import axios from "axios";
import {
  PhUserCircle,
  PhKey,
  PhHourglassHigh,
  PhNotebook,
  PhMagnifyingGlass,
  PhDotsThreeOutlineVertical,
  PhCopy,
  PhCalendarCheck,
  PhShieldCheck,
  PhArrowArcLeft,
  PhUserMinus,
  PhChatCenteredText,
  PhWarningCircle,
  PhEnvelopeSimple,
} from "@phosphor-icons/vue";
import Select from "../ui/Select.vue";
import RoleBadge from "../common/RoleBadge.vue";
import UserAvatar from "../common/UserAvatar.vue";

import Toast from "../ui/Toast.vue";
import { useToasts } from "../../composables/useToasts";

import userProfileImg from "../../assets/User Profile.png";

const roleOptions = [
  { value: "user", label: "Member" },
  { value: "admin", label: "Admin" },
];

const teamStats = ref([
  { id: 1, label: "Community Members", value: "—", icon: PhUserCircle, change: "", copyable: false },
  { id: 2, label: "Community Code",    value: "—", icon: PhKey,         change: "", copyable: true  },
  { id: 3, label: "Active Tasks",      value: "—", icon: PhHourglassHigh, change: "", copyable: false },
  { id: 4, label: "Pending Invitations", value: "—", icon: PhNotebook,  change: "", copyable: false },
]);

const members = ref([]);
const memberSearchQuery = ref("");
const communityCode = ref("");
const inviteLoading = ref(false);

const { success, warning, info } = useToasts();

const userData = JSON.parse(localStorage.getItem("user") || "{}");
const isAdmin = ref(userData.role === "admin");

const memberStats = ref([]);
const communityInfo = ref(null);

const isLoading = ref(true);
const error = ref(null);
const chatMessages = ref([]);
const chatLoading = ref(false);
const actionLoading = ref(false);

const activeMemberDropdown = ref(null);
const dropdownPosition = ref({ x: 0, y: 0 });

const filteredMembers = computed(() => {
  if (!memberSearchQuery.value.trim()) return members.value;
  const q = memberSearchQuery.value.toLowerCase();
  return members.value.filter(
    (m) =>
      m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
  );
});

const copyCommunityCode = async () => {
  try {
    await navigator.clipboard.writeText(communityCode.value);
    success("Community code copied successfully.");
  } catch {
    warning("Unable to copy community code.");
  }
};

const toggleMemberDropdown = (memberId, event) => {
  if (activeMemberDropdown.value === memberId) {
    activeMemberDropdown.value = null;
    return;
  }
  const rect = event.currentTarget.getBoundingClientRect();
  dropdownPosition.value = { x: rect.right, y: rect.bottom + 4 };
  activeMemberDropdown.value = memberId;
};

const closeDropdown = () => {
  activeMemberDropdown.value = null;
};

const handleClickOutside = (e) => {
  if (activeMemberDropdown.value !== null) {
    closeDropdown();
  }
};

const loadOverview = async () => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      "http://localhost:5000/api/communities/overview",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (data.success) {
      isAdmin.value = data.role === "admin";
      communityCode.value = data.community.code || "";

      members.value = data.members.map((m) => ({
        id: m._id,
        name: `${m.firstName} ${m.lastName}`.trim(),
        email: m.email,
        role: m.role === "admin" ? "Admin" : "Member",
        avatar: m.avatar || userProfileImg,
        joined: new Date(m.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      }));

      if (isAdmin.value) {
        teamStats.value = [
          { id: 1, label: "Community Members",   value: data.stats.totalMembers,       icon: PhUserCircle,   change: "", copyable: false },
          { id: 2, label: "Community Code",      value: communityCode.value || "—",      icon: PhKey,          change: "", copyable: true  },
          { id: 3, label: "Active Tasks",        value: data.stats.activeTasks,         icon: PhHourglassHigh, change: "", copyable: false },
          { id: 4, label: "Pending Invitations", value: data.stats.pendingInvitations,  icon: PhNotebook,     change: "", copyable: false },
        ];
      } else {
        communityInfo.value = data.community;

        memberStats.value = [
          { id: 1, label: "Community Members", value: data.stats.totalMembers,      icon: PhUserCircle },
          { id: 2, label: "My Tasks",          value: data.stats.myTasks,            icon: PhNotebook },
          { id: 3, label: "Upcoming Meetings", value: data.stats.upcomingMeetings,   icon: PhCalendarCheck },
          { id: 4, label: "My Role",           value: data.role === "admin" ? "Admin" : "Member", icon: PhShieldCheck },
        ];
      }
    }
  } catch (err) {
    console.error("Failed to load overview", err);
    error.value = err.response?.data?.message || "Failed to load community details.";
  } finally {
    isLoading.value = false;
  }
};

const loadChatMessages = async () => {
  try {
    chatLoading.value = true;
    const token = localStorage.getItem("token");
    const { data } = await axios.get("http://localhost:5000/api/community-chat?limit=3", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (data.success) {
      chatMessages.value = data.messages;
    }
  } catch (err) {
    console.error("Failed to load chat", err);
  } finally {
    chatLoading.value = false;
  }
};

const formatTimeAgo = (dateString) => {
  const diff = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} d ago`;
};

const inviteForm = reactive({
  fullName: "",
  email: "",
  role: "user",
});

const handleSendInvitation = async () => {
  if (!inviteForm.fullName.trim() || !inviteForm.email.trim()) {
    warning("Please fill in the full name and email address.");
    return;
  }

  try {
    inviteLoading.value = true;
    const token = localStorage.getItem("token");

    const { data } = await axios.post(
      "http://localhost:5000/api/invitations",
      {
        fullName: inviteForm.fullName.trim(),
        email: inviteForm.email.trim(),
        role: inviteForm.role,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (data.success) {
      success("Invitation sent successfully.");
    } else {
      warning(data.message || "Invitation created but email delivery failed.");
    }

    inviteForm.fullName = "";
    inviteForm.email = "";
    inviteForm.role = "user";
  } catch (err) {
    warning(err.response?.data?.message || "Failed to send invitation.");
  } finally {
    inviteLoading.value = false;
  }
};

const copyMemberEmail = async (member) => {
  closeDropdown();
  try {
    await navigator.clipboard.writeText(member.email);
    success("Email copied successfully.");
  } catch (err) {
    warning("Unable to copy email.");
  }
};

const handleChangeRole = async (member) => {
  closeDropdown();
  const newRole = member.role === "Admin" ? "user" : "admin";
  try {
    actionLoading.value = true;
    const token = localStorage.getItem("token");
    const { data } = await axios.put(
      `http://localhost:5000/api/communities/members/${member.id}/role`,
      { role: newRole },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (data.success) {
      success(`Role updated to ${newRole}.`);
      await loadOverview();
    }
  } catch (err) {
    warning(err.response?.data?.message || "Failed to update role.");
  } finally {
    actionLoading.value = false;
  }
};

const handleRemoveMember = async (member) => {
  closeDropdown();
  try {
    actionLoading.value = true;
    const token = localStorage.getItem("token");
    const { data } = await axios.delete(
      `http://localhost:5000/api/communities/members/${member.id}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (data.success) {
      success("Member removed from community.");
      await loadOverview();
    }
  } catch (err) {
    warning(err.response?.data?.message || "Failed to remove member.");
  } finally {
    actionLoading.value = false;
  }
};

onMounted(() => {
  loadOverview();
  loadChatMessages();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
