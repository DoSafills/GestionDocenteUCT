import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig({
	plugins: [react()],
	// poner comentario en server antes de subir a produccion
	server: {
		proxy: {
			"/api": {
				target: "https://sgh.inf.uct.cl",
				changeOrigin: true,
				secure: false,
			},
		},
	},
});
