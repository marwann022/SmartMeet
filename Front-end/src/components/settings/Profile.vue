<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in text-left">
    <!-- Main profile form (Col-8) -->
    <div class="lg:col-span-8 flex flex-col gap-6">
      <div
        class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass"
      >
        <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
          <PhUserCircle :size="20" class="text-primary" />
          <h3 class="font-header font-bold text-lg text-brand-dark">
            Profile Information
          </h3>
        </div>

        <div class="flex flex-col gap-6">
          <!-- Avatar Upload row -->
          <div class="flex items-center gap-5">
            <div
              class="relative w-20 h-20 rounded-full border-2 border-primary overflow-hidden flex-shrink-0 group cursor-pointer shadow-sm"
            >
              <img
                :src="profileForm.avatar"
                alt="Avatar"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity" @click="triggerAvatarUpload"
              >
                <PhCamera :size="18" weight="bold" />
              </div>
            </div>
            <div class="flex flex-col gap-1 items-start">
              <button
                @click="triggerAvatarUpload"
                class="px-4 py-2 rounded-lg bg-primary/8 hover:bg-primary/15 text-primary text-xs font-bold tracking-wide transition-all cursor-pointer"
              >
                Change Photo
              </button>
              <input
  ref="avatarInput"
  type="file"
  accept="image/*"
  class="hidden"
  @change="handleAvatarUpload"
