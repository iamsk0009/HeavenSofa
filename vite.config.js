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
              name: 'scheduler-vendor',
              test: /node_modules[\\/]scheduler[\\/]/,
              priority: 50,
              minSize: 0,
              maxSize: 128 * 1024,
            },
            {
              name: 'react-runtime',
              test: /node_modules[\\/]react[\\/]jsx-runtime\.js$/,
              priority: 40,
              minSize: 0,
              maxSize: 128 * 1024,
            },
            {
              name: 'gsap-vendor',
              test: /node_modules[\\/](?:gsap|@gsap[\\/]react)[\\/]/,
              priority: 30,
              minSize: 24 * 1024,
              maxSize: 1024 * 1024,
            },
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
