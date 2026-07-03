<template>
  <header
    class="sticky top-5 z-[100] flex items-center justify-between px-7 py-2.5 rounded-full bg-white/65 dark:bg-slate-900/65 border border-black/5 dark:border-white/5 shadow-glass backdrop-blur-[20px] mt-5 mb-8 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-white/10 dark:hover:border-slate-700 hover:bg-white/75 dark:hover:bg-slate-800/75 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.08),0_0_20px_rgba(75,104,255,0.05)]"
  >
    <!-- Logo -->
    <router-link
      to="/"
      class="flex items-center transition-all duration-300 hover:scale-[1.02] cursor-pointer"
    >
      <img src="@/assets/logo_clean.png" alt="SmartMeet" class="h-10 block" />
    </router-link>

    <!-- Navigation Links -->
    <nav class="flex items-center gap-6">
      <!-- Guest Navigation -->
      <template v-if="!authenticated">
        <router-link
          to="/"
          class="text-xs font-semibold relative py-1.5 px-3.5 rounded-full border border-transparent transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none"
          :class="
            $route.path === '/'
              ? 'text-primary bg-primary/8 border-transparent'
              : 'text-brand-slate hover:text-primary hover:bg-primary/5'
          "
        >
          Home
        </router-link>

        <router-link
          to="/features"
          class="text-xs font-semibold relative py-1.5 px-3.5 rounded-full border border-transparent transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none"
          :class="
            $route.path === '/features'
              ? 'text-primary bg-primary/8 border-transparent'
              : 'text-brand-slate hover:text-primary hover:bg-primary/5'
          "
        >
          Features
        </router-link>

        <router-link
          to="/pricing"
          class="text-xs font-semibold relative py-1.5 px-3.5 rounded-full border border-transparent transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none"
          :class="
            $route.path === '/pricing'
              ? 'text-primary bg-primary/8 border-transparent'
              : 'text-brand-slate hover:text-primary hover:bg-primary/5'
          "
        >
          Pricing
        </router-link>
      </template>

      <!-- Authenticated Navigation -->
      <template v-else>
        <router-link
          to="/"
          class="text-xs font-semibold relative py-1.5 px-3.5 rounded-full border border-transparent transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none"
          :class="
            $route.path === '/'
              ? 'text-primary bg-primary/8 border-transparent'
              : 'text-brand-slate hover:text-primary hover:bg-primary/5'
          "
        >
          Home
        </router-link>

        <router-link
          to="/features"
          class="text-xs font-semibold relative py-1.5 px-3.5 rounded-full border border-transparent transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none"
          :class="
            $route.path === '/features'
              ? 'text-primary bg-primary/8 border-transparent'
              : 'text-brand-slate hover:text-primary hover:bg-primary/5'
          "
        >
          Features
        </router-link>

        <router-link
          to="/pricing"
          class="text-xs font-semibold relative py-1.5 px-3.5 rounded-full border border-transparent transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none"
          :class="
            $route.path === '/pricing'
              ? 'text-primary bg-primary/8 border-transparent'
              : 'text-brand-slate hover:text-primary hover:bg-primary/5'
          "
        >
          Pricing
        </router-link>

        <router-link
          to="/dashboard"
          class="text-xs font-semibold relative py-1.5 px-3.5 rounded-full border border-transparent transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none"
          :class="
            $route.path === '/dashboard'
              ? 'text-primary bg-primary/8 border-transparent'
              : 'text-brand-slate hover:text-primary hover:bg-primary/5'
          "
        >
          Dashboard
        </router-link>
      </template>
    </nav>

    <!-- Right Section -->
    <div class="flex items-center gap-4">
      <!-- Theme Toggle Button -->
      <button
        @click="uiStore.toggleTheme"
        class="group bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center w-9 h-9 cursor-pointer text-brand-slate hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105 focus:outline-none transition-all duration-300"
        :title="
          uiStore.theme === 'light'
            ? 'Switch to Dark Mode'
            : 'Switch to Light Mode'
        "
      >
        <span class="sr-only">Toggle theme</span>
        <!-- Moon Icon -->
        <svg
          v-if="uiStore.theme === 'light'"
          class="w-[16px] h-[16px] text-brand-slate group-hover:text-primary"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
        <!-- Sun Icon -->
        <svg
          v-else
          class="w-[16px] h-[16px] text-brand-slate group-hover:text-primary"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m2.828 9.9a5 5 0 117.072-7.072 5 5 0 01-7.072 7.072z"
          />
        </svg>
      </button>

      <!-- Guest Actions -->
      <template v-if="!authenticated">
        <router-link
          to="/signin"
          class="text-xs font-semibold text-brand-slate hover:text-primary transition-colors"
        >
          Sign in
        </router-link>

        <router-link
          to="/signup"
          class="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold transition-all duration-300 hover:scale-105"
        >
          Get Started
        </router-link>
      </template>

      <!-- Authenticated Actions -->
      <template v-if="authenticated">
        <!-- Notifications Container -->
        <div ref="notificationsRef" class="relative">
          <button
            @click="isNotificationsOpen = !isNotificationsOpen"
            class="group bg-black/5 border border-white/10 rounded-full flex items-center justify-center w-9 h-9 cursor-pointer relative text-brand-slate transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105 focus:outline-none"
            aria-label="Notifications"
          >
            <PhBell
              :size="18"
              weight="bold"
              class="transition-colors duration-300 text-brand-slate group-hover:text-primary"
            />

            <!-- Unread badge indicator -->
            <span
              v-if="unreadCount > 0"
              class="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(75,104,255,1)]"
            ></span>
          </button>

          <!-- Notifications Dropdown -->
          <transition name="fade-slide">
            <div
              v-if="isNotificationsOpen"
              class="absolute right-0 top-full mt-3.5 w-80 bg-white/90 dark:bg-slate-900/95 border border-white/80 dark:border-slate-800 rounded-2xl shadow-glass backdrop-blur-[20px] p-4 text-left z-50 transform origin-top-right transition-all duration-300"
            >
              <div
                class="flex items-center justify-between border-b border-black/5 pb-2.5 mb-2.5"
              >
                <span class="text-xs font-bold text-brand-dark"
                  >Notifications</span
                >
                <div class="flex gap-2">
                  <button
                    v-if="unreadCount > 0"
                    @click="markAllAsRead"
                    class="text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                  <span
                    v-if="unreadCount > 0 && notifications.length > 0"
                    class="text-black/20 text-[10px]"
                    >|</span
                  >
                  <button
                    v-if="notifications.length > 0"
                    @click="clearAll"
                    class="text-[10px] font-semibold text-red-500 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <PhTrash :size="10" /> Clear all
                  </button>
                </div>
              </div>

              <!-- Notifications List -->
              <div class="max-h-60 overflow-y-auto space-y-2 pr-1">
                <template v-if="notifications.length > 0">
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    @click="handleNotificationClick(notification)"
                    class="p-2.5 rounded-xl transition-all duration-200 cursor-pointer border flex flex-col gap-1 text-[11px] leading-relaxed relative"
                    :class="
                      notification.read
                        ? 'bg-transparent border-transparent hover:bg-black/5'
                        : 'bg-primary/[0.03] border-primary/10 hover:bg-primary/[0.06] shadow-sm'
                    "
                  >
                    <span
                      v-if="!notification.read"
                      class="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full"
                    ></span>

                    <div class="pr-3">
                      <p
                        class="text-brand-dark font-semibold"
                        :class="{ 'font-bold': !notification.read }"
                      >
                        {{ notification.title }}
                      </p>

                      <p class="text-brand-slate text-[10px] mt-1">
                        {{ notification.message }}
                      </p>

                      <!-- Approve/Reject buttons - show only when unread join-request -->
                      <div
                        v-if="notification.type === 'join-request'"
                        class="mt-3"
                      >
                        <!-- Pending Request -->
                        <div
                          v-if="notification.status === 'pending'"
                          class="flex gap-2"
                        >
                          <button
                            @click.stop="approveJoinRequest(notification)"
                            class="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-bold transition-all duration-200 hover:scale-105"
                          >
                            Approve
                          </button>
                          <button
                            @click.stop="rejectJoinRequest(notification)"
                            class="px-2.5 py-1 rounded-full bg-red-500 text-white text-[10px] font-bold transition-all duration-200 hover:scale-105"
                          >
                            Reject
                          </button>
                        </div>

                        <!-- Approved -->
                        <p
                          v-else-if="notification.status === 'approved'"
                          class="text-[10px] font-semibold text-green-600 mt-2"
                        >
                          ✓ Request Approved
                        </p>

                        <!-- Rejected -->
                        <p
                          v-else-if="notification.status === 'rejected'"
                          class="text-[10px] font-semibold text-red-600 mt-2"
                        >
                          ✗ Request Rejected
                        </p>
                      </div>

                      <!-- Join Meeting button for meeting notifications -->
                      <div v-if="notification.type === 'meeting'" class="mt-3">
                        <button
                          @click.stop="joinMeeting(notification)"
                          :disabled="meetingStatuses[notification.relatedId] === 'completed'"
                          class="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-200"
                          :class="meetingStatuses[notification.relatedId] === 'completed' ? 'bg-brand-slate/30 text-brand-slate cursor-not-allowed' : 'bg-primary text-white hover:scale-105'"
                        >
                          {{ meetingStatuses[notification.relatedId] === 'completed' ? 'Ended' : 'Join Meeting' }}
                        </button>
                      </div>
                    </div>
                    <span class="text-[9px] text-brand-slate font-semibold">{{
                      notification.time
                    }}</span>
                  </div>
                </template>
                <div
                  v-else
                  class="py-6 flex flex-col items-center justify-center text-center"
                >
                  <PhBell
                    :size="24"
                    class="text-brand-slate mb-1.5 opacity-40"
                  />
                  <p class="text-xs text-brand-slate font-medium">
                    All caught up!
                  </p>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Profile Container -->
        <div ref="profileRef" class="relative flex items-center">
          <button
            @click="isProfileOpen = !isProfileOpen"
            class="cursor-pointer focus:outline-none bg-transparent border-0 flex items-center p-0"
          >
            <NavbarUserPanel />
          </button>

          <!-- Profile Dropdown -->
          <transition name="fade-slide">
            <div
              v-if="isProfileOpen"
              class="absolute right-0 top-full mt-3.5 w-52 bg-white/90 dark:bg-slate-900/95 border border-white/80 dark:border-slate-800 rounded-2xl shadow-glass backdrop-blur-[20px] p-2 text-left z-50 transform origin-top-right transition-all duration-300"
            >
              <div class="px-3 py-2 border-b border-black/5 mb-1.5">
                <p class="text-[11px] font-bold text-brand-dark truncate">
                  {{ user?.name || "User" }}
                </p>
                <p class="text-[9px] text-brand-slate truncate">
                  {{ user?.email || "user@smartmeet.ai" }}
                </p>
              </div>

              <div class="space-y-0.5">
                <router-link
                  to="/settings?tab=profile"
                  @click="isProfileOpen = false"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-brand-slate hover:text-brand-dark hover:bg-black/5 transition-all duration-200"
                >
                  <PhUser :size="14" weight="bold" class="text-brand-slate" />
                  <span>View Profile</span>
                </router-link>

                <router-link
                  to="/settings"
                  @click="isProfileOpen = false"
                  class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-brand-slate hover:text-brand-dark hover:bg-black/5 transition-all duration-200"
                >
                  <PhGear :size="14" weight="bold" class="text-brand-slate" />
                  <span>Settings</span>
                </router-link>

                <div class="border-t border-black/5 my-1"></div>

                <button
                  @click.stop="handleLogout"
                  class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/20 transition-all duration-200 cursor-pointer text-left focus:outline-none"
                >
                  <PhSignOut :size="14" weight="bold" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </template>
    </div>
    <!-- Reusable Modal for Logout Confirmation -->
    <Modal
      :show="showLogoutModal"
      title="Confirm Log Out"
      @close="showLogoutModal = false"
      maxWidth="sm"
    >
      <div class="flex flex-col gap-4 text-left">
        <p class="text-brand-slate text-sm font-body">
          Are you sure you want to log out of your SmartMeet account? Any
          unsaved changes may be lost.
        </p>

        <div class="flex gap-3 pt-2">
          <Button variant="danger" class="flex-1" @click="confirmLogout">
            Log Out
          </Button>
          <Button
            variant="outline"
            class="flex-1"
            @click="showLogoutModal = false"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useAlertStore } from '@/stores/alert'
