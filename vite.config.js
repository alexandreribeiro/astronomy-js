import { defineConfig } from "vite";
import banner from "vite-plugin-banner";
import fs from "fs";

const licenseBanner = fs.readFileSync("./LICENSE", "utf8");

export default defineConfig({
  build: {
    base: "/astronomy-js/",
    lib: {
      entry: "index.js",
      name: "AstronomyJS",
      formats: ["iife", "es"],
      fileName: (format) =>
        format === "iife" ? "astronomy-js.min.js" : `astronomy-js.${format}.js`,
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
