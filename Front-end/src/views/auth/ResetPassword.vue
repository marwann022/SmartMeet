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
              Password Reset
            </h2>

            <p class="text-sm text-brand-slate">
              {{ successMessage }}
            </p>
          </div>
        </template>

        <template v-else>
          <div class="text-center flex flex-col gap-2">
            <h2 class="text-2xl sm:text-3xl font-bold font-header text-brand-dark">
              Reset Password
            </h2>

            <p class="text-sm text-brand-slate">
              Create a new password for your SmartMeet account.
            </p>
          </div>

          <form
            class="flex flex-col gap-6 w-full"
            @submit.prevent="handleResetPassword"
          >
            <div class="flex flex-col gap-5 w-full">
              <div class="flex flex-col gap-2 text-left w-full">
                <label
                  class="font-header text-xs font-bold text-brand-dark"
                  for="password"
                >
                  New Password
                </label>

                <div class="relative w-full group">
                  <div
                    class="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-brand-slate opacity-50 group-focus-within:opacity-95 group-focus-within:text-primary transition-all duration-300"
                  >
                    <PhLock :size="18" weight="bold" />
                  </div>

                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="********"
                    required
                    minlength="8"
                    :disabled="loading"
                    class="w-full h-12 bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 rounded-xl pl-11 pr-11 text-brand-dark text-sm font-semibold outline-none transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] placeholder-brand-slate/60 focus:border-primary focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.03),0_0_12px_rgba(75,104,255,0.15)]"
                  />

                  <button
                    type="button"
                    :disabled="loading"
                    class="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-brand-slate opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300 disabled:pointer-events-none cursor-pointer"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="togglePasswordVisibility"
                  >
                    <PhEyeSlash
                      v-if="showPassword"
                      :size="18"
                      weight="bold"
                    />

                    <PhEye
                      v-else
                      :size="18"
                      weight="bold"
                    />
                  </button>
                </div>
              </div>

              <div class="flex flex-col gap-2 text-left w-full">
                <label
                  class="font-header text-xs font-bold text-brand-dark"
                  for="confirm-password"
                >
                  Confirm Password
                </label>

                <div class="relative w-full group">
                  <div
                    class="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-brand-slate opacity-50 group-focus-within:opacity-95 group-focus-within:text-primary transition-all duration-300"
                  >
                    <PhLock :size="18" weight="bold" />
                  </div>

                  <input
                    id="confirm-password"
                    v-model="confirmPassword"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="********"
                    required
                    minlength="8"
                    :disabled="loading"
                    class="w-full h-12 bg-white dark:bg-slate-950/60 border border-black/8 dark:border-white/10 rounded-xl pl-11 pr-11 text-brand-dark text-sm font-semibold outline-none transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] placeholder-brand-slate/60 focus:border-primary focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.03),0_0_12px_rgba(75,104,255,0.15)]"
                  />

                  <button
                    type="button"
                    :disabled="loading"
                    class="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-brand-slate opacity-60 hover:opacity-100 hover:text-primary transition-all duration-300 disabled:pointer-events-none cursor-pointer"
                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                    @click="togglePasswordVisibility"
                  >
                    <PhEyeSlash
                      v-if="showPassword"
                      :size="18"
                      weight="bold"
                    />

                    <PhEye
                      v-else
                      :size="18"
                      weight="bold"
                    />
                  </button>
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

              <span v-else>Reset Password</span>
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
import { onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PhCheckCircle,
  PhEye,
  PhEyeSlash,
  PhLock
} from '@phosphor-icons/vue'

import Navbar from '@/components/layout/Navbar.vue'

import axios from "axios"

const route = useRoute()
const router = useRouter()
const token = route.params.token

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)
const successMessage = ref('')

let redirectTimer = null

const validateForm = () => {
  if (!token) {
    return "Invalid or expired password reset link. Please request a new password reset email."
  }

  if (!password.value || !confirmPassword.value) {
    return "Both password fields are required"
  }

  if (password.value.length < 8) {
    return "Password must be at least 8 characters"
  }

  if (confirmPassword.value !== password.value) {
    return "Confirm Password must match Password"
  }

  return ''
}

const handleResetPassword = async () => {
  if (loading.value) {
    return
  }

  const validationError = validateForm()

  if (validationError) {
    error.value = validationError
    return
  }

  try {
    loading.value = true
    error.value = ''

    await axios.post(
      `http://localhost:5000/api/users/reset-password/${token}`,
      {
        password: password.value
      }
    )

    success.value = true
    successMessage.value = "Password reset successfully"

    redirectTimer = window.setTimeout(() => {
      router.push('/signin')
    }, 2000)
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      "Invalid or expired password reset link. Please request a new password reset email."
  } finally {
    loading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

onBeforeUnmount(() => {
  if (redirectTimer) {
    window.clearTimeout(redirectTimer)
  }
})
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
