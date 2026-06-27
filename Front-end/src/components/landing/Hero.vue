<template>
  <section
    class="bg-brand-bg relative flex flex-col justify-center items-center py-10 w-full"
  >
    <!-- Subtle Grid Overlay and Smooth Backdrop Glow -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        class="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.012)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_75%_at_50%_50%,#000_20%,transparent_90%)]"
      ></div>
    </div>

    <!-- Main Content Grid -->
    <div
      class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-6 items-center w-full relative z-10 overflow-visible"
    >
      <!-- Left Hero Column -->
      <div class="flex flex-col items-start text-left">
        <!-- AI Badge -->
        <span
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary font-header text-[10px] font-bold tracking-[0.14em] uppercase mb-8 shadow-glass transition-all duration-350 hover:scale-[1.02]"
        >
          <span class="flex h-2 w-2 relative">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"
            ></span>
            <span
              class="relative inline-flex rounded-full h-2 w-2 bg-secondary"
            ></span>
          </span>
          Next-Gen Meeting Intelligence
        </span>

        <h1
          class="text-4xl sm:text-6xl lg:text-[70px] font-bold tracking-tight leading-[1.05] mb-6 font-header text-brand-dark"
        >
          Where talks become<br />
          <span class="gradient-text-animated font-extrabold">
            structured action.
          </span>
        </h1>

        <p
          class="text-base sm:text-lg leading-relaxed text-brand-slate max-w-[560px] mb-10 font-body"
        >
          SmartMeet auto-records and transcribes your meetings in real time,
          compiling discussion points into searchable knowledge bases and
          instantly syncing action items to Slack and Jira.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-wrap gap-4 mb-12">
          <Button variant="primary" size="lg" @click="$router.push('/signup')">
            Get Started Free
            <template #icon-right>
              <PhArrowRight
                :size="14"
                weight="bold"
                class="ml-1 transition-transform duration-300 group-hover:translate-x-1"
              />
            </template>
          </Button>

          <Button
            variant="glass"
            size="lg"
            class="hover:!text-primary"
            @click="showDemoModal = true"
          >
          Explore More
        
        </Button>
        </div>

        <!-- Social Proof/Trust Row (Fixed: Uses actual image assets now) -->
        <div class="w-full border-t border-black/5 dark:border-white/5 pt-8">
          <p
            class="text-[10px] uppercase font-bold tracking-wider text-brand-slate mb-5 font-header"
          >
            Trusted by high-performing teams at
          </p>
          <div class="flex flex-wrap items-center gap-x-8 gap-y-4">
            <img
              src="../../assets/Google.png"
              alt="Google"
              width="80"
              height="20"
              class="trust-logo-img"
            />
            <img
              src="../../assets/Notion-logo.svg.png"
              alt="Notion"
              width="80"
              height="20"
              class="trust-logo-img"
            />
            <img
              src="../../assets/slack.png"
              alt="Slack"
              width="60"
              height="20"
              class="trust-logo-img"
            />
            <img
              src="../../assets/Salesforce.com_logo.svg.png"
              alt="Salesforce"
              width="90"
              height="20"
              class="trust-logo-img"
            />
          </div>
        </div>
      </div>

      <!-- Right Column: Interactive Light-Mode AI Mockup -->
      <div
        class="flex justify-center relative w-full lg:max-w-none max-w-[550px] mx-auto overflow-visible"
      >
        <!-- Main Interface Card (Harmonized Radius: rounded-[32px]) -->
        <a href="#" class="hover-3d my-12 mx-2 cursor-pointer">

          <div
            class="w-[540px] bg-white/60 dark:bg-slate-900/60 border border-white/80 dark:border-slate-800/80 rounded-[32px] shadow-glass backdrop-blur-glass overflow-hidden flex flex-col min-h-[480px] lg:h-[520px] transition-all duration-500 hover:border-white dark:hover:border-slate-700 hover:shadow-card-hover group"
          >
            <!-- Top Bar (Harmonized Radius: rounded-t-[30px]) -->
            <div
              class="bg-white/50 dark:bg-slate-800/50 border-b border-black/5 dark:border-white/5 px-6 py-4 flex items-center justify-between flex-shrink-0 rounded-t-[30px]"
            >
              <div class="flex items-center gap-3">
                <div class="flex gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-red-500/80 block"></span>
                  <span
                    class="w-3 h-3 rounded-full bg-yellow-500/80 block"
                  ></span>
                  <span class="w-3 h-3 rounded-full bg-green-500/80 block"></span>
                </div>
                <span
                  class="text-[11px] font-mono text-brand-slate select-none ml-2"
                  >SmartMeet AI Compiler v1.4</span
                >
              </div>
        
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full bg-red-500 animate-pulse"
                ></span>
                <span
                  class="text-[10px] font-bold text-red-500 uppercase tracking-wider font-header"
                  >Live Processing</span
                >
              </div>
            </div>
        
            <!-- Grid Workspace -->
            <div
              class="flex-grow grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] overflow-hidden"
            >
              <!-- Left Panel: Live Audio Feed & Transcriber -->
              <div
                class="border-r border-black/5 dark:border-white/5 p-5 flex flex-col justify-between bg-white/20 dark:bg-slate-950/20"
              >
                <!-- Top: Audio Waveform -->
                <div class="flex flex-col gap-3">
                  <div
                    class="flex justify-between items-center text-[10px] font-bold text-brand-slate uppercase tracking-wider font-header"
                  >
                    <span>Voice input feed</span>
                    <span class="text-secondary">active</span>
                  </div>
        
                  <!-- Pulsing Waveform (Harmonized Radius: rounded-xl) -->
                  <div
                    class="h-16 bg-white/40 dark:bg-slate-900/40 rounded-xl border border-black/5 dark:border-white/5 flex items-center justify-center gap-[3px] px-6 relative overflow-hidden"
                  >
                    <div
                      v-for="i in 28"
                      :key="i"
                      class="w-[3px] bg-gradient-to-t from-primary to-secondary rounded-full transform transition-all duration-300"
                      :style="{
                        height: waveformHeights[i - 1] + '%',
                      }"
                    ></div>
                  </div>
                </div>
        
                <div class="border-t border-black/5 dark:border-white/5 mt-4"></div>
        
                <!-- Bottom: Scrolling Live Transcript -->
                <div
                  class="flex-grow flex flex-col justify-start mt-4 min-h-[180px]"
                >
                  <div
                    class="text-[10px] font-bold text-brand-slate uppercase tracking-wider mb-2 font-header"
                  >
                    Realtime Transcription
                  </div>
                  <div
                    class="space-y-3 max-h-[270px] overflow-y-auto pr-1 pb-4"
                    ref="transcriptContainer"
                  >
                    <transition-group name="list">
                      <!-- Harmonized Radius: rounded-xl -->
                      <div
                        v-for="(line, idx) in visibleLines"
                        :key="line.id"
                        class="p-3 rounded-xl border text-xs transition-all duration-500 font-body"
                        :class="
                          idx === 0
                            ? 'bg-primary/5 dark:bg-primary/10 border-primary/20 text-brand-dark shadow-[0_2px_12px_rgba(75,104,255,0.03)] font-semibold'
                            : 'bg-white/30 dark:bg-slate-800/30 border-black/5 dark:border-white/5 text-brand-slate'
                        "
                      >
                        <div
                          class="flex justify-between font-bold text-[10px] uppercase tracking-wider mb-1"
                          :class="idx === 0 ? 'text-primary' : 'text-brand-slate'"
                        >
                          <span>{{ line.speaker }}</span>
                          <span>{{ line.time }}</span>
                        </div>
                        <p class="leading-relaxed select-none">
                          {{ idx === 0 ? typedText : line.text }}
                        </p>
                      </div>
                    </transition-group>
                  </div>
                </div>
              </div>
        
              <!-- Right Panel: AI Compiled Action Items -->
              <div class="p-5 flex flex-col justify-between bg-white/40 dark:bg-slate-900/40">
                <div class="flex flex-col gap-4">
                  <div
                    class="flex justify-between items-center text-[10px] font-bold text-brand-slate uppercase tracking-wider font-header"
                  >
                    <span>AI Extracted Items</span>
                    <span
                      class="inline-flex px-1.5 py-0.5 rounded bg-secondary/10 text-secondary text-[8px] tracking-normal font-mono"
                      >{{ compiledTasks.length }} extracted</span
                    >
                  </div>
        
                  <!-- Compiled Tasks Checklist -->
                  <div class="space-y-3 max-h-[290px] overflow-y-auto ">
                    <transition-group name="task-slide">
                      <!-- Harmonized Radius: rounded-xl (from rounded-2xl to match nested rule inside p-5) -->
                      <div
                        v-for="task in compiledTasks"
                        :key="task.id"
                        class="p-3.5 rounded-xl bg-white dark:bg-slate-950/80 border border-black/5 dark:border-white/5 shadow-sm flex items-start gap-3 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
                      >
                        <!-- Checked indicator -->
                        <div
                          class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300"
                          :class="
                            task.done
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-50 dark:bg-slate-900 border border-black/10 dark:border-white/10 text-transparent'
                          "
                        >
                          <PhCheck :size="10" weight="bold" />
                        </div>
        
                        <div class="flex-grow">
                          <div
                            class="flex justify-between items-start gap-2 mb-1"
                          >
                            <span
                              class="text-xs font-bold font-header text-brand-dark"
                              :class="{
                                'line-through text-brand-slate font-medium':
                                  task.done,
                              }"
                            >
                              {{ task.title }}
                            </span>
                            <span
                              class="text-[8px] font-bold font-header px-1.5 py-0.5 rounded uppercase flex-shrink-0"
                              :class="
                                task.priority === 'High'
                                  ? 'bg-red-500/10 text-red-600 border border-red-500/15'
                                  : 'bg-amber-500/10 text-amber-600 border border-amber-500/15'
                              "
                            >
                              {{ task.priority }}
                            </span>
                          </div>
        
                          <div
                            class="flex justify-between items-center mt-2 text-[9px] text-brand-slate font-semibold font-header"
                          >
                            <span class="flex items-center gap-1">
                              <span
                                class="w-1.5 h-1.5 rounded-full bg-brand-slate"
                              ></span>
                              {{ task.owner }}
                            </span>
                            <span
                              class="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase font-mono"
                              >{{ task.tool }}</span
                            >
                          </div>
                        </div>
                      </div>
                    </transition-group>
        
                    <!-- Skeleton Placeholder when empty -->
                    <div
                      v-if="compiledTasks.length === 0"
                      class="flex flex-col items-center justify-center h-44 text-center text-brand-slate opacity-60"
                    >
                      <div
                        class="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-3"
                      ></div>
                      <span class="text-xs font-mono"
                        >Listening for directives...</span
                      >
                    </div>
                  </div>
                </div>
        
                <!-- Bottom Tags -->
                <div class="border-t border-black/5 dark:border-white/5 pt-4">
                  <div
                    class="text-[9px] font-bold text-brand-slate uppercase tracking-wider mb-2 font-header"
                  >
                    Semantic tags compiled
                  </div>
                  <div class="flex flex-wrap gap-1.5">
                    <!-- Harmonized Radius: rounded-full (pills are exempt from nested rule) -->
                    <span
                      v-for="tag in activeTags"
                      :key="tag"
                      class="text-[9px] font-bold font-header px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-black/5 dark:border-white/5 text-brand-slate"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
  <!-- 8 empty divs needed for the 3D effect -->
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</a>

    </div>
  </div>

    <!-- Reusable Modal for Watch Demo (Harmonized Radius: rounded-[24px]) -->
    <Modal
      :show="showDemoModal"
      title="SmartMeet AI Overview"
      @close="showDemoModal = false"
      maxWidth="lg"
    >
      <div class="flex flex-col gap-5 text-left font-body">
        <p class="text-brand-slate text-sm">
          Watch how SmartMeet records voice data silently and pushes structured
          summaries, tags, and action items directly to your tools.
        </p>

        <!-- Video Player Mockup (Harmonized Radius: rounded-xl) -->
        <div
          class="w-full aspect-video rounded-xl bg-slate-950 border border-black/10 relative overflow-hidden flex flex-col justify-between p-4 shadow-inner"
        >
          <div
            class="absolute inset-0 flex items-center justify-center bg-slate-950/80 flex-col gap-3"
          >
            <!-- Pulsing Play Button -->
            <button
              @click="startDemo"
              class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-xl hover:scale-105 hover:bg-primary/95 transition-all duration-350 focus:outline-none cursor-pointer"
            >
              <PhPlay :size="24" weight="fill" class="ml-1 text-white" />
            </button>
            <span
              v-if="demoStarted"
              class="text-[10px] text-green-400 font-mono font-bold uppercase tracking-widest animate-pulse"
              >▶ Playing demo...</span
            >
          </div>

          <div
            class="text-[10px] font-mono text-slate-500 uppercase tracking-widest"
          >
            smartmeet_intro_hd_1080p.mp4
          </div>
          <div
            class="w-full flex justify-between items-center text-[10px] font-mono text-slate-500"
          >
            <span>0:00 / 2:14</span>
            <span>1080p HD</span>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <Button variant="outline" @click="showDemoModal = false">
            Close Demo
          </Button>
        </div>
      </div>
    </Modal>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { PhArrowRight, PhPlay, PhCheck, PhArrowUpRight } from "@phosphor-icons/vue";
