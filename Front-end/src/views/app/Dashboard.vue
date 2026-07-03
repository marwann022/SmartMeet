<template>
  <div class="home-view pt-10 pb-0">
    <!-- Pending state -->
    <div
      v-if="userStatus === 'pending'"
      class="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6"
    >
      <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <PhClock :size="32" weight="bold" class="text-primary" />
      </div>
      <div>
        <h2 class="text-2xl font-bold font-header text-brand-dark mb-2">Request Pending</h2>
        <p class="text-brand-slate text-sm max-w-sm">
          Your request to join the community is waiting for administrator approval.
          Please wait until your request has been reviewed.
        </p>
      </div>
    </div>

    <!-- Rejected state -->
    <div
      v-else-if="userStatus === 'rejected'"
      class="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6"
    >
      <div class="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <PhXCircle :size="32" weight="bold" class="text-red-500" />
      </div>
      <div>
        <h2 class="text-2xl font-bold font-header text-brand-dark mb-2">Request Rejected</h2>
        <p class="text-brand-slate text-sm max-w-sm">
          Unfortunately your request to join this community has been rejected.
          Please contact the administrator if you believe this is a mistake.
        </p>
      </div>
    </div>

    <!-- Active state -->
    <DashboardMain v-else :search-query="searchQuery" />
  </div>
</template>

<script setup>
import DashboardMain from '@/components/dashboard/DashboardMain.vue'
import { PhClock, PhXCircle } from '@phosphor-icons/vue'
import { computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useMeetingStore } from "@/stores/meeting"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const meetingStore = useMeetingStore()
const authStore = useAuthStore()

const userStatus = computed(() => authStore.user?.status)

defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

onMounted(() => {
  const token = localStorage.getItem("token")

  if (!token) {
    router.push("/signin")
    return
  }

  if (userStatus.value === 'active') {
    meetingStore.fetchMeetings()
  }
})
</script>
