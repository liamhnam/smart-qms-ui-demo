import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Design System Colors (Inspired by Mastercard, adapted with #bb302a for Vietnamese Public Administration)
        "admin-red": "#bb302a", // Vietnamese public administration red (replacing #EB001B)
        "admin-yellow": "#F79E1B", // Warm golden mark
        "ink-black": "#141413", // Primary dark near-black
        "charcoal": "#262627",
        "canvas-cream": "#F3F0EE", // The warm putty-cream canvas
        "lifted-cream": "#FCFBFA", // Raised paper surface
        "soft-bone": "#F4F4F4",
        "ghost-cream": "#E8E2DA", // Ghost watermark text
        "slate-gray": "#696969",
        "signal-orange": "#CF4500",
        "light-orange": "#F37338",
        "link-blue": "#3860BE",
      },
      borderRadius: {
        'stadium': '40px',
        'btn': '20px',
        'pill': '999px',
      },
      boxShadow: {
        'soft-nav': 'rgba(0, 0, 0, 0.04) 0px 4px 24px 0px',
        'cushion': 'rgba(0, 0, 0, 0.08) 0px 24px 48px 0px',
        'satellite': 'rgba(0, 0, 0, 0.12) 0px 8px 24px 0px',
      },
      letterSpacing: {
        'tight-display': '-0.02em', // -2% letter spacing for editorial headlines
        'eyebrow': '0.04em', // +4% uppercase tracking
      }
    },
  },
  plugins: [],
} satisfies Config;
