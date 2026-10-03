/* =====================================================================
   DELTA-IMMO — page d'accueil : slider plein écran
   Lecture automatique, flèches, indicateurs, clavier, balayage tactile
   ===================================================================== */
(function () {
  'use strict';

  var hero = document.querySelector('[data-hero]');
  if (!hero) return;

  var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero__slide'));
  var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero__dot'));
  var prevBtn = hero.querySelector('[data-prev]');
  var nextBtn = hero.querySelector('[data-next]');
  var counter = hero.querySelector('[data-current]');
  var captionTitle = hero.querySelector('[data-caption-title]');
  var captionMeta = hero.querySelector('[data-caption-meta]');
  var total = slides.length;
  if (total < 2) return;

  var DELAY = 6500;
  var index = 0;
  var timer = null;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  hero.style.setProperty('--hero-delay', DELAY + 'ms');

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function render() {
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === index);
      slide.setAttribute('aria-hidden', i === index ? 'false' : 'true');
    });
    dots.forEach(function (dot, i) {
      var active = i === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', active ? 'true' : 'false');
      dot.tabIndex = active ? 0 : -1;
    });
    if (counter) counter.textContent = pad(index + 1);
    var data = slides[index].dataset;
    if (captionTitle) captionTitle.textContent = data.title || '';
    if (captionMeta) captionMeta.textContent = data.meta || '';
  }

  function goTo(n) {
    index = (n + total) % total;
    render();
    restart();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  function start() {
    if (reduced) return;
    stop();
    timer = window.setInterval(next, DELAY);
  }
  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }
  function restart() {
    // Relance l'indicateur de progression et le minuteur
    var active = hero.querySelector('.hero__dot.is-active');
    if (active) {
      active.classList.remove('is-active');
      void active.offsetWidth;
      active.classList.add('is-active');
    }
    if (!hero.classList.contains('is-paused')) start();
  }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });

  // Pause au survol / au focus clavier
  hero.addEventListener('mouseenter', function () { hero.classList.add('is-paused'); stop(); });
  hero.addEventListener('mouseleave', function () { hero.classList.remove('is-paused'); restart(); });
  hero.addEventListener('focusin', function () { hero.classList.add('is-paused'); stop(); });
  hero.addEventListener('focusout', function (e) {
    if (!hero.contains(e.relatedTarget)) { hero.classList.remove('is-paused'); restart(); }
  });

  // Clavier
  hero.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  });

  // Balayage tactile
  var startX = null;
  hero.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var delta = e.changedTouches[0].clientX - startX;
    if (Math.abs(delta) > 50) (delta < 0 ? next : prev)();
    startX = null;
  }, { passive: true });

  // Pause lorsque l'onglet est masqué
  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : restart();
  });

  render();
  start();
})();
