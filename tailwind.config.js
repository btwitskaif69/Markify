/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  blocklist: ["[-:|]"],
  theme: {
    extend: {},
  },
  plugins: [],
};
