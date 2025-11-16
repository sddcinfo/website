import { Resend } from 'resend';

export async function POST({ request, locals }) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate message length
    if (message.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Message is too long (max 5000 characters)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Access environment variables via Cloudflare runtime
    const env = locals.runtime.env;
    const contactEmail = env.CONTACT_EMAIL || 'bradlay@gmail.com';
    const resendApiKey = env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured. Please contact the administrator.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Prepare email content with metadata
    const emailContent = `
New Contact Form Submission from SDDC.info

From: ${name.trim()}
Email: ${email.trim().toLowerCase()}
Subject: ${subject}

Message:
${message.trim()}

---
Sent from sddc.info contact form
Timestamp: ${new Date().toISOString()}
IP: ${request.headers.get('CF-Connecting-IP') || 'unknown'}
Country: ${request.cf?.country || 'unknown'}
    `.trim();

    // Log contact attempt
    console.log('Contact form submission:', {
      from: `${name} <${email}>`,
      subject,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP'),
      country: request.cf?.country
    });

    // Send email via Resend
    const resend = new Resend(resendApiKey);
    const { data, error } = await resend.emails.send({
      from: 'SDDC.info Contact <contact@sddc.info>',
      to: contactEmail,
      replyTo: email.trim().toLowerCase(),
      subject: `[SDDC.info Contact] ${subject}`,
      text: emailContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email. Please try again later.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Email sent successfully via Resend:', data);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred. Please try again later.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
