# SmartMeet Architecture

## Project Overview

SmartMeet is a multi-tenant workspace collaboration platform.

Each workspace (Community) has its own isolated:

- Members
- Tasks
- Meetings
- Documents
- Notifications

A user belongs to only one community.

Data from one community must never be accessible by another community.

Each community is owned by one administrator.

---

# Database Collections

1. Users
2. Communities
3. JoinRequests
4. Tasks
5. Meetings
6. Documents
7. Notifications
8. Sessions

---

# Database Models

## Communities

| Field       | Type             | Description               |
| ----------- | ---------------- | ------------------------- |
| \_id        | ObjectId         | Primary key               |
| name        | String           | Workspace name            |
| code        | String (Unique)  | Community invitation code |
| owner       | ObjectId -> User | Community owner           |
| description | String           | Optional description      |
| createdAt   | Date             | Automatically generated   |
| updatedAt   | Date             | Automatically generated   |

---

## Users

| Field     | Type                  | Description             |
| --------- | --------------------- | ----------------------- |
| \_id      | ObjectId              | Primary key             |
| firstName | String                | User first name         |
| lastName  | String                | User last name          |
| email     | String                | Unique email            |
| password  | String                | Hashed password         |
| role      | Enum                  | admin / user            |
| community | ObjectId -> Community | Community membership    |
| avatar    | String                | Avatar URL              |
| phone     | String                | Phone number            |
| status    | Enum                  | pending / active        |
| createdAt | Date                  | Automatically generated |
| updatedAt | Date                  | Automatically generated |

---

## JoinRequests

| Field     | Type                  | Description                   |
| --------- | --------------------- | ----------------------------- |
| \_id      | ObjectId              | Primary key                   |
| user      | ObjectId -> User      | User requesting to join       |
| community | ObjectId -> Community | Target community              |
| status    | Enum                  | pending / approved / rejected |
| createdAt | Date                  | Automatically generated       |
| updatedAt | Date                  | Automatically generated       |

---

## Tasks

| Field       | Type                  | Description                    |
| ----------- | --------------------- | ------------------------------ |
| \_id        | ObjectId              | Primary key                    |
| title       | String                | Task title                     |
| description | String                | Task description               |
| status      | Enum                  | Todo / In Progress / Completed |
| priority    | Enum                  | Low / Medium / High            |
| deadline    | Date                  | Due date                       |
| community   | ObjectId -> Community | Community owner                |
| createdBy   | ObjectId -> User      | Creator                        |
| assignedTo  | ObjectId -> User      | Assigned member                |
| attachments | Array                 | Optional attachments           |
| createdAt   | Date                  | Automatically generated        |
| updatedAt   | Date                  | Automatically generated        |

---

## Meetings

| Field        | Type                    | Description             |
| ------------ | ----------------------- | ----------------------- |
| \_id         | ObjectId                | Primary key             |
| title        | String                  | Meeting title           |
| date         | Date                    | Meeting date            |
| community    | ObjectId -> Community   | Community owner         |
| createdBy    | ObjectId -> User        | Creator                 |
| participants | Array<ObjectId -> User> | Meeting members         |
| createdAt    | Date                    | Automatically generated |
| updatedAt    | Date                    | Automatically generated |

---

## Documents

| Field      | Type                  | Description             |
| ---------- | --------------------- | ----------------------- |
| \_id       | ObjectId              | Primary key             |
| title      | String                | Document title          |
| fileUrl    | String                | Cloudinary URL          |
| fileType   | Enum                  | pdf / docx / pptx       |
| community  | ObjectId -> Community | Community owner         |
| uploadedBy | ObjectId -> User      | Uploader                |
| createdAt  | Date                  | Automatically generated |
| updatedAt  | Date                  | Automatically generated |

---

## Notifications

| Field     | Type                  | Description                                                     |
| --------- | --------------------- | --------------------------------------------------------------- |
| \_id      | ObjectId              | Primary key                                                     |
| recipient | ObjectId -> User      | Notification receiver                                           |
| community | ObjectId -> Community | Related community                                               |
| type      | Enum                  | join-request / task / meeting / document / approval / rejection |
| title     | String                | Notification title                                              |
| message   | String                | Notification body                                               |
| read      | Boolean               | Read status                                                     |
| createdAt | Date                  | Automatically generated                                         |

---

## Sessions

The existing session management system remains unchanged.

---

# Database Relationships

Community

- Users
- Tasks
- Meetings
- Documents
- Notifications

User

- Community
- Tasks
- Meetings
- Notifications

Task

- Community
- Creator
- Assigned User

Meeting

- Community
- Participants

Document

- Community
- Uploaded By

Notification

- Community
- Recipient

JoinRequest

- Community
- User

---

# Business Rules

### Community

- Every admin owns exactly one community.
- Every community has one owner.
- Every community has a unique invitation code.

### Registration

Admin Registration

- Create the admin account.
- Create a new community.
- Generate a unique community code.
- Link the admin to the created community.

User Registration

- User selects the User role.
- User enters the community code.
- Backend validates the code.
- A Join Request is created.
- The user is **not** added immediately.

### Join Requests

- Every join request starts as Pending.
- Admin may Approve or Reject.
- When approved:
  - User.community is updated.
  - User.status becomes Active.
  - A notification is sent.

- When rejected:
  - A rejection notification is sent.

### Team Management

Only the community owner (Admin) can:

- View members
- Remove members
- Approve requests
- Reject requests
- Change member roles

---

# Data Isolation

Every query must filter by Community.

Examples:

Tasks

Find tasks where:

community == currentUser.community

Meetings

Find meetings where:

community == currentUser.community

Documents

Find documents where:

community == currentUser.community

Notifications

Find notifications where:

recipient == currentUser

Users

Find users where:

community == currentUser.community

No user should ever be able to access another community's data.

---

# API Roadmap

## Communities

POST /api/communities

GET /api/communities/:id

GET /api/communities/members

---

## Join Requests

POST /api/join-requests

GET /api/join-requests

PATCH /api/join-requests/:id/approve

PATCH /api/join-requests/:id/reject

---

## Tasks

POST /api/tasks

GET /api/tasks

PUT /api/tasks/:id

DELETE /api/tasks/:id

---

## Meetings

POST /api/meetings

GET /api/meetings

PUT /api/meetings/:id

DELETE /api/meetings/:id

---

## Documents

POST /api/documents

GET /api/documents

DELETE /api/documents/:id

---

## Notifications

GET /api/notifications

PATCH /api/notifications/:id/read

---

# Development Order

Phase 1

Community Model

Phase 2

Update User Model

Phase 3

Admin Registration

Phase 4

User Registration

Phase 5

Join Requests

Phase 6

Notifications

Phase 7

Team Management

Phase 8

Tasks

Phase 9

Meetings

Phase 10

Documents

Phase 11

Dashboard Statistics

Phase 12

Community Settings

---

# Claude AI Development Rules

Before making any change:

1. Read this ARCHITECTURE.md completely.

2. Never modify unrelated files.

3. Preserve the existing UI and design.

4. Preserve authentication unless explicitly requested.

5. Preserve Google Login.

6. Preserve Session Management.

7. Follow the current project folder structure.

8. Explain which files will be modified before generating code.

9. Implement only the requested phase.

10. Do not invent new architecture.

11. Stop after completing the requested phase.
