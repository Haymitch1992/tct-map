import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        // target: 'http://172.51.216.130:8091',
        target: 'http://172.51.216.125:12125',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/test': {
        target: 'https://vip.helloimg.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/test/, '')
      }
    }
  }
})
