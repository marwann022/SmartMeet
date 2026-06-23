<template>
  <div class="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col justify-between">
    <Navbar />
    
    <div class="flex flex-col items-center justify-center gap-12 py-10 px-4">
      <div class="w-full max-w-[480px] bg-white/70 border border-white/70 backdrop-blur-lg rounded-[32px] p-8 sm:p-12 shadow-glass flex flex-col gap-7 items-center transition-all duration-300 hover:border-white/95 hover:shadow-card-hover group/card">
        <!-- Header -->
        <div class="text-center flex flex-col gap-2">
          <h2 class="text-2xl sm:text-3xl font-bold font-header text-brand-dark">Create Your Account</h2>
          <p class="text-sm text-brand-slate">Sign up for your workspace.</p>
        </div>

        <!-- SSO Authentication -->
        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <button type="button" class="flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-black/8 bg-white/50 text-[11px] font-bold text-brand-dark transition-all duration-300 hover:bg-white hover:border-primary/20 hover:shadow-sm cursor-pointer" @click="handleSSO('Google')">
            <img :src="googleIcon" alt="Google" class="w-4 h-4 object-contain" />
            <span>Continue With Google</span>
          </button>
          <button type="button" class="flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-black/8 bg-white/50 text-[11px] font-bold text-brand-dark transition-all duration-300 hover:bg-white hover:border-primary/20 hover:shadow-sm cursor-pointer" @click="handleSSO('Apple')">
            <img :src="appleIcon" alt="Apple" class="w-4 h-4 object-contain" />
            <span>Continue With Apple</span>
          </button>
        </div>

        <!-- OR Divider -->
        <div class="flex items-center gap-4 w-full my-2">
          <div class="flex-1 h-[1px] bg-black/5"></div>
          <div class="font-header font-bold text-[10px] text-brand-slate tracking-widest">OR</div>
          <div class="flex-1 h-[1px] bg-black/5"></div>
        </div>

        <!-- Global Error Banner -->
        <div v-if="showGlobalError" class="w-full p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl flex items-center gap-3 animate-fadeIn">
          <PhWarningCircle :size="20" class="text-red-500 shrink-0" />
          <span>Please fix the errors in the fields below.</span>
        </div>

        <!-- Credentials Form -->
        <form class="flex flex-col gap-6 w-full" @submit.prevent="handleSignUp" novalidate>
          <div class="flex flex-col gap-5 w-full">
            <!-- Full Name Input -->
            <Input
              id="fullname"
              type="text"
              label="Full Name"
              v-model="fullname"
              placeholder="ex: John Doe"
              required
              :disabled="loading"
              :error="errors.fullname"
            >
              <template #icon>
                <PhUser :size="18" weight="bold" />
              </template>
            </Input>

            <!-- Email Input -->
            <Input
              id="email"
              type="email"
              label="Email"
              v-model="email"
              placeholder="example@gmail.com"
              required
              :disabled="loading"
              :error="errors.email"
            >
              <template #icon>
                <PhEnvelope :size="18" weight="bold" />
              </template>
            </Input>

            <!-- Password Input -->
            <Input
              id="password"
              type="password"
              label="Password"
              v-model="password"
              placeholder="••••••••"
              required
              :disabled="loading"
              :error="errors.password"
            >
              <template #icon>
                <PhLock :size="18" weight="bold" />
              </template>
            </Input>

            <!-- Password Strength Checklist -->
            <div v-if="password" class="flex flex-col gap-1.5 p-3.5 bg-brand-slate/5 rounded-xl text-left border border-black/5 animate-fadeIn w-full">
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate">Password Requirements:</span>
              <ul class="flex flex-col gap-1 mt-1">
                <li class="flex items-center gap-2 text-xs font-semibold" :class="pswCriteria.min8 ? 'text-emerald-600' : 'text-brand-slate/70'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="pswCriteria.min8 ? 'bg-emerald-500' : 'bg-brand-slate/30'"></span>
                  At least 8 characters
                </li>
                <li class="flex items-center gap-2 text-xs font-semibold" :class="pswCriteria.hasUppercase ? 'text-emerald-600' : 'text-brand-slate/70'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="pswCriteria.hasUppercase ? 'bg-emerald-500' : 'bg-brand-slate/30'"></span>
                  One uppercase letter (A-Z)
                </li>
                <li class="flex items-center gap-2 text-xs font-semibold" :class="pswCriteria.hasLowercase ? 'text-emerald-600' : 'text-brand-slate/70'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="pswCriteria.hasLowercase ? 'bg-emerald-500' : 'bg-brand-slate/30'"></span>
                  One lowercase letter (a-z)
                </li>
                <li class="flex items-center gap-2 text-xs font-semibold" :class="pswCriteria.hasNumber ? 'text-emerald-600' : 'text-brand-slate/70'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="pswCriteria.hasNumber ? 'bg-emerald-500' : 'bg-brand-slate/30'"></span>
                  One number (0-9)
                </li>
                <li class="flex items-center gap-2 text-xs font-semibold" :class="pswCriteria.hasSpecial ? 'text-emerald-600' : 'text-brand-slate/70'">
                  <span class="w-1.5 h-1.5 rounded-full" :class="pswCriteria.hasSpecial ? 'bg-emerald-500' : 'bg-brand-slate/30'"></span>
                  One special character (non-alphanumeric)
                </li>
              </ul>
            </div>

            <!-- Confirm Password Input -->
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              v-model="confirmPassword"
              placeholder="••••••••"
              required
              :disabled="loading"
              :error="errors.confirmPassword"
            >
              <template #icon>
                <PhLock :size="18" weight="bold" />
              </template>
            </Input>

            <!-- Terms & Conditions Checkbox -->
            <div class="flex flex-col gap-1.5 w-full text-left mt-2">
              <label class="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  v-model="agreeTerms"
                  class="mt-0.5 checkbox checkbox-xs checkbox-primary border-black/10 rounded cursor-pointer"
                  :disabled="loading"
                />
                <span class="text-xs text-brand-slate font-medium leading-normal">
                  I agree to SmartMeet's terms and privacy policies.
                </span>
              </label>
              <span v-if="errors.agreeTerms" class="text-[11px] text-red-500 font-semibold pl-1 animate-fadeIn">
                {{ errors.agreeTerms }}
              </span>
            </div>
          </div>

          <Button type="submit" variant="primary" class="w-full mt-2" :loading="loading">
            Sign Up
          </Button>
        </form>

        <!-- Footer navigation -->
        <div class="text-xs text-brand-slate gap-1.5 flex justify-center mt-2">
          <span>Already have an account?</span>
          <router-link to="/signin" class="text-primary font-bold hover:underline">Log In</router-link>
        </div>
      </div>

      <!-- Compliance Badge -->
      <div class="flex items-center gap-2.5 px-5 py-2 bg-white/85 border border-black/5 rounded-full backdrop-blur-lg pointer-events-none shadow-[0_2px_10px_rgba(0,0,0,0.01)] select-none">
        <div class="flex items-center justify-center text-primary opacity-80">
          <PhShieldCheck :size="16" weight="bold" />
        </div>
        <span class="font-header font-bold text-[10px] text-brand-slate tracking-wide uppercase">SOC2 Type II &amp; HIPAA Compliant AI Infrastructure</span>
      </div>
    </div>

    <div class="py-6 text-center text-xs text-brand-slate">
      © 2026 SmartMeet AI Inc. All rights reserved.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { PhEnvelope, PhLock, PhUser, PhShieldCheck, PhWarningCircle } from '@phosphor-icons/vue'
