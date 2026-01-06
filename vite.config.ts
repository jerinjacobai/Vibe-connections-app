import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  define: {
    // We do not overwrite process.env.API_KEY here because it is handled by the index.html runtime polyfill
    // or Vercel's environment injection.
    // However, to avoid "process is not defined" errors in some contexts, we can ensure global is defined.
    'process.env': {}
  }
});