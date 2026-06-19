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
  var touchStartX = 0;
  var touchDeltaX = 0;

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

  viewport.addEventListener('touchstart', function (e) {
    if (!e.changedTouches || !e.changedTouches.length) return;
    touchStartX = e.changedTouches[0].clientX;
    touchDeltaX = 0;
  }, { passive: true });

  viewport.addEventListener('touchmove', function (e) {
    if (!e.changedTouches || !e.changedTouches.length) return;
    touchDeltaX = e.changedTouches[0].clientX - touchStartX;
  }, { passive: true });

  viewport.addEventListener('touchend', function () {
    if (Math.abs(touchDeltaX) > 50) {
      goTo(activeIndex + (touchDeltaX < 0 ? 1 : -1));
    }
    touchDeltaX = 0;
  });

  window.addEventListener('resize', updateUI);

  updateUI();
})();
