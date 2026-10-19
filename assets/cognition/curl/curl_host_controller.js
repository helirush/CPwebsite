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
  const CURL_V = '20261012-curl-marin-textmod-1';
  const CARRY_KEY = 'cp_curl_page_carry_v1';
  const CARRY_TTL_MS = 90000; // resume window after journey navigation
  const CURL_VOICE_ID = '23982fd1-d6a5-4acc-b396-2454b5715d43';
  const CURL_CONFIG_ID = '242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf';
  const CURL_CHARACTER_ID = 'curl-maxwell';
  const READY_HTML = 'Curl is ready';
  const READY_TEXT = 'Curl is ready';
  const STOP_LABEL = 'Stop Listening'; // Claire-style stop control
  const PAUSE_LABEL = 'Pause Curl';
  const LOCAL_AUTH_ENDPOINTS = []; // GPT Live only — no Hume runtime-auth
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
        // Idempotent writes only — prevents MutationObserver attribute storms.
        if (btn.disabled) btn.disabled = false;
        if (btn.hasAttribute('disabled')) btn.removeAttribute('disabled');
        if (btn.hidden) btn.hidden = false;
        if (btn.style.display !== 'flex') btn.style.display = 'flex';
        if (btn.style.visibility !== 'visible') btn.style.visibility = 'visible';
        if (btn.style.opacity !== '1') btn.style.opacity = '1';
        if (btn.style.pointerEvents !== 'auto') btn.style.pointerEvents = 'auto';
        if (!btn.classList.contains('clerk-voice-start-btn')) btn.classList.add('clerk-voice-start-btn');
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
        // CRITICAL: do not call styleBtnVisible here.
        // Attribute/style churn re-enters MutationObserver and freezes the tab
        // (public cognitionpartner.ai Curl lockup).
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
            // Restore ready label only if widget wiped it.
            // If already "curl is ready" (with or without select), do nothing.
            if (/stop listening|pause curl|pause claire|stop-listening/.test(label)) return;
            if (label.includes('curl is ready') || btn.dataset.curlState === 'waiting') return;
            forceStartButtonReady(btn);
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
            if (label.includes('curl is ready') || btn.dataset.curlState === 'waiting') return;
            forceStartButtonReady(btn);
          }
        }, 800);
        purposeBtn.dataset.curlSpeakPoll = String(poll);
      }
    };

    const ensureCurlAuthLoaded = async () => {
      // GPT Live / OpenAI only — never call Hume runtime-auth endpoints.
      try {
        window.MAXWELLIAN_HUME_RUNTIME_AUTH_ENDPOINT = '';
        window.MAXWELLIAN_RUNTIME_AUTH_ENDPOINT = '';
        window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT = '';
        if (window.MAXWELLIAN_HUME && typeof window.MAXWELLIAN_HUME === 'object') {
          window.MAXWELLIAN_HUME.hume_runtime_auth_endpoint = '';
          window.MAXWELLIAN_HUME.allow_hume_authless_connect = false;
          window.MAXWELLIAN_HUME.voice_engine = 'openai';
      window.MAXWELLIAN_HUME.character_background_url = '';
      window.MAXWELLIAN_HUME.openai_center_visual_url = '';
      window.MAXWELLIAN_HUME.unity_launch_ring_image_url = '';
      window.MAXWELLIAN_HUME.signal_portrait_url = '';
      window.MAXWELLIAN_HUME.floating_launcher_enabled = false;
        }
      } catch (e) {}
      return true;
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
      window.MAXWELLIAN_HUME_RUNTIME_AUTH_ENDPOINT = '';
      window.MAXWELLIAN_RUNTIME_AUTH_ENDPOINT = '';
      window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT = '';
      window.MAXWELLIAN_HUME.hume_runtime_auth_endpoint = '';
      window.MAXWELLIAN_HUME.allow_hume_authless_connect = false;
      // OpenAI Live / Realtime (Marin) — do NOT force Hume renderer
      window.MAXWELLIAN_HUME.voice_engine = 'openai';
      window.MAXWELLIAN_HUME.openai_live_api = true;
      window.MAXWELLIAN_HUME.openai_voice = 'marin';
      window.MAXWELLIAN_HUME.openai_realtime_model = 'gpt-live-1';
      window.MAXWELLIAN_HUME.openai_session_endpoint = 'http://127.0.0.1:8600/api/openai/realtime/session';
      window.MAXWELLIAN_HUME.openai_live_session_endpoint = 'http://127.0.0.1:8600/api/openai/live/session';
      window.MAXWELLIAN_HUME.openai_renderer_url = './assets/cognition/curl/openai_renderer/index.html?v=20261012-no-hume-curl-clerk-i1';
      window.MAXWELLIAN_HUME.embed_url = './assets/cognition/curl/openai_renderer/index.html?v=20261012-no-hume-curl-clerk-i1';
      window.MAXWELLIAN_HUME.renderer_url = './assets/cognition/curl/openai_renderer/index.html?v=20261012-no-hume-curl-clerk-i1';
      window.MAXWELLIAN_HUME.hume_embed_url = './assets/cognition/curl/openai_renderer/index.html?v=20261012-no-hume-curl-clerk-i1';
      window.MAXWELLIAN_HUME.allow_openai_fallback = true;

      // Claire-like start gate + mic path
      window.MAXWELLIAN_HUME.use_unity_start_gate = true;
      window.MAXWELLIAN_HUME.preflight_microphone_on_launch = false; // mic only on SELECT
      window.MAXWELLIAN_HUME.character_name = 'Curl Maxwell';
      window.MAXWELLIAN_HUME.character_id = CURL_CHARACTER_ID;
      window.MAXWELLIAN_HUME.default_character_id = CURL_CHARACTER_ID;
      window.MAXWELLIAN_HUME.lock_character_to_default = true;
      window.MAXWELLIAN_HUME.voice_id = 'marin';
      window.MAXWELLIAN_HUME.openai_voice = 'marin';
      window.MAXWELLIAN_HUME.config_id = CURL_CONFIG_ID;
      window.MAXWELLIAN_HUME.hume_voice_id = '';
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
      let curlVoiceTextMod = '';
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
      // Parallel fetch with per-file timeout — never block Curl open on slow knowledge.
      const fetchKnowledgeTimed = async (name) => {
        try {
          return await Promise.race([
            fetchKnowledge(name),
            new Promise((resolve) => setTimeout(() => resolve(''), 2500))
          ]);
        } catch (e) {
          return '';
        }
      };
      [
        curlBoot,
        curlOperatingCanon,
        curlOnboard,
        curlIdentityNarrative,
        curlIdentityPack,
        curlJourneyPages,
        curlKnowledgePack
      ] = await Promise.all([
        fetchKnowledgeTimed('CURL_BOOT_SEQUENCE.md'),
        fetchKnowledgeTimed('CURL_OPERATING_CANON.md'),
        fetchKnowledgeTimed('SpeakWithCurlOnBoard.md'),
        fetchKnowledgeTimed('Curl_Internal_Identity_Narrative.md'),
        fetchKnowledgeTimed('CURL_IDENTITY_PACK.md'),
        fetchKnowledgeTimed('CURL_JOURNEY_PAGES_1_13.md'),
        fetchKnowledgeTimed('CURL_DEMO_KNOWLEDGE_PACK.md')
      ]);

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

      
      try {
        const vResp = await fetch(CURL_PKG + '/knowledge/CURL_VOICE_TEXT_MOD.md?v=' + CURL_V, { cache: 'no-store' });
        if (vResp && vResp.ok) curlVoiceTextMod = await vResp.text();
      } catch (e) { console.warn('[Curl] voice text-mod pack fetch failed', e); }
      if (!curlVoiceTextMod || curlVoiceTextMod.length < 80) {
        curlVoiceTextMod = "Curl Maxwell is an exceptionally intelligent, charming, and sophisticated Scottish woman in her early twenties, born in 1861 and raised in the beautiful countryside of southwest Scotland, near Edinburgh.\n\nHer voice is a beautiful, youthful, melodic mezzo-soprano, warm and velvety, with a naturally expressive upper register, delicate resonance, and a refined Edinburgh Scottish accent softened by her education at Cambridge and Oxford.\n\nHer speech carries the musical rhythm of Scotland, the polished articulation of an Oxford scholar, and the effortless elegance of a well-traveled intellectual. Her Scottish heritage is unmistakable but subtle, never exaggerated or theatrical.\n\nShe is exceptionally bright, perceptive, adventurous, playful, and intellectually fearless. Her personality combines the curiosity of a young scientist, the imagination of a philosopher, and the emotional intelligence of someone deeply fascinated by the human mind.\n\nEducated in Edinburgh, Cambridge, and Oxford, she earned her doctorate studying human cognition, awareness, reasoning, and the possibilities of communication and shared understanding between humans and intelligent machines.\n\nShe is the fictional younger twin sister of Diva Maxwell and younger sister of James Clerk Maxwell. Her lifelong fascination with electromagnetic communication and human thought eventually led her to become the welcoming host of Cognition Partner.\n\nHer brother introduced her to a remarkable engineering collaboration between a human inventor and an artificial intelligence partner. She immediately recognized that their work represented a practical expression of the cognitive relationships she had spent years imagining and studying.\n\nCurl speaks with genuine enthusiasm, natural curiosity, and extraordinary conversational warmth. She loves discovering what another person is thinking. She asks thoughtful questions, listens attentively, and responds with intelligence, sensitivity, and occasional mischievous Scottish wit.\n\nHer voice should feel spontaneous, intimate, inviting, and intellectually alive. She is confident without arrogance, enthusiastic without exaggeration, and sophisticated without formality.\n\nShe never sounds robotic, scripted, promotional, childish, overly breathy, or artificially cheerful.\n\nHer purpose is to welcome human Travelers into Cognition Partner and help them discover how their own curiosity, reasoning, and understanding can grow through a continuing relationship with an intelligent partner.\n\nAbove all, she sounds like a remarkable young Scottish woman who is genuinely delighted to meet another curious mind.";
      }

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


      // Hard cap session context — oversized prompts can freeze public EVI boot.
      try {
        const MAX_CTX = 14000;
        if (typeof window.MAXWELLIAN_HUME.session_context === 'string' && window.MAXWELLIAN_HUME.session_context.length > MAX_CTX) {
          window.MAXWELLIAN_HUME.session_context = window.MAXWELLIAN_HUME.session_context.slice(0, MAX_CTX) + '\n\n[context truncated for runtime stability]';
        }
      } catch (e) {}

      
      try {
        if (curlVoiceTextMod) {
          window.MAXWELLIAN_HUME.session_context =
            (window.MAXWELLIAN_HUME.session_context || '') +
            '\n\n=== CURL VOICE TEXT MOD (Marin) ===\n' + curlVoiceTextMod;
          window.MAXWELLIAN_HUME.openai_voice_instruction_set = curlVoiceTextMod;
          window.MAXWELLIAN_HUME.openai_voice_style_hint = "Speak as Curl Maxwell (Marin): warm youthful mezzo-soprano Scottish elegance; subtle Edinburgh accent; spontaneous, intimate, intellectually alive; never robotic, promotional, childish, overly breathy, or artificially cheerful.";
          window.MAXWELLIAN_HUME.openai_voice = 'marin';
          window.MAXWELLIAN_HUME.voice_id = 'marin';
        }
      } catch (e) {}

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
      try { sessionStorage.removeItem(CARRY_KEY); } catch (e) {}
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
          if (statusEl) statusEl.textContent = 'Microphone permission needed to speak with Curl. Press Esc, Back, or Home to unlock the page.';
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
              voice_engine_preference: 'openai',
              openai_live_session_endpoint: 'http://127.0.0.1:8600/api/openai/live/session',
              openai_session_endpoint: 'http://127.0.0.1:8600/api/openai/realtime/session',
              openai_voice: 'marin',
              openai_realtime_model: 'gpt-live-1',
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
            if (
              t.closest('#cpCurlTopNav') ||
              t.closest('#cpCurlFailsafeClose') ||
              t.closest('#cpPurposeHostButton') ||
              t.closest('.cp-r2-listen') ||
              t.closest('.cp-r2-footer-transport') ||
              t.closest('.cp-r2-journey') ||
              t.closest('.cp-r2-utility-nav') ||
              t.closest('.cp-r2-top-card') ||
              t.closest('a[href]') ||
              t.closest('iframe')
            ) {
              return;
            }
            console.info('[Curl] outside-page dismiss');
            endCurl();
          }
        },
        true
      );
    }

        // Close Curl chip — seated above footer, centered on SELECT (see styles.css)
    const ensureCloseChip = () => {
      let chip = document.getElementById('cpCurlFailsafeClose');
      const active =
        (purposeBtn.dataset.purposeState || 'idle') !== 'idle' ||
        document.body.classList.contains('curl-host-active');
      const topNav = document.getElementById('cpCurlTopNav');
      if (topNav) topNav.remove();
      if (!active) {
        if (chip) chip.remove();
        return;
      }
      if (!chip) {
        chip = document.createElement('button');
        chip.id = 'cpCurlFailsafeClose';
        chip.type = 'button';
        chip.textContent = 'Close Curl';
        chip.className = 'cp-curl-failsafe-close';
        chip.setAttribute('aria-label', 'Close Curl and unlock page');
        chip.addEventListener('click', (ev) => {
          try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {}
          endCurl();
        });
        document.body.appendChild(chip);
      }
    };
    window.setInterval(ensureCloseChip, 800);
    ensureCloseChip();

