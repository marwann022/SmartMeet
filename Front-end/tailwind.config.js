/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom breakpoint: compact sidebar mode below 850px (Discord-style icon nav)
      screens: {
        'compact': { max: '849px' },
      },
      colors: {
        primary: {
          DEFAULT: '#4b68ff',      // Royal Blue (DealDeck Main)
          glow: 'rgba(75, 104, 255, 0.15)',
        },
        secondary: {
          DEFAULT: '#06b6d4',    // Cyan Accent
          glow: 'rgba(6, 182, 212, 0.15)',
        },
        accent: {
          DEFAULT: '#ec4899',       // Bright Pink Accent
          glow: 'rgba(236, 72, 153, 0.15)',
        },
        brand: {
          dark: 'var(--brand-dark)',      // Slate Dark (mapped to CSS variable)
          slate: 'var(--brand-slate)',     // Slate Muted (mapped to CSS variable)
          bg: 'var(--brand-bg)',        // Deep Light Gray (mapped to CSS variable)
          success: '#22c55e',
          warning: '#eab308',
          danger: '#ef4444',
        }
      },
      fontFamily: {
        header: ["Montserrat", "sans-serif"],
        body: ["Urbanist", "sans-serif"],
      },
      backgroundImage: {
        'grad-primary': 'linear-gradient(135deg, #4b68ff 0%, #3652e3 100%)',
        'grad-accent': 'linear-gradient(135deg, #ec4899 0%, #4b68ff 100%)',
        'grad-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)',
        'grad-text': 'linear-gradient(135deg, #0f172a 30%, #3b82f6 80%, #4b68ff 100%)',
        'grad-hover': 'linear-gradient(135deg, #3652e3 0%, #1e3a8a 100%)',
        'glass-bg': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(243, 246, 255, 0.72) 50%, rgba(255, 243, 248, 0.65) 100%)',
        'glass-bg-hover': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(235, 242, 255, 0.8) 50%, rgba(255, 235, 244, 0.72) 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.06), 0 1px 2px 0 rgba(255, 255, 255, 0.5) inset',
        'card-hover': '0 20px 40px 0 rgba(31, 38, 135, 0.08), 0 1px 2px 0 rgba(255, 255, 255, 0.7) inset',
      },
      backdropBlur: {
        'glass': '20px',
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
}
