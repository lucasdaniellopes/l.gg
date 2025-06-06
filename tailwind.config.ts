import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'cyber-blue': '#00d4ff',
        'cyber-purple': '#9d4edd',
        'cyber-green': '#39ff14',
        'cyber-pink': '#ff006e',
        'dark-blue': '#1e293b',
        'darker-blue': '#334155',
        'darkest-blue': '#0f172a',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(45deg, #00d4ff, #9d4edd)',
        'cyber-gradient-2': 'linear-gradient(135deg, #000814, #001d3d)',
        'grid-pattern': 'radial-gradient(circle at 1px 1px, rgba(0, 212, 255, 0.3) 1px, transparent 0)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { 
            textShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 15px #00d4ff',
            boxShadow: '0 0 5px #00d4ff'
          },
          '100%': { 
            textShadow: '0 0 10px #00d4ff, 0 0 20px #00d4ff, 0 0 30px #00d4ff',
            boxShadow: '0 0 20px #00d4ff, 0 0 30px #00d4ff'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 212, 255, 0.5)',
        'cyber-lg': '0 0 40px rgba(0, 212, 255, 0.3)',
        'purple-glow': '0 0 20px rgba(157, 78, 221, 0.5)',
        'inner-glow': 'inset 0 0 10px rgba(0, 212, 255, 0.2)',
      },
      backdropBlur: {
        'cyber': '20px',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
            DEFAULT: "#f97316",
            foreground: "#ffffff",
          },
          secondary: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
            DEFAULT: "#f97316",
            foreground: "#ffffff",
          },
        },
      },
      dark: {
        colors: {
          primary: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#f97316",
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
            DEFAULT: "#f97316",
            foreground: "#ffffff",
          },
          secondary: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
            DEFAULT: "#f97316",
            foreground: "#ffffff",
          },
        },
      },
    },
  })],
};
export default config;