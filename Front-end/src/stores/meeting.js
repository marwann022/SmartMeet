import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API = 'http://localhost:5000/api'

const getHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
})

const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const formatDuration = (minutes) => {
  if (!minutes) return ''
  return `${minutes} minutes`
}

export const useMeetingStore = defineStore('meeting', () => {
  const meetings = ref([])
  const loading = ref(false)
  const error = ref(null)

  const upcomingMeetings = computed(() => {
    const now = new Date()
    return meetings.value
      .filter(m => m.status === 'scheduled' || new Date(m.startTime) > now)
      .map(m => {
        const d = new Date(m.startTime)
        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
        return {
          id: m.id,
          month: months[d.getMonth()] || 'NOV',
          day: String(d.getDate()).padStart(2, '0'),
          title: m.title,
          time: m.time,
          location: m.type || 'Jitsi',
          featured: false
        }
      })
  })

  const selectedMeeting = ref(null)
  const activeLiveMeeting = ref(null)

  const transformMeeting = (m) => ({
    id: m._id || m.id,
    _id: m._id,
    title: m.title,
    description: m.description || '',
    date: formatDate(m.startTime),
    time: formatTime(m.startTime),
    duration: formatDuration(m.duration),
    type: m.type || 'Team',
    participants: m.participants || [],
    participantsCount: m.participants?.length || 0,
    meetingLink: m.meetingLink || '',
    recordingPath: m.recordingPath || '',
    status: m.status || 'scheduled',
    startTime: m.startTime,
    // Knowledge enrichments (filled by fetchMeetingDetails)
    bullets: m.bullets || [],
    timeline: m.timeline || [],
    tasks: m.tasks || [],
    decisions: m.decisions || [],
    transcript: m.transcript || []
  })

  const fetchMeetings = async () => {
    loading.value = true
    error.value = null
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        loading.value = false
        return
      }

      const { data } = await axios.get(`${API}/meetings`, getHeaders())
      if (data.success) {
        meetings.value = (data.meetings || []).map(transformMeeting)
      }
    } catch (err) {
      console.error('Failed to fetch meetings:', err)
      error.value = 'Failed to load meetings.'
    } finally {
      loading.value = false
    }
  }

  const fetchMeetingDetails = async (meetingId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null

      const [summaryRes, tasksRes, decisionsRes, transcriptRes] = await Promise.allSettled([
        axios.get(`${API}/meetings/${meetingId}/summary`, getHeaders()),
        axios.get(`${API}/meetings/${meetingId}/tasks`, getHeaders()),
        axios.get(`${API}/meetings/${meetingId}/decisions`, getHeaders()),
        axios.get(`${API}/meetings/${meetingId}/transcript`, getHeaders())
      ])

      const enrichment = {}

      if (summaryRes.status === 'fulfilled' && summaryRes.value.data.success) {
        const s = summaryRes.value.data.summary
        enrichment.summary = s?.summary || ''
        enrichment.meetingOverview = s?.meetingOverview || ''
        enrichment.topics = s?.topics || []
        enrichment.bullets = s?.summary ? s.summary.split('. ').filter(Boolean).map(b => b + '.') : []
      }

      if (tasksRes.status === 'fulfilled' && tasksRes.value.data.success) {
        enrichment.tasks = tasksRes.value.data.tasks.map(t => ({
          id: t._id,
          title: t.title,
          assignee: t.assignedTo || 'Unassigned',
          priority: t.priority === 'high' ? 'HIGH' : t.priority === 'medium' ? 'MED' : 'LOW',
          checked: t.status === 'done',
          _id: t._id
        }))
      }

      if (decisionsRes.status === 'fulfilled' && decisionsRes.value.data.success) {
        enrichment.decisions = (decisionsRes.value.data.decisions || []).map(d => ({
          status: d.confidence >= 0.7 ? 'APPROVED' : 'PENDING REVIEW',
          text: d.text
        }))
      }

      if (transcriptRes.status === 'fulfilled' && transcriptRes.value.data.success) {
        const t = transcriptRes.value.data.transcript
        enrichment.transcript = []
        if (t?.transcript) {
          const lines = t.transcript.split('\n').filter(Boolean)
          enrichment.transcript = lines.map((line, i) => {
            const match = line.match(/^\[(\d{2}:\d{2})\]\s*([^:]+):\s*(.*)$/)
            if (match) {
              return {
                timestamp: match[1],
                speaker: match[2],
                text: match[3]
              }
            }
            return {
              speaker: 'Speaker',
              timestamp: `${Math.floor(i * 30 / 60)}:${String((i * 30) % 60).padStart(2, '0')}`,
              text: line
            }
          })
        }
      }

      return enrichment
    } catch (error) {
      console.error('Failed to fetch meeting details:', error)
      return null
    }
  }

  const createMeeting = async (meeting) => {
    try {
      const payload = {
        title: meeting.title,
        description: meeting.description || '',
        startTime: meeting.datetime || meeting.startTime || null,
        duration: parseInt(meeting.duration) || 30,
        type: meeting.type || 'Team',
        participants: (meeting.participants || []).map(p => typeof p === 'string' ? { name: p } : p),
        meetingLink: meeting.meetLink || ''
      }
      const { data } = await axios.post(`${API}/meetings`, payload, getHeaders())
      if (data.success) {
        const transformed = transformMeeting(data.meeting)
        meetings.value.unshift(transformed)
        return transformed
      }
    } catch (error) {
      console.error('Failed to create meeting:', error)
      const fallback = {
        id: Date.now().toString(),
        title: meeting.title,
        description: meeting.description,
        date: formatDate(meeting.datetime),
        time: formatTime(meeting.datetime),
        duration: meeting.duration || '30 minutes',
        type: meeting.type || 'Team',
        ...meeting
      }
      meetings.value.unshift(fallback)
      return fallback
    }
  }

  const deleteMeeting = async (id) => {
    try {
      const { data } = await axios.delete(`${API}/meetings/${id}`, getHeaders())
      if (data.success) {
        meetings.value = meetings.value.filter(m => m.id !== id && m._id !== id)
      }
    } catch (error) {
      console.error('Failed to delete meeting:', error)
      meetings.value = meetings.value.filter(m => m.id !== id && m._id !== id)
    }
  }

  const fetchMeeting = async (meetingId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return null
      const { data } = await axios.get(`${API}/meetings/${meetingId}`, getHeaders())
      if (data.success) {
        return transformMeeting(data.meeting)
      }
      return null
    } catch (error) {
      console.error('Failed to fetch meeting:', error)
      return null
    }
  }

  const updateMeeting = async (updatedMeeting) => {
    try {
      const id = updatedMeeting._id || updatedMeeting.id
      const { data } = await axios.put(`${API}/meetings/${id}`, updatedMeeting, getHeaders())
      if (data.success) {
        const idx = meetings.value.findIndex(m => m.id === id || m._id === id)
        if (idx !== -1) {
          meetings.value[idx] = { ...meetings.value[idx], ...transformMeeting(data.meeting) }
        }
      }
    } catch (error) {
      console.error('Failed to update meeting:', error)
    }
  }

  const processMeeting = async (meetingId, liveTranscript = null) => {
    const { data } = await axios.post(`${API}/meetings/${meetingId}/process`, { liveTranscript }, getHeaders())
    return data
  }

  const extractLiveTask = async (text) => {
    const { data } = await axios.post(`${API}/meetings/live-extract-task`, { text }, getHeaders())
    return data
  }

  const extractLiveDecision = async (text) => {
    const { data } = await axios.post(`${API}/meetings/live-extract-decision`, { text }, getHeaders())
    return data
  }

  return {
    meetings,
    loading,
    error,
    upcomingMeetings,
    selectedMeeting,
    activeLiveMeeting,
    fetchMeetings,
    fetchMeeting,
    fetchMeetingDetails,
    createMeeting,
    deleteMeeting,
    updateMeeting,
    extractLiveDecision,
    processMeeting,
    extractLiveTask
  }
})
