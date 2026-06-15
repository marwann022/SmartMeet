<template>
  <div class="flex flex-col gap-16 pb-20 pt-4 text-left">
    <!-- ═══════════════ HERO ═══════════════ -->
    <section ref="heroRef" :class="['flex flex-col items-center gap-6 pt-10 text-center transition-all duration-700', heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
      <!-- Animated badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary font-header font-bold text-xs tracking-wide animate-pulse-soft">
        <PhSparkle :size="14" weight="fill" class="animate-spin-slow" />
        Transparent Pricing
      </div>

      <h1 class="font-header font-bold text-4xl sm:text-5xl text-brand-dark leading-tight max-w-2xl">
        Cognitive Precision for<br />Every Enterprise Scale
      </h1>

      <p class="text-brand-slate text-base max-w-[560px] leading-relaxed">
        Unlock the full potential of your workspace with AI-driven insights,
        automated transcription, and elite security compliance.
      </p>

      <!-- Billing Toggle -->
      <div class="flex items-center gap-4 pt-2">
        <span :class="['text-sm font-semibold font-body transition-all duration-300', !isAnnual ? 'text-brand-dark scale-105' : 'text-brand-slate']">Monthly</span>

        <button
          id="billing-toggle"
          @click="toggleBilling"
          :class="['relative w-[44px] h-[24px] rounded-full transition-all duration-400 focus:outline-none shadow-inner', isAnnual ? 'bg-primary shadow-[0_0_12px_rgba(75,104,255,0.4)]' : 'bg-black/15']"
          :aria-pressed="isAnnual"
          aria-label="Toggle annual billing"
        >
          <span :class="['absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow-md transition-all duration-300', isAnnual ? 'left-[22px]' : 'left-[2px]']"></span>
        </button>

        <span :class="['text-sm font-semibold font-body transition-all duration-300', isAnnual ? 'text-brand-dark scale-105' : 'text-brand-slate']">Annually</span>

        <div :class="['px-3 py-1 rounded-full border text-[11px] font-bold font-header tracking-wide transition-all duration-500', isAnnual ? 'bg-secondary/15 border-secondary/35 text-secondary scale-110 shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'bg-secondary/10 border-secondary/25 text-secondary']">
          20% OFF
        </div>
      </div>
    </section>

    <!-- ═══════════════ PRICING CARDS ═══════════════ -->
    <section ref="cardsRef" class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
      <!-- Starter -->
      <div :class="['flex flex-col rounded-[28px] p-8 bg-glass-bg border border-white/70 shadow-glass backdrop-blur-glass transition-all duration-500 hover:border-white/95 hover:shadow-card-hover hover:-translate-y-1 group',
        cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
        style="transition-delay: 0ms"
      >
        <div class="flex flex-col gap-1.5 pb-7">
          <h2 class="font-header font-bold text-xl text-brand-dark">Starter</h2>
          <p class="text-brand-slate text-sm">Essential intelligence for individuals.</p>
        </div>

        <div class="flex items-end gap-1 pb-7 overflow-hidden">
          <span class="font-header font-bold text-5xl text-brand-dark">$0</span>
          <span class="text-brand-slate text-sm mb-2 font-body">/month</span>
        </div>

        <div class="h-[1px] w-full bg-black/5 mb-7"></div>

        <ul class="flex flex-col gap-3.5 flex-1 pb-8">
          <li v-for="(feature, fi) in starterFeatures" :key="feature"
            :class="['flex items-center gap-3 transition-all duration-300', cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4']"
            :style="`transition-delay: ${fi * 60 + 100}ms`"
          >
            <span class="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 shrink-0 group-hover:bg-primary/15 transition-colors duration-300">
              <PhCheck :size="11" weight="bold" class="text-primary" />
            </span>
            <span class="text-brand-slate text-sm font-body">{{ feature }}</span>
          </li>
        </ul>

        <Button
          variant="glass"
          class="w-full"
          @click="$router.push('/signup')"
        >
          Start for Free
        </Button>
      </div>

      <!-- Professional (Recommended) -->
      <div :class="['relative flex flex-col rounded-[28px] p-8 bg-white/85 border border-primary/20 shadow-[0_20px_60px_rgba(75,104,255,0.12),0_1px_2px_rgba(255,255,255,0.7)_inset] backdrop-blur-glass transition-all duration-500 hover:shadow-[0_28px_70px_rgba(75,104,255,0.22)] hover:-translate-y-2 lg:scale-[1.04] lg:-mt-2 lg:-mb-2',
        cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
        style="transition-delay: 100ms"
      >
        <!-- Animated shimmer top bar -->
        <div class="absolute top-0 left-8 right-8 h-[3px] rounded-b-full bg-grad-primary opacity-80 overflow-hidden">
          <div class="absolute inset-0 bg-white/40 animate-shimmer"></div>
        </div>

        <!-- Pulsing Recommended badge -->
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-grad-primary shadow-[0_4px_15px_rgba(75,104,255,0.35)] animate-badge-pulse">
          <span class="font-header font-extrabold text-[10px] text-white tracking-widest uppercase whitespace-nowrap">✦ Recommended</span>
        </div>

        <div class="flex flex-col gap-1.5 pb-7 pt-2">
          <h2 class="font-header font-bold text-xl text-brand-dark">Professional</h2>
          <p class="text-brand-slate text-sm">For teams scaling their output.</p>
        </div>

        <!-- Animated price flip -->
        <div class="flex items-end gap-1 pb-1 overflow-hidden">
          <div class="relative overflow-hidden h-14 flex items-end">
            <Transition name="price-flip">
              <span :key="isAnnual ? 'annual' : 'monthly'" class="font-header font-bold text-5xl text-brand-dark block">
                {{ isAnnual ? '$23' : '$29' }}
              </span>
            </Transition>
          </div>
          <span class="text-brand-slate text-sm mb-2 font-body">/user /mo</span>
        </div>

        <Transition name="fade-quick">
          <div v-if="isAnnual" class="mb-5 text-xs text-secondary font-bold font-body">billed annually — save 20% 🎉</div>
          <div v-else class="mb-5 text-xs text-transparent select-none">placeholder</div>
        </Transition>

        <div class="h-[1px] w-full bg-primary/8 mb-7"></div>

        <ul class="flex flex-col gap-3.5 flex-1 pb-8">
          <li v-for="(feature, fi) in proFeatures" :key="feature"
            :class="['flex items-center gap-3 transition-all duration-300', cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4']"
            :style="`transition-delay: ${fi * 60 + 200}ms`"
          >
            <span class="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 shrink-0">
              <PhCheck :size="11" weight="bold" class="text-primary" />
            </span>
            <span class="text-brand-dark text-sm font-body font-semibold">{{ feature }}</span>
          </li>
        </ul>

        <Button
          variant="primary"
          class="w-full"
          @click="$router.push('/signup')"
        >
          Start Pro Trial
        </Button>
      </div>

      <!-- Enterprise -->
      <div :class="['flex flex-col rounded-[28px] p-8 bg-glass-bg border border-white/70 shadow-glass backdrop-blur-glass transition-all duration-500 hover:border-white/95 hover:shadow-card-hover hover:-translate-y-1 group',
        cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
        style="transition-delay: 200ms"
      >
        <div class="flex flex-col gap-1.5 pb-7">
          <h2 class="font-header font-bold text-xl text-brand-dark">Enterprise</h2>
          <p class="text-brand-slate text-sm">Maximum security and compliance.</p>
        </div>

        <div class="flex items-end gap-2 pb-7">
          <span class="font-header font-bold text-5xl text-brand-dark">Custom</span>
        </div>

        <div class="h-[1px] w-full bg-black/5 mb-7"></div>

        <ul class="flex flex-col gap-3.5 flex-1 pb-8">
          <li v-for="(feature, fi) in enterpriseFeatures" :key="feature"
            :class="['flex items-center gap-3 transition-all duration-300', cardsVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4']"
            :style="`transition-delay: ${fi * 60 + 300}ms`"
          >
            <span class="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 shrink-0 group-hover:bg-primary/15 transition-colors duration-300">
              <PhCheck :size="11" weight="bold" class="text-primary" />
            </span>
            <span class="text-brand-slate text-sm font-body">{{ feature }}</span>
          </li>
        </ul>

        <Button
          variant="outline"
          class="w-full border-primary/25 !text-primary hover:bg-primary/5"
          @click="contactSales"
        >
          Contact Sales
        </Button>
      </div>
    </section>

    <!-- ═══════════════ FEATURE COMPARISON TABLE ═══════════════ -->
    <section ref="tableRef" id="feature-breakdown" :class="['flex flex-col gap-8 transition-all duration-700', tableVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
      <div class="text-center">
        <h2 class="font-header font-bold text-3xl text-brand-dark">Feature Breakdown</h2>
        <p class="text-brand-slate text-sm mt-2">A clear comparison across all plans</p>
      </div>

      <div class="rounded-[24px] bg-glass-bg border border-white/70 shadow-glass backdrop-blur-glass overflow-hidden">
        <div class="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-black/5">
          <div class="px-6 py-5 font-header font-bold text-xs text-brand-dark uppercase tracking-widest">Feature</div>
          <div class="px-6 py-5 font-header font-bold text-xs text-brand-slate uppercase tracking-widest">Starter</div>
          <div class="px-6 py-5 font-header font-bold text-xs text-primary uppercase tracking-widest">Pro</div>
          <div class="px-6 py-5 font-header font-bold text-xs text-brand-slate uppercase tracking-widest">Enterprise</div>
        </div>

        <template v-for="(row, i) in comparisonTable" :key="i">
          <div v-if="row.category" class="grid grid-cols-[2fr_1fr_1fr_1fr] border-t border-black/5 bg-primary/[0.03]">
            <div class="px-6 py-3 col-span-4 font-header font-extrabold text-[10px] text-primary tracking-[0.15em] uppercase">
              {{ row.label }}
            </div>
          </div>
          <div v-else
            :class="['grid grid-cols-[2fr_1fr_1fr_1fr] border-t border-black/[0.04] transition-all duration-300 hover:bg-primary/[0.025] cursor-default',
              tableVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4',
              i % 2 !== 0 ? 'bg-black/[0.015]' : '']"
            :style="`transition-delay: ${i * 50 + 100}ms`"
          >
            <div class="px-6 py-4 font-body text-sm text-brand-dark">{{ row.label }}</div>
            <div class="px-6 py-4 flex items-center"><FeatureCell :value="row.starter" /></div>
            <div class="px-6 py-4 flex items-center"><FeatureCell :value="row.pro" /></div>
            <div class="px-6 py-4 flex items-center"><FeatureCell :value="row.enterprise" /></div>
          </div>
        </template>
      </div>
    </section>

    <!-- ═══════════════ FAQ ═══════════════ -->
    <section ref="faqRef" :class="['flex flex-col gap-8 max-w-3xl mx-auto w-full transition-all duration-700', faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
      <div class="text-center">
        <h2 class="font-header font-bold text-3xl text-brand-dark">Frequently Asked Questions</h2>
      </div>

      <div class="flex flex-col gap-3">
        <div
          v-for="(faq, i) in faqs" :key="i"
          :class="['rounded-[20px] bg-glass-bg border border-white/70 shadow-glass backdrop-blur-glass overflow-hidden transition-all duration-300 hover:border-white/95 hover:shadow-card-hover',
            faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4']"
          :style="`transition-delay: ${i * 80}ms`"
        >
          <button
            :id="`faq-${i}`"
            @click="toggleFaq(i)"
            class="w-full flex items-center justify-between px-7 py-5 text-left cursor-pointer group"
            :aria-expanded="openFaq === i"
          >
            <span :class="['font-header font-bold text-sm pr-4 transition-colors duration-200', openFaq === i ? 'text-primary' : 'text-brand-dark']">{{ faq.q }}</span>
            <PhCaretDown
              :size="18" weight="bold"
              :class="['transition-all duration-300 shrink-0', openFaq === i ? 'rotate-180 text-primary' : 'text-brand-slate group-hover:text-primary']"
            />
          </button>

          <Transition name="faq-expand">
            <div v-if="openFaq === i" class="px-7 pb-5">
              <div class="text-brand-slate text-sm leading-relaxed font-body border-t border-black/5 pt-4">
                {{ faq.a }}
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, defineComponent, h } from 'vue'
import { PhCheck, PhMinus, PhCaretDown, PhSparkle } from '@phosphor-icons/vue'
import Button from '@/components/ui/Button.vue'

