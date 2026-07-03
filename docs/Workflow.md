# SmartMeet — System Workflow

## Complete System Workflow Diagram

```mermaid
graph TB
    subgraph Entry["Entry Points"]
        A[Landing Page<br/>Home, Features, Pricing]
        B[Sign In / Sign Up]
    end

    subgraph Auth["Authentication Gateway"]
        C{Authenticated?}
        D[Login: Email/Password]
        E[Login: Google OAuth]
        F[Registration: Admin]
        G[Registration: Member]
        H{2FA Enabled?}
        I[TOTP Verification]
    end

    subgraph Onboarding["Onboarding"]
        J[Admin: Community Created]
        K[Member: Join Request Sent]
        L{Admin Approved?}
        M[Full Access Granted]
    end

    subgraph Core["Core Platform"]
        N[Dashboard]
        O[Meetings]
        P[Tasks]
        Q[Knowledge AI]
        R[Community Chat]
        S[Team Management]
        T[Settings]
        U[Archive]
    end

    subgraph MeetingLifecycle["Meeting Lifecycle"]
        V[Create/Schedule Meeting]
        W[Jitsi Meet Video Conference]
        X[Upload Recording]
        Y[AI Processing Pipeline]
        Z[View Analysis]
        AA[Extracted Tasks & Decisions]
    end

    subgraph TaskLifecycle["Task Lifecycle"]
        AB[Task Created<br/>Manual or from Meeting]
        AC[To Do]
        AD[In Progress]
        AE[Review]
        AF[Done]
        AG[Admin Approve]
        AH[Admin Return]
    end

    subgraph AIPipeline["AI Pipeline"]
        AI[Whisper STT<br/>Speech to Text]
        AJ[Groq Llama 3.3<br/>Analysis & Translation]
        AK[Xenova Embeddings<br/>Vector Generation]
        AL[Vector Store<br/>MongoDB/Pinecone/Chroma]
        AM[RAG Query<br/>Semantic Search]
    end

    subgraph RealTime["Real-Time"]
        AN[Socket.IO Connected]
        AO[Chat Messages]
        AP[Notifications]
        AQ[Session Management]
    end

    subgraph Exit["Exit"]
        AR[Logout]
        AS[Session Revoked]
    end

    %% Entry to Auth
    A --> B
    B --> C
    C -->|No| D
    C -->|No| E
    C -->|No| F
    C -->|No| G
    C -->|Yes - Token Exists| N

    %% Auth flows
    D --> H
    E --> H
    H -->|Yes| I
    H -->|No| J
    I -->|Verified| J
    F --> J
    G --> K

    %% Onboarding
    J --> N
    K --> L
    L -->|Yes| M
    L -->|No| B
    M --> N

    %% Core to features
    N --> O
    N --> P
    N --> Q
    N --> R
    N --> S
    N --> T
    N --> U

    %% Meeting lifecycle
    O --> V
    V --> W
    W --> X
    X --> Y
    Y --> AI
    AI --> AJ
    AJ --> AK
    AK --> AL
    AJ --> Z
    AJ --> AA
    Y --> Z
    AA --> P

    %% Task lifecycle
    P --> AB
    AB --> AC
    AC --> AD
    AD --> AE
    AE --> AG
    AE --> AH
    AG --> AF
    AH --> AD
    AF --> P

    %% Knowledge AI
    Q --> AM
    AM --> AL
    AM --> AJ

    %% Chat
    R --> AN
    AN --> AO
    AN --> AP

    %% Real-time
    AN --> AP
    AN --> AQ

    %% Exit
    T --> AR
    AR --> AS
    AS --> B
```

## Application Startup Flow

```mermaid
sequenceDiagram
    participant FS as File System
    participant ENV as dotenv
    participant DB as MongoDB
    participant APP as Express App
    participant HTTP as HTTP Server
    participant IO as Socket.IO
    participant PORT as Port 5000

    Note over FS,PORT: server.js Entry Point

    FS->>ENV: Load .env file
    ENV->>ENV: process.env populated
    
    FS->>DB: connectDB()
    DB->>DB: mongoose.connect(MONGO_URI)
    DB-->>FS: Connected to MongoDB
    
    FS->>APP: Create Express application
    APP->>APP: Apply middleware (CORS, JSON, Static)
    APP->>APP: Mount 11 route groups
    
    FS->>HTTP: http.createServer(app)
    HTTP->>APP: Server wraps Express
    
    FS->>IO: initializeSocket(server)
    IO->>IO: Create Socket.IO Server
    IO->>IO: Configure CORS
    IO->>IO: Set up JWT auth middleware
    IO->>IO: Register connection/disconnect handlers
    IO->>IO: Register community chat handlers
    
    HTTP->>PORT: server.listen(PORT)
    PORT-->>FS: Server running on port 5000
```

