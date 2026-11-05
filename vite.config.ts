import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // relative paths: works at myaseensha.github.io/mariya/ and with `npx serve dist`
  base: './',
  plugins: [react()],
})
