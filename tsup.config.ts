
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
    target: 'es2020',
    bundle: true,
    external: [],
    esbuildOptions(options) {
        options.conditions = ['module']
        options.mainFields = ['module', 'main']
        options.drop = ['console', 'debugger']
        options.legalComments = 'none'
    },
    terserOptions: {
        compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 2,
        },
        mangle: {
            properties: {
                regex: /^_/,
            },
        },
        format: {
            comments: false,
        },
    },
    onSuccess: async () => {
        console.log('✅ Build completed successfully!')
    },
})