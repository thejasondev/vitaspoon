// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://vitaspoon.vercel.app",
  integrations: [
    react({
      include: ["**/*.tsx", "**/*.jsx"], // Asegura que solo archivos React usen la configuración React
    }),
    tailwind(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  vite: {
    envPrefix: ["OPENAI_", "GEMINI_", "DEEPSEEK_"],
  },
});
