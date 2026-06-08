<template>
  <div class="page-shell">
    <Navbar activePage="signup" @navigate="$emit('navigate', $event)" />
    <div class="flex flex-col items-center justify-center gap-12 py-10 px-4">
      <div class="w-full max-w-[480px] bg-white/70 border border-white/70 backdrop-blur-lg rounded-[32px] p-8 sm:p-12 shadow-glass flex flex-col gap-7 items-center transition-all duration-300 hover:border-white/95 hover:shadow-card-hover group/card">
        <!-- Header -->
        <div class="text-center flex flex-col gap-2">
          <h2 class="text-2xl sm:text-3xl font-bold font-header text-brand-dark">Create Your Account</h2>
          <p class="text-sm text-brand-slate">Sign up to your intelligent workspace.</p>
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
            <div class="flex flex-col gap-2 text-left w-full">
              <div class="flex justify-between items-center w-full">
                <label class="font-header text-xs font-bold text-brand-dark" for="fullname">Full Name</label>
              </div>
              <div class="relative w-full group">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-brand-slate opacity-50 group-focus-within:opacity-95 group-focus-within:text-primary transition-all duration-300">
                  <PhUser :size="18" weight="bold" />
                </div>
                <input
                  id="fullname"
                  type="text"
                  class="w-full h-12 bg-white border border-black/8 rounded-xl pl-11 pr-4 text-brand-dark text-sm font-semibold outline-none transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] placeholder-brand-slate/60 focus:border-primary focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.03),0_0_12px_rgba(75,104,255,0.15)]"
                  v-model="fullname"
                  placeholder="ex: John Doe"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Email Input -->
            <div class="flex flex-col gap-2 text-left w-full">
              <div class="flex justify-between items-center w-full">
                <label class="font-header text-xs font-bold text-brand-dark" for="email">Email</label>
              </div>
              <div class="relative w-full group">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-brand-slate opacity-50 group-focus-within:opacity-95 group-focus-within:text-primary transition-all duration-300">
                  <PhEnvelope :size="18" weight="bold" />
                </div>
                <input
                  id="email"
                  type="email"
                  class="w-full h-12 bg-white border border-black/8 rounded-xl pl-11 pr-4 text-brand-dark text-sm font-semibold outline-none transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] placeholder-brand-slate/60 focus:border-primary focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.03),0_0_12px_rgba(75,104,255,0.15)]"
                  v-model="email"
                  placeholder="example@gmail.com"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Password Input -->
            <div class="flex flex-col gap-2 text-left w-full">
              <div class="flex justify-between items-center w-full">
                <label class="font-header text-xs font-bold text-brand-dark" for="password">Password</label>
              </div>
              <div class="relative w-full group">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-brand-slate opacity-50 group-focus-within:opacity-95 group-focus-within:text-primary transition-all duration-300">
                  <PhLock :size="18" weight="bold" />
                </div>
                <input
                  id="password"
                  type="password"
                  class="w-full h-12 bg-white border border-black/8 rounded-xl pl-11 pr-4 text-brand-dark text-sm font-semibold outline-none transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] placeholder-brand-slate/60 focus:border-primary focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.03),0_0_12px_rgba(75,104,255,0.15)]"
                  v-model="password"
                  placeholder="••••••••"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Confirm Password Input -->
            <div class="flex flex-col gap-2 text-left w-full">
              <div class="flex justify-between items-center w-full">
                <label class="font-header text-xs font-bold text-brand-dark" for="confirmPassword">Confirm Password</label>
              </div>
              <div class="relative w-full group">
                <div class="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-brand-slate opacity-50 group-focus-within:opacity-95 group-focus-within:text-primary transition-all duration-300">
                  <PhLock :size="18" weight="bold" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  class="w-full h-12 bg-white border border-black/8 rounded-xl pl-11 pr-4 text-brand-dark text-sm font-semibold outline-none transition-all duration-300 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] placeholder-brand-slate/60 focus:border-primary focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.03),0_0_12px_rgba(75,104,255,0.15)]"
                  v-model="confirmPassword"
                  placeholder="••••••••"
                  required
                  :disabled="loading"
                />
              </div>
            </div>
          </div>

          <button type="submit" class="w-full py-3.5 bg-grad-primary text-white font-header font-bold text-[11px] tracking-wider uppercase rounded-xl shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_20px_rgba(75,104,255,0.35)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer" :disabled="loading">
            <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spinner"></span>
            <span v-else>Sign Up</span>
          </button>
        </form>

        <!-- Footer navigation -->
        <div class="text-xs text-brand-slate gap-1.5 flex justify-center mt-2">
          <span>Already have an account?</span>
          <a href="#" class="text-primary font-bold hover:underline" @click.prevent="$emit('navigate', 'signin')">Log In</a>
        </div>
      </div>

      <!-- SOC2 / HIPAA compliance badge -->
      <div class="flex items-center gap-2.5 px-5 py-2 bg-white/85 border border-black/5 rounded-full backdrop-blur-lg pointer-events-none shadow-[0_2px_10px_rgba(0,0,0,0.01)] select-none">
        <div class="flex items-center justify-center text-primary opacity-80">
          <PhShieldCheck :size="16" weight="bold" />
        </div>
        <span class="font-header font-bold text-[10px] text-brand-slate tracking-wide uppercase">SOC2 Type II &amp; HIPAA Compliant AI Infrastructure</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PhEnvelope, PhLock, PhUser, PhShieldCheck } from '@phosphor-icons/vue'
import Navbar from '../components/Navbar.vue'
import googleIcon from '../assets/Google.png'
import appleIcon from '../assets/Apple_logo_black.svg'

const emit = defineEmits(['navigate'])

const fullname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleSignUp = () => {
  if (password.value !== confirmPassword.value) {
    alert("Passwords do not match!")
    return
  }
  
  loading.value = true
  setTimeout(() => {
    loading.value = false
    alert(`Account successfully created for ${fullname.value}!`)
    emit('navigate', 'signin')
  }, 1500)
}

const handleSSO = (provider) => {
  alert(`Simulating SSO Login with ${provider}...`)
  emit('navigate', 'dashboard')
}
</script>
