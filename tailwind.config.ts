import type {Config} from "tailwindcss";

export default {
  darkMode: "class", // Activamos el dark mode por clase
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"), // <= plugin oficial (opcional en 3.3+)
  ],
} satisfies Config;
