<template>
  <div class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-between">
    <Navbar />

    <main class="flex flex-col items-center justify-center gap-10 py-8 sm:py-10 px-1 sm:px-4">

      <!-- ── Verifying token ─────────────────────────────────────────── -->
      <section
        v-if="verifying"
        class="w-full max-w-[540px] bg-white/70 dark:bg-slate-900/70 border border-white/70 dark:border-white/10 backdrop-blur-lg rounded-[32px] p-12 shadow-glass flex flex-col items-center gap-6"
        aria-label="Verifying invitation"
      >
        <div class="w-10 h-10 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin"></div>
        <p class="text-sm text-brand-slate font-medium">Verifying your invitation…</p>
      </section>

      <!-- ── Error states ───────────────────────────────────────────── -->
      <section
        v-else-if="tokenError"
        class="w-full max-w-[540px] bg-white/70 dark:bg-slate-900/70 border border-white/70 dark:border-white/10 backdrop-blur-lg rounded-[32px] p-10 sm:p-12 shadow-glass flex flex-col items-center gap-6 text-center transition-all duration-300 hover:border-white/95 dark:hover:border-white/20 hover:shadow-card-hover"
        role="alert"
      >
        <div
          class="w-16 h-16 rounded-full border flex items-center justify-center"
          :class="tokenError.iconBg"
        >
          <component :is="tokenError.icon" :size="32" weight="fill" :class="tokenError.iconColor" />
        </div>

        <div class="flex flex-col gap-2">
          <h1 class="text-xl font-bold font-header text-brand-dark">{{ tokenError.title }}</h1>
          <p class="text-sm text-brand-slate leading-relaxed max-w-[320px]">{{ tokenError.message }}</p>
        </div>

        <router-link
          v-if="tokenError.type === 'used'"
          to="/signin"
          class="py-3 px-8 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] uppercase tracking-wide shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_20px_rgba(75,104,255,0.35)] transition-all"
        >
          Sign In
        </router-link>
        <router-link
          v-else
          to="/signup"
          class="py-3 px-8 rounded-xl bg-grad-primary text-white font-header font-bold text-[11px] uppercase tracking-wide shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_20px_rgba(75,104,255,0.35)] transition-all"
        >
          Back to Sign Up
        </router-link>
      </section>

      <!-- ── Invitation form ────────────────────────────────────────── -->
      <section
        v-else
        class="w-full max-w-[540px] bg-white/70 dark:bg-slate-900/70 border border-white/70 dark:border-white/10 backdrop-blur-lg rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-glass flex flex-col gap-7 items-center transition-all duration-300 hover:border-white/95 dark:hover:border-white/20 hover:shadow-card-hover group/card"
        aria-labelledby="register-title"
      >

        <!-- Success state -->
        <div
          v-if="registerSuccess"
          class="flex flex-col items-center justify-center text-center py-6 w-full animate-fadeIn"
        >
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 shadow-sm">
            <PhCheckCircle :size="36" weight="fill" />
          </div>
          <h2 class="text-2xl font-bold font-header text-brand-dark mb-3">
            Welcome to {{ invitation.communityName }}!
          </h2>
          <p class="text-xs text-brand-slate max-w-[320px] leading-relaxed">
            Your account has been created. Redirecting you to your dashboard…
          </p>
        </div>

        <!-- Form -->
        <template v-else>

          <!-- Header -->
          <div class="text-center flex flex-col gap-2">
            <p class="text-[10px] font-extrabold tracking-[3px] uppercase text-primary/70">You're Invited</p>
            <h1 id="register-title" class="text-2xl sm:text-3xl font-bold font-header text-brand-dark">
              Join {{ invitation.communityName }}
            </h1>
            <p class="text-sm text-brand-slate">Set your password to complete registration.</p>
          </div>

          <!-- Backend error -->
          <div
            v-if="backendError"
            class="w-full p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-semibold rounded-2xl flex items-center gap-3 animate-fadeIn text-left"
            role="alert"
          >
            <PhWarningCircle :size="20" class="text-red-500 shrink-0" />
            <span>{{ backendError }}</span>
          </div>

          <!-- Readonly invitation details -->
          <div class="w-full flex flex-col gap-3">

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-brand-dark">Full Name</label>
              <div class="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/5 border border-black/8 dark:border-white/10">
                <PhUser :size="17" class="text-brand-slate/50 shrink-0" weight="bold" />
                <span class="text-sm font-medium text-brand-dark flex-1">{{ invitation.fullName }}</span>
                <PhLock :size="13" class="text-brand-slate/30 shrink-0" weight="bold" />
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-brand-dark">Email</label>
              <div class="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/5 border border-black/8 dark:border-white/10">
                <PhEnvelope :size="17" class="text-brand-slate/50 shrink-0" weight="bold" />
                <span class="text-sm font-medium text-brand-dark flex-1">{{ invitation.email }}</span>
                <PhLock :size="13" class="text-brand-slate/30 shrink-0" weight="bold" />
              </div>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs font-bold text-brand-dark">Role</label>
              <div class="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl bg-black/[0.03] dark:bg-white/5 border border-black/8 dark:border-white/10">
                <PhShieldCheck :size="17" class="text-brand-slate/50 shrink-0" weight="bold" />
                <span class="text-sm font-medium text-brand-dark flex-1 capitalize">{{ invitation.role }}</span>
                <PhLock :size="13" class="text-brand-slate/30 shrink-0" weight="bold" />
              </div>
            </div>

          </div>

          <!-- Divider -->
          <div class="flex items-center gap-4 w-full" aria-hidden="true">
            <div class="flex-1 h-[1px] bg-black/5 dark:bg-white/10"></div>
            <span class="font-header font-bold text-[10px] text-brand-slate tracking-widest">SET PASSWORD</span>
            <div class="flex-1 h-[1px] bg-black/5 dark:bg-white/10"></div>
          </div>

          <!-- Password form -->
          <form class="flex flex-col gap-5 w-full" @submit.prevent="handleRegister" novalidate>

            <Input
              id="password"
              v-model="password"
              type="password"
              label="Password"
              placeholder="Create a strong password"
              autocomplete="new-password"
              required
              :disabled="loading"
              :error="visibleErrors.password"
              @update:model-value="touchField('password')"
              @blur="touchField('password')"
            >
              <template #icon>
                <PhLock :size="18" weight="bold" />
              </template>
            </Input>

            <!-- Password strength checker -->
            <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-2 scale-[0.98]"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 -translate-y-2 scale-[0.98]"
            >
              <div
                v-if="password"
                class="flex flex-col gap-3 p-4 bg-brand-slate/5 dark:bg-white/5 rounded-2xl text-left border border-black/5 dark:border-white/10 w-full"
                aria-live="polite"
              >
                <div class="flex items-center justify-between gap-3">
                  <span class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate">
                    Password Requirements
                  </span>
                  <span class="text-[10px] font-extrabold uppercase tracking-wider" :class="passwordStrength.textClass">
                    {{ passwordStrength.label }}
                  </span>
                </div>
                <div class="grid grid-cols-5 gap-1.5" aria-hidden="true">
                  <span
                    v-for="index in 5"
                    :key="index"
                    class="h-1.5 rounded-full transition-colors duration-300"
                    :class="index <= passwordStrength.count ? passwordStrength.barClass : 'bg-brand-slate/15'"
                  ></span>
                </div>
                <ul class="grid gap-1.5">
                  <li
                    v-for="req in passwordRequirements"
                    :key="req.key"
                    class="flex items-center gap-2 text-xs font-semibold transition-colors duration-200"
                    :class="req.valid ? 'text-emerald-600' : 'text-brand-slate/70'"
                  >
                    <span
                      class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200"
                      :class="req.valid ? 'bg-emerald-500' : 'bg-brand-slate/30'"
                      aria-hidden="true"
                    ></span>
                    {{ req.label }}
                  </li>
                </ul>
              </div>
            </Transition>

            <Input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Re-enter your password"
              autocomplete="new-password"
              required
              :disabled="loading"
              :error="visibleErrors.confirmPassword"
              @update:model-value="touchField('confirmPassword')"
              @blur="touchField('confirmPassword')"
            >
              <template #icon>
                <PhLock :size="18" weight="bold" />
              </template>
            </Input>

            <Button
              type="submit"
              variant="primary"
              class="w-full mt-1"
              :loading="loading"
              :disabled="loading"
            >
              Create Account
            </Button>

          </form>

        </template>

      </section>

      <!-- Security badge -->
      <div class="max-w-full flex items-center gap-2.5 px-4 sm:px-5 py-2 bg-white/85 dark:bg-slate-900/85 border border-black/5 dark:border-white/10 rounded-full backdrop-blur-lg pointer-events-none shadow-[0_2px_10px_rgba(0,0,0,0.01)] select-none">
        <div class="flex items-center justify-center text-primary opacity-80">
          <PhShieldCheck :size="16" weight="bold" />
        </div>
        <span class="font-header font-bold text-[10px] text-brand-slate tracking-wide uppercase text-center">
          SOC2 Type II &amp; HIPAA Compliant AI Infrastructure
        </span>
      </div>

    </main>

    <footer class="py-6 text-center text-xs text-brand-slate">
      &copy; {{ new Date().getFullYear() }} SmartMeet AI Inc. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PhCheckCircle,
  PhClock,
  PhEnvelope,
  PhLock,
  PhShieldCheck,
  PhUser,
  PhWarningCircle,
} from '@phosphor-icons/vue'
import axios from 'axios'
import Navbar from '@/components/layout/Navbar.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// ── Token verification state ───────────────────────────────────────────────

