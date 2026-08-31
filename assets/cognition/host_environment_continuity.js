/*! Maxwellian Host Environment Continuity
 * Reusable Cognition Host principle:
 * A Host should understand the human's immediate environment
 * (page, narration, selected experience, recent interaction)
 * so the human does not continually re-explain what they are looking at.
 *
 * Curl pass (2026-08-31): Diva-aware continuity.
 * Do NOT treat narration as visitor speech.
 * Do NOT create Host/narrator conversational loops.
 * Unity "what am I looking at?" field-context is future reuse — not implemented here.
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'maxwellian_host_environment_continuity_v1';
  const BUS = 'maxwellian:host-environment';

  const PAGE_META = {
    index: { pageNumber: 1, title: 'Your Partner', scriptFile: 'assets/audio/CognitionPartner_page1r1-script.txt' },
    page1: { pageNumber: 1, title: 'Your Partner', scriptFile: 'assets/audio/CognitionPartner_page1r1-script.txt' },
    page2: { pageNumber: 2, title: 'Continuous Reasoning', scriptFile: 'assets/audio/CognitionPartner_page2r1-script.txt' },
    page3: { pageNumber: 3, title: 'Operating System', scriptFile: 'assets/audio/CognitionPartner_page3r1-script.txt' },
    page4: { pageNumber: 4, title: 'Living Library', scriptFile: 'assets/audio/CognitionPartner_page4r1-script.txt' },
    page5: { pageNumber: 5, title: 'Partner Growth', scriptFile: 'assets/audio/CognitionPartner_page5r1-script.txt' },
    page6: { pageNumber: 6, title: "What's Calling", scriptFile: 'assets/audio/CognitionPartner_page6r1-script.txt' },
    page7: { pageNumber: 7, title: 'Knowledge and Permission', scriptFile: 'assets/audio/CognitionPartner_page7r1-script.txt' },
    page8: { pageNumber: 8, title: 'What Should Continue', scriptFile: 'assets/audio/CognitionPartner_page8r1-script.txt' },
    page9: { pageNumber: 9, title: 'The Journey Is Yours', scriptFile: 'assets/audio/CognitionPartner_page9r1-script.txt' },
    page10: { pageNumber: 10, title: 'Your Cognition System', scriptFile: 'assets/audio/CognitionPartner_page10r1-script.txt' },
    page11: { pageNumber: 11, title: 'Possibility 1 — Partner', scriptFile: 'assets/audio/CognitionPartner_page11r1-script.txt' },
    page12: { pageNumber: 12, title: 'Possibility 2 — Partner + Host', scriptFile: 'assets/audio/CognitionPartner_page12r1-script.txt' },
    page13: { pageNumber: 13, title: 'Possibility 3 — Cognition Team', scriptFile: 'assets/audio/CognitionPartner_page13r1-script.txt' },
    about: { pageNumber: 0, title: 'About', scriptFile: '' },
  };

  const defaultState = () => ({
    version: 1,
    principle:
      "A Cognition Host should understand the human's immediate environment (page, narration, selected experience, recent interaction) so the human need not continually reconstruct context verbally.",
    updatedAt: null,
    page: {
      key: '',
      path: '',
      title: '',
      pageNumber: null,
    },
    narration: {
      narrator: 'Diva',
      role: 'Journey/Possibilities site narrator (not a Host, not visitor speech)',
      identity: '',
      scriptFile: '',
      audioSrc: '',
      audioElementId: '',
      status: 'idle', // idle | selected | playing | paused | completed | error
      selectedAt: null,
      startedAt: null,
      completedAt: null,
      lastEventAt: null,
      progressRatio: 0,
      currentTimeSec: 0,
      durationSec: 0,
      completedOnce: false,
    },
    host: {
      // Visual/audio state ideas for later orb UX — never auto-trigger conversation from these alone.
      listening: false, // Host is effectively listening while narrator speaks
      reasoning: false,
      speaking: false,
    },
    rules: {
      narrationIsNotVisitorSpeech: true,
      hostMustNotInterruptNarrator: true,
      hostMustNotAnswerNarrator: true,
      hostMustNotTriggerNarrationInResponse: true,
      noNarratorHostConversationalLoop: true,
      afterNarrationHostStaysSilentUntilVisitorEngages: true,
      onVisitorEngageMayAcknowledgeThenAddLayer: true,
      doNotDefaultSummarizeOrRepeatNarration: true,
    },
    futureReuseNote:
      'Generalize for Claire and Clerk. Unity future: electrician looking at a field visualization can ask Clerk what they are looking at; Host already knows selected screen/field/dataset context. Not implemented in this Curl pass.',
  });

  const pageKeyFromLocation = () => {
    const file = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/i, '') || 'index';
    return file === 'index' ? 'index' : file;
  };

  const readStored = () => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (e) {
      return null;
    }
  };

  const writeStored = (state) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  };

  const emit = (state, reason) => {
    try {
      global.dispatchEvent(
        new CustomEvent(BUS, {
          detail: { reason: reason || 'update', state: state },
        })
      );
    } catch (e) {}
    try {
      global.__MAXWELLIAN_HOST_ENVIRONMENT__ = state;
    } catch (e) {}
  };

  let state = Object.assign(defaultState(), readStored() || {});

  const ensurePage = () => {
    const key = pageKeyFromLocation();
    const meta = PAGE_META[key] || { pageNumber: null, title: key, scriptFile: '' };
    state.page = {
      key: key,
      path: (location.pathname.split('/').pop() || 'index.html') + (location.search || ''),
      title: meta.title || key,
      pageNumber: meta.pageNumber,
    };
    if (!state.narration.identity) {
      state.narration.identity = meta.scriptFile
        ? 'Diva page' + (meta.pageNumber || '') + ' narration'
        : 'Diva narration';
      state.narration.scriptFile = meta.scriptFile || '';
    }
  };

  const setNarrationStatus = (status, extra) => {
    ensurePage();
    const now = new Date().toISOString();
    state.updatedAt = now;
    state.narration.status = status;
    state.narration.lastEventAt = now;
    if (extra && typeof extra === 'object') {
      Object.keys(extra).forEach((k) => {
        state.narration[k] = extra[k];
      });
    }
    // Host is effectively listening while Diva speaks — visual/state only; no conversational trigger.
    state.host.listening = status === 'playing';
    if (status === 'playing' && !state.narration.startedAt) state.narration.startedAt = now;
    if (status === 'selected' && !state.narration.selectedAt) state.narration.selectedAt = now;
    if (status === 'completed') {
      state.narration.completedAt = now;
      state.narration.completedOnce = true;
      state.narration.progressRatio = 1;
    }
    writeStored(state);
    emit(state, 'narration:' + status);
    try {
      document.body.dataset.hostNarrationStatus = status;
      document.body.classList.toggle('host-narrator-playing', status === 'playing');
    } catch (e) {}
  };

  const findNarrationAudio = () => {
    const nodes = Array.from(document.querySelectorAll('audio[id$="NarrationAudio"], audio.cp-r2-narration-audio, audio[data-cp-narration="diva"]'));
    if (nodes.length) return nodes[0];
    // Fallback: first audio under cream footer / media card
    const footerAudio = document.querySelector('.cp-r2-media-card audio, .cp-r2-footer audio, audio');
    return footerAudio || null;
  };

  const bindNarration = (audioEl) => {
    if (!audioEl || audioEl.dataset.hostEnvBound === '1') return;
    audioEl.dataset.hostEnvBound = '1';
    ensurePage();
    const meta = PAGE_META[pageKeyFromLocation()] || {};
    state.narration.audioElementId = audioEl.id || '';
    state.narration.audioSrc = audioEl.currentSrc || audioEl.src || '';
    state.narration.scriptFile = meta.scriptFile || state.narration.scriptFile;
    state.narration.identity =
      'Diva · ' + (meta.title || state.page.title || 'Journey page') + ' · ' + (state.narration.scriptFile || audioEl.id || 'narration');

    const bumpProgress = () => {
      const d = Number(audioEl.duration);
      const t = Number(audioEl.currentTime);
      state.narration.durationSec = Number.isFinite(d) ? d : 0;
      state.narration.currentTimeSec = Number.isFinite(t) ? t : 0;
      state.narration.progressRatio =
        Number.isFinite(d) && d > 0 && Number.isFinite(t) ? Math.max(0, Math.min(1, t / d)) : state.narration.progressRatio;
    };

    audioEl.addEventListener('play', () => {
      bumpProgress();
      setNarrationStatus('playing', {
        audioSrc: audioEl.currentSrc || audioEl.src || state.narration.audioSrc,
      });
    });
    audioEl.addEventListener('playing', () => {
      bumpProgress();
      setNarrationStatus('playing');
    });
    audioEl.addEventListener('pause', () => {
      bumpProgress();
      if (!audioEl.ended) setNarrationStatus('paused');
    });
    audioEl.addEventListener('ended', () => {
      bumpProgress();
      setNarrationStatus('completed', { progressRatio: 1 });
    });
    audioEl.addEventListener('error', () => setNarrationStatus('error'));
    audioEl.addEventListener('timeupdate', () => {
      if (state.narration.status === 'playing') {
        bumpProgress();
        // light persistence throttle via rAF-ish: only write every ~2s
        const t = state.narration.currentTimeSec || 0;
        if (!bindNarration._lastWrite || Math.abs(t - bindNarration._lastWrite) >= 2) {
          bindNarration._lastWrite = t;
          state.updatedAt = new Date().toISOString();
          writeStored(state);
        }
      }
    });

    // Listen button = selected intent even before play resolves
    const playBtn =
      document.querySelector('[id$="PlayButton"]') ||
      document.querySelector('.cp-r2-listen-btn, .cp-r2-play-button, button[aria-label*="Listen" i]');
    if (playBtn && playBtn.dataset.hostEnvPlayBound !== '1') {
      playBtn.dataset.hostEnvPlayBound = '1';
      playBtn.addEventListener(
        'click',
        () => {
          setNarrationStatus(audioEl.paused ? 'selected' : state.narration.status);
        },
        true
      );
    }
  };

  const boot = () => {
    ensurePage();
    state.updatedAt = new Date().toISOString();
    writeStored(state);
    emit(state, 'boot');
    const tryBind = () => {
      const el = findNarrationAudio();
      if (el) bindNarration(el);
    };
    tryBind();
    // Late DOM / dynamic mounts
    global.setTimeout(tryBind, 50);
    global.setTimeout(tryBind, 400);
    if (typeof MutationObserver === 'function') {
      try {
        const mo = new MutationObserver(() => tryBind());
        mo.observe(document.documentElement, { childList: true, subtree: true });
        global.setTimeout(() => {
          try {
            mo.disconnect();
          } catch (e) {}
        }, 8000);
      } catch (e) {}
    }
  };

  const getState = () => {
    ensurePage();
    return JSON.parse(JSON.stringify(state));
  };

  const buildHostContextBlock = (hostName) => {
    const s = getState();
    const n = s.narration || {};
    const p = s.page || {};
    const host = hostName || 'Host';
    const lines = [];
    lines.push('=== RANK7+ HOST ENVIRONMENT CONTINUITY (immediate visitor experience) ===');
    lines.push('Principle: ' + s.principle);
    lines.push('Active page: ' + (p.title || p.key) + ' (' + (p.path || '') + ')');
    if (p.pageNumber) lines.push('Journey page number: ' + p.pageNumber);
    lines.push('Narrator: Diva (site Journey narrator). Diva is NOT the visitor and NOT ' + host + '.');
    lines.push('Narration identity: ' + (n.identity || 'unknown'));
    if (n.scriptFile) lines.push('Narration script file: ' + n.scriptFile);
    if (n.audioSrc) lines.push('Narration audio: ' + n.audioSrc);
    lines.push('Narration status: ' + (n.status || 'idle'));
    lines.push('Narration completed once this session: ' + (n.completedOnce ? 'yes' : 'no'));
    if (n.completedAt) lines.push('Narration completed at: ' + n.completedAt);
    if (n.startedAt) lines.push('Narration started at: ' + n.startedAt);
    lines.push('Progress: ' + Math.round((n.progressRatio || 0) * 100) + '%');
    lines.push('');
    lines.push('HARD RULES FOR ' + host.toUpperCase() + ':');
    lines.push('- Never treat Diva narration as visitor speech.');
    lines.push('- Never interrupt Diva, answer Diva, trigger Diva, or create a Diva/' + host + ' conversational loop.');
    lines.push('- While Diva is speaking, ' + host + ' is effectively listening (state only).');
    lines.push('- After Diva finishes, remain silent until the visitor engages ' + host + '.');
    lines.push('- If the visitor then activates ' + host + ', you MAY briefly acknowledge what they just heard, then add another layer — do NOT default to repeating or summarizing Diva.');
    lines.push("- Resolve natural references: if visitor says 'what did she mean', 'tell me more about that', 'what Diva just said', 'is that actually possible' — 'she/that' refers to the immediate Diva narration and page context above.");
    lines.push('- Prefer connecting the idea to the visitor situation or clarifying architecture over reciting the script.');
    if (n.status === 'playing') {
      lines.push('- RIGHT NOW Diva is still speaking or was just playing: do not talk over her; wait for visitor engagement after completion when possible.');
    }
    lines.push('Future (not this pass): same environment continuity enables Unity Clerk to know which field/visualization the electrician is looking at.');
    return lines.join('\n');
  };

  const api = {
    STORAGE_KEY: STORAGE_KEY,
    getState: getState,
    buildHostContextBlock: buildHostContextBlock,
    setNarrationStatus: setNarrationStatus,
    bindNarration: bindNarration,
    refreshPage: () => {
      ensurePage();
      writeStored(state);
      emit(state, 'page');
    },
  };

  global.MaxwellianHostEnvironment = api;
  global.__MAXWELLIAN_HOST_ENVIRONMENT__ = state;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(typeof window !== 'undefined' ? window : globalThis);
