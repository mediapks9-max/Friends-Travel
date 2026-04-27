import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TripCard } from "@/components/TripCard";
import { cn } from "@/lib/utils";
import type { Trip } from "@/lib/supabase/types";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function MyTripsPage({ searchParams }: Props) {
  const { tab = "mine" } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  let trips: Trip[] = [];

  if (tab === "mine") {
    const { data } = await supabase
      .from("trips")
      .select(`*, owner:profiles!trips_owner_id_fkey (*)`)
      .eq("owner_id", user.id)
      .order("starts_at", { ascending: true });
    trips = (data ?? []).map((t: Trip) => ({ ...t, is_mine: true }));
  } else {
    const { data: bookings } = await supabase
      .from("bookings")
      .select(
        `
          status,
          trip:trips!bookings_trip_id_fkey (
            *,
            owner:profiles!trips_owner_id_fkey (*)
          )
        `,
      )
      .eq("user_id", user.id)
      .in("status", ["pending", "accepted"]);

    trips = (bookings ?? [])
      .map((b: { trip: Trip | null }) => b.trip)
      .filter((t): t is Trip => t !== null)
      .map((t) => ({ ...t, has_joined: true }));
  }

  return (
    <main>
      <h1 className="font-serif font-black text-3xl mb-1">התוכניות שלי</h1>

      <div className="flex gap-1 mb-8 mt-6 border-b border-line/30">
        <Tab href="/my-trips?tab=mine" active={tab === "mine"}>
          יצרתי ({tab === "mine" ? trips.length : "..."})
        </Tab>
        <Tab href="/my-trips?tab=joined" active={tab === "joined"}>
          הצטרפתי ({tab === "joined" ? trips.length : "..."})
        </Tab>
      </div>

      {trips.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((t, i) => (
            <TripCard key={t.id} trip={t} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}

function Tab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-4 py-2.5 text-sm font-medium transition-colors -mb-[1.5px]",
        active
          ? "border-b-2 border-accent text-ink"
          : "text-ink-soft hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}

function EmptyState({ tab }: { tab: string }) {
  return (
    <div className="paper-card p-10 text-center">
      <div className="font-serif text-2xl mb-2">
        {tab === "mine" ? "עוד לא יצרת תוכניות" : "עוד לא הצטרפת לתוכניות"}
      </div>
      <p className="text-ink-soft text-sm mb-5">
        {tab === "mine"
          ? "שתף לאן אתה הולך ומצא חברים לדרך."
          : "גלה תוכניות באזור ותהיה מוכן לאתגר."}
      </p>
      <Link
        href={tab === "mine" ? "/trips/new" : "/"}
        className="inline-block bg-ink text-paper px-6 py-2.5 font-semibold hover:bg-accent transition-colors"
      >
        {tab === "mine" ? "+ שתף תוכנית" : "גלה תוכניות"}
      </Link>
    </div>
  );
}
