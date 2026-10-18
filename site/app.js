'use strict';

(() => {
  const videos = [...document.querySelectorAll('.performance-item video')];
  const initialized = new WeakSet();

  function initialize(video) {
    if (initialized.has(video)) return;
    initialized.add(video);
    window.PianoExpertPlayer.attach(video);
  }

  for (const video of videos) {
    // Native controls retain normal keyboard, scrubbing and fullscreen behavior.
    video.addEventListener('pointerdown', () => initialize(video), { once: true });
    video.addEventListener('focus', () => initialize(video), { once: true });
    video.addEventListener('play', () => {
      initialize(video);
      for (const other of videos) if (other !== video) other.pause();
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        initialize(entry.target);
        observer.unobserve(entry.target);
      }
    }, { rootMargin: '160px 0px', threshold: 0.01 });
    for (const video of videos) observer.observe(video);
  } else {
    // Keep lazy initialization even where IntersectionObserver is unavailable.
    let scheduled = false;
    const inspectVisible = () => {
      scheduled = false;
      for (const video of videos) {
        const bounds = video.getBoundingClientRect();
        if (bounds.bottom >= -160 && bounds.top <= window.innerHeight + 160) initialize(video);
      }
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(inspectVisible);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    inspectVisible();
  }
})();
