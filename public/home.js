/* The Launch Edge homepage, v3: calm. One masked-line intro (CSS), gentle rise on scroll, smooth scroll. Nothing loops or reacts to the cursor. */
(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  const form = $('#contactForm');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target, btn = f.querySelector('button[type=submit]'), label = btn.querySelector('.lbl'), sent = f.querySelector('.sent'), err = f.querySelector('.err');
    btn.disabled = true; err.style.display = 'none'; label.textContent = 'Sending…';
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: f.name.value, email: f.email.value, dial: f.dial.value, phone: f.phone.value, message: (f.topic && f.topic.value ? 'Interested in: ' + f.topic.value + '\n\n' : '') + f.message.value }) });
      if (!res.ok) throw new Error();
      sent.style.display = 'block'; label.textContent = 'Sent';
    } catch (_) { btn.disabled = false; label.textContent = 'Request my call'; err.style.display = 'block'; }
  });

  // ways to work: audience tabs dim what doesn't apply; every option pre-selects the contact form
  const tabs = $$('.tab'), opts = $$('.opt'), groups = $$('.grp .opts');
  tabs.forEach((t) => t.addEventListener('click', () => {
    tabs.forEach((x) => x.setAttribute('aria-pressed', String(x === t)));
    const a = t.dataset.aud;
    groups.forEach((g) => g.classList.toggle('is-filtered', a !== 'all'));
    opts.forEach((o) => o.classList.toggle('on', a === 'all' || o.dataset.for.split(' ').includes(a)));
  }));
  $$('[data-topic]').forEach((el) => el.addEventListener('click', () => { const s = $('#f-topic'); if (s) s.value = el.dataset.topic; }));

  const nav = $('#nav');
  const inks = [$('.proof'), $('.foot')];
  const paint = () => {
    const y = nav.offsetHeight / 2; let ink = false;
    inks.forEach((el) => { if (!el) return; const r = el.getBoundingClientRect(); if (r.top <= y && r.bottom > y) ink = true; });
    nav.classList.toggle('is-solid', scrollY > 40 || ink); nav.classList.toggle('is-dark', ink); nav.classList.toggle('is-ink', ink);
  };
  addEventListener('scroll', paint, { passive: true }); paint();

  // gentle rise, once (works without GSAP)
  const rise = $$('[data-rise]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    rise.forEach((el) => io.observe(el));
  } else rise.forEach((el) => el.classList.add('in'));

  window.__motionReady = true;
  if (reduce) return;
  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) { root.classList.remove('js'); return; }
  gsap.registerPlugin(ScrollTrigger, SplitText);
  if (window.Lenis) {
    const lenis = new Lenis({ lerp: 0.09, anchors: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  }
  const boot = () => {
    $$('[data-split]').forEach((el) => SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true,
      onSplit(self) { gsap.set(el, { autoAlpha: 1 }); return gsap.from(self.lines, { yPercent: 110, duration: 1.4, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }); } }));
    $$('[data-reveal-img]').forEach((fig) => gsap.fromTo(fig, { clipPath: 'inset(8% 0% 0% 0% round 32px)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0% round 32px)', opacity: 1, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: fig, start: 'top 88%', once: true } }));
    const fit = $('[data-fit]');
    if (fit) { const sp = fit.firstElementChild; const go = () => { fit.style.fontSize = ''; fit.style.fontSize = (parseFloat(getComputedStyle(fit).fontSize) * fit.clientWidth / sp.getBoundingClientRect().width).toFixed(2) + 'px'; }; go(); addEventListener('resize', go); }
    addEventListener('load', () => ScrollTrigger.refresh());
  };
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]).then(boot);
})();
