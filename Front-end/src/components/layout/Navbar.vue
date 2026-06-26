<template>
  <header
    class="sticky top-5 z-[100] flex items-center justify-between px-7 py-2.5 rounded-full bg-white/65 border border-white/70 shadow-glass backdrop-blur-[20px] mt-5 mb-8 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-white/85 hover:bg-white/75 hover:shadow-[0_12px_40px_0_rgba(31,38,135,0.08),0_0_20px_rgba(75,104,255,0.05)]"
  >
    <!-- Logo -->
    <router-link
      to="/"
      class="flex items-center transition-all duration-300 hover:scale-[1.02] cursor-pointer"
    >
      <img
        src="@/assets/new logo.png"
        alt="SmartMeet"
        class="h-10 block"
      />
    </router-link>

    <!-- Navigation Links -->
    <nav class="flex items-center gap-6">

      <!-- Guest Navigation -->
      <template v-if="!authenticated">
        <router-link
          to="/"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          exact-active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Home
        </router-link>

        <router-link
          to="/features"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Features
        </router-link>

        <router-link
          to="/pricing"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Pricing
        </router-link>
      </template>

      <!-- Authenticated Navigation -->
      <template v-else>
          <router-link
          to="/"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          exact-active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Home
        </router-link>

        <router-link
          to="/features"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Features
        </router-link>

        <router-link
          to="/pricing"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Pricing
        </router-link>

        <router-link
          to="/dashboard"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Dashboard
        </router-link>
      </template>
    </nav>

    <!-- Right Section -->
    <div class="flex items-center gap-4">

      <!-- Guest Actions -->
      <template v-if="!authenticated">
        <router-link
          to="/signin"
          class=" text-xs font-semibold text-brand-slate hover:text-primary transition-colors"
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
            class="group bg-black/5 border border-black/10 rounded-full flex items-center justify-center w-9 h-9 cursor-pointer relative text-brand-slate transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105 focus:outline-none"
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
              class="absolute right-0 mt-3.5 w-80 bg-white/90 border border-white/80 rounded-2xl shadow-glass backdrop-blur-[20px] p-4 text-left z-50 transform origin-top-right transition-all duration-300"
            >
              <div class="flex items-center justify-between border-b border-black/5 pb-2.5 mb-2.5">
                <span class="text-xs font-bold text-brand-dark">Notifications</span>
                <div class="flex gap-2">
                  <button 
                    v-if="unreadCount > 0"
                    @click="markAllAsRead" 
                    class="text-[10px] font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                  <span v-if="unreadCount > 0 && notifications.length > 0" class="text-black/20 text-[10px]">|</span>
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
                    :class="notification.read 
                      ? 'bg-transparent border-transparent hover:bg-black/5' 
                      : 'bg-primary/[0.03] border-primary/10 hover:bg-primary/[0.06] shadow-sm'"
                  >
                    <span 
                      v-if="!notification.read" 
                      class="absolute top-3 right-3 w-1.5 h-1.5 bg-primary rounded-full"
                    ></span>

                    <p 
                      class="text-brand-dark font-medium pr-3"
                      :class="{ 'font-semibold': !notification.read }"
                    >
                      {{ notification.text }}
                    </p>
                    <span class="text-[9px] text-brand-slate font-semibold">{{ notification.time }}</span>
                  </div>
                </template>
                <div v-else class="py-6 flex flex-col items-center justify-center text-center">
                  <PhBell :size="24" class="text-brand-slate mb-1.5 opacity-40" />
                  <p class="text-xs text-brand-slate font-medium">All caught up!</p>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Profile Container -->
        <div ref="profileRef" class="relative">
          <button
            @click="isProfileOpen = !isProfileOpen"
            class="flex items-center gap-2.5 cursor-pointer focus:outline-none bg-transparent border-0"
          >
            <img
  :src="profileImage"
  alt="Profile"
  class="w-9 h-9 rounded-full object-cover border border-white/80 shadow-sm transition-all duration-300 hover:scale-105"
