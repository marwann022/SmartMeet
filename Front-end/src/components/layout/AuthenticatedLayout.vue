<template>
  <div class="min-h-screen bg-brand-bg relative overflow-x-hidden flex">
    <!-- Left Sidebar -->
    <Sidebar />
    
    <!-- Bottom Navigation Bar for Mobile -->
    <BottomNav />
    
    <!-- MAIN SCROLLABLE CONTENT AREA -->
    <!-- Main content: offset by 260px desktop sidebar, hidden below 850px -->
    <main 
      class="flex-1 mt-[80px] bg-brand-bg relative flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      :class="[
        uiStore.sidebarOpen ? 'ml-[260px] w-[calc(100%-260px)]' : 'ml-0 w-full',
        'compact:ml-0 compact:w-full',
        $route.path === '/knowledge-ai' ? 'overflow-y-hidden h-[calc(100vh-80px)] pb-0 px-[32px] sm:px-[48px] compact:h-[calc(100vh-80px-72px)] compact:pb-0' : 'overflow-y-auto min-h-[calc(100vh-80px)] px-[32px] sm:px-[48px] pb-[16px] compact:pb-24'
      ]"
    >
      <!-- TOP INNER HEADER NAVIGATION -->
      <div 
        class="fixed right-[0px] top-[20px] px-[32px] sm:px-[48px] compact:px-[16px] z-[40] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        :class="[
          uiStore.sidebarOpen ? 'left-[260px]' : 'left-[0px]',
          'compact:left-[0px]'
        ]"
      >
        <header class="flex items-center justify-between px-[28px] pt-[10px] pb-[16px] rounded-full bg-white/65 dark:bg-slate-900/65 border border-white/70 dark:border-slate-800/80 shadow-glass backdrop-blur-[20px] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-white/85 dark:hover:border-slate-700 hover:bg-white/75 dark:hover:bg-slate-800/75 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.08),0_0_20px_rgba(75,104,255,0.05)] w-full">
          <!-- Mobile Brand Title -->
          <div class="hidden compact:flex items-center gap-2">
            <span class="font-header font-extrabold text-sm tracking-tight text-primary">SmartMeet</span>
          </div>

          <nav class="flex items-center gap-[24px] compact:hidden">
            <router-link to="/" class="text-[12px] font-semibold text-brand-slate dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Home</router-link>
            <router-link to="/features" class="text-[12px] font-semibold text-brand-slate dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Features</router-link>
            <router-link to="/pricing" class="text-[12px] font-semibold text-brand-slate dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors py-[6px] px-[14px] rounded-full hover:bg-primary/5">Pricing</router-link>
            <router-link to="/dashboard" class="text-[12px] font-semibold py-[6px] px-[14px] rounded-full text-primary bg-primary/5 border border-primary/10">Dashboard</router-link>
          </nav>
          
          <div class="flex items-center gap-[16px]">
            <!-- Mobile Settings Shortcut -->
            <router-link 
              to="/settings"
              class="group bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 rounded-full items-center justify-center w-9 h-9 cursor-pointer text-brand-slate hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105 transition-all duration-300 hidden compact:flex"
              title="Settings"
            >
              <PhGear :size="16" weight="bold" class="text-brand-slate group-hover:text-primary" />
            </router-link>

            <!-- Chat History Toggle Button (Only on Knowledge AI page) -->
            <button
              v-if="$route.path === '/knowledge-ai'"
              @click="uiStore.showChatHistory = !uiStore.showChatHistory"
              class="group bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center w-9 h-9 cursor-pointer text-brand-slate hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105 focus:outline-none transition-all duration-300"
              title="Toggle Chat History"
            >
              <PhClockClockwise :size="16" weight="bold" class="text-brand-slate group-hover:text-primary" />
            </button>

            <!-- Theme Toggle Button -->
            <button
              @click="uiStore.toggleTheme"
              class="group bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center w-9 h-9 cursor-pointer text-brand-slate hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105 focus:outline-none transition-all duration-300"
              :title="uiStore.theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'"
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

             <div ref="notificationsRef" class="relative">
          <button
            @click="isNotificationsOpen = !isNotificationsOpen"
            class="group bg-black/5 dark:bg-white/8 border border-black/10 dark:border-white/10 rounded-full flex items-center justify-center w-9 h-9 cursor-pointer relative text-brand-slate transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105 focus:outline-none"
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
                class="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2.5 mb-2.5"
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
                        ? 'bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/5'
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
                          class="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-bold transition-all duration-200 hover:scale-105"
                        >
                          Join Meeting
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
                  <div class="px-3 py-2 border-b border-black/5 dark:border-white/5 mb-1.5">
                    <p class="text-[11px] font-bold text-brand-dark truncate">{{ user?.name || 'User' }}</p>
                    <p class="text-[9px] text-brand-slate truncate">{{ user?.email || 'user@smartmeet.ai' }}</p>
                  </div>
                  <div class="space-y-0.5">
                    <router-link
                      to="/settings?tab=profile"
                      @click="isProfileOpen = false"
                      class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-brand-slate hover:text-brand-dark dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                    >
                      <PhUser :size="14" weight="bold" class="text-brand-slate" />
                      <span>View Profile</span>
                    </router-link>
                    <router-link
                      to="/settings"
                      @click="isProfileOpen = false"
                      class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-brand-slate hover:text-brand-dark dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                    >
                      <PhGear :size="14" weight="bold" class="text-brand-slate" />
                      <span>Settings</span>
                    </router-link>
                    <div class="border-t border-black/5 dark:border-white/5 my-1"></div>
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
          </div>
        </header>
      </div>

      <div 
        class="flex-1 flex flex-col"
        :class="{ 'h-full min-h-0': $route.path === '/knowledge-ai' }"
      >
        <!-- Inner Route Page Outlet with transition -->
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in" @after-leave="onAfterLeave">
            <component :is="Component" :search-query="searchQuery" />
          </transition>
        </router-view>
      </div>

      <!-- Shared App Footer -->
      <footer v-if="$route.path !== '/knowledge-ai'" class="flex justify-between items-center text-[9px] font-bold text-brand-slate tracking-wide uppercase mt-[48px] pt-[16px] pb-[4px] border-t border-black/5 dark:border-white/5 flex-shrink-0 w-full">
        <span>© 2026 SmartMeet AI Inc. All rights reserved.</span>
        <div class="flex gap-[24px]">
          <a href="#" class="hover:text-primary transition-colors" @click.prevent>Terms of Service</a>
          <a href="#" class="hover:text-primary transition-colors" @click.prevent>Security</a>
          <a href="#" class="hover:text-primary transition-colors" @click.prevent>Cookies</a>
        </div>
      </footer>
    </main>

    <!-- Logout Confirmation Modal -->
    <Modal :show="showLogoutModal" title="Confirm Log Out" @close="showLogoutModal = false" maxWidth="sm">
      <div class="flex flex-col gap-4 text-left">
        <p class="text-brand-slate text-sm font-body">
          Are you sure you want to log out of your SmartMeet account? Any unsaved changes may be lost.
        </p>
        <div class="flex gap-3 pt-2">
          <Button variant="danger" class="flex-1" @click="confirmLogout">Log Out</Button>
          <Button variant="outline" class="flex-1" @click="showLogoutModal = false">Cancel</Button>
        </div>
      </div>
    </Modal>

    <!-- Global Alert Modal -->
    <Modal :show="alertStore.isOpen" :title="alertStore.title" @close="alertStore.closeAlert" maxWidth="sm" :theme="alertStore.theme">
      <div class="flex flex-col gap-4 text-left">
        <p class="text-brand-slate text-sm font-body">
          {{ alertStore.message }}
        </p>
        <div class="flex gap-3 pt-2 justify-end">
          <Button variant="primary" class="px-6" @click="alertStore.closeAlert">OK</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUiStore } from '../../stores/ui'
