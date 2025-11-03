(function () {
  const nav = document.querySelector('nav');
  const icons = document.querySelector('.contact-info');
  const darkSections = Array.from(document.querySelectorAll('.dark-section'));
  if (!darkSections.length) return;

  const getRect = el => el.getBoundingClientRect();
  const intersects = (a, b) => {
    const w = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
    const h = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    return w > 0 && h > 0;
  };

  function updateModes() {
    // --- Navbar (your existing logic) ---
    if (nav) {
      const navRect = getRect(nav);
      const bandTop = Math.max(0, navRect.top);
      const bandBottom = Math.min(window.innerHeight, navRect.bottom);

      const overDarkNav = darkSections.some(sec => {
        const r = getRect(sec);
        const verticalOverlap = Math.min(bandBottom, r.bottom) - Math.max(bandTop, r.top);
        const horizontalOverlap = r.right > 0 && r.left < window.innerWidth;
        return verticalOverlap > 0 && horizontalOverlap;
      });

      nav.classList.toggle('dark-mode', overDarkNav);
    }

    // --- Contact icons (new) ---
    if (icons) {
      const icRect = getRect(icons);
      const overDarkIcons = darkSections.some(sec => intersects(icRect, getRect(sec)));

      icons.classList.toggle('icons-on-dark', overDarkIcons);
      icons.classList.toggle('icons-on-light', !overDarkIcons);
    }
  }

  updateModes();
  window.addEventListener('scroll', updateModes, { passive: true });
  window.addEventListener('resize', updateModes);
  window.addEventListener('load', updateModes);
})();