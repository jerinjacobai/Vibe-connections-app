import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    define: {
      // Inject the API Key globally so the GoogleGenAI client can read it from process.env.API_KEY
      // Fallback to empty string if undefined to prevents build errors, handled at runtime
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    }
  };
});