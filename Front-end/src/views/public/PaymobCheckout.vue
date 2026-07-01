<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50/50 to-primary/[0.02] dark:from-slate-950 dark:to-slate-900">
    <div
      class="w-full max-w-[560px] rounded-[32px] bg-white/85 dark:bg-slate-900/85 border border-white/80 dark:border-slate-800/80 backdrop-blur-[20px] shadow-glass p-6 sm:p-8 transition-all duration-500 relative"
    >
      <!-- Header -->
      <div class="flex items-center gap-3 pb-6 border-b border-black/5 dark:border-white/5 mb-6">
        <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <h2 class="font-header font-bold text-lg text-brand-dark dark:text-slate-200">Checkout</h2>
          <p class="text-xs text-brand-slate">Complete your payment to activate the plan</p>
        </div>
        <div class="ml-auto flex items-center gap-1.5 text-[11px] text-brand-slate font-body bg-black/[0.03] dark:bg-white/[0.03] px-3 py-1.5 rounded-full">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Secured</span>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="rounded-[20px] bg-gradient-to-br from-primary/[0.04] to-primary/[0.01] border border-primary/10 p-5 mb-6">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-black/5 dark:border-white/5 flex items-center justify-center text-brand-dark dark:text-slate-200 font-header font-bold text-xs shadow-sm">
              SM
            </div>
            <div>
              <p class="font-semibold text-brand-dark dark:text-slate-200 text-sm">Professional Plan</p>
              <p class="text-[11px] text-brand-slate">{{ isAnnual ? 'Billed annually' : 'Billed monthly' }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-header font-bold text-xl text-brand-dark dark:text-slate-200">{{ isAnnual ? '$276' : '$29' }}</p>
            <p v-if="isAnnual" class="text-[10px] text-secondary font-semibold">Save $72/yr</p>
          </div>
        </div>
        <div v-if="isAnnual" class="text-[11px] text-brand-slate bg-white/50 dark:bg-slate-800/50 rounded-xl px-3 py-2">
          $29/mo &times; 12 months = $348 &mdash; 20% discount applied
        </div>
      </div>

      <!-- Payment Method Tabs -->
      <div class="flex gap-2 mb-6 bg-black/[0.03] dark:bg-white/[0.03] rounded-2xl p-1.5">
        <button
          @click="selectedMethod = 'card'"
          class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[11px] font-bold font-header tracking-wide transition-all duration-300 cursor-pointer"
          :class="selectedMethod === 'card' ? 'bg-white dark:bg-slate-800 text-brand-dark dark:text-slate-200 shadow-sm' : 'text-brand-slate hover:text-brand-dark dark:hover:text-slate-200'"
        >
          <PhCreditCard :size="15" />
          Card
        </button>
        <button
          @click="selectedMethod = 'applepay'"
          class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-[11px] font-bold font-header tracking-wide transition-all duration-300 cursor-pointer"
          :class="selectedMethod === 'applepay' ? 'bg-white dark:bg-slate-800 text-brand-dark dark:text-slate-200 shadow-sm' : 'text-brand-slate hover:text-brand-dark dark:hover:text-slate-200'"
        >
          <img :src="appleIcon" class="h-[11px] w-auto" alt="Apple Pay" />
          <span class="leading-none">Apple Pay</span>
        </button>
      </div>

      <!-- Credit Card Form -->
      <form v-if="selectedMethod === 'card'" @submit.prevent="handlePayment" class="flex flex-col gap-4">
        <div class="relative">
          <label class="text-[11px] font-bold font-header tracking-wide text-brand-dark dark:text-slate-200 mb-1.5 block">Card Number</label>
          <div class="relative">
            <input
              v-model="cardNumber"
              @input="formatCardNumber"
              maxlength="19"
              placeholder="4242 4242 4242 4242"
              class="w-full px-4 py-3 rounded-xl border bg-white/60 dark:bg-white/5 text-brand-dark dark:text-slate-200 dark:placeholder-slate-500 text-sm outline-none transition-all"
              :class="errors.cardNumber ? 'border-red-300' : 'border-black/10 dark:border-white/10 focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.1)]'"
            />
          </div>
          <p v-if="errors.cardNumber" class="text-red-500 text-[11px] mt-1 font-body">{{ errors.cardNumber }}</p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[11px] font-bold font-header tracking-wide text-brand-dark dark:text-slate-200 mb-1.5 block">Expiry</label>
            <input
              v-model="expiry"
              @input="formatExpiry"
              maxlength="5"
              placeholder="MM/YY"
              class="w-full px-4 py-3 rounded-xl border bg-white/60 dark:bg-white/5 text-brand-dark dark:text-slate-200 dark:placeholder-slate-500 text-sm outline-none transition-all"
              :class="errors.expiry ? 'border-red-300' : 'border-black/10 dark:border-white/10 focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.1)]'"
            />
            <p v-if="errors.expiry" class="text-red-500 text-[11px] mt-1 font-body">{{ errors.expiry }}</p>
          </div>
          <div>
            <label class="text-[11px] font-bold font-header tracking-wide text-brand-dark dark:text-slate-200 mb-1.5 block">CVV</label>
            <input
              v-model="cvv"
              @input="formatCvv"
              maxlength="4"
              placeholder="123"
              class="w-full px-4 py-3 rounded-xl border bg-white/60 dark:bg-white/5 text-brand-dark dark:text-slate-200 dark:placeholder-slate-500 text-sm outline-none transition-all"
              :class="errors.cvv ? 'border-red-300' : 'border-black/10 dark:border-white/10 focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.1)]'"
            />
            <p v-if="errors.cvv" class="text-red-500 text-[11px] mt-1 font-body">{{ errors.cvv }}</p>
          </div>
        </div>

        <div>
          <label class="text-[11px] font-bold font-header tracking-wide text-brand-dark dark:text-slate-200 mb-1.5 block">Cardholder Name</label>
          <input
            v-model="name"
            placeholder="John Doe"
            class="w-full px-4 py-3 rounded-xl border bg-white/60 dark:bg-white/5 text-brand-dark dark:text-slate-200 dark:placeholder-slate-500 text-sm outline-none transition-all"
            :class="errors.name ? 'border-red-300' : 'border-black/10 dark:border-white/10 focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.1)]'"
          />
          <p v-if="errors.name" class="text-red-500 text-[11px] mt-1 font-body">{{ errors.name }}</p>
        </div>

        <Button type="submit" variant="primary" class="w-full !text-sm !py-3.5 mt-2">
          <PhLock :size="16" weight="bold" />
          Pay {{ isAnnual ? "$276" : "$29" }}
        </Button>

        <div class="flex items-center justify-center gap-4 mt-3">
          <img :src="visaIcon" class="h-6 w-auto opacity-60 hover:opacity-80 transition-opacity" alt="Visa" />
          <img :src="mastercardIcon" class="h-6 w-auto opacity-60 hover:opacity-80 transition-opacity" alt="Mastercard" />
          <img :src="amexIcon" class="h-6 w-auto opacity-60 hover:opacity-80 transition-opacity" alt="Amex" />
          <img :src="paypalIcon" class="h-6 w-auto opacity-60 hover:opacity-80 transition-opacity" alt="PayPal" />
        </div>
      </form>

      <!-- Apple Pay -->
      <div v-else-if="selectedMethod === 'applepay'" class="flex flex-col gap-6">
        <div class="rounded-[20px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 p-8 text-center">
          <div class="w-16 h-16 rounded-2xl bg-black dark:bg-white flex items-center justify-center mx-auto mb-4">
            <img :src="appleIcon" class="h-8 w-auto invert dark:invert-0" alt="Apple" />
          </div>
          <h3 class="font-header font-bold text-xl text-brand-dark dark:text-slate-200 mb-2">Apple Pay</h3>
          <p class="text-sm text-brand-slate mb-6">Fast, secure, and contactless payment</p>

          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-2 rounded-xl">
              <PhCheckCircle :size="14" weight="fill" class="text-emerald-500" />
              <span class="text-xs text-brand-dark dark:text-slate-200 font-semibold">Touch ID</span>
            </div>
            <div class="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-2 rounded-xl">
              <PhCheckCircle :size="14" weight="fill" class="text-emerald-500" />
              <span class="text-xs text-brand-dark dark:text-slate-200 font-semibold">Face ID</span>
            </div>
          </div>

          <button
            @click="handlePayment"
            class="w-full py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-header font-bold text-sm tracking-wide hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <img :src="appleIcon" class="h-5 w-auto invert dark:invert-0" alt="Apple" />
            Pay {{ isAnnual ? "$276" : "$29" }} with Apple Pay
          </button>
        </div>
      </div>

      <!-- Secure Footer -->
      <div class="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-black/5 dark:border-white/5 text-[10px] text-brand-slate font-body">
        <span class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          256-bit SSL
        </span>
        <span class="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10"></span>
        <span>PCI Compliant</span>
        <span class="w-1 h-1 rounded-full bg-black/10 dark:bg-white/10"></span>
        <span>Secure Checkout</span>
      </div>

      <!-- Success Overlay -->
      <Transition name="success">
        <div
          v-if="showSuccess"
          class="absolute inset-0 rounded-[32px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 z-10"
        >
          <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <PhCheckCircle :size="32" weight="fill" class="text-emerald-500" />
          </div>
          <h3 class="font-header font-bold text-xl text-brand-dark dark:text-slate-200 mb-2">Payment Successful!</h3>
          <p class="text-brand-slate text-sm text-center mb-6 max-w-[280px]">
            Your Professional plan has been activated{{ isAnnual ? ' and you\'ll be billed $276 annually' : ' and you\'ll be billed $29 monthly' }}. You can now enjoy unlimited Smart Meetings.
          </p>
          <Button variant="primary" @click="goHome">Go to Home</Button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { PhLock, PhCheckCircle, PhCreditCard } from "@phosphor-icons/vue";
import Button from "@/components/ui/Button.vue";
import { useAuthStore } from "@/stores/auth";
import visaIcon from "@/assets/visa.png";
import mastercardIcon from "@/assets/mastercard.png";
import amexIcon from "@/assets/amex.png";
import paypalIcon from "@/assets/paypal.png";
import appleIcon from "@/assets/Apple_logo_black.svg";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const isAnnual = ref(route.query.billing === "annual");
const showSuccess = ref(false);
const selectedMethod = ref("card");

const cardNumber = ref("");
const expiry = ref("");
const cvv = ref("");
const name = ref("");

const errors = ref({
  cardNumber: "",
  expiry: "",
  cvv: "",
  name: "",
});

const formatCardNumber = () => {
  let digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
  let formatted = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += " ";
    formatted += digits[i];
  }
  cardNumber.value = formatted;
  errors.value.cardNumber = "";
};

