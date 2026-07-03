<template>
  <div class="flex flex-col gap-16 pt-4 text-left">
    <!-- ═══════════════ HERO ═══════════════ -->
    <section
      ref="heroRef"
      :class="[
        'flex flex-col items-center gap-6 pt-10 text-center transition-all duration-700',
        heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      ]"
    >
      <!-- Animated badge -->
      <div
        class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/15 text-primary font-header font-bold text-xs tracking-wide animate-pulse-soft"
      >
        <PhSparkle :size="14" weight="fill" class="animate-spin-slow" />
        Transparent Pricing
      </div>

      <h1
        class="font-header font-bold text-4xl sm:text-5xl text-brand-dark leading-tight max-w-2xl"
      >
        Cognitive Precision for<br />Every Enterprise Scale
      </h1>

      <p class="text-brand-slate text-base max-w-[560px] leading-relaxed">
        Unlock the full potential of your workspace with AI-driven insights,
        automated transcription, and elite security compliance.
      </p>

      <!-- Billing Toggle -->
      <div class="flex items-center gap-4 pt-2">
        <span
          :class="[
            'text-sm font-semibold font-body transition-all duration-300',
            !isAnnual ? 'text-brand-dark scale-105' : 'text-brand-slate',
          ]"
          >Monthly</span
        >

        <button
          id="billing-toggle"
          @click="toggleBilling"
          :class="[
            'relative w-[44px] h-[24px] border border-primary/20 rounded-full transition-all duration-400 focus:outline-none shadow-inner',
            isAnnual
              ? 'bg-primary shadow-[0_0_12px_rgba(75,104,255,0.4)]'
              : 'bg-black/15',
          ]"
          :aria-pressed="isAnnual"
          aria-label="Toggle annual billing"
        >
          <span
            :class="[
              'absolute top-[1px] w-[20px] h-[20px] bg-white rounded-full shadow-md transition-all duration-300',
              isAnnual ? 'left-[21px]' : 'left-[1px]',
            ]"
          ></span>
        </button>

        <span
          :class="[
            'text-sm font-semibold font-body transition-all duration-300',
            isAnnual ? 'text-brand-dark scale-105' : 'text-brand-slate',
          ]"
          >Annually</span
        >

        <div
          :class="[
            'px-3 py-1 rounded-full border text-[11px] font-bold font-header tracking-wide transition-all duration-500',
            isAnnual
              ? 'bg-secondary/15 border-secondary/35 text-secondary scale-110 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
              : 'bg-secondary/10 border-secondary/25 text-secondary',
          ]"
        >
          20% OFF
        </div>
      </div>

      <div class="flex flex-wrap justify-center gap-8 py-4">
        <div class="text-center">
          <p class="text-3xl font-bold text-brand-dark">2,500+</p>
          <p class="text-sm text-brand-slate">Teams</p>
        </div>

        <div class="text-center">
          <p class="text-3xl font-bold text-brand-dark">40K+</p>
          <p class="text-sm text-brand-slate">Meetings</p>
        </div>

        <div class="text-center">
          <p class="text-3xl font-bold text-brand-dark">120K+</p>
          <p class="text-sm text-brand-slate">Actions Generated</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════ PRICING CARDS ═══════════════ -->
    <section
      ref="cardsRef"
      class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
    >
      <!-- Starter -->
      <!-- Starter -->
      <div
        @mouseenter="hoveredPlan = 'starter'"
        @mouseleave="hoveredPlan = null"
        :class="[
          'relative flex flex-col rounded-[28px] p-8 card-glass transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',

          cardsVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10',

          hoveredPlan === 'starter'
            ? 'scale-[1.05] z-20 shadow-[0_30px_80px_rgba(75,104,255,0.18)]'
            : '',

          hoveredPlan && hoveredPlan !== 'starter'
            ? 'opacity-60 saturate-50 scale-[0.98]'
            : '',
        ]"
      >
        <div
          v-if="hoveredPlan && hoveredPlan !== 'starter'"
          class="absolute inset-0 rounded-[28px] bg-white/10 dark:bg-black/20 backdrop-blur-sm pointer-events-none"
        ></div>

        <div class="flex flex-col gap-1.5 pb-7">
          <div
            class="w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-3"
          >
            Individual
          </div>

          <h2 class="font-header font-bold text-xl text-brand-dark">Starter</h2>

          <p class="text-brand-slate text-sm">
            Essential intelligence for individuals.
          </p>
        </div>

        <div class="flex items-end gap-1 pb-7">
          <span class="font-header font-bold text-5xl text-brand-dark">
            $0
          </span>

          <span class="text-brand-slate text-sm mb-2"> /{{ isAnnual ? "yr" : "mo" }} </span>
        </div>

        <div class="h-[1px] w-full bg-black/5 mb-6"></div>

        <ul class="flex flex-col gap-3.5 flex-1 pb-8">
          <li
            v-for="feature in starterFeatures"
            :key="feature"
            class="flex items-center gap-3"
          >
            <span
              class="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 shrink-0"
            >
              <PhCheck :size="11" weight="bold" class="text-primary" />
            </span>

            <span class="text-brand-slate text-sm">
              {{ feature }}
            </span>
          </li>
        </ul>

        <Button
          v-if="!isOnProPlan"
          variant="glass"
          class="w-full"
          @click="handlePlanClick('starter')"
        >
          Start for Free
        </Button>
        <Button
          v-else
          variant="outline"
          class="w-full border-red-200 !text-red-500 hover:bg-red-50"
          @click="handlePlanClick('starter')"
        >
          Downgrade to Free
        </Button>
      </div>

      <!-- Professional (Recommended) -->
      <!-- Professional -->
      <div
        @mouseenter="hoveredPlan = 'pro'"
        @mouseleave="hoveredPlan = null"
        :class="[
          'relative flex flex-col rounded-[28px] p-8 bg-white/85 dark:bg-slate-900/85 border border-primary/20 backdrop-blur-[20px] shadow-glass transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',

          cardsVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10',

          hoveredPlan === 'pro'
            ? 'scale-[1.07] z-20 shadow-[0_35px_90px_rgba(75,104,255,0.22)]'
            : 'lg:scale-[1.03]',

          hoveredPlan && hoveredPlan !== 'pro'
            ? 'opacity-60 saturate-50 scale-[0.98]'
            : '',
        ]"
      >
        <div
          v-if="hoveredPlan && hoveredPlan !== 'pro'"
          class="absolute inset-0 rounded-[28px] bg-white/10 dark:bg-black/20 backdrop-blur-sm pointer-events-none"
        ></div>

        <!-- Top Glow -->
        <div
          class="absolute top-0 left-8 right-8 h-[3px] bg-grad-primary rounded-b-full"
        ></div>

        <!-- Badge -->
        <div
          :class="[
            'absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full shadow-[0_8px_25px_rgba(75,104,255,0.25)]',
            isCurrentPlanMatch
              ? 'bg-emerald-500 shadow-[0_8px_25px_rgba(16,185,129,0.25)]'
              : 'bg-grad-primary',
          ]"
        >
          <span
            class="text-[10px] text-white font-bold tracking-[0.18em] uppercase"
          >
            {{ isCurrentPlanMatch ? 'Your Plan' : 'Most Popular' }}
          </span>
        </div>

        <div class="flex flex-col gap-1.5 pb-7 pt-4">
          <div
            class="w-fit px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider mb-3"
          >
            Teams
          </div>

          <h2 class="font-header font-bold text-xl text-brand-dark">
            Professional
          </h2>

          <p class="text-brand-slate text-sm">
            For teams scaling their output.
          </p>
        </div>

        <div class="flex items-end gap-1 pb-1">
          <span class="font-header font-bold text-5xl text-brand-dark">
            {{ isAnnual ? "$276" : "$29" }}
          </span>

          <span class="text-brand-slate text-sm mb-2">
            /user /{{ isAnnual ? "yr" : "mo" }}
          </span>
        </div>

        <div class="flex flex-col gap-1 mb-4">
          <span v-if="isAnnual" class="text-xs text-brand-slate">
            <span class="line-through text-brand-slate/40">$29/mo</span>
            &nbsp;$23/mo &mdash; Save $72/yr (20% OFF)
          </span>
          <span v-if="!isAnnual" class="text-xs text-brand-slate">
            $348/year if billed monthly
          </span>
        </div>

        <div class="h-[1px] w-full bg-primary/10 mb-6"></div>

        <ul class="flex flex-col gap-3.5 flex-1 pb-8">
          <li
            v-for="feature in proFeatures"
            :key="feature"
            class="flex items-center gap-3"
          >
            <span
              class="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 shrink-0"
            >
              <PhCheck :size="11" weight="bold" class="text-primary" />
            </span>

            <span class="text-brand-dark text-sm font-semibold">
              {{ feature }}
            </span>
          </li>
        </ul>

        <Button
          variant="primary"
          class="w-full"
          :disabled="isCurrentPlanMatch"
          @click="handlePlanClick('pro')"
        >
          {{ isCurrentPlanMatch ? 'Current Plan' : isOnProPlan ? 'Switch Plan' : 'Start Pro Trial' }}
        </Button>
      </div>

      <!-- Enterprise -->
      <!-- Enterprise -->
      <div
        @mouseenter="hoveredPlan = 'enterprise'"
        @mouseleave="hoveredPlan = null"
        :class="[
          'relative flex flex-col rounded-[28px] p-8 card-glass transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',

          cardsVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10',

          hoveredPlan === 'enterprise'
            ? 'scale-[1.05] z-20 shadow-[0_30px_80px_rgba(75,104,255,0.18)]'
            : '',

          hoveredPlan && hoveredPlan !== 'enterprise'
            ? 'opacity-60 saturate-50 scale-[0.98]'
            : '',
        ]"
      >
        <div
          v-if="hoveredPlan && hoveredPlan !== 'enterprise'"
          class="absolute inset-0 rounded-[28px] bg-white/10 dark:bg-black/20 backdrop-blur-sm pointer-events-none"
        ></div>

        <div class="flex flex-col gap-1.5 pb-7">
          <div
            class="w-fit px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider mb-3"
          >
            Enterprise
          </div>

          <h2 class="font-header font-bold text-xl text-brand-dark">
            Enterprise
          </h2>

          <p class="text-brand-slate text-sm">
            Maximum security and compliance.
          </p>
        </div>

        <div class="flex items-end gap-2 pb-7">
          <span class="font-header font-bold text-5xl text-brand-dark">
            Custom
          </span>
        </div>

        <div class="h-[1px] w-full bg-black/5 mb-6"></div>

        <ul class="flex flex-col gap-3.5 flex-1 pb-8">
          <li
            v-for="feature in enterpriseFeatures"
            :key="feature"
            class="flex items-center gap-3"
          >
            <span
              class="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 shrink-0"
            >
              <PhCheck :size="11" weight="bold" class="text-primary" />
            </span>

            <span class="text-brand-slate text-sm">
              {{ feature }}
            </span>
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
    <section
      ref="tableRef"
      id="feature-breakdown"
      :class="[
        'flex flex-col gap-12 transition-all duration-700',
        tableVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      ]"
    >
      <!-- Section Header -->
      <div class="text-center max-w-[750px] mx-auto">
        <span
          class="text-[10px] font-bold tracking-[0.18em] text-primary uppercase"
        >
          PLAN COMPARISON
        </span>

        <h2
          class="mt-4 text-3xl sm:text-5xl font-bold font-header tracking-tight text-brand-dark"
        >
          Everything included in every plan.
        </h2>

        <p
          class="mt-4 text-brand-slate text-base leading-relaxed max-w-[600px] mx-auto"
        >
          Compare SmartMeet plans and choose the solution that best fits your
          team's collaboration and intelligence needs.
        </p>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-[32px] card-glass">
        <!-- Header -->
        <div
          class="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-black/5 dark:border-white/5"
        >
          <div
            class="px-8 py-7 text-left font-header font-bold text-xs uppercase tracking-[0.18em] text-brand-dark"
          >
            Features
          </div>

          <div
            class="px-6 py-7 text-center font-header font-bold text-xs uppercase tracking-[0.18em] text-brand-slate"
          >
            Starter
          </div>

          <!-- PRO -->
          <div
            class="px-6 py-5 text-center bg-primary/[0.05] border-x border-primary/10"
          >
            <div
              class="inline-flex px-3 py-1 rounded-full bg-primary text-white text-[9px] font-black tracking-[0.15em] uppercase mb-2"
            >
              Most Popular
            </div>

            <div
              class="font-header font-bold text-primary text-xs uppercase tracking-[0.18em]"
            >
              Professional
            </div>
          </div>

          <div
            class="px-6 py-7 text-center font-header font-bold text-xs uppercase tracking-[0.18em] text-brand-slate"
          >
            Enterprise
          </div>
        </div>

        <!-- Rows -->
        <template v-for="(row, i) in comparisonTable" :key="i">
          <!-- Category Row -->
          <div
            v-if="row.category"
            class="border-t border-black/5 dark:border-white/5 bg-gradient-to-r from-primary/[0.08] via-primary/[0.04] to-transparent"
          >
            <div
              class="px-8 py-3 text-[11px] font-black tracking-[0.18em] uppercase text-primary"
            >
              {{ row.label }}
            </div>
          </div>

          <!-- Feature Row -->
          <div
            v-else
            :class="[
              'grid grid-cols-[2fr_1fr_1fr_1fr]',
              'border-t border-black/[0.04] dark:border-white/[0.04]',
              'transition-all duration-300',
              'hover:bg-primary/[0.025]',
              tableVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-4',
            ]"
            :style="`transition-delay:${i * 40 + 100}ms`"
          >
            <!-- Feature Name -->
            <div class="px-8 py-5 text-brand-dark font-medium">
              {{ row.label }}
            </div>

            <!-- Starter -->
            <div class="px-6 py-5 flex items-center justify-center">
              <FeatureCell :value="row.starter" />
            </div>

            <!-- Pro -->
            <div
              class="px-6 py-5 flex items-center justify-center bg-primary/[0.03] border-x border-primary/10"
            >
              <FeatureCell :value="row.pro" />
            </div>

            <!-- Enterprise -->
            <div class="px-6 py-5 flex items-center justify-center">
              <FeatureCell :value="row.enterprise" />
            </div>
          </div>
        </template>
      </div>

      <!-- Enterprise CTA -->
      <div
        class="rounded-[28px] bg-primary/[0.04] border border-primary/10 p-8 text-center"
      >
        <h3 class="text-xl font-bold text-brand-dark mb-3">
          Need a custom deployment?
        </h3>

        <p class="text-brand-slate max-w-[650px] mx-auto mb-6">
          SmartMeet Enterprise includes private AI deployment, advanced
          compliance controls, SSO, custom integrations, dedicated onboarding,
          and priority support.
        </p>

        <Button
          variant="outline"
          class="border-primary/20 !text-primary hover:bg-primary/5"
          @click="contactSales"
        >
          Contact Enterprise Sales
        </Button>
      </div>
    </section>

    <!-- ═══════════════ FAQ ═══════════════ -->
    <section
      ref="faqRef"
      :class="[
        'flex flex-col gap-8 mx-auto w-full transition-all duration-700',
        faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      ]"
    >
      <!-- Header -->
      <div class="text-center w-full mx-auto">
        <span
          class="text-[10px] font-bold tracking-[0.18em] text-primary uppercase"
        >
          SUPPORT CENTER
        </span>
        <h2
          class="mt-4 text-3xl sm:text-5xl font-bold font-header text-brand-dark"
        >
          Frequently Asked Questions
        </h2>
        <p class="mt-4 text-brand-slate text-base leading-relaxed">
          Everything you need to know about SmartMeet, pricing, integrations,
          and enterprise deployment.
        </p>
      </div>

      <!-- FAQ Items -->
      <div class="flex flex-col gap-3">
        <div
          v-for="(faq, i) in faqs"
          :key="i"
          class="relative overflow-hidden rounded-[24px] border transition-all duration-500 backdrop-blur-xl group w-full"
          :class="[
            openFaq === i
              ? 'bg-white/90 dark:bg-slate-900/90 border-primary/20 shadow-[0_20px_50px_rgba(75,104,255,0.12)]'
              : 'bg-primary/5 dark:bg-slate-900/50 border-white/70 dark:border-white/10 hover:bg-white/75 dark:hover:bg-slate-900/75 hover:border-primary/10',
            faqVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4',
          ]"
          :style="`transition-delay: ${i * 80}ms`"
        >
          <!-- Toggle Button -->
          <button
            :id="`faq-${i}`"
            @click="toggleFaq(i)"
            class="w-full px-7 py-6 flex items-center justify-between text-left cursor-pointer"
            :aria-expanded="openFaq === i"
          >
            <span
              class="text-primary font-semibold transition-all duration-300"
              :class="openFaq === i ? 'text-primary' : 'text-brand-dark'"
            >
              {{ faq.q }}
            </span>
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              :class="
                openFaq === i
                  ? 'bg-primary text-white rotate-180'
                  : 'bg-primary/5 text-primary'
              "
            >
              <PhCaretDown :size="18" weight="bold" />
            </div>
          </button>

          <!-- Answer -->
          <div
            class="grid faq-grid-transition"
            :class="openFaq === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="overflow-hidden">
              <div class="px-7 pb-6">
                <div
                  class="border-t border-black/5 dark:border-white/5 pt-5 text-brand-slate text-sm leading-relaxed font-body"
                >
                  {{ faq.a }}
                </div>
              </div>
            </div>
          </div>

          <!-- Decorative glow -->
          <div
            v-if="openFaq === i"
            class="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/10 blur-[80px] pointer-events-none"
          ></div>
        </div>
      </div>
    </section>

    <!-- ═══════════════ CONTACT SALES MODAL ═══════════════ -->
    <Transition name="success">
      <div
        v-if="showContactModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
        @click.self="showContactModal = false"
      >
        <div class="w-full max-w-[480px] rounded-[28px] card-glass p-8 relative">
          <button
            class="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-brand-slate hover:bg-black/10 hover:text-brand-dark transition-all cursor-pointer"
            @click="showContactModal = false"
          >
            <PhX :size="16" weight="bold" />
          </button>

          <div class="flex flex-col items-center text-center mb-6">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <PhBuildings :size="24" weight="bold" />
            </div>
            <h3 class="font-header font-bold text-xl text-brand-dark">
              Contact Enterprise Sales
            </h3>
            <p class="text-brand-slate text-sm mt-1 max-w-[320px]">
              Tell us about your needs and our team will get back to you.
            </p>
          </div>

          <form @submit.prevent="handleContactSubmit" class="flex flex-col gap-4">
            <div>
              <label class="text-[11px] font-bold font-header tracking-wide text-brand-dark mb-1.5 block">
                Full Name
              </label>
              <input
                v-model="contactForm.name"
                placeholder="John Doe"
                class="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-brand-dark text-sm outline-none focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.1)] transition-all"
                :class="contactErrors.name ? 'border-red-300' : ''"
              />
              <p v-if="contactErrors.name" class="text-red-500 text-[11px] mt-1 font-body">{{ contactErrors.name }}</p>
            </div>

            <div>
              <label class="text-[11px] font-bold font-header tracking-wide text-brand-dark mb-1.5 block">
                Email
              </label>
              <input
                v-model="contactForm.email"
                type="email"
                placeholder="john@company.com"
                class="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-brand-dark text-sm outline-none focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.1)] transition-all"
                :class="contactErrors.email ? 'border-red-300' : ''"
              />
              <p v-if="contactErrors.email" class="text-red-500 text-[11px] mt-1 font-body">{{ contactErrors.email }}</p>
            </div>

            <div>
              <label class="text-[11px] font-bold font-header tracking-wide text-brand-dark mb-1.5 block">
                Company
              </label>
              <input
                v-model="contactForm.company"
                placeholder="Acme Inc."
                class="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-brand-dark text-sm outline-none focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.1)] transition-all"
                :class="contactErrors.company ? 'border-red-300' : ''"
              />
              <p v-if="contactErrors.company" class="text-red-500 text-[11px] mt-1 font-body">{{ contactErrors.company }}</p>
            </div>

            <div>
              <label class="text-[11px] font-bold font-header tracking-wide text-brand-dark mb-1.5 block">
                Message
              </label>
              <textarea
                v-model="contactForm.message"
                rows="3"
                placeholder="Tell us about your use case, team size, and requirements..."
                class="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 text-brand-dark text-sm outline-none focus:border-primary/40 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.1)] transition-all resize-none"
                :class="contactErrors.message ? 'border-red-300' : ''"
              ></textarea>
              <p v-if="contactErrors.message" class="text-red-500 text-[11px] mt-1 font-body">{{ contactErrors.message }}</p>
            </div>

            <Button type="submit" variant="primary" class="w-full mt-2">
              Send Inquiry
            </Button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════ DOWNGRADE CONFIRMATION MODAL ═══════════════ -->
    <Transition name="success">
      <div
        v-if="showDowngradeModal"
        class="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
        @click.self="showDowngradeModal = false"
      >
        <div class="w-full max-w-[400px] rounded-[28px] card-glass p-8 relative">
          <div class="flex flex-col items-center text-center">
            <div class="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <PhWarningCircle :size="28" weight="fill" class="text-red-500" />
            </div>
            <h3 class="font-header font-bold text-lg text-brand-dark mb-2">
              Downgrade to Free?
            </h3>
            <p class="text-brand-slate text-sm mb-6 max-w-[300px]">
              You'll lose access to all Professional features and be switched to the Free plan.
            </p>
            <div class="flex gap-3 w-full">
              <Button
                variant="outline"
                class="flex-1"
                @click="showDowngradeModal = false"
              >
                Keep Plan
              </Button>
              <Button
                variant="danger"
                class="flex-1"
                @click="confirmDowngrade"
              >
                Yes, Downgrade
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Contact Success Toast -->
    <Transition name="success">
      <div
        v-if="showContactSuccess"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-emerald-200 dark:border-emerald-800 shadow-[0_10px_40px_rgba(0,0,0,0.1)] backdrop-blur-xl flex items-center gap-3"
      >
        <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
          <PhCheck :size="16" weight="bold" class="text-emerald-500" />
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-brand-dark">Inquiry Sent!</span>
          <span class="text-xs text-brand-slate">Our team will reach out within 24 hours.</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineComponent, h } from "vue";
