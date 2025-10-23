import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// If building on GitHub Actions, set base to "/<repo>/" so assets resolve on GitHub Pages
const repoName = process.env.GITHUB_REPOSITORY?.split('/')?.[1]

export default defineConfig({
  plugins: [react()],
  base: repoName ? `/${repoName}/` : '/',
})
