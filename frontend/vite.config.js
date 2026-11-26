import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // All /api-backend/* calls → Express on port 3000 (prefix stripped)
      '/api-backend': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api-backend/, ''),
      },
      // Auth routes
      '/users': { target: 'http://localhost:3000', changeOrigin: true },
      // OTP routes
      '/otp':   { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
});
