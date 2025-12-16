import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
     // @ts-ignore
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // @ts-ignore
      '@': path.resolve(__dirname, 'src'),
      // @ts-ignore
      '@app': path.resolve(__dirname, 'src/app'),
      // @ts-ignore
      '@pages': path.resolve(__dirname, 'src/pages'),
      // @ts-ignore
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      // @ts-ignore
      '@features': path.resolve(__dirname, 'src/features'),
      // @ts-ignore
      '@entities': path.resolve(__dirname, 'src/entities'),
      // @ts-ignore
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
})
