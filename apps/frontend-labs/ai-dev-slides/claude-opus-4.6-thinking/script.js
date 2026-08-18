/**
 * Strata — Slide Deck Controller
 * Keyboard, touch, hash, and pointer navigation
 */
(function () {
  'use strict';

  const TOTAL_SLIDES = 12;
  const slides = Array.from(document.querySelectorAll('.slide'));
  const progressContainer = document.querySelector('.progress');
  const counterEl = document.querySelector('.slide-counter');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const notesOverlay = document.getElementById('notes-overlay');
  const notesContent = document.getElementById('notes-content');

  let currentSlide = 1;
  let notesVisible = false;

  // ── Progress dots ──
  function buildProgress() {
    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      const dot = document.createElement('button');
      dot.className = 'progress-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to slide ' + i);
      dot.setAttribute('aria-selected', 'false');
      dot.dataset.slide = i;
      dot.addEventListener('click', function () {
        goToSlide(i);
      });
      progressContainer.appendChild(dot);
    }
  }

  // ── Update UI ──
  function updateUI() {
    // Slides
    slides.forEach(function (s) {
      var num = parseInt(s.dataset.slide, 10);
      s.classList.remove('active', 'prev');
      if (num === currentSlide) {
        s.classList.add('active');
      } else if (num < currentSlide) {
        s.classList.add('prev');
      }
    });

    // Progress dots
    var dots = progressContainer.querySelectorAll('.progress-dot');
    dots.forEach(function (dot) {
      var num = parseInt(dot.dataset.slide, 10);
      dot.classList.toggle('active', num === currentSlide);
      dot.classList.toggle('visited', num < currentSlide);
      dot.setAttribute('aria-selected', num === currentSlide ? 'true' : 'false');
    });

    // Counter
    counterEl.textContent = currentSlide + ' / ' + TOTAL_SLIDES;

    // Buttons
    btnPrev.disabled = currentSlide <= 1;
    btnNext.disabled = currentSlide >= TOTAL_SLIDES;

    // Hash
    if (window.location.hash !== '#' + currentSlide) {
      history.replaceState(null, '', '#' + currentSlide);
    }

    // Speaker notes
    updateNotes();
  }

  // ── Speaker notes ──
  function updateNotes() {
    var slide = document.querySelector('[data-slide="' + currentSlide + '"]');
    var tmpl = slide ? slide.querySelector('.speaker-notes') : null;
    notesContent.textContent = tmpl ? tmpl.textContent.trim() : '';
  }

  function toggleNotes() {
    notesVisible = !notesVisible;
    notesOverlay.classList.toggle('visible', notesVisible);
  }

  // ── Navigation ──
  function goToSlide(n) {
    n = Math.max(1, Math.min(TOTAL_SLIDES, n));
    if (n === currentSlide) return;
    currentSlide = n;
    updateUI();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // ── Keyboard ──
  document.addEventListener('keydown', function (e) {
    // Don't intercept if user is in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        prevSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(1);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(TOTAL_SLIDES);
        break;
      case 'n':
      case 'N':
        e.preventDefault();
        toggleNotes();
        break;
    }
  });

  // ── Button clicks ──
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);

  // ── Touch / pointer swipe ──
  var touchStartX = 0;
  var touchStartY = 0;
  var isSwiping = false;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (!isSwiping) return;
    isSwiping = false;
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    // Require horizontal dominance and minimum distance
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
  }, { passive: true });

  // ── Mouse pointer navigation (click left/right thirds) ──
  document.querySelector('.presentation').addEventListener('click', function (e) {
    // Don't interfere with buttons, links, or interactive elements
    if (e.target.closest('button, a, [role="tab"]')) return;
    var x = e.clientX;
    var w = window.innerWidth;
    if (x < w * 0.15) prevSlide();
    else if (x > w * 0.85) nextSlide();
  });

  // ── Hash-based initial slide ──
  function readHash() {
    var hash = window.location.hash.replace('#', '');
    var n = parseInt(hash, 10);
    if (n >= 1 && n <= TOTAL_SLIDES) {
      currentSlide = n;
    }
  }

  window.addEventListener('hashchange', function () {
    var hash = window.location.hash.replace('#', '');
    var n = parseInt(hash, 10);
    if (n >= 1 && n <= TOTAL_SLIDES && n !== currentSlide) {
      goToSlide(n);
    }
  });

  // ── Init ──
  buildProgress();
  readHash();
  updateUI();
})();
