/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // make sure it scans your source files
  ],
  theme: {
    extend: {
      colors: {
        // Core brand colors
        primary: {
          DEFAULT: "#2563eb", // blue-600
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#64748b", // slate-500
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#dc2626", // red-600
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#16a34a", // green-600
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b", // amber-500
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"], // modern system font stack
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.05)",
        "card-hover": "0 8px 20px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