## Request Lifecycle

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant V as Vite Dev Server (Proxy)
    participant EX as Express.js
    participant MW as Middleware Stack
    participant RT as Route Handler
    participant CT as Controller
    participant SV as Service Layer
    participant DB as MongoDB
    participant EXT as External Services

    C->>C: User action triggers API call
    C->>V: HTTP Request (localhost:5173)
    V->>V: Vite proxies /api to localhost:5000
    V->>EX: Forwarded Request
    
    EX->>MW: express.json() — parse body
    EX->>MW: cors() — check origin
    EX->>MW: static('/uploads') — serve files
    
    Note over MW,RT: Authentication Check
    
    alt Protected Route
        MW->>MW: authMiddleware.protect()
        MW->>MW: Extract Bearer token
        MW->>MW: jwt.verify(token, JWT_SECRET)
        MW->>DB: User.findById(decoded.id)
        DB-->>MW: user document
        MW->>MW: req.user = user
    end
    
    alt Admin Route
        MW->>MW: authMiddleware.adminOnly()
        MW->>MW: Check req.user.role === "admin"
    end
    
    MW->>RT: Route matched
    
    alt Validation Error
        RT->>RT: Validate request params/body
        RT-->>C: 400 Validation Error
    else Business Logic
        RT->>CT: Controller function
        CT->>CT: Business logic
        CT->>SV: Service layer (if complex)
        
        alt Database Operation
            SV->>DB: Mongoose query
            DB-->>SV: Result
        end
        
        alt AI Operation
            SV->>EXT: External API call (Groq, Whisper, etc.)
            EXT-->>SV: Result
        end
        
        alt Email
            SV->>EXT: Resend / Nodemailer
        end
        
        alt Real-time Event
            CT->>EXT: Socket.IO emit
        end
        
        SV-->>CT: Processed result
        CT-->>RT: Formatted response
        RT-->>EX: JSON response
        EX-->>V: HTTP Response
        V-->>C: Response received
        
        C->>C: Update Pinia store (optimistic)
        C->>C: Re-render Vue component
    end
```

## Error Handling Flow

```mermaid
graph TD
    subgraph Errors["Error Sources"]
        E1[Mongoose Validation Error]
        E2[JWT Expired/Invalid]
        E3[bcrypt Comparison Fail]
        E4[External API Timeout]
        E5[File System Error]
        E6[Socket Disconnect]
        E7[Groq API Error]
        E8[STT Server Unavailable]
    end

    subgraph Handling["Error Handling Layers"]
        H1[try/catch in Controller]
        H2[Mongoose Pre-save Hooks]
        H3[Socket.IO Error Events]
        H4[Promise.catch in Background Jobs]
        H5[Ack Callbacks]
    end

    subgraph Responses["Error Responses"]
        R1[400: Validation Error]
        R2[401: Not Authenticated]
        R3[403: Not Authorized]
        R4[404: Not Found]
        R5[409: Conflict/Duplicate]
        R6[500: Internal Server Error]
        R7[Socket Error Event]
    end

    E1 --> H1 --> R1
    E2 --> H3 --> R2
    E3 --> H1 --> R2
    E7 --> H4 --> R6
    E8 --> H4 --> R6
    E4 --> H1 --> R6
    E6 --> H3 --> R7
    E5 --> H1 --> R6
```

## System Integration Map

```mermaid
graph TB
    subgraph Frontend["Frontend (Vue 3)"]
        A1[Views + Components]
        A2[Pinia Stores]
        A3[Axios HTTP]
        A4[Socket.IO Client]
        A5[Router]
    end

    subgraph Backend["Backend (Express + Socket.IO)"]
        B1[Route Groups × 11]
        B2[Controllers × 13]
        B3[Services × 12]
        B4[Models × 17]
        B5[Middleware × 2]
        B6[Socket Handlers × 2]
        B7[Utilities × 3]
    end

    subgraph Database["MongoDB (Mongoose)"]
        C1[15+ Collections]
        C2[Indexes]
        C3[Validation]
        C4[Pre-save Hooks]
    end

    subgraph AI["AI Services"]
        D1[Whisper STT (Python)]
        D2[Groq Llama 3.3]
        D3[Xenova Embeddings]
        D4[Pinecone / ChromaDB]
    end

    subgraph External["External Services"]
        E1[Google OAuth]
        E2[Resend Email]
        E3[Gmail SMTP]
        E4[Jitsi Meet]
        E5[Paymob / Stripe]
    end

    A3 --> B1
    A4 --> B6
    B1 --> B2
    B2 --> B3
    B3 --> C1
    B2 --> B7
    B3 --> D1
    B3 --> D2
    B3 --> D3
    B3 --> D4
    B2 --> E1
    B3 --> E2
    B7 --> E3
    A1 --> E4
    A5 --> E1
    A3 --> E5
```
