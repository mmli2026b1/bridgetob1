# Success Bridge — B1 Speaking Exam Prep Website

An interactive membership website for English-learning exam prep with Arabic/English language support. Built with Next.js 14 (App Router), Supabase, Stripe, and Anthropic's Claude AI.

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS 4
- **Auth & Database:** Supabase (free tier)
- **Payments:** Stripe Checkout + Billing (test mode)
- **AI Tutor:** Anthropic API (Claude)
- **Hosting target:** Vercel Hobby tier (free)
- **Languages:** English + Arabic (with RTL support)

## Features

- 🌍 **Bilingual** — Toggle between English and Arabic with one click
- 📖 **12 exam topics** with vocabulary, model Q&As, and useful phrases
- 🆓 **Free preview** — Family topic available without signing up
- 🔒 **Premium gating** — Paid topics locked behind £9.99/month membership
- 🤖 **AI tutor chat** — Claude-powered speaking practice with daily rate limit
- 📘 **Ebook purchase** — One-time £9.99 download of the full study guide
- 🎵 **Audio sample** — Free practice audio on the homepage

---

## Prerequisites

- Node.js 18+ installed
- NPM (comes with Node)
- A Supabase account (free tier)
- A Stripe account (free to create, test mode)
- An Anthropic API key (with credits)

---

## Step 1: Get API Keys & Configure

### Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once created, go to **Project Settings → API**
3. Copy these values into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your project URL (e.g. `https://abc123.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = The `anon` public key
   - `SUPABASE_SERVICE_ROLE_KEY` = The `service_role` key (**keep secret — never expose it client-side**)

### Stripe

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and create an account
2. Ensure you're in **Test mode** (toggle at the bottom left)
3. Go to **Developers → API Keys** and copy:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
   - `STRIPE_SECRET_KEY` = `sk_test_...`
4. **Create two Products & Prices:**
   - **Monthly Subscription:**
     - Name: "Success Bridge Premium Monthly"
     - Price: **£9.99/month** (recurring)
     - Copy the Price ID (`price_...`) into `src/lib/stripe.ts` replacing `price_placeholder_monthly`
   - **Ebook (one-time):**
     - Name: "Success Bridge Ebook"
     - Price: **£9.99** (one-time)
     - Copy the Price ID into `src/lib/stripe.ts` replacing `price_placeholder_ebook`
5. Go to **Developers → Webhooks → Add endpoint**
   - Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - For local testing, use the Stripe CLI (see below)
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret** (`whsec_...`) into `STRIPE_WEBHOOK_SECRET` in `.env.local`

### Anthropic (Claude)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Copy it into `ANTHROPIC_API_KEY` in `.env.local`

---

## Step 2: Local Setup

```bash
# 1. Install dependencies
cd success-bridge
npm install

# 2. Edit .env.local with your keys from Step 1
#    (If .env.local doesn't exist, create it with the variables listed below)

# 3. Run the database migration
#    Go to your Supabase dashboard, SQL Editor, paste and run supabase-migration.sql

# 4. (Optional) Disable email confirmation in Supabase
#    Go to Authentication → Settings → Disable "Confirm email" for easier testing

# 5. Run the dev server
npm run dev
```

### Required Environment Variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Visit `http://localhost:3000` — you should see the home page with the free Family topic preview and the language toggle button in the top navigation.

---

## Step 3: Testing Locally

### Language Toggle
Click the **🌐 العربية / English** button in the top navigation to switch between English and Arabic. The entire site switches instantly — text, direction (RTL for Arabic), and fonts. Your preference is saved in your browser.

### Auth Flow
1. Click **Get Started** / **ابدأ الآن** in the header
2. Create an account with email/password (or use Google OAuth)
3. Check your email for the confirmation link (if enabled), or sign in directly
4. Go to **Account** to see your profile and membership status

### Content Gating
- Visit `/topics/family` — full content visible (free preview)
- Visit `/topics/job` — blurred preview with lock overlay

### Stripe Checkout Test (requires Stripe CLI)
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```
Use test card **`4242 4242 4242 4242`** with any future expiry date and any CVC.

### AI Tutor Chat
While signed in with active membership, visit `/chat`, select a topic, and practice with the AI tutor (30 messages/day cap).

---

## 📦 Project Structure

```
success-bridge/
├── .env.local                          # Environment variables
├── supabase-migration.sql              # Database schema
├── private/ebook.docx                  # Ebook file (protected from public)
├── public/audio/Success-B1-Audio.mp4   # Audio sample
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout with LanguageProvider
│   │   ├── page.tsx                    # Home page (i18n-enabled)
│   │   ├── login/page.tsx              # Login page (i18n-enabled)
│   │   ├── signup/page.tsx             # Signup page (i18n-enabled)
│   │   ├── account/page.tsx            # Account page (i18n-enabled)
│   │   ├── chat/page.tsx               # AI Tutor chat (i18n-enabled)
│   │   ├── topics/[slug]/
│   │   │   ├── page.tsx                # Server component
│   │   │   └── TopicPageClient.tsx     # Client component (i18n-enabled)
│   │   └── api/                        # API routes (auth, Stripe, tutor, ebook)
│   ├── components/
│   │   ├── Header.tsx                  # Nav + language toggle
│   │   ├── Footer.tsx                  # Footer (i18n-enabled)
│   │   ├── LanguageProvider.tsx        # Language context + RTL support
│   │   ├── TopicCard.tsx               # Topic card (i18n-enabled)
│   │   ├── TopicPage.tsx               # Content renderer (i18n-enabled)
│   │   ├── PaymentGate.tsx             # Upgrade overlay (i18n-enabled)
│   │   └── ChatUI.tsx                  # Chat interface (i18n-enabled)
│   └── lib/
│       ├── i18n.ts                     # 100+ translation keys (EN/AR)
│       ├── content.ts                  # Topic data
│       ├── supabaseClient.ts           # Browser Supabase client
│       ├── supabaseServer.ts           # Server + admin Supabase clients
│       └── stripe.ts                   # Stripe client + pricing
```

---

## 🚀 Step 4: Deployment — Full Guide with Costs

### 4a. Push to GitHub

```bash
# Create a new repository on GitHub (it's free)
# Then:
cd /e/Freebuff/success-bridge
git init
git add -A
git commit -m "Initial commit — Success Bridge exam prep site"
git remote add origin https://github.com/your-username/success-bridge.git
git push -u origin main
```

### 4b. Deploy to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **Add New → Project**
3. Import your `success-bridge` repository
4. Vercel auto-detects Next.js — **keep all default settings**
5. In the **Environment Variables** section, add ALL of these:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `NEXT_PUBLIC_SITE_URL` | `https://success-bridge.vercel.app` (use your actual domain) |

6. Click **Deploy** — Vercel builds and deploys in ~2 minutes
7. You'll get a URL like `https://success-bridge.vercel.app`

### 4c. Set Up Production Stripe Webhook

1. In Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy the **Signing secret** and update Vercel's `STRIPE_WEBHOOK_SECRET`
5. Vercel auto-redeploys when env vars change

### 4d. Switch Stripe to Live Mode

When you're ready to accept real payments:

1. In Stripe Dashboard, toggle **Test mode → Live mode** (top-right)
2. Re-create **both products** in live mode:
   - "Success Bridge Premium Monthly" — £9.99/month recurring
   - "Success Bridge Ebook" — £9.99 one-time
3. Copy the live **Price IDs** and update `src/lib/stripe.ts`:
   ```ts
   // Change from test price IDs to live price IDs
   monthly: { priceId: "price_live_monthly...", amount: 999 },
   ebook: { priceId: "price_live_ebook...", amount: 999 },
   ```
4. Copy live API keys: publishable (`pk_live_...`) and secret (`sk_live_...`)
5. Update Vercel environment variables and re-deploy
6. Update the Stripe webhook endpoint for live mode:
   - New signing secret (`whsec_live_...`)
   - Update `STRIPE_WEBHOOK_SECRET` in Vercel

### 4e. Custom Domain (Optional)

1. Buy a domain (e.g. `successbridge.com`) from Namecheap/Cloudflare (~£10/year)
2. In Vercel dashboard → Project → Settings → Domains → Add
3. Follow Vercel's DNS instructions

---

## 💰 Cost Breakdown

Here's exactly what this site costs to run:

### 🟢 While on Free Tiers (Launch Phase — 0–100 users)

| Service | Cost | What you get |
|---------|------|-------------|
| **Vercel Hobby** | **£0/month** | 100 GB bandwidth, 6,000 build minutes, serverless functions |
| **Supabase Free** | **£0/month** | 500 MB database, 50,000 auth users, community support |
| **Stripe** | **£0/month** | No monthly fee — pay 2.9% + 30p per successful charge |
| **Anthropic API** | **~£1-5/month** | ~1-5p per user per day at 30 messages (you control the cap) |
| **Domain (optional)** | **£10/year** | ~£0.83/month |
| **Total** | **~£1-6/month** | All in |

### 🟡 When You Grow (100–1,000 users)

| Service | Upgrade | Cost |
|---------|---------|------|
| **Supabase Pro** | 8 GB database, more auth users | **$25/month** (~£20) |
| **Vercel Pro** | More bandwidth, analytics | **$20/month** (~£16) |
| **Anthropic API** | Scales with usage | **~£10-50/month** |
| **Total** | | **~£46-86/month** |

### 🔴 Scaling Beyond (1,000+ users)

You'd likely need:
- **Supabase Team** plan ($599/month) or self-host
- **Vercel Enterprise** or move to dedicated hosting
- AI cost optimization (cache common responses, batch requests)

### When to upgrade from free:

| Metric | Free tier limit | Upgrade trigger |
|--------|----------------|-----------------|
| Database storage | 500 MB | When you hit ~400 MB (thousands of chat messages) |
| Auth users | 50,000 | Unlikely issue at first |
| Vercel bandwidth | 100 GB/month | ~50,000 page views/month |
| Build minutes | 6,000/month | Fine for <10 deployments/day |
| AI API cost | Pay-as-you-go | Monitor in Anthropic console — set a billing alert |

---

## Customization Guide

### Adding a New Topic
1. Open `src/lib/content.ts`
2. Add an entry to the `topics` array
3. Set `chapter: "Topics"` to make it paid, or omit it for free

### Adding/Updating Translations
1. Open `src/lib/i18n.ts`
2. Add a new key to the `translations` object with `en` and `ar` values
3. Use `t("your.key", lang)` in any component

### Changing the Price
1. Update `PLANS` in `src/lib/stripe.ts` (amount is in pence)
2. Create a new Price in Stripe Dashboard
3. Update the `priceId`

### Changing the Daily Message Limit
1. Change `DAILY_MESSAGE_LIMIT` in `src/app/api/tutor-chat/route.ts`

---

## Troubleshooting

### "useLanguage must be used within a LanguageProvider"
This means a component using `useLanguage()` is rendered outside the `LanguageProvider` wrapper. All client components should be children of the layout's `<LanguageProvider>`.

### Language toggle doesn't work on first load
The language is stored in `localStorage`. Private/incognito browsing may clear it. The default is English.

### RTL looks broken
The CSS has basic RTL overrides in `globals.css`. If a specific component doesn't flip correctly, add `rtl-flip` class for icons that need horizontal mirroring.

### Webhook not working / membership not updating
Check the Stripe Dashboard → Events for error logs. Ensure the webhook endpoint is reachable and the signing secret is correct.

### AI tutor returns errors
Verify `ANTHROPIC_API_KEY` is set correctly and has available credits. Check the server logs for the exact API error.

### Ebook download doesn't work
Ensure the `private/ebook.docx` file exists (not gitignored) and the download API route has the correct path.

---

## License

Built for personal/educational use. All ebook content © Success Bridge.
