# TinyMilestones - iOS App Specification

## Overview

The iOS app will be a native companion to the web app, sharing the same backend API but with native iOS features like push notifications, offline mode, and Apple Sign-In.

**Target Launch:** 3-4 months after web app reaches 5,000 users
**Platform:** iOS 15.0+
**Framework Decision:** React Native (Expo) OR Swift/SwiftUI

---

## Framework Recommendation

### Option A: React Native with Expo (Recommended for Solo Dev)

**Pros:**
- Share logic with web app (hooks, utilities, API calls)
- Faster development time
- One codebase for iOS + Android later
- Expo handles build/deploy complexity
- Hot reloading for fast iteration

**Cons:**
- Slightly less native feel
- Limited access to some iOS-specific APIs
- Larger app size

**Best For:** Getting to market quickly, solo developer, planning Android later

### Option B: Swift/SwiftUI (Recommended for Best UX)

**Pros:**
- Best performance and native feel
- Full access to iOS APIs
- Smaller app size
- Better animations
- SwiftUI is modern and declarative

**Cons:**
- More development time
- No Android code sharing
- Need to learn Swift if not familiar

**Best For:** Premium user experience, iOS-only focus initially

---

## Recommended: React Native (Expo)

Given the goal of launching quickly and potential Android expansion, I recommend **React Native with Expo**.

### Tech Stack for iOS App

```
Framework:        React Native (Expo SDK 50+)
Navigation:       Expo Router
State:            Zustand (same as web)
Forms:            React Hook Form + Zod (same as web)
API Client:       Shared lib from web
Auth:             Supabase Auth (expo-auth-session)
Notifications:    expo-notifications
Storage:          expo-secure-store, AsyncStorage
Payments:         RevenueCat (wraps StoreKit)
Analytics:        expo-analytics or Mixpanel
```

---

## Feature Parity Matrix

| Feature | Web | iOS MVP | iOS v2 |
|---------|-----|---------|--------|
| Email/Password Auth | ✓ | ✓ | ✓ |
| Google Sign-In | ✓ | ✓ | ✓ |
| Apple Sign-In | — | ✓ (required) | ✓ |
| Child Profiles | ✓ | ✓ | ✓ |
| Activity Generation | ✓ | ✓ | ✓ |
| Domain Filtering | ✓ | ✓ | ✓ |
| Save Activities | ✓ | ✓ | ✓ |
| Activity History | ✓ | ✓ | ✓ |
| Milestone Tracking | ✓ | ✓ | ✓ |
| Pro Subscription | ✓ (Stripe) | ✓ (IAP) | ✓ |
| Push Notifications | — | ✓ | ✓ |
| Offline Mode | — | ✓ | ✓ |
| Widget | — | — | ✓ |
| Photo Journal | — | — | ✓ |
| Siri Shortcuts | — | — | ✓ |

---

## iOS-Specific Features

### 1. Push Notifications

**Notification Types:**
- Daily activity reminder (configurable time)
- Milestone reminders ("Emma turns 6 months next week!")
- Streak motivation ("You've played 5 days in a row! 🎉")
- Weekly summary

**Implementation:**
```typescript
// expo-notifications setup
import * as Notifications from 'expo-notifications';

// Request permissions
const { status } = await Notifications.requestPermissionsAsync();

// Schedule daily reminder
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Playtime! 🎯",
    body: "Ready for today's activity with Emma?",
  },
  trigger: {
    hour: 9,
    minute: 0,
    repeats: true,
  },
});
```

### 2. Offline Mode

**Cached Data:**
- Last 10 generated activities
- All saved activities
- Child profiles
- Milestone checklist (static data)

**Sync Strategy:**
- Optimistic UI updates
- Queue mutations when offline
- Sync when connection restored
- Conflict resolution: server wins

**Implementation:**
```typescript
// AsyncStorage for offline cache
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache activities
await AsyncStorage.setItem('cached_activities', JSON.stringify(activities));

// NetInfo for connectivity
import NetInfo from '@react-native-community/netinfo';

const state = await NetInfo.fetch();
if (!state.isConnected) {
  // Use cached data
}
```

