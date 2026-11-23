/* The Launch Edge homepage motion. GSAP 3.15 + ScrollTrigger + SplitText + Lenis.
   Language: expo.out entrances, expo.inOut wipes. Headings reveal in masked lines, hairlines draw, one pinned scene.
   Everything is guarded: no libraries, no motion or reduced motion = the page is simply there, end state shown. */
(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- contact form (works with or without motion) ---------- */
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target, btn = f.querySelector('button[type=submit]'), label = btn.querySelector('.btn__t'), sent = f.querySelector('.sent'), err = f.querySelector('.err');
      const idle = label.dataset.t;
      btn.disabled = true; err.style.display = 'none'; label.textContent = 'Sending…';
      const msg = [f.company.value ? 'Company/role: ' + f.company.value : '', f.message.value].filter(Boolean).join('\n\n');
      try {
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: f.name.value, email: f.email.value, dial: f.dial.value, phone: f.phone.value, message: msg }) });
        if (!res.ok) throw new Error();
        sent.style.display = 'block'; label.textContent = 'Sent';
      } catch (_) {
        btn.disabled = false; label.textContent = idle; err.style.display = 'block';
      }
    });
  }

  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) { root.classList.remove('js'); return; }
  window.__motionReady = true;
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const EASE = { out: 'expo.out', inOut: 'expo.inOut' };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MOTION = '(prefers-reduced-motion: no-preference)';

  /* ---------- smooth scroll: Lenis drives native scroll, no scroll-jacking ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- fit the footer wordmark to the container ---------- */
  function fitType() {
    const els = $$('[data-fit]');
    const fit = () => els.forEach((el) => {
      const span = el.firstElementChild; if (!span) return;
      el.style.fontSize = '';
      const fs = parseFloat(getComputedStyle(el).fontSize);
      el.style.fontSize = (fs * (el.clientWidth / span.getBoundingClientRect().width)).toFixed(2) + 'px';
    });
    fit();
    addEventListener('resize', fit);
  }

  /* ---------- hero: the page opens like a morning brief ---------- */
  function intro() {
    const nav = $('.nav'), title = $('[data-hero-title]'), glow = $('[data-glow]');
    const fades = $$('[data-hero-fade]');
    if (reduce) return;
    lenis?.stop();
    let split = null;
    const tl = gsap.timeline({ defaults: { ease: EASE.out }, onComplete: () => { split?.revert(); lenis?.start(); } });
    if (glow) tl.fromTo(glow, { opacity: 0, yPercent: 14 }, { opacity: 1, yPercent: 0, duration: 2.6, ease: 'power2.out' }, 0);
    if (nav) tl.fromTo(nav, { yPercent: -100 }, { yPercent: 0, duration: 1.1 }, 0.2);
    if (title) {
      split = SplitText.create(title, { type: 'lines', mask: 'lines' });
      gsap.set(title, { autoAlpha: 1 });
      tl.from(split.lines, { yPercent: 112, duration: 1.4, stagger: 0.11 }, 0.25);
    }
    if (fades.length) tl.fromTo(fades, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12 }, 0.9);
  }

  /* ---------- masked line reveal on headings ---------- */
  function splitReveals() {
    $$('[data-split-reveal]').forEach((el) => {
      SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true,
        onSplit(self) {
          gsap.set(el, { autoAlpha: 1 });
          return gsap.from(self.lines, { yPercent: 112, duration: 1.2, ease: EASE.out, stagger: 0.08,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        },
      });
    });
  }

  /* ---------- words light up with scroll ---------- */
  function scrubWords() {
    $$('[data-scrub-words]').forEach((el) => {
      SplitText.create(el, {
        type: 'words', autoSplit: true,
        onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.16 }, { opacity: 1, ease: 'none', stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: true } }),
      });
    });
  }

  /* ---------- hairlines draw in ---------- */
  function rules() {
    $$('[data-rule]').forEach((row) => {
      const line = document.createElement('span');
      line.className = 'rule-line'; line.setAttribute('aria-hidden', 'true');
      row.prepend(line);
      gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: EASE.inOut, scrollTrigger: { trigger: row, start: 'top 92%', once: true } });
    });
    return () => $$('.rule-line').forEach((l) => l.remove());
  }

  /* ---------- portrait: clip wipe + inner settle ---------- */
  function revealImages() {
    $$('[data-reveal-img]').forEach((fig) => {
      const img = $('img', fig);
      gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 85%', once: true } })
        .fromTo(fig, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: EASE.inOut })
        .fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2, ease: EASE.out }, 0);
    });
  }

  /* ---------- magnetic primary buttons ---------- */
  function magnetic() {
    const cleanups = [];
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' });
      let r = null;
      const enter = () => { gsap.set(el, { x: 0, y: 0 }); r = el.getBoundingClientRect(); };
      const move = (e) => { if (!r) return; xTo((e.clientX - (r.left + r.width / 2)) * 0.25); yTo((e.clientY - (r.top + r.height / 2)) * 0.35); };
      const leave = () => { r = null; xTo(0); yTo(0); };
      el.addEventListener('pointerenter', enter); el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
      cleanups.push(() => { el.removeEventListener('pointerenter', enter); el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); gsap.set(el, { clearProps: 'transform' }); });
    });
    return () => cleanups.forEach((f) => f());
  }

  /* ---------- SIGNATURE: 21 open threads become 3 decisions (pinned, scrubbed) ---------- */
  function system() {
    const sec = $('.sys'); if (!sec) return;
    const rows = $$('.th:not(.th--dec)', sec);
    const decs = $$('.th--dec', sec);
    const more = decs.map((d) => $('.dec__more', d));
    const countEl = $('[data-count]', sec);
    const total = rows.length + decs.length;
    const opens = rows.map((r) => $('.open', r));
    const dones = rows.map((r) => $('.done', r));

    gsap.set(more, { height: 0 });
    gsap.set(dones, { yPercent: 115 });
    countEl.textContent = String(total);

    const STEP = 0.3, T1 = rows.length * STEP;
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: sec, start: 'top top', end: () => '+=' + Math.round(innerHeight * 2.4), pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true },
    });
    const c = { n: total };
    tl.to(c, { n: decs.length, duration: T1, onUpdate: () => (countEl.textContent = String(Math.round(c.n))) }, 0);
    rows.forEach((row, i) => {
      const at = i * STEP;
      tl.to(opens[i], { yPercent: -115, duration: 0.25, ease: 'power3.out' }, at)
        .to(dones[i], { yPercent: 0, duration: 0.25, ease: 'power3.out' }, at)
        .to($('.t', row), { opacity: 0.38, duration: 0.25 }, at);
    });
    // resolved rows fold away, the decisions rise
    const T2 = T1 + 0.5;
    tl.to(rows, { height: 0, opacity: 0, borderBottomWidth: 0, duration: 1.2, ease: 'power2.inOut', stagger: { each: 0.035, from: 'start' } }, T2);
    // the three decisions open
    const T3 = T2 + 1.5;
    tl.to(more, { height: 'auto', duration: 1.1, ease: 'power2.out', stagger: 0.3 }, T3);
    tl.to({}, { duration: 1.2 }, T3 + 1.5); // hold on the end state
    return () => { gsap.set([more, dones, rows, opens], { clearProps: 'all' }); countEl.textContent = String(decs.length); };
  }

  /* ---------- boot after fonts, so line splits use final metrics ---------- */
  const boot = () => {
    fitType();
    intro();
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      system();   // pin first, so every trigger below includes its scroll distance
      splitReveals(); scrubWords(); rules(); revealImages();
    });
    mm.add(`(hover: hover) and (pointer: fine) and ${MOTION}`, magnetic);
    ScrollTrigger.sort();
    addEventListener('load', () => ScrollTrigger.refresh());
  };
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]).then(boot);
})();
