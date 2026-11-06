import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, phone, subject, message } = body;

    // Server-side validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return NextResponse.json({ error: 'Subject is required.' }, { status: 400 });
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    // 1. Attempt Database Insertion (Graceful fallback if database is paused or unreachable)
    let contactId: number | null = null;
    let dbSaved = false;

    try {
      const contact = await prisma.contact.create({
        data: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : null,
          subject: subject.trim(),
          message: message.trim(),
        },
      });
      contactId = contact.id;
      dbSaved = true;
      console.log(`[Contact API] Inquiry successfully saved to database with ID: ${contact.id}`);
    } catch (dbError: any) {
      console.error('[Contact API] Failed to save inquiry to database (Database may be paused or unreachable):', dbError?.message || dbError);
    }

    // 2. Send email notification (either SMTP/Gmail or Resend)
    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const targetRecipient = process.env.RESEND_TO_EMAIL || process.env.SMTP_TO || 'gkbbalu@gmail.com';
    let emailSent = false;

    // Dynamic public logo URL resolution
    const host = request.headers.get('host') || 'gkbtextiles.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const logoUrl = `${protocol}://${host}/images/logo-transparent.png`;

    const emailSubject = `New Website Inquiry: ${subject.trim()}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="margin-bottom: 20px; text-align: left;">
          <img src="${logoUrl}" alt="GKB Textiles Logo" width="160" style="display: block; border: 0; max-width: 160px; height: auto;" />
        </div>
        <div style="border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="color: #1e3a8a; margin: 0; font-size: 22px;">New Contact Form Submission</h2>
          <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Received on ${new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} IST</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; width: 130px; color: #475569; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Name:</td>
            <td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;">${fullName.trim()}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Email:</td>
            <td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;"><a href="mailto:${email.trim()}" style="color: #2563eb; text-decoration: none;">${email.trim().toLowerCase()}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Phone:</td>
            <td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;">${phone ? phone.trim() : '<em>Not provided</em>'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #475569; border-bottom: 1px solid #f1f5f9; vertical-align: top;">Subject:</td>
            <td style="padding: 10px 0; color: #0f172a; border-bottom: 1px solid #f1f5f9; vertical-align: top;">${subject.trim()}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #475569; vertical-align: top;">Message:</td>
            <td style="padding: 10px 0; color: #0f172a; line-height: 1.6; white-space: pre-wrap; vertical-align: top;">${message.trim()}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #94a3b8; text-align: center;">
          <p style="margin: 0;">This is an automated notification from your GKB Textiles website.</p>
          <p style="margin: 4px 0 0 0;">Manage your inquiries at <a href="https://gkbtextiles.vercel.app/admin/contacts" style="color: #2563eb; text-decoration: none;">Admin Console</a>.</p>
        </div>
      </div>
    `;

    // A. Try SMTP/Gmail if SMTP credentials are provided
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
          from: `"GKB Textiles Website" <${smtpUser}>`,
          to: targetRecipient,
          subject: emailSubject,
          html: emailHtml,
        });
        emailSent = true;
        console.log('[Contact API] SMTP email notification sent successfully to:', targetRecipient);
      } catch (smtpError) {
        console.error('[Contact API] Failed to send SMTP email notification:', smtpError);
      }
    }
    // B. Fallback to Resend API if RESEND_API_KEY is provided
    else if (resendApiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'GKB Textiles Contact Form <onboarding@resend.dev>';
        
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [targetRecipient],
            subject: emailSubject,
            html: emailHtml,
          }),
        });

        if (response.ok) {
          emailSent = true;
          console.log('[Contact API] Resend email notification sent successfully to:', targetRecipient);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.warn('[Contact API] Resend dispatch to target recipient returned status:', response.status, errorData);

          // If Resend rejected because of domain verification restriction (testing domain can only send to account owner email)
          if (response.status === 403 && errorData?.message?.includes('testing emails')) {
            const fallbackEmail = 'sanjaycode21@gmail.com';
            console.log(`[Contact API] Attempting fallback to verified account email (${fallbackEmail})...`);
            
            const fallbackRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`,
              },
              body: JSON.stringify({
                from: fromEmail,
                to: [fallbackEmail],
                subject: `[FORWARDED TO OWNER] ${emailSubject}`,
                html: `
                  <div style="background-color: #fef2f2; border: 1px solid #f87171; padding: 12px; border-radius: 6px; margin-bottom: 16px; font-size: 13px; color: #991b1b;">
                    <strong>Notice:</strong> This inquiry was routed to your verified Resend email because sandbox mode only permits sending to account owners. To deliver directly to <code>${targetRecipient}</code>, add and verify your custom domain in the Resend dashboard.
                  </div>
                  ${emailHtml}
                `,
              }),
            });

            if (fallbackRes.ok) {
              emailSent = true;
              console.log('[Contact API] Fallback inquiry notification dispatched successfully to:', fallbackEmail);
            }
          }
        }
      } catch (resendError) {
        console.error('[Contact API] Failed to send Resend email notification:', resendError);
      }
    }

    // 3. Evaluate Result: If EITHER the database saved OR an email notification was dispatched, succeed
    if (dbSaved || emailSent) {
      return NextResponse.json({ 
        success: true, 
        message: 'Inquiry received successfully! Our team will get back to you shortly.', 
        data: { id: contactId, savedToDatabase: dbSaved, emailNotified: emailSent } 
      }, { status: 200 });
    }

    // 4. If both DB and email failed completely, return a clear actionable error
    return NextResponse.json({ 
      error: 'Our messaging server is currently experiencing high load. Please connect with us directly via WhatsApp or phone.' 
    }, { status: 500 });

  } catch (error: any) {
    console.error('Error saving contact inquiry:', error);
    return NextResponse.json({ 
      error: 'An internal server error occurred. Please try again later.' 
    }, { status: 500 });
  }
}
