# SmartMeet — Socket Events Reference

## Overview

SmartMeet uses **Socket.IO** for all real-time communication. The socket server is initialized in `server.js`, configured in `socket/index.js`, and handles two categories of events: **community chat** and **system notifications**.

## Server Initialization

```mermaid
sequenceDiagram
    participant S as server.js
    participant SI as socket/index.js
    participant CS as communityChat.socket.js
    participant DB as MongoDB

    S->>SI: initializeSocket(httpServer)
    SI->>SI: Create Socket.IO Server
    SI->>SI: CORS config with FRONTEND_URL
    
    Note over SI: Connection Authentication
    
    SI->>SI: io.use(authMiddleware)
    Note over SI: 1. Extract token from handshake.auth.token
    Note over SI: 2. jwt.verify(token, JWT_SECRET)
    Note over SI: 3. Find user by decoded.id
    Note over SI: 4. Attach user to socket.user
    
    SI->>SI: io.on("connection")
    SI->>SI: Track socket in userSockets Map
    SI->>SI: Track session in sessionSockets Map
    SI->>CS: registerCommunityChat(io, socket, userSockets)
    
    SI->>SI: socket.on("disconnect")
    SI->>SI: Remove from userSockets Map
    SI->>SI: Remove from sessionSockets Map
```

## Data Structures

```javascript
// Map: userId → Set of socketIds
const userSockets = new Map();
// Example: { "user123" → Set{"socketA", "socketB"} }

// Map: sessionId → socket
const sessionSockets = new Map();
// Example: { "session456" → socketInstance }
```

## Connection Authentication

Every socket connection must provide a JWT token:

```javascript
const socket = io("http://localhost:5000", {
  auth: { token: "Bearer <jwt_token>" }
});
```

The server middleware:
1. Extracts token from `socket.handshake.auth.token`
2. Verifies with `jwt.verify(token, JWT_SECRET)`
3. Loads user from database (with community populated)
4. Attaches `socket.user` and `socket.sessionId`
5. Rejects connection with error if invalid

## Event Catalog

### Community Chat Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `chat:send` | Client → Server | `{ message: string }` | Send a chat message |
| `chat:message` | Server → Room | `{ _id, sender, message, createdAt }` | Broadcast message to community room |
| `chat:notification` | Server → Individual | `{ type: "chat", title, message }` | Chat notification to online members |
| `chat:error` | Server → Individual | `{ error: string }` | Error response |

### Notification Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `task:notification` | Server → Individual | `{ type, title, message, relatedId }` | Task status change notification |
| `meeting:notification` | Server → Individual | `{ type, title, message, relatedId }` | Meeting invitation notification |
| `chat:notification` | Server → Individual | `{ type, title, message }` | Chat message notification |

### Session Events

| Event | Direction | Payload | Description |
|---|---|---|---|
| `session:revoked` | Server → Individual | None | Session deleted by user |

## Event Flow Diagrams

### Chat Message Flow

```mermaid
sequenceDiagram
    participant A as Alice (Sender)
    participant S as Socket.IO Server
    participant B as Bob (Receiver)
    participant C as Charlie (Receiver)
    participant DB as MongoDB

    A->>S: emit("chat:send", { message: "Hello!" })
    S->>S: JWT verified (already on connect)
    S->>S: Check community assignment
    S->>DB: Message.create({ community, sender, message })
    S->>DB: Message.findById().populate("sender")
    DB-->>S: Populated message
    
    S->>S: io.to("chat:community:abc").emit("chat:message", payload)
    S-->>A: ack({ success: true })
    S-->>B: chat:message
    S-->>C: chat:message
    
    S->>DB: Find other community members
    loop Each other member
        S->>DB: Notification.create()
        alt Member online
            S->>B: emit("chat:notification")
            S->>C: emit("chat:notification")
        end
    end
```

### Task Notification Flow

```mermaid
sequenceDiagram
    participant FE as Frontend (Member)
    participant BE as Backend
    participant S as Socket.IO Server
    participant A as Admin Socket

    FE->>BE: PUT /api/tasks/:id { status: "review" }
    BE->>BE: validateTransition("inprogress", "review", "user")
    BE->>DB: Update task, create notifications
    
    loop Each admin
        S->>A: emit("task:notification", { type: "approval", title: "Task Ready For Review", ... })
    end
    
    BE-->>FE: 200 { success: true }
```

### Meeting Invitation Flow

```mermaid
sequenceDiagram
    participant FE as Frontend (Host)
    participant BE as Backend
    participant S as Socket.IO Server
    participant P as Participant Socket

    FE->>BE: POST /api/meetings { title, participants }
    BE->>DB: Meeting.create()
    
    loop Each matched participant
        BE->>DB: Notification.create()
        alt Participant online
            S->>P: emit("meeting:notification", { type: "meeting", title: "Meeting Invitation", ... })
        end
    end
    
    BE-->>FE: 201 { meeting }
```

## Utility Exports

```javascript
// Socket/index.js exports:
export const initializeSocket = (server) => { /* ... */ };
export const getIO = () => { /* returns Socket.IO server instance */ };
export const getUserSockets = () => { /* returns userSockets Map */ };
export const getSocketBySessionId = (sessionId) => { /* ... */ };
```

## How Other Modules Use Sockets

```javascript
// In any controller:
import { getIO, getUserSockets } from "../socket/index.js";

const io = getIO();
const userSocketsMap = getUserSockets();

// Send to specific user
const sockets = userSocketsMap.get(userId);
if (sockets) {
  for (const sid of sockets) {
    io.to(sid).emit("event:name", payload);
  }
}
```

## Connection Management

```javascript
// Server configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingInterval: 25000,    // 25s ping to keep connection alive
  pingTimeout: 20000,      // 20s to respond before disconnect
});
```

## Disconnect Cleanup

On socket disconnect, the server:
1. Removes the socket ID from the user's socket Set
2. If the user has no more sockets, removes the user from the Map entirely
3. If the socket was associated with a session, removes the session-to-socket mapping

## Error Handling

| Error | Behavior |
|---|---|
| No token provided | `next(new Error("Authentication required."))` |
| Invalid/expired token | `next(new Error("Invalid token."))` |
| User not found | `next(new Error("User not found."))` |
| Socket.IO not initialized | `getIO()` throws `Error("Socket.IO not initialized.")` |

## Security

- Every socket connection is authenticated with JWT
- Chat messages are validated server-side (non-empty, max 5000 chars)
- Community membership is verified before joining rooms
- Community chat rooms are isolated per community ID — no cross-community message leaks
- Socket connection can be forced-disconnected via `socket.disconnect(true)` if user has no community
