import Link from "next/link";
import { TripCover } from "./TripCover";
import { Avatar } from "./Avatar";
import { cn, formatHebrewDate, stampLabel } from "@/lib/utils";
import type { Trip } from "@/lib/supabase/types";

type Props = {
  trip: Trip;
  index?: number;
};

export function TripCard({ trip, index = 0 }: Props) {
  // Hand-arranged tilt — same logic as the original renderFeed.
  const tilt =
    index % 5 === 1 ? "tilt-1" : index % 5 === 3 ? "tilt-2" : "";

  const stampColor = {
    travel: "border-accent text-accent",
    local: "border-sea text-sea",
    activity: "border-olive text-olive",
  }[trip.trip_type];

  return (
    <article
      className={cn(
        "paper-card overflow-hidden hover:shadow-paper transition-shadow",
        tilt,
      )}
    >
      <TripCover type={trip.trip_type} />

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className={cn("stamp", stampColor)}>
            {stampLabel(trip.trip_type)}
          </span>
          <span className="text-ink-faint text-xs">
            {formatHebrewDate(trip.starts_at)}
          </span>
        </div>

        <h2 className="font-serif font-bold text-2xl leading-tight mb-1">
          {trip.title}
        </h2>

        {trip.location_text && (
          <div className="text-ink-faint text-xs mb-3">
            {trip.location_text}
          </div>
        )}

        {trip.description && (
          <p className="text-ink-soft text-sm mb-4 line-clamp-3">
            {trip.description}
          </p>
        )}

        {trip.reasons.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-4">
            {trip.reasons.map((reason) => (
              <span key={reason} className="reason-chip">
                {reason}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-line/20">
          <div className="flex items-center gap-2">
            <Avatar profile={trip.owner} size="sm" />
            <div>
              <div className="text-sm font-medium">{trip.owner.display_name}</div>
              <div className="text-xs text-ink-faint">
                עד {trip.max_participants} אנשים
              </div>
            </div>
          </div>

          <Link
            href={`/trips/${trip.id}`}
            className="bg-ink text-paper px-4 py-2 text-sm font-semibold hover:bg-accent transition-colors"
          >
            {trip.is_mine
              ? "פרטים"
              : trip.has_joined
                ? "הצטרפת ✓"
                : "להצטרף"}
          </Link>
        </div>
      </div>
    </article>
  );
}
