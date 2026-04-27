"use client";

import { useState, useMemo } from "react";
import { TripCard } from "./TripCard";
import { Filters, type TypeFilter, type ReasonFilter } from "./Filters";
import type { Trip } from "@/lib/supabase/types";

type Props = {
  initialTrips: Trip[];
};

export function Feed({ initialTrips }: Props) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [reasonFilter, setReasonFilter] = useState<ReasonFilter>("all");

  // Filter the trips client-side. For 100s of trips this is fine.
  // When you have 10K+ trips, push the filter into the Supabase query.
  const visible = useMemo(() => {
    return initialTrips.filter((trip) => {
      if (typeFilter !== "all" && trip.trip_type !== typeFilter) return false;
      if (reasonFilter !== "all" && !trip.reasons.includes(reasonFilter))
        return false;
      return true;
    });
  }, [initialTrips, typeFilter, reasonFilter]);

  return (
    <>
      <Filters
        typeFilter={typeFilter}
        reasonFilter={reasonFilter}
        onTypeChange={setTypeFilter}
        onReasonChange={setReasonFilter}
      />

      {visible.length === 0 ? (
        <EmptyState
          hasFilters={typeFilter !== "all" || reasonFilter !== "all"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((trip, i) => (
            <TripCard key={trip.id} trip={trip} index={i} />
          ))}
        </div>
      )}
    </>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="paper-card p-10 text-center">
      <div className="font-serif text-2xl mb-2">
        {hasFilters ? "אין תוכניות שמתאימות לסינון" : "עדיין אין תוכניות"}
      </div>
      <p className="text-ink-soft text-sm">
        {hasFilters
          ? "נסה לשנות את הסינון, או היה הראשון להציע תוכנית."
          : "היה הראשון לשתף לאן אתה הולך."}
      </p>
    </div>
  );
}
