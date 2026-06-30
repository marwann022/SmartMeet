import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from './auth'
import { useAlertStore } from './alert'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref([])
  const statusOrder = ['todo', 'inprogress', 'review', 'done']
  const authStore = useAuthStore()
  const alertStore = useAlertStore()

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  const isAuthorized = (task) => {
    const userId = authStore.user?._id
    const isAdmin = authStore.user?.role === 'admin'
    const isCreator = task.createdBy === userId || (task.createdBy && task.createdBy._id === userId)
    return isAdmin || isCreator
  }

  const isExtracted = (task) => {
    return task.source && task.source.startsWith('Meeting:')
  }

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
        dueTime: task.dueTime || '23:59',
        source: task.source || 'Manual Entry'
      }
      const { data } = await axios.post('http://localhost:5000/api/tasks', newTaskData, getHeaders())
      if (data.success) {
        tasks.value.unshift(data.task)
      }
    } catch (error) {
      console.error('Failed to add task:', error)
      alertStore.showAlert(error.response?.data?.message || 'Failed to add task', 'Error', 'danger')
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
      alertStore.showAlert(error.response?.data?.message || 'Failed to delete task', 'Error', 'danger')
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

    if (newDone && isExtracted(task) && !isAuthorized(task)) {
      alertStore.showAlert('Only the admin or task creator can mark meeting-extracted tasks as done.', 'Access Denied', 'review')
      return false
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
      return true
    } catch (error) {
      console.error('Failed to toggle task:', error)
      // Rollback on error
      task.done = originalDone
      task.status = originalStatus
      task.previousStatus = originalPreviousStatus
      return false
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

      if (newStatus === 'done' && isExtracted(task) && !isAuthorized(task)) {
        alertStore.showAlert('Only the admin or task creator can mark meeting-extracted tasks as done.', 'Access Denied', 'review')
        return false
      }



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
        return true
      } catch (error) {
        console.error('Failed to move task:', error)
        // Rollback on error
        task.status = originalStatus
        task.previousStatus = originalPreviousStatus
        task.done = originalDone
        return false
      }
    }
    return false
  }

  const setTaskStatus = async (id, newStatus) => {
    const task = tasks.value.find(t => String(t.id) === String(id) || String(t._id) === String(id))
    if (task) {
      const originalStatus = task.status
      const originalPreviousStatus = task.previousStatus
      const originalDone = task.done

      const newDone = newStatus === 'done'
      const newPreviousStatus = task.status !== 'done' ? task.status : task.previousStatus

      if (newStatus === 'done' && isExtracted(task) && !isAuthorized(task)) {
        alertStore.showAlert('Only the admin or task creator can mark meeting-extracted tasks as done.', 'Access Denied', 'review')
        return false
      }



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
        return true
      } catch (error) {
        console.error('Failed to set task status:', error)
        // Rollback
        task.status = originalStatus
        task.previousStatus = originalPreviousStatus
        task.done = originalDone
        return false
      }
    }
    return false
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
