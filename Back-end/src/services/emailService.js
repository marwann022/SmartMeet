import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const buildInvitationEmail = ({
  fullName,
  communityName,
  role,
  invitationLink,
  expiresAt,
}) => {
  const displayRole = role === "admin" ? "Admin" : "Member";
  const expiryDate = new Date(expiresAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're invited to join ${communityName} on SmartMeet</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6fb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6fb;padding:40px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header gradient bar -->
          <tr>
            <td style="background:linear-gradient(135deg,#4b68ff 0%,#7c3aed 100%);padding:36px 40px 32px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.65);">SmartMeet</p>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.25;">You've Been Invited</h1>
              <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.80);line-height:1.5;">
                Join <strong>${communityName}</strong> on SmartMeet
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 0;">

              <!-- Greeting -->
              <p style="margin:0 0 20px;font-size:15px;color:#1e293b;line-height:1.6;">
                Hi <strong>${fullName}</strong>,
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#475569;line-height:1.7;">
                You've been invited to join the <strong>${communityName}</strong> workspace on SmartMeet.
                Click the button below to create your account and get started.
              </p>

              <!-- Invite details pill row -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:4px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f8faff;border:1px solid #e2e8f0;border-radius:12px;padding:0;">
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Workspace</span><br/>
                          <span style="font-size:14px;font-weight:600;color:#1e293b;">${communityName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 20px;border-bottom:1px solid #e2e8f0;">
                          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Your Role</span><br/>
                          <span style="font-size:14px;font-weight:600;color:#1e293b;">${displayRole}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:16px 20px;">
                          <span style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#94a3b8;">Invitation Expires</span><br/>
                          <span style="font-size:14px;font-weight:600;color:#1e293b;">${expiryDate}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a
                      href="${invitationLink}"
                      style="display:inline-block;background:linear-gradient(135deg,#4b68ff 0%,#7c3aed 100%);color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;letter-spacing:0.5px;padding:16px 48px;border-radius:12px;box-shadow:0 4px 16px rgba(75,104,255,0.35);"
                    >
                      Join Workspace
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0 0 28px;font-size:12px;color:#94a3b8;line-height:1.6;text-align:center;">
                If the button doesn't work, paste this link into your browser:<br/>
                <a href="${invitationLink}" style="color:#4b68ff;word-break:break-all;text-decoration:none;">${invitationLink}</a>
              </p>

              <!-- Security note -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:14px 16px;">
                    <p style="margin:0;font-size:12px;color:#92400e;line-height:1.6;">
                      &#x26A0;&#xFE0F;&nbsp; This invitation is personal and single-use. Do not share this link.
                      It expires on <strong>${expiryDate}</strong>.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 32px;border-top:1px solid #f1f5f9;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;color:#94a3b8;">
                You received this email because an admin of <strong>${communityName}</strong> invited you to SmartMeet.
              </p>
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                &copy; ${new Date().getFullYear()} SmartMeet AI Inc. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>`;
};

export const sendInvitationEmail = async ({
  to,
  fullName,
  communityName,
  role,
  invitationLink,
  expiresAt,
}) => {
  console.log("EMAIL SERVICE CALLED: to=" + to + ", community=" + communityName);

  const html = buildInvitationEmail({
    fullName,
    communityName,
    role,
    invitationLink,
    expiresAt,
  });

  const fromAddress = process.env.EMAIL_FROM || "SmartMeet <onboarding@resend.dev>";
  console.log("RESEND SEND STARTED: from=" + fromAddress + ", to=" + to);

  let result;
  try {
    result = await resend.emails.send({
      from: fromAddress,
      to,
      subject: `You've been invited to join ${communityName} on SmartMeet`,
      html,
    });
  } catch (sendError) {
    console.error("RESEND SDK THREW AN EXCEPTION:");
    console.error("  name:", sendError.name);
    console.error("  message:", sendError.message);
    console.error("  stack:", sendError.stack);
    throw new Error("Resend API call failed: " + sendError.message);
  }

  const { data, error, headers } = result;

  if (error) {
    console.error("RESEND RETURNED AN ERROR:");
    console.error("  error:", JSON.stringify(error, null, 2));
    console.error("  error.name:", error.name);
    console.error("  error.message:", error.message);
    throw new Error("Resend email send failed: " + error.message);
  }

  console.log("RESEND SEND SUCCESS: id=" + (data?.id || "unknown") + ", to=" + to);
  console.log("RESEND FULL RESPONSE: " + JSON.stringify(result));
  console.log("RESEND RESPONSE HEADERS: " + JSON.stringify(headers));
};

