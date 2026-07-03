# SmartMeet — Admin Flow Documentation

## Admin Capabilities Matrix

| Capability | Endpoint | Auth | Description |
|---|---|---|---|
| Community Creation | `POST /api/users/register` | None | Admin registration auto-creates community |
| Join Request Management | `GET/PATCH /api/join-requests` | protect + adminOnly | List, approve, reject join requests |
| Member Management | `GET/PUT/DELETE /api/communities/members/:id` | protect + adminOnly | View, change role, remove members |
| Invitation Management | `POST /api/invitations` | protect + adminOnly | Email invitations to join workspace |
| Task Review | `PUT /api/tasks/:id/approve` | protect | Approve review-stage tasks |
| Task Review | `PUT /api/tasks/:id/reject` | protect | Return tasks to in-progress |
| Task Management | `POST/PUT/DELETE /api/tasks` | protect | Create, edit, delete any community task |
| Meeting Management | `PUT /api/meetings/:id` | protect | Update meetings (host or community admin) |
| Notifications | Various | protect | Receive all notification types |
| Team Analytics | `GET /api/dashboard/team-analytics` | protect | View team-wide metrics |
| Dashboard | `GET /api/dashboard/*` | protect | Stats, charts, insights |
| Community Overview | `GET /api/communities/overview` | protect + adminOnly | Full community data |

## Admin Registration Flow

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    A->>FE: Visit /signup
    A->>FE: Select "Admin" role
    A->>FE: Fill form (name, email, password)
    A->>FE: Submit
    FE->>BE: POST /api/users/register { name, email, password, role: "admin" }
    
    BE->>BE: Validate password strength
    BE->>BE: Generate 8-char unique community code (uppercase alphanumeric)
    BE->>DB: User.create({ name, email, password, role: "admin", status: "active" })
    DB-->>BE: New admin user
    
    BE->>DB: Community.create({ name: `${firstName}'s Community`, code, owner: user._id })
    DB-->>BE: New community
    
    BE->>DB: user.community = community._id; user.save()
    BE->>BE: Create Session with device fingerprinting
    BE->>BE: Generate JWT
    
    BE-->>FE: 201 { success: true, token, sessionId, user, communityCode }
    FE->>FE: Store token + user in localStorage
    FE->>FE: Redirect to /dashboard
    A-->>FE: Full admin dashboard with community code visible
```

**Database Changes:**
- New User document (`role: "admin"`, `status: "active"`, `community` set)
- New Community document (`owner` set to admin's ID)
- New Session document

---

## Join Request Management

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    Note over A,DB: Admin receives notification of new join request
    
    A->>FE: Navigate to Team Management
    FE->>BE: GET /api/communities/members
    BE-->>FE: Active members list
    
    A->>FE: View pending requests
    FE->>BE: GET /api/join-requests
    BE->>DB: JoinRequest.find({ community: req.user.community, status: "pending" })
    DB-->>BE: Pending requests
    BE-->>FE: [{ user, community, status }]
    
    alt Approve Request
        A->>FE: Click "Approve"
        FE->>BE: PATCH /api/join-requests/:id/approve
        BE->>DB: JoinRequest.findByIdAndUpdate(id, { status: "approved" })
        BE->>DB: User.findByIdAndUpdate(request.user, { community: req.user.community, status: "active" })
        BE->>DB: Notification.create({ recipient: request.user, type: "approval", ... })
        BE-->>FE: 200 { success: true }
        FE-->>A: Request approved, user now active
    end
    
    alt Reject Request
        A->>FE: Click "Reject"
        FE->>BE: PATCH /api/join-requests/:id/reject
        BE->>DB: JoinRequest.findByIdAndUpdate(id, { status: "rejected" })
        BE->>DB: User.findByIdAndUpdate(request.user, { status: "rejected" })
        BE->>DB: Notification.create({ recipient: request.user, type: "rejection", ... })
        BE-->>FE: 200 { success: true }
    end
```

**Security Checks:**
- `adminOnly` middleware verifies `req.user.role === "admin"`
- Join requests scoped to admin's community via `req.user.community`
- Only pending requests can be approved/rejected

**Notifications:**
- Approved user receives `approval` notification
- Rejected user receives `rejection` notification

---

## Member Management

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    A->>FE: Open Team Management
    FE->>BE: GET /api/communities/members
    BE->>DB: User.find({ community: req.user.community, status: "active" }).select("firstName lastName name email role avatar createdAt")
    BE->>DB: Community.findById(req.user.community).select("code")
    DB-->>BE: Members + community code
    BE-->>FE: { members: [...], communityCode: "ABC12345" }
    FE-->>A: Members table with roles, avatars, join dates
    
    alt Update Member Role
        A->>FE: Change member role to Admin
        FE->>BE: PUT /api/communities/members/:id/role { role: "admin" }
        BE->>DB: User.findByIdAndUpdate(id, { role: "admin" })
        DB-->>BE: Updated
        BE-->>FE: 200 { success: true }
        FE-->>A: Member role badge updated
    end
    
    alt Remove Member
        A->>FE: Click "Remove"
        FE->>BE: DELETE /api/communities/members/:id
        BE->>DB: User.findByIdAndUpdate(id, { community: null, status: "pending" })
        DB-->>BE: Updated
        BE-->>FE: 200 { success: true }
    end
```

---

## Email Invitation Flow

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend
    participant BE as Backend
    participant RE as Resend API
    participant U as Invited User

    A->>FE: Open Team Management > Invite
    A->>FE: Fill form (fullName, email, role)
    A->>FE: Send Invitation
    FE->>BE: POST /api/invitations { fullName, email, role }
    
    BE->>BE: Check: user not already in a community
    BE->>BE: crypto.randomBytes(32).toString("hex") → invitation token
    BE->>DB: Invitation.create({ token, fullName, email, role, community, invitedBy, expiresAt: +7 days })
    
    BE->>RE: sendInvitationEmail({ to, fullName, communityName, role, invitationLink, expiresAt })
    RE-->>BE: Email sent
    
    BE-->>FE: 201 { success: true, message: "Invitation sent" }
    
    Note over U: User receives email
    
    alt New User
        U->>FE: Click invitation link → /register?token=xxx
        FE->>BE: POST /invitations/:token/accept { password }
        BE->>DB: Invitation.findOne({ token, status: "pending" })
        BE->>DB: User.create({ email, password, community, role: invitation.role, status: "active" })
        BE->>DB: Invitation.updateOne({ status: "accepted" })
        BE->>BE: Create Session, Generate JWT
        BE-->>FE: 200 { token, user }
        U-->>FE: Logged in and in community
    end
    
    alt Existing User
        U->>FE: Sign in first
        U->>FE: Click invitation link (or auto-claim via auth store)
        FE->>BE: POST /invitations/:token/claim
        BE->>BE: Verify: user.email matches invitation.email
        BE->>BE: Verify: user not already in a community
        BE->>DB: User.findByIdAndUpdate(userId, { community, status: "active", role: invitation.role })
        BE->>DB: Invitation.updateOne({ status: "accepted" })
        BE-->>FE: 200 { success: true }
    end
```

---

## Task Review Workflow (Admin)

```mermaid
stateDiagram-v2
    [*] --> Todo: Created
    Todo --> InProgress: Member move
    InProgress --> Review: Member submit
    Review --> Done: Admin approve
    Review --> InProgress: Admin return
    Done --> [*]
    
    note right of Review
        Admin-only actions:
        - Approve (→ Done)
        - Return with comment (→ InProgress)
    end note
    
    note right of Todo
        Admin cannot:
        - Move Todo cards
        - Drag any cards
        - Change InProgress tasks
    end note
```

**Admin's View on Each Status:**

| Status | Card Appearance | Actions Available | Drag Allowed |
|---|---|---|---|
| To Do | Locked (no drag, no buttons) | View details in modal (informational only) | No |
| In Progress | Locked (no drag, no buttons) | View details in modal (informational only) | No |
| Review | Approve / Return buttons visible | Approve, Return with comment | No |
| Done | Locked (no drag, no buttons) | View details in modal (informational only) | No |

---

## Dashboard Analytics (Admin View)

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    A->>FE: Navigate to Dashboard
    FE->>BE: GET /api/dashboard/stats
    BE->>DB: Meeting.countDocuments({ host: { $in: communityUserIds }, startTime: { $gte: weekStart } })
    BE->>DB: Task.countDocuments({ community: req.user.community, status: "done", updatedAt: { $gte: weekStart } })
    DB-->>BE: { meetingsThisWeek, tasksCompletedThisWeek }
    BE-->>FE: Stats with productivity change percentage
    
    FE->>BE: GET /api/dashboard/chart?period=week
    BE->>DB: Task.aggregate by day for last 7 days
    DB-->>BE: Daily completion counts
    BE-->>FE: Normalized bar chart data (0-100%)
    
    FE->>BE: GET /api/dashboard/insights
    BE->>DB: Meeting count for today/tomorrow
    BE->>DB: Overdue tasks count
    DB-->>BE: Data for insight generation
    BE-->>FE: { type: "warning"|"positive", message }
    
    FE->>BE: GET /api/dashboard/team-analytics
    BE->>BE: Parallel queries:
    BE->>DB: Task.aggregate for completion stats
    BE->>DB: Meeting.countDocuments for periods
    BE->>DB: User.countDocuments for community size
    DB-->>BE: KPIs, performance, meeting stats, AI usage
    BE-->>FE: Full analytics dashboard data
```

## Security Enforcement for Admin

All admin operations enforce the following security layers:

1. **JWT Authentication** (`protect` middleware): Verifies the user is authenticated
2. **Role Verification** (`adminOnly` middleware): Verifies `req.user.role === "admin"`
3. **Data Isolation**: All queries filter by `req.user.community`
4. **Ownership Verification**: Community operations verify the admin owns the community via `community.owner`
5. **Input Validation**: Mongoose schema validation on all writes
6. **CORS**: API only accepts requests from configured frontend origin
