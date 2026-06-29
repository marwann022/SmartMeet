<template>
  <div ref="datePickerRef" class="flex flex-col gap-1.5 w-full text-left relative">
    <label v-if="label" class="text-[11px] font-semibold text-brand-slate tracking-wide font-header pl-1">
      {{ label }}
    </label>
    
    <div class="relative w-full group">
      <!-- Calendar Icon -->
      <div 
        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate transition-colors duration-200 pointer-events-none z-10"
        :class="hasError ? 'group-focus-within:text-red-500' : (themeIconFocusClasses[theme] || themeIconFocusClasses.primary)"
      >
        <PhCalendarBlank :size="16" weight="bold" />
      </div>
      
      <!-- Styled Text Display Button -->
      <button
        type="button"
        @click="toggleCalendar"
        :class="[
          'w-full h-12 pl-11 pr-4 rounded-xl bg-white dark:bg-slate-950/60 border font-body text-sm text-brand-dark text-left transition-all duration-300 hover:border-black/15 dark:hover:border-white/20 cursor-pointer focus:outline-none flex items-center',
          hasError ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]' : (themeFocusClasses[theme] || themeFocusClasses.primary)
        ]"
      >
        {{ formattedDisplayDate }}
      </button>
    </div>

    <!-- Calendar Popover Panel -->
    <transition :name="direction === 'up' ? 'fade-calendar-up' : 'fade-calendar-down'">
      <div 
        v-if="isOpen" 
        @click.stop
        class="absolute left-0 z-[250] w-[290px] bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.2)] rounded-2xl p-4 flex flex-col gap-4 text-left"
        :style="direction === 'up' ? { bottom: 'calc(100% + 6px)' } : { top: 'calc(100% + 6px)' }"
      >
        <!-- Header: Month and Year Selector Buttons -->
        <div class="flex justify-between items-center gap-2 relative">
          <!-- Month dropdown button -->
          <div class="relative flex-1">
            <button 
              type="button"
              @click.stop="toggleMonthSelect"
              class="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/3 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-all text-xs font-bold text-brand-dark cursor-pointer"
            >
              <span>{{ months[month] }}</span>
              <PhCaretDown :size="12" />
            </button>
            
            <div 
              v-if="showMonthSelect" 
              class="absolute left-0 right-0 top-[calc(100%+4px)] z-[260] bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 shadow-lg rounded-xl max-h-[160px] overflow-y-auto py-1"
            >
              <button
                v-for="(mName, idx) in months"
                :key="mName"
                type="button"
                @click="selectMonth(idx)"
                class="w-full text-left px-3 py-1.5 text-xs text-brand-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                :class="idx === month ? [themeTextClasses[theme] || themeTextClasses.primary, 'font-bold'] : ''"
              >
                {{ mName }}
              </button>
            </div>
          </div>

          <!-- Year dropdown button -->
          <div class="relative w-[85px]">
            <button 
              type="button"
              @click.stop="toggleYearSelect"
              class="w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-black/3 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-all text-xs font-bold text-brand-dark cursor-pointer"
            >
              <span>{{ year }}</span>
              <PhCaretDown :size="12" />
            </button>
            
            <div 
              v-if="showYearSelect" 
              class="absolute left-0 right-0 top-[calc(100%+4px)] z-[260] bg-white dark:bg-slate-900 border border-black/8 dark:border-white/10 shadow-lg rounded-xl max-h-[160px] overflow-y-auto py-1"
            >
              <button
                v-for="yNum in years"
                :key="yNum"
                type="button"
                @click="selectYear(yNum)"
                class="w-full text-left px-3 py-1.5 text-xs text-brand-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                :class="yNum === year ? [themeTextClasses[theme] || themeTextClasses.primary, 'font-bold'] : ''"
              >
                {{ yNum }}
              </button>
            </div>
          </div>
        </div>

        <!-- Weekdays header -->
        <div class="grid grid-cols-7 gap-1 text-[9px] font-extrabold text-brand-slate/60 text-center tracking-wider uppercase mb-1">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <!-- Days Grid -->
        <div class="grid grid-cols-7 gap-1 justify-items-center">
          <button
            v-for="(cell, idx) in calendarCells"
            :key="idx"
            type="button"
            @click="selectCell(cell)"
            :disabled="isPastDate(cell)"
            :class="[
              'w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold transition-all',
              isPastDate(cell) ? 'text-brand-slate/20 cursor-not-allowed opacity-30 pointer-events-none' : 'cursor-pointer',
              !isPastDate(cell) && cell.isCurrentMonth ? 'text-brand-dark hover:bg-black/5 dark:hover:bg-white/5' : '',
              !isPastDate(cell) && !cell.isCurrentMonth ? 'text-brand-slate/30 hover:bg-black/3 dark:hover:bg-white/3' : '',
              isDateSelected(cell) ? (themeSelectedCellClasses[theme] || themeSelectedCellClasses.primary) : '',
              isToday(cell) && !isDateSelected(cell) ? (themeTodayCellClasses[theme] || themeTodayCellClasses.primary) : ''
            ]"
          >
            {{ cell.day }}
          </button>
        </div>

        <!-- Footer -->
        <div class="flex justify-between items-center pt-2 border-t border-black/5 dark:border-white/10 mt-1">
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
            :class="[
              'px-2 py-1 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer',
              themeTextClasses[theme] || themeTextClasses.primary,
              themeHoverTextClasses[theme] || themeHoverTextClasses.primary
            ]"
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
import { PhCalendarBlank, PhCaretDown } from '@phosphor-icons/vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  direction: {
    type: String,
    default: 'down',
    validator: (v) => ['up', 'down'].includes(v)
  },
  theme: {
    type: String,
    default: 'primary'
  },
  hasError: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const showMonthSelect = ref(false)