import { useRouter } from "vue-router";
import { PhCheck, PhMinus, PhCaretDown, PhSparkle, PhBuildings, PhEnvelope, PhUser, PhX } from "@phosphor-icons/vue";
import Button from "@/components/ui/Button.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const currentPlan = computed(() => authStore.user?.plan || "Free");
const isOnProPlan = computed(() => currentPlan.value.startsWith("Professional"));
const userPlanBilling = computed(() => {
  if (currentPlan.value.includes("Annual")) return "annual";
  if (currentPlan.value.includes("Monthly")) return "monthly";
  return null;
});
const isCurrentPlanMatch = computed(() =>
  isOnProPlan.value && userPlanBilling.value === (isAnnual.value ? "annual" : "monthly")
);

const handlePlanClick = (plan) => {
  if (plan === "starter") {
    if (isOnProPlan.value) {
      showDowngradeModal.value = true;
    } else if (authStore.isAuthenticated) {
      router.push("/");
    } else {
      router.push("/signup");
    }
  } else if (plan === "pro") {
    if (isCurrentPlanMatch.value) return;
    if (authStore.isAuthenticated) {
      router.push(`/checkout/paymob?billing=${isAnnual.value ? "annual" : "monthly"}`);
    } else {
      router.push("/signup");
    }
  }
};

