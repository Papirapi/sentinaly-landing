(function () {
  var modules = document.querySelectorAll('.explore-module');
  var screens = document.querySelectorAll('.explore-screen');
  if (!modules.length || !screens.length) return;

  var setActive = function (id) {
    modules.forEach(function (btn) {
      var isActive = btn.getAttribute('data-target') === id;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  modules.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('data-target');
      var target = document.getElementById(targetId);
      if (!target) return;
      setActive(targetId);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            setActive(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '-20% 0px -45% 0px', threshold: [0.35, 0.55] }
    );

    screens.forEach(function (screen) {
      observer.observe(screen);
    });
  }

  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('primary-nav');
  if (toggle && menu) {
    var closeMenu = function () {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    };

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!menu.classList.contains('is-open')) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });
  }
})();
