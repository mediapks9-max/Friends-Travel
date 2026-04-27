"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(translateAuthError(error.message));
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="max-w-md mx-auto py-10">
      <div className="paper-card p-8">
        <h1 className="font-serif font-black text-3xl mb-6">התחברות</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="אימייל">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3 py-2 bg-paper border border-line/40 rounded-sm focus:border-line focus:outline-none"
            />
          </Field>

          <Field label="סיסמה">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3 py-2 bg-paper border border-line/40 rounded-sm focus:border-line focus:outline-none"
            />
          </Field>

          {error && (
            <div className="bg-accent/10 border-r-4 border-accent text-accent-deep text-sm p-3 rounded-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-paper py-2.5 font-semibold hover:bg-accent transition-colors disabled:opacity-60"
          >
            {loading ? "מתחבר..." : "התחבר"}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-line/20 text-center text-sm text-ink-soft">
          אין לך חשבון?{" "}
          <Link href="/auth/signup" className="text-accent hover:underline">
            הרשמה
          </Link>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-faint mb-1">
        {label}
      </div>
      {children}
    </label>
  );
}

function translateAuthError(message: string): string {
  if (message.includes("Invalid login")) return "אימייל או סיסמה שגויים";
  if (message.includes("Email not confirmed"))
    return "האימייל עדיין לא אומת. בדוק את המייל שלך.";
  return message;
}
