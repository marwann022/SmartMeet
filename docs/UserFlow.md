# SmartMeet — User Flow Documentation

## Complete User Journey Map

```mermaid
graph LR
    subgraph Onboarding["Onboarding"]
        A[Landing Page] --> B{Has Account?}
        B -->|No| C[Sign Up]
        B -->|Yes| D[Sign In]
        C --> E{Choose Role}
        E -->|Admin| F[Create Community]
        E -->|Member| G[Enter Community Code]
        G --> H[Join Request Created]
        H --> I[Wait for Admin Approval]
        I --> J[Dashboard]
        F --> J
        D --> J
    end

    subgraph Core["Core Usage"]
        J --> K[View Dashboard]
        K --> L[Create Meeting]
        K --> M[View Tasks]
        K --> N[Knowledge AI]
        K --> O[Community Chat]
        K --> P[Settings]
        L --> Q[Attend Meeting - Jitsi]
        Q --> R[Upload Recording]
        R --> S[AI Processing]
        S --> T[View Analysis]
        T --> U[Check Extracted Tasks]
        M --> V[Move Tasks through Workflow]
        V --> W[Submit for Review]
        W --> X[Admin Approves]
        X --> Y[Task Complete]
        N --> Z[Ask Questions about Meetings]
        Z --> AA[Get AI Responses with Sources]
        O --> AB[Send & Receive Chat Messages]
    end

    subgraph Notifications["Notification Flow"]
        AC[Socket.IO Client] --> AD[Real-time Toast]
        AE[Bell Icon Badge] --> AD
    end
```

## Detailed User Flows

### 1. Registration (Member)

**Goal:** Create an account and join an existing community workspace.

**Steps:**

```mermaid
sequenceDiagram
    actor U as New User
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    U->>FE: Visit /signup
    FE->>FE: Fill registration form (name, email, password)
    U->>FE: Select "Member" role
    U->>FE: Enter Community Code
    U->>FE: Submit form
    FE->>BE: POST /api/users/register { name, firstName, lastName, email, password, role: "user", communityCode }
    
    BE->>BE: Validate password strength
    BE->>DB: Community.findOne({ code: communityCode.toUpperCase() })
    DB-->>BE: Target community
    
    BE->>DB: User.create({...})
    DB-->>BE: New user (status: "pending")
    
    BE->>DB: JoinRequest.create({ user: user._id, community: community._id })
    DB-->>BE: New join request
    
    BE->>DB: Notification.create({ recipient: community.owner, type: "join-request", ... })
    BE->>BE: Create Session with device info
    BE->>BE: Generate JWT
    
    BE-->>FE: 201 { success: true, token, sessionId, user }
    FE->>FE: Store token in localStorage
    FE->>FE: Redirect to /dashboard
    FE-->>U: See dashboard (limited - status: "pending")
```

**Backend APIs Called:**
- `POST /api/users/register`

**Database Changes:**
- New User document created (`status: "pending"`)
- New JoinRequest document created (`status: "pending"`)
- New Notification to community owner

**Notifications:**
- Community owner receives `join-request` notification

**Socket Events:**
- None (notification stored; admin views on page load)

---

### 2. Login

**Goal:** Authenticate and access the dashboard.

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    U->>FE: Visit /signin
    U->>FE: Enter email + password
    U->>FE: Click Sign In
    FE->>BE: POST /api/users/login { email, password }
    
    BE->>DB: User.findOne({ email }).select("+password")
    DB-->>BE: User document + hashed password
    
    BE->>BE: bcrypt.compare(password, user.password)
    alt Invalid
        BE-->>FE: 401 { message: "Invalid credentials" }
        FE-->>U: Show error
    else 2FA Required
        BE->>BE: Generate preAuthToken
        BE-->>FE: 200 { requiresTwoFactor: true, preAuthToken }
        FE-->>U: Show 2FA code input
        U->>FE: Enter TOTP code
        FE->>BE: POST /api/2fa/verify-login { code, preAuthToken }
        BE->>BE: Verify TOTP
        BE->>BE: Create Session
        BE->>BE: Generate JWT
        BE-->>FE: 200 { token, sessionId, user }
    else Success
        BE->>BE: Create Session (ua-parser-js)
        BE->>BE: Generate JWT
        BE-->>FE: 200 { token, sessionId, user }
    end
    
    FE->>FE: Store token + user in localStorage
    FE->>FE: Initialize Socket.IO connection
    FE->>FE: Redirect to /dashboard
