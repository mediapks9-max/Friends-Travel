"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 8) {
      setError("הסיסמה חייבת להיות לפחות 8 תווים");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="max-w-md mx-auto py-10">
      <div className="paper-card p-8">
        <h1 className="font-serif font-black text-3xl mb-6">הרשמה</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="שם פרטי">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              minLength={2}
              maxLength={40}
              className="w-full px-3 py-2 bg-paper border border-line/40 rounded-sm focus:border-line focus:outline-none"
              placeholder="איך אנשים יראו אותך"
            />
          </Field>

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
              minLength={8}
              autoComplete="new-password"
              className="w-full px-3 py-2 bg-paper border border-line/40 rounded-sm focus:border-line focus:outline-none"
            />
            <div className="text-xs text-ink-faint mt-1">לפחות 8 תווים</div>
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
            {loading ? "יוצר חשבון..." : "צור חשבון"}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-line/20 text-center text-sm text-ink-soft">
          כבר יש לך חשבון?{" "}
          <Link href="/auth/login" className="text-accent hover:underline">
            התחברות
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
