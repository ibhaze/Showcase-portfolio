  document.addEventListener('DOMContentLoaded', () => {
    const els = document.querySelectorAll('.reveal');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      els.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible'); //  this makes it repeat
        }
      });
    }, {
      root: null,
      threshold: 0.15
    });

    els.forEach(el => observer.observe(el));
  });
   