// Billing toggle
const isAnnual = ref(false);
const toggleBilling = () => {
  isAnnual.value = !isAnnual.value;
};

// FAQ accordion
const openFaq = ref(null);
const toggleFaq = (i) => {
  openFaq.value = openFaq.value === i ? null : i;
};

// Scroll reveal
const heroRef = ref(null);
const cardsRef = ref(null);
const tableRef = ref(null);
const faqRef = ref(null);

const heroVisible = ref(false);
const cardsVisible = ref(false);
const tableVisible = ref(false);
const faqVisible = ref(false);

const observe = (el, visibleRef, threshold = 0.15) => {
  if (!el) return;
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        visibleRef.value = true;
        io.disconnect();
      }
    },
    { threshold },
  );
  io.observe(el);
};

onMounted(() => {
  setTimeout(() => {
    heroVisible.value = true;
  }, 80);
  setTimeout(() => {
    cardsVisible.value = true;
  }, 220);
  observe(tableRef.value, tableVisible);
  observe(faqRef.value, faqVisible);
});

// Sub-component
const FeatureCell = defineComponent({
  name: "FeatureCell",
  props: { value: [Boolean, String] },
  setup(props) {
    return () => {
      if (props.value === true)
        return h(
          "span",
          {
            class:
              "flex items-center justify-center w-5 h-5 rounded-full bg-primary/10",
          },
          [h(PhCheck, { size: 11, weight: "bold", class: "text-primary" })],
        );
      if (props.value === false)
        return h(PhMinus, {
          size: 18,
          weight: "bold",
          class: "text-black/15 dark:text-white/20",
        });
      return h(
        "span",
        { class: "text-brand-dark text-sm font-body font-semibold" },
        props.value,
      );
    };
  },
});

