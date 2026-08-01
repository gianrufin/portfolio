/* ═══════════════════════════════════════════════════════════
   Gian Rufin — Portfolio · interactions
   Vanilla, no dependencies. Everything degrades gracefully.
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
const lerp = (a, b, n) => a + (b - a) * n;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ─── theme ─────────────────────────────────────────── */
(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem('gr-theme');
  if (saved) root.dataset.theme = saved;
  const meta = $('meta[name="theme-color"]');
  const sync = () => meta && (meta.content = root.dataset.theme === 'light' ? '#F0EEE2' : '#0B0C0E');
  sync();
  $('#themeToggle')?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('gr-theme', root.dataset.theme);
    sync();
  });
})();

/* ─── split text into characters (structure-preserving) ── */
function splitChars(el) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  const walk = node => {
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const ch of child.textContent) {
          if (ch === ' ') { const s = document.createElement('span'); s.className = 'sp'; s.innerHTML = '&nbsp;'; frag.appendChild(s); }
          else { const s = document.createElement('span'); s.className = 'ch'; s.textContent = ch; frag.appendChild(s); }
        }
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(el);
  $$('.ch', el).forEach((c, i) => { c.style.transitionDelay = (i * 0.018) + 's'; });
}
$$('.split').forEach(splitChars);

/* ─── reveal on scroll ──────────────────────────────── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
$$('.reveal, .split, .card').forEach(el => io.observe(el));

/* ─── number counters ───────────────────────────────── */
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = parseFloat(el.dataset.count);
    cio.unobserve(el);
    if (el.dataset.plain || REDUCED) { el.textContent = target; return; }
    const dur = 1300, t0 = performance.now();
    const tick = now => {
      const p = clamp((now - t0) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, { threshold: 0.6 });
$$('[data-count]').forEach(el => cio.observe(el));

/* ─── loader ────────────────────────────────────────── */
(() => {
  const loader = $('#loader'), num = $('#loaderNum'), bar = $('#loaderBar');
  const hero = $('.hero');
  const finish = () => {
    loader?.classList.add('is-out');
    hero?.classList.add('is-ready');
    document.body.classList.remove('is-locked');
    setTimeout(() => loader?.remove(), 1400);
  };
  if (REDUCED) { if (loader) loader.style.display = 'none'; hero?.classList.add('is-ready'); return; }
  document.body.classList.add('is-locked');
  let p = 0;
  const t = setInterval(() => {
    p = Math.min(100, p + Math.random() * 16 + 6);
    if (num) num.textContent = String(Math.round(p)).padStart(2, '0');
    if (bar) bar.style.width = p + '%';
    if (p >= 100) { clearInterval(t); setTimeout(finish, 380); }
  }, 130);
  setTimeout(() => { clearInterval(t); finish(); }, 4200); // hard safety
})();

/* ─── nav: stick + hide on scroll down ──────────────── */
(() => {
  const nav = $('#nav');
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-stuck', y > 40);
    nav.classList.toggle('is-hidden', y > 400 && y > last && !$('#menu').classList.contains('is-open'));
    last = y;
    const doc = document.documentElement.scrollHeight - window.innerHeight;
    const bar = $('.scroll-progress i');
    if (bar) bar.style.width = (doc > 0 ? (y / doc) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── mobile menu ───────────────────────────────────── */
(() => {
  const burger = $('#burger'), menu = $('#menu');
  if (!burger) return;
  const set = open => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => set(!menu.classList.contains('is-open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();

/* ─── custom cursor + magnetic ──────────────────────── */
if (FINE && !REDUCED) {
  const ring = $('.cursor'), dot = $('.cursor-dot'), label = $('.cursor__label');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    document.body.classList.add('cursor-on');
    dot.style.transform = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
  }, { passive: true });
  (function loop() {
    rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on'));

  $$('a, button, [data-cursor], .card, .client, .cr').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const txt = el.dataset.cursor || el.closest('[data-cursor]')?.dataset.cursor;
      if (txt) { label.textContent = txt; document.body.classList.add('cursor-hover'); }
      else document.body.classList.add('cursor-mag');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover', 'cursor-mag');
      label.textContent = '';
    });
  });

  // magnetic buttons
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.28;
      const y = (e.clientY - r.top - r.height / 2) * 0.42;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  // card spotlight follows pointer
  $$('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });
}

/* ─── 3D tilt ───────────────────────────────────────── */
if (FINE && !REDUCED) {
  $$('[data-tilt]').forEach(stage => {
    const inner = stage.querySelector('.phone, .frame, img') || stage.firstElementChild;
    if (!inner) return;
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `perspective(900px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg) translateY(-6px) scale(1.02)`;
    });
    stage.addEventListener('mouseleave', () => { inner.style.transform = ''; });
  });
}

/* ─── parallax (scroll-linked, transform only) ──────── */
if (!REDUCED) {
  const items = $$('[data-parallax]').map(el => ({ el, s: parseFloat(el.dataset.parallax) || 0.2 }));
  let ticking = false;
  const run = () => {
    const vh = window.innerHeight;
    items.forEach(({ el, s }) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      const mid = r.top + r.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${(-mid * s).toFixed(2)}px, 0)`;
    });
    ticking = false;
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  run();
}

/* ─── float durations ───────────────────────────────── */
$$('[data-float]').forEach(el => {
  const target = el.firstElementChild || el;
  target.style.setProperty('--dur', el.dataset.float + 's');
  target.style.setProperty('--dl', (Math.random() * -6).toFixed(2) + 's');
});

/* ─── marquee ───────────────────────────────────────── */
if (!REDUCED) {
  $$('[data-marquee]').forEach(row => {
    const set = row.firstElementChild;
    let x = 0, w = set.offsetWidth, speed = 0.42;
    window.addEventListener('resize', () => { w = set.offsetWidth; });
    let vel = speed, lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const d = window.scrollY - lastY; lastY = window.scrollY;
      vel = speed + clamp(Math.abs(d) * 0.08, 0, 3.4);
    }, { passive: true });
    (function tick() {
      vel = lerp(vel, speed, 0.05);
      x -= vel;
      if (w && x <= -w) x += w;
      row.style.transform = `translate3d(${x}px,0,0)`;
      requestAnimationFrame(tick);
    })();
  });
}

/* ─── craft: vertical scroll → horizontal track ─────── */
if (!REDUCED && window.matchMedia('(min-width: 901px)').matches) {
  const section = $('#craft'), track = $('#craftTrack');
  if (section && track) {
    let target = 0, current = 0, max = 0;
    const measure = () => { max = Math.max(0, track.scrollWidth - window.innerWidth + 40); };
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', () => {
      const r = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const p = clamp(-r.top / (total || 1), 0, 1);
      target = -p * max;
    }, { passive: true });
    (function tick() {
      current = lerp(current, target, 0.09);
      track.style.transform = `translate3d(${current.toFixed(2)}px,0,0)`;
      requestAnimationFrame(tick);
    })();
  }
}

/* ─── work filters ──────────────────────────────────── */
(() => {
  const btns = $$('.filter'), cards = $$('#cards .card');
  btns.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    btns.forEach(b => { b.classList.toggle('is-on', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
    cards.forEach((c, i) => {
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('is-hidden', !show);
      if (show) {
        c.classList.remove('is-in');
        // restart the entrance animation with a stagger
        void c.offsetWidth;
        setTimeout(() => c.classList.add('is-in'), i * 55);
      }
    });
  }));
})();

/* ─── smooth anchors (respects reduced motion) ──────── */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', id);
  });
});

/* ─── year ──────────────────────────────────────────── */
const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

})();
