import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email notification using either Resend API or SMTP (Nodemailer),
 * consistent with the website's contact form configuration.
 */
export async function sendAdminEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;

  // 1. Try Resend if configured
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'GKB Textiles Security <onboarding@resend.dev>',
          to: [to],
          subject,
          html,
        }),
      });

      if (res.ok) {
        return true;
      }
      console.warn('Resend API failed, falling back to SMTP if available.');
    } catch (err) {
      console.error('Error with Resend API:', err);
    }
  }

  // 2. Try SMTP / Gmail if configured
  if (smtpUser && smtpPassword) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });

      await transporter.sendMail({
        from: `"GKB Textiles Admin" <${smtpUser}>`,
        to,
        subject,
        html,
      });

      return true;
    } catch (err) {
      console.error('Error sending email via SMTP:', err);
    }
  }

  console.warn(`[DEV LOG] Email to ${to} was not dispatched (no active email provider credentials). Subject: ${subject}`);
  return false;
}

export function getInvitationEmailHtml(inviteUrl: string, name: string, role: string): string {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f8fafc; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #0b2447; margin: 0; font-size: 24px;">GKB Textiles</h2>
        <p style="color: #64748b; margin-top: 5px; font-size: 14px;">Administrator Portal Invitation</p>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 0;">Hello ${name},</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          You have been invited to join the <strong>GKB Textiles</strong> Administrator Dashboard as a <strong>${role}</strong>.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${inviteUrl}" style="background-color: #0b2447; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
            Accept Invitation &amp; Set Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 0;">
          This invitation link expires in 48 hours. If you were not expecting this invitation, you can safely ignore this email.
        </p>
      </div>
    </div>
  `;
}

export function getPasswordResetEmailHtml(resetUrl: string, name: string): string {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f8fafc; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #0b2447; margin: 0; font-size: 24px;">GKB Textiles</h2>
        <p style="color: #64748b; margin-top: 5px; font-size: 14px;">Password Reset Request</p>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 0;">Hello ${name},</p>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">
          We received a request to reset your password for the GKB Textiles Administrator Portal.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #0b2447; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
            Reset My Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-bottom: 0;">
          This link will expire in 1 hour. If you did not request a password reset, please contact your Super Administrator immediately.
        </p>
      </div>
    </div>
  `;
}

export function getTwoFactorEmailHtml(code: string, name: string): string {
  return `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #f8fafc; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #0b2447; margin: 0; font-size: 24px;">GKB Textiles</h2>
        <p style="color: #64748b; margin-top: 5px; font-size: 14px;">Two-Factor Authentication</p>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0; text-align: center;">
        <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 0;">Hello ${name},</p>
        <p style="color: #334155; font-size: 15px;">Your verification code to complete sign in is:</p>
        <div style="font-size: 32px; font-weight: 700; letter-spacing: 6px; color: #0b2447; background: #f1f5f9; padding: 15px 25px; border-radius: 8px; display: inline-block; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #64748b; font-size: 13px;">This code is valid for 10 minutes. Never share this code with anyone.</p>
      </div>
    </div>
  `;
}

