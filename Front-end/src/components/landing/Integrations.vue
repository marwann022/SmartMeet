<template>
  <section
    id="integrations"
    class="py-8 border-t border-black/5 w-full"
  >
    <!-- Header -->
    <div
      class="max-w-[700px] mx-auto text-center mb-16 px-4"
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
        UNIVERSAL COMPATIBILITY
      </span>

      <h2
        class="
        text-3xl
        sm:text-5xl
        lg:text-6xl

        font-bold
        font-header

        tracking-tight

        text-brand-dark

        mt-5
        mb-5
        "
      >
        Works with your existing tools.
      </h2>

      <p
        class="
        text-base
        sm:text-lg

        text-brand-slate

        leading-relaxed
        "
      >
        Connect SmartMeet with the platforms your team
        already uses and automatically turn conversations
        into actionable knowledge.
      </p>
    </div>

<!-- Integrations Grid -->
<div
  class="
  grid
  grid-cols-2
  lg:grid-cols-4

  gap-6

  max-w-[1100px]
  mx-auto

  px-4
  "
>

  <!-- Google Meet -->
  <div class="integration-card group">
    <img
      src="../../assets/Google_Meet_icon_(2020).svg.png"
      alt="Google Meet"
      class="integration-logo"
    />

    <span class="integration-name">
      Google Meet
    </span>
  </div>

  <!-- Slack -->
  <div class="integration-card group">
    <img
      src="../../assets/slack.png"
      alt="Slack"
      class="integration-logo"
    />

    <span class="integration-name">
      Slack
    </span>
  </div>

  <!-- Notion -->
  <div class="integration-card group">
    <img
      src="../../assets/Notion-logo.svg.png"
      alt="Notion"
      class="integration-logo"
    />

    <span class="integration-name">
      Notion
    </span>
  </div>

  <!-- Salesforce -->
  <div class="integration-card group">
    <img
      src="../../assets/Salesforce.com_logo.svg.png"
      alt="Salesforce"
      class="integration-logo"
    />

    <span class="integration-name">
      Salesforce
    </span>
  </div>

</div>
  </section>
</template>

<script setup>
// Static Component
</script>

<style scoped>
.integration-card {
  position: relative;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.70);
  border-radius: 24px;
  height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 500ms;
  box-shadow:
    0 4px 20px rgba(0,0,0,0.03);
}

.integration-card:hover {
  transform:
    translateY(-8px)
    scale(1.03);

  border-color:
    rgba(75,104,255,0.25);

  box-shadow:
    0 20px 45px rgba(75,104,255,0.12);
}

.integration-logo {
  height: 42px;
  width: auto;

  max-width: 120px;

  object-fit: contain;

  filter: grayscale(100%);
  opacity: .6;

  transition: all .35s ease;
}

.integration-card:hover .integration-logo {
  filter: grayscale(0%);
  opacity: 1;
}

.integration-name {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.integration-card:hover .integration-name {
  color: #111827;
}

.coming-soon {
  position: absolute;

  top: 10px;
  right: 10px;

  font-size: 9px;
  font-weight: 700;

  color: #4b68ff;

  background:
    rgba(75,104,255,.08);

  border:
    1px solid rgba(75,104,255,.15);

  border-radius: 999px;

  padding:
    4px 8px;
}
</style>