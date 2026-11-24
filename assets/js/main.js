(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;
  const MEDIA = window.SITE_MEDIA || { awards: {}, projects: {} };
  const EMAIL = 'ardaoztuner3@gmail.com';
  const COLORS = ['#5B4CF0', '#FF6B4A', '#10B981', '#F5A524', '#3B9EF5', '#E8508A'];

  $('#year').textContent = new Date().getFullYear();

  /* ---------------- toast & clipboard ---------------- */
  const toastEl = $('#toast');
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    toast(msg || 'Copied to clipboard');
  }
  $$('.copy-email').forEach(b => b.addEventListener('click', () => copy(EMAIL, 'Email copied — talk soon ✦')));
  $$('.cite-btn').forEach(b => b.addEventListener('click', () => {
    copy(b.dataset.cite, 'Citation copied');
    b.classList.add('done'); b.textContent = 'Copied ✓';
    setTimeout(() => { b.classList.remove('done'); b.textContent = 'Cite'; }, 1800);
  }));

  /* ---------------- scroll progress, nav, timeline ---------------- */
  const progress = $('#progress'), nav = $('#nav'), timeline = $('#timeline');
  let ticking = false;
  function onScroll() {
    const d = document.documentElement;
    const max = d.scrollHeight - d.clientHeight;
    progress.style.transform = `scaleX(${max > 0 ? d.scrollTop / max : 0})`;
    nav.classList.toggle('scrolled', d.scrollTop > 24);
    if (timeline) {
      const r = timeline.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.65 - r.top) / r.height));
      timeline.style.setProperty('--fill', p.toFixed(3));
    }
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* active section pill */
  const links = $$('#navLinks a'), pill = $('#navPill');
  function movePill(a) {
    links.forEach(l => l.classList.toggle('active', l === a));
    if (!a) { pill.style.opacity = 0; return; }
    pill.style.opacity = 1;
    pill.style.width = a.offsetWidth + 'px';
    pill.style.transform = `translateX(${a.offsetLeft}px)`;
  }
  const secObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id === 'skills' ? 'awards' : e.target.id; // skills sits under the awards link
      movePill(links.find(l => l.getAttribute('href') === '#' + id) || null);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => secObs.observe(s));
  addEventListener('resize', () => movePill(links.find(l => l.classList.contains('active')) || null));

  /* ---------------- reveal on scroll ---------------- */
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('[data-count]', e.target).forEach(countUp);
      revObs.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revObs.observe(el));

  function countUp(el) {
    const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
    if (reduce) { el.textContent = end.toFixed(dec); return; }
    const dur = 1700, t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 4);
      el.textContent = (end * e).toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------------- typed role ---------------- */
  const typed = $('#typed');
  const phrases = ['computer vision systems', 'image matching pipelines', '3D product matching', 'production-ready ML', 'models that see'];
  if (typed && !reduce) {
    let pi = 0, ci = phrases[0].length, del = true;
    const tick = () => {
      const word = phrases[pi];
      if (del) {
        ci--;
        if (ci <= 0) { del = false; pi = (pi + 1) % phrases.length; }
      } else {
        ci++;
        if (ci >= phrases[pi].length) { del = true; typed.textContent = phrases[pi]; return setTimeout(tick, 2200); }
      }
      typed.textContent = (del ? word : phrases[pi]).slice(0, ci);
      setTimeout(tick, del ? 32 : 62);
    };
    setTimeout(tick, 2600);
  }

  /* ---------------- magnetic buttons & tilt cards ---------------- */
  if (canHover && !reduce) {
    $$('.magnetic').forEach(b => {
      b.addEventListener('mousemove', e => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
      });
      b.addEventListener('mouseleave', () => { b.style.transform = ''; });
    });
    $$('.tilt').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.setProperty('--rx', ((0.5 - py) * 6).toFixed(2) + 'deg');
        c.style.setProperty('--ry', ((px - 0.5) * 8).toFixed(2) + 'deg');
        c.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        c.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      });
      c.addEventListener('mouseleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------------- confetti ---------------- */
  const cCanvas = $('#confetti'), cctx = cCanvas.getContext('2d');
  let parts = [], cRunning = false;
  function sizeConfetti() {
    const d = Math.min(2, devicePixelRatio || 1);
    cCanvas.width = innerWidth * d; cCanvas.height = innerHeight * d;
    cctx.setTransform(d, 0, 0, d, 0, 0);
  }
  sizeConfetti(); addEventListener('resize', sizeConfetti);
  function burst(x, y, n = 150) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
      const sp = 5 + Math.random() * 11;
      parts.push({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 0.26 + Math.random() * 0.12,
        w: 6 + Math.random() * 7, h: 4 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
        c: COLORS[i % COLORS.length], life: 0, max: 100 + Math.random() * 70, round: Math.random() < 0.28,
        wob: Math.random() * 10
      });
    }
    if (!cRunning) { cRunning = true; requestAnimationFrame(confettiTick); }
  }
  function confettiTick() {
    cctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.life < p.max && p.y < innerHeight + 50);
    for (const p of parts) {
      p.life++; p.vx *= 0.985; p.vy = p.vy * 0.985 + p.g; p.x += p.vx + Math.sin((p.life + p.wob) / 8) * 0.6; p.y += p.vy; p.r += p.vr;
      cctx.globalAlpha = Math.min(1, 1 - (p.life - p.max * 0.7) / (p.max * 0.3));
      cctx.fillStyle = p.c;
      cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.r);
      if (p.round) { cctx.beginPath(); cctx.arc(0, 0, p.h / 1.6, 0, Math.PI * 2); cctx.fill(); }
      else { cctx.scale(1, Math.cos(p.life / 6 + p.wob)); cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
      cctx.restore();
    }
    cctx.globalAlpha = 1;
    if (parts.length) requestAnimationFrame(confettiTick); else { cRunning = false; cctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  /* ---------------- images (missing files are skipped) ---------------- */
  const imgCache = new Map();
  function probe(src) {
    if (!src) return Promise.resolve(false);
    if (!imgCache.has(src)) {
      imgCache.set(src, new Promise(res => { const i = new Image(); i.onload = () => res(true); i.onerror = () => res(false); i.src = src; }));
    }
    return imgCache.get(src);
  }
  async function available(list) {
    const ok = await Promise.all((list || []).map(it => probe(it.src)));
    return (list || []).filter((_, i) => ok[i]);
  }

  /* ---------------- focus helpers for overlays ---------------- */
  const layers = () => [$('#projModal'), $('#lightbox'), $('#cmd')];
  function openLayer(el) {
    clearTimeout(el._closeT);
    if (el.hidden) el._ret = document.activeElement;
    el.hidden = false; el.classList.remove('closing');
    document.body.classList.add('lock');
  }
  function closeLayer(el, animated) {
    if (el.hidden) return;
    const done = () => {
      el.hidden = true; el.classList.remove('closing');
      const open = layers().filter(x => !x.hidden);
      if (!open.length) document.body.classList.remove('lock');
      // only hand focus back if nothing else grabbed it in the meantime
      const ret = el._ret;
      if (ret && ret.focus && (!document.activeElement || document.activeElement === document.body || el.contains(document.activeElement))) {
        ret.focus({ preventScroll: true });
      }
    };
    if (animated && !reduce) { el.classList.add('closing'); el._closeT = setTimeout(done, 230); } else done();
  }

  /* ---------------- lightbox ---------------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg');
  let lbItems = [], lbIdx = 0;
  function openLightbox(items, idx = 0, title = '') {
    if (!items.length) return;
    lbItems = items; lbIdx = idx;
    $('#lbTitle').textContent = title;
    $('#lbThumbs').innerHTML = items.length > 1
      ? items.map((it, i) => `<button type="button" data-i="${i}" aria-label="Photo ${i + 1}"><img src="${it.src}" alt=""></button>`).join('')
      : '';
    $$('#lbThumbs button').forEach(b => b.addEventListener('click', () => { lbIdx = +b.dataset.i; renderLightbox(); }));
    $('#lbPrev').style.visibility = $('#lbNext').style.visibility = items.length > 1 ? 'visible' : 'hidden';
    openLayer(lb);
    renderLightbox();
    $('#lbClose').focus();
  }
  function renderLightbox() {
    const it = lbItems[lbIdx];
    lbImg.classList.remove('show');
    lbImg.onload = () => requestAnimationFrame(() => lbImg.classList.add('show'));
    lbImg.src = it.src; lbImg.alt = it.caption || $('#lbTitle').textContent;
    $('#lbCap').textContent = it.caption || '';
    $('#lbCount').textContent = `${lbIdx + 1} / ${lbItems.length}`;
    $$('#lbThumbs button').forEach((b, i) => b.classList.toggle('active', i === lbIdx));
  }
  const lbStep = d => { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; renderLightbox(); };
  $('#lbPrev').addEventListener('click', () => lbStep(-1));
  $('#lbNext').addEventListener('click', () => lbStep(1));
  $('#lbClose').addEventListener('click', () => closeLayer(lb));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb-stage')) closeLayer(lb); });
  let tx = null;
  lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50 && lbItems.length > 1) lbStep(dx < 0 ? 1 : -1);
  });

  /* ---------------- awards ---------------- */
  $$('.award').forEach(card => {
    const key = card.dataset.award, conf = MEDIA.awards[key] || { images: [] };
    let photos = [];
    available(conf.images).then(list => {
      photos = list;
      const pols = $$('.polaroid', card);
      // top of the stack (p3) shows the first photo
      [pols[2], pols[1], pols[0]].forEach((p, i) => {
        if (p && list[i]) p.innerHTML = `<img src="${list[i].src}" alt="" loading="lazy">`;
      });
      if (list.length) card.classList.add('has-photos');
      const count = $('.photo-count', card);
      if (count) count.textContent = list.length ? `${list.length} photo${list.length > 1 ? 's' : ''}` : 'Celebrate';
      if (!list.length) { const cta = $('.award-cta', card); if (cta) cta.innerHTML = '<span class="photo-count">Tap to celebrate</span> 🎉'; }
    });
    card.addEventListener('click', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
      burst(x, y, card.classList.contains('feature') ? 170 : 110);
      // clicking a specific picture inside the card opens the album at that picture
      const want = e.target.closest('[data-idx]')?.dataset.idx;
      const src = want != null ? (conf.images[+want] || {}).src : null;
      const start = Math.max(0, photos.findIndex(p => p.src === src));
      if (photos.length) setTimeout(() => openLightbox(photos, start, conf.title || ''), reduce ? 0 : 650);
    });
  });

  /* ---------------- project modal ---------------- */
  const modal = $('#projModal');
  $$('.proj-card').forEach(card => {
    const key = card.dataset.project, conf = MEDIA.projects[key] || {};
    if (conf.cover) probe(conf.cover).then(ok => {
      if (!ok) return;
      const cover = $('.proj-cover', card), img = new Image();
      img.className = 'cover-img'; img.alt = ''; img.src = conf.cover;
      $('.cover-art', cover)?.remove(); cover.prepend(img);
    });
    card.addEventListener('click', async () => {
      const tpl = $('#tpl-' + key);
      if (!tpl) return;
      $('#projModalContent').replaceChildren(tpl.content.cloneNode(true));
      const gal = $('#projModalGallery'); gal.innerHTML = '';
      openLayer(modal);
      $('.modal-close', modal).focus();
      const imgs = await available(conf.images);
      gal.innerHTML = imgs.map((it, i) => `<button type="button" data-i="${i}" aria-label="Open photo ${i + 1}"><img src="${it.src}" alt="${it.caption || ''}" loading="lazy"></button>`).join('');
      $$('button', gal).forEach(b => b.addEventListener('click', () => openLightbox(imgs, +b.dataset.i, $('h3', $('#projModalContent')).textContent)));
    });
  });
  $$('[data-close]', modal).forEach(el => el.addEventListener('click', () => closeLayer(modal, true)));

  /* ---------------- command palette ---------------- */
  const cmd = $('#cmd'), cmdInput = $('#cmdInput'), cmdList = $('#cmdList');
  const go = sel => () => { const el = $(sel); el && el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); };
  const actions = [
    { ic: '◎', label: 'About', k: 'section', run: go('#about') },
    { ic: '↳', label: 'Experience', k: 'section', run: go('#experience') },
    { ic: '◆', label: 'Projects', k: 'section', run: go('#projects') },
    { ic: '❝', label: 'Publications', k: 'section', run: go('#publications') },
    { ic: '★', label: 'Awards & Honors', k: 'section', run: go('#awards') },
    { ic: '⚙', label: 'Toolbox / Skills', k: 'section', run: go('#skills') },
    { ic: '✉', label: 'Contact', k: 'section', run: go('#contact') },
    { ic: '⧉', label: 'Copy email address', k: 'action', run: () => copy(EMAIL, 'Email copied — talk soon ✦') },
    { ic: '↓', label: 'Download CV (PDF)', k: 'action', run: () => { const a = document.createElement('a'); a.href = 'assets/Arda_Oztuner_CV.pdf'; a.download = ''; a.click(); } },
    { ic: '⌥', label: 'Open GitHub', k: 'link', run: () => open('https://github.com/arda92a', '_blank', 'noopener') },
    { ic: 'in', label: 'Open LinkedIn', k: 'link', run: () => open('https://www.linkedin.com/in/arda-%C3%B6zt%C3%BCner', '_blank', 'noopener') },
    { ic: '✦', label: 'Celebrate!', k: 'fun', run: () => { burst(innerWidth * 0.3, innerHeight * 0.7); setTimeout(() => burst(innerWidth * 0.7, innerHeight * 0.7), 220); } }
  ];
  let filtered = actions, cIdx = 0;
  function renderCmd() {
    const q = cmdInput.value.trim().toLowerCase();
    filtered = actions.filter(a => a.label.toLowerCase().includes(q) || a.k.includes(q));
    cIdx = Math.min(cIdx, Math.max(0, filtered.length - 1));
    cmdList.innerHTML = filtered.length
      ? filtered.map((a, i) => `<li role="option" data-i="${i}" class="${i === cIdx ? 'active' : ''}" aria-selected="${i === cIdx}"><span class="ic">${a.ic}</span>${a.label}<span class="k">${a.k}</span></li>`).join('')
      : '<li class="empty">Nothing found</li>';
    $$('li[data-i]', cmdList).forEach(li => {
      li.addEventListener('mousemove', () => { if (cIdx !== +li.dataset.i) { cIdx = +li.dataset.i; renderCmd(); } });
      li.addEventListener('click', () => runCmd(+li.dataset.i));
    });
    $('li.active', cmdList)?.scrollIntoView({ block: 'nearest' });
  }
  function runCmd(i) { const a = filtered[i]; if (!a) return; closeLayer(cmd); setTimeout(a.run, 60); }
  function openCmd() { cmdInput.value = ''; cIdx = 0; renderCmd(); openLayer(cmd); setTimeout(() => cmdInput.focus(), 20); }
  $('#cmdOpen').addEventListener('click', openCmd);
  cmdInput.addEventListener('input', () => { cIdx = 0; renderCmd(); });
  $$('[data-close]', cmd).forEach(el => el.addEventListener('click', () => closeLayer(cmd)));

  /* ---------------- keyboard ---------------- */
  addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      cmd.hidden ? openCmd() : closeLayer(cmd);
      return;
    }
    if (!cmd.hidden) {
      if (e.key === 'Escape') closeLayer(cmd);
      else if (e.key === 'ArrowDown') { e.preventDefault(); cIdx = (cIdx + 1) % Math.max(1, filtered.length); renderCmd(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); cIdx = (cIdx - 1 + filtered.length) % Math.max(1, filtered.length); renderCmd(); }
      else if (e.key === 'Enter') { e.preventDefault(); runCmd(cIdx); }
      return;
    }
    if (!lb.hidden) {
      if (e.key === 'Escape') closeLayer(lb);
      else if (e.key === 'ArrowRight') lbStep(1);
      else if (e.key === 'ArrowLeft') lbStep(-1);
      return;
    }
    if (!modal.hidden && e.key === 'Escape') closeLayer(modal, true);
  });

  /* =========================================================
     HERO: RetailGlue-style shelf matching visualization
     Two "photos" of the same shelf; products are detected and
     matched across views. Hover highlights a match.
     ========================================================= */
  const canvas = $('#vizCanvas');
  if (canvas) initViz(canvas);

  function initViz(canvas) {
    const ctx = canvas.getContext('2d');
    const stat = $('#vizStat');
    const SOFT = ['#D8D2FF', '#FFD3C7', '#C3EEDD', '#FFE3AA', '#C9E4FB', '#F9CFE0'];
    const OVERLAP_START = 0.52; // view B starts here in world coordinates (view width = 1)
    const SHELVES = 3;
    let W = 0, H = 0, A, B, products = [], matches = [], t0 = performance.now();
    let mouse = null, hover = null, visible = true, raf = 0;

    function build() {
      products = [];
      for (let s = 0; s < SHELVES; s++) {
        let x = 0.025;
        while (x < 1 + OVERLAP_START - 0.06) {
          const w = 0.06 + Math.random() * 0.075;
          products.push({
            s, x, w, h: 0.5 + Math.random() * 0.42, c: Math.floor(Math.random() * COLORS.length),
            bottle: Math.random() < 0.38, score: (0.9 + Math.random() * 0.095).toFixed(2),
            id: 0, delay: Math.random() * 900
          });
          x += w + 0.012 + Math.random() * 0.018;
        }
      }
      products.forEach((p, i) => { p.id = i + 1; });
      matches = products.filter(p => p.x >= OVERLAP_START + 0.005 && p.x + p.w <= 0.995);
      matches.forEach((m, i) => { m.mDelay = 1200 + i * 70; });
      t0 = performance.now();
    }

    function layout() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      const d = Math.min(2, devicePixelRatio || 1);
      canvas.width = W * d; canvas.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      const pad = 16, gap = Math.max(26, W * 0.06);
      const pw = (W - pad * 2 - gap) / 2, ph = H - pad * 2;
      A = { x: pad, y: pad, w: pw, h: ph, start: 0, k: 1 };
      B = { x: pad + pw + gap, y: pad, w: pw, h: ph, start: OVERLAP_START, k: 0.9 };
    }

    // product rect inside a pane, with view B slightly zoomed out (a "different camera")
    function rectIn(p, P) {
      const shelfH = P.h / SHELVES;
      const base = P.y + (p.s + 1) * shelfH - 7;
      const w = p.w * P.w, h = p.h * (shelfH - 18);
      let x = P.x + (p.x - P.start) * P.w, y = base - h;
      if (P.k !== 1) {
        const cx = P.x + P.w / 2, cy = P.y + P.h / 2;
        return { x: cx + (x - cx) * P.k, y: cy + (y - cy) * P.k + 6, w: w * P.k, h: h * P.k };
      }
      return { x, y, w, h };
    }

    function rr(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }

    function drawPane(P, t) {
      ctx.save();
      rr(P.x, P.y, P.w, P.h, 14);
      ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.strokeStyle = '#ECE6DC'; ctx.lineWidth = 1; ctx.stroke();
      ctx.clip();

      // shelves
      const shelfH = P.h / SHELVES;
      for (let s = 0; s < SHELVES; s++) {
        let y = P.y + (s + 1) * shelfH - 7, x1 = P.x, x2 = P.x + P.w;
        if (P.k !== 1) { const cy = P.y + P.h / 2; y = cy + (y - cy) * P.k + 6; }
        ctx.fillStyle = '#EFE9DF';
        ctx.fillRect(x1, y, x2 - x1, 5 * P.k);
      }

      // products
      for (const p of products) {
        const r = rectIn(p, P);
        if (r.x + r.w < P.x || r.x > P.x + P.w) continue;
        const appear = Math.min(1, Math.max(0, (t - p.delay * 0.4) / 400));
        ctx.globalAlpha = 0.35 + appear * 0.65;
        const isHover = hover && hover === p;
        ctx.fillStyle = SOFT[p.c];
        if (p.bottle) {
          const nw = r.w * 0.36, nh = Math.min(r.h * 0.22, 14);
          rr(r.x + (r.w - nw) / 2, r.y, nw, nh + 3, 2); ctx.fill();
          rr(r.x, r.y + nh, r.w, r.h - nh, 5); ctx.fill();
        } else {
          rr(r.x, r.y, r.w, r.h, 4); ctx.fill();
        }
        // label band
        ctx.fillStyle = 'rgba(255,255,255,.6)';
        ctx.fillRect(r.x + r.w * 0.15, r.y + r.h * 0.5, r.w * 0.7, Math.max(3, r.h * 0.14));
        ctx.globalAlpha = 1;

        // detection brackets
        const det = Math.min(1, Math.max(0, (t - p.delay) / 350));
        if (det > 0) {
          const pad = 3, bx = r.x - pad, by = r.y - pad, bw = r.w + pad * 2, bh = r.h + pad * 2;
          const L = Math.min(9, bw / 3, bh / 3) * det;
          ctx.strokeStyle = COLORS[p.c];
          ctx.globalAlpha = hover && !isHover ? 0.35 : 1;
          ctx.lineWidth = isHover ? 2.4 : 1.6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(bx, by + L); ctx.lineTo(bx, by); ctx.lineTo(bx + L, by);
          ctx.moveTo(bx + bw - L, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + L);
          ctx.moveTo(bx + bw, by + bh - L); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw - L, by + bh);
          ctx.moveTo(bx + L, by + bh); ctx.lineTo(bx, by + bh); ctx.lineTo(bx, by + bh - L);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      // scanning line
      if (!reduce) {
        const sx = P.x + ((t / 3200) % 1) * P.w;
        const g = ctx.createLinearGradient(sx - 40, 0, sx, 0);
        g.addColorStop(0, 'rgba(91,76,240,0)'); g.addColorStop(1, 'rgba(91,76,240,.10)');
        ctx.fillStyle = g; ctx.fillRect(sx - 40, P.y, 40, P.h);
        ctx.fillStyle = 'rgba(91,76,240,.35)'; ctx.fillRect(sx, P.y, 1, P.h);
      }
      ctx.restore();
    }

    function center(p, P) { const r = rectIn(p, P); return { x: r.x + r.w / 2, y: r.y + r.h / 2, r }; }

    function tag(x, y, text, color) {
      ctx.font = '500 11px "JetBrains Mono", ui-monospace, monospace';
      const tw = ctx.measureText(text).width + 12;
      x = Math.max(4, Math.min(W - tw - 4, x));
      ctx.fillStyle = color; rr(x, y - 18, tw, 18, 5); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(text, x + 6, y - 5.5);
    }

    function frame(now) {
      const t = reduce ? 1e6 : now - t0;
      ctx.clearRect(0, 0, W, H);
      drawPane(A, t); drawPane(B, t);

      // match lines
      let shown = 0;
      for (const m of matches) {
        const k = Math.min(1, Math.max(0, (t - m.mDelay) / 600));
        if (k <= 0) continue;
        shown++;
        const a = center(m, A), b = center(m, B);
        const isH = hover === m;
        const ex = a.x + (b.x - a.x) * k, ey = a.y + (b.y - a.y) * k;
        ctx.strokeStyle = COLORS[m.c];
        ctx.globalAlpha = hover ? (isH ? 1 : 0.12) : 0.55;
        ctx.lineWidth = isH ? 2.6 : 1.3;
        if (!isH && !reduce) { ctx.setLineDash([5, 5]); ctx.lineDashOffset = -t / 40; }
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = COLORS[m.c];
        ctx.beginPath(); ctx.arc(a.x, a.y, isH ? 4 : 2.6, 0, Math.PI * 2); ctx.fill();
        if (k === 1) { ctx.beginPath(); ctx.arc(b.x, b.y, isH ? 4 : 2.6, 0, Math.PI * 2); ctx.fill(); }
        ctx.globalAlpha = 1;
      }

      // hover labels
      if (hover) {
        const c = COLORS[hover.c];
        const inA = rectIn(hover, A), inB = rectIn(hover, B);
        const visA = inA.x + inA.w > A.x && inA.x < A.x + A.w;
        const visB = inB.x + inB.w > B.x && inB.x < B.x + B.w;
        const label = `sku_${String(hover.id).padStart(3, '0')} · ${hover.score}`;
        if (visA) tag(inA.x - 3, inA.y - 6, label, c);
        if (visB) tag(inB.x - 3, inB.y - 6, matches.includes(hover) ? `match ✓ ${hover.score}` : label, c);
      }

      if (stat) {
        stat.textContent = shown === 0 ? `detecting… ${Math.min(products.length, Math.round(t / 12))} products` : `${shown} matches · F1 88.4%`;
      }

      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }

    function pick(mx, my) {
      for (const P of [A, B]) {
        if (mx < P.x || mx > P.x + P.w || my < P.y || my > P.y + P.h) continue;
        for (const p of products) {
          const r = rectIn(p, P);
          if (mx >= r.x - 3 && mx <= r.x + r.w + 3 && my >= r.y - 3 && my <= r.y + r.h + 3) return p;
        }
      }
      return null;
    }

    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      hover = pick(mouse.x, mouse.y);
      if (reduce) frame(performance.now());
    });
    canvas.addEventListener('mouseleave', () => { hover = null; mouse = null; if (reduce) frame(performance.now()); });
    canvas.addEventListener('click', e => {
      build();
      const r = canvas.getBoundingClientRect();
      burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2, 40);
      if (reduce) frame(performance.now());
    });

    // gentle auto-highlight on touch devices so the demo still "talks"
    if (!canHover && !reduce) {
      setInterval(() => { if (visible && matches.length) hover = matches[Math.floor(Math.random() * matches.length)]; }, 2400);
    }

    new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }).observe(canvas);

    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { layout(); if (reduce) frame(performance.now()); }, 120); });

    build(); layout();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layout(); });
    raf = requestAnimationFrame(frame);
  }
})();
