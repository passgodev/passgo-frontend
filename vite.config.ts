import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const CONFIGURATION = {
  protocol: 'http',
  hostname: 'localhost',
  port: 8080,
  pathPrefix: 'rest-api' 
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: `${CONFIGURATION.protocol}://${CONFIGURATION.hostname}:${CONFIGURATION.port}/${CONFIGURATION.pathPrefix}`,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
