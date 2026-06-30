/**
 * Single source of truth for all task deadline logic.
 * Consumed by TaskCard.vue, DashboardTasks.vue, and DashboardMain.vue.
 * Never hardcode deadline colors or urgency labels inside components.
 */

/** Parse a task's deadline into a JS Date. Returns null if dueDate is missing. */
export const getDeadlineDate = (dueDate, dueTime) => {
  if (!dueDate) return null
  const [h, m] = (dueTime || '23:59').split(':').map(Number)
  const parts = dueDate.split('-').map(Number)
  return new Date(parts[0], parts[1] - 1, parts[2], h || 23, m || 59, 0)
}

/**
 * Returns countdown display info for a task.
 * @param {object} task
 * @param {Date} now — injected so computed properties can react to clock ticks
 * @returns {{ label: string, urgency: 'done'|'overdue'|'today'|'tomorrow'|'near'|'far'|'none', msLeft: number }}
 */
export const getCountdownInfo = (task, now = new Date()) => {
  if (task.status === 'done' || task.done) {
    return { label: '✅ Done', urgency: 'done', msLeft: Infinity }
  }

  const deadline = getDeadlineDate(task.dueDate, task.dueTime)
  if (!deadline) return { label: '', urgency: 'none', msLeft: Infinity }

  const msLeft = deadline - now

  if (msLeft < 0) {
    const totalMs = Math.abs(msLeft)
    const days = Math.floor(totalMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((totalMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let label = '🔴 Overdue'
    if (days > 0) label += ` by ${days}d`
    else if (hours > 0) label += ` by ${hours}h`
    return { label, urgency: 'overdue', msLeft }
  }

  const hoursLeft = msLeft / (1000 * 60 * 60)
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24))

  if (hoursLeft < 24) {
    const h = Math.floor(hoursLeft)
    const min = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60))
    if (h === 0 && min === 0) return { label: '⚠️ Due Today', urgency: 'today', msLeft }
    const timePart = h > 0 ? `${h}h ${min}m left` : `${min}m left`
    return { label: `⚠️ Due Today · ${timePart}`, urgency: 'today', msLeft }
  }

  const hoursRemainder = Math.floor(hoursLeft % 24)

  if (daysLeft === 1) {
    return { label: `⏳ Tomorrow · ${hoursRemainder}h left`, urgency: 'tomorrow', msLeft }
  }

  return {
    label: `⏳ ${daysLeft}d ${hoursRemainder}h left`,
    urgency: daysLeft <= 7 ? 'near' : 'far',
    msLeft,
  }
}

/**
 * Returns Tailwind color class strings based on deadline urgency.
 * - text: for date labels
 * - bg:   for progress bar fill
 * - badge: for the countdown badge pill
 */
export const getDeadlineColors = (task, now = new Date()) => {
  if (task.status === 'done' || task.done) {
    return {
      text: 'text-emerald-500',
      bg: 'bg-emerald-500',
      badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
    }
  }

  const deadline = getDeadlineDate(task.dueDate, task.dueTime)
  if (!deadline) {
    return {
      text: 'text-brand-slate',
      bg: 'bg-slate-300',
      badge: 'bg-slate-100 text-slate-500 border-slate-200',
    }
  }

  const msLeft = deadline - now
  const hoursLeft = msLeft / (1000 * 60 * 60)
  const daysLeft = msLeft / (1000 * 60 * 60 * 24)

  if (msLeft < 0) {
    // Overdue — dark red
    return {
      text: 'text-red-700',
      bg: 'bg-red-700',
      badge: 'bg-red-700/10 text-red-700 border-red-700/20',
    }
  }
  if (hoursLeft < 24) {
    // Less than 24 hours — red
    return {
      text: 'text-red-500',
      bg: 'bg-red-500',
      badge: 'bg-red-500/10 text-red-600 border-red-500/20',
    }
  }
  if (daysLeft < 3) {
    // Less than 3 days — orange
    return {
      text: 'text-orange-500',
      bg: 'bg-orange-500',
      badge: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    }
  }
  if (daysLeft < 7) {
    // 3–7 days — yellow
    return {
      text: 'text-yellow-500',
      bg: 'bg-yellow-500',
      badge: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    }
  }
  // More than 7 days — green
  return {
    text: 'text-emerald-500',
    bg: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
  }
}

/**
 * Returns the percentage of time elapsed between task creation and its deadline.
 * Used to drive the progress bar (0–100).
 */
export const getProgressPercent = (task, now = new Date()) => {
  const deadline = getDeadlineDate(task.dueDate, task.dueTime)
  if (!deadline || !task.createdAt) return 0

  const created = new Date(task.createdAt)
  const total = deadline - created
  const elapsed = now - created

  if (total <= 0) return 100
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)))
}

/**
 * Sorts tasks by deadline urgency (most urgent first).
 * Order: Overdue → Due Today → Tomorrow → Nearest → Furthest → No deadline → Done
 * Returns a new array; never mutates the input.
 */
export const sortByUrgency = (tasks, now = new Date()) => {
  const order = { overdue: 0, today: 1, tomorrow: 2, near: 3, far: 4, none: 5, done: 6 }

  return [...tasks].sort((a, b) => {
    const infoA = getCountdownInfo(a, now)
    const infoB = getCountdownInfo(b, now)
    const orderA = order[infoA.urgency] ?? 5
    const orderB = order[infoB.urgency] ?? 5
    if (orderA !== orderB) return orderA - orderB
    // Tie-break within same urgency bucket: nearest deadline first
    return infoA.msLeft - infoB.msLeft
  })
}

/** Format YYYY-MM-DD → "Mon DD" display string (e.g. "Jul 5") */
export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return 'TBD'
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/** Returns today as YYYY-MM-DD */
export const getTodayString = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
