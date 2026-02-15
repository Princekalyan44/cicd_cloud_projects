/** @type {import('tailwindcss').Config} */

// Tailwind CSS configuration
module.exports = {
  // Specify files to scan for class names
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Custom animation delays
      animation: {
        'bounce-delay-100': 'bounce 1s infinite 100ms',
        'bounce-delay-200': 'bounce 1s infinite 200ms',
      },
      // Custom colors (extending Tailwind's default palette)
      colors: {
        // You can add custom colors here if needed
      },
    },
  },
  plugins: [],
}