import Button from "../ui/Button.vue";
import Modal from "../ui/Modal.vue";

const showDemoModal = ref(false);
const demoStarted = ref(false);

const startDemo = () => {
  demoStarted.value = true;
};

// Waveform Simulation Heights
const waveformHeights = ref(
  Array.from({ length: 28 }, () => Math.floor(Math.random() * 60) + 10),
);
let waveformInterval = null;
// Use an array to track ALL pending timers so none leak on unmount
const pendingTimers = [];

const safeTimeout = (fn, delay) => {
  const id = setTimeout(fn, delay);
  pendingTimers.push(id);
  return id;
};

const startWaveformSimulation = () => {
  waveformInterval = setInterval(() => {
    waveformHeights.value = waveformHeights.value.map(
      () => Math.floor(Math.random() * 80) + 15,
    );
  }, 120);
};

// Interactive Transcript & Task Compilation Loop
const fullScript = [
  {
    id: 1,
    speaker: "Alex (Product)",
    text: "Let's finalize our launch roadmap for the AI meeting sync next week.",
    time: "0:02",
    task: {
      id: 101,
      title: "Finalize launch roadmap",
      owner: "Alex",
      priority: "High",
      tool: "Jira",
      done: false,
    },
    tags: ["#q3-launch"],
  },
  {
    id: 2,
    speaker: "Sarah (Design)",
    text: "The mockups are ready. We need to review the marquee UI and bento layouts.",
    time: "0:14",
    task: {
      id: 102,
      title: "Review marquee UI mockups",
      owner: "Sarah",
      priority: "Medium",
      tool: "Notion",
      done: false,
    },
    tags: ["#design"],
  },
  {
    id: 3,
    speaker: "Marwan (Engineering)",
    text: "Perfect. I will implement the custom CSS keyframes and timeline code today.",
    time: "0:26",
    task: {
      id: 103,
      title: "Implement CSS keyframe code",
      owner: "Marwan",
      priority: "High",
      tool: "Github",
      done: false,
    },
    tags: ["#frontend"],
  },
  {
    id: 4,
    speaker: "Alex (Product)",
    text: "Great work team. Let's push this live after completing our checklist.",
    time: "0:38",
    task: null,
    doneTaskId: 101,
    tags: ["#deployment", "#shipped"],
  },
];

