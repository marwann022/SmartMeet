```vue
<template>
  <section
    id="workflow"
    class="py-8 border-t border-black/5"
  >
    <!-- Header -->
    <div
      class="
      max-w-[700px]
      mx-auto
      text-center
      mb-16
      px-4
      "
    >
      <span
        class="
        text-[10px]
        font-bold
        tracking-[0.18em]
        text-primary
        uppercase
        font-header
        "
      >
        HOW IT WORKS
      </span>

      <h2
        class="
        text-3xl
        sm:text-5xl
        lg:text-6xl

        font-bold
        font-header

        tracking-tight

        mt-5
        mb-5

        text-brand-dark
        "
      >
        From conversation to action.
      </h2>

      <p
        class="
        text-base
        sm:text-lg

        text-brand-slate

        leading-relaxed
        "
      >
        SmartMeet automatically captures,
        analyzes, and organizes every meeting
        into searchable company knowledge.
      </p>
    </div>

    <div
      class="
      grid
      grid-cols-1
      lg:grid-cols-[1fr_1fr]

      gap-16
      items-center
      "
    >

      <!-- Left Side -->
      <div class="relative">

        <!-- Timeline Line -->
        <div
          class="
          absolute

          left-5
          top-16
          bottom-16

          w-[2px]

          bg-gradient-to-b
          from-primary
          via-secondary
          to-primary

          hidden
          sm:block
          "
        ></div>

        <div
          v-for="(step, index) in steps"
          :key="index"
          @click="selectStep(index)"
          class="
          relative

          mb-6

          rounded-[28px]

          card-glass

          p-7

          cursor-pointer

          transition-all
          duration-500
          "
          :class="{
            'scale-[1.02] border-primary/20 shadow-[0_20px_40px_rgba(75,104,255,0.12)]':
              currentWorkflowStep === index
          }"
        >

          <div class="flex gap-5">

            <div
              class="
              w-10
              h-10

              rounded-full

              flex
              items-center
              justify-center

              font-bold

              transition-all
              duration-500
              "
              :class="
                currentWorkflowStep === index
                  ? 'bg-grad-primary text-white shadow-[0_4px_12px_rgba(75,104,255,0.2)]'
                  : 'bg-black/5 text-brand-slate'
              "
            >
              0{{ index + 1 }}
            </div>

            <div>
              <h3
                class="
                text-lg
                font-bold

                text-brand-dark

                mb-2
                "
              >
                {{ step.title }}
              </h3>

              <p
                class="
                text-sm
                leading-relaxed

                text-brand-slate
                "
              >
                {{ step.desc }}
              </p>
            </div>

          </div>

        </div>

      </div>

      <!-- Right Side -->
      <div
        class="
        flex
        justify-center

        relative
        "
      >

        <div
          class="
          card-glass

          rounded-[32px]

          p-10

          w-full
          max-w-[520px]

          relative

          overflow-hidden

          transition-all
          duration-700

          hover:-translate-y-2
          hover:shadow-[0_25px_60px_rgba(75,104,255,0.12)]
          "
        >

          <!-- Glow -->
          <div
            class="
            absolute

            w-[250px]
            h-[250px]

            bg-primary/10

            rounded-full

            blur-[90px]

            top-10
            right-0
            "
          ></div>

          <!-- Image -->
          <img
            src="../../assets/Workflow Visualization.png"
            alt="Workflow Visualization"
            class="
            relative

            z-10

            w-full

            object-contain

            transition-all
            duration-700

            hover:scale-[1.03]
            "
          />

          <!-- Tags -->
          <div
            class="
            mt-8

            flex
            flex-wrap

            justify-center

            gap-3
            "
          >

            <span class="workflow-tag">
              Transcript
            </span>

            <span class="workflow-tag">
              AI Summary
            </span>

            <span class="workflow-tag">
              Action Items
            </span>

            <span class="workflow-tag">
              Decisions
            </span>

            <span class="workflow-tag">
              Knowledge AI
            </span>

          </div>

        </div>

      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentWorkflowStep = ref(0)

const steps = [
  {
    title: 'Meeting Captured',
    desc: 'Connect SmartMeet to Google Meet, Zoom, or Microsoft Teams and automatically record conversations.'
  },
  {
    title: 'AI Analysis',
    desc: 'Generate summaries, decisions, action items, meeting highlights, and intelligent insights instantly.'
  },
  {
    title: 'Knowledge Stored',
    desc: 'Every conversation becomes searchable company memory available through Knowledge AI.'
  }
]

let workflowInterval = null

const selectStep = (index) => {
  currentWorkflowStep.value = index
  resetWorkflowTimer()
}

const startWorkflowTimer = () => {
  workflowInterval = setInterval(() => {
    currentWorkflowStep.value =
      (currentWorkflowStep.value + 1) % steps.length
  }, 5000)
}

const resetWorkflowTimer = () => {
  if (workflowInterval) clearInterval(workflowInterval)
  startWorkflowTimer()
}

onMounted(() => {
  startWorkflowTimer()
})

onUnmounted(() => {
  if (workflowInterval) clearInterval(workflowInterval)
})
</script>

<style scoped>
.workflow-tag {
  background: rgba(75, 104, 255, 0.08);
  border: 1px solid rgba(75, 104, 255, 0.15);

  padding: 8px 14px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;

  color: #4b68ff;

  transition: all 0.3s ease;
}

.workflow-tag:hover {
  background: rgba(75, 104, 255, 0.15);
  transform: translateY(-2px);
}
</style>
```
