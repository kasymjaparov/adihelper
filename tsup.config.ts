
import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    minify: true,
    treeshake: true,
    outDir: 'dist',
    target: 'es2018',
    bundle: true,
    external: [],
    banner: {
        js: '/* Your Library Name - MIT License */',
    },
    esbuildOptions(options) {
        options.conditions = ['module']
        options.mainFields = ['module', 'main']
    },
    onSuccess: async () => {
        console.log('✅ Build completed successfully!')
    },
})