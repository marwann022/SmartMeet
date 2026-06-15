import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([
    { id: 1, title: 'Patch DB latency issues', description: 'Identified in Daily Standup: P95 query time exceeds 800ms. Needs immediate fix before next deploy.', priority: 'High', status: 'todo', assignee: 'Alex Chen', avatarColor: 'bg-primary', due: 'Jun 10', overdue: true, done: false, source: 'Daily Standup: Engineering' },
    { id: 2, title: 'Finalize API docs for v2', description: 'All public endpoints need updated examples and error response tables. Share with front-end team by EOD Friday.', priority: 'High', status: 'todo', assignee: 'Sarah Kim', avatarColor: 'bg-secondary', due: 'Jun 12', overdue: false, done: false, source: 'Daily Standup: Engineering' },
    { id: 3, title: 'Schedule security audit', description: 'Coordinate with the infosec team to book a full penetration test on the new auth service before launch.', priority: 'Medium', status: 'todo', assignee: 'James Park', avatarColor: 'bg-accent', due: 'Jun 18', overdue: false, done: false, source: 'Q4 Strategy Sync' },
    { id: 4, title: 'Update UI contrast ratios', description: 'Client flagged low contrast on text variables during Design Review. Revise glassmorphic card text to meet AA standard.', priority: 'Medium', status: 'inprogress', assignee: 'Alex Chen', avatarColor: 'bg-primary', due: 'Jun 11', overdue: true, done: false, source: 'Design Review: Nexus Pro' },
    { id: 5, title: 'Draft roadmap v2.1', description: 'Compile feature proposals from Q3 retro, prioritize by engineering effort and business impact into a Notion doc.', priority: 'Low', status: 'inprogress', assignee: 'Sarah Kim', avatarColor: 'bg-secondary', due: 'Jun 20', overdue: false, done: false, source: 'Q4 Strategy Sync' },
    { id: 6, title: 'Scale GPU cluster config', description: 'Discuss with DevOps to increase A100 cluster from 8 to 16 nodes ahead of the model training sprint.', priority: 'High', status: 'inprogress', assignee: 'James Park', avatarColor: 'bg-accent', due: 'Jun 14', overdue: false, done: false, source: 'Q4 Strategy Sync' },
    { id: 7, title: 'Update security protocols', description: 'Review and update auth token expiry policies and rotate all production secrets after new compliance directive.', priority: 'High', status: 'done', assignee: 'Alex Chen', avatarColor: 'bg-primary', due: 'Jun 8', overdue: false, done: true, source: 'Daily Standup: Engineering' },
    { id: 8, title: 'Review Nexus transcript', description: 'Cross-reference the AI-generated transcript with the client\'s recorded feedback and identify discrepancies.', priority: 'Low', status: 'done', assignee: 'Sarah Kim', avatarColor: 'bg-secondary', due: 'Jun 9', overdue: false, done: true, source: 'Design Review: Nexus Pro' }
  ])

  const statusOrder = ['todo', 'inprogress', 'review', 'done']

  const addTask = (task) => {
    tasks.value.unshift({
      id: Date.now(),
      title: task.title,
      description: task.description || 'No description provided.',
      priority: task.priority || 'Medium',
      status: task.status || 'todo',
      assignee: task.assignee || 'Alex Chen',
      avatarColor: task.avatarColor || 'bg-primary',
      due: task.due || 'TBD',
      overdue: false,
      done: task.status === 'done',
      source: task.source || 'Manual Entry'
    })
  }

  const updateTask = (updatedTask) => {
    const idx = tasks.value.findIndex(t => t.id === updatedTask.id)
    if (idx !== -1) {
      tasks.value[idx] = { ...tasks.value[idx], ...updatedTask }
    }
  }

  const removeTask = (id) => {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  const toggleTask = (task) => {
    task.done = !task.done
    task.status = task.done ? 'done' : 'todo'
  }

  const moveTask = (task, direction) => {
    const currentIndex = statusOrder.indexOf(task.status)
    const nextIndex = currentIndex + direction
    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      task.status = statusOrder[nextIndex]
      task.done = task.status === 'done'
    }
  }

  return {
    tasks,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    moveTask
  }
})
