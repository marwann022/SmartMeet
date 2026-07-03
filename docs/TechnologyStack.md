# SmartMeet — Technology Stack

## Complete Technology Inventory

| Technology | Version | Purpose | Why Selected | Advantages | Alternatives |
|---|---|---|---|---|---|
| **Node.js** | 18+ | JavaScript runtime for backend | Non-blocking event loop ideal for real-time features and AI pipeline orchestration with concurrent I/O | Single language (JS) across stack; massive ecosystem; excellent for microservices | Python (Django), Go, Ruby on Rails |
| **Express.js** | 4.x | Web framework | Minimalist, unopinionated framework with robust middleware ecosystem; de facto standard for Node.js APIs | Lightweight, mature, huge community, flexible routing | Fastify, Koa, Hapi |
| **MongoDB** | 7.x | Primary database | Schema-less document model suits the evolving shapes of meeting transcripts, knowledge layers, and nested analysis results | Flexible schema, rich queries, built-in text search, horizontal scaling | PostgreSQL, MySQL, SQLite |
| **Mongoose** | 8.x | MongoDB ODM | Provides schema validation, middleware (pre-save hooks), virtual fields, and population — critical for relational data in MongoDB | Elegant schema design, built-in validation, populate for joins, middleware hooks | Prisma, Sequelize, TypeORM |
| **JSON Web Token (JWT)** | — | Authentication | Stateless authentication ideal for SPA architecture; no server-side session storage needed | Stateless, scalable, cross-domain, compact payload | Sessions, OAuth tokens, PASETO |
| **Socket.IO** | 4.x | Real-time communication | Reliable bidirectional communication with automatic reconnection, fallback transports, and room support | Automatic reconnection, multiplexing, rooms for community isolation, production-proven | WebSocket native, Pusher, Ably |
| **Groq (OpenAI-compatible)** | — | LLM inference for transcript analysis | 8x faster inference than GPT-4 with comparable quality; significantly lower cost for high-volume transcript processing | Low latency (50ms token generation), cost-effective, Llama 3.3 70B quality | OpenAI GPT-4, Anthropic Claude, Google Gemini |
| **Whisper (faster-whisper)** | — | Speech-to-text | Local execution ensures audio data never leaves the server; CTranslate2-optimized for 3x faster than OpenAI Whisper | Data sovereignty, no per-minute costs, runs on CPU, high accuracy | Google Speech-to-Text, AWS Transcribe, Azure Speech |
| **FastAPI (Python)** | — | STT server | High-performance async Python framework perfect for CPU-bound inference tasks | Auto OpenAPI docs, async support, type validation | Flask, Django REST |
| **Xenova Transformers** | — | Local embedding generation | Runs entirely in Node.js with ONNX runtime — zero external API calls for embeddings | Free, local execution, no API keys needed, 384-dim embeddings | OpenAI Embeddings, Cohere Embed, Google Embed |
| **Pinecone** | — | Production vector store | Managed vector database with built-in indexing, namespacing, and high query throughput | Serverless, automatic indexing, multi-tenancy via namespaces | MongoDB Atlas Vector Search, ChromaDB, Qdrant, Weaviate |
| **ChromaDB** | — | Local vector store | Open-source, lightweight, Python-native vector DB for development | Free, no infrastructure needed, simple API | Pinecone, Qdrant, Milvus |
| **Nodemailer** | 6.x | SMTP email | Mature, well-maintained Node.js email library with Gmail SMTP support | Free for password resets, simple API, reliable | SendGrid, Mailgun, AWS SES |
| **Resend** | — | Transactional email | Modern email API with beautiful HTML templates and high deliverability | Styled templates, high deliverability, developer-friendly API | SendGrid, Mailgun, Postmark |
| **bcryptjs** | 2.x | Password hashing | Industry-standard password hashing with configurable salt rounds | Battle-tested, constant-time comparison, no native compilation needed | argon2, scrypt |
| **speakeasy** | 2.x | TOTP 2FA | Lightweight TOTP implementation compatible with Google Authenticator and Authy | Standards-compliant (RFC 6238), no dependencies, widely used | otplib, notp |
| **Multer** | 1.x | File uploads | De facto Express multipart/form-data parser | Simple, memory-efficient disk storage, file filtering | formidable, busboy |
| **Vue 3** | 3.4+ | Frontend framework | Reactive, component-based framework with excellent developer experience | Composition API, reactivity system, SFC compilation, small bundle | React, Angular, Svelte |
| **Vite** | 5.x | Build tool | Lightning-fast HMR, native ESM dev server, optimized production builds | Instant server start, fast HMR, tree-shaking, CSS code splitting | Webpack, Parcel, Rollup |
| **Pinia** | 3.x | State management | Official Vue 3 state management with TypeScript support, devtools, and modular design | Lightweight (1KB), full TypeScript, no mutations, intuitive API | Vuex, Zustand, Redux |
| **TailwindCSS** | 3.x | CSS framework | Utility-first CSS with design system customization via tailwind.config.js | Rapid prototyping, consistent design tokens, small production CSS (purging) | Bootstrap, DaisyUI (used on top), Chakra UI |
| **DaisyUI** | 5.x | Component library | TailwindCSS component library with theming | Pre-built components, semantic themes, Tailwind-native | Material UI, Headless UI, PrimeVue |
| **Phosphor Icons** | 2.x | Icon library | Consistent, beautiful icons for Vue | 6 weight variants, tree-shakeable, Vue-native | Font Awesome, Heroicons, Material Icons |
| **Google Sign-In (GSI)** | — | OAuth authentication | Frictionless login with existing Google accounts | Trusted by users, secure, no password management | Facebook Login, Apple Sign-In, Twitter OAuth |
| **Jitsi Meet** | — | Video conferencing | Open-source, self-hostable video conferencing integrated via external API | Free, no usage limits, embeddable | Zoom API, Google Meet embed, Daily.co |

