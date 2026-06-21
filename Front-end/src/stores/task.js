import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const statusOrder = ['todo', 'inprogress', 'review', 'done']

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const { data } = await axios.get('http://localhost:5000/api/tasks', getHeaders())
      if (data.success) {
        tasks.value = data.tasks
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    }
  }

  const addTask = async (task) => {
    try {
      const newTaskData = {
        title: task.title,
        description: task.description || 'No description provided.',
        priority: task.priority || 'MEDIUM PRIORITY',
        status: task.status || 'todo',
        assignee: task.assignee || 'Alex Chen',
        avatarColor: task.avatarColor || 'bg-primary',
        due: task.due || 'TBD',
        dueDate: task.dueDate || '',
        source: task.source || 'Manual Entry'
      }
      const { data } = await axios.post('http://localhost:5000/api/tasks', newTaskData, getHeaders())
      if (data.success) {
        tasks.value.unshift(data.task)
      }
    } catch (error) {
      console.error('Failed to add task:', error)
      alert(error.response?.data?.message || 'Failed to add task')
    }
  }

  const updateTask = async (updatedTask) => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/tasks/${updatedTask.id}`, updatedTask, getHeaders())
      if (data.success) {
        const idx = tasks.value.findIndex(t => t.id === updatedTask.id)
        if (idx !== -1) {
          tasks.value[idx] = { ...tasks.value[idx], ...data.task }
        }
      }
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const removeTask = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/tasks/${id}`, getHeaders())
      if (data.success) {
        tasks.value = tasks.value.filter(t => t.id !== id)
      }
    } catch (error) {
      console.error('Failed to delete task:', error)
      alert(error.response?.data?.message || 'Failed to delete task')
    }
  }

  const toggleTask = async (task) => {
    const originalDone = task.done
    const originalStatus = task.status
    const originalPreviousStatus = task.previousStatus

    let newDone, newStatus, newPreviousStatus;
    if (!task.done) {
      newPreviousStatus = task.status
      newDone = true
      newStatus = 'done'
    } else {
      newDone = false
      newStatus = task.previousStatus || 'todo'
      newPreviousStatus = task.previousStatus
    }

    // Optimistic UI update
    task.done = newDone
    task.status = newStatus
    task.previousStatus = newPreviousStatus

    try {
      await axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
        done: newDone,
        status: newStatus,
        previousStatus: newPreviousStatus
      }, getHeaders())
    } catch (error) {
      console.error('Failed to toggle task:', error)
      // Rollback on error
      task.done = originalDone
      task.status = originalStatus
      task.previousStatus = originalPreviousStatus
    }
  }

  const moveTask = async (task, direction) => {
    const currentIndex = statusOrder.indexOf(task.status)
    const nextIndex = currentIndex + direction
    if (nextIndex >= 0 && nextIndex < statusOrder.length) {
      const originalStatus = task.status
      const originalPreviousStatus = task.previousStatus
      const originalDone = task.done

      const newStatus = statusOrder[nextIndex]
      const newDone = newStatus === 'done'
      const newPreviousStatus = task.status !== 'done' ? task.status : task.previousStatus

      // Optimistic update
      task.status = newStatus
      task.done = newDone
      if (originalStatus !== 'done') {
        task.previousStatus = originalStatus
      }

      try {
        await axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
          status: newStatus,
          done: newDone,
          previousStatus: task.previousStatus
        }, getHeaders())
      } catch (error) {
        console.error('Failed to move task:', error)
        // Rollback on error
        task.status = originalStatus
        task.previousStatus = originalPreviousStatus
        task.done = originalDone
      }
    }
  }

  const setTaskStatus = async (id, newStatus) => {
    const task = tasks.value.find(t => String(t.id) === String(id))
    if (task) {
      const originalStatus = task.status
      const originalPreviousStatus = task.previousStatus
      const originalDone = task.done

      const newDone = newStatus === 'done'
      const newPreviousStatus = task.status !== 'done' ? task.status : task.previousStatus

      // Optimistic update
      task.status = newStatus
      task.done = newDone
      if (originalStatus !== 'done') {
        task.previousStatus = originalStatus
      }

      try {
        await axios.put(`http://localhost:5000/api/tasks/${id}`, {
          status: newStatus,
          done: newDone,
          previousStatus: task.previousStatus
        }, getHeaders())
      } catch (error) {
        console.error('Failed to set task status:', error)
        // Rollback
        task.status = originalStatus
        task.previousStatus = originalPreviousStatus
        task.done = originalDone
      }
    }
  }

  return {
    tasks,
    fetchTasks,
    addTask,
    updateTask,
    removeTask,
    toggleTask,
    moveTask,
    setTaskStatus
  }
})
