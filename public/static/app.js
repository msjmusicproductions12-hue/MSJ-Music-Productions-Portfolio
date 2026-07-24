/* MSJ Music Productions — interaction layer
 * GSAP + ScrollTrigger for reveals, Lenis for smooth scroll,
 * liquid-glass.js for real refraction on .glass-card elements.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
   * 0. Theme (dark default, persisted)
   * ------------------------------------------------------------------- */
  const THEME_KEY = "msj-theme";
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    const icon = document.querySelector("#theme-toggle i");
    if (icon) icon.className = t === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
  const savedTheme = localStorage.getItem(THEME_KEY) || "dark";
  applyTheme(savedTheme);

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------------------------------------------------------------------
   * 1. Age auto-calculation
   * ------------------------------------------------------------------- */
  (function setAge() {
    const dob = new Date(2012, 9, 30); // Oct 30, 2012
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
      now.getMonth() > dob.getMonth() ||
      (now.getMonth() === dob.getMonth() && now.getDate() >= dob.getDate());
    if (!hasHadBirthdayThisYear) age -= 1;
    const el = document.getElementById("age-value");
    if (el) el.textContent = age + " years";
  })();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------------------
   * 2. Loading screen
   * ------------------------------------------------------------------- */
  window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    setTimeout(function () {
      if (loader) loader.classList.add("loaded");
      startEntranceAnimations();
    }, 650);
  });
  // Fallback in case 'load' already fired / slow assets
  setTimeout(function () {
    const loader = document.getElementById("loader");
    if (loader && !loader.classList.contains("loaded")) {
      loader.classList.add("loaded");
      startEntranceAnimations();
    }
  }, 3200);

  /* ---------------------------------------------------------------------
   * 3. Lenis smooth scroll
   * ------------------------------------------------------------------- */
  let lenis = null;
  try {
    if (window.Lenis) {
      lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      if (window.gsap && window.gsap.ticker) {
        window.gsap.ticker.add(function (time) {
          lenis.raf(time * 1000);
        });
      }
      lenis.on("scroll", function () {
        if (window.ScrollTrigger) window.ScrollTrigger.update();
      });
    }
  } catch (e) { /* Lenis optional */ }

  // Anchor links -> lenis scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMobileMenu();
      if (lenis) {
        lenis.scrollTo(target, { offset: -90, duration: 1.1 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ---------------------------------------------------------------------
   * 4. GSAP entrance + scroll reveal animations
   * ------------------------------------------------------------------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  function startEntranceAnimations() {
    if (!window.gsap) return;
    gsap.to("#hero .reveal", {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "elastic.out(1, 0.85)",
      stagger: 0.12,
      delay: 0.1,
    });
  }

  function initScrollReveals() {
    if (!window.gsap || !window.ScrollTrigger) return;

    const groups = [
      ".about-portrait",
      ".about-copy",
      ".role-card",
      ".video-card",
      ".journey-item",
      ".equip-card",
      ".studio-gallery img",
      ".contact-card",
      ".social-btn",
      ".section-head",
    ];

    groups.forEach(function (sel) {
      const els = document.querySelectorAll(sel);
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: 34 });
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "back.out(1.6)",
        stagger: 0.08,
        scrollTrigger: {
          trigger: els[0].closest("section") || els[0],
          start: "top 82%",
          once: true,
        },
      });
    });

    // Nav shrink/tint on scroll
    const nav = document.getElementById("site-nav");
    if (nav) {
      ScrollTrigger.create({
        start: 40,
        end: 99999,
        onUpdate: function (self) {
          nav.classList.toggle("scrolled", self.scroll() > 40);
        },
      });
    }
  }

  document.addEventListener("DOMContentLoaded", initScrollReveals);

  /* ---------------------------------------------------------------------
   * 5. Mobile menu
   * ------------------------------------------------------------------- */
  const burger = document.getElementById("nav-burger");
  const mobileMenu = document.getElementById("mobile-menu");
  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove("open");
  }
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      mobileMenu.classList.toggle("open");
    });
  }

  /* ---------------------------------------------------------------------
   * 6. Cursor glow (desktop only)
   * ------------------------------------------------------------------- */
  const glow = document.getElementById("cursor-glow");
  if (glow && window.matchMedia("(hover: hover)").matches) {
    window.addEventListener("mousemove", function (e) {
      glow.style.transform = "translate(" + e.clientX + "px," + e.clientY + "px) translate(-50%,-50%)";
    });
  }

  /* ---------------------------------------------------------------------
   * 7. Magnetic buttons
   * ------------------------------------------------------------------- */
  if (window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        if (window.gsap) {
          gsap.to(el, { x: x * 0.28, y: y * 0.28, duration: 0.4, ease: "power3.out" });
        } else {
          el.style.transform = "translate(" + x * 0.2 + "px," + y * 0.2 + "px)";
        }
      });
      el.addEventListener("mouseleave", function () {
        if (window.gsap) {
          gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
        } else {
          el.style.transform = "";
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
   * 8. Floating particles (lightweight canvas)
   * ------------------------------------------------------------------- */
  (function particles() {
    const canvas = document.getElementById("particles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, particlesArr;
    const COUNT = window.innerWidth < 700 ? 26 : 55;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    function makeParticles() {
      particlesArr = [];
      for (let i = 0; i < COUNT; i++) {
        particlesArr.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.4,
          vy: -(Math.random() * 0.35 + 0.08),
          vx: (Math.random() - 0.5) * 0.15,
          o: Math.random() * 0.5 + 0.15,
        });
      }
    }
    function tick() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,1)";
      particlesArr.forEach(function (p) {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        ctx.globalAlpha = p.o;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(tick);
    }
    resize();
    makeParticles();
    tick();
    window.addEventListener("resize", function () {
      resize();
      makeParticles();
    });
  })();

  /* ---------------------------------------------------------------------
   * 9. Video modal (YouTube lazy embed)
   * ------------------------------------------------------------------- */
  const modal = document.getElementById("video-modal");
  const modalFrame = document.getElementById("video-modal-frame");
  const modalClose = document.getElementById("video-modal-close");

  function openVideo(id) {
    if (!modal || !modalFrame) return;
    modalFrame.innerHTML =
      '<iframe src="https://www.youtube.com/embed/' + id +
      '?autoplay=1&rel=0" title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeVideo() {
    if (!modal || !modalFrame) return;
    modal.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(function () { modalFrame.innerHTML = ""; }, 250);
  }
  document.querySelectorAll(".video-card").forEach(function (card) {
    card.addEventListener("click", function () {
      const id = card.getAttribute("data-video-id");
      if (id) openVideo(id);
    });
  });
  if (modalClose) modalClose.addEventListener("click", closeVideo);
  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeVideo();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeVideo();
  });

  /* ---------------------------------------------------------------------
   * 10. Liquid glass — apply real refraction to all glass-card elements
   * ------------------------------------------------------------------- */
  function initLiquidGlass() {
    if (typeof window.liquidGlass !== "function") return;
    const targets = document.querySelectorAll(".glass-card");
    targets.forEach(function (el) {
      // Skip very large elements per the module's own performance guidance.
      if (el.offsetWidth > 900 || el.offsetHeight > 900) return;
      try {
        window.liquidGlass(el, { scale: -80, chroma: 5, blur: 4, saturate: 1.4 });
      } catch (e) { /* noop */ }
    });
  }
  // Give layout a tick to settle (fonts/images) before measuring for the map.
  window.addEventListener("load", function () {
    setTimeout(initLiquidGlass, 300);
  });
})();
