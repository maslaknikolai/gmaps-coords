import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import fs from 'fs';
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		preact(),
	],
	build: {
		rollupOptions: {
		  input: {
			user: resolve(__dirname, 'src/index.tsx'),
		  },

		  output: {
			entryFileNames: `gmaps-coords.user.js`,
		  }
		},
	},
	esbuild: {
		banner: fs.readFileSync('userScriptHeader.txt', 'utf8'),
	}
});
