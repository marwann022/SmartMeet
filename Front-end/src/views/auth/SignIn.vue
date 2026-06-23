<template>
  <div class="page-shell">
    <Navbar />

    <div class="flex items-center justify-center min-h-[calc(100vh-140px)] py-10 px-4">
      <div class="w-full max-w-[480px] bg-white/70 border border-white/70 backdrop-blur-lg rounded-[32px] p-8 sm:p-12 shadow-glass flex flex-col gap-7 items-center transition-all duration-300 hover:border-white/95 hover:shadow-card-hover">
        <!-- Header -->
        <div class="text-center flex flex-col gap-2">
          <h2 class="text-2xl sm:text-3xl font-bold font-header text-brand-dark">Welcome Back</h2>
          <p class="text-sm text-brand-slate">Log in to your intelligent workspace.</p>
        </div>

        <!-- SSO Authentication -->
        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <button
            type="button"
            class="flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-black/8 bg-white/50 text-[11px] font-bold text-brand-dark transition-all duration-300 hover:bg-white hover:border-primary/20 hover:shadow-sm cursor-pointer"
            @click="handleSSOLogin('Google')"
          >
            <img :src="googleIcon" alt="Google" class="w-4 h-4 object-contain" />
            <span>Continue With Google</span>
          </button>

          <button
            type="button"
            class="flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-black/8 bg-white/50 text-[11px] font-bold text-brand-dark transition-all duration-300 hover:bg-white hover:border-primary/20 hover:shadow-sm cursor-pointer"
            @click="handleSSOLogin('Apple')"
          >
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
        <form class="flex flex-col gap-6 w-full" @submit.prevent="handleSignIn" novalidate>
          <div class="flex flex-col gap-5 w-full">
            <!-- Email -->
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

            <!-- Password -->
            <div class="flex flex-col gap-2 w-full">
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
              <div class="flex justify-end items-center -mt-1">
                <a
                  href="#"
                  class="text-primary font-header font-bold text-xs hover:text-blue-800 transition-colors"
                  @click.prevent="goToForgotPassword"
                >
                  Forgot Password?
                </a>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-grad-primary text-white font-header font-bold text-[11px] tracking-wider uppercase rounded-xl shadow-[0_4px_15px_rgba(75,104,255,0.25)] hover:shadow-[0_6px_20px_rgba(75,104,255,0.35)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center cursor-pointer"
          >
            <span
              v-if="loading"
              class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spinner"
            ></span>
            <span v-else>Log In</span>
          </button>
        </form>

        <!-- Footer -->
        <div class="text-xs text-brand-slate gap-1.5 flex justify-center mt-2">
          <span>Don't have an account?</span>
          <router-link to="/signup" class="text-primary font-bold hover:underline">
            Sign up for free
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { PhEnvelope, PhLock, PhWarningCircle } from "@phosphor-icons/vue";
import Navbar from "@/components/layout/Navbar.vue";
import Input from "@/components/ui/Input.vue";
import googleIcon from "@/assets/Google.png";
import appleIcon from "@/assets/Apple_logo_black.svg";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const showGlobalError = ref(false);

const errors = ref({
  email: "",
  password: ""
});

const validateEmail = (value) => {
  if (!value || value.trim() === '') {
    errors.value.email = "Email Address is required."
    return false
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    errors.value.email = "Invalid email format"
    return false
  }
  errors.value.email = ""
  return true
}

const validatePassword = (value) => {
  if (!value || value.trim() === '') {
    errors.value.password = "Password is required"
    return false
  }
  errors.value.password = ""
  return true
}

watch(email, (newVal) => {
  validateEmail(newVal)
})

watch(password, (newVal) => {
  validatePassword(newVal)
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
        alert(error.response?.data?.message || "Google Login failed");
      } finally {
        loading.value = false;
      }
    }
  }
});

const handleSignIn = async () => {
  showGlobalError.value = false;

  const isEmailValid = validateEmail(email.value);
  const isPasswordValid = validatePassword(password.value);

  if (!isEmailValid || !isPasswordValid) {
    showGlobalError.value = true;
    return;
  }

  try {
    loading.value = true;

    const { data } = await axios.post("http://localhost:5000/api/users/login", {
      email: email.value,
      password: password.value,
    });

    const userData = {
      name: `${data.user.firstName} ${data.user.lastName}`,
      email: data.user.email,
      plan: "Free",
      avatar: data.user.avatar,
    };

    authStore.login(userData, data.token);
    alert(data.message);
    router.push("/dashboard");
  } catch (error) {
    alert(error.response?.data?.message || "Login failed");
  } finally {
    loading.value = false;
  }
};

const handleSSOLogin = (provider) => {
  if (provider === "Google") {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "your_google_client_id_here") {
      alert("Google Client ID is not configured in the frontend .env file.");
      return;
    }
    
    const redirectUri = encodeURIComponent(window.location.origin + "/signin");
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

  authStore.login(
    {
      name: `${provider} User`,
      email: "user@smartmeet.ai",
      plan: "Free",
    },
    "demo-token",
  );

  router.push("/dashboard");
};

const goToForgotPassword = () => {
  router.push("/forgot-password");
};
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

