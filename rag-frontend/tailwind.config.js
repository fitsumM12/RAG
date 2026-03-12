/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"]
  ,
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        body: ["IBM Plex Sans", "ui-sans-serif", "system-ui"]
      },
      colors: {
        ink: "#0f172a",
        mist: "#f8fafc",
        sand: "#f5f2ed",
        moss: "#0f766e",
        clay: "#9a3412",
        gold: "#f59e0b"
      }
    }
  },
  plugins: []
};
