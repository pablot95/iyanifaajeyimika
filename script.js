document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'f12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && k === 'u')) {
    e.preventDefault();
  }
});

function initDevToolsGuard() {
  let overlay = null;
  let open = false;
  window.setInterval(() => {
    const isOpen = window.outerWidth - window.innerWidth > 200 || window.outerHeight - window.innerHeight > 200;
    if (isOpen === open) return;
    open = isOpen;
    if (open) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'devtools-overlay';
        overlay.innerHTML = '<p>Contenido protegido.</p>';
        document.body.appendChild(overlay);
      }
      overlay.classList.add('visible');
    } else if (overlay) {
      overlay.classList.remove('visible');
    }
  }, 800);
}

const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger);
}
if (!hasGsap || reduced) {
  document.querySelectorAll('[data-animate]').forEach(el => {
    el.style.opacity = 1;
    el.style.transform = 'none';
  });
}

function carveOpon() {
  document.querySelectorAll('.opon-carve').forEach(group => {
    const big = group.classList.contains('opon-carve--big');
    const cx = big ? 230 : 210;
    const r = big ? 191 : 178;
    const size = big ? 11 : 10;
    let d = '';
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const x = cx + Math.cos(a) * r;
      const y = cx + Math.sin(a) * r;
      const k = i % 3 === 0 ? size * 1.5 : size;
      d += `M${x.toFixed(1)} ${(y - k).toFixed(1)}L${(x + k * .7).toFixed(1)} ${y.toFixed(1)}L${x.toFixed(1)} ${(y + k).toFixed(1)}L${(x - k * .7).toFixed(1)} ${y.toFixed(1)}Z`;
    }
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', d);
    group.appendChild(path);
  });
}

