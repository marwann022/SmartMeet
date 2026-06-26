import { defineStore } from 'pinia'
import { ref } from 'vue'
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
  const meetings = ref([
    {
      id: '101',
      title: 'Q3 Strategic Product Roadmap & Resource Allocation',
      description: 'A comprehensive review of upcoming feature priorities, team velocity, and technical debt reconciliation strategies.',
      date: 'Nov 12, 2026',
      time: '09:30 AM',
      duration: '45 minutes',
      type: 'Personal Discussion',
      bullets: [
        'Confirmed the transition to a micro-frontend architecture by late August to support scaling needs.',
        'Allocated 20% of engineering bandwidth specifically for technical debt and documentation.',
        'Sarah voiced concerns about the current QA pipeline bottlenecks, leading to a dedicated review scheduled for next week.'
      ],
      timeline: [
        { time: '00:00', title: 'Kickoff' },
        { time: '12:30', title: 'Roadmap Review' },
        { time: '24:15', title: 'Resource Conflict' },
        { time: '38:45', title: 'Budget & Close' }
      ],
      tasks: [
        { id: 1, title: 'Update Q3 Feature Spreadsheet', assignee: 'Marcus Chen', priority: 'HIGH', checked: true },
        { id: 2, title: 'Draft technical debt reconciliation plan', assignee: 'Elena Rodriguez', priority: 'MED', checked: false },
        { id: 3, title: 'Schedule follow-up with Infrastructure team', assignee: 'Marcus Chen', priority: 'LOW', checked: false }
      ],
      decisions: [
        { status: 'APPROVED', text: 'Shift to "Core-First" feature release strategy for Q3.' },
        { status: 'PENDING REVIEW', text: 'Proposed migration to AWS SageMaker for AI training.' }
      ],
      transcript: [
        { speaker: 'Marcus Chen', timestamp: '12:04', text: 'We need to be really realistic about the bandwidth here.' },
        { speaker: 'Sarah Kim', timestamp: '12:18', text: 'I agree. The current technical debt is causing a 10% dip in velocity.' },
        { speaker: 'Elena Rodriguez', timestamp: '12:45', text: 'Let\'s allocate a specific 20% slice of engineering capacity just for debt.' }
      ]
    },
    {
      id: '102',
      title: 'Q4 Strategy Sync',
      description: 'Discussion focused on scaling GPU clusters and refining the model training pipeline.',
      date: 'Nov 14, 2026',
      time: '01:30 PM',
      duration: '45 minutes',
      type: 'Zoom',
      bullets: [
        'Reviewed scaling targets for GPU instances in AWS cluster.',
        'Refined the checkpoint frequency during LLM fine-tuning.',
        'Approved initial draft of model pipeline architecture diagram.'
      ],
      timeline: [
        { time: '00:00', title: 'Intro & GPUs' },
        { time: '15:00', title: 'Fine-Tuning Checkpoints' },
        { time: '30:00', title: 'Architecture Review' },
        { time: '40:00', title: 'Next Steps' }
      ],
      tasks: [
        { id: 4, title: 'Request quote for additional NVIDIA H100 instances', assignee: 'Alex Chen', priority: 'HIGH', checked: false },
        { id: 5, title: 'Update checkpoint parameters in training script', assignee: 'David Chen', priority: 'MED', checked: true }
      ],
      decisions: [
        { status: 'APPROVED', text: 'Scale GPU cluster sizes by 50% for Q4.' }
      ],
      transcript: [
        { speaker: 'Alex Chen', timestamp: '05:10', text: 'Our LLM fine-tuning runs are hitting VRAM caps.' },
        { speaker: 'David Chen', timestamp: '08:30', text: 'I can test lower batch sizes, but it will slow down training.' }
      ]
    },
    {
      id: '103',
      title: 'Design Review: Nexus Pro',
      description: 'Client feedback session regarding user interface style guides and contrast ratios.',
      date: 'Nov 15, 2026',
      time: '10:00 AM',
      duration: '22 minutes',
      type: 'In-Person',
      bullets: [
        'Client loved the glassmorphism approach but requested higher contrast on text variables.',
        'Agreed to increase font weight on active navigation text elements.',
        'Sign-off on default color scheme patterns.'
      ],
      timeline: [
        { time: '00:00', title: 'UI Review' },
        { time: '10:00', title: 'Contrast Discussion' },
        { time: '18:00', title: 'Color Palette Sign-off' }
      ],
      tasks: [
        { id: 6, title: 'Increase text color contrast in CSS file', assignee: 'Alex Chen', priority: 'HIGH', checked: false },
        { id: 7, title: 'Update font weights in navbar component', assignee: 'Alex Chen', priority: 'LOW', checked: true }
      ],
      decisions: [
        { status: 'APPROVED', text: 'Default navbar design styling contrast updates.' }
      ],
      transcript: [
        { speaker: 'Client', timestamp: '02:30', text: 'The glass card outlines look extremely premium.' },
        { speaker: 'Alex Chen', timestamp: '05:40', text: 'Makes sense. I will bump up the text color to a darker slate color.' }
      ]
    },
    {
      id: '104',
      title: 'Daily Standup: Engineering',
      description: 'AI action items standup checkin.',
      date: 'Nov 16, 2026',
      time: '09:30 AM',
      duration: '15 minutes',
      type: 'Brainstorm',
      bullets: [
        'Standup updates: DB latency patches, API documentation v2, security audit schedules.',
        'Infrastructure teams checked metrics logs.'
      ],
      timeline: [
        { time: '00:00', title: 'Syncup start' },
        { time: '05:00', title: 'DB patch discussions' },
        { time: '10:00', title: 'Security review plan' }
      ],
      tasks: [
        { id: 8, title: 'Patch DB latency issues', assignee: 'Jane Doe', priority: 'HIGH', checked: false },
        { id: 9, title: 'Finalize API documentation for v2', assignee: 'Alex Chen', priority: 'MED', checked: false },
        { id: 10, title: 'Schedule security audit', assignee: 'David Chen', priority: 'HIGH', checked: false }
      ],
      decisions: [
        { status: 'APPROVED', text: 'Roll out DB patch next Tuesday.' }
      ],
      transcript: [
        { speaker: 'Jane Doe', timestamp: '02:10', text: 'The DB latency issues are causing API timeouts.' },
        { speaker: 'Alex Chen', timestamp: '04:15', text: 'Excellent, send me the draft so I can finalize API doc reviews.' }
      ]
    }
  ])

  const upcomingMeetings = ref([
    { id: 1, month: 'NOV', day: '14', title: 'Marketing Sync', time: '1:30 PM', location: 'Zoom', featured: true },
    { id: 2, month: 'NOV', day: '15', title: 'Project Nexus Launch', time: '10:00 AM', location: 'In-Person', featured: false },
    { id: 3, month: 'NOV', day: '15', title: 'One-on-One: Sarah', time: '4:00 PM', location: 'Jitsi', featured: false }
  ])

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
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const { data } = await axios.get(`${API}/meetings`, getHeaders())
      if (data.success && data.meetings.length > 0) {
        meetings.value = data.meetings.map(transformMeeting)
      }
    } catch (error) {
      console.error('Failed to fetch meetings:', error)
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
        enrichment.transcript = t?.transcript
          ? t.transcript.split('\n').filter(Boolean).map((line, i) => ({
              speaker: 'Speaker',
              timestamp: `${Math.floor(i * 30 / 60)}:${String((i * 30) % 60).padStart(2, '0')}`,
              text: line
            }))
          : []
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

  const uploadRecording = async (meetingId, file) => {
    const formData = new FormData()
    formData.append('recording', file)
    const { data } = await axios.post(`${API}/meetings/${meetingId}/upload-recording`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return data
  }

  const processMeeting = async (meetingId) => {
    const { data } = await axios.post(`${API}/meetings/${meetingId}/process`, {}, getHeaders())
    return data
  }

  return {
    meetings,
    upcomingMeetings,
    selectedMeeting,
    activeLiveMeeting,
    fetchMeetings,
    fetchMeetingDetails,
    createMeeting,
    deleteMeeting,
    updateMeeting,
    uploadRecording,
    processMeeting
  }
})
