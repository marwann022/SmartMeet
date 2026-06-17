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
          to="/dashboard"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Dashboard
        </router-link>

        <router-link
          to="/new-meeting"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Meetings
        </router-link>

        <router-link
          to="/tasks"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Tasks
        </router-link>

        <router-link
          to="/knowledge-ai"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Knowledge AI
        </router-link>

        <router-link
          to="/archive"
          class="text-xs font-semibold text-brand-slate relative py-1.5 px-3.5 rounded-full transition-all duration-300 hover:text-primary hover:bg-primary/5"
          active-class="text-primary bg-primary/5 border border-primary/10 shadow-[inset_0_1px_3px_rgba(75,104,255,0.05)]"
        >
          Archive
        </router-link>
      </template>
    </nav>

    <!-- Right Section -->
    <div class="flex items-center gap-4">

      <!-- Guest Actions -->
      <template v-if="!authenticated">
        <router-link
          to="/signin"
          class="text-xs font-semibold text-brand-slate hover:text-primary transition-colors"
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
      <template v-else>

        <!-- Notifications -->
        <button
          class="group bg-black/5 border border-black/10 rounded-full flex items-center justify-center w-9 h-9 cursor-pointer relative text-brand-slate transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105"
          aria-label="Notifications"
        >
          <PhBell
            :size="18"
            weight="bold"
            class="transition-colors duration-300 text-brand-slate group-hover:text-primary"
          />

          <span
            class="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(75,104,255,1)]"
          ></span>
        </button>

        <!-- Profile -->
        <router-link
          to="/dashboard"
          class="flex items-center gap-2.5 cursor-pointer"
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
        </router-link>

        <!-- Logout -->
        <button
          @click="logout"
          class="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
        >
          Logout
        </button>

      </template>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { PhBell } from '@phosphor-icons/vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()

const authStore = useAuthStore()

const authenticated = computed(() =>
  authStore.isAuthenticated
)

const user = computed(() =>
  authStore.user
)

const logout = () => {
  authStore.logout()
  router.push('/signin')
}
</script>