function initHeroIntro() {
  if (!hasGsap || reduced) return;
  const h1 = document.querySelector('[data-animate="lines"]');
  let lines = [];
  if (h1) {
    gsap.set(h1, { opacity: 1 });
    lines = Array.from(h1.querySelectorAll(':scope > span'));
    lines.forEach(line => {
      const wrap = document.createElement('span');
      wrap.className = 'line-wrap';
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.opon--hero', { scale: .9, rotate: -8, opacity: 0, duration: 1.2, ease: 'power2.out' }, 0)
    .from('.hero-field', { scale: .82, opacity: 0, duration: 1.3 }, 0)
    .to('.hero .eyebrow', { y: 0, opacity: 1, duration: .7 }, .15)
    .from(lines, { yPercent: 112, duration: 1.05, stagger: .1 }, .2)
    .to('.hero-lead', { y: 0, opacity: 1, duration: .8 }, .5)
    .to('.hero-actions', { y: 0, opacity: 1, duration: .8 }, .62)
    .to('.hero-meta', { y: 0, opacity: 1, duration: .8 }, .72)
    .from('.hero-frame', { y: 40, rotate: -16, opacity: 0, duration: 1 }, .5)
    .from('.hero-cut', { y: 70, x: 30, opacity: 0, duration: 1.1 }, .55)
    .from('.hero-chip', { scale: .92, opacity: 0, duration: .7 }, .9)
    .from('.dust-motes i', { scale: .4, opacity: 0, duration: .6, stagger: .05 }, .8);
}

function initReveals() {
  if (!hasGsap || reduced) return;
  const inHero = el => el.closest('.hero');

  document.querySelectorAll('[data-animate="wipe"]').forEach(el => {
    gsap.set(el, { opacity: 1, clipPath: 'inset(0 100% 0 0)' });
    gsap.to(el, {
      clipPath: 'inset(0 0% 0 0)',
      duration: 1.1,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  document.querySelectorAll('[data-animate="mask"]').forEach(el => {
    const img = el.querySelector('img');
    gsap.set(el, { opacity: 1, clipPath: 'inset(0 0 100% 0)' });
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%' } });
    tl.to(el, { clipPath: 'inset(0 0 0% 0)', duration: 1.15, ease: 'power3.inOut' }, 0);
    if (img) tl.from(img, { scale: 1.18, duration: 1.4, ease: 'power2.out' }, 0);
  });

  document.querySelectorAll('[data-animate="tilt"]').forEach((el, i) => {
    gsap.set(el, { rotate: i % 2 ? 2.5 : -2.5 });
    gsap.to(el, {
      y: 0, rotate: 0, opacity: 1, duration: .95, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
      delay: revealDelay(el)
    });
  });

  document.querySelectorAll('[data-animate="rise"]').forEach(el => {
    if (inHero(el)) return;
    gsap.to(el, {
      y: 0, opacity: 1, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      delay: revealDelay(el)
    });
  });

  document.querySelectorAll('[data-animate="fade"]').forEach(el => {
    if (inHero(el)) return;
    gsap.to(el, {
      y: 0, opacity: 1, duration: .85, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 92%' },
      delay: revealDelay(el)
    });
  });
}

function revealDelay(el) {
  const group = el.parentElement;
  if (!group || !group.hasAttribute('data-animate-stagger')) return 0;
  const index = Array.from(group.children).indexOf(el);
  return Math.min(index, 6) * .11;
}

function initOdu() {
  const sec = document.getElementById('odu');
  if (!sec) return;
  const marks = Array.from(sec.querySelectorAll('.odu-mark'));
  const steps = Array.from(sec.querySelectorAll('.odu-step'));
  const name = document.getElementById('odu-name');
  const dust = Array.from(sec.querySelectorAll('.odu-dust'));

  if (!hasGsap || reduced) {
    steps.forEach(s => s.classList.add('is-on'));
    return;
  }

  const mm = gsap.matchMedia();

  mm.add('(min-width: 1081px)', () => {
    sec.classList.add('odu-motion');
    gsap.set(marks, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(dust, { opacity: 0, scale: .55, transformOrigin: '50% 50%' });
    gsap.set(name, { opacity: 0, y: 16, scale: .92 });

    const setPhase = p => {
      const active = p < .1 ? 1 : p < .26 ? 2 : p < .86 ? 3 : 4;
      steps.forEach((s, i) => s.classList.toggle('is-on', i + 1 <= active));
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sec,
        start: 'top top',
        end: '+=190%',
        pin: true,
        scrub: .65,
        anticipatePin: 1,
        onUpdate: self => setPhase(self.progress)
      }
    });

    tl.to(dust, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' })
      .to('.odu-ikin', { y: -14, rotate: -2, duration: 1, ease: 'none' }, 0);

    for (let slot = 1; slot <= 8; slot++) {
      const group = marks.filter(m => m.dataset.slot === String(slot));
      tl.to(group, { strokeDashoffset: 0, duration: .55, ease: 'power2.out', stagger: .08 }, `>+=0.08`);
    }

    tl.to(name, { opacity: 1, y: 0, scale: 1, duration: .7, ease: 'back.out(1.7)' }, '>+=0.15')
      .to({}, { duration: .5 });

    setPhase(0);

    return () => {
      sec.classList.remove('odu-motion');
      gsap.set(marks, { clearProps: 'all' });
      gsap.set(dust, { clearProps: 'all' });
      gsap.set(name, { clearProps: 'all' });
      steps.forEach(s => s.classList.add('is-on'));
    };
  });

  mm.add('(max-width: 1080px)', () => {
    steps.forEach(s => s.classList.add('is-on'));
  });
}

function initParallax() {
  if (!hasGsap || reduced) return;
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const depth = parseFloat(el.dataset.parallax) || .1;
    const inHero = !!el.closest('.hero');
    gsap.to(el, {
      yPercent: depth * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: inHero ? 'top top' : 'top bottom',
        end: 'bottom top',
        scrub: .8
      }
    });
  });
}

function initPointerScene() {
  const scene = document.querySelector('.hero-scene');
  if (!scene || reduced || window.matchMedia('(hover: none)').matches) return;
  const layers = [
    { el: scene.querySelector('.opon--hero'), f: 10 },
    { el: scene.querySelector('.hero-frame'), f: 22 },
    { el: scene.querySelector('.hero-cut'), f: -16 },
    { el: scene.querySelector('.hero-chip'), f: 26 }
  ].filter(l => l.el);
  let raf = null;
  let tx = 0, ty = 0;
  scene.addEventListener('pointermove', e => {
    const r = scene.getBoundingClientRect();
    tx = (e.clientX - r.left - r.width / 2) / r.width;
    ty = (e.clientY - r.top - r.height / 2) / r.height;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      layers.forEach(l => {
        l.el.style.setProperty('--px', `${(tx * l.f).toFixed(2)}px`);
        l.el.style.setProperty('--py', `${(ty * l.f).toFixed(2)}px`);
      });
      raf = null;
    });
  });
  scene.addEventListener('pointerleave', () => {
    layers.forEach(l => {
      l.el.style.setProperty('--px', '0px');
      l.el.style.setProperty('--py', '0px');
    });
  });
  scene.classList.add('scene-live');
}

function initNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if (!toggle || !nav) return;
  const close = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      close();
      toggle.focus();
    }
  });
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function initWspFloat() {
  const btn = document.getElementById('wsp-float');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('visible'); else btn.classList.remove('visible');
  }, { passive: true });
}

function initProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${h > 0 ? (window.scrollY / h) * 100 : 0}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initMagnetic() {
  const btn = document.getElementById('cierre-cta');
  if (!btn || reduced || window.matchMedia('(hover: none)').matches) return;
  btn.addEventListener('pointermove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * .28;
    const y = (e.clientY - r.top - r.height / 2) * .38;
    btn.style.transform = `translate(${x}px, ${y}px)`;
  });
  btn.addEventListener('pointerleave', () => { btn.style.transform = 'translate(0,0)'; });
}

function initMap() {
  const el = document.getElementById('mapa');
  if (!el || typeof L === 'undefined') return;
  const map = L.map(el, { scrollWheelZoom: false, attributionControl: false }).setView([-34.6037, -58.3816], 12);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18
  }).addTo(map);
  const icon = L.divIcon({
    className: 'map-pin',
    html: '<span></span>',
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
  L.marker([-34.6037, -58.3816], { icon, keyboard: false, alt: 'Zona de atención' }).addTo(map);
}

function initDetailsRefresh() {
  if (!hasGsap) return;
  document.querySelectorAll('details').forEach(d => {
    d.addEventListener('toggle', () => ScrollTrigger.refresh());
  });
}

document.body.classList.add('js-ready');
carveOpon();
initHeroIntro();
initReveals();
initOdu();
initParallax();
initPointerScene();
initNav();
initSmoothAnchors();
initWspFloat();
initProgress();
initMagnetic();
initMap();
initDetailsRefresh();
initDevToolsGuard();

if (hasGsap) {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
