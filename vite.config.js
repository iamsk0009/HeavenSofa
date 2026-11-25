import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'non-blocking-app-stylesheet',
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          return html.replace(
            /<link rel="stylesheet" crossorigin href="([^"]+\.css)">/g,
            '<link rel="preload" as="style" crossorigin href="$1" onload="this.onload=null;this.rel=\'stylesheet\'"><noscript><link rel="stylesheet" crossorigin href="$1"></noscript>',
          )
        },
      },
    },
  ],
  resolve: {
    alias: { '@': '/src' },
  },
  // GLB/HDR assets added in later phases are served as static files
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.hdr'],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'scheduler-vendor',
              test: /node_modules[\\/]scheduler[\\/]/,
              priority: 50,
              minSize: 0,
              maxSize: 128 * 1024,
            },
            {
              name: 'react-runtime',
              test: /node_modules[\\/]react[\\/]/,
              priority: 40,
              minSize: 0,
              maxSize: 128 * 1024,
            },
            {
              name: 'three-vendor',
              test: /node_modules[\\/](?:three|@react-three)[\\/]/,
              priority: 20,
              minSize: 24 * 1024,
              maxSize: 360 * 1024,
            },
          ],
        },
      },
    },
  },
})
