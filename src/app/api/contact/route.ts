import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send notification to admin
    await resend.emails.send({
      from: 'Precision Detailing <contact@precisiondetailing.com>',
      to: 'admin@precisiondetailing.com',
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <h2>Contact Details</h2>
        <ul>
          <li>Name: ${name}</li>
          <li>Email: ${email}</li>
          <li>Phone: ${phone || 'Not provided'}</li>
        </ul>
        <h2>Message</h2>
        <p><strong>Subject:</strong> ${subject}</p>
        <p>${message}</p>
      `
    });

    // Send confirmation to user
    await resend.emails.send({
      from: 'Precision Detailing <contact@precisiondetailing.com>',
      to: email,
      subject: 'Thank you for contacting Precision Detailing',
      html: `
        <h1>Thank You for Contacting Us</h1>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to Precision Detailing. We have received your message and will get back to you shortly.</p>
        <h2>Your Message Details</h2>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p>If you have any immediate questions, please don't hesitate to call us at (408) 634-9181.</p>
        <p>Best regards,<br>The Precision Detailing Team</p>
      `
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 