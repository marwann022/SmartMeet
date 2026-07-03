<template>
  <div class="flex flex-col gap-8 text-left mt-8">
    <!-- Breadcrumb / Header -->
    <div class="flex flex-col gap-2">
      <div
        class="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase"
      >
        <PhSparkle :size="16" weight="bold" />
        <span>Intelligent Scheduling</span>
      </div>
      <h2
        class="text-3xl sm:text-4xl font-bold font-header text-brand-dark tracking-tight"
      >
        Schedule New Meeting
      </h2>
      <p class="text-sm text-brand-slate max-w-2xl">
        Initialize your next session with AI-enhanced context preparation,
        automated documentation, and stakeholder alignment.
      </p>
    </div>

    <!-- Main Scheduler Form -->
    <div class="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
      <!-- Left Column: Details & Intelligence Settings -->
      <div class="flex flex-col gap-8">
        <!-- Meeting details card -->
        <div
          class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 relative z-20"
        >
          <div class="flex items-center gap-2.5 pb-4 border-b border-black/5 dark:border-white/5">
            <PhInfo :size="20" class="text-primary" />
            <h3 class="font-header font-bold text-xl text-brand-dark">
              Meeting Details
            </h3>
          </div>

          <div class="flex flex-col gap-5">
            <!-- Mode Selector -->
            <div class="flex flex-col gap-2">
              <Select
                v-model="meetingMode"
                :options="modeOptions"
                label="Scheduling Mode"
              />
            </div>

            <!-- Title -->
            <div class="flex flex-col gap-2">
              <label
                class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1"
                >Meeting Title</label
              >
              <input
                v-model="form.title"
                type="text"
                placeholder="e.g. Q4 Product Roadmap Alignment"
                class="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-body text-sm text-brand-dark placeholder-brand-slate/40 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300"
                :class="{ 'border-red-400': errors.title }"
              />
              <span
                v-if="errors.title"
                class="text-[11px] text-red-500 font-semibold ml-1"
                >{{ errors.title }}</span
              >
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-2">
              <label
                class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1"
                >Description</label
              >
              <textarea
                v-model="form.description"
                placeholder="What is the primary objective of this session?"
                rows="4"
                class="w-full px-4 py-3.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-body text-sm text-brand-dark placeholder-brand-slate/40 focus:outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)] transition-all duration-300 resize-none"
                :class="{ 'border-red-400': errors.description }"
              ></textarea>
              <span
                v-if="errors.description"
                class="text-[11px] text-red-500 font-semibold ml-1"
                >{{ errors.description }}</span
              >
            </div>

            <!-- Meeting Type Select (Visible for both Scheduled & Instant meetings) -->
            <div class="flex flex-col gap-2">
              <label
                class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1"
                >Meeting Type</label
              >
              <div 
                class="grid gap-3"
                :class="authStore.user?.role === 'admin' ? 'grid-cols-3' : 'grid-cols-2'"
              >
                <button
                  type="button"
                  @click="setMeetingType('personal')"
                  class="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border dark:border-white/10 transition-all duration-300 cursor-pointer"
                  :class="
                    form.type === 'Personal'
                      ? 'bg-primary/8 border-primary text-primary font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-950/60 border-black/8 dark:border-white/10 text-brand-slate hover:bg-black/5 dark:hover:bg-white/5'
                  "
                >
                  <PhUser :size="24" class="text-primary" weight="bold" />
                  <span class="text-xs">Personal</span>
                </button>
                <button
                  type="button"
                  @click="setMeetingType('team')"
                  class="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border dark:border-white/10 transition-all duration-300 cursor-pointer"
                  :class="
                    form.type === 'Team'
                      ? 'bg-primary/8 border-primary text-primary font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-950/60 border-black/8 dark:border-white/10 text-brand-slate hover:bg-black/5 dark:hover:bg-white/5'
                  "
                >
                  <PhUsersThree :size="24" class="text-primary" weight="bold" />
                  <span class="text-xs">Team</span>
                </button>
                <button
                  v-if="authStore.user?.role === 'admin'"
                  type="button"
                  @click="setMeetingType('custom')"
                  class="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border dark:border-white/10 transition-all duration-300 cursor-pointer"
                  :class="
                    form.type === 'Custom'
                      ? 'bg-primary/8 border-primary text-primary font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-950/60 border-black/8 dark:border-white/10 text-brand-slate hover:bg-black/5 dark:hover:bg-white/5'
                  "
                >
                  <PhBrain :size="24" class="text-primary" weight="bold" />
                  <span class="text-xs">Custom</span>
                </button>
              </div>
            </div>

            <!-- Smoothly animated Scheduled Meeting settings -->
            <transition
              name="expand-fade"
              @before-enter="el => el.style.overflow = 'hidden'"
              @after-enter="el => el.style.overflow = 'visible'"
              @before-leave="el => el.style.overflow = 'hidden'"
              @after-leave="el => el.style.overflow = 'visible'"
            >
              <div v-if="meetingMode === 'schedule'" class="flex flex-col gap-5">

                <!-- Date, Time & Duration row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <!-- Date & Time Pickers side-by-side -->
                  <div class="flex flex-col gap-1.5">
                    <div class="grid grid-cols-2 gap-3">
                      <!-- Date Picker -->
                      <DatePicker
                        v-model="form.date"
                        label="Date"
                        :has-error="!!errors.datetime"
                      />

                      <!-- Time Picker -->
                      <TimePicker
                        v-model="form.time"
                        label="Time"
                        :has-error="!!errors.datetime"
                        :is-today="isTodaySelected"
                      />
                    </div>
                    <span
                      v-if="errors.datetime"
                      class="text-[11px] text-red-500 font-semibold ml-1"
                      >{{ errors.datetime }}</span
                    >
                  </div>

                  <!-- Duration -->
                  <div class="flex flex-col gap-1.5">
                    <Select
                      v-model="form.duration"
                      :options="durationOptions"
                      label="Duration"
                    />
                  </div>
                </div>
              </div>
            </transition>

            <div class="flex flex-col gap-3 mt-8">
              <button
                type="button"
                @click="submitMeeting"
                :disabled="isSubmitting"
                class="w-full py-4 rounded-2xl bg-grad-primary text-white font-header font-bold text-xs tracking-wider uppercase shadow-[0_6px_20px_rgba(75,104,255,0.25)] hover:shadow-[0_8px_25px_rgba(75,104,255,0.35)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="isSubmitting"
                  class="animate-spinner h-4 w-4 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <PhSparkle v-else :size="16" weight="bold" />
                <span>{{
                  isSubmitting
                    ? "Creating Meeting..."
                    : "Create Intelligence-Enabled Meeting"
                }}</span>
              </button>
              <button
                type="button"
                @click="goToDashboard"
                class="w-full py-3.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-header font-bold text-xs tracking-wider uppercase text-brand-dark hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer"
              >
                Cancel and Discard
              </button>
            </div>
          </div>
        </div>

        <!-- Intelligence settings card -->
        <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
          <div class="flex items-center gap-2.5 pb-4 border-b border-black/5 dark:border-white/5">
            <PhBrain :size="20" class="text-primary" />
            <h3 class="font-header font-bold text-xl text-brand-dark">
              Intelligence Settings
            </h3>
          </div>

          <div class="flex flex-col gap-5">
            <!-- AI Summary Style -->
            <div class="flex flex-col gap-2">
              <Select
                v-model="form.summaryStyle"
                :options="summaryStyleOptions"
                label="AI Summary Style"
              />
            </div>

            <!-- Custom Switches -->
            <div class="flex flex-col gap-4 pt-2">
              <!-- Switch 1: Record Meeting -->
              <div
                class="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-950/40 border border-black/[0.03] dark:border-white/10 rounded-2xl"
              >
                <div class="flex flex-col text-left">
                  <span class="text-sm font-bold text-brand-dark leading-tight"
                    >Record Meeting Video</span
                  >
                  <span class="text-[11px] text-brand-slate mt-0.5"
                    >Store cloud recording securely for 30 days</span
                  >
                </div>
                <button
                  type="button"
                  @click="form.record = !form.record"
                  class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5 dark:border-white/10"
                  :class="form.record ? 'bg-primary' : 'bg-brand-slate/30'"
                >
                  <span
                    class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm"
                    :style="{
                      transform: form.record
                        ? 'translateX(22px)'
                        : 'translateX(3px)',
                    }"
                  ></span>
                </button>
              </div>

              <!-- Switch 2: Real-time Transcription -->
              <div
                class="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-950/40 border border-black/[0.03] dark:border-white/10 rounded-2xl"
              >
                <div class="flex flex-col text-left">
                  <span class="text-sm font-bold text-brand-dark leading-tight"
                    >Real-time Transcription</span
                  >
                  <span class="text-[11px] text-brand-slate mt-0.5"
                    >Live captions and speaker logging for attendees</span
                  >
                </div>
                <button
                  type="button"
                  @click="form.transcribe = !form.transcribe"
                  class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5 dark:border-white/10"
                  :class="form.transcribe ? 'bg-primary' : 'bg-brand-slate/30'"
                >
                  <span
                    class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm"
                    :style="{
                      transform: form.transcribe
                        ? 'translateX(22px)'
                        : 'translateX(3px)',
                    }"
                  ></span>
                </button>
              </div>

              <!-- Switch 3: Auto-extract Tasks -->
              <div
                class="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-950/40 border border-black/[0.03] dark:border-white/10 rounded-2xl"
              >
                <div class="flex flex-col text-left">
                  <span class="text-sm font-bold text-brand-dark leading-tight"
                    >Auto-extract Tasks</span
                  >
                  <span class="text-[11px] text-brand-slate mt-0.5"
                    >Automatically identify action items and sync with Tasks
                    tab</span
                  >
                </div>
                <button
                  type="button"
                  @click="form.extractTasks = !form.extractTasks"
                  class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5 dark:border-white/10"
                  :class="
                    form.extractTasks ? 'bg-primary' : 'bg-brand-slate/30'
                  "
                >
                  <span
                    class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm"
                    :style="{
                      transform: form.extractTasks
                        ? 'translateX(22px)'
                        : 'translateX(3px)',
                    }"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Participants & Sync Settings -->
      <div class="flex flex-col gap-8">
        <!-- Participants Card -->
        <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
          <div class="flex items-center gap-2.5 pb-4 border-b border-black/5 dark:border-white/5">
            <PhUsersThree :size="20" class="text-primary" />
            <h3 class="font-header font-bold text-xl text-brand-dark">
              Participants
            </h3>
          </div>

          <div class="flex flex-col gap-4">
            <!-- 1. Personal Selection -->
            <div v-if="form.type === 'Personal'" class="w-full text-left">
              <Select
                v-model="selectedPersonalMember"
                @change="handlePersonalMemberChange"
                label="Select Personal Contact"
                placeholder="Choose a team member..."
                :options="membersList
                  .filter(u => `${u.firstName} ${u.lastName}` !== authStore.user?.name)
                  .map(m => ({
                    value: `${m.firstName} ${m.lastName}`,
                    label: `${m.firstName} ${m.lastName} (${m.email})`
                  }))"
              />
            </div>

            <!-- 2. Team View -->
            <div v-else-if="form.type === 'Team'" class="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-left">
              <span class="text-xs font-semibold text-primary block mb-1">Team Meeting Mode</span>
              <p class="text-[11px] text-brand-slate leading-relaxed">
                All team members are automatically added as participants:
              </p>
              <div class="flex flex-wrap gap-1.5 mt-2.5">
                <span 
                  v-for="p in form.participants" 
                  :key="p"
                  class="inline-block px-2.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-black/5 dark:border-white/5 text-[10px] font-bold text-brand-dark"
                >
                  {{ p }}
                </span>
                <span 
                  v-if="form.participants.length === 0" 
                  class="text-[10px] text-brand-slate italic"
                >
                  No other members found in your team.
                </span>
              </div>
            </div>

            <!-- 3. Custom View -->
            <div v-else class="flex flex-col gap-4">
              <!-- Add stakeholder input -->
              <div class="flex flex-col gap-2">
                <label class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">
                  Add Stakeholder
                </label>
                <div class="flex gap-2">
                  <input
                    v-model="participantInput"
                    @keydown.enter.prevent="addParticipant"
                    type="text"
                    placeholder="Enter custom name/email..."
                    class="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 font-body text-sm text-brand-dark placeholder-brand-slate/40 focus:outline-none focus:border-primary/30 transition-all duration-300"
                  />
                  <button
                    type="button"
                    @click="addParticipant"
                    class="w-10 h-10 rounded-xl bg-primary hover:bg-[#3b52e3] text-white flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <PhPlus :size="16" weight="bold" />
                  </button>
                </div>
              </div>

              <!-- Quick Select Team Members -->
              <div v-if="membersList.filter(u => `${u.firstName} ${u.lastName}` !== authStore.user?.name).length > 0" class="flex flex-col gap-1.5">
                <span class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">
                  Quick Select Team Members
                </span>
                <div class="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-1 border border-black/[0.03] dark:border-white/5 rounded-xl bg-black/[0.01] dark:bg-white/[0.01]">
                  <button
                    v-for="m in membersList.filter(u => `${u.firstName} ${u.lastName}` !== authStore.user?.name)"
                    :key="m._id"
                    type="button"
                    @click="toggleCustomMember(`${m.firstName} ${m.lastName}`)"
                    class="px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all cursor-pointer select-none"
                    :class="form.participants.includes(`${m.firstName} ${m.lastName}`)
                      ? 'bg-primary/8 border-primary text-primary font-bold shadow-sm'
                      : 'bg-white dark:bg-slate-950/40 border-black/5 text-brand-slate hover:bg-black/5'"
                  >
                    {{ m.firstName }} {{ m.lastName }}
                  </button>
                </div>
              </div>

              <!-- Added participants list tags -->
              <div class="flex flex-col gap-2 mt-2">
                <span class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1">
                  Selected Attendees ({{ form.participants.length }})
                </span>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="(p, index) in form.participants"
                    :key="index"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-xs text-primary font-bold transition-all duration-300 hover:bg-primary/12"
                  >
                    <span>{{ p }}</span>
                    <button
                      type="button"
                      @click="removeParticipant(index)"
                      class="w-[18px] h-[18px] rounded-full hover:bg-primary/20 flex items-center justify-center text-primary/80 hover:text-primary transition-colors cursor-pointer"
                    >
                      <PhX :size="10" weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Integrations Card -->
        <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
          <div class="flex items-center gap-2.5 pb-4 border-b border-black/5 dark:border-white/5">
            <PhArrowsMerge :size="20" class="text-primary" />
            <h3 class="font-header font-bold text-xl text-brand-dark">
              Integrations
            </h3>
          </div>

          <div class="flex flex-col gap-4">
            <!-- Sync Slack -->
            <div
              class="flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-950/40 border border-black/[0.03] dark:border-white/10 rounded-2xl"
            >
              <div class="flex items-center gap-3 w-[70%]">
                <img
                  :src="slackIcon"
                  alt="Slack"
                  class="w-8 h-8 object-contain flex-shrink-0"
                />
                <div class="flex flex-col text-left">
                  <span class="text-xs font-bold text-brand-dark leading-snug"
                    >Post Summary to Slack</span
                  >
                  <span class="text-[9px] text-brand-slate leading-normal"
                    >Send post-meeting details to channel</span
                  >
                </div>
              </div>
              <button
                type="button"
                @click="form.syncSlack = !form.syncSlack"
                class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5 dark:border-white/10"
                :class="form.syncSlack ? 'bg-[#4a154b]' : 'bg-brand-slate/30'"
              >
                <span
                  class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm"
                  :style="{
                    transform: form.syncSlack
                      ? 'translateX(22px)'
                      : 'translateX(3px)',
                  }"
                ></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMeetingStore } from "@/stores/meeting";
