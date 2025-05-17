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
    // Optimizaciones de Vite para mejorar el rendimiento
    build: {
      // Optimizar el tamaño del bundle
      cssCodeSplit: true,
      minify: "terser",
      rollupOptions: {
        output: {
          manualChunks: {
            // Separar las dependencias grandes en chunks separados
            react: ["react", "react-dom"],
            papaparse: ["papaparse"],
          },
        },
      },
    },
    // Optimizar el tiempo de carga en desarrollo
    optimizeDeps: {
      include: ["react", "react-dom", "papaparse"],
    },
    // Mejorar el rendimiento del servidor de desarrollo
    server: {
      hmr: {
        overlay: false, // Desactivar overlay para mejorar rendimiento
      },
    },
  },
});
