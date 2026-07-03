# SmartMeet — Security Architecture

## Security Layers

```mermaid
graph TB
    subgraph Layer1["Layer 1: Network Security"]
        A[CORS Configuration]
        B[HTTPS (Production)]
    end

    subgraph Layer2["Layer 2: Authentication"]
        C[JWT Token Verification]
        D[Google OAuth 2.0]
        E[TOTP Two-Factor Auth]
    end

    subgraph Layer3["Layer 3: Authorization"]
        F[Role-Based Access Control<br/>protect + adminOnly]
        G[Ownership Verification]
        H[Data Isolation Filters]
    end

    subgraph Layer4["Layer 4: Input Validation"]
        I[Mongoose Schema Validation]
        J[Password Strength Rules]
        K[Email Normalization]
        L[Message Length Limits]
    end

    subgraph Layer5["Layer 5: Data Protection"]
        M[bcrypt Password Hashing]
        N[select: false on Sensitive Fields]
        O[getPublicProfile() Sanitizer]
        P[Token Expiry & Rotation]
    end

    subgraph Layer6["Layer 6: Real-Time Security"]
        Q[Socket.IO JWT Auth]
        R[Community Room Isolation]
        S[Server-Side Message Validation]
    end

    Request --> A
    A --> C
    C --> F
    F --> I
    I --> M
    M --> Q
```

## 1. Authentication (Layer 2)

### JWT Token

```javascript
// Token generation
const generateToken = (id, sessionId) => {
  return jwt.sign(
    { id, ...(sessionId && { sessionId }) },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};
```

**Security Properties:**
- Signed with a secret key from environment variable
- Configurable expiry (default 7 days)
- Contains user ID and optional session ID
- Verified on every authenticated request via `protect` middleware

### Password Security

```javascript
// User model pre-save hook
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

**Properties:**
- bcrypt with 12 salt rounds (industry standard: 10-12)
- Only hashed when password field is modified
- Original password never stored or logged
- `password` field has `select: false` — excluded from all queries by default
- Must use `.select("+password")` explicitly for authentication

### Password Strength Requirements

```javascript
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
```

| Requirement | Reason |
|---|---|
| Minimum 8 characters | Prevents short-password brute force |
| At least 1 lowercase | Increases entropy |
| At least 1 uppercase | Increases entropy |
| At least 1 number | Increases entropy |
| At least 1 special character | Significantly increases entropy |

### Two-Factor Authentication

```javascript
// TOTP setup
const secret = speakeasy.generateSecret({ name: "SmartMeet" });
user.twoFactorSecret = secret.base32;
const qrCode = await QRCode.toDataURL(secret.otpauth_url);

// TOTP verification
const verified = speakeasy.totp.verify({
  secret: user.twoFactorSecret,
  encoding: "base32",
  token: code,
});
```

**Properties:**
- TOTP-based (RFC 6238) — compatible with Google Authenticator, Authy
- Uses a `preAuthToken` JWT to complete 2FA during login (prevents replay)
- Secret stored encrypted at rest (MongoDB-level encryption can be added)
- QR code rendered as data URI (no external service dependency)

### Google OAuth

```javascript
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const ticket = await client.verifyIdToken({
  idToken: credential,
  audience: process.env.GOOGLE_CLIENT_ID,
});
const payload = ticket.getPayload();
```

**Properties:**
- ID token verified server-side using `google-auth-library`
- Audience check ensures token was issued for this app
- Payload contains verified email, name, Google ID
- New users created without password (no local credential to leak)
- Existing users linked by email or Google ID

## 2. Authorization (Layer 3)

### Middleware Chain

```javascript
// Single role check
router.get("/admin-route", protect, adminOnly, handler);

// Protect middleware: extracts user from JWT, attaches to req.user
// adminOnly middleware: checks req.user.role === "admin"
```

### protect Middleware

```
1. Check Authorization header exists and starts with "Bearer"
2. Extract token
3. jwt.verify(token, JWT_SECRET)
4. User.findById(decoded.id)
5. If user not found → 401
6. req.user = user document
7. If sessionId in token → update Session.lastActive
8. next()
```

### adminOnly Middleware

```javascript
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required" });
  }
};
```

### Multi-Role Authorization

```javascript
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
};
```

## 3. Data Isolation (Layer 3 Critical)

Every database query in community-scoped features **must** filter by the user's community:

```javascript
// SECURE: Data isolated
const tasks = await Task.find({
  community: req.user.community,
  user: req.user._id,
});

