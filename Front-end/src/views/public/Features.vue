<template>
  <div class="flex flex-col gap-20 mt-4 text-left">
    <!-- ── HERO ── -->
    <section
      class="relative pt-10 pb-6 text-center flex flex-col items-center gap-6"
    >
      <!-- Subtle ambient orbs -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/8 rounded-full filter blur-[100px] pointer-events-none"
      ></div>

      <div class="relative z-10 flex flex-col items-center gap-5">
        <span
          class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary font-header text-[10px] font-bold tracking-widest uppercase"
        >
          <span
            class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
          ></span>
          Platform Capabilities
        </span>

        <h1
          class="text-4xl sm:text-5xl lg:text-[64px] font-extrabold font-header tracking-tight leading-[1.15] text-brand-dark max-w-5xl"
        >
          Everything your team needs,
          <span
            class="block mt-2 sm:mt-3 pb-2 bg-gradient-to-r from-primary via-[#8b63f5] to-accent bg-clip-text text-transparent"
            >nothing it doesn't.</span
          >
        </h1>

        <p
          class="text-base sm:text-lg text-brand-slate max-w-xl leading-relaxed"
        >
          From live transcription to cross-platform automation — every SmartMeet
          feature works together as one intelligent layer for your team.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3 mt-1">
          <Button variant="primary" @click="$router.push('/signup')">
            Start Free Trial
          </Button>
          <Button variant="outline" @click="scrollToFeatures">
            <template #icon-left>
              <PhPlay :size="14" weight="fill" class="text-primary" />
            </template>
            Explore Features
          </Button>
        </div>
      </div>
    </section>

    <!-- ── FEATURE PILLARS ── -->
    <section id="features-list" class="flex flex-col gap-0">
      <!-- Feature 01: Live Transcription -->
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 border-t border-black/6 dark:border-white/5"
      >
        <div class="flex flex-col gap-5 text-left order-2 lg:order-1">
          <div class="flex items-center gap-3">
            <span
              class="text-[56px] font-extrabold font-header text-black/5 dark:text-white/5 leading-none select-none tracking-tighter"
              >01</span
            >
            <div
              class="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0"
            >
              <PhMicrophone :size="18" weight="bold" />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div
              class="text-[10px] font-extrabold text-primary uppercase tracking-widest font-header"
            >
              Real-time Capture
            </div>
            <h2
              class="text-2xl sm:text-3xl font-extrabold font-header text-brand-dark tracking-tight leading-snug"
            >
              Every word.<br />Every speaker.
            </h2>
            <p
              class="text-sm sm:text-base text-brand-slate leading-relaxed max-w-sm"
            >
              Our neural voice engine transcribes live, tags every speaker with
              99.9% accuracy, and adapts to 40+ languages.
            </p>
          </div>
          <div class="flex flex-col gap-2.5 mt-1">
            <div
              v-for="item in transcriptionFeatures"
              :key="item"
              class="flex items-center gap-2.5 text-sm text-brand-dark font-medium"
            >
              <div
                class="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0"
              >
                <PhCheck :size="10" weight="bold" />
              </div>
              {{ item }}
            </div>
          </div>
        </div>

        <!-- Transcript card mockup -->
        <div class="order-1 lg:order-2">
          <div class="card-glass rounded-[24px] p-5 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="flex h-2 w-2">
                  <span
                    class="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-2 w-2 bg-red-400"
                  ></span>
                </span>
                <span
                  class="text-[10px] font-bold text-brand-slate uppercase tracking-widest font-header"
                  >Live · Q3 Roadmap</span
                >
              </div>
              <span class="text-[10px] text-brand-slate font-mono">48:32</span>
            </div>
            <!-- Waveform -->
            <div
              class="flex items-end gap-[3px] h-8 bg-black/[0.02] rounded-xl px-3"
            >
              <div
                v-for="i in 28"
                :key="i"
                class="flex-1 rounded-full bg-primary/40"
                :style="{ height: waveHeights[i % waveHeights.length] + '%' }"
              ></div>
            </div>
            <!-- Bubbles -->
            <div class="flex flex-col gap-2.5">
              <div
                v-for="(bubble, i) in transcriptBubbles"
                :key="i"
                class="flex flex-col gap-1"
                :class="bubble.self ? 'items-end' : 'items-start'"
              >
                <span
                  class="text-[9px] text-brand-slate font-bold uppercase tracking-wide px-1"
                  >{{ bubble.speaker }}</span
                >
                <div
                  class="max-w-[80%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed"
                  :class="
                    bubble.self
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 text-brand-dark rounded-tl-none shadow-sm'
                  "
                >
                  {{ bubble.text }}
                </div>
              </div>
              <div class="flex items-start">
                <div
                  class="flex items-center gap-1 bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 rounded-2xl rounded-tl-none px-3.5 py-2 shadow-sm"
                >
                  <div
                    v-for="d in 3"
                    :key="d"
                    class="w-1.5 h-1.5 rounded-full bg-brand-slate/40 animate-bounce"
                    :style="{ animationDelay: d * 150 + 'ms' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Feature 02: AI Synthesis -->
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 border-t border-black/6 dark:border-white/5"
      >
        <!-- Left card -->
        <div class="order-1">
          <div class="card-glass rounded-[24px] p-5 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span
                class="text-[10px] font-extrabold text-brand-dark uppercase tracking-widest font-header flex items-center gap-1.5"
              >
                <PhSparkle :size="11" class="text-primary" weight="fill" />
                AI Synthesis Engine
              </span>
              <span
                class="text-[9px] font-bold text-brand-success bg-brand-success/10 px-2 py-0.5 rounded-full border border-brand-success/20"
                >Done</span
              >
            </div>
            <!-- Summary -->
            <div class="bg-primary/4 border border-primary/10 rounded-xl p-3.5">
              <p class="text-xs text-brand-dark leading-relaxed">
                "Team aligned on micro-frontend migration by Q3. Sarah flagged
                QA pipeline risk → dedicated review scheduled. Budget confirmed
                at $12,500."
              </p>
            </div>
            <!-- Tasks -->
            <div class="flex flex-col gap-1.5">
              <div
                class="text-[9px] font-extrabold text-brand-slate uppercase tracking-widest mb-0.5"
              >
                Action Items
              </div>
              <div
                v-for="(task, i) in summaryTasks"
                :key="i"
                class="flex items-center gap-2.5 p-2.5 rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm"
              >
                <div
                  class="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0"
                  :class="
                    task.done
                      ? 'bg-primary text-white'
                      : 'border border-brand-slate/30'
                  "
                >
                  <PhCheck v-if="task.done" :size="8" weight="bold" />
                </div>
                <span
                  class="text-[11px] font-medium text-brand-dark flex-1"
                  :class="{ 'line-through text-brand-slate': task.done }"
                  >{{ task.text }}</span
                >
                <span
                  class="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                  :class="{
                    'bg-red-50 text-red-500 border border-red-100':
                      task.priority === 'HIGH',
                    'bg-amber-50 text-amber-600 border border-amber-100':
                      task.priority === 'MED',
                    'bg-slate-50 text-slate-400 border border-slate-100':
                      task.priority === 'LOW',
                  }"
                  >{{ task.priority }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Right text -->
        <div class="flex flex-col gap-5 text-left order-2">
          <div class="flex items-center gap-3">
            <span
              class="text-[56px] font-extrabold font-header text-black/5 dark:text-white/5 leading-none select-none tracking-tighter"
              >02</span
            >
            <div
              class="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary flex-shrink-0"
            >
              <PhSparkle :size="18" weight="bold" />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div
              class="text-[10px] font-extrabold text-secondary uppercase tracking-widest font-header"
            >
              AI Knowledge Synthesis
            </div>
            <h2
              class="text-2xl sm:text-3xl font-extrabold font-header text-brand-dark tracking-tight leading-snug"
            >
              Summaries written.<br />Tasks assigned.
            </h2>
            <p
              class="text-sm sm:text-base text-brand-slate leading-relaxed max-w-sm"
            >
              The moment your call ends, SmartMeet has already written the
              summary, extracted every action item, and assigned it to the right
              person.
            </p>
          </div>
          <div class="flex flex-col gap-2.5 mt-1">
            <div
              v-for="item in synthesisFeatures"
              :key="item"
              class="flex items-center gap-2.5 text-sm text-brand-dark font-medium"
            >
              <div
                class="w-4 h-4 rounded-full bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0"
              >
                <PhCheck :size="10" weight="bold" />
              </div>
              {{ item }}
            </div>
          </div>
        </div>
      </div>

      <!-- Feature 03: Semantic Search -->
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 border-t border-black/6 dark:border-white/5"
      >
        <div class="flex flex-col gap-5 text-left order-2 lg:order-1">
          <div class="flex items-center gap-3">
            <span
              class="text-[56px] font-extrabold font-header text-black/5 dark:text-white/5 leading-none select-none tracking-tighter"
              >03</span
            >
            <div
              class="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0"
            >
              <PhMagnifyingGlass :size="18" weight="bold" />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div
              class="text-[10px] font-extrabold text-accent uppercase tracking-widest font-header"
            >
              Organizational Memory
            </div>
            <h2
              class="text-2xl sm:text-3xl font-extrabold font-header text-brand-dark tracking-tight leading-snug"
            >
              Search by intent,<br />not keywords.
            </h2>
            <p
              class="text-sm sm:text-base text-brand-slate leading-relaxed max-w-sm"
            >
              Ask "what did we decide about pricing last quarter?" SmartMeet
              understands meaning and surfaces the exact moment, speaker, and
              context instantly.
            </p>
          </div>
          <div class="flex flex-col gap-2.5 mt-1">
            <div
              v-for="item in memoryFeatures"
              :key="item"
              class="flex items-center gap-2.5 text-sm text-brand-dark font-medium"
            >
              <div
                class="w-4 h-4 rounded-full bg-accent/10 flex items-center justify-center text-accent flex-shrink-0"
              >
                <PhCheck :size="10" weight="bold" />
              </div>
              {{ item }}
            </div>
          </div>
        </div>

        <!-- Search UI card -->
        <div class="order-1 lg:order-2">
          <div class="card-glass rounded-[24px] p-5 flex flex-col gap-4">
            <!-- Search bar -->
            <div
              class="flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 rounded-2xl px-4 py-3 shadow-sm"
            >
              <PhMagnifyingGlass
                :size="14"
                class="text-brand-slate flex-shrink-0"
              />
              <span
                class="text-sm font-medium text-brand-dark flex-1 min-w-0 truncate"
              >
                {{ typedQuery
                }}<span
                  class="inline-block w-0.5 h-4 bg-primary align-middle ml-0.5 animate-blink"
                  v-if="
                    typedQuery.length < searchTargetText.length || isSearching
                  "
                ></span>
              </span>
              <div
                class="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0"
                v-if="isSearching"
              ></div>
            </div>

            <!-- Result -->
            <transition name="fade-up" mode="out-in">
              <div v-if="showSearchResult" class="flex flex-col gap-3">
                <div
                  class="text-[9px] font-extrabold text-brand-slate uppercase tracking-widest"
                >
                  Best Match · 98% Confidence
                </div>
                <div
                  class="bg-primary/4 border border-primary/15 rounded-xl p-3.5 flex flex-col gap-2.5"
                >
                  <div class="flex flex-wrap items-center gap-2">
                    <span
                      class="text-[9px] font-extrabold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full"
                      >Strategy Sync — Nov 12</span
                    >
                    <span class="text-[9px] text-brand-slate font-bold"
                      >at 18:42</span
                    >
                  </div>
                  <p
                    class="text-xs text-brand-dark leading-relaxed font-medium italic"
                  >
                    "Sarah recommended capping Q3 marketing spend at $12,500 and
                    allocating the remaining to dev licenses."
                  </p>
                  <div class="flex items-center gap-2">
                    <img
                      :src="avatar1"
                      class="w-4 h-4 rounded-full object-cover border border-black/5"
                    />
                    <span class="text-[10px] text-brand-slate font-semibold"
                      >Sarah Kim · VP Marketing</span
                    >
                  </div>
                </div>
                <div class="flex flex-col gap-1">
                  <div
                    v-for="related in relatedResults"
                    :key="related"
                    class="flex items-center gap-2 p-2 rounded-xl hover:bg-black/3 cursor-pointer transition-colors"
                  >
                    <PhArrowRight
                      :size="11"
                      class="text-brand-slate flex-shrink-0"
                    />
                    <span class="text-[11px] text-brand-slate font-medium">{{
                      related
                    }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="flex flex-col gap-2 py-2">
                <div
                  class="h-2 bg-black/5 rounded-full w-full animate-pulse"
                ></div>
                <div
                  class="h-2 bg-black/5 rounded-full w-3/4 animate-pulse"
                ></div>
                <div
                  class="h-2 bg-black/5 rounded-full w-1/2 animate-pulse"
                ></div>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Feature 04: Automation -->
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center py-14 border-t border-black/6 dark:border-white/5"
      >
        <!-- Left card: integration list -->
        <div class="order-1">
          <div class="card-glass rounded-[24px] p-5 flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <span
                class="text-[10px] font-extrabold text-brand-dark uppercase tracking-widest font-header"
                >Sync Console</span
              >
              <span
                class="flex items-center gap-1.5 text-[9px] font-bold text-brand-success"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-brand-success animate-pulse"
                ></span>
                All Systems Synced
              </span>
            </div>
            <!-- Log lines -->
            <div
              class="bg-brand-dark/[0.03] rounded-2xl p-4 flex flex-col gap-2 font-mono text-[10px]"
            >
              <div
                v-for="(log, i) in consoleLogs"
                :key="i"
                class="flex items-start gap-2 leading-snug"
              >
                <span class="text-brand-slate/40 flex-shrink-0">{{
                  String(i + 1).padStart(2, "0")
                }}</span>
                <span :class="log.color">{{ log.text }}</span>
              </div>
            </div>
            <!-- Integration status chips -->
            <div class="flex flex-wrap gap-2">
              <div
                v-for="intg in integrations"
                :key="intg.name"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold font-header"
                :class="
                  intg.active
                    ? 'bg-brand-success/8 border-brand-success/25 text-brand-success'
                    : 'bg-black/3 dark:bg-white/5 border-black/8 dark:border-white/10 text-brand-slate/60'
                "
              >
                <span
                  class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  :class="
                    intg.active ? 'bg-brand-success' : 'bg-brand-slate/30'
                  "
                ></span>
                {{ intg.name }}
              </div>
            </div>
          </div>
        </div>

        <!-- Right text -->
        <div class="flex flex-col gap-5 text-left order-2">
          <div class="flex items-center gap-3">
            <span
              class="text-[56px] font-extrabold font-header text-black/5 dark:text-white/5 leading-none select-none tracking-tighter"
              >04</span
            >
            <div
              class="w-9 h-9 rounded-xl bg-brand-success/10 border border-brand-success/20 flex items-center justify-center text-brand-success flex-shrink-0"
            >
              <PhLightning :size="18" weight="bold" />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div
              class="text-[10px] font-extrabold text-brand-success uppercase tracking-widest font-header"
            >
              Ecosystem Automation
            </div>
            <h2
              class="text-2xl sm:text-3xl font-extrabold font-header text-brand-dark tracking-tight leading-snug"
            >
              Decisions become<br />deliverables instantly.
            </h2>
            <p
              class="text-sm sm:text-base text-brand-slate leading-relaxed max-w-sm"
            >
              The moment a decision is made, SmartMeet fires your workflow. Jira
              tickets created. Slack notified. Notion updated. Zero manual
              effort.
            </p>
          </div>
          <div class="flex flex-col gap-2.5 mt-1">
            <div
              v-for="item in automationFeatures"
              :key="item"
              class="flex items-center gap-2.5 text-sm text-brand-dark font-medium"
            >
              <div
                class="w-4 h-4 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success flex-shrink-0"
              >
                <PhCheck :size="10" weight="bold" />
              </div>
              {{ item }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CAPABILITIES: Compact light grid ── -->
    <section class="flex flex-col gap-8 border-t border-black/6 dark:border-white/5 pt-16">
      <div class="text-center flex flex-col items-center gap-2">
        <h2
          class="text-2xl sm:text-3xl font-extrabold font-header text-brand-dark tracking-tight"
        >
          All capabilities
        </h2>
        <p class="text-sm text-brand-slate max-w-md">
          Every feature built into one platform. No add-ons, no hidden paywalls.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <div
          v-for="cap in capabilities"
          :key="cap.title"
          class="card-glass rounded-[18px] p-4 flex flex-col gap-3 hover:shadow-card-hover transition-all duration-300 group"
        >
          <div
            class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            :style="{
              backgroundColor: cap.color + '14',
              border: '1px solid ' + cap.color + '28',
              color: cap.color,
            }"
          >
            <component :is="cap.icon" :size="16" weight="bold" />
          </div>
          <div class="flex flex-col gap-1 text-left">
            <h3
              class="text-xs font-bold font-header text-brand-dark leading-snug"
            >
              {{ cap.title }}
            </h3>
            <p class="text-[11px] text-brand-slate leading-snug">
              {{ cap.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA ── -->
    <section
      class="card-glass rounded-[28px] p-10 sm:p-14 text-center flex flex-col items-center gap-5 relative overflow-hidden"
      style="
        background-image: linear-gradient(
          135deg,
          rgba(75, 104, 255, 0.04) 0%,
          rgba(139, 99, 245, 0.04) 100%
        );
      "
    >
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary/3 to-accent/3 pointer-events-none"
      ></div>
      <h2
        class="text-3xl sm:text-4xl font-extrabold font-header text-brand-dark tracking-tight leading-tight relative z-10"
      >
        Ready to make every meeting count?
      </h2>
      <p
        class="text-base text-brand-slate max-w-md leading-relaxed relative z-10"
      >
        Join 5,000+ teams who have transformed how they meet, decide, and
        execute with SmartMeet AI.
      </p>
      <div
        class="flex flex-wrap items-center justify-center gap-3 mt-1 relative z-10"
      >
        <Button variant="primary" @click="$router.push('/signup')">
          Start Free Trial — No Card Required
        </Button>
        <Button variant="outline" @click="$router.push('/pricing')">
          View Pricing
        </Button>
      </div>
      <!-- Social proof -->
      <div class="flex items-center gap-3 relative z-10">
        <div class="flex -space-x-2">
          <img
            :src="avatar1"
            class="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <img
            :src="avatar2"
            class="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
          />
          <div
            class="w-7 h-7 rounded-full border-2 border-white bg-primary/15 flex items-center justify-center text-[9px] text-primary font-bold"
          >
            +
          </div>
        </div>
        <span class="text-xs text-brand-slate font-medium"
          >Trusted by
          <span class="text-brand-dark font-bold">5,000+</span> teams</span
        >
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import {
  PhSparkle,
  PhCheck,
  PhMicrophone,
  PhMagnifyingGlass,
  PhLightning,
  PhBrain,
  PhFolderSimple,
  PhEnvelopeSimple,
  PhGlobe,
  PhHeartbeat,
  PhShieldCheck,
  PhChartBar,
  PhUsersThree,
  PhPlay,
  PhArrowRight,
} from "@phosphor-icons/vue";

import Button from "@/components/ui/Button.vue";
import avatar1 from "@/assets/Background+Border.png";
import avatar2 from "@/assets/Background+Border-1.png";

// Hero stats
const heroStats = [
  { value: "99.9%", label: "Accuracy" },
  { value: "40+", label: "Languages" },
  { value: "50+", label: "Integrations" },
  { value: "5k+", label: "Teams" },
];

// Feature 01: Live Transcription
const waveHeights = [
  30, 65, 90, 45, 75, 50, 80, 35, 60, 50, 85, 40, 70, 25, 95, 55,
];
const transcriptBubbles = [
  {
    speaker: "Marcus Chen",
    text: "Let's lock in Q3 scope today.",
    self: false,
  },
  {
    speaker: "You",
    text: "Agreed. Infrastructure migration should be first.",
    self: true,
  },
  {
    speaker: "Sarah Kim",
    text: "I'll flag the QA pipeline risk before we finalize.",
    self: false,
  },
];
const transcriptionFeatures = [
  "Speaker diarization with voice profile learning",
  "99.9% word accuracy across 40+ languages",
  "Works with Zoom, Meet, Teams & in-person",
];

// Feature 02: AI Synthesis
const summaryTasks = [
  {
    text: "Update Q3 feature allocation spreadsheet",
    done: true,
    priority: "HIGH",
  },
  {
    text: "Schedule QA pipeline review for next week",
    done: false,
    priority: "HIGH",
  },
  {
    text: "Draft technical debt reconciliation plan",
    done: false,
    priority: "MED",
  },
];
const synthesisFeatures = [
  "Executive summaries generated in under 30 seconds",
  "Decisions and action items automatically extracted",
  "Export-ready for email, Notion, and Jira",
];

// Feature 03: Semantic Search
const searchTargetText = "What did Sarah say about the budget?";
const typedQuery = ref("");
const isSearching = ref(false);
const showSearchResult = ref(false);
const relatedResults = [
  "Budget discussion — Q2 Strategy Review · at 22:14",
  "Marketing spend cap — OKR Planning · at 08:30",
];
let typingTimer = null;

const startTyping = () => {
  typedQuery.value = "";
  isSearching.value = false;
  showSearchResult.value = false;
  let i = 0;
  const type = () => {
    if (i <= searchTargetText.length) {
      typedQuery.value = searchTargetText.slice(0, i);
      i++;
      typingTimer = setTimeout(type, 65);
    } else {
      isSearching.value = true;
      typingTimer = setTimeout(() => {
        isSearching.value = false;
        showSearchResult.value = true;
        typingTimer = setTimeout(startTyping, 5000);
      }, 900);
    }
  };
  typingTimer = setTimeout(type, 800);
};

const memoryFeatures = [
  "Natural language search across all meetings",
  "Speaker-attributed answers with timestamps",
  "Automatic knowledge graph linking topics",
];

// Feature 04: Automation
const consoleLogs = [
  {
    text: "✓  Meeting ended · 7 action items extracted",
    color: "text-brand-slate",
  },
  {
    text: "→  Jira: 2 tickets created in #NX-Sprint-09",
    color: "text-primary",
  },
  { text: "→  Slack: Recap posted to #product-updates", color: "text-primary" },
  { text: '→  Notion: "Q3 Roadmap" page updated', color: "text-primary" },
  { text: "✓  All workflows synced in 2.3s", color: "text-brand-success" },
];
const integrations = [
  { name: "Slack", active: true },
  { name: "Jira", active: true },
  { name: "Notion", active: true },
  { name: "Gmail", active: true },
  { name: "Salesforce", active: false },
  { name: "HubSpot", active: false },
];
const automationFeatures = [
  "One-click sync to Jira, Slack, Notion & more",
  "AI-drafted follow-up emails, ready to send",
  "50+ native integrations, zero configuration",
];

// Capabilities list
const capabilities = [
  {
    title: "Live Transcription",
    desc: "Real-time, speaker-tagged transcripts in 40+ languages.",
    icon: PhMicrophone,
    color: "#4b68ff",
  },
  {
    title: "AI Summaries",
    desc: "Executive-quality recaps generated the moment a call ends.",
    icon: PhSparkle,
    color: "#8b63f5",
  },
  {
    title: "Semantic Search",
    desc: "Find any conversation by meaning, not just keywords.",
    icon: PhMagnifyingGlass,
    color: "#ec4899",
  },
  {
    title: "Task Automation",
    desc: "Action items synced to Jira, Notion & Slack automatically.",
    icon: PhLightning,
    color: "#22c55e",
  },
  {
    title: "Knowledge Graph",
    desc: "See how decisions and topics link across all meetings.",
    icon: PhBrain,
    color: "#06b6d4",
  },
  {
    title: "Sentiment Tracking",
    desc: "Track team alignment and engagement in every session.",
    icon: PhHeartbeat,
    color: "#f59e0b",
  },
  {
    title: "Multi-language",
    desc: "40+ languages with real-time translation for global teams.",
    icon: PhGlobe,
    color: "#4b68ff",
  },
  {
    title: "Meeting Analytics",
    desc: "Talk-time, engagement heatmaps, and productivity trends.",
    icon: PhChartBar,
    color: "#8b63f5",
  },
  {
    title: "Team Collaboration",
    desc: "Share summaries and comment on transcripts together.",
    icon: PhUsersThree,
    color: "#ec4899",
  },
  {
    title: "Enterprise Security",
    desc: "SOC 2 Type II, E2E encryption, and SSO support.",
    icon: PhShieldCheck,
    color: "#22c55e",
  },
  {
    title: "Auto-Folders",
    desc: "Meetings organize by project, team, and client context.",
    icon: PhFolderSimple,
    color: "#06b6d4",
  },
  {
    title: "Follow-up Drafts",
    desc: "AI writes recap emails per participant. You just send.",
    icon: PhEnvelopeSimple,
    color: "#f59e0b",
  },
];

const scrollToFeatures = () => {
  const el = document.getElementById("features-list");
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

onMounted(() => {
  startTyping();
});
onUnmounted(() => {
  if (typingTimer) clearTimeout(typingTimer);
});
</script>

<style scoped>
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
.animate-blink {
  animation: blink 0.9s ease-in-out infinite;
}

.fade-up-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
</style>
