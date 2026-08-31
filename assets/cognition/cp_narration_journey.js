/*! Cognition Partner — Narration Journey Controller
 * INSTRUCT 2026-08-31 Tim External QA
 * quiet arrival (page 1) → intentional LISTEN consent → continuous journey
 * Universal LISTEN: play / pause / resume / replay-from-start
 * Session keys remember consent + user-stopped preference
 */
(function () {
  'use strict';
  if (window.__CP_NARRATION_JOURNEY__) return;
  window.__CP_NARRATION_JOURNEY__ = true;

  var CONSENT_KEY = 'cp_narration_journey_consent_v1';
  var STOPPED_KEY = 'cp_narration_user_stopped_v1';
  var STAMP = '20260831-tim-qa-narration-1';

  function pageFile() {
    try {
      return (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    } catch (e) {
      return 'index.html';
    }
  }

  function isPage1() {
    var f = pageFile();
    return f === '' || f === 'index.html' || f === 'index';
  }

  function journeyRank() {
    var f = pageFile();
    if (isPage1()) return 1;
    var m = f.match(/^page(\d+)\.html$/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function getConsent() {
    try {
      return sessionStorage.getItem(CONSENT_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setConsent(v) {
    try {
      if (v) sessionStorage.setItem(CONSENT_KEY, '1');
      else sessionStorage.removeItem(CONSENT_KEY);
    } catch (e) {}
  }

  function getUserStopped() {
    try {
      return sessionStorage.getItem(STOPPED_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setUserStopped(v) {
    try {
      if (v) sessionStorage.setItem(STOPPED_KEY, '1');
      else sessionStorage.removeItem(STOPPED_KEY);
    } catch (e) {}
  }

  function findAudio() {
    return (
      document.querySelector('audio[id$="NarrationAudio"]') ||
      document.querySelector('audio[id*="Narration"]') ||
      document.querySelector('audio.cp-narration') ||
      null
    );
  }

  function findPlayBtn() {
    return (
      document.querySelector('button.cp-r2-listen') ||
      document.querySelector('[id$="PlayButton"]') ||
      document.getElementById('cpR1PlayButton') ||
      null
    );
  }

  function syncListenUi(audioEl, playBtn) {
    if (!playBtn || !audioEl) return;
    var playing = !audioEl.paused && !audioEl.ended;
    playBtn.classList.toggle('is-playing', playing);
    playBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
    var icon = playBtn.querySelector('.cp-r2-listen-icon');
    var label = playBtn.querySelector('.cp-r2-transport-label');
    if (icon) icon.textContent = playing ? '❚❚' : '▶';
    if (label) label.textContent = playing ? 'PAUSE' : 'LISTEN';
    playBtn.setAttribute(
      'aria-label',
      playing ? 'Pause narration' : 'Listen to narration'
    );
  }

  function publishEnv(audioEl, status) {
    try {
      window.MaxwellianHostEnvironment = window.MaxwellianHostEnvironment || {};
      var st = window.MaxwellianHostEnvironment.getState
        ? window.MaxwellianHostEnvironment.getState()
        : {};
      st = st || {};
      st.narration = st.narration || {};
      st.narration.status = status;
      st.narration.page = pageFile();
      st.narration.rank = journeyRank();
      st.narration.consent = getConsent();
      st.narration.userStopped = getUserStopped();
      st.narration.completedOnce = !!(audioEl && audioEl.ended);
      st.narration.identity = 'Diva';
      st.narration.stamp = STAMP;
      window.MaxwellianHostEnvironment._state = st;
      if (!window.MaxwellianHostEnvironment.getState) {
        window.MaxwellianHostEnvironment.getState = function () {
          return window.MaxwellianHostEnvironment._state || {};
        };
      }
      window.dispatchEvent(
        new CustomEvent('cp-narration-state', { detail: st.narration })
      );
    } catch (e) {}
  }

  function bind() {
    var audioEl = findAudio();
    var playBtn = findPlayBtn();
    if (!audioEl || !playBtn) {
      console.warn('[CP Narration] audio or LISTEN button missing on', pageFile());
      return;
    }
    if (playBtn.dataset.cpJourneyBound === '1') return;
    playBtn.dataset.cpJourneyBound = '1';

    // Neutralize legacy duplicate play handlers by capturing first and stopping them
    playBtn.addEventListener(
      'click',
      function (ev) {
        try {
          ev.preventDefault();
          ev.stopImmediatePropagation();
        } catch (e) {}

        var playing = !audioEl.paused && !audioEl.ended;
        if (playing) {
          try {
            audioEl.pause();
          } catch (e) {}
          setUserStopped(true);
          syncListenUi(audioEl, playBtn);
          publishEnv(audioEl, 'paused');
          return;
        }

        // resume or replay
        setUserStopped(false);
        setConsent(true);
        try {
          if (audioEl.ended || (audioEl.currentTime || 0) >= (audioEl.duration || Infinity) - 0.05) {
            audioEl.currentTime = 0;
          }
        } catch (e) {}
        var p = audioEl.play();
        if (p && typeof p.catch === 'function') {
          p.catch(function (err) {
            console.warn('[CP Narration] play failed', err);
            syncListenUi(audioEl, playBtn);
          });
        }
        syncListenUi(audioEl, playBtn);
      },
      true
    );

    audioEl.addEventListener('playing', function () {
      setConsent(true);
      // If audio starts while user-stopped (shouldn't), respect stop only on intentional pause
      syncListenUi(audioEl, playBtn);
      publishEnv(audioEl, 'playing');
    });
    audioEl.addEventListener('pause', function () {
      if (!audioEl.ended) {
        syncListenUi(audioEl, playBtn);
        publishEnv(audioEl, 'paused');
      }
    });
    audioEl.addEventListener('ended', function () {
      try {
        audioEl.currentTime = 0;
      } catch (e) {}
      syncListenUi(audioEl, playBtn);
      publishEnv(audioEl, 'ended');
    });
    audioEl.addEventListener('error', function () {
      syncListenUi(audioEl, playBtn);
      publishEnv(audioEl, 'error');
    });

    syncListenUi(audioEl, playBtn);
    publishEnv(audioEl, audioEl.paused ? 'idle' : 'playing');

    // Continuous journey: after consent, autoplay on pages 2+ unless user stopped
    var rank = journeyRank();
    if (!isPage1() && rank >= 2 && getConsent() && !getUserStopped()) {
      var kick = function () {
        if (getUserStopped()) return;
        if (!audioEl.paused && !audioEl.ended) return;
        try {
          if ((audioEl.currentTime || 0) > 0.2 && !audioEl.ended) {
            /* resume mid if browser restored */
          } else {
            try {
              audioEl.currentTime = 0;
            } catch (e) {}
          }
        } catch (e) {}
        var pr = audioEl.play();
        if (pr && typeof pr.catch === 'function') {
          pr.catch(function () {
            // autoplay blocked — wait for gesture; LISTEN still works
            console.info('[CP Narration] autoplay blocked; waiting for LISTEN');
          });
        }
      };
      if (document.readyState === 'complete') setTimeout(kick, 80);
      else window.addEventListener('load', function () {
        setTimeout(kick, 80);
      });
      setTimeout(kick, 200);
    }

    console.info('[CP Narration] journey bound', {
      page: pageFile(),
      rank: rank,
      consent: getConsent(),
      stopped: getUserStopped(),
      stamp: STAMP
    });
  }

  // Kill page-1 Diva autostart if present (quiet arrival)
  function suppressPage1Autostart() {
    if (!isPage1()) return;
    // Mark so legacy autostart blocks that check dataset can no-op if we patch them;
    // also pause any early play attempts shortly after load.
    var guard = function () {
      var audioEl = findAudio();
      if (!audioEl) return;
      if (!getConsent()) {
        try {
          if (!audioEl.paused) audioEl.pause();
          audioEl.autoplay = false;
        } catch (e) {}
      }
    };
    guard();
    setTimeout(guard, 50);
    setTimeout(guard, 150);
    setTimeout(guard, 400);
    setTimeout(guard, 1000);
  }

  function boot() {
    suppressPage1Autostart();
    bind();
    // Re-bind if footer re-rendered
    setTimeout(bind, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.CPNarrationJourney = {
    getConsent: getConsent,
    getUserStopped: getUserStopped,
    setConsent: setConsent,
    setUserStopped: setUserStopped,
    stamp: STAMP
  };
})();
