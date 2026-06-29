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

  console.log("RESEND SEND STARTED: from=SmartMeet <onboarding@resend.dev>, to=" + to);

  let result;
  try {
    result = await resend.emails.send({
      from: "SmartMeet <onboarding@resend.dev>",
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
