<template>
  <div class="flex flex-col gap-8 text-left mt-8">
    
    <!-- Detail View Active -->
    <div v-if="meetingStore.selectedMeeting" class="flex flex-col gap-8 animate-fade-in">
      <!-- Back button and title -->
      <div class="flex flex-col gap-4">
        <div>
          <Button 
            variant="glass"
            @click="meetingStore.selectedMeeting = null" 
          >
            <template #icon-left>
              <PhArrowLeft :size="14" weight="bold" />
            </template>
            Back to Archive
          </Button>
        </div>

        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <Badge type="primary">
              {{ meetingStore.selectedMeeting.type }}
            </Badge>
            <span class="text-sm font-semibold text-brand-slate">• {{ meetingStore.selectedMeeting.duration }}</span>
            <span class="text-sm font-semibold text-brand-slate">• {{ meetingStore.selectedMeeting.date }}</span>
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold font-header text-brand-dark tracking-tight leading-tight">
            {{ meetingStore.selectedMeeting.title }}
          </h2>
          <p class="text-sm text-brand-slate max-w-2xl leading-relaxed">
            {{ meetingStore.selectedMeeting.description || 'No description provided.' }}
          </p>
        </div>
      </div>

      <!-- Bento Grid Content layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left Side (Col-8 span): Executive Summary & Action Items -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          <!-- Executive Summary -->
          <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-5 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <PhBrain :size="120" />
            </div>
            
            <div class="flex justify-between items-center pb-4 border-b border-black/5">
              <div class="flex items-center gap-2.5">
                <PhSparkle :size="20" class="text-primary" />
                <h3 class="font-header font-bold text-lg text-brand-dark">Executive Summary</h3>
              </div>
              <Badge type="primary">AI Generated</Badge>
            </div>

            <div class="flex flex-col gap-4 text-sm leading-relaxed text-brand-slate">
              <p class="text-[15px] font-medium text-brand-dark">
                The team successfully aligned on the <span class="font-bold text-primary">North Star goals</span>. Key discussions centered around the trade-offs between speed of delivery, debt reconciliation, and developer scaling requirements.
              </p>
              
              <ul class="flex flex-col gap-3.5 list-disc pl-5">
                <li v-for="(bullet, index) in meetingStore.selectedMeeting.bullets" :key="index">
                  {{ bullet }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Meeting Timeline -->
          <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
            <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
              <PhCalendarBlank :size="20" class="text-primary" />
              <h3 class="font-header font-bold text-lg text-brand-dark">Meeting Timeline</h3>
            </div>

            <!-- Timeline checkpoints list -->
            <div class="relative py-4">
              <!-- Connector line -->
              <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-black/5 -translate-y-1/2 z-0 hidden md:block"></div>
              
              <div class="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                <div v-for="(item, idx) in meetingStore.selectedMeeting.timeline" :key="idx" class="flex md:flex-col items-center md:text-center gap-4 md:gap-3">
                  <div class="w-10 h-10 rounded-full bg-white border border-black/8 shadow-sm flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 transition-transform hover:scale-105" :class="idx === 0 ? 'border-primary shadow-[0_0_10px_rgba(75,104,255,0.15)] ring-2 ring-primary/20' : ''">
                    {{ item.time }}
                  </div>
                  <div class="flex flex-col md:items-center text-left md:text-center">
                    <span class="text-xs font-extrabold text-brand-slate uppercase tracking-wider">{{ item.time }}</span>
                    <span class="text-sm font-bold text-brand-dark mt-0.5">{{ item.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Items -->
          <div class="card-glass rounded-[28px] p-6 sm:p-8 flex flex-col gap-6">
            <div class="flex justify-between items-center pb-4 border-b border-black/5">
              <div class="flex items-center gap-2.5">
                <PhCheckSquare :size="20" class="text-primary" />
                <h3 class="font-header font-bold text-lg text-brand-dark">Action Items</h3>
              </div>
              
              <Badge :type="completionRate === 100 ? 'success' : 'primary'">
                {{ completionRate }}% Completed
              </Badge>
            </div>

            <!-- Checklist -->
            <div class="flex flex-col gap-3">
              <div 
                v-for="task in meetingStore.selectedMeeting.tasks" 
                :key="task.id"
                @click="toggleTask(task)"
                class="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-black/[0.03] cursor-pointer hover:bg-white/70 hover:border-black/5 hover:translate-x-0.5 transition-all duration-200 select-none"
              >
                <!-- Custom Checkbox -->
                <div 
                  class="w-[22px] h-[22px] rounded-lg border-2 border-brand-slate/40 flex items-center justify-center flex-shrink-0 transition-all"
                  :class="task.checked ? 'border-primary bg-primary text-white' : ''"
                >
                  <PhCheck v-if="task.checked" :size="12" weight="bold" />
                </div>
                
                <div class="flex-1 text-left">
                  <span class="text-sm font-bold text-brand-dark transition-all block" :class="task.checked ? 'line-through text-brand-slate opacity-70' : ''">
                    {{ task.title }}
                  </span>
                  <span class="text-xs text-brand-slate mt-0.5 block">Assigned to: {{ task.assignee }}</span>
                </div>

                <Badge :type="task.priority === 'HIGH' ? 'danger' : task.priority === 'MED' ? 'primary' : 'default'">
                  {{ task.priority }}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side (Col-4 span): Decision Tracker & Smart Transcript -->
        <div class="lg:col-span-4 flex flex-col gap-6">
          <!-- Decision Tracker -->
          <div class="card-glass rounded-[28px] p-6 flex flex-col gap-5">
            <div class="flex items-center gap-2.5 pb-4 border-b border-black/5">
              <PhFolderUser :size="20" class="text-primary" />
              <h3 class="font-header font-bold text-lg text-brand-dark">Decision Tracker</h3>
            </div>

            <div class="flex flex-col gap-3">
              <div 
                v-for="(dec, index) in meetingStore.selectedMeeting.decisions" 
                :key="index"
                class="p-4 rounded-xl border flex flex-col gap-2 text-left"
                :class="dec.status === 'APPROVED' ? 'bg-green-500/[0.03] border-green-500/10' : 'bg-yellow-500/[0.03] border-yellow-500/10'"
              >
                <span class="text-[9px] font-extrabold tracking-wider uppercase" :class="dec.status === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'">
                  {{ dec.status }}
                </span>
                <p class="text-xs font-semibold text-brand-dark leading-relaxed">
                  {{ dec.text }}
                </p>
              </div>
            </div>
          </div>

          <!-- Smart Transcript Box -->
          <div class="card-glass rounded-[28px] p-6 flex flex-col gap-5">
            <div class="flex flex-col gap-3 pb-4 border-b border-black/5">
              <div class="flex items-center gap-2.5">
                <PhChatCenteredText :size="20" class="text-primary" />
                <h3 class="font-header font-bold text-lg text-brand-dark">Smart Transcript</h3>
              </div>
              
              <SearchBar v-model="transcriptQuery" placeholder="Search transcript..." />
            </div>

            <!-- Scrollable transcript log -->
            <div class="flex flex-col gap-4 overflow-y-auto max-h-[380px] pr-1 scroll-container">
              <div 
                v-for="(line, index) in filteredTranscript" 
                :key="index"
                class="flex flex-col gap-1 border-l-2 pl-3 py-1 transition-all text-left"
                :class="line.speaker === 'Marcus Chen' ? 'border-primary/40' : line.speaker === 'Sarah Kim' ? 'border-[#d0bcff]' : 'border-secondary/40'"
              >
                <div class="flex justify-between items-baseline">
                  <span class="text-xs font-extrabold text-brand-dark" :class="line.speaker === 'Marcus Chen' ? 'text-primary' : line.speaker === 'Sarah Kim' ? 'text-[#a379fc]' : 'text-[#0491a3]'">
                    {{ line.speaker }}
                  </span>
                  <span class="text-[10px] text-brand-slate font-medium">{{ line.timestamp }}</span>
                </div>
                <p class="text-xs text-brand-slate leading-relaxed font-body">
                  <span v-html="highlightText(line.text, transcriptQuery)"></span>
                </p>
              </div>
              
              <div v-if="filteredTranscript.length === 0" class="text-xs text-brand-slate italic py-8 text-center">
                No transcript lines match your search.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Archive List View -->
    <div v-else class="flex flex-col gap-6">
      
      <!-- List header -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 class="text-3xl font-bold font-header text-brand-dark tracking-tight">Archive</h2>
          <p class="text-sm text-brand-slate mt-1">Review past intelligence-enabled meetings and action items</p>
        </div>
        <div class="flex items-center gap-4 flex-shrink-0 w-full sm:w-auto">
          <!-- Local Search Bar -->
          <SearchBar 
            v-model="localSearchQuery" 
            placeholder="Search meetings..." 
            class="w-64"
          />
        </div>
      </div>

      <!-- Archive Table / Grid -->
      <ArchiveTable 
        :meetings="filteredMeetings" 
        @select="(m) => meetingStore.selectedMeeting = m" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { 
  PhArrowLeft, 
  PhSparkle, 
  PhBrain, 
  PhCheckSquare, 
  PhCalendarBlank, 
  PhFolderUser, 
  PhChatCenteredText, 
  PhCheck 
} from '@phosphor-icons/vue'
import { useMeetingStore } from '@/stores/meeting'
import { useSearch } from '@/composables/useSearch'
import ArchiveTable from '@/components/dashboard/ArchiveTable.vue'
import SearchBar from '@/components/ui/SearchBar.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const meetingStore = useMeetingStore()

// Search filtering on meetings
const meetingsRef = computed(() => meetingStore.meetings)
const { searchQuery: localSearchQuery, filteredItems: filteredMeetings } = useSearch(meetingsRef, ['title', 'description'])

// Connect layout searchQuery to local search query
watch(() => props.searchQuery, (newVal) => {
  localSearchQuery.value = newVal
}, { immediate: true })

const transcriptQuery = ref('')

// Toggle task state inside selected meeting
const toggleTask = (task) => {
  task.checked = !task.checked
}

// Compute completion percentage rate dynamically
const completionRate = computed(() => {
  const meeting = meetingStore.selectedMeeting
  if (!meeting || !meeting.tasks || meeting.tasks.length === 0) return 0
  const checkedCount = meeting.tasks.filter(t => t.checked).length
  return Math.round((checkedCount / meeting.tasks.length) * 100)
})

// Compute filtered transcript lines
const filteredTranscript = computed(() => {
  const meeting = meetingStore.selectedMeeting
  if (!meeting || !meeting.transcript) return []
  if (!transcriptQuery.value.trim()) {
    return meeting.transcript
  }
  const q = transcriptQuery.value.toLowerCase()
  return meeting.transcript.filter(line => 
    line.speaker.toLowerCase().includes(q) || 
    line.text.toLowerCase().includes(q)
  )
})

// Helper: Highlights query text matches in transcript quotes
const highlightText = (text, query) => {
  if (!query.trim()) return text
  const regex = new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 text-brand-dark p-0.5 rounded font-bold">$1</mark>')
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.35s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom mini scrollbar for transcript */
.scroll-container::-webkit-scrollbar {
  width: 4px;
}
.scroll-container::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 99px;
}
.scroll-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}
</style>
