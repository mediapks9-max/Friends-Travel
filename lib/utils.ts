import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import { he } from "date-fns/locale";

/**
 * Combines class names with Tailwind merging.
 * Used everywhere — `cn("p-4", isActive && "bg-accent")`.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Picks an avatar color from a stable palette based on a string.
 * Same name always produces the same color.
 */
const AVATAR_COLORS = [
  "bg-gold",
  "bg-accent",
  "bg-olive",
  "bg-sea",
  "bg-plum",
  "bg-accent-deep",
];

export function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * Returns the first 1-2 characters of each word — Hebrew-friendly initials.
 * "נועה לוי" → "נל"
 */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0)).join("");
}

/**
 * Formats a timestamp in friendly Hebrew.
 * "2026-05-17T03:00:00Z" → "שבת, 17 במאי · 03:00"
 * Today / tomorrow get special labels.
 */
export function formatHebrewDate(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) {
    return `היום · ${format(date, "HH:mm")}`;
  }
  if (isTomorrow(date)) {
    return `מחר · ${format(date, "HH:mm")}`;
  }
  return format(date, "EEEE, d בMMMM · HH:mm", { locale: he });
}

/**
 * Relative time — used for booking timestamps.
 * "לפני 3 שעות"
 */
export function relativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: he });
}

/**
 * Maps a trip type to its Hebrew stamp label.
 */
export function stampLabel(type: "travel" | "local" | "activity"): string {
  return { travel: "טיול", local: "מקומי", activity: "פעילות" }[type];
}
