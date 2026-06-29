<template>
  <div class="flex flex-col gap-6 animate-fade-in text-left">
    <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6 border border-white/80 shadow-glass">
      <div class="flex items-center gap-3 pb-4 border-b border-black/5">
        <div class="w-10 h-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center text-primary">
          <PhCreditCard :size="20" weight="bold" />
        </div>
        <div class="flex flex-col">
          <h3 class="font-header font-bold text-lg text-brand-dark">Subscription & Billing</h3>
          <p class="text-xs text-brand-slate">Manage your plan and payment details.</p>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <div class="p-5 bg-white/40 border border-black/[0.03] rounded-2xl flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-sm font-bold text-brand-dark">Current Plan</span>
            <span class="text-xs text-brand-slate mt-0.5">
              You're on the <strong>{{ planDisplay }}</strong> plan
            </span>
          </div>
          <div
            class="px-4 py-2 rounded-full text-[11px] font-bold font-header uppercase tracking-wider"
            :class="
              isOnProPlan
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-primary/10 text-primary'
            "
          >
            {{ planDisplay }}
          </div>
        </div>

        <div
          v-if="isOnProPlan"
          class="p-5 bg-white/40 border border-black/[0.03] rounded-2xl flex items-center justify-between"
        >
          <div class="flex flex-col">
            <span class="text-sm font-bold text-brand-dark">Cancel Subscription</span>
            <span class="text-xs text-brand-slate mt-0.5">
              Downgrade back to the Free plan. Your Pro features will be disabled.
            </span>
          </div>
          <Button variant="danger" size="sm" @click="confirmCancel = true">
            Cancel Plan
          </Button>
        </div>

        <div
          v-else
          class="p-5 bg-white/40 border border-black/[0.03] rounded-2xl flex items-center justify-between"
        >
          <div class="flex flex-col">
            <span class="text-sm font-bold text-brand-dark">Upgrade to Pro</span>
            <span class="text-xs text-brand-slate mt-0.5">
              Unlock unlimited Smart Meetings, Neural Summaries, and more.
            </span>
          </div>
          <Button variant="primary" size="sm" @click="$router.push('/pricing')">
            Upgrade
          </Button>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <Transition name="success">
      <div
        v-if="confirmCancel"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
        @click.self="confirmCancel = false"
      >
        <div class="w-full max-w-[400px] rounded-[28px] card-glass p-8 relative">
          <div class="flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <PhWarningCircle :size="28" weight="fill" class="text-red-500" />
            </div>
            <h3 class="font-header font-bold text-lg text-brand-dark mb-2">
              Cancel Subscription?
            </h3>
            <p class="text-brand-slate text-sm mb-6 max-w-[300px]">
              You'll lose access to Pro features and be downgraded to the Free plan.
            </p>
            <div class="flex gap-3 w-full">
              <Button
                variant="outline"
                class="flex-1"
                @click="confirmCancel = false"
              >
                Keep Plan
              </Button>
              <Button
                variant="danger"
                class="flex-1"
                @click="cancelSubscription"
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Cancelled Success -->
    <Transition name="success">
      <div
        v-if="showCancelled"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
        @click.self="showCancelled = false"
      >
        <div class="w-full max-w-[400px] rounded-[28px] card-glass p-8 relative">
          <div class="flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
              <PhCheckCircle :size="28" weight="fill" class="text-amber-500" />
            </div>
            <h3 class="font-header font-bold text-lg text-brand-dark mb-2">
              Subscription Cancelled
            </h3>
            <p class="text-brand-slate text-sm mb-6 max-w-[300px]">
              You're now on the Free plan. You can upgrade again anytime.
            </p>
            <Button variant="primary" class="w-full" @click="showCancelled = false">
              Got it
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { PhCreditCard, PhWarningCircle, PhCheckCircle } from "@phosphor-icons/vue";
import Button from "@/components/ui/Button.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const currentPlan = computed(() => authStore.user?.plan || "Free");
const isOnProPlan = computed(() => currentPlan.value.startsWith("Professional"));
const planDisplay = computed(() => isOnProPlan.value ? "Professional" : currentPlan.value);

const confirmCancel = ref(false);
const showCancelled = ref(false);

const cancelSubscription = () => {
  authStore.updateUser({ plan: "Free" });
  confirmCancel.value = false;
  showCancelled.value = true;
};
</script>
