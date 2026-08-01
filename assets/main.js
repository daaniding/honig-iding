/* ============================================================
   HONIG IDING & Partners — interactie
   Vereist (via CDN in <head>): Lenis, GSAP, ScrollTrigger, SplitText
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(pointer: fine)').matches;
  const hasGSAP      = typeof window.gsap !== 'undefined';

  /* ---------- Jaartal in footer ---------- */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Nav: scrolled state ---------- */
  const nav = document.querySelector('.site-nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobiel menu ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- Lenis smooth scroll + GSAP sync ---------- */
  if (typeof window.Lenis !== 'undefined' && !reduceMotion) {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95 });
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
    // anchor-links soepel
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
          const t = document.querySelector(id);
          if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); }
        }
      });
    });
  }

  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (hasGSAP && window.SplitText)     gsap.registerPlugin(SplitText);

  /* ---------- Reveals via IntersectionObserver ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal, .reveal-img, [data-stagger]').forEach((el, i) => {
    // gespreide vertraging binnen stagger-groepen
    if (el.hasAttribute('data-stagger')) {
      [...el.children].forEach((child, j) => {
        child.style.transitionDelay = (j * 0.08) + 's';
      });
    }
    io.observe(el);
  });

  /* ---------- SplitText op headings ---------- */
  if (hasGSAP && window.SplitText && !reduceMotion) {
    document.querySelectorAll('[data-split]').forEach(el => {
      const split = new SplitText(el, { type: 'words,lines', linesClass: 'split-line' });
      gsap.set(el, { opacity: 1 });
      gsap.from(split.words, {
        yPercent: 115, opacity: 0, duration: 0.9, stagger: 0.045, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });
  } else {
    document.querySelectorAll('[data-split]').forEach(el => { el.style.opacity = 1; });
  }

  /* ---------- Parallax op hero-achtergrond ---------- */
  if (hasGSAP && window.ScrollTrigger && !reduceMotion) {
    document.querySelectorAll('.hero-bg').forEach(bg => {
      gsap.to(bg, {
        yPercent: 16, ease: 'none',
        scrollTrigger: { trigger: bg.closest('section'), start: 'top top', end: 'bottom top', scrub: true }
      });
    });
  }

  /* ---------- CountUp op cijfers ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.indexOf('.') > -1) ? 1 : 0;
    if (reduceMotion || !hasGSAP) { el.textContent = target.toFixed(dec); return; }
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.6, ease: 'power2.out',
      onUpdate: () => { el.textContent = obj.v.toFixed(dec); }
    });
  };
  document.querySelectorAll('[data-count]').forEach(el => {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCount(el); co.unobserve(el); } });
    }, { threshold: 0.5 });
    co.observe(el);
  });

  /* ---------- Magnetische knoppen ---------- */
  if (hasGSAP && finePointer && !reduceMotion) {
    document.querySelectorAll('.btn, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, { x: (e.clientX - r.left - r.width/2) * 0.25, y: (e.clientY - r.top - r.height/2) * 0.35, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' }));
    });
  }

  /* ---------- Custom cursor ---------- */
  if (finePointer && !reduceMotion) {
    const ring = document.createElement('div'); ring.className = 'cursor-ring';
    const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
    document.body.append(ring, dot);
    let rx = 0, ry = 0, dx = 0, dy = 0;
    document.addEventListener('mousemove', (e) => { dx = e.clientX; dy = e.clientY; });
    const loop = () => {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      dot.style.transform  = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    document.querySelectorAll('a, button, .service-card, .team-card, input, textarea, select, .doc-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ---------- Contactformulier (mailto) ---------- */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const naam = (fd.get('naam') || '').trim();
      const email = (fd.get('email') || '').trim();
      const bericht = (fd.get('bericht') || '').trim();
      if (!naam || !email || !bericht) { showToast('Vul uw naam, e-mailadres en bericht in.'); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { showToast('Controleer uw e-mailadres.'); return; }
      const lines = [
        'Naam: ' + naam,
        'E-mail: ' + email,
        fd.get('telefoon') ? 'Telefoon: ' + fd.get('telefoon') : null,
        fd.get('onderwerp') ? 'Onderwerp: ' + fd.get('onderwerp') : null,
        '', (fd.get('bericht') || '')
      ].filter(l => l !== null).join('\n');
      const subject = 'Contactaanvraag' + (fd.get('onderwerp') ? ' — ' + fd.get('onderwerp') : '') + ' (' + naam + ')';
      window.location.href = 'mailto:info@honig-iding.nl?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines);
      showToast('Uw e-mailprogramma wordt geopend…');
    });
  }

  function showToast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 4000);
  }
})();