import { useAuthStore } from "@/stores/auth";
import { useAlertStore } from "@/stores/alert";
import { useDashboardStore } from "@/stores/dashboard";
import {
  PhSparkle,
  PhInfo,
  PhBrain,
  PhUsersThree,
  PhArrowsMerge,
  PhPlus,
  PhX,
  PhUser,
} from "@phosphor-icons/vue";
import Select from "@/components/ui/Select.vue";
import DatePicker from "@/components/ui/DatePicker.vue";
import TimePicker from "@/components/ui/TimePicker.vue";

const durationOptions = [
  { value: "15 minutes", label: "15 minutes (Quick Catch-up)" },
  { value: "30 minutes", label: "30 minutes (Standard)" },
  { value: "45 minutes", label: "45 minutes (Strategic Sync)" },
  { value: "60 minutes", label: "60 minutes (Deep Dive)" },
];

const summaryStyleOptions = [
  {
    value: "Action-Oriented",
    label: "Action-Oriented (Tasks & Decisions Focused)",
  },
  { value: "Executive Brief", label: "Executive Brief (High-level Summary)" },
  {
    value: "Chronological Recurrent",
    label: "Chronological Recurrent (Verbatim timeline transcript summary)",
  },
];

// Import assets
import slackIcon from "@/assets/slack.png";