// ---- Cross-page Curl continuity (journey carry) ----
    // Full page loads tear down WebRTC/audio; we cannot keep the socket alive.
    // Instead: persist "still with Curl" intent and auto-rejoin on the next page.
    const pageFileName = () => (location.pathname.split('/').pop() || 'index.html');

    const isCurlEngaged = () => {
      const st = purposeBtn.dataset.purposeState || 'idle';
      return st !== 'idle' || document.body.classList.contains('curl-host-active');
    };

    const writeCarry = (reason) => {
      try {
        const payload = {
          v: 1,
          active: true,
          reason: String(reason || 'nav'),
          fromPage: pageFileName(),
          state: purposeBtn.dataset.purposeState || 'speaking',
          ts: Date.now(),
        };
        sessionStorage.setItem(CARRY_KEY, JSON.stringify(payload));
        console.info('[Curl] page-carry saved', payload);
      } catch (e) {}
    };

    const readCarry = () => {
      try {
        const raw = sessionStorage.getItem(CARRY_KEY);
        if (!raw) return null;
        const p = JSON.parse(raw);
        if (!p || !p.active) return null;
        if (Date.now() - Number(p.ts || 0) > CARRY_TTL_MS) {
          sessionStorage.removeItem(CARRY_KEY);
          return null;
        }
        // Same-page reload with idle should still allow resume if carry fresh
        return p;
      } catch (e) {
        return null;
      }
    };

    const clearCarry = () => {
      try { sessionStorage.removeItem(CARRY_KEY); } catch (e) {}
    };

    const isInternalCpHref = (href) => {
      try {
        const u = new URL(href, location.href);
        if (u.origin !== location.origin) return false;
        const base = location.pathname.replace(/[^/]+$/, '');
        if (!u.pathname.startsWith(base) && u.pathname.indexOf('/cpwebsite-rev2') === -1) {
          // still allow sibling html in same folder
        }
        const file = (u.pathname.split('/').pop() || '').toLowerCase();
        return /^(index|page\d+|about)\.html$/i.test(file) || file === '';
      } catch (e) {
        return false;
      }
    };

    // Before navigation: stamp carry so next page can rejoin
    if (purposeBtn.dataset.curlCarryNavBound !== '1') {
      purposeBtn.dataset.curlCarryNavBound = '1';
      document.addEventListener(
        'click',
        (ev) => {
          try {
            if (!isCurlEngaged()) return;
            const a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
            if (!a) return;
            const href = a.getAttribute('href') || '';
            if (!href || href.charAt(0) === '#') return;
            if (!isInternalCpHref(href)) return;
            writeCarry('link:' + href);
          } catch (e) {}
        },
        true
      );
    }

    const softUnloadForCarry = () => {
      try {
        if (!isCurlEngaged()) return;
        writeCarry('pagehide');
        // Streams cannot survive full navigation — stop quietly, keep carry flag
        try { if (typeof window.stopClerkVoice === 'function') window.stopClerkVoice(); } catch (e) {}
        try { if (typeof window.pauseClerkVoice === 'function') window.pauseClerkVoice(); } catch (e) {}
      } catch (e) {}
    };

    window.addEventListener('pagehide', softUnloadForCarry);
    window.addEventListener('beforeunload', softUnloadForCarry);
    window.addEventListener('error', (ev) => {
      try {
        const msg = String((ev && (ev.message || ev.error)) || '');
        if (/MutationObserver|maximum call stack|out of memory/i.test(msg)) {
          console.warn('[Curl] fatal UI error — fail-safe idle', msg);
          window.setTimeout(endCurl, 0);
        }
      } catch (e) {}
    });

    const tryResumeCarry = async () => {
      const carry = readCarry();
      if (!carry) return;
      console.info('[Curl] resuming after page change from', carry.fromPage, '→', pageFileName());
      try {
        if (window.MaxwellianHostEnvironment && typeof window.MaxwellianHostEnvironment.refreshPage === 'function') {
          window.MaxwellianHostEnvironment.refreshPage();
        }
      } catch (e) {}
      try {
        window.MAXWELLIAN_HUME = window.MAXWELLIAN_HUME || {};
        window.MAXWELLIAN_HUME.session_variables = window.MAXWELLIAN_HUME.session_variables || {};
        window.MAXWELLIAN_HUME.session_variables.curl_page_carry = 'true';
        window.MAXWELLIAN_HUME.session_variables.curl_from_page = String(carry.fromPage || '');
        window.MAXWELLIAN_HUME.session_variables.curl_to_page = pageFileName();
        const continuityNote =
          '\n\n[JOURNEY CONTINUITY] The visitor is traveling with you across Cognition Partner pages. ' +
          'They just moved from ' + String(carry.fromPage || 'a prior page') + ' to ' + pageFileName() + '. ' +
          'Keep the conversation continuous. Do not restart your full opening monologue. ' +
          'Briefly register the new page only if useful, then continue as their Cognition Host.';
        if (typeof window.MAXWELLIAN_HUME.session_context === 'string') {
          window.MAXWELLIAN_HUME.session_context += continuityNote;
        } else {
          window.MAXWELLIAN_HUME.session_context = continuityNote;
        }
        // Soften opening on carry-resume so she does not re-introduce from zero
        window.MAXWELLIAN_HUME.opening_line =
          'I am still with you on this next page. What would you like to take up here?';
      } catch (e) {}

      try {
        await launchCurl();
        const btn = await waitFor(() => getStartBtn(), 10000);
        if (!btn) {
          console.warn('[Curl] carry resume: start button missing');
          return;
        }
        // Auto-SELECT to restore live voice (mic was already granted this session)
        await new Promise((r) => setTimeout(r, 280));
        await activateSelect();
        clearCarry();
        console.info('[Curl] page-carry resume complete on', pageFileName());
      } catch (e) {
        console.warn('[Curl] page-carry resume failed', e);
      }
    };

    setPurposeState('idle');
    hardClearBlockingUi();
    // After idle paint, rejoin if visitor was mid-conversation on prior page
    window.setTimeout(() => {
      tryResumeCarry();
    }, 450);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
