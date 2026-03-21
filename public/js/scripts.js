"use strict";

var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var revealItems = document.querySelectorAll('[data-reveal]');

if (!reducedMotion && 'IntersectionObserver' in window) {
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.18
  });

  revealItems.forEach(function (item) {
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach(function (item) {
    item.classList.add('is-visible');
  });
}
