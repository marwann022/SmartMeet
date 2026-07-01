<template>
  <div class="flex flex-col gap-6">
    <!-- Quick KPI Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card-glass rounded-2xl p-4 flex items-center justify-between border border-white/80 shadow-glass group hover:bg-white/40 transition-colors">
        <div class="flex flex-col gap-1">
          <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">Total Members</span>
          <span class="text-xl font-bold font-header text-brand-dark">{{ data?.kpi?.totalMembers || 0 }}</span>
        </div>
        <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
          <PhUsers :size="20" weight="bold" />
        </div>
      </div>
      <div class="card-glass rounded-2xl p-4 flex items-center justify-between border border-white/80 shadow-glass group hover:bg-white/40 transition-colors">
        <div class="flex flex-col gap-1">
          <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">Tasks Completed</span>
          <span class="text-xl font-bold font-header text-brand-dark">{{ data?.kpi?.tasksCompleted || 0 }}</span>
        </div>
        <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
          <PhCheckCircle :size="20" weight="bold" />
        </div>
      </div>
      <div class="card-glass rounded-2xl p-4 flex items-center justify-between border border-white/80 shadow-glass group hover:bg-white/40 transition-colors">
        <div class="flex flex-col gap-1">
          <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">Total Meetings</span>
          <span class="text-xl font-bold font-header text-brand-dark">{{ data?.kpi?.totalMeetings || 0 }}</span>
        </div>
        <div class="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
          <PhVideoCamera :size="20" weight="bold" />
        </div>
      </div>
      <div class="card-glass rounded-2xl p-4 flex items-center justify-between border border-white/80 shadow-glass group hover:bg-white/40 transition-colors">
        <div class="flex flex-col gap-1">
          <span class="text-[9px] font-extrabold text-brand-slate uppercase tracking-wider">AI Summaries</span>
          <span class="text-xl font-bold font-header text-brand-dark">{{ data?.kpi?.aiSummaries || 0 }}</span>
        </div>
        <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
          <PhBrain :size="20" weight="bold" />
        </div>
      </div>
    </div>

    <!-- Main Analytics Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
      
      <!-- 1. Team Performance Overview (2x2) -->
      <div class="card-glass rounded-[24px] p-6 flex flex-col gap-5 border border-white/80 shadow-glass lg:col-span-2 lg:row-span-2 min-h-0">
        <div class="flex items-center gap-2 border-b border-black/5 pb-3">
          <PhChartLineUp :size="20" weight="bold" class="text-primary" />
          <h3 class="font-header font-bold text-lg text-brand-dark">Team Performance</h3>
        </div>
        <div class="flex flex-col md:flex-row gap-6 items-center flex-1 justify-center">
          <!-- Circular Indicator -->
          <div class="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-black/5 dark:text-white/5" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="text-primary" stroke-width="3" :stroke-dasharray="`${data?.teamPerformance?.completionRate || 0}, 100`" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-bold font-header text-brand-dark">{{ data?.teamPerformance?.completionRate || 0 }}%</span>
              <span class="text-[10px] font-extrabold text-brand-slate uppercase tracking-wider">Completion</span>
            </div>
          </div>
          <!-- Performance Bars -->
          <div class="flex-1 w-full flex flex-col gap-5">
            <div class="flex flex-col gap-1.5">
              <div class="flex justify-between text-xs font-semibold">
                <span class="text-brand-dark">Tasks Completed</span>
                <span class="text-primary">{{ data?.teamPerformance?.completedTasks || 0 }} / {{ data?.teamPerformance?.totalTasks || 0 }}</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-black/5 overflow-hidden">
                <div class="h-full bg-primary rounded-full transition-all duration-1000" :style="{ width: `${data?.teamPerformance?.completionRate || 0}%` }"></div>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <div class="flex justify-between text-xs font-semibold">
                <span class="text-brand-dark">Overdue</span>
                <span class="text-red-500">{{ data?.teamPerformance?.overdueTasks || 0 }}</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-black/5 overflow-hidden">
                <div class="h-full bg-red-500 rounded-full transition-all duration-1000" :style="{ width: `${Math.min(100, (data?.teamPerformance?.overdueTasks / (data?.teamPerformance?.totalTasks || 1)) * 100)}%` }"></div>
              </div>
            </div>
            <div class="flex justify-between mt-3 pt-4 border-t border-black/5">
              <div class="flex flex-col">
                <span class="text-[10px] font-extrabold text-brand-slate uppercase">Score</span>
                <span class="text-xl font-bold text-brand-dark">{{ data?.teamPerformance?.performanceScore || 0 }}</span>
              </div>
              <div class="flex flex-col text-right">
                <span class="text-[10px] font-extrabold text-brand-slate uppercase">Avg Time</span>
                <span class="text-base font-bold text-brand-dark">{{ data?.teamPerformance?.avgCompletionTime || '0 days' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Leaderboard (1x2) -->
      <div class="card-glass rounded-[24px] p-6 flex flex-col gap-4 border border-white/80 shadow-glass lg:col-span-1 lg:row-span-2 min-h-0">
        <div class="flex items-center gap-2 border-b border-black/5 pb-3">
          <PhTrophy :size="20" weight="bold" class="text-yellow-500" />
          <h3 class="font-header font-bold text-lg text-brand-dark">Leaderboard</h3>
        </div>
        <div class="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
          <div v-for="(user, index) in data?.topContributors || []" :key="index" class="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-black/5 hover:bg-white/60 transition-colors">
            <div class="flex items-center gap-3">
              <div class="relative w-8 h-8 rounded-full bg-brand-slate/10 flex items-center justify-center font-bold text-brand-dark text-xs overflow-hidden">
                <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover" />
                <span v-else>{{ user.name.charAt(0) }}</span>
                <div v-if="index === 0" class="absolute -top-1 -right-1 text-yellow-500 bg-white rounded-full">
                  <PhCrown :size="12" weight="fill" />
                </div>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-bold text-brand-dark leading-tight">{{ user.name }}</span>
                <span class="text-[10px] text-brand-slate">{{ user.score }} pts</span>
              </div>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-xs font-bold" :class="user.completionRate >= 80 ? 'text-green-500' : 'text-orange-500'">{{ user.completionRate }}%</span>
              <span class="text-[9px] text-brand-slate">Completion</span>
            </div>
          </div>
          <div v-if="!data?.topContributors?.length" class="text-center text-xs text-brand-slate py-4">
            Not enough data for leaderboard.
          </div>
        </div>
      </div>

      <!-- 3. Tasks Insights (1x1) -->
      <div class="card-glass rounded-[24px] p-6 flex flex-col gap-4 border border-white/80 shadow-glass lg:col-span-1 lg:row-span-1 min-h-0">
        <div class="flex items-center gap-2 border-b border-black/5 pb-3">
          <PhTarget :size="20" weight="bold" class="text-blue-500" />
          <h3 class="font-header font-bold text-lg text-brand-dark">Tasks Insights</h3>
        </div>
        <div class="flex items-center gap-4 flex-1">
          <div class="flex-1 flex flex-col justify-center gap-2">
            <div class="flex justify-between items-center text-[11px]">
              <div class="flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-green-500"></div>Completed</div>
              <span class="font-bold">{{ data?.tasksInsights?.completed || 0 }}</span>
            </div>
            <div class="flex justify-between items-center text-[11px]">
              <div class="flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>Pending</div>
              <span class="font-bold">{{ data?.tasksInsights?.pending || 0 }}</span>
            </div>
            <div class="flex justify-between items-center text-[11px]">
              <div class="flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-purple-500"></div>In Review</div>
              <span class="font-bold">{{ data?.tasksInsights?.inReview || 0 }}</span>
            </div>
            <div class="flex justify-between items-center text-[11px]">
              <div class="flex items-center gap-1.5"><div class="w-1.5 h-1.5 rounded-full bg-red-500"></div>Overdue</div>
              <span class="font-bold text-red-500">{{ data?.tasksInsights?.overdue || 0 }}</span>
            </div>
          </div>
          <!-- Bar visual -->
          <div class="w-4 h-full min-h-[100px] rounded-full flex flex-col overflow-hidden bg-black/5">
            <div class="w-full bg-green-500 transition-all duration-500" :style="{ flex: data?.tasksInsights?.completed || 0 }"></div>
            <div class="w-full bg-yellow-500 transition-all duration-500" :style="{ flex: data?.tasksInsights?.pending || 0 }"></div>
            <div class="w-full bg-purple-500 transition-all duration-500" :style="{ flex: data?.tasksInsights?.inReview || 0 }"></div>
            <div class="w-full bg-red-500 transition-all duration-500" :style="{ flex: data?.tasksInsights?.overdue || 0 }"></div>
          </div>
        </div>
      </div>

      <!-- 4. AI Usage Insights (1x1) -->
      <div class="card-glass rounded-[24px] p-6 flex flex-col gap-4 border border-white/80 shadow-glass lg:col-span-1 lg:row-span-1 min-h-0">
        <div class="flex items-center gap-2 border-b border-black/5 pb-3">
          <PhSparkle :size="20" weight="bold" class="text-purple-500" />
          <h3 class="font-header font-bold text-lg text-brand-dark">AI Usage</h3>
        </div>
        <div class="flex flex-col gap-2 flex-1 justify-center">
          <div class="flex justify-between items-center p-2 rounded-xl bg-purple-500/5">
            <span class="text-[11px] font-semibold text-brand-dark">Summaries</span>
            <span class="font-bold text-purple-600 bg-purple-500/10 px-1.5 py-0.5 text-xs rounded">{{ data?.aiUsage?.summariesGenerated || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-2 rounded-xl bg-purple-500/5">
            <span class="text-[11px] font-semibold text-brand-dark">Action Items</span>
            <span class="font-bold text-purple-600 bg-purple-500/10 px-1.5 py-0.5 text-xs rounded">{{ data?.aiUsage?.actionItemsExtracted || 0 }}</span>
          </div>
          <div class="flex justify-between items-center p-2 rounded-xl bg-green-500/5">
            <span class="text-[11px] font-semibold text-brand-dark">Hours Saved</span>
            <span class="font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 text-xs rounded">{{ data?.aiUsage?.hoursSaved || 0 }}h</span>
          </div>
        </div>
      </div>

      <!-- 5. Meetings Analytics (2x1) -->
      <div class="card-glass rounded-[24px] p-6 flex flex-col gap-4 border border-white/80 shadow-glass lg:col-span-2 lg:row-span-1 min-h-0">
        <div class="flex items-center gap-2 border-b border-black/5 pb-3">
          <PhVideoCamera :size="20" weight="bold" class="text-orange-500" />
          <h3 class="font-header font-bold text-lg text-brand-dark">Meetings Analytics</h3>
        </div>
        <div class="grid grid-cols-4 gap-4 flex-1">
          <div class="flex flex-col gap-1 p-3 rounded-xl bg-orange-500/5 justify-center">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase">This Week</span>
            <span class="text-xl font-bold text-brand-dark">{{ data?.meetings?.meetingsThisWeek || 0 }}</span>
          </div>
          <div class="flex flex-col gap-1 p-3 rounded-xl bg-orange-500/5 justify-center">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase">Total Hours</span>
            <span class="text-xl font-bold text-brand-dark">{{ data?.meetings?.totalMeetingHours || 0 }}h</span>
          </div>
          <div class="flex flex-col gap-1 p-3 rounded-xl bg-orange-500/5 justify-center">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase">Avg Duration</span>
            <span class="text-xl font-bold text-brand-dark">{{ data?.meetings?.avgMeetingDuration || 0 }}m</span>
          </div>
          <div class="flex flex-col gap-1 p-3 rounded-xl bg-orange-500/5 justify-center">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase">Avg Attendees</span>
            <span class="text-xl font-bold text-brand-dark">{{ data?.meetings?.avgAttendees || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- 6. Attendance Analytics (1x1) -->
      <div class="card-glass rounded-[24px] p-6 flex flex-col gap-4 border border-white/80 shadow-glass lg:col-span-1 lg:row-span-1 min-h-0">
        <div class="flex items-center gap-2 border-b border-black/5 pb-3">
          <PhCalendarCheck :size="20" weight="bold" class="text-teal-500" />
          <h3 class="font-header font-bold text-lg text-brand-dark">Attendance</h3>
        </div>
        <div class="grid grid-cols-2 gap-3 flex-1">
          <div class="flex flex-col justify-center">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase">Overall Rate</span>
            <span class="text-xl font-bold text-brand-dark">{{ data?.attendance?.overallRate || 0 }}%</span>
          </div>
          <div class="flex flex-col justify-center">
            <span class="text-[9px] font-extrabold text-brand-slate uppercase">Streak</span>
            <span class="text-xl font-bold text-brand-dark">{{ data?.attendance?.consecutiveStreak || 0 }}</span>
          </div>
          <div class="flex flex-col col-span-2 p-2 bg-teal-500/5 rounded-xl border border-teal-500/10 justify-center">
            <span class="text-[9px] font-extrabold text-teal-700 uppercase">Top Attendee</span>
            <span class="text-sm font-bold text-teal-900 truncate">{{ data?.attendance?.bestMember || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- 7. Community Engagement (1x1) -->
      <div class="card-glass rounded-[24px] p-6 flex flex-col gap-4 border border-white/80 shadow-glass lg:col-span-1 lg:row-span-1 min-h-0">
        <div class="flex items-center gap-2 border-b border-black/5 pb-3">
          <PhChatTeardropText :size="20" weight="bold" class="text-pink-500" />
          <h3 class="font-header font-bold text-lg text-brand-dark">Engagement</h3>
        </div>
        <div class="flex flex-col gap-3 flex-1 justify-center">
          <div class="grid grid-cols-2 gap-3">
            <div class="flex flex-col p-2 bg-pink-500/5 rounded-xl border border-pink-500/10">
              <span class="text-[9px] font-extrabold text-pink-700 uppercase mb-0.5">Msgs Today</span>
              <span class="text-lg font-bold text-pink-900">{{ data?.community?.messagesToday || 0 }}</span>
            </div>
            <div class="flex flex-col p-2 bg-pink-500/5 rounded-xl border border-pink-500/10">
              <span class="text-[9px] font-extrabold text-pink-700 uppercase mb-0.5">Active</span>
              <span class="text-lg font-bold text-pink-900">{{ data?.community?.activeMembers || 0 }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center pt-2">
            <span class="text-[11px] font-semibold text-brand-slate">Rate</span>
            <span class="text-sm font-bold text-green-500">{{ data?.community?.engagementRate || 0 }}%</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { 
  PhUsers, PhCheckCircle, PhVideoCamera, PhBrain, 
  PhChartLineUp, PhTrophy, PhCrown, PhTarget, 
  PhSparkle, PhCalendarCheck, PhChatTeardropText 
} from '@phosphor-icons/vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>
