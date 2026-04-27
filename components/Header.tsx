import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="flex items-center justify-between gap-4 py-7 border-b border-line mb-8 flex-wrap">
      <Link href="/" className="flex items-center gap-2.5 group">
        <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9">
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="currentColor"
            strokeWidth="2"
            className="text-ink"
          />
          <path
            d="M10 22 L16 8 L22 22 L16 18 Z"
            className="fill-accent stroke-ink"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-serif font-black text-3xl tracking-tight">
          יאללה<span className="text-accent italic">.</span>
        </span>
      </Link>

      <nav className="flex gap-1 text-sm">
        <NavLink href="/">גלה</NavLink>
        {user && <NavLink href="/my-trips?tab=mine">התוכניות שלי</NavLink>}
        {user && <NavLink href="/my-trips?tab=joined">הצטרפתי</NavLink>}
      </nav>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link
              href="/trips/new"
              className="bg-ink text-paper px-4 py-2 text-sm font-semibold hover:bg-accent transition-colors"
            >
              + שתף תוכנית
            </Link>
            <SignOutButton />
          </>
        ) : (
          <Link
            href="/auth/login"
            className="bg-ink text-paper px-4 py-2 text-sm font-semibold hover:bg-accent transition-colors"
          >
            התחברות
          </Link>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 text-ink-soft hover:text-ink hover:bg-paper-deep rounded-sm transition-colors"
    >
      {children}
    </Link>
  );
}
