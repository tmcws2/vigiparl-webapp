import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0d1117", bg2: "#131922", bg3: "#1a2333", card: "#161e2d",
        border1: "#1f2d42", border2: "#2a3d57", muted: "#7a90a8",
        or: "#e8b84b", or2: "#d4a030",
      },
      fontFamily: {
        display: ["Spectral", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
