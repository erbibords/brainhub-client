// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#111111",
        secondary: "#FF474C",
        tertiary: "#B2BEB5",
        success: "#04AA6D",
      },
      screens: {
        sm: "576px",
        md: "768px",
        lg: "1024px",
      },
      width: {
        "70mm": "70mm",
      },
    },
  },
  plugins: [],
};
