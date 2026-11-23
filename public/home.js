/* The Launch Edge homepage motion, v2. GSAP 3.15 + ScrollTrigger + SplitText + Lenis.
   Signature: a pinned hero where open threads resolve as you scroll, the counter in the headline ticks down,
   then a circle of blue opens from that counter. Then the decisions are yours to tap.
   Motion language: expo.out (entrances), expo.inOut (wipes), sine.inOut (idle drift). Everything is guarded:
   no libraries or reduced motion = a calm static page with the same content. */
(() => {
  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- pill buttons: the colour circle grows from where the pointer enters ---------- */
  $$('.btn').forEach((b) => {
    const set = (e) => { const r = b.getBoundingClientRect(); b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px'); };
    b.addEventListener('pointerenter', set); b.addEventListener('pointerleave', set);
  });

  /* ---------- the decisions: tap Approve, the card closes, the tally rolls down ---------- */
  function decisions() {
    const cards = $$('[data-card]'), tallyEl = $('[data-tally]'), finale = $('[data-finale]'), ft = $('[data-finale-text]');
    if (!cards.length) return;
    let left = cards.length;
    cards.forEach((card) => {
      const yes = $('[data-approve]', card);
      yes.addEventListener('click', (e) => {
        if (card.classList.contains('is-done')) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--cx', (e.clientX - r.left || r.width / 2) + 'px'); card.style.setProperty('--cy', (e.clientY - r.top || r.height) + 'px');
        card.classList.add('is-done');
        $$('button', card).forEach((b) => (b.disabled = true));
        left -= 1;
        if (window.gsap && !reduce) {
          gsap.fromTo(tallyEl, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .6, ease: 'expo.out' });
        }
        tallyEl.textContent = String(left);
        if (left === 0) {
          ft.textContent = 'Done. That was your whole morning.';
          finale.classList.add('is-on');
        } else ft.textContent = left === 1 ? 'One more.' : 'Two to go.';
      });
    });
  }
  decisions();

  /* ---------- contact form (works with or without motion) ---------- */
  const form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target, btn = f.querySelector('button[type=submit]'), label = btn.querySelector('.lbl'), sent = f.querySelector('.sent'), err = f.querySelector('.err');
      btn.disabled = true; err.style.display = 'none'; label.textContent = 'Sending…';
      try {
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: f.name.value, email: f.email.value, dial: f.dial.value, phone: f.phone.value, message: f.message.value }) });
        if (!res.ok) throw new Error();
        sent.style.display = 'block'; label.textContent = 'Sent';
      } catch (_) { btn.disabled = false; label.textContent = 'Request my call'; err.style.display = 'block'; }
    });
  }

  /* ---------- nav theming works without GSAP ---------- */
  const nav = $('#nav');
  let heroDark = false;
  const zones = [['#decide', 'blue'], ['.proof', 'ink'], ['.foot', 'ink']].map(([s, k]) => [$(s), k]);
  const paintNav = () => {
    const y = nav.offsetHeight / 2;
    let dark = heroDark, ink = false;
    zones.forEach(([el, k]) => { if (!el) return; const r = el.getBoundingClientRect(); if (r.top <= y && r.bottom > y) { dark = true; ink = k === 'ink'; } });
    nav.classList.toggle('is-solid', scrollY > 40 && !heroDark);
    nav.classList.toggle('is-dark', dark); nav.classList.toggle('is-ink', ink);
    if (dark && scrollY > 40) nav.classList.add('is-solid');
  };
  addEventListener('scroll', paintNav, { passive: true }); paintNav();

  if (!window.gsap || !window.ScrollTrigger || !window.SplitText) { root.classList.remove('js'); return; }
  window.__motionReady = true;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  const E = { out: 'expo.out', inOut: 'expo.inOut' };
  const MOTION = '(prefers-reduced-motion: no-preference)';

  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- hero: the thread field ---------- */
  const THREADS = [
    ['Vendor invoice 0418', 1], ['Launch checklist', 0], ['Candidate: offer timing', 1], ['Q4 offsite venue', 0], ['NDA sign-off', 1], ['Supplier delivery slot', 0],
    ['Pricing page copy', 1], ['Press enquiry', 0], ['Calendar clash, Thu 3pm', 1], ['Pipeline numbers', 0], ['Investor update', 1], ['Board: February dates', 0],
    ['Support case 4471', 1], ['Board pack figures', 0], ['Partner intro', 1], ['Q1 forecast', 0], ['Payroll cut-off', 1], ['Laptop shipped', 0],
  ];
  const DECS = ['Approve Q1 hiring plan?', 'Jakarta wants exclusivity', 'Launch slipped a week'];
  // hand-placed in % of the stage, keeping clear of the headline (x 5-66, y 24-60) and the copy block (x 5-38, y 64-88)
  const POS = [[6, 12], [24, 8], [44, 12], [62, 8], [80, 12], [77, 26], [84, 40], [82, 52], [70, 57], [80, 64], [72, 76], [84, 80], [78, 89],
    [44, 70], [58, 74], [50, 85], [64, 89], [48, 62], [60, 62], [70, 46], [30, 95]];
  const POS_M = [[3, 10], [40, 8], [8, 18], [34, 22], [54, 15], [3, 79], [46, 81], [24, 83], [8, 88], [44, 90], [2, 94], [38, 95]];
  function hero() {
    const hero = $('.hero'), field = $('[data-field]'); if (!hero || !field) return;
    const small = innerWidth < 700;
    const items = [];
    THREADS.forEach((t, i) => items.push({ t: t[0], dec: false, keep: t[1] === 1 || !small }));
    // on phones keep half the threads so it stays light and uncluttered
    const res = items.filter((it) => (small ? it.keep : true));
    const all = [];
    res.forEach((it, i) => all.push({ ...it }));
    DECS.forEach((d) => all.push({ t: d, dec: true }));
    // interleave decisions among the threads
    const mix = []; const rs = all.filter((a) => !a.dec), ds = all.filter((a) => a.dec);
    rs.forEach((r, i) => { mix.push(r); if ((i + 1) % Math.ceil(rs.length / 3) === 0 && ds.length) mix.push(ds.shift()); });
    ds.forEach((d) => mix.push(d));
    const chips = mix.map((it, i) => {
      const P = small ? POS_M : POS; const p = P[i % P.length];
      const el = document.createElement('div');
      el.className = 'chip' + (it.dec ? ' chip--dec' : '');
      el.style.setProperty('--x', p[0] + '%'); el.style.setProperty('--y', p[1] + '%');
      el.innerHTML = '<i>' + it.t + '</i>';
      field.appendChild(el);
      return { el, i: $('i', el), dec: it.dec };
    });
    const resolvers = chips.filter((c) => !c.dec), keepers = chips.filter((c) => c.dec);
    const total = chips.length, N = resolvers.length;
    const countEl = $('[data-count]'), arc = $('.arc'), handled = $('[data-handled]');
    countEl.textContent = String(total); handled.textContent = String(N);

    // alive from the first frame: chips pop in, then drift forever
    gsap.set(chips.map((c) => c.el), { x: 0, y: 0 });
    gsap.from(chips.map((c) => c.i), { scale: 0, opacity: 0, duration: 1.1, ease: E.out, stagger: { each: 0.045, from: 'random' }, delay: .5 });
    chips.forEach((c) => gsap.to(c.i, { x: gsap.utils.random(-14, 14), y: gsap.utils.random(-12, 12), rotation: gsap.utils.random(-2.5, 2.5), duration: gsap.utils.random(3, 5.5), ease: 'sine.inOut', yoyo: true, repeat: -1, delay: gsap.utils.random(0, 2) }));

    // chips lean away from the cursor
    if (fine) {
      const q = chips.map((c) => ({ c, x: gsap.quickTo(c.el, 'x', { duration: .9, ease: 'power3' }), y: gsap.quickTo(c.el, 'y', { duration: .9, ease: 'power3' }) }));
      hero.addEventListener('pointermove', (e) => {
        q.forEach((o) => { const r = o.c.el.getBoundingClientRect(); const dx = r.left + r.width / 2 - e.clientX, dy = r.top + r.height / 2 - e.clientY; const d = Math.hypot(dx, dy), R = 220;
          if (d < R) { const k = (1 - d / R) * 70 / (d || 1); o.x(dx * k); o.y(dy * k); } else { o.x(0); o.y(0); } });
      });
      hero.addEventListener('pointerleave', () => q.forEach((o) => { o.x(0); o.y(0); }));
    }

    // the pinned scroll: resolve, count down, open the blue
    const blue = $('[data-blue]'), dial = $('[data-dial]'), foot = $('.hero__foot'), h1 = $('.hero h1');
    const textSplit = SplitText.create($('[data-blue-text]'), { type: 'lines', mask: 'lines' });
    gsap.set(textSplit.lines, { yPercent: 115 });
    const o = { r: 0, n: total };
    let cx = 0, cy = 0, R = 0;
    const measure = () => { const hr = hero.getBoundingClientRect(), dr = dial.getBoundingClientRect(); cx = dr.left - hr.left + dr.width / 2; cy = dr.top - hr.top + dr.height / 2; R = Math.hypot(Math.max(cx, hr.width - cx), Math.max(cy, hr.height - cy)) + 40; };
    const STEP = 0.3, T1 = N * STEP;
    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: hero, start: 'top top', end: () => '+=' + Math.round(innerHeight * (small ? 2.6 : 3.2)), pin: true, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
      onRefresh: measure, onUpdate: (s) => { const d = s.progress > 0.62; if (d !== heroDark) { heroDark = d; paintNav(); } }, onLeave: () => { heroDark = false; paintNav(); } } });
    tl.to(o, { n: keepers.length, duration: T1, onUpdate: () => { const n = Math.round(o.n); countEl.textContent = String(n); arc.style.strokeDashoffset = String(100 - 100 * (total - o.n) / N); } }, 0);
    resolvers.forEach((c, k) => {
      const at = k * STEP;
      tl.to(c.i, { backgroundColor: '#2342f5', color: '#f5f2ec', duration: .12 }, at)
        .to(c.i, { scale: 0, rotation: 12, duration: .22, ease: 'power3.in', overwrite: false }, at + .1);
    });
    const W0 = T1 + 0.4;
    tl.to(foot, { opacity: 0, y: -20, duration: .8, ease: 'power2.in' }, W0 - .2);
    tl.to(o, { r: 1, duration: 2.4, ease: 'expo.inOut', onUpdate: () => { blue.style.clipPath = `circle(${o.r * R}px at ${cx}px ${cy}px)`; } }, W0);
    tl.to(textSplit.lines, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: .12 }, W0 + 1.5);
    tl.to('.hero__blue .mono', { opacity: 1, duration: .6 }, W0 + 2.4);
    tl.to({}, { duration: 1.6 }, W0 + 3);
    if (!small) {
      // counter breathes with the chips resolving
      tl.fromTo(dial, { scale: 1 }, { scale: 1.12, duration: T1 / 2, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 0);
    }
  }

  /* ---------- masked line reveals ---------- */
  function splits() {
    $$('[data-split]').forEach((el) => {
      SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true,
        onSplit(self) { gsap.set(el, { autoAlpha: 1 }); return gsap.from(self.lines, { yPercent: 112, duration: 1.3, ease: E.out, stagger: .09, scrollTrigger: { trigger: el, start: 'top 88%', once: true } }); } });
    });
  }

  /* ---------- decision cards rise out of the blue ---------- */
  function cards() {
    const cs = $$('[data-card]'); if (!cs.length) return;
    gsap.from(cs, { clipPath: 'inset(100% 0% 0% 0% round 28px)', y: 40, duration: 1.3, ease: E.out, stagger: .12, scrollTrigger: { trigger: '[data-cards]', start: 'top 82%', once: true } });
    const hint = $('[data-approve]');
    if (hint) gsap.to(hint, { boxShadow: '0 0 0 8px rgba(35,66,245,.28)', repeat: -1, yoyo: true, duration: 1, ease: 'sine.inOut', delay: 2 });
  }

  /* ---------- method: each word fills with blue as you reach it ---------- */
  function steps() {
    $$('[data-steps] .step').forEach((st) => {
      const f = $('.f', st);
      gsap.fromTo(f, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: st, start: 'top 78%', end: 'top 28%', scrub: true } });
      gsap.fromTo($('.w', st), { xPercent: -3 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: st, start: 'top bottom', end: 'top 40%', scrub: true } });
    });
  }

  /* ---------- numbers roll up ---------- */
  function counters() {
    $$('[data-counter]').forEach((el) => {
      const end = Number(el.dataset.counter), o = { v: 0 }; el.textContent = '0';
      gsap.to(o, { v: end, duration: 2.2, ease: 'expo.out', onUpdate: () => (el.textContent = Math.round(o.v)), scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });
  }

  /* ---------- names drift; scrolling pushes them (Lenis velocity) ---------- */
  function marquee() {
    const track = $('[data-marquee]'); if (!track) return;
    const kids = [...track.children];
    for (let n = 0; n < 3; n++) kids.forEach((k) => track.appendChild(k.cloneNode(true)));
    let x = 0, dir = 1, half = track.scrollWidth / 2;
    addEventListener('resize', () => (half = track.scrollWidth / 2));
    const set = gsap.quickSetter(track, 'x', 'px');
    gsap.ticker.add((time, dt) => { const v = lenis ? lenis.velocity : 0; if (Math.abs(v) > .4) dir = Math.sign(v); x -= dir * (.7 + Math.min(Math.abs(v) * .35, 10)) * (dt / 16.667); set(gsap.utils.wrap(-half, 0, x)); });
  }

  function portrait() {
    $$('[data-reveal-img]').forEach((fig) => {
      const img = $('img', fig);
      gsap.timeline({ scrollTrigger: { trigger: fig, start: 'top 85%', once: true } })
        .fromTo(fig, { clipPath: 'inset(100% 0% 0% 0% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.5, ease: E.inOut })
        .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease: E.out }, 0);
    });
  }

  /* ---------- footer wordmark: letters rise ---------- */
  function fit() {
    const el = $('[data-fit]'); if (!el) return;
    const span = el.firstElementChild;
    const go = () => { el.style.fontSize = ''; const fs = parseFloat(getComputedStyle(el).fontSize); el.style.fontSize = (fs * (el.clientWidth / span.getBoundingClientRect().width)).toFixed(2) + 'px'; };
    go(); addEventListener('resize', go);
  }
  function letters() {
    const span = $('[data-letters]'); if (!span) return;
    const txt = span.textContent; span.textContent = '';
    const ls = [...txt].map((ch) => { const s = document.createElement('span'); s.textContent = ch === ' ' ? ' ' : ch; s.style.display = 'inline-block'; span.appendChild(s); return s; });
    span.parentElement.style.overflow = 'hidden';
    gsap.from(ls, { yPercent: 105, duration: 1.4, ease: E.out, stagger: .04, scrollTrigger: { trigger: span.parentElement, start: 'top 98%', once: true } });
  }

  function magnetic() {
    $$('[data-magnetic]').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: .7, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: .7, ease: 'power3' });
      let r = null;
      el.addEventListener('pointerenter', () => { gsap.set(el, { x: 0, y: 0 }); r = el.getBoundingClientRect(); });
      el.addEventListener('pointermove', (e) => { if (!r) return; xTo((e.clientX - (r.left + r.width / 2)) * .25); yTo((e.clientY - (r.top + r.height / 2)) * .35); });
      el.addEventListener('pointerleave', () => { r = null; xTo(0); yTo(0); });
    });
  }

  const boot = () => {
    fit();
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => { hero(); splits(); cards(); steps(); counters(); marquee(); portrait(); letters(); });
    mm.add(`(hover: hover) and (pointer: fine) and ${MOTION}`, magnetic);
    ScrollTrigger.sort();
    addEventListener('load', () => ScrollTrigger.refresh());
  };
  Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))]).then(boot);
})();