import Sidebar from './Sidebar.vue'
import BottomNav from './BottomNav.vue'
import { useAuthStore } from '@/stores/auth'
import { PhGear, PhClockClockwise, PhUser, PhSignOut, PhBell, PhTrash } from '@phosphor-icons/vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import { useNotificationStore } from '../../stores/notification'
import { useMeetingStore } from '@/stores/meeting'
import axios from 'axios'
import { useAlertStore } from '@/stores/alert'
import NavbarUserPanel from '@/components/common/NavbarUserPanel.vue'
import { connectChatSocket, getChatSocket, disconnectChatSocket } from '@/services/chatSocket'

const router = useRouter()
const searchQuery = ref('')
const uiStore = useUiStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()
const meetingStore = useMeetingStore()
const alertStore = useAlertStore()

const user = computed(() => authStore.user)

const isProfileOpen = ref(false)
const profileRef = ref(null)
const isNotificationsOpen = ref(false)
const notificationsRef = ref(null)
const showLogoutModal = ref(false)

const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

const handleNotificationClick = (notification) => {
  notificationStore.markAsRead(notification.id)
  isNotificationsOpen.value = false

  if (notification.type === 'task') {
    router.push('/tasks')
  } else if (notification.type === 'meeting') {
    router.push('/archive')
  } else if (notification.type === 'chat') {
    router.push('/community-chat')
  } else {
    router.push('/dashboard')
  }
}

