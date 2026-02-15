import { calculateAgeInMonths, formatAge, getDevelopmentalStage } from "@/lib/utils/age";
import { ACTIVITY_ARCHETYPES } from "@/lib/constants/illustrations";
import type { Child } from "@/types/database";

function getIndianFestivalContext(): string {
  const month = new Date().getMonth();
  const festivals: Record<number, string> = {
    0: "Makar Sankranti / Pongal / Republic Day season",
    2: "Holi season",
    3: "Baisakhi / Vishu / Ugadi season",
    7: "Raksha Bandhan / Independence Day season",
    8: "Ganesh Chaturthi / Onam season",
    9: "Navratri / Dussehra season",
    10: "Diwali / Children's Day season",
    11: "Christmas / year-end celebration season",
  };
  return festivals[month] || "";
}

function getCulturalContextPrompt(
  culturalContext: string,
  childName: string,
  ageMonths: number,
  count: number
): string {
  if (culturalContext !== "indian") return "";

  const festival = getIndianFestivalContext();
  const festivalLine = festival
    ? `Current season: ${festival}. Feel free to include a festival-themed activity if appropriate.`
    : "";

  return `
CULTURAL CONTEXT - INDIAN (DESI) ACTIVITIES:
Include 1-2 activities (out of ${count} total) inspired by traditional Indian childhood play and games.
These should be nostalgic activities that Indian parents remember from their own childhoods (especially the 80s/90s era before smartphones).

Examples to draw from (adapt to ${childName}'s age of ${ageMonths} months):
- Gilli-danda (stick game) - Gross Motor, ages 4+
- Pitthu / Lagori (seven stones) - Gross Motor, ages 4+
- Kanche (marbles) - Fine Motor, ages 3+
- Langdi (one-leg tag) - Gross Motor, ages 4+
- Stapu / Hopscotch (Indian version) - Gross Motor, ages 3+
- Rangoli making (with rice flour, petals, or colors) - Fine Motor/Cognitive, ages 2+
- Clay diya making - Fine Motor, ages 2+
- Paper boats (kagaz ki kashti) - Fine Motor, ages 3+
- Antakshari (song game) - Language, ages 3+
- Chidiya ud (bird flies / action game) - Cognitive/Language, ages 2+
- Poshampa (similar to London Bridge) - Social-Emotional/Gross Motor, ages 2+
- Lattu (spinning top) - Fine Motor, ages 3+
- Spice smelling game (haldi, jeera, elaichi) - Cognitive/Sensory, ages 1+
- Panchatantra/Jataka tales storytelling - Language, ages 2+
- Festival-themed crafts (Diwali diyas, Holi colors, Rakhi making)
- Dal/rice sorting games - Cognitive/Fine Motor, ages 2+

IMPORTANT for desi activities:
- For babies under 18 months: focus on sensory versions (smelling spices, touching rangoli textures, hearing folk songs)
- For toddlers 18-36 months: use simplified versions of traditional games
- For 3-6 year olds: use the actual games with age-appropriate rules
- Use both Hindi/regional name AND English description
- Note the cultural significance in "whyItMatters"
- Use Indian household materials: rice, dal, haldi, flowers, old dupattas, steel utensils, chalk
${festivalLine}
`;
}

export function buildActivityPrompt(
  child: Child,
  domain: string,
  culturalContext: string,
  count: number = 4
): string {
  const ageInMonths = calculateAgeInMonths(child.birthdate);
  const ageDisplay = formatAge(ageInMonths);
  const stage = getDevelopmentalStage(ageInMonths);
  const archetypeList = ACTIVITY_ARCHETYPES.join(", ");

  return `You are a child development expert with deep knowledge of CDC and AAP developmental milestones. Generate ${count} unique, engaging developmental activities for a ${ageInMonths}-month-old child named ${child.name}.

CHILD CONTEXT:
- Age: ${ageInMonths} months (${ageDisplay})
- Developmental stage: ${stage}

FOCUS DOMAIN: ${domain === "all" ? "Mix of cognitive, fine motor, gross motor, language, and social-emotional" : domain}

PARENT PREFERENCES:
${child.preferences.materials === "household" ? "- Use ONLY common household items (no special toys needed)" : "- Can suggest specific toys if helpful"}
${child.preferences.indoor_outdoor !== "both" ? `- ${child.preferences.indoor_outdoor} activities preferred` : ""}
${child.preferences.notes ? `- Parent notes: ${child.preferences.notes}` : ""}
${getCulturalContextPrompt(culturalContext, child.name, ageInMonths, count)}
REQUIREMENTS:
1. Activities must be age-appropriate and safe
2. Each activity should take 5-15 minutes
3. Instructions should be clear and actionable for parents
4. Include developmental benefits explanation
5. Suggest modifications for slightly younger/older if applicable

OUTPUT FORMAT:
Return a JSON array with exactly ${count} objects. Each object must have:
- "title": Catchy, parent-friendly name (3-5 words)
- "domain": One of "Cognitive", "Fine Motor", "Gross Motor", "Language", "Social-Emotional"
- "duration": Time estimate like "5-10 mins"
- "description": 2-3 sentences explaining what to do, written TO the parent using "you" and "${child.name}"
- "whyItMatters": 1-2 sentences on developmental benefit (be specific about skills)
- "materials": Array of 1-4 items needed (or ["None needed"])
- "tip": One practical pro tip for success
- "illustrationKey": Pick the SINGLE best match from: [${archetypeList}]
- "isCultural": true if this is a culturally-specific activity, false otherwise

Return ONLY the JSON array, no markdown formatting or other text.`;
}
