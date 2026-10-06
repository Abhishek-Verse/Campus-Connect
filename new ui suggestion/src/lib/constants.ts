export const COLLEGE = {
  name: "Thakur College of Engineering & Technology",
  short: "TCET",
  city: "Mumbai",
} as const;

export const CATEGORIES = [
  { id: "technical", label: "Technical", color: "#0F766E", icon: "Cpu" },
  { id: "cultural", label: "Cultural", color: "#C2185B", icon: "Palette" },
  { id: "sports", label: "Sports", color: "#3F6212", icon: "Trophy" },
  { id: "workshop", label: "Workshops", color: "#B45309", icon: "GraduationCap" },
  { id: "hackathon", label: "Hackathons", color: "#181611", icon: "Code2" },
  { id: "seminar", label: "Seminars", color: "#1D4ED8", icon: "Mic" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export function categoryMeta(id: string) {
  const found = CATEGORIES.find((c) => c.id === id);
  return found ?? CATEGORIES[0];
}

export const INTERESTS = [
  "Coding",
  "AI / ML",
  "Design",
  "Robotics",
  "Music",
  "Dance",
  "Sports",
  "Entrepreneurship",
  "Photography",
  "Gaming",
  "Public Speaking",
  "Cybersecurity",
] as const;

export const PRESET_POSTERS = [
  { src: "/posters/hackathon.jpg", label: "Hackathon night" },
  { src: "/posters/cultural.jpg", label: "Cultural fest" },
  { src: "/posters/sports.jpg", label: "Sports arena" },
  { src: "/posters/workshop.jpg", label: "Workshop studio" },
  { src: "/posters/ai.jpg", label: "AI abstract" },
  { src: "/posters/robotics.jpg", label: "Robotics arena" },
  { src: "/posters/music.jpg", label: "Live music" },
  { src: "/posters/design.jpg", label: "Design studio" },
] as const;

/** Gradient fallback pairs per category (used when an event has no poster). */
export const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  technical: ["#0B2B28", "#0F766E"],
  cultural: ["#33101F", "#C2185B"],
  sports: ["#14200A", "#3F6212"],
  workshop: ["#2B1A08", "#B45309"],
  hackathon: ["#2A0F08", "#E8442E"],
  seminar: ["#0E1B3D", "#1D4ED8"],
};
