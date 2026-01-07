# Patchara Al‑umaree — Portfolio

![License](https://img.shields.io/badge/License-MIT-green.svg) ![Stack](https://img.shields.io/badge/HTML-CSS-JS-blue.svg) ![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages%20%7C%20Vercel%20%7C%20Netlify-purple.svg)

A modern, static portfolio showcasing About, Performance Metrics, Certificates (auto‑playing slideshow with lightbox), and a Contact form. Includes a centered Resume button that triggers a direct Google Drive download (no view page) and a Service Worker for improved UX.

---

## Table of Contents
- Features
- Tech Stack
- Project Structure
- Preview Locally
- Email Sending (no secrets)
- Deploy Options
- Security
- License

## Features
- Hero carousel and clean navigation
- About section with concise profile line
- Performance Metrics cards
- Certificates slideshow with progress indicator + lightbox preview
- Resume direct download from Google Drive
- Contact form with serverless email sending
- Service Worker (`sw.js`) registration

## Tech Stack
- HTML5, CSS3, Vanilla JavaScript
- UI assets: `templatemo-prism-flux.min.css`, `templatemo-prism-scripts.min.js`
- Resume download: Google Drive (`uc?export=download&id=...`)
- Email: Resend API via serverless function

## Project Structure
```
/ (root)
├─ index.html            # Main page
├─ cer.html              # Certificates page
├─ work.html             # Work experience page
├─ sw.js                 # Service Worker
├─ templatemo-prism-*.css/js
├─ images/               # Assets (incl. cer/*.png, *.jpg)
└─ api/send-email.js     # Email function (Resend)
```

## Preview Locally
Option A — Python (built‑in on most systems):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Option B — Node (no install, using npx):

```bash
npx serve .
# then open the served URL
```

## Email Sending (no secrets committed)
- Uses Resend API in `api/send-email.js`
- Set `RESEND_API_KEY` as an environment variable on your deploy platform
- The contact form posts to the serverless endpoint (e.g., Vercel Functions)

## Deploy Options
- GitHub Pages: host the static frontend (no serverless functions)
- Vercel: static hosting + Serverless Functions; set `RESEND_API_KEY` in Project Settings → Environment Variables
- Netlify: static hosting + Functions (configure a functions dir); set `RESEND_API_KEY` in Site settings → Environment

## Security
- Do not commit `RESEND_API_KEY` or any secrets to the repository
- Use environment variables on the deploy platform only

## License
Licensed under MIT — see `LICENSE` for details.