const formatExpiry = () => {
  let digits = expiry.value.replace(/\D/g, "").slice(0, 4);
  if (digits.length === 0) {
    expiry.value = "";
    return;
  }
  let formatted = digits;
  if (digits.length >= 3) {
    formatted = digits.slice(0, 2) + "/" + digits.slice(2);
  }
  expiry.value = formatted;
  errors.value.expiry = "";
};

const formatCvv = () => {
  cvv.value = cvv.value.replace(/\D/g, "").slice(0, 4);
  errors.value.cvv = "";
};

const clearErrors = () => {
  errors.value = { cardNumber: "", expiry: "", cvv: "", name: "" };
};

const validateCard = () => {
  clearErrors();
  let valid = true;

  if (!name.value.trim()) {
    errors.value.name = "Cardholder name is required";
    valid = false;
  }

  const cardDigits = cardNumber.value.replace(/\s/g, "");
  if (!cardDigits || cardDigits.length < 16) {
    errors.value.cardNumber = "Enter a valid 16-digit card number";
    valid = false;
  }

  const expDigits = expiry.value.replace("/", "");
  if (expDigits.length < 4) {
    errors.value.expiry = "Enter a valid expiry (MM/YY)";
    valid = false;
  } else {
    const month = parseInt(expDigits.slice(0, 2), 10);
    const year = parseInt("20" + expDigits.slice(2), 10);
    if (month < 1 || month > 12) {
      errors.value.expiry = "Invalid month";
      valid = false;
    } else {
      const now = new Date();
      const expDate = new Date(year, month);
      if (expDate < now) {
        errors.value.expiry = "Card is expired";
        valid = false;
      }
    }
  }

  if (!cvv.value || cvv.value.length < 3 || cvv.value.length > 4) {
    errors.value.cvv = "Enter a valid CVV (3-4 digits)";
    valid = false;
  }

  return valid;
};

const handlePayment = () => {
  if (selectedMethod.value === "card" && !validateCard()) return;
  const planLabel = isAnnual.value ? "Professional (Annual)" : "Professional (Monthly)";
  authStore.updateUser({ plan: planLabel });
  showSuccess.value = true;
};

const goHome = () => {
  router.push("/");
};
</script>

<style scoped>
.success-enter-active,
.success-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.success-enter-from,
.success-leave-to {
  opacity: 0;
  transform: scale(0.92);
}
</style>