const approveJoinRequest = async (notification) => {
  try {
    await axios.patch(
      `http://localhost:5000/api/join-requests/${notification.relatedId}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    await notificationStore.fetchNotifications()
    await authStore.fetchProfile?.()
    isNotificationsOpen.value = true
  } catch (error) {
    console.error('Failed to approve request:', error)
  }
}

const rejectJoinRequest = async (notification) => {
  try {
    await axios.patch(
      `http://localhost:5000/api/join-requests/${notification.relatedId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    await notificationStore.fetchNotifications()
  } catch (error) {
    console.error('Failed to reject request:', error)
  }
}

const joinMeeting = async (notification) => {
  await notificationStore.markAsRead(notification.id)
  isNotificationsOpen.value = false

  try {
    const meeting = await meetingStore.fetchMeeting(notification.relatedId)
    if (!meeting) {
      router.push('/archive')
      return
    }

    const scheduledTime = new Date(meeting.startTime)
    const now = new Date()
    if (scheduledTime - now > 300000) {
      const formattedTime = scheduledTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      await alertStore.showAlert(`This meeting is scheduled for ${formattedTime}. You cannot start or join it before the scheduled start time.`, "Meeting Not Started", "primary")
      router.push('/archive')
      return
    }

    meetingStore.activeLiveMeeting = meeting
    router.push('/live-meeting')
  } catch {
    router.push('/archive')
  }
}

const markAllAsRead = () => {
  notificationStore.markAllAsRead()
}

const clearAll = () => {
  notificationStore.clearAll()
}

const handleLogout = () => {
  isProfileOpen.value = false
  showLogoutModal.value = true
}

const confirmLogout = () => {
  authStore.logout()
  showLogoutModal.value = false
  router.replace('/')
  window.location.reload()
}

const handleClickOutside = (event) => {
  if (isProfileOpen.value && profileRef.value && !profileRef.value.contains(event.target)) {
    isProfileOpen.value = false
  }
  if (isNotificationsOpen.value && notificationsRef.value && !notificationsRef.value.contains(event.target)) {
    isNotificationsOpen.value = false
  }
}

let pollInterval = null

const setupChatSocket = () => {
  const token = localStorage.getItem('token')
  if (!token) return

  const sessionId = localStorage.getItem('sessionId')
  const socket = connectChatSocket(token, sessionId)

  socket.on('chat:notification', () => {
    notificationStore.fetchNotifications()
  })

  socket.on('task:notification', () => {
    notificationStore.fetchNotifications()
  })

  socket.on('meeting:notification', () => {
    notificationStore.fetchNotifications()
  })

  socket.on('session:revoked', () => {
    authStore.logout()
    window.location.href = '/signin'
  })
}

onMounted(async () => {
  await authStore.fetchProfile()
  await notificationStore.fetchNotifications()
  document.addEventListener('click', handleClickOutside)

  setupChatSocket()

  pollInterval = setInterval(() => {
    notificationStore.fetchNotifications()
  }, 15000)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (pollInterval) {
    clearInterval(pollInterval)
  }
  disconnectChatSocket()
})

const onAfterLeave = () => {
  window.scrollTo(0, 0)
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s cubic-bezier(0.4, 0, 0.2, 1), transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
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
