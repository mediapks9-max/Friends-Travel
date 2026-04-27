import { cn, colorForName, initials } from "@/lib/utils";
import type { Profile } from "@/lib/supabase/types";

type Props = {
  profile: Pick<Profile, "display_name" | "avatar_url">;
  size?: "sm" | "md" | "lg";
};

export function Avatar({ profile, size = "md" }: Props) {
  const sizeClass = {
    sm: "w-7 h-7 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-base",
  }[size];

  if (profile.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.avatar_url}
        alt={profile.display_name}
        className={cn("rounded-full object-cover border border-line", sizeClass)}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-paper border border-line",
        colorForName(profile.display_name),
        sizeClass,
      )}
      title={profile.display_name}
    >
      {initials(profile.display_name)}
    </div>
  );
}
