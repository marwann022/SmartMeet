<template>
  <div class="home-view pt-10 pb-0">
    <DashboardMain :search-query="searchQuery" />
  </div>
</template>

<script setup>
import DashboardMain from '@/components/dashboard/DashboardMain.vue'
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { useMeetingStore } from "@/stores/meeting"

const router = useRouter()
const meetingStore = useMeetingStore()

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
  }

  meetingStore.fetchMeetings()
})


</script>
