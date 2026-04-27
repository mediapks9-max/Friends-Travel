import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewTripForm } from "./NewTripForm";

export default async function NewTripPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <main className="max-w-2xl mx-auto py-6">
      <h1 className="font-serif font-black text-3xl mb-1">
        שתף <em className="text-accent not-italic">לאן אתה הולך</em>
      </h1>
      <p className="text-ink-soft text-sm mb-8">
        תיאור קצר וברור עוזר לאנשים להחליט אם להצטרף.
      </p>

      <NewTripForm />
    </main>
  );
}