/>
              <span class="text-[10px] text-brand-slate mt-1"
                >Accepts PNG, JPG or SVG. Max 2MB.</span
              >
            </div>
          </div>

          <!-- Form Fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
            <div class="flex flex-col gap-2">
              <label
                class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1"
                >Full Name</label
              >
              <input
                v-model="profileForm.fullName"
                type="text"
                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/50 border border-black/8 dark:border-white/10 font-body text-sm text-brand-dark dark:text-slate-200 focus:outline-none focus:border-primary/30 transition-all"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1"
                >Job Title</label
              >
              <input
                v-model="profileForm.jobTitle"
                type="text"
                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/50 border border-black/8 dark:border-white/10 font-body text-sm text-brand-dark dark:text-slate-200 focus:outline-none focus:border-primary/30 transition-all"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1"
                >Email Address</label
              >
              <input
                v-model="profileForm.email"
                type="email"
                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/50 border border-black/8 dark:border-white/10 font-body text-sm text-brand-dark dark:text-slate-200 focus:outline-none focus:border-primary/30 transition-all"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label
                class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1"
                >Phone Number</label
              >
              <input
                v-model="profileForm.phone"
                type="text"
                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/50 border border-black/8 dark:border-white/10 font-body text-sm text-brand-dark dark:text-slate-200 focus:outline-none focus:border-primary/30 transition-all text-left"
              />
            </div>
            <div class="flex flex-col gap-2 md:col-span-2">
              <label
                class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1"
                >Company</label
              >
              <input
                v-model="profileForm.company"
                type="text"
                class="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900/50 border border-black/8 dark:border-white/10 font-body text-sm text-brand-dark dark:text-slate-200 focus:outline-none focus:border-primary/30 transition-all"
              />
            </div>
          </div>

          <!-- Submit button -->
          <div class="pt-2">
            <button
              @click="saveProfile"
              class="px-6 py-3 rounded-xl bg-grad-primary text-white font-header font-bold text-xs tracking-wider uppercase shadow-[0_4px_15px_rgba(75,104,255,0.2)] hover:shadow-[0_6px_22px_rgba(75,104,255,0.3)] transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      </div>

      <!-- Security settings card -->
      <div
        class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass"
      >
        <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
          <PhLockKey :size="20" class="text-primary" />
          <h3 class="font-header font-bold text-lg text-brand-dark">
            Security Settings
          </h3>
        </div>

        <div class="flex flex-col gap-5">
          <!-- 2FA Toggle -->
          <div
            class="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 rounded-2xl"
          >
            <div class="flex flex-col w-[80%] text-left">
              <span class="text-sm font-bold text-brand-dark leading-tight"
                >Two-Factor Authentication</span
              >
              <span class="text-xs text-brand-slate mt-0.5"
                >Add an extra layer of security to your account</span
              >
            </div>
            <button
              type="button"
              @click="setupTwoFactor"
              class="w-[44px] h-[24px] rounded-full transition-colors duration-300 focus:outline-none relative flex items-center cursor-pointer border border-white/25"
              :class="
                profileForm.twoFactor ? 'bg-primary' : 'bg-brand-slate/30'
              "
            >
              <span
                class="absolute w-[18px] h-[18px] bg-white rounded-full transition-transform duration-300 shadow-sm"
                :style="{
                  transform: profileForm.twoFactor
                    ? 'translateX(22px)'
                    : 'translateX(3px)',
                }"
              ></span>
            </button>
          </div>

          <!-- Change Password Button -->
          <div
            class="flex items-center justify-between p-4 bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 rounded-2xl"
          >
            <div class="flex flex-col text-left">
              <span class="text-sm font-bold text-brand-dark leading-tight"
                >Change Account Password</span
              >
              <span class="text-xs text-brand-slate mt-0.5">
                {{ authStore.user?.googleId 
                  ? "Your account is secured via Google Sign-In. Password management is handled by Google." 
                  : "Ensure your account is protected with strong credentials" }}
              </span>
            </div>
            <button
              v-if="!authStore.user?.googleId"
              @click="handleChangePassword"
              class="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold font-header text-brand-dark dark:text-slate-200 transition-all cursor-pointer"
            >
              Update Password
            </button>
            <button
              v-else
              disabled
              class="px-5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs font-bold font-header text-brand-slate transition-all cursor-not-allowed opacity-60"
            >
              Google Auth
            </button>
          </div>

          <!-- Device Sessions checklist -->
          <div class="flex flex-col gap-3 text-left mt-2">
            <label
              class="font-header font-bold text-[11px] tracking-wider uppercase text-brand-slate ml-1"
              >Active Device Sessions</label
            >

            <div
              v-for="session in sessions"
              :key="session._id"
              class="flex justify-between items-center p-3.5 bg-white/40 dark:bg-slate-900/40 border border-black/[0.03] dark:border-white/5 rounded-2xl"
            >

  <div class="flex items-center gap-3">

    <div
      class="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center text-primary"
    >

      <PhLaptop
        v-if="session.deviceType === 'desktop'"
        :size="20"
      />

      <PhDeviceMobile
        v-else
        :size="20"
      />

    </div>

    <div>

      <div class="font-bold">
        {{ session.device }} - {{ session.os }}
      </div>

      <div class="text-xs text-gray-500">
        {{ session.browser }}
        •
        {{ new Date(session.lastActive).toLocaleString() }}
      </div>

    </div>

  </div>

<div>

  <span
    v-if="session._id === currentSessionId"
    class="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-lg"
  >
    THIS DEVICE
  </span>

  <button
    v-else
    @click="revokeSession(session._id)"
    class="text-red-500 font-bold hover:text-red-700"
  >
    Revoke
  </button>

</div>

