/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2d7a32",
        "primary-dark": "#1B5E20",
        "primary-light": "#E8F5E9",
        sale: "#e31e24",
        accent: "#FF9800",
        background: "#FFFFFF",
        surface: "#FFFFFF",
        "light-gray": "#f4f4f4",
        textPrimary: "#333333",
        textSecondary: "#555555",
        border: "#eeeeee",
        topbar: "#2d7a32",
      },
      fontFamily: {
        sans: ["Inter", "System", "sans-serif"],
      },
      borderRadius: {
        card: "4px",
        btn: "5px",
      },
      boxShadow: {
        card: "0 10px 20px rgba(0,0,0,0.05)",
        navbar: "0 2px 5px rgba(0,0,0,0.1)",
        soft: "0 1px 4px rgba(0,0,0,0.06)",
      }
    }
  },
  plugins: []
}