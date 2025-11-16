import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext';

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

    // Use Cloudflare's native email service
    const fromAddress = 'noreply@sddc.info';
    const toAddress = contactEmail;

    // Log contact attempt
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    console.log('Contact form submission:', {
      from: `${name} <${email}>`,
      subject,
      timestamp: new Date().toISOString(),
      ip: clientIP,
      country: request.cf?.country || 'unknown'
    });

    // Create MIME message
    const msg = createMimeMessage();
    msg.setSender({ name: 'SDDC.info Contact Form', addr: fromAddress });
    msg.setRecipient(toAddress);
    msg.setHeader('Reply-To', new Mailbox(email, name));
    msg.setSubject(`[SDDC.info Contact] ${subject}`);

    // Add technical metadata as headers
    msg.setHeader('X-Client-IP', clientIP);
    msg.setHeader('X-User-Agent', request.headers.get('User-Agent') || 'unknown');
    msg.setHeader('X-Form-Timestamp', new Date().toISOString());
    msg.setHeader('X-Form-Source', 'SDDC.info Contact Form');
    msg.setHeader('X-Original-Email', email);
    msg.setHeader('X-Form-Name', name);
    msg.setHeader('X-Country', request.cf?.country || 'unknown');

    // HTML email body
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .header h2 { margin: 0; color: white; }
        .header p { margin: 5px 0 0 0; color: #dbeafe; }
        .content { background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #374151; display: block; margin-bottom: 5px; }
        .value { color: #1f2937; }
        .message-box { background-color: #f3f4f6; padding: 15px; border-left: 4px solid #3b82f6; margin-top: 15px; border-radius: 4px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Contact Form Inquiry</h2>
        <p>Received from SDDC.info website</p>
    </div>

    <div class="content">
        <div class="field">
            <span class="label">From:</span>
            <span class="value">${name}</span>
        </div>

        <div class="field">
            <span class="label">Email:</span>
            <span class="value"><a href="mailto:${email}">${email}</a></span>
        </div>

        <div class="field">
            <span class="label">Subject:</span>
            <span class="value">${subject}</span>
        </div>

        <div class="message-box">
            <span class="label">Message:</span>
            <div style="margin-top: 10px; white-space: pre-wrap;">${message}</div>
        </div>
    </div>

    <div class="footer">
        <p>Click "Reply" to respond directly to ${name}</p>
        <p style="color: #9ca3af;">Sent via SDDC.info Contact Form • ${new Date().toISOString()}</p>
    </div>
</body>
</html>`;

    // Plain text version
    const textBody = `
New Contact Form Inquiry from SDDC.info

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
Click "Reply" to respond directly to ${name}

Sent via SDDC.info Contact Form
${new Date().toISOString()}
    `.trim();

    // Add both HTML and plain text versions
    msg.addMessage({
      contentType: 'text/plain',
      data: textBody
    });

    msg.addMessage({
      contentType: 'text/html',
      data: htmlBody
    });

    // Send via Cloudflare Email Service
    const emailMessage = new EmailMessage(fromAddress, toAddress, msg.asRaw());
    await env.EMAIL.send(emailMessage);

    console.log('Email sent successfully via Cloudflare Email Service');

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
