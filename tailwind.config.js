/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Plug Brand
        brandNavy: '#0E1F33',
        brandOrange: '#FF6B35',
        brandYellow: '#FFD166',
        brandMint: '#06D6A0',
        brandOffWhite: '#F5F7FA',
        // Light Neutral - 60% usage for page backgrounds
        neutral: {
          50: '#F7F7F7',
          100: '#F0F0F0',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // Dark Neutral - Text/Iconography
        dark: {
          50: '#F5F5F5',
          100: '#E7E7E7',
          200: '#D1D1D1',
          300: '#B0B0B0',
          400: '#888888',
          500: '#6D6D6D',
          600: '#5D5D5D',
          700: '#4F4F4F',
          800: '#454545',
          900: '#333333',
        },
        // Primary Blue - 25% usage for header/nav, cards
        blue: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#1678F2',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Light Blue - 5% usage for secondary buttons, links
        lightBlue: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#56A9FF',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        // Accent Orange - 7% usage for primary CTAs, badges
        orange: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#FF8200',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        // Light Orange - 3% usage for hover/pressed states
        lightOrange: {
          50: '#FFFBF0',
          100: '#FFF4D6',
          200: '#FFE8B3',
          300: '#FFD980',
          400: '#FFC273',
          500: '#FFB347',
          600: '#FF9F1C',
          700: '#E67E00',
          800: '#CC6B00',
          900: '#B35900',
        },
        // Legacy support - map old primary/secondary to new colors
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#1678F2',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          50: '#F7F7F7',
          100: '#F0F0F0',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#333333',
        }
      }
    },
  },
  plugins: [],
} 