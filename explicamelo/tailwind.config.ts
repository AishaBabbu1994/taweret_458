import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        board: {
          DEFAULT: "#16261F",
          light: "#1E3327",
          dark: "#0D1712",
        },
        chalk: {
          DEFAULT: "#F4F1E6",
          dim: "#C9CFC6",
        },
        accent: {
          yellow: "#E9C651",
          coral: "#E4785B",
          sky: "#7FB6C9",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        "chalk-noise":
          "radial-gradient(circle at 20% 20%, rgba(244,241,230,0.04), transparent 40%), radial-gradient(circle at 80% 60%, rgba(244,241,230,0.03), transparent 45%)",
      },
    },
  },
  plugins: [],
};
export default config;
