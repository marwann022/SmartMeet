<template>
  <div ref="timePickerRef" class="flex flex-col gap-1.5 w-full text-left relative">
    <label v-if="label" class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate font-header pl-1">
      {{ label }}
    </label>
    
    <div class="relative w-full group">
      <!-- Clock Icon -->
      <div 
        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate transition-colors duration-200 pointer-events-none z-10"
        :class="hasError ? 'group-focus-within:text-red-500' : 'group-focus-within:text-primary'"
      >
        <PhClock :size="16" weight="bold" />
      </div>
      
      <!-- Styled Text Display Button -->
      <button
        type="button"
        @click="toggleDropdown"
        :class="[
          'w-full pl-11 pr-4 py-3 rounded-xl bg-white border font-body text-sm text-brand-dark text-left transition-all duration-300 hover:border-black/15 cursor-pointer focus:outline-none',
          hasError ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]' : 'border-black/8 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)]'
        ]"
      >
        {{ formattedDisplayTime }}
      </button>
    </div>

    <!-- Time Picker Popover Panel -->
    <transition name="fade-time">
      <div 
        v-if="isOpen" 
        @click.stop
        class="absolute left-0 z-[250] w-[280px] bg-white border border-black/8 shadow-[0_16px_36px_rgba(0,0,0,0.12)] rounded-[24px] p-4 flex flex-col gap-4 text-left backdrop-blur-md"
        style="top: calc(100% + 6px);"
      >
        <div class="grid grid-cols-3 gap-2.5 h-[190px]">
          <!-- Hours Column -->
          <div class="relative flex-1 border-r border-black/5 pr-1">
            <div class="text-[9px] font-extrabold text-brand-slate/60 text-center uppercase tracking-widest mb-1">Hr</div>
            <div class="relative overflow-hidden h-[160px]">
              <!-- Fade overlays -->
              <div class="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
              <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
              
              <div class="h-full overflow-y-auto no-scrollbar flex flex-col gap-1 py-4 scroll-smooth">
                <button
                  v-for="h in hoursList"
                  :key="h"
                  type="button"
                  @click="selectHour(h)"
                  :disabled="isHourDisabled(h)"
                  class="py-1.5 px-2 text-xs font-semibold rounded-lg text-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed disabled:pointer-events-none"
                  :class="selectedHour === h ? 'bg-primary text-white font-bold shadow-sm' : 'text-brand-dark hover:bg-black/5'"
                >
                  {{ String(h).padStart(2, '0') }}
                </button>
              </div>
            </div>
          </div>

          <!-- Minutes Column -->
          <div class="relative flex-1 border-r border-black/5 pr-1">
            <div class="text-[9px] font-extrabold text-brand-slate/60 text-center uppercase tracking-widest mb-1">Min</div>
            <div class="relative overflow-hidden h-[160px]">
              <!-- Fade overlays -->
              <div class="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
              <div class="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
              
              <div class="h-full overflow-y-auto no-scrollbar flex flex-col gap-1 py-4 scroll-smooth">
                <button
                  v-for="m in minutesList"
                  :key="m"
                  type="button"
                  @click="selectMinute(m)"
                  :disabled="isMinuteDisabled(m)"
                  class="py-1.5 px-2 text-xs font-semibold rounded-lg text-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed disabled:pointer-events-none"
                  :class="selectedMinute === m ? 'bg-primary text-white font-bold shadow-sm' : 'text-brand-dark hover:bg-black/5'"
                >
                  {{ String(m).padStart(2, '0') }}
                </button>
              </div>
            </div>
          </div>

          <!-- AM/PM Column -->
          <div class="flex flex-col justify-center gap-2 pl-1 select-none">
            <div class="text-[9px] font-extrabold text-brand-slate/60 text-center uppercase tracking-widest">AM/PM</div>
            <div class="flex flex-col bg-black/4 p-1 rounded-xl border border-black/[0.02] gap-1.5">
              <button
                type="button"
                @click="selectPeriod('AM')"
                :disabled="isPeriodDisabled('AM')"
                class="py-2.5 text-xs font-bold rounded-lg text-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed disabled:pointer-events-none"
                :class="selectedPeriod === 'AM' ? 'bg-primary text-white font-bold shadow-sm' : 'text-brand-dark hover:bg-black/5'"
              >
                AM
              </button>
              <button
                type="button"
                @click="selectPeriod('PM')"
                :disabled="isPeriodDisabled('PM')"
                class="py-2.5 text-xs font-bold rounded-lg text-center transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed disabled:pointer-events-none"
                :class="selectedPeriod === 'PM' ? 'bg-primary text-white font-bold shadow-sm' : 'text-brand-dark hover:bg-black/5'"
              >
                PM
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center pt-2.5 border-t border-black/5">
          <button
            type="button"
            @click="cancelSelection"
            class="px-2 py-1 text-xs font-bold uppercase tracking-wider text-brand-slate hover:text-brand-dark transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="confirmSelection"
            class="px-3 py-1.5 rounded-lg bg-primary/8 text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { PhClock } from '@phosphor-icons/vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: '09:00'
  },
  label: {
    type: String,
    default: ''
  },
  hasError: {
    type: Boolean,
    default: false
  },
  isToday: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const timePickerRef = ref(null)

const hoursList = Array.from({ length: 12 }, (_, i) => i + 1)
const minutesList = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

// Internal states
const selectedHour = ref(9)
const selectedMinute = ref(0)
const selectedPeriod = ref('AM')

// Backup states for cancel action
const backupHour = ref(9)
const backupMinute = ref(0)
const backupPeriod = ref('AM')

