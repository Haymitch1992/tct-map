import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    // https: true,
    proxy: {
      '/api': {
        // target: 'http://172.51.216.130:8091',
        target: 'http://172.51.216.125:12125',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
})
