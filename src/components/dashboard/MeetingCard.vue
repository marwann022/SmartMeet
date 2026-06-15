<template>
  <div 
    @click="$emit('click')"
    class="card-glass rounded-[28px] p-[24px] flex flex-col justify-between min-h-[200px] hover:translate-y-[-2px] transition-all cursor-pointer text-left border border-white/80 shadow-glass backdrop-blur-md hover:shadow-card-hover hover:border-white/95"
  >
    <div class="flex justify-between items-start">
      <div class="w-[40px] h-[40px] rounded-xl bg-primary/6 border border-primary/15 flex items-center justify-center text-primary shadow-sm flex-shrink-0 transition-transform duration-300 hover:scale-105">
        <PhVideoCamera v-if="meeting.type === 'Zoom' || meeting.type === 'Google Meet'" :size="20" weight="bold" />
        <PhUser v-else :size="20" weight="bold" />
      </div>
      <span class="inline-block text-[9px] font-extrabold px-[8px] py-[2px] rounded-md self-start tracking-wider uppercase border bg-secondary/8 border-secondary/15 text-secondary">
        {{ meeting.type }}
      </span>
    </div>
    
    <div class="my-[16px]">
      <h4 class="text-[18px] font-bold font-header text-brand-dark mb-[6px]">{{ meeting.title }}</h4>
      <p class="text-[12px] sm:text-[14px] leading-relaxed text-brand-slate line-clamp-3">
        AI Summary: {{ meeting.bullets ? meeting.bullets[0] : meeting.description }}
      </p>
    </div>
    
    <div class="flex justify-between items-center border-t border-black/5 pt-[14px] text-[12px] text-brand-slate font-semibold">
      <span>{{ meeting.duration }}</span>
      <span>{{ meeting.participantsCount || meeting.participants?.length || 0 }} participants</span>
    </div>
  </div>
</template>

<script setup>
import { PhVideoCamera, PhUser } from '@phosphor-icons/vue'

defineProps({
  meeting: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
