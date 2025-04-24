// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react({
      include: ["**/*.tsx", "**/*.jsx"], // Asegura que solo archivos React usen la configuración React
    }),
    tailwind(),
  ],
});
