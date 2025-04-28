import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';


// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, false);

    // console.log('Vite mode config:', mode);

    const CONFIGURATION = {
        protocol: 'http',
        hostname: env.VITE_API_HOSTNAME ?? 'localhost',
        port: env.VITE_API_PORT ?? 9090,
        pathPrefix: 'rest-api'
    };

    const restApiEndpoint = `${CONFIGURATION.protocol}://${CONFIGURATION.hostname}:${CONFIGURATION.port}/${CONFIGURATION.pathPrefix}`;
    // console.log(`Vite app is forwarding fetch to: ${restApiEndpoint}`)

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
