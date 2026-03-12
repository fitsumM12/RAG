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
        ink: "#0b0b0b",
        primary: "#8a7345",
        secondary: "#DCBD7F",
        red: "#b91c1c",
        mist: "#f8fafc"
      }
    }
  },
  plugins: []
};
