import { defineConfig, loadEnv } from 'vite'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import pxtorem from 'postcss-pxtorem'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import sass from 'sass'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        electron([
            {
                // Main-Process entry file of the Electron App.
                entry: 'electron/main.ts',
            },
            {
                entry: 'electron/preload.ts',
                onstart(options) {
                    // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete,
                    // instead of restarting the entire Electron App.
                    options.reload()
                },
            },
        ]),
        renderer(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    resolve: {
        alias: {
            '@': '/src',
            '~': '/public',
        },
    },
    css: {
        postcss: {
            plugins: [
                pxtorem({
                    rootValue: 19.2,
                    propList: ['*'],
                    replace: true,
                    mediaQuery: false,
                    minPixelValue: 3,
                    exclude: /node_modules/i,
                }),
                autoprefixer({
                    grid: true,
                }),
            ],
        },
        preprocessorOptions: {
            scss: {
                implementation: sass,
                additionalData: '@import "@/assets/css/global.scss";',
            },
        },
    },
    build: {
        sourcemap: false,
        rollupOptions: {
            external: ['electron', 'sharp'],
            output: {
                globals: {
                    electron: 'electron',
                },
            },
        },
    },
})
