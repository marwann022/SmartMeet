# AI_HANDOVER.md — SmartMeet Project Handover

This document is a complete handover for the next AI agent continuing development of the SmartMeet project. It is authoritative and self-contained. Do not rely on previous conversation history.

---

## 1. Project Overview

### What is SmartMeet?

SmartMeet is a **multi-tenant workspace collaboration platform**. It is a full-stack web application with a Vue 3 frontend and a Node.js/Express/MongoDB backend.

### Architecture

```
Front-end/   — Vue 3 SPA (Vite, Tailwind CSS, Axios)
Back-end/    — Node.js + Express REST API (ES Modules)
             — MongoDB via Mongoose
```

The backend runs on port `5000`. The frontend dev server runs on port `5173`. The frontend makes API calls to `http://localhost:5000`.

### The Community System

The platform is organized around **Communities** (workspaces). Every piece of data belongs to a community. Data isolation is absolute — no user can ever read data from a different community.

- Every **admin** owns exactly one community.
- Every community has a unique **invitation code** (8 uppercase alphanumeric characters).
- A **user** belongs to at most one community.
- A user joins by submitting a **JoinRequest** with the community code.
- The admin approves or rejects the request.
- Only approved users have their `community` field set and `status` set to `"active"`.

### How Authentication Works

Authentication is JWT-based. All endpoints that require authentication use the `protect` middleware in `Back-end/src/middleware/authMiddleware.js`.

**Flow:**
1. Client sends `Authorization: Bearer <token>` header.
2. `protect` middleware decodes the JWT to get `decoded.id`.
3. It calls `User.findById(decoded.id)` and attaches the full user document to `req.user`.
4. Protected route handlers access `req.user` directly (no need to re-fetch).

**Token generation:** `Back-end/src/utils/generateToken.js` — signs a JWT with `process.env.JWT_SECRET`.

**Google Login:** Handled in `userController.googleLogin`. Uses `google-auth-library` (`OAuth2Client`) to verify a Google ID token. If the user exists, their `googleId` is linked and they are logged in. If not, a new user is created. Google users do not have a password.

**Password hashing:** The `User` model's `pre("save")` hook hashes the password with bcrypt (12 salt rounds) whenever `password` is modified.

**Password reset:** Token-based, 10-minute expiry. The reset token is stored in `User.resetPasswordToken` and `User.resetPasswordExpire`.

**2FA:** TOTP-based via `speakeasy`. Secret stored in `User.twoFactorSecret`. Enabled flag in `User.twoFactorEnabled`.

### How Session Management Works

Sessions are tracked in the `Session` collection. When a user logs in, a `Session` document is created with browser/OS/device info via `ua-parser-js`. The `refreshToken` field on the session stores the JWT. Sessions are viewable at `GET /api/users/sessions`. Session management code is **preserved exactly as-is** and must not be modified.

---

## 2. Completed Work

### Phase 1 — Community Model
Created `Back-end/src/models/Community.js`.  
Fields: `name`, `code` (unique), `owner` (ObjectId → User), `description`, `createdAt`, `updatedAt` (timestamps).  
Indexes: unique on `code` (via schema), `{ owner: 1 }` explicit index.

### Phase 2 — Update User Model
Modified `Back-end/src/models/User.js`.  
- Removed the old `communityCode` String field (temporary placeholder).
- Added `community: ObjectId → Community` (default null).
- Added `status: Enum ["pending", "active"]` (default "pending").
- All auth fields, role, profile fields, virtuals, hooks, statics left unchanged.

### Phase 3 — Admin Registration
Modified `Back-end/src/controllers/userController.js` — the `register` function, admin branch only.  
- Code uniqueness is now checked against `Community.findOne({ code })` instead of `User.findOne({ communityCode })`.
- After `User.create`, a `Community` document is created (`name: "${fullName}'s Community"`, `code`, `owner: user._id`).
- `user.community = community._id` and `user.status = "active"` are then saved.
- Response still returns `communityCode` for frontend compatibility.
- `Community` model imported into `userController.js`.

