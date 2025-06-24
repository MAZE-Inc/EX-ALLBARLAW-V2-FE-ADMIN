import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 글로벌하게 import할 SCSS 파일 설정
        additionalData: `
          @use "@/styles/abstracts/variables" as *;
          @use "@/styles/abstracts/colors" as *;
          @use "@/styles/abstracts/mixins" as *;
        `,
      },
    },
  },
})
