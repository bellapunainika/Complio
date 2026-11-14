/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        complio: {
          bg: "#08090D",
          surface: "#0D0F15",
          sidebar: "#0B0D12",
          card: "#12151D",
          cardHover: "#181C26",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(148, 102, 255, 0.3)",
          purple: "#9466FF",
          purpleLight: "#B69AFF",
          purpleGlow: "rgba(148, 102, 255, 0.15)",
          blue: "#6C8FFF",
          text: "#F4F3FA",
          muted: "#9295A5",
          success: "#34D399",
          warning: "#FBBF24",
          danger: "#F87171",
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px -5px rgba(148, 102, 255, 0.25)',
        'glow-lg': '0 0 50px -10px rgba(148, 102, 255, 0.35)',
        card: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}

