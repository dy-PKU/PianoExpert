'use strict';

// Shared by the academic page and its same-origin, iframe-ready player page.
(() => {
  const pieces = Object.freeze({
    ballade: 'Ballade',
    moonlight: 'Moonlight III',
    campanella: 'La Campanella',
    fantaisie: 'Fantaisie',
    unsospiro: 'Un Sospiro',
    winter: 'Winter',
    liebestraum: 'Liebestraum',
    nocturne: 'Nocturne · Op. 9 No. 2',
    blackkey: 'BlackKey',
    etude: 'Etude / Tristesse'
  });
  const controllers = new WeakMap();

  function showError(video, message = 'This video could not load. Please refresh and try again.') {
    const note = video.closest('.video-wrap')?.querySelector('.video-message');
    if (note) {
      note.textContent = message;
      note.hidden = false;
    }
  }

  function clearError(video) {
    const note = video.closest('.video-wrap')?.querySelector('.video-message');
    if (note) note.hidden = true;
  }

  function attach(video) {
    if (controllers.has(video)) return controllers.get(video);
    const piece = video.dataset.piece;
    if (!Object.hasOwn(pieces, piece)) {
      showError(video, 'This performance is unavailable.');
      return null;
    }
    const source = `media/${piece}/index.m3u8`;
    let hls = null;
    let mediaRecoveryAttempted = false;
    let networkRecoveryAttempted = false;
    const controller = { video, destroy() { hls?.destroy(); controllers.delete(video); } };
    controllers.set(video, controller);
    video.preload = 'metadata';
    video.addEventListener('playing', () => clearError(video));
    video.addEventListener('error', () => showError(video));

    if (window.Hls?.isSupported()) {
      hls = new window.Hls({
        enableWorker: false,
        maxBufferLength: 24,
        maxMaxBufferLength: 30,
        backBufferLength: 12,
        maxBufferSize: 16 * 1024 * 1024,
        startFragPrefetch: false
      });
      hls.on(window.Hls.Events.ERROR, (_, data) => {
        if (!data.fatal) return;
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR && !networkRecoveryAttempted) {
          networkRecoveryAttempted = true;
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR && !mediaRecoveryAttempted) {
          mediaRecoveryAttempted = true;
          hls.recoverMediaError();
        } else {
          hls.stopLoad();
          showError(video);
        }
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari can play the same HLS playlist through its native video engine.
      video.src = source;
      video.load();
    } else {
      showError(video, 'Please open this video in a recent browser.');
    }
    return controller;
  }

  window.PianoExpertPlayer = Object.freeze({ attach, pieces });

  if (document.body.classList.contains('player-page')) {
    const piece = new URLSearchParams(window.location.search).get('piece');
    const video = document.getElementById('embedded-video');
    if (!Object.hasOwn(pieces, piece)) {
      showError(video, 'This performance is unavailable.');
      video.removeAttribute('poster');
      return;
    }
    document.title = `${pieces[piece]} · PianoExpert`;
    video.dataset.piece = piece;
    video.poster = `assets/${piece}-frame.jpg`;
    video.setAttribute('aria-label', `${pieces[piece]} simulation performance`);
    attach(video);
  }
})();
