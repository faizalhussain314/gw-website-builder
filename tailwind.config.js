/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/preline/preline.js",
  ],

  theme: {
    extend: {
      colors: {
        "palatinate-blue": {
          50: "#ebf4ff",
          100: "#dbe9ff",
          200: "#bed7ff",
          300: "#97bbff",
          400: "#6e92ff",
          500: "#4c6bff",
          600: "#2e42ff",
          700: "#202fe2",
          800: "#1d2bb6",
          900: "#202d8f",
          950: "#131953",
        },
        "gl-gray": {
          100: "#F9FAFB",
          400: "#F9FCFF",
        },
        "txt-black": {
          600: "#1E2022",
        },
        "txt-secondary": {
          400: "#5F5F5F",
          500: "#555555",
        },
        "button-bg-secondary": "#E6F0FE",
      },
      backgroundImage: {
        "gradient-to-r": "linear-gradient(to right, var(--tw-gradient-stops))", // default
        "blue-gradient":
          "linear-gradient(132deg, #963fff -9.83%, #2e42ff 91.64%)",
      },
      boxShadow: {
        custom: "0px 5px 20px 0px rgba(0, 0, 0, 0.1)",
      },
      border: {
        input: "rgba(205, 212, 219, 1) 1px solid",
      },
    },
    screens: {
      "2xl": { max: "1535px" },

      xl: { max: "1279px" },

      lg: { max: "1024px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "768px" },
      "max-1077": { max: "1077px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      mac: { min: "1280px" },
    },
  },
};