import Navbar from '@/components/layout/Navbar.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import googleIcon from '@/assets/Google.png'
import appleIcon from '@/assets/Apple_logo_black.svg'
import { useAuthStore } from '@/stores/auth'
import axios from "axios"

const router = useRouter()
const authStore = useAuthStore()

const fullname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)

const loading = ref(false)
const showGlobalError = ref(false)

const errors = ref({
  fullname: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: ''
})

const pswCriteria = ref({
  hasLowercase: false,
  hasUppercase: false,
  hasNumber: false,
  hasSpecial: false,
  min8: false
})

// Field Validation logic
const validateFullName = (value) => {
  if (!value || value.trim() === '') {
    errors.value.fullname = "Full Name is required."
    return false
  }
  if (!/^[a-zA-Z\s'\-]+$/.test(value)) {
    errors.value.fullname = "Name can only contain letters."
    return false
  }
  if (value.trim().length < 3) {
    errors.value.fullname = "Name must be at least 3 characters."
    return false
  }
  errors.value.fullname = ""
  return true
}

const validateEmail = (value) => {
  if (!value || value.trim() === '') {
    errors.value.email = "Email address is required."
    return false
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    errors.value.email = "Please enter a valid email address."
    return false
  }
  errors.value.email = ""
  return true
}

const validatePassword = (value) => {
  if (!value) {
    errors.value.password = "Password is required."
    pswCriteria.value = { hasLowercase: false, hasUppercase: false, hasNumber: false, hasSpecial: false, min8: false }
    return false
  }
  if (value.length < 3) {
    errors.value.password = "Password must be at least 3 characters."
    pswCriteria.value = { hasLowercase: false, hasUppercase: false, hasNumber: false, hasSpecial: false, min8: false }
    return false
  }

  pswCriteria.value.hasLowercase = /[a-z]/.test(value)
  pswCriteria.value.hasUppercase = /[A-Z]/.test(value)
  pswCriteria.value.hasNumber = /[0-9]/.test(value)
  pswCriteria.value.hasSpecial = /[^a-zA-Z0-9]/.test(value)
  pswCriteria.value.min8 = value.length >= 8

  const allMet = pswCriteria.value.hasLowercase && 
                 pswCriteria.value.hasUppercase && 
                 pswCriteria.value.hasNumber && 
                 pswCriteria.value.hasSpecial && 
                 pswCriteria.value.min8

  if (!allMet) {
    errors.value.password = "Password does not meet all requirements."
    return false
  }

  errors.value.password = ""
  return true
}

const validateConfirmPassword = (value) => {
  if (!value) {
    errors.value.confirmPassword = "Please confirm your password."
    return false
  }
  if (value !== password.value) {
    errors.value.confirmPassword = "Passwords do not match."
    return false
  }
  errors.value.confirmPassword = ""
  return true
}

const validateAgreeTerms = (value) => {
  if (!value) {
    errors.value.agreeTerms = "You must agree to SmartMeet's terms and privacy policies."
    return false
  }
  errors.value.agreeTerms = ""
  return true
}

// Watchers for Real-time validation
watch(fullname, (newVal) => {
  validateFullName(newVal)
})

watch(email, (newVal) => {
  validateEmail(newVal)
})

watch(password, (newVal) => {
  validatePassword(newVal)
  if (confirmPassword.value) {
    validateConfirmPassword(confirmPassword.value)
  }
})

watch(confirmPassword, (newVal) => {
  validateConfirmPassword(newVal)
})

watch(agreeTerms, (newVal) => {
  validateAgreeTerms(newVal)
})

onMounted(async () => {
  const hash = window.location.hash;
  if (hash) {
    const params = new URLSearchParams(hash.substring(1));
    const idToken = params.get("id_token");
    if (idToken) {
      try {
        loading.value = true;
        window.history.replaceState({}, document.title, window.location.pathname);
        
        const { data } = await axios.post("http://localhost:5000/api/users/google-login", {
          token: idToken,
        });

        const userData = {
          name: `${data.user.firstName} ${data.user.lastName}`,
          email: data.user.email,
          plan: "Free",
          avatar: data.user.avatar,
        };

        authStore.login(userData, data.token);
        router.push("/dashboard");
      } catch (error) {
        alert(error.response?.data?.message || "Google Authentication failed");
      } finally {
        loading.value = false;
      }
    }
  }
});

const handleSignUp = async () => {
  showGlobalError.value = false

  const isFullNameValid = validateFullName(fullname.value)
  const isEmailValid = validateEmail(email.value)
  const isPasswordValid = validatePassword(password.value)
  const isConfirmPasswordValid = validateConfirmPassword(confirmPassword.value)
  const isAgreeTermsValid = validateAgreeTerms(agreeTerms.value)

  if (!isFullNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isAgreeTermsValid) {
    showGlobalError.value = true
    return
  }

  try {
    loading.value = true

    const { data } = await axios.post(
      'http://localhost:5000/api/users/register',
      {
        name: fullname.value.trim(),
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value
      }
    )

    alert(data.message)
    router.push('/signin')
  } catch (error) {
    alert(
      error.response?.data?.message ||
      'Registration failed'
    )
  } finally {
    loading.value = false
  }
}

const handleSSO = (provider) => {
  if (provider === "Google") {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "your_google_client_id_here") {
      alert("Google Client ID is not configured in the frontend .env file.");
      return;
    }
    
    const redirectUri = encodeURIComponent(window.location.origin + "/signup");
    const scope = encodeURIComponent("openid profile email");
    const nonce = Math.random().toString(36).substring(2);
    
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=id_token&` +
      `scope=${scope}&` +
      `nonce=${nonce}`;
      
    window.location.href = oauthUrl;
    return;
  }

  authStore.login({
    name: `${provider} User`,
    email: 'user@smartmeet.ai',
    plan: 'Free'
  })

  router.push('/dashboard')
}
</script>