</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Details Billing Overview (Col-4) -->
    <div class="lg:col-span-4 flex flex-col gap-6">
      <!-- Billing Overview Card -->
      <div
        class="card-glass rounded-[28px] p-6 flex flex-col gap-5 border border-white/80 shadow-glass"
      >
        <div
          class="flex justify-between items-center pb-3 border-b border-black/5"
        >
          <h3 class="font-header font-bold text-lg text-brand-dark">
            Billing Overview
          </h3>
          <span
            class="text-[9px] font-extrabold px-2.5 py-0.5 rounded-md border border-[#acedff]/30 bg-[#acedff]/10 text-primary uppercase"
          >
            Pro Plan
          </span>
        </div>

        <div class="flex flex-col gap-4 text-left">
          <div class="flex justify-between items-baseline">
            <span class="text-xs font-semibold text-brand-slate"
              >Monthly Total</span
            >
            <span class="text-xl font-bold font-header text-brand-dark"
              >$149.00</span
            >
          </div>

          <div
            class="flex justify-between items-center text-xs text-brand-slate font-medium pt-2 border-t border-black/5"
          >
            <div class="flex items-center gap-1.5">
              <PhCalendar :size="14" class="text-primary" />
              <span>Renewal Date</span>
            </div>
            <span class="font-semibold text-brand-dark">Oct 12, 2026</span>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col gap-2 mt-2">
            <button
              @click="$router.push('/pricing')"
              class="w-full py-3 rounded-xl bg-grad-primary text-white text-xs font-bold font-header tracking-wide hover:shadow-md active:scale-98 transition-all cursor-pointer"
            >
              Upgrade to Enterprise
            </button>
            <button
              @click="$router.push('/pricing')"
              class="w-full py-3 rounded-xl bg-white border border-black/8 text-xs font-bold font-header text-brand-slate hover:bg-black/5 transition-all cursor-pointer"
            >
              Manage Subscription
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>

  <PasswordChangeModal
    :show="showPasswordModal"
    @close="showPasswordModal = false"
  />

  <Modal
  :show="showTwoFactorModal"
  title="Setup Two-Factor Authentication"
  @close="showTwoFactorModal = false"
>
  <div class="flex flex-col gap-4">

    <img
      :src="qrCode"
      class="w-64 mx-auto"
    />

    <input
      v-model="verificationCode"
      type="text"
      placeholder="Enter 6 digit code"
      class="border rounded-xl p-3"
    />

    <button
      @click="verifyTwoFactor"
      class="bg-primary text-white rounded-xl py-3"
    >
      Verify
    </button>

  </div>
</Modal>

  <Toast />
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";import {
  PhUserCircle,
  PhCamera,
  PhLockKey,
  PhLaptop,
  PhDeviceMobile,
  PhCalendar,
} from "@phosphor-icons/vue";
import PasswordChangeModal from "./PasswordChangeModal.vue";
import Toast from "../ui/Toast.vue";
import { useToasts } from "../../composables/useToasts";
// Import assets
import axios from "axios"
import { useAuthStore } from "@/stores/auth";
import Modal from "../ui/Modal.vue";