### Phase 4 — User Registration
Modified `Back-end/src/controllers/userController.js` — the `register` function, user branch only.  
Created `Back-end/src/models/JoinRequest.js`.  
- The broken `User.findOne({ communityCode })` validation replaced with `Community.findOne({ code: communityCode.toUpperCase() })`.
- Result stored in `targetCommunity` (declared in outer scope before validations).
- After `User.create`, if `role === "user"`, a `JoinRequest` is created linking `user._id` and `targetCommunity._id`.
- User `status` stays `"pending"` (the default) — user is NOT admitted immediately.
- `JoinRequest` model imported into `userController.js`.

### Phase 5 — Join Requests API
Added `adminOnly` middleware to `Back-end/src/middleware/authMiddleware.js`.  
Created `Back-end/src/controllers/joinRequestController.js`.  
Created `Back-end/src/routes/joinRequestRoutes.js`.  
Registered `/api/join-requests` in `Back-end/src/app.js`.

**Endpoints:**
- `POST /api/join-requests` — protected; user submits a community code; creates JoinRequest.
- `GET /api/join-requests` — protected + adminOnly; returns all pending requests for admin's community.
- `PATCH /api/join-requests/:id/approve` — protected + adminOnly; sets status to "approved", updates `user.community` and `user.status = "active"`.
- `PATCH /api/join-requests/:id/reject` — protected + adminOnly; sets status to "rejected".

### Phase 6 — Notifications
Replaced `Back-end/src/models/Notification.js` to match ARCHITECTURE.md schema.  
Updated `Back-end/src/controllers/notificationController.js` to use new field names.  
Updated `Back-end/src/controllers/joinRequestController.js` to send notifications.

**New Notification schema:** `recipient` (ObjectId→User), `community` (ObjectId→Community, nullable), `type` (enum: join-request/task/meeting/document/approval/rejection), `title`, `message`, `read` (default false), timestamps.

**Triggers wired:**
- `createJoinRequest` → notifies community `owner` (type: `join-request`).
- `approveJoinRequest` → notifies requesting user (type: `approval`).
- `rejectJoinRequest` → notifies requesting user (type: `rejection`).

**Backward compatibility:** `createNotification` POST endpoint still accepts old `{ text }` format (maps to `title` + `message`). `community` field is nullable for legacy calls.

### Phase 7 — Team Management Backend
Created `Back-end/src/controllers/communityController.js`.  
Created `Back-end/src/routes/communityRoutes.js`.  
Registered `/api/communities` in `Back-end/src/app.js`.

**Endpoint:**
- `GET /api/communities/members` — protected + adminOnly; returns all `status: "active"` users in admin's community; also returns `communityCode` from the Community document (fetched in parallel via `Promise.all`).

### Phase 8 — Team Management Frontend
Modified `Front-end/src/components/settings/TeamManagement.vue` — script section only.  
Updated `Back-end/src/controllers/communityController.js` — added `Community` import and parallel fetch.

**Changes:**
- Removed hardcoded fake `members` array and unused `avatar1Img`, `avatar2Img` imports.
- `members` now starts as empty `ref([])`.
- New `loadMembers()` fetches `GET /api/communities/members` and maps the response to template-compatible shape: `{ id, name, email, role, avatar, joined }`.
- Role mapping: `"admin"` → `"Admin"`, `"user"` → `"Member"`.
- Avatar fallback: empty string → `userProfileImg`.
- Date format: `toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })`.
- `communityCode` now populated from API response instead of the broken `data.user.communityCode`.
- `onMounted` calls only `loadMembers()` (merged with old `loadCommunityCode`).
- Template and styles are completely unchanged.

---

## 3. Modified Files

### Created (new files)

| File | Purpose |
|---|---|
| `Back-end/src/models/Community.js` | Community/workspace model |
| `Back-end/src/models/JoinRequest.js` | Join request model with compound unique index |
| `Back-end/src/controllers/joinRequestController.js` | Create/list/approve/reject join requests |
| `Back-end/src/routes/joinRequestRoutes.js` | Routes for `/api/join-requests` |
| `Back-end/src/controllers/communityController.js` | `getMembers` handler |
| `Back-end/src/routes/communityRoutes.js` | Routes for `/api/communities` |
| `AI_HANDOVER.md` | This document |

### Modified (existing files)

