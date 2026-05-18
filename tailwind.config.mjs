/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'wedding-bg':           '#8B0020',
        'wedding-bg-alt':       '#6B0018',
        'wedding-surface':      'rgba(255, 255, 255, 0.08)',
        'wedding-text':         '#FFFFFF',
        'wedding-muted':        'rgba(255, 255, 255, 0.7)',
        'wedding-divider':      'rgba(255, 255, 255, 0.15)',
        'wedding-accent':       '#FFFFFF',
        'wedding-accent-light': 'rgba(255, 255, 255, 0.85)',
        'wedding-accent-dark':  'rgba(255, 255, 255, 0.5)',
        'wedding-gold':         '#C4B998',
        'wedding-gold-light':   '#D4C9A8',
      },
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        body:    ['Clash Display', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scrollPulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.3' },
        },
      },
      animation: {
        fadeInUp:    'fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        scrollPulse: 'scrollPulse 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
