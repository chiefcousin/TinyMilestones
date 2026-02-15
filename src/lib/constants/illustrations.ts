export const ACTIVITY_ARCHETYPES = [
  "sensory-explore",
  "build-stack",
  "draw-color",
  "cut-paste",
  "outdoor-run",
  "ball-play",
  "music-sing",
  "story-read",
  "pretend-play",
  "water-play",
  "sort-match",
  "cook-food",
  "nature-explore",
  "dance-move",
  "social-game",
  "clay-dough",
  "thread-lace",
  "pour-transfer",
  "mirror-faces",
  "hide-seek",
] as const;

export type ActivityArchetype = (typeof ACTIVITY_ARCHETYPES)[number];

// Maps each archetype to a primary and secondary Lucide icon name
export const ARCHETYPE_ICONS: Record<
  ActivityArchetype,
  { primary: string; secondary?: string; label: string }
> = {
  "sensory-explore": {
    primary: "Hand",
    secondary: "Sparkles",
    label: "Sensory Exploration",
  },
  "build-stack": {
    primary: "Blocks",
    secondary: "ArrowUp",
    label: "Building & Stacking",
  },
  "draw-color": {
    primary: "Palette",
    secondary: "Pencil",
    label: "Drawing & Coloring",
  },
  "cut-paste": {
    primary: "Scissors",
    secondary: "FileText",
    label: "Cutting & Pasting",
  },
  "outdoor-run": {
    primary: "TreePine",
    secondary: "Wind",
    label: "Outdoor Running",
  },
  "ball-play": {
    primary: "Circle",
    secondary: "ArrowRight",
    label: "Ball Play",
  },
  "music-sing": {
    primary: "Music",
    secondary: "Mic2",
    label: "Music & Singing",
  },
  "story-read": {
    primary: "BookOpen",
    secondary: "MessageCircle",
    label: "Story & Reading",
  },
  "pretend-play": {
    primary: "Drama",
    secondary: "Wand2",
    label: "Pretend Play",
  },
  "water-play": {
    primary: "Droplets",
    secondary: "Waves",
    label: "Water Play",
  },
  "sort-match": {
    primary: "LayoutGrid",
    secondary: "ArrowDownUp",
    label: "Sorting & Matching",
  },
  "cook-food": {
    primary: "ChefHat",
    secondary: "Utensils",
    label: "Cooking & Food",
  },
  "nature-explore": {
    primary: "Leaf",
    secondary: "Bug",
    label: "Nature Exploration",
  },
  "dance-move": {
    primary: "Music2",
    secondary: "Move",
    label: "Dance & Movement",
  },
  "social-game": {
    primary: "Users",
    secondary: "Handshake",
    label: "Social Games",
  },
  "clay-dough": {
    primary: "Shapes",
    secondary: "Hand",
    label: "Clay & Dough",
  },
  "thread-lace": {
    primary: "Cable",
    secondary: "Gem",
    label: "Threading & Lacing",
  },
  "pour-transfer": {
    primary: "GlassWater",
    secondary: "ArrowRightLeft",
    label: "Pouring & Transferring",
  },
  "mirror-faces": {
    primary: "Smile",
    secondary: "ScanFace",
    label: "Mirror & Faces",
  },
  "hide-seek": {
    primary: "Eye",
    secondary: "EyeOff",
    label: "Hide & Seek",
  },
};