| File | What changed |
|---|---|
| `Back-end/src/models/User.js` | Removed `communityCode`; added `community` (ObjectId) and `status` (enum) |
| `Back-end/src/models/Notification.js` | Complete replacement — new schema matching ARCHITECTURE.md |
| `Back-end/src/controllers/userController.js` | Added Community + JoinRequest imports; rewrote admin + user registration branches |
| `Back-end/src/controllers/notificationController.js` | Updated all field refs: `user`→`recipient`, `text`→`title`/`message` |
| `Back-end/src/controllers/joinRequestController.js` | Added Notification import; added notification creation in all 3 handlers |
| `Back-end/src/middleware/authMiddleware.js` | Added `adminOnly` export (existing `protect` unchanged) |
| `Back-end/src/app.js` | Added imports and mounts for `joinRequestRoutes` and `communityRoutes` |
| `Front-end/src/components/settings/TeamManagement.vue` | Script section: removed fake data, added `loadMembers()`, fixed community code |

---

## 4. Database Structure

### Collections

#### Users
```
_id           ObjectId (PK)
name          String (full name, required)
firstName     String (required)
lastName      String
email         String (unique, required)
password      String (hashed, select:false)
role          "user" | "admin"  (default: "user")
community     ObjectId → Communities  (null until assigned)
status        "pending" | "active"  (default: "pending")
phone         String
company       String
jobTitle      String
avatar        String (URL)
twoFactorEnabled   Boolean
twoFactorSecret    String
googleId      String (null for non-Google users)
isActive      Boolean (soft delete flag)
lastLogin     Date
refreshToken  String
resetPasswordToken String
resetPasswordExpire Date
notificationSettings  { summaries, reports, digestTime, reminderWindow, quietHours, pushDesktop, pushMobile }
createdAt     Date (auto)
updatedAt     Date (auto)
```
Index: `{ createdAt: -1 }`

#### Communities
```
_id           ObjectId (PK)
name          String (required)
code          String (unique, uppercase, required)
owner         ObjectId → Users (required)
description   String (default "")
createdAt     Date (auto)
updatedAt     Date (auto)
```
Indexes: unique on `code`, `{ owner: 1 }`

#### JoinRequests
```
_id           ObjectId (PK)
user          ObjectId → Users (required)
community     ObjectId → Communities (required)
status        "pending" | "approved" | "rejected"  (default: "pending")
createdAt     Date (auto)
updatedAt     Date (auto)
```
Indexes: `{ user: 1, community: 1 }` unique (prevents duplicate requests), `{ community: 1 }`

#### Notifications
```
_id           ObjectId (PK)
recipient     ObjectId → Users (required)
community     ObjectId → Communities (nullable, default null)
type          "join-request" | "task" | "meeting" | "document" | "approval" | "rejection"
title         String (required)
message       String (required)
read          Boolean (default false)
createdAt     Date (auto)
updatedAt     Date (auto)
```
Indexes: `{ recipient: 1, read: 1 }`, `{ community: 1 }`

#### Sessions
Pre-existing collection. Stores login sessions with browser/OS/device info. Not modified. Do not touch.

#### Tasks
Pre-existing collection. Has its own model (`Back-end/src/models/Task.js`). Not yet updated to include `community` field for data isolation. This is a remaining-phase concern.

#### Meetings, MeetingEmbeddings, MeetingKnowledge, MeetingTranscripts, ActionItems
Pre-existing AI-meeting feature collections. Not modified. Not yet integrated with the community system.

### Relationships

```
Community ──< Users          (one community has many users)
Community ──< JoinRequests   (one community has many requests)
Community ──< Notifications  (one community, many notifications)
User ──── Community          (user belongs to one community)
User ──< JoinRequests        (user can have one request per community)
User ──< Notifications       (user receives many notifications as recipient)
```

---

## 5. API Endpoints

### Authentication — `/api/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | None | Register admin or user. Admin → creates Community. User → creates JoinRequest. |
| POST | `/api/users/login` | None | Email/password login. Returns JWT + session. |
| POST | `/api/users/google-login` | None | Google OAuth login. Accepts Google ID token. |
| POST | `/api/users/forgot-password` | None | Sends password reset email. |
| POST | `/api/users/reset-password/:token` | None | Resets password using reset token. |
| GET | `/api/users/profile` | protect | Returns logged-in user profile. |
| PUT | `/api/users/profile` | protect | Updates profile fields. |
| PUT | `/api/users/change-password` | protect | Changes password (requires current password). |
| POST | `/api/users/avatar` | protect | Uploads avatar image. |
| POST | `/api/users/2fa/setup` | protect | Sets up TOTP 2FA, returns QR code. |
| GET | `/api/users/sessions` | protect | Lists all login sessions for user. |
| GET | `/api/users/notification-settings` | protect | Gets notification preferences. |
| PUT | `/api/users/notification-settings` | protect | Updates notification preferences. |

