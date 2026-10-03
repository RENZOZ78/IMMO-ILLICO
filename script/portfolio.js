/* =====================================================================
   DELTA-IMMO — galerie des biens
   Filtres par type, tri par prix, visionneuse plein écran
   ===================================================================== */
(function () {
  'use strict';

  var grid = document.querySelector('[data-gallery]');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.property'));
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var sortSelect = document.querySelector('[data-sort]');
  var countEl = document.querySelector('[data-count]');
  var emptyEl = document.querySelector('[data-empty]');

  var activeFilter = 'all';
  var activeSort = 'default';

  cards.forEach(function (card, i) { card.dataset.order = i; });

  /* ---------- Filtres & tri ---------- */
  function visibleCards() {
    return cards.filter(function (c) { return !c.classList.contains('is-hidden'); });
  }

  function applyFilters() {
    var shown = 0;
    cards.forEach(function (card) {
      var match = activeFilter === 'all' || card.dataset.type === activeFilter;
      card.classList.toggle('is-hidden', !match);
      card.classList.remove('is-entering');
      if (match) {
        card.style.setProperty('--i', shown);
        shown++;
        void card.offsetWidth;
        card.classList.add('is-entering');
      }
    });

    var sorted = cards.slice().sort(function (a, b) {
      if (activeSort === 'asc') return +a.dataset.price - +b.dataset.price;
      if (activeSort === 'desc') return +b.dataset.price - +a.dataset.price;
      return +a.dataset.order - +b.dataset.order;
    });
    sorted.forEach(function (card) { grid.appendChild(card); });

    if (countEl) countEl.textContent = shown + (shown > 1 ? ' biens' : ' bien');
    if (emptyEl) emptyEl.hidden = shown !== 0;
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeFilter = btn.dataset.filter;
      filterButtons.forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      applyFilters();
    });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      activeSort = sortSelect.value;
      applyFilters();
    });
  }

  /* ---------- Visionneuse ---------- */
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  var lbImg = lightbox.querySelector('.lightbox__img');
  var lbTitle = lightbox.querySelector('[data-lb-title]');
  var lbMeta = lightbox.querySelector('[data-lb-meta]');
  var lbPrice = lightbox.querySelector('[data-lb-price]');
  var lbCurrent = lightbox.querySelector('[data-lb-current]');
  var lbTotal = lightbox.querySelector('[data-lb-total]');
  var closeBtn = lightbox.querySelector('[data-lb-close]');
  var prevBtn = lightbox.querySelector('[data-lb-prev]');
  var nextBtn = lightbox.querySelector('[data-lb-next]');

  var list = [];
  var current = 0;
  var lastFocused = null;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function show(i) {
    list = visibleCards();
    if (!list.length) return;
    current = (i + list.length) % list.length;
    var card = list[current];
    var link = card.querySelector('[data-lightbox]');
    var img = card.querySelector('img');

    lightbox.classList.add('is-loading');
    var full = new Image();
    full.onload = function () {
      lbImg.src = full.src;
      lbImg.alt = img ? img.alt : '';
      lightbox.classList.remove('is-loading');
    };
    full.onerror = function () { lightbox.classList.remove('is-loading'); };
    full.src = link.getAttribute('href');

    if (lbTitle) lbTitle.textContent = card.dataset.title || '';
    if (lbMeta) lbMeta.textContent = card.dataset.meta || '';
    if (lbPrice) lbPrice.textContent = card.dataset.priceLabel || '';
    if (lbCurrent) lbCurrent.textContent = pad(current + 1);
    if (lbTotal) lbTotal.textContent = pad(list.length);

    // Préchargement des voisins
    [current + 1, current - 1].forEach(function (n) {
      var neighbour = list[(n + list.length) % list.length];
      var href = neighbour && neighbour.querySelector('[data-lightbox]');
      if (href) { var pre = new Image(); pre.src = href.getAttribute('href'); }
    });
  }

  function open(card) {
    lastFocused = document.activeElement;
    list = visibleCards();
    show(list.indexOf(card));
    lightbox.removeAttribute('hidden');
    void lightbox.offsetWidth;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
    window.setTimeout(function () {
      if (!lightbox.classList.contains('is-open')) {
        lightbox.setAttribute('hidden', '');
        lbImg.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
      }
    }, 400);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  cards.forEach(function (card) {
    var link = card.querySelector('[data-lightbox]');
    if (!link) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      open(card);
    });
  });

  closeBtn.addEventListener('click', close);
  nextBtn.addEventListener('click', function () { show(current + 1); });
  prevBtn.addEventListener('click', function () { show(current - 1); });

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox || e.target.classList.contains('lightbox__stage') || e.target.classList.contains('lightbox__figure')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') show(current + 1);
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'Tab') {
      // Boucle du focus à l'intérieur de la visionneuse
      var focusables = [closeBtn, prevBtn, nextBtn];
      var first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Balayage tactile dans la visionneuse
  var startX = null;
  lightbox.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 50) show(delta < 0 ? current + 1 : current - 1);
    startX = null;
  }, { passive: true });

  applyFilters();
})();
