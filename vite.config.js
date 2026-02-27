import { defineConfig } from 'vite'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  root: 'src',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    // Отключаем хеширование имён файлов
    rollupOptions: {
      output: {
        entryFileNames: `assets/js/[name].js`,
        chunkFileNames: `assets/js/[name].js`,
        assetFileNames: ({ name }) => {
          // Сохраняем оригинальные имена для всех файлов
          if (/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(name)) {
            return 'assets/images/[name][extname]'
          }
          if (/\.(css)$/i.test(name)) {
            return 'assets/css/[name][extname]'
          }
          return 'assets/[name][extname]'
        }
      }
    },
    // Отключаем минификацию CSS для читаемости (опционально)
    cssMinify: false,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'assets/images',
          dest: 'assets'
        },
        {
          src: 'assets/fonts',
          dest: 'assets'
        }
      ]
    })
  ],
  server: {
    port: 3000,
    open: true,
  },
})
