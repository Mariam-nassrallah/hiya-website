import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    // The admin dashboard (hiya-admin/) runs its own dev server on 5174.
    // Forward /admin to it so http://localhost:5173/admin works like on Render.
    proxy: {
      '/admin': {
        target: 'http://localhost:5174',
        ws: true, // the admin's live reload connection
      },
    },
    // The admin app and the original design are separate: don't watch them here.
    watch: { ignored: ['**/hiya-admin/**', '**/design/**'] },
  },
});
