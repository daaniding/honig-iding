/* HONIG IDING & Partners — interactie (vanilla, sober) */
(function () {
  'use strict';

  // Jaartal
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  // Nav scrolled-state
  const nav = document.querySelector('.site-nav');
  const onScroll = () => { if (nav) nav.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobiel menu
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open'); toggle.classList.remove('open'); document.body.style.overflow = '';
    }));
  }

  // Subtiele reveals
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal, [data-stagger]').forEach(el => {
    if (el.hasAttribute('data-stagger')) {
      [...el.children].forEach((c, i) => { c.style.transitionDelay = (i * 0.07) + 's'; });
    }
    io.observe(el);
  });

  // Contactformulier (mailto)
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
        '', bericht
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
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 4000);
  }
})();
