<template>
  <div class="flex items-center gap-2.5">
    <UserAvatar :user="user" :name="user?.name" size="md" class="transition-transform duration-300 hover:scale-105" />
    <div class="flex flex-col text-left compact:hidden min-w-0">
      <span
        class="text-[13px] font-bold text-brand-dark dark:text-slate-200 leading-tight truncate max-w-[160px]"
      >
        {{ user?.name || 'User' }}
      </span>
      <p class="text-[11px] font-medium leading-tight mt-[3px] whitespace-nowrap text-primary">
        {{ roleLabel }}<span class="mx-[5px] text-brand-slate font-normal">•</span>{{ planLabel }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import UserAvatar from './UserAvatar.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const roleLabel = computed(() =>
  (user.value?.role || 'member').toLowerCase() === 'admin'
    ? 'Community Admin'
    : 'Community Member'
)

const planLabel = computed(() =>
  user.value?.plan?.replace(/ \((Monthly|Annual)\)/, '') || 'Free'
)
</script>