const starterFeatures = [
  "5 AI-Powered Meetings /mo",
  "Live Transcription (90% accuracy)",
  "Standard Search & Filters",
  "7-Day Meeting History",
];
const proFeatures = [
  "Unlimited Smart Meetings",
  "Neural Summary Engine",
  "Multi-language Support (30+)",
  "Custom CRM Integrations",
  "Collaborative Workspaces",
];
const enterpriseFeatures = [
  "SOC2, HIPAA & GDPR Compliance",
  "SSO & Advanced User Provisioning",
  "Dedicated Success Manager",
  "On-premise LLM Deployment",
];
const comparisonTable = [
  { label: "AI Transcription", starter: true, pro: true, enterprise: true },
  {
    label: "Meeting Summaries",
    starter: "Limited",
    pro: "Full Engine",
    enterprise: "Custom LLM",
  },
  { label: "Sentiment Analysis", starter: false, pro: true, enterprise: true },
  { category: true, label: "SECURITY & SCALE" },
  {
    label: "Storage",
    starter: "10 GB",
    pro: "200 GB",
    enterprise: "Unlimited",
  },
  { label: "SSO / SAML", starter: false, pro: false, enterprise: true },
  {
    label: "Custom API Access",
    starter: false,
    pro: "Limited",
    enterprise: "Priority",
  },
];
const faqs = [
  {
    q: "Can I change my plan at any time?",
    a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately and we'll prorate billing differences at the next cycle.",
  },
  {
    q: "What meeting platforms do you support?",
    a: "SmartMeet AI works universally for all meetings. You can record live meetings directly from your browser, upload recording files, or connect with conferencing platforms like Zoom, Microsoft Teams, Webex, and Google Meet.",
  },
  {
    q: "How is my data used to train AI models?",
    a: "Your data is never used to train AI models without explicit consent. All meeting content is encrypted at rest and in transit. Enterprise customers can opt for on-premise LLM deployment for maximum data sovereignty.",
  },
];

