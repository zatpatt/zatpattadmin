import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://abcd-1234.dev.tunnel.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
