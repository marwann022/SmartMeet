# SmartMeet — Email Service

## Overview

SmartMeet uses a **dual email system** for different purposes:

1. **Nodemailer + Gmail SMTP** — Simple transactional emails (password resets)
2. **Resend API** — Styled transactional emails (invitations, meeting summaries)

```mermaid
graph TB
    subgraph Triggers["Email Triggers"]
        T1[Forgot Password]
        T2[Invitation Created]
        T3[Meeting Processed<br/>(admin-hosted)]
    end

    subgraph Services["Email Services"]
        S1[sendEmail.js<br/>Nodemailer + Gmail SMTP]
        S2[emailService.js<br/>Resend API]
    end

    subgraph Providers["Providers"]
        P1[Gmail SMTP<br/>smtp.gmail.com:587]
        P2[Resend API<br/>api.resend.com]
    end

    subgraph Recipients["Recipients"]
        R1[User requesting password reset]
        R2[Invited user]
        R3[Community members]
    end

    T1 --> S1
    S1 --> P1
    P1 --> R1
    
    T2 --> S2
    S2 --> P2
    P2 --> R2
    
    T3 --> S2
    S2 --> P2
    P2 --> R3
```

## 1. Nodemailer (Password Reset)

**File:** `Back-end/src/utils/sendEmail.js`

```javascript
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.verify();       // Verify SMTP connection
  await transporter.sendMail({      // Send email
    from: `"SmartMeet" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
```

**Usage:** Only in `userController.forgotPassword`:
```javascript
const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
await sendEmail({
  to: user.email,
  subject: "SmartMeet Password Reset",
  html: `<a href="${resetUrl}">Reset Password</a><p>Link expires in 10 minutes.</p>`,
});
```

**Environment Variables:**
| Variable | Purpose |
|---|---|
| `EMAIL_USER` | Gmail address for SMTP authentication |
| `EMAIL_PASS` | Gmail app password (not regular password) |

**Security Notes:**
- Password reset links expire after 10 minutes
- Reset token is hashed before storage (not stored in plaintext)
- Link includes raw token in URL (hashed on comparison)
- Uses TLS (port 587)

## 2. Resend (Styled Emails)

**File:** `Back-end/src/services/emailService.js`

```javascript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
```

### sendInvitationEmail

```javascript
sendInvitationEmail({ to, fullName, communityName, role, invitationLink, expiresAt })
```

**HTML Template Features:**
- SmartMeet logo and branding
- Workspace name and assigned role
- Invitation expiry date
- CTA button: "Join Workspace"
- Professional, responsive design

### sendMeetingSummaryEmail

```javascript
sendMeetingSummaryEmail({ to, recipientName, meetingTitle, summaryText, decisions, tasks })
```

**HTML Template Features:**
- Recipient name personalization
- Meeting title header
- AI-generated summary section
- Key decisions list
- Action items / tasks list
- Link to view full meeting in archive

**Environment Variables:**
| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Resend API key for authentication |
| `EMAIL_FROM` | Sender email address (configured in Resend) |
| `FRONTEND_URL` | Base URL for links in email templates |

## Email Trigger Matrix

| Event | Service | Recipient | Template |
|---|---|---|---|
| Password reset | Nodemailer | User requesting reset | Plain HTML link |
| Invitation created | Resend | Invited user | Full branded HTML |
| Meeting processed (admin-hosted) | Resend | All active community members | Summary + decisions + tasks |

## Email Design Decisions

| Decision | Rationale |
|---|---|
| **Dual email system** | Nodemailer+Gmail is free and sufficient for password resets (low volume, simple content). Resend provides better deliverability, analytics, and HTML template support for high-volume transactional emails. |
| **Gmail SMTP** | Universally available, no additional setup cost. Requires an "App Password" for non-interactive use. |
| **Resend over SendGrid** | Modern API, better developer experience, built-in React email support for future iterations. |
| **No email queue** | Current volume is low enough for synchronous sending. For production scale, add a job queue (Bull/BullMQ) for async email processing. |
| **verification on each send** | `transporter.verify()` is called before every email — adds reliability at the cost of one extra SMTP round trip per email. |

## Environment Configuration

```bash
# Nodemailer (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=notifications@smartmeet.app

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173
```