### Join Requests — `/api/join-requests`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/join-requests` | protect | Submit a join request with a community code. Sends notification to admin. |
| GET | `/api/join-requests` | protect + adminOnly | List all pending requests for admin's community. |
| PATCH | `/api/join-requests/:id/approve` | protect + adminOnly | Approve request → sets user.community + user.status="active". Sends approval notification. |
| PATCH | `/api/join-requests/:id/reject` | protect + adminOnly | Reject request → sets status="rejected". Sends rejection notification. |

### Communities — `/api/communities`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/communities/members` | protect + adminOnly | Returns all active members of admin's community + communityCode. |

### Notifications — `/api/notifications`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/notifications` | protect | Get all notifications for logged-in user (newest first). |
| POST | `/api/notifications` | protect | Create notification manually. Accepts `{ title, message, type }` or legacy `{ text, type }`. |
| PUT | `/api/notifications/read-all` | protect | Mark all user's notifications as read. |
| PUT | `/api/notifications/:id/read` | protect | Mark single notification as read. |
| DELETE | `/api/notifications/:id` | protect | Delete single notification. |
| DELETE | `/api/notifications` | protect | Clear all notifications for user. |

### Pre-existing Routes (not modified in these phases)

| Mount | Description |
|---|---|
| `/api/meetings` | Meetings (AI recording, transcription, analysis) |
| `/api/tasks` | Tasks (not yet community-scoped) |
| `/api/rag` | RAG / AI knowledge queries |

---

## 6. Current Project State

### What Works (backend logic complete)

- **Admin registration** — creates user + community + unique code in one flow.
- **User registration** — validates community code against `Community` collection, creates JoinRequest.
- **Join request management** — admin can list/approve/reject pending requests.
- **Notifications** — created automatically on: join request submitted, request approved, request rejected.
- **Team members API** — returns all active members of admin's community + community code.
- **Auth** — JWT login, Google login, password reset, 2FA, sessions all preserved and working.
- **Data isolation** — all community queries filter by `req.user.community`.
- **Admin role guard** — `adminOnly` middleware enforces admin-only endpoints.

### What Works (frontend)

- **TeamManagement.vue** — members table now loads real data from `GET /api/communities/members`. Community code card loads real code. Avatar fallback works. Role badge maps correctly.

### What Still Needs Testing

- End-to-end admin registration flow (register → community created → code returned).
- End-to-end user registration flow (register with code → JoinRequest created → admin sees request → approve/reject → notification received).
- `GET /api/communities/members` with real data (requires approved users in the database).
- Community code display in TeamManagement after full registration flow.
- `POST /api/join-requests` standalone endpoint (distinct from registration-time creation).
- Notification delivery for all three types.
- Google Login — no changes made, should be unchanged.
- Session management — no changes made, should be unchanged.

### Known Issues / Technical Debt

1. **`POST /api/users/register` for user role**: During registration, a JoinRequest is created. If the user then hits `POST /api/join-requests` again with the same code, it will get a 409 (duplicate) — this is correct behavior but may confuse clients.
2. **`GET /api/users/profile`** returns `community: ObjectId` — not populated. If frontend needs community name or code from the profile endpoint, it would need a separate call to `GET /api/communities/members` or a future populate step.
3. **Task model** (`Back-end/src/models/Task.js`) still uses `user: ObjectId → User` and has no `community` field. Tasks are not yet community-scoped. This must be addressed in Phase 9 (Tasks).
4. **Existing meeting/task controllers** pre-date the community system and are not data-isolated. They must be updated in their respective phases.
5. **`verifyTwoFactor` route** is missing from `userRoutes.js` (the function exists in the controller but is not exported/routed). This is a pre-existing gap, not introduced in these phases.

---

## 7. Remaining Phases

### Phase 9 — Tasks (Backend + Frontend)

