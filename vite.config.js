import { defineConfig } from "vite";

export default defineConfig({
  base: "/Serverless-SQL-Studio/",
  build: {
    target: "esnext"
  },
  worker: {
    format: "es"
  }
});
