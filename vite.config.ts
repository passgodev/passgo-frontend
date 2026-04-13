import tailwindcss from '@tailwindcss/vite'; // 1. ADD THIS IMPORT
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';


export default defineConfig(({ mode }) => {
    const fileEnv = loadEnv(mode, '.');

    const CONFIGURATION = {
        protocol: 'http',
        // Najpierw sprawdzamy wczytany plik .env, potem zmienne systemowe, na końcu dajemy domyślne
        hostname: fileEnv.VITE_API_HOSTNAME || process.env.VITE_API_HOSTNAME || 'localhost',
        port: fileEnv.VITE_API_PORT || process.env.VITE_API_PORT || 8080,
        pathPrefix: 'rest-api'
    };


    const restApiEndpoint = `${CONFIGURATION.protocol}://${CONFIGURATION.hostname}:${CONFIGURATION.port}/${CONFIGURATION.pathPrefix}`;
    console.log(`Vite app is forwarding fetch to: ${restApiEndpoint}`)

    return {
        plugins: [
            react(), 
            tailwindcss() // 2. ADD THIS PLUGIN HERE
        ],
        server: {
            proxy: {
                '/api': {
                    target: restApiEndpoint,
                    rewrite: path => path.replace(/^\/api/, '')
                }
            }
        }
    };
});