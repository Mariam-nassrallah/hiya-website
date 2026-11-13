import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Fixed port so the website's "Admin login" link (VITE_ADMIN_URL) always works.
  // The customer website keeps Vite's default port, 5173.
  server: { port: 5174, strictPort: true },
});
