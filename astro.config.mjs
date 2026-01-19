// @ts-check
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://AloneDay-91.github.io",
  base: "/TP-avatar-svg-factory",

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});