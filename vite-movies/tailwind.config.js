const { nextui } = require("@nextui-org/theme");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primarys: "oklch(var(--p))",
      },
    },
  },
  nextui: {},
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      {
        purple: {
          primary: "#cf00ff",

          secondary: "#fb7185",

          accent: "#5be100",

          neutral: "#0e0500",

          "base-100": "#31253f",

          info: "#0fd7ff",

          success: "#00eac3",

          warning: "#ffb700",

          error: "#ff4874",
        },
      },
      {
        orange: {
          primary: "#ea580c",

          secondary: "#ca8a04",

          accent: "#e11d48",

          neutral: "#1f1f1f",

          "base-100": "#292524",

          info: "#00ceff",

          success: "#48bd00",

          warning: "#e12900",

          error: "#f3446a",
        },
      },
      {
        pink: {
          primary: "#ff0094",

          secondary: "#f43f5e",

          accent: "#dc2626",

          neutral: "#0c0a0f",

          "base-100": "#36241d",

          info: "#00daff",

          success: "#4c7e00",

          warning: "#ff8a00",

          error: "#ff989a",
        },
      },
    ],
  },
  plugins: [nextui(), require("daisyui")],
};
