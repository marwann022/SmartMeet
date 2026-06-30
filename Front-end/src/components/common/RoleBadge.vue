<template>
  <span class="role-badge" :class="roleClass">
    <component :is="icon" :size="11" weight="bold" class="flex-shrink-0" />
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { PhShieldCheck, PhUser } from '@phosphor-icons/vue'

const props = defineProps({
  role: { type: String, default: 'member' },
  size: { type: String, default: 'sm' }
})

const normalizedRole = computed(() => (props.role || 'member').toLowerCase())

const label = computed(() => normalizedRole.value === 'admin' ? 'Admin' : 'Member')

const icon = computed(() => normalizedRole.value === 'admin' ? PhShieldCheck : PhUser)

const roleClass = computed(() => normalizedRole.value === 'admin' ? 'role-badge--admin' : 'role-badge--member')
</script>

<style scoped>
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid transparent;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: filter 200ms ease;
  line-height: 1;
}

.role-badge:hover {
  filter: brightness(0.94);
}

.role-badge--admin {
  background-color: #FEECEC;
  border-color: #FCA5A5;
  color: #DC2626;
}

.role-badge--member {
  background-color: #EEF4FF;
  border-color: #93C5FD;
  color: #2563EB;
}
</style>
