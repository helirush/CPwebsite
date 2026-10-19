(function () {
  const EXPANDED_WIDTH = 188;
  const EXPANDED_HEIGHT = 188;
  const COLLAPSED_WIDTH = 188;
  const COLLAPSED_HEIGHT = 188;
  const SHOW_STATUS = new URLSearchParams(window.location.search).get("debug_status") === "1";
  const ASSISTANT_ACTIVITY_DEFAULT_HOLD_MS = 1800;
  const ASSISTANT_ACTIVITY_RELEASE_MS = 520;
  const ASSISTANT_INTERRUPT_MIN_WORDS = 2;
  const ASSISTANT_INTERRUPT_MIN_CHARS = 8;
  const ASSISTANT_INTERRUPT_FILLER_PATTERN = /^(uh|um|hmm|mm+|ah+|oh+|er+|huh|uh-huh|mhm)$/i;
  const DEFAULT_MODEL = "gpt-live-1";
  const DEFAULT_VOICE = "marin";
  const DEFAULT_SESSION_ENDPOINT = "/api/openai/realtime/session";
  const DEFAULT_LIVE_SESSION_ENDPOINT = "/api/openai/live/session";
  const DEFAULT_CENTER_VISUAL = "/UnityEnergy/assets/images/Clerk-LineARTr2.png";
  const DEFAULT_DELAYED_FOLLOWUP_SECONDS = 10;
  const DELAYED_FOLLOWUP_RETRY_MS = 1200;
  const state = {
    config: null,
    launchSession: null,
    peerConnection: null,
    dataChannel: null,
    mediaStream: null,
    remoteAudio: null,
    connected: false,
    connecting: false,
    assistantSpeaking: false,
    assistantSpeechStartedAt: 0,
    remoteAudioPlaying: false,
    activeResponseAudio: new Set(),
    transcriptBuffers: new Map(),
    outputTextBuffers: new Map(),
    hasSentInitialGreeting: false,
    hasSentDelayedFollowup: false,
    hasReceivedUserInput: false,
    listeningForUser: false,
  };

  const orbEl = document.getElementById("orb");
  const orbFaceEl = document.getElementById("orbFace");
  const voiceActivityEl = document.getElementById("voiceActivity");
  const statusEl = document.getElementById("status");
  let assistantActivityTimer = null;
  let delayedFollowupTimer = null;
  const transparentVisualCache = new Map();

  function coerceText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function hasObjectKeys(value) {
    return Boolean(value && typeof value === "object" && Object.keys(value).length > 0);
  }

  function setStatus(message, isError) {
    if (!statusEl) return;
    const text = coerceText(message) || "Ready";
    statusEl.textContent = text;
    statusEl.classList.toggle("visible", SHOW_STATUS || Boolean(isError));
    statusEl.style.borderColor = isError
      ? "rgba(220, 120, 120, 0.5)"
      : "rgba(190, 220, 120, 0.35)";
  }

  function setOrbActive(active) {
    if (!orbEl) return;
    orbEl.classList.toggle("idle", !active);
  }

  function syncVoiceActivity() {
    if (!voiceActivityEl) return;
    const speaking = Boolean(state.assistantSpeaking);
    const listening = Boolean(state.listeningForUser) && !speaking;
    voiceActivityEl.classList.toggle("active", speaking);
    voiceActivityEl.classList.toggle("listening", listening);
    voiceActivityEl.setAttribute(
      "aria-label",
      speaking ? "Clerk speaking" : listening ? "Clerk listening" : "Clerk idle"
    );
  }

  function clearAssistantActivityTimer() {
    if (!assistantActivityTimer) return;
    window.clearTimeout(assistantActivityTimer);
    assistantActivityTimer = null;
  }
  function clearDelayedFollowupTimer() {
    if (!delayedFollowupTimer) return;
    window.clearTimeout(delayedFollowupTimer);
    delayedFollowupTimer = null;
  }

  function markAssistantActivity(holdMs) {
    state.assistantSpeaking = true;
    state.listeningForUser = false;
    syncVoiceActivity();
    clearAssistantActivityTimer();
    const holdDuration = Number.isFinite(holdMs)
      ? Math.max(300, Math.floor(holdMs))
      : ASSISTANT_ACTIVITY_DEFAULT_HOLD_MS;
    assistantActivityTimer = window.setTimeout(function () {
      if (state.activeResponseAudio.size > 0 || state.remoteAudioPlaying) {
        markAssistantActivity(holdDuration);
        return;
      }
      state.assistantSpeaking = false;
      state.listeningForUser = state.connected;
      syncVoiceActivity();
    }, holdDuration);
  }

  function getLaunchContextTokens(config, launchSession) {
    const cfg = config && typeof config === "object" ? config : {};
    const session = launchSession && typeof launchSession === "object" ? launchSession : {};
    const contextPayload =
      session.contextPayload && typeof session.contextPayload === "object"
        ? session.contextPayload
        : {};
    const query = new URLSearchParams(window.location.search || "");
    return [
      coerceText(contextPayload.source_page),
      coerceText(contextPayload.context_source),
      coerceText(contextPayload.context),
      coerceText(contextPayload.entry_point),
      coerceText(session.contextSource),
      coerceText(session.legacyContext),
      coerceText(query.get("source_page")),
      coerceText(query.get("context_source")),
      coerceText(query.get("context")),
      coerceText(query.get("entry_point")),
      coerceText(contextPayload.clerk_visual_theme),
      coerceText(cfg.clerk_visual_theme),
    ]
      .map(function (token) {
        return token.toLowerCase();
      })
      .filter(Boolean);
  }

  function isContactPageContext(config, launchSession) {
    const tokens = getLaunchContextTokens(config, launchSession);
    if (tokens.length === 0) return false;
    return tokens.some(function (token) {
      return /(^|[^a-z])contact(?:-|_)?us([^a-z]|$)/i.test(token) || token === "contact";
    });
  }

  function syncContactVisualMode(config, launchSession) {
    const contactMode = isContactPageContext(config, launchSession);
    if (typeof document !== "undefined" && document.body) {
      document.body.classList.toggle("contact-mode", contactMode);
    }
  }

  function normalizeInterruptTranscript(text) {
    return coerceText(text)
      .toLowerCase()
      .replace(/[^a-z0-9'\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isIntentionalInterruptTranscript(text) {
    const normalized = normalizeInterruptTranscript(text);
    if (!normalized) return false;
    if (normalized.length < ASSISTANT_INTERRUPT_MIN_CHARS) return false;
    if (ASSISTANT_INTERRUPT_FILLER_PATTERN.test(normalized)) return false;
    const words = normalized.split(" ").filter(Boolean);
    return words.length >= ASSISTANT_INTERRUPT_MIN_WORDS;
  }

  function maybeCancelAssistantForTranscript(transcriptText) {
    if (!(state.activeResponseAudio.size > 0 || state.remoteAudioPlaying)) return false;
    if (!state.dataChannel || state.dataChannel.readyState !== "open") return false;
    if (!isIntentionalInterruptTranscript(transcriptText)) return false;
    try {
      if (!isLiveApi(state.config)) {
        state.dataChannel.send(JSON.stringify({ type: "response.cancel" }));
      }
      return true;
    } catch (_err) {
      return false;
    }
  }

  function resolveCenterVisual(config, launchSession) {
    const cfg = config && typeof config === "object" ? config : {};
    const session = launchSession && typeof launchSession === "object" ? launchSession : {};
    const contextPayload =
      session.contextPayload && typeof session.contextPayload === "object"
        ? session.contextPayload
        : {};
    if (!hasObjectKeys(cfg) && !hasObjectKeys(contextPayload)) {
      return "";
    }
    return coerceText(
      contextPayload.openai_center_visual_url ||
      cfg.openai_center_visual_url ||
      contextPayload.character_avatar_url ||
      cfg.character_avatar_url ||
      DEFAULT_CENTER_VISUAL
    );
  }

  function shouldAlphaKeyLineArt(url) {
    const normalized = coerceText(url).toLowerCase();
    return normalized.includes("clerk-lineartr2.png");
  }

  function buildAlphaKeyedLineArtSource(url, onReady) {
    const sourceUrl = coerceText(url);
    if (!sourceUrl || typeof onReady !== "function") return;
    if (!shouldAlphaKeyLineArt(sourceUrl)) {
      onReady(sourceUrl);
      return;
    }
    if (transparentVisualCache.has(sourceUrl)) {
      onReady(transparentVisualCache.get(sourceUrl));
      return;
    }
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = function () {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth || image.width || 0;
        canvas.height = image.naturalHeight || image.height || 0;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx || canvas.width < 2 || canvas.height < 2) {
          onReady(sourceUrl);
          return;
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const luminance = (r + g + b) / 3;
          const chroma = Math.max(r, g, b) - Math.min(r, g, b);
          if (luminance > 214 && chroma < 24) {
            if (luminance >= 238) {
              pixels[i + 3] = 0;
              continue;
            }
            const fade = (luminance - 214) / 24;
            const alpha = Math.max(0, Math.floor(255 * (1 - fade * 1.7)));
            if (alpha < pixels[i + 3]) {
              pixels[i + 3] = alpha;
            }
          }
        }
        ctx.putImageData(imageData, 0, 0);
        const keyedSource = canvas.toDataURL("image/png");
        transparentVisualCache.set(sourceUrl, keyedSource);
        onReady(keyedSource);
      } catch (_err) {
        onReady(sourceUrl);
      }
    };
    image.onerror = function () {
      onReady(sourceUrl);
    };
    image.src = sourceUrl;
  }

  function applyCenterVisual(config, launchSession) {
    if (!orbEl || !orbFaceEl) return;
    const candidate = resolveCenterVisual(config, launchSession);
    if (!candidate) {
      orbEl.classList.remove("has-face");
      try {
        orbFaceEl.removeAttribute("src");
      } catch (_err) {}
      return;
    }
    let resolved = candidate;
    try {
      resolved = new URL(candidate, window.location.href).toString();
    } catch (_err) {}
    buildAlphaKeyedLineArtSource(resolved, function (finalSource) {
      if (orbFaceEl.dataset.srcResolved === resolved && orbEl.classList.contains("has-face")) {
        return;
      }
      orbEl.classList.remove("has-face");
      orbFaceEl.dataset.srcResolved = resolved;
      orbFaceEl.onload = function () {
        orbEl.classList.add("has-face");
      };
      orbFaceEl.onerror = function () {
        orbEl.classList.remove("has-face");
      };
      orbFaceEl.src = finalSource || resolved;
    });
  }

  function postToParent(type, payload) {
    if (!window.parent) return;
    window.parent.postMessage({ type: type, payload: payload }, "*");
  }

  function sanitizeVoiceErrorMessage(rawMessage) {
    let message = coerceText(rawMessage);
    if (!message) return "Unknown OpenAI live voice error.";
    if (/Unsupported method|Error code:\s*501|do not support this operation/i.test(message)) {
      return (
        "Voice API server is not running (HTTP 501 on POST). " +
        "Run: python3 openai_realtime_server.py --port 8600 from UnityEnergy, " +
        "then use http://127.0.0.1:8600/UnityEnergy/contact-us.html"
      );
    }
    if (message.indexOf("<html") >= 0 || message.indexOf("<!DOCTYPE") >= 0) {
      return "Voice session endpoint returned an HTML error page. Start openai_realtime_server.py on port 8600.";
    }
    return message;
  }

  function postError(errorLike) {
    const message = sanitizeVoiceErrorMessage(
      coerceText(errorLike && errorLike.message) ||
        coerceText(typeof errorLike === "string" ? errorLike : "") ||
        "Unknown OpenAI live voice error."
    );
    postToParent("error", { message: message, source: "openai-live-renderer" });
    setStatus(message, true);
  }

  function emitCollapsedFrame() {
    postToParent("resize_frame", {
      width: COLLAPSED_WIDTH,
      height: COLLAPSED_HEIGHT,
    });
    postToParent("collapse_widget");
  }

  function emitExpandedFrame() {
    postToParent("resize_frame", {
      width: EXPANDED_WIDTH,
      height: EXPANDED_HEIGHT,
    });
    postToParent("expand_widget");
  }

  function normalizeTurnDetection(rawConfig) {
    const source = rawConfig && typeof rawConfig === "object" ? rawConfig : {};
    const vadType = coerceText(source.type);
    const threshold = Number(source.threshold);
    const prefixPaddingMs = Number(source.prefix_padding_ms || source.prefixPaddingMs);
    const silenceDurationMs = Number(source.silence_duration_ms || source.silenceDurationMs);
    const result = {
      type: "server_vad",
      create_response: true,
      interrupt_response: true,
    };
    if (vadType) {
      result.type = vadType;
    }
    if (Number.isFinite(threshold)) {
      result.threshold = Math.max(0, Math.min(1, threshold));
    }
    if (Number.isFinite(prefixPaddingMs)) {
      result.prefix_padding_ms = Math.max(0, Math.floor(prefixPaddingMs));
    }
    if (Number.isFinite(silenceDurationMs)) {
      result.silence_duration_ms = Math.max(50, Math.floor(silenceDurationMs));
    }
    if (typeof source.create_response === "boolean") {
      result.create_response = source.create_response;
    }
    if (typeof source.interrupt_response === "boolean") {
      result.interrupt_response = source.interrupt_response;
    }
    return result;
  }

  function resolveModel(config) {
    const candidate = coerceText(
      config && (
        config.model ||
        config.openai_model ||
        config.openai_realtime_model
      )
    );
    return candidate || DEFAULT_MODEL;
  }

  function resolveVoice(config) {
    const looksLikeUuid = function (value) {
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(coerceText(value));
    };
    const preferred = [
      config && config.openai_voice,
      config && config.voice,
      config && config.voice_id,
    ];
    for (let i = 0; i < preferred.length; i += 1) {
      const candidate = coerceText(preferred[i]);
      if (!candidate) continue;
      if (looksLikeUuid(candidate)) continue; // Hume IDs are not OpenAI voice names
      return candidate;
    }
    return DEFAULT_VOICE;
  }

  function resolveSessionEndpoint(config) {
    const candidate = coerceText(
      config && (
        config.sessionEndpoint ||
        config.openai_session_endpoint ||
        config.openai_session_url
      )
    );
    return candidate || DEFAULT_SESSION_ENDPOINT;
  }

  function buildSessionEndpointCandidates(endpoint) {
    const primary = coerceText(endpoint) || DEFAULT_SESSION_ENDPOINT;
    const candidates = [];
    const pushCandidate = function (value) {
      const normalized = coerceText(value);
      if (!normalized) return;
      if (candidates.includes(normalized)) return;
      candidates.push(normalized);
    };
    const locationHost = coerceText(window.location && window.location.hostname).toLowerCase();
    const locationPort = coerceText(window.location && window.location.port);
    const locationProtocol = coerceText(window.location && window.location.protocol) || "http:";
    const isLocalHost =
      locationHost === "127.0.0.1" ||
      locationHost === "localhost" ||
      locationHost === "0.0.0.0" ||
      locationHost.endsWith(".local");
    const onVoicePort = locationPort === "8600";
    // Local CP pages are often served by plain http.server (:8001) which 501s POST.
    // Prefer the OpenAI Live/Realtime process on :8600 FIRST.
    if (isLocalHost && !onVoicePort) {
      if (primary.startsWith("/")) {
        pushCandidate(`http://127.0.0.1:8600${primary}`);
        pushCandidate(`http://localhost:8600${primary}`);
        if (locationHost && locationHost !== "127.0.0.1" && locationHost !== "localhost") {
          pushCandidate(`${locationProtocol}//${locationHost}:8600${primary}`);
        }
      } else if (/\/api\/openai\//.test(primary) && primary.indexOf(":8600") === -1) {
        // absolute but wrong origin — still try 8600 path
        try {
          const u = new URL(primary, window.location.href);
          pushCandidate(`http://127.0.0.1:8600${u.pathname}`);
          pushCandidate(`http://localhost:8600${u.pathname}`);
        } catch (_e) {}
      }
    }
    pushCandidate(primary);
    if (primary.startsWith("/") && isLocalHost) {
      pushCandidate(`http://127.0.0.1:8600${primary}`);
      pushCandidate(`http://localhost:8600${primary}`);
    }
    return candidates;
  }
  function appendInstructionBlock(blocks, value) {
    const text = coerceText(value);
    if (!text) return;
    if (blocks.includes(text)) return;
    blocks.push(text);
  }

  function buildInstructionText(config, launchSession) {
    const cfg = config && typeof config === "object" ? config : {};
    const session = launchSession && typeof launchSession === "object" ? launchSession : {};
    const contextPayload =
      session.contextPayload && typeof session.contextPayload === "object"
        ? session.contextPayload
        : {};
    const voiceInstructionSet =
      coerceText(contextPayload.openai_voice_instruction_set) ||
      coerceText(cfg.openai_voice_instruction_set);
    const voiceStyleHint =
      coerceText(contextPayload.openai_voice_style_hint) ||
      coerceText(cfg.openai_voice_style_hint) ||
      coerceText(cfg.voice_style_hint);
    const systemPromptBlock =
      coerceText(contextPayload.system_prompt_text) ||
      coerceText(cfg.system_prompt_text) ||
      coerceText(cfg.systemPrompt) ||
      coerceText(cfg.instructions);
    const sessionContextBlock = coerceText(contextPayload.session_context);
    const blocks = [];
    appendInstructionBlock(blocks, systemPromptBlock);
    appendInstructionBlock(blocks, sessionContextBlock);
    if (!sessionContextBlock) {
      appendInstructionBlock(blocks, coerceText(contextPayload.response_precedence_guidance));
      appendInstructionBlock(blocks, coerceText(contextPayload.knowledge_reference_spine));
      appendInstructionBlock(blocks, coerceText(contextPayload.voltage_unit_speech_rule));
      appendInstructionBlock(blocks, coerceText(contextPayload.response_style_hint));
      appendInstructionBlock(blocks, coerceText(contextPayload.engagement_protocol));
      appendInstructionBlock(blocks, coerceText(contextPayload.maxwellian_knowledge_seed));
    }
    appendInstructionBlock(
      blocks,
      coerceText(contextPayload.likely_user_intent)
        ? `Likely user intent: ${coerceText(contextPayload.likely_user_intent)}`
        : ""
    );
    appendInstructionBlock(
      blocks,
      coerceText(contextPayload.source_page)
        ? `Current page context: ${coerceText(contextPayload.source_page)}`
        : ""
    );
    appendInstructionBlock(
      blocks,
      coerceText(contextPayload.context)
        ? `Conversation context source: ${coerceText(contextPayload.context)}`
        : ""
    );
    appendInstructionBlock(blocks, voiceInstructionSet ? `Voice instruction set: ${voiceInstructionSet}` : "");
    appendInstructionBlock(blocks, voiceStyleHint ? `Voice style guidance: ${voiceStyleHint}` : "");
    return blocks.join("\n\n");
  }

  function shouldAutoGreet(config) {
    if (!config || typeof config !== "object") return true;
    if (typeof config.openai_auto_greeting_enabled === "boolean") {
      return config.openai_auto_greeting_enabled;
    }
    return true;
  }
  function shouldSendDelayedFollowup(config) {
    if (!config || typeof config !== "object") return true;
    if (typeof config.openai_delayed_followup_enabled === "boolean") {
      return config.openai_delayed_followup_enabled;
    }
    return true;
  }
  function resolveDelayedFollowupDelaySeconds(config) {
    const rawSeconds = Number(
      config && (
        config.openai_delayed_followup_seconds ||
        config.delayed_followup_seconds
      )
    );
    if (!Number.isFinite(rawSeconds)) return DEFAULT_DELAYED_FOLLOWUP_SECONDS;
    return Math.max(4, Math.min(30, Math.floor(rawSeconds)));
  }
  function toTitleCaseWords(value) {
    const text = coerceText(value);
    if (!text) return "";
    return text
      .split(" ")
      .filter(Boolean)
      .map(function (word) {
        if (!word) return "";
        return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
      })
      .join(" ");
  }
  function resolvePageContextName(config, launchSession) {
    const cfg = config && typeof config === "object" ? config : {};
    const session = launchSession && typeof launchSession === "object" ? launchSession : {};
    const contextPayload =
      session.contextPayload && typeof session.contextPayload === "object"
        ? session.contextPayload
        : {};
    const rawPageContext = coerceText(
      contextPayload.page_context_title ||
      contextPayload.source_page ||
      contextPayload.context_source ||
      session.contextSource ||
      contextPayload.context
    )
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (rawPageContext) return toTitleCaseWords(rawPageContext);
    const contactMode = isContactPageContext(cfg, session);
    return contactMode ? "Contact Us" : "This Page";
  }
  function resolveWelcomeBoardName(config, launchSession) {
    const pageName = resolvePageContextName(config, launchSession);
    if (!pageName) return "Unity Energy";
    if (/unity energy/i.test(pageName)) return pageName;
    return `Unity Energy ${pageName}`;
  }

  function buildAutoGreetingInstructions(config, launchSession) {
    const cfg = config && typeof config === "object" ? config : {};
    const session = launchSession && typeof launchSession === "object" ? launchSession : {};
    const contextPayload =
      session.contextPayload && typeof session.contextPayload === "object"
        ? session.contextPayload
        : {};
    const configuredGreeting =
      coerceText(contextPayload.openai_auto_greeting_text) ||
      coerceText(cfg.openai_auto_greeting_text);
    const boardName = resolveWelcomeBoardName(cfg, session);
    const pageName = resolvePageContextName(cfg, session);
    const greetingLine =
      configuredGreeting ||
      `Hello, welcome to the ${boardName} website board.`;
    return `${greetingLine} In one calm sentence ask how the visitor is doing. In one calm sentence ask if there is anything you can help with on the ${pageName} page. Keep the tone respectful and polite. Do not start explaining mission, vision, products, or technical details unless the visitor asks first.`;
  }
  function buildDelayedFollowupInstructions(config, launchSession) {
    const cfg = config && typeof config === "object" ? config : {};
    const session = launchSession && typeof launchSession === "object" ? launchSession : {};
    const contextPayload =
      session.contextPayload && typeof session.contextPayload === "object"
        ? session.contextPayload
        : {};
    const followupText =
      coerceText(contextPayload.openai_delayed_followup_text) ||
      coerceText(cfg.openai_delayed_followup_text) ||
      "Do you mind if I share some things with you on this page?";
    const declineText =
      coerceText(contextPayload.openai_decline_followup_text) ||
      coerceText(cfg.openai_decline_followup_text) ||
      "May I ask your name, who you're with, and what brings you to the site today?";
    return `If the visitor has been silent, politely ask this in one short sentence: "${followupText}" If the visitor declines, respond respectfully and ask: "${declineText}" Then wait for the visitor response.`;
  }
  function scheduleDelayedFollowupIfNeeded(overrideDelayMs) {
    if (state.hasSentDelayedFollowup || state.hasReceivedUserInput) return;
    if (!state.dataChannel || state.dataChannel.readyState !== "open") return;
    if (!shouldSendDelayedFollowup(state.config)) return;
    clearDelayedFollowupTimer();
    const delayMs = Number.isFinite(overrideDelayMs)
      ? Math.max(500, Math.floor(overrideDelayMs))
      : resolveDelayedFollowupDelaySeconds(state.config) * 1000;
    delayedFollowupTimer = window.setTimeout(function () {
      delayedFollowupTimer = null;
      if (state.hasSentDelayedFollowup || state.hasReceivedUserInput) return;
      if (!state.dataChannel || state.dataChannel.readyState !== "open") return;
      if (state.activeResponseAudio.size > 0 || state.remoteAudioPlaying || state.assistantSpeaking) {
        scheduleDelayedFollowupIfNeeded(DELAYED_FOLLOWUP_RETRY_MS);
        return;
      }
      const instructions = buildDelayedFollowupInstructions(state.config, state.launchSession);
      if (!instructions) return;
      try {
        state.dataChannel.send(
          JSON.stringify({
            type: "response.create",
            response: {
              modalities: ["text", "audio"],
              instructions: instructions,
            },
          })
        );
        state.hasSentDelayedFollowup = true;
      } catch (_err) {}
    }, delayMs);
  }

  function sendAutoGreetingIfNeeded() {
    if (state.hasSentInitialGreeting) return;
    if (!state.dataChannel || state.dataChannel.readyState !== "open") return;
    if (!shouldAutoGreet(state.config)) return;
    const instructions = buildAutoGreetingInstructions(state.config, state.launchSession);
    if (!instructions) return;
    try {
      if (isLiveApi(state.config)) {
        // GPT-Live: ask the model to speak first via instructions append.
        state.dataChannel.send(
          JSON.stringify({
            type: "session.instructions.append",
            event_id: "clerk_greeting_1",
            delegation_id: null,
            content:
              "Speak first now. Greet the visitor briefly in character, then listen. " +
              instructions,
          })
        );
      } else {
        state.dataChannel.send(
          JSON.stringify({
            type: "response.create",
            response: {
              modalities: ["audio"],
              instructions: instructions,
            },
          })
        );
      }
      state.hasSentInitialGreeting = true;
      try { scheduleDelayedFollowupIfNeeded(); } catch (_e) {}
    } catch (_err) {}
  }


  async function createEphemeralSession(config, launchSession) {
    const endpoint = resolveSessionEndpoint(config);
    const model = resolveModel(config);
    const voice = resolveVoice(config);
    const endpointCandidates = buildSessionEndpointCandidates(endpoint);
    const temperature = Number(config && config.temperature);
    const requestBody = {
      model: model,
      voice: voice,
      modalities: ["text", "audio"],
      instructions: buildInstructionText(config, launchSession),
      turn_detection: normalizeTurnDetection(config && config.turnDetection),
      input_audio_transcription: { model: "gpt-4o-mini-transcribe" },
    };
    if (Number.isFinite(temperature)) {
      requestBody.temperature = Math.max(0, Math.min(2, temperature));
    }
    let lastErrorMessage = "";
    for (let index = 0; index < endpointCandidates.length; index += 1) {
      const candidateEndpoint = endpointCandidates[index];
      try {
        const response = await fetch(candidateEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const payload = await response.json().catch(function () { return {}; });
        if (response.ok) {
          return payload;
        }
        lastErrorMessage =
          coerceText(payload && payload.error && payload.error.message) ||
          `OpenAI session endpoint failed with status ${response.status}.`;
        if (response.status === 404 || response.status === 405) {
          continue;
        }
        throw new Error(lastErrorMessage);
      } catch (error) {
        lastErrorMessage =
          coerceText(error && error.message) ||
          lastErrorMessage ||
          "Failed to create OpenAI realtime session.";
      }
    }
    throw new Error(lastErrorMessage || "Failed to create OpenAI realtime session.");
  }

  function resolveConnectionToken(config, sessionPayload) {
    const payload = sessionPayload && typeof sessionPayload === "object" ? sessionPayload : {};
    const fromSession =
      coerceText(
        payload.client_secret &&
          typeof payload.client_secret === "object"
          ? payload.client_secret.value
          : payload.client_secret
      ) ||
      coerceText(payload.ephemeral_key);
    if (fromSession) return fromSession;

    const auth = config && config.auth && typeof config.auth === "object" ? config.auth : {};
    const fromConfig = coerceText(
      auth.value ||
      auth.accessToken ||
      auth.apiKey
    );
    if (fromConfig) return fromConfig;
    return "";
  }


  async function startRealtimeSession() {
    if (state.connecting || state.connected) return;
    if (!state.config || typeof state.config !== "object") return;
    if (!window.RTCPeerConnection) {
      postError("WebRTC is not available in this browser.");
      return;
    }

    state.connecting = true;
    state.hasSentInitialGreeting = false;
    state.hasSentDelayedFollowup = false;
    state.hasReceivedUserInput = false;
    state.assistantSpeaking = false;
    state.listeningForUser = false;
    state.assistantSpeechStartedAt = 0;
    state.remoteAudioPlaying = false;
    try { clearDelayedFollowupTimer(); } catch (_e) {}
    try { clearAssistantActivityTimer(); } catch (_e) {}
    try { syncVoiceActivity(); } catch (_e) {}
    setStatus("Connecting Clerk voice session…", false);
    setOrbActive(true);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.mediaStream = mediaStream;

      const peerConnection = new RTCPeerConnection();
      state.peerConnection = peerConnection;

      const remoteAudio = document.createElement("audio");
      remoteAudio.autoplay = true;
      remoteAudio.playsInline = true;
      state.remoteAudio = remoteAudio;
      remoteAudio.addEventListener("playing", function () {
        state.remoteAudioPlaying = true;
        markAssistantActivity(2200);
      });
      remoteAudio.addEventListener("pause", function () {
        state.remoteAudioPlaying = false;
        markAssistantActivity(800);
      });
      remoteAudio.addEventListener("ended", function () {
        state.remoteAudioPlaying = false;
        markAssistantActivity(800);
      });

      peerConnection.ontrack = function (event) {
        const stream =
          event.streams && event.streams[0]
            ? event.streams[0]
            : new MediaStream([event.track]);
        remoteAudio.srcObject = stream;
        remoteAudio.play().catch(function () {});
        postToParent("audio_output", { type: "remote_track" });
      };

      mediaStream.getTracks().forEach(function (track) {
        peerConnection.addTrack(track, mediaStream);
      });

      const dataChannel = peerConnection.createDataChannel("oai-events");
      state.dataChannel = dataChannel;
      dataChannel.addEventListener("open", function () {
        try { sendSessionUpdate(); } catch (_e) {}
        window.setTimeout(function () {
          try { sendAutoGreetingIfNeeded(); } catch (_e) {}
        }, 250);
        setStatus("Vesper Live connection ready.", false);
      });
      dataChannel.addEventListener("message", function (messageEvent) {
        let parsed = null;
        try {
          parsed = JSON.parse(messageEvent.data);
        } catch (_err) {
          return;
        }
        handleRealtimeEvent(parsed);
      });
      dataChannel.addEventListener("error", function (event) {
        postError(event && event.error ? event.error : "Live data channel error.");
      });

      const offer = await peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });
      await peerConnection.setLocalDescription(offer);

      await new Promise(function (resolve) {
        let settled = false;
        const finish = function () {
          if (settled) return;
          settled = true;
          resolve();
        };
        if (peerConnection.iceGatheringState === "complete") {
          finish();
          return;
        }
        peerConnection.addEventListener("icecandidate", function (event) {
          if (!event.candidate) finish();
        });
        peerConnection.addEventListener("icegatheringstatechange", function () {
          if (peerConnection.iceGatheringState === "complete") finish();
        });
        setTimeout(finish, 6000);
      });
      await new Promise(function (r) { setTimeout(r, 200); });

      const offerSdp =
        (peerConnection.localDescription && peerConnection.localDescription.sdp) || "";
      if (!coerceText(offerSdp) || offerSdp.length < 200 || offerSdp.indexOf("m=audio") < 0) {
        throw new Error(
          "WebRTC SDP offer incomplete (len=" + offerSdp.length + "). Allow microphone and retry."
        );
      }

      const liveEndpoint =
        coerceText(state.config.openai_live_session_endpoint) ||
        coerceText(state.config.live_session_endpoint) ||
        (typeof DEFAULT_LIVE_SESSION_ENDPOINT !== "undefined"
          ? DEFAULT_LIVE_SESSION_ENDPOINT
          : "/api/openai/live/session");
      const instructions = buildInstructionText(state.config, state.launchSession);
      const model = resolveModel(state.config) || "gpt-live-1";
      const voice = resolveVoice(state.config) || "vesper";
      // Same-origin relative /api/... fails with HTTP 501 under plain http.server (e.g. :8001).
      // Try 8600 candidates so voice works even if the page was opened on another local port.
      const liveEndpointCandidates = buildSessionEndpointCandidates(liveEndpoint);
      const liveBody = JSON.stringify({
        sdp: offerSdp,
        model: model,
        voice: voice,
        instructions: instructions,
      });
      let liveResponse = null;
      let liveText = "";
      let livePayload = null;
      let lastLiveError = null;
      for (let i = 0; i < liveEndpointCandidates.length; i += 1) {
        const endpointCandidate = liveEndpointCandidates[i];
        try {
          const response = await fetch(endpointCandidate, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: liveBody,
          });
          const responseText = await response.text();
          let parsed = null;
          try {
            parsed = JSON.parse(responseText);
          } catch (_e) {
            parsed = null;
          }
          const raw = coerceText(responseText);
          const looksLikeStaticServer =
            response.status === 501 ||
            /Unsupported method|Error code:\s*501|do not support this operation/i.test(raw) ||
            (response.status >= 400 && raw.indexOf("<html") >= 0 && !parsed);
          if (looksLikeStaticServer) {
            lastLiveError = {
              status: response.status,
              text: raw,
              endpoint: endpointCandidate,
              static: true,
            };
            continue;
          }
          liveResponse = response;
          liveText = responseText;
          livePayload = parsed;
          break;
        } catch (fetchErr) {
          lastLiveError = {
            status: 0,
            text: coerceText(fetchErr && fetchErr.message) || "fetch failed",
            endpoint: endpointCandidate,
            static: false,
          };
        }
      }
      if (!liveResponse) {
        const hint =
          "Voice API server is not running (got HTTP 501 on POST). " +
          "In Terminal run: cd ~/eestream/eWebmaster/UnityEnergy && python3 openai_realtime_server.py --port 8600 " +
          "then open http://127.0.0.1:8600/UnityEnergy/contact-us.html (not plain http.server).";
        if (lastLiveError && lastLiveError.static) {
          throw new Error(hint);
        }
        throw new Error(
          hint +
            (lastLiveError && lastLiveError.text
              ? " Last attempt: " + lastLiveError.text
              : "")
        );
      }
      if (!liveResponse.ok) {
        let msg =
          (livePayload && livePayload.error && (livePayload.error.message || livePayload.error)) ||
          "";
        const raw = coerceText(liveText);
        // python -m http.server returns HTML 501 for POST — wrong process.
        if (!msg && /Unsupported method|Error code: 501|do not support this operation/i.test(raw)) {
          msg =
            "Voice API server is not running (got HTTP 501 on POST). " +
            "In Terminal run: cd ~/eestream/eWebmaster/UnityEnergy && python3 openai_realtime_server.py --port 8600 " +
            "then open http://127.0.0.1:8600/UnityEnergy/contact-us.html (not plain http.server).";
        } else if (!msg && raw && raw.indexOf("<html") >= 0) {
          msg =
            "Live session endpoint returned HTML instead of JSON (HTTP " +
            liveResponse.status +
            "). Start openai_realtime_server.py on port 8600.";
        } else if (!msg) {
          msg = raw || ("Live session create failed (" + liveResponse.status + ").");
        }
        throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
      }
      const answerSdp =
        (livePayload && livePayload.transport && livePayload.transport.sdp) ||
        (livePayload && livePayload.sdp) ||
        "";
      if (!coerceText(answerSdp)) {
        throw new Error("Live session response missing SDP answer.");
      }
      await peerConnection.setRemoteDescription({ type: "answer", sdp: answerSdp });
      state.connected = true;
      state.connecting = false;
      state.listeningForUser = true;
      setOrbActive(true);
      setStatus("Vesper Live connected.", false);
      postToParent("session_started", {
        session_id:
          livePayload && livePayload.session && livePayload.session.id
            ? livePayload.session.id
            : "",
      });
      emitExpandedFrame();
    } catch (err) {
      state.connecting = false;
      state.connected = false;
      postError(err);
      try { closeRealtimeSession(); } catch (_e) {}
    }
  }

  function closeRealtimeSession() {
    if (state.dataChannel) {
      try {
        state.dataChannel.close();
      } catch (_err) {}
      state.dataChannel = null;
    }
    if (state.peerConnection) {
      try {
        state.peerConnection.close();
      } catch (_err) {}
      state.peerConnection = null;
    }
    if (state.mediaStream) {
      state.mediaStream.getTracks().forEach(function (track) {
        try {
          track.stop();
        } catch (_err) {}
      });
      state.mediaStream = null;
    }
    if (state.remoteAudio && state.remoteAudio.srcObject) {
      try {
        const tracks = state.remoteAudio.srcObject.getTracks();
        tracks.forEach(function (track) { track.stop(); });
      } catch (_err) {}
      state.remoteAudio.srcObject = null;
    }
    state.connected = false;
    state.connecting = false;
    state.assistantSpeaking = false;
    state.assistantSpeechStartedAt = 0;
    state.remoteAudioPlaying = false;
    state.activeResponseAudio.clear();
    state.transcriptBuffers.clear();
    state.outputTextBuffers.clear();
    state.hasSentInitialGreeting = false;
    state.hasSentDelayedFollowup = false;
    state.hasReceivedUserInput = false;
    state.listeningForUser = false;
    clearDelayedFollowupTimer();
    clearAssistantActivityTimer();
    setOrbActive(false);
    syncVoiceActivity();
    setStatus("Session closed.", false);
    emitCollapsedFrame();
  }

  function postTranscript(role, text) {
    const normalizedText = coerceText(text);
    if (!normalizedText) return;
    postToParent("transcript_message", { role: role, text: normalizedText });
  }

  function handleRealtimeEvent(event) {
    if (!event || typeof event !== "object") return;
    const type = coerceText(event.type);
    if (!type) return;

    if (type === "error") {
      const nestedError = event.error && typeof event.error === "object" ? event.error : {};
      const message =
        coerceText(event.message) ||
        coerceText(nestedError.message) ||
        coerceText(nestedError.type) ||
        "OpenAI realtime error event received.";
      postError(message);
      return;
    }

    if (type === "conversation.item.input_audio_transcription.completed") {
      state.hasReceivedUserInput = true;
      clearDelayedFollowupTimer();
      state.listeningForUser = state.connected;
      syncVoiceActivity();
      maybeCancelAssistantForTranscript(event.transcript);
      postTranscript("user", event.transcript);
      return;
    }

    if (type === "response.audio.delta") {
      const responseId = coerceText(event.response_id || event.item_id || "assistant");
      if (!state.activeResponseAudio.has(responseId)) {
        state.activeResponseAudio.add(responseId);
        state.assistantSpeechStartedAt = Date.now();
        postToParent("audio_output", { type: type, response_id: responseId });
      }
      markAssistantActivity(1700);
      return;
    }

    if (type === "response.audio.done" || type === "response.done") {
      const doneResponseId = coerceText(event.response_id || event.item_id);
      if (doneResponseId) {
        state.activeResponseAudio.delete(doneResponseId);
      } else if (type === "response.done") {
        state.activeResponseAudio.clear();
      }
      if (state.activeResponseAudio.size > 0 || state.remoteAudioPlaying) {
        markAssistantActivity(1400);
      } else {
        state.assistantSpeechStartedAt = 0;
        markAssistantActivity(ASSISTANT_ACTIVITY_RELEASE_MS);
      }
      return;
    }

    if (type === "response.audio_transcript.delta") {
      const key = coerceText(event.response_id || event.item_id || "assistant");
      const current = state.transcriptBuffers.get(key) || "";
      state.transcriptBuffers.set(key, `${current}${event.delta || ""}`);
      markAssistantActivity(1300);
      return;
    }

    if (type === "response.audio_transcript.done") {
      const key = coerceText(event.response_id || event.item_id || "assistant");
      const fromEvent = coerceText(event.transcript);
      const buffered = coerceText(state.transcriptBuffers.get(key));
      postTranscript("assistant", fromEvent || buffered);
      state.transcriptBuffers.delete(key);
      return;
    }

    if (type === "response.output_text.delta") {
      const key = coerceText(event.response_id || event.item_id || "assistant-text");
      const current = state.outputTextBuffers.get(key) || "";
      state.outputTextBuffers.set(key, `${current}${event.delta || ""}`);
      markAssistantActivity(1100);
      return;
    }

    if (type === "response.output_text.done") {
      const key = coerceText(event.response_id || event.item_id || "assistant-text");
      const fromEvent = coerceText(event.text);
      const buffered = coerceText(state.outputTextBuffers.get(key));
      postTranscript("assistant", fromEvent || buffered);
      state.outputTextBuffers.delete(key);
      return;
    }

    if (type === "input_audio_buffer.speech_started") {
      state.hasReceivedUserInput = true;
      clearDelayedFollowupTimer();
      state.listeningForUser = state.connected;
      syncVoiceActivity();
      return;
    }

    if (type === "input_audio_buffer.speech_stopped") {
      state.listeningForUser = state.connected;
      syncVoiceActivity();
      return;
    }
  }

  function isLiveApi(config) {
    const cfg = config && typeof config === "object" ? config : state.config || {};
    if (cfg.openai_live_api === false) return false;
    const model = coerceText(cfg.openai_realtime_model || cfg.model || "");
    if (String(model).indexOf("gpt-live") >= 0) return true;
    if (coerceText(cfg.openai_live_session_endpoint) || coerceText(cfg.live_session_endpoint)) return true;
    // Default Clerk eWebmaster path uses Live.
    return true;
  }

  function sendSessionUpdate() {
    if (!state.dataChannel || state.dataChannel.readyState !== "open") return;
    // Live: session already configured server-side with Vesper + instructions.
    if (isLiveApi(state.config)) return;
    const config = state.config && typeof state.config === "object" ? state.config : {};
    const launchSession = state.launchSession && typeof state.launchSession === "object" ? state.launchSession : {};
    try {
      state.dataChannel.send(
        JSON.stringify({
          type: "session.update",
          session: {
            voice: resolveVoice(config),
            instructions: buildInstructionText(config, launchSession),
          },
        })
      );
    } catch (_err) {}
  }


  function applyConfig(payload) {
    state.config = payload && typeof payload === "object" ? Object.assign({}, payload) : {};
    syncContactVisualMode(state.config, state.launchSession);
    applyCenterVisual(state.config, state.launchSession);
  }

  function applyLaunchSession(payload) {
    state.launchSession = payload && typeof payload === "object" ? payload : null;
    syncContactVisualMode(state.config, state.launchSession);
    applyCenterVisual(state.config, state.launchSession);
    if (state.connected) {
      sendSessionUpdate();
      sendAutoGreetingIfNeeded();
    }
  }

  function onParentMessage(event) {
    const data = event && event.data && typeof event.data === "object" ? event.data : null;
    if (!data || !data.type) return;
    switch (data.type) {
      case "maxwellian_session_launch":
        applyLaunchSession(data.payload);
        break;
      case "update_config":
        applyConfig(data.payload);
        startRealtimeSession();
        break;
      case "expand_widget_from_client":
        emitExpandedFrame();
        if (!state.connected) startRealtimeSession();
        break;
      case "send_window_size":
        break;
      case "cancel":
        closeRealtimeSession();
        break;
      default:
        break;
    }
  }

  window.addEventListener("message", onParentMessage);
  setStatus("Waiting for session config…", false);
  syncVoiceActivity();
  emitCollapsedFrame();
  syncContactVisualMode(state.config, state.launchSession);
  applyCenterVisual(state.config, state.launchSession);
  postToParent("widget_iframe_is_ready");
})();
