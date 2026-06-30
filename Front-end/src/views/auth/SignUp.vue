<template>
  <div class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-between">
    <Navbar />

    <main class="flex flex-col items-center justify-center gap-10 py-8 sm:py-10 px-1 sm:px-4">
      <section
        class="w-full max-w-[540px] bg-white/70 border border-white/70 backdrop-blur-lg rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-glass flex flex-col gap-7 items-center transition-all duration-300 hover:border-white/95 hover:shadow-card-hover group/card"
        aria-labelledby="signup-title"
      >
        <template v-if="!registrationSuccess">
          <div class="text-center flex flex-col gap-2">
            <h1 id="signup-title" class="text-2xl sm:text-3xl font-bold font-header text-brand-dark">
              Create Your Account
            </h1>
            <p class="text-sm text-brand-slate">
              Sign up for your workspace.
            </p>
          </div>

          <div class="w-full">
            <button
              type="button"
              class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-black/8 bg-white/50 text-[11px] font-bold text-brand-dark transition-all duration-300 hover:bg-white hover:border-primary/20 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white/70 disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="loading"
              @click="handleSSO('Google')"
            >
              <img :src="googleIcon" alt="" class="w-4 h-4 object-contain" aria-hidden="true" />
              <span>Continue With Google</span>
            </button>
          </div>

          <div class="flex items-center gap-4 w-full my-1" aria-hidden="true">
            <div class="flex-1 h-[1px] bg-black/5"></div>
            <div class="font-header font-bold text-[10px] text-brand-slate tracking-widest">OR</div>
            <div class="flex-1 h-[1px] bg-black/5"></div>
          </div>

          <div
            v-if="showGlobalError"
            class="w-full p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-3 animate-fadeIn text-left"
            role="alert"
          >
            <PhWarningCircle :size="20" class="text-red-500 shrink-0" />
            <span>Please fix the highlighted fields below.</span>
          </div>

          <div
            v-if="backendError"
            class="w-full p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-3 animate-fadeIn text-left"
            role="alert"
          >
            <PhWarningCircle :size="20" class="text-red-500 shrink-0" />
            <span>{{ backendError }}</span>
          </div>

          <form class="flex flex-col gap-6 w-full" @submit.prevent="handleSignUp" novalidate>
            <div class="flex flex-col gap-5 w-full">
              <Input
                id="fullname"
                v-model="fullName"
                type="text"
                label="Full Name"
                placeholder="ex: John Doe"
                autocomplete="name"
                required
                :disabled="loading"
                :error="visibleErrors.fullName"
                @update:model-value="touchField('fullName')"
                @blur="touchField('fullName')"
              >
                <template #icon>
                  <PhUser :size="18" weight="bold" />
                </template>
              </Input>

              <Input
                id="email"
                v-model="email"
                type="email"
                label="Email"
                placeholder="example@gmail.com"
                autocomplete="email"
                required
                :disabled="loading"
                :error="visibleErrors.email"
                @update:model-value="touchField('email')"
                @blur="touchField('email')"
              >
                <template #icon>
                  <PhEnvelope :size="18" weight="bold" />
                </template>
              </Input>

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
                  class="flex flex-col gap-3 p-4 bg-brand-slate/5 rounded-2xl text-left border border-black/5 w-full"
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
                      v-for="requirement in passwordRequirements"
                      :key="requirement.key"
                      class="flex items-center gap-2 text-xs font-semibold transition-colors duration-200"
                      :class="requirement.valid ? 'text-emerald-600' : 'text-brand-slate/70'"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-200"
                        :class="requirement.valid ? 'bg-emerald-500' : 'bg-brand-slate/30'"
                        aria-hidden="true"
                      ></span>
                      {{ requirement.label }}
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

              <fieldset class="flex flex-col gap-3 w-full">
                <legend class="text-xs font-bold text-brand-dark text-left">
                  Role
                </legend>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Role">
                  <label
                    v-for="option in roleOptions"
                    :key="option.value"
                    :for="`role-${option.value}`"
                    class="group/role relative min-h-[132px] flex cursor-pointer rounded-2xl border bg-white/50 p-4 text-left transition-all duration-300"
                    :class="role === option.value
                      ? 'border-primary/70 bg-primary/5 shadow-sm ring-2 ring-primary/15'
                      : 'border-black/5 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white/80 hover:shadow-sm'"
                  >
                    <input
                      :id="`role-${option.value}`"
                      v-model="role"
                      type="radio"
                      name="role"
                      class="peer sr-only"
                      :value="option.value"
                      :disabled="loading"
                      :aria-describedby="`role-${option.value}-description`"
                      @change="touchField('role')"
                    />

                    <span
                      class="absolute inset-0 rounded-2xl transition peer-focus-visible:ring-2 peer-focus-visible:ring-primary/45 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white/70"
                      aria-hidden="true"
                    ></span>

                    <span class="relative z-10 flex h-full w-full flex-col gap-3">
                      <span class="flex items-start justify-between gap-3">
                        <span class="flex items-center gap-2">
                          <span
                            class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200"
                            :class="role === option.value ? 'border-primary bg-primary/10' : 'border-brand-slate/25 bg-white/70'"
                            aria-hidden="true"
                          >
                            <span
                              class="h-2.5 w-2.5 rounded-full transition-transform duration-200"
                              :class="role === option.value ? 'scale-100 bg-primary' : 'scale-0 bg-transparent'"
                            ></span>
                          </span>
                          <span class="font-header text-sm font-bold text-brand-dark">
                            {{ option.label }}
                          </span>
                        </span>
                      </span>

                      <span
                        :id="`role-${option.value}-description`"
                        class="text-xs leading-relaxed text-brand-slate"
                      >
                        {{ option.description }}
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>

              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2 scale-[0.98]"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 -translate-y-2 scale-[0.98]"
              >
                <Input
                  v-if="role === 'user'"
                  id="communityCode"
                  v-model="communityCode"
                  type="text"
                  label="Community Code"
                  placeholder="Enter your community code"
                  autocomplete="off"
                  required
                  :disabled="loading"
                  :error="visibleErrors.communityCode"
                  @update:model-value="touchField('communityCode')"
                  @blur="touchField('communityCode')"
                >
                  <template #icon>
                    <PhKey :size="18" weight="bold" />
                  </template>
                </Input>
              </Transition>

              <div class="flex flex-col gap-2 w-full text-left">
                <span class="text-xs font-bold text-brand-dark">
                  Terms &amp; Conditions
                </span>
                <Checkbox
                  v-model="agreeTerms"
                  :disabled="loading"
                  :error="visibleErrors.agreeTerms"
                  @change="touchField('agreeTerms')"
                  label="I agree to SmartMeet's terms and privacy policies."
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              class="w-full mt-1"
              :loading="loading"
              :disabled="loading"
            >
              Sign Up
            </Button>
          </form>

          <div class="text-xs text-brand-slate gap-1.5 flex justify-center mt-1">
            <span>Already have an account?</span>
            <router-link to="/signin" class="text-primary font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white/70 rounded">
              Log In
            </router-link>
          </div>
        </template>

        <div v-else class="flex flex-col items-center justify-center text-center py-6 w-full animate-fadeIn">
          <div class="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-6 shadow-sm">
            <PhCheckCircle :size="36" weight="fill" />
          </div>
          <h2 class="text-2xl font-bold font-header text-brand-dark mb-3">
            Registration Successful
          </h2>
          <p class="text-xs text-brand-slate max-w-[320px] leading-relaxed mb-8">
            Your account has been created successfully. Welcome to SmartMeet! You can now proceed to log in to your dashboard.
          </p>
          <router-link
            to="/signin"
            class="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-[#3850e0] text-white text-xs font-bold tracking-wider uppercase hover:shadow-md transition-all duration-300 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white/70"
          >
            Proceed to Log In
          </router-link>
        </div>
      </section>

      <div class="max-w-full flex items-center gap-2.5 px-4 sm:px-5 py-2 bg-white/85 border border-black/5 rounded-full backdrop-blur-lg pointer-events-none shadow-[0_2px_10px_rgba(0,0,0,0.01)] select-none">
        <div class="flex items-center justify-center text-primary opacity-80">
          <PhShieldCheck :size="16" weight="bold" />
        </div>
        <span class="font-header font-bold text-[10px] text-brand-slate tracking-wide uppercase text-center">
          SOC2 Type II &amp; HIPAA Compliant AI Infrastructure
        </span>
      </div>
    </main>

    <footer class="py-6 text-center text-xs text-brand-slate">
      &copy; 2026 SmartMeet AI Inc. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  PhCheckCircle,
  PhEnvelope,
  PhKey,
  PhLock,
  PhShieldCheck,
  PhUser,
  PhWarningCircle
} from '@phosphor-icons/vue'
import axios from 'axios'
import Navbar from '@/components/layout/Navbar.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
import googleIcon from '@/assets/Google.png'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('admin')
const communityCode = ref('')
const agreeTerms = ref(false)

