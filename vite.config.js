import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
  server: {
    port: 5173,
    hmr: {
      overlay: false // Disable error overlay temporarily
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  build: {
    // Use safer build options to minimize eval usage
    minify: 'esbuild',
    sourcemap: false, // Disable sourcemaps in production to avoid eval
  },
  // Optimize dependencies to reduce eval usage
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
})
