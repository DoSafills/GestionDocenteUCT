// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f9fafb",
        card: "#ffffff",
        primary: "#3b82f6",
        "primary-foreground": "#ffffff",
        muted: "#6b7280",
        "muted-foreground": "#374151",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