## How Each Technology Participates

### Backend Runtime & Framework

**Node.js + Express.js** forms the backbone of the API server. Express handles HTTP request routing, middleware execution, response serialization, and error handling. All 11 route groups (users, meetings, tasks, rag, notifications, communities, join-requests, invitations, community-chat, dashboard, subscription) are mounted on the Express app in `app.js`. The server boots in `server.js`, which creates an HTTP server from the Express app, attaches Socket.IO, and starts listening.

### Database Layer

**MongoDB** is accessed exclusively through **Mongoose**, which provides schema definitions for all 15+ collections. Mongoose schemas enforce types, validation, and indexes. The `pre("save")` hook on the User model hashes passwords automatically. The `populate()` method is used extensively to resolve ObjectId references (e.g., `User.community` to full Community document, `Message.sender` to User profile).

### Authentication & Security

**JWT** tokens are generated via `generateToken.js` with `jsonwebtoken`. The `protect` middleware in `authMiddleware.js` decodes the token, finds the user, and attaches them to `req.user`. The `adminOnly` middleware checks `req.user.role === "admin"`. **bcryptjs** hashes passwords with 12 salt rounds. **speakeasy** generates TOTP secrets for 2FA, and **qrcode** renders the setup QR code.

### Real-Time Communication

**Socket.IO** is initialized in `server.js` and configured in `socket/index.js`. JWT authentication is verified on every socket connection. The `userSockets` Map tracks online users for direct messaging. Two event categories exist: community chat (`chat:send`, `chat:message`, `chat:notification`) and system events (`task:notification`, `meeting:notification`, `chat:notification`, `session:revoked`).

### AI Pipeline

1. **Whisper STT** runs as a standalone Python FastAPI server (`stt-server/main.py`). It loads the `faster-whisper` `small` model on CPU with INT8 quantization. Audio files are sent via HTTP POST, transcribed locally, and the transcript is returned.
2. **Groq LLM** is called via the OpenAI-compatible client in `meetingAnalysisService.js`. It receives transcript text and returns structured JSON with summary, decisions, action items, risks, deadlines, etc. The `response_format: { type: "json_object" }` option enforces valid JSON output.
3. **Xenova Transformers** generates 384-dimensional embeddings locally using `all-MiniLM-L6-v2` in `embeddingService.js`. The pipeline is loaded once (singleton pattern) and reused across all embedding requests.
4. **Vector Store** is abstracted via `vectorStoreService.js`. It always writes to MongoDB's `MeetingEmbedding` collection and conditionally mirrors to Pinecone or ChromaDB based on `VECTOR_STORE_PROVIDER` environment variable.

### Email

Two parallel email systems operate:
- **Nodemailer + Gmail SMTP**: Used exclusively for password reset emails in `sendEmail.js`. Configured with `EMAIL_USER` and `EMAIL_PASS` environment variables. Port 587 with TLS.
- **Resend API**: Used for styled transactional emails in `emailService.js`. `sendInvitationEmail()` sends rich HTML invitation templates. `sendMeetingSummaryEmail()` sends meeting recap emails.

### Frontend

**Vue 3** with the Composition API (`<script setup>`) powers the entire UI. **Vite** serves as the dev server with HMR and proxies `/api` requests to the backend. **Pinia** stores manage all client-side state with optimistic updates. **TailwindCSS + DaisyUI** provide the design system with custom glassmorphism tokens, dark mode (via `class` strategy), and responsive layouts. **Phosphor Icons** provide consistent vector icons. **Socket.IO Client** connects to the backend for real-time features.

### Deployment

The frontend is deployed on **Vercel** (`smartmeet-ai-smoky.vercel.app`). The backend runs on a Node.js server (VM or cloud instance). MongoDB can be hosted on Atlas or locally. The Python STT server runs as a sidecar process on the same machine as the backend.
