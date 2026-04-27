"use client";

import { useState, useTransition } from "react";
import { Avatar } from "@/components/Avatar";
import { updateBookingStatus } from "../actions";
import { relativeTime } from "@/lib/utils";
import type { Booking } from "@/lib/supabase/types";

type Props = { bookings: Booking[] };

export function OwnerRequests({ bookings }: Props) {
  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <RequestCard key={b.id} booking={b} />
      ))}
    </div>
  );
}

function RequestCard({ booking }: { booking: Booking }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDecision(status: "accepted" | "declined") {
    setError(null);
    startTransition(async () => {
      const result = await updateBookingStatus(booking.id, status);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="paper-card p-4">
      <div className="flex items-start gap-3">
        <Avatar profile={booking.user} size="md" />

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div className="font-medium">{booking.user.display_name}</div>
            <div className="text-xs text-ink-faint">
              {relativeTime(booking.created_at)}
            </div>
          </div>

          {booking.message && (
            <p className="text-sm text-ink-soft mt-1.5 italic">
              "{booking.message}"
            </p>
          )}

          {error && (
            <div className="text-sm text-accent mt-2">{error}</div>
          )}

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleDecision("accepted")}
              disabled={pending}
              className="bg-olive text-paper px-4 py-1.5 text-sm font-semibold hover:bg-ink transition-colors disabled:opacity-60"
            >
              אישור
            </button>
            <button
              onClick={() => handleDecision("declined")}
              disabled={pending}
              className="border border-line/40 px-4 py-1.5 text-sm hover:bg-paper-deep transition-colors disabled:opacity-60"
            >
              דחייה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