**ARCHITECTURE.md API:**
```
POST   /api/tasks
GET    /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

**What needs to happen:**

The existing `Task.js` model uses `user: ObjectId → User` and has no `community` field. It must be updated.

**Recommended changes:**

1. **Update `Back-end/src/models/Task.js`**:
   - Replace `user` field with `community: ObjectId → Community` (required) and `createdBy: ObjectId → User`.
   - Add `assignedTo: ObjectId → User` (optional).
   - Update `status` enum to `["todo", "inprogress", "completed"]` or keep existing if frontend uses it.
   - Keep `timestamps: true`.

2. **Update `Back-end/src/controllers/taskController.js`**:
   - All queries must filter by `community: req.user.community`.
   - `POST /api/tasks` — set `community: req.user.community`, `createdBy: req.user._id`.
   - `GET /api/tasks` — filter `{ community: req.user.community }`.
   - `PUT /api/tasks/:id` — verify task belongs to user's community before update.
   - `DELETE /api/tasks/:id` — verify task belongs to user's community before delete.

3. **Frontend** — update task views to call the backend (currently likely using mock data or the old user-scoped API).

**Data isolation rule:** Every task query must include `community: req.user.community`.

---

### Phase 10 — Meetings (Backend + Frontend)

**ARCHITECTURE.md API:**
```
POST   /api/meetings
GET    /api/meetings
PUT    /api/meetings/:id
DELETE /api/meetings/:id
```

The existing `Meeting.js` model likely already has a `community` field (check before modifying). The existing meeting system has AI transcription, RAG, and knowledge features built on it. Be careful not to break those.

**Recommended approach:**
1. Read the existing `Meeting.js`, `meetingController.js`, `meetingRoutes.js` carefully first.
2. Add `community` field to the Meeting model if not present.
3. Scope all queries to `community: req.user.community`.
4. Preserve all AI/transcription functionality exactly.

---

### Phase 11 — Documents (Backend + Frontend)

**ARCHITECTURE.md API:**
```
POST   /api/documents
GET    /api/documents
DELETE /api/documents/:id
```

**ARCHITECTURE.md Document model:**
```
_id         ObjectId
title       String
fileUrl     String (Cloudinary URL)
fileType    "pdf" | "docx" | "pptx"
community   ObjectId → Community
uploadedBy  ObjectId → User
createdAt   Date
updatedAt   Date
```

No existing Document model exists. This is fully new.

**Recommended approach:**
1. Create `Back-end/src/models/Document.js`.
2. Create `Back-end/src/controllers/documentController.js`.
3. Create `Back-end/src/routes/documentRoutes.js`.
4. Mount at `/api/documents` in `app.js`.
5. Cloudinary integration needed for file upload (`fileUrl`). Check if Cloudinary credentials are in `.env`.
6. All queries scoped to `community: req.user.community`.

---

### Phase 12 — Dashboard Statistics (Backend + Frontend)

Provide summary statistics for the admin dashboard:
- Total members in community
- Pending join requests count
- Task counts by status
- Meeting counts
- Document counts

**Recommended approach:**
1. Create `GET /api/communities/stats` endpoint in `communityController.js`.
2. Use `Promise.all` to run all counts in parallel:
   ```js
   await Promise.all([
     User.countDocuments({ community, status: "active" }),
     JoinRequest.countDocuments({ community, status: "pending" }),
     Task.countDocuments({ community }),
     Meeting.countDocuments({ community }),
   ]);
   ```
3. Update the dashboard frontend to call this endpoint.

---

### Phase 13 — Community Settings

Allow admin to update their community settings:
- Change community name
- Change community description

**ARCHITECTURE.md API (not yet built):**
```
POST /api/communities     (already planned)
GET  /api/communities/:id (already planned)
```

**Recommended approach:**
1. Add `PUT /api/communities` or `PATCH /api/communities` in `communityRoutes.js`.
2. Controller: find community by `owner: req.user._id`, update `name` and `description`.
3. Frontend: Community Settings page/section.

---

## 8. Important Notes

### Files That Must NOT Be Modified Without Explicit Instruction

- `Back-end/src/models/Session.js` — session management is preserved as-is.
- `Back-end/src/utils/generateToken.js` — JWT generation utility, do not touch.
- `Back-end/src/utils/sendEmail.js` — email utility, do not touch.
- `Back-end/src/middleware/uploadMiddleware.js` — avatar upload middleware, do not touch.
- `Back-end/src/services/*` — AI/RAG services (pinecone, embedding, transcription, etc.), do not touch.
- `Back-end/src/routes/ragRoutes.js` and `Back-end/src/controllers/ragController.js` — AI features, do not touch.
- All Google Login logic in `userController.googleLogin` — do not modify.

### Key Implementation Details

1. **ES Modules:** The entire backend uses ES Module syntax (`import`/`export`). Never use `require()` or `module.exports`.

2. **Token storage:** The frontend stores the JWT in `localStorage` under the key `"token"`. All authenticated axios calls must read it as:
   ```js
   const token = localStorage.getItem("token");
   headers: { Authorization: `Bearer ${token}` }
   ```

3. **Community code format:** Always stored uppercase in the `Community` collection. All lookups must use `.toUpperCase()` on the input. The `Community` schema has `uppercase: true` on the `code` field.

4. **Admin status:** When an admin registers, their `status` is immediately set to `"active"` and `community` is set. Regular users stay `"pending"` until a join request is approved.

5. **`getPublicProfile()`:** The `User` model has this method which deletes `password` and `refreshToken` before returning. Always use `user.getPublicProfile()` in API responses, never return the raw user object from registration/login.

6. **Data isolation pattern:** Every resource query must follow this pattern:
   ```js
   Model.find({ community: req.user.community, ...otherFilters })
   ```
   Never query without the community filter.

7. **adminOnly middleware:** Imported from `authMiddleware.js` as a named export. Must be used after `protect` (needs `req.user` to be set). Pattern: `router.method(path, protect, adminOnly, handler)`.

8. **Notification `community` field:** Made nullable (default null) for backward compatibility with the legacy `POST /api/notifications` endpoint called by the existing frontend. Internal notifications (join-request, approval, rejection) always set `community`.

9. **Task model mismatch:** The existing `Task.js` uses `user: ObjectId` (old field) not `community`. Any phase touching tasks must update this model. Existing task data in the database will break if the field is renamed — consider a migration or make `community` optional initially.

10. **Frontend base URL:** Currently hardcoded as `http://localhost:5000` in component-level axios calls. No centralized API client exists yet. Each component makes direct axios calls.

11. **The `verifyTwoFactor` function** exists in `userController.js` but has no route. If needed, add to `userRoutes.js`.

### Assumptions Made

- Community name defaults to `"${adminFullName}'s Community"` at registration. The admin can rename it in a future Community Settings phase.
- Users can only belong to one community (enforced by the data model — single `community` ObjectId field).
- A user with a rejected join request cannot re-apply (the compound unique index on `{ user, community }` in `JoinRequest` prevents it). This may need to be revisited.
- Google Login users are created without a role, community, or status assignment — they start as regular users with `status: "pending"` and `role: "user"`. There is currently no flow for a Google-authenticated user to become an admin or join a community. This is a gap that needs addressing in a future phase.

---

## 9. Development Rules

These rules come directly from `ARCHITECTURE.md` and must be followed by every AI agent working on this project:

1. **Read `ARCHITECTURE.md` completely before making any change.** It is the source of truth.
2. **Never modify unrelated files.** Only touch files required for the current phase.
3. **Preserve the existing UI and design.** Do not redesign or restructure frontend components.
4. **Preserve authentication.** Do not modify login, Google Login, JWT, or password flows unless explicitly asked.
5. **Preserve Google Login.** The OAuth integration must remain working.
6. **Preserve Session Management.** The `Session` model and session creation in `login` must not be changed.
7. **Keep backward compatibility whenever possible.** Existing API contracts should not break without strong reason.
8. **Explain which files will be modified before writing code.** List every file. State why each change is necessary.
9. **Implement only the requested phase.** Do not implement features from future phases.
10. **Do not invent new architecture.** Follow the patterns already established in the codebase.
11. **Stop after completing the requested phase and wait for the next prompt.**

### Additional Rules Observed Throughout This Project

- Use ES Module syntax (`import`/`export default`) throughout the backend.
- All Mongoose models use `{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }` schema options.
- Indexes are declared after the schema definition with `schema.index(...)`.
- Every new route file exports a single `express.Router()` default export.
- Every new controller file uses named exports (no default export).
- The `protect` middleware always runs before `adminOnly`.
- Community-scoped queries always use `req.user.community` as the filter — never accept community ID from the request body for data isolation.
- Never return raw user objects from endpoints — use `user.getPublicProfile()` or explicit `.select()` to exclude sensitive fields.
- Data from one community must never be visible to users of another community.
