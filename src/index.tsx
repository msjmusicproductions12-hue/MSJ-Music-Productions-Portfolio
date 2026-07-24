import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './public' }))

const YOUTUBE_IDS = [
  '0ImLJcq4lqQ',
  '6PJGNGN4iIA',
  'dYyZiG1j8-0',
  'pVe3Kp5QFWY',
  'TwApunrMlzA',
  'VcSSIS_CD_k',
  'r4r9BQ4x_GQ',
  '1rDW_IlMmQU',
  'zg6X7UOz480',
  'xWebOX6oOwQ',
  'ji_RBSZsWsI',
  'hkP0L5g3l34',
  'Q0cXxH-DofU',
  'W3Xd3SkKFMc',
  'MXBxGkHTh9c',
  'c26YYpF24nc',
]

const ROLES = [
  { icon: 'fa-compact-disc', title: 'Music Producer', desc: 'Crafting original tracks from concept to final master.' },
  { icon: 'fa-sliders', title: 'Mix & Master Engineer', desc: 'Polishing every frequency for a radio-ready sound.' },
  { icon: 'fa-microphone', title: 'Singer', desc: 'Bringing melodies and lyrics to life with an emotive voice.' },
  { icon: 'fa-pen-nib', title: 'Songwriter', desc: 'Writing lyrics and melodies that tell a story.' },
  { icon: 'fa-music', title: 'Keyboardist', desc: 'Performing on keys across studio sessions and live stages.' },
  { icon: 'fa-clapperboard', title: 'Video Editor', desc: 'Editing cinematic visuals that match the music.' },
  { icon: 'fa-camera', title: 'Photographer', desc: 'Capturing moments with a creative, cinematic eye.' },
  { icon: 'fa-image', title: 'Photo Editor', desc: 'Retouching and grading photos to a polished finish.' },
]

const JOURNEY = [
  { year: '2012', title: 'The Beginning', desc: 'Born on October 30, 2012 — the start of a musical journey.' },
  { year: 'Early Years', title: 'First Notes', desc: 'Discovered a love for keys and melody at a young age.' },
  { year: 'Growth', title: 'Stage & Studio', desc: 'Started performing live and producing original music under MSJ Music Productions.' },
  { year: 'Today', title: 'MSJ Music Productions', desc: 'Producing, mixing, singing, and creating visual content across platforms.' },
  { year: 'Tomorrow', title: 'What\'s Next', desc: 'Continuing to grow as a producer, performer, and storyteller through music.' },
]

const EQUIPMENT = [
  { img: '/static/images/hero-keyboard-1.jpg', name: 'Arturia KeyLab', desc: 'MIDI performance keyboard for production & live play.' },
  { img: '/static/images/studio-blue-keyboard.jpg', name: 'Studio Rig', desc: 'Multi-keyboard studio setup for composing and recording.' },
  { img: '/static/images/home-studio-setup.jpg', name: 'König & Meyer Stand + Korg + Pa700', desc: 'Full home studio arranger setup.' },
  { img: '/static/images/live-performance-band.jpg', name: 'Korg Kronos — Live', desc: 'Live performance rig with full band on stage.' },
]

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

