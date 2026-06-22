import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMeetingStore = defineStore('meeting', () => {
  const meetings = ref([
    {
      id: 101,
      title: 'Q3 Strategic Product Roadmap & Resource Allocation',
      description: 'A comprehensive review of upcoming feature priorities, team velocity, and technical debt reconciliation strategies for the second half of the year.',
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
        { speaker: 'Marcus Chen', timestamp: '12:04', text: 'We need to be really realistic about the bandwidth here. If we take on the micro-frontend migration now, the feature work stops for at least three weeks.' },
        { speaker: 'Sarah Kim', timestamp: '12:18', text: 'I agree. But the current technical debt is already causing a 10% dip in developer velocity. We are paying the price either way.' },
        { speaker: 'Elena Rodriguez', timestamp: '12:45', text: 'Let’s allocate a specific 20% slice of engineering capacity just for debt. That way we don’t freeze feature work completely.' }
      ]
    },
    {
      id: 102,
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
        { speaker: 'Alex Chen', timestamp: '05:10', text: 'Our LLM fine-tuning runs are hitting VRAM caps. We either optimize batch sizes or get more compute.' },
        { speaker: 'David Chen', timestamp: '08:30', text: 'I can test lower batch sizes, but it will slow down training. Let’s request more H100 instances first.' }
      ]
    },
    {
      id: 103,
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
        { speaker: 'Client', timestamp: '02:30', text: 'The glass card outlines look extremely premium. But let’s make sure users can read the text easily.' },
        { speaker: 'Alex Chen', timestamp: '05:40', text: 'Makes sense. I will bump up the text color to a darker slate color for accessibility.' }
      ]
    },
    {
      id: 104,
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
        { speaker: 'Jane Doe', timestamp: '02:10', text: 'The DB latency issues are causing API timeouts. I have a patch ready for testing.' },
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

  const createMeeting = (meeting) => {
    meetings.value.unshift({
      id: Date.now(),
      ...meeting
    })
  }

  const deleteMeeting = (id) => {
    meetings.value = meetings.value.filter(m => m.id !== id)
  }

  const updateMeeting = (updatedMeeting) => {
    const idx = meetings.value.findIndex(m => m.id === updatedMeeting.id)
    if (idx !== -1) {
      meetings.value[idx] = { ...meetings.value[idx], ...updatedMeeting }
    }
  }

  return {
    meetings,
    upcomingMeetings,
    selectedMeeting,
    activeLiveMeeting,
    createMeeting,
    deleteMeeting,
    updateMeeting
  }
})
