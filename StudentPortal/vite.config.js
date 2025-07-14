import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5175, // Change this to your desired port number
    allowedHosts: [
      "ef1b79320c38.ngrok-free.app", // <-- add your ngrok domain here
    ],
  },
});