const showDowngradeModal = ref(false);
const showContactModal = ref(false);
const showContactSuccess = ref(false);
const contactForm = ref({
  name: "",
  email: "",
  company: "",
  message: "",
});
const contactErrors = ref({ name: "", email: "", company: "", message: "" });

const contactSales = () => {
  showContactModal.value = true;
};

const confirmDowngrade = () => {
  authStore.updateUser({ plan: "Free" });
  showDowngradeModal.value = false;
};

const handleContactSubmit = () => {
  contactErrors.value = { name: "", email: "", company: "", message: "" };
  let valid = true;

  if (!contactForm.value.name.trim()) {
    contactErrors.value.name = "Name is required";
    valid = false;
  }
  if (!contactForm.value.email.trim()) {
    contactErrors.value.email = "Email is required";
    valid = false;
  }
  if (!contactForm.value.company.trim()) {
    contactErrors.value.company = "Company is required";
    valid = false;
  }
  if (!contactForm.value.message.trim()) {
    contactErrors.value.message = "Message is required";
    valid = false;
  }

  if (!valid) return;

  showContactModal.value = false;
  showContactSuccess.value = true;
  setTimeout(() => {
    showContactSuccess.value = false;
  }, 4000);
};

const starterCoreFeatures = ["5 AI Meetings / month", "Live Transcription"];
const starterAccessFeatures = ["7-Day Meeting History", "Basic Search"];

