import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site is served from /<repo>/.
// Override with VITE_BASE when deploying elsewhere (e.g. a custom domain → "/").
const base = process.env.VITE_BASE ?? '/GitLab-License-Generator/'

export default defineConfig({
  base,
  plugins: [react()],
})
