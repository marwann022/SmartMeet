<template>
  <div class="page-shell">
    <Navbar />

    <div class="flex items-center justify-center min-h-[calc(100vh-140px)] py-10 px-4">
      <div class="w-full max-w-[540px] bg-white/70 dark:bg-slate-900/70 border border-white/70 dark:border-white/10 backdrop-blur-lg rounded-[32px] p-8 sm:p-12 shadow-glass flex flex-col gap-7 items-center transition-all duration-300 hover:border-white/95 dark:hover:border-white/20 hover:shadow-card-hover">
        <template v-if="!loginSuccess">
          <!-- Header -->
          <div class="text-center flex flex-col gap-2">
            <h2 class="text-2xl sm:text-3xl font-bold font-header text-brand-dark">Welcome Back</h2>
            <p class="text-sm text-brand-slate">Log in to your intelligent workspace.</p>
          </div>

          <!-- SSO Authentication -->
          <div class="w-full">
            <button
              type="button"
              class="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-black/8 dark:border-white/10 bg-white/50 dark:bg-white/5 text-[11px] font-bold text-brand-dark transition-all duration-300 hover:bg-white dark:hover:bg-white/10 hover:border-primary/20 hover:shadow-sm cursor-pointer"
              @click="handleSSOLogin('Google')"
            >
              <img :src="googleIcon" alt="Google" class="w-4 h-4 object-contain" />
              <span>Continue With Google</span>
            </button>
          </div>

          <!-- OR Divider -->
          <div class="flex items-center gap-4 w-full my-2">
            <div class="flex-1 h-[1px] bg-black/5 dark:bg-white/10"></div>
            <div class="font-header font-bold text-[10px] text-brand-slate tracking-widest">OR</div>
            <div class="flex-1 h-[1px] bg-black/5 dark:bg-white/10"></div>
          </div>

          <!-- Global Error Banner -->
          <div v-if="showGlobalError" class="w-full p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-semibold rounded-2xl flex items-center gap-3 animate-fadeIn text-left">
            <PhWarningCircle :size="20" class="text-red-500 shrink-0" />
            <span>Please fix the errors in the fields below.</span>
          </div>

          <!-- Backend Error Banner -->
          <div v-if="backendError" class="w-full p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm font-semibold rounded-2xl flex items-center gap-3 animate-fadeIn text-left">
            <PhWarningCircle :size="20" class="text-red-500 shrink-0" />
            <span>{{ backendError }}</span>
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
        </template>

        <!-- Beautiful Login Success Loading State -->
        <div v-else class="flex flex-col items-center justify-center text-center py-10 w-full animate-fade-in">
          <!-- Premium Pulsing Logo / Spinner -->
          <div class="relative flex items-center justify-center mb-8">
            <!-- Ripple Ring 1 -->
            <div class="absolute w-16 h-16 rounded-full bg-primary/10 border border-primary/20 animate-ping opacity-75"></div>
            <!-- Ripple Ring 2 -->
            <div class="absolute w-20 h-20 rounded-full bg-primary/5 border border-primary/10 animate-pulse delay-75"></div>
            <!-- Center Spinner Card -->
            <div class="w-14 h-14 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-white dark:border-white/10 flex items-center justify-center text-primary shadow-glass backdrop-blur-md relative z-10 animate-bounce">
              <PhSparkle :size="28" weight="fill" class="animate-spin duration-1000" />
            </div>
          </div>
          <h2 class="text-xl font-bold font-header text-brand-dark mb-2 animate-pulse">
            Welcome Back!
          </h2>
          <p class="text-[10px] text-brand-slate tracking-widest uppercase font-extrabold animate-pulse">
            Preparing your intelligent workspace...
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { PhEnvelope, PhLock, PhWarningCircle, PhSparkle } from "@phosphor-icons/vue";
import Navbar from "@/components/layout/Navbar.vue";
import Input from "@/components/ui/Input.vue";
import googleIcon from "@/assets/Google.png";
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const showGlobalError = ref(false);
const loginSuccess = ref(false);
const backendError = ref("");

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
        backendError.value = "";
        window.history.replaceState({}, document.title, window.location.pathname);
        
        const { data } = await axios.post("http://localhost:5000/api/users/google-login", {
          token: idToken,
        });

        const userData = {
          ...data.user,
          name: `${data.user.firstName} ${data.user.lastName}`,
        };

        localStorage.setItem("sessionId", data.sessionId);
        authStore.login(userData, data.token);

        loginSuccess.value = true;
        setTimeout(() => {
          router.push("/dashboard");
        }, 1200);
      } catch (error) {
        backendError.value = error.response?.data?.message || "Google Login failed";
      } finally {
        if (!loginSuccess.value) {
          loading.value = false;
        }
      }
    }
  }
});

const handleSignIn = async () => {
  showGlobalError.value = false;
  backendError.value = "";

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
      ...data.user,
      name: `${data.user.firstName} ${data.user.lastName}`,
    };

    // Save the current session id
    localStorage.setItem("sessionId", data.sessionId);

    // Existing login
    authStore.login(userData, data.token);

    loginSuccess.value = true;
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  } catch (error) {
    backendError.value = error.response?.data?.message || "Login failed";
  } finally {
    if (!loginSuccess.value) {
      loading.value = false;
    }
  }
};

const handleSSOLogin = (provider) => {
  if (provider === "Google") {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "your_google_client_id_here") {
      backendError.value = "Google Client ID is not configured in the frontend .env file.";
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