const showYearSelect = ref(false)
const datePickerRef = ref(null)

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

// Current navigation state
const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth())

// Selected states
const selectedDate = ref(null)
const tempSelectedDate = ref(null)

// Parse YYYY-MM-DD to date object
const parseValue = (val) => {
  if (!val) return null
  const parts = val.split('-')
  if (parts.length !== 3) return null
  return {
    year: parseInt(parts[0], 10),
    month: parseInt(parts[1], 10) - 1,
    day: parseInt(parts[2], 10)
  }
}

// Format date object to YYYY-MM-DD
const formatDate = (dateObj) => {
  if (!dateObj) return ''
  const y = dateObj.year
  const m = String(dateObj.month + 1).padStart(2, '0')
  const d = String(dateObj.day).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Watch modelValue to sync internal state
watch(() => props.modelValue, (newVal) => {
  const parsed = parseValue(newVal)
  if (parsed) {
    year.value = parsed.year
    month.value = parsed.month
    selectedDate.value = parsed
    tempSelectedDate.value = { ...parsed }
  } else {
    // Default to today if no value
    const today = new Date()
    year.value = today.getFullYear()
    month.value = today.getMonth()
    selectedDate.value = null
    tempSelectedDate.value = {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate()
    }
  }
}, { immediate: true })

// Formatted readable label for button text
const formattedDisplayDate = computed(() => {
  if (!props.modelValue) {
    const today = new Date()
    return `${months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`
  }
  const dateObj = parseValue(props.modelValue)
  if (!dateObj) return 'Select Date'
  return `${months[dateObj.month]} ${dateObj.day}, ${dateObj.year}`
})

// Years dropdown list (Current year +/- 5 years)
const years = computed(() => {
  const current = new Date().getFullYear()
  const list = []
  for (let y = current - 5; y <= current + 5; y++) {
    list.push(y)
  }
  return list
})

// Get days count in month
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()

// Get weekday index of 1st day of month (0 = Sunday, 1 = Monday, etc.)
const startDayOfWeek = (y, m) => new Date(y, m, 1).getDay()

// Generate 42 calendar grid cells
const calendarCells = computed(() => {
  const cells = []
  const daysCurrent = daysInMonth(year.value, month.value)
  
  // Previous month details
  const prevMonth = month.value === 0 ? 11 : month.value - 1
  const prevYear = month.value === 0 ? year.value - 1 : year.value
  const daysPrev = daysInMonth(prevYear, prevMonth)
  
  const startDay = startDayOfWeek(year.value, month.value)
  
  // Padding from previous month
  for (let i = startDay - 1; i >= 0; i--) {
    cells.push({
      day: daysPrev - i,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false
    })
  }
  
  // Current month days
  for (let d = 1; d <= daysCurrent; d++) {
    cells.push({
      day: d,
      month: month.value,
      year: year.value,
      isCurrentMonth: true
    })
  }
  
  // Padding from next month to pad to 42 cells (6 rows * 7 columns)
  const remaining = 42 - cells.length
  const nextMonth = month.value === 11 ? 0 : month.value + 1
  const nextYear = month.value === 11 ? year.value + 1 : year.value
  for (let d = 1; d <= remaining; d++) {
    cells.push({
      day: d,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false
    })
  }
  
  return cells
})

// Toggle popover states
const toggleCalendar = () => {
  if (!isOpen.value) {
    const activeDate = selectedDate.value || tempSelectedDate.value
    if (activeDate) {
      year.value = activeDate.year
      month.value = activeDate.month
    }
  } else {
    cancelSelection()
    return
  }
  isOpen.value = !isOpen.value
  showMonthSelect.value = false
  showYearSelect.value = false
}

const toggleMonthSelect = () => {
  showMonthSelect.value = !showMonthSelect.value
  showYearSelect.value = false
}

const toggleYearSelect = () => {
  showYearSelect.value = !showYearSelect.value
  showMonthSelect.value = false
}

const isPastDate = (cell) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cellDate = new Date(cell.year, cell.month, cell.day)
  return cellDate < today
}

const clampToToday = (dateObj) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateObj.year, dateObj.month, dateObj.day)
  if (target < today) {
    return {
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate()
    }
  }
  return dateObj
}