/>

            <div class="flex flex-col text-left">
              <span
                class="text-[11px] font-bold text-brand-dark leading-tight"
              >
                {{ user?.name || 'User' }}
              </span>

              <span
                class="text-[9px] font-extrabold text-primary tracking-wider uppercase"
              >
                {{ user?.plan || 'Free' }}
              </span>
            </div>
          </button>

          <!-- Profile Dropdown -->
          <transition name="fade-slide">
            <div
              v-if="isProfileOpen"
              class="absolute right-0 mt-3.5 w-52 bg-white/90 border border-white/80 rounded-2xl shadow-glass backdrop-blur-[20px] p-2 text-left z-50 transform origin-top-right transition-all duration-300"
            >
              <div class="px-3 py-2 border-b border-black/5 mb-1.5">
                <p class="text-[11px] font-bold text-brand-dark truncate">{{ user?.name || 'User' }}</p>
                <p class="text-[9px] text-brand-slate truncate">{{ user?.email || 'user@smartmeet.ai' }}</p>
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
    <Modal :show="showLogoutModal" title="Confirm Log Out" @close="showLogoutModal = false" maxWidth="sm">
      <div class="flex flex-col gap-4 text-left">
        <p class="text-brand-slate text-sm font-body">
          Are you sure you want to log out of your SmartMeet account? Any unsaved changes may be lost.
        </p>
        
        <div class="flex gap-3 pt-2">
          <Button variant="danger" class="flex-1" @click="confirmLogout">
            Log Out
          </Button>
          <Button variant="outline" class="flex-1" @click="showLogoutModal = false">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { PhBell, PhUser, PhGear, PhSignOut, PhTrash } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const authenticated = computed(() =>
  authStore.isAuthenticated
)

const user = computed(() =>
  authStore.user
)

const showLogoutModal = ref(false)

// UI Open/Close States
const isNotificationsOpen = ref(false)
const isProfileOpen = ref(false)

// DOM Element References for click-outside
const notificationsRef = ref(null)
const profileRef = ref(null)

// Bind Notifications state and computed count to Pinia store
const notifications = computed(() => notificationStore.notifications)
const unreadCount = computed(() => notificationStore.unreadCount)

// Actions mapped to store actions
const markAsRead = (id) => {
  notificationStore.markAsRead(id)
}

const handleNotificationClick = (notification) => {
  markAsRead(notification.id)
  isNotificationsOpen.value = false
  
  if (notification.type === 'task') {
    router.push('/tasks')
  } else if (notification.type === 'meeting') {
    router.push('/archive')
  } else {
    router.push('/dashboard')
  }
}

const markAllAsRead = () => {
  notificationStore.markAllAsRead()
}

const clearAll = () => {
  notificationStore.clearAll()
}

const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = () => {
  authStore.logout()
  showLogoutModal.value = false
  isProfileOpen.value = false
  router.replace("/")
  window.location.reload()
}

// Click Outside Handler
const handleClickOutside = (event) => {
  if (isNotificationsOpen.value && notificationsRef.value && !notificationsRef.value.contains(event.target)) {
    isNotificationsOpen.value = false
  }
  if (isProfileOpen.value && profileRef.value && !profileRef.value.contains(event.target)) {
    isProfileOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (authenticated.value) {
    notificationStore.fetchNotifications()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Fetch notifications as soon as authentication state becomes true (e.g. login)
watch(authenticated, (newVal) => {
  if (newVal) {
    notificationStore.fetchNotifications()
  }
})

const profileImage = computed(() => {
  if (user.value?.avatar) {
    return `http://localhost:5000/uploads/${user.value.avatar}`
  }

  return `https://ui-avatars.com/api/?name=${
    encodeURIComponent(user.value?.name || "User")
  }&background=4B68FF&color=fff`
})


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