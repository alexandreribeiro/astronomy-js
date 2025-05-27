import { defineConfig } from "vite";
import banner from "vite-plugin-banner";
import fs from "fs";

const licenseBanner = fs.readFileSync("./LICENSE", "utf8");

export default defineConfig({
  build: {
    lib: {
      entry: "index.js",
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
  plugins: [banner(licenseBanner)],
});
