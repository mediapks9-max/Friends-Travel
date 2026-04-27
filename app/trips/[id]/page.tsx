import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TripCover } from "@/components/TripCover";
import { Avatar } from "@/components/Avatar";
import { JoinSection } from "./JoinSection";
import { OwnerRequests } from "./OwnerRequests";
import {
  formatHebrewDate,
  relativeTime,
  stampLabel,
  cn,
} from "@/lib/utils";
import type { Trip, Booking } from "@/lib/supabase/types";

type Props = { params: Promise<{ id: string }> };

export default async function TripPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch trip with owner profile
  const { data: trip, error } = await supabase
    .from("trips")
    .select(
      `
        *,
        owner:profiles!trips_owner_id_fkey (*)
      `,
    )
    .eq("id", id)
    .single<Trip>();

  if (error || !trip) notFound();

  // Fetch bookings — RLS limits to ones the user can see
  const { data: bookings } = await supabase
    .from("bookings")
    .select(
      `
        *,
        user:profiles!bookings_user_id_fkey (*)
      `,
    )
    .eq("trip_id", id)
    .returns<Booking[]>();

  const isOwner = user?.id === trip.owner_id;
  const myBooking = bookings?.find((b) => b.user_id === user?.id) ?? null;
  const accepted = bookings?.filter((b) => b.status === "accepted") ?? [];
  const pending = bookings?.filter((b) => b.status === "pending") ?? [];

  const stampColor = {
    travel: "border-accent text-accent",
    local: "border-sea text-sea",
    activity: "border-olive text-olive",
  }[trip.trip_type];

  return (
    <main className="max-w-3xl mx-auto py-6">
      <article className="paper-card overflow-hidden">
        <TripCover type={trip.trip_type} />

        <div className="p-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={cn("stamp", stampColor)}>
              {stampLabel(trip.trip_type)}
            </span>
            <span className="text-ink-soft text-sm">
              {formatHebrewDate(trip.starts_at)}
            </span>
          </div>

          <h1 className="font-serif font-black text-4xl leading-tight mb-3">
            {trip.title}
          </h1>

          {trip.location_text && (
            <div className="text-ink-soft mb-4">📍 {trip.location_text}</div>
          )}

          {trip.description && (
            <p className="text-ink-soft text-base leading-relaxed mb-6 whitespace-pre-wrap">
              {trip.description}
            </p>
          )}

          {trip.reasons.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {trip.reasons.map((reason) => (
                <span key={reason} className="reason-chip">
                  {reason}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-6 border-t border-line/20">
            <Avatar profile={trip.owner} size="md" />
            <div>
              <div className="font-medium">{trip.owner.display_name}</div>
              <div className="text-xs text-ink-faint">
                פרסם {relativeTime(trip.created_at)}
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Attendees */}
      {accepted.length > 0 && (
        <section className="mt-6">
          <h2 className="font-serif font-bold text-xl mb-3">
            מצטרפים ({accepted.length}/{trip.max_participants})
          </h2>
          <div className="flex flex-wrap gap-3">
            {accepted.map((b) => (
              <div
                key={b.id}
                className="paper-card px-3 py-2 flex items-center gap-2"
              >
                <Avatar profile={b.user} size="sm" />
                <span className="text-sm">{b.user.display_name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Owner: pending requests */}
      {isOwner && pending.length > 0 && (
        <section className="mt-8">
          <h2 className="font-serif font-bold text-xl mb-3">
            בקשות ממתינות ({pending.length})
          </h2>
          <OwnerRequests bookings={pending} />
        </section>
      )}

      {/* Non-owner: join form or status */}
      {!isOwner && (
        <section className="mt-8">
          <JoinSection
            tripId={trip.id}
            myBooking={myBooking}
            isFull={accepted.length >= trip.max_participants}
            isLoggedIn={!!user}
          />
        </section>
      )}
    </main>
  );
}
