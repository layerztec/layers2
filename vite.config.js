import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import stylelint from 'vite-plugin-stylelint';
import svgLoader from 'vite-svg-loader';
import autoImport from 'unplugin-auto-import/dist/vite.js';
import { resolve } from 'path';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: '/',
    plugins: [
      eslint({ cache: false }),
      stylelint(),
      svgLoader(),
      vue(),
      autoImport({
        imports: [
          'vue',
          'vue-router',
        ],
        eslintrc: {
          enabled: true,
        },
        dirs: [
          './src/components',
          './src/composables',
        ],
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  });
};