import { useRouter } from "vue-router";
import {
  PhBell,
  PhUser,
  PhGear,
  PhSignOut,
  PhTrash,
} from "@phosphor-icons/vue";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { useMeetingStore } from "@/stores/meeting";
import { useUiStore } from "@/stores/ui";
import Modal from "@/components/ui/Modal.vue";
import Button from "@/components/ui/Button.vue";
import NavbarUserPanel from "@/components/common/NavbarUserPanel.vue";
import axios from "axios";
import { connectChatSocket, disconnectChatSocket } from '@/services/chatSocket'
const uiStore = useUiStore();
const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();
const meetingStore = useMeetingStore();
const alertStore = useAlertStore();

const authenticated = computed(() => authStore.isAuthenticated);

const user = computed(() => authStore.user);

const showLogoutModal = ref(false);

// UI Open/Close States
const isNotificationsOpen = ref(false);
const isProfileOpen = ref(false);

// DOM Element References for click-outside
const notificationsRef = ref(null);
const profileRef = ref(null);

// Bind Notifications state and computed count to Pinia store
const notifications = computed(() => notificationStore.notifications);
const unreadCount = computed(() => notificationStore.unreadCount);

const meetingStatuses = ref({})

const checkMeetingStatuses = async () => {
  const meetingNotifs = notifications.value.filter(n => n.type === 'meeting' && n.relatedId)
  for (const n of meetingNotifs) {
    if (meetingStatuses.value[n.relatedId] === undefined) {
      try {
        const meeting = await meetingStore.fetchMeeting(n.relatedId)
        if (meeting) {
          meetingStatuses.value[n.relatedId] = meeting.status || 'scheduled'
        }
      } catch {}
    }
  }
}