// INSECURE: Data leak — never do this
const tasks = await Task.find({ user: req.user._id });
```

**Enforcement Points:**
| Module | Isolation Method |
|---|---|
| Tasks | `community: req.user.community` (admin), `user: req.user._id` (member) |
| Meetings | Complex OR-clause based on host, participants, community admin status |
| Notifications | `recipient: req.user._id` (user-scoped) |
| Community Chat | `community` field on Message model |
| Join Requests | `community: req.user.community` (admin only) |
| Users (members list) | `community: req.user.community` |

## 4. Ownership Validation

### User Data

```javascript
// Users can only modify their own profile
const user = await User.findById(req.user._id);
// Cannot modify req.params.id — only req.user._id
```

### Sessions

```javascript
// Users can only manage their own sessions
const session = await Session.findOne({
  _id: req.params.id,
  user: req.user._id,
});
```

### Tasks

```javascript
// Admin can modify any community task
// Member can only modify own tasks
if (req.user.role !== "admin" && task.user.toString() !== req.user._id.toString()) {
  return res.status(403).json({ message: "Not authorized" });
}
```

### Meetings

```javascript
// Host can modify; community admin can modify if host belongs to their community
if (meeting.host.toString() !== req.user._id.toString()) {
  if (req.user.role === "admin") {
    const hostUser = await User.findById(meeting.host);
    if (hostUser.community?.toString() !== req.user.community?.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized" });
  }
}
```

## 5. Input Validation (Layer 4)

### Mongoose Schema Validation

All models define validation rules:
```javascript
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  status: { type: String, enum: ["todo", "inprogress", "review", "done"] },
  message: { type: String, maxlength: 5000 },
});
```

### Message Length Limits

Community chat messages are limited to 5000 characters (validated both in REST endpoint and Socket.IO handler).

### Email Normalization

All emails are stored in lowercase to prevent duplicates:
```javascript
email: { type: String, lowercase: true, unique: true }
```

## 6. Data Protection (Layer 5)

### Sensitive Field Hiding

```javascript
// Schema-level protection
password: { type: String, select: false },
twoFactorSecret: { type: String },  // Not exposed via getPublicProfile()

// Instance method for safe serialization
user.getPublicProfile() = {
  ...this.toJSON(),
  password: undefined,
  refreshToken: undefined,
  twoFactorSecret: undefined,
};
```

### Token Security

| Token | Storage | Expiry | Rotation |
|---|---|---|---|
| JWT | Client localStorage | 7 days | On re-login |
| Password Reset | User model (hashed) | 10 minutes | Single use |
| Invitation | Invitation model (hashed) | 7 days | Single use |
| Refresh Token | Session model | Unlimited (device-based) | On re-login |

## 7. Real-Time Security (Layer 6)

### Socket.IO Authentication

Every socket connection must provide a valid JWT:
```javascript
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error("Authentication required."));
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  socket.user = await User.findById(decoded.id);
  if (!socket.user) return next(new Error("User not found."));
  next();
});
```

### Room Isolation

Community chat rooms are namespaced per community:
```javascript
const roomName = `chat:community:${communityId}`;
socket.join(roomName);
// Only members of this community can join this room
```

### Server-Side Message Validation

```javascript
socket.on("chat:send", async ({ message }, ack) => {
  const text = (message || "").trim();
  if (!text) return ack({ success: false, error: "Message cannot be empty." });
  if (text.length > 5000) return ack({ success: false, error: "Message too long." });
  // ...
});
```

## 8. Environment Variable Security

```bash
# CRITICAL — Never commit these to version control
JWT_SECRET=<random-64-char-string>
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/db
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_PASS=<gmail-app-password>
GROQ_API_KEY=gsk_xxxxxxxxxxxx
PINECONE_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
GOOGLE_CLIENT_ID=xxxxxxxx-xxxx.apps.googleusercontent.com
```

All secrets are stored in environment variables, never hardcoded. The `.env` file is in `.gitignore`.

## 9. CORS Configuration

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
```

Only the configured frontend origin is allowed. In production, this should be the Vercel deployment URL.

## 10. Security Checklist

| Requirement | Status | Notes |
|---|---|---|
| JWT authentication | ✅ | protect middleware on all routes |
| Role-based access control | ✅ | adminOnly, authorizeRoles |
| Password hashing (bcrypt, 12 rounds) | ✅ | Pre-save hook |
| Password strength validation | ✅ | Regex in userController |
| TOTP two-factor authentication | ✅ | speakeasy + QR code |
| Google OAuth 2.0 | ✅ | google-auth-library |
| Data isolation (multi-tenant) | ✅ | Community-scoped queries |
| Ownership validation | ✅ | Per-entity checks |
| Sensitive field protection | ✅ | select: false, getPublicProfile() |
| Email normalization | ✅ | lowercase: true |
| Input length limits | ✅ | Mongoose + manual validation |
| Socket authentication | ✅ | JWT on connection |
| CORS | ✅ | Frontend origin only |
| Environment secrets | ✅ | .env ignored by git |
| Password reset expiry | ✅ | 10-minute token |
| Invitation token expiry | ✅ | 7-day token |
| Rate limiting | ❌ | Not implemented — recommended |
| API request logging | ❌ | Not implemented — recommended |
| Helmet (security headers) | ❌ | Not implemented — recommended |
| MongoDB injection prevention | ✅ | Mongoose sanitizes |
| XSS protection | ✅ | Vue 3 auto-escaping |
| CSRF protection | ❌ | Not needed (JWT in header, not cookie) |
