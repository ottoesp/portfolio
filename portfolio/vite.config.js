import { resolve } from 'path'

export default {
  base: '/', // custom domain -> root
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'resources'), // serve/copy resources
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    copyPublicDir: true,
    emptyOutDir: true,
  },
  server: { port: 8080 },
  preview: { port: 4173 },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          'import',
          'mixed-decls',
          'color-functions',
          'global-builtin',
          'if-function',
        ],
      },
    },
  },
}