```

---

### 3. Dashboard

**Goal:** View weekly stats, activity chart, AI insights, pending tasks, and upcoming meetings.

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    U->>FE: Navigate to /dashboard
    FE->>FE: Fetch all stores in parallel
    
    FE->>BE: GET /api/dashboard/stats
    FE->>BE: GET /api/dashboard/chart?period=week
    FE->>BE: GET /api/dashboard/insights
    FE->>BE: GET /api/tasks
    FE->>BE: GET /api/meetings
    FE->>BE: GET /api/notifications
    
    BE->>DB: Execute queries
    DB-->>BE: Results
    
    BE-->>FE: { meetingsThisWeek, tasksCompletedThisWeek, productivityChange }
    BE-->>FE: { labels, values, maxValue }
    BE-->>FE: { type, message } (burnout risk, overdue tasks, or positive)
    BE-->>FE: [tasks...]
    BE-->>FE: [meetings...]
    BE-->>FE: [notifications...]
    
    FE->>FE: Pinia stores updated
    FE->>FE: UI renders cards, chart, insights, task list, meeting list
    FE-->>U: Full dashboard view
```

**Backend APIs Called:**
- `GET /api/dashboard/stats`
- `GET /api/dashboard/chart?period=week`
- `GET /api/dashboard/insights`
- `GET /api/tasks`
- `GET /api/meetings`
- `GET /api/notifications`

---

### 4. Create Meeting

**Goal:** Schedule a new meeting with participants.

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    U->>FE: Navigate to /new-meeting
    U->>FE: Fill meeting details (title, date, time, duration, type, participants)
    U->>FE: Click "Create Meeting"
    FE->>BE: POST /api/meetings { title, description, startTime, duration, type, participants }
    
    BE->>BE: Generate unique meetingId (crypto.randomBytes(12).toString("hex"))
    BE->>DB: Meeting.create({...})
    DB-->>BE: New meeting document
    
    BE->>BE: Match participants to community users
    BE->>DB: For each participant → Notification.create({ recipient, type: "meeting" })
    
    BE->>BE: Socket.IO emit "meeting:notification" to online participants
    BE-->>FE: 201 { success: true, meeting }
    
    FE->>FE: Update meeting store
    FE-->>U: Redirect to meeting details or dashboard
```

**Database Changes:**
- New Meeting document (`status: "scheduled"`)
- Multiple Notification documents (one per participant)

**Notifications:**
- Each participant receives `meeting`-type notification with meeting title, date, time, organizer

**Socket Events:**
- `meeting:notification` emitted to online participants' sockets

---

### 5. Upload Recording & Process Meeting

**Goal:** Upload a meeting recording and trigger the AI processing pipeline.

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as Backend
    participant FS as File System
    participant AI as AI Services
    participant DB as MongoDB

    U->>FE: Open meeting details
    U->>FE: Select recording file
    FE->>BE: POST /api/meetings/:id/upload-recording (multipart/form-data)
    BE->>FS: Store file in /uploads
    BE->>FS: Rename to slug-based filename
    BE->>DB: Update meeting.recordingPath
    BE-->>FE: 200 { path }
    
    U->>FE: Click "Process" (or provide live transcript)
    FE->>BE: POST /api/meetings/:id/process { liveTranscript? }
    
    BE->>DB: Update meeting status → "live"
    
    alt Live Transcript Provided
        BE->>AI: translateTranscriptToEnglish()
        BE->>AI: analyzeMeetingTranscript()
        BE->>DB: storeTranscriptLayer()
        BE->>DB: storeKnowledgeLayers()
        BE->>AI: generateAndStoreEmbeddings()
    else Recording without Transcript
        BE->>FS: extractAudioIfNeeded() via ffmpeg
        BE->>AI: transcribeAudio() → Whisper STT server
        AI-->>BE: { transcript, duration }
        alt Silent or hallucinated
            BE->>DB: Save placeholder transcript
        else Valid transcript
            BE->>AI: diarizeTranscript()
            BE->>AI: translateTranscriptToEnglish()
            BE->>DB: storeTranscriptLayer()
            BE->>AI: analyzeMeetingTranscript()
            BE->>DB: storeKnowledgeLayers()
            BE->>AI: generateAndStoreEmbeddings()
        end
    end
    
    BE->>FS: Clean up temporary audio files
    BE->>DB: Update meeting status → "completed", duration, recordingPath = ""
    
    par Background Pipeline
        BE->>AI: syncMeetingTasksAndNotifications()
        AI->>DB: Create Task documents from action items
        AI->>DB: Create notifications for assignees
        AI->>DB: Create meeting summary notification for community
        AI->>AI: Send meeting summary email via Resend
    end
    
    BE-->>FE: 200 { success: true, message: "Meeting processed successfully" }
```

**AI Services Called:**
1. Whisper STT (Python FastAPI server on port 8001)
2. Groq Llama 3.3 (transcript translation, analysis, diarization)
3. Xenova Transformers (embedding generation)
4. Vector Store service (MongoDB + optional Pinecone/Chroma)