const loading = ref(false)
const submitted = ref(false)
const registrationSuccess = ref(false)
const backendError = ref('')

const touched = ref({
  fullName: false,
  email: false,
  password: false,
  confirmPassword: false,
  role: false,
  communityCode: false,
  agreeTerms: false
})

const roleOptions = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Create and manage your own community.'
  },
  {
    value: 'user',
    label: 'User',
    description: 'Join an existing community using a code.'
  }
]

const touchField = (field) => {
  touched.value[field] = true
  backendError.value = ''
}

const touchAllFields = () => {
  Object.keys(touched.value).forEach((field) => {
    touched.value[field] = true
  })
}

const validateFullName = (value) => {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Full Name is required.'
  }

  if (trimmed.length < 3) {
    return 'Name must be at least 3 characters.'
  }

  if (!/^[\p{L}\p{M}\s.'-]+$/u.test(trimmed)) {
    return 'Name can only contain letters and common name punctuation.'
  }

  return ''
}

const validateEmail = (value) => {
  const trimmed = value.trim()

  if (!trimmed) {
    return 'Email address is required.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
    return 'Please enter a valid email address.'
  }

  return ''
}

const passwordRequirements = computed(() => [
  {
    key: 'min8',
    label: 'At least 8 characters',
    valid: password.value.length >= 8
  },
  {
    key: 'hasUppercase',
    label: 'One uppercase letter (A-Z)',
    valid: /[A-Z]/.test(password.value)
  },
  {
    key: 'hasLowercase',
    label: 'One lowercase letter (a-z)',
    valid: /[a-z]/.test(password.value)
  },
  {
    key: 'hasNumber',
    label: 'One number (0-9)',
    valid: /[0-9]/.test(password.value)
  },
  {
    key: 'hasSpecial',
    label: 'One special character',
    valid: /[^a-zA-Z0-9]/.test(password.value)
  }
])