watch(notifications, () => { checkMeetingStatuses() }, { deep: true })

// Actions mapped to store actions
const markAsRead = (id) => {
  notificationStore.markAsRead(id);
};

const handleNotificationClick = (notification) => {
  markAsRead(notification.id);
  isNotificationsOpen.value = false;

  if (notification.type === "task") {
    router.push("/tasks");
  } else if (notification.type === "meeting") {
    router.push("/archive");
  } else {
    router.push("/dashboard");
  }
};

const joinMeeting = async (notification) => {
  await notificationStore.markAsRead(notification.id)
  isNotificationsOpen.value = false

  try {
    const meeting = await meetingStore.fetchMeeting(notification.relatedId)
    if (!meeting) {
      router.push('/archive')
      return
    }

    meetingStatuses.value[notification.relatedId] = meeting.status || 'scheduled'

    if (meeting.status === 'completed') {
      router.push('/archive')
      return
    }

    const scheduledTime = new Date(meeting.startTime)
    const now = new Date()
    if (scheduledTime - now > 300000) {
      router.push('/archive')
      return
    }

    meetingStore.activeLiveMeeting = meeting
    router.push('/live-meeting')
  } catch {
    router.push('/archive')
  }
}

const approveJoinRequest = async (notification) => {
  try {
    await axios.patch(
      `http://localhost:5000/api/join-requests/${notification.relatedId}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    // Refresh notifications
    await notificationStore.fetchNotifications();

    // Refresh authenticated user
    await authStore.fetchProfile?.();

    // Optional
    isNotificationsOpen.value = true;
  } catch (error) {
    console.error("Failed to approve request:", error);
  }
};

const rejectJoinRequest = async (notification) => {
  try {
    await axios.patch(
      `http://localhost:5000/api/join-requests/${notification.relatedId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      },
    );

    await notificationStore.fetchNotifications();
  } catch (error) {
    console.error("Failed to reject request:", error);
  }
};

