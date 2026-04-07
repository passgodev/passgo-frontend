import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';


export default defineConfig(({ mode }) => {
    const fileEnv = loadEnv(mode, '.');

    const CONFIGURATION = {
        protocol: 'http',
        hostname: process.env.VITE_API_HOSTNAME ?? fileEnv.VITE_API_HOSTNAME ?? 'localhost',
        port: process.env.VITE_API_PORT ?? fileEnv.VITE_API_PORT ?? 9090,
        pathPrefix: 'rest-api'
    };
    console.log('Vite mode config:', mode, CONFIGURATION);


    const restApiEndpoint = `${CONFIGURATION.protocol}://${CONFIGURATION.hostname}:${CONFIGURATION.port}/${CONFIGURATION.pathPrefix}`;
    console.log(`Vite app is forwarding fetch to: ${restApiEndpoint}`)

    return {
        plugins: [react()],
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
