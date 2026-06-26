import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const loading = ref(false)

  const getHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })

  // Helper to convert ISO dates into human relative time strings
  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Just now'
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    if (diffSec < 0) return 'Just now'
    if (diffSec < 60) return 'Just now'
    
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    
    const diffHour = Math.floor(diffMin / 60)
    if (diffHour < 24) return `${diffHour}h ago`
    
    const diffDay = Math.floor(diffHour / 24)
    return `${diffDay}d ago`
  }

  // Computed unread count
  const unreadCount = computed(() => 
    notifications.value.filter(n => !n.read).length
  )

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      loading.value = true
      const { data } = await axios.get('http://localhost:5000/api/notifications', getHeaders())
      if (data.success) {
        // Map the backend structure to include UI fields
        notifications.value = data.notifications.map(n => ({
          id: n.id || n._id,
          text: n.text,
          type: n.type,
          read: n.read,
          createdAt: n.createdAt,
          time: timeAgo(n.createdAt)
        }))
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      loading.value = false
    }
  }

  const addNotification = async ({ text, type = 'task', relatedId = null }) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const { data } = await axios.post('http://localhost:5000/api/notifications', {
        text,
        type,
        relatedId
      }, getHeaders())

      if (data.success) {
        const n = data.notification
        notifications.value.unshift({
          id: n.id || n._id,
          text: n.text,
          type: n.type,
          read: n.read,
          createdAt: n.createdAt,
          time: timeAgo(n.createdAt)
        })
      }
    } catch (error) {
      console.error('Failed to add notification:', error)
    }
  }

  const markAsRead = async (id) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification && !notification.read) {
      // Optimistic update
      notification.read = true
      
      try {
        await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, getHeaders())
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
        // Rollback on error
        notification.read = false
      }
    }
  }

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.value.filter(n => !n.read)
    if (unreadNotifications.length === 0) return

    // Save original state for potential rollback
    const originalState = notifications.value.map(n => ({ ...n }))

    // Optimistic update
    notifications.value.forEach(n => {
      n.read = true
    })

    try {
      await axios.put('http://localhost:5000/api/notifications/read-all', {}, getHeaders())
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      // Rollback
      notifications.value = originalState
    }
  }

  const clearAll = async () => {
    if (notifications.value.length === 0) return

    // Save original state for potential rollback
    const originalState = [...notifications.value]

    // Optimistic update
    notifications.value = []

    try {
      await axios.delete('http://localhost:5000/api/notifications', getHeaders())
    } catch (error) {
      console.error('Failed to clear notifications:', error)
      // Rollback
      notifications.value = originalState
    }
  }

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  }
})
