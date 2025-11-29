/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#050505',
          dark: '#0a0a0a',
          gray: '#1a1a1a',
        },
        neon: {
          cyan: '#00f3ff',      // Default/Memex
          violet: '#bd00ff',    // Default
          green: '#39ff14',     // MCP Router
          orange: '#ff6b35',    // Claude Hooks
          pink: '#ff2a6d',      // Vlaude
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Monaco', 'Consolas', 'monospace'],
        orbitron: ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'blink': 'blink 1s step-end infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both infinite',
        'glitch-reverse': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) reverse both infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        }
      }
    },
  },
  plugins: [],
}