const visibleLines = ref([]);
const compiledTasks = ref([]);
const activeTags = ref(["#sync-active"]);
const typedText = ref("");
const transcriptContainer = ref(null);

let keyCounter = 0;

const runSimulation = () => {
  let step = 0;

  const processNextStep = () => {
    if (step >= fullScript.length) {
      safeTimeout(() => {
        visibleLines.value = [];
        compiledTasks.value = [];
        activeTags.value = ["#sync-active"];
        typedText.value = "";
        step = 0;
        processNextStep();
      }, 4000);
      return;
    }

    const currentItem = fullScript[step];

    const newLineObj = {
      id: `line-${keyCounter++}`,
      speaker: currentItem.speaker,
      text: currentItem.text,
      time: currentItem.time,
    };
    visibleLines.value.unshift(newLineObj);
    if (visibleLines.value.length > 3) {
      visibleLines.value.pop();
    }
    typedText.value = "";

    nextTick(() => {
      if (transcriptContainer.value) {
        transcriptContainer.value.scrollTop = 0;
      }
    });

    let charIdx = 0;
    const typeSpeed = 25;

    const typeChar = () => {
      if (charIdx < currentItem.text.length) {
        typedText.value += currentItem.text.charAt(charIdx);
        charIdx++;
        // Auto scroll to top while typing to ensure new text remains visible
        nextTick(() => {
          if (transcriptContainer.value) {
            transcriptContainer.value.scrollTop = 0;
          }
        });
        safeTimeout(typeChar, typeSpeed);
      } else {
        if (currentItem.task) {
          compiledTasks.value.push({
            ...currentItem.task,
            id: `task-${keyCounter++}`,
          });
        }
        currentItem.tags.forEach((tag) => {
          if (!activeTags.value.includes(tag)) {
            activeTags.value.push(tag);
          }
        });
        if (currentItem.doneTaskId) {
          const taskToComplete = compiledTasks.value.find(
            (t) => t.title === "Finalize launch roadmap",
          );
          if (taskToComplete) {
            taskToComplete.done = true;
          }
        }
        step++;
        safeTimeout(processNextStep, 2500);
      }
    };

    typeChar();
  };

  processNextStep();
};

