# WhisperLens Demo

A minimal Vite + React setup to run the `WhisperLens` component.

## Run locally

```cmd
cd /d "C:\Guhan Raj S\Web Development\WhisperLens"
npm install
npm run dev
```

Open http://localhost:5173/ in your browser.

## Build

```cmd
npm run build
```

The static site is generated in the `dist/` folder.

## Deploy to GitHub Pages

1. Push this folder to a new GitHub repository.
2. Ensure your default branch is `main` (or update the workflow accordingly).
3. In the repo settings, under Pages, set Source to "GitHub Actions".
4. Push to `main`. The included workflow `.github/workflows/deploy.yml` builds and publishes the site.
5. Your site will be available at `https://<your-username>.github.io/<repo-name>/`.

No manual configuration of `base` is required; the Vite config reads the repo name from the GitHub Actions environment.

## Notes
- This demo includes a minimal CSS fallback; for full Tailwind UI parity, add Tailwind CSS.
- Microphone recording requires browser permission (works on localhost and HTTPS).
- Icons provided by `lucide-react`.