const markAllAsRead = () => {
  notificationStore.markAllAsRead();
};

const clearAll = () => {
  notificationStore.clearAll();
};

const handleLogout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = () => {
  authStore.logout();
  showLogoutModal.value = false;
  isProfileOpen.value = false;
  router.replace("/");
  window.location.reload();
};

// Click Outside Handler
const handleClickOutside = (event) => {
  if (
    isNotificationsOpen.value &&
    notificationsRef.value &&
    !notificationsRef.value.contains(event.target)
  ) {
    isNotificationsOpen.value = false;
  }
  if (
    isProfileOpen.value &&
    profileRef.value &&
    !profileRef.value.contains(event.target)
  ) {
    isProfileOpen.value = false;
  }
};

let notifSocket = null

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  if (authenticated.value) {
    notificationStore.fetchNotifications();

    const token = localStorage.getItem("token")
    if (token) {
      const sessionId = localStorage.getItem("sessionId")
      notifSocket = connectChatSocket(token, sessionId)
      notifSocket.on("meeting:notification", () => {
        notificationStore.fetchNotifications()
      })
    }
  }
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  if (notifSocket) {
    notifSocket.off("meeting:notification")
  }
});

// Fetch notifications as soon as authentication state becomes true (e.g. login)
watch(authenticated, (newVal) => {
  if (newVal) {
    notificationStore.fetchNotifications();
  }
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>
