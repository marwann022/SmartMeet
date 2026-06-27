<template>
  <section id="results" class="bg-brand-bg pt-10">
    <!-- Header -->
    <div class="max-w-[700px] mx-auto text-center mb-16 px-4 relative z-10">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/8 border border-accent/15 text-accent text-[10px] font-bold tracking-wider uppercase mb-5 font-header">
        User Testimonials
      </span>
      
      <h2 class="text-3xl sm:text-5xl font-header font-bold text-brand-dark tracking-tight mb-5 leading-tight">
        Loved by builders worldwide.
      </h2>
      
      <p class="text-base sm:text-lg text-brand-slate font-body leading-relaxed max-w-[550px] mx-auto">
        Read how leaders in design, engineering, and product use SmartMeet to keep teams aligned and build collective memory.
      </p>
    </div>

    <!-- Infinite Testimonial Marquee (Scrolls Left) -->
    <div
      role="region"
      aria-label="Customer testimonials"
      class="w-full relative py-6 overflow-hidden z-10 [mask-image:linear-gradient(to_right,transparent_0%,#000_15%,#000_85%,transparent_100%)]"
    >
      <div class="marquee-track flex gap-6 w-max animate-marquee">
        
        <div v-for="t in allTestimonials" :key="t.uid" class="testimonial-card rounded-2xl card-glass flex flex-col justify-between p-6 w-[350px] flex-shrink-0">
          <div>
            <!-- Star Rating -->
            <div class="flex gap-1 mb-4 text-amber-500 text-sm" aria-label="5 stars">★ ★ ★ ★ ★</div>
            <!-- Quote -->
            <p class="text-xs text-brand-dark font-medium leading-relaxed font-body italic mb-6">
              "{{ t.quote }}"
            </p>
          </div>

          <!-- User Profile Details -->
          <div class="flex items-center gap-3 mt-auto border-t border-black/5 pt-4">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-header font-extrabold text-[11px] text-white bg-gradient-to-tr shadow-sm select-none"
                 :class="t.avatarBg">
              {{ t.initials }}
            </div>
            
            <div class="text-left">
              <h4 class="text-xs font-bold font-header text-brand-dark">{{ t.name }}</h4>
              <p class="text-[10px] text-brand-slate font-semibold font-header">{{ t.role }}</p>
            </div>

            <!-- Company Tag (Harmonized inner radius: rounded-md) -->
            <span class="ml-auto text-[9px] font-black uppercase tracking-wider text-brand-slate font-header border border-black/5 px-2 py-1 rounded-md bg-slate-100/50">
              {{ t.company }}
            </span>
          </div>
        </div>

      </div>
    </div>

    

  </section>
</template>

<script setup>
import { computed } from 'vue'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Connor',
    role: 'VP of Product',
    company: 'Vercel',
    initials: 'SC',
    avatarBg: 'from-pink-500 to-rose-500',
    quote: 'SmartMeet completely eliminated meeting amnesia. We search for decisions made weeks ago and find the context in seconds.'
  },
  {
    id: 2,
    name: 'David Heinemeier',
    role: 'CTO & Co-founder',
    company: 'Basecamp',
    initials: 'DH',
    avatarBg: 'from-blue-500 to-indigo-500',
    quote: 'No more annoying bot avatars sitting in calls. SmartMeet records silently and compiles action items into our tools.'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    role: 'Head of Engineering',
    company: 'Linear',
    initials: 'ER',
    avatarBg: 'from-purple-500 to-violet-500',
    quote: 'The auto-compiling tasks are scary accurate. Our engineers spend more time coding and less time writing sprint tickets.'
  },
  {
    id: 4,
    name: 'Marcus Aurelius',
    role: 'Lead Architect',
    company: 'Stoic Co.',
    initials: 'MA',
    avatarBg: 'from-teal-500 to-emerald-500',
    quote: 'Captures the alignment score perfectly. We reduced our weekly sync overhead by over 30% since shifting to SmartMeet.'
  },
  {
    id: 5,
    name: 'Aisha Vance',
    role: 'Staff Product Designer',
    company: 'Airbnb',
    initials: 'AV',
    avatarBg: 'from-orange-500 to-amber-500',
    quote: 'It feels like having an automated chief of staff in every meeting room. The UI is exceptionally premium and responsive.'
  },
  {
    id: 6,
    name: 'Kenji Takahashi',
    role: 'Director of Ops',
    company: 'Stripe',
    initials: 'KT',
    avatarBg: 'from-cyan-500 to-blue-500',
    quote: 'We process thousands of minutes of audio weekly. SmartMeet acts as the ultimate reference layer for all project decisions.'
  }
]

// Single computed source-of-truth: original + duplicate for seamless marquee loop
const allTestimonials = computed(() => [
  ...testimonials.map(t => ({ ...t, uid: `a-${t.id}` })),
  ...testimonials.map(t => ({ ...t, uid: `b-${t.id}` }))
])
</script>

<style scoped>
/* High-performance non-clipped background glows */
.testimonials-section {
  background: radial-gradient(circle at 10% 80%, rgba(236, 72, 153, 0.04) 0%, rgba(255, 255, 255, 0) 50%),
              radial-gradient(circle at 90% 10%, rgba(75, 104, 255, 0.05) 0%, rgba(255, 255, 255, 0) 50%);
}

.testimonial-card {
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04), 0 1px 2px 0 rgba(255, 255, 255, 0.5) inset;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.testimonial-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px 0 rgba(31, 38, 135, 0.08), 0 1px 2px 0 rgba(241, 243, 249, 0.7) inset;
}

/* Infinite Scroll Marquee Animation */
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.marquee-track {
  animation: marquee 35s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

/* Accessibility: respect user's motion preference */
@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation-play-state: paused;
  }
}
</style>