const router = useRouter();
const meetingStore = useMeetingStore();
const authStore = useAuthStore();
const alertStore = useAlertStore();
const dashboardStore = useDashboardStore();

// Fetch community members
const membersList = ref([]);
const selectedPersonalMember = ref("");

const fetchMembers = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/communities/members", {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    if (data.success) {
      membersList.value = data.members || [];
    }
  } catch (err) {
    console.error("Failed to fetch community members:", err);
  }
};

onMounted(() => {
  fetchMembers();
});

// Date & Time picker utility functions
const getTodayDateString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const getDefaultTimeString = () => {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  const hh = String(now.getHours()).padStart(2, "0");
  return `${hh}:00`;
};

// Form reactive state
const form = reactive({
  title: "",
  description: "",
  type: "Personal", // Default selection
  date: getTodayDateString(),
  time: getDefaultTimeString(),
  datetime: "",
  duration: "30 minutes",
  summaryStyle: "Action-Oriented",
  record: true,
  transcribe: true,
  extractTasks: true,
  participants: [],
  syncSlack: false,
});

const isTodaySelected = computed(() => {
  return form.date === getTodayDateString();
});

const participantInput = ref("");
const meetingMode = ref("instant");
const modeOptions = [
  { value: "instant", label: "Instant Meeting" },
  { value: "schedule", label: "Scheduled Meeting" },
];