### 3. Apple Sign-In (Required)

Apple requires apps with third-party login to also offer Apple Sign-In.

```typescript
import * as AppleAuthentication from 'expo-apple-authentication';

const credential = await AppleAuthentication.signInAsync({
  requestedScopes: [
    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
    AppleAuthentication.AppleAuthenticationScope.EMAIL,
  ],
});

// Send to Supabase
const { data, error } = await supabase.auth.signInWithIdToken({
  provider: 'apple',
  token: credential.identityToken,
});
```

### 4. In-App Purchases (RevenueCat)

**Why RevenueCat:**
- Simplifies StoreKit complexity
- Handles receipt validation
- Syncs with web subscriptions
- Great dashboard for analytics
- Supports both iOS and Android

**Products:**
- `tinymilestones_pro_monthly` - $6.99/month
- `tinymilestones_pro_yearly` - $59.99/year

**Implementation:**
```typescript
import Purchases from 'react-native-purchases';

// Initialize
Purchases.configure({ apiKey: 'your_revenuecat_api_key' });

// Get offerings
const offerings = await Purchases.getOfferings();
const monthlyPackage = offerings.current?.monthly;

// Purchase
const { customerInfo } = await Purchases.purchasePackage(monthlyPackage);

// Check entitlement
const isPro = customerInfo.entitlements.active['pro'] !== undefined;
```

### 5. Widgets (iOS 14+)

**Home Screen Widget:**
- Shows today's suggested activity
- Tap to open app to that activity
- Updates daily

**Lock Screen Widget (iOS 16+):**
- Activity streak counter
- Next milestone countdown

---

## App Structure (Expo Router)

```
app/
├── _layout.tsx              # Root layout
├── index.tsx                # Splash/redirect
├── (auth)/
│   ├── _layout.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   └── forgot-password.tsx
├── (tabs)/
│   ├── _layout.tsx          # Tab navigator
│   ├── index.tsx            # Dashboard/Home
│   ├── activities.tsx       # Activity generator
│   ├── saved.tsx            # Saved activities
│   ├── milestones.tsx       # Milestone tracking
│   └── settings.tsx         # Settings
├── child/
│   ├── [id].tsx             # Edit child
│   └── new.tsx              # Add child
├── activity/
│   └── [id].tsx             # Activity detail
└── subscription.tsx         # Paywall/upgrade

components/
├── ActivityCard.tsx
├── ChildSelector.tsx
├── DomainFilter.tsx
├── MilestoneItem.tsx
└── ...

lib/
├── api.ts                   # Shared API client
├── supabase.ts              # Supabase client
├── purchases.ts             # RevenueCat wrapper
├── notifications.ts         # Push notification helpers
└── storage.ts               # Offline storage helpers

hooks/
├── useUser.ts
├── useChildren.ts
├── useActivities.ts
├── useSubscription.ts
└── useNotifications.ts
```

---

## Design Considerations for iOS

### Native iOS Patterns

1. **Navigation:**
   - Use native tab bar (bottom)
   - Native navigation stack with gestures
   - Large titles for headers

2. **Haptics:**
   - Light haptic on button taps
   - Success haptic when saving activity
   - Selection haptic for domain filters

3. **Accessibility:**
   - VoiceOver support
   - Dynamic Type support
   - Reduce Motion support

4. **Dark Mode:**
   - Full dark mode support
   - Use system color scheme

### iOS Human Interface Guidelines

- Minimum 44pt touch targets
- Use SF Symbols for icons
- Native blur effects for overlays
- Pull-to-refresh on lists
- Swipe actions on list items
- 3D Touch / Haptic Touch previews

---

## Sharing Code Between Web and iOS

### What to Share (via npm package or monorepo)

