import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      name: "AstronomyJS",
      formats: ["iife", "es"],
      fileName: (format) =>
        format === "iife" ? "astronomy.min.js" : `astronomy.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
});
