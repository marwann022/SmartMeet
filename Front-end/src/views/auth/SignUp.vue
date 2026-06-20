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

        <!-- Credentials Form -->
        <form class="flex flex-col gap-6 w-full" @submit.prevent="handleSignUp">
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
            >
              <template #icon>
                <PhLock :size="18" weight="bold" />
              </template>
            </Input>

            <!-- Confirm Password Input -->
            <Input
              id="confirmPassword"
              type="password"
              label="Confirm Password"
              v-model="confirmPassword"
              placeholder="••••••••"
              required
              :disabled="loading"
            >
              <template #icon>
                <PhLock :size="18" weight="bold" />
              </template>
            </Input>
          </div>

          <Button type="submit" variant="primary" class="w-full" :loading="loading">
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { PhEnvelope, PhLock, PhUser, PhShieldCheck } from '@phosphor-icons/vue'
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
const loading = ref(false)


const handleSignUp = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }

  try {
    loading.value = true

    const names = fullname.value.trim().split(' ')

    const firstName = names[0]

    const lastName =
      names.length > 1
        ? names.slice(1).join(' ')
        : 'User'

    const { data } = await axios.post(
      'http://localhost:5000/api/users/register',
      {
        firstName,
        lastName,
        email: email.value,
        password: password.value
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
  authStore.login({
    name: `${provider} User`,
    email: 'user@smartmeet.ai',
    plan: 'Free'
  })

  router.push('/dashboard')
}
</script>
