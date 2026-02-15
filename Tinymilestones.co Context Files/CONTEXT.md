# TinyMilestones - Project Context Documentation

## 🎯 Project Overview

**TinyMilestones** is an AI-powered developmental activity generator for parents of children aged 0-6 years. The app provides personalized, age-appropriate play activities that support cognitive, motor, language, and social-emotional development — using common household items.

**Domain:** tinymilestones.co
**Tagline:** "Personalized play for every stage"

---

## 📋 Table of Contents

1. [Vision & Goals](#vision--goals)
2. [Target Audience](#target-audience)
3. [Core Features](#core-features)
4. [Technical Architecture](#technical-architecture)
5. [Database Schema](#database-schema)
6. [API Design](#api-design)
7. [File Structure](#file-structure)
8. [UI/UX Guidelines](#uiux-guidelines)
9. [Development Phases](#development-phases)
10. [Monetization](#monetization)
11. [Future Roadmap](#future-roadmap)

---

## Vision & Goals

### Mission Statement
Empower parents with science-backed, AI-generated developmental activities that make playtime purposeful — without expensive toys or complicated prep.

### Business Goals
- **Month 1-3:** Launch MVP, acquire 1,000 free users
- **Month 3-6:** Convert 15-20% to Pro ($6.99/mo), reach $1,000 MRR
- **Month 6-12:** Scale to 10,000 users, $7,000+ MRR
- **Year 2:** Launch iOS app, expand to 50,000 users

### Success Metrics
| Metric | Target |
|--------|--------|
| Free → Pro Conversion | 15-20% |
| Monthly Churn Rate | <5% |
| Daily Active Users | 30% of registered |
| Activity Generation/User/Day | 2-3 |
| NPS Score | 50+ |

---

## Target Audience

### Primary Persona: "New Parent Nina"
- **Age:** 28-38
- **Child Age:** 0-3 years (first child)
- **Pain Points:**
  - Overwhelmed by conflicting parenting advice
  - Guilty about screen time
  - Wants to "do things right" for child's development
  - Limited time — needs quick, actionable ideas
- **Willingness to Pay:** $5-15/month for peace of mind
- **Discovery Channels:** Instagram, Pinterest, parenting Facebook groups, Google search

### Secondary Persona: "Experienced Parent Eric"
- **Age:** 32-42
- **Child Age:** 3-6 years (often second child)
- **Pain Points:**
  - Bored of same activities
  - Needs age-appropriate ideas as child grows
  - Wants educational value, not just entertainment
- **Willingness to Pay:** $5-10/month

### Tertiary: Caregivers & Educators
- Grandparents, nannies, daycare workers
- Need structured activity ideas
- May have multiple children of different ages

---

## Core Features

### MVP Features (Phase 1)

#### 1. Child Profile Management
- Add child name, birthdate, preferences
- Auto-calculate age in weeks/months/years
- Support for multiple children (Pro)
- Preferences: indoor/outdoor, materials, time available

#### 2. AI Activity Generation
- Generate 4-5 activities per request
- Filter by developmental domain:
  - 🧠 Cognitive
  - ✋ Fine Motor
  - 🏃 Gross Motor
  - 💬 Language
  - 💕 Social-Emotional
- Each activity includes:
  - Title (catchy, 3-5 words)
  - Duration estimate
  - Step-by-step instructions
  - "Why it matters" developmental explanation
  - Materials needed (household items only by default)
  - Pro tip for parents
  - Age appropriateness indicator

#### 3. Activity Saving & History
- Save favorite activities (heart icon)
- View saved activities list
- Activity history (last 30 days)

#### 4. User Authentication
- Email/password signup
- Google OAuth
- Apple Sign-In (required for iOS later)
- Password reset flow

#### 5. Subscription Management
- Free tier: 5 activities/day
- Pro tier: Unlimited activities
- Stripe integration for payments
- 7-day free trial for Pro

### Phase 2 Features

#### 6. Milestone Tracking
- Checklist of developmental milestones by age
- Based on CDC/AAP guidelines
- Mark milestones as achieved
- Visual progress charts
- Export milestone report (for pediatrician visits)

#### 7. Weekly Email Digest
- Personalized activity recommendations
- Milestone reminders
- Tips based on child's current age

#### 8. Printable Activity Cards
- Generate PDF activity cards
- Print-friendly formatting
- Shareable with caregivers

### Phase 3 Features (iOS App)

#### 9. Push Notifications
- Daily activity reminder
- Milestone alerts
- Streak motivation

#### 10. Offline Mode
- Cache last 10 generated activities
- Access saved activities offline

#### 11. Photo Memory Journal
- Attach photos to completed activities
- Create sharable memory books

---

## Technical Architecture

### Tech Stack

#### Frontend (Web)
```
Framework:      Next.js 14 (App Router)
Styling:        Tailwind CSS
UI Components:  shadcn/ui
State:          Zustand (lightweight)
Forms:          React Hook Form + Zod
```

#### Backend
```
Runtime:        Next.js API Routes (serverless)
Database:       Supabase (PostgreSQL)
Auth:           Supabase Auth
AI:             Anthropic Claude API (claude-sonnet-4-20250514)
Payments:       Stripe
Email:          Resend
Hosting:        Vercel
```

#### iOS (Future)
```
Framework:      React Native (Expo)
                OR Swift/SwiftUI (native)
Shared:         API backend remains the same
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Next.js   │  │  React      │  │  iOS App (Future)   │  │
│  │   Web App   │  │  Native     │  │  Swift/Expo         │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼────────────────────┼─────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js API Routes (/api/*)                │ │
│  │  • /api/auth/*        - Authentication                  │ │
│  │  • /api/children/*    - Child profile CRUD              │ │
│  │  • /api/activities/*  - Activity generation & history   │ │
│  │  • /api/milestones/*  - Milestone tracking              │ │
│  │  • /api/billing/*     - Stripe webhooks                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          │                │                    │
          ▼                ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │ Supabase │  │ Anthropic│  │  Stripe  │  │    Resend    │ │
│  │ (DB+Auth)│  │ Claude   │  │ Payments │  │    Email     │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_PRO_PRICE_ID=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://tinymilestones.co
```

---

## Database Schema

### Supabase PostgreSQL Schema

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  activities_generated_today INTEGER DEFAULT 0,
  last_activity_reset DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Children profiles
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birthdate DATE NOT NULL,
  avatar_emoji TEXT DEFAULT '👶',
  preferences JSONB DEFAULT '{
    "materials": "household",
    "activity_duration": "any",
    "indoor_outdoor": "both",
    "notes": ""
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated activities
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  domain TEXT NOT NULL CHECK (domain IN ('Cognitive', 'Fine Motor', 'Gross Motor', 'Language', 'Social-Emotional')),
  duration TEXT,
  description TEXT NOT NULL,
  why_it_matters TEXT,
  materials TEXT[],
  tip TEXT,
  child_age_months INTEGER,
  is_saved BOOLEAN DEFAULT FALSE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones (Phase 2)
CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age_months INTEGER NOT NULL,
  domain TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  source TEXT DEFAULT 'CDC'
);

-- Child milestone progress (Phase 2)
CREATE TABLE public.child_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES public.milestones(id),
  achieved BOOLEAN DEFAULT FALSE,
  achieved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity generation log (for rate limiting & analytics)
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.children(id),
  domain_filter TEXT,
  activities_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_children_user_id ON public.children(user_id);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_child_id ON public.activities(child_id);
CREATE INDEX idx_activities_saved ON public.activities(user_id, is_saved) WHERE is_saved = TRUE;
CREATE INDEX idx_activity_logs_user_date ON public.activity_logs(user_id, created_at);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.child_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own children" ON public.children
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own activities" ON public.activities
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own milestones" ON public.child_milestones
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM public.children WHERE id = child_id)
  );
```

---

## API Design

### API Endpoints

#### Authentication (Supabase handles most)
```
POST   /api/auth/callback     - OAuth callback handler
POST   /api/auth/signup       - Email signup (if custom flow needed)
```

#### Children
```
GET    /api/children          - List user's children
POST   /api/children          - Create child profile
GET    /api/children/:id      - Get child details
PUT    /api/children/:id      - Update child
DELETE /api/children/:id      - Delete child
```

#### Activities
```
POST   /api/activities/generate   - Generate new activities
GET    /api/activities            - List activities (with filters)
GET    /api/activities/saved      - List saved activities
PUT    /api/activities/:id/save   - Toggle save status
PUT    /api/activities/:id/complete - Mark as completed
DELETE /api/activities/:id        - Delete activity
```

#### Billing
```
POST   /api/billing/create-checkout    - Create Stripe checkout session
POST   /api/billing/create-portal      - Create Stripe billing portal
POST   /api/billing/webhook            - Stripe webhook handler
GET    /api/billing/subscription       - Get current subscription status
```

#### Milestones (Phase 2)
```
GET    /api/milestones/:childId        - Get milestones for child's age
PUT    /api/milestones/:childId/:id    - Update milestone status
GET    /api/milestones/:childId/report - Generate PDF report
```

### Activity Generation API

**Endpoint:** `POST /api/activities/generate`

**Request:**
```json
{
  "childId": "uuid",
  "domain": "all" | "Cognitive" | "Fine Motor" | "Gross Motor" | "Language" | "Social-Emotional",
  "count": 4
}
```

**Response:**
```json
{
  "success": true,
  "activities": [
    {
      "id": "uuid",
      "title": "Texture Discovery Box",
      "domain": "Cognitive",
      "duration": "10-15 mins",
      "description": "Create a sensory box with different textures for Emma to explore...",
      "whyItMatters": "Sensory exploration builds neural pathways...",
      "materials": ["Fabric scraps", "Textured balls", "Safe household items"],
      "tip": "Watch for which textures capture their attention longest!",
      "childAgeMonths": 8
    }
  ],
  "remainingToday": 3,
  "isPro": false
}
```

### Claude Prompt Template

```typescript
const generateActivitiesPrompt = (child: Child, domain: string) => `
You are a child development expert with deep knowledge of CDC and AAP developmental milestones. Generate ${count} unique, engaging developmental activities for a ${ageInMonths}-month-old child named ${child.name}.

CHILD CONTEXT:
- Age: ${ageInMonths} months (${ageDisplay})
- Developmental stage: ${getDevelopmentalStage(ageInMonths)}

FOCUS DOMAIN: ${domain === 'all' ? 'Mix of cognitive, fine motor, gross motor, language, and social-emotional' : domain}

PARENT PREFERENCES:
${child.preferences.materials === 'household' ? '- Use ONLY common household items (no special toys needed)' : '- Can suggest specific toys if helpful'}
${child.preferences.notes ? `- Parent notes: ${child.preferences.notes}` : ''}

REQUIREMENTS:
1. Activities must be age-appropriate and safe
2. Each activity should take 5-15 minutes
3. Instructions should be clear and actionable for parents
4. Include developmental benefits explanation
5. Suggest modifications for slightly younger/older if applicable

OUTPUT FORMAT:
Return a JSON array with exactly ${count} objects. Each object must have:
- "title": Catchy, parent-friendly name (3-5 words, fun but not childish)
- "domain": One of "Cognitive", "Fine Motor", "Gross Motor", "Language", "Social-Emotional"
- "duration": Time estimate like "5-10 mins"
- "description": 2-3 sentences explaining what to do, written TO the parent using "you" and "${child.name}"
- "whyItMatters": 1-2 sentences on developmental benefit (be specific about skills)
- "materials": Array of 1-4 items needed (or ["None needed"])
- "tip": One practical pro tip for success

Return ONLY the JSON array, no markdown formatting or other text.
`;
```

---

## File Structure

```
tinymilestones/
├── .env.local                    # Environment variables (git ignored)
├── .env.example                  # Template for env vars
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
│
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── og-image.png              # Social sharing image
│   └── fonts/
│       └── ...                   # Custom fonts if needed
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/               # Auth routes (no layout)
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── callback/page.tsx
│   │   │
│   │   ├── (marketing)/          # Public marketing pages
│   │   │   ├── pricing/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── blog/
│   │   │
│   │   ├── (dashboard)/          # Protected app routes
│   │   │   ├── layout.tsx        # Dashboard layout with nav
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── children/
│   │   │   │   ├── page.tsx      # List children
│   │   │   │   ├── new/page.tsx  # Add child
│   │   │   │   └── [id]/page.tsx # Edit child
│   │   │   ├── activities/
│   │   │   │   ├── page.tsx      # Activity generator
│   │   │   │   └── saved/page.tsx
│   │   │   ├── milestones/       # Phase 2
│   │   │   │   └── [childId]/page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       └── billing/page.tsx
│   │   │
│   │   └── api/                  # API routes
│   │       ├── auth/
│   │       │   └── callback/route.ts
│   │       ├── children/
│   │       │   ├── route.ts      # GET, POST
│   │       │   └── [id]/route.ts # GET, PUT, DELETE
│   │       ├── activities/
│   │       │   ├── generate/route.ts
│   │       │   ├── route.ts
│   │       │   └── [id]/
│   │       │       ├── save/route.ts
│   │       │       └── complete/route.ts
│   │       └── billing/
│   │           ├── create-checkout/route.ts
│   │           ├── create-portal/route.ts
│   │           └── webhook/route.ts
│   │
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── activities/
│   │   │   ├── ActivityCard.tsx
│   │   │   ├── ActivityGrid.tsx
│   │   │   ├── DomainFilter.tsx
│   │   │   └── GenerateButton.tsx
│   │   ├── children/
│   │   │   ├── ChildCard.tsx
│   │   │   ├── ChildForm.tsx
│   │   │   └── AgeDisplay.tsx
│   │   ├── milestones/           # Phase 2
│   │   │   ├── MilestoneChecklist.tsx
│   │   │   └── ProgressChart.tsx
│   │   └── marketing/
│   │       ├── Hero.tsx
│   │       ├── Features.tsx
│   │       ├── Pricing.tsx
│   │       └── Testimonials.tsx
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts         # Browser client
│   │   │   ├── server.ts         # Server client
│   │   │   └── middleware.ts     # Auth middleware
│   │   ├── stripe/
│   │   │   ├── client.ts
│   │   │   └── webhooks.ts
│   │   ├── anthropic/
│   │   │   ├── client.ts
│   │   │   └── prompts.ts        # Prompt templates
│   │   ├── utils/
│   │   │   ├── age.ts            # Age calculation helpers
│   │   │   ├── format.ts
│   │   │   └── validation.ts
│   │   └── constants/
│   │       ├── domains.ts        # Developmental domains config
│   │       └── milestones.ts     # Milestone data (Phase 2)
│   │
│   ├── hooks/
│   │   ├── useUser.ts
│   │   ├── useChildren.ts
│   │   ├── useActivities.ts
│   │   └── useSubscription.ts
│   │
│   ├── stores/                   # Zustand stores
│   │   ├── userStore.ts
│   │   └── activityStore.ts
│   │
│   └── types/
│       ├── database.ts           # Supabase generated types
│       ├── activity.ts
│       ├── child.ts
│       └── user.ts
│
├── supabase/
│   ├── migrations/               # Database migrations
│   │   └── 001_initial_schema.sql
│   └── seed.sql                  # Seed data for development
│
└── docs/
    ├── CONTEXT.md                # This file
    ├── API.md                    # API documentation
    └── DEPLOYMENT.md             # Deployment guide
```

---

## UI/UX Guidelines

### Brand Identity

**Colors:**
```css
/* Primary - Warm Purple/Indigo (trust, wisdom, nurturing) */
--primary-50: #F5F3FF;
--primary-100: #EDE9FE;
--primary-500: #8B5CF6;
--primary-600: #7C3AED;
--primary-700: #6D28D9;

/* Secondary - Soft Coral (warmth, playfulness) */
--secondary-400: #FB7185;
--secondary-500: #F43F5E;

/* Accent - Soft Teal (growth, development) */
--accent-400: #2DD4BF;
--accent-500: #14B8A6;

/* Neutrals */
--gray-50: #FAFAFA;
--gray-100: #F4F4F5;
--gray-500: #71717A;
--gray-900: #18181B;

/* Domain Colors */
--cognitive: #FF9800;      /* Orange */
--fine-motor: #4CAF50;     /* Green */
--gross-motor: #2196F3;    /* Blue */
--language: #E91E63;       /* Pink */
--social-emotional: #9C27B0; /* Purple */
```

**Typography:**
```css
/* Headings - Warm, approachable serif */
--font-heading: 'Fraunces', Georgia, serif;

/* Body - Clean, readable sans */
--font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Design Principles

1. **Calm, Not Chaotic**
   - Parents are already overwhelmed
   - Use generous whitespace
   - Limit information density
   - Soft colors, no harsh contrasts

2. **Warm, Not Clinical**
   - Avoid sterile "medical" feel
   - Use rounded corners, soft shadows
   - Organic shapes, nature metaphors
   - Friendly illustrations

3. **Quick, Not Complex**
   - One primary action per screen
   - Maximum 3 taps to generate activities
   - No unnecessary navigation

4. **Trustworthy, Not Trendy**
   - Subtle animations only
   - No gimmicks
   - Professional but approachable
   - Cite CDC/AAP where appropriate

### Key UI Components

**Activity Card:**
- Rounded corners (16-20px)
- Domain color as subtle background
- Clear hierarchy: Title → Duration → Description → Expand
- Save button (heart) always visible
- Expandable for details (why it matters, materials, tips)

**Domain Filter Pills:**
- Horizontal scroll on mobile
- Icon + Label
- Active state with fill color
- "All" option first

**Child Profile Card:**
- Avatar (emoji or initial)
- Name prominent
- Age auto-calculated and displayed
- Edit action

### Mobile-First Responsive

- Design for 375px width first
- Breakpoints: sm(640) md(768) lg(1024) xl(1280)
- Touch targets minimum 44x44px
- Bottom navigation on mobile
- Side navigation on desktop

---

## Development Phases

### Phase 1: MVP (Weeks 1-4)

**Week 1: Foundation**
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind + shadcn/ui
- [ ] Configure Supabase project
- [ ] Set up authentication (email + Google)
- [ ] Create database schema
- [ ] Deploy to Vercel (staging)

**Week 2: Core Features**
- [ ] Landing page with hero, features, pricing
- [ ] User signup/login flows
- [ ] Child profile CRUD
- [ ] Basic dashboard layout

**Week 3: Activity Generation**
- [ ] Claude API integration
- [ ] Activity generation endpoint
- [ ] Activity display cards
- [ ] Domain filtering
- [ ] Save activity functionality
- [ ] Rate limiting (5/day for free)

**Week 4: Polish & Launch**
- [ ] Stripe integration (Pro tier)
- [ ] Subscription management
- [ ] Error handling & loading states
- [ ] SEO optimization
- [ ] Analytics (Plausible or Vercel Analytics)
- [ ] Production deployment
- [ ] Product Hunt launch prep

### Phase 2: Growth Features (Weeks 5-8)

- [ ] Milestone tracking
- [ ] Activity history & search
- [ ] Weekly email digest (Resend)
- [ ] Printable activity cards (PDF)
- [ ] Referral system
- [ ] Blog with SEO content

### Phase 3: iOS App (Weeks 9-16)

- [ ] React Native / Expo setup OR Swift/SwiftUI
- [ ] Shared API backend
- [ ] Offline activity caching
- [ ] Push notifications
- [ ] Apple App Store submission
- [ ] In-app purchases (match web pricing)

---

## Monetization

### Pricing Tiers

| Feature | Free | Pro ($6.99/mo) |
|---------|------|----------------|
| Activities per day | 5 | Unlimited |
| Child profiles | 1 | Unlimited |
| Save activities | 10 total | Unlimited |
| Developmental domains | All 5 | All 5 |
| "Why it matters" | ✓ | ✓ |
| Milestone tracking | — | ✓ |
| Printable cards | — | ✓ |
| Weekly email digest | — | ✓ |
| Activity history | 7 days | Unlimited |
| Priority support | — | ✓ |

### Stripe Configuration

**Products:**
- `prod_TinyMilestonesPro` - TinyMilestones Pro

**Prices:**
- `price_monthly` - $6.99/month
- `price_yearly` - $59.99/year (save ~30%)

**Trial:**
- 7-day free trial on Pro
- No card required to start trial (optional)

### Revenue Projections

| Users | Free (80%) | Pro (20%) | MRR |
|-------|-----------|-----------|-----|
| 500 | 400 | 100 | $699 |
| 1,000 | 800 | 200 | $1,398 |
| 5,000 | 4,000 | 1,000 | $6,990 |
| 10,000 | 8,000 | 2,000 | $13,980 |

---

## Future Roadmap

### 2025 Q2-Q3
- iOS app launch
- Android app (if iOS successful)
- Multi-language support (Spanish, Hindi first)

### 2025 Q4
- AI photo analysis (assess milestones from photos)
- Partner with pediatricians for B2B
- White-label for daycares

### 2026
- Personalized learning paths
- Speech/motor delay early detection
- Integration with wearables (sleep, activity data)

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run type checking
npm run type-check

# Run linting
npm run lint

# Generate Supabase types
npm run db:types

# Run database migrations
npm run db:migrate

# Deploy to production
npm run deploy
```

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.1.0",
    "@anthropic-ai/sdk": "^0.16.0",
    "stripe": "^14.0.0",
    "@stripe/stripe-js": "^2.2.0",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    "date-fns": "^3.0.0",
    "lucide-react": "^0.294.0",
    "resend": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "class-variance-authority": "^0.7.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0",
    "@types/node": "^20.10.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "^14.0.0",
    "supabase": "^1.122.0"
  }
}
```

---

## Contact & Resources

**Project Repository:** github.com/[your-username]/tinymilestones
**Production URL:** https://tinymilestones.co
**Staging URL:** https://staging.tinymilestones.co

**External Documentation:**
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Anthropic API Docs](https://docs.anthropic.com)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

*Last Updated: February 2026*
*Version: 1.0.0*
