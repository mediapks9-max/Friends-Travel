import type { TripType } from "@/lib/supabase/types";

type Props = { type: TripType };

/**
 * Illustration banner for a trip card. Three flavors — travel, local, activity.
 * Original SVGs from index.html, kept pixel-perfect.
 */
export function TripCover({ type }: Props) {
  return (
    <div className="aspect-[2/1] w-full overflow-hidden border-b border-line">
      {type === "travel" && <TravelSVG />}
      {type === "local" && <LocalSVG />}
      {type === "activity" && <ActivitySVG />}
    </div>
  );
}

function TravelSVG() {
  return (
    <svg
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect width="320" height="160" fill="#e8d4a8" />
      <path
        d="M0 110 Q80 80 160 100 T320 95 L320 160 L0 160 Z"
        fill="#6b7d3a"
        opacity="0.7"
      />
      <path
        d="M0 130 Q100 110 200 125 T320 120 L320 160 L0 160 Z"
        fill="#4a3826"
        opacity="0.5"
      />
      <circle cx="60" cy="40" r="22" fill="#d9a441" />
      <path
        d="M40 70 L60 50 L80 70 L100 45 L120 65 L140 50 L160 70"
        stroke="#1a1410"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

function LocalSVG() {
  return (
    <svg
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect width="320" height="160" fill="#ecdfc4" />
      <rect x="20" y="60" width="60" height="80" fill="#c8472b" stroke="#1a1410" strokeWidth="1.5" />
      <rect x="90" y="40" width="50" height="100" fill="#d9a441" stroke="#1a1410" strokeWidth="1.5" />
      <rect x="150" y="70" width="70" height="70" fill="#6b3a4a" stroke="#1a1410" strokeWidth="1.5" />
      <rect x="230" y="50" width="60" height="90" fill="#2e7a8a" stroke="#1a1410" strokeWidth="1.5" />
      <rect x="32" y="75" width="10" height="14" fill="#1a1410" opacity="0.4" />
      <rect x="58" y="75" width="10" height="14" fill="#1a1410" opacity="0.4" />
      <rect x="100" y="55" width="10" height="14" fill="#1a1410" opacity="0.4" />
      <rect x="120" y="55" width="10" height="14" fill="#1a1410" opacity="0.4" />
    </svg>
  );
}

function ActivitySVG() {
  return (
    <svg
      viewBox="0 0 320 160"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <rect width="320" height="160" fill="#f0e0c4" />
      <circle cx="80" cy="80" r="35" fill="#c8472b" stroke="#1a1410" strokeWidth="1.5" />
      <path d="M65 65 L95 80 L65 95 Z" fill="#1a1410" />
      <circle cx="180" cy="100" r="28" fill="none" stroke="#1a1410" strokeWidth="1.5" />
      <path d="M165 100 L195 100 M180 85 L180 115" stroke="#1a1410" strokeWidth="1.5" />
      <path d="M240 50 L270 50 L255 80 Z" fill="#6b7d3a" stroke="#1a1410" strokeWidth="1.5" />
      <path d="M230 110 Q255 90 280 110" stroke="#1a1410" strokeWidth="2" fill="none" />
    </svg>
  );
}