// Billing toggle
const isAnnual = ref(false)
const toggleBilling = () => { isAnnual.value = !isAnnual.value }

// FAQ accordion
const openFaq = ref(null)
const toggleFaq = (i) => { openFaq.value = openFaq.value === i ? null : i }

// Scroll reveal
const heroRef   = ref(null)
const cardsRef  = ref(null)
const tableRef  = ref(null)
const faqRef    = ref(null)

const heroVisible  = ref(false)
const cardsVisible = ref(false)
const tableVisible = ref(false)
const faqVisible   = ref(false)

const observe = (el, visibleRef, threshold = 0.15) => {
  if (!el) return
  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) { visibleRef.value = true; io.disconnect() }
  }, { threshold })
  io.observe(el)
}

onMounted(() => {
  setTimeout(() => { heroVisible.value = true }, 80)
  setTimeout(() => { cardsVisible.value = true }, 220)
  observe(tableRef.value, tableVisible)
  observe(faqRef.value,   faqVisible)
})

// Sub-component
const FeatureCell = defineComponent({
  name: 'FeatureCell',
  props: { value: [Boolean, String] },
  setup(props) {
    return () => {
      if (props.value === true)
        return h('span', { class: 'flex items-center justify-center w-5 h-5 rounded-full bg-primary/10' },
          [h(PhCheck, { size: 11, weight: 'bold', class: 'text-primary' })])
      if (props.value === false)
        return h(PhMinus, { size: 18, weight: 'bold', class: 'text-black/15' })
      return h('span', { class: 'text-brand-dark text-sm font-body font-semibold' }, props.value)
    }
  }
})

