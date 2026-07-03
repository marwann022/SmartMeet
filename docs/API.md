# SmartMeet — Complete API Reference

## Base URL

- **Development:** `http://localhost:5000`
- **Production:** `https://your-server.com`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

Tokens are obtained via:
- `POST /api/users/register`
- `POST /api/users/login`
- `POST /api/users/google-login`
- `POST /api/users/2fa/verify-login`

## Route Groups

### 1. Users — `/api/users`

**Controller:** `Back-end/src/controllers/userController.js`
**Routes:** `Back-end/src/routes/userRoutes.js`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | None | Register admin or user |
| POST | `/login` | None | Email/password login |
| POST | `/google-login` | None | Google OAuth login |
| POST | `/forgot-password` | None | Send password reset email |
| POST | `/reset-password/:token` | None | Reset password with token |
| GET | `/profile` | protect | Get authenticated user's profile |
| PUT | `/profile` | protect | Update profile fields |
| PUT | `/change-password` | protect | Change password |
| POST | `/avatar` | protect, upload | Upload avatar |
| POST | `/2fa/setup` | protect | Setup TOTP 2FA |
| POST | `/2fa/verify` | protect | Verify and enable 2FA |
| POST | `/2fa/disable` | protect | Disable 2FA |
| POST | `/2fa/verify-login` | None | Complete 2FA during login |
| GET | `/sessions` | protect | List login sessions |
| DELETE | `/sessions/:id` | protect | Revoke session |
| GET | `/notification-settings` | protect | Get notification preferences |
| PUT | `/notification-settings` | protect | Update notification preferences |

---

### 2. Meetings — `/api/meetings`

**Controller:** `Back-end/src/controllers/meetingController.js`
**Knowledge Controller:** `Back-end/src/controllers/meetingKnowledgeController.js`
**Routes:** `Back-end/src/routes/meetingRoutes.js`

All routes are **protected**.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List meetings (permission-scoped) |
| POST | `/` | Create meeting |
| GET | `/:id` | Get single meeting |
| PUT | `/:id` | Update meeting (host or community admin) |
| DELETE | `/:id` | Delete meeting (host only) |
| POST | `/:id/upload-recording` | Upload recording file (multipart) |
| POST | `/:id/process` | Trigger AI processing pipeline |
| POST | `/live-extract-task` | Real-time task extraction |
| POST | `/live-extract-decision` | Real-time decision extraction |
| GET | `/:id/transcript` | Get meeting transcript |
| GET | `/:id/summary` | Get AI summary |
| GET | `/:id/knowledge` | Get full knowledge document |
| GET | `/:id/tasks` | Get action items |
| GET | `/:id/decisions` | Get decisions |

---

### 3. Tasks — `/api/tasks`

**Controller:** `Back-end/src/controllers/taskController.js`
**Routes:** `Back-end/src/routes/taskRoutes.js`

All routes are **protected**.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List tasks (admin: all community; member: own) |
| POST | `/` | Create task |
| PUT | `/:id` | Update task (workflow-enforced) |
| DELETE | `/:id` | Delete task |
| PUT | `/:id/approve` | Admin approve (review → done) |
| PUT | `/:id/reject` | Admin reject (review → inprogress) |

---

### 4. RAG (Knowledge AI) — `/api/rag`

**Controller:** `Back-end/src/controllers/ragController.js`
**Routes:** `Back-end/src/routes/ragRoutes.js`

All routes are **protected**.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/query` | Ask a question with RAG |
| POST | `/ingest` | Bulk-ingest meetings into vector store |
| GET | `/sessions` | List chat sessions |
| GET | `/sessions/:sessionId/messages` | Get session messages |
| DELETE | `/sessions/:sessionId` | Delete session |

---

### 5. Notifications — `/api/notifications`

**Controller:** `Back-end/src/controllers/notificationController.js`
**Routes:** `Back-end/src/routes/notificationRoutes.js`

All routes are **protected**.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List notifications (newest first) |
| POST | `/` | Create notification manually |
| DELETE | `/` | Clear all notifications |
| PUT | `/read-all` | Mark all as read |
| DELETE | `/:id` | Delete single notification |
| PUT | `/:id/read` | Mark single as read |

---

### 6. Join Requests — `/api/join-requests`

**Controller:** `Back-end/src/controllers/joinRequestController.js`
**Routes:** `Back-end/src/routes/joinRequestRoutes.js`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | protect | Submit join request with community code |
| GET | `/` | protect + adminOnly | List pending requests |
| PATCH | `/:id/approve` | protect + adminOnly | Approve request |
| PATCH | `/:id/reject` | protect + adminOnly | Reject request |

---

### 7. Communities — `/api/communities`

**Controller:** `Back-end/src/controllers/communityController.js`
**Routes:** `Back-end/src/routes/communityRoutes.js`

All routes are **protected**. Some require **adminOnly**.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/members` | protect + adminOnly | List all active members + community code |
| GET | `/stats` | protect + adminOnly | Community statistics |
| GET | `/overview` | protect | Full community overview |
| PUT | `/members/:id/role` | protect + adminOnly | Change member role |
| DELETE | `/members/:id` | protect + adminOnly | Remove member |

