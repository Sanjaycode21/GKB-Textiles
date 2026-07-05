import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

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

    // Insert into database
    const contact = await prisma.contact.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    // Send email notification (if RESEND_API_KEY is configured)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'GKB Textiles Contact Form <onboarding@resend.dev>';
        const toEmail = process.env.RESEND_TO_EMAIL || 'gkbtextiles@gmail.com';
        
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [toEmail],
            subject: `New Website Inquiry: ${subject.trim()}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 25px; color: #333; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 20px;">
                  <h2 style="color: #1e3a8a; margin: 0; font-size: 22px;">New Contact Form Submission</h2>
                  <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Received on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
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
                  <p style="margin: 4px 0 0 0;">Manage your inquiries at <a href="https://gkb-textiles-mu.vercel.app/admin/contacts" style="color: #2563eb; text-decoration: none;">Admin Console</a>.</p>
                </div>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
      }
    } else {
      console.warn('RESEND_API_KEY is not defined. Skipping email notification.');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Inquiry saved successfully!', 
      data: { id: contact.id } 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving contact inquiry:', error);
    return NextResponse.json({ 
      error: 'An internal server error occurred. Please try again later.' 
    }, { status: 500 });
  }
}