const starterFeatures = [
  '5 AI-Powered Meetings /mo',
  'Live Transcription (90% accuracy)',
  'Standard Search & Filters',
  '7-Day Meeting History',
]
const proFeatures = [
  'Unlimited Smart Meetings',
  'Neural Summary Engine',
  'Multi-language Support (30+)',
  'Custom CRM Integrations',
  'Collaborative Workspaces',
]
const enterpriseFeatures = [
  'SOC2, HIPAA & GDPR Compliance',
  'SSO & Advanced User Provisioning',
  'Dedicated Success Manager',
  'On-premise LLM Deployment',
]
const comparisonTable = [
  { label: 'AI Transcription',   starter: true,      pro: true,          enterprise: true },
  { label: 'Meeting Summaries',  starter: 'Limited', pro: 'Full Engine', enterprise: 'Custom LLM' },
  { label: 'Sentiment Analysis', starter: false,     pro: true,          enterprise: true },
  { category: true, label: 'SECURITY & SCALE' },
  { label: 'Storage',            starter: '10 GB',   pro: '200 GB',      enterprise: 'Unlimited' },
  { label: 'SSO / SAML',        starter: false,     pro: false,         enterprise: true },
  { label: 'Custom API Access',  starter: false,     pro: 'Limited',     enterprise: 'Priority' },
]
const faqs = [
  {
    q: 'Can I change my plan at any time?',
    a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately and we'll prorate billing differences at the next cycle.",
  },
  {
    q: 'What meeting platforms do you support?',
    a: 'SmartMeet AI integrates with Google Meet, Zoom, Microsoft Teams, Webex, and more. Our browser extension works universally across all web-based conferencing tools.',
  },
  {
    q: 'How is my data used to train AI models?',
    a: 'Your data is never used to train AI models without explicit consent. All meeting content is encrypted at rest and in transit. Enterprise customers can opt for on-premise LLM deployment for maximum data sovereignty.',
  },
]

