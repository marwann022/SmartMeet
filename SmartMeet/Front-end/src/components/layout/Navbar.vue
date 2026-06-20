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
          Sign In
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
                    @click="markAsRead(notification.id)"
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
              src="@/assets/User Profile.png"
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
                  @click="handleLogout"
                  class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer text-left focus:outline-none"
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
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { PhBell, PhUser, PhGear, PhSignOut, PhTrash } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const authenticated = computed(() =>
  authStore.isAuthenticated
)

const user = computed(() =>
  authStore.user
)

// UI Open/Close States
const isNotificationsOpen = ref(false)
const isProfileOpen = ref(false)

// DOM Element References for click-outside
const notificationsRef = ref(null)
const profileRef = ref(null)

// Mock Notifications
const notifications = ref([
  { id: 1, text: 'Sarah Kim updated v2 API docs deadline', time: '10m ago', read: false },
  { id: 2, text: 'DevOps scaled GPU cluster to 16 nodes', time: '2h ago', read: false },
  { id: 3, text: 'Penetration test report is ready for download', time: '1d ago', read: true }
])

// Computed Unread Count
const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

// Actions
const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = true
  })
}

const clearAll = () => {
  notifications.value = []
}

const handleLogout = () => {
  isProfileOpen.value = false
  authStore.logout()
  router.push('/signin')
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
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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