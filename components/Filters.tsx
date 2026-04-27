"use client";

import { cn } from "@/lib/utils";
import type { TripType, TripReason } from "@/lib/supabase/types";

export type TypeFilter = "all" | TripType;
export type ReasonFilter = "all" | TripReason;

type Props = {
  typeFilter: TypeFilter;
  reasonFilter: ReasonFilter;
  onTypeChange: (t: TypeFilter) => void;
  onReasonChange: (r: ReasonFilter) => void;
};

const TYPES: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "הכל" },
  { value: "travel", label: "✈ טיול" },
  { value: "local", label: "📍 מקומי" },
  { value: "activity", label: "✦ פעילות" },
];

const REASONS: { value: ReasonFilter; label: string }[] = [
  { value: "all", label: "הכל" },
  { value: "חברה", label: "חברה" },
  { value: "טיפים מקומיים", label: "טיפים מקומיים" },
  { value: "חלוקת הוצאות", label: "חלוקת הוצאות" },
  { value: "תרגול", label: "תרגול" },
];

export function Filters({
  typeFilter,
  reasonFilter,
  onTypeChange,
  onReasonChange,
}: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-6 pb-4 border-b border-line/30">
      <span className="text-xs text-ink-faint font-semibold uppercase tracking-wider ml-1">
        סוג
      </span>
      {TYPES.map((t) => (
        <Chip
          key={t.value}
          active={typeFilter === t.value}
          onClick={() => onTypeChange(t.value)}
        >
          {t.label}
        </Chip>
      ))}

      <span className="text-xs text-ink-faint font-semibold uppercase tracking-wider mr-auto ml-1">
        סיבה
      </span>
      {REASONS.map((r) => (
        <Chip
          key={r.value}
          active={reasonFilter === r.value}
          onClick={() => onReasonChange(r.value)}
        >
          {r.label}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-sm border rounded-sm transition-colors",
        active
          ? "bg-ink text-paper border-ink"
          : "bg-paper-deep border-line/40 text-ink-soft hover:border-line hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