const verifying = ref(true)
const tokenError = ref(null)
const invitation = ref({ fullName: '', email: '', role: '', communityName: '' })

// ── Form state ─────────────────────────────────────────────────────────────

const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const submitted = ref(false)
const registerSuccess = ref(false)
const backendError = ref('')
const touched = ref({ password: false, confirmPassword: false })

// ── Error definitions ──────────────────────────────────────────────────────

const errorConfigs = {
  'not-found': {
    type: 'not-found',
    icon: PhWarningCircle,
    iconBg: 'bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30',
    iconColor: 'text-red-500',
    title: 'Invitation Not Found',
    message: 'This invitation link is invalid or does not exist. Please ask your admin to send a new invitation.',
  },
  expired: {
    type: 'expired',
    icon: PhClock,
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/20 dark:border-amber-500/30',
    iconColor: 'text-amber-500',
    title: 'Invitation Expired',
    message: 'This invitation link has expired. Please ask your admin to send a new invitation.',
  },
  used: {
    type: 'used',
    icon: PhCheckCircle,
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/20 dark:border-blue-500/30',
    iconColor: 'text-blue-500',
    title: 'Invitation Already Used',
    message: 'This invitation has already been accepted. Sign in to access your account.',
  },
  error: {
    type: 'error',
    icon: PhWarningCircle,
    iconBg: 'bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30',
    iconColor: 'text-red-500',
    title: 'Something Went Wrong',
    message: 'We could not verify your invitation. Please try again or contact your admin.',
  },
}

