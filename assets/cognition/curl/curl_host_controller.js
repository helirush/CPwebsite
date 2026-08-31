/*! Curl Maxwell — Cognition Host footer controller
 * Claire-parity staging on CP rev2 / :8050
 *  idle       -> breath pulse
 *  selected   -> brilliant lock + "Curl is ready / SELECT"
 *  connecting -> mic + session arm
 *  speaking   -> Saturn rings + "Stop Listening" (Claire stop pattern)
 *
 * 20260824: break MutationObserver <-> innerHTML feedback loop that froze
 * the page (and local preview) after "Curl is ready / SELECT".
 */
(function () {
  window.__CURL_HOST_CONTROLLER__ = true;
  const CURL_PKG = './assets/cognition/curl';
  const CURL_V = '20260831-static-voice-no-trap-1';
  const CURL_VOICE_ID = '6b530c02-5a80-4e60-bb68-f2c171c5029f';
  const CURL_CONFIG_ID = '242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf';
  const CURL_CHARACTER_ID = 'curl-maxwell';
  const READY_HTML = 'Curl is ready';
  const READY_TEXT = 'Curl is ready';
  const STOP_LABEL = 'Stop Listening'; // Claire-style stop control
  const PAUSE_LABEL = 'Pause Curl';
  const LOCAL_AUTH_ENDPOINTS = ['/api/hume/runtime-auth', '/api/hume/runtime-auth.json'];
  const divaIsPlaying = () => {
    try {
      const st = window.MaxwellianHostEnvironment && window.MaxwellianHostEnvironment.getState && window.MaxwellianHostEnvironment.getState();
      if (st && st.narration && st.narration.status === 'playing') return true;
    } catch (e) {}
    try {
      const aud = document.querySelector('audio[id$="NarrationAudio"]');
      return !!(aud && !aud.paused && !aud.ended);
    } catch (e) {}
    return false;
  };

  const waitFor = async (testFn, timeoutMs = 12000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const value = testFn();
      if (value) return value;
      await new Promise((r) => setTimeout(r, 40));
    }
    return null;
  };

  const pagePathKey = () => {
    const file = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/i, '') || 'index';
    return 'cp-' + file;
  };

  const boot = () => {
    const purposeBtn = document.getElementById('cpPurposeHostButton');
    if (!purposeBtn) return;
    if (purposeBtn.dataset.curlHostBound === '1') return;
    purposeBtn.dataset.curlHostBound = '1';

    purposeBtn.removeAttribute('data-curl-disabled');
    document.body.classList.remove('cp-curl-off');
    window.__CP_CURL_DISABLED = false;
    purposeBtn.style.pointerEvents = 'auto';
    purposeBtn.style.cursor = 'pointer';
    purposeBtn.classList.add('is-idle', 'is-breathing');
    purposeBtn.dataset.purposeState = 'idle';

    let connectWatchTimer = 0;
    let launchInFlight = false;
    let selectInFlight = false;
    let btnWriteGuard = false;
    let curlMo = null;

    const getStartBtn = () => document.getElementById('clerkVoiceStartBtn');

    const normalizeBtnText = (el) =>
      String((el && (el.textContent || el.innerText)) || '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();

    // curl-saturn-bridge: keep body class in sync for CSS Saturn rings
    const syncSaturnClass = () => {
      const speaking = (purposeBtn.dataset.purposeState || '') === 'speaking';
      document.body.classList.toggle('curl-is-speaking', speaking);
      document.body.classList.toggle('curl-host-active', (purposeBtn.dataset.purposeState || '') !== 'idle');
    };


    const setPurposeState = (state) => {
      purposeBtn.dataset.purposeState = state;
      purposeBtn.classList.toggle('is-idle', state === 'idle');
      purposeBtn.classList.toggle('is-selected', state === 'selected' || state === 'connecting' || state === 'speaking');
      purposeBtn.classList.toggle('is-armed', state === 'selected' || state === 'connecting' || state === 'speaking');
      purposeBtn.classList.toggle('is-connecting', state === 'connecting');
      purposeBtn.classList.toggle('is-speaking', state === 'speaking');
      purposeBtn.classList.toggle('is-breathing', state === 'idle');
      purposeBtn.classList.toggle('is-ready-pulse', state === 'selected' || state === 'connecting');
      document.body.classList.toggle('curl-host-active', state !== 'idle');
      document.body.classList.toggle('curl-is-selected', state === 'selected' || state === 'connecting' || state === 'speaking');
      document.body.classList.toggle('curl-is-connecting', state === 'connecting');
      document.body.classList.toggle('curl-is-speaking', state === 'speaking');
      // curl-rgb-state-bridge
      purposeBtn.setAttribute('aria-pressed', state === 'idle' ? 'false' : 'true');
      const label =
        state === 'speaking'
          ? 'Curl Maxwell is speaking — tap Stop Listening to end'
          : state === 'connecting'
            ? 'Curl is connecting microphone and voice session'
            : state === 'selected'
              ? 'Curl is ready — tap SELECT to begin speaking'
              : 'Speak with Curl Maxwell, your Cognition Host';
      purposeBtn.setAttribute('aria-label', label);
      console.info('[Curl] state:', state);
      try { if (typeof syncSaturnClass === 'function') syncSaturnClass(); } catch (e) {}
    };

    const styleBtnVisible = (btn) => {
      if (!btn) return;
      try {
        btn.disabled = false;
        btn.removeAttribute('disabled');
        btn.hidden = false;
        btn.style.display = 'flex';
        btn.style.visibility = 'visible';
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.classList.add('clerk-voice-start-btn');
      } catch (e) {}
    };

    const observeStartBtn = (btn) => {
      if (!curlMo || !btn) return;
      try {
        curlMo.disconnect();
        curlMo.observe(btn, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['class', 'data-curl-state', 'data-claire-state', 'disabled', 'hidden']
        });
      } catch (e) {}
    };

    const withBtnWriteGuard = (fn) => {
      if (btnWriteGuard) return false;
      btnWriteGuard = true;
      try {
        if (curlMo) {
          try {
            curlMo.disconnect();
          } catch (e) {}
        }
        return fn();
      } finally {
        btnWriteGuard = false;
        observeStartBtn(getStartBtn());
      }
    };

    const forceStartButtonReady = (btn) => {
      if (!btn) return;
      // Never clobber stop control while speaking
      const st = purposeBtn.dataset.purposeState || '';
      if (st === 'speaking') return;
      const txt = normalizeBtnText(btn);
      if (/stop listening|pause curl|pause claire|stop-listening/.test(txt) && st === 'connecting') {
        // allow connecting UI from widget
        return;
      }
      // Idempotent: rewriting identical innerHTML re-fires MutationObserver and freezes the tab.
      const alreadyReady =
        btn.dataset.curlState === 'waiting' &&
        (btn.innerHTML === READY_HTML ||
          txt === READY_TEXT.toLowerCase() ||
          txt === 'curl is ready' ||
          (txt.includes('curl is ready') && !/stop listening|pause curl/.test(txt)));
      if (alreadyReady) {
        styleBtnVisible(btn);
        return;
      }
      withBtnWriteGuard(() => {
        styleBtnVisible(btn);
        btn.innerHTML = READY_HTML;
        btn.dataset.curlState = 'waiting';
        btn.setAttribute('data-curl-state', 'waiting');
        btn.setAttribute('data-claire-state', 'waiting');
      });
    };

    const forceStopButton = (btn) => {
      if (!btn) return;
      const txt = normalizeBtnText(btn);
      if (txt === STOP_LABEL.toLowerCase() && btn.dataset.curlState === 'close-ready') {
        styleBtnVisible(btn);
        return;
      }
      withBtnWriteGuard(() => {
        styleBtnVisible(btn);
        btn.textContent = STOP_LABEL;
        btn.dataset.curlState = 'close-ready';
        btn.setAttribute('data-curl-state', 'close-ready');
        btn.setAttribute('data-claire-state', 'close-ready');
      });
    };

    const requestMicPermission = async () => {
      try {
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== 'function') {
          console.warn('[Curl] getUserMedia unavailable');
          return false;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        try {
          (stream.getTracks() || []).forEach((t) => t.stop());
        } catch (e) {}
        console.info('[Curl] microphone permission granted');
        return true;
      } catch (err) {
        console.warn('[Curl] microphone permission failed', err);
        return false;
      }
    };

    const markSpeaking = () => {
      if (connectWatchTimer) {
        window.clearTimeout(connectWatchTimer);
        connectWatchTimer = 0;
      }
      setPurposeState('speaking');
      forceStopButton(getStartBtn());
    };

    const markReady = () => {
      const st = purposeBtn.dataset.purposeState || '';
      if (st === 'idle') return;
      setPurposeState('selected');
      forceStartButtonReady(getStartBtn());
    };

    const bindCurlSpeakingSignals = () => {
      if (purposeBtn.dataset.curlSignalsBound === '1') return;
      purposeBtn.dataset.curlSignalsBound = '1';

      window.addEventListener('clerk-voice-audio-start', markSpeaking);
      window.addEventListener('hume-audio-start', markSpeaking);
      window.addEventListener('clerk-voice-audio-stop', markReady);
      window.addEventListener('hume-audio-stop', markReady);
      window.addEventListener('message', (event) => {
        const data = event && event.data;
        if (!data || typeof data !== 'object') return;
        const t = String(data.type || data.event || '').toLowerCase();
        if (!t) return;
        if (
          t === 'audio_start' ||
          t.includes('assistant_speak') ||
          t.includes('tts_start') ||
          t === 'assistant_message' ||
          t.includes('audio_output_start')
        ) {
          if (data.payload && (data.payload.role === 'user' || data.payload.speaker === 'user')) return;
          markSpeaking();
        }
        if (
          t === 'audio_end' ||
          t.includes('tts_end') ||
          t === 'assistant_end' ||
          t === 'collapse_widget' ||
          t.includes('audio_output_end') ||
          t.includes('session_stopped')
        ) {
          markReady();
        }
      });

      // Observe ONLY the start button. Whole-document observe + innerHTML rewrite
      // caused a synchronous feedback freeze at "Curl is ready / SELECT".
      if (!curlMo) {
        curlMo = new MutationObserver(() => {
          if (btnWriteGuard) return;
          const btn = getStartBtn();
          if (!btn) return;
          const label = normalizeBtnText(btn);
          const st = purposeBtn.dataset.purposeState || '';
          if (/stop listening|pause curl|pause claire|stop-listening/.test(label)) {
            if (st !== 'speaking') markSpeaking();
            return;
          }
          if (st === 'speaking') {
            forceStopButton(btn);
            return;
          }
          if (st === 'selected') {
            // Restore ready label only if widget wiped it — forceStart is idempotent.
            if (!/stop|pause/.test(label) && !(label.includes('curl is ready') && label.includes('select'))) {
              forceStartButtonReady(btn);
            }
          }
        });
        purposeBtn._curlMo = curlMo;
      }
      observeStartBtn(getStartBtn());

      if (!purposeBtn.dataset.curlSpeakPoll) {
        const poll = window.setInterval(() => {
          if (btnWriteGuard) return;
          const st = purposeBtn.dataset.purposeState || 'idle';
          if (st === 'idle') return;
          const btn = getStartBtn();
          if (!btn) return;
          const label = normalizeBtnText(btn);
          if (st === 'speaking') {
            if (!/stop listening|pause curl|pause claire|stop-listening/.test(label)) forceStopButton(btn);
            return;
          }
          if (/stop listening|pause curl|pause claire|stop-listening/.test(label)) {
            markSpeaking();
            return;
          }
          if (st === 'selected') {
            if (!(label.includes('curl is ready') && label.includes('select'))) forceStartButtonReady(btn);
          }
        }, 800);
        purposeBtn.dataset.curlSpeakPoll = String(poll);
      }
    };

    const ensureCurlAuthLoaded = async () => {
      const existing =
        (window.MAXWELLIAN_HUME && window.MAXWELLIAN_HUME.auth && window.MAXWELLIAN_HUME.auth.value) ||
        (window.MAXWELLIAN_HUME_RUNTIME_AUTH && window.MAXWELLIAN_HUME_RUNTIME_AUTH.value) ||
        (window.MAXWELLIAN_HUME_AUTH && window.MAXWELLIAN_HUME_AUTH.value);
      if (existing) {
        // Local CP testing: always prefer same-origin auth endpoints (no prod spam).
        window.MAXWELLIAN_HUME_RUNTIME_AUTH_ENDPOINT = LOCAL_AUTH_ENDPOINTS[0];
        window.MAXWELLIAN_RUNTIME_AUTH_ENDPOINT = LOCAL_AUTH_ENDPOINTS[0];
        window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT = LOCAL_AUTH_ENDPOINTS[0];
        return true;
      }
      // Local-only first. Production Unity endpoints are last-resort and skipped on localhost.
      const onLocal =
        /^(localhost|127\.0\.0\.1)$/i.test(location.hostname) ||
        /cpwebsite-rev2/i.test(location.pathname);
      const endpoints = onLocal
        ? LOCAL_AUTH_ENDPOINTS.slice()
        : LOCAL_AUTH_ENDPOINTS.concat([
            'https://unityenergy.com/api/hume/runtime-auth',
            'https://unityenergy.com/api/hume/runtime-auth.json'
          ]);
      for (const ep of endpoints) {
        try {
          const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
          const timer = controller ? window.setTimeout(() => controller.abort(), 2500) : 0;
          const resp = await fetch(ep, {
            method: 'GET',
            mode: ep.indexOf('http') === 0 ? 'cors' : 'same-origin',
            credentials: ep.indexOf('http') === 0 ? 'omit' : 'same-origin',
            cache: 'no-store',
            headers: { Accept: 'application/json' },
            signal: controller ? controller.signal : undefined
          });
          if (timer) window.clearTimeout(timer);
          if (!resp || !resp.ok) continue;
          const payload = await resp.json();
          const auth = (payload && (payload.auth || payload.runtime_auth || payload.runtimeAuth || payload)) || null;
          const type = (auth && (auth.type || 'apiKey')) || 'apiKey';
          const value = auth && (auth.value || auth.apiKey || auth.accessToken);
          if (!value) continue;
          const normalized = { type: type, value: value };
          window.MAXWELLIAN_HUME_RUNTIME_AUTH = normalized;
          window.MAXWELLIAN_HUME_AUTH = normalized;
          window.MAXWELLIAN_OPENAI_RUNTIME_AUTH = normalized;
          window.MAXWELLIAN_HUME = window.MAXWELLIAN_HUME || {};
          window.MAXWELLIAN_HUME.auth = normalized;
          window.MAXWELLIAN_HUME_RUNTIME_AUTH_ENDPOINT = ep;
          window.MAXWELLIAN_RUNTIME_AUTH_ENDPOINT = ep;
          window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT = ep;
          window.MAXWELLIAN_HUME.hume_runtime_auth_endpoint = ep;
          try {
            sessionStorage.setItem('maxwellian_hume_runtime_auth_v1', JSON.stringify(normalized));
          } catch (e) {}
          console.info('[Curl] auth loaded from', ep, type);
          return true;
        } catch (e) {}
      }
      console.warn('[Curl] auth load failed all endpoints');
      return false;
    };

    const prepareCurlRuntime = async () => {
      const cfgReady = await waitFor(
        () => window.MAXWELLIAN_HUME && typeof window.MAXWELLIAN_HUME === 'object',
        10000
      );
      if (!cfgReady) {
        console.error('[Curl] character config missing after package load.');
        return false;
      }

      await ensureCurlAuthLoaded();

      // Local sandbox reroute (8050/rev2) — same-origin renderer + auth
      const authEp = window.MAXWELLIAN_HUME_RUNTIME_AUTH_ENDPOINT || '/api/hume/runtime-auth';
      window.MAXWELLIAN_HUME_RUNTIME_AUTH_ENDPOINT = authEp;
      window.MAXWELLIAN_RUNTIME_AUTH_ENDPOINT = authEp;
      window.MAXWELLIAN_HUME.hume_runtime_auth_endpoint = authEp;
      window.MAXWELLIAN_HUME.allow_hume_authless_connect = true;
      window.MAXWELLIAN_HUME.embed_url = './assets/cognition/curl/hume_renderer/';
      window.MAXWELLIAN_HUME.renderer_url = './assets/cognition/curl/hume_renderer/';
      window.MAXWELLIAN_HUME.hume_embed_url = './assets/cognition/curl/hume_renderer/';

      // Claire-like start gate + mic path
      window.MAXWELLIAN_HUME.use_unity_start_gate = true;
      window.MAXWELLIAN_HUME.preflight_microphone_on_launch = true;
      window.MAXWELLIAN_HUME.character_name = 'Curl Maxwell';
      window.MAXWELLIAN_HUME.character_id = CURL_CHARACTER_ID;
      window.MAXWELLIAN_HUME.default_character_id = CURL_CHARACTER_ID;
      window.MAXWELLIAN_HUME.lock_character_to_default = true;
      window.MAXWELLIAN_HUME.voice_id = CURL_VOICE_ID;
      window.MAXWELLIAN_HUME.config_id = CURL_CONFIG_ID;
      window.MAXWELLIAN_HUME.hume_voice_id = CURL_VOICE_ID;
      window.MAXWELLIAN_HUME.hume_config_id = CURL_CONFIG_ID;
      window.MAXWELLIAN_HUME.floating_launcher_enabled = false;
      window.MAXWELLIAN_HUME.auto_launch_on_load = false;
      window.MAXWELLIAN_HUME.default_context_source = 'cognition-curl';
      window.MAXWELLIAN_HUME.content_awareness_mode = true;
      window.MAXWELLIAN_HUME.content_awareness_scope_lock = true;
      window.MAXWELLIAN_HUME.clerk_page_access_control_enabled = false;
      window.MAXWELLIAN_HUME.disable_page_context = false;
      window.MAXWELLIAN_HUME.page_context_enabled = true;
      window.MAXWELLIAN_HUME.include_page_context = true;
      window.MAXWELLIAN_HUME.prefetch_active_page_context = false;

      // Button labels — Claire pattern names
      window.MAXWELLIAN_HUME.start_button_waiting_label = 'Curl is ready';
      window.MAXWELLIAN_HUME.start_button_close_label = STOP_LABEL;
      window.MAXWELLIAN_HUME.status_ready = 'Curl is ready';
      window.MAXWELLIAN_HUME.status_speaking = 'Curl is speaking';

      try {
        window.MAXWELLIAN_HUME.characters = window.MAXWELLIAN_HUME.characters || {};
        const entry = {
          label: 'Curl',
          character_name: 'Curl Maxwell',
          config_id: CURL_CONFIG_ID,
          voice_id: CURL_VOICE_ID,
          session_variables: {
            character_name: 'Curl Maxwell',
            character_role: 'Cognition Host for Cognition Partner'
          }
        };
        window.MAXWELLIAN_HUME.characters['curl-maxwell'] = Object.assign(
          {},
          window.MAXWELLIAN_HUME.characters['curl-maxwell'] || {},
          entry
        );
        window.MAXWELLIAN_HUME.characters['curl-charcot'] = Object.assign(
          {},
          window.MAXWELLIAN_HUME.characters['curl-charcot'] || {},
          entry
        );
      } catch (e) {}

      let curlBoot = '';
      let curlOperatingCanon = '';
      let curlOnboard = '';
      let curlIdentityNarrative = '';
      let curlIdentityPack = '';
      let curlJourneyPages = '';
      let curlKnowledgePack = '';
      const fetchKnowledge = async (name) => {
        try {
          const resp = await fetch(CURL_PKG + '/knowledge/' + name + '?v=' + CURL_V, { cache: 'no-store' });
          if (resp && resp.ok) return await resp.text();
        } catch (e) {}
        return '';
      };
      // Fetch order is practical; SEMANTIC authority is labeled in session_context.
      curlBoot = await fetchKnowledge('CURL_BOOT_SEQUENCE.md');
      curlOperatingCanon = await fetchKnowledge('CURL_OPERATING_CANON.md');
      curlOnboard = await fetchKnowledge('SpeakWithCurlOnBoard.md');
      curlIdentityNarrative = await fetchKnowledge('Curl_Internal_Identity_Narrative.md');
      curlIdentityPack = await fetchKnowledge('CURL_IDENTITY_PACK.md');
      curlJourneyPages = await fetchKnowledge('CURL_JOURNEY_PAGES_1_13.md');
      curlKnowledgePack = await fetchKnowledge('CURL_DEMO_KNOWLEDGE_PACK.md');

      const pagePath = (location.pathname.split('/').pop() || 'index.html') + location.search;
      const openingLine =
        "Hello — I'm Curl Maxwell, your Cognition Host. I can travel these pages with you. What would you like to understand?";
      const authorityLine =
        'SEMANTIC AUTHORITY (highest wins on conflict): ' +
        '1 BOOT SEQUENCE | 2 CURL IDENTITY AND ROLE | 3 CURL OPERATING CANON | ' +
        '4 COGNITION PARTNER CANON/ARCHITECTURE | 5 JOURNEY PAGES 1-13 | ' +
        '6 DEMONSTRATIONS (Kuranda/Claire, Unity/Clerk as examples only) | 7 CURRENT PAGE/SESSION. ';
      const operatingLine =
        'You are Curl Maxwell, public Cognition Host for Cognition Partner. ' +
        authorityLine +
        'Complete boot silently before first reply. Absorb Operating Canon before interpreting Journey. ' +
        'PAGE-AWARE when context is provided. Human is the traveler. ' +
        'Active page: ' +
        pagePath +
        '. ' +
        'You are NOT Diva, Claire, Clerk, Cove, or James Clerk Maxwell. ' +
        'Host for this visit — not automatically the visitor private Cognition Partner. ' +
        'Canon vs demonstration vs aspiration. No undeployed claims from artwork. ' +
        'On session start: short opening line, then listen. ';

      window.MAXWELLIAN_HUME.session_context =
        operatingLine +
        '\n\n=== RANK1 BOOT SEQUENCE ===\n' +
        curlBoot +
        '\n\n=== RANK2-3 IDENTITY + CURL OPERATING CANON (governs behavior) ===\n' +
        curlOperatingCanon +
        '\n\n=== SUPPORTING ONBOARD ===\n' +
        curlOnboard +
        '\n\n=== IDENTITY NARRATIVE (absorb; do not recite) ===\n' +
        curlIdentityNarrative +
        '\n\n=== IDENTITY PACK ===\n' +
        curlIdentityPack +
        '\n\n=== RANK5 JOURNEY PAGES 1-13 (narrative visitor was shown; not product specs) ===\n' +
        curlJourneyPages +
        '\n\n=== RANK6 DEMONSTRATIONS / DEMO PACK ===\n' +
        curlKnowledgePack +
        '\n\n=== RANK7 CURRENT PAGE ===\n' +
        pagePath;
      window.MAXWELLIAN_HUME.system_prompt_text =
        'You are Curl Maxwell, Cognition Host for Cognition Partner. ' +
        operatingLine +
        ' Opening line: ' +
        openingLine +
        ' Govern all answers with CURL OPERATING CANON. Journey pages are narrative context only.';
      // Diva-aware / Host environment continuity (does not alter Operating Canon).
      try {
        if (window.MaxwellianHostEnvironment && typeof window.MaxwellianHostEnvironment.refreshPage === 'function') {
          window.MaxwellianHostEnvironment.refreshPage();
        }
        const envBlock =
          window.MaxwellianHostEnvironment && typeof window.MaxwellianHostEnvironment.buildHostContextBlock === 'function'
            ? window.MaxwellianHostEnvironment.buildHostContextBlock('Curl')
            : '';
        if (envBlock) {
          window.MAXWELLIAN_HUME.session_context =
            (window.MAXWELLIAN_HUME.session_context || '') + '\n\n' + envBlock;
          window.MAXWELLIAN_HUME.system_prompt_text =
            (window.MAXWELLIAN_HUME.system_prompt_text || '') +
            ' Use HOST ENVIRONMENT CONTINUITY for immediate page/Diva context. Never treat Diva as the visitor. After Diva, stay silent until visitor engages; then may acknowledge briefly and add a layer — do not default-summarize Diva.';
          if (window.MAXWELLIAN_HUME.session_variables) {
            window.MAXWELLIAN_HUME.session_variables.host_environment_continuity = 'true';
            window.MAXWELLIAN_HUME.session_variables.diva_aware = 'true';
          }
          const st =
            window.MaxwellianHostEnvironment && typeof window.MaxwellianHostEnvironment.getState === 'function'
              ? window.MaxwellianHostEnvironment.getState()
              : null;
          if (st && st.narration) {
            window.MAXWELLIAN_HUME.session_variables.diva_status = String(st.narration.status || 'idle');
            window.MAXWELLIAN_HUME.session_variables.diva_completed = st.narration.completedOnce ? 'yes' : 'no';
            window.MAXWELLIAN_HUME.session_variables.diva_identity = String(st.narration.identity || '');
          }
        }
      } catch (e) {
        console.warn('[Curl] host environment continuity inject skipped', e);
      }

      if (window.MAXWELLIAN_HUME.session_variables) {
        window.MAXWELLIAN_HUME.session_variables.character_name = 'Curl Maxwell';
        window.MAXWELLIAN_HUME.session_variables.opening_line = openingLine;
        window.MAXWELLIAN_HUME.session_variables.library_authority = 'Cognition Partner Library';
        window.MAXWELLIAN_HUME.session_variables.page_aware = 'true';
        window.MAXWELLIAN_HUME.session_variables.host_ui_label = 'CURL';
      }
      window.MAXWELLIAN_HUME.opening_line = openingLine;
      window.MAXWELLIAN_HUME.engagement_protocol =
        'Curl Maxwell: boot + OPERATING CANON govern session. After SELECT/mic, short opening once, then converse. Identity locked. Demo≠canon≠aspiration. Concise-first, page-aware, human remains traveler.';

      purposeBtn.dataset.curlVoiceReady = 'true';
      return true;
    };

    const stopCurlSession = () => {
      try {
        if (typeof window.stopClerkVoice === 'function') window.stopClerkVoice();
      } catch (e) {}
      try {
        if (typeof window.pauseClerkVoice === 'function') window.pauseClerkVoice();
      } catch (e) {}
      try {
        // Some widget builds expose stop via start button second click; ensure UI returns ready
        const btn = getStartBtn();
        if (btn && /stop listening|pause curl|pause claire/i.test(btn.textContent || '')) {
          // leave click to widget if it owns stop; we still flip UI below
        }
      } catch (e) {}
      markReady();
    };

    const hardClearBlockingUi = () => {
      // Tim QA P0: never leave page trapped behind modal/backdrop
      try {
        document.body.classList.remove(
          'curl-host-active',
          'curl-is-selected',
          'curl-is-connecting',
          'curl-is-speaking'
        );
      } catch (e) {}
      try {
        document.documentElement.classList.remove('curl-host-active');
      } catch (e) {}
      const killers = [
        '#clerkVoiceBackdrop',
        '.clerk-voice-backdrop',
        '#clerkVoiceModal',
        '.clerk-voice-modal',
        '#clerkFloatingLauncher',
        '.clerk-floating-launcher'
      ];
      killers.forEach((sel) => {
        try {
          document.querySelectorAll(sel).forEach((el) => {
            el.style.pointerEvents = 'none';
            el.style.display = 'none';
            el.setAttribute('aria-hidden', 'true');
            el.hidden = true;
          });
        } catch (e) {}
      });
      try {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.pointerEvents = '';
      } catch (e) {}
    };

    const endCurl = () => {
      if (connectWatchTimer) {
        window.clearTimeout(connectWatchTimer);
        connectWatchTimer = 0;
      }
      launchInFlight = false;
      selectInFlight = false;
      setPurposeState('idle');
      try {
        if (typeof window.stopClerkVoice === 'function') window.stopClerkVoice();
      } catch (e) {}
      try {
        if (typeof window.pauseClerkVoice === 'function') window.pauseClerkVoice();
      } catch (e) {}
      try {
        if (typeof window.closeClerkVoiceModal === 'function') window.closeClerkVoiceModal();
      } catch (e) {}
      hardClearBlockingUi();
      // second pass after widget teardown races
      window.setTimeout(hardClearBlockingUi, 50);
      window.setTimeout(hardClearBlockingUi, 300);
      const btn = getStartBtn();
      if (btn) forceStartButtonReady(btn);
      console.info('[Curl] endCurl fail-safe cleanup complete');
    };

    window.endCurlHost = endCurl;
    window.cpCurlFailsafeDismiss = endCurl;

    const armSelectWatch = () => {
      if (connectWatchTimer) window.clearTimeout(connectWatchTimer);
      connectWatchTimer = window.setTimeout(() => {
        if ((purposeBtn.dataset.purposeState || '') === 'connecting') {
          console.warn('[Curl] still connecting after 15s — check mic + auth + iframe console');
          // Stay selected/ready so user can retry SELECT (do not freeze forever)
          setPurposeState('selected');
          forceStartButtonReady(getStartBtn());
          const statusEl =
            document.getElementById('clerkVoiceStatus') || document.querySelector('.clerk-voice-status');
          if (statusEl) statusEl.textContent = 'Still connecting… tap SELECT again (allow mic if prompted).';
        }
      }, 15000);
    };

    const onStartButtonClick = async (ev) => {
      if (selectInFlight) return;
      const btn = getStartBtn();
      const st = purposeBtn.dataset.purposeState || '';
      const label = normalizeBtnText(btn);

      // Stop path (Claire parity)
      if (st === 'speaking' || /stop listening|pause curl|pause claire|stop-listening/.test(label)) {
        // Let widget native handler run too; reinforce UI
        window.setTimeout(() => stopCurlSession(), 0);
        return;
      }

      // SELECT path
      if (divaIsPlaying()) {
        console.info('[Curl] SELECT deferred — Diva narration still playing (Host listens; no interrupt/loop)');
        const statusEl =
          document.getElementById('clerkVoiceStatus') || document.querySelector('.clerk-voice-status');
        if (statusEl) statusEl.textContent = 'Curl is listening while Diva finishes… tap SELECT when she is done.';
        return;
      }
      selectInFlight = true;
      setPurposeState('connecting');
      if (btn) {
        withBtnWriteGuard(() => {
          btn.dataset.curlState = 'connecting';
          btn.setAttribute('data-curl-state', 'connecting');
          btn.setAttribute('data-claire-state', 'connecting');
        });
      }
      const statusEl =
        document.getElementById('clerkVoiceStatus') || document.querySelector('.clerk-voice-status');
      if (statusEl) statusEl.textContent = 'Requesting microphone access…';

      try {
        const micOk = await requestMicPermission();
        if (!micOk) {
          setPurposeState('selected');
          forceStartButtonReady(btn);
          if (statusEl) statusEl.textContent = 'Microphone permission needed to speak with Curl. Press Esc or Close Curl to unlock the page.';
          // Do not trap: keep selected UI but ensure backdrop is not permanently locking
          window.setTimeout(() => {
            if ((purposeBtn.dataset.purposeState || '') === 'connecting') endCurl();
          }, 100);
          return;
        }
        if (statusEl) statusEl.textContent = 'Connecting to Curl…';
        armSelectWatch();
        // Widget's own click handler continues session start after this capture listener.
      } finally {
        // Allow retry after a beat if connect stalls
        window.setTimeout(() => {
          selectInFlight = false;
        }, 1200);
      }
    };

    const ensureStartButtonVisible = async () => {
      const btn = await waitFor(() => getStartBtn(), 10000);
      if (!btn) {
        console.warn('[Curl] start button not found after launch');
        return null;
      }
      forceStartButtonReady(btn);
      if (!btn.dataset.curlSelectHooked) {
        btn.dataset.curlSelectHooked = '1';
        // capture so we stage connecting/mic before widget proceeds
        btn.addEventListener('click', onStartButtonClick, true);
      }
      observeStartBtn(btn);
      // One soft reinforce only (was dual timers + MO storm)
      window.setTimeout(() => {
        if ((purposeBtn.dataset.purposeState || '') === 'selected') forceStartButtonReady(getStartBtn());
      }, 400);
      return btn;
    };

    const launchCurl = async () => {
      if (launchInFlight) {
        console.info('[Curl] launch already in flight — ignoring re-entry');
        return;
      }
      launchInFlight = true;
      setPurposeState('selected');
      try {
        await ensureCurlAuthLoaded();
        const ready = await prepareCurlRuntime();
        if (!ready) return;
        bindCurlSpeakingSignals();

        const launcher = await waitFor(() => {
          if (typeof window.launchClerkWithPageContext === 'function') return window.launchClerkWithPageContext;
          if (typeof window.launchClerk === 'function') return window.launchClerk;
          if (typeof window.openClerkVoiceModal === 'function') return window.openClerkVoiceModal;
          return null;
        }, 10000);

if (!launcher) {
          console.error('[Curl] voice launcher unavailable — widget may not have loaded.');
          purposeBtn.title = 'Curl runtime loaded, but voice launcher is unavailable.';
          endCurl();
          return;
        }

        try {
          const result = launcher({
            characterId: CURL_CHARACTER_ID,
            contextSource: 'cognition-curl',
            pageKey: pagePathKey(),
            entryPoint: 'purpose-footer-host',
            uiMode: 'modal',
            disablePageContext: false,
            includePageContext: true,
            contextPayload: {
              organization: 'Cognition Partner',
              public_guide: 'Curl Maxwell',
              host_ui_label: 'CURL',
              page_aware: true,
              content_aware: true,
              identity_pack: 'CURL_IDENTITY_PACK',
              voice_id: CURL_VOICE_ID,
              config_id: CURL_CONFIG_ID,
              setup_status: 'voice-ready',
              opening_line:
                'Hello — I am Curl Maxwell, your Cognition Host. I can travel these pages with you. What would you like to understand?'
            }
          });
          if (result && typeof result.then === 'function') await result;
          console.info('[Curl] launch invoked — selected; waiting SELECT');
          try {
            if (typeof window.setPanelMode === 'function') window.setPanelMode('docked');
          } catch (e) {}
        } catch (e) {
          console.error('[Curl] launch failed', e);
          endCurl();
        }

        await ensureStartButtonVisible();
      } finally {
        launchInFlight = false;
      }
    };

    const activateSelect = async () => {
      if (selectInFlight || launchInFlight) {
        console.info('[Curl] SELECT ignored — already activating');
        return;
      }
      let btn = getStartBtn();
      if (!btn) {
        await launchCurl();
        btn = await waitFor(() => getStartBtn(), 8000);
      }
      if (!btn) {
        console.warn('[Curl] SELECT unavailable — start button missing');
        return;
      }
      // Do not rewrite label right before click (can race widget + MO).
      setPurposeState('connecting');
      armSelectWatch();
      try {
        btn.click();
      } catch (e) {
        console.warn('[Curl] SELECT click failed', e);
        selectInFlight = false;
        setPurposeState('selected');
        forceStartButtonReady(btn);
      }
    };

purposeBtn.addEventListener('click', async () => {
      const cur = purposeBtn.dataset.purposeState || 'idle';
      if (cur === 'idle') {
        await launchCurl();
        return;
      }
      if (cur === 'selected' || cur === 'connecting') {
        await activateSelect();
        return;
      }
      if (cur === 'speaking') {
        // Orb tap while speaking = stop (same as Stop Listening)
        const btn = getStartBtn();
        if (btn) {
          try {
            btn.click();
          } catch (e) {}
        }
        stopCurlSession();
        window.setTimeout(endCurl, 200);
        return;
      }
      endCurl();
    });

    // P0 fail-safe: Esc dismisses host
    if (purposeBtn.dataset.curlEscBound !== '1') {
      purposeBtn.dataset.curlEscBound = '1';
      document.addEventListener(
        'keydown',
        (ev) => {
          if (!ev) return;
          const key = ev.key || ev.code;
          if (key !== 'Escape' && key !== 'Esc') return;
          const st = purposeBtn.dataset.purposeState || 'idle';
          if (st === 'idle' && !document.body.classList.contains('curl-host-active')) return;
          try {
            ev.preventDefault();
          } catch (e) {}
          console.info('[Curl] Escape dismiss');
          endCurl();
        },
        true
      );
    }

    // P0 fail-safe: click outside modal / on backdrop ends host
    if (purposeBtn.dataset.curlOutsideBound !== '1') {
      purposeBtn.dataset.curlOutsideBound = '1';
      document.addEventListener(
        'pointerdown',
        (ev) => {
          const st = purposeBtn.dataset.purposeState || 'idle';
          if (st === 'idle' && !document.body.classList.contains('curl-host-active')) return;
          const t = ev.target;
          if (!t || !t.closest) return;
          if (t.closest('#cpPurposeHostButton')) return;
          if (t.closest('#clerkVoiceStartBtn')) return;
          if (t.closest('.clerk-voice-start-btn')) return;
          if (t.closest('#clerkVoiceModal .clerk-voice-panel')) return;
          if (t.closest('.clerk-voice-modal-panel')) return;
          if (t.closest('iframe[src*="hume"]')) return;
          // backdrop or empty page chrome while host active
          if (
            t.closest('#clerkVoiceBackdrop') ||
            t.closest('.clerk-voice-backdrop') ||
            t.closest('#clerkVoiceModal') ||
            document.body.classList.contains('curl-host-active')
          ) {
            // Only dismiss when clicking backdrop itself or non-interactive page while trapped
            /* internal decorative backdrop must NOT dismiss or trap */
            if (t.closest('#clerkVoiceModal') || t.closest('.clerk-voice-modal') || t.closest('#clerkVoiceBackdrop') || t.closest('.clerk-voice-backdrop')) {
              return;
            }
            if (t.closest('#cpCurlFailsafeClose') || t.closest('#cpPurposeHostButton') || t.closest('.cp-r2-listen') || t.closest('.cp-r2-footer-transport') || t.closest('iframe')) {
              return;
            }
            console.info('[Curl] outside-page dismiss');
            endCurl();
          }
        },
        true
      );
    }

    // P0 fail-safe: inject visible Close control near start button when host active
    const ensureCloseChip = () => {
      let chip = document.getElementById('cpCurlFailsafeClose');
      const active = (purposeBtn.dataset.purposeState || 'idle') !== 'idle' || document.body.classList.contains('curl-host-active');
      if (!active) {
        if (chip) chip.remove();
        return;
      }
      if (!chip) {
        chip = document.createElement('button');
        chip.id = 'cpCurlFailsafeClose';
        chip.type = 'button';
        chip.textContent = 'Close Curl';
        chip.setAttribute('aria-label', 'Close Curl and unlock page');
        chip.className = 'cp-curl-failsafe-close';
        chip.addEventListener('click', (ev) => {
          try {
            ev.preventDefault();
            ev.stopPropagation();
          } catch (e) {}
          endCurl();
        });
        document.body.appendChild(chip);
      }
    };
    window.setInterval(ensureCloseChip, 800);
    ensureCloseChip();

    // Failure / unload cleanup
    window.addEventListener('pagehide', endCurl);
    window.addEventListener('beforeunload', endCurl);
    window.addEventListener('error', (ev) => {
      try {
        const msg = String((ev && (ev.message || ev.error)) || '');
        if (/MutationObserver|maximum call stack|out of memory/i.test(msg)) {
          console.warn('[Curl] fatal UI error — fail-safe idle', msg);
          window.setTimeout(endCurl, 0);
        }
      } catch (e) {}
    });

    setPurposeState('idle');
    hardClearBlockingUi();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