onMounted(() => {
  startWaveformSimulation();
  runSimulation();
});

onUnmounted(() => {
  if (waveformInterval) clearInterval(waveformInterval);
  // Clear ALL pending timers to prevent leaks
  pendingTimers.forEach((id) => clearTimeout(id));
  pendingTimers.length = 0;
});
</script>

<style scoped>
/* High-performance CSS radial gradients directly on the section to avoid clipping boundaries */
.hero-section {
  background:
    radial-gradient(
      circle at 0% 0%,
      rgba(75, 104, 255, 0.06) 0%,
      rgba(75, 104, 255, 0.02) 50%,
      rgba(75, 104, 255, 0) 100%
    ),
    radial-gradient(
      circle at 100% 100%,
      rgba(6, 182, 212, 0.05) 0%,
      rgba(6, 182, 212, 0.01) 50%,
      rgba(6, 182, 212, 0) 100%
    );
}

/* Keyframe Animations */
@keyframes pulseSlow {
  0%,
  100% {
    transform: scale(1) translate(0px, 0px);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.03) translate(5px, 8px);
    opacity: 1;
  }
}

.animate-pulse-slow {
  animation: pulseSlow 9s ease-in-out infinite alternate;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Gradient text animation — must set background-size AND bg-clip together in one class */
.gradient-text-animated {
  background-image: linear-gradient(90deg, #4b68ff, #06b6d4, #ec4899, #4b68ff);
  background-size: 250% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  animation: gradientShift 6s ease-in-out infinite;
}

/* Transcript list transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.list-move {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Custom scrollbar for premium feel */
div::-webkit-scrollbar {
  width: 4px;
}
div::-webkit-scrollbar-track {
  background: transparent;
}
div::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 9999px;
}
div::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.12);
}

/* Task compiler transitions */
.task-slide-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.task-slide-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.93);
}

.trust-logo-img {
  height: 20px;
  width: auto;
  object-fit: contain;
  filter: grayscale(100%) opacity(0.4) brightness(0.6);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.trust-logo-img:hover {
  filter: grayscale(0%) opacity(0.95) brightness(1);
  transform: scale(1.08);
}

:global(.dark) .trust-logo-img {
  filter: grayscale(100%) opacity(0.45) brightness(2) invert(1);
}

:global(.dark) .trust-logo-img:hover {
  filter: grayscale(0%) opacity(0.95) brightness(1.2) invert(0);
}
</style>