export const sendMeetingSummaryEmail = async ({
  to,
  recipientName,
  meetingTitle,
  summaryText,
  decisions = [],
  tasks = []
}) => {
  const fromAddress = process.env.EMAIL_FROM || "SmartMeet <onboarding@resend.dev>";
  
  const decisionsHtml = decisions.length > 0 
    ? `<ul style="padding-left:20px;margin:10px 0;color:#334155;">` + 
      decisions.map(d => `<li style="margin-bottom:8px;line-height:1.5;">${d.text || d}</li>`).join("") + 
      `</ul>`
    : `<p style="color:#64748b;font-style:italic;margin:10px 0;">No key decisions were recorded during this session.</p>`;

  const tasksHtml = tasks.length > 0
    ? `<ul style="padding-left:20px;margin:10px 0;color:#334155;">` +
      tasks.map(t => `<li style="margin-bottom:8px;line-height:1.5;"><strong>${t.title}</strong> - Assigned to: <em>${t.assignee}</em></li>`).join("") +
      `</ul>`
    : `<p style="color:#64748b;font-style:italic;margin:10px 0;">No action items were assigned.</p>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Meeting Summary: ${meetingTitle}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6fb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6fb;padding:40px 16px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.06);border:1px border-black/5;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4b68ff 0%,#7c3aed 100%);padding:40px;text-align:left;color:#ffffff;">
              <p style="margin:0 0 6px 0;font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.7);">Meeting Recap</p>
              <h1 style="margin:0;font-size:28px;font-weight:800;line-height:1.2;color:#ffffff;">${meetingTitle}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;text-align:left;">
              <p style="margin:0 0 20px 0;font-size:16px;color:#1e293b;line-height:1.5;">
                Hello <strong>${recipientName}</strong>,
              </p>
              <p style="margin:0 0 24px 0;font-size:14px;color:#334155;line-height:1.6;">
                The meeting has ended and the AI summary report is ready. Below is a recap of the discussion, decisions, and action items:
              </p>

              <!-- Summary Card -->
              <div style="background-color:#f8fafc;border-left:4px solid #4b68ff;padding:20px;border-radius:0 12px 12px 0;margin-bottom:28px;">
                <h3 style="margin:0 0 10px 0;font-size:14px;font-weight:800;color:#1e293b;text-transform:uppercase;letter-spacing:1px;">Executive Summary</h3>
                <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">${summaryText}</p>
              </div>

              <!-- Decisions Section -->
              <h3 style="margin:0 0 8px 0;font-size:15px;font-weight:800;color:#1e293b;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">Key Decisions</h3>
              ${decisionsHtml}
              <div style="height:20px;"></div>

              <!-- Tasks Section -->
              <h3 style="margin:0 0 8px 0;font-size:15px;font-weight:800;color:#1e293b;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">Action Items</h3>
              ${tasksHtml}
              
              <div style="height:32px;"></div>

              <!-- CTA Button -->
              <div style="text-align:center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/archive" style="display:inline-block;background-color:#4b68ff;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 30px;border-radius:12px;box-shadow:0 4px 12px rgba(75,104,255,0.25);transition:background-color 0.2s;">
                  View Meeting Archive
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:24px 40px;text-align:center;font-size:12px;color:#64748b;border-top:1px solid #f1f5f9;">
              This is an automated notification from SmartMeet AI Companion.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;

  try {
    await resend.emails.send({
      from: fromAddress,
      to,
      subject: `Summary Report: ${meetingTitle}`,
      html,
    });
    console.log(`[Resend] Successfully sent meeting summary email to ${to}`);
  } catch (err) {
    console.error(`[Resend] Failed to send meeting summary email to ${to}:`, err.message);
  }
};
