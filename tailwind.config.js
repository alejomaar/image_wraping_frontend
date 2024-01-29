/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      minWidth: {
        sm: "540px", // Fixed width for tablet
        md: "720px", // Fixed width for laptop
        lg: "960px", // Fixed width for desktop
        xl: "1140px", // Fixed width for desktop
      },
    },
    screens: {
      sm: "540px",
      // => @media (min-width: 640px) { ... }

      md: "720px",
      // => @media (min-width: 768px) { ... }

      lg: "960px",
      // => @media (min-width: 1024px) { ... }

      xl: "1140px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1320px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
