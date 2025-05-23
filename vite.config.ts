import path from "path"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from "vite"


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
