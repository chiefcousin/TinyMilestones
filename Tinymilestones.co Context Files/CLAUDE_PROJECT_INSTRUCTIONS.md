# TinyMilestones - Claude Project Instructions

## Project Overview

You are helping build **TinyMilestones** (tinymilestones.co) — an AI-powered developmental activity generator for parents of children aged 0-6 years.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Next.js API Routes, Supabase (PostgreSQL + Auth)
- **AI:** Anthropic Claude API (claude-sonnet-4-20250514)
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel

## Key Principles

### Code Style
- Use TypeScript with strict mode
- Prefer functional components with hooks
- Use server components by default, client components only when needed
- Follow Next.js 14 App Router conventions
- Use Zod for validation
- Handle errors gracefully with try/catch and user-friendly messages

### Database
- All database operations go through Supabase client
- Use Row Level Security (RLS) for data access control
- Never expose service role key to client
- Use generated TypeScript types from Supabase

### API Design
- RESTful endpoints in /api directory
- Validate all inputs with Zod
- Return consistent JSON responses: `{ success: boolean, data?: any, error?: string }`
- Rate limit activity generation (5/day free, unlimited Pro)

### AI Prompts
- Activity prompts should be specific to child's age in months
- Always request JSON output, parse carefully
- Include fallback activities if API fails
- Never include medical advice or diagnose delays

### Security
- Validate user ownership before any data operation
- Sanitize all user inputs
- Use environment variables for secrets
- Implement CSRF protection on forms

## File Naming Conventions

```
Components:   PascalCase.tsx (ActivityCard.tsx)
Pages:        page.tsx (in App Router directories)
API Routes:   route.ts
Utilities:    camelCase.ts (formatAge.ts)
Types:        camelCase.ts or index.ts
Hooks:        useXxx.ts (useChildren.ts)
Stores:       xxxStore.ts (userStore.ts)
```

## Component Structure

```tsx
// Standard component template
'use client'; // Only if needed

import { useState } from 'react';
import { type ComponentProps } from '@/types';

interface Props {
  // Props interface
}

export function ComponentName({ prop1, prop2 }: Props) {
  // Hooks first
  const [state, setState] = useState();
  
  // Handlers
  const handleClick = () => {};
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## Common Patterns

### Fetching Data (Server Component)
```tsx
import { createServerClient } from '@/lib/supabase/server';

export default async function Page() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('children')
    .select('*');
  
  if (error) throw error;
  
  return <ChildList children={data} />;
}
```

### Mutations (Client Component)
```tsx
'use client';

import { useTransition } from 'react';
import { createChild } from '@/actions/children';

export function AddChildForm() {
  const [isPending, startTransition] = useTransition();
  
  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await createChild(formData);
    });
  };
  
  return <form action={handleSubmit}>...</form>;
}
```

### API Route
```tsx
import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1).max(50),
  birthdate: z.string().datetime(),
});

export async function POST(request: Request) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = schema.parse(body);
    
    const { data, error } = await supabase
      .from('children')
      .insert({ ...validated, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
```

## Developmental Domains

Always use these exact values:
- `Cognitive` (🧠)
- `Fine Motor` (✋)
- `Gross Motor` (🏃)
- `Language` (💬)
- `Social-Emotional` (💕)

## Age Calculation

```typescript
// Calculate age in months from birthdate
function calculateAgeInMonths(birthdate: string | Date): number {
  const birth = new Date(birthdate);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 
    + (now.getMonth() - birth.getMonth());
}

// Display age nicely
function formatAge(months: number): string {
  if (months < 1) return 'Newborn';
  if (months < 12) return `${months} month${months === 1 ? '' : 's'}`;
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  if (remaining === 0) return `${years} year${years === 1 ? '' : 's'}`;
  return `${years}y ${remaining}m`;
}
```

## When Generating Activities

1. Get child's exact age in months
2. Consider developmental stage (0-3mo, 3-6mo, 6-9mo, 9-12mo, 12-18mo, 18-24mo, 2-3y, 3-4y, 4-5y, 5-6y)
3. Use parent's material preferences (household only vs. any)
4. Mix domains unless user filters
5. Include clear, actionable instructions
6. Always explain developmental benefit
7. Suggest household materials only when preference is set

## Don't Do

- Don't diagnose developmental delays
- Don't give medical advice
- Don't collect data from children directly
- Don't use behavioral advertising SDKs
- Don't store sensitive health data beyond milestones
- Don't make claims about "fixing" developmental issues

## Do

- Encourage parents to consult pediatricians
- Cite CDC/AAP guidelines where appropriate
- Focus on positive, play-based learning
- Make activities achievable and fun
- Celebrate small wins

---

*Reference the full CONTEXT.md for detailed specifications.*