```typescript
// @tinymilestones/shared

// Types
export interface Child { ... }
export interface Activity { ... }
export type Domain = 'Cognitive' | 'Fine Motor' | ...

// Utilities
export function calculateAgeInMonths(birthdate: Date): number { ... }
export function formatAge(months: number): string { ... }

// API client
export function generateActivities(childId: string, domain: string): Promise<Activity[]> { ... }

// Validation schemas
export const childSchema = z.object({ ... });

// Constants
export const DOMAINS = [ ... ];
export const DOMAIN_COLORS = { ... };
```

### Monorepo Structure (Optional)

```
tinymilestones/
├── apps/
│   ├── web/                 # Next.js app
│   └── mobile/              # Expo app
├── packages/
│   ├── shared/              # Shared types, utils, API
│   ├── ui/                  # Shared UI components (if using RN Web)
│   └── config/              # Shared config (eslint, tsconfig)
└── package.json             # Workspace root
```

---

## App Store Requirements

### Required Before Submission

1. **Apple Developer Account** ($99/year)
2. **App Privacy Details:**
   - Data collected: email, name, child birthdate
   - Data linked to user: yes
   - Data used for tracking: no
3. **App Review Guidelines compliance:**
   - 4.2.2: No minimal functionality (must be useful)
   - 5.1.1: Privacy policy required
   - 5.1.4: Kids Category requires additional compliance (but we're for PARENTS)
4. **Sign in with Apple** (required since we have Google)
5. **Screenshots:** 6.5" and 5.5" iPhone, optional iPad

### App Store Listing

**App Name:** TinyMilestones - Child Development
**Subtitle:** AI Activities for Every Age
**Category:** Parenting (primary), Education (secondary)
**Age Rating:** 4+
**Price:** Free (with IAP)

**Description:**
```
TinyMilestones helps parents support their child's development with AI-powered, age-appropriate play activities.

PERSONALIZED FOR YOUR CHILD
Enter your child's birthdate and get activities perfectly suited to their developmental stage — from newborn to 6 years.

COVERS ALL DEVELOPMENTAL AREAS
• 🧠 Cognitive development
• ✋ Fine motor skills
• 🏃 Gross motor skills
• 💬 Language development
• 💕 Social-emotional growth

USES WHAT YOU HAVE
No expensive toys needed. Every activity uses common household items you already own.

BACKED BY SCIENCE
Activities aligned with CDC and AAP developmental milestones, with explanations of why each activity matters.

FEATURES
• Unlimited AI-generated activities (Pro)
• Save favorites for easy access
• Track developmental milestones
• Daily activity reminders
• Works offline

Download TinyMilestones and make playtime purposeful!
```

---

## Timeline for iOS Development

### Phase 1: Setup (Week 1)
- [ ] Set up Expo project
- [ ] Configure Expo Router
- [ ] Set up Supabase client
- [ ] Configure RevenueCat
- [ ] Basic navigation structure

### Phase 2: Core Features (Weeks 2-3)
- [ ] Authentication (email, Google, Apple)
- [ ] Child profile CRUD
- [ ] Activity generation
- [ ] Activity cards and list
- [ ] Domain filtering
- [ ] Save/unsave activities

### Phase 3: Subscriptions (Week 4)
- [ ] RevenueCat integration
- [ ] Paywall screen
- [ ] Restore purchases
- [ ] Sync with web subscriptions

### Phase 4: iOS Features (Week 5)
- [ ] Push notifications
- [ ] Offline caching
- [ ] Haptic feedback
- [ ] Dark mode

### Phase 5: Polish & Submit (Week 6)
- [ ] Milestone tracking (if web has it)
- [ ] Testing on devices
- [ ] App Store screenshots
- [ ] Privacy policy page
- [ ] Submit to App Review

---

## Post-Launch iOS Roadmap

### v1.1 (Month 2)
- Widgets (home screen + lock screen)
- Share activities with caregivers
- Bug fixes from feedback

### v1.2 (Month 3)
- Photo memory journal
- Activity completion tracking
- Android launch (Expo makes this easy)

### v2.0 (Month 6)
- Siri shortcuts
- Apple Watch companion
- CarPlay for audio activities

---

*This document should be updated as the web app evolves.*