// ── Verify token on mount ──────────────────────────────────────────────────

onMounted(async () => {
  const token = route.query.token

  if (!token) {
    tokenError.value = errorConfigs['not-found']
    verifying.value = false
    return
  }

  try {
    const { data } = await axios.get(
      `http://localhost:5000/api/invitations/verify/${token}`
    )
    invitation.value = data.invitation

    // Email already has a SmartMeet account — persist the token and redirect to
    // sign-in so the auth store can claim the invitation after login.
    if (data.invitation.isExistingUser) {
      localStorage.setItem('pendingInviteToken', token)
      router.push('/signin')
      return
    }
  } catch (err) {
    const status = err.response?.status
    const message = (err.response?.data?.message || '').toLowerCase()

    if (status === 404) {
      tokenError.value = errorConfigs['not-found']
    } else if (message.includes('expired')) {
      tokenError.value = errorConfigs['expired']
    } else if (message.includes('already been used')) {
      tokenError.value = errorConfigs['used']
    } else {
      tokenError.value = errorConfigs['error']
    }
  } finally {
    verifying.value = false
  }
})

// ── Password validation ────────────────────────────────────────────────────

const passwordRequirements = computed(() => [
  { key: 'min8',        label: 'At least 8 characters',      valid: password.value.length >= 8 },
  { key: 'hasUppercase', label: 'One uppercase letter (A-Z)', valid: /[A-Z]/.test(password.value) },
  { key: 'hasLowercase', label: 'One lowercase letter (a-z)', valid: /[a-z]/.test(password.value) },
  { key: 'hasNumber',   label: 'One number (0-9)',            valid: /[0-9]/.test(password.value) },
  { key: 'hasSpecial',  label: 'One special character',       valid: /[^a-zA-Z0-9]/.test(password.value) },
])

