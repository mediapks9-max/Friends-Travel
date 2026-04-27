import { createClient } from "@/lib/supabase/server";
import { Feed } from "@/components/Feed";
import type { Trip } from "@/lib/supabase/types";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch open trips with their owner profile, ordered by most recent first.
  const { data: trips, error } = await supabase
    .from("trips")
    .select(
      `
        *,
        owner:profiles!trips_owner_id_fkey (*)
      `,
    )
    .eq("status", "open")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("Failed to load trips:", error);
  }

  // Annotate each trip with is_mine / has_joined for the current user.
  const annotated: Trip[] = (trips ?? []).map((t: Trip) => ({
    ...t,
    is_mine: user?.id === t.owner_id,
  }));

  // For has_joined, batch-query the user's bookings.
  if (user) {
    const { data: myBookings } = await supabase
      .from("bookings")
      .select("trip_id")
      .eq("user_id", user.id)
      .in("status", ["pending", "accepted"]);

    const joinedIds = new Set(myBookings?.map((b) => b.trip_id) ?? []);
    annotated.forEach((t) => {
      t.has_joined = joinedIds.has(t.id);
    });
  }

  return (
    <main>
      <section className="text-center md:text-right py-10 mb-8 border-b border-line/30">
        <h1 className="font-serif font-black text-4xl md:text-5xl leading-tight mb-3">
          הולך לאנשהו?
          <br />
          <em className="text-accent not-italic">קח מישהו איתך.</em>
        </h1>
        <div className="font-mono text-xs text-ink-faint">
          No. 047 — Spring &apos;26
          <br />
          A field journal of plans, shared by people like you.
        </div>
      </section>

      <Feed initialTrips={annotated} />
    </main>
  );
}