const proAiFeatures = [
  "Unlimited Smart Meetings",
  "Neural Summary Engine",
  "Sentiment Analysis",
];
const proCollaborationFeatures = ["Custom CRM Integrations", "Team Workspaces"];

const enterpriseSecurityFeatures = [
  "SOC2 Compliance",
  "SSO & SCIM",
  "Private Deployment",
];
const enterpriseSupportFeatures = [
  "Dedicated Success Manager",
  "Priority Support",
];

const hoveredPlan = ref(null);
</script>

<style scoped>
.price-flip-enter-active {
  animation: price-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.price-flip-leave-active {
  animation: price-out 0.2s ease-in;
  position: absolute;
}
@keyframes price-in {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.85);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes price-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-14px);
  }
}

.faq-expand-enter-active {
  transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}
.faq-expand-leave-active {
  transition: all 0.24s cubic-bezier(0.4, 0, 0.2, 1);
}
.faq-expand-enter-from,
.faq-expand-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}
.faq-expand-enter-to,
.faq-expand-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 200px;
}

.fade-quick-enter-active,
.fade-quick-leave-active {
  transition: all 0.25s ease;
}
.fade-quick-enter-from,
.fade-quick-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}
.animate-shimmer {
  animation: shimmer 2.4s infinite ease-in-out;
}

@keyframes badge-pulse {
  0%,
  100% {
    box-shadow: 0 4px 15px rgba(75, 104, 255, 0.35);
  }
  50% {
    box-shadow: 0 4px 22px rgba(75, 104, 255, 0.6);
  }
}
.animate-badge-pulse {
  animation: badge-pulse 2.5s ease-in-out infinite;
}

@keyframes pulse-soft {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(75, 104, 255, 0);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(75, 104, 255, 0.07);
  }
}
.animate-pulse-soft {
  animation: pulse-soft 3s ease-in-out infinite;
}

@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 6s linear infinite;
}

.faq-grid-transition {
  transition: grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 220ms ease-in-out;
}


</style>
