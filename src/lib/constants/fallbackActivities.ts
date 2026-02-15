import type { Activity } from "@/types/database";

// Fallback activities for when AI generation fails
const FALLBACK_BASE: Omit<Activity, "id" | "user_id" | "child_id" | "child_age_months" | "created_at">[] = [
  {
    title: "Sensory Discovery Bin",
    domain: "Cognitive",
    duration: "10-15 mins",
    description:
      "Fill a container with rice, dried pasta, or lentils. Hide small household toys inside and let your child dig through to find them.",
    why_it_matters:
      "Sensory play develops tactile processing and fine motor skills while building problem-solving abilities.",
    materials: ["Container", "Rice or pasta", "Small toys"],
    tip: "Place a towel underneath to make cleanup easier.",
    illustration_key: "sensory-explore",
    is_cultural: false,
    cultural_origin: null,
    is_saved: false,
    is_completed: false,
    completed_at: null,
  },
  {
    title: "Color Scavenger Hunt",
    domain: "Cognitive",
    duration: "10 mins",
    description:
      "Pick a color and ask your child to find 5 things around the house that match. Talk about each item they find.",
    why_it_matters:
      "Strengthens color recognition, classification skills, and vocabulary as children name and categorize objects.",
    materials: ["None needed"],
    tip: "Start with bright, common colors like red or blue.",
    illustration_key: "sort-match",
    is_cultural: false,
    cultural_origin: null,
    is_saved: false,
    is_completed: false,
    completed_at: null,
  },
  {
    title: "Kitchen Band",
    domain: "Language",
    duration: "5-10 mins",
    description:
      "Gather pots, pans, wooden spoons, and containers. Sing a song together while your child plays along with the kitchen instruments.",
    why_it_matters:
      "Music play develops rhythm awareness, language processing, and self-expression while building listening skills.",
    materials: ["Pots", "Wooden spoon", "Plastic containers"],
    tip: "Try playing fast and slow to teach tempo.",
    illustration_key: "music-sing",
    is_cultural: false,
    cultural_origin: null,
    is_saved: false,
    is_completed: false,
    completed_at: null,
  },
  {
    title: "Pillow Obstacle Course",
    domain: "Gross Motor",
    duration: "10-15 mins",
    description:
      "Create a simple obstacle course using pillows, cushions, and blankets. Have your child crawl over, under, and around them.",
    why_it_matters:
      "Develops balance, coordination, spatial awareness, and gross motor planning essential for physical development.",
    materials: ["Pillows", "Cushions", "Blankets"],
    tip: "Change the course each time to keep it exciting.",
    illustration_key: "outdoor-run",
    is_cultural: false,
    cultural_origin: null,
    is_saved: false,
    is_completed: false,
    completed_at: null,
  },
];

// Indian cultural fallback activities
const FALLBACK_DESI: Omit<Activity, "id" | "user_id" | "child_id" | "child_age_months" | "created_at">[] = [
  {
    title: "Dal Sorting Game (Daal Chhantna)",
    domain: "Fine Motor",
    duration: "10 mins",
    description:
      "Mix two types of dal (e.g., chana dal and moong dal) and ask your child to sort them into separate bowls. Start with bigger dals for younger children.",
    why_it_matters:
      "This traditional Indian household activity develops pincer grip, visual discrimination, and patience\u2014skills generations of Indian children learned while helping in the kitchen.",
    materials: ["Two types of dal", "Small bowls", "Tray"],
    tip: "Make it a game by timing how fast they can sort a small handful.",
    illustration_key: "sort-match",
    is_cultural: true,
    cultural_origin: "indian",
    is_saved: false,
    is_completed: false,
    completed_at: null,
  },
  {
    title: "Rangoli Patterns",
    domain: "Fine Motor",
    duration: "10-15 mins",
    description:
      "Draw a simple rangoli pattern with chalk or use rice flour. Help your child fill in the patterns with flower petals, colored rice, or chalk colors.",
    why_it_matters:
      "Rangoli making has been a cherished Indian tradition for centuries. It develops fine motor control, creativity, and an appreciation for cultural art forms.",
    materials: ["Chalk or rice flour", "Flower petals or colored rice"],
    tip: "Start with simple dots and lines, then progress to more complex patterns.",
    illustration_key: "draw-color",
    is_cultural: true,
    cultural_origin: "indian",
    is_saved: false,
    is_completed: false,
    completed_at: null,
  },
];

export function getFallbackActivities(isCultural: boolean): typeof FALLBACK_BASE {
  if (isCultural) {
    return [...FALLBACK_BASE.slice(0, 2), ...FALLBACK_DESI, ...FALLBACK_BASE.slice(2)];
  }
  return FALLBACK_BASE;
}
