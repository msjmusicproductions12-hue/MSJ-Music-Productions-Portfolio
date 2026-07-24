# MSJ Music Productions — Manasseh Sam John Portfolio

## Project Overview
- **Name**: MSJ Music Productions Portfolio
- **Goal**: A premium, Apple-style personal portfolio website for **Manasseh Sam John**, showcasing his work as a music producer, singer, songwriter, keyboardist, video editor, and photographer under the **MSJ Music Productions** brand.
- **Design language**: Apple.com / WWDC / iOS 26 "Liquid Glass" aesthetic — real SVG-refraction glass panels (via `liquid-glass.js`), frosted-blur fallback for Safari/Firefox, floating UI, bold typography, smooth GSAP + Lenis animations.

## Currently Completed Features
- **Hero** — full-bleed photo hero, animated title, CTA buttons, scroll indicator.
- **About** — bio copy, auto-calculated live age (from DOB Oct 30, 2012), role/brand facts.
- **Roles grid** — 8 Liquid Glass cards (Music Producer, Mix & Master Engineer, Singer, Songwriter, Keyboardist, Video Editor, Photographer, Photo Editor) — no skill percentages, as requested.
- **Portfolio** — 16 embedded YouTube videos as glass cards with thumbnail + play button; click opens a modal lightbox with the YouTube embed. New videos can be added by editing the `YOUTUBE_IDS` array in `src/index.tsx`.
- **Creative Journey** — vertical timeline of milestones from birth to today/tomorrow.
- **Studio & Equipment** — gear cards (Arturia KeyLab, studio rig, König & Meyer stand + Korg + Pa700, live rig) plus a photo gallery.
- **Contact** — phone, WhatsApp, email glass cards (click-to-call / click-to-WhatsApp / click-to-email).
- **Follow Me** — Instagram and Facebook social buttons.
- **Dark/Light mode toggle** (persisted in localStorage, default dark).
- **Liquid Glass refraction** applied to every `.glass-card` element via `liquid-glass.js` (real refraction in Chromium; frosted blur fallback in Safari/Firefox).
- **Animations**: GSAP entrance + ScrollTrigger reveals, Lenis smooth scrolling, magnetic buttons, cursor glow (desktop), floating particles canvas, animated loading screen.
- **Responsive design**: mobile hamburger menu, responsive grids for all sections.

## Public URLs
- **Local dev preview**: served on sandbox port 3000 (via `pm2` + `wrangler pages dev`).
- **Production**: to be set after Cloudflare Pages deployment.

## Data Architecture
- **No database** — fully static content (Hono renders one HTML string server-side).
- **Static assets**: images, custom iOS-style font, and `liquid-glass.js` served from `public/static/` via Hono's `serveStatic` (Cloudflare Workers-compatible, no Node `fs`).
- **Content source**: role list, video IDs, journey milestones, and equipment list are plain arrays at the top of `src/index.tsx` — edit there to update content.

## User Guide
1. Visit the site — the loading screen briefly shows the MSJ logo, then reveals the hero.
2. Scroll or use the nav to jump to About / Portfolio / Journey / Studio / Contact.
3. Click any portfolio video thumbnail to open it in a lightbox player.
4. Use the moon/sun icon in the nav to switch between dark and light themes.
5. On mobile, tap the hamburger icon for the nav menu.
6. Use the Contact cards or Follow Me icons to reach out on phone, WhatsApp, email, Instagram, or Facebook.

## Not Yet Implemented / Next Steps
- Production Cloudflare Pages deployment (awaiting user's go-ahead / Cloudflare token).
- Optional: a CMS-free "add video" admin UI (currently requires editing `YOUTUBE_IDS` in code).
- Optional: additional media gallery (photos/reels) section if more assets are provided.
- Optional: custom domain binding once deployed.

## Deployment
- **Platform**: Cloudflare Pages (Hono + Vite)
- **Status**: ✅ Running locally in sandbox (PM2 + wrangler pages dev) — not yet deployed to production.
- **Tech Stack**: Hono (SSR HTML), TypeScript, Vite, Wrangler, vanilla CSS, GSAP + ScrollTrigger, Lenis, `liquid-glass.js` (Apple-style refraction), Font Awesome (CDN).
- **Last Updated**: 2026-07-24
