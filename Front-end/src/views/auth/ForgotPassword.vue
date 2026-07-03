<template>
  <div class="page-shell">
    <Navbar />

    <div class="flex items-center justify-center min-h-[calc(100vh-140px)] py-10 px-4">
      <div
        class="w-full max-w-[540px] bg-white/70 dark:bg-slate-900/70 border border-white/70 dark:border-white/10 backdrop-blur-lg rounded-[32px] p-8 sm:p-12 shadow-glass flex flex-col gap-7 items-center transition-all duration-300 hover:border-white/95 dark:hover:border-white/20 hover:shadow-card-hover"
      >
        <template v-if="success">
          <div
            class="w-16 h-16 rounded-full bg-white/70 dark:bg-slate-900/70 border border-white/70 dark:border-white/10 backdrop-blur-lg shadow-glass flex items-center justify-center text-primary"
          >
            <PhCheckCircle :size="34" weight="fill" />
          </div>

          <div class="text-center flex flex-col gap-2">
            <h2 class="text-2xl sm:text-3xl font-bold font-header text-brand-dark">
              Check Your Email
            </h2>

            <p class="text-sm text-brand-slate">
              We've sent a password reset link to your email address.
            </p>

            <a
              :href="`mailto:${email}`"
              class="text-primary font-header font-bold text-sm hover:underline"
            >
              {{ email }}
            </a>

            <p
              v-if="successMessage"
              class="sr-only"
              aria-live="polite"
            >
              {{ successMessage }}
            </p>
          </div>

          <div
            v-if="error"
              class="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-red-600 dark:text-red-400 text-xs font-semibold"
          >
            {{ error }}
          </div>

          <div class="flex flex-col gap-3 w-full">
            <button
              type="button"
              class="w-full py-3.5 bg-grad-primary text-white font-header font-bold text-[11px] tracking-wider uppercase rounded-xl shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_20px_rgba(75,104,255,0.35)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center cursor-pointer"
              @click="goToSignIn"
            >
              Back to Sign In
            </button>

            <button
              type="button"
              :disabled="loading"
              class="w-full py-3.5 rounded-xl border border-black/8 dark:border-white/10 bg-white/50 dark:bg-white/5 text-brand-dark font-header font-bold text-[11px] tracking-wider uppercase transition-all duration-300 hover:bg-white dark:hover:bg-white/10 hover:border-primary/20 hover:shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
              @click="handleForgotPassword"
            >
              <span
                v-if="loading"
                class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spinner"
              ></span>

              <span v-else>Resend Email</span>
            </button>
          </div>
        </template>

        <template v-else>
          <div class="text-center flex flex-col gap-2">
            <h2 class="text-2xl sm:text-3xl font-bold font-header text-brand-dark">
              Forgot Password
            </h2>

            <p class="text-sm text-brand-slate">
              Enter your email address and we'll send you a password reset link.
            </p>
          </div>

          <form
            class="flex flex-col gap-6 w-full"
            @submit.prevent="handleForgotPassword"
          >
            <div class="flex flex-col gap-5 w-full">
              <div class="flex flex-col gap-2 text-left w-full">
                <label
                  class="font-header text-xs font-bold text-brand-dark"
                  for="email"
                >
                  Email Address
                </label>

                <div class="relative w-full group">
                  <div
                    class="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-brand-slate opacity-50 group-focus-within:opacity-95 group-focus-within:text-primary transition-all duration-300"
                  >
                    <PhEnvelope :size="18" weight="bold" />
                  </div>

                  <input
                    id="email"
                    v-model.trim="email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    :disabled="loading"
                    class="w-full h-12 bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 rounded-xl pl-11 pr-4 text-brand-dark text-sm font-semibold outline-none transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] placeholder-brand-slate/60 focus:border-primary focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.03),0_0_12px_rgba(75,104,255,0.15)]"
                  />
                </div>
              </div>
            </div>

            <div
              v-if="error"
            class="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3 text-red-600 dark:text-red-400 text-xs font-semibold"
            >
              {{ error }}
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3.5 bg-grad-primary text-white font-header font-bold text-[11px] tracking-wider uppercase rounded-xl shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_20px_rgba(75,104,255,0.35)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
            >
              <span
                v-if="loading"
                class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spinner"
              ></span>

              <span v-else>Send Reset Link</span>
            </button>
          </form>

          <div class="text-xs text-brand-slate gap-1.5 flex justify-center mt-2">
            <router-link
              to="/signin"
              class="text-primary font-bold hover:underline"
            >
              Back to Sign In
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhCheckCircle, PhEnvelope } from '@phosphor-icons/vue'

import Navbar from '@/components/layout/Navbar.vue'

import { useAuthStore } from '@/stores/auth'
import axios from "axios"

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const successMessage = ref('')

onMounted(() => {
  if (authStore.isAuthenticated === true) {
    router.push('/dashboard')
  }
})

const handleForgotPassword = async () => {
  if (loading.value) {
    return
  }

  try {
    loading.value = true
    error.value = ''

    const { data } = await axios.post(
      "http://localhost:5000/api/users/forgot-password",
      {
        email: email.value
      }
    )

    if (data.success) {
      success.value = true
      successMessage.value = data.message || "Password reset link sent"
      return
    }

    error.value = data.message || "Unable to send password reset link"
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Unable to send password reset link"
  } finally {
    loading.value = false
  }
}

const goToSignIn = () => {
  router.push('/signin')
}
</script>

<style scoped>
.animate-spinner {
  border-top-color: transparent;
  animation: spinner 0.6s linear infinite;
}

@keyframes spinner {
  to {
    transform: rotate(360deg);
  }
}
</style>