const selectMonth = (mIdx) => {
  month.value = mIdx
  showMonthSelect.value = false
  if (tempSelectedDate.value) {
    const maxDays = daysInMonth(year.value, mIdx)
    const updated = {
      ...tempSelectedDate.value,
      month: mIdx,
      day: Math.min(tempSelectedDate.value.day, maxDays)
    }
    tempSelectedDate.value = clampToToday(updated)
    year.value = tempSelectedDate.value.year
    month.value = tempSelectedDate.value.month
  }
}

const selectYear = (yNum) => {
  year.value = yNum
  showYearSelect.value = false
  if (tempSelectedDate.value) {
    const maxDays = daysInMonth(yNum, month.value)
    const updated = {
      ...tempSelectedDate.value,
      year: yNum,
      day: Math.min(tempSelectedDate.value.day, maxDays)
    }
    tempSelectedDate.value = clampToToday(updated)
    year.value = tempSelectedDate.value.year
    month.value = tempSelectedDate.value.month
  }
}

const selectCell = (cell) => {
  if (isPastDate(cell)) return
  
  // If clicked an adjacent month cell, navigate to that month/year
  if (!cell.isCurrentMonth) {
    month.value = cell.month
    year.value = cell.year
  }
  tempSelectedDate.value = {
    day: cell.day,
    month: cell.month,
    year: cell.year
  }
}

const isDateSelected = (cell) => {
  if (!tempSelectedDate.value) return false
  return tempSelectedDate.value.day === cell.day &&
         tempSelectedDate.value.month === cell.month &&
         tempSelectedDate.value.year === cell.year
}

const isToday = (cell) => {
  const today = new Date()
  return cell.day === today.getDate() &&
         cell.month === today.getMonth() &&
         cell.year === today.getFullYear()
}

// Cancel
const cancelSelection = () => {
  // Reset temp selection to currently confirmed selected date
  tempSelectedDate.value = selectedDate.value ? { ...selectedDate.value } : null
  const activeDate = selectedDate.value || tempSelectedDate.value
  if (activeDate) {
    year.value = activeDate.year
    month.value = activeDate.month
  }
  isOpen.value = false
}

// Confirm
const confirmSelection = () => {
  if (tempSelectedDate.value) {
    selectedDate.value = { ...tempSelectedDate.value }
    const formatted = formatDate(selectedDate.value)
    emit('update:modelValue', formatted)
    emit('change', formatted)
  }
  isOpen.value = false
}

// Click away listener
const handleClickOutside = (e) => {
  if (e.target && !document.body.contains(e.target)) {
    return
  }
  if (datePickerRef.value && !datePickerRef.value.contains(e.target)) {
    // Treat click outside as cancel
    cancelSelection()
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

const themeFocusClasses = {
  primary: 'border-black/8 dark:border-white/10 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)]',
  todo: 'border-primary/20 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(75,104,255,0.08)]',
  inprogress: 'border-amber-500/20 focus:border-amber-500/30 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.08)]',
  review: 'border-red-500/20 focus:border-red-500/30 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]',
  done: 'border-emerald-500/20 focus:border-emerald-500/30 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
}

const themeTextClasses = {
  primary: 'text-primary',
  todo: 'text-primary',
  inprogress: 'text-amber-600',
  review: 'text-red-500',
  done: 'text-emerald-600'
}

const themeHoverTextClasses = {
  primary: 'hover:text-primary/80',
  todo: 'hover:text-primary/80',
  inprogress: 'hover:text-amber-600/80',
  review: 'hover:text-red-500/80',
  done: 'hover:text-emerald-600/80'
}

const themeIconFocusClasses = {
  primary: 'group-focus-within:text-primary',
  todo: 'group-focus-within:text-primary',
  inprogress: 'group-focus-within:text-amber-600',
  review: 'group-focus-within:text-red-500',
  done: 'group-focus-within:text-emerald-600'
}

const themeSelectedCellClasses = {
  primary: 'bg-primary text-white hover:bg-primary shadow-[0_4px_12px_rgba(75,104,255,0.25)]',
  todo: 'bg-primary text-white hover:bg-primary shadow-[0_4px_12px_rgba(75,104,255,0.25)]',
  inprogress: 'bg-amber-600 text-white hover:bg-amber-600 shadow-[0_4px_12px_rgba(245,158,11,0.25)]',
  review: 'bg-red-500 text-white hover:bg-red-50 shadow-[0_4px_12px_rgba(239,68,68,0.25)]',
  done: 'bg-emerald-500 text-white hover:bg-emerald-500 shadow-[0_4px_12px_rgba(16,185,129,0.25)]'
}

const themeTodayCellClasses = {
  primary: 'border border-primary text-primary',
  todo: 'border border-primary text-primary',
  inprogress: 'border border-amber-600 text-amber-600',
  review: 'border border-red-500 text-red-500',
  done: 'border border-emerald-500 text-emerald-500'
}
</script>

<style scoped>
.fade-calendar-down-enter-active,
.fade-calendar-down-leave-active,
.fade-calendar-up-enter-active,
.fade-calendar-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-calendar-down-enter-from,
.fade-calendar-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-calendar-up-enter-from,
.fade-calendar-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* Scrollbar styling for month/year dropdown overlays */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 99px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.15);
}
</style>
