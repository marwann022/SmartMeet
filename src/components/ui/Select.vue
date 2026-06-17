<template>
  <div ref="dropdownRef" class="flex flex-col gap-1.5 w-full text-left relative">
    <label v-if="label" class="text-[10px] font-extrabold uppercase tracking-wider text-brand-slate font-header pl-1">
      {{ label }}
    </label>
    
    <button 
      type="button"
      @click="isOpen = !isOpen"
      :class="[
        'w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border font-body text-sm transition-all duration-300 cursor-pointer text-brand-dark',
        isOpen ? themeFocusClasses[theme] || themeFocusClasses.primary : themeBorderClasses[theme] || 'border-black/8'
      ]"
    >
      <div class="flex items-center gap-2">
        <span v-if="selectedOption?.color" class="w-2.5 h-2.5 rounded-full" :class="selectedOption.color"></span>
        <span>{{ selectedOption ? selectedOption.label : placeholder }}</span>
      </div>
      <PhCaretDown :size="16" class="text-brand-slate transition-transform duration-300" :class="{ 'rotate-180': isOpen }" />
    </button>
    
    <!-- Floating Options Dropdown -->
    <transition name="fade-dropdown">
      <div 
        v-if="isOpen"
        class="absolute left-0 right-0 top-[calc(100%+6px)] z-50 rounded-xl bg-white border border-black/8 shadow-[0_12px_32px_rgba(0,0,0,0.08)] py-1 flex flex-col max-h-[200px] overflow-y-auto"
      >
        <button 
          v-for="opt in formattedOptions"
          :key="opt.value"
          type="button"
          @click="selectOption(opt.value)"
          class="w-full px-4 py-2.5 flex items-center gap-2 hover:bg-black/5 text-left font-body text-sm text-brand-dark transition-colors duration-200 cursor-pointer"
        >
          <span v-if="opt.color" class="w-2 h-2 rounded-full" :class="opt.color"></span>
          <span>{{ opt.label }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { PhCaretDown } from '@phosphor-icons/vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    default: ''
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select option'
  },
  theme: {
    type: String,
    default: 'primary'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const formattedOptions = computed(() => {
  return props.options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : opt.label,
        label: opt.label,
        color: opt.color || null
      }
    }
    return {
      value: opt,
      label: opt,
      color: null
    }
  })
})

const selectedOption = computed(() => {
  return formattedOptions.value.find(opt => opt.value === props.modelValue) || null
})

const selectOption = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})

const themeBorderClasses = {
  primary: 'border-black/8',
  todo: 'border-primary/20',
  inprogress: 'border-amber-500/20',
  review: 'border-red-500/20',
  done: 'border-emerald-500/20'
}

const themeFocusClasses = {
  primary: 'border-primary/30 shadow-[0_0_0_3px_rgba(75,104,255,0.08)]',
  todo: 'border-primary/30 shadow-[0_0_0_3px_rgba(75,104,255,0.08)]',
  inprogress: 'border-amber-500/30 shadow-[0_0_0_3px_rgba(245,158,11,0.08)]',
  review: 'border-red-500/30 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]',
  done: 'border-emerald-500/30 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]'
}
</script>

<style scoped>
.fade-dropdown-enter-active,
.fade-dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-dropdown-enter-from,
.fade-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
