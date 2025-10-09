import type { Config } from 'tailwindcss'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { BREAKPOINTS } = require('./app/constants/size.constant.js')
// Breakpoint(pixel unit) constants for consistent usage across the app

export default {
  darkMode: 'class',
  content: ['./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Helvetica Neue'],
        vipnagorgialla: ['Vipnagorgialla'],
      },
      colors: {
        primary: '#FF8411',
        'primary-500': '#FF8411',
        secondary: '#F8F8F8',
        light: '#F8F8F8',
        dark: '#030303',
        surface: '#282828',

        'neutral-0': '#FFFFFF',
        'neutral-25': '#F0F0F0',
        'neutral-50': '#ECECEC',
        'neutral-100': '#DEDEDE',
        'neutral-600': '#6A6A6A',
        'neutral-700': '#2C2C2C',
        'neutral-800': '#191919',
        'neutral-900': '#030303',

        'gray-100': '#F1F1F1',

        'red-300': '#FF381C',
        'red-400': '#FF5940',
        'red-500': '#FF6F5A',

        'neon-500': '#B2FE55',
        'neon-700': '#52C61C',

        'shade1-100': '#FCFCFC',
      },
      screens: {
        '2xl': {
          min: `${BREAKPOINTS.xl}px`,
        },
        xl: {
          min: `${BREAKPOINTS.lg}px`,
        },
        lg: {
          min: `${BREAKPOINTS.md}px`,
        },
        md: {
          min: `${BREAKPOINTS.sm}px`,
        },
        //Note: we use md for backward compatibility, should change to sm in the future when we have enough UI
        sm: {
          max: `${BREAKPOINTS.md - 1}px`,
        },
      },
      animation: {
        gradient: 'gradient 8s linear infinite',
        'move-up': 'move-up 0.1s ease-out',
        'zoom-appear': 'zoom-appear 0.1s ease-out',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
            'background-size': '400% 400%',
          },
          '50%': {
            'background-position': '100% 50%',
            'background-size': '400% 400%',
          },
        },
        'move-up': {
          '0%': {
            transform: 'translateY(300px)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        'zoom-appear': {
          '0%': {
            transform: 'scale(1.1)',
          },
          '100%': {
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
