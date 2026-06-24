<template>
  <section id="integrations" class="integrations-section py-20 border-t border-black/5 w-full relative overflow-hidden">
    <div class="max-w-[700px] mx-auto text-center mb-16 px-4 relative z-10">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 border border-primary/15 text-primary text-[10px] font-bold tracking-wider uppercase mb-5 font-header">
        Ecosystem Connectivity
      </span>
      
      <h2 class="text-3xl sm:text-5xl font-header font-bold text-brand-dark tracking-tight mb-5 leading-tight">
        Connects with your stack.
      </h2>
      
      <p class="text-base sm:text-lg text-brand-slate font-body leading-relaxed max-w-[550px] mx-auto">
        Push transcripts, action items, tags, and context directly into the tools your product and engineering teams already live in.
      </p>
    </div>

    <!-- Integrations Grid (Fixed: Added rounded-3xl class to cards) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1000px] mx-auto px-4 relative z-10">
      
      <!-- Google Meet -->
      <div class="integration-card card-glass rounded-3xl group">
        <div class="logo-wrapper">
          <img src="../../assets/Google_Meet_icon_(2020).svg.png" alt="Google Meet" class="integration-logo" />
        </div>
        <span class="integration-name">Google Meet</span>
        <span class="coming-soon">Auto-sync</span>
      </div>

      <!-- Slack -->
      <div class="integration-card card-glass rounded-3xl group">
        <div class="logo-wrapper">
          <img src="../../assets/slack.png" alt="Slack" class="integration-logo" />
        </div>
        <span class="integration-name">Slack</span>
        <span class="coming-soon">Instant Alerts</span>
      </div>

      <!-- Notion -->
      <div class="integration-card card-glass rounded-3xl group">
        <div class="logo-wrapper">
          <img src="../../assets/Notion-logo.svg.png" alt="Notion" class="integration-logo" />
        </div>
        <span class="integration-name">Notion DB</span>
        <span class="coming-soon">Knowledge Wiki</span>
      </div>

      <!-- Salesforce -->
      <div class="integration-card card-glass rounded-3xl group">
        <div class="logo-wrapper">
          <img src="../../assets/Salesforce.com_logo.svg.png" alt="Salesforce" class="integration-logo animate-float" />
        </div>
        <span class="integration-name">Salesforce CRM</span>
        <span class="coming-soon">Contact Link</span>
      </div>

    </div>
  </section>
</template>

<script setup>
// Static presentation component
</script>

<style scoped>
/* High-performance non-clipped background glows */
.integrations-section {
  background: radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.04) 0%, rgba(255, 255, 255, 0) 60%);
}

.integration-card {
  position: relative;
  height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.logo-wrapper {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.integration-logo {
  max-height: 44px;
  width: auto;
  max-width: 120px;
  object-fit: contain;
  filter: grayscale(100%) opacity(0.5);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.integration-card:hover .integration-logo {
  filter: grayscale(0%) opacity(1);
  transform: scale(1.08);
}

.integration-name {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  font-family: 'Montserrat', sans-serif;
  transition: color 0.3s ease;
}

.integration-card:hover .integration-name {
  color: #0f172a;
}

.coming-soon {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 8px;
  font-weight: 800;
  font-family: 'Montserrat', sans-serif;
  color: #06b6d4;
  background: rgba(6, 182, 212, 0.08);
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 999px;
  padding: 3px 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.85;
}
</style>