**Database Changes:**
- MeetingTranscript created/updated
- MeetingKnowledge created/updated
- MeetingEmbeddings created
- ActionItems replaced
- Tasks created (in background)
- Notifications created (in background)

**Notifications:**
- Task assignees notified of new tasks
- Community members notified of meeting summary

**Email:**
- Meeting summary email sent to all active community members via Resend

---

### 6. Task Management Workflow (Member)

**Goal:** Move a task through To Do → In Progress → Review with the Kanban board.

```mermaid
sequenceDiagram
    actor M as Member
    participant FE as Frontend
    participant BE as Backend
    participant WF as Workflow Engine
    participant DB as MongoDB

    Note over M,DB: Task starts in "todo"
    
    M->>FE: Drag task from To Do to In Progress
    FE->>FE: Optimistic UI update
    FE->>BE: PUT /api/tasks/:id { status: "inprogress" }
    BE->>WF: validateTransition("todo", "inprogress", "user")
    WF-->>BE: { allowed: true }
    BE->>DB: Task.updateOne({ status: "inprogress" })
    DB-->>BE: Updated
    BE-->>FE: 200 { success: true }
    
    Note over M,DB: Task now "inprogress"
    
    M->>FE: Drag task to Review
    FE->>FE: Show review confirmation modal
    M->>FE: Confirm submission
    FE->>FE: Optimistic UI update
    FE->>BE: PUT /api/tasks/:id { status: "review" }
    BE->>WF: validateTransition("inprogress", "review", "user")
    WF-->>BE: { allowed: true }
    BE->>DB: Task.updateOne({ status: "review" })
    BE->>DB: Notification.create for all admins (type: "task")
    BE->>BE: Socket.IO emit "task:notification" to admins
    DB-->>BE: Updated
    BE-->>FE: 200 { success: true }
```

**Workflow Rules Enforced:**
- Members: todo → inprogress, inprogress → review (only)
- Members cannot: move to done, move backwards, skip stages
- Tasks in review/done are locked for members

**Notifications:**
- Admin receives "Task Ready For Review" with member name and task title

**Socket Events:**
- `task:notification` to all online admin sockets

---

### 7. Task Review Flow (Admin)

**Goal:** Approve or return a task that has been submitted for review.

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend
    participant BE as Backend
    participant WF as Workflow Engine
    participant DB as MongoDB

    A->>FE: View DashboardTasks Kanban board
    FE-->>A: See task in Review column with Approve/Return buttons
    
    alt Approve Task
        A->>FE: Click Approve on the review card
        FE->>FE: Show approval confirmation modal
        A->>FE: Confirm
        FE->>BE: PUT /api/tasks/:id/approve
        BE->>WF: validateTransition("review", "done", "admin")
        WF-->>BE: { allowed: true }
        BE->>DB: Task.updateOne({ status: "done" })
        BE->>DB: Review history entry: { action: "approved", user: adminId }
        BE->>DB: Notification.create for task owner (type: "approval")
        BE->>BE: Socket.IO emit to assignee
        DB-->>BE: Updated
        BE-->>FE: 200 Task approved
    end
    
    alt Return Task
        A->>FE: Click Return on the review card
        FE->>FE: Show comment dialog
        A->>FE: Enter review comment
        A->>FE: Submit
        FE->>BE: PUT /api/tasks/:id/reject { reviewComment }
        BE->>WF: validateTransition("review", "inprogress", "admin")
        WF-->>BE: { allowed: true }
        BE->>DB: Task.updateOne({ status: "inprogress" })
        BE->>DB: Review history entry: { action: "returned", user: adminId, comment }
        BE->>DB: Notification.create for task owner (type: "rejection")
        BE->>BE: Socket.IO emit to assignee
        DB-->>BE: Updated
        BE-->>FE: 200 Task returned to In Progress
    end
```

**Admin Restrictions Enforced:**
- Admin cannot change todo or inprogress tasks
- Admin cannot drag any card (uses buttons only)
- Admin can only act on review-stage tasks
- Returns go specifically to "inprogress" (not todo)
- Approval goes specifically to "done"

**Notifications:**
- Member receives "Task Approved" or "Task Returned" with admin's comment

---

### 8. Knowledge AI (RAG Query)

**Goal:** Ask natural language questions about past meetings and get AI-generated answers with source citations.

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as Backend
    participant ES as Embedding Service
    participant VS as Vector Store
    participant LLM as Groq API

    U->>FE: Navigate to /knowledge-ai
    U->>FE: Type question in chat input
    U->>FE: Send
    
    FE->>BE: POST /api/rag/query { question, sessionId? }
    
    BE->>BE: Detect relative-time query ("last meeting")
    alt Relative query
        BE->>BE: fetchMostRecentMeeting(userId, email, name)
        BE-->>BE: scopedMeetingId set
    end
    
    BE->>ES: getEmbedding(question)
    ES-->>BE: 384-dim vector
    
    BE->>VS: queryMeetingVectors({ queryEmbedding, topK: 5, scopedMeetingId })
    alt Pinecone/Chroma
        VS->>VS: Delegate to configured provider
    else MongoDB (default)
        VS->>VS: Find up to 1000 candidates
        VS->>VS: Cosine similarity computation
        VS-->>BE: Top 5 results
    end
    
    alt Title match boost
        BE->>BE: Check if question mentions meeting title
        BE->>BE: Fetch those chunks directly via MeetingEmbedding
    end
    
    alt No matches found
        BE-->>FE: Use fallback response
    end
    
    BE->>BE: Build context from passages + system prompt
    BE->>LLM: Groq chat completion with context
    LLM-->>BE: Generated answer
    
    BE->>DB: Save user message + assistant response
    BE-->>FE: { answer, sources: [{ meetingId, title, snippet, score }] }
    
    FE-->>U: Display answer with clickable source cards
```

**AI Services Called:**
1. Xenova Transformers (embed query)
2. Vector Store (semantic search)
3. Groq Llama 3.3 (answer generation)

---

### 9. Community Chat

**Goal:** Send and receive real-time messages with other community members.

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant SOCK as Socket.IO
    participant BE as Backend
    participant DB as MongoDB

    U->>FE: Open /community-chat
    FE->>SOCK: Connect (auth token)
    SOCK->>BE: JWT verification
    BE->>BE: Check community assignment
    BE->>FE: Auto-join room chat:community:<id>
    
    FE->>BE: GET /api/community-chat?page=1&limit=50
    BE->>DB: Message.find({ community }).sort({ createdAt: -1 }).limit(50).populate("sender")
    DB-->>BE: Messages
    BE-->>FE: { messages: [...] }
    FE-->>U: Chat history displayed
    
    U->>FE: Type message + Send
    FE->>SOCK: emit "chat:send" { message: "Hello team!" }
    SOCK->>BE: socket.on("chat:send")
    BE->>DB: Message.create({ community, sender, message })
    BE->>DB: Message.findById(...).populate("sender")
    BE->>SOCK: io.to(room).emit("chat:message", payload)
    BE->>DB: Notification.create for each other member
    BE->>SOCK: emit "chat:notification" to online members
    
    FE-->>U: Message appears in real time
    Other Members-->>SOCK: Receive "chat:message"
    Other Members-->>SOCK: Receive "chat:notification" (if online)
```

**Backend APIs Called:**
- `GET /api/community-chat` (initial load, paginated)

**Socket Events:**
- `chat:send` (client → server)
- `chat:message` (server → room)
- `chat:notification` (server → individual sockets)
- `chat:error` (server → individual)

**Notifications:**
- Each community member (except sender) receives a `chat`-type notification with message preview

---

### 10. View Meeting Analysis

**Goal:** View the AI-generated summary, decisions, tasks, and transcript of a processed meeting.

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    U->>FE: Navigate to Archive or Meeting Details
    FE->>BE: GET /api/meetings/:id
    BE-->>FE: Meeting document
    
    FE->>BE: Fetch 4 parallel requests:
    FE->>BE: GET /api/meetings/:id/summary
    FE->>BE: GET /api/meetings/:id/tasks
    FE->>BE: GET /api/meetings/:id/decisions
    FE->>BE: GET /api/meetings/:id/transcript
    
    BE->>DB: MeetingKnowledge.findOne({ meeting: id })
    DB-->>BE: Summary, overview, topics, participants
    
    BE->>DB: ActionItem.find({ meeting: id })
    DB-->>BE: Action items
    
    BE->>DB: MeetingKnowledge.findOne({ meeting: id })
    DB-->>BE: decisions array
    
    BE->>DB: MeetingTranscript.findOne({ meeting: id })
    DB-->>BE: Full transcript
    
    BE-->>FE: Combined results via Promise.allSettled
    FE-->>U: Display summary card, decisions list, tasks table, transcript viewer
```

**Backend APIs Called (in parallel):**
- `GET /api/meetings/:id/summary` → `meetingKnowledgeController.getMeetingSummary`
- `GET /api/meetings/:id/tasks` → `meetingKnowledgeController.getMeetingTasks`
- `GET /api/meetings/:id/decisions` → `meetingKnowledgeController.getMeetingDecisions`
- `GET /api/meetings/:id/transcript` → `meetingKnowledgeController.getMeetingTranscript`
