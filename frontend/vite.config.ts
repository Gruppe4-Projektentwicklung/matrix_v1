// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ⬅️ wichtig
    },
  },
  server: {
    proxy: {
      '/session_files': 'http://localhost:5000',
      '/upload': 'http://localhost:5000',
      '/api': 'http://localhost:5000',
    }
  }
});
