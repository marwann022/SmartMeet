# SmartMeet — Authentication & Authorization

## Architecture Overview

SmartMeet uses a **hybrid authentication system** combining JWT (primary), Google OAuth 2.0 (optional), and TOTP-based two-factor authentication. Sessions are tracked independently for device management.

```mermaid
graph TD
    subgraph AuthFlow["Authentication Flow"]
        A[User] --> B{Login Method}
        B --> C[Email + Password]
        B --> D[Google OAuth]
        C --> E[Validate Credentials]
        D --> F[Verify Google ID Token]
        E --> G{2FA Enabled?}
        G -->|Yes| H[Return preAuthToken]
        G -->|No| I[Generate JWT]
        F --> I
        H --> J[Submit TOTP Code]
        J --> K[Verify & Generate JWT]
        I --> L[Create Session]
        K --> L
        L --> M[Return JWT + User Profile]
    end

    subgraph Middleware["Request Middleware"]
        N[Client Request] --> O[Authorization: Bearer <token>]
        O --> P[protect Middleware]
        P --> Q{Token Valid?}
        Q -->|No| R[401 Unauthorized]
        Q -->|Yes| S[Decode JWT → user._id]
        S --> T[Find User in DB]
        T --> U[Attach to req.user]
        U --> V[Route Handler]
    end
```

## JWT Token

### Generation

Tokens are generated in `Back-end/src/utils/generateToken.js`:

```javascript
import jwt from "jsonwebtoken";

const generateToken = (id, sessionId) => {
  return jwt.sign({ id, ...(sessionId && { sessionId }) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};
```

**Payload:**
```json
{
  "id": "user_object_id",
  "sessionId": "optional_session_id",
  "iat": 1719876543,
  "exp": 1720481343
}
```

### Verification

The `protect` middleware decodes the JWT, looks up the user, and attaches the full user document to `req.user`:

```mermaid
sequenceDiagram
    participant C as Client
    participant P as protect Middleware
    participant U as User Model
    participant S as Session Model
    
    C->>P: Request + Bearer Token
    P->>P: jwt.verify(token, JWT_SECRET)
    P->>U: User.findById(decoded.id)
    U-->>P: user document
    P->>S: if sessionId → update lastActive
    P->>C: req.user attached → Route Handler
```

## Registration Flow

### Admin Registration

```mermaid
sequenceDiagram
    actor A as Admin
    participant C as userController
    participant U as User
    participant M as Community
    participant NR as Notification
    
    A->>C: POST /register { name, email, password, role: "admin" }
    C->>C: Validate password strength
    C->>C: Generate unique 8-char community code
    C->>U: User.create({...})
    U-->>C: New admin user
    C->>M: Community.create({ name, code, owner })
    M-->>C: New community
    C->>U: Update user.community, user.status = "active"
    C->>C: Create Session (device info)
    C-->>A: 201 { token, sessionId, user }
```

### User Registration

```mermaid
sequenceDiagram
    actor U as User
    participant C as userController
    participant CM as Community
    participant JR as JoinRequest
    participant N as Notification
    
    U->>C: POST /register { name, email, password, role: "user", communityCode }
    C->>C: Validate password strength
    C->>CM: Community.findOne({ code: communityCode.toUpperCase() })
    CM-->>C: Target community
    C->>U: User.create({...})
    U-->>C: New user (status: "pending")
    C->>JR: JoinRequest.create({ user, community })
    C->>N: Notify community owner
    C->>C: Create Session
    C-->>U: 201 { token, sessionId, user (pending) }
```

## Login Flow

### Email/Password Login

```mermaid
sequenceDiagram
    actor U as User
    participant C as userController
    participant DB as User Model
    
    U->>C: POST /login { email, password }
    C->>DB: User.findOne({ email }).select("+password")
    DB-->>C: User with hashed password
    C->>C: bcrypt.compare(password, user.password)
    alt Invalid credentials
        C-->>U: 401 Invalid credentials
    else 2FA Enabled
        C->>C: Generate preAuthToken (JWT with 2fa_pending)
        C-->>U: 200 { requiresTwoFactor: true, preAuthToken }
    else Success
        C->>C: Create Session (ua-parser-js)
        C->>C: Generate JWT
        C-->>U: 200 { token, sessionId, user }
    end
```

### Google OAuth Login

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend
    participant BE as userController
    participant GL as google-auth-library
    
    U->>FE: Click "Sign in with Google"
    FE->>FE: GSI Client displays popup
    U->>FE: Select Google account
    FE->>FE: Receive Google ID Token
    FE->>BE: POST /google-login { credential: idToken }
    BE->>GL: OAuth2Client.verifyIdToken({ idToken, clientId })
    GL-->>BE: { email, name, sub (googleId) }
    BE->>BE: Find user by googleId or email
    alt New user
        BE->>BE: User.create({ googleId, email, ... })
    end
    BE->>BE: Create Session
    BE->>BE: Generate JWT
    BE-->>U: 200 { token, sessionId, user }
```

## Two-Factor Authentication (2FA)

### Setup Flow

```mermaid
sequenceDiagram
    actor U as User
    participant C as userController
    participant S as speakeasy
    
    U->>C: POST /2fa/setup (authenticated)
    C->>S: speakeasy.generateSecret({ name: "SmartMeet" })
    S-->>C: { base32, otpauth_url }
    C->>C: Save user.twoFactorSecret = base32
    C->>C: Generate QR code from otpauth_url
    C-->>U: 200 { secret: base32, qrCode: dataUri }
