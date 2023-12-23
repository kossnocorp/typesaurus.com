import starlightPlugin from "@astrojs/starlight-tailwind";

// Generated color palettes
const accent = {
  200: "#b0c8ff",
  600: "#264fff",
  900: "#122875",
  950: "#0f1f4f",
};
const gray = {
  100: "#f4f6ff",
  200: "#e9edff",
  300: "#b6bfee",
  400: "#7882dd",
  500: "#474ca2",
  700: "#2b297c",
  800: "#1c1467",
  900: "#111336",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: { accent, gray },
      fontFamily: {
        sans: ['"Inter Variable"'],
        mono: ['"Martian Mono Variable"'],
      },
    },
  },
  plugins: [starlightPlugin()],
};
