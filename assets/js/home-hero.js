(function () {
  var toggle = document.querySelector('.hero-nav__toggle');
  var menu = document.getElementById('hero-mobile-menu');
  if (!toggle || !menu) return;

  var fullScreenQuery = window.matchMedia('(max-width: 768px)');

  function isFullScreenMenu() {
    return fullScreenQuery.matches;
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    menu.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    menu.classList.add('is-open');
    if (isFullScreenMenu()) {
      document.body.style.overflow = 'hidden';
    }
  }

  toggle.addEventListener('click', function (e) {
    e.stopPropagation();
    if (toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', function (e) {
    if (!menu.classList.contains('is-open') || isFullScreenMenu()) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    closeMenu();
  });
})();