const verifyTwoFactor = async () => {

  try {

    const token =
      localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/users/2fa/verify",
      {
        token:
          verificationCode.value
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`
        }
      }
    );

    profileForm.twoFactor = true;

    success(
      "Two-Factor Authentication Enabled"
    );

    showTwoFactorModal.value =
      false;

  } catch (err) {

    error(
      err.response?.data?.message ||
      "Invalid code"
    );

  }

};


const authStore = useAuthStore();

// Master factory default values configuration
const DEFAULT_PROFILE = {
  avatar: "",
  fullName: "Alexander Sterling",
  jobTitle: "Principal Product Architect",
  email: "alex.sterling@quantum-dynamics.io",
  phone: "+1 (555) 892-4410",
  company: "Quantum Dynamics Global",
  twoFactor: false,
};

// Core states matching layout structures
const profileForm = reactive({ ...DEFAULT_PROFILE });

const loadProfile = async () => {
  try {

    const token = localStorage.getItem("token");

    const { data } = await axios.get(
      "http://localhost:5000/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    profileForm.fullName =
      `${data.user.firstName} ${data.user.lastName}`;

    profileForm.email =
      data.user.email;

    profileForm.phone =
      data.user.phone || "";

    profileForm.company =
      data.user.company || "";

    profileForm.jobTitle =
      data.user.jobTitle || "";

    profileForm.twoFactor =
      data.user.twoFactor || false;
    if (data.user.avatar) {
  profileForm.avatar =
    `http://localhost:5000/uploads/${data.user.avatar}`;
} else {
  profileForm.avatar =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      `${data.user.firstName} ${data.user.lastName}`
    )}&background=4B68FF&color=ffffff`;
}

  } catch (err) {

  console.error("Load Profile Error:", err);

  authStore.logout();

  window.location.href = "/signin";

}
};

const showTwoFactorModal = ref(false);
const showPasswordModal = ref(false);

const qrCode = ref("");

const verificationCode = ref("");
const sessions = ref([]);

const currentSessionId = ref(
  localStorage.getItem("sessionId")
);


watch(sessions, () => {
    console.log("Vue Sessions Updated");
    console.log(sessions.value);
});

const avatarInput = ref(null);
const { success, error, info } = useToasts();







const loadSessions = async () => {

    try {

        const token = localStorage.getItem("token");

        const { data } = await axios.get(
            "http://localhost:5000/api/users/sessions",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        sessions.value = data.sessions;

console.log("Sessions Count:", sessions.value.length);
console.table(sessions.value);

        console.log("Loaded Sessions:", sessions.value);

    } catch (err) {

        console.error(err);

    }

};

// --- Unified Persistence Logic Layer ---

// Hydrates the state cleanly from localStorage on startup


// Serializes and commits state snapshot directly onto disk


// Auto-save runtime processing layer with performance safe debouncing (400ms)


// Run early initialization to hydrate state cleanly before view mounting renders

onMounted(async () => {
  await loadProfile();
  await loadSessions();
});

// --- Explicit Event Actions ---


const setupTwoFactor = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const { data } =
      await axios.post(
        "http://localhost:5000/api/users/2fa/setup",
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    qrCode.value =
      data.qrCode;

    showTwoFactorModal.value =
      true;

  } catch (err) {

    console.error(err);

    error(
      "Failed to setup 2FA"
    );

  }

};



const saveProfile = async () => {

  try {

    const token =
      localStorage.getItem("token");

    const names =
      profileForm.fullName.trim().split(" ");

    const firstName = names[0];

    const lastName =
      names.length > 1
        ? names.slice(1).join(" ")
        : "";

    await axios.put(
      "http://localhost:5000/api/users/profile",
      {
        firstName,
        lastName,
        phone: profileForm.phone,
        company: profileForm.company,
        jobTitle: profileForm.jobTitle,
        twoFactor: profileForm.twoFactor
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    authStore.updateUser({
      name: profileForm.fullName
    });

    await loadProfile();

    success(
      "Profile Updated Successfully"
    );

  } catch (err) {

    console.error(err);

    error(
      "Failed To Update Profile"
    );

  }
};




const handleAvatarUpload = async (event) => {

  try {

    const file = event.target.files[0]

    if (!file) return

    const token =
      localStorage.getItem("token")

    const formData = new FormData()

    formData.append(
      "avatar",
      file
    )

    const { data } =
      await axios.post(
        "http://localhost:5000/api/users/avatar",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )

    profileForm.avatar =
  `http://localhost:5000/uploads/${data.avatar}`;

authStore.updateUser({
  avatar: data.avatar
});

success("Avatar Updated Successfully");

  } catch (error) {

    console.error(error)

  }
}

const handleChangePassword = () => {
  showPasswordModal.value = true;
};

const revokeSession = async (id) => {

  try {

    const token = localStorage.getItem("token");

    await axios.delete(
      `http://localhost:5000/api/users/sessions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    sessions.value =
      sessions.value.filter(s => s._id !== id);

    success("Session revoked");

  } catch (err) {

    console.error(err);

    error("Failed to revoke session");

  }

};

const handleUpgrade = () => {
  info("Redirecting to the Enterprise quotation billing portal.");
};

const handleManageSub = () => {
  info("Redirecting to the subscription billing portal.");
};

const triggerAvatarUpload = () => {
  avatarInput.value.click();
};
</script>
