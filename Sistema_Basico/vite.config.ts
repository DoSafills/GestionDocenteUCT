import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    // poner comentario en server antes de subir a produccion
    server: {
        proxy: {
            '/api': {
                target: 'https://sgh.inf.uct.cl',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
