(function () {
  var carousel = document.querySelector('[data-carousel]');
  if (!carousel) return;

  var viewport = carousel.querySelector('.biophilia-carousel__viewport');
  var track = carousel.querySelector('.biophilia-carousel__track');
  var slides = Array.prototype.slice.call(carousel.querySelectorAll('.biophilia-carousel__slide'));
  var dotsNav = carousel.querySelector('.biophilia-carousel__dots');
  var prevBtn = carousel.querySelector('.biophilia-carousel__arrow--prev');
  var nextBtn = carousel.querySelector('.biophilia-carousel__arrow--next');

  if (!viewport || !track || slides.length === 0 || !dotsNav) return;

  var activeIndex = 0;
  var activePointer = null;
  var startX = 0;
  var startY = 0;
  var deltaX = 0;
  var swipeAxis = null;
  var wheelAccumX = 0;
  var wheelResetTimer = null;
  var wheelCooldown = false;

  var SWIPE_THRESHOLD = 50;
  var AXIS_LOCK = 12;
  var WHEEL_THRESHOLD = 55;
  var WHEEL_COOLDOWN_MS = 450;
  var WHEEL_RESET_MS = 180;

  slides.forEach(function (_slide, index) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'biophilia-carousel__dot' + (index === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (index + 1));
    dot.setAttribute('data-index', String(index));
    dotsNav.appendChild(dot);
  });

  var dots = Array.prototype.slice.call(carousel.querySelectorAll('.biophilia-carousel__dot'));

  function clampIndex(index) {
    var total = slides.length;
    return Math.max(0, Math.min(total - 1, index));
  }

  function updateUI() {
    track.style.transform = 'translate3d(-' + activeIndex * 100 + '%, 0, 0)';

    dots.forEach(function (dot) {
      dot.classList.toggle('is-active', Number(dot.getAttribute('data-index')) === activeIndex);
    });

    slides.forEach(function (slide, index) {
      slide.setAttribute('aria-hidden', index === activeIndex ? 'false' : 'true');
    });

    prevBtn.disabled = activeIndex === 0;
    nextBtn.disabled = activeIndex === slides.length - 1;

    carousel.classList.toggle('biophilia-carousel--hero-active', activeIndex === 0);
  }

  function goTo(index) {
    activeIndex = clampIndex(index);
    updateUI();
  }

  function stepFromDelta(horizontalDelta) {
    if (horizontalDelta < -SWIPE_THRESHOLD) {
      goTo(activeIndex + 1);
      return true;
    }
    if (horizontalDelta > SWIPE_THRESHOLD) {
      goTo(activeIndex - 1);
      return true;
    }
    return false;
  }

  function resetPointerState() {
    activePointer = null;
    deltaX = 0;
    swipeAxis = null;
    viewport.classList.remove('is-dragging');
  }

  prevBtn.addEventListener('click', function () {
    goTo(activeIndex - 1);
  });

  nextBtn.addEventListener('click', function () {
    goTo(activeIndex + 1);
  });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(Number(dot.getAttribute('data-index')));
    });
  });

  viewport.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goTo(activeIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goTo(activeIndex + 1);
    }
  });

  viewport.addEventListener('pointerdown', function (e) {
    if (activePointer !== null) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    activePointer = e.pointerId;
    startX = e.clientX;
    startY = e.clientY;
    deltaX = 0;
    swipeAxis = null;

    if (e.pointerType === 'mouse') {
      viewport.classList.add('is-dragging');
    }

    if (viewport.setPointerCapture) {
      viewport.setPointerCapture(e.pointerId);
    }
  });

  viewport.addEventListener('pointermove', function (e) {
    if (e.pointerId !== activePointer) return;

    var dx = e.clientX - startX;
    var dy = e.clientY - startY;
    deltaX = dx;

    if (swipeAxis === null && (Math.abs(dx) > AXIS_LOCK || Math.abs(dy) > AXIS_LOCK)) {
      swipeAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }

    if (swipeAxis === 'x') {
      e.preventDefault();
    }
  }, { passive: false });

  function finishPointer(e) {
    if (e.pointerId !== activePointer) return;

    if (swipeAxis === 'x') {
      stepFromDelta(deltaX);
    }

    if (viewport.hasPointerCapture && viewport.hasPointerCapture(e.pointerId)) {
      viewport.releasePointerCapture(e.pointerId);
    }

    resetPointerState();
  }

  viewport.addEventListener('pointerup', finishPointer);
  viewport.addEventListener('pointercancel', finishPointer);

  viewport.addEventListener('wheel', function (e) {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
      wheelAccumX = 0;
      return;
    }

    if (Math.abs(e.deltaX) < 1) return;

    e.preventDefault();

    if (wheelCooldown) return;

    wheelAccumX += e.deltaX;

    clearTimeout(wheelResetTimer);
    wheelResetTimer = setTimeout(function () {
      wheelAccumX = 0;
    }, WHEEL_RESET_MS);

    if (wheelAccumX >= WHEEL_THRESHOLD) {
      goTo(activeIndex + 1);
      wheelAccumX = 0;
      wheelCooldown = true;
      setTimeout(function () {
        wheelCooldown = false;
      }, WHEEL_COOLDOWN_MS);
    } else if (wheelAccumX <= -WHEEL_THRESHOLD) {
      goTo(activeIndex - 1);
      wheelAccumX = 0;
      wheelCooldown = true;
      setTimeout(function () {
        wheelCooldown = false;
      }, WHEEL_COOLDOWN_MS);
    }
  }, { passive: false });

  window.addEventListener('resize', updateUI);

  updateUI();
})();