const contactSales = () => {
  window.location.href = "mailto:sales@smartmeet.ai"
}
</script>

<style scoped>
.price-flip-enter-active { animation: price-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.price-flip-leave-active { animation: price-out 0.2s ease-in; position: absolute; }
@keyframes price-in  { from { opacity: 0; transform: translateY(18px) scale(0.85); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes price-out { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-14px); } }

.faq-expand-enter-active { transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1); }
.faq-expand-leave-active { transition: all 0.24s cubic-bezier(0.4, 0, 0.2, 1); }
.faq-expand-enter-from, .faq-expand-leave-to { opacity: 0; transform: translateY(-8px); max-height: 0; }
.faq-expand-enter-to, .faq-expand-leave-from { opacity: 1; transform: translateY(0); max-height: 200px; }

.fade-quick-enter-active, .fade-quick-leave-active { transition: all 0.25s ease; }
.fade-quick-enter-from, .fade-quick-leave-to { opacity: 0; transform: translateY(-4px); }

@keyframes shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
.animate-shimmer { animation: shimmer 2.4s infinite ease-in-out; }

@keyframes badge-pulse {
  0%, 100% { box-shadow: 0 4px 15px rgba(75,104,255,0.35); }
  50%       { box-shadow: 0 4px 22px rgba(75,104,255,0.6); }
}
.animate-badge-pulse { animation: badge-pulse 2.5s ease-in-out infinite; }

@keyframes pulse-soft {
  0%, 100% { box-shadow: 0 0 0 0 rgba(75,104,255,0); }
  50%       { box-shadow: 0 0 0 6px rgba(75,104,255,0.07); }
}
.animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }

@keyframes spin-slow { to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin-slow 6s linear infinite; }
</style>