const errors = reactive({
  title: "",
  description: "",
  datetime: "",
});

const isSubmitting = ref(false);

// Actions
const setMeetingType = (type) => {
  if (type === 'personal') {
    form.type = 'Personal';
    form.participants = [];
    selectedPersonalMember.value = '';
  } else if (type === 'team') {
    form.type = 'Team';
    const currentUserName = authStore.user?.name || "";
    const isCreatorAdmin = authStore.user?.role === 'admin';
    form.participants = membersList.value
      .filter(m => isCreatorAdmin || m.role !== 'admin')
      .map(m => `${m.firstName} ${m.lastName}`)
      .filter(name => name !== currentUserName);
  } else {
    form.type = 'Custom';
    form.participants = [];
  }
};

const handlePersonalMemberChange = () => {
  if (selectedPersonalMember.value) {
    form.participants = [selectedPersonalMember.value];
  }
};

const toggleCustomMember = (name) => {
  const idx = form.participants.indexOf(name);
  if (idx === -1) {
    form.participants.push(name);
  } else {
    form.participants.splice(idx, 1);
  }
};
const addParticipant = () => {
  const input = participantInput.value.trim();
  if (input) {
    // Basic duplicates avoidance
    if (!form.participants.includes(input)) {
      form.participants.push(input);
    }
    participantInput.value = "";
  }
};

