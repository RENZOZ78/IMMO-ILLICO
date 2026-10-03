/* =====================================================================
   DELTA-IMMO — effets d'interface
   Barre de progression, parallaxe, compteurs, boutons magnétiques,
   inclinaison des cartes, curseur, transitions de page
   Tout est désactivé lorsque l'utilisateur préfère réduire les animations.
   ===================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var raf = window.requestAnimationFrame || function (fn) { return setTimeout(fn, 16); };
  var body = document.body;

  function closest(target, selector) {
    return target && target.closest ? target.closest(selector) : null;
  }

  /* ---------- Barre de progression & retour en haut ---------- */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  body.appendChild(bar);

  var toTop = document.createElement('button');
  toTop.className = 'back-to-top';
  toTop.type = 'button';
  toTop.setAttribute('aria-label', 'Revenir en haut de la page');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  body.appendChild(toTop);
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- Parallaxe au défilement ---------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    raf(function () {
      var y = window.scrollY || window.pageYOffset;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
      toTop.classList.toggle('is-visible', y > 600);

      if (!reduced) {
        var vh = window.innerHeight;
        parallaxEls.forEach(function (el) {
          var box = el.parentElement.getBoundingClientRect();
          if (box.bottom < 0 || box.top > vh) return;
          var speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
          var progress = box.top + box.height / 2 - vh / 2;
          el.style.transform = 'translate3d(0,' + (-progress * speed).toFixed(1) + 'px,0)';
        });
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Compteurs animés ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count-to]'));
  if (counters.length) {
    var animateCounter = function (el) {
      var to = parseFloat(el.getAttribute('data-count-to'));
      var from = parseFloat(el.getAttribute('data-count-from') || '0');
      var duration = 1800;
      var start = null;
      var step = function (ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / duration, 1);
        var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        el.textContent = Math.round(from + (to - from) * eased);
        if (t < 1) raf(step);
      };
      raf(step);
    };
    if (reduced || !('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = el.getAttribute('data-count-to'); });
    } else {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  if (reduced || !finePointer) return;

  /* ---------- Boutons magnétiques ---------- */
  Array.prototype.slice.call(document.querySelectorAll('.btn, .hero__arrow, .socials a, .back-to-top, .nav-toggle, .filter-btn')).forEach(function (el) {
    var strength = el.classList.contains('btn') ? 0.16 : 0.28;
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var x = e.clientX - r.left - r.width / 2;
      var y = e.clientY - r.top - r.height / 2;
      el.style.transform = 'translate(' + (x * strength).toFixed(1) + 'px,' + (y * strength).toFixed(1) + 'px)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = ''; });
  });

  /* ---------- Inclinaison 3D et halo lumineux des cartes ---------- */
  Array.prototype.slice.call(document.querySelectorAll('.property, .service, .pillar, .contact-card, .step')).forEach(function (card) {
    var maxTilt = card.classList.contains('property') ? 3 : 4;
    card.addEventListener('mouseenter', function () {
      card.style.transition = 'transform 0.18s ease-out, box-shadow 0.5s var(--ease-out), background 0.5s';
    });
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width;
      var py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      card.style.transform = 'perspective(1100px) rotateX(' + ((0.5 - py) * maxTilt * 2).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * maxTilt * 2).toFixed(2) + 'deg) translateY(-6px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = '';
      card.style.transform = '';
    });
  });

  /* ---------- Léger mouvement du contenu du hero avec la souris ---------- */
  var hero = document.querySelector('.hero');
  var heroContent = document.querySelector('.hero__content');
  if (hero && heroContent) {
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var x = e.clientX / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      heroContent.style.transform = 'translate(' + (-x * 16).toFixed(1) + 'px,' + (-y * 10).toFixed(1) + 'px)';
    });
    hero.addEventListener('mouseleave', function () { heroContent.style.transform = ''; });
  }

  /* ---------- Curseur personnalisé ---------- */
  var cursor = document.createElement('div');
  cursor.className = 'cursor is-hidden';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.innerHTML = '<span class="cursor__ring"></span><span class="cursor__dot"></span>';
  body.appendChild(cursor);
  var ring = cursor.firstChild;
  var dot = cursor.lastChild;
  var mx = -100, my = -100, rx = -100, ry = -100, running = false;

  var loop = function () {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px) translate(-50%,-50%)';
    dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    raf(loop);
  };

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    cursor.classList.remove('is-hidden');
    if (!running) { running = true; rx = mx; ry = my; loop(); }
    var interactive = closest(e.target, 'a, button, [data-lightbox], select, input, textarea, label, summary');
    cursor.classList.toggle('is-hover', !!interactive);
    cursor.classList.toggle('is-media', !!closest(e.target, '.property__media, .hero__slides, .lightbox__stage'));
  });
  document.addEventListener('mouseleave', function () { cursor.classList.add('is-hidden'); });
  document.addEventListener('mousedown', function () { cursor.classList.add('is-down'); });
  document.addEventListener('mouseup', function () { cursor.classList.remove('is-down'); });

  /* ---------- Transition entre les pages ---------- */
  document.addEventListener('click', function (e) {
    var link = closest(e.target, 'a[href]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if ((link.target && link.target !== '_self') || link.hasAttribute('download') || link.hasAttribute('data-lightbox')) return;
    var url;
    try { url = new URL(link.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
    if (url.pathname === location.pathname && url.hash) return;
    e.preventDefault();
    body.classList.add('is-leaving');
    window.setTimeout(function () { location.href = url.href; }, 320);
  });
  window.addEventListener('pageshow', function () { body.classList.remove('is-leaving'); });
})();
