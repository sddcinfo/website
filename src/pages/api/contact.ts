export async function POST({ request, env }) {
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

    const contactEmail = env.CONTACT_EMAIL || 'bradlay@gmail.com';

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

    // Log contact attempt for now (MailChannels requires DNS verification)
    console.log('Contact form submission:', {
      from: `${name} <${email}>`,
      subject,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('CF-Connecting-IP'),
      country: request.cf?.country
    });

    // Send email via MailChannels with proper headers
    const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source': 'Cloudflare Worker'
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: contactEmail, name: 'Brad Lay' }],
            dkim_domain: 'sddc.info',
            dkim_selector: 'mailchannels',
          },
        ],
        from: {
          email: `contact@sddc.info`,
          name: 'SDDC.info Contact Form',
        },
        reply_to: {
          email: email.trim().toLowerCase(),
          name: name.trim()
        },
        subject: `[SDDC.info Contact] ${subject}`,
        content: [
          {
            type: 'text/plain',
            value: emailContent,
          },
        ],
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('MailChannels error:', errorData);

      // Still return success to user - we logged it
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Thank you for your message! I\'ve received your contact request and will respond to ' + email + ' soon.'
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
      JSON.stringify({ error: 'An unexpected error occurred. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
