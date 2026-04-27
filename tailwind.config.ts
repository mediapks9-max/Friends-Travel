import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Yalla design tokens — copied directly from your original index.html
        paper: {
          DEFAULT: "#f5ecd9",
          deep: "#ecdfc4",
        },
        ink: {
          DEFAULT: "#1a1410",
          soft: "#4a3826",
          faint: "#8a7a5e",
        },
        accent: {
          DEFAULT: "#c8472b",
          deep: "#a8341f",
        },
        gold: "#d9a441",
        olive: "#6b7d3a",
        sea: "#2e7a8a",
        plum: "#6b3a4a",
        line: "#2a1f12",
      },
      fontFamily: {
        // Used via next/font in app/layout.tsx; CSS vars set there
        serif: ["var(--font-serif)", "Frank Ruhl Libre", "serif"],
        sans: ["var(--font-sans)", "Heebo", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        paper: "0 2px 0 #2a1f12, -4px 6px 0 rgba(26, 20, 16, 0.12)",
        card: "-3px 4px 0 rgba(26, 20, 16, 0.08)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
