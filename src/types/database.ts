export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: "free" | "pro";
  subscription_status: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  payment_gateway: "stripe" | "razorpay" | null;
  razorpay_customer_id: string | null;
  razorpay_subscription_id: string | null;
  region: string;
  currency: string;
  region_source: "auto" | "manual";
  cultural_context: "universal" | "indian" | "auto";
  trial_ends_at: string | null;
  activities_generated_today: number;
  last_activity_reset: string;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  user_id: string;
  name: string;
  birthdate: string;
  avatar_emoji: string;
  preferences: ChildPreferences;
  created_at: string;
  updated_at: string;
}

export interface ChildPreferences {
  materials: "household" | "any";
  activity_duration: string;
  indoor_outdoor: "indoor" | "outdoor" | "both";
  notes: string;
}

export interface Activity {
  id: string;
  user_id: string;
  child_id: string;
  title: string;
  domain:
    | "Cognitive"
    | "Fine Motor"
    | "Gross Motor"
    | "Language"
    | "Social-Emotional";
  duration: string | null;
  description: string;
  why_it_matters: string | null;
  materials: string[];
  tip: string | null;
  illustration_key: string | null;
  is_cultural: boolean;
  cultural_origin: string | null;
  child_age_months: number;
  is_saved: boolean;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  child_id: string | null;
  domain_filter: string | null;
  activities_count: number;
  created_at: string;
}

export interface Milestone {
  id: string;
  age_months: number;
  domain: string;
  title: string;
  description: string | null;
  source: string;
  created_at: string;
}

export interface ChildMilestone {
  id: string;
  child_id: string;
  milestone_id: string;
  achieved: boolean;
  achieved_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface PaymentEvent {
  id: string;
  user_id: string;
  gateway: "stripe" | "razorpay";
  event_type: string;
  gateway_event_id: string | null;
  amount: number | null;
  currency: string | null;
  raw_payload: Record<string, unknown> | null;
  created_at: string;
}
