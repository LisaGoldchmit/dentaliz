import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base חייב להתאים לשם המאגר ב-GitHub Pages (https://<user>.github.io/dentaliz/)
export default defineConfig({
  plugins: [react()],
  base: "/dentaliz/"
});
