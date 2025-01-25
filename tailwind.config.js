/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        black: "#404040",
        blueBrand: "#007BFF",
      },
    },
  },
  plugins: [],
};
