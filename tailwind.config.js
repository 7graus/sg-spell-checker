/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#ff6600', // Custom color
        blue: {
          DEFAULT: '#1A73E8',
          light: '#E5F2FF',
          dark: '#135DBE',
          bg: '#E5F2FF',
        },
        gray: {
          text: {
            DEFAULT: '#49505A',
            placeholder: '#636C7CB2',
            secondary: '#6E7787',
            disabled: '#9FA8B2',
          },
          button: {
            DEFAULT: '#647A96',
            hover: '#2272B9',
          },
          bg: {
            DEFAULT: '#F8F8F7',
            light: '#FAFAFA',
            medium: '#D7DBDF',
            dark: '#505762',
          },
          border: {
            DEFAULT: '#ACB8C8',
            dark: '#6E7787',
            secondary: '#D1D8E0',
            active: '#647A96',
            inactive: '#BFC8D4',
            hover: '#98A1AE',
          },
        },
        red: {
          danger: {
            bg: '#FFEDEB',
            border: '#E34935',
            text: '#DE350B',
          },
        },
        green: {
          DEFAULT: '#008000',
          check: '#008083',
          success: {
            DEFAULT: '#008F7C',
            border: '#007A6A',
          },
        },
      },
      keyframes: {
        fade: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'loading-dots': {
          '0%, 100%': { transform: 'scale(0.5)', opacity: '0.8' },
          '50%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(100%)',
          },
          '100%': {
            transform: 'translateY(0)',
          },
        },
        'slide-down': {
          '0%': {
            transform: 'translateY(0)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-down': {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-left': {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'fade-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '.85',
            transform: 'scale(1.05)',
          },
        },
        shine: {
          '0%, 85%': {
            opacity: '0',
            transform: 'translateX(-100%) skewX(-25deg)',
          },
          '92%': {
            opacity: '0.8',
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(200%) skewX(-25deg)',
          },
        },
        'shine-2': {
          '0%': {
            opacity: '0',
            transform: 'translateX(-100%) skewX(-15deg)',
            'transition-property': 'opacity, transform',
          },
          '11.5044%, 100%': {
            opacity: 0.6,
            transform: 'translateX(200%) skewX(-15deg)',
            'transition-property': 'opacity, transform',
          },
        },
      },
      animation: {
        fade: 'fade 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'fade-down': 'fade-down 0.5s ease-out',
        'fade-left': 'fade-left 0.5s ease-out',
        'fade-right': 'fade-right 0.5s ease-out',
        pulse: 'pulse 1.5s ease-in-out infinite',
        'shine-1': 'shine 6s ease-out infinite',
        'shine-2': 'shine-2 5s ease-in-out infinite',
      },
      boxShadow: {
        card: '0px 4px 20px rgba(57, 64, 79, 0.05),0px 4px 10px rgba(57, 64, 79, 0.05),0px 2px 4px rgba(57, 64, 79, 0.1)',
        editor: '1px -8px 12px -4px rgba(0,0,0,0.05)',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'], // Default font set to Roboto
        barlow: ['Barlow', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-border': `linear-gradient(94.18deg, #93C1FD 0%, #E4ABFC 100%)`,
        'gradient-border-overlay': `linear-gradient(0deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3))`,
      },
      textShadow: {
        shine: '0 0 10px rgba(255, 255, 255, 0.5)',
        cta: '0px 1px 2px rgba(0, 0, 0, 0.2)',
      },
      dropShadow: {
        cta: '0 1px 2px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
}; 