const passwordStrength = computed(() => {
  const count = passwordRequirements.value.filter((r) => r.valid).length
  if (count === 5) return { count, label: 'Strong',       barClass: 'bg-emerald-500', textClass: 'text-emerald-600' }
  if (count >= 3)  return { count, label: 'Almost There', barClass: 'bg-primary',     textClass: 'text-primary' }
  return               { count, label: 'Needs Work',    barClass: 'bg-amber-400',  textClass: 'text-amber-600' }
})

const touchField = (field) => {
  touched.value[field] = true
  backendError.value = ''
}

const validationErrors = computed(() => ({
  password: !password.value
    ? 'Password is required.'
    : !passwordRequirements.value.every((r) => r.valid)
      ? 'Password does not meet all requirements.'
      : '',
  confirmPassword: !confirmPassword.value
    ? 'Please confirm your password.'
    : confirmPassword.value !== password.value
      ? 'Passwords do not match.'
      : '',
}))

const visibleErrors = computed(() =>
  Object.fromEntries(
    Object.entries(validationErrors.value).map(([field, msg]) => [
      field,
      submitted.value || touched.value[field] ? msg : '',
    ])
  )
)

const hasErrors = computed(() => Object.values(validationErrors.value).some(Boolean))

// ── Submit ─────────────────────────────────────────────────────────────────

const handleRegister = async () => {
  submitted.value = true
  backendError.value = ''
  touched.value.password = true
  touched.value.confirmPassword = true

  if (hasErrors.value) return

  try {
    loading.value = true
    const token = route.query.token

    const { data } = await axios.post(
      `http://localhost:5000/api/invitations/${token}/accept`,
      { password: password.value, confirmPassword: confirmPassword.value }
    )

    const userData = {
      ...data.user,
      name: `${data.user.firstName} ${data.user.lastName}`.trim(),
    }

    if (data.sessionId) {
      localStorage.setItem("sessionId", data.sessionId)
    }

    authStore.login(userData, data.token)
    registerSuccess.value = true

    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  } catch (err) {
    // Edge case: user registered independently after the invitation was sent.
    // Store the token and redirect to sign-in so the claim flow takes over.
    if (err.response?.status === 409 && err.response?.data?.code === 'EMAIL_EXISTS') {
      localStorage.setItem('pendingInviteToken', route.query.token)
      router.push('/signin')
      return
    }
    backendError.value = err.response?.data?.message || 'Registration failed. Please try again.'
  } finally {
    if (!registerSuccess.value) {
      loading.value = false
    }
  }
}
</script>