const removeParticipant = (index) => {
  form.participants.splice(index, 1);
};

const validateForm = () => {
  let isValid = true;
  errors.title = "";
  errors.description = "";
  errors.datetime = "";

  if (!form.title.trim()) {
    errors.title = "Meeting title is required.";
    isValid = false;
  }

  if (!form.description.trim()) {
    errors.description = "Meeting description is required.";
    isValid = false;
  }

  if (meetingMode.value === 'schedule') {
    // Combine date and time to datetime format YYYY-MM-DDTHH:MM
    if (form.date && form.time) {
      form.datetime = `${form.date}T${form.time}`;
    } else {
      form.datetime = "";
    }

    if (!form.datetime) {
      errors.datetime = "Please choose a date & time.";
      isValid = false;
    }
  }

  return isValid;
};

const goToDashboard = () => {
  router.push("/dashboard");
};

const refreshDashboard = () => {
  meetingStore.fetchMeetings()
  dashboardStore.fetchStats()
  dashboardStore.fetchTeamAnalytics()
  dashboardStore.fetchInsights()
}

const submitMeeting = async () => {
  if (!validateForm()) return;
  isSubmitting.value = true;

  const meetingId = Date.now();

  if (meetingMode.value === 'instant') {
    const newMeeting = {
      title: form.title,
      description: form.description,
      type: form.type,
      startTime: new Date().toISOString(),
      duration: 30,
      meetLink: `https://meet.jit.si/SmartMeet_${meetingId}`,
      participants: [...form.participants],
    };

    const created = await meetingStore.createMeeting(newMeeting);
    refreshDashboard()
    meetingStore.activeLiveMeeting = created || {
      ...newMeeting,
      id: meetingId.toString(),
    };
    isSubmitting.value = false;
    router.push("/live-meeting");
  } else {
    const newMeeting = {
      title: form.title,
      description: form.description,
      type: form.type,
      datetime: form.datetime,
      duration: form.duration,
      meetLink: `https://meet.jit.si/SmartMeet_${meetingId}`,
      participants: [...form.participants],
    };

    const created = await meetingStore.createMeeting(newMeeting);
    refreshDashboard()
    isSubmitting.value = false;

    const scheduledTime = new Date(form.datetime);
    const now = new Date();

    if (scheduledTime - now > 120000) {
      await alertStore.showAlert("Meeting successfully scheduled! You can join it from the Archive once the start time is reached.", "Meeting Scheduled", "primary");
      router.push("/dashboard");
    } else {
      meetingStore.activeLiveMeeting = created || {
        ...newMeeting,
        id: meetingId.toString(),
      };
      router.push("/live-meeting");
    }
  }
};


</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Expand-fade animation for clean dropdown section toggles */
.expand-fade-enter-active,
.expand-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 400px;
  opacity: 1;
}

.expand-fade-enter-from,
.expand-fade-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px);
  margin-top: 0;
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
