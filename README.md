<div align="center">

# Patchara Al‑umaree — Portfolio ✨

![License](https://img.shields.io/badge/License-MIT-green.svg) 
![Stack](https://img.shields.io/badge/HTML-CSS-JS-blue.svg) 
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages%20%7C%20Vercel%20%7C%20Netlify-purple.svg)

Modern portfolio showcasing About, Performance Metrics, Certificates (auto‑playing slideshow + lightbox), and a Contact form. Includes a centered Resume button for direct Google Drive download (no view page) and a Service Worker for improved UX.

</div>

---

## Table of Contents
- Overview
- Features
- Tech Stack
- Project Structure
- Screenshots
- Quick Start (Local Preview)
- Email Sending (no secrets)
- Deploy Guide
- Configuration (Env Vars)
- Security
- Acknowledgements
- License

## Overview
This repository contains a static portfolio website with an elegant UI and smooth interactions. Certificates are displayed as an auto‑playing slideshow with progress, and clicking a slide opens a full‑screen lightbox preview. The Resume button triggers a direct download via Google Drive, avoiding the default view page for a faster experience.

> Goal: Deliver a clean, performant portfolio that’s easy to deploy and maintain.

## Features
- 🎡 Hero carousel and clean navigation
- 🧑‍💻 About section with concise profile line
- 📈 Performance Metrics cards with clear stats
- 🏅 Certificates slideshow with progress indicator + lightbox
- 📄 Resume direct download from Google Drive
- ✉️ Contact form with serverless email sending (Resend)
- ⚙️ Service Worker (`sw.js`) registration

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

## Screenshots
- Desktop overview

![Portfolio Overview](Screenshot.png)

## Quick Start (Local Preview)
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
- Uses Resend API in `api/send-email.js` (serverless function)
- Set `RESEND_API_KEY` as an environment variable on your deploy platform
- The contact form posts to the serverless endpoint (e.g., Vercel Functions / Netlify Functions)

### Endpoint & Payload
- Typical endpoint: `/api/send-email` (platform‑specific)
- Method: `POST`
- Content‑Type: `application/json`

Example payload:

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"subject": "Hello",
	"message": "I’d like to get in touch."
}
```

## Deploy Guide
Choose one of the following platforms:

- GitHub Pages: Host the static frontend (no serverless functions). Ideal for quick demos of the UI.
- Vercel: Static hosting + Serverless Functions. Set `RESEND_API_KEY` in Project Settings → Environment Variables.
- Netlify: Static hosting + Functions. Configure a functions directory and set `RESEND_API_KEY` in Site settings → Environment.

Tip: After deploying, add a “Live Demo” link here for quick access.

## Configuration (Env Vars)
| Variable         | Required | Description                              |
|------------------|----------|------------------------------------------|
| `RESEND_API_KEY` | Yes      | Resend API key set on deploy platform    |

## Security
- Do not commit `RESEND_API_KEY` or any secrets to the repository
- Use environment variables on the deploy platform only

## Acknowledgements
- UI theme base: TemplateMo Prism Flux — https://templatemo.com/tm-600-prism-flux

## License
Licensed under MIT — see `LICENSE` for details.

