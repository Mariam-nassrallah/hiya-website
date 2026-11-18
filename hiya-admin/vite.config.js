import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The dashboard lives at /admin/ on the same site as the customer website.
  base: '/admin/',
  // Fixed port: the website's dev server forwards /admin to it (see ../vite.config.js).
  server: { port: 5174, strictPort: true },
});
