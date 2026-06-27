<template>
  <footer class="pt-10 pb-6 px-10 border-t border-black/5 mt-16 text-left w-full">
    <div class="flex flex-col md:flex-row justify-between gap-12 mb-12">
      <!-- Brand Column -->
      <div class="flex flex-col gap-4 max-w-sm">
        <img src="@/assets/new logo.png" alt="SmartMeet" class="h-10 block self-start" />
        <p class="text-xs text-brand-slate leading-relaxed">
          Pioneering the future of organizational intelligence through advanced voice AI and semantic analysis.
        </p>
      </div>

      <!-- Links Columns -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-12">
        <div class="flex flex-col gap-3">
          <h4 class="text-[11px] font-bold text-brand-dark tracking-wider uppercase mb-1.5">Product</h4>
          <router-link to="/features" class="text-xs text-brand-slate transition-all duration-300 hover:text-primary">Features</router-link>
          <router-link to="/#integrations" class="text-xs text-brand-slate transition-all duration-300 hover:text-primary">Integrations</router-link>
          <router-link to="/pricing" class="text-xs text-brand-slate transition-all duration-300 hover:text-primary">Pricing</router-link>
        </div>

        <div class="flex flex-col gap-3">
          <h4 class="text-[11px] font-bold text-brand-dark tracking-wider uppercase mb-1.5">Resources</h4>
          <a href="#" class="text-xs text-brand-slate transition-all duration-300 hover:text-primary" @click.prevent>Documentation</a>
          <a href="#" class="text-xs text-brand-slate transition-all duration-300 hover:text-primary" @click.prevent>API Reference</a>
          <a href="#" class="text-xs text-brand-slate transition-all duration-300 hover:text-primary" @click.prevent>Case Studies</a>
        </div>

        <div class="flex flex-col gap-3">
          <h4 class="text-[11px] font-bold text-brand-dark tracking-wider uppercase mb-1.5">Company</h4>
          <a href="#" class="text-xs text-brand-slate transition-all duration-300 hover:text-primary" @click.prevent>About Us</a>
          <a href="#" class="text-xs text-brand-slate transition-all duration-300 hover:text-primary" @click.prevent>Careers</a>
          <router-link to="/signin" class="text-xs text-brand-slate transition-all duration-300 hover:text-primary">Sign In</router-link>
        </div>

        <div class="flex flex-col gap-3">
          <h4 class="text-[11px] font-bold text-brand-dark tracking-wider uppercase mb-1.5">Connect</h4>
          <div class="flex items-center gap-3">
            <a href="#" class="bg-black/5 border border-black/10 rounded-full w-8 h-8 flex items-center justify-center text-brand-slate transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105" aria-label="Twitter">
              <PhTwitterLogo :size="16" weight="fill" />
            </a>
            <a href="#" class="bg-black/5 border border-black/10 rounded-full w-8 h-8 flex items-center justify-center text-brand-slate transition-all duration-300 hover:bg-primary/5 hover:border-primary/15 hover:text-primary hover:scale-105" aria-label="LinkedIn">
              <PhLinkedinLogo :size="16" weight="fill" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Copyright & Legal -->
    <div class="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-black/5 text-xs text-brand-slate gap-4">
      <div>
        © 2026 SmartMeet AI Inc. All rights reserved.
      </div>
      <div class="flex items-center gap-6">
        <a href="#" class="transition-colors duration-300 hover:text-primary" @click.prevent>Terms of Service</a>
        <a href="#" class="transition-colors duration-300 hover:text-primary" @click.prevent>Security</a>
        <a href="#" class="transition-colors duration-300 hover:text-primary" @click.prevent>Cookies</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { PhTwitterLogo, PhLinkedinLogo } from '@phosphor-icons/vue'
</script>