const passwordStrength = computed(() => {
  const count = passwordRequirements.value.filter((requirement) => requirement.valid).length

  if (count === 5) {
    return {
      count,
      label: 'Strong',
      barClass: 'bg-emerald-500',
      textClass: 'text-emerald-600'
    }
  }

  if (count >= 3) {
    return {
      count,
      label: 'Almost There',
      barClass: 'bg-primary',
      textClass: 'text-primary'
    }
  }

  return {
    count,
    label: 'Needs Work',
    barClass: 'bg-amber-400',
    textClass: 'text-amber-600'
  }
})

const validatePassword = (value) => {
  if (!value) {
    return 'Password is required.'
  }

  if (!passwordRequirements.value.every((requirement) => requirement.valid)) {
    return 'Password does not meet all requirements.'
  }

  return ''
}

const validateConfirmPassword = (value) => {
  if (!value) {
    return 'Please confirm your password.'
  }

  if (value !== password.value) {
    return 'Passwords do not match.'
  }

  return ''
}

const validateCommunityCode = (value) => {
  if (role.value !== 'user') {
    return ''
  }

  if (!value.trim()) {
    return 'Community Code is required for users.'
  }

  return ''
}

const validateAgreeTerms = (value) => {
  if (!value) {
    return "You must agree to SmartMeet's terms and privacy policies."
  }

  return ''
}

const validationErrors = computed(() => ({
  fullName: validateFullName(fullName.value),
  email: validateEmail(email.value),
  password: validatePassword(password.value),
  confirmPassword: validateConfirmPassword(confirmPassword.value),
  role: '',
  communityCode: validateCommunityCode(communityCode.value),
  agreeTerms: validateAgreeTerms(agreeTerms.value)
}))

const visibleErrors = computed(() => (
  Object.fromEntries(
    Object.entries(validationErrors.value).map(([field, message]) => [
      field,
      submitted.value || touched.value[field] ? message : ''
    ])
  )
))

const hasValidationErrors = computed(() => (
  Object.values(validationErrors.value).some(Boolean)
))

const showGlobalError = computed(() => submitted.value && hasValidationErrors.value)

watch(role, (newRole) => {
  backendError.value = ''

  if (newRole === 'admin') {
    communityCode.value = ''
    touched.value.communityCode = false
  }
})

onMounted(async () => {
  const hash = window.location.hash

  if (!hash) {
    return
  }

  const params = new URLSearchParams(hash.substring(1))
  const idToken = params.get('id_token')

  if (!idToken) {
    return
  }

  try {
    loading.value = true
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search)

    const { data } = await axios.post('http://localhost:5000/api/users/google-login', {
      token: idToken
    })

    const userData = {
      ...data.user,
      name: `${data.user.firstName} ${data.user.lastName}`,
    }

    authStore.login(userData, data.token)
    router.push('/dashboard')
  } catch (error) {
    backendError.value = error.response?.data?.message || 'Google authentication failed.'
  } finally {
    loading.value = false
  }
})

const handleSignUp = async () => {
  submitted.value = true
  backendError.value = ''
  touchAllFields()

  if (hasValidationErrors.value) {
    return
  }

  try {
    loading.value = true

    await axios.post('http://localhost:5000/api/users/register', {
      name: fullName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      confirmPassword: confirmPassword.value,
      role: role.value,
      communityCode: role.value === 'user' ? communityCode.value.trim() : ''
    })

    registrationSuccess.value = true
  } catch (error) {
    backendError.value = error.response?.data?.message || 'Registration failed.'
  } finally {
    loading.value = false
  }
}

const handleSSO = (provider) => {
  if (provider === 'Google') {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    if (!clientId || clientId === 'your_google_client_id_here') {
      backendError.value = 'Google Client ID is not configured in the frontend .env file.'
      return
    }

    const redirectUri = encodeURIComponent(`${window.location.origin}/signup`)
    const scope = encodeURIComponent('openid profile email')
    const nonce = Math.random().toString(36).substring(2)

    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=${scope}&nonce=${nonce}`

    window.location.href = oauthUrl
    return
  }

  authStore.login({
    name: `${provider} User`,
    email: 'user@smartmeet.ai',
    plan: 'Free'
  })

  router.push('/dashboard')
}
</script>
