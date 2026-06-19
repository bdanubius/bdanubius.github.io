(function () {
  var protectedSelector =
    'img, picture, .hero__media, .biophilia-carousel__slide-bg, .biophilia-carousel__figure, figure';

  function protectImages(root) {
    root.querySelectorAll('img').forEach(function (img) {
      img.setAttribute('draggable', 'false');
    });
  }

  function isProtectedTarget(target) {
    if (!(target instanceof Element)) return false;
    if (target.tagName === 'IMG') return true;
    if (target.closest('.home-splash .hero') && target.classList.contains('hero')) return true;
    return Boolean(target.closest(protectedSelector));
  }

  document.addEventListener(
    'contextmenu',
    function (e) {
      if (isProtectedTarget(e.target)) e.preventDefault();
    },
    false
  );

  document.addEventListener(
    'dragstart',
    function (e) {
      if (isProtectedTarget(e.target)) e.preventDefault();
    },
    false
  );

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      protectImages(document);
    });
  } else {
    protectImages(document);
  }
})();
