import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './shared/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'vazirmatn': ['Vazirmatn', 'sans-serif'],
        'sans': ['Vazirmatn', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
  ],
};

module.exports = config;