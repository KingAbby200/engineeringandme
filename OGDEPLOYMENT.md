# Engineering Tutorials — Full Deployment Guide

This document walks you through every step needed to get **Engineering Tutorials** live on Vercel, from creating accounts to configuring environment variables.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Project Structure](#2-project-structure)
3. [Prerequisites](#3-prerequisites)
4. [Step 1 — MongoDB Atlas Setup](#4-step-1--mongodb-atlas-setup)
5. [Step 2 — Cloudinary Setup](#5-step-2--cloudinary-setup)
6. [Step 3 — Email (Nodemailer / Gmail)](#6-step-3--email-nodemailer--gmail)
7. [Step 4 — Environment Variables](#7-step-4--environment-variables)
8. [Step 5 — Run Locally](#8-step-5--run-locally)
9. [Step 6 — Seed the Database](#9-step-6--seed-the-database)
10. [Step 7 — Deploy to Vercel](#10-step-7--deploy-to-vercel)
11. [Step 8 — Google AdSense Setup](#11-step-8--google-adsense-setup)
12. [Step 9 — Google Analytics (Optional)](#12-step-9--google-analytics-optional)
13. [Step 10 — Post-Deployment Checklist](#13-step-10--post-deployment-checklist)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Project Overview

| Feature | Technology |
|---|---|
| Framework | Next.js 15 (App Router, no TypeScript) |
| Database | MongoDB Atlas (via Mongoose) |
| Auth | JWT in HTTP-only cookies |
| Media | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| Styling | Tailwind CSS + inline styles |
| State | Zustand |
| Rich Text | Tiptap |
| Deployment | Vercel |

---

## 2. Project Structure

```
engineering-tutorials/
├── app/
│   ├── layout.js                    # Root layout — SEO, AdSense, fonts
│   ├── page.js                      # Homepage
│   ├── sitemap.js                   # Auto-generated sitemap for SEO
│   ├── robots.js                    # robots.txt
│   ├── globals.css                  # Global styles + CSS variables
│   │
│   ├── (auth)/                      # Auth pages (no extra layout)
│   │   ├── layout.js
│   │   ├── login/page.js
│   │   ├── signup/page.js           # Signup + OTP verification form
│   │   ├── forgot-password/page.js
│   │   └── verify-email/page.js
│   │
│   ├── reset-password/page.js       # Linked from password-reset email
│   │
│   ├── dashboard/page.js            # Student dashboard (streak, progress)
│   ├── profile/page.js              # User profile + quiz results
│   ├── search/page.js               # Full-text search results
│   │
│   ├── tutorials/
│   │   ├── page.js                  # All tutorials (with filters)
│   │   └── [category]/
│   │       ├── page.js              # Tutorials by category
│   │       └── [slug]/
│   │           ├── page.js          # Tutorial overview → redirects to page 1
│   │           └── [pageSlug]/
│   │               └── page.js      # Individual tutorial page (content + quiz)
│   │
│   ├── admin/
│   │   ├── layout.js                # Admin guard + sidebar nav
│   │   ├── dashboard/page.js        # Stats overview
│   │   ├── pending/page.js          # Approve / reject submitted tutorials
│   │   ├── tutorials/
│   │   │   ├── page.js              # All tutorials table
│   │   │   ├── new/page.js          # Create new tutorial + pages + quiz
│   │   │   └── [id]/
│   │   │       └── edit/page.js     # Edit existing tutorial
│   │   ├── categories/page.js       # Manage engineering disciplines
│   │   ├── authors/page.js          # Create / manage authors
│   │   └── settings/page.js         # Site settings + password change
│   │
│   ├── contact/page.js
│   ├── privacy-policy/page.js       # Required for AdSense
│   ├── terms/page.js
│   ├── cookie-policy/page.js        # Required for AdSense (GDPR)
│   │
│   └── api/
│       ├── auth/
│       │   ├── register/route.js    # POST — create account, send OTP
│       │   ├── verify/route.js      # POST — verify OTP, set cookie
│       │   ├── login/route.js       # POST — login, set cookie
│       │   ├── logout/route.js      # POST — clear cookie
│       │   ├── me/route.js          # GET (current user) / PUT (update profile)
│       │   ├── forgot-password/route.js
│       │   └── reset-password/route.js
│       ├── tutorials/
│       │   ├── route.js             # GET list / POST create
│       │   └── [id]/
│       │       ├── route.js         # GET / PUT / DELETE tutorial
│       │       └── pages/
│       │           ├── route.js     # GET all pages / POST new page
│       │           └── [pageId]/route.js  # GET / PUT / DELETE page
│       ├── admin/
│       │   ├── approve/route.js     # POST — approve or reject tutorial
│       │   ├── authors/route.js     # GET / POST / PUT authors
│       │   └── stats/route.js       # GET dashboard stats
│       ├── categories/
│       │   ├── route.js             # GET / POST
│       │   └── [id]/route.js        # PUT / DELETE
│       ├── progress/route.js        # POST — record page completion
│       ├── quiz/route.js            # POST — submit quiz answers
│       ├── newsletter/
│       │   ├── route.js             # POST subscribe / DELETE unsubscribe
│       │   └── unsubscribe/route.js # GET — unsubscribe from email link
│       ├── upload/route.js          # POST — upload image to Cloudinary
│       └── contact/route.js         # POST — send contact form email
│
├── components/
│   ├── layout/
│   │   ├── Navbar.js                # Responsive navbar with auth + search
│   │   └── Footer.js                # Footer with links + newsletter form
│   ├── tutorial/
│   │   ├── TutorialCard.js          # Tutorial preview card
│   │   ├── TutorialSidebar.js       # Collapsible sidebar with page nav
│   │   ├── TutorialPageClient.js    # Progress tracking + reading bar
│   │   └── QuizSection.js           # Interactive quiz at end of page
│   ├── editor/
│   │   └── RichTextEditor.js        # Tiptap editor (bold, images, math, etc.)
│   └── ui/
│       ├── AdUnit.js                # Google AdSense unit wrapper
│       ├── CookieBanner.js          # GDPR cookie consent banner
│       └── NewsletterForm.js        # Email subscription form
│
├── lib/
│   ├── mongodb.js                   # Mongoose connection with caching
│   ├── seed.js                      # DB seed script (run once)
│   ├── models/
│   │   ├── User.js                  # User schema (students, authors, admin)
│   │   ├── Tutorial.js              # Tutorial + TutorialPage schemas
│   │   ├── Category.js              # Engineering discipline categories
│   │   └── Newsletter.js            # Newsletter subscribers
│   ├── store/
│   │   └── authStore.js             # Zustand auth store (persisted)
│   └── utils/
│       ├── auth.js                  # JWT helpers, slugify, OTP generator
│       ├── email.js                 # Nodemailer email templates
│       └── cloudinary.js            # Cloudinary upload utility
│
├── public/
│   ├── favicon.ico
│   └── og-image.png                 # Open Graph image (create 1200×630px)
│
├── .env.local                       # Your secrets (never commit this)
├── .env.example                     # Template — safe to commit
├── next.config.js
├── tailwind.config.js
└── DEPLOYMENT.md                    # This file
```

---

## 3. Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- A GitHub account (for Vercel deployment)
- A Google account (for AdSense / Analytics)

---

## 4. Step 1 — MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account.
2. Create a new **Project** (e.g. "EngineeringTutorials").
3. Click **"Build a Database"** → choose **M0 Free Tier** → select a region close to your users.
4. Set a **username** and **password** (save these — you'll need them). 
5. Under **Network Access** → **Add IP Address** → choose **"Allow access from anywhere"** (`0.0.0.0/0`) for Vercel compatibility. *(You can restrict this after setup.)*
6. Go to **Database** → **Connect** → **"Connect your application"** → copy the connection string.
7. Replace `<password>` with your password and `<dbname>` with `engineering-tutorials`.

Your URI will look like:
```
mongodb+srv://myuser:mypassword@cluster0.abcde.mongodb.net/engineering-tutorials?retryWrites=true&w=majority
```

---

## 5. Step 2 — Cloudinary Setup

1. Sign up at [https://cloudinary.com](https://cloudinary.com) (free tier: 25GB storage).
2. From your dashboard, note:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Go to **Settings → Upload → Upload Presets** → create an **unsigned** preset named `engineering-tutorials` (optional but recommended for direct browser uploads).

---

## 6. Step 3 — Email (Nodemailer / Gmail)

1. Use a Gmail account for sending emails.
2. Enable **2-Factor Authentication** on that Google account.
3. Go to **Google Account → Security → App Passwords**.
4. Generate an App Password for "Mail" / "Other (custom name)".
5. Copy the 16-character password — this is your `EMAIL_SERVER_PASSWORD`.

> **Alternative:** Use [Resend](https://resend.com) (3,000 emails/month free) — sign up, get an API key, add your domain, and the code already supports it via `RESEND_API_KEY`.

---

## 7. Step 4 — Environment Variables

Create `.env.local` in the project root (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Then fill in every value:

```env
# ── MongoDB ──────────────────────────────────────────────────────────────
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/engineering-tutorials?retryWrites=true&w=majority

# ── Auth ─────────────────────────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
NEXTAUTH_SECRET=your-random-64-char-secret-here

# ── Admin (initial login credentials) ────────────────────────────────────
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourStrongAdminPass123!

# ── Cloudinary ────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret

# ── Email (Gmail SMTP) ────────────────────────────────────────────────────
EMAIL_FROM=noreply@yourdomain.com
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=yourgmail@gmail.com
EMAIL_SERVER_PASSWORD=xxxx-xxxx-xxxx-xxxx   # Gmail App Password

# ── Site URL ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # Change to your Vercel URL in production

# ── Google AdSense (get after site is approved) ───────────────────────────
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-0000000000000000

# ── Google Analytics (optional) ──────────────────────────────────────────
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 8. Step 5 — Run Locally

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 9. Step 6 — Seed the Database

Run the seed script once to create the admin user and all 10 engineering categories:

```bash
node lib/seed.js
```

**Expected output:**
```
🔌  Connecting to MongoDB…
✅  Connected

✅  Admin created: admin@yourdomain.com

📁  Seeding categories…
   ✅  Electrical & Electronics Engineering
   ✅  Civil Engineering
   ... (10 total)

🎉  Seed complete!
```

After seeding, log in at `/login` with your admin credentials.

---

## 10. Step 7 — Deploy to Vercel

### Option A — Via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option B — Via GitHub (Recommended)

1. Push your project to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/engineering-tutorials.git
   git push -u origin main
   ```

2. Go to [https://vercel.com](https://vercel.com) → **New Project** → import your GitHub repo.

3. In the **Environment Variables** section, add every variable from your `.env.local`.
   > **Important:** Change `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to your Vercel URL (e.g. `https://engineering-tutorials.vercel.app`).

4. Set **Build Command:** `npm run build`
5. Set **Output Directory:** `.next`
6. Click **Deploy**.

### After deployment

- Run the seed script against your production DB (update `MONGODB_URI` in `.env.local` temporarily to point to production, run `node lib/seed.js`, then revert).
- Or log in to your deployed site with the admin credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin is created automatically on first login if they don't exist.

---

## 11. Step 8 — Google AdSense Setup

> AdSense requires a live site with real content before approval.

1. Go to [https://www.google.com/adsense](https://www.google.com/adsense) and sign up.
2. Add your site URL and verify ownership (add the meta tag they provide to `app/layout.js`).
3. Wait for Google to review your site (can take days to weeks).
4. Once approved, copy your **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`).
5. Add it to your Vercel environment variables as `NEXT_PUBLIC_ADSENSE_CLIENT_ID`.
6. Replace the slot IDs in these files with your real ad slot IDs:
   - `app/page.js` — homepage banner
   - `app/tutorials/[category]/page.js` — category page
   - `app/tutorials/[category]/[slug]/[pageSlug]/page.js` — tutorial page (2 units)

### AdSense Requirements Checklist

| Requirement | Status |
|---|---|
| Privacy Policy page | ✅ `/privacy-policy` |
| Cookie Policy page | ✅ `/cookie-policy` |
| Terms of Service page | ✅ `/terms` |
| Contact page | ✅ `/contact` |
| GDPR Cookie Consent Banner | ✅ `CookieBanner.js` |
| Substantial original content | Add tutorials first |
| Clear navigation | ✅ Navbar + sidebar |
| No broken links | Verify after launch |
| Mobile responsive | ✅ All pages |
| HTTPS (Vercel provides this) | ✅ Auto |

---

## 12. Step 9 — Google Analytics (Optional)

1. Go to [https://analytics.google.com](https://analytics.google.com) → Create account → Create property.
2. Choose **Web** → enter your site URL.
3. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`).
4. Add to Vercel env vars as `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

---

## 13. Step 10 — Post-Deployment Checklist

```
□ Site loads at your Vercel URL
□ Seed script has been run (10 categories exist)
□ Admin login works (/login with ADMIN_EMAIL + ADMIN_PASSWORD)
□ Email sending works (test via signup → OTP arrives)
□ Image uploads work (test via admin tutorial create)
□ Sitemap accessible at /sitemap.xml
□ robots.txt accessible at /robots.txt
□ Contact form sends email
□ Newsletter subscribe works
□ NEXT_PUBLIC_SITE_URL set to production URL in Vercel env
□ OG image added to /public/og-image.png (1200×630px)
□ Google Search Console — submit sitemap
□ Google Analytics connected (optional)
□ AdSense application submitted (after site has content)
□ Create at least 10 tutorial pages before applying for AdSense
```

---

## 14. Troubleshooting

### "MONGODB_URI not defined"
→ Ensure `.env.local` exists and contains `MONGODB_URI`. Restart the dev server after adding env vars.

### OTP emails not arriving
→ Check Gmail App Password is correct. Check spam folder. Ensure `EMAIL_SERVER_USER` is a valid Gmail address.

### Cloudinary upload failing
→ Verify `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` are all correct. Check the Cloudinary dashboard for upload errors.

### Build fails on Vercel
→ Run `npm run build` locally first to catch errors. Common causes: missing env vars, import errors in server components using client hooks.

### Admin can't log in on production
→ Ensure `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Vercel env vars match exactly what you're typing. These are case-sensitive.

### Sitemap returns 500
→ Usually a DB connection issue. Check `MONGODB_URI` is set in Vercel env vars and the IP `0.0.0.0/0` is whitelisted in MongoDB Atlas.

---

*For support, open an issue or contact admin@engineeringtutorials.com*
