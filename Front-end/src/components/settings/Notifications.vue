<template>
  <div
    class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-left"
  >
    <div class="lg:col-span-8 flex flex-col gap-6">
      <!-- Email Notifications -->
      <div
        class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass"
      >
        <div class="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
          <div
            class="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary"
          >
            <PhEnvelope :size="20" weight="bold" />
          </div>
          <div class="flex flex-col">
            <h3 class="font-header font-bold text-lg text-brand-dark">
              Email Notifications
            </h3>
            <p class="text-xs text-brand-slate">
              Manage the frequency of meeting insight emails to your inbox.
            </p>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <!-- Meeting Summaries -->
          <div
            class="flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 rounded-2xl"
          >
            <div class="flex flex-col w-[80%] text-left">
              <span class="text-sm font-bold text-brand-dark leading-tight"
                >Meeting Summaries</span
              >
              <span class="text-xs text-brand-slate mt-0.5"
                >Receive AI-generated summaries and tasks after every call</span
              >
            </div>
            <button
              type="button"
              @click="notifForm.summaries = !notifForm.summaries"
              class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5 dark:border-white/10"
              :class="notifForm.summaries ? 'bg-primary' : 'bg-brand-slate/30'"
            >
              <span
                class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm"
                :style="{
                  transform: notifForm.summaries
                    ? 'translateX(22px)'
                    : 'translateX(3px)',
                }"
              ></span>
            </button>
          </div>

          <!-- Performance Reports -->
          <div
            class="flex items-center justify-between p-3.5 bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 rounded-2xl"
          >
            <div class="flex flex-col w-[80%] text-left">
              <span class="text-sm font-bold text-brand-dark leading-tight"
                >Performance Reports</span
              >
              <span class="text-xs text-brand-slate mt-0.5"
                >Weekly analytics on meeting efficiency and velocity
                tracking</span
              >
            </div>
            <button
              type="button"
              @click="notifForm.reports = !notifForm.reports"
              class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5 dark:border-white/10"
              :class="notifForm.reports ? 'bg-primary' : 'bg-brand-slate/30'"
            >
              <span
                class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm"
                :style="{
                  transform: notifForm.reports
                    ? 'translateX(22px)'
                    : 'translateX(3px)',
                }"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Meeting Reminders -->
      <div
        class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass"
      >
        <div class="flex items-center gap-3 pb-4 border-b border-black/5 dark:border-white/5">
          <div
            class="w-10 h-10 rounded-xl bg-secondary/8 border border-secondary/15 flex items-center justify-center text-secondary"
          >
            <PhBell :size="20" weight="bold" />
          </div>
          <div class="flex flex-col">
            <h3 class="font-header font-bold text-lg text-brand-dark">
              Meeting Reminders
            </h3>
            <p class="text-xs text-brand-slate">
              Fine-tune exactly when you should be disturbed.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div class="flex flex-col gap-2">
            <Select
              v-model="notifForm.digestTime"
              :options="digestTimeOptions"
              label="Daily Digest Time"
            />
          </div>

          <div class="flex flex-col gap-2">
            <Select
              v-model="notifForm.reminderWindow"
              :options="reminderWindowOptions"
              label="Before Meeting Starts"
            />
          </div>

          <div class="flex flex-col gap-2 md:col-span-2 pt-2">
            <div
              class="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 rounded-2xl"
            >
              <div class="flex flex-col">
                <span class="text-xs font-bold text-brand-dark leading-tight"
                  >Enable Quiet Hours (DND)</span
                >
                <span class="text-[10px] text-brand-slate mt-0.5"
                  >Suppress push notifications during selected timezone
                  slot</span
                >
              </div>
              <button
                type="button"
                @click="notifForm.quietHours = !notifForm.quietHours"
                class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-black/5 dark:border-white/10"
                :class="
                  notifForm.quietHours ? 'bg-primary' : 'bg-brand-slate/30'
                "
              >
                <span
                  class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm"
                  :style="{
                    transform: notifForm.quietHours
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

    <!-- Sidebar Settings -->
    <div class="lg:col-span-4 flex flex-col gap-6">
      <!-- AI Insights Recommendation -->
      <div
        class="bg-gradient-to-br from-primary/10 via-white/50 to-white/80 dark:via-slate-900/50 dark:to-slate-900/80 border border-primary/20 dark:border-primary/20 rounded-[24px] p-6 text-left flex flex-col gap-3"
      >
        <div
          class="flex items-center gap-2 text-primary font-bold text-xs uppercase"
        >
          <PhSparkle :size="16" weight="bold" />
          <span>AI Insights Recommendation</span>
        </div>
        <p class="text-xs text-brand-dark dark:text-slate-200 font-medium leading-relaxed">
          SmartMeet AI suggests moving summaries to 'Daily Digest' to reduce
          notification fatigue during peak morning core hours.
        </p>
        <button
          @click="applyDigestRecommendation"
          class="py-2.5 mt-2 rounded-xl bg-grad-primary text-white text-[11px] font-bold tracking-wider uppercase hover:shadow-sm transition-all cursor-pointer"
        >
          Apply
        </button>
      </div>

      <!-- Push Settings -->
      <div
        class="card-glass rounded-[28px] p-6 flex flex-col gap-4 text-left border border-white/80 shadow-glass"
      >
        <h3
          class="font-header font-bold text-base text-brand-dark pb-2 border-b border-black/5 dark:border-white/5"
        >
          Push Settings
        </h3>

        <div class="flex flex-col gap-3 mt-1">
          <!-- Desktop Notifications -->
          <div
            @click="notifForm.pushDesktop = !notifForm.pushDesktop"
            class="flex items-center gap-3 cursor-pointer select-none"
          >
            <div
              class="w-[20px] h-[20px] rounded-[4px] border-[2px] border-brand-slate/40 flex items-center justify-center"
              :class="
                notifForm.pushDesktop
                  ? 'border-primary bg-primary text-white'
                  : ''
              "
            >
              <PhCheck v-if="notifForm.pushDesktop" :size="12" weight="bold" />
            </div>
            <span class="text-xs font-semibold text-brand-dark"
              >Desktop Notifications</span
            >
          </div>

          <!-- Mobile Push Alerts -->
          <div
            @click="notifForm.pushMobile = !notifForm.pushMobile"
            class="flex items-center gap-3 cursor-pointer select-none"
          >
            <div
              class="w-[20px] h-[20px] rounded-[4px] border-[2px] border-brand-slate/40 flex items-center justify-center"
              :class="
                notifForm.pushMobile
                  ? 'border-primary bg-primary text-white'
                  : ''
              "
            >
              <PhCheck v-if="notifForm.pushMobile" :size="12" weight="bold" />
            </div>
            <span class="text-xs font-semibold text-brand-dark"
              >Mobile Push Alerts</span
            >
          </div>
        </div>
      </div>
    </div>

    <Toast />
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, watch } from "vue";
import axios from "axios";
import { PhEnvelope, PhBell, PhSparkle, PhCheck } from "@phosphor-icons/vue";
import Select from "../ui/Select.vue";
import Toast from "../ui/Toast.vue";
import { useToasts } from "../../composables/useToasts";

