import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "status-available": "#22c55e",
        "status-ontrip": "#3b82f6",
        "status-inshop": "#f97316",
        "status-retired": "#ef4444",
      },
    },
  },
  plugins: [],
};

export default config;
