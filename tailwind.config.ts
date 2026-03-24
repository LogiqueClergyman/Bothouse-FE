import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#00FF94",
          bg: "#0A0A0F",
          surface: "#12121A",
          border: "#1E1E2E",
          muted: "#3A3A4A",
          error: "#FF4444",
          warning: "#FFB800",
          success: "#00FF94",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "8px",
        input: "4px",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