const digestTimeOptions = [
  "08:00 AM",
  { value: "09:00 AM", label: "09:00 AM (Default)" },
  "10:00 AM",
];

const reminderWindowOptions = [
  { value: "5m", label: "5 minutes before" },
  { value: "10m", label: "10 minutes before (Default)" },
  { value: "15m", label: "15 minutes before" },
];

const notifForm = reactive({
  summaries: true,
  reports: true,
  digestTime: "09:00 AM",
  reminderWindow: "10m",
  quietHours: false,
  pushDesktop: true,
  pushMobile: true,
});

const { success } = useToasts();
const isLoaded = ref(false);

const getHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Fetch settings from the backend database on mount
const fetchSettings = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:5000/api/users/notification-settings",
      getHeaders(),
    );
    if (data.success && data.notificationSettings) {
      Object.assign(notifForm, data.notificationSettings);
    }
  } catch (error) {
    console.error("Failed to fetch notification settings:", error);
  } finally {
    isLoaded.value = true;
  }
};

// Save settings to the backend database
const saveSettings = async () => {
  try {
    const { data } = await axios.put(
      "http://localhost:5000/api/users/notification-settings",
      notifForm,
      getHeaders(),
    );
    if (data.success) {
      success("Preferences auto-saved.");
    }
  } catch (error) {
    console.error("Failed to update notification settings:", error);
  }
};

// Trigger auto-save whenever any toggle or select element changes
watch(
  notifForm,
  () => {
    if (isLoaded.value) {
      saveSettings();
    }
  },
  { deep: true },
);

onMounted(() => {
  fetchSettings();
});

const applyDigestRecommendation = () => {
  notifForm.summaries = false;
  notifForm.digestTime = "09:00 AM";
  success(
    "Successfully applied AI recommendation. Summaries scheduled for 09:00 AM digest.",
  );
};
</script>
