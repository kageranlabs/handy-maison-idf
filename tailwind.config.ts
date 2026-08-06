import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3F20",
          dark: "#142B16",
          light: "#2C5930",
        },
        accent: {
          DEFAULT: "#6B8E73",
          light: "#E8F0E9",
          dark: "#4E6953",
        },
        bgWarm: "#F9F8F6",
        charcoal: {
          DEFAULT: "#1C1C1C",
          muted: "#666666",
          light: "#999999",
        },
        status: {
          pending: "#D97706",
          captured: "#059669",
          declined: "#DC2626",
          cancelled: "#6B7280",
        }
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(30, 63, 32, 0.08)",
        card: "0 10px 30px -4px rgba(28, 28, 28, 0.06)",
        dropdown: "0 20px 40px -8px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