```

### Verification Flow

```mermaid
sequenceDiagram
    actor U as User
    participant C as userController
    participant S as speakeasy
    
    U->>C: POST /2fa/verify { code } (authenticated)
    C->>S: speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: "base32", token: code })
    alt Valid code
        C->>C: user.twoFactorEnabled = true
        C-->>U: 200 { message: "2FA enabled" }
    else Invalid code
        C-->>U: 400 Invalid code
    end
```

### Login with 2FA

```mermaid
sequenceDiagram
    actor U as User
    participant C as userController
    
    U->>C: POST /login { email, password }
    C-->>U: 200 { requiresTwoFactor: true, preAuthToken }
    U->>C: POST /2fa/verify-login { code, preAuthToken }
    C->>C: jwt.verify(preAuthToken)
    C->>C: speakeasy.totp.verify({...})
    alt Valid
        C->>C: Create Session, Generate JWT
        C-->>U: 200 { token, sessionId, user }
    else Invalid
        C-->>U: 400 Invalid 2FA code
    end
```

## Password Reset

```mermaid
sequenceDiagram
    actor U as User
    participant C as userController
    participant M as User Model
    participant E as sendEmail
    
    U->>C: POST /forgot-password { email }
    C->>M: User.findOne({ email })
    alt User found
        C->>C: crypto.randomBytes(32) → resetToken
        C->>C: Hash token, store + 10min expiry
        C->>E: sendEmail({ to, subject: "Password Reset", html })
        E-->>U: Email with reset link
    end
    C-->>U: 200 Check your email
    
    U->>C: POST /reset-password/:token { password }
    C->>C: Hash token, find user with valid expiry
    C->>M: user.password = newPassword (pre-save hashes it)
    C->>C: Clear resetPasswordToken & resetPasswordExpire
    C-->>U: 200 Password reset successful
```

## Role-Based Access Control

### Middleware Chain

```javascript
router.get("/admin-only-route", protect, adminOnly, handler);
router.get("/multi-role", protect, authorizeRoles("admin", "manager"), handler);
```

### Protect Middleware (`authMiddleware.js`)

```
1. Extract token from Authorization header (Bearer <token>)
2. If no token → 401 { message: "Not authorized, no token" }
3. jwt.verify(token, JWT_SECRET)
4. If invalid → 401 { message: "Not authorized, token failed" }
5. User.findById(decoded.id)
6. If no user → 401 { message: "Not authorized, user not found" }
7. req.user = user
8. If decoded.sessionId → Session.findByIdAndUpdate(sessionId, { lastActive: now })
9. next()
```

### AdminOnly Middleware

```javascript
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required" });
  }
};
```

### Permission Matrix

| Endpoint Group | Auth Required | Admin Required | Notes |
|---|---|---|---|
| Register, Login, Google Login | No | No | Public endpoints |
| Forgot/Reset Password | No | No | Token-based access |
| User Profile (GET/PUT) | Yes | No | Own profile only |
| Change Password | Yes | No | Own password only |
| 2FA Setup/Verify/Disable | Yes | No | Own 2FA only |
| Sessions (List/Revoke) | Yes | No | Own sessions only |
| Notification Settings | Yes | No | Own settings only |
| Meetings (CRUD) | Yes | Varies | Host or community admin |
| Tasks (CRUD) | Yes | Varies | Admin sees all; member sees own |
| RAG Query | Yes | No | Authenticated users only |
| Join Requests (List) | Yes | Yes | |
| Join Requests (Approve/Reject) | Yes | Yes | |
| Community (Members/Stats) | Yes | Yes | |
| Community (Update Role/Remove) | Yes | Yes | |
| Invitation (Create) | Yes | Yes | |
| Dashboard (Stats/Chart/Insights) | Yes | No | Authenticated users only |
| Team Analytics | Yes | No | Scoped to user's visibility |
| Subscription (Get) | Yes | No | Own subscription only |

## Session Management

```mermaid
sequenceDiagram
    participant C as Client
    participant L as Login
    participant S as Session Collection
    
    C->>L: POST /login
    L->>L: Parse User-Agent via ua-parser-js
    L->>S: Session.create({ user, refreshToken, browser, os, device, ip })
    S-->>L: session document
    L-->>C: JWT (includes sessionId)
    
    Note over C,S: Later...
    
    C->>L: GET /sessions
    L->>S: Session.find({ user: req.user._id })
    S-->>L: All sessions
    L-->>C: 200 { sessions: [...] }
    
    C->>L: DELETE /sessions/:id
    L->>S: Session.findByIdAndDelete(id)
    L->>L: Socket emit "session:revoked"
    L-->>C: 200 Session revoked
```

## Security Best Practices Enforced

| Practice | Implementation |
|---|---|
| Password hashing | bcrypt, 12 salt rounds, pre-save hook |
| Password strength | Min 8 chars, must include lowercase, uppercase, number, special character |
| JWT secret | Environment variable, not hardcoded |
| Token expiry | Configurable via `JWT_EXPIRE` (default 7 days) |
| No raw user objects | `getPublicProfile()` strips password, refreshToken, 2FA secret |
| Email case normalization | All emails stored lowercase |
| Community code uppercase | Always stored and compared uppercase |
| Data isolation | Every query scoped to `req.user.community` |
| Ownership validation | Tasks, meetings, sessions verified before modification |
| MongoDB injection prevention | Mongoose sanitizes queries |
| CORS | Configured for frontend origin only |
| File upload validation | Multer handles multipart; no size limit (should be hardened) |
| User status gating | Pending/rejected users restricted to dashboard and settings |
| Socket authentication | JWT verified on every connection |
| Rate limiting | Not yet implemented (recommended addition) |

## Auth-Related Environment Variables

| Variable | Purpose |
|---|---|
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE` | Token expiration duration (default: `7d`) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for GSI verification |
| `FRONTEND_URL` | Frontend URL for CORS (default: `http://localhost:5173`) |
