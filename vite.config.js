import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure this is set to '/' for root hosting
  server: {
    proxy: {
      '/api': {
        target: 'https://laravel.wazafny.online',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  build: {
    assetsInclude: ['**/*.png', '**/*.svg'], // Explicitly include PNGs and SVGs
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-axios': ['axios'],
          'vendor-motion': ['framer-motion'],
          'vendor-spinners': ['react-spinners'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});