---

### 8. Invitations — `/api/invitations`

**Controller:** `Back-end/src/controllers/invitationController.js`
**Routes:** `Back-end/src/routes/invitationRoutes.js`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | protect + adminOnly | Create invitation |
| GET | `/verify/:token` | None | Verify invitation token |
| POST | `/:token/accept` | None | Accept (new user registration) |
| POST | `/:token/claim` | protect | Claim (existing user) |

---

### 9. Community Chat — `/api/community-chat`

**Controller:** `Back-end/src/controllers/communityChatController.js`
**Routes:** `Back-end/src/routes/communityChatRoutes.js`

All routes are **protected**.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | List messages (paginated) |
| POST | `/` | Create message |
| DELETE | `/:id` | Delete message (owner or admin) |

---

### 10. Dashboard — `/api/dashboard`

**Controller:** `Back-end/src/controllers/dashboardController.js`
**Analytics Controller:** `Back-end/src/controllers/analyticsController.js`
**Routes:** `Back-end/src/routes/dashboardRoutes.js`

All routes are **protected**.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Weekly meeting/task stats |
| GET | `/chart` | Activity chart data |
| GET | `/insights` | AI-generated insights |
| GET | `/team-analytics` | Full team analytics |

---

### 11. Subscription — `/api/subscription`

**Controller:** `Back-end/src/controllers/subscriptionController.js`
**Routes:** `Back-end/src/routes/subscriptionRoutes.js`

All routes are **protected**.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/me` | Get user's subscription |

---

## Common Response Formats

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation error details",
  "errors": { ... }
}
```

### Auth Error
```json
{
  "message": "Not authorized, no token"
}
```

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / Validation error |
| 401 | Not authenticated |
| 403 | Not authorized (role/permission) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 500 | Internal server error |

## Request/Response Examples

### Register Admin
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "Alice Admin",
  "firstName": "Alice",
  "email": "alice@example.com",
  "password": "StrongPass1!",
  "role": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "sessionId": "abc123",
  "user": {
    "_id": "664a...",
    "name": "Alice Admin",
    "email": "alice@example.com",
    "role": "admin",
    "community": "664b...",
    "status": "active",
    "communityCode": "A1B2C3D4"
  }
}
```

### Create Meeting
```http
POST /api/meetings
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Q3 Product Roadmap Sync",
  "description": "Planning session for Q3 deliverables",
  "startTime": "2024-07-15T14:00:00Z",
  "duration": 60,
  "type": "Team",
  "participants": [
    { "name": "Bob Member", "email": "bob@example.com" }
  ]
}
```

### RAG Query
```http
POST /api/rag/query
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "What decisions were made in the last meeting?",
  "sessionId": "664c..." (optional, for continuing conversation)
}
```

**Response:**
```json
{
  "success": true,
  "answer": "In the last meeting, the team decided to...",
  "sources": [
    {
      "meetingId": "664d...",
      "title": "Q3 Product Roadmap Sync",
      "snippet": "We decided to go with MongoDB for the primary database...",
      "score": 0.92
    }
  ],
  "sessionId": "664c..."
}
```

### Process Meeting
```http
POST /api/meetings/664d.../process
Authorization: Bearer <token>
Content-Type: application/json

{
  "liveTranscript": "Alice: Let's discuss the database choice. Bob: I think we should go with MongoDB..."
}
```

### Task Update (Member submits for review)
```http
PUT /api/tasks/664e...
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "review"
}
```

### Task Approve (Admin)
```http
PUT /api/tasks/664e.../approve
Authorization: Bearer <token>
```

### Task Reject (Admin)
```http
PUT /api/tasks/664e.../reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reviewComment": "Please add more detail to the description before completing."
}
```
