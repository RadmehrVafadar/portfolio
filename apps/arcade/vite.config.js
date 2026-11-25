import { defineConfig, normalizePath } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { portfolioProxy } from '../../scripts/portfolio-proxy.mjs'

// Vercel serves at the root path; use default base '/'
export default defineConfig({
  plugins: [react(), portfolioProxy(), {
    name: 'changelog-images',
    apply: 'serve',
    // The README and changelog share screenshots stored outside the app root.
    transformIndexHtml(html) {
      const images = normalizePath(fileURLToPath(new URL('../../docs/images/changelog/', import.meta.url)))
      return html.replaceAll('../../../docs/images/changelog/', `/@fs/${images}`)
    },
  }],
  base: '/',
  envDir: '../..',
  build: {
    rollupOptions: {
      input: { main: 'index.html', changelog: 'changelog/index.html' },
    },
  },
  // Preview serves the assembled portfolio instead of inheriting the dev proxy.
  preview: { proxy: {} },
})