// Parse HH:MM 24hr format to 12hr internal representation
const parseValue = (val) => {
  if (!val) return { hour: 9, minute: 0, period: 'AM' }
  const parts = val.split(':')
  if (parts.length !== 2) return { hour: 9, minute: 0, period: 'AM' }
  
  let h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  
  let period = 'AM'
  if (h >= 12) {
    period = 'PM'
    if (h > 12) h -= 12
  } else if (h === 0) {
    h = 12
  }
  
  return { hour: h, minute: m, period }
}

// Convert internal 12hr state to HH:MM 24hr string
const formatValue = (h, m, p) => {
  let hr24 = h
  if (p === 'PM') {
    if (h !== 12) hr24 += 12
  } else {
    if (h === 12) hr24 = 0
  }
  return `${String(hr24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const get24Hour = (h, p) => {
  let hr = h
  if (p === 'PM') {
    if (h !== 12) hr += 12
  } else {
    if (h === 12) hr = 0
  }
  return hr
}

// Clamps selected time to the future if isToday is true
const clampTimeToFuture = () => {
  if (!props.isToday) return
  const now = new Date()
  const currentHr = now.getHours()
  const currentMin = now.getMinutes()
  
  const hr24 = get24Hour(selectedHour.value, selectedPeriod.value)
  
  if (hr24 < currentHr || (hr24 === currentHr && selectedMinute.value < currentMin)) {
    // Determine the next valid 5-minute interval
    let targetHr = currentHr
    let targetMin = Math.ceil(currentMin / 5) * 5
    if (targetMin >= 60) {
      targetMin = 0
      targetHr += 1
    }
    
    // Clamp to 23:55 of today as maximum possible today limit
    if (targetHr >= 24) {
      targetHr = 23
      targetMin = 55
    }
    
    let p = 'AM'
    let h = targetHr
    if (targetHr >= 12) {
      p = 'PM'
      if (targetHr > 12) h -= 12
    } else if (targetHr === 0) {
      h = 12
    }
    
    selectedHour.value = h
    selectedMinute.value = targetMin
    selectedPeriod.value = p
  }
}

// Watch props.modelValue to sync initial value
watch(() => props.modelValue, (newVal) => {
  const { hour, minute, period } = parseValue(newVal)
  selectedHour.value = hour
  selectedMinute.value = minute
  selectedPeriod.value = period
  
  backupHour.value = hour
  backupMinute.value = minute
  backupPeriod.value = period
  
  clampTimeToFuture()
}, { immediate: true })

// Watch props.isToday to auto-adjust when date changes
watch(() => props.isToday, (newVal) => {
  if (newVal) {
    clampTimeToFuture()
    const formatted = formatValue(selectedHour.value, selectedMinute.value, selectedPeriod.value)
    emit('update:modelValue', formatted)
    emit('change', formatted)
  }
})

const formattedDisplayTime = computed(() => {
  const mStr = String(selectedMinute.value).padStart(2, '0')
  return `${String(selectedHour.value).padStart(2, '0')}:${mStr} ${selectedPeriod.value}`
})

const toggleDropdown = () => {
  if (isOpen.value) {
    cancelSelection()
  } else {
    clampTimeToFuture()
    backupHour.value = selectedHour.value
    backupMinute.value = selectedMinute.value
    backupPeriod.value = selectedPeriod.value
    isOpen.value = true
  }
}

// Disabled checks for Hour, Minute, and Period
const isPeriodDisabled = (p) => {
  if (!props.isToday) return false
  const now = new Date()
  const currentHr = now.getHours()
  if (p === 'AM' && currentHr >= 12) return true
  return false
}

const isHourDisabled = (h) => {
  if (!props.isToday) return false
  const now = new Date()
  const currentHr = now.getHours()
  const hr24 = get24Hour(h, selectedPeriod.value)
  if (hr24 < currentHr) return true
  return false
}

const isMinuteDisabled = (m) => {
  if (!props.isToday) return false
  const now = new Date()
  const currentHr = now.getHours()
  const currentMin = now.getMinutes()
  const hr24 = get24Hour(selectedHour.value, selectedPeriod.value)
  
  if (hr24 < currentHr) return true
  if (hr24 === currentHr && m < currentMin) return true
  return false
}

// Selection actions (clamping after each selection just in case)
const selectHour = (h) => {
  selectedHour.value = h
  clampTimeToFuture()
}

const selectMinute = (m) => {
  selectedMinute.value = m
  clampTimeToFuture()
}

const selectPeriod = (p) => {
  selectedPeriod.value = p
  clampTimeToFuture()
}

const cancelSelection = () => {
  selectedHour.value = backupHour.value
  selectedMinute.value = backupMinute.value
  selectedPeriod.value = backupPeriod.value
  isOpen.value = false
}

const confirmSelection = () => {
  clampTimeToFuture()
  const formatted = formatValue(selectedHour.value, selectedMinute.value, selectedPeriod.value)
  emit('update:modelValue', formatted)
  emit('change', formatted)
  isOpen.value = false
}

const handleClickOutside = (e) => {
  if (timePickerRef.value && !timePickerRef.value.contains(e.target)) {
    cancelSelection()
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.fade-time-enter-active,
.fade-time-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-time-enter-from,
.fade-time-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Scrollbar-hiding utilities across all layout engines */
.no-scrollbar::-webkit-scrollbar {
  display: none !important;
  width: 0px !important;
  height: 0px !important;
  background: transparent !important;
}

.no-scrollbar {
  -ms-overflow-style: none !important;  /* IE and Edge */
  scrollbar-width: none !important;  /* Firefox */
}
</style>
