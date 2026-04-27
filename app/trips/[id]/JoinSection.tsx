"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { joinTrip, cancelMyBooking } from "../actions";
import type { Booking } from "@/lib/supabase/types";

type Props = {
  tripId: string;
  myBooking: Booking | null;
  isFull: boolean;
  isLoggedIn: boolean;
};

export function JoinSection({
  tripId,
  myBooking,
  isFull,
  isLoggedIn,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!isLoggedIn) {
    return (
      <div className="paper-card p-5 text-center">
        <p className="mb-3 text-ink-soft">צריך להתחבר כדי להצטרף לתוכניות</p>
        <Link
          href="/auth/login"
          className="inline-block bg-ink text-paper px-6 py-2.5 font-semibold hover:bg-accent transition-colors"
        >
          התחברות
        </Link>
      </div>
    );
  }

  if (myBooking) {
    return (
      <div className="paper-card p-5">
        <div className="text-sm font-semibold uppercase tracking-wider text-ink-faint mb-2">
          הסטטוס שלך
        </div>
        <StatusBadge status={myBooking.status} />
        {myBooking.status === "pending" && (
          <button
            onClick={() => {
              startTransition(async () => {
                const result = await cancelMyBooking(myBooking.id);
                if (result.error) setError(result.error);
              });
            }}
            disabled={pending}
            className="mt-4 text-sm text-ink-faint hover:text-accent transition-colors disabled:opacity-60"
          >
            ביטול הבקשה
          </button>
        )}
      </div>
    );
  }

  if (isFull) {
    return (
      <div className="paper-card p-5 text-center text-ink-soft">
        התוכנית מלאה — אין מקומות פנויים
      </div>
    );
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-ink text-paper py-3 font-semibold hover:bg-accent transition-colors"
      >
        להצטרף לתוכנית
      </button>
    );
  }

  return (
    <div className="paper-card p-5">
      <h3 className="font-serif font-bold text-lg mb-3">בקשת הצטרפות</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="הודעה קצרה לבעל התוכנית (אופציונלי)"
        className="w-full px-3 py-2 bg-paper border border-line/40 rounded-sm focus:border-line focus:outline-none resize-none mb-3"
      />

      {error && (
        <div className="bg-accent/10 border-r-4 border-accent text-accent-deep text-sm p-2 rounded-sm mb-3">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await joinTrip(tripId, message || null);
              if (result.error) setError(result.error);
              else setShowForm(false);
            });
          }}
          disabled={pending}
          className="flex-1 bg-ink text-paper py-2.5 font-semibold hover:bg-accent transition-colors disabled:opacity-60"
        >
          {pending ? "שולח..." : "שלח בקשה"}
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="px-4 py-2.5 border border-line/40 hover:bg-paper-deep transition-colors"
        >
          ביטול
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Booking["status"] }) {
  const map = {
    pending: { label: "ממתין לאישור", class: "text-gold" },
    accepted: { label: "אושר ✓ אתה במפגש", class: "text-olive" },
    declined: { label: "הבקשה נדחתה", class: "text-accent" },
  } as const;
  const { label, class: cls } = map[status];
  return <div className={`font-medium ${cls}`}>{label}</div>;
}
