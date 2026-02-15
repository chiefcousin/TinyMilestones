# TinyMilestones - Claude Code Quick Start

## Getting Started

### Step 1: Create Project Directory

```bash
mkdir tinymilestones
cd tinymilestones
```

### Step 2: Open in Claude Code

```bash
claude
```

### Step 3: Initialize Project

Copy and paste this first prompt into Claude Code:

---

## First Prompt for Claude Code

```
I'm building TinyMilestones - an AI-powered developmental activity generator for parents. Let me share the context documentation, then let's initialize the project.

**Domain:** tinymilestones.co
**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui, Supabase, Anthropic Claude API, Stripe

Please help me:

1. Initialize a new Next.js 14 project with TypeScript and Tailwind
2. Set up the project structure following this layout:
   - /src/app (App Router pages)
   - /src/components (React components)
   - /src/lib (utilities, clients)
   - /src/hooks (custom hooks)
   - /src/types (TypeScript types)

3. Install these dependencies:
   - @supabase/supabase-js @supabase/ssr
   - @anthropic-ai/sdk
   - stripe @stripe/stripe-js
   - zustand
   - react-hook-form @hookform/resolvers zod
   - date-fns lucide-react
   - resend
   - class-variance-authority tailwind-merge

4. Set up shadcn/ui with these components: button, card, input, label, dialog, dropdown-menu, avatar, badge, tabs

5. Create an .env.example file with placeholders for:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - ANTHROPIC_API_KEY
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - RESEND_API_KEY
   - NEXT_PUBLIC_APP_URL

Let's start with the initialization.
```

---

## Subsequent Prompts (In Order)

### Prompt 2: Supabase Setup

```
Now let's set up Supabase:

1. Create /src/lib/supabase/client.ts - browser client
2. Create /src/lib/supabase/server.ts - server client using cookies
3. Create /src/lib/supabase/middleware.ts - auth middleware
4. Create /supabase/migrations/001_initial_schema.sql with tables for:
   - profiles (extends auth.users)
   - children (child profiles)
   - activities (generated activities)
   - activity_logs (rate limiting)

Include RLS policies for user data isolation.
```

### Prompt 3: Authentication

```
Let's build the authentication system:

1. Create auth pages in /src/app/(auth)/:
   - /login/page.tsx
   - /signup/page.tsx
   - /forgot-password/page.tsx
   - /callback/page.tsx (OAuth callback)

2. Create reusable auth components:
   - AuthForm with email/password
   - SocialAuthButtons (Google, Apple)
   - LogoutButton

3. Set up middleware.ts in root to protect /dashboard/* routes

4. Create useUser hook that returns current user and loading state
```

### Prompt 4: Landing Page

```
Build the marketing landing page at /src/app/page.tsx:

1. Hero section with:
   - Headline: "Personalized activities for every stage of your child's development"
   - Subheadline about AI-powered, age-specific play ideas
   - CTA: "Start Free — No Card Required"
   - Floating activity card previews

2. Features section (4 cards):
   - Age-Perfect Activities
   - Household Items Only
   - Science-Backed
   - Fresh Ideas Daily

3. Developmental domains display (all 5 with icons and colors)

4. Pricing section (Free vs Pro at $6.99/mo)

5. Final CTA section

6. Footer with links

Use the brand colors:
- Primary: purple-600 (#7C3AED)
- Domains: Orange (Cognitive), Green (Fine Motor), Blue (Gross Motor), Pink (Language), Purple (Social-Emotional)

Make it warm, approachable, not clinical. Use Fraunces for headings, DM Sans for body.
```

### Prompt 5: Dashboard Layout

```
Create the dashboard layout for authenticated users:

1. /src/app/(dashboard)/layout.tsx with:
   - Sidebar navigation (desktop)
   - Bottom navigation (mobile)
   - Header with user avatar dropdown

2. Navigation items:
   - Dashboard (home icon)
   - Activities (sparkles icon)
   - Saved (heart icon)
   - Milestones (check-circle icon) - Phase 2
   - Settings (settings icon)

3. Create /src/app/(dashboard)/dashboard/page.tsx:
   - Welcome message with user's name
   - Quick stats (activities generated, saved)
   - Child profile cards
   - "Add Child" button if no children
   - Recent activities

4. Make it responsive - sidebar collapses to icons on tablet, bottom nav on mobile
```

