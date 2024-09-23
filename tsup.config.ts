import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/plugin.ts'],
	format: ['esm'],
	outDir: 'out',
	dts: true,
	clean: true,
})
