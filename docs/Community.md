# SmartMeet — Community & Multi-Tenancy

## Overview

SmartMeet uses a **multi-tenant workspace** model called Communities. Each community is a fully isolated workspace with its own members, meetings, tasks, chat, and notifications. Absolute data isolation is enforced at every database query level — no user can ever access data from another community.

## Core Concepts

```mermaid
graph TB
    subgraph CommunityA["Community: Acme Corp"]
        A1[Admin: Alice]
        A2[Member: Bob]
        A3[Member: Charlie]
        A4[Meetings]
        A5[Tasks]
        A6[Chat Messages]
    end

    subgraph CommunityB["Community: Beta Inc"]
        B1[Admin: Dave]
        B2[Member: Eve]
        B3[Meetings]
        B4[Tasks]
        B5[Chat Messages]
    end

    A1 --> A4
    A1 --> A5
    A2 --> A4
    A2 --> A5
    A3 --> A5
    B1 --> B3
    B1 --> B4
    B2 --> B3
    B2 --> B4

    Note: No cross-community data access
```

## Key Rules

| Rule | Description |
|---|---|
| One admin per community | Each community has exactly one owner (admin) |
| One community per user | A user belongs to at most one community |
| Unique invitation code | Each community has an 8-character uppercase alphanumeric code |
| Approval required | Users must be approved by the admin before joining |
| Absolute isolation | Every query filters by `community: req.user.community` |

## Community Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Created: Admin Registration
    
    Created --> Active: Admin manages
    Active --> Growing: Members join
    
    state Growing {
        [*] --> JoinRequest: User submits code
        JoinRequest --> Pending: Request created
        Pending --> Approved: Admin approves
        Pending --> Rejected: Admin rejects
        Approved --> [*]: User becomes active member
    end
    
    Active --> [*]: (No deletion UI exists)
```

## Community Model

**File:** `Back-end/src/models/Community.js`

```javascript
{
  name: String,           // Required — workspace display name
  code: String,           // Unique, uppercase — 8-char invitation code
  owner: ObjectId,        // FK → User — community administrator
  description: String,    // Optional workspace description
  createdAt: Date,        // Auto
  updatedAt: Date,        // Auto
}
```

## Join Request Workflow

```mermaid
sequenceDiagram
    actor U as New User
    actor A as Admin
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    Note over U,A: Phase 1: User Registration
    
    U->>FE: Visit /register
    U->>FE: Enter community code "ABC12345"
    U->>FE: Submit registration
    FE->>BE: POST /api/users/register { role: "user", communityCode: "ABC12345" }
    BE->>DB: Community.findOne({ code: "ABC12345" })
    DB-->>BE: Target community
    BE->>DB: User.create({...})
    BE->>DB: JoinRequest.create({ user, community })
    BE->>DB: Notification.create({ recipient: community.owner, type: "join-request" })
    BE-->>FE: 201 { success: true, token, user (pending) }

    Note over U,A: Phase 2: Admin Review

    A->>FE: View pending join requests
    FE->>BE: GET /api/join-requests
    BE->>DB: JoinRequest.find({ community: req.user.community, status: "pending" })
    DB-->>BE: Pending requests
    BE-->>FE: [{ user, status, createdAt }]

    alt Approve
        A->>FE: Click "Approve"
        FE->>BE: PATCH /api/join-requests/:id/approve
        BE->>DB: JoinRequest.updateOne({ status: "approved" })
        BE->>DB: User.updateOne({ community, status: "active" })
        BE->>DB: Notification.create({ recipient: user, type: "approval" })
        BE-->>FE: 200
        U-->>U: Receives approval notification
        U-->>U: Now has full access
    else Reject
        A->>FE: Click "Reject"
        FE->>BE: PATCH /api/join-requests/:id/reject
        BE->>DB: JoinRequest.updateOne({ status: "rejected" })
        BE->>DB: User.updateOne({ status: "rejected" })
        BE->>DB: Notification.create({ recipient: user, type: "rejection" })
        BE-->>FE: 200
    end
```

## Invitation System

The invitation system provides an alternative onboarding path: admins can send email invitations with a secure token. Invited users bypass the join-request flow and are directly assigned to the community.

```mermaid
sequenceDiagram
    actor A as Admin
    actor U as Invited User
    participant BE as Backend
    participant RE as Resend API
    participant DB as MongoDB

    A->>BE: POST /api/invitations { fullName, email, role }
    BE->>BE: Generate crypto token
    BE->>DB: Invitation.create({ token, fullName, email, role, community, invitedBy, expiresAt: +7d })
    BE->>RE: sendInvitationEmail({ to, fullName, communityName, role, invitationLink, expiresAt })
    BE-->>A: 201 Invitation sent

    Note over U: User receives email

    alt New User
        U->>BE: GET /api/invitations/verify/:token
        BE->>DB: Invitation.findOne({ token })
        BE-->>U: { valid, email, communityName, requiresRegistration: true }
        
        U->>BE: POST /api/invitations/:token/accept { password }
        BE->>DB: User.create({ email, password, community, role, status: "active" })
        BE->>DB: Invitation.updateOne({ status: "accepted" })
        BE-->>U: 200 { token, user }
    else Existing User
        U->>BE: Sign in first
        U->>BE: POST /api/invitations/:token/claim
        BE->>BE: Verify email matches invitation
        BE->>BE: Verify user not already in a community
        BE->>DB: User.updateOne({ community, status: "active", role })
        BE->>DB: Invitation.updateOne({ status: "accepted" })
        BE-->>U: 200 { success: true }
    end
```

## Community API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/communities/members` | protect + adminOnly | List all active members + community code |
| GET | `/api/communities/stats` | protect + adminOnly | Total members, active tasks, pending invitations |
| GET | `/api/communities/overview` | protect | Full community overview (role-dependent data) |
| PUT | `/api/communities/members/:id/role` | protect + adminOnly | Change member role (user ↔ admin) |
| DELETE | `/api/communities/members/:id` | protect + adminOnly | Remove member from community |

## Join Request API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/join-requests` | protect | Submit join request with community code |
| GET | `/api/join-requests` | protect + adminOnly | List pending requests |
| PATCH | `/api/join-requests/:id/approve` | protect + adminOnly | Approve request |
| PATCH | `/api/join-requests/:id/reject` | protect + adminOnly | Reject request |

## Invitation API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/invitations` | protect + adminOnly | Create invitation |
| GET | `/api/invitations/verify/:token` | None | Verify invitation token |
| POST | `/api/invitations/:token/accept` | None | Accept invitation (new user) |
| POST | `/api/invitations/:token/claim` | protect | Claim invitation (existing user) |

## Data Isolation Pattern

Every database query in community-scoped features follows this pattern:

```javascript
// Correct — data isolated
Model.find({ community: req.user.community, ...otherFilters });

// WRONG — data leak
Model.find({ ...otherFilters });  // No community filter!
```

## Community Chat

The community chat system provides real-time messaging for all active community members. See [CommunityChat.md](./CommunityChat.md) for details.
