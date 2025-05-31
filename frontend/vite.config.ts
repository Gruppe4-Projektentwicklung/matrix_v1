import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/session_files': 'http://localhost:8000',
      '/upload': 'http://localhost:8000',
      '/api': 'http://localhost:8000',
      '/download_template': 'http://localhost:8000',
    },
  },
});
