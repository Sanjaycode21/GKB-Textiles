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
