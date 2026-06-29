<template>
  <div class="flex flex-col gap-6 animate-fade-in text-left">
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
          <div
            v-if="stat.id === 4"
            class="flex items-center justify-between mt-2"
          >
            <span
              class="text-xl font-bold font-header text-brand-dark tracking-wider"
            >
              {{ communityCode }}
            </span>

            <button
              @click="copyCommunityCode"
              class="flex items-center gap-2 px-3 py-2 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] uppercase shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_20px_rgba(75,104,255,0.35)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              <PhCopy :size="13" weight="bold" />
              Copy
            </button>
          </div>

          <span
            v-else
            class="text-xl font-bold font-header text-brand-dark block mt-0.5"
          >
            {{ stat.value }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div
        class="lg:col-span-8 card-glass rounded-[28px] p-6 flex flex-col gap-5 border border-white/80 shadow-glass"
      >
        <div
          class="flex justify-between items-center pb-3 border-b border-black/5 flex-wrap gap-3"
        >
          <h3 class="font-header font-bold text-lg text-brand-dark">
            Team Members
          </h3>

          <div class="relative w-48">
            <input
              v-model="memberSearchQuery"
              type="text"
              placeholder="Search members..."
              class="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-black/8 font-body text-xs text-brand-dark focus:outline-none"
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
                class="border-b border-black/5 font-extrabold text-brand-slate uppercase pb-3"
              >
                <th class="pb-3 pr-4">Member</th>
                <th class="pb-3 px-4">Role</th>
                <th class="pb-3 px-4">Email</th>
                <th class="pb-3 px-4">Joined</th>
                <th class="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/5">
              <tr
                v-for="m in filteredMembers"
                :key="m.id"
                class="hover:bg-primary/[0.01]"
              >
                <td class="py-3 pr-4">
                  <div class="flex items-center gap-3">
                    <img
                      :src="m.avatar"
                      :alt="m.name"
                      class="w-9 h-9 rounded-full object-cover"
                    />

                    <span class="font-bold text-brand-dark">
                      {{ m.name }}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span
                    class="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase"
                    :class="getRoleBadgeClass(m.role)"
                  >
                    {{ m.role }}
                  </span>
                </td>
                <td class="py-3 px-4 text-brand-slate font-medium">
                  {{ m.email }}
                </td>
                <td class="py-3 px-4 font-semibold text-brand-slate">
                  {{ m.joined }}
                </td>
                <td class="py-3 pl-4 text-right">
                  <button
                    @click="handleMemberAction(m.id)"
                    class="w-7 h-7 rounded-lg hover:bg-black/5 flex items-center justify-center text-brand-slate transition-colors cursor-pointer"
                  >
                    <PhDotsThreeOutlineVertical :size="14" weight="bold" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="lg:col-span-4 flex flex-col gap-6">
        <div
          class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left border border-white/80 shadow-glass"
        >
          <h3
            class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5"
          >
            Invite Member
          </h3>

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
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/8 font-body text-xs text-brand-dark focus:outline-none"
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
                class="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/8 font-body text-xs text-brand-dark focus:outline-none"
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
            class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5"
          >
            Workspace Activity
          </h3>

          <div
            class="flex flex-col gap-3.5 max-h-[200px] overflow-y-auto pr-1 scroll-container"
          >
            <div
              v-for="(act, idx) in activityFeed"
              :key="idx"
              class="flex gap-2.5 items-start text-[11px]"
            >
              <div
                class="w-2.5 h-2.5 rounded-full bg-primary/40 mt-1 flex-shrink-0"
              ></div>
              <div class="flex flex-col">
                <span class="font-semibold text-brand-dark leading-tight">{{
                  act.text
                }}</span>
                <span class="text-brand-slate mt-0.5">{{ act.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import axios from "axios";
import {
  PhUserCircle,
  PhPhoneCall,
  PhHourglassHigh,
  PhNotebook,
  PhMagnifyingGlass,
  PhDotsThreeOutlineVertical,
  PhCopy,
} from "@phosphor-icons/vue";
import Select from "../ui/Select.vue";

import Toast from "../ui/Toast.vue";
import { useToasts } from "../../composables/useToasts";

import userProfileImg from "../../assets/User Profile.png";

const roleOptions = [
  { value: "user", label: "User" },
  { value: "admin", label: "Admin" },
];

const teamStats = [
  {
    id: 1,
    label: "Total Members",
    value: "248",
    icon: PhUserCircle,
    change: "+12%",
  },
  {
    id: 2,
    label: "Active Meetings",
    value: "14",
    icon: PhPhoneCall,
    change: "Stable",
  },
  {
    id: 3,
    label: "Video Hours",
    value: "1,420h",
    icon: PhHourglassHigh,
    change: "+8%",
  },
  {
    id: 4,
    label: "Community Code",
    value: "",
    icon: PhNotebook,
    change: "",
  },
];

const members = ref([]);
const memberSearchQuery = ref("");
const communityCode = ref("");
const inviteLoading = ref(false);

const { success, warning, info } = useToasts();

const loadMembers = async () => {
  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      "http://localhost:5000/api/communities/members",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

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

    if (data.communityCode) {
      communityCode.value = data.communityCode;
    }
  } catch (err) {
    console.error("Failed to load members", err);
  }
};

const filteredMembers = computed(() => {
  if (!memberSearchQuery.value.trim()) return members.value;
  const q = memberSearchQuery.value.toLowerCase();
  return members.value.filter(
    (m) =>
      m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
  );
});

const getRoleBadgeClass = (role) => {
  switch (role) {
    case "Admin":
      return "bg-red-500/10 border border-red-500/15 text-red-600";
    case "Manager":
      return "bg-purple-500/10 border border-purple-500/15 text-purple-600";
    case "Member":
    default:
      return "bg-blue-500/10 border border-blue-500/15 text-blue-600";
  }
};

const handleMemberAction = (id) => {
  const m = members.value.find((member) => member.id === id);
  if (m) {
    info(`Options for ${m.name}: Demote, Revoke Access, Force Logout.`);
  }
};

const copyCommunityCode = async () => {
  try {
    await navigator.clipboard.writeText(communityCode.value);
    success("Community code copied successfully.");
  } catch {
    warning("Unable to copy community code.");
  }
};

const inviteForm = reactive({
  fullName: "",
  email: "",
  role: "user",
});

const activityFeed = ref([
  {
    text: "Alexander Sterling updated AI insights model settings",
    time: "1 hour ago",
  },
  {
    text: "Slack Integration connected to channel #product-insights",
    time: "2 hours ago",
  },
  { text: "David Chen updated workspace billing settings", time: "Yesterday" },
]);

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

onMounted(() => {
  loadMembers();
});
</script>

<style scoped>
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
