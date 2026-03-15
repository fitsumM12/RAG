/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"]
  ,
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        body: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
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
