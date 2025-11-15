# Contact Form Setup with Resend

This guide will help you set up the contact form to send emails using Resend.

## Prerequisites

- A Cloudflare account with the domain `sddc.info` added
- Access to modify DNS records in Cloudflare
- A Resend account (free tier provides 3,000 emails/month)

## Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for a free account
2. Verify your email address

## Step 2: Add Your Domain to Resend

1. Log into your Resend dashboard
2. Navigate to **Domains** in the sidebar
3. Click **Add Domain**
4. Enter `sddc.info` and select your preferred region
5. Click **Add**

## Step 3: Configure DNS Records in Cloudflare

Resend will provide you with DNS records that need to be added to your Cloudflare DNS. These typically include:

1. **SPF Record** - A TXT record for email authentication
2. **DKIM Records** - TXT records for email signing (usually 3 records)
3. **DMARC Record** - A TXT record for email policy

### Adding DNS Records in Cloudflare:

1. Log into your Cloudflare account
2. Select the `sddc.info` domain
3. Go to **DNS** > **Records**
4. For each record provided by Resend:
   - Click **Add record**
   - Select **TXT** as the type
   - Copy the **Name** from Resend (e.g., `_dmarc`, `resend._domainkey`, etc.)
   - Copy the **Value** from Resend
   - Set **Proxy status** to **DNS only** (gray cloud)
   - Click **Save**

## Step 4: Verify Your Domain in Resend

1. After adding all DNS records to Cloudflare, return to Resend
2. Click **Verify DNS Records** on your domain page
3. Wait for verification (can take a few minutes)
4. Once verified, you'll see a green checkmark

## Step 5: Generate a Resend API Key

1. In Resend, navigate to **API Keys** in the sidebar
2. Click **Create API Key**
3. Give it a name like "SDDC.info Contact Form"
4. Select **Sending access** permission
5. Click **Add**
6. **Copy the API key** - you won't be able to see it again!

## Step 6: Configure Local Development

1. Copy the example environment file:
   ```bash
   cp .dev.vars.example .dev.vars
   ```

2. Edit `.dev.vars` and add your credentials:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   CONTACT_EMAIL=your-email@example.com
   ```

3. The `.dev.vars` file is gitignored and won't be committed

## Step 7: Configure Production Environment

Add the secrets to your Cloudflare Workers:

```bash
npx wrangler secret put RESEND_API_KEY
# When prompted, paste your Resend API key

npx wrangler secret put CONTACT_EMAIL
# When prompted, enter the email where you want to receive contact form submissions
```

## Step 8: Update wrangler.toml

Remove the hardcoded `CONTACT_EMAIL` from `wrangler.toml`:

1. Open `wrangler.toml`
2. Remove or comment out the line:
   ```toml
   [vars]
   CONTACT_EMAIL = "bradlay@gmail.com"
   ```

## Step 9: Deploy

Build and deploy your site:

```bash
npm run build
npx wrangler pages deploy dist
```

## Testing

After deployment, test the contact form at [https://sddc.info/contact](https://sddc.info/contact)

## Troubleshooting

### Email not sending

1. Check Resend dashboard > **Logs** to see if emails were received
2. Verify DNS records are properly configured (green checkmarks in Resend)
3. Check that API key has sending permissions
4. Verify secrets are set in Cloudflare Workers:
   ```bash
   npx wrangler secret list
   ```

### DNS verification failing

- DNS changes can take up to 24 hours to propagate (usually much faster)
- Make sure all records are set to **DNS only** (not proxied)
- Double-check that record names and values match exactly

### Local development not working

- Ensure `.dev.vars` file exists and contains valid credentials
- Restart your dev server after creating/modifying `.dev.vars`

## Support

- Resend documentation: https://resend.com/docs
- Cloudflare Workers docs: https://developers.cloudflare.com/workers/
- Resend + Cloudflare guide: https://developers.cloudflare.com/workers/tutorials/send-emails-with-resend/
