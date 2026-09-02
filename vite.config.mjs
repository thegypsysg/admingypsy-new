import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    vuetify({
      autoImport: true,
    }),
  ],
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: /^~/, replacement: '' },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  server: {
    port: 8080,
    host: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'slash-div'],
      },
    },
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vuetify/')) {
            return 'chunk-vuetify';
          }
        },
      },
    },
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
});
