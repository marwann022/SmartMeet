<template>
  <section
    id="results"
    class="py-24 border-t border-black/5 w-full"
  >
    <!-- Header -->
    <div
      class="
      text-center
      max-w-[700px]
      mx-auto

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
        REAL IMPACT
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
        Teams save hours every week.
      </h2>

      <p
        class="
        text-base
        sm:text-lg

        text-brand-slate

        leading-relaxed
        "
      >
        SmartMeet transforms conversations into
        actionable knowledge, helping teams move
        faster and stay aligned.
      </p>
    </div>

    <!-- Metrics Grid -->
    <div
      class="
      grid
      grid-cols-1
      md:grid-cols-2
      lg:grid-cols-4

      gap-6
      "
    >

      <!-- Card 1 -->
      <div class="metric-card">
        <div class="metric-number">
          40K+
        </div>

        <div class="metric-title">
          Meetings Processed
        </div>

        <p class="metric-desc">
          AI-powered summaries generated across thousands of conversations.
        </p>
      </div>

      <!-- Card 2 -->
      <div class="metric-card">
        <div class="metric-number">
          120K+
        </div>

        <div class="metric-title">
          Tasks Generated
        </div>

        <p class="metric-desc">
          Automatically extracted action items and follow-ups.
        </p>
      </div>

      <!-- Card 3 -->
      <div class="metric-card">
        <div class="metric-number">
          92%
        </div>

        <div class="metric-title">
          Alignment Score
        </div>

        <p class="metric-desc">
          Teams stay synchronized with searchable meeting knowledge.
        </p>
      </div>

      <!-- Card 4 -->
      <div class="metric-card">
        <div class="metric-number">
          31%
        </div>

        <div class="metric-title">
          Less Meeting Time
        </div>

        <p class="metric-desc">
          Faster decision making and fewer repetitive discussions.
        </p>
      </div>

    </div>

    <!-- Bottom Banner -->
    <div
      class="
      mt-16

      rounded-[32px]

      card-glass

      p-8
      sm:p-10

      text-center
      "
    >
      <div
        class="
        text-primary

        font-bold

        text-sm

        uppercase

        tracking-wider

        mb-3
        "
      >
        SmartMeet AI
      </div>

      <h3
        class="
        text-2xl
        sm:text-3xl

        font-bold

        text-brand-dark

        mb-4
        "
      >
        Your organization's memory layer.
      </h3>

      <p
        class="
        text-brand-slate

        max-w-[700px]

        mx-auto
        "
      >
        Search every meeting, retrieve every decision,
        and never lose important context again.
      </p>
    </div>

  </section>
</template>

<script setup>
// Static Component
</script>

<style scoped>
.metric-card {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(16px);

  border: 1px solid rgba(255, 255, 255, 0.7);

  border-radius: 28px;

  padding: 2rem;

  text-align: left;

  transition: all 0.5s ease;
}

.metric-card:hover {
  transform:
    translateY(-8px)
    scale(1.02);

  box-shadow:
    0 20px 50px rgba(75,104,255,0.12);
}

.metric-number {
  font-size: 3rem;
  line-height: 1;

  font-weight: 800;

  background: linear-gradient(
    135deg,
    #4b68ff,
    #7f8cff
  );

  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  margin-bottom: 16px;
}

.metric-title {
  font-size: 1rem;
  font-weight: 700;

  color: #111827;

  margin-bottom: 12px;
}

.metric-desc {
  font-size: .875rem;
  line-height: 1.7;

  color: #64748b;
}
</style>