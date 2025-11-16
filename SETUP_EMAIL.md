# Contact Form Email Setup

MailChannels shut down on August 31, 2024. This site now uses **Resend** for email delivery.

## Quick Setup (5 minutes)

### 1. Create Resend Account
- Go to https://resend.com and sign up (free)
- Verify your email

### 2. Add Domain to Resend
- In Resend dashboard, go to **Domains**
- Click **Add Domain**
- Enter: `sddc.info`
- Select your region
- Click **Add**

### 3. Configure DNS Records in Cloudflare
Resend will show you DNS records to add. Go to your Cloudflare dashboard:

1. Select `sddc.info` domain
2. Go to **DNS** > **Records**
3. Add each TXT record from Resend (usually 3-4 records):
   - SPF record
   - DKIM records (usually 3)
   - Set **Proxy status** to **DNS only** (gray cloud icon)

### 4. Verify Domain in Resend
- Return to Resend dashboard
- Click **Verify DNS Records**
- Wait for green checkmarks

### 5. Get API Key
- In Resend, go to **API Keys**
- Click **Create API Key**
- Name it: "SDDC Contact Form"
- Permission: **Sending access**
- Click **Add**
- **COPY THE KEY** - you won't see it again!

### 6. Configure Worker Secrets
```bash
cd /path/to/website
npx wrangler secret put RESEND_API_KEY
# Paste your Resend API key when prompted

npx wrangler secret put CONTACT_EMAIL
# Enter: bradlay@gmail.com
```

### 7. Deploy
```bash
npm run build
npx wrangler deploy
```

## Test It
Go to https://sddc.info/contact and submit a test message!

## Troubleshooting

**DNS not verifying?**
- DNS can take up to 24 hours (usually 5-10 minutes)
- Make sure records are **DNS only** (not proxied)
- Double-check record names and values match exactly

**Still getting errors?**
```bash
# Check if secrets are set
npx wrangler secret list

# View live logs
npx wrangler tail
```

## Free Tier Limits
- **3,000 emails/month** free
- More than enough for a contact form
- Upgrade at $20/month for 50,000 emails if needed

## Support
- Resend docs: https://resend.com/docs
- Cloudflare Workers: https://developers.cloudflare.com/workers/
