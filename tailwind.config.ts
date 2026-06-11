import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF8EC",
        "cream-strong": "#FFEED1",
        champagne: "#FFF3DD",
        obsidian: "#15110F",
        orange: {
          brand: "#FF7A1A",
          soft: "#FFF0E3",
          deep: "#D95600",
          hot: "#FF5A1F"
        },
        mint: "#DDF8E9",
        skysoft: "#E4F3FF",
        lavender: "#EEE8FF",
        roseglass: "#FFE8EE",
        ink: "#211A17"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(75, 45, 15, 0.11)",
        card: "0 22px 70px rgba(255, 122, 26, 0.16)",
        premium: "0 28px 90px rgba(44, 29, 16, 0.18)",
        glow: "0 20px 55px rgba(255, 122, 26, 0.34)",
        glass: "0 18px 70px rgba(20, 16, 13, 0.18)",
        phone: "0 35px 90px rgba(49, 32, 17, 0.22)"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.25rem"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};

export default config;