### Prompt 6: Child Profiles

```
Build the child profile management:

1. /src/app/(dashboard)/children/page.tsx - list all children
2. /src/app/(dashboard)/children/new/page.tsx - add child form
3. /src/app/(dashboard)/children/[id]/page.tsx - edit child

4. Create ChildForm component with:
   - Name input
   - Birthdate picker
   - Avatar emoji selector (grid of baby/child emojis)
   - Material preference (household only / include toys)
   - Notes textarea

5. Create API routes:
   - POST /api/children - create
   - GET /api/children - list
   - GET /api/children/[id] - get one
   - PUT /api/children/[id] - update
   - DELETE /api/children/[id] - delete

6. Create useChildren hook for data fetching
```

### Prompt 7: Activity Generation

```
Build the core activity generation feature:

1. /src/app/(dashboard)/activities/page.tsx with:
   - Child selector (if multiple children)
   - Domain filter pills (All, Cognitive, Fine Motor, etc.)
   - "Generate Activities" button
   - Activity cards grid
   - Loading skeleton state

2. Create ActivityCard component:
   - Domain badge with color
   - Title
   - Duration
   - Description
   - Expandable section with:
     - Why it matters
     - Materials list
     - Pro tip
   - Save/unsave heart button
   - Mark as done button

3. Create /api/activities/generate route:
   - Validate user auth and rate limits
   - Build Claude prompt with child age and preferences
   - Parse JSON response
   - Save activities to database
   - Return activities with remaining count

4. Use this Claude prompt template: [include the prompt from CONTEXT.md]

5. Implement rate limiting: 5/day for free, unlimited for Pro
```

### Prompt 8: Stripe Integration

```
Set up Stripe billing:

1. Create /api/billing/create-checkout - create checkout session for Pro upgrade
2. Create /api/billing/create-portal - create customer portal session
3. Create /api/billing/webhook - handle Stripe webhooks:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted

4. Create useSubscription hook

5. Update the pricing page with working "Start Free Trial" button

6. Add upgrade prompts in the app:
   - When hitting 5 activity limit
   - Banner on dashboard for free users

7. Create /src/app/(dashboard)/settings/billing/page.tsx:
   - Current plan display
   - "Manage Subscription" button (links to Stripe portal)
   - Usage stats
```

### Prompt 9: Polish & Launch Prep

```
Final polish for launch:

1. Add proper error handling and error boundary components

2. Create loading.tsx files for each route

3. Add SEO:
   - metadata in layout.tsx
   - Open Graph image
   - robots.txt
   - sitemap.xml

4. Add analytics (Vercel Analytics or Plausible)

5. Create /src/app/not-found.tsx custom 404 page

6. Add toast notifications for user feedback (use sonner)

7. Test all flows:
   - Sign up → Add child → Generate activities → Save → Upgrade

8. Create README.md with setup instructions

9. Set up Vercel deployment configuration
```

---

## Environment Setup

Before running the app, you'll need:

### 1. Supabase Project
1. Go to supabase.com and create a new project
2. Copy the URL and anon key to .env.local
3. Run the migration SQL in the SQL editor

### 2. Anthropic API Key
1. Go to console.anthropic.com
2. Create an API key
3. Add to .env.local

### 3. Stripe Account
1. Create Stripe account at stripe.com
2. Create a product "TinyMilestones Pro" with $6.99/mo price
3. Copy the keys and price ID to .env.local
4. Set up webhook endpoint for your domain

### 4. Resend (Optional for MVP)
1. Create account at resend.com
2. Verify your domain
3. Add API key to .env.local

---

## Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Point your domain tinymilestones.co to Vercel
```

---

## Development Workflow

```bash
# Start development
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build

# Generate Supabase types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

---

*Good luck building TinyMilestones! 🌱*
