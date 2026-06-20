<template>
  <div class="card-glass rounded-[28px] overflow-hidden border border-white/80 shadow-glass backdrop-blur-md">
    <div class="overflow-x-auto">
      <table class="table w-full text-left border-collapse">
        <thead>
          <tr class="bg-black/[0.02] border-b border-black/5 text-[11px] font-extrabold text-brand-slate tracking-wider uppercase">
            <th class="py-[20px] px-[24px]">Meeting Name</th>
            <th class="py-[20px] px-[24px]">Platform / Type</th>
            <th class="py-[20px] px-[24px]">Date Scheduled</th>
            <th class="py-[20px] px-[24px]">Duration</th>
            <th class="py-[20px] px-[24px] text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-black/5 text-sm">
          <tr 
            v-for="meeting in meetings" 
            :key="meeting.id" 
            class="hover:bg-primary/[0.02] transition-colors cursor-pointer group"
            @click="$emit('select', meeting)"
          >
            <!-- Title & Description -->
            <td class="py-[16px] px-[24px] max-w-sm">
              <div class="font-bold text-brand-dark group-hover:text-primary transition-colors">{{ meeting.title }}</div>
              <div class="text-xs text-brand-slate mt-1 truncate max-w-xs">{{ meeting.description || 'No description provided.' }}</div>
            </td>
            <!-- Platform Badge -->
            <td class="py-[16px] px-[24px]">
              <span class="inline-flex items-center px-[10px] py-[2px] rounded-md text-[10px] font-extrabold tracking-wider uppercase border border-primary/10 bg-primary/5 text-primary">
                {{ meeting.type }}
              </span>
            </td>
            <!-- Date -->
            <td class="py-[16px] px-[24px] font-medium text-brand-slate">
              {{ meeting.date }}
            </td>
            <!-- Duration -->
            <td class="py-[16px] px-[24px] font-medium text-brand-slate">
              {{ meeting.duration }}
            </td>
            <!-- Action link -->
            <td class="py-[16px] px-[24px] text-right" @click.stop>
              <button 
                @click="$emit('select', meeting)"
                class="px-[16px] py-[6px] rounded-lg bg-primary/8 text-primary hover:bg-primary hover:text-white font-bold text-xs transition-all duration-200 cursor-pointer"
              >
                Review
              </button>
            </td>
          </tr>

          <tr v-if="meetings.length === 0">
            <td colspan="5" class="py-12 text-center text-brand-slate italic">
              No archived meetings found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  meetings: {
    type: Array,
    required: true
  }
})

defineEmits(['select'])
</script>
