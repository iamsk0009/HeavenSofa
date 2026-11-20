import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
              name: 'three-vendor',
              test: /node_modules[\\/](?:three|@react-three)[\\/]/,
              priority: 20,
              minSize: 24 * 1024,
              maxSize: 360 * 1024,
            },
            {
              name: 'story-runtime',
              test: /[\\/]src[\\/](?:experience|animations|illustrations|sections)[\\/]/,
              priority: 10,
              minSize: 18 * 1024,
              maxSize: 360 * 1024,
            },
          ],
        },
      },
    },
  },
})