app.get('/', (c) => {
  const rolesHtml = ROLES.map(
    (r) => `
      <div class="role-card glass-card" tabindex="0">
        <div class="role-icon"><i class="fa-solid ${r.icon}"></i></div>
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
      </div>`
  ).join('')

  const videosHtml = YOUTUBE_IDS.map(
    (id, i) => `
      <div class="video-card glass-card" data-video-id="${id}">
        <div class="video-thumb-wrap">
          <img class="video-thumb" loading="lazy" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="Featured work video ${i + 1}" />
          <button class="play-btn" aria-label="Play video"><i class="fa-solid fa-play"></i></button>
        </div>
      </div>`
  ).join('')

  const journeyHtml = JOURNEY.map(
    (j, i) => `
      <div class="journey-item glass-card" style="--i:${i}">
        <div class="journey-year">${j.year}</div>
        <h3>${j.title}</h3>
        <p>${j.desc}</p>
      </div>`
  ).join('')

  const equipmentHtml = EQUIPMENT.map(
    (e) => `
      <div class="equip-card glass-card">
        <div class="equip-img-wrap">
          <img src="${e.img}" alt="${escapeHtml(e.name)}" loading="lazy" />
        </div>
        <h3>${e.name}</h3>
        <p>${e.desc}</p>
      </div>`
  ).join('')

  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>Manasseh Sam John — MSJ Music Productions</title>
<meta name="description" content="Manasseh Sam John — Music Producer, Singer, Songwriter & Keyboardist under MSJ Music Productions." />
<link rel="icon" href="/static/images/msj-logo.png" />

<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<link href="/static/style.css" rel="stylesheet" />
</head>
<body>

<!-- Loading Screen -->
<div id="loader" aria-hidden="true">
  <div class="loader-inner">
    <img src="/static/images/msj-logo.png" alt="MSJ Music Productions" class="loader-logo" />
    <div class="loader-bar"><span></span></div>
  </div>
</div>

<!-- Cursor glow -->
<div id="cursor-glow"></div>

<!-- Floating particles canvas -->
<canvas id="particles"></canvas>

<!-- Nav -->
<header id="site-nav" class="glass-card">
  <a href="#hero" class="nav-logo">
    <img src="/static/images/msj-logo.png" alt="MSJ" />
  </a>
  <nav class="nav-links">
    <a href="#about">About</a>
    <a href="#portfolio">Portfolio</a>
    <a href="#journey">Journey</a>
    <a href="#studio">Studio</a>
    <a href="#contact">Contact</a>
  </nav>
  <div class="nav-actions">
    <button id="theme-toggle" class="icon-btn magnetic" aria-label="Toggle theme">
      <i class="fa-solid fa-moon"></i>
    </button>
    <button id="nav-burger" class="icon-btn magnetic" aria-label="Menu">
      <i class="fa-solid fa-bars"></i>
    </button>
  </div>
</header>

<div id="mobile-menu" class="glass-card">
  <a href="#about">About</a>
  <a href="#portfolio">Portfolio</a>
  <a href="#journey">Journey</a>
  <a href="#studio">Studio</a>
  <a href="#contact">Contact</a>
</div>

<main>
  <!-- HERO -->
  <section id="hero">
    <div class="hero-bg">
      <img src="/static/images/hero-keyboard-1.jpg" alt="Manasseh performing on keyboard" />
      <div class="hero-scrim"></div>
    </div>
    <div class="hero-content">
      <p class="eyebrow reveal">MSJ Music Productions</p>
      <h1 class="hero-title reveal">Manasseh<br/>Sam&nbsp;John</h1>
      <p class="hero-sub reveal">Producer &middot; Singer &middot; Songwriter &middot; Keyboardist</p>
      <div class="hero-cta reveal">
        <a href="#portfolio" class="btn btn-primary magnetic">Watch My Work</a>
        <a href="#contact" class="btn btn-glass glass-card magnetic">Get in Touch</a>
      </div>
    </div>
    <div class="scroll-indicator"><span></span></div>
  </section>

  <!-- ABOUT -->
  <section id="about">
    <div class="section-head">
      <p class="eyebrow">About</p>
      <h2>Behind the Music</h2>
    </div>
    <div class="about-grid">
      <div class="about-portrait">
        <img src="/static/images/portrait-jacket.jpg" alt="Manasseh Sam John portrait" />
      </div>
      <div class="about-copy glass-card">
        <p>
          Manasseh Sam John is a young musician, singer, and producer behind
          <strong>MSJ Music Productions</strong>. Since childhood he has been
          drawn to melody and rhythm — writing songs, playing keys, and shaping
          sound in his home studio.
        </p>
        <p>
          Beyond music, Manasseh is also a video editor and photographer,
          crafting the full creative experience around every release — from the
          first note to the final frame.
        </p>
        <div class="about-facts">
          <div class="fact glass-card">
            <span class="fact-label">Born</span>
            <span class="fact-value">October 30, 2012</span>
          </div>
          <div class="fact glass-card">
            <span class="fact-label">Age</span>
            <span class="fact-value" id="age-value">—</span>
          </div>
          <div class="fact glass-card">
            <span class="fact-label">Brand</span>
            <span class="fact-value">MSJ Music Productions</span>
          </div>
        </div>
      </div>
    </div>

    <div class="roles-grid">
      ${rolesHtml}
    </div>
  </section>

  <!-- PORTFOLIO -->
  <section id="portfolio">
    <div class="section-head">
      <p class="eyebrow">Portfolio</p>
      <h2>Featured Work</h2>
      <p class="section-sub">A selection of performances, covers, and productions.</p>
    </div>
    <div class="video-grid">
      ${videosHtml}
    </div>
  </section>

  <!-- CREATIVE JOURNEY -->
  <section id="journey">
    <div class="section-head">
      <p class="eyebrow">Creative Journey</p>
      <h2>The Story So Far</h2>
    </div>
    <div class="journey-list">
      ${journeyHtml}
    </div>
  </section>

  <!-- STUDIO & EQUIPMENT -->
  <section id="studio">
    <div class="section-head">
      <p class="eyebrow">Studio &amp; Equipment</p>
      <h2>The Gear Behind the Sound</h2>
    </div>
    <div class="equip-grid">
      ${equipmentHtml}
    </div>
    <div class="studio-gallery">
      <img src="/static/images/studio-mic.jpg" alt="Studio microphone session" />
      <img src="/static/images/studio-blue-keyboard.jpg" alt="Studio keyboard session" />
      <img src="/static/images/portrait-smile.jpg" alt="Manasseh smiling in studio" />
    </div>
  </section>

  <!-- CONTACT -->
  <section id="contact">
    <div class="section-head">
      <p class="eyebrow">Contact</p>
      <h2>Let's Create Something</h2>
    </div>
    <div class="contact-grid">
      <a class="contact-card glass-card magnetic" href="tel:+918921087645">
        <i class="fa-solid fa-phone"></i>
        <span class="contact-label">Phone</span>
        <span class="contact-value">+91 89210 87645</span>
      </a>
      <a class="contact-card glass-card magnetic" href="https://wa.me/918921087645" target="_blank" rel="noopener">
        <i class="fa-brands fa-whatsapp"></i>
        <span class="contact-label">WhatsApp</span>
        <span class="contact-value">+91 89210 87645</span>
      </a>
      <a class="contact-card glass-card magnetic" href="mailto:msjmusicproductions12@gmail.com">
        <i class="fa-solid fa-envelope"></i>
        <span class="contact-label">Email</span>
        <span class="contact-value">msjmusicproductions12@gmail.com</span>
      </a>
    </div>

    <div class="section-head follow-head">
      <p class="eyebrow">Follow Me</p>
    </div>
    <div class="socials">
      <a class="social-btn glass-card magnetic" href="https://www.instagram.com/msjmusic_productions?igsh=MTVrOGZoYzVrMWdiNw==" target="_blank" rel="noopener" aria-label="Instagram">
        <i class="fa-brands fa-instagram"></i>
      </a>
      <a class="social-btn glass-card magnetic" href="https://www.facebook.com/share/19CjdUjuFD/" target="_blank" rel="noopener" aria-label="Facebook">
        <i class="fa-brands fa-facebook"></i>
      </a>
    </div>
  </section>
</main>

<footer>
  <img src="/static/images/msj-logo.png" alt="MSJ Music Productions" class="footer-logo" />
  <p>&copy; <span id="year"></span> MSJ Music Productions. All rights reserved.</p>
</footer>

<!-- Video modal -->
<div id="video-modal">
  <div class="video-modal-inner glass-card">
    <button id="video-modal-close" class="icon-btn magnetic" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
    <div id="video-modal-frame"></div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>
<script src="/static/liquid-glass.js"></script>
<script src="/static/app.js"></script>
</body>
</html>`)
})

export default app
