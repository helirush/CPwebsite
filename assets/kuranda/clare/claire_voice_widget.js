(function () {
  let frameLoadTimer = null;
  let frameMessagingBound = false;
  let activeFrameOrigin = "";
  let pendingLaunchSession = null;
  let panelMode = "centered";
  let footerQuestionTimer = null;
  let footerQuestionIndex = 0;
  let footerQuestionSignature = "";
  let widgetReady = false;
  let hasConversationStarted = false;
    try { showWaitingClaireButton(); } catch (_e) {}
  let currentVisitorName = "";
  let leadCaptureState = null;
  let leadCaptureSubmitInFlight = false;
  let leadCaptureStatusTimer = null;
  let visitorQuestionCount = 0;
  let questionNotesActivated = false;
  let visitorQuestionLog = [];
  let lastVisitorQuestionFingerprint = "";
  let questionNotesStatusTimer = null;
  let founderModeActive = false;
  let founderModeIdentity = "";
  let mptsDriftEventCount = 0;
  let lastMptsDriftFingerprint = "";
  let guardrailSessionStartedAt = 0;
  let guardrailLastActivityAt = 0;
  let guardrailQuestionCount = 0;
  let guardrailQuestionCap = 0;
  let guardrailLowRelevanceStreak = 0;
  let guardrailOffboarded = false;
  let guardrailIdleTimer = null;
  let guardrailIdlePromptStage = 0;
  let guardrailOffboardCloseTimer = null;
  let guardrailSessionToken = "";
  let guardrailLeadCapturePromptCount = 0;
  let lifecycleCleanupBound = false;
  let activeLaunchSignature = "";
  let unityStartGatePending = false;
  let unityStartGatePreflightReady = false;
  let unityStartGatePreflightAttempted = false;
  let unityStartGatePreflightFailed = false;
  let unityStartGatePreflightStatusMessage = "";
  let unityStartGatePendingRequiresRecovery = false;
  let unityStartGateResendTimer = null;
  let unityStartGateStallTimer = null;
  let unityStartGateStallRetryCount = 0;
  let unityStartGateStallSequence = 0;
  let unityStartGateLastProgressAt = 0;
  let unityStartGateRecentProgressEvents = [];
  let navigationRoamingBound = false;
  let pageTransitionInProgress = false;
  let customerExitSweepCaptured = false;
  let voiceSignalMode = "idle";
  let signalSpeakingDecayTimer = null;
  let signalFormationTimer = null;
  let preConversationSignalVisible = false;
  let tourGuideNavigationState = null;
  let activePagePatternContextCache = null;
  let activePagePatternContextCacheKey = "";
  let activePagePatternContextFetchedAtMs = 0;
  let activePagePatternContextPromise = null;
  let electricalStoryQuestionCount = 0;
  let electricalStoryQuestionCap = 0;
  let electricalStoryExitPromptActive = false;
  let electricalStoryExitPromptSent = false;
  let electricalStoryExitTimer = null;
  let contentRetrievalInFlight = false;
  let lastContentRetrievalFingerprint = "";
  let lastContentRetrievalAtMs = 0;
  let experimentTelemetrySession = null;
  let experimentTelemetryEvents = [];
  let experimentTelemetrySessionCounter = 0;
  const COMPACT_SQUARE_FRAME_SIZE = 236;
  const SIGNAL_MODE_IDLE = "idle";
  const SIGNAL_MODE_LISTENING = "listening";
  const SIGNAL_MODE_SPEAKING = "speaking";
  const SIGNAL_SPEAKING_DECAY_MS = 780;
  const SIGNAL_FORMATION_DURATION_MS = 2300;
  const START_BUTTON_WAITING_LABEL = "Waiting on Claire";
  const START_BUTTON_CLOSE_LABEL = "Stop-Listening";
  const UNITY_START_GATE_MAX_STALL_RETRIES = 2;
  const UNITY_START_GATE_MOBILE_MAX_STALL_RETRIES = 4;
  const UNITY_START_GATE_STALL_TIMEOUT_MS = 5000;
  const UNITY_START_GATE_STALL_TIMEOUT_MOBILE_MS = 9000;
  const UNITY_START_GATE_PROGRESS_GRACE_MS = 2800;
  const UNITY_START_GATE_PROGRESS_GRACE_MOBILE_MS = 6200;
  const UNITY_START_GATE_POST_READY_PROMPT_DELAY_MS = 2800;
  const UNITY_START_GATE_POST_READY_PROMPT_DELAY_MOBILE_MS = 5200;
  const UNITY_START_GATE_RETRY_RESEND_DELAY_MS = 1500;
  const UNITY_START_GATE_RETRY_RESEND_DELAY_MOBILE_MS = 2200;
  const CROSS_PAGE_ROAMING_STORAGE_KEY_PREFIX = "maxwellian_clerk_roaming_state_v2";
  const CUSTOMER_MEMORY_STORAGE_KEY_PREFIX = "maxwellian_clerk_customer_memory_v1";
  const PAGE_CONTEXT_MEMORY_STORAGE_KEY_PREFIX = "maxwellian_clerk_page_context_memory_v1";
  const PATTERN_CONTEXT_PREFETCH_TTL_MS = 1000 * 60 * 10;
  const PATTERN_CONTEXT_PREFETCH_LAUNCH_BUDGET_MS = 360;
  const CROSS_PAGE_ROAMING_MAX_TRANSCRIPT_ENTRIES = 10;
  const CROSS_PAGE_ROAMING_STATE_TTL_MS = 1000 * 60 * 45;
  const CROSS_PAGE_ROAMING_RESUME_DELAY_MS = 180;
  const TOUR_GUIDE_PENDING_TTL_MS = 1000 * 60 * 5;
  const CONTENT_RETRIEVAL_DEDUP_WINDOW_MS = 1000 * 18;
  const CONTENT_RETRIEVAL_CONTEXT_CHAR_LIMIT = 2600;
  const EXPERIMENT_TELEMETRY_DEFAULT_STORAGE_KEY = "maxwellian_clerk_rev2_baseline_runs_v1";
  const EXPERIMENT_TELEMETRY_DEFAULT_HISTORY_LIMIT = 24;
  const EXPERIMENT_TELEMETRY_DEFAULT_EVENT_LIMIT = 600;
  const EXPERIMENT_TELEMETRY_DISPATCH_EVENT = "maxwellian:clerk-rev2-telemetry";
  const CONTENT_RETRIEVAL_STOP_WORDS = {
    a: true,
    about: true,
    an: true,
    and: true,
    are: true,
    can: true,
    explain: true,
    for: true,
    from: true,
    get: true,
    help: true,
    i: true,
    in: true,
    is: true,
    looking: true,
    me: true,
    on: true,
    our: true,
    page: true,
    section: true,
    tab: true,
    card: true,
    that: true,
    the: true,
    this: true,
    to: true,
    we: true,
    website: true,
    with: true,
    you: true,
    your: true,
  };
  const runtimeAuthStorageKeys = [
    "MAXWELLIAN_OPENAI_RUNTIME_AUTH",
    "MAXWELLIAN_HUME_RUNTIME_AUTH",
  ];
  function normalizeRuntimeAuthType(value) {
    if (typeof value !== "string") return "";
    const normalized = value.trim().toLowerCase();
    if (!normalized) return "";
    if (
      normalized === "accesstoken" ||
      normalized === "access_token" ||
      normalized === "access-token" ||
      normalized === "token"
    ) {
      return "accessToken";
    }
    if (
      normalized === "apikey" ||
      normalized === "api_key" ||
      normalized === "api-key" ||
      normalized === "key"
    ) {
      return "apiKey";
    }
    return "";
  }
  function parseVisitorIntentFromText(text) {
    const sample = coerceText(text).replace(/\s+/g, " ").trim();
    if (!sample) return "";
    const patterns = [
      /\b(?:i(?:'m| am)? (?:looking for|interested in|trying to|hoping to|here to)|we(?:'re| are)? (?:looking for|interested in|trying to|hoping to|here to)|i need help with|we need help with|can you help (?:me|us) (?:with)?|help (?:me|us) (?:understand|with)|i want to|we want to)\s+(.{6,240})/i,
      /\b(?:my question(?: is)?|the question(?: is)?|my goal(?: is)?|our goal(?: is)?|i(?:'m| am) curious about|we(?:'re| are) curious about)\s*[:,-]?\s*(.{6,240})/i,
    ];
    for (let i = 0; i < patterns.length; i += 1) {
      const match = sample.match(patterns[i]);
      if (!match || !match[1]) continue;
      const cropped = match[1].split(/\b(?:and my (?:name|email)|my (?:name|email) is|you can reach me|contact me|thanks|thank you)\b/i)[0];
      const normalized = coerceText(cropped)
        .replace(/^[,;:\-\s]+/, "")
        .replace(/[,;:\-\s]+$/, "");
      if (!normalized || normalized.length < 8) continue;
      if (/@/.test(normalized)) continue;
      return normalized.length > 220 ? `${normalized.slice(0, 220).trim()}…` : normalized;
    }
    if (/\?/.test(sample) && /\b(help|understand|explain|show|difference|service|portal|manage|managed|mpts|power factor|reactive|harmonic|thermal)\b/i.test(sample)) {
      return sample.length > 220 ? `${sample.slice(0, 220).trim()}…` : sample;
    }
    return "";
  }

  function parseVisitorEmailFromText(text) {
    const sample = coerceText(text);
    if (!sample) return "";
    const match = sample.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
    if (!match || !match[0]) return "";
    return normalizeVisitorEmail(match[0]);
  }

  function parseVisitorCompanyFromText(text) {
    const sample = coerceText(text);
    if (!sample) return "";
    const patterns = [
      /\b(?:i(?:'m| am)?\s+with|we(?:'re| are)?\s+with|i work(?:ing)?\s+(?:at|for)|i(?:'m| am)?\s+from|we(?:'re| are)?\s+from|my company is|our company is|company is)\s+([A-Za-z0-9&'.,\- ]{2,90})/i,
      /\b(?:this is)\s+[A-Za-z][A-Za-z' -]{1,40}\s+(?:from|with)\s+([A-Za-z0-9&'.,\- ]{2,90})/i,
    ];
    for (let i = 0; i < patterns.length; i += 1) {
      const match = sample.match(patterns[i]);
      if (!match || !match[1]) continue;
      const cropped = match[1].split(/\b(?:and|but|my email|email is|you can|reach me|contact me|phone)\b/i)[0];
      const normalized = normalizeVisitorCompany(cropped);
      if (!normalized) continue;
      if (/@/.test(normalized)) continue;
      return normalized;
    }
    return "";
  }

  function parseConfirmationEmailConsentFromText(text) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return null;
    if (
      /\b(just send (?:me )?(?:the )?(?:confirmation )?email|send (?:me )?(?:the )?(?:confirmation )?email|please send (?:me )?(?:a )?confirmation email|go ahead and send (?:the )?email)\b/.test(
        sample
      )
    ) {
      return true;
    }
    if (/\b(do not send|don't send|no email|not now)\b/.test(sample)) {
      return false;
    }
    if (!/\b(email|confirmation)\b/.test(sample)) return null;
    if (/\b(yes|yeah|yep|sure|ok|okay|absolutely|sounds good|please do|go ahead)\b/.test(sample)) {
      return true;
    }
    if (/\b(no|nope)\b/.test(sample)) {
      return false;
    }
    return null;
  }

  function parseSalesOutreachConsentFromText(text) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return null;
    const outreachContextDetected =
      /\b(sales|sales executive|account executive|reach out|reach back|contact me|follow up|follow-up|have someone call|someone call)\b/.test(
        sample
      );
    if (!outreachContextDetected) return null;
    if (
      /\b(do not contact|don't contact|no contact|no calls|do not call|don't call|not now|no thanks|no thank you)\b/.test(
        sample
      )
    ) {
      return false;
    }
    if (
      /\b(yes|yeah|yep|sure|ok|okay|absolutely|sounds good|go ahead|please do)\b/.test(
        sample
      ) ||
      /\b(please have.*reach out|have.*reach out|someone can contact me|feel free to contact me)\b/.test(
        sample
      )
    ) {
      return true;
    }
    return null;
  }

  function parseNewsletterOptInFromText(text) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return null;
    if (!/\b(newsletter|news brief|maxwellian club|maxwellian news)\b/.test(sample)) return null;
    if (/\b(do not|don't|no|not now|skip|maybe later)\b/.test(sample)) {
      return false;
    }
    if (
      /\b(join|sign me up|subscribe|add me|include me|yes|yeah|yep|sure|absolutely|interested)\b/.test(
        sample
      )
    ) {
      return true;
    }
    return null;
  }

  function parseTextNotificationInterestFromText(text) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return null;
    if (!/\b(text|sms|telegraph|notification|alert)\b/.test(sample)) return null;
    if (/\b(no|not now|skip|later|don't need (?:my )?phone|no phone)\b/.test(sample)) {
      return false;
    }
    if (
      /\b(yes|yeah|yep|sure|absolutely|interested|sign me up|join|enable|set up)\b/.test(sample)
    ) {
      return true;
    }
    return null;
  }

  function getLeadCaptureSettings(cfg) {
    return {
      enabled: Boolean(cfg && cfg.lead_capture_enabled !== false),
      collectCompany: !cfg || cfg.lead_capture_collect_company !== false,
      promptIntent: !cfg || cfg.lead_capture_prompt_intent !== false,
      requireConfirmationEmailConsent:
        !cfg || cfg.lead_capture_require_confirmation_email_consent !== false,
      promptNewsletter: !cfg || cfg.lead_capture_prompt_newsletter !== false,
      promptTextNotifications: !cfg || cfg.lead_capture_prompt_text_notifications !== false,
      promptSalesOutreach: !cfg || cfg.lead_capture_prompt_sales_outreach !== false,
      endpoint:
        coerceText(cfg && cfg.lead_capture_endpoint) || "/api/maxwellian/lead-capture",
      statusDisplaySeconds: Number.isFinite(Number(cfg && cfg.lead_capture_status_display_seconds))
        ? Math.max(2, Math.min(24, Math.floor(Number(cfg && cfg.lead_capture_status_display_seconds))))
        : 7,
    };
  }

  function createLeadCaptureState(seedName) {
    const name = normalizeVisitorName(seedName);
    return {
      name: name,
      company: "",
      email: "",
      visitorIntent: "",
      confirmationEmailConsent: null,
      newsletterOptIn: null,
      textNotificationsInterest: null,
      salesOutreachConsent: null,
      confirmationEmailSent: false,
      confirmationEmailSentAt: "",
      confirmationEmailError: "",
      lastSubmissionStatus: "",
      lastSubmissionAt: "",
      updatedAt: new Date().toISOString(),
    };
  }

  function clearLeadCaptureStatusTimer() {
    if (!leadCaptureStatusTimer) return;
    window.clearTimeout(leadCaptureStatusTimer);
    leadCaptureStatusTimer = null;
  }

  function scheduleLeadCaptureStatusClear(cfg) {
    clearLeadCaptureStatusTimer();
    const settings = getLeadCaptureSettings(cfg);
    leadCaptureStatusTimer = window.setTimeout(function () {
      setStatus("", false);
    }, settings.statusDisplaySeconds * 1000);
  }

  function resetLeadCaptureState(seedName) {
    leadCaptureState = createLeadCaptureState(seedName || "");
    leadCaptureSubmitInFlight = false;
    clearLeadCaptureStatusTimer();
  }

  function ensureLeadCaptureState(seedName) {
    if (!leadCaptureState || typeof leadCaptureState !== "object") {
      resetLeadCaptureState(seedName || "");
    }
    const normalizedSeed = normalizeVisitorName(seedName);
    if (normalizedSeed && !leadCaptureState.name) {
      leadCaptureState.name = normalizedSeed;
      leadCaptureState.updatedAt = new Date().toISOString();
    }
    return leadCaptureState;
  }

  function getLeadCaptureMissingFields(state, settings) {
    const missing = [];
    if (!state || typeof state !== "object") return ["name", "email"];
    if (!coerceText(state.name)) missing.push("name");
    if (settings && settings.collectCompany && !coerceText(state.company)) missing.push("company");
    if (settings && settings.promptIntent && !coerceText(state.visitorIntent)) missing.push("intent");
    if (settings && settings.promptSalesOutreach && state.salesOutreachConsent === null) {
      missing.push("sales_outreach_consent");
    }
    if (!coerceText(state.email)) missing.push("email");
    return missing;
  }

  function syncLeadCaptureStateToSession(cfg, reason) {
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return;
    if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
      pendingLaunchSession.contextPayload = {};
    }
    const settings = getLeadCaptureSettings(cfg);
    const state = ensureLeadCaptureState(currentVisitorName);
    const missingFields = getLeadCaptureMissingFields(state, settings);
    const payload = pendingLaunchSession.contextPayload;
    Object.assign(payload, {
      lead_capture_enabled: settings.enabled,
      lead_capture_collect_company: settings.collectCompany,
      lead_capture_prompt_intent: settings.promptIntent,
      lead_capture_require_confirmation_email_consent:
        settings.requireConfirmationEmailConsent,
      lead_capture_prompt_newsletter: settings.promptNewsletter,
      lead_capture_prompt_text_notifications: settings.promptTextNotifications,
      lead_capture_prompt_sales_outreach: settings.promptSalesOutreach,
      lead_capture_name: coerceText(state.name),
      lead_capture_company: coerceText(state.company),
      lead_capture_email: coerceText(state.email),
      lead_capture_intent: coerceText(state.visitorIntent),
      lead_capture_intent_known: Boolean(coerceText(state.visitorIntent)),
      lead_capture_confirmation_email_consent: state.confirmationEmailConsent,
      lead_capture_newsletter_opt_in: state.newsletterOptIn,
      lead_capture_text_notifications_interest: state.textNotificationsInterest,
      lead_capture_sales_outreach_consent: state.salesOutreachConsent,
      lead_capture_missing_fields: missingFields,
      lead_capture_ready_for_confirmation_email:
        Boolean(state.email) &&
        (settings.requireConfirmationEmailConsent
          ? state.confirmationEmailConsent === true
          : true),
      lead_capture_ready_for_sales_outreach_contact:
        state.salesOutreachConsent === true &&
        Boolean(coerceText(state.email) || coerceText(state.company) || coerceText(state.name)),
      lead_capture_confirmation_email_sent: Boolean(state.confirmationEmailSent),
      lead_capture_confirmation_email_sent_at: coerceText(state.confirmationEmailSentAt),
      lead_capture_confirmation_email_error: coerceText(state.confirmationEmailError),
      lead_capture_last_submission_status: coerceText(state.lastSubmissionStatus),
      lead_capture_last_submission_at: coerceText(state.lastSubmissionAt),
      lead_capture_updated_at: state.updatedAt || new Date().toISOString(),
    });
    if (state.name) {
      payload.visitor_name = state.name;
      payload.visitor_name_known = true;
    }
    if (state.company) {
      payload.visitor_company = state.company;
      payload.visitor_company_known = true;
    }
    if (state.email) {
      payload.visitor_email = state.email;
      payload.visitor_email_known = true;
    }
    if (state.visitorIntent) {
      payload.visitor_intent = state.visitorIntent;
      payload.visitor_intent_known = true;
      if (!coerceText(payload.likely_user_intent)) {
        payload.likely_user_intent = state.visitorIntent;
      }
    }
    if (state.salesOutreachConsent !== null) {
      payload.visitor_sales_outreach_consent = state.salesOutreachConsent;
    }
    appendSessionDecision(pendingLaunchSession, reason || "lead-capture-synced", {
      visitor_name: coerceText(state.name),
      visitor_company: coerceText(state.company),
      visitor_email: coerceText(state.email),
      visitor_intent: coerceText(state.visitorIntent),
      confirmation_email_consent: state.confirmationEmailConsent,
      newsletter_opt_in: state.newsletterOptIn,
      sales_outreach_consent: state.salesOutreachConsent,
      missing_fields: missingFields,
      confirmation_email_sent: Boolean(state.confirmationEmailSent),
    });
    postToWidgetFrame({ type: "maxwellian_session_launch", payload: pendingLaunchSession });
  }

  async function submitLeadCaptureToBackend(cfg, reason) {
    const settings = getLeadCaptureSettings(cfg);
    if (!settings.enabled) return null;
    if (typeof window.fetch !== "function") return null;
    const state = ensureLeadCaptureState(currentVisitorName);
    const hasAnyLeadIdentity = Boolean(
      coerceText(state.name) || coerceText(state.company) || coerceText(state.email)
    );
    if (!hasAnyLeadIdentity || leadCaptureSubmitInFlight) return null;
    const endpoint = coerceText(settings.endpoint);
    if (!endpoint) return null;

    const payload = pendingLaunchSession && pendingLaunchSession.contextPayload && typeof pendingLaunchSession.contextPayload === "object"
      ? pendingLaunchSession.contextPayload
      : {};
    const requestBody = {
      visitor_name: coerceText(state.name),
      visitor_company: coerceText(state.company),
      visitor_email: coerceText(state.email),
      visitor_intent: coerceText(state.visitorIntent),
      confirmation_email_consent: state.confirmationEmailConsent === true,
      newsletter_opt_in: state.newsletterOptIn === true,
      text_notifications_interest: state.textNotificationsInterest === true,
      sales_outreach_consent: state.salesOutreachConsent === true,
      source_page: coerceText(payload.source_page || getCurrentPageSlug()),
      context_source: coerceText(
        (pendingLaunchSession && pendingLaunchSession.contextSource) || payload.context_source
      ),
      likely_user_intent: coerceText(payload.likely_user_intent || state.visitorIntent),
      entry_point: coerceText(payload.entry_point),
      lead_capture_reason: coerceText(reason),
      guardrail_session_token: coerceText(
        guardrailSessionToken || payload.guardrail_session_token
      ),
      submitted_at: new Date().toISOString(),
    };

    leadCaptureSubmitInFlight = true;
    state.confirmationEmailError = "";
    state.lastSubmissionStatus = "submitting";
    state.updatedAt = new Date().toISOString();
    syncLeadCaptureStateToSession(cfg, "lead-capture-submit-started");

    try {
      const response = await window.fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      let result = {};
      try {
        result = await response.json();
      } catch (_err) {
        result = {};
      }
      if (!response.ok) {
        const message =
          coerceText(result && result.error && result.error.message) ||
          `Lead capture request failed with status ${response.status}.`;
        throw new Error(message);
      }
      const emailSent = Boolean(
        result &&
          (result.confirmation_email_sent === true || result.confirmationEmailSent === true)
      );
      state.lastSubmissionAt = new Date().toISOString();
      state.lastSubmissionStatus =
        coerceText(result && (result.confirmation_email_status || result.confirmationEmailStatus)) ||
        (emailSent ? "sent" : "accepted");
      if (emailSent) {
        state.confirmationEmailSent = true;
        state.confirmationEmailSentAt = state.lastSubmissionAt;
        state.confirmationEmailError = "";
        setStatus(`Confirmation email sent to ${state.email}.`, false, true);
        scheduleLeadCaptureStatusClear(cfg);
      } else {
        const emailError = coerceText(
          result && (result.confirmation_email_error || result.confirmationEmailError)
        );
        if (emailError) {
          state.confirmationEmailError = emailError;
          setStatus(
            `Lead captured. Confirmation email pending: ${emailError}`,
            true,
            true
          );
          scheduleLeadCaptureStatusClear(cfg);
        }
      }
      state.updatedAt = new Date().toISOString();
      syncLeadCaptureStateToSession(cfg, "lead-capture-submitted");
      return result;
    } catch (err) {
      state.lastSubmissionAt = new Date().toISOString();
      state.lastSubmissionStatus = "error";
      state.confirmationEmailError =
        coerceText(err && err.message) || "Lead capture submission failed.";
      state.updatedAt = new Date().toISOString();
      setStatus(`Lead capture error: ${state.confirmationEmailError}`, true, true);
      scheduleLeadCaptureStatusClear(cfg);
      syncLeadCaptureStateToSession(cfg, "lead-capture-submit-error");
      return null;
    } finally {
      leadCaptureSubmitInFlight = false;
    }
  }

  function maybeSubmitLeadCaptureToBackend(cfg, reason) {
    submitLeadCaptureToBackend(cfg, reason).catch(function (_err) {});
  }

  function updateLeadCaptureFromTranscript(text, cfg) {
    const settings = getLeadCaptureSettings(cfg);
    if (!settings.enabled) return false;
    const sample = coerceText(text);
    if (!sample) return false;
    const state = ensureLeadCaptureState(currentVisitorName);
    let changed = false;

    const knownName = normalizeVisitorName(currentVisitorName);
    if (knownName && knownName !== state.name) {
      state.name = knownName;
      changed = true;
    }

    const parsedEmail = parseVisitorEmailFromText(sample);
    if (parsedEmail && parsedEmail !== state.email) {
      state.email = parsedEmail;
      state.confirmationEmailSent = false;
      state.confirmationEmailSentAt = "";
      state.confirmationEmailError = "";
      state.lastSubmissionStatus = "";
      changed = true;
    }

    const parsedCompany = parseVisitorCompanyFromText(sample);
    if (parsedCompany && parsedCompany !== state.company) {
      state.company = parsedCompany;
      changed = true;
    }
    if (settings.promptIntent) {
      const parsedIntent = parseVisitorIntentFromText(sample);
      if (parsedIntent) {
        const shouldReplaceIntent =
          !state.visitorIntent || parsedIntent.length >= state.visitorIntent.length;
        if (shouldReplaceIntent && parsedIntent !== state.visitorIntent) {
          state.visitorIntent = parsedIntent;
          changed = true;
        }
      }
    }

    const confirmationConsent = parseConfirmationEmailConsentFromText(sample);
    if (confirmationConsent !== null && confirmationConsent !== state.confirmationEmailConsent) {
      state.confirmationEmailConsent = confirmationConsent;
      if (confirmationConsent === false) {
        state.confirmationEmailSent = false;
        state.confirmationEmailSentAt = "";
      }
      changed = true;
    }

    if (settings.promptNewsletter) {
      const newsletterOptIn = parseNewsletterOptInFromText(sample);
      if (newsletterOptIn !== null && newsletterOptIn !== state.newsletterOptIn) {
        state.newsletterOptIn = newsletterOptIn;
        changed = true;
      }
    }

    if (settings.promptTextNotifications) {
      const textNotificationsInterest = parseTextNotificationInterestFromText(sample);
      if (
        textNotificationsInterest !== null &&
        textNotificationsInterest !== state.textNotificationsInterest
      ) {
        state.textNotificationsInterest = textNotificationsInterest;
        changed = true;
      }
    }

    if (settings.promptSalesOutreach) {
      const salesOutreachConsent = parseSalesOutreachConsentFromText(sample);
      if (
        salesOutreachConsent !== null &&
        salesOutreachConsent !== state.salesOutreachConsent
      ) {
        state.salesOutreachConsent = salesOutreachConsent;
        changed = true;
      }
    }

    if (changed) {
      state.updatedAt = new Date().toISOString();
      syncLeadCaptureStateToSession(cfg, "lead-capture-updated");
      maybeSubmitLeadCaptureToBackend(cfg, "transcript-message");
    }
    return changed;
  }

  function readTrimmedAuthString(source, keys) {
    if (!source || typeof source !== "object" || !Array.isArray(keys)) return "";
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (!key) continue;
      const value = source[key];
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) return trimmed;
      }
    }
    return "";
  }

  function normalizeRuntimeAuthCandidate(candidate) {
    if (!candidate) return null;
    if (typeof candidate === "string") {
      const tokenCandidate = candidate.trim();
      return tokenCandidate ? { type: "accessToken", value: tokenCandidate } : null;
    }
    if (typeof candidate !== "object") return null;
    const explicitType = normalizeRuntimeAuthType(candidate.type);
    const explicitValue = readTrimmedAuthString(candidate, ["value"]);
    const accessToken = readTrimmedAuthString(candidate, [
      "accessToken",
      "access_token",
      "access-token",
      "token",
    ]);
    const apiKey = readTrimmedAuthString(candidate, [
      "apiKey",
      "apikey",
      "api_key",
      "api-key",
      "key",
    ]);
    let type = explicitType;
    let value = explicitValue;
    if (!type) {
      if (accessToken) {
        type = "accessToken";
      } else if (apiKey) {
        type = "apiKey";
      }
    }
    if (!value) {
      value = type === "accessToken" ? accessToken : type === "apiKey" ? apiKey : "";
    }
    if (!type || !value) return null;
    return { type: type, value: value };
  }

  function readRuntimeAuthFromStorage() {
    if (typeof window === "undefined" || !window.localStorage) return null;
    try {
      for (let i = 0; i < runtimeAuthStorageKeys.length; i += 1) {
        const storageKey = runtimeAuthStorageKeys[i];
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) continue;
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (_err) {
          parsed = raw;
        }
        const normalized = normalizeRuntimeAuthCandidate(parsed);
        if (normalized) return normalized;
      }
      return null;
    } catch (_err) {
      return null;
    }
  }

  function writeRuntimeAuthToStorage(auth) {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const normalized = normalizeRuntimeAuthCandidate(auth);
    if (!normalized) return false;
    try {
      runtimeAuthStorageKeys.forEach(function (storageKey) {
        window.localStorage.setItem(storageKey, JSON.stringify(normalized));
      });
      return true;
    } catch (_err) {
      return false;
    }
  }

  function clearRuntimeAuthStorage() {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      runtimeAuthStorageKeys.forEach(function (storageKey) {
        window.localStorage.removeItem(storageKey);
      });
    } catch (_err) {}
  }

  function readRuntimeAuthFromWindow() {
    if (typeof window === "undefined") return null;
    const objectCandidate =
      window.MAXWELLIAN_OPENAI_RUNTIME_AUTH && typeof window.MAXWELLIAN_OPENAI_RUNTIME_AUTH === "object"
        ? window.MAXWELLIAN_OPENAI_RUNTIME_AUTH
        : window.MAXWELLIAN_OPENAI_AUTH && typeof window.MAXWELLIAN_OPENAI_AUTH === "object"
          ? window.MAXWELLIAN_OPENAI_AUTH
          : window.MAXWELLIAN_HUME_RUNTIME_AUTH && typeof window.MAXWELLIAN_HUME_RUNTIME_AUTH === "object"
            ? window.MAXWELLIAN_HUME_RUNTIME_AUTH
            : window.MAXWELLIAN_HUME_AUTH && typeof window.MAXWELLIAN_HUME_AUTH === "object"
              ? window.MAXWELLIAN_HUME_AUTH
              : null;
    const objectAuth = normalizeRuntimeAuthCandidate(objectCandidate);
    if (objectAuth) return objectAuth;
    const accessToken =
      typeof window.MAXWELLIAN_OPENAI_ACCESS_TOKEN === "string"
        ? window.MAXWELLIAN_OPENAI_ACCESS_TOKEN.trim()
        : typeof window.MAXWELLIAN_HUME_ACCESS_TOKEN === "string"
          ? window.MAXWELLIAN_HUME_ACCESS_TOKEN.trim()
        : "";
    if (accessToken) return { type: "accessToken", value: accessToken };
    const apiKey =
      typeof window.MAXWELLIAN_OPENAI_API_KEY === "string"
        ? window.MAXWELLIAN_OPENAI_API_KEY.trim()
        : typeof window.MAXWELLIAN_HUME_API_KEY === "string"
          ? window.MAXWELLIAN_HUME_API_KEY.trim()
          : "";
    if (apiKey) return { type: "apiKey", value: apiKey };
    return null;
  }

  function applyRuntimeAuthToWindow(auth) {
    if (typeof window === "undefined") return;
    const normalized = normalizeRuntimeAuthCandidate(auth);
    if (!normalized) return;
    window.MAXWELLIAN_OPENAI_RUNTIME_AUTH = {
      type: normalized.type,
      value: normalized.value,
    };
    window.MAXWELLIAN_OPENAI_AUTH = window.MAXWELLIAN_OPENAI_RUNTIME_AUTH;
    window.MAXWELLIAN_HUME_RUNTIME_AUTH = {
      type: normalized.type,
      value: normalized.value,
    };
    window.MAXWELLIAN_HUME_AUTH = window.MAXWELLIAN_HUME_RUNTIME_AUTH;
    if (normalized.type === "accessToken") {
      window.MAXWELLIAN_OPENAI_ACCESS_TOKEN = normalized.value;
      window.MAXWELLIAN_HUME_ACCESS_TOKEN = normalized.value;
    } else if (normalized.type === "apiKey") {
      window.MAXWELLIAN_OPENAI_API_KEY = normalized.value;
      window.MAXWELLIAN_HUME_API_KEY = normalized.value;
    }
  }

  function getRuntimeAuthCandidate() {
    const fromWindow = readRuntimeAuthFromWindow();
    if (fromWindow) return fromWindow;
    const fromStorage = readRuntimeAuthFromStorage();
    if (fromStorage) {
      applyRuntimeAuthToWindow(fromStorage);
      return fromStorage;
    }
    return null;
  }

  function shouldFetchServerRuntimeAuth() {
    if (typeof window === "undefined") return false;
    if (window.MAXWELLIAN_FORCE_RUNTIME_AUTH_BOOTSTRAP === true) return true;
    if (window.MAXWELLIAN_DISABLE_RUNTIME_AUTH_BOOTSTRAP === true) return false;
    const protocol = coerceText(window.location && window.location.protocol).toLowerCase();
    if (protocol === "file:") return false;
    return true;
  }
  function isStartGateInteractiveElementDisabled(element) {
    if (!element || typeof element !== "object") return true;
    if (element.disabled === true) return true;
    const ariaDisabled =
      typeof element.getAttribute === "function"
        ? coerceText(element.getAttribute("aria-disabled")).toLowerCase()
        : "";
    return ariaDisabled === "true";
  }

  function isStartGateInteractiveElementVisible(element) {
    if (!element || typeof element !== "object") return false;
    if (element.hidden) return false;
    const style = typeof window.getComputedStyle === "function" ? window.getComputedStyle(element) : null;
    if (style) {
      if (style.display === "none" || style.visibility === "hidden") return false;
      if (Number(style.opacity) === 0) return false;
    }
    if (typeof element.getBoundingClientRect === "function") {
      const rect = element.getBoundingClientRect();
      if (rect && rect.width <= 0 && rect.height <= 0) return false;
    }
    return true;
  }

  function buildStartConversationCandidateSignature(element) {
    if (!element || typeof element !== "object") return "";
    const parts = [
      coerceText(element.textContent),
      coerceText(element.value),
      typeof element.getAttribute === "function" ? coerceText(element.getAttribute("aria-label")) : "",
      typeof element.getAttribute === "function" ? coerceText(element.getAttribute("title")) : "",
      coerceText(element.id),
      coerceText(element.className),
      typeof element.getAttribute === "function" ? coerceText(element.getAttribute("name")) : "",
      typeof element.getAttribute === "function" ? coerceText(element.getAttribute("data-testid")) : "",
    ];
    return parts.join(" ").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function scoreStartConversationCandidate(signature) {
    if (!signature) return Number.NEGATIVE_INFINITY;
    let score = 0;
    if (/start conversation/.test(signature)) score += 120;
    if (/\b(start|begin|join|connect|continue|launch|open)\b/.test(signature)) score += 40;
    if (/\b(conversation|session|voice|call|chat|talk|speak|microphone|mic)\b/.test(signature)) score += 24;
    if (/\b(close|cancel|dismiss|end|hang ?up|stop|mute|minimize|maximize|settings|help|copy|download|share)\b/.test(signature)) {
      score -= 90;
    }
    if (/^\s*[×x]\s*$/.test(signature)) score -= 140;
    return score;
  }
  function resolveRuntimeAuthEndpointCandidate(endpointCandidate) {
    const candidate = coerceText(endpointCandidate);
    if (!candidate) return "";
    try {
      const baseHref = typeof window !== "undefined" && window.location ? window.location.href : "";
      return new URL(candidate, baseHref || undefined).toString();
    } catch (_err) {
      return candidate;
    }
  }

  function appendRuntimeAuthEndpointCandidate(candidates, endpointCandidate) {
    if (!Array.isArray(candidates)) return;
    const resolved = resolveRuntimeAuthEndpointCandidate(endpointCandidate);
    if (!resolved) return;
    if (candidates.indexOf(resolved) !== -1) return;
    candidates.push(resolved);
  }

  function getRuntimeAuthEndpointPathPrefixes() {
    if (typeof window === "undefined" || !window.location) return [];
    const pathname = coerceText(window.location.pathname);
    if (!pathname) return [];
    const prefixes = [];
    const lowerPathname = pathname.toLowerCase();
    const unitySegment = "/unityenergy/";
    const unityIndex = lowerPathname.indexOf(unitySegment);
    if (unityIndex > 0) {
      const unityPrefix = pathname.slice(0, unityIndex).replace(/\/+$/, "");
      if (unityPrefix && unityPrefix !== "/" && prefixes.indexOf(unityPrefix) === -1) {
        prefixes.push(unityPrefix);
      }
    }
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      const firstSegmentPrefix = `/${segments[0]}`;
      if (
        firstSegmentPrefix &&
        firstSegmentPrefix !== "/" &&
        firstSegmentPrefix.toLowerCase() !== "/unityenergy" &&
        prefixes.indexOf(firstSegmentPrefix) === -1
      ) {
        prefixes.push(firstSegmentPrefix);
      }
    }
    return prefixes;
  }

  function buildRuntimeAuthEndpointCandidates(cfgOrOptions) {
    const source = cfgOrOptions && typeof cfgOrOptions === "object" ? cfgOrOptions : {};
    const cfg =
      source.cfg && typeof source.cfg === "object"
        ? source.cfg
        : source;
    const explicit = coerceText(
      source.endpoint ||
        source.runtime_auth_endpoint ||
        source.hume_runtime_auth_endpoint ||
        (cfg &&
          (cfg.runtime_auth_endpoint ||
            cfg.hume_runtime_auth_endpoint ||
            cfg.runtime_auth_url ||
            cfg.hume_runtime_auth_url))
    );
    const globalOverride =
      typeof window !== "undefined"
        ? coerceText(
            window.MAXWELLIAN_HUME_RUNTIME_AUTH_ENDPOINT ||
              window.MAXWELLIAN_RUNTIME_AUTH_ENDPOINT
          )
        : "";
    const candidates = [];
    appendRuntimeAuthEndpointCandidate(candidates, explicit);
    appendRuntimeAuthEndpointCandidate(candidates, globalOverride);
    if (typeof window !== "undefined") {
      appendRuntimeAuthEndpointCandidate(
        candidates,
        coerceText(window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT)
      );
    }
    appendRuntimeAuthEndpointCandidate(candidates, "../api/hume/runtime-auth");
    appendRuntimeAuthEndpointCandidate(candidates, "../api/hume/runtime-auth.json");
    appendRuntimeAuthEndpointCandidate(candidates, "/api/hume/runtime-auth");
    appendRuntimeAuthEndpointCandidate(candidates, "/api/hume/runtime-auth.json");
    const pathPrefixes = getRuntimeAuthEndpointPathPrefixes();
    pathPrefixes.forEach(function (prefix) {
      appendRuntimeAuthEndpointCandidate(candidates, `${prefix}/api/hume/runtime-auth`);
      appendRuntimeAuthEndpointCandidate(candidates, `${prefix}/api/hume/runtime-auth.json`);
    });
    return candidates;
  }

  function getRuntimeAuthEndpoint(cfgOrOptions) {
    const candidates = buildRuntimeAuthEndpointCandidates(cfgOrOptions);
    return candidates[0] || "/api/hume/runtime-auth";
  }

  function getRuntimeAuthEndpointDisplayLabel(cfgOrOptions, endpointOverride) {
    const endpoint =
      coerceText(endpointOverride) ||
      (typeof window !== "undefined"
        ? coerceText(window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT)
        : "") ||
      getRuntimeAuthEndpoint(cfgOrOptions);
    if (!endpoint) return "/api/hume/runtime-auth";
    if (typeof window === "undefined" || !window.location) return endpoint;
    try {
      const parsed = new URL(endpoint, window.location.href);
      if (parsed.origin === window.location.origin) {
        return `${parsed.pathname}${parsed.search}`;
      }
    } catch (_err) {}
    return endpoint;
  }

  function extractRuntimeAuthFromServerPayload(payload) {
    if (!payload || typeof payload !== "object") return null;
    return normalizeRuntimeAuthCandidate(
      payload.auth || payload.runtime_auth || payload.runtimeAuth || payload
    );
  }

  function fetchRuntimeAuthFromServer(options) {
    if (typeof window === "undefined" || typeof window.fetch !== "function") {
      return Promise.resolve(null);
    }
    const opts = options && typeof options === "object" ? options : {};
    const force = opts.force === true;
    if (!force && !shouldFetchServerRuntimeAuth()) {
      return Promise.resolve(null);
    }
    const shouldPersist = opts.persist !== false;
    const endpoints = buildRuntimeAuthEndpointCandidates(opts);
    if (!endpoints.length) return Promise.resolve(null);

    function fetchRuntimeAuthFromEndpoint(endpoint, index) {
      if (!endpoint || index >= endpoints.length) return Promise.resolve(null);
      return window
        .fetch(endpoint, {
          method: "GET",
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        })
        .then(function (response) {
          if (!response || !response.ok) return null;
          return response.json().catch(function () {
            return null;
          });
        })
        .then(function (payload) {
          const candidate = extractRuntimeAuthFromServerPayload(payload);
          if (!candidate) return null;
          applyRuntimeAuthToWindow(candidate);
          if (shouldPersist) {
            writeRuntimeAuthToStorage(candidate);
          }
          if (typeof window !== "undefined") {
            window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT = endpoint;
          }
          return candidate;
        })
        .catch(function () {
          return null;
        })
        .then(function (candidate) {
          if (candidate) return candidate;
          const nextIndex = index + 1;
          if (nextIndex >= endpoints.length) return null;
          return fetchRuntimeAuthFromEndpoint(endpoints[nextIndex], nextIndex);
        });
    }

    return fetchRuntimeAuthFromEndpoint(endpoints[0], 0);
  }

  function exposeRuntimeAuthHelpers() {
    if (typeof window === "undefined") return;
    const setRuntimeAuth = function (typeOrObject, value, options) {
      let candidate = null;
      if (typeOrObject && typeof typeOrObject === "object") {
        candidate = normalizeRuntimeAuthCandidate(typeOrObject);
      } else if (typeof typeOrObject === "string") {
        candidate = normalizeRuntimeAuthCandidate({
          type: typeOrObject,
          value: typeof value === "string" ? value : "",
        });
      }
      if (!candidate) return false;
      applyRuntimeAuthToWindow(candidate);
      const shouldPersist = !(options && typeof options === "object" && options.persist === false);
      if (shouldPersist) writeRuntimeAuthToStorage(candidate);
      return true;
    };
    const clearRuntimeAuth = function () {
      clearRuntimeAuthStorage();
      if (window.MAXWELLIAN_OPENAI_RUNTIME_AUTH && typeof window.MAXWELLIAN_OPENAI_RUNTIME_AUTH === "object") {
        window.MAXWELLIAN_OPENAI_RUNTIME_AUTH.type = "";
        window.MAXWELLIAN_OPENAI_RUNTIME_AUTH.value = "";
      }
      if (window.MAXWELLIAN_OPENAI_AUTH && typeof window.MAXWELLIAN_OPENAI_AUTH === "object") {
        window.MAXWELLIAN_OPENAI_AUTH.type = "";
        window.MAXWELLIAN_OPENAI_AUTH.value = "";
      }
      if (window.MAXWELLIAN_HUME_RUNTIME_AUTH && typeof window.MAXWELLIAN_HUME_RUNTIME_AUTH === "object") {
        window.MAXWELLIAN_HUME_RUNTIME_AUTH.type = "";
        window.MAXWELLIAN_HUME_RUNTIME_AUTH.value = "";
      }
      if (window.MAXWELLIAN_HUME_AUTH && typeof window.MAXWELLIAN_HUME_AUTH === "object") {
        window.MAXWELLIAN_HUME_AUTH.type = "";
        window.MAXWELLIAN_HUME_AUTH.value = "";
      }
      if (typeof window.MAXWELLIAN_OPENAI_ACCESS_TOKEN === "string") {
        window.MAXWELLIAN_OPENAI_ACCESS_TOKEN = "";
      }
      if (typeof window.MAXWELLIAN_HUME_ACCESS_TOKEN === "string") {
        window.MAXWELLIAN_HUME_ACCESS_TOKEN = "";
      }
      if (typeof window.MAXWELLIAN_OPENAI_API_KEY === "string") {
        window.MAXWELLIAN_OPENAI_API_KEY = "";
      }
      if (typeof window.MAXWELLIAN_HUME_API_KEY === "string") {
        window.MAXWELLIAN_HUME_API_KEY = "";
      }
      return true;
    };
    window.setMaxwellianOpenAIAuth = setRuntimeAuth;
    window.setMaxwellianHumeAuth = setRuntimeAuth;
    window.clearMaxwellianOpenAIAuth = clearRuntimeAuth;
    window.clearMaxwellianHumeAuth = clearRuntimeAuth;
  }

  exposeRuntimeAuthHelpers();
  const bootstrapRuntimeAuth = getRuntimeAuthCandidate();
  if (bootstrapRuntimeAuth) {
    applyRuntimeAuthToWindow(bootstrapRuntimeAuth);
  }

  function getVoiceConfig() {
    const defaults = {
      character_name: "Clerk Maxwell",
      character_id: "clerk-maxwell",
      default_character_id: "clerk-maxwell",
      lock_character_to_default: true,
      default_context_source: "general",
      default_ui_mode: "modal",
      enable_character_switcher: false,
      use_unity_start_gate: false,
      unity_launch_ring_image_url: "assets/images/unity-icon-ring-white-2048.png",
      show_session_diagnostics: false,
      show_unity_footer_message: false,
      unity_footer_message: "",
      unity_footer_questions: [],
      unity_footer_rotate_seconds: 15,
      floating_launcher_enabled: true,
      floating_launcher_tooltip: "Meet with Clerk",
      floating_launcher_icon_url: "assets/images/ClerkMaxwell_60423t.png",
      floating_launcher_blocked_pages: [],
      floating_launcher_context_mode: "technical-follow-up",
      floating_launcher_response_style_hint: "",
      clerk_page_access_control_enabled: false,
      clerk_voice_allowed_pages: [],
      clerk_voice_blocked_pages: ["index", "home"],
      lead_capture_enabled: true,
      lead_capture_collect_company: true,
      lead_capture_prompt_intent: true,
      lead_capture_require_confirmation_email_consent: true,
      lead_capture_prompt_newsletter: true,
      lead_capture_prompt_text_notifications: true,
      lead_capture_prompt_sales_outreach: true,
      lead_capture_endpoint: "/api/maxwellian/lead-capture",
      lead_capture_workflow: "",
      lead_capture_status_display_seconds: 7,
      cross_page_roaming_enabled: true,
      cross_page_roaming_auto_resume: true,
      cross_page_roaming_followup_prompt:
        "Ask whether the visitor has any more questions on this page, then offer to guide them to the next tab.",
      customer_guide_enabled: true,
      customer_memory_enabled: true,
      customer_memory_max_entries: 12,
      customer_memory_excerpt_char_limit: 1200,
      page_context_memory_enabled: true,
      page_context_memory_max_entries: 18,
      page_context_memory_excerpt_char_limit: 420,
      customer_exit_sweep_enabled: false,
      customer_exit_sweep_prompt: "",
      customer_exit_sweep_note_prompt: "",
      customer_exit_sweep_saved_status: "",
      customer_exit_sweep_skipped_status: "",
      tour_guide_enabled: false,
      tour_guide_max_candidates: 3,
      tour_guide_allow_direct_navigation: true,
      tour_guide_consent_prompt:
        "If a visitor asks about another area and there is a strong route match, ask: Would you like me to go there? Wait for explicit yes before navigating.",
      tour_guide_routes: [],
      tour_guide_keyword_routes: [],
      tour_guide_page_next_routes: {},
      engagement_protocol: "",
      response_precedence_guidance: "",
      voltage_unit_speech_rule: "",
      maxwellian_knowledge_seed: "",
      knowledge_reference_spine: "",
      content_awareness_mode: true,
      content_grounding_policy:
        "Treat launch context, page context, and selected skill-pack excerpts as the only authoritative Unity sources for factual claims. Do not invent project outcomes, pricing, commitments, statistics, customer names, or deployment guarantees.",
      unknown_answer_fallback:
        "I don't have enough verified Unity context to answer that reliably yet. If you share the page, system detail, or document reference, I can give a grounded answer.",
      context_policy_enabled: false,
      context_policy_default_action: "allow",
      context_policy_fallback_context_source: "general",
      context_policy_block_message: "This Clerk launch context is currently unavailable.",
      context_policy_ask_message: "Clerk is preparing contextual awareness for this view.",
      context_policy_rules: [],
      skill_packs_enabled: false,
      skill_packs_max_selected: 3,
      skill_pack_excerpt_char_limit: 2400,
      skill_packs_fallback_ids: [],
      skill_pack_selection_rules: [],
      skill_packs: [],
      intelligence_routing_enabled: false,
      intelligence_default_profile_id: "",
      intelligence_profiles: {},
      intelligence_routing_rules: [],
      session_context_char_limit: 3600,
      syntax_awareness_context: "",
      syntax_awareness_glossary: [],
      page_context_profiles: {},
      question_notes_threshold: 2,
      question_notes_hold_line: "Please hold while I go back and get my notes.",
      question_notes_library: [],
      founder_detection_enabled: true,
      founder_identity_name: "Mike Howell",
      founder_identity_aliases: ["mike howell", "mike", "mr howell", "michael howell"],
      founder_mode_guidance: "",
      founder_notes_hold_line: "Founder mode active. Please hold while I capture your direction and notes.",
      guardrails_enabled: false,
      guardrails_founder_bypass: true,
      guardrails_max_questions_per_session: 10,
      guardrails_question_limit_min: 8,
      guardrails_free_questions: 3,
      guardrails_max_session_minutes: 18,
      guardrails_idle_timeout_seconds: 90,
      guardrails_idle_followup_seconds: 35,
      guardrails_idle_final_exit_seconds: 25,
      guardrails_idle_first_prompt_message: "Can I help with anything else on this page?",
      guardrails_idle_final_prompt_message:
        "Any other Unity Energy questions before I close this session?",
      guardrails_low_relevance_limit: 3,
      guardrails_min_relevance_score: 1,
      guardrails_max_sessions_per_day: 20,
      guardrails_enable_daily_metering: true,
      guardrails_idle_prompts_enabled: true,
      guardrails_contact_email: "sales@unityenergy.com",
      guardrails_contact_url: "https://unityenergy.com/contact-us",
      guardrails_contact_redirect_url: "/UnityEnergy/contact-us.html",
      guardrails_interested_identity_prompt_after_questions: 4,
      guardrails_interested_identity_prompt_message:
        "Happy to keep helping. Before we continue, may I get your name, company, and best email so we can follow up with you directly?",
      guardrails_interested_followup_message:
        "Thank you for your interest in Unity Energy. We have your information and will follow up directly. What is your next question?",
      guardrails_question_limit_message:
        "You've reached this session's question limit for this page. I can have a specialist contact you, or send you to our contact page so you can share your information.",
      guardrails_offboard_message:
        "We appreciate your interest in Unity Energy. For deeper support, please contact Unity Energy Sales at sales@unityenergy.com or visit unityenergy.com/contact-us.",
      guardrails_relevance_keywords: [
        "unity",
        "unity energy",
        "mpts",
        "power factor",
        "reactive",
        "harmonic",
        "kvar",
        "kva",
        "kw",
        "transformer",
        "voltage",
        "current",
        "thermal",
        "cooling",
        "facility",
        "site",
        "savings",
        "demand",
        "co2",
        "electrical field",
        "measure",
        "manage",
        "exchange",
      ],
      character_avatar_url: "assets/images/ClerkMaxwell_60423t.png",
      character_background_url: "",
      embed_url: "/UnityEnergy/openai_renderer/index.html?v=20260423r5",
      openai_session_endpoint: "/api/openai/realtime/session",
      openai_realtime_model: "gpt-4o-realtime-preview",
      openai_voice: "ash",
      allow_openai_fallback: false,
      allow_openai_voice_fallback: false,
      openai_center_visual_url: "/UnityEnergy/assets/images/ClerkMaxwell_60423t.png",
      signal_wave_bar_count: 30,
      signal_wave_bar_min_width: 3,
      signal_wave_bar_max_width: 6,
      signal_wave_bar_gap: 2,
      signal_wave_max_width: 188,
      signal_wave_min_height: 12,
      signal_wave_idle_height: 16,
      contact_page_auto_greeting_text:
        "I hope you enjoyed the visit. Is there anything else I can show you before you contact our team?",
      openai_delayed_followup_enabled: true,
      openai_delayed_followup_seconds: 10,
      openai_delayed_followup_text: "",
      openai_decline_followup_text: "",
      openai_turn_detection: {
        type: "server_vad",
        threshold: 0.7,
        prefix_padding_ms: 320,
        silence_duration_ms: 760,
        create_response: true,
        interrupt_response: true,
      },
      config_id: "",
      voice_id: "",
      auth: { type: "", value: "" },
      session_context: "",
      session_variables: {},
      system_prompt_text: "",
      characters: {},
    };

    if (!window.MAXWELLIAN_HUME || typeof window.MAXWELLIAN_HUME !== "object") {
      return defaults;
    }

    const merged = Object.assign({}, defaults, window.MAXWELLIAN_HUME);
    if (!merged.auth || typeof merged.auth !== "object") {
      merged.auth = { type: "", value: "" };
    }
    if (!merged.session_variables || typeof merged.session_variables !== "object") {
      merged.session_variables = {};
    }
    if (!merged.characters || typeof merged.characters !== "object") {
      merged.characters = {};
    }
    if (!Array.isArray(merged.founder_identity_aliases)) {
      merged.founder_identity_aliases = defaults.founder_identity_aliases.slice();
    }
    if (!Array.isArray(merged.guardrails_relevance_keywords)) {
      merged.guardrails_relevance_keywords = defaults.guardrails_relevance_keywords.slice();
    }
    if (typeof merged.unity_footer_message !== "string") {
      merged.unity_footer_message = "";
    }
    if (!Array.isArray(merged.unity_footer_questions)) {
      merged.unity_footer_questions = [];
    }
    if (typeof merged.unity_launch_ring_image_url !== "string") {
      merged.unity_launch_ring_image_url = defaults.unity_launch_ring_image_url;
    }
    if (typeof merged.floating_launcher_tooltip !== "string") {
      merged.floating_launcher_tooltip = defaults.floating_launcher_tooltip;
    }
    if (typeof merged.floating_launcher_icon_url !== "string") {
      merged.floating_launcher_icon_url = defaults.floating_launcher_icon_url;
    }
    if (!Array.isArray(merged.floating_launcher_blocked_pages)) {
      merged.floating_launcher_blocked_pages = defaults.floating_launcher_blocked_pages.slice();
    }
    merged.floating_launcher_blocked_pages = normalizeClerkPageSlugList(
      merged.floating_launcher_blocked_pages
    );
    if (typeof merged.floating_launcher_context_mode !== "string") {
      merged.floating_launcher_context_mode = defaults.floating_launcher_context_mode;
    }
    if (typeof merged.floating_launcher_response_style_hint !== "string") {
      merged.floating_launcher_response_style_hint = defaults.floating_launcher_response_style_hint;
    }
    if (typeof merged.lead_capture_workflow !== "string") {
      merged.lead_capture_workflow = defaults.lead_capture_workflow;
    }
    if (typeof merged.lead_capture_endpoint !== "string") {
      merged.lead_capture_endpoint = defaults.lead_capture_endpoint;
    }
    if (typeof merged.voltage_unit_speech_rule !== "string") {
      merged.voltage_unit_speech_rule = defaults.voltage_unit_speech_rule;
    }
    if (typeof merged.content_grounding_policy !== "string") {
      merged.content_grounding_policy = defaults.content_grounding_policy;
    }
    if (typeof merged.unknown_answer_fallback !== "string") {
      merged.unknown_answer_fallback = defaults.unknown_answer_fallback;
    }
    if (!Array.isArray(merged.context_policy_rules)) {
      merged.context_policy_rules = [];
    }
    if (!Array.isArray(merged.skill_packs_fallback_ids)) {
      merged.skill_packs_fallback_ids = [];
    }
    if (!Array.isArray(merged.skill_pack_selection_rules)) {
      merged.skill_pack_selection_rules = [];
    }
    if (!Array.isArray(merged.skill_packs)) {
      merged.skill_packs = [];
    }
    if (!merged.intelligence_profiles || typeof merged.intelligence_profiles !== "object") {
      merged.intelligence_profiles = {};
    }
    if (!Array.isArray(merged.intelligence_routing_rules)) {
      merged.intelligence_routing_rules = [];
    }
    if (!Array.isArray(merged.syntax_awareness_glossary) && (!merged.syntax_awareness_glossary || typeof merged.syntax_awareness_glossary !== "object")) {
      merged.syntax_awareness_glossary = [];
    }
    if (!merged.page_context_profiles || typeof merged.page_context_profiles !== "object") {
      merged.page_context_profiles = {};
    }
    if (!Array.isArray(merged.tour_guide_routes)) {
      merged.tour_guide_routes = [];
    }
    if (!Array.isArray(merged.tour_guide_keyword_routes)) {
      merged.tour_guide_keyword_routes = [];
    }
    if (!merged.tour_guide_page_next_routes || typeof merged.tour_guide_page_next_routes !== "object") {
      merged.tour_guide_page_next_routes = {};
    }
    if (typeof merged.tour_guide_consent_prompt !== "string") {
      merged.tour_guide_consent_prompt = defaults.tour_guide_consent_prompt;
    }
    if (!merged.openai_turn_detection || typeof merged.openai_turn_detection !== "object") {
      merged.openai_turn_detection = Object.assign({}, defaults.openai_turn_detection);
    }
    if (!Number.isFinite(Number(merged.session_context_char_limit))) {
      merged.session_context_char_limit = defaults.session_context_char_limit;
    }
    merged.lock_character_to_default = merged.lock_character_to_default !== false;
    merged.floating_launcher_enabled = merged.floating_launcher_enabled !== false;
    merged.content_awareness_mode = merged.content_awareness_mode !== false;
    merged.lead_capture_enabled = merged.lead_capture_enabled !== false;
    merged.lead_capture_collect_company = merged.lead_capture_collect_company !== false;
    merged.lead_capture_prompt_intent = merged.lead_capture_prompt_intent !== false;
    merged.lead_capture_require_confirmation_email_consent =
      merged.lead_capture_require_confirmation_email_consent !== false;
    merged.lead_capture_prompt_newsletter = merged.lead_capture_prompt_newsletter !== false;
    merged.lead_capture_prompt_text_notifications = merged.lead_capture_prompt_text_notifications !== false;
    merged.lead_capture_prompt_sales_outreach =
      merged.lead_capture_prompt_sales_outreach !== false;
    if (!Number.isFinite(Number(merged.lead_capture_status_display_seconds))) {
      merged.lead_capture_status_display_seconds = defaults.lead_capture_status_display_seconds;
    }
    merged.customer_guide_enabled = merged.customer_guide_enabled !== false;
    merged.customer_memory_enabled = merged.customer_memory_enabled !== false;
    merged.customer_exit_sweep_enabled = merged.customer_exit_sweep_enabled !== false;
    merged.tour_guide_enabled = merged.tour_guide_enabled !== false;
    merged.tour_guide_allow_direct_navigation = merged.tour_guide_allow_direct_navigation !== false;
    if (!Number.isFinite(Number(merged.tour_guide_max_candidates))) {
      merged.tour_guide_max_candidates = defaults.tour_guide_max_candidates;
    }
    if (!Number.isFinite(Number(merged.customer_memory_max_entries))) {
      merged.customer_memory_max_entries = defaults.customer_memory_max_entries;
    }
    if (!Number.isFinite(Number(merged.customer_memory_excerpt_char_limit))) {
      merged.customer_memory_excerpt_char_limit = defaults.customer_memory_excerpt_char_limit;
    }
    merged.page_context_memory_enabled = merged.page_context_memory_enabled !== false;
    if (!Number.isFinite(Number(merged.page_context_memory_max_entries))) {
      merged.page_context_memory_max_entries = defaults.page_context_memory_max_entries;
    }
    if (!Number.isFinite(Number(merged.page_context_memory_excerpt_char_limit))) {
      merged.page_context_memory_excerpt_char_limit = defaults.page_context_memory_excerpt_char_limit;
    }
    if (typeof merged.customer_exit_sweep_prompt !== "string") {
      merged.customer_exit_sweep_prompt = defaults.customer_exit_sweep_prompt;
    }
    if (typeof merged.customer_exit_sweep_note_prompt !== "string") {
      merged.customer_exit_sweep_note_prompt = defaults.customer_exit_sweep_note_prompt;
    }
    if (typeof merged.customer_exit_sweep_saved_status !== "string") {
      merged.customer_exit_sweep_saved_status = defaults.customer_exit_sweep_saved_status;
    }
    if (typeof merged.customer_exit_sweep_skipped_status !== "string") {
      merged.customer_exit_sweep_skipped_status = defaults.customer_exit_sweep_skipped_status;
    }
    return merged;
  }

  function getEmbedOrigin(url) {
    try {
      return new URL(url, window.location.href).origin;
    } catch (_err) {
      return "";
    }
  }

  function detectVoiceEngine(cfg) {
    const explicit = coerceText(
      cfg && (cfg.voice_engine || cfg.voiceEngine || cfg.engine || cfg.voice_stack || cfg.voiceStack)
    ).toLowerCase();
    if (explicit === "hume" || explicit === "openai") return explicit;
    const embedUrl = coerceText(cfg && cfg.embed_url).toLowerCase();
    if (embedUrl.includes("/hume_renderer/")) return "hume";
    if (embedUrl.includes("/openai_renderer/")) return "openai";
    return "openai";
  }

  function getVoiceEngineLabel(cfg) {
    return detectVoiceEngine(cfg) === "hume" ? "Hume voice engine" : "OpenAI realtime voice";
  }
  function allowsHumeAuthlessConnect(cfg) {
    const explicitlyEnabled = Boolean(
      cfg &&
        (cfg.allow_hume_authless_connect === true ||
          cfg.allow_hume_authless_connect === "true")
    );
    if (!explicitlyEnabled) return false;
    const embedUrl = coerceText(cfg && cfg.embed_url).toLowerCase();
    if (embedUrl.includes("/hume_renderer/")) {
      // Current self-hosted Hume renderer requires explicit runtime auth.
      return false;
    }
    return true;
  }

  function getVoiceEngineMissingConfigMessage(cfg) {
    if (detectVoiceEngine(cfg) === "hume") {
      return "Voice session config is missing. Set Hume auth (accessToken/apiKey) in runtime auth and confirm embed_url points to hume_renderer.";
    }
    return "Voice session config is missing. Set openai_session_endpoint and openai_realtime_model in hume_character_config.js.";
  }

  function validateVoiceEngineConfig(cfg) {
    const engine = detectVoiceEngine(cfg);
    if (engine === "hume") {
      const auth = normalizeAuthConfig(cfg);
      if (!auth && !allowsHumeAuthlessConnect(cfg)) {
        return {
          ok: false,
          message:
            "Hume auth is missing. Provide runtime auth (accessToken or apiKey) before launching Meet with Clerk.",
        };
      }
      return { ok: true, engine: engine };
    }
    const openAiModel = coerceText(cfg.openai_realtime_model || cfg.openai_model || cfg.model);
    const openAiSessionEndpoint = coerceText(cfg.openai_session_endpoint || cfg.openai_session_url);
    if (!openAiModel || !openAiSessionEndpoint) {
      return {
        ok: false,
        message:
          "OpenAI realtime config is incomplete. Set openai_session_endpoint and openai_realtime_model in hume_character_config.js.",
      };
    }
    return { ok: true, engine: engine };
  }

  function resolveOpenAiRendererFallbackUrl(cfg) {
    const explicit = coerceText(
      cfg &&
        (cfg.openai_embed_url ||
          cfg.openaiEmbedUrl ||
          cfg.openai_renderer_embed_url ||
          cfg.openaiRendererEmbedUrl)
    );
    if (explicit) return explicit;
    const embedUrl = coerceText(cfg && cfg.embed_url);
    if (embedUrl && /\/openai_renderer\//i.test(embedUrl)) return embedUrl;
    if (embedUrl && /\/hume_renderer\//i.test(embedUrl)) {
      return embedUrl.replace(/\/hume_renderer\//i, "/openai_renderer/");
    }
    return "/UnityEnergy/openai_renderer/index.html?v=20260423r5";
  }

  function buildOpenAiFallbackConfig(cfg) {
    if (!cfg || typeof cfg !== "object") return null;
    const fallbackExplicitlyEnabled =
      cfg.allow_openai_fallback === true || cfg.allow_openai_voice_fallback === true;
    if (!fallbackExplicitlyEnabled) return null;
    const sessionEndpoint = coerceText(cfg.openai_session_endpoint || cfg.openai_session_url);
    const model = coerceText(cfg.openai_realtime_model || cfg.openai_model || cfg.model);
    if (!sessionEndpoint || !model) return null;
    const fallbackEmbedUrl = resolveOpenAiRendererFallbackUrl(cfg);
    if (!fallbackEmbedUrl) return null;
    return Object.assign({}, cfg, {
      voice_engine: "openai",
      embed_url: fallbackEmbedUrl,
    });
  }

  function normalizeAuthConfig(cfg) {
    if (!cfg || typeof cfg !== "object") return null;
    const auth = cfg.auth && typeof cfg.auth === "object" ? cfg.auth : {};
    const runtimeAuth = getRuntimeAuthCandidate();
    const mergedAuth = Object.assign({}, auth);
    if (runtimeAuth) {
      if (!mergedAuth.type) mergedAuth.type = runtimeAuth.type;
      if (!mergedAuth.value) mergedAuth.value = runtimeAuth.value;
      if (runtimeAuth.type === "accessToken" && !mergedAuth.accessToken) {
        mergedAuth.accessToken = runtimeAuth.value;
      }
      if (runtimeAuth.type === "apiKey" && !mergedAuth.apiKey) {
        mergedAuth.apiKey = runtimeAuth.value;
      }
    }
    return normalizeRuntimeAuthCandidate(mergedAuth);
  }

  function buildHumeConnectConfig(cfg, launchSession) {
    if (!cfg || typeof cfg !== "object") return null;
    const auth = normalizeAuthConfig(cfg);
    const allowAuthless = allowsHumeAuthlessConnect(cfg);
    if (!auth && !allowAuthless) return null;
    const forceVoiceAsConfigId = cfg.experimental_force_voice_id_as_config_id === true;
    const forcedConfigIdFromVoice = coerceText(cfg.voice_id || cfg.openai_voice);
    const connectConfig = {
      hostname: coerceText(cfg.hume_hostname || cfg.hostname) || "api.hume.ai",
      reconnectAttempts: Number.isFinite(Number(cfg.hume_reconnect_attempts || cfg.reconnectAttempts))
        ? Math.max(0, Math.min(80, Math.floor(Number(cfg.hume_reconnect_attempts || cfg.reconnectAttempts))))
        : 30,
      debug: Boolean(cfg.hume_debug || cfg.debug),
    };
    if (auth) {
      connectConfig.auth = auth;
    }
    const configId = forceVoiceAsConfigId
      ? forcedConfigIdFromVoice || coerceText(cfg.hume_config_id || cfg.config_id)
      : coerceText(cfg.hume_config_id || cfg.config_id);
    if (configId) connectConfig.configId = configId;
    const voiceId = coerceText(cfg.hume_voice_id || cfg.voice_id || cfg.openai_voice);
    if (voiceId) {
      connectConfig.voiceId = voiceId;
      connectConfig.voice_id = voiceId;
    }
    const configVersion = Number(cfg.config_version);
    if (Number.isFinite(configVersion)) {
      connectConfig.configVersion = Math.max(0, Math.floor(configVersion));
    }
    const resumedChatGroupId = coerceText(
      launchSession &&
      launchSession.contextPayload &&
      typeof launchSession.contextPayload === "object" &&
      (launchSession.contextPayload.resumed_chat_group_id ||
        launchSession.contextPayload.resumedChatGroupId ||
        launchSession.contextPayload.chat_group_id ||
        launchSession.contextPayload.chatGroupId)
    );
    if (resumedChatGroupId) {
      connectConfig.resumedChatGroupId = resumedChatGroupId;
    }
    return connectConfig;
  }

  function normalizeSessionVariables(cfg) {
    const source = cfg && typeof cfg.session_variables === "object" ? cfg.session_variables : null;
    if (!source) return null;
    const result = {};
    Object.entries(source).forEach(function ([key, value]) {
      if (!key) return;
      if (value === null || value === undefined) return;
      result[key] = String(value);
    });
    return Object.keys(result).length > 0 ? result : null;
  }

  function normalizeVoiceId(cfg) {
    if (!cfg || typeof cfg !== "object") return "";
    const voiceId = typeof cfg.voice_id === "string" ? cfg.voice_id.trim() : "";
    return voiceId || "";
  }
  function resolveConfigId(cfg) {
    if (!cfg || typeof cfg !== "object") return "";
    const directConfigId = typeof cfg.config_id === "string" ? cfg.config_id.trim() : "";
    if (directConfigId) return directConfigId;
    const voiceId = normalizeVoiceId(cfg);
    return voiceId || "";
  }
  function shouldShowExperimentalVoiceIndicator(cfg) {
    return Boolean(cfg && cfg.experimental_voice_indicator_enabled);
  }
  function getExperimentalVoiceLabel(cfg) {
    if (!cfg || typeof cfg !== "object") return "";
    const explicit = coerceText(cfg.experimental_active_voice_label);
    if (explicit) return explicit;
    const labels =
      cfg.experimental_voice_labels && typeof cfg.experimental_voice_labels === "object"
        ? cfg.experimental_voice_labels
        : {};
    const voiceId = normalizeVoiceId(cfg);
    if (!voiceId) return "";
    return coerceText(labels[voiceId]);
  }
  function getExperimentalVoiceDescriptor(cfg) {
    if (!shouldShowExperimentalVoiceIndicator(cfg)) return "";
    const voiceId = normalizeVoiceId(cfg);
    const label = getExperimentalVoiceLabel(cfg);
    const forceVoiceAsConfigId = cfg && cfg.experimental_force_voice_id_as_config_id === true;
    const humeConfigId = forceVoiceAsConfigId
      ? coerceText(voiceId || cfg.openai_voice)
      : coerceText(cfg && (cfg.hume_config_id || cfg.config_id));
    const configSuffix = humeConfigId ? ` | cfg:${humeConfigId}` : "";
    if (label && voiceId) return `${label} (${voiceId}${configSuffix})`;
    if (label) return label;
    if (voiceId) return `${voiceId}${configSuffix}`;
    return "";
  }

  function coerceText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function normalizeMptsSpeechText(value) {
    const text = coerceText(value);
    if (!text) return text;
    let normalized = text;
    normalized = normalized.replace(
      /\bM(?:\s+|[.\-]\s*)P(?:\s+|[.\-]\s*)T(?:\s+|[.\-]\s*)S(?:['’]s|s)?\b/gi,
      "M P T S"
    );
    normalized = normalized.replace(/\bMPTS(?:['’]s|s)?\b/gi, "M P T S");
    normalized = normalized.replace(/\bMPT(?:['’]s|s)?\b/gi, "M P T S");
    normalized = normalized.replace(/\bMP(?:['’]s|s)?\b/g, "M P T S");
    return normalized;
  }

  function containsMptsSpeechDrift(value) {
    const sample = coerceText(value);
    if (!sample) return false;
    const hasCanonicalSpacedForm = /\bM(?:\s+|[.\-]\s*)P(?:\s+|[.\-]\s*)T(?:\s+|[.\-]\s*)S\b/i.test(sample);
    const hasShorthandForm = /\b(?:MPTS|MPT|MP)(?:['’]s|s)?\b/i.test(sample);
    return hasShorthandForm || !hasCanonicalSpacedForm && /\bmpts\b/i.test(sample);
  }

  function normalizeVoltageSpeechText(value) {
    const text = coerceText(value);
    if (!text) return text;
    const resolveVoltageUnit = function (prefix) {
      const normalizedPrefix = coerceText(prefix);
      if (normalizedPrefix === "k" || normalizedPrefix === "K") return "kilovolts";
      if (normalizedPrefix === "m") return "millivolts";
      if (normalizedPrefix === "M") return "megavolts";
      return "volts";
    };
    let normalized = text;
    normalized = normalized.replace(
      /\b(\d+(?:\.\d+)?)\s*([kKmM]?)\s*VAC\b/gi,
      function (_match, magnitude, prefix) {
        return `${magnitude} ${resolveVoltageUnit(prefix)} AC`;
      }
    );
    normalized = normalized.replace(
      /\b(\d+(?:\.\d+)?)\s*([kKmM]?)\s*VDC\b/gi,
      function (_match, magnitude, prefix) {
        return `${magnitude} ${resolveVoltageUnit(prefix)} DC`;
      }
    );
    normalized = normalized.replace(
      /\b(\d+(?:\.\d+)?)\s*([kKmM]?)\s*V\b/gi,
      function (_match, magnitude, prefix) {
        return `${magnitude} ${resolveVoltageUnit(prefix)}`;
      }
    );
    return normalizeMptsSpeechText(normalized);
  }

  function normalizeVoltageSpeechValue(value, depth) {
    const level = Number.isFinite(depth) ? depth : 0;
    if (value === null || value === undefined) return value;
    if (typeof value === "string") return normalizeVoltageSpeechText(value);
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (Array.isArray(value)) {
      if (level >= 5) return value.slice(0, 64);
      return value.slice(0, 64).map(function (entry) {
        return normalizeVoltageSpeechValue(entry, level + 1);
      });
    }
    if (typeof value === "object") {
      if (level >= 5) return value;
      const normalizedObject = {};
      Object.entries(value).forEach(function ([key, entry]) {
        normalizedObject[key] = normalizeVoltageSpeechValue(entry, level + 1);
      });
      return normalizedObject;
    }
    return value;
  }

  function getVoltageUnitSpeechRule(cfg) {
    const configured = coerceText(cfg && cfg.voltage_unit_speech_rule);
    if (configured) return configured;
    return "Before finalizing each spoken response, rewrite voltage abbreviations into spoken units: '480V' or '480 V' becomes '480 volts'; '13.8kV' becomes '13.8 kilovolts'; '24VDC' becomes '24 volts DC'.";
  }

  function getMptsSpeechRule(cfg) {
    const configured = coerceText(cfg && cfg.mpts_speech_rule);
    if (configured) return configured;
    return "Always articulate the acronym as 'M P T S' (all four letters), never as 'MP', 'MPT', or 'MPTs'.";
  }

  function getMptsFailSafeRule(cfg) {
    const configured = coerceText(cfg && cfg.mpts_fail_safe_rule);
    if (configured) return configured;
    return "Fail-safe: before finalizing each spoken response, normalize any 'MP', 'MPT', or 'MPTS' variant to 'M P T S' while preserving natural conversational tone.";
  }

  function buildMptsDriftFingerprint(value) {
    return coerceText(value)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function syncMptsSpeechGuardrailToSession(cfg, rawTranscriptText, normalizedTranscriptText, reason) {
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return false;
    if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
      pendingLaunchSession.contextPayload = {};
    }
    const payload = pendingLaunchSession.contextPayload;
    const rawText = coerceText(rawTranscriptText);
    const normalizedText = normalizeMptsSpeechText(normalizedTranscriptText || rawText);
    const hasDrift = containsMptsSpeechDrift(rawText);
    const driftFingerprint = buildMptsDriftFingerprint(rawText);
    const mptsSpeechRule = getMptsSpeechRule(cfg);
    const mptsFailSafeRule = getMptsFailSafeRule(cfg);

    payload.mpts_speech_enforcement_active = true;
    if (mptsSpeechRule && !coerceText(payload.mpts_speech_rule)) {
      payload.mpts_speech_rule = mptsSpeechRule;
    }
    if (mptsFailSafeRule && !coerceText(payload.mpts_fail_safe_rule)) {
      payload.mpts_fail_safe_rule = mptsFailSafeRule;
    }
    if (!coerceText(payload.mpts_canonical_acronym)) {
      payload.mpts_canonical_acronym = "M P T S";
    }
    if (!coerceText(payload.mpts_full_name)) {
      payload.mpts_full_name = "Maximum Power Transfer Solution";
    }
    if (!coerceText(payload.mpts_manage_layer_positioning)) {
      payload.mpts_manage_layer_positioning =
        "M P T S lives in Unity's Manage layer inside Measure-Manage-Exchange.";
    }

    let shouldPostUpdate = false;
    if (hasDrift && driftFingerprint && driftFingerprint !== lastMptsDriftFingerprint) {
      mptsDriftEventCount += 1;
      lastMptsDriftFingerprint = driftFingerprint;
      payload.mpts_last_drift_at = new Date().toISOString();
      payload.mpts_last_drift_reason = coerceText(reason) || "transcript-drift-detected";
      payload.mpts_last_drift_source_excerpt = cleanReinterpretationText(rawText, 220);
      payload.mpts_last_drift_corrected_excerpt = cleanReinterpretationText(normalizedText, 220);
      shouldPostUpdate = true;
    }
    payload.mpts_drift_event_count = mptsDriftEventCount;
    payload.mpts_last_normalized_transcript_excerpt = cleanReinterpretationText(normalizedText, 220);

    if (shouldPostUpdate) {
      appendSessionDecision(pendingLaunchSession, "mpts-speech-drift-corrected", {
        drift_count: mptsDriftEventCount,
        reason: payload.mpts_last_drift_reason,
        source_excerpt: payload.mpts_last_drift_source_excerpt,
        corrected_excerpt: payload.mpts_last_drift_corrected_excerpt,
      });
      postToWidgetFrame({ type: "maxwellian_session_launch", payload: pendingLaunchSession });
    }
    return hasDrift;
  }

  function getDefaultCharacterId(cfg) {
    const explicit = coerceText((cfg && cfg.default_character_id) || (cfg && cfg.character_id));
    if (explicit) return explicit;
    const fallbackName = coerceText(cfg && cfg.character_name);
    return fallbackName || "clerk-maxwell";
  }

  function normalizeUiMode(value, cfg) {
    const candidate = coerceText(value || (cfg && cfg.default_ui_mode)).toLowerCase();
    if (candidate === "panel" || candidate === "inline" || candidate === "modal") return candidate;
    return "modal";
  }

  function normalizeContextSource(value, cfg) {
    const candidate = coerceText(value || (cfg && cfg.default_context_source));
    return candidate || "general";
  }
  function normalizeStringArray(value, maxItems) {
    if (typeof value === "string") {
      const single = coerceText(value);
      return single ? [single] : [];
    }
    if (!Array.isArray(value)) return [];
    const limit = Number.isFinite(maxItems) ? Math.max(1, Math.floor(maxItems)) : 24;
    const result = [];
    value.forEach(function (item) {
      const text = coerceText(item);
      if (!text || result.includes(text)) return;
      result.push(text);
    });
    return result.slice(0, limit);
  }

  function normalizeStringArrayLower(value, maxItems) {
    return normalizeStringArray(value, maxItems)
      .map(function (entry) { return entry.toLowerCase(); })
      .filter(Boolean);
  }

  function matchesPattern(candidate, pattern) {
    const normalizedCandidate = coerceText(candidate).toLowerCase();
    const normalizedPattern = coerceText(pattern).toLowerCase();
    if (!normalizedPattern) return false;
    if (normalizedPattern === "*") return true;
    if (!normalizedCandidate) return false;
    if (!normalizedPattern.includes("*")) return normalizedCandidate === normalizedPattern;
    const escaped = normalizedPattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
    try {
      return new RegExp(`^${escaped}$`, "i").test(normalizedCandidate);
    } catch (_err) {
      return normalizedCandidate === normalizedPattern;
    }
  }

  function matchesAnyPattern(candidate, patterns) {
    if (!Array.isArray(patterns) || patterns.length === 0) return true;
    return patterns.some(function (pattern) { return matchesPattern(candidate, pattern); });
  }

  function collectLaunchModes(launchSession) {
    const payload = launchSession && typeof launchSession.contextPayload === "object" ? launchSession.contextPayload : {};
    const result = [];
    const collect = function (value) {
      const mode = coerceText(value).toLowerCase();
      if (!mode || result.includes(mode)) return;
      result.push(mode);
    };
    collect(payload.mode);
    collect(payload.conversation_mode);
    collect(launchSession && launchSession.uiMode);
    return result;
  }

  function collectLaunchContextSources(launchSession) {
    const payload = launchSession && typeof launchSession.contextPayload === "object" ? launchSession.contextPayload : {};
    const result = [];
    const collect = function (value) {
      const source = coerceText(value).toLowerCase();
      if (!source || result.includes(source)) return;
      result.push(source);
    };
    collect(launchSession && launchSession.contextSource);
    collect(launchSession && launchSession.legacyContext);
    collect(payload.context_source);
    collect(payload.context);
    return result;
  }

  function normalizeTokenBudgetProfile(entry) {
    const source =
      entry && typeof entry === "object" && entry.token_budget && typeof entry.token_budget === "object"
        ? entry.token_budget
        : entry && typeof entry === "object" && entry.tokenBudget && typeof entry.tokenBudget === "object"
          ? entry.tokenBudget
          : {};
    const normalized = {};
    const readBudget = function (key, legacyKey) {
      const raw = source[key] !== undefined ? source[key] : source[legacyKey];
      if (!Number.isFinite(Number(raw))) return;
      normalized[key] = Math.max(1, Math.floor(Number(raw)));
    };
    readBudget("input_tokens_soft", "inputTokensSoft");
    readBudget("input_tokens_hard", "inputTokensHard");
    readBudget("output_tokens_soft", "outputTokensSoft");
    readBudget("output_tokens_hard", "outputTokensHard");
    return normalized;
  }

  function normalizeIntelligenceProfiles(cfg) {
    const source = cfg && cfg.intelligence_profiles;
    const profiles = {};
    const normalizeProfile = function (profileId, entry) {
      if (!entry || typeof entry !== "object") return;
      const id = coerceText(profileId || entry.id || entry.profile_id || entry.profileId).toLowerCase();
      if (!id) return;
      const contextLimitRaw =
        entry.session_context_char_limit !== undefined
          ? entry.session_context_char_limit
          : entry.sessionContextCharLimit;
      const skillExcerptRaw =
        entry.skill_pack_excerpt_char_limit !== undefined
          ? entry.skill_pack_excerpt_char_limit
          : entry.skillPackExcerptCharLimit;
      const maxPacksRaw =
        entry.skill_packs_max_selected !== undefined
          ? entry.skill_packs_max_selected
          : entry.skillPacksMaxSelected;
      profiles[id] = {
        id: id,
        label: coerceText(entry.label || entry.name) || id,
        description: coerceText(entry.description || entry.summary),
        configId: coerceText(entry.config_id || entry.configId),
        voiceId: coerceText(entry.voice_id || entry.voiceId),
        responseStyle: coerceText(entry.response_style || entry.responseStyle),
        sessionContextCharLimit: Number.isFinite(Number(contextLimitRaw))
          ? clampNumber(contextLimitRaw, 800, 8000, 3600)
          : null,
        skillPackExcerptCharLimit: Number.isFinite(Number(skillExcerptRaw))
          ? clampNumber(skillExcerptRaw, 600, 6000, 2400)
          : null,
        skillPacksMaxSelected: Number.isFinite(Number(maxPacksRaw))
          ? clampNumber(maxPacksRaw, 1, 8, 3)
          : null,
        tokenBudget: normalizeTokenBudgetProfile(entry),
      };
    };

    if (Array.isArray(source)) {
      source.forEach(function (entry) {
        normalizeProfile("", entry);
      });
    } else if (source && typeof source === "object") {
      Object.entries(source).forEach(function ([profileId, entry]) {
        normalizeProfile(profileId, entry);
      });
    }
    return profiles;
  }

  function normalizeIntelligenceRoutingRules(cfg) {
    const source = Array.isArray(cfg && cfg.intelligence_routing_rules) ? cfg.intelligence_routing_rules : [];
    return source
      .map(function (rule, index) {
        if (!rule || typeof rule !== "object") return null;
        const profileId = coerceText(rule.profile_id || rule.profileId).toLowerCase();
        if (!profileId) return null;
        return {
          id: coerceText(rule.id) || `intelligence-routing-${index + 1}`,
          profileId: profileId,
          contextSources: normalizeStringArrayLower(
            rule.context_sources !== undefined ? rule.context_sources : rule.contextSources,
            24
          ),
          modes: normalizeStringArrayLower(
            rule.modes !== undefined ? rule.modes : rule.conversation_modes,
            16
          ),
          entryPoints: normalizeStringArrayLower(
            rule.entry_points !== undefined ? rule.entry_points : rule.entryPoints,
            16
          ),
          uiModes: normalizeStringArrayLower(
            rule.ui_modes !== undefined ? rule.ui_modes : rule.uiModes,
            8
          ),
          requireFields: normalizeStringArray(
            rule.require_fields !== undefined ? rule.require_fields : rule.requireFields,
            12
          ),
        };
      })
      .filter(Boolean);
  }

  function getIntelligenceRoutingConfig(cfg) {
    const profiles = normalizeIntelligenceProfiles(cfg);
    const profileIds = Object.keys(profiles);
    const configuredDefault = coerceText(cfg && cfg.intelligence_default_profile_id).toLowerCase();
    const fallbackDefaultId = configuredDefault && profiles[configuredDefault]
      ? configuredDefault
      : profiles["standard-guidance"]
        ? "standard-guidance"
        : profileIds[0] || "";
    const rules = normalizeIntelligenceRoutingRules(cfg).filter(function (rule) {
      return Boolean(rule && rule.profileId && profiles[rule.profileId]);
    });
    const enabled = (Boolean(cfg && cfg.intelligence_routing_enabled) || rules.length > 0) && profileIds.length > 0;
    return {
      enabled: enabled,
      profiles: profiles,
      rules: rules,
      defaultProfileId: fallbackDefaultId,
    };
  }

  function evaluateIntelligenceProfile(launchSession, cfg) {
    const routing = getIntelligenceRoutingConfig(cfg);
    if (!routing.enabled) return null;
    const payload = launchSession && typeof launchSession.contextPayload === "object" ? launchSession.contextPayload : {};
    const contextSources = collectLaunchContextSources(launchSession);
    const modes = collectLaunchModes(launchSession);
    const entryPoint = coerceText(payload.entry_point || payload.entryPoint).toLowerCase();
    const uiMode = coerceText(launchSession && launchSession.uiMode).toLowerCase();

    const requestedProfileId = coerceText(
      payload.intelligence_profile_id ||
      payload.intelligence_profile ||
      payload.model_profile_id ||
      payload.model_profile
    ).toLowerCase();
    if (requestedProfileId && routing.profiles[requestedProfileId]) {
      return {
        profileId: requestedProfileId,
        profile: routing.profiles[requestedProfileId],
        source: "explicit-request",
        ruleId: "",
        contextSources: contextSources,
        modes: modes,
        entryPoint: entryPoint,
      };
    }

    let matchedRule = null;
    for (let i = 0; i < routing.rules.length; i += 1) {
      const rule = routing.rules[i];
      const sourceMatch =
        rule.contextSources.length === 0 ||
        contextSources.some(function (source) { return matchesAnyPattern(source, rule.contextSources); });
      if (!sourceMatch) continue;
      const modeMatch =
        rule.modes.length === 0 || modes.some(function (mode) { return matchesAnyPattern(mode, rule.modes); });
      if (!modeMatch) continue;
      const entryPointMatch = rule.entryPoints.length === 0 || matchesAnyPattern(entryPoint, rule.entryPoints);
      if (!entryPointMatch) continue;
      const uiModeMatch = rule.uiModes.length === 0 || matchesAnyPattern(uiMode, rule.uiModes);
      if (!uiModeMatch) continue;
      const missingFields = getMissingContextFields(payload, rule.requireFields);
      if (missingFields.length > 0) continue;
      matchedRule = rule;
      break;
    }

    const profileId = matchedRule ? matchedRule.profileId : routing.defaultProfileId;
    if (!profileId || !routing.profiles[profileId]) return null;
    return {
      profileId: profileId,
      profile: routing.profiles[profileId],
      source: matchedRule ? "rule" : "default",
      ruleId: matchedRule ? matchedRule.id : "",
      contextSources: contextSources,
      modes: modes,
      entryPoint: entryPoint,
    };
  }

  function applyIntelligenceProfile(launchSession, cfg) {
    if (!launchSession || typeof launchSession !== "object") return null;
    if (!launchSession.contextPayload || typeof launchSession.contextPayload !== "object") {
      launchSession.contextPayload = {};
    }
    const decision = evaluateIntelligenceProfile(launchSession, cfg);
    if (!decision || !decision.profile) return null;
    const profile = decision.profile;
    const payload = launchSession.contextPayload;
    launchSession.intelligenceProfile = {
      id: decision.profileId,
      label: profile.label || decision.profileId,
      description: profile.description || "",
      configId: profile.configId || "",
      voiceId: profile.voiceId || "",
      responseStyle: profile.responseStyle || "",
      sessionContextCharLimit: profile.sessionContextCharLimit,
      skillPackExcerptCharLimit: profile.skillPackExcerptCharLimit,
      skillPacksMaxSelected: profile.skillPacksMaxSelected,
      tokenBudget: profile.tokenBudget || {},
    };

    payload.intelligence_profile_id = decision.profileId;
    assignContextValueIfMissing(payload, "intelligence_profile_label", launchSession.intelligenceProfile.label);
    assignContextValueIfMissing(payload, "intelligence_profile_source", decision.source);
    assignContextValueIfMissing(payload, "intelligence_profile_rule_id", decision.ruleId);
    assignContextValueIfMissing(payload, "response_style_hint", launchSession.intelligenceProfile.responseStyle);
    if (profile.sessionContextCharLimit !== null) {
      assignContextValueIfMissing(payload, "session_context_char_limit", profile.sessionContextCharLimit);
    }
    if (profile.skillPackExcerptCharLimit !== null) {
      assignContextValueIfMissing(payload, "skill_pack_excerpt_char_limit", profile.skillPackExcerptCharLimit);
    }
    if (profile.skillPacksMaxSelected !== null) {
      assignContextValueIfMissing(payload, "skill_packs_max_selected", profile.skillPacksMaxSelected);
    }
    if (profile.tokenBudget && Object.keys(profile.tokenBudget).length > 0) {
      assignContextValueIfMissing(payload, "token_budget_profile", profile.tokenBudget);
      assignContextValueIfMissing(payload, "token_budget_profile_id", decision.profileId);
    }

    appendSessionDecision(launchSession, "intelligence-profile-selected", {
      profile_id: decision.profileId,
      profile_label: launchSession.intelligenceProfile.label,
      source: decision.source,
      rule_id: decision.ruleId,
      context_sources: decision.contextSources,
      modes: decision.modes,
      entry_point: decision.entryPoint,
      token_budget: profile.tokenBudget || {},
    });
    return launchSession.intelligenceProfile;
  }

  function getObjectPathValue(source, path) {
    if (!source || typeof source !== "object") return undefined;
    const normalizedPath = coerceText(path);
    if (!normalizedPath) return undefined;
    const segments = normalizedPath.split(".").map(function (seg) { return coerceText(seg); }).filter(Boolean);
    if (segments.length === 0) return undefined;
    let cursor = source;
    for (let i = 0; i < segments.length; i += 1) {
      const key = segments[i];
      if (!cursor || typeof cursor !== "object" || !(key in cursor)) return undefined;
      cursor = cursor[key];
    }
    return cursor;
  }

  function hasMeaningfulValue(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === "string") return Boolean(value.trim());
    if (typeof value === "number") return Number.isFinite(value);
    if (typeof value === "boolean") return true;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object") return Object.keys(value).length > 0;
    return false;
  }

  function getMissingContextFields(payload, requiredFields) {
    if (!Array.isArray(requiredFields) || requiredFields.length === 0) return [];
    const missing = [];
    requiredFields.forEach(function (fieldPath) {
      const normalizedFieldPath = coerceText(fieldPath);
      if (!normalizedFieldPath) return;
      if (hasMeaningfulValue(getObjectPathValue(payload, normalizedFieldPath))) return;
      missing.push(normalizedFieldPath);
    });
    return missing;
  }

  function summarizeDecisionValue(value, depth) {
    const level = Number.isFinite(depth) ? depth : 0;
    if (value === null || value === undefined) return "";
    if (typeof value === "string") {
      const text = value.trim();
      if (!text) return "";
      return text.length > 220 ? `${text.slice(0, 220)}…` : text;
    }
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (Array.isArray(value)) {
      if (level >= 2) return [];
      return value
        .slice(0, 8)
        .map(function (item) { return summarizeDecisionValue(item, level + 1); })
        .filter(function (item) { return hasMeaningfulValue(item); });
    }
    if (typeof value === "object") {
      if (level >= 2) return "[object]";
      const normalized = {};
      Object.entries(value)
        .slice(0, 10)
        .forEach(function ([key, item]) {
          const normalizedKey = coerceText(key);
          if (!normalizedKey) return;
          const summarized = summarizeDecisionValue(item, level + 1);
          if (!hasMeaningfulValue(summarized)) return;
          normalized[normalizedKey] = summarized;
        });
      return normalized;
    }
    return coerceText(String(value));
  }

  function ensureSessionDecisionLog(session) {
    if (!session || typeof session !== "object") return [];
    if (!Array.isArray(session.decisionLog)) {
      session.decisionLog = [];
    }
    return session.decisionLog;
  }

  function syncSessionDecisionLogToPayload(session) {
    if (!session || typeof session !== "object") return;
    if (!session.contextPayload || typeof session.contextPayload !== "object") {
      session.contextPayload = {};
    }
    const compactLog = Array.isArray(session.decisionLog) ? session.decisionLog.slice(-16) : [];
    session.contextPayload.session_decision_log = compactLog;
    session.contextPayload.session_decision_count = compactLog.length;
  }

  function appendSessionDecision(session, type, details) {
    if (!session || typeof session !== "object") return;
    const log = ensureSessionDecisionLog(session);
    const normalizedType = coerceText(type) || "event";
    const entry = {
      idx: log.length + 1,
      type: normalizedType,
      at: new Date().toISOString(),
      details: summarizeDecisionValue(details, 0),
    };
    log.push(entry);
    if (log.length > 24) {
      session.decisionLog = log.slice(-24);
    }
    syncSessionDecisionLogToPayload(session);
  }

  function assignContextValueIfMissing(payload, key, value) {
    if (!payload || typeof payload !== "object") return;
    const normalizedKey = coerceText(key);
    if (!normalizedKey || value === null || value === undefined) return;
    if (hasMeaningfulValue(payload[normalizedKey])) return;
    payload[normalizedKey] = value;
  }

  function coerceLaunchContextPayload(value) {
    if (value === null || value === undefined) return {};
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return {};
      return { context: normalizeVoltageSpeechText(trimmed) };
    }
    if (Array.isArray(value)) {
      return normalizeVoltageSpeechValue({ items: value.slice(0, 32) }, 0);
    }
    if (typeof value !== "object") {
      return { value: normalizeVoltageSpeechText(String(value)) };
    }
    const result = {};
    Object.entries(value).forEach(function ([key, item]) {
      const normalizedKey = coerceText(key);
      if (!normalizedKey) return;
      if (item === null || item === undefined) return;
      if (typeof item === "string") {
        const str = item.trim();
        if (str) result[normalizedKey] = normalizeVoltageSpeechText(str);
        return;
      }
      if (typeof item === "number" || typeof item === "boolean") {
        result[normalizedKey] = item;
        return;
      }
      if (Array.isArray(item)) {
        result[normalizedKey] = item.slice(0, 32);
        return;
      }
      if (typeof item === "object") {
        result[normalizedKey] = item;
      }
    });
    return normalizeVoltageSpeechValue(result, 0);
  }

  function resolveLegacyContext(contextSource, contextPayload) {
    const fromPayload = coerceText(
      contextPayload &&
        typeof contextPayload === "object" &&
        typeof contextPayload.context === "string"
        ? contextPayload.context
        : ""
    );
    if (fromPayload) return fromPayload;
    return coerceText(contextSource) || "general";
  }

  function buildLaunchSessionSignature(session) {
    if (!session || typeof session !== "object") return "";
    const payload = session && typeof session.contextPayload === "object" ? session.contextPayload : {};
    const fields = [
      coerceText(session.characterId).toLowerCase(),
      coerceText(session.contextSource).toLowerCase(),
      coerceText(session.uiMode).toLowerCase(),
      coerceText(payload.context).toLowerCase(),
      coerceText(payload.mode).toLowerCase(),
      coerceText(payload.source_page).toLowerCase(),
      coerceText(payload.entry_point).toLowerCase(),
      coerceText(payload.intelligence_profile_id).toLowerCase(),
    ];
    return fields.join("|");
  }

  function combineContextBlocks(blocks, maxChars) {
    if (!Array.isArray(blocks)) return "";
    const unique = [];
    blocks.forEach(function (block) {
      const text = coerceText(block);
      if (!text || unique.includes(text)) return;
      unique.push(text);
    });
    if (unique.length === 0) return "";
    const limit = Number.isFinite(maxChars) ? Math.max(800, Math.floor(maxChars)) : 3600;
    const combined = unique.join("\n\n");
    return combined.length > limit ? `${combined.slice(0, limit)}…` : combined;
  }

  function normalizeSyntaxAwarenessGlossary(cfg) {
    const source = cfg && cfg.syntax_awareness_glossary;
    const entries = [];
    if (Array.isArray(source)) {
      source.forEach(function (entry) {
        if (typeof entry === "string") {
          const text = coerceText(entry);
          if (!text) return;
          const parts = text.split(":");
          const term = coerceText(parts[0]);
          const definition = coerceText(parts.slice(1).join(":"));
          if (!term || !definition) return;
          entries.push({ term: term, definition: definition });
          return;
        }
        if (!entry || typeof entry !== "object") return;
        const term = coerceText(entry.term || entry.name || entry.key);
        const definition = coerceText(entry.definition || entry.value || entry.notes);
        if (!term || !definition) return;
        entries.push({ term: term, definition: definition });
      });
    } else if (source && typeof source === "object") {
      Object.entries(source).forEach(function ([term, definition]) {
        const normalizedTerm = coerceText(term);
        const normalizedDefinition = coerceText(definition);
        if (!normalizedTerm || !normalizedDefinition) return;
        entries.push({ term: normalizedTerm, definition: normalizedDefinition });
      });
    }
    return entries.slice(0, 24);
  }

  function buildSyntaxAwarenessContext(cfg) {
    const framing = coerceText(cfg && cfg.syntax_awareness_context);
    const glossary = normalizeSyntaxAwarenessGlossary(cfg);
    const glossaryBlock =
      glossary.length > 0
        ? `Core definitions:\n- ${glossary
            .map(function (entry) { return `${entry.term}: ${entry.definition}`; })
            .join("\n- ")}`
        : "";
    return combineContextBlocks([framing, glossaryBlock], 2200);
  }

  function normalizePageContextProfiles(cfg) {
    const source = cfg && cfg.page_context_profiles && typeof cfg.page_context_profiles === "object"
      ? cfg.page_context_profiles
      : {};
    const profiles = {};
    Object.entries(source).forEach(function ([id, entry]) {
      const normalizedId = coerceText(id).toLowerCase();
      if (!normalizedId || !entry || typeof entry !== "object") return;
      const keyPoints = normalizeStringArray(
        entry.key_points !== undefined ? entry.key_points : entry.keyPoints,
        12
      );
      profiles[normalizedId] = {
        id: normalizedId,
        title: coerceText(entry.title || entry.name),
        summary: coerceText(entry.summary || entry.description),
        sessionContext: coerceText(entry.session_context || entry.sessionContext),
        keyPoints: keyPoints,
        sourceFiles: normalizeStringArray(
          entry.source_files !== undefined ? entry.source_files : entry.sourceFiles,
          24
        ),
        contextSources: normalizeStringArrayLower(
          entry.context_sources !== undefined ? entry.context_sources : entry.contextSources,
          16
        ),
        skillPackIds: normalizeStringArrayLower(
          entry.skill_pack_ids !== undefined ? entry.skill_pack_ids : entry.skillPackIds,
          10
        ),
      };
    });
    return profiles;
  }

  function resolvePageContextProfileId(profile, payload) {
    return (
      normalizePageSlugToken(profile && profile.id) ||
      normalizePageSlugToken(payload && payload.source_page) ||
      normalizePageSlugToken(payload && payload.page_slug) ||
      normalizePageSlugToken(payload && payload.active_page_slug) ||
      normalizePageSlugToken(getCurrentPageSlug()) ||
      "index"
    );
  }

  function isContactConciergeLaunch(profileId, payload) {
    if (profileId !== "contact-us") return false;
    const source = payload && typeof payload === "object" ? payload : {};
    if (source.contact_concierge_entry === true) return true;
    const signature = [
      source.context,
      source.mode,
      source.conversation_mode,
      source.entry_point,
      source.session_context,
      source.likely_user_intent,
    ]
      .map(function (value) { return coerceText(value).toLowerCase(); })
      .filter(Boolean)
      .join(" ");
    if (!signature) return false;
    return /(contact-concierge|guided-intake|meet-with-clerk|concierge)/.test(signature);
  }

  function buildPageAwareOpeningLine(profile, payload) {
    const profileId = resolvePageContextProfileId(profile, payload);
    const explicit = coerceText(payload && payload.page_context_opening_line);
    if (explicit) return explicit;
    const profileTitle =
      coerceText(payload && payload.page_context_title) ||
      coerceText(profile && profile.title) ||
      humanizeSlugToken(profileId) ||
      "this page";
    const pageLabel = /page$/i.test(profileTitle) ? profileTitle : `${profileTitle} page`;
    if (profileId === "about-unity") {
      return "I see you're on the About Unity page. What would you like to clarify about Unity's mission or operating model?";
    }
    if (profileId === "unity-story") {
      return "I see you're on the Unity Introduction page. What from the story would you like to explore further?";
    }
    if (profileId === "our-systems") {
      return "I see you're on the Our Systems page. Which layer should we unpack first—Measure, Manage, or Exchange?";
    }
    if (profileId === "products-services") {
      return "I see you're on the Products and Services page. Which offering or workflow would you like to clarify?";
    }
    if (profileId === "customer-portals") {
      return "I see you're on the Customer Portals page. Which portal section would you like help interpreting?";
    }
    if (profileId === "electrical-energy-story") {
      return "I see you're on the Electrical Energy Story page. Which part of the field story should we break down first?";
    }
    if (profileId === "contact-us") {
      if (isContactConciergeLaunch(profileId, payload)) {
        return "I see you have come in from our Contact Details page through Work with Clerk Concierge. I can help you fill out the Start a Guide form, connect you with our team, or subscribe you to Maxwellian updates. What would you like to do first?";
      }
      return "I see you're on our Contact Details page. How can I help before handoff?";
    }
    if (profileId === "maxwellian") {
      return "I see you're in the Maxwellian library. Which brief or eInsights story would you like to discuss?";
    }
    if (profileId.startsWith("customer-")) {
      const customerName =
        coerceText(payload && payload.customer_name) ||
        humanizeSlugToken(profileId.replace(/^customer-/, ""));
      if (customerName) {
        return `I see you're on the ${customerName} customer page. What would you like help interpreting here?`;
      }
    }
    return `I see you're on the ${pageLabel}. What would you like to understand from this page?`;
  }

  function buildPageAwareFollowupPrompt(profile, payload) {
    const explicit = coerceText(payload && payload.page_context_followup_prompt);
    if (explicit) return explicit;
    const keyPoints = Array.isArray(profile && profile.keyPoints)
      ? profile.keyPoints.map(function (point) { return coerceText(point); }).filter(Boolean)
      : [];
    if (keyPoints.length > 0) {
      return `After answering, ask one concise follow-up tied to this page focus: ${keyPoints[0]}`;
    }
    const profileId = resolvePageContextProfileId(profile, payload);
    if (profileId === "our-systems") {
      return "After answering, ask which Measure, Manage, or Exchange layer they want to go deeper on next.";
    }
    if (profileId === "products-services") {
      return "After answering, ask which specific service path or deployment workflow they want clarified next.";
    }
    if (profileId === "electrical-energy-story") {
      return "After answering, ask which field-era transition or operational implication they want unpacked next.";
    }
    if (profileId === "contact-us") {
      if (isContactConciergeLaunch(profileId, payload)) {
        return "After answering, ask whether they want help filling Start a Guide details, meeting the agentic team, or joining Maxwellian updates.";
      }
      return "After answering, ask one concise closeout question before contact handoff.";
    }
    if (profileId.startsWith("customer-")) {
      return "After answering, ask which current customer chart signal or transformer pattern they want to review next.";
    }
    return "After answering, ask one concise follow-up question tied to the active page context.";
  }
  function buildPageAwareNameRequestLine(profile, payload) {
    const explicit = coerceText(payload && payload.page_context_name_request_line);
    if (explicit) return explicit;
    const profileId = resolvePageContextProfileId(profile, payload);
    if (profileId === "about-unity") {
      return "What from this About Unity page would you like to unpack first?";
    }
    if (profileId === "unity-story") {
      return "What part of this Unity Introduction page should we go deeper on first?";
    }
    if (profileId === "our-systems") {
      return "Which layer on this page should we start with: Measure, Manage, or Exchange?";
    }
    if (profileId === "products-services") {
      return "Which product or service on this page should we clarify first?";
    }
    if (profileId === "customer-portals") {
      return "Which customer portal section on this page should we review first?";
    }
    if (profileId === "electrical-energy-story") {
      return "Which section of this Electrical Energy Story page should we break down first?";
    }
    if (profileId === "contact-us") {
      if (isContactConciergeLaunch(profileId, payload)) {
        return "Would you like help with the Start a Guide intake fields (company, location, top power-quality challenge, timeline), meeting our team, or subscribing to Maxwellian updates?";
      }
      return "Before handoff, what should we prioritize from this contact page?";
    }
    if (profileId === "maxwellian") {
      return "Which brief or eInsights section on this page should we discuss first?";
    }
    if (profileId.startsWith("customer-")) {
      return "Which signal on this customer page should we interpret first?";
    }
    return "What on this page would you like to clarify first?";
  }

  function buildMeasureManageExchangeGuidance(profile, payload) {
    const profileId = resolvePageContextProfileId(profile, payload);
    const guidance = {
      mode: "balanced",
      pageFocus:
        "Tie this page conversation to Unity's Measure-Manage-Exchange sequence in practical operating terms.",
      measureFocus:
        "Measure focus: identify what should be observed first (reactive burden, harmonics, thermal stress, and field stability) before prescribing action.",
      manageFocus:
        "Manage focus: explain how M P T S and field harmonization reduce reactive/harmonic burden at the load and improve usable capacity.",
      exchangeFocus:
        "Exchange focus: explain how stabilized field behavior supports demand timing, storage coordination, and lower demand-charge exposure.",
    };
    if (profileId === "our-systems") {
      guidance.mode = "systems-breakdown";
      guidance.pageFocus =
        "Use a systems breakdown: define Measure, then Manage, then Exchange, and map each layer to implementation workflow.";
    } else if (profileId === "products-services") {
      guidance.mode = "services-mapping";
      guidance.pageFocus =
        "Map each offering to the layer it serves in Measure-Manage-Exchange, and connect the layer mapping to practical outcomes.";
    } else if (profileId === "about-unity" || profileId === "unity-story" || profileId === "founder-message" || profileId === "index") {
      guidance.mode = "doctrine-framing";
      guidance.pageFocus =
        "Translate Unity narrative into operating doctrine: Measure reveals field behavior, Manage harmonizes it, and Exchange coordinates stabilized capacity.";
    } else if (profileId === "electrical-energy-story") {
      guidance.mode = "causal-story";
      guidance.pageFocus =
        "Connect historical field behavior to modern doctrine: explain why Measure comes first, how Manage corrects burden, and where Exchange adds coordination.";
    } else if (profileId === "customer-portals" || profileId.startsWith("customer-")) {
      guidance.mode = "customer-operations";
      guidance.pageFocus =
        "Anchor answers to live customer evidence: what this page measures now, what should be managed next, and which exchange coordination actions follow.";
    } else if (profileId === "contact-us") {
      guidance.mode = "closeout";
      guidance.pageFocus =
        "Use a concise closeout recap of Measure-Manage-Exchange before handoff to contact workflow.";
    }
    return guidance;
  }

  function buildMeasureManageExchangeContextBlock(guidance) {
    if (!guidance || typeof guidance !== "object") return "";
    return combineContextBlocks(
      [
        `Measure-Manage-Exchange mode: ${coerceText(guidance.mode) || "balanced"}.`,
        coerceText(guidance.pageFocus),
        coerceText(guidance.measureFocus),
        coerceText(guidance.manageFocus),
        coerceText(guidance.exchangeFocus),
      ],
      2200
    );
  }

  function normalizePageSourceFileMap(cfg) {
    const source =
      cfg &&
      cfg.content_awareness_page_source_files &&
      typeof cfg.content_awareness_page_source_files === "object"
        ? cfg.content_awareness_page_source_files
        : {};
    const normalized = {};
    Object.entries(source).forEach(function ([key, value]) {
      const normalizedKey =
        normalizePageSlugToken(key) ||
        coerceText(key).toLowerCase();
      if (!normalizedKey) return;
      const files = normalizeStringArray(value, 24);
      if (files.length === 0) return;
      normalized[normalizedKey] = files;
    });
    return normalized;
  }

  function getCurrentPagePathname() {
    try {
      const pathname =
        window.location && typeof window.location.pathname === "string" ? window.location.pathname : "/";
      const normalized = coerceText(pathname);
      return normalized || "/";
    } catch (_err) {
      return "/";
    }
  }

  function getCurrentPageHref() {
    try {
      const href = window.location && typeof window.location.href === "string" ? window.location.href : "";
      return coerceText(href);
    } catch (_err) {
      return "";
    }
  }

  function normalizePostConversationRedirectUrl(value) {
    const candidate = coerceText(value);
    if (!candidate) return "";
    if (/^(?:javascript|data|vbscript):/i.test(candidate)) return "";
    try {
      const resolved = new URL(candidate, window.location.href);
      const protocol = coerceText(resolved.protocol).toLowerCase();
      if (protocol !== "http:" && protocol !== "https:") return "";
      if (resolved.origin !== window.location.origin) return "";
      return resolved.toString();
    } catch (_err) {
      return "";
    }
  }

  function resolvePostConversationRedirectUrl(launchSession) {
    if (!launchSession || typeof launchSession !== "object") return "";
    const payload =
      launchSession.contextPayload && typeof launchSession.contextPayload === "object"
        ? launchSession.contextPayload
        : {};
    const candidates = [
      payload.post_conversation_redirect_url,
      payload.postConversationRedirectUrl,
      launchSession.postConversationRedirectUrl,
      launchSession.post_conversation_redirect_url,
    ];
    for (let i = 0; i < candidates.length; i += 1) {
      const normalized = normalizePostConversationRedirectUrl(candidates[i]);
      if (normalized) return normalized;
    }
    return "";
  }

  function getCurrentPageFileName() {
    const pathname = getCurrentPagePathname();
    const filename = pathname.split("/").filter(Boolean).pop() || "index.html";
    if (filename.includes(".")) return filename;
    return `${filename}.html`;
  }

  function collectActivePageContextSnapshot() {
    const snapshot = {
      pathname: getCurrentPagePathname(),
      href: getCurrentPageHref(),
      fileName: getCurrentPageFileName(),
      title: "",
      metaDescription: "",
      headings: [],
      excerpt: "",
    };
    try {
      snapshot.title = coerceText(document.title);
      const metaDescriptionEl = document.querySelector("meta[name='description']");
      snapshot.metaDescription = coerceText(
        metaDescriptionEl && typeof metaDescriptionEl.getAttribute === "function"
          ? metaDescriptionEl.getAttribute("content")
          : ""
      );
      const headingNodes = Array.from(
        document.querySelectorAll("main h1, main h2, h1, h2")
      );
      snapshot.headings = headingNodes
        .map(function (node) {
          return coerceText(node && (node.innerText || node.textContent));
        })
        .filter(Boolean)
        .slice(0, 6);
      const mainEl = document.querySelector("main");
      const sourceText = coerceText(
        mainEl && (mainEl.innerText || mainEl.textContent)
          ? mainEl.innerText || mainEl.textContent
          : document.body
            ? document.body.innerText || document.body.textContent
            : ""
      )
        .replace(/\s+/g, " ")
        .trim();
      if (sourceText) {
        snapshot.excerpt = sourceText.length > 560 ? `${sourceText.slice(0, 560)}…` : sourceText;
      }
    } catch (_err) {}
    return snapshot;
  }

  function getCurrentPageSlug() {
    try {
      const pathname = window.location && typeof window.location.pathname === "string" ? window.location.pathname : "";
      const filename = pathname.split("/").filter(Boolean).pop() || "index";
      const slug = filename.replace(/\.[^/.]+$/, "").toLowerCase();
      return slug || "index";
    } catch (_err) {
      return "index";
    }
  }

  function normalizePageSlugToken(value) {
    const raw = coerceText(value).toLowerCase();
    if (!raw) return "";
    const withoutHash = raw.split("#")[0];
    const withoutQuery = withoutHash.split("?")[0];
    const filename = withoutQuery.split("/").filter(Boolean).pop() || withoutQuery;
    const normalized = filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return normalized || "";
  }

  function normalizeClerkPageSlugList(value) {
    return normalizeStringArray(value, 64)
      .map(function (entry) { return normalizePageSlugToken(entry); })
      .filter(Boolean);
  }

  function normalizeContentRetrievalText(value) {
    return coerceText(value)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildContentRetrievalTokens(value, maxTokens) {
    const normalized = normalizeContentRetrievalText(value);
    if (!normalized) return [];
    const limit = Number.isFinite(Number(maxTokens))
      ? Math.max(3, Math.floor(Number(maxTokens)))
      : 18;
    const tokens = [];
    normalized.split(" ").forEach(function (token) {
      if (!token || token.length < 3) return;
      if (CONTENT_RETRIEVAL_STOP_WORDS[token]) return;
      if (tokens.includes(token)) return;
      tokens.push(token);
    });
    return tokens.slice(0, limit);
  }

  function sanitizeContentRetrievalQuery(value) {
    const normalized = coerceText(value)
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/^[,.:;!?'"`\-\s]+/, "")
      .replace(/[,.:;!?'"`\-\s]+$/, "")
      .replace(/\b(?:tab|card|section|page|panel)\b$/i, "")
      .replace(/[,.:;!?'"`\-\s]+$/, "")
      .trim();
    if (!normalized) return "";
    if (normalized.length > 140) {
      return `${normalized.slice(0, 140).trim()}…`;
    }
    return normalized;
  }

  function isLikelyContentRetrievalIntent(text) {
    const sample = normalizeContentRetrievalText(text);
    if (!sample) return false;
    if (
      /\b(go get|pull|retrieve|fetch|look up|read it|read that|go find)\b/.test(sample)
    ) {
      return true;
    }
    if (
      /\b(website|page|tab|card|section|story)\b/.test(sample) &&
      /\b(explain|clarify|review|summarize|elaborate|help)\b/.test(sample)
    ) {
      return true;
    }
    if (
      /\b(looking at|look at|i am on|i m on|on the)\b/.test(sample) &&
      /\b(tab|card|section|page|story)\b/.test(sample)
    ) {
      return true;
    }
    if (
      /\b(hold on|well hold on)\b/.test(sample) &&
      /\b(get|fetch|retrieve)\b/.test(sample)
    ) {
      return true;
    }
    return false;
  }

  function extractContentRetrievalQuery(text) {
    const sample = coerceText(text).replace(/\s+/g, " ").trim();
    if (!sample) return "";
    const quotedMatch = sample.match(/[\"“”'‘’]([^\"“”'‘’]{4,140})[\"“”'‘’]/);
    if (quotedMatch && quotedMatch[1]) {
      return sanitizeContentRetrievalQuery(quotedMatch[1]);
    }
    const patterns = [
      /\b(?:looking at|look at|viewing)\s+(.{4,140}?)(?:\s+\b(?:tab|card|section|page|story)\b|[?.!,]|$)/i,
      /\b(?:explain|review|summarize|clarify|elaborate on|help me with|help me talk about)\s+(.{4,140}?)(?:[?.!,]|$)/i,
      /\b(?:about)\s+(.{4,140}?)(?:\s+\b(?:tab|card|section|page|story)\b|[?.!,]|$)/i,
      /\b(?:on)\s+(.{4,140}?)(?:\s+\b(?:page|story)\b|[?.!,]|$)/i,
    ];
    for (let i = 0; i < patterns.length; i += 1) {
      const match = sample.match(patterns[i]);
      if (!match || !match[1]) continue;
      const cleaned = sanitizeContentRetrievalQuery(
        coerceText(match[1]).replace(/^(?:the|a|an)\s+/i, "")
      );
      if (cleaned.length >= 4) return cleaned;
    }
    return "";
  }

  function inferWebsitePathFromSourceFile(sourceFile) {
    const normalized = coerceText(sourceFile).replace(/\\/g, "/");
    if (!normalized) return "";
    let match = normalized.match(/(?:^|\/)(UnityEnergy\/[^?#]+\.html)$/i);
    if (match && match[1]) return `/${match[1]}`;
    match = normalized.match(/(?:^|\/)(Customers\/[^?#]+\.html)$/i);
    if (match && match[1]) return `/${match[1]}`;
    return "";
  }

  function inferWebsitePathFromSlug(pageSlug) {
    const slug = normalizePageSlugToken(pageSlug);
    if (!slug) return "";
    if (slug === "index" || slug === "home") return "/UnityEnergy/index.html";
    return `/UnityEnergy/${slug}.html`;
  }

  function buildContentRetrievalPageCandidates(cfg) {
    const bySlug = {};
    const addCandidate = function (candidateInput) {
      if (!candidateInput || typeof candidateInput !== "object") return;
      const slug = normalizePageSlugToken(candidateInput.slug || candidateInput.pageSlug);
      if (!slug) return;
      const aliases = normalizeStringArray(candidateInput.aliases, 24);
      const nextValue = {
        slug: slug,
        title:
          coerceText(candidateInput.title) ||
          humanizeSlugToken(slug) ||
          slug,
        path:
          coerceText(candidateInput.path) ||
          inferWebsitePathFromSlug(slug),
        aliases: aliases,
        isCurrent: Boolean(candidateInput.isCurrent),
      };
      const existing = bySlug[slug];
      if (!existing) {
        bySlug[slug] = nextValue;
        return;
      }
      if (!existing.path && nextValue.path) existing.path = nextValue.path;
      if (!existing.title && nextValue.title) existing.title = nextValue.title;
      existing.isCurrent = existing.isCurrent || nextValue.isCurrent;
      nextValue.aliases.forEach(function (alias) {
        if (!alias || existing.aliases.includes(alias)) return;
        existing.aliases.push(alias);
      });
    };

    const currentPageSlug = normalizePageSlugToken(getCurrentPageSlug()) || "index";
    addCandidate({
      slug: currentPageSlug,
      title: coerceText(document && document.title) || humanizeSlugToken(currentPageSlug),
      path: getCurrentPagePathname(),
      aliases: [
        currentPageSlug,
        humanizeSlugToken(currentPageSlug),
        coerceText(document && document.title),
      ],
      isCurrent: true,
    });

    const profiles = normalizePageContextProfiles(cfg);
    Object.values(profiles).forEach(function (profile) {
      if (!profile || typeof profile !== "object") return;
      const profilePath = Array.isArray(profile.sourceFiles)
        ? profile.sourceFiles
            .map(function (sourceFile) { return inferWebsitePathFromSourceFile(sourceFile); })
            .find(Boolean)
        : "";
      const aliases = []
        .concat(profile.id || [])
        .concat(profile.title || [])
        .concat(profile.contextSources || [])
        .concat(humanizeSlugToken(profile.id) || []);
      if (profile.id === "electrical-energy-story") {
        aliases.push("energy field story");
        aliases.push("electrical energy story");
      }
      if (profile.id === "products-services") {
        aliases.push("products and services");
      }
      if (profile.id === "our-systems") {
        aliases.push("our systems");
      }
      if (profile.id === "maxwellian") {
        aliases.push("maxwellian library");
      }
      if (profile.id === "customer-portals") {
        aliases.push("customer portal");
        aliases.push("customer portals");
      }
      addCandidate({
        slug: profile.id,
        title: profile.title,
        path: profilePath || inferWebsitePathFromSlug(profile.id),
        aliases: aliases,
      });
    });

    const tourGuide = getTourGuideConfig(cfg);
    if (tourGuide && Array.isArray(tourGuide.routes)) {
      tourGuide.routes.forEach(function (route) {
        if (!route || typeof route !== "object") return;
        addCandidate({
          slug: route.pageSlug || route.id || route.contextSource,
          title: route.title,
          path: coerceText(route.path),
          aliases: []
            .concat(route.referenceTokens || [])
            .concat(route.keywords || [])
            .concat(route.contextSource || [])
            .concat(route.id || []),
        });
      });
    }

    return Object.values(bySlug);
  }

  function scoreContentRetrievalPageCandidate(candidate, transcriptText) {
    if (!candidate || typeof candidate !== "object") return 0;
    const sample = normalizeContentRetrievalText(transcriptText);
    if (!sample) return 0;
    let score = 0;
    const slugToken = normalizeContentRetrievalText(
      coerceText(candidate.slug).replace(/-/g, " ")
    );
    if (slugToken && sample.includes(slugToken)) score += 4;
    const titleToken = normalizeContentRetrievalText(candidate.title);
    if (titleToken && sample.includes(titleToken)) score += 6;
    (Array.isArray(candidate.aliases) ? candidate.aliases : []).forEach(function (alias) {
      const normalizedAlias = normalizeContentRetrievalText(alias);
      if (!normalizedAlias || normalizedAlias.length < 3) return;
      if (!sample.includes(normalizedAlias)) return;
      score += normalizedAlias.includes(" ") ? 6 : 2;
    });
    return score;
  }

  function resolveContentRetrievalTargetPage(transcriptText, cfg) {
    const candidates = buildContentRetrievalPageCandidates(cfg);
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return {
        slug: normalizePageSlugToken(getCurrentPageSlug()) || "index",
        title: coerceText(document && document.title) || "Current page",
        path: getCurrentPagePathname(),
        aliases: [],
        isCurrent: true,
      };
    }
    let best = candidates.find(function (candidate) { return candidate.isCurrent; }) || candidates[0];
    let bestScore = -1;
    candidates.forEach(function (candidate) {
      const score = scoreContentRetrievalPageCandidate(candidate, transcriptText);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
        return;
      }
      if (score === bestScore && candidate.isCurrent && !best.isCurrent) {
        best = candidate;
      }
    });
    if (bestScore <= 0) {
      const current = candidates.find(function (candidate) { return candidate.isCurrent; });
      if (current) best = current;
    }
    return best;
  }

  async function fetchContentRetrievalDocument(targetPage) {
    const currentPath = coerceText(getCurrentPagePathname());
    const targetPath = coerceText(targetPage && targetPage.path);
    if (!targetPath || targetPath === currentPath) {
      return {
        doc: document,
        sourcePath: currentPath,
        sourceUrl: getCurrentPageHref(),
        sourceTitle: coerceText(document && document.title),
        isCurrentPage: true,
      };
    }
    if (typeof window.fetch !== "function" || typeof DOMParser === "undefined") {
      throw new Error("Browser cannot fetch or parse external page content in this context.");
    }
    const response = await window.fetch(targetPath, { credentials: "same-origin" });
    if (!response || !response.ok) {
      throw new Error(`Page fetch failed (${targetPath}) with status ${response ? response.status : "unknown"}.`);
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const sourceUrl = new URL(targetPath, window.location.href).toString();
    return {
      doc: doc,
      sourcePath: targetPath,
      sourceUrl: sourceUrl,
      sourceTitle: coerceText(doc && doc.title),
      isCurrentPage: false,
    };
  }

  function collectContentRetrievalTextLines(doc) {
    if (!doc || typeof doc !== "object") return [];
    const root = doc.querySelector("main") || doc.body;
    if (!root) return [];
    const rawText = coerceText(root.innerText || root.textContent).replace(/\r/g, "\n");
    if (!rawText) return [];
    const lines = [];
    rawText.split(/\n+/).forEach(function (line) {
      const normalized = coerceText(line).replace(/\s+/g, " ").trim();
      if (!normalized || normalized.length < 20) return;
      if (lines.includes(normalized)) return;
      lines.push(normalized);
    });
    return lines.slice(0, 420);
  }

  function scoreContentRetrievalLine(line, normalizedQuery, tokens) {
    const normalizedLine = normalizeContentRetrievalText(line);
    if (!normalizedLine) return 0;
    let score = 0;
    if (normalizedQuery && normalizedLine.includes(normalizedQuery)) {
      score += 12;
    }
    (Array.isArray(tokens) ? tokens : []).forEach(function (token) {
      if (!token || token.length < 3) return;
      if (normalizedLine.includes(token)) score += 1;
    });
    return score;
  }

  function buildContentRetrievalExcerpt(bodyText, query) {
    const source = coerceText(bodyText).replace(/\s+/g, " ").trim();
    const target = coerceText(query).replace(/\s+/g, " ").trim();
    if (!source || !target) return "";
    const idx = source.toLowerCase().indexOf(target.toLowerCase());
    if (idx < 0) return "";
    const start = Math.max(0, idx - 230);
    const end = Math.min(source.length, idx + target.length + 290);
    const prefix = start > 0 ? "…" : "";
    const suffix = end < source.length ? "…" : "";
    return `${prefix}${source.slice(start, end).trim()}${suffix}`;
  }

  function extractContentRetrievalEvidence(doc, query, transcriptText) {
    const root = doc && (doc.querySelector("main") || doc.body);
    const bodyText = coerceText(root && (root.innerText || root.textContent))
      .replace(/\s+/g, " ")
      .trim();
    const normalizedQuery = normalizeContentRetrievalText(query);
    const queryTokens = buildContentRetrievalTokens(query, 16);
    const transcriptTokens = buildContentRetrievalTokens(transcriptText, 20);
    const activeTokens = queryTokens.length > 0 ? queryTokens : transcriptTokens;
    let excerpt = buildContentRetrievalExcerpt(bodyText, query);
    let score = excerpt ? 14 : 0;

    const lines = collectContentRetrievalTextLines(doc);
    let bestLine = "";
    let bestLineScore = 0;
    lines.forEach(function (line) {
      const lineScore = scoreContentRetrievalLine(line, normalizedQuery, activeTokens);
      if (lineScore > bestLineScore) {
        bestLine = line;
        bestLineScore = lineScore;
      }
    });
    if (!excerpt && bestLine) {
      excerpt = bestLine;
      score = bestLineScore;
    }
    if (excerpt && excerpt.length > 780) {
      excerpt = `${excerpt.slice(0, 780).trim()}…`;
    }

    const headingCandidates = Array.from(
      doc.querySelectorAll("h1, h2, h3, [role='tab'], button[role='tab'], button[data-tab]")
    )
      .map(function (node) {
        return coerceText(node && (node.innerText || node.textContent)).replace(/\s+/g, " ").trim();
      })
      .filter(Boolean)
      .slice(0, 120);
    let matchedHeading = "";
    let matchedHeadingScore = 0;
    headingCandidates.forEach(function (heading) {
      const headingScore = scoreContentRetrievalLine(
        heading,
        normalizedQuery,
        activeTokens
      );
      if (headingScore > matchedHeadingScore) {
        matchedHeading = heading;
        matchedHeadingScore = headingScore;
      }
    });

    return {
      query: sanitizeContentRetrievalQuery(query),
      excerpt: excerpt,
      heading: matchedHeading,
      score: Math.max(score, matchedHeadingScore),
      tokens: activeTokens,
      matchFound: Boolean(excerpt) && Math.max(score, matchedHeadingScore) > 0,
    };
  }

  function buildContentRetrievalContextBlock(result) {
    if (!result || typeof result !== "object") return "";
    return combineContextBlocks(
      [
        result.requestText ? `Website retrieval request: ${result.requestText}` : "",
        result.targetPageTitle
          ? `Target page: ${result.targetPageTitle} (${result.targetPageSlug || "unknown"}).`
          : "",
        result.query ? `Requested section/topic: ${result.query}` : "",
        result.heading ? `Matched heading/tab: ${result.heading}` : "",
        result.excerpt ? `Retrieved website excerpt:\n${result.excerpt}` : "",
        "Response rule: acknowledge retrieval briefly, answer from retrieved website context first, then add concise practical elaboration. If details are still ambiguous, ask for the exact tab/card title before asserting specifics.",
      ],
      CONTENT_RETRIEVAL_CONTEXT_CHAR_LIMIT
    );
  }

  function applyContentRetrievalContextToSession(result, cfg) {
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return;
    if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
      pendingLaunchSession.contextPayload = {};
    }
    const payload = pendingLaunchSession.contextPayload;
    payload.content_retrieval_active = true;
    payload.content_retrieval_request_text = coerceText(result && result.requestText);
    payload.content_retrieval_query = coerceText(result && result.query);
    payload.content_retrieval_match_found = Boolean(result && result.matchFound);
    payload.content_retrieval_match_score = Number.isFinite(Number(result && result.score))
      ? Math.floor(Number(result.score))
      : 0;
    payload.content_retrieval_excerpt = coerceText(result && result.excerpt);
    payload.content_retrieval_heading = coerceText(result && result.heading);
    payload.content_retrieval_target_page_slug = coerceText(result && result.targetPageSlug);
    payload.content_retrieval_target_page_title = coerceText(result && result.targetPageTitle);
    payload.content_retrieval_source_page_path = coerceText(result && result.sourcePath);
    payload.content_retrieval_source_page_url = coerceText(result && result.sourceUrl);
    payload.content_retrieval_source_page_title = coerceText(result && result.sourceTitle);
    payload.content_retrieval_retrieved_at = new Date().toISOString();
    payload.content_retrieval_response_rule =
      "Acknowledge retrieval in one line, answer from retrieved page evidence first, then provide concise elaboration.";
    if (coerceText(result && result.query)) {
      payload.likely_user_intent = `explain website section: ${coerceText(result.query)}`;
    }
    const retrievalContextBlock = buildContentRetrievalContextBlock(result);
    if (retrievalContextBlock) {
      const sessionContextCharLimitRaw =
        payload.session_context_char_limit !== undefined
          ? payload.session_context_char_limit
          : cfg && cfg.session_context_char_limit;
      payload.session_context = combineContextBlocks(
        [retrievalContextBlock, coerceText(payload.session_context)],
        clampNumber(sessionContextCharLimitRaw, 800, 8000, 3600)
      );
      payload.content_scope_instructions = combineContextBlocks(
        [
          coerceText(payload.content_scope_instructions),
          "Website retrieval mode is active: prioritize retrieved excerpt and heading context for immediate response.",
        ],
        2200
      );
    }
    appendSessionDecision(pendingLaunchSession, "website-content-retrieved", {
      target_page: payload.content_retrieval_target_page_slug,
      query: payload.content_retrieval_query,
      match_found: payload.content_retrieval_match_found,
      match_score: payload.content_retrieval_match_score,
    });
    postToWidgetFrame({ type: "maxwellian_session_launch", payload: pendingLaunchSession });
  }

  async function triggerContentRetrievalFromTranscript(transcriptText, cfg) {
    const requestText = coerceText(transcriptText);
    if (!requestText) return null;
    if (!isLikelyContentRetrievalIntent(requestText)) return null;
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return null;
    if (contentRetrievalInFlight) return null;

    const targetPage = resolveContentRetrievalTargetPage(requestText, cfg);
    const query = extractContentRetrievalQuery(requestText);
    const dedupFingerprint = normalizeContentRetrievalText(
      `${coerceText(targetPage && targetPage.slug)}|${query || requestText}`
    ).slice(0, 220);
    const now = Date.now();
    if (
      dedupFingerprint &&
      dedupFingerprint === lastContentRetrievalFingerprint &&
      now - lastContentRetrievalAtMs < CONTENT_RETRIEVAL_DEDUP_WINDOW_MS
    ) {
      return null;
    }
    lastContentRetrievalFingerprint = dedupFingerprint;
    lastContentRetrievalAtMs = now;
    contentRetrievalInFlight = true;

    const targetTitle =
      coerceText(targetPage && targetPage.title) ||
      humanizeSlugToken(targetPage && targetPage.slug) ||
      "this page";
    setStatus(`Got it—pulling ${targetTitle} context now…`, false, true);
    try {
      const fetched = await fetchContentRetrievalDocument(targetPage);
      const evidence = extractContentRetrievalEvidence(
        fetched.doc,
        query,
        requestText
      );
      const result = {
        requestText: cleanReinterpretationText(requestText, 320),
        query: sanitizeContentRetrievalQuery(query),
        matchFound: evidence.matchFound,
        score: evidence.score,
        heading: coerceText(evidence.heading),
        excerpt: coerceText(evidence.excerpt),
        targetPageSlug: coerceText(targetPage && targetPage.slug),
        targetPageTitle: targetTitle,
        sourcePath: coerceText(fetched && fetched.sourcePath),
        sourceUrl: coerceText(fetched && fetched.sourceUrl),
        sourceTitle: coerceText(fetched && fetched.sourceTitle) || targetTitle,
      };
      applyContentRetrievalContextToSession(result, cfg);
      if (result.matchFound) {
        const headingHint = result.heading ? ` (${result.heading})` : "";
        setStatus(
          `Pulled ${targetTitle}${headingHint}. Ask your follow-up and Clerk will stay grounded to that section.`,
          false,
          true
        );
      } else {
        setStatus(
          `I pulled ${targetTitle}, but I still need the exact tab/card title to lock onto the right section.`,
          false,
          true
        );
      }
      return result;
    } catch (_err) {
      setStatus(
        "I couldn't retrieve that page section right now. Share the exact page or tab title and I will retry immediately.",
        true,
        true
      );
      return null;
    } finally {
      contentRetrievalInFlight = false;
    }
  }
  function normalizeTourGuideRoutePath(pathValue) {
    const raw = coerceText(pathValue);
    if (!raw) return null;
    if (/^(?:javascript|data|vbscript):/i.test(raw)) return null;
    try {
      const resolved = new URL(raw, window.location.href);
      const protocol = coerceText(resolved.protocol).toLowerCase();
      if (protocol !== "http:" && protocol !== "https:") return null;
      if (resolved.origin !== window.location.origin) return null;
      const pathname = coerceText(resolved.pathname) || "/";
      const pageSlug = normalizePageSlugToken(extractPageSlugFromPathname(pathname));
      return {
        href: resolved.toString(),
        path: `${pathname}${resolved.search || ""}${resolved.hash || ""}`,
        pathname: pathname,
        pageSlug: pageSlug,
      };
    } catch (_err) {
      return null;
    }
  }

  function normalizeTourGuideRouteEntry(routeInput) {
    if (!routeInput || typeof routeInput !== "object") return null;
    const normalizedPath = normalizeTourGuideRoutePath(routeInput.path || routeInput.href || routeInput.url);
    if (!normalizedPath) return null;
    const routeId =
      normalizePageSlugToken(routeInput.id) ||
      normalizePageSlugToken(routeInput.route_id || routeInput.routeId) ||
      normalizedPath.pageSlug;
    if (!routeId) return null;
    const title =
      coerceText(routeInput.title || routeInput.name) ||
      humanizeSlugToken(routeId) ||
      routeId;
    const contextSource =
      normalizePageSlugToken(routeInput.context_source || routeInput.contextSource) ||
      normalizedPath.pageSlug ||
      routeId;
    const summary = coerceText(routeInput.summary || routeInput.description);
    const keywords = normalizeStringArrayLower(routeInput.keywords, 28);
    const referenceTokens = [routeId, contextSource, normalizedPath.pageSlug, title.toLowerCase()]
      .concat(keywords)
      .filter(Boolean)
      .filter(function (token, index, arr) { return arr.indexOf(token) === index; });
    return {
      id: routeId,
      title: title,
      contextSource: contextSource,
      summary: summary,
      href: normalizedPath.href,
      path: normalizedPath.path,
      pathname: normalizedPath.pathname,
      pageSlug: normalizedPath.pageSlug || routeId,
      keywords: keywords,
      referenceTokens: referenceTokens,
    };
  }

  function normalizeTourGuideKeywordRouteEntry(ruleInput, routeById, index) {
    if (!ruleInput || typeof ruleInput !== "object") return null;
    const routeId = normalizePageSlugToken(ruleInput.route_id || ruleInput.routeId);
    if (!routeId || !routeById[routeId]) return null;
    const keywords = normalizeStringArrayLower(ruleInput.keywords, 24);
    if (keywords.length === 0) return null;
    return {
      id: coerceText(ruleInput.id) || `tour-keyword-route-${index + 1}`,
      routeId: routeId,
      keywords: keywords,
      priority: clampNumber(ruleInput.priority, -20, 120, 0),
    };
  }

  function normalizeTourGuidePageNextRoutes(rawMap, routeById) {
    const source = rawMap && typeof rawMap === "object" ? rawMap : {};
    const normalized = {};
    Object.entries(source).forEach(function ([pageSlug, routeIds]) {
      const normalizedPage = normalizePageSlugToken(pageSlug);
      if (!normalizedPage) return;
      const ids = normalizeStringArray(routeIds, 12)
        .map(function (entry) { return normalizePageSlugToken(entry); })
        .filter(Boolean)
        .filter(function (routeId, index, arr) {
          return routeById[routeId] && arr.indexOf(routeId) === index;
        });
      if (ids.length === 0) return;
      normalized[normalizedPage] = ids;
    });
    return normalized;
  }

  function getTourGuideConfig(cfg) {
    const normalizedRoutes = [];
    (Array.isArray(cfg && cfg.tour_guide_routes) ? cfg.tour_guide_routes : []).forEach(function (entry) {
      const normalized = normalizeTourGuideRouteEntry(entry);
      if (!normalized) return;
      if (normalizedRoutes.some(function (route) { return route.id === normalized.id; })) return;
      normalizedRoutes.push(normalized);
    });
    const routeById = {};
    normalizedRoutes.forEach(function (route) {
      routeById[route.id] = route;
    });
    const keywordRules = (Array.isArray(cfg && cfg.tour_guide_keyword_routes) ? cfg.tour_guide_keyword_routes : [])
      .map(function (rule, index) {
        return normalizeTourGuideKeywordRouteEntry(rule, routeById, index);
      })
      .filter(Boolean);
    return {
      enabled: Boolean(cfg && cfg.tour_guide_enabled !== false) && normalizedRoutes.length > 0,
      maxCandidates: clampNumber(cfg && cfg.tour_guide_max_candidates, 1, 6, 3),
      allowDirectNavigation: !cfg || cfg.tour_guide_allow_direct_navigation !== false,
      consentPrompt:
        coerceText(cfg && cfg.tour_guide_consent_prompt) ||
        "Would you like me to go there?",
      routes: normalizedRoutes,
      routeById: routeById,
      keywordRules: keywordRules,
      pageNextRoutes: normalizeTourGuidePageNextRoutes(
        cfg && cfg.tour_guide_page_next_routes,
        routeById
      ),
    };
  }

  function countTourGuideKeywordHits(sample, keywords) {
    const normalizedSample = coerceText(sample).toLowerCase();
    if (!normalizedSample || !Array.isArray(keywords)) return 0;
    let hits = 0;
    keywords.forEach(function (keyword) {
      const token = coerceText(keyword).toLowerCase();
      if (!token) return;
      if (normalizedSample.includes(token)) hits += 1;
    });
    return hits;
  }

  function doesTourGuideTextReferenceRoute(sample, route) {
    const normalizedSample = coerceText(sample).toLowerCase();
    if (!normalizedSample || !route || !Array.isArray(route.referenceTokens)) return false;
    return route.referenceTokens.some(function (token) {
      const normalizedToken = coerceText(token).toLowerCase();
      if (!normalizedToken || normalizedToken.length < 3) return false;
      return normalizedSample.includes(normalizedToken);
    });
  }

  function parseTourGuideConsentFromText(text) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return "";
    if (
      /\b(no|nope|not now|stay here|keep me here|don't|do not|later|skip|hold off|stop)\b/.test(
        sample
      )
    ) {
      return "decline";
    }
    if (
      /\b(yes|yeah|yep|sure|ok|okay|please do|go ahead|let's go|lets go|take me there|go there|open it|navigate)\b/.test(
        sample
      )
    ) {
      return "accept";
    }
    return "";
  }

  function isTourGuideDirectNavigationIntent(text) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return false;
    return /\b(go to|take me to|open|navigate to|bring me to|show me|let's go to|lets go to)\b/.test(
      sample
    );
  }

  function getTourGuidePendingState() {
    if (!tourGuideNavigationState || typeof tourGuideNavigationState !== "object") return null;
    const createdAtMs = Date.parse(coerceText(tourGuideNavigationState.createdAt));
    if (Number.isFinite(createdAtMs) && Date.now() - createdAtMs > TOUR_GUIDE_PENDING_TTL_MS) {
      tourGuideNavigationState = null;
      return null;
    }
    return tourGuideNavigationState;
  }

  function clearTourGuideNavigationState(reason) {
    tourGuideNavigationState = null;
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return;
    if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
      pendingLaunchSession.contextPayload = {};
    }
    pendingLaunchSession.contextPayload.tour_navigation_pending = false;
    pendingLaunchSession.contextPayload.tour_pending_route_id = "";
    pendingLaunchSession.contextPayload.tour_pending_route_title = "";
    pendingLaunchSession.contextPayload.tour_pending_route_path = "";
    pendingLaunchSession.contextPayload.tour_pending_route_set_at = "";
    if (coerceText(reason)) {
      pendingLaunchSession.contextPayload.tour_pending_route_cleared_reason = coerceText(reason);
    }
  }

  function setTourGuidePendingState(route, candidates, sourceText, currentPageSlug) {
    if (!route || typeof route !== "object") return null;
    tourGuideNavigationState = {
      routeId: route.id,
      routeTitle: route.title,
      routePath: route.path,
      routeHref: route.href,
      pageSlug: route.pageSlug,
      contextSource: route.contextSource,
      candidateRouteIds: Array.isArray(candidates)
        ? candidates.map(function (candidate) { return candidate.route.id; }).slice(0, 6)
        : [],
      sourceText: coerceText(sourceText),
      currentPageSlug: normalizePageSlugToken(currentPageSlug) || getCurrentPageSlug(),
      createdAt: new Date().toISOString(),
    };
    return tourGuideNavigationState;
  }

  function evaluateTourGuideRouteCandidates(transcriptText, cfg, launchSession) {
    const config = getTourGuideConfig(cfg);
    const sample = coerceText(transcriptText).toLowerCase();
    const payload =
      launchSession && launchSession.contextPayload && typeof launchSession.contextPayload === "object"
        ? launchSession.contextPayload
        : {};
    const currentPageSlug =
      normalizePageSlugToken(payload.source_page || payload.active_page_slug) ||
      normalizePageSlugToken(getCurrentPageSlug()) ||
      "index";
    const hintedRouteIds = Array.isArray(config.pageNextRoutes[currentPageSlug])
      ? config.pageNextRoutes[currentPageSlug]
      : [];
    const candidates = config.routes
      .map(function (route) {
        if (route.pageSlug && route.pageSlug === currentPageSlug) return null;
        const routeKeywordHits = countTourGuideKeywordHits(sample, route.keywords);
        const routeMention = doesTourGuideTextReferenceRoute(sample, route);
        const hintBoost = hintedRouteIds.includes(route.id) ? 6 : 0;
        let score = routeKeywordHits * 4 + hintBoost + (routeMention ? 10 : 0);
        const matchedKeywords = [];
        route.keywords.forEach(function (keyword) {
          const token = coerceText(keyword).toLowerCase();
          if (!token || !sample.includes(token)) return;
          if (!matchedKeywords.includes(token)) matchedKeywords.push(token);
        });
        config.keywordRules.forEach(function (rule) {
          if (rule.routeId !== route.id) return;
          const ruleHits = countTourGuideKeywordHits(sample, rule.keywords);
          if (!ruleHits) return;
          score += rule.priority + (ruleHits * 5);
          rule.keywords.forEach(function (keyword) {
            const token = coerceText(keyword).toLowerCase();
            if (!token || !sample.includes(token)) return;
            if (!matchedKeywords.includes(token)) matchedKeywords.push(token);
          });
        });
        if (score <= 0) return null;
        return {
          route: route,
          score: score,
          matchedKeywords: matchedKeywords.slice(0, 8),
          routeMentioned: routeMention,
          hintedFromPageFlow: hintedRouteIds.includes(route.id),
        };
      })
      .filter(Boolean)
      .sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.route.id.localeCompare(b.route.id);
      })
      .slice(0, config.maxCandidates);
    const primary = candidates.length > 0 ? candidates[0] : null;
    const directNavigationRequested =
      Boolean(primary) &&
      config.allowDirectNavigation &&
      isTourGuideDirectNavigationIntent(sample) &&
      (primary.routeMentioned || primary.score >= 22);
    return {
      config: config,
      currentPageSlug: currentPageSlug,
      hintedRouteIds: hintedRouteIds.slice(0, 6),
      candidates: candidates,
      primary: primary,
      directNavigationRequested: directNavigationRequested,
    };
  }

  function buildTourGuideCandidatePayload(candidates) {
    if (!Array.isArray(candidates)) return [];
    return candidates.slice(0, 6).map(function (candidate) {
      return {
        id: candidate.route.id,
        title: candidate.route.title,
        path: candidate.route.path,
        context_source: candidate.route.contextSource,
        summary: candidate.route.summary,
        score: candidate.score,
        matched_keywords: candidate.matchedKeywords,
      };
    });
  }

  function buildTourGuideHintCandidatePayload(config, hintedRouteIds) {
    if (!config || !Array.isArray(config.routes) || !Array.isArray(hintedRouteIds)) return [];
    return hintedRouteIds
      .map(function (routeId) { return config.routeById[routeId] || null; })
      .filter(Boolean)
      .slice(0, config.maxCandidates)
      .map(function (route, index) {
        return {
          id: route.id,
          title: route.title,
          path: route.path,
          context_source: route.contextSource,
          summary: route.summary,
          score: Math.max(1, 10 - index),
          matched_keywords: [],
        };
      });
  }

  function syncTourGuideContextToSession(cfg, launchSession, evaluation, reason, shouldPostToRenderer) {
    if (!launchSession || typeof launchSession !== "object") return;
    if (!launchSession.contextPayload || typeof launchSession.contextPayload !== "object") {
      launchSession.contextPayload = {};
    }
    const payload = launchSession.contextPayload;
    const result = evaluation && typeof evaluation === "object"
      ? evaluation
      : evaluateTourGuideRouteCandidates("", cfg, launchSession);
    const config = result.config || getTourGuideConfig(cfg);
    const pending = getTourGuidePendingState();
    const candidatePayload =
      result.candidates && result.candidates.length > 0
        ? buildTourGuideCandidatePayload(result.candidates)
        : buildTourGuideHintCandidatePayload(config, result.hintedRouteIds || []);
    payload.tour_guide_enabled = config.enabled;
    payload.tour_guide_allow_direct_navigation = config.allowDirectNavigation;
    payload.tour_guide_consent_prompt = config.consentPrompt;
    payload.tour_current_page_slug = result.currentPageSlug || normalizePageSlugToken(getCurrentPageSlug());
    payload.tour_page_next_route_ids = (result.hintedRouteIds || []).slice(0, 6);
    payload.tour_route_candidates = candidatePayload;
    payload.tour_candidate_count = candidatePayload.length;
    payload.tour_navigation_pending = Boolean(pending && pending.routeId);
    if (result.primary && result.primary.route) {
      payload.tour_primary_route_id = result.primary.route.id;
      payload.tour_primary_route_title = result.primary.route.title;
      payload.tour_primary_route_path = result.primary.route.path;
      payload.tour_primary_route_context_source = result.primary.route.contextSource;
      payload.tour_primary_route_score = result.primary.score;
    }
    if (pending && pending.routeId) {
      payload.tour_pending_route_id = pending.routeId;
      payload.tour_pending_route_title = pending.routeTitle;
      payload.tour_pending_route_path = pending.routePath;
      payload.tour_pending_route_set_at = pending.createdAt;
      payload.tour_pending_candidate_route_ids = pending.candidateRouteIds || [];
    }
    appendSessionDecision(launchSession, reason || "tour-guide-context-synced", {
      enabled: config.enabled,
      current_page: payload.tour_current_page_slug,
      candidate_count: candidatePayload.length,
      primary_route_id: payload.tour_primary_route_id || "",
      pending_route_id: payload.tour_pending_route_id || "",
    });
    if (shouldPostToRenderer) {
      postToWidgetFrame({ type: "maxwellian_session_launch", payload: launchSession });
    }
  }

  function navigateToTourGuideRoute(route, cfg, navigationReason) {
    if (!route || typeof route !== "object") return false;
    const targetHref = coerceText(route.href);
    if (!targetHref) return false;
    markCrossPageRoamingNavigationTarget(route.pageSlug || route.id, pendingLaunchSession || {});
    if (pendingLaunchSession && typeof pendingLaunchSession === "object") {
      if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
        pendingLaunchSession.contextPayload = {};
      }
      pendingLaunchSession.contextPayload.tour_last_navigation_route_id = route.id;
      pendingLaunchSession.contextPayload.tour_last_navigation_route_title = route.title;
      pendingLaunchSession.contextPayload.tour_last_navigation_route_path = route.path;
      pendingLaunchSession.contextPayload.tour_last_navigation_reason = coerceText(navigationReason);
      pendingLaunchSession.contextPayload.tour_last_navigation_at = new Date().toISOString();
      appendSessionDecision(pendingLaunchSession, "tour-guide-navigation-triggered", {
        route_id: route.id,
        route_path: route.path,
        reason: coerceText(navigationReason),
      });
      postToWidgetFrame({ type: "maxwellian_session_launch", payload: pendingLaunchSession });
    }
    clearTourGuideNavigationState("navigated");
    setStatus(`Taking you to ${route.title}.`, false, true);
    pageTransitionInProgress = true;
    window.setTimeout(function () {
      try {
        window.location.assign(targetHref);
      } catch (_err) {
        window.location.href = targetHref;
      }
    }, 28);
    return true;
  }

  function handleTourGuideTranscriptIntent(transcriptText, cfg) {
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return null;
    const evaluation = evaluateTourGuideRouteCandidates(transcriptText, cfg, pendingLaunchSession);
    if (!evaluation.config || !evaluation.config.enabled) return null;
    const consent = parseTourGuideConsentFromText(transcriptText);
    const pending = getTourGuidePendingState();
    if (pending && consent === "decline") {
      clearTourGuideNavigationState("declined");
      syncTourGuideContextToSession(cfg, pendingLaunchSession, evaluation, "tour-guide-declined", true);
      appendSessionDecision(pendingLaunchSession, "tour-guide-navigation-declined", {
        route_id: pending.routeId,
      });
      return {
        handled: true,
        navigated: false,
        statusText: "No problem—we can stay here.",
      };
    }
    if (pending && consent === "accept") {
      const pendingRoute = evaluation.config.routeById[pending.routeId];
      if (pendingRoute && navigateToTourGuideRoute(pendingRoute, cfg, "consent-accepted")) {
        return { handled: true, navigated: true };
      }
      clearTourGuideNavigationState("stale-pending-route");
      syncTourGuideContextToSession(cfg, pendingLaunchSession, evaluation, "tour-guide-pending-cleared", true);
      return null;
    }
    if (!evaluation.primary || !evaluation.primary.route) {
      syncTourGuideContextToSession(cfg, pendingLaunchSession, evaluation, "tour-guide-candidates-refreshed", true);
      return null;
    }
    const primaryRoute = evaluation.primary.route;
    const priorPending = getTourGuidePendingState();
    const samePendingRoute =
      priorPending && normalizePageSlugToken(priorPending.routeId) === normalizePageSlugToken(primaryRoute.id);
    setTourGuidePendingState(
      primaryRoute,
      evaluation.candidates,
      transcriptText,
      evaluation.currentPageSlug
    );
    syncTourGuideContextToSession(cfg, pendingLaunchSession, evaluation, "tour-guide-route-matched", true);
    if (evaluation.directNavigationRequested) {
      if (navigateToTourGuideRoute(primaryRoute, cfg, "direct-navigation-request")) {
        return { handled: true, navigated: true };
      }
    }
    if (samePendingRoute) return null;
    return {
      handled: true,
      navigated: false,
      statusText: `I can guide you to ${primaryRoute.title}. ${evaluation.config.consentPrompt}`,
    };
  }

  function applyTourGuideLaunchContext(launchSession, cfg) {
    clearTourGuideNavigationState("launch-reset");
    const evaluation = evaluateTourGuideRouteCandidates("", cfg, launchSession);
    syncTourGuideContextToSession(
      cfg,
      launchSession,
      evaluation,
      "tour-guide-launch-context",
      false
    );
  }

  function getPageContextMemoryStorageKey(scopeRef, cfg) {
    return getScopedStorageKey(PAGE_CONTEXT_MEMORY_STORAGE_KEY_PREFIX, scopeRef, cfg);
  }

  function getPageContextMemoryMaxEntries(cfg) {
    return clampNumber(cfg && cfg.page_context_memory_max_entries, 4, 48, 18);
  }

  function getPageContextMemoryExcerptLimit(cfg) {
    return clampNumber(cfg && cfg.page_context_memory_excerpt_char_limit, 180, 2400, 420);
  }

  function normalizePageContextMemoryText(value, maxChars) {
    const text = coerceText(value).replace(/\s+/g, " ").trim();
    if (!text) return "";
    const limit = Number.isFinite(Number(maxChars)) ? Math.max(80, Math.floor(Number(maxChars))) : 320;
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  }

  function normalizePageContextMemoryHeadings(headings) {
    return normalizeStringArray(headings, 8)
      .map(function (heading) { return normalizePageContextMemoryText(heading, 140); })
      .filter(Boolean)
      .slice(0, 6);
  }

  function normalizePageContextMemoryEntry(entryInput, cfg) {
    const entry = entryInput && typeof entryInput === "object" ? entryInput : {};
    const pageSlug = normalizePageSlugToken(
      entry.pageSlug || entry.page_slug || entry.page || entry.slug
    );
    if (!pageSlug) return null;
    const visitCount = clampNumber(entry.visitCount || entry.visit_count, 1, 5000, 1);
    return {
      pageSlug: pageSlug,
      pathname: normalizePageContextMemoryText(entry.pathname, 220),
      href: normalizePageContextMemoryText(entry.href, 420),
      fileName: normalizePageContextMemoryText(entry.fileName || entry.file_name, 140),
      title: normalizePageContextMemoryText(entry.title, 220),
      metaDescription: normalizePageContextMemoryText(
        entry.metaDescription || entry.meta_description,
        360
      ),
      headings: normalizePageContextMemoryHeadings(entry.headings),
      excerpt: normalizePageContextMemoryText(
        entry.excerpt,
        getPageContextMemoryExcerptLimit(cfg)
      ),
      visitCount: visitCount,
      lastSeenAt: coerceText(entry.lastSeenAt || entry.last_seen_at) || new Date().toISOString(),
    };
  }

  function normalizePageContextMemoryState(rawState, scopeRef, cfg) {
    if (!rawState || typeof rawState !== "object") return null;
    const scope = resolveGuideScopeReference(scopeRef, cfg);
    const stateScopeToken = normalizeStorageScopeToken(
      rawState.scope || rawState.scope_key || rawState.scopeKey,
      scope.scopeToken
    );
    if (stateScopeToken && stateScopeToken !== scope.scopeToken) return null;
    const entriesSource = Array.isArray(rawState.entries)
      ? rawState.entries
      : rawState.pages && typeof rawState.pages === "object"
        ? Object.values(rawState.pages)
        : [];
    const entriesByPageSlug = {};
    entriesSource.forEach(function (entry) {
      const normalized = normalizePageContextMemoryEntry(entry, cfg);
      if (!normalized) return;
      entriesByPageSlug[normalized.pageSlug] = normalized;
    });
    const entries = Object.values(entriesByPageSlug);
    entries.sort(function (a, b) {
      return Date.parse(a.lastSeenAt || 0) - Date.parse(b.lastSeenAt || 0);
    });
    const maxEntries = getPageContextMemoryMaxEntries(cfg);
    return {
      scope: scope.scopeToken,
      guideMode: scope.guideMode,
      entries: entries.slice(-maxEntries),
      updatedAt: coerceText(rawState.updatedAt || rawState.updated_at) || new Date().toISOString(),
    };
  }

  function readPageContextMemoryState(scopeRef, cfg) {
    if (cfg && cfg.page_context_memory_enabled === false) return null;
    if (typeof window === "undefined" || !window.localStorage) return null;
    const key = getPageContextMemoryStorageKey(scopeRef, cfg);
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const normalized = normalizePageContextMemoryState(parsed, scopeRef, cfg);
      if (!normalized) {
        window.localStorage.removeItem(key);
        return null;
      }
      return normalized;
    } catch (_err) {
      return null;
    }
  }

  function writePageContextMemoryState(nextState, scopeRef, cfg) {
    if (cfg && cfg.page_context_memory_enabled === false) return false;
    if (typeof window === "undefined" || !window.localStorage) return false;
    const key = getPageContextMemoryStorageKey(scopeRef, cfg);
    const normalized = normalizePageContextMemoryState(nextState, scopeRef, cfg);
    if (!normalized) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(normalized));
      return true;
    } catch (_err) {
      return false;
    }
  }

  function findPageContextMemoryEntry(memoryState, pageSlug) {
    const normalizedPageSlug = normalizePageSlugToken(pageSlug);
    if (!normalizedPageSlug) return null;
    const entries =
      memoryState && Array.isArray(memoryState.entries) ? memoryState.entries : [];
    for (let i = entries.length - 1; i >= 0; i -= 1) {
      const entry = entries[i];
      if (!entry || normalizePageSlugToken(entry.pageSlug) !== normalizedPageSlug) continue;
      return entry;
    }
    return null;
  }

  function upsertPageContextMemorySnapshot(pageSlug, snapshotInput, scopeRef, cfg) {
    const normalizedPageSlug = normalizePageSlugToken(pageSlug) || "index";
    const snapshot = snapshotInput && typeof snapshotInput === "object" ? snapshotInput : {};
    const priorState = readPageContextMemoryState(scopeRef, cfg);
    const priorEntries =
      priorState && Array.isArray(priorState.entries) ? priorState.entries.slice() : [];
    const existing = findPageContextMemoryEntry(priorState, normalizedPageSlug);
    const nextEntry = normalizePageContextMemoryEntry(
      {
        pageSlug: normalizedPageSlug,
        pathname: snapshot.pathname,
        href: snapshot.href,
        fileName: snapshot.fileName,
        title: snapshot.title,
        metaDescription: snapshot.metaDescription,
        headings: snapshot.headings,
        excerpt: snapshot.excerpt,
        visitCount: existing ? Number(existing.visitCount || 1) + 1 : 1,
        lastSeenAt: new Date().toISOString(),
      },
      cfg
    );
    if (!nextEntry) return { entry: null, state: priorState };
    const nextEntries = priorEntries.filter(function (entry) {
      return normalizePageSlugToken(entry && entry.pageSlug) !== normalizedPageSlug;
    });
    nextEntries.push(nextEntry);
    const normalizedState = normalizePageContextMemoryState(
      {
        entries: nextEntries,
        updatedAt: new Date().toISOString(),
      },
      scopeRef,
      cfg
    );
    if (!normalizedState) return { entry: nextEntry, state: priorState };
    writePageContextMemoryState(normalizedState, scopeRef, cfg);
    return {
      entry: nextEntry,
      state: normalizedState,
    };
  }

  function buildPageContextMemoryEntrySummary(entryInput, cfg) {
    if (!entryInput || typeof entryInput !== "object") return "";
    const entry = normalizePageContextMemoryEntry(entryInput, cfg);
    if (!entry) return "";
    const pageLabel =
      coerceText(entry.title) ||
      coerceText(entry.fileName) ||
      humanizeSlugToken(entry.pageSlug) ||
      entry.pageSlug;
    const headingHint = Array.isArray(entry.headings) && entry.headings.length > 0
      ? coerceText(entry.headings[0])
      : "";
    const excerpt = coerceText(entry.excerpt || entry.metaDescription);
    const summary = combineContextBlocks(
      [
        pageLabel,
        headingHint && headingHint !== pageLabel ? `Focus: ${headingHint}` : "",
        excerpt,
      ],
      clampNumber(cfg && cfg.page_context_memory_excerpt_char_limit, 140, 900, 320)
    );
    return summary;
  }

  function buildKnownPageMemorySummaries(memoryState, activePageSlug, cfg) {
    const currentSlug = normalizePageSlugToken(activePageSlug) || "index";
    const entries =
      memoryState && Array.isArray(memoryState.entries) ? memoryState.entries.slice() : [];
    const summaries = [];
    entries
      .slice()
      .reverse()
      .forEach(function (entry) {
        const entrySlug = normalizePageSlugToken(entry && entry.pageSlug);
        if (!entrySlug || entrySlug === currentSlug) return;
        const summary = buildPageContextMemoryEntrySummary(entry, cfg);
        if (!summary) return;
        summaries.push(`${entrySlug}: ${summary}`);
      });
    return summaries.slice(0, 4);
  }

  function normalizeStorageScopeToken(value, fallback) {
    const normalized = coerceText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (normalized) return normalized;
    const fallbackToken = coerceText(fallback)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return fallbackToken || "";
  }

  function humanizeSlugToken(value) {
    const normalized = normalizeStorageScopeToken(value, "");
    if (!normalized) return "";
    return normalized
      .split("-")
      .filter(Boolean)
      .map(function (part) {
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join(" ");
  }

  function parseCustomerPathContext(pathname) {
    const rawPath = coerceText(pathname || getCurrentPagePathname()) || "/";
    const segments = rawPath.split("/").filter(Boolean);
    const customerRootIndex = segments.findIndex(function (segment) {
      return coerceText(segment).toLowerCase() === "customers";
    });
    if (customerRootIndex < 0 || customerRootIndex + 1 >= segments.length) {
      return {
        isCustomerPath: false,
        customerSlug: "",
        customerName: "",
        siteSlug: "",
      };
    }
    const rawCustomerSegment = segments[customerRootIndex + 1];
    const customerSlug = normalizeStorageScopeToken(rawCustomerSegment, "");
    const customerName = humanizeSlugToken(rawCustomerSegment);
    const possibleSiteSegment = segments[customerRootIndex + 2];
    const siteSlug =
      possibleSiteSegment && !/\.[a-z0-9]+$/i.test(possibleSiteSegment)
        ? normalizeStorageScopeToken(possibleSiteSegment, "")
        : "";
    return {
      isCustomerPath: Boolean(customerSlug),
      customerSlug: customerSlug,
      customerName: customerName,
      siteSlug: siteSlug,
    };
  }

  function getStoredCustomerContextKey() {
    return "maxwellian_clerk_customer_context_v1";
  }

  function readStoredCustomerContext() {
    if (typeof window === "undefined" || !window.localStorage) return null;
    try {
      const raw = window.localStorage.getItem(getStoredCustomerContextKey());
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;
      const customerSlug = normalizeStorageScopeToken(
        parsed.customer_slug || parsed.customerSlug || parsed.customer || parsed.customer_id,
        ""
      );
      if (!customerSlug) return null;
      return {
        customerSlug: customerSlug,
        customerName:
          coerceText(parsed.customer_name || parsed.customerName) ||
          humanizeSlugToken(customerSlug),
        sourcePath: coerceText(parsed.source_path || parsed.sourcePath || parsed.path),
        selectedAt: coerceText(parsed.selected_at || parsed.selectedAt),
      };
    } catch (_err) {
      return null;
    }
  }

  function persistStoredCustomerContext(contextInput) {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const context = contextInput && typeof contextInput === "object" ? contextInput : {};
    const customerSlug = normalizeStorageScopeToken(
      context.customer_slug || context.customerSlug || context.customer || context.customer_id,
      ""
    );
    if (!customerSlug) return false;
    const payload = {
      customer_slug: customerSlug,
      customer_name:
        coerceText(context.customer_name || context.customerName) ||
        humanizeSlugToken(customerSlug),
      source_path: coerceText(context.source_path || context.sourcePath || getCurrentPagePathname()),
      selected_at: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(getStoredCustomerContextKey(), JSON.stringify(payload));
      return true;
    } catch (_err) {
      return false;
    }
  }

  function isCustomerGuideEnabled(cfg) {
    return !cfg || cfg.customer_guide_enabled !== false;
  }

  function getClerkPageAccessPolicy(cfg) {
    const source = cfg && typeof cfg === "object" ? cfg : {};
    const enabled = Boolean(source.clerk_page_access_control_enabled);
    const allowedPages = normalizeClerkPageSlugList(source.clerk_voice_allowed_pages);
    const configuredBlockedPages = normalizeClerkPageSlugList(source.clerk_voice_blocked_pages);
    const blockedPages = configuredBlockedPages.length > 0 ? configuredBlockedPages : ["index", "home"];
    return {
      enabled: enabled,
      allowedPages: allowedPages,
      blockedPages: blockedPages,
    };
  }

  function isClerkVoiceAllowedOnPage(pageSlug, cfg) {
    if (isCustomerGuideEnabled(cfg)) {
      const pathContext = parseCustomerPathContext(getCurrentPagePathname());
      if (pathContext.isCustomerPath) return true;
    }
    const normalizedPage = normalizePageSlugToken(pageSlug) || normalizePageSlugToken(getCurrentPageSlug());
    if (!normalizedPage) return false;
    const policy = getClerkPageAccessPolicy(cfg);
    if (policy.blockedPages.includes(normalizedPage)) return false;
    if (policy.enabled && policy.allowedPages.length > 0) {
      return policy.allowedPages.includes(normalizedPage);
    }
    return true;
  }
  function isWidgetReadyEventType(eventType) {
    const normalized = coerceText(eventType).toLowerCase();
    if (!normalized) return false;
    return (
      normalized === "widget_iframe_is_ready" ||
      normalized === "widget_iframe_ready" ||
      normalized === "widget_ready" ||
      normalized === "iframe_ready"
    );
  }

  function isClerkVoiceAllowedOnCurrentPage(cfg) {
    return isClerkVoiceAllowedOnPage(getCurrentPageSlug(), cfg);
  }

  function extractCustomerFieldsFromPayload(payloadInput) {
    const payload = payloadInput && typeof payloadInput === "object" ? payloadInput : {};
    const customerSlug = normalizeStorageScopeToken(
      payload.customer_slug ||
      payload.customerSlug ||
      payload.customer ||
      payload.customer_id ||
      payload.portal_customer_slug ||
      payload.portalCustomerSlug,
      ""
    );
    const customerName =
      coerceText(payload.customer_name || payload.customerName) ||
      (customerSlug ? humanizeSlugToken(customerSlug) : "");
    const siteSlug = normalizeStorageScopeToken(
      payload.site_slug ||
      payload.siteSlug ||
      payload.customer_site ||
      payload.customerSite ||
      payload.site,
      ""
    );
    return {
      customerSlug: customerSlug,
      customerName: customerName,
      siteSlug: siteSlug,
    };
  }

  function resolveGuideScopeReference(scopeInput, cfg) {
    const source = scopeInput && typeof scopeInput === "object" ? scopeInput : {};
    const payload =
      source.contextPayload && typeof source.contextPayload === "object"
        ? source.contextPayload
        : source;
    const explicitGuideMode = coerceText(
      payload.guide_mode ||
      payload.guideMode ||
      source.guide_mode ||
      source.guideMode
    ).toLowerCase();
    const payloadCustomer = extractCustomerFieldsFromPayload(payload);
    const pathContext = parseCustomerPathContext(getCurrentPagePathname());
    const storedCustomerContext = readStoredCustomerContext();
    const explicitCustomerContext =
      explicitGuideMode === "customer" ||
      payload.customer_mode === true ||
      payload.customer_guide_mode === true ||
      Boolean(payloadCustomer.customerSlug);
    const inferredCustomerSlug =
      payloadCustomer.customerSlug ||
      pathContext.customerSlug ||
      (explicitCustomerContext && storedCustomerContext
        ? normalizeStorageScopeToken(storedCustomerContext.customerSlug, "")
        : "");
    const customerSlug = normalizeStorageScopeToken(inferredCustomerSlug, "");
    const customerName =
      payloadCustomer.customerName ||
      pathContext.customerName ||
      coerceText(storedCustomerContext && storedCustomerContext.customerName) ||
      (customerSlug ? humanizeSlugToken(customerSlug) : "");
    const siteSlug =
      payloadCustomer.siteSlug ||
      pathContext.siteSlug ||
      "";
    const customerGuideEnabled = isCustomerGuideEnabled(cfg);
    const isCustomerGuide =
      customerGuideEnabled &&
      (explicitGuideMode === "customer" || pathContext.isCustomerPath || Boolean(customerSlug));
    const guideMode = isCustomerGuide ? "customer" : "unity";
    const scopeToken = isCustomerGuide
      ? normalizeStorageScopeToken(`customer-${customerSlug || "shared"}`, "customer-shared")
      : "unity-shared";
    return {
      guideMode: guideMode,
      scopeToken: scopeToken,
      customerSlug: customerSlug,
      customerName: customerName,
      siteSlug: siteSlug,
      isCustomerGuide: isCustomerGuide,
    };
  }

  function applyGuideContextToLaunchSession(launchSession, cfg) {
    if (!launchSession || typeof launchSession !== "object") return null;
    if (!launchSession.contextPayload || typeof launchSession.contextPayload !== "object") {
      launchSession.contextPayload = {};
    }
    const scope = resolveGuideScopeReference(launchSession, cfg);
    const payload = launchSession.contextPayload;
    payload.guide_mode = scope.guideMode;
    payload.guide_scope = scope.scopeToken;
    payload.customer_memory_enabled =
      scope.guideMode === "customer" && cfg && cfg.customer_memory_enabled !== false;
    payload.customer_exit_sweep_enabled =
      scope.guideMode === "customer" && cfg && cfg.customer_exit_sweep_enabled !== false;
    if (scope.guideMode === "customer") {
      if (!coerceText(payload.context_source)) {
        payload.context_source = `customer-${scope.customerSlug || "shared"}`;
      }
      if (scope.customerSlug) payload.customer_slug = scope.customerSlug;
      if (scope.customerName) payload.customer_name = scope.customerName;
      if (scope.siteSlug) payload.site_slug = scope.siteSlug;
      if (scope.customerSlug) {
        persistStoredCustomerContext({
          customer_slug: scope.customerSlug,
          customer_name: scope.customerName,
          source_path: getCurrentPagePathname(),
        });
      }
    }
    appendSessionDecision(launchSession, "guide-context-selected", {
      guide_mode: scope.guideMode,
      guide_scope: scope.scopeToken,
      customer_slug: scope.customerSlug,
      site_slug: scope.siteSlug,
    });
    return scope;
  }

  function shouldEnableCrossPageRoaming(cfg, scopeRef) {
    const scope = resolveGuideScopeReference(scopeRef, cfg);
    if (scope.guideMode === "customer") {
      return isCustomerGuideEnabled(cfg);
    }
    return !cfg || cfg.cross_page_roaming_enabled !== false;
  }

  function shouldAutoResumeCrossPageRoaming(cfg, scopeRef) {
    if (!shouldEnableCrossPageRoaming(cfg, scopeRef)) return false;
    return !cfg || cfg.cross_page_roaming_auto_resume !== false;
  }

  function getScopedStorageKey(prefix, scopeRef, cfg) {
    const scope = resolveGuideScopeReference(scopeRef, cfg);
    const scopeToken = normalizeStorageScopeToken(scope.scopeToken, "unity-shared");
    return `${prefix}__${scopeToken}`;
  }

  function getCrossPageRoamingStorageKey(scopeRef, cfg) {
    return getScopedStorageKey(CROSS_PAGE_ROAMING_STORAGE_KEY_PREFIX, scopeRef, cfg);
  }

  function getCustomerMemoryStorageKey(scopeRef, cfg) {
    return getScopedStorageKey(CUSTOMER_MEMORY_STORAGE_KEY_PREFIX, scopeRef, cfg);
  }

  function getCrossPageRoamingStorage() {
    if (typeof window === "undefined") return null;
    try {
      if (window.sessionStorage) return window.sessionStorage;
    } catch (_err) {}
    try {
      if (window.localStorage) return window.localStorage;
    } catch (_err) {}
    return null;
  }

  function extractPageSlugFromPathname(pathname) {
    const rawPath = coerceText(pathname);
    if (!rawPath) return "";
    const filename = rawPath.split("/").filter(Boolean).pop() || "";
    if (!filename) return "";
    return filename.replace(/\.[^/.]+$/, "").toLowerCase();
  }

  function extractPageSlugFromHref(href) {
    const rawHref = coerceText(href);
    if (!rawHref) return "";
    try {
      const resolved = new URL(rawHref, window.location.href);
      if (resolved.origin !== window.location.origin) return "";
      return extractPageSlugFromPathname(resolved.pathname);
    } catch (_err) {
      return "";
    }
  }

  function normalizeCrossPageTranscriptEntries(entries) {
    const source = Array.isArray(entries) ? entries : [];
    return source
      .map(function (entry) {
        if (!entry || typeof entry !== "object") return null;
        const roleRaw = coerceText(entry.role).toLowerCase();
        const role = roleRaw === "assistant" ? "assistant" : "user";
        const text = coerceText(entry.text);
        if (!text) return null;
        const compact = text.length > 260 ? `${text.slice(0, 260)}…` : text;
        return {
          role: role,
          text: compact,
          at: coerceText(entry.at) || new Date().toISOString(),
        };
      })
      .filter(Boolean)
      .slice(-CROSS_PAGE_ROAMING_MAX_TRANSCRIPT_ENTRIES);
  }

  function normalizeCrossPageRoamingState(rawState, scopeRef, cfg) {
    if (!rawState || typeof rawState !== "object") return null;
    const scope = resolveGuideScopeReference(scopeRef, cfg);
    const active = rawState.active !== false;
    if (!active) return null;
    const stateScopeToken = normalizeStorageScopeToken(
      rawState.scope || rawState.scope_key || rawState.scopeKey,
      scope.scopeToken
    );
    if (stateScopeToken && stateScopeToken !== scope.scopeToken) return null;
    const updatedAt = coerceText(rawState.updatedAt || rawState.updated_at) || new Date().toISOString();
    const updatedAtMs = Date.parse(updatedAt);
    if (Number.isFinite(updatedAtMs)) {
      const ageMs = Date.now() - updatedAtMs;
      if (ageMs > CROSS_PAGE_ROAMING_STATE_TTL_MS) return null;
    }
    const context = coerceText(rawState.context) || "technical-follow-up";
    const mode = coerceText(rawState.mode) || context;
    return {
      active: true,
      scope: scope.scopeToken,
      guideMode: coerceText(rawState.guideMode || rawState.guide_mode) || scope.guideMode,
      customerSlug:
        normalizeStorageScopeToken(rawState.customerSlug || rawState.customer_slug, "") ||
        scope.customerSlug,
      customerName:
        coerceText(rawState.customerName || rawState.customer_name) ||
        scope.customerName,
      siteSlug:
        normalizeStorageScopeToken(rawState.siteSlug || rawState.site_slug, "") ||
        scope.siteSlug,
      resumeAfterNavigation: Boolean(rawState.resumeAfterNavigation || rawState.resume_after_navigation),
      lastPage: coerceText(rawState.lastPage || rawState.last_page),
      nextPage: coerceText(rawState.nextPage || rawState.next_page),
      context: context,
      mode: mode,
      transcriptEntries: normalizeCrossPageTranscriptEntries(
        rawState.transcriptEntries !== undefined ? rawState.transcriptEntries : rawState.transcript_entries
      ),
      updatedAt: updatedAt,
    };
  }

  function readCrossPageRoamingState(scopeRef, cfg) {
    const storage = getCrossPageRoamingStorage();
    if (!storage) return null;
    const scopedKey = getCrossPageRoamingStorageKey(scopeRef, cfg);
    try {
      let raw = storage.getItem(scopedKey);
      let sourceKey = scopedKey;
      if (!raw) {
        const legacyKey = CROSS_PAGE_ROAMING_STORAGE_KEY_PREFIX;
        if (legacyKey !== scopedKey) {
          raw = storage.getItem(legacyKey);
          sourceKey = legacyKey;
        }
      }
      if (!raw) return null;
      let parsed = null;
      try {
        parsed = JSON.parse(raw);
      } catch (_err) {
        parsed = null;
      }
      const normalized = normalizeCrossPageRoamingState(parsed, scopeRef, cfg);
      if (!normalized) {
        if (sourceKey) storage.removeItem(sourceKey);
        return null;
      }
      if (sourceKey !== scopedKey) {
        storage.setItem(scopedKey, JSON.stringify(normalized));
        storage.removeItem(sourceKey);
      }
      return normalized;
    } catch (_err) {
      return null;
    }
  }

  function writeCrossPageRoamingState(nextState, scopeRef, cfg) {
    const storage = getCrossPageRoamingStorage();
    if (!storage) return false;
    const scopedKey = getCrossPageRoamingStorageKey(scopeRef, cfg);
    const normalized = normalizeCrossPageRoamingState(nextState, scopeRef, cfg);
    if (!normalized) {
      try {
        storage.removeItem(scopedKey);
      } catch (_err) {}
      return false;
    }
    try {
      storage.setItem(scopedKey, JSON.stringify(normalized));
      return true;
    } catch (_err) {
      return false;
    }
  }

  function clearCrossPageRoamingState(scopeRef, cfg) {
    const storage = getCrossPageRoamingStorage();
    if (!storage) return;
    const scopedKey = getCrossPageRoamingStorageKey(scopeRef, cfg);
    try {
      storage.removeItem(scopedKey);
    } catch (_err) {}
  }

  function normalizeCustomerMemoryEntries(entries, cfg) {
    const source = Array.isArray(entries) ? entries : [];
    const maxEntries = clampNumber(cfg && cfg.customer_memory_max_entries, 3, 48, 12);
    return source
      .map(function (entry) {
        if (!entry || typeof entry !== "object") return null;
        const summary = coerceText(entry.summary || entry.note || entry.text);
        if (!summary) return null;
        return {
          at: coerceText(entry.at) || new Date().toISOString(),
          page: coerceText(entry.page || entry.source_page),
          summary: summary.length > 360 ? `${summary.slice(0, 360)}…` : summary,
        };
      })
      .filter(Boolean)
      .slice(-maxEntries);
  }

  function normalizeCustomerMemoryState(rawState, scopeRef, cfg) {
    if (!rawState || typeof rawState !== "object") return null;
    const scope = resolveGuideScopeReference(scopeRef, cfg);
    if (scope.guideMode !== "customer") return null;
    const stateScopeToken = normalizeStorageScopeToken(
      rawState.scope || rawState.scope_key || rawState.scopeKey,
      scope.scopeToken
    );
    if (stateScopeToken && stateScopeToken !== scope.scopeToken) return null;
    return {
      scope: scope.scopeToken,
      guideMode: "customer",
      customerSlug:
        normalizeStorageScopeToken(rawState.customerSlug || rawState.customer_slug, "") ||
        scope.customerSlug,
      customerName:
        coerceText(rawState.customerName || rawState.customer_name) ||
        scope.customerName,
      entries: normalizeCustomerMemoryEntries(rawState.entries, cfg),
      updatedAt: coerceText(rawState.updatedAt || rawState.updated_at) || new Date().toISOString(),
    };
  }

  function readCustomerMemoryState(scopeRef, cfg) {
    const scope = resolveGuideScopeReference(scopeRef, cfg);
    if (scope.guideMode !== "customer") return null;
    if (cfg && cfg.customer_memory_enabled === false) return null;
    if (typeof window === "undefined" || !window.localStorage) return null;
    const key = getCustomerMemoryStorageKey(scope, cfg);
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const normalized = normalizeCustomerMemoryState(parsed, scope, cfg);
      if (!normalized) {
        window.localStorage.removeItem(key);
        return null;
      }
      return normalized;
    } catch (_err) {
      return null;
    }
  }

  function writeCustomerMemoryState(nextState, scopeRef, cfg) {
    const scope = resolveGuideScopeReference(scopeRef, cfg);
    if (scope.guideMode !== "customer") return false;
    if (cfg && cfg.customer_memory_enabled === false) return false;
    if (typeof window === "undefined" || !window.localStorage) return false;
    const key = getCustomerMemoryStorageKey(scope, cfg);
    const normalized = normalizeCustomerMemoryState(nextState, scope, cfg);
    if (!normalized) return false;
    try {
      window.localStorage.setItem(key, JSON.stringify(normalized));
      return true;
    } catch (_err) {
      return false;
    }
  }

  function appendCustomerMemoryEntry(summaryInput, entryOptions, scopeRef, cfg) {
    const scope = resolveGuideScopeReference(scopeRef, cfg);
    if (scope.guideMode !== "customer") return false;
    if (cfg && cfg.customer_memory_enabled === false) return false;
    const summary = coerceText(summaryInput);
    if (!summary) return false;
    const priorState = readCustomerMemoryState(scope, cfg);
    const entries = priorState && Array.isArray(priorState.entries) ? priorState.entries.slice() : [];
    const options = entryOptions && typeof entryOptions === "object" ? entryOptions : {};
    entries.push({
      at: new Date().toISOString(),
      page: coerceText(options.page || getCurrentPageSlug()),
      summary: summary,
    });
    return writeCustomerMemoryState(
      {
        scope: scope.scopeToken,
        guideMode: "customer",
        customerSlug: scope.customerSlug,
        customerName: scope.customerName,
        entries: entries,
        updatedAt: new Date().toISOString(),
      },
      scope,
      cfg
    );
  }

  function buildCustomerMemoryExcerpt(scopeRef, cfg) {
    const memory = readCustomerMemoryState(scopeRef, cfg);
    if (!memory || !Array.isArray(memory.entries) || memory.entries.length === 0) return "";
    const lines = memory.entries.slice(-4).map(function (entry) {
      const page = coerceText(entry.page) || "customer-page";
      return `- ${page}: ${coerceText(entry.summary)}`;
    });
    const excerpt = `Customer memory recap for ${coerceText(memory.customerName) || "this account"}:\n${lines.join("\n")}`;
    const limit = clampNumber(cfg && cfg.customer_memory_excerpt_char_limit, 300, 4000, 1200);
    return excerpt.length > limit ? `${excerpt.slice(0, limit)}…` : excerpt;
  }

  function buildCustomerMemoryEntryFromSession(launchSession, noteInput, scopeRef, cfg) {
    const payload =
      launchSession &&
      launchSession.contextPayload &&
      typeof launchSession.contextPayload === "object"
        ? launchSession.contextPayload
        : {};
    const scope = resolveGuideScopeReference(scopeRef || launchSession || {}, cfg);
    const note = coerceText(noteInput);
    const intent = coerceText(payload.likely_user_intent || payload.visitor_intent || payload.lead_capture_intent);
    const page = coerceText(payload.source_page || getCurrentPageSlug()) || getCurrentPageSlug();
    const questionRecap =
      Array.isArray(visitorQuestionLog) && visitorQuestionLog.length > 0
        ? `Recent questions: ${visitorQuestionLog.slice(-2).join(" | ")}`
        : "";
    const roamingState = readCrossPageRoamingState(scope, cfg);
    const transcriptRecap =
      roamingState && Array.isArray(roamingState.transcriptEntries) && roamingState.transcriptEntries.length > 0
        ? `Recent dialogue: ${roamingState.transcriptEntries
            .slice(-3)
            .map(function (entry) {
              const who = entry.role === "assistant" ? "Clerk" : "Visitor";
              return `${who}: ${coerceText(entry.text)}`;
            })
            .filter(Boolean)
            .join(" | ")}`
        : "";
    return combineContextBlocks(
      [
        `Customer: ${coerceText(scope.customerName) || coerceText(scope.customerSlug) || "unknown"} (${page})`,
        intent ? `Intent: ${intent}` : "",
        questionRecap,
        transcriptRecap,
        note ? `Exit note: ${note}` : "",
      ],
      420
    );
  }

  function maybeCaptureCustomerExitSweep(_launchSession, _closeOptions, _cfg) {
    return false;
  }

  function activateCrossPageRoamingFromLaunch(launchSession, cfg) {
    if (!shouldEnableCrossPageRoaming(cfg, launchSession)) return;
    if (!launchSession || typeof launchSession !== "object") return;
    if (isHomePageClerkDisabled()) return;
    const scope = resolveGuideScopeReference(launchSession, cfg);
    const payload = launchSession.contextPayload && typeof launchSession.contextPayload === "object"
      ? launchSession.contextPayload
      : {};
    const sourcePage = coerceText(payload.source_page || launchSession.contextSource || getCurrentPageSlug()) || getCurrentPageSlug();
    const context = coerceText(payload.context || payload.mode) || "technical-follow-up";
    const mode = coerceText(payload.mode) || context;
    const previous = readCrossPageRoamingState(scope, cfg);
    const nextState = {
      active: true,
      scope: scope.scopeToken,
      guideMode: scope.guideMode,
      customerSlug: scope.customerSlug,
      customerName: scope.customerName,
      siteSlug: scope.siteSlug,
      resumeAfterNavigation: false,
      lastPage: sourcePage,
      nextPage: "",
      context: context,
      mode: mode,
      transcriptEntries: previous && Array.isArray(previous.transcriptEntries) ? previous.transcriptEntries : [],
      updatedAt: new Date().toISOString(),
    };
    writeCrossPageRoamingState(nextState, scope, cfg);
  }

  function appendCrossPageRoamingTranscript(role, text, scopeRef) {
    const snippet = coerceText(text);
    if (!snippet) return;
    const cfg = getVoiceConfig();
    const state = readCrossPageRoamingState(scopeRef || pendingLaunchSession, cfg);
    if (!state || !state.active) return;
    const normalizedRole = isLikelyAssistantRole(role) ? "assistant" : "user";
    const compact = snippet.length > 260 ? `${snippet.slice(0, 260)}…` : snippet;
    const nextEntries = Array.isArray(state.transcriptEntries) ? state.transcriptEntries.slice() : [];
    nextEntries.push({
      role: normalizedRole,
      text: compact,
      at: new Date().toISOString(),
    });
    state.transcriptEntries = nextEntries.slice(-CROSS_PAGE_ROAMING_MAX_TRANSCRIPT_ENTRIES);
    state.updatedAt = new Date().toISOString();
    writeCrossPageRoamingState(state, scopeRef || pendingLaunchSession, cfg);
  }

  function markCrossPageRoamingForPageTransition(launchSession) {
    const cfg = getVoiceConfig();
    if (!shouldEnableCrossPageRoaming(cfg, launchSession)) return;
    const state = readCrossPageRoamingState(launchSession, cfg);
    if (!state || !state.active) return;
    const payload = launchSession && typeof launchSession === "object" && launchSession.contextPayload && typeof launchSession.contextPayload === "object"
      ? launchSession.contextPayload
      : {};
    const currentPage = coerceText(payload.source_page || getCurrentPageSlug()) || getCurrentPageSlug();
    const context = coerceText(payload.context || payload.mode || state.context) || "technical-follow-up";
    const mode = coerceText(payload.mode || state.mode) || context;
    state.resumeAfterNavigation = true;
    state.lastPage = currentPage;
    state.context = context;
    state.mode = mode;
    state.updatedAt = new Date().toISOString();
    writeCrossPageRoamingState(state, launchSession, cfg);
  }

  function markCrossPageRoamingNavigationTarget(targetPageSlug, scopeRef) {
    const nextPage = coerceText(targetPageSlug).toLowerCase();
    if (!nextPage) return;
    const cfg = getVoiceConfig();
    const state = readCrossPageRoamingState(scopeRef || pendingLaunchSession, cfg);
    if (!state || !state.active) return;
    state.nextPage = nextPage;
    state.resumeAfterNavigation = true;
    state.updatedAt = new Date().toISOString();
    writeCrossPageRoamingState(state, scopeRef || pendingLaunchSession, cfg);
  }

  function buildCrossPageRoamingSessionContext(cfg, roamingState, currentPage, previousPage) {
    const followupPrompt =
      coerceText(cfg && cfg.cross_page_roaming_followup_prompt) ||
      "Ask whether the visitor has any more questions on this page, then offer to guide them to the next tab.";
    const transitionLine =
      previousPage && previousPage !== currentPage
        ? `Visitor navigated from ${previousPage} to ${currentPage} while keeping the same Clerk conversation active.`
        : `Visitor is continuing the same Clerk conversation on ${currentPage}.`;
    const transcriptLines = Array.isArray(roamingState && roamingState.transcriptEntries)
      ? roamingState.transcriptEntries
          .slice(-6)
          .map(function (entry) {
            const who = entry.role === "assistant" ? "Clerk" : "Visitor";
            const line = coerceText(entry.text);
            if (!line) return "";
            return `${who}: ${line}`;
          })
          .filter(Boolean)
      : [];
    const transcriptBlock =
      transcriptLines.length > 0 ? `Recent dialogue context:\n${transcriptLines.join("\n")}` : "";
    return combineContextBlocks([transitionLine, followupPrompt, transcriptBlock], 1900);
  }

  function buildCrossPageRoamingLaunchOptions(cfg, roamingState) {
    if (!roamingState || typeof roamingState !== "object") return null;
    const currentPage = getCurrentPageSlug();
    if (!currentPage || currentPage === "index" || currentPage === "home") return null;
    const previousPage = coerceText(roamingState.lastPage);
    const context = coerceText(roamingState.context) || "technical-follow-up";
    const mode = coerceText(roamingState.mode) || context;
    const guideMode = coerceText(roamingState.guideMode).toLowerCase() === "customer" ? "customer" : "unity";
    const customerSlug = normalizeStorageScopeToken(roamingState.customerSlug, "");
    const customerName = coerceText(roamingState.customerName);
    const entryPrefix =
      guideMode === "customer" && customerSlug ? `customer-${customerSlug}` : currentPage;
    return {
      contextSource: currentPage,
      context: context,
      mode: mode,
      conversationMode: "followup",
      guideMode: guideMode,
      customer_slug: customerSlug,
      customer_name: customerName,
      sourcePage: currentPage,
      entryPoint: `${entryPrefix}-cross-page-roaming`,
      likelyUserIntent:
        guideMode === "customer"
          ? "customer visitor continued an existing Clerk conversation while navigating account pages"
          : "visitor continued an existing Clerk conversation while navigating Unity pages",
      sessionContext: buildCrossPageRoamingSessionContext(cfg, roamingState, currentPage, previousPage),
      uiMode: "modal",
      closeExistingSession: false,
    };
  }

  function maybeResumeCrossPageRoamingOnLoad() {
    const cfg = getVoiceConfig();
    if (!shouldAutoResumeCrossPageRoaming(cfg)) return false;
    if (!isClerkVoiceFeatureEnabled()) return false;
    if (isHomePageClerkDisabled()) return false;
    const scope = resolveGuideScopeReference({}, cfg);
    const state = readCrossPageRoamingState(scope, cfg);
    if (!state || !state.active || !state.resumeAfterNavigation) return false;
    const currentPage = getCurrentPageSlug();
    const targetPage = coerceText(state.nextPage);
    if (targetPage && targetPage !== currentPage) return false;
    const launchOptions = buildCrossPageRoamingLaunchOptions(cfg, state);
    if (!launchOptions) return false;
    state.resumeAfterNavigation = false;
    state.nextPage = "";
    state.lastPage = currentPage;
    state.updatedAt = new Date().toISOString();
    writeCrossPageRoamingState(state, scope, cfg);
    window.setTimeout(function () {
      const modal = document.getElementById("clerkVoiceModal");
      if (modal && modal.classList.contains("active")) return;
      openClerkWithPageContext(launchOptions);
    }, CROSS_PAGE_ROAMING_RESUME_DELAY_MS);
    return true;
  }

  function bindCrossPageRoamingNavigation() {
    if (navigationRoamingBound) return;
    navigationRoamingBound = true;
    document.querySelectorAll("a[href]").forEach(function (link) {
      if (!link || link.dataset.clerkRoamingBound === "1") return;
      link.dataset.clerkRoamingBound = "1";
      link.addEventListener("click", function () {
        const cfg = getVoiceConfig();
        const state = readCrossPageRoamingState(pendingLaunchSession || {}, cfg);
        if (!state || !state.active) return;
        const targetAttr = coerceText(link.getAttribute("target")).toLowerCase();
        if (targetAttr === "_blank") return;
        const href = coerceText(link.getAttribute("href"));
        if (!href || href.startsWith("#") || /^mailto:/i.test(href) || /^tel:/i.test(href) || /^javascript:/i.test(href)) {
          return;
        }
        const targetPageSlug = extractPageSlugFromHref(href);
        if (!targetPageSlug) return;
        markCrossPageRoamingNavigationTarget(targetPageSlug, pendingLaunchSession || {});
      });
    });
  }

  function normalizeLaunchToken(value, fallback) {
    const normalized = coerceText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return normalized || coerceText(fallback) || "clerk-launch";
  }

  function buildPageAwareLaunchOptions(rawInput, fallbackInput) {
    const fallback = fallbackInput && typeof fallbackInput === "object" ? fallbackInput : {};
    const fallbackSourcePage = coerceText(fallback.sourcePage || fallback.source_page) || getCurrentPageSlug();
    const fallbackContextSource =
      coerceText(fallback.contextSource || fallback.context_source || fallbackSourcePage) || fallbackSourcePage;
    const fallbackContext = coerceText(fallback.context || fallback.mode) || "technical-follow-up";
    const fallbackMode = coerceText(fallback.mode) || fallbackContext;
    const fallbackConversationMode =
      coerceText(fallback.conversationMode || fallback.conversation_mode) || "followup";
    const fallbackEntryPoint =
      coerceText(fallback.entryPoint || fallback.entry_point) || `${fallbackSourcePage}-clerk-launch`;
    const source = rawInput && typeof rawInput === "object" ? Object.assign({}, rawInput) : {};
    const sourceString = typeof rawInput === "string" ? coerceText(rawInput) : "";

    const resolvedContextSource = coerceText(
      source.contextSource ||
        source.context_source ||
        source.source ||
        sourceString ||
        fallbackContextSource
    ) || fallbackContextSource;
    const resolvedContext = coerceText(
      source.context ||
        source.mode ||
        source.contextMode ||
        source.context_mode ||
        sourceString ||
        fallbackContext
    ) || fallbackContext;
    const resolvedMode = coerceText(source.mode) || resolvedContext || fallbackMode;
    const resolvedSourcePage =
      coerceText(source.sourcePage || source.source_page || fallbackSourcePage) || fallbackSourcePage;
    const resolvedEntryPoint =
      coerceText(source.entryPoint || source.entry_point || fallbackEntryPoint) || fallbackEntryPoint;
    const resolvedConversationMode = coerceText(
      source.conversationMode || source.conversation_mode || fallbackConversationMode
    ) || "followup";
    const normalizedUiMode = normalizeUiMode(
      source.uiMode || source.ui_mode || fallback.uiMode || fallback.ui_mode || "modal",
      getVoiceConfig()
    );

    return Object.assign({}, fallback, source, {
      contextSource: resolvedContextSource,
      context: resolvedContext,
      mode: resolvedMode,
      sourcePage: resolvedSourcePage,
      entryPoint: resolvedEntryPoint,
      conversationMode: resolvedConversationMode,
      uiMode: normalizedUiMode,
    });
  }

  function openClerkFromLaunchInput(rawInput, fallbackInput) {
    if (!isClerkVoiceFeatureEnabled()) return false;
    const launchOptions = buildPageAwareLaunchOptions(rawInput, fallbackInput);
    return openClerkWithPageContext(launchOptions);
  }

  async function launchClerkWithPageContext(rawInput, fallbackInput) {
    if (!isClerkVoiceFeatureEnabled()) return false;
    const cfg = getVoiceConfig();
    try {
      await runUnityStartGatePreflight(cfg);
    } catch (_err) {}
    try {
      const patternPrefetchPromise = prefetchActivePagePatternContext().catch(function (_err) {
        return null;
      });
      if (isLikelySummaryboardPage()) {
        await Promise.race([
          patternPrefetchPromise,
          new Promise(function (resolve) {
            window.setTimeout(resolve, PATTERN_CONTEXT_PREFETCH_LAUNCH_BUDGET_MS);
          }),
        ]);
      }
    } catch (_err) {}
    return openClerkFromLaunchInput(rawInput, fallbackInput);
  }
  function isHomePageClerkDisabled() {
    return !isClerkVoiceAllowedOnCurrentPage(getVoiceConfig());
  }

  function isFloatingLauncherBlockedOnCurrentPage(cfg) {
    const blockedPages = normalizeClerkPageSlugList(
      cfg && cfg.floating_launcher_blocked_pages
    );
    if (blockedPages.length === 0) return false;
    const currentPage = normalizePageSlugToken(getCurrentPageSlug());
    if (!currentPage) return false;
    return blockedPages.includes(currentPage);
  }

  function isFloatingLauncherEnabled(cfg) {
    if (!cfg || cfg.floating_launcher_enabled === false) return false;
    if (!isClerkVoiceAllowedOnCurrentPage(cfg)) return false;
    if (isFloatingLauncherBlockedOnCurrentPage(cfg)) return false;
    return isClerkVoiceFeatureEnabled();
  }

  function getFloatingLauncherTooltip(cfg) {
    const configured = coerceText(cfg && cfg.floating_launcher_tooltip);
    return configured || "Meet with Clerk";
  }
  let unityEnergyAssetBaseHrefCache = null;
  function getUnityEnergyAssetBaseHref() {
    if (unityEnergyAssetBaseHrefCache !== null) return unityEnergyAssetBaseHrefCache;
    unityEnergyAssetBaseHrefCache = "";
    if (typeof document === "undefined") return unityEnergyAssetBaseHrefCache;
    const scriptNodes = Array.from(document.querySelectorAll("script[src]"));
    for (let i = scriptNodes.length - 1; i >= 0; i -= 1) {
      const node = scriptNodes[i];
      const src = coerceText(
        node && typeof node.getAttribute === "function"
          ? node.getAttribute("src")
          : ""
      ) || coerceText(node && node.src);
      if (!src) continue;
      if (!/clerk_voice_widget\.js(?:[?#].*)?$/i.test(src)) continue;
      try {
        const resolvedSrc = new URL(src, window.location.href).toString();
        const baseHref = resolvedSrc.replace(/clerk_voice_widget\.js(?:[?#].*)?$/i, "");
        if (!baseHref) continue;
        unityEnergyAssetBaseHrefCache = baseHref;
        return unityEnergyAssetBaseHrefCache;
      } catch (_err) {}
    }
    return unityEnergyAssetBaseHrefCache;
  }
  function buildFloatingLauncherAssetCandidateVariants(value) {
    const raw = coerceText(value);
    if (!raw) return [];
    const variants = [raw];
    const isAbsolute =
      /^(?:[a-z]+:)?\/\//i.test(raw) ||
      raw.startsWith("data:") ||
      raw.startsWith("blob:") ||
      raw.startsWith("/");
    if (!isAbsolute) {
      const normalized = raw.replace(/^\.?\//, "");
      if (normalized && !normalized.startsWith("../")) {
        variants.push(`/UnityEnergy/${normalized}`);
      }
      const unityEnergyBaseHref = getUnityEnergyAssetBaseHref();
      if (unityEnergyBaseHref) {
        try {
          variants.push(new URL(raw, unityEnergyBaseHref).toString());
        } catch (_err) {}
        if (normalized) {
          try {
            variants.push(new URL(normalized, unityEnergyBaseHref).toString());
          } catch (_err) {}
        }
      }
    }
    return Array.from(new Set(variants));
  }

  function getFloatingLauncherIconCandidates(cfg) {
    const seeds = [
      coerceText(cfg && cfg.floating_launcher_icon_url),
      coerceText(cfg && cfg.signal_portrait_url),
      coerceText(cfg && cfg.character_avatar_url),
    ].filter(Boolean);
    const candidates = [];
    seeds.forEach(function (seed) {
      buildFloatingLauncherAssetCandidateVariants(seed).forEach(function (variant) {
        if (!variant || candidates.includes(variant)) return;
        candidates.push(variant);
      });
    });
    return candidates;
  }

  function syncFloatingLauncherIcon(cfg) {
    const image = document.getElementById("clerkFloatingLauncherImg");
    if (!image) return;
    const candidates = getFloatingLauncherIconCandidates(cfg);
    if (candidates.length === 0) {
      image.hidden = true;
      image.removeAttribute("src");
      return;
    }
    image.hidden = false;
    image.dataset.fallbackIndex = "0";
    image.onerror = function () {
      const currentIndex = Number(image.dataset.fallbackIndex || "0");
      const nextIndex = currentIndex + 1;
      if (nextIndex >= candidates.length) {
        image.onerror = null;
        image.hidden = true;
        return;
      }
      image.dataset.fallbackIndex = String(nextIndex);
      image.src = candidates[nextIndex];
    };
    image.src = candidates[0];
  }

  function setFloatingLauncherVisible(visible) {
    const launcher = document.getElementById("clerkFloatingLauncherWrap");
    if (!launcher) return;
    if (!visible) {
      launcher.hidden = true;
      return;
    }
    const cfg = getVoiceConfig();
    launcher.hidden = !isFloatingLauncherEnabled(cfg);
  }

  function buildFloatingLauncherLaunchOptions(cfg) {
    const pageSlug = getCurrentPageSlug();
    const mode = coerceText(cfg && cfg.floating_launcher_context_mode) || "technical-follow-up";
    return {
      contextSource: pageSlug,
      context: mode,
      mode: mode,
      conversationMode: "followup",
      sourcePage: pageSlug,
      entryPoint: `${pageSlug}-floating-clerk-bubble`,
      likelyUserIntent: `visitor initiated Clerk from the persistent floating launcher on ${humanizeSlugToken(pageSlug) || pageSlug}`,
      responseStyleHint: coerceText(cfg && cfg.floating_launcher_response_style_hint),
      uiMode: "modal",
    };
  }

  async function runUnityStartGatePreflight(cfg) {
    unityStartGatePreflightReady = false;
    unityStartGatePreflightAttempted = false;
    unityStartGatePreflightFailed = false;
    unityStartGatePreflightStatusMessage = "";
    unityStartGatePendingRequiresRecovery = false;
    const requiresStartGate = shouldUseUnityStartGate(cfg);
    const shouldPreflight = shouldRunMicPreflight(cfg);
    if (!requiresStartGate && !shouldPreflight) return false;
    if (!shouldPreflight) return false;
    unityStartGatePreflightAttempted = true;
    trackExperimentTelemetryEvent("mic-preflight-attempt", {
      requires_start_gate: requiresStartGate,
      preflight_enabled: shouldPreflight,
    }, { cfg: cfg });
    try {
      await requestTopLevelMicAccess();
      unityStartGatePreflightReady = true;
      trackExperimentTelemetryEvent("mic-preflight-success", {}, { cfg: cfg });
      return true;
    } catch (err) {
      unityStartGatePreflightReady = false;
      unityStartGatePreflightFailed = true;
      unityStartGatePreflightStatusMessage = getMicrophoneRecoveryMessage(err);
      trackExperimentTelemetryEvent(
        "mic-preflight-failed",
        { message: coerceText(err && err.message) || getMicrophoneRecoveryMessage(err) },
        { cfg: cfg }
      );
      return false;
    }
  }

  async function openClerkFromFloatingLauncher() {
    const cfg = getVoiceConfig();
    if (!isFloatingLauncherEnabled(cfg)) return false;
    const launchOptions = buildFloatingLauncherLaunchOptions(cfg);
    await runUnityStartGatePreflight(cfg);
    return openClerkWithPageContext(launchOptions);
  }

  function ensureFloatingLauncher() {
    injectModalStyles();
    if (!document.body) return null;
    const cfg = getVoiceConfig();
    const tooltipText = getFloatingLauncherTooltip(cfg);
    const existing = document.getElementById("clerkFloatingLauncherWrap");
    if (existing) {
      existing.hidden = !isFloatingLauncherEnabled(cfg);
      const tooltip = document.getElementById("clerkFloatingLauncherTooltip");
      if (tooltip) tooltip.textContent = tooltipText;
      const button = document.getElementById("clerkFloatingLauncherBtn");
      if (button) {
        button.setAttribute("aria-label", tooltipText);
      }
      syncFloatingLauncherIcon(cfg);
      return existing;
    }

    const launcher = document.createElement("div");
    launcher.id = "clerkFloatingLauncherWrap";
    launcher.className = "clerk-floating-launcher-wrap";
    launcher.hidden = !isFloatingLauncherEnabled(cfg);
    launcher.innerHTML = `
      <button id="clerkFloatingLauncherBtn" class="clerk-floating-launcher-btn" type="button" aria-label="${tooltipText}">
        <img id="clerkFloatingLauncherImg" class="clerk-floating-launcher-img" alt="Clerk launcher icon" />
        <span class="clerk-floating-launcher-pulse" aria-hidden="true"></span>
      </button>
      <span id="clerkFloatingLauncherTooltip" class="clerk-floating-launcher-tooltip">${tooltipText}</span>
    `;
    document.body.appendChild(launcher);

    const button = document.getElementById("clerkFloatingLauncherBtn");
    if (button) {
      button.addEventListener("click", function () {
        openClerkFromFloatingLauncher();
      });
    }
    syncFloatingLauncherIcon(cfg);
    return launcher;
  }

  function resolveLaunchPageKey(launchSession) {
    const payload = launchSession && typeof launchSession.contextPayload === "object" ? launchSession.contextPayload : {};
    const candidates = [
      payload.source_page,
      payload.page_slug,
      payload.page,
      payload.context_page,
      launchSession && launchSession.contextSource,
      launchSession && launchSession.legacyContext,
      getCurrentPageSlug(),
    ];
    for (let i = 0; i < candidates.length; i += 1) {
      const key = normalizePageSlugToken(candidates[i]);
      if (key) return key;
    }
    return "index";
  }

  function resolvePageContextProfile(launchSession, cfg) {
    const profiles = normalizePageContextProfiles(cfg);
    const values = Object.values(profiles);
    if (values.length === 0) return null;
    const directKey = resolveLaunchPageKey(launchSession);
    if (directKey && profiles[directKey]) return profiles[directKey];

    const contextSources = collectLaunchContextSources(launchSession);
    for (let i = 0; i < values.length; i += 1) {
      const profile = values[i];
      if (!profile || !Array.isArray(profile.contextSources) || profile.contextSources.length === 0) continue;
      const matched = contextSources.some(function (source) {
        return matchesAnyPattern(source, profile.contextSources);
      });
      if (matched) return profile;
    }
    return null;
  }

  function mergeRequestedSkillPackIds(payload, additionalIds) {
    if (!payload || typeof payload !== "object") return;
    if (!Array.isArray(additionalIds) || additionalIds.length === 0) return;
    const merged = getRequestedSkillPackIds(payload);
    additionalIds.forEach(function (id) {
      const normalized = coerceText(id).toLowerCase();
      if (!normalized || merged.includes(normalized)) return;
      merged.push(normalized);
    });
    if (merged.length > 0) {
      payload.requested_skill_pack_ids = merged.slice(0, 12);
    }
  }

  function applySharedContextAwareness(launchSession, cfg) {
    if (!launchSession || typeof launchSession !== "object") return;
    if (!launchSession.contextPayload || typeof launchSession.contextPayload !== "object") {
      launchSession.contextPayload = {};
    }
    const payload = launchSession.contextPayload;
    const configuredSessionContext = coerceText(cfg && cfg.session_context);
    const launchSessionContext = coerceText(payload.session_context);
    const responsePrecedenceGuidance = coerceText(
      payload.response_precedence_guidance ||
      (cfg && cfg.response_precedence_guidance)
    );
    const knowledgeReferenceSpine = coerceText(
      payload.knowledge_reference_spine ||
      (cfg && cfg.knowledge_reference_spine)
    );
    const contentAwarenessMode = cfg ? cfg.content_awareness_mode !== false : true;
    const contentGroundingPolicy = coerceText(
      payload.content_grounding_policy ||
      (cfg && cfg.content_grounding_policy)
    );
    const unknownAnswerFallback = coerceText(
      payload.unknown_answer_fallback ||
      (cfg && cfg.unknown_answer_fallback)
    );
    const activeSkillPackTitles = Array.isArray(payload.skill_pack_titles)
      ? payload.skill_pack_titles
          .map(function (title) { return coerceText(title); })
          .filter(Boolean)
          .slice(0, 6)
          .join(", ")
      : "";
    const activeSkillPackExcerpt = coerceText(payload.skill_pack_excerpt);
    const syntaxContext = buildSyntaxAwarenessContext(cfg);
    const responseStyleHint = coerceText(payload.response_style_hint);
    const tokenBudgetProfile =
      payload.token_budget_profile && typeof payload.token_budget_profile === "object"
        ? payload.token_budget_profile
        : null;
    const tokenBudgetHint = tokenBudgetProfile
      ? `Token budget guidance: ${Object.entries(tokenBudgetProfile)
          .map(function ([key, value]) {
            const normalizedKey = coerceText(key).replace(/_/g, " ");
            const normalizedValue = Number.isFinite(Number(value)) ? Math.floor(Number(value)) : "";
            if (!normalizedKey || !normalizedValue) return "";
            return `${normalizedKey} ${normalizedValue}`;
          })
          .filter(Boolean)
          .join(", ")}.`
      : "";
    const profile = resolvePageContextProfile(launchSession, cfg);
    const measureManageExchangeGuidance = buildMeasureManageExchangeGuidance(profile, payload);
    const measureManageExchangeContextBlock = buildMeasureManageExchangeContextBlock(
      measureManageExchangeGuidance
    );

    let pageContextBlock = "";
    let pageAwareOpeningLine = "";
    let pageAwareFollowupPrompt = "";
    let pageAwareNameRequestLine = "";
    if (profile) {
      assignContextValueIfMissing(payload, "source_page", profile.id);
      assignContextValueIfMissing(payload, "page_context_title", profile.title);
      assignContextValueIfMissing(payload, "page_context_summary", profile.summary);
      if (Array.isArray(profile.keyPoints) && profile.keyPoints.length > 0) {
        assignContextValueIfMissing(payload, "page_context_key_points", profile.keyPoints);
      }
      if (Array.isArray(profile.skillPackIds) && profile.skillPackIds.length > 0) {
        mergeRequestedSkillPackIds(payload, profile.skillPackIds);
      }
      const keyPointBlock =
        Array.isArray(profile.keyPoints) && profile.keyPoints.length > 0
          ? `Active page points:\n- ${profile.keyPoints.join("\n- ")}`
          : "";
      pageAwareOpeningLine = buildPageAwareOpeningLine(profile, payload);
      pageAwareFollowupPrompt = buildPageAwareFollowupPrompt(profile, payload);
      pageAwareNameRequestLine = buildPageAwareNameRequestLine(profile, payload);
      if (pageAwareOpeningLine) {
        assignContextValueIfMissing(payload, "page_context_opening_line", pageAwareOpeningLine);
        assignContextValueIfMissing(payload, "opening_line", pageAwareOpeningLine);
      }
      if (pageAwareFollowupPrompt) {
        assignContextValueIfMissing(payload, "page_context_followup_prompt", pageAwareFollowupPrompt);
      }
      if (pageAwareNameRequestLine) {
        assignContextValueIfMissing(payload, "page_context_name_request_line", pageAwareNameRequestLine);
        assignContextValueIfMissing(payload, "name_request_line", pageAwareNameRequestLine);
      }
      pageContextBlock = combineContextBlocks(
        [
          profile.sessionContext,
          profile.summary ? `Active page context: ${profile.summary}` : "",
          keyPointBlock,
        ],
        1800
      );
      if (profile.id === "contact-us") {
        const contactGreeting =
          coerceText(payload.openai_auto_greeting_text) ||
          coerceText(cfg && cfg.contact_page_auto_greeting_text) ||
          "I hope you enjoyed the visit. Is there anything else I can show you before you contact our team?";
        assignContextValueIfMissing(payload, "openai_auto_greeting_text", contactGreeting);
      }
      if (pageAwareOpeningLine) {
        assignContextValueIfMissing(payload, "openai_auto_greeting_text", pageAwareOpeningLine);
      }
      appendSessionDecision(launchSession, "page-context-applied", {
        profile_id: profile.id,
        skill_pack_ids: profile.skillPackIds || [],
        page_opening_line: pageAwareOpeningLine || "",
      });
    } else {
      assignContextValueIfMissing(payload, "source_page", getCurrentPageSlug());
      pageAwareOpeningLine = buildPageAwareOpeningLine(null, payload);
      pageAwareFollowupPrompt = buildPageAwareFollowupPrompt(null, payload);
      pageAwareNameRequestLine = buildPageAwareNameRequestLine(null, payload);
      if (pageAwareOpeningLine) {
        assignContextValueIfMissing(payload, "page_context_opening_line", pageAwareOpeningLine);
        assignContextValueIfMissing(payload, "opening_line", pageAwareOpeningLine);
        assignContextValueIfMissing(payload, "openai_auto_greeting_text", pageAwareOpeningLine);
      }
      if (pageAwareFollowupPrompt) {
        assignContextValueIfMissing(payload, "page_context_followup_prompt", pageAwareFollowupPrompt);
      }
      if (pageAwareNameRequestLine) {
        assignContextValueIfMissing(payload, "page_context_name_request_line", pageAwareNameRequestLine);
        assignContextValueIfMissing(payload, "name_request_line", pageAwareNameRequestLine);
      }
    }
    if (responsePrecedenceGuidance) {
      assignContextValueIfMissing(payload, "response_precedence_guidance", responsePrecedenceGuidance);
    }
    if (knowledgeReferenceSpine) {
      assignContextValueIfMissing(payload, "knowledge_reference_spine", knowledgeReferenceSpine);
    }
    assignContextValueIfMissing(payload, "content_awareness_mode", contentAwarenessMode);
    if (contentGroundingPolicy) {
      assignContextValueIfMissing(payload, "content_grounding_policy", contentGroundingPolicy);
    }
    if (unknownAnswerFallback) {
      assignContextValueIfMissing(payload, "unknown_answer_fallback", unknownAnswerFallback);
    }
    if (measureManageExchangeGuidance && typeof measureManageExchangeGuidance === "object") {
      assignContextValueIfMissing(
        payload,
        "measure_manage_exchange_mode",
        coerceText(measureManageExchangeGuidance.mode)
      );
      assignContextValueIfMissing(
        payload,
        "measure_manage_exchange_page_focus",
        coerceText(measureManageExchangeGuidance.pageFocus)
      );
      assignContextValueIfMissing(
        payload,
        "measure_focus_guidance",
        coerceText(measureManageExchangeGuidance.measureFocus)
      );
      assignContextValueIfMissing(
        payload,
        "manage_focus_guidance",
        coerceText(measureManageExchangeGuidance.manageFocus)
      );
      assignContextValueIfMissing(
        payload,
        "exchange_focus_guidance",
        coerceText(measureManageExchangeGuidance.exchangeFocus)
      );
    }

    const sessionContextCharLimitRaw =
      payload.session_context_char_limit !== undefined
        ? payload.session_context_char_limit
        : cfg && cfg.session_context_char_limit;
    const mergedSessionContext = combineContextBlocks(
      [
        pageContextBlock,
        pageAwareOpeningLine ? `Page-aware opening line: ${pageAwareOpeningLine}` : "",
        pageAwareNameRequestLine ? `Page-aware immediate follow-up line: ${pageAwareNameRequestLine}` : "",
        pageAwareFollowupPrompt ? `Page-aware follow-up prompt: ${pageAwareFollowupPrompt}` : "",
        measureManageExchangeContextBlock,
        activeSkillPackTitles ? `Active grounding skill packs: ${activeSkillPackTitles}` : "",
        activeSkillPackExcerpt ? `Grounded source excerpt:\n${activeSkillPackExcerpt}` : "",
        launchSessionContext,
        responseStyleHint ? `Response style guidance: ${responseStyleHint}` : "",
        tokenBudgetHint,
        contentAwarenessMode
          ? "Content awareness mode is active: only provide Unity claims grounded in launch, page, and selected skill-pack context. If context is incomplete, explicitly state uncertainty before proceeding."
          : "",
        contentGroundingPolicy ? `Grounding policy: ${contentGroundingPolicy}` : "",
        unknownAnswerFallback ? `Unknown-answer fallback: ${unknownAnswerFallback}` : "",
        configuredSessionContext,
        responsePrecedenceGuidance ? `Response precedence: ${responsePrecedenceGuidance}` : "",
        knowledgeReferenceSpine ? `Canonical reference spine: ${knowledgeReferenceSpine}` : "",
        syntaxContext,
      ],
      clampNumber(sessionContextCharLimitRaw, 800, 8000, 3600)
    );
    if (mergedSessionContext) {
      payload.session_context = mergedSessionContext;
    }
    if (syntaxContext) {
      payload.syntax_awareness_active = true;
    }
  }

  function applySkillPackGroundingContext(launchSession, cfg) {
    if (!launchSession || typeof launchSession !== "object") return;
    if (!launchSession.contextPayload || typeof launchSession.contextPayload !== "object") {
      launchSession.contextPayload = {};
    }
    const payload = launchSession.contextPayload;
    const skillPackExcerpt = coerceText(payload.skill_pack_excerpt);
    const skillPackTitles = Array.isArray(payload.skill_pack_titles)
      ? payload.skill_pack_titles
          .map(function (title) { return coerceText(title); })
          .filter(Boolean)
          .slice(0, 6)
          .join(", ")
      : "";
    const contentGroundingPolicy = coerceText(
      payload.content_grounding_policy ||
      (cfg && cfg.content_grounding_policy)
    );
    const unknownAnswerFallback = coerceText(
      payload.unknown_answer_fallback ||
      (cfg && cfg.unknown_answer_fallback)
    );
    const groundingAppendix = combineContextBlocks(
      [
        skillPackTitles ? `Active grounding skill packs: ${skillPackTitles}` : "",
        skillPackExcerpt ? `Grounded source excerpt:\n${skillPackExcerpt}` : "",
        contentGroundingPolicy ? `Grounding policy: ${contentGroundingPolicy}` : "",
        unknownAnswerFallback ? `Unknown-answer fallback: ${unknownAnswerFallback}` : "",
      ],
      2600
    );
    if (!groundingAppendix) return;
    const sessionContextCharLimitRaw =
      payload.session_context_char_limit !== undefined
        ? payload.session_context_char_limit
        : cfg && cfg.session_context_char_limit;
    const mergedSessionContext = combineContextBlocks(
      [groundingAppendix, coerceText(payload.session_context)],
      clampNumber(sessionContextCharLimitRaw, 800, 8000, 3600)
    );
    if (mergedSessionContext) {
      payload.session_context = mergedSessionContext;
    }
  }

  function getContentScopeFallbackMessage(cfg) {
    const configured = coerceText(cfg && cfg.content_awareness_scope_fallback_message);
    if (configured) return configured;
    return "I can answer reliably from this page and approved Unity source files. If you want analysis outside this scope, share the exact page or file reference.";
  }

  function resolveConfiguredSourceFilesForLaunch(launchSession, cfg, profile) {
    const payload =
      launchSession && typeof launchSession.contextPayload === "object"
        ? launchSession.contextPayload
        : {};
    const map = normalizePageSourceFileMap(cfg);
    const keys = [];
    const collectKey = function (value) {
      const raw = coerceText(value);
      const normalized = normalizePageSlugToken(raw) || raw.toLowerCase();
      if (!normalized || keys.includes(normalized)) return;
      keys.push(normalized);
    };
    collectKey(payload.source_page);
    collectKey(payload.page_slug);
    collectKey(profile && profile.id);
    collectKey(launchSession && launchSession.contextSource);
    collectLaunchContextSources(launchSession).forEach(function (source) {
      collectKey(source);
    });
    const files = [];
    keys.forEach(function (key) {
      const mapped = map[key];
      if (!Array.isArray(mapped)) return;
      mapped.forEach(function (filePath) {
        const normalized = coerceText(filePath);
        if (!normalized || files.includes(normalized)) return;
        files.push(normalized);
      });
    });
    return files.slice(0, 32);
  }

  function resolveAllowedSourceFilesForLaunch(launchSession, cfg, profile) {
    const payload =
      launchSession && typeof launchSession.contextPayload === "object"
        ? launchSession.contextPayload
        : {};
    const merged = [];
    const mergeList = function (value, limit) {
      normalizeStringArray(value, limit).forEach(function (entry) {
        const normalized = coerceText(entry);
        if (!normalized || merged.includes(normalized)) return;
        merged.push(normalized);
      });
    };
    mergeList(payload.allowed_source_files, 32);
    mergeList(payload.allowed_context_files, 32);
    mergeList(payload.content_scope_allowed_files, 32);
    if (profile && Array.isArray(profile.sourceFiles)) {
      mergeList(profile.sourceFiles, 32);
    }
    mergeList(resolveConfiguredSourceFilesForLaunch(launchSession, cfg, profile), 32);
    mergeList(payload.skill_pack_source_docs, 32);
    mergeList(cfg && cfg.content_awareness_allowed_files, 32);
    return merged.slice(0, 32);
  }

  function applyContentFileScope(launchSession, cfg) {
    if (!launchSession || typeof launchSession !== "object") return;
    if (!launchSession.contextPayload || typeof launchSession.contextPayload !== "object") {
      launchSession.contextPayload = {};
    }
    const payload = launchSession.contextPayload;
    const profile = resolvePageContextProfile(launchSession, cfg);
    const snapshot = collectActivePageContextSnapshot();
    const activePageSlug = normalizePageSlugToken(getCurrentPageSlug()) || "index";
    let allowedSourceFiles = resolveAllowedSourceFilesForLaunch(launchSession, cfg, profile);
    const scopeLocked = cfg ? cfg.content_awareness_scope_lock !== false : true;
    const fallbackMessage = getContentScopeFallbackMessage(cfg);
    const pageContextMemoryEnabled = cfg ? cfg.page_context_memory_enabled !== false : true;
    const pageContextMemoryResult = pageContextMemoryEnabled
      ? upsertPageContextMemorySnapshot(activePageSlug, snapshot, launchSession, cfg)
      : { entry: null, state: null };
    const pageContextMemoryState =
      pageContextMemoryResult && pageContextMemoryResult.state
        ? pageContextMemoryResult.state
        : pageContextMemoryEnabled
          ? readPageContextMemoryState(launchSession, cfg)
          : null;
    const activePageMemoryEntry =
      pageContextMemoryResult && pageContextMemoryResult.entry
        ? pageContextMemoryResult.entry
        : findPageContextMemoryEntry(pageContextMemoryState, activePageSlug);
    const activePageMemorySummary = buildPageContextMemoryEntrySummary(activePageMemoryEntry, cfg);
    const knownPageMemorySummaries = buildKnownPageMemorySummaries(
      pageContextMemoryState,
      activePageSlug,
      cfg
    );
    const patternContext = getActivePagePatternContextForLaunch();
    const patternSourceFiles = normalizeStringArray(
      patternContext && Array.isArray(patternContext.source_files)
        ? patternContext.source_files
        : [],
      16
    );
    if (patternSourceFiles.length > 0) {
      allowedSourceFiles = allowedSourceFiles.concat(patternSourceFiles).filter(function (filePath, index, arr) {
        return Boolean(filePath) && arr.indexOf(filePath) === index;
      }).slice(0, 32);
    }
    const patternSummary =
      patternContext && typeof patternContext === "object"
        ? coerceText(patternContext.summary)
        : "";
    const patternTextExcerpts = normalizeStringArray(
      patternContext && Array.isArray(patternContext.text_file_excerpts)
        ? patternContext.text_file_excerpts
        : [],
      6
    );

    payload.page_context_memory_enabled = pageContextMemoryEnabled;
    assignContextValueIfMissing(payload, "active_page_slug", activePageSlug);
    assignContextValueIfMissing(payload, "active_page_pathname", snapshot.pathname);
    assignContextValueIfMissing(payload, "active_page_file", snapshot.fileName);
    assignContextValueIfMissing(payload, "active_page_url", snapshot.href);
    if (snapshot.title) {
      assignContextValueIfMissing(payload, "active_page_title", snapshot.title);
    }
    if (snapshot.metaDescription) {
      assignContextValueIfMissing(payload, "active_page_meta_description", snapshot.metaDescription);
    }
    if (Array.isArray(snapshot.headings) && snapshot.headings.length > 0) {
      assignContextValueIfMissing(payload, "active_page_headings", snapshot.headings.slice(0, 6));
    }
    if (snapshot.excerpt) {
      assignContextValueIfMissing(payload, "active_page_excerpt", snapshot.excerpt);
    }
    if (activePageMemoryEntry) {
      assignContextValueIfMissing(
        payload,
        "active_page_memory_visit_count",
        Number(activePageMemoryEntry.visitCount) || 1
      );
      assignContextValueIfMissing(
        payload,
        "active_page_memory_last_seen_at",
        coerceText(activePageMemoryEntry.lastSeenAt)
      );
      if (activePageMemorySummary) {
        assignContextValueIfMissing(payload, "active_page_memory_summary", activePageMemorySummary);
      }
    }
    if (pageContextMemoryState && Array.isArray(pageContextMemoryState.entries)) {
      assignContextValueIfMissing(
        payload,
        "page_context_memory_entry_count",
        pageContextMemoryState.entries.length
      );
      assignContextValueIfMissing(
        payload,
        "page_context_memory_known_pages",
        pageContextMemoryState.entries
          .map(function (entry) { return normalizePageSlugToken(entry && entry.pageSlug); })
          .filter(Boolean)
          .slice(-12)
          .reverse()
      );
    }
    if (knownPageMemorySummaries.length > 0) {
      assignContextValueIfMissing(payload, "known_page_memory_summaries", knownPageMemorySummaries);
    }
    payload.active_page_pattern_context_available =
      Boolean(patternSummary) || patternTextExcerpts.length > 0;
    if (patternSourceFiles.length > 0) {
      assignContextValueIfMissing(payload, "active_page_pattern_source_files", patternSourceFiles);
    }
    if (patternSummary) {
      assignContextValueIfMissing(payload, "active_page_pattern_summary", patternSummary);
    }
    if (patternTextExcerpts.length > 0) {
      assignContextValueIfMissing(payload, "active_page_pattern_text_excerpts", patternTextExcerpts);
    }
    if (
      patternContext &&
      Array.isArray(patternContext.entries) &&
      patternContext.entries.length > 0
    ) {
      assignContextValueIfMissing(
        payload,
        "active_page_pattern_entry_count",
        patternContext.entries.length
      );
      assignContextValueIfMissing(
        payload,
        "active_page_pattern_entries",
        patternContext.entries.slice(0, 4)
      );
    }
    payload.content_scope_lock_enabled = scopeLocked;
    payload.content_scope_mode = scopeLocked ? "strict-page-file" : "guided-page-file";
    payload.content_scope_fallback_message = fallbackMessage;
    if (allowedSourceFiles.length > 0) {
      payload.allowed_source_files = allowedSourceFiles;
      assignContextValueIfMissing(payload, "content_scope_primary_file", allowedSourceFiles[0]);
    }

    const scopeInstruction = scopeLocked
      ? "File scope lock is active: answer only from the active page context and allowed source files. If asked beyond this scope, explicitly say so and request the exact file or page."
      : "Prioritize the active page context and allowed source files for factual claims.";
    const allowedFilesBlock =
      allowedSourceFiles.length > 0
        ? `Allowed source files for this launch:\n- ${allowedSourceFiles.join("\n- ")}`
        : "";
    const patternContextBlock = combineContextBlocks(
      [
        patternSummary ? `William pattern summary:\n${patternSummary}` : "",
        patternTextExcerpts.length > 0
          ? `Pattern text excerpts:\n- ${patternTextExcerpts.join("\n- ")}`
          : "",
      ],
      2200
    );
    const scopeContextBlock = combineContextBlocks(
      [
        `Active page file: ${snapshot.fileName} (${snapshot.pathname}).`,
        snapshot.title ? `Active page title: ${snapshot.title}` : "",
        snapshot.metaDescription ? `Page description: ${snapshot.metaDescription}` : "",
        snapshot.excerpt ? `Page excerpt:\n${snapshot.excerpt}` : "",
        activePageMemorySummary ? `Remembered page context: ${activePageMemorySummary}` : "",
        knownPageMemorySummaries.length > 0
          ? `Known page memories:\n- ${knownPageMemorySummaries.join("\n- ")}`
          : "",
        patternContextBlock,
        scopeInstruction,
        allowedFilesBlock,
        `Scope fallback: ${fallbackMessage}`,
      ],
      2600
    );
    payload.content_scope_instructions = combineContextBlocks(
      [coerceText(payload.content_scope_instructions), scopeInstruction, allowedFilesBlock],
      2200
    );
    const sessionContextCharLimitRaw =
      payload.session_context_char_limit !== undefined
        ? payload.session_context_char_limit
        : cfg && cfg.session_context_char_limit;
    const mergedSessionContext = combineContextBlocks(
      [scopeContextBlock, coerceText(payload.session_context)],
      clampNumber(sessionContextCharLimitRaw, 800, 8000, 3600)
    );
    if (mergedSessionContext) {
      payload.session_context = mergedSessionContext;
    }
    appendSessionDecision(launchSession, "content-file-scope-applied", {
      source_page: coerceText(payload.source_page) || getCurrentPageSlug(),
      active_page_file: snapshot.fileName,
      scope_locked: scopeLocked,
      allowed_file_count: allowedSourceFiles.length,
      pattern_context_available:
        Boolean(patternSummary) || patternTextExcerpts.length > 0,
      pattern_source_file_count: patternSourceFiles.length,
    });
  }

  function isLikelySummaryboardPage() {
    const pathname = getCurrentPagePathname().toLowerCase();
    const title = coerceText(document && document.title).toLowerCase();
    return pathname.includes("summaryboard") || title.includes("summaryboard");
  }

  function buildSummaryboardPatternContextKey() {
    const pathname = getCurrentPagePathname();
    const pageSlug = getCurrentPageSlug();
    return `${pathname}::${pageSlug}`;
  }

  function resolveRelativeUrlFromCurrentPath(targetPath) {
    const normalizedTarget = coerceText(targetPath);
    if (!normalizedTarget) return "";
    if (/^(?:[a-z]+:)?\/\//i.test(normalizedTarget)) return normalizedTarget;
    if (normalizedTarget.startsWith("/")) return normalizedTarget;
    try {
      const base = new URL(getCurrentPageHref() || window.location.href);
      return new URL(normalizedTarget, base).pathname;
    } catch (_err) {
      return normalizedTarget;
    }
  }

  function collectSummaryboardPatternJsonCandidates() {
    const candidates = [];
    const addCandidate = function (value) {
      const normalized = resolveRelativeUrlFromCurrentPath(value);
      if (!normalized || candidates.includes(normalized)) return;
      candidates.push(normalized);
    };

    addCandidate("SET1_PatternAnalysisData.json");
    addCandidate("./SET1_PatternAnalysisData.json");
    addCandidate("../SET1_PatternAnalysisData.json");

    try {
      const scriptNodes = Array.from(document.querySelectorAll("script"));
      scriptNodes.forEach(function (node) {
        const content = coerceText(node && (node.textContent || node.innerText));
        if (!content || !content.includes("PatternAnalysisData")) return;
        const match = content.match(/['"]([^'"]*PatternAnalysisData[^'"]*\.json)['"]/i);
        if (!match || !match[1]) return;
        addCandidate(match[1]);
      });
    } catch (_err) {}

    return candidates.slice(0, 6);
  }

  function normalizePatternNarrativeText(value, maxChars) {
    const text = coerceText(value).replace(/\s+/g, " ").trim();
    if (!text) return "";
    const limit = Number.isFinite(Number(maxChars))
      ? Math.max(160, Math.floor(Number(maxChars)))
      : 1500;
    return text.length > limit ? `${text.slice(0, limit)}…` : text;
  }

  function extractPatternNarrativeEntriesFromPayload(payloadInput) {
    const payload = payloadInput && typeof payloadInput === "object" ? payloadInput : {};
    const entries = [];
    const sourceLists = [];
    if (Array.isArray(payload)) {
      sourceLists.push(payload);
    } else {
      [
        payload.transformers,
        payload.patterns,
        payload.items,
        payload.rows,
        payload.data,
      ].forEach(function (candidate) {
        if (Array.isArray(candidate)) sourceLists.push(candidate);
      });
    }
    if (sourceLists.length === 0 && payload && typeof payload === "object") {
      const objectValues = Object.values(payload).filter(function (value) {
        return value && typeof value === "object" && !Array.isArray(value);
      });
      if (objectValues.length > 0) {
        sourceLists.push(objectValues);
      }
    }
    sourceLists.forEach(function (list) {
      (Array.isArray(list) ? list : []).forEach(function (item) {
        if (!item || typeof item !== "object") return;
        const transformerId = normalizePatternNarrativeText(
          item.transformer_id || item.transformerId || item.transformer || item.id,
          120
        );
        const transformerName = normalizePatternNarrativeText(
          item.transformer_name || item.transformerName || item.name,
          160
        );
        const summary = normalizePatternNarrativeText(
          item.pattern_text ||
            item.pattern_summary ||
            item.patternSummary ||
            item.pattern_brief ||
            item.brief,
          1600
        );
        const part1 = normalizePatternNarrativeText(item.pattern_part1 || item.patternPart1, 1300);
        const part2 = normalizePatternNarrativeText(item.pattern_part2 || item.patternPart2, 1300);
        const part3 = normalizePatternNarrativeText(item.pattern_part3 || item.patternPart3, 1300);
        if (!summary && !part1 && !part2 && !part3) return;
        entries.push({
          transformer_id: transformerId,
          transformer_name: transformerName,
          pattern_summary: summary,
          pattern_part1: part1,
          pattern_part2: part2,
          pattern_part3: part3,
        });
      });
    });
    return entries.slice(0, 8);
  }

  function buildPatternNarrativeSummary(entries) {
    if (!Array.isArray(entries) || entries.length === 0) return "";
    const lines = entries
      .slice(0, 4)
      .map(function (entry) {
        const label =
          coerceText(entry.transformer_name) ||
          coerceText(entry.transformer_id) ||
          "Transformer";
        const summary =
          coerceText(entry.pattern_summary) ||
          coerceText(entry.pattern_part1) ||
          coerceText(entry.pattern_part2) ||
          coerceText(entry.pattern_part3);
        if (!summary) return "";
        return `- ${label}: ${summary}`;
      })
      .filter(Boolean);
    if (lines.length === 0) return "";
    return combineContextBlocks(
      ["William pattern interpretation highlights:", lines.join("\n")],
      2200
    );
  }

  function collectPatternTextFileCandidates(patternJsonPath) {
    const results = [];
    const addPath = function (value) {
      const normalized = resolveRelativeUrlFromCurrentPath(value);
      if (!normalized || results.includes(normalized)) return;
      if (!/\.txt$/i.test(normalized)) return;
      results.push(normalized);
    };
    if (patternJsonPath) {
      try {
        const parsed = new URL(patternJsonPath, window.location.href);
        const folder = parsed.pathname.split("/").slice(0, -1).join("/");
        if (folder) {
          [
            "Patterns/Pattern_brief.txt",
            "Patterns/Pattern_explains_p1.txt",
            "Patterns/Pattern_explains_p2.txt",
            "Patterns/Pattern_explains_p3.txt",
            "Patterns/Pattern_savings_howto.txt",
            "Patterns/Pattern_waste_howto.txt",
          ].forEach(function (suffix) {
            addPath(`${folder}/${suffix}`);
          });
        }
      } catch (_err) {}
    }
    return results.slice(0, 8);
  }

  async function fetchTextFileIfExists(url) {
    if (!url || typeof window.fetch !== "function") return "";
    try {
      const response = await window.fetch(url, { credentials: "same-origin" });
      if (!response || !response.ok) return "";
      const text = await response.text();
      return normalizePatternNarrativeText(text, 700);
    } catch (_err) {
      return "";
    }
  }

  async function loadPatternTextFileNarratives(patternJsonPath) {
    const candidates = collectPatternTextFileCandidates(patternJsonPath);
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return { files: [], excerpts: [] };
    }
    const files = [];
    const excerpts = [];
    for (let i = 0; i < candidates.length; i += 1) {
      const filePath = candidates[i];
      const excerpt = await fetchTextFileIfExists(filePath);
      if (!excerpt) continue;
      files.push(filePath);
      excerpts.push(`${filePath.split("/").pop()}: ${excerpt}`);
      if (excerpts.length >= 4) break;
    }
    return {
      files: files.slice(0, 6),
      excerpts: excerpts.slice(0, 4),
    };
  }

  function resolveActivePagePatternContextFromCache() {
    const cacheKey = buildSummaryboardPatternContextKey();
    if (!cacheKey || cacheKey !== activePagePatternContextCacheKey) return null;
    const ageMs = Date.now() - Number(activePagePatternContextFetchedAtMs || 0);
    if (!activePagePatternContextCache) return null;
    if (!Number.isFinite(ageMs) || ageMs > PATTERN_CONTEXT_PREFETCH_TTL_MS) return null;
    return activePagePatternContextCache;
  }

  async function fetchPatternAnalysisJsonContext() {
    const candidateUrls = collectSummaryboardPatternJsonCandidates();
    if (!Array.isArray(candidateUrls) || candidateUrls.length === 0) {
      return {
        json_url: "",
        source_files: [],
        entries: [],
        summary: "",
        text_file_excerpts: [],
      };
    }
    for (let i = 0; i < candidateUrls.length; i += 1) {
      const candidateUrl = candidateUrls[i];
      try {
        const response = await window.fetch(candidateUrl, { credentials: "same-origin" });
        if (!response || !response.ok) continue;
        const json = await response.json();
        const entries = extractPatternNarrativeEntriesFromPayload(json);
        if (!Array.isArray(entries) || entries.length === 0) continue;
        const summary = buildPatternNarrativeSummary(entries);
        const textNarratives = await loadPatternTextFileNarratives(candidateUrl);
        const sourceFiles = [candidateUrl]
          .concat(textNarratives.files || [])
          .filter(function (filePath, index, arr) {
            return Boolean(filePath) && arr.indexOf(filePath) === index;
          });
        return {
          json_url: candidateUrl,
          source_files: sourceFiles.slice(0, 10),
          entries: entries.slice(0, 8),
          summary: summary,
          text_file_excerpts: (textNarratives.excerpts || []).slice(0, 4),
        };
      } catch (_err) {}
    }
    return {
      json_url: "",
      source_files: [],
      entries: [],
      summary: "",
      text_file_excerpts: [],
    };
  }

  async function prefetchActivePagePatternContext() {
    if (!isLikelySummaryboardPage()) return null;
    if (typeof window.fetch !== "function") return null;
    const cacheKey = buildSummaryboardPatternContextKey();
    const cached = resolveActivePagePatternContextFromCache();
    if (cached) return cached;
    if (activePagePatternContextPromise) return activePagePatternContextPromise;
    activePagePatternContextPromise = (async function () {
      const fetched = await fetchPatternAnalysisJsonContext();
      const normalized = {
        page_key: cacheKey,
        fetched_at: new Date().toISOString(),
        json_url: coerceText(fetched && fetched.json_url),
        source_files: normalizeStringArray(
          fetched && Array.isArray(fetched.source_files) ? fetched.source_files : [],
          16
        ),
        entries: Array.isArray(fetched && fetched.entries) ? fetched.entries.slice(0, 8) : [],
        summary: coerceText(fetched && fetched.summary),
        text_file_excerpts: normalizeStringArray(
          fetched && Array.isArray(fetched.text_file_excerpts) ? fetched.text_file_excerpts : [],
          6
        ),
      };
      activePagePatternContextCache = normalized;
      activePagePatternContextCacheKey = cacheKey;
      activePagePatternContextFetchedAtMs = Date.now();
      return normalized;
    })();
    try {
      return await activePagePatternContextPromise;
    } finally {
      activePagePatternContextPromise = null;
    }
  }

  function getActivePagePatternContextForLaunch() {
    const cached = resolveActivePagePatternContextFromCache();
    if (cached && Array.isArray(cached.entries) && cached.entries.length > 0) {
      return cached;
    }
    if (!isLikelySummaryboardPage()) return null;
    const windowPayloadCandidates = [
      window && window.PATTERN_DATA,
      window && window.patternData,
      window && window.maxwellianPatternData,
    ];
    let entries = [];
    for (let i = 0; i < windowPayloadCandidates.length; i += 1) {
      const extracted = extractPatternNarrativeEntriesFromPayload(windowPayloadCandidates[i]);
      if (Array.isArray(extracted) && extracted.length > 0) {
        entries = extracted;
        break;
      }
    }
    if (!entries || entries.length === 0) return null;
    const summary = buildPatternNarrativeSummary(entries);
    const fallbackContext = {
      page_key: buildSummaryboardPatternContextKey(),
      fetched_at: new Date().toISOString(),
      json_url: "",
      source_files: collectSummaryboardPatternJsonCandidates().slice(0, 2),
      entries: entries.slice(0, 8),
      summary: summary,
      text_file_excerpts: [],
    };
    activePagePatternContextCache = fallbackContext;
    activePagePatternContextCacheKey = fallbackContext.page_key;
    activePagePatternContextFetchedAtMs = Date.now();
    return fallbackContext;
  }

  function getTrimmedConfigText(cfg, key) {
    if (!cfg || typeof cfg !== "object") return "";
    return typeof cfg[key] === "string" ? cfg[key].trim() : "";
  }

  function normalizeVisitorName(rawName) {
    const text = coerceText(rawName).replace(/[^A-Za-z' -]/g, " ").replace(/\s+/g, " ");
    if (!text) return "";
    const words = text
      .split(" ")
      .filter(Boolean)
      .slice(0, 3)
      .map(function (word) {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .filter(Boolean);
    if (words.length === 0) return "";
    const candidate = words.join(" ");
    if (!/^[A-Za-z][A-Za-z' -]{0,46}$/.test(candidate)) return "";
    return candidate;
  }

  function normalizeVisitorCompany(rawCompany) {
    const text = coerceText(rawCompany)
      .replace(/[<>{}[\]]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return "";
    const trimmed = text
      .replace(/^[,.\-:;()\s]+/, "")
      .replace(/[,.\-:;()\s]+$/, "")
      .trim();
    if (!trimmed || trimmed.length < 2) return "";
    if (trimmed.length > 90) return `${trimmed.slice(0, 90).trim()}…`;
    return trimmed;
  }

  function normalizeVisitorEmail(rawEmail) {
    const candidate = coerceText(rawEmail)
      .toLowerCase()
      .replace(/^[<(\["'\s]+/, "")
      .replace(/[>)\]"'\s.,;:!?]+$/, "");
    if (!candidate) return "";
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(candidate)) return "";
    return candidate;
  }

  function parseVisitorNameFromText(text) {
    const sample = coerceText(text);
    if (!sample) return "";
    const patterns = [
      /\b(?:my name is|i am|i'm|this is|call me)\s+([A-Za-z][A-Za-z' -]{0,50})/i,
      /\b(?:name's)\s+([A-Za-z][A-Za-z' -]{0,50})/i,
    ];
    for (let i = 0; i < patterns.length; i += 1) {
      const match = sample.match(patterns[i]);
      if (!match || !match[1]) continue;
      const normalized = normalizeVisitorName(match[1]);
      if (/\b(founder|ceo|president|manager|director|engineer|operator|unity|energy)\b/i.test(normalized)) {
        continue;
      }
      if (normalized) return normalized;
    }
    return "";
  }

  function getFounderIdentityAliases(cfg) {
    const defaults = ["mike howell", "mike", "mr howell", "michael howell"];
    const configured = Array.isArray(cfg && cfg.founder_identity_aliases)
      ? cfg.founder_identity_aliases
          .map(function (value) { return coerceText(value).toLowerCase(); })
          .filter(Boolean)
      : [];
    const all = configured.concat(defaults);
    const unique = [];
    all.forEach(function (value) {
      if (!value || unique.includes(value)) return;
      unique.push(value);
    });
    return unique;
  }

  function detectFounderSignal(text, cfg) {
    if (!cfg || cfg.founder_detection_enabled === false) {
      return { active: false, identity: "" };
    }
    const sample = coerceText(text).toLowerCase();
    if (!sample) return { active: false, identity: "" };
    const hasIntroPhrase = /\b(this is|i am|i'm|my name is)\b/i.test(sample);
    const hasFounderClaim = /\b(founder|founder of unity energy|unity founder)\b/i.test(sample);
    const hasUnityRef = /\bunity energy\b/i.test(sample);
    const aliases = getFounderIdentityAliases(cfg);
    const aliasHit = aliases.some(function (alias) {
      return alias && sample.includes(alias);
    });
    if (!(hasIntroPhrase && hasFounderClaim && (aliasHit || hasUnityRef))) {
      return { active: false, identity: "" };
    }
    const configuredName = coerceText(cfg && cfg.founder_identity_name);
    if (sample.includes("mike howell") || sample.includes("michael howell")) {
      return { active: true, identity: "Mike Howell" };
    }
    if (configuredName) return { active: true, identity: configuredName };
    if (currentVisitorName) return { active: true, identity: currentVisitorName };
    return { active: true, identity: "Founder" };
  }

  function clampNumber(value, min, max, fallback) {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    return Math.max(min, Math.min(max, Math.floor(num)));
  }

  function getGuardrailSettings(cfg) {
    return {
      enabled: Boolean(cfg && cfg.guardrails_enabled),
      founderBypass: cfg && cfg.guardrails_founder_bypass !== false,
      maxQuestions: clampNumber(cfg && cfg.guardrails_max_questions_per_session, 3, 50, 10),
      minQuestions: clampNumber(cfg && cfg.guardrails_question_limit_min, 1, 50, 8),
      freeQuestions: clampNumber(cfg && cfg.guardrails_free_questions, 0, 10, 3),
      maxMinutes: clampNumber(cfg && cfg.guardrails_max_session_minutes, 2, 120, 18),
      idleSeconds: clampNumber(cfg && cfg.guardrails_idle_timeout_seconds, 5, 1800, 90),
      idleFollowupSeconds: clampNumber(cfg && cfg.guardrails_idle_followup_seconds, 5, 1800, 35),
      idleFinalExitSeconds: clampNumber(
        cfg && cfg.guardrails_idle_final_exit_seconds,
        5,
        1800,
        25
      ),
      idleFirstPromptMessage:
        coerceText(cfg && cfg.guardrails_idle_first_prompt_message) ||
        "Can I help with anything else on this page?",
      idleFinalPromptMessage:
        coerceText(cfg && cfg.guardrails_idle_final_prompt_message) ||
        "Any other Unity Energy questions before I close this session?",
      idlePromptsEnabled: !cfg || cfg.guardrails_idle_prompts_enabled !== false,
      lowRelevanceLimit: clampNumber(cfg && cfg.guardrails_low_relevance_limit, 1, 6, 3),
      minRelevanceScore: clampNumber(cfg && cfg.guardrails_min_relevance_score, 1, 8, 1),
      maxSessionsPerDay: clampNumber(cfg && cfg.guardrails_max_sessions_per_day, 1, 100, 20),
      dailyMeteringEnabled: !cfg || cfg.guardrails_enable_daily_metering !== false,
      questionLimitMessage: coerceText(cfg && cfg.guardrails_question_limit_message),
      offboardMessage: coerceText(cfg && cfg.guardrails_offboard_message),
      contactEmail: coerceText(cfg && cfg.guardrails_contact_email) || "sales@unityenergy.com",
      contactUrl: coerceText(cfg && cfg.guardrails_contact_url) || "https://unityenergy.com/contact-us",
      contactRedirectUrl:
        coerceText(cfg && cfg.guardrails_contact_redirect_url) || "/UnityEnergy/contact-us.html",
      interestedIdentityPromptAfterQuestions: clampNumber(
        cfg && cfg.guardrails_interested_identity_prompt_after_questions,
        1,
        12,
        4
      ),
      interestedIdentityPromptMessage: coerceText(
        cfg && cfg.guardrails_interested_identity_prompt_message
      ),
      interestedFollowupMessage: coerceText(cfg && cfg.guardrails_interested_followup_message),
      relevanceKeywords: Array.isArray(cfg && cfg.guardrails_relevance_keywords)
        ? cfg.guardrails_relevance_keywords
            .map(function (kw) { return coerceText(kw).toLowerCase(); })
            .filter(Boolean)
        : [],
    };
  }

  function shouldBypassGuardrails(settings) {
    return Boolean(settings && settings.founderBypass && founderModeActive);
  }

  function getGuardrailStorageKey() {
    return "maxwellian_clerk_guardrail_meter_v1";
  }

  function getTodayKey() {
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function readDailyMeter() {
    const base = { date: getTodayKey(), sessions_started: 0 };
    try {
      const raw = window.localStorage.getItem(getGuardrailStorageKey());
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return base;
      if (parsed.date !== base.date) return base;
      const sessions = clampNumber(parsed.sessions_started, 0, 10000, 0);
      return { date: base.date, sessions_started: sessions };
    } catch (_err) {
      return base;
    }
  }

  function writeDailyMeter(state) {
    if (!state || typeof state !== "object") return;
    try {
      window.localStorage.setItem(getGuardrailStorageKey(), JSON.stringify(state));
    } catch (_err) {}
  }

  function clearDailyMeter() {
    try {
      window.localStorage.removeItem(getGuardrailStorageKey());
    } catch (_err) {}
  }

  function buildGuardrailOffboardMessage(settings, reason) {
    const reasonToken = coerceText(reason).toLowerCase();
    if (reasonToken === "question-limit") {
      return (
        (settings && settings.questionLimitMessage) ||
        "You've reached this session's question limit for this page. I can have a specialist contact you, or send you to our contact page so you can share your information."
      );
    }
    const reasonLabel = coerceText(reason).replace(/-/g, " ");
    const core =
      settings && settings.offboardMessage
        ? settings.offboardMessage
        : "We appreciate your interest in Unity Energy. For deeper support, please contact Unity Energy Sales.";
    if (!reasonLabel) return core;
    return `${core} (${reasonLabel})`;
  }

  function clearGuardrailIdleTimer() {
    if (!guardrailIdleTimer) return;
    window.clearTimeout(guardrailIdleTimer);
    guardrailIdleTimer = null;
  }

  function clearGuardrailOffboardCloseTimer() {
    if (!guardrailOffboardCloseTimer) return;
    window.clearTimeout(guardrailOffboardCloseTimer);
    guardrailOffboardCloseTimer = null;
  }

  function setGuardrailIdlePromptStage(nextStage, reason, shouldPostToRenderer) {
    const normalizedStage = clampNumber(nextStage, 0, 3, 0);
    guardrailIdlePromptStage = normalizedStage;
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return;
    if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
      pendingLaunchSession.contextPayload = {};
    }
    pendingLaunchSession.contextPayload.guardrail_idle_prompt_stage = normalizedStage;
    pendingLaunchSession.contextPayload.guardrail_idle_prompt_active = normalizedStage > 0;
    pendingLaunchSession.contextPayload.guardrail_idle_prompt_updated_at = new Date().toISOString();
    if (coerceText(reason)) {
      appendSessionDecision(pendingLaunchSession, reason, {
        stage: normalizedStage,
      });
    }
    if (shouldPostToRenderer) {
      postToWidgetFrame({ type: "maxwellian_session_launch", payload: pendingLaunchSession });
    }
  }

  function getGuardrailIdleTimeoutMs(settings) {
    if (guardrailIdlePromptStage <= 0) {
      return Math.max(1000, settings.idleSeconds * 1000);
    }
    if (guardrailIdlePromptStage === 1) {
      return Math.max(1000, settings.idleFollowupSeconds * 1000);
    }
    return Math.max(1000, settings.idleFinalExitSeconds * 1000);
  }

  function getGuardrailExtendedQaMissingIdentityFields(cfg) {
    const state = ensureLeadCaptureState(currentVisitorName);
    const leadSettings = getLeadCaptureSettings(cfg);
    const missing = [];
    if (!coerceText(state && state.name)) missing.push("name");
    if (leadSettings.collectCompany && !coerceText(state && state.company)) missing.push("company");
    if (!coerceText(state && state.email)) missing.push("email");
    return missing;
  }

  function formatMissingFieldListForSpeech(missingFields) {
    if (!Array.isArray(missingFields) || missingFields.length === 0) return "contact details";
    if (missingFields.length === 1) return missingFields[0];
    if (missingFields.length === 2) return `${missingFields[0]} and ${missingFields[1]}`;
    return `${missingFields.slice(0, -1).join(", ")}, and ${missingFields[missingFields.length - 1]}`;
  }

  function buildInterestedIdentityCapturePrompt(missingFields, settings) {
    const configured = coerceText(settings && settings.interestedIdentityPromptMessage);
    if (configured) return configured;
    const missingLabel = formatMissingFieldListForSpeech(missingFields);
    return `Happy to keep helping. Before we continue, may I get your ${missingLabel} so we can follow up with you directly?`;
  }

  function isInterestedContinuationIntent(text) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return false;
    return /\b(more questions|another question|keep going|continue|still have questions|can i ask|i have questions|more help)\b/.test(sample);
  }

  function maybeHandleInterestedVisitorOnboarding(transcriptText, cfg, questionLogged, settings) {
    const activeSettings =
      settings && typeof settings === "object" ? settings : getGuardrailSettings(cfg);
    const missingIdentityFields = getGuardrailExtendedQaMissingIdentityFields(cfg);
    const hasMissingIdentity = missingIdentityFields.length > 0;
    const interestedIntent = isInterestedContinuationIntent(transcriptText);
    const thresholdHit =
      Boolean(questionLogged) &&
      visitorQuestionCount >= activeSettings.interestedIdentityPromptAfterQuestions &&
      guardrailLeadCapturePromptCount < visitorQuestionCount;
    if (hasMissingIdentity && (interestedIntent || thresholdHit)) {
      guardrailLeadCapturePromptCount = Math.max(guardrailLeadCapturePromptCount, visitorQuestionCount);
      if (pendingLaunchSession && typeof pendingLaunchSession === "object") {
        if (
          !pendingLaunchSession.contextPayload ||
          typeof pendingLaunchSession.contextPayload !== "object"
        ) {
          pendingLaunchSession.contextPayload = {};
        }
        pendingLaunchSession.contextPayload.lead_capture_extended_qa_gate = true;
        pendingLaunchSession.contextPayload.lead_capture_extended_qa_missing_identity_fields =
          missingIdentityFields;
        pendingLaunchSession.contextPayload.lead_capture_extended_qa_gate_updated_at =
          new Date().toISOString();
        appendSessionDecision(pendingLaunchSession, "interested-visitor-identity-gate-prompted", {
          missing_fields: missingIdentityFields,
          question_count: visitorQuestionCount,
          trigger: interestedIntent ? "explicit-interest" : "question-threshold",
        });
        postToWidgetFrame({ type: "maxwellian_session_launch", payload: pendingLaunchSession });
      }
      return {
        statusText: buildInterestedIdentityCapturePrompt(missingIdentityFields, activeSettings),
        statusDurationMs: 3800,
      };
    }
    if (!hasMissingIdentity && interestedIntent) {
      return {
        statusText:
          coerceText(activeSettings.interestedFollowupMessage) ||
          "Thank you for your interest in Unity Energy. We have your information and will follow up directly. What is your next question?",
        statusDurationMs: 3000,
      };
    }
    return null;
  }

  function setGuardrailContactRedirect(settings) {
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return "";
    if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
      pendingLaunchSession.contextPayload = {};
    }
    const redirectUrl =
      coerceText(settings && settings.contactRedirectUrl) || "/UnityEnergy/contact-us.html";
    pendingLaunchSession.contextPayload.post_conversation_redirect_url = redirectUrl;
    pendingLaunchSession.contextPayload.guardrail_contact_redirect_url = redirectUrl;
    return redirectUrl;
  }

  function scoreRelevance(text, settings) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return 0;
    const normalized = sample.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    if (!normalized) return 0;
    const keywords = Array.isArray(settings && settings.relevanceKeywords) ? settings.relevanceKeywords : [];
    let score = 0;
    keywords.forEach(function (keyword) {
      if (!keyword) return;
      if (normalized.includes(keyword)) score += 1;
    });
    if (/\b(power|energy|electrical|facility|plant|site)\b/i.test(normalized)) score += 1;
    if (/\?/.test(sample)) score += 1;
    return score;
  }

  function resetGuardrailState() {
    clearGuardrailIdleTimer();
    clearGuardrailOffboardCloseTimer();
    resetElectricalStoryGuardrailState();
    guardrailSessionStartedAt = 0;
    guardrailLastActivityAt = 0;
    guardrailQuestionCount = 0;
    guardrailQuestionCap = 0;
    guardrailLowRelevanceStreak = 0;
    guardrailOffboarded = false;
    guardrailIdlePromptStage = 0;
    guardrailLeadCapturePromptCount = 0;
    guardrailSessionToken = "";
  }

  function markGuardrailActivity() {
    guardrailLastActivityAt = Date.now();
  }

  function clearGuardrailIdlePromptFlow(cfg, reason, shouldPostToRenderer) {
    if (guardrailIdlePromptStage <= 0) return;
    setGuardrailIdlePromptStage(0, reason || "guardrail-idle-flow-cleared", shouldPostToRenderer);
    const guardrailSettings = getGuardrailSettings(cfg);
    scheduleGuardrailIdleTimer(guardrailSettings, cfg);
  }

  function resolveGuardrailQuestionCap(settings) {
    const maxQuestions = Math.max(1, Number(settings && settings.maxQuestions) || 5);
    const minQuestions = Math.max(
      1,
      Math.min(maxQuestions, Number(settings && settings.minQuestions) || maxQuestions)
    );
    if (minQuestions >= maxQuestions) return maxQuestions;
    return minQuestions + Math.floor(Math.random() * (maxQuestions - minQuestions + 1));
  }

  function scheduleGuardrailIdleTimer(settings, cfg) {
    clearGuardrailIdleTimer();
    if (!settings || !settings.enabled || shouldBypassGuardrails(settings)) return;
    if (!hasConversationStarted) return;
    const timeoutMs = getGuardrailIdleTimeoutMs(settings);
    guardrailIdleTimer = window.setTimeout(function () {
      const modal = document.getElementById("clerkVoiceModal");
      if (!modal || !modal.classList.contains("active")) return;
      if (guardrailOffboarded) return;
      if (!settings.idlePromptsEnabled) {
        setGuardrailIdlePromptStage(3, "guardrail-idle-autoclose", true);
        closeClerkVoiceModal({
          reason: "guardrail-idle-autoclose",
          preserveRoaming: false,
          preserveDailyMeter: true,
        });
        return;
      }
      if (guardrailIdlePromptStage <= 0) {
        setGuardrailIdlePromptStage(1, "guardrail-idle-nudge-sent", true);
        setStatus(
          coerceText(settings.idleFirstPromptMessage) || "Can I help with anything else on this page?",
          false,
          true
        );
        scheduleGuardrailIdleTimer(settings, cfg);
        return;
      }
      if (guardrailIdlePromptStage === 1) {
        setGuardrailIdlePromptStage(2, "guardrail-idle-final-nudge-sent", true);
        setStatus(
          coerceText(settings.idleFinalPromptMessage) ||
            "Any other Unity Energy questions before I close this session?",
          false,
          true
        );
        scheduleGuardrailIdleTimer(settings, cfg);
        return;
      }
      setGuardrailIdlePromptStage(3, "guardrail-idle-final-timeout", true);
      triggerGuardrailOffboarding("idle-timeout", settings, cfg);
    }, timeoutMs);
  }

  function initializeGuardrailSession(settings, cfg) {
    resetGuardrailState();
    guardrailSessionStartedAt = Date.now();
    guardrailLastActivityAt = guardrailSessionStartedAt;
    guardrailSessionToken = `gr_${guardrailSessionStartedAt.toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") {
      return { allowed: true };
    }
    if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
      pendingLaunchSession.contextPayload = {};
    }

    pendingLaunchSession.contextPayload.guardrails_enabled = Boolean(settings && settings.enabled);
    pendingLaunchSession.contextPayload.guardrail_session_token = guardrailSessionToken;
    pendingLaunchSession.contextPayload.conversation_mode = pendingLaunchSession.contextPayload.conversation_mode || "customer";
    appendSessionDecision(pendingLaunchSession, "guardrail-initialized", {
      enabled: Boolean(settings && settings.enabled),
      founder_bypass: shouldBypassGuardrails(settings),
      token: guardrailSessionToken,
    });

    if (!settings || !settings.enabled || shouldBypassGuardrails(settings)) {
      return { allowed: true };
    }
    guardrailQuestionCap = resolveGuardrailQuestionCap(settings);

    if (settings.dailyMeteringEnabled) {
      const meter = readDailyMeter();
      if (meter.sessions_started >= settings.maxSessionsPerDay) {
        const message = buildGuardrailOffboardMessage(settings, "daily-session-limit");
        appendSessionDecision(pendingLaunchSession, "guardrail-blocked", {
          reason: "daily-session-limit",
          sessions_started: meter.sessions_started,
          max_sessions_per_day: settings.maxSessionsPerDay,
        });
        return { allowed: false, message: message };
      }
      meter.sessions_started += 1;
      writeDailyMeter(meter);
      pendingLaunchSession.contextPayload.guardrail_daily_sessions_started = meter.sessions_started;
    }

    pendingLaunchSession.contextPayload.guardrail_limits = {
      max_questions: guardrailQuestionCap || settings.maxQuestions,
      free_questions: settings.freeQuestions,
      max_minutes: settings.maxMinutes,
      idle_seconds: settings.idleSeconds,
      low_relevance_limit: settings.lowRelevanceLimit,
      min_relevance_score: settings.minRelevanceScore,
    };
    appendSessionDecision(pendingLaunchSession, "guardrail-limits-applied", pendingLaunchSession.contextPayload.guardrail_limits);
    return { allowed: true };
  }

  function evaluateGuardrailQuestion(text, settings) {
    if (!settings || !settings.enabled || shouldBypassGuardrails(settings)) {
      return { allow: true };
    }
    if (guardrailOffboarded) return { allow: false, reason: "offboarded" };
    const elapsedMinutes = (Date.now() - guardrailSessionStartedAt) / 60000;
    if (elapsedMinutes > settings.maxMinutes) {
      return { allow: false, reason: "session-time-limit" };
    }

    guardrailQuestionCount += 1;
    const questionCap = guardrailQuestionCap || settings.maxQuestions;
    if (guardrailQuestionCount > questionCap) {
      return { allow: false, reason: "question-limit" };
    }

    if (guardrailQuestionCount > settings.freeQuestions) {
      const relevanceScore = scoreRelevance(text, settings);
      if (relevanceScore < settings.minRelevanceScore) {
        guardrailLowRelevanceStreak += 1;
      } else {
        guardrailLowRelevanceStreak = 0;
      }
      if (guardrailLowRelevanceStreak >= settings.lowRelevanceLimit) {
        return { allow: false, reason: "low-relevance-streak" };
      }
    }
    return { allow: true };
  }

  function enforceGuardrailHeartbeat(settings) {
    if (!settings || !settings.enabled || shouldBypassGuardrails(settings) || guardrailOffboarded) return { allow: true };
    const elapsedMinutes = (Date.now() - guardrailSessionStartedAt) / 60000;
    if (elapsedMinutes > settings.maxMinutes) {
      return { allow: false, reason: "session-time-limit" };
    }
    return { allow: true };
  }

  function triggerGuardrailOffboarding(reason, settings, cfg) {
    if (guardrailOffboarded) return;
    guardrailOffboarded = true;
    clearGuardrailIdleTimer();
    clearGuardrailOffboardCloseTimer();
    setGuardrailIdlePromptStage(3, "guardrail-offboarded", false);
    const redirectUrl = setGuardrailContactRedirect(settings);
    const message = buildGuardrailOffboardMessage(settings, reason);
    setStatus(message, false, true);
    setStartButtonVisible(false);

    if (pendingLaunchSession && typeof pendingLaunchSession === "object") {
      if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
        pendingLaunchSession.contextPayload = {};
      }
      Object.assign(pendingLaunchSession.contextPayload, {
        guardrail_offboarded: true,
        guardrail_offboard_reason: reason,
        guardrail_contact_email: settings.contactEmail,
        guardrail_contact_url: settings.contactUrl,
        guardrail_contact_redirect_url: redirectUrl,
      });
      appendSessionDecision(pendingLaunchSession, "guardrail-offboarded", {
        reason: reason,
        contact_email: settings.contactEmail,
        contact_redirect_url: redirectUrl,
      });
      postToWidgetFrame({ type: "maxwellian_session_launch", payload: pendingLaunchSession });
    }
    postToWidgetFrame({ type: "cancel" });
    guardrailOffboardCloseTimer = window.setTimeout(function () {
      closeClerkVoiceModal({
        reason: "guardrail-offboard",
        preserveRoaming: false,
        preserveDailyMeter: true,
      });
    }, 1800);
  }

  function getElectricalStoryGuardrailSettings(cfg) {
    return {
      enabled: Boolean(cfg && cfg.electrical_story_guardrails_enabled),
      requireNameCompany:
        !cfg ||
        cfg.electrical_story_require_name_company_before_history_answers !== false,
      maxQuestions: clampNumber(
        cfg && cfg.electrical_story_history_question_limit,
        1,
        20,
        6
      ),
      minQuestions: clampNumber(
        cfg && cfg.electrical_story_history_question_limit_min,
        1,
        20,
        4
      ),
      exitIdleSeconds: clampNumber(
        cfg && cfg.electrical_story_exit_idle_seconds,
        5,
        300,
        24
      ),
      identityPrompt:
        coerceText(cfg && cfg.electrical_story_identity_prompt) ||
        "Before we go deeper into the electrical energy history, please share your name and company.",
      exitPrompt:
        coerceText(cfg && cfg.electrical_story_exit_prompt) ||
        "Thank you for your interest in the electrical energy story. I need to return to Unity-focused support now, but I can keep helping with Unity Energy questions.",
    };
  }

  function isElectricalStorySession(launchSession) {
    const payload =
      launchSession &&
      launchSession.contextPayload &&
      typeof launchSession.contextPayload === "object"
        ? launchSession.contextPayload
        : {};
    const candidates = [
      payload.source_page,
      payload.active_page_slug,
      payload.page_slug,
      launchSession && launchSession.contextSource,
      getCurrentPageSlug(),
    ];
    for (let i = 0; i < candidates.length; i += 1) {
      if (normalizePageSlugToken(candidates[i]) === "electrical-energy-story") {
        return true;
      }
    }
    return false;
  }

  function clearElectricalStoryExitTimer() {
    if (!electricalStoryExitTimer) return;
    window.clearTimeout(electricalStoryExitTimer);
    electricalStoryExitTimer = null;
  }

  function resetElectricalStoryGuardrailState() {
    clearElectricalStoryExitTimer();
    electricalStoryQuestionCount = 0;
    electricalStoryQuestionCap = 0;
    electricalStoryExitPromptActive = false;
    electricalStoryExitPromptSent = false;
  }

  function resolveElectricalStoryQuestionCap(settings) {
    const minQuestions = Math.max(
      1,
      Math.min(settings.minQuestions || settings.maxQuestions, settings.maxQuestions)
    );
    const maxQuestions = Math.max(minQuestions, settings.maxQuestions);
    if (minQuestions >= maxQuestions) return maxQuestions;
    return (
      minQuestions + Math.floor(Math.random() * (maxQuestions - minQuestions + 1))
    );
  }

  function getElectricalStoryMissingIdentityFields(settings) {
    if (!settings || !settings.requireNameCompany) return [];
    const state = ensureLeadCaptureState(currentVisitorName);
    const missing = [];
    if (!coerceText(state && state.name) && !coerceText(currentVisitorName)) {
      missing.push("name");
    }
    if (!coerceText(state && state.company)) {
      missing.push("company");
    }
    return missing;
  }

  function syncElectricalStoryGuardrailToSession(cfg, reason, shouldPostToRenderer) {
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return;
    if (
      !pendingLaunchSession.contextPayload ||
      typeof pendingLaunchSession.contextPayload !== "object"
    ) {
      pendingLaunchSession.contextPayload = {};
    }
    const settings = getElectricalStoryGuardrailSettings(cfg);
    const payload = pendingLaunchSession.contextPayload;
    const missingIdentityFields = getElectricalStoryMissingIdentityFields(settings);
    const enabledForSession =
      Boolean(settings.enabled) && isElectricalStorySession(pendingLaunchSession);
    Object.assign(payload, {
      electrical_story_guardrails_enabled: enabledForSession,
      electrical_story_require_name_company_before_history_answers:
        settings.requireNameCompany,
      electrical_story_history_question_count: electricalStoryQuestionCount,
      electrical_story_history_question_cap:
        electricalStoryQuestionCap || settings.maxQuestions,
      electrical_story_exit_prompt_active: electricalStoryExitPromptActive,
      electrical_story_exit_prompt_sent: electricalStoryExitPromptSent,
      electrical_story_identity_missing_fields: missingIdentityFields,
      electrical_story_identity_ready: missingIdentityFields.length === 0,
      electrical_story_identity_prompt: settings.identityPrompt,
      electrical_story_exit_prompt: settings.exitPrompt,
    });
    if (coerceText(reason)) {
      appendSessionDecision(pendingLaunchSession, reason, {
        enabled: enabledForSession,
        question_count: electricalStoryQuestionCount,
        question_cap: electricalStoryQuestionCap || settings.maxQuestions,
        exit_prompt_active: electricalStoryExitPromptActive,
        missing_identity_fields: missingIdentityFields,
      });
    }
    if (shouldPostToRenderer) {
      postToWidgetFrame({
        type: "maxwellian_session_launch",
        payload: pendingLaunchSession,
      });
    }
  }

  function initializeElectricalStoryGuardrailSession(cfg) {
    resetElectricalStoryGuardrailState();
    const settings = getElectricalStoryGuardrailSettings(cfg);
    if (!settings.enabled || !isElectricalStorySession(pendingLaunchSession)) {
      syncElectricalStoryGuardrailToSession(
        cfg,
        "electrical-story-guardrail-disabled",
        false
      );
      return;
    }
    electricalStoryQuestionCap = resolveElectricalStoryQuestionCap(settings);
    syncElectricalStoryGuardrailToSession(
      cfg,
      "electrical-story-guardrail-initialized",
      false
    );
  }

  function isElectricalStoryHistoryQuestion(text) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return false;
    const questionLike =
      sample.includes("?") ||
      /^(?:what|when|where|who|why|how|did|was|were|can|could|tell me)/.test(sample);
    if (!questionLike) return false;
    return /\b(westinghouse|tesla|edison|ferraris|volta|ampere|maxwell|history|historical|timeline|era|period|century|chicago world'?s fair|electric utility|ac|dc|war of currents|generator|alternating current|direct current)\b/.test(
      sample
    ) || /\b(?:18|19|20)\d{2}\b/.test(sample);
  }

  function isElectricalStoryDeclineIntent(text) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return false;
    return /\b(no|nope|not now|that'?s all|thats all|nothing else|i'?m done|im done|we'?re done|we are done|all set|goodbye)\b/.test(
      sample
    );
  }

  function isElectricalStoryUnityIntent(text) {
    const sample = coerceText(text).toLowerCase();
    if (!sample) return false;
    if (
      /\b(unity energy|unity|mpts|measure manage exchange|services|solutions|team|company|about unity)\b/.test(
        sample
      )
    ) {
      return true;
    }
    return /\b(yes|yeah|yep|sure|okay|ok|go ahead)\b/.test(sample);
  }

  function scheduleElectricalStoryExitTimer(cfg) {
    clearElectricalStoryExitTimer();
    if (!electricalStoryExitPromptActive) return;
    const settings = getElectricalStoryGuardrailSettings(cfg);
    const timeoutMs = Math.max(5000, settings.exitIdleSeconds * 1000);
    electricalStoryExitTimer = window.setTimeout(function () {
      const modal = document.getElementById("clerkVoiceModal");
      if (!modal || !modal.classList.contains("active")) return;
      if (!electricalStoryExitPromptActive) return;
      syncElectricalStoryGuardrailToSession(
        cfg,
        "electrical-story-exit-idle-timeout",
        true
      );
      closeElectricalStorySessionWithFade("electrical-story-idle-exit");
    }, timeoutMs);
  }

  function clearElectricalStoryExitPromptState(cfg, reason, shouldPostToRenderer) {
    electricalStoryExitPromptActive = false;
    electricalStoryExitPromptSent = false;
    clearElectricalStoryExitTimer();
    syncElectricalStoryGuardrailToSession(
      cfg,
      reason || "electrical-story-exit-prompt-cleared",
      shouldPostToRenderer
    );
  }

  function closeElectricalStorySessionWithFade(reason) {
    clearElectricalStoryExitTimer();
    const modal = document.getElementById("clerkVoiceModal");
    if (!modal || !modal.classList.contains("active")) return false;
    if (modal.dataset.storyClosing === "1") return true;
    modal.dataset.storyClosing = "1";
    modal.style.transition = "opacity 360ms ease";
    modal.style.opacity = "0";
    window.setTimeout(function () {
      modal.style.opacity = "";
      modal.style.transition = "";
      modal.dataset.storyClosing = "";
      closeClerkVoiceModal({ reason: reason || "electrical-story-exit" });
    }, 380);
    return true;
  }

  function handleElectricalStoryGuardrailTurn(transcriptText, cfg, questionLogged) {
    const settings = getElectricalStoryGuardrailSettings(cfg);
    if (!settings.enabled || !isElectricalStorySession(pendingLaunchSession)) return null;

    const historyQuestion = Boolean(questionLogged) && isElectricalStoryHistoryQuestion(transcriptText);
    const declineIntent = isElectricalStoryDeclineIntent(transcriptText);
    const unityIntent = isElectricalStoryUnityIntent(transcriptText);

    if (electricalStoryExitPromptActive) {
      clearElectricalStoryExitTimer();
      if (declineIntent) {
        syncElectricalStoryGuardrailToSession(
          cfg,
          "electrical-story-exit-declined",
          true
        );
        closeElectricalStorySessionWithFade("electrical-story-declined");
        return { closeTriggered: true };
      }
      if (unityIntent) {
        clearElectricalStoryExitPromptState(
          cfg,
          "electrical-story-exit-resumed-on-unity-intent",
          true
        );
        return {
          statusText: "Absolutely—what would you like to know about Unity Energy?",
          statusDurationMs: 2600,
        };
      }
      if (historyQuestion) {
        electricalStoryExitPromptSent = true;
        syncElectricalStoryGuardrailToSession(
          cfg,
          "electrical-story-exit-reminder",
          true
        );
        postToWidgetFrame({ type: "cancel" });
        scheduleElectricalStoryExitTimer(cfg);
        return {
          statusText: settings.exitPrompt,
          statusDurationMs: 3200,
        };
      }
      scheduleElectricalStoryExitTimer(cfg);
      return null;
    }

    if (!historyQuestion) return null;

    const missingIdentityFields = getElectricalStoryMissingIdentityFields(settings);
    if (missingIdentityFields.length > 0) {
      electricalStoryExitPromptActive = false;
      electricalStoryExitPromptSent = false;
      syncElectricalStoryGuardrailToSession(
        cfg,
        "electrical-story-identity-required",
        true
      );
      postToWidgetFrame({ type: "cancel" });
      return {
        statusText: settings.identityPrompt,
        statusDurationMs: 3200,
      };
    }

    if (!electricalStoryQuestionCap) {
      electricalStoryQuestionCap = resolveElectricalStoryQuestionCap(settings);
    }
    electricalStoryQuestionCount += 1;
    if (electricalStoryQuestionCount > electricalStoryQuestionCap) {
      electricalStoryExitPromptActive = true;
      electricalStoryExitPromptSent = true;
      syncElectricalStoryGuardrailToSession(
        cfg,
        "electrical-story-history-limit-reached",
        true
      );
      postToWidgetFrame({ type: "cancel" });
      scheduleElectricalStoryExitTimer(cfg);
      return {
        statusText: settings.exitPrompt,
        statusDurationMs: 3600,
      };
    }

    syncElectricalStoryGuardrailToSession(
      cfg,
      "electrical-story-history-question-counted",
      false
    );
    return null;
  }

  function extractTranscriptText(payload) {
    if (typeof payload === "string") return payload.trim();
    if (!payload || typeof payload !== "object") return "";
    const nestedMessage =
      payload.message && typeof payload.message === "object" ? payload.message : null;
    if (nestedMessage) {
      const nestedContent = coerceText(
        nestedMessage.content ||
        nestedMessage.text ||
        nestedMessage.message
      );
      if (nestedContent) return nestedContent;
    }
    const direct = coerceText(
      payload.text ||
        payload.message ||
        payload.content ||
        payload.utterance ||
        payload.transcript ||
        payload.partial
    );
    if (direct) return direct;
    if (payload.transcript && typeof payload.transcript === "object") {
      const nested = coerceText(
        payload.transcript.text || payload.transcript.message || payload.transcript.content
      );
      if (nested) return nested;
    }
    if (Array.isArray(payload.segments)) {
      const joined = payload.segments
        .map(function (segment) {
          if (typeof segment === "string") return segment;
          if (!segment || typeof segment !== "object") return "";
          return coerceText(segment.text || segment.message || segment.content);
        })
        .filter(Boolean)
        .join(" ");
      return coerceText(joined);
    }
    return "";
  }

  function extractTranscriptRole(payload) {
    if (!payload || typeof payload !== "object") return "";
    const nestedMessage =
      payload.message && typeof payload.message === "object" ? payload.message : null;
    const role = coerceText(
      payload.role || payload.speaker || payload.author || payload.source || payload.sender || payload.actor
    ).toLowerCase();
    if (role) return role;
    const nestedRole = coerceText(nestedMessage && nestedMessage.role).toLowerCase();
    if (nestedRole) return nestedRole;
    const payloadType = coerceText(payload.type).toLowerCase();
    if (payloadType === "assistant_message") return "assistant";
    if (payloadType === "user_message") return "user";
    return "";
  }

  function isLikelyAssistantRole(role) {
    return /(assistant|agent|model|ai|bot|clerk)/i.test(role || "");
  }

  function clearQuestionNotesStatusTimer() {
    if (!questionNotesStatusTimer) return;
    window.clearTimeout(questionNotesStatusTimer);
    questionNotesStatusTimer = null;
  }

  function getQuestionNotesThreshold(cfg) {
    if (founderModeActive) return 1;
    const raw = Number(cfg && cfg.question_notes_threshold);
    if (!Number.isFinite(raw)) return 2;
    return Math.max(1, Math.min(6, Math.floor(raw)));
  }

  function getQuestionNotesHoldLine(cfg) {
    if (founderModeActive) {
      const founderHoldLine = coerceText(cfg && cfg.founder_notes_hold_line);
      if (founderHoldLine) return founderHoldLine;
    }
    const configured = coerceText(cfg && cfg.question_notes_hold_line);
    return configured || "Please hold while I go back and get my notes.";
  }

  function buildQuestionFingerprint(text) {
    return coerceText(text).toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function isLikelyQuestionText(text) {
    const sample = coerceText(text);
    if (!sample || sample.length < 8) return false;
    if (sample.includes("?")) return true;
    return /^(what|how|why|when|where|who|can|could|would|should|do|does|did|is|are|may)\b/i.test(sample);
  }

  function registerVisitorQuestion(text) {
    const sample = coerceText(text);
    if (!isLikelyQuestionText(sample)) return false;
    const fingerprint = buildQuestionFingerprint(sample);
    if (!fingerprint) return false;
    if (
      lastVisitorQuestionFingerprint &&
      (fingerprint === lastVisitorQuestionFingerprint ||
        fingerprint.includes(lastVisitorQuestionFingerprint) ||
        lastVisitorQuestionFingerprint.includes(fingerprint))
    ) {
      return false;
    }
    lastVisitorQuestionFingerprint = fingerprint;
    visitorQuestionCount += 1;
    const compact = sample.length > 260 ? `${sample.slice(0, 260)}…` : sample;
    visitorQuestionLog.push(compact);
    if (visitorQuestionLog.length > 6) {
      visitorQuestionLog = visitorQuestionLog.slice(-6);
    }
    return true;
  }

  function normalizeQuestionNotesLibrary(cfg) {
    const source = Array.isArray(cfg && cfg.question_notes_library) ? cfg.question_notes_library : [];
    return source
      .map(function (entry, index) {
        if (!entry || typeof entry !== "object") return null;
        const id = coerceText(entry.id) || `note-${index + 1}`;
        const title = coerceText(entry.title) || id;
        const notes = coerceText(entry.notes || entry.note || entry.summary);
        if (!notes) return null;
        const keywords = Array.isArray(entry.keywords)
          ? entry.keywords.map(function (kw) { return coerceText(kw).toLowerCase(); }).filter(Boolean)
          : [];
        const sourceDocs = Array.isArray(entry.source_docs)
          ? entry.source_docs.map(function (doc) { return coerceText(doc); }).filter(Boolean)
          : [];
        return {
          id: id,
          title: title,
          notes: notes,
          keywords: keywords,
          source_docs: sourceDocs,
        };
      })
      .filter(Boolean);
  }

  function selectQuestionNotes(cfg, recentQuestions) {
    const library = normalizeQuestionNotesLibrary(cfg);
    if (library.length === 0) {
      return { notes: "", sourceDocs: [] };
    }
    const combined = coerceText((recentQuestions || []).join(" ").toLowerCase());
    const scored = library
      .map(function (entry) {
        let score = 0;
        entry.keywords.forEach(function (kw) {
          if (kw && combined.includes(kw)) score += 1;
        });
        return { entry: entry, score: score };
      })
      .sort(function (a, b) { return b.score - a.score; });
    const picked = scored.filter(function (row) { return row.score > 0; }).slice(0, 3);
    const fallback = picked.length > 0 ? picked : scored.slice(0, 2);
    const notes = fallback.map(function (row) { return `${row.entry.title}: ${row.entry.notes}`; }).join("\n\n");
    const sourceDocs = [];
    fallback.forEach(function (row) {
      row.entry.source_docs.forEach(function (doc) {
        if (doc && !sourceDocs.includes(doc)) sourceDocs.push(doc);
      });
    });
    return { notes: notes, sourceDocs: sourceDocs };
  }

  function buildQuestionNotesContext(cfg) {
    const selected = selectQuestionNotes(cfg, visitorQuestionLog);
    return normalizeVoltageSpeechValue({
      question_notes_active: true,
      question_notes_threshold: getQuestionNotesThreshold(cfg),
      question_notes_questions_seen: visitorQuestionCount,
      question_notes_hold_line: getQuestionNotesHoldLine(cfg),
      question_notes_recent_questions: visitorQuestionLog.slice(-4),
      question_notes_excerpt: selected.notes,
      question_notes_source_docs: selected.sourceDocs,
      question_notes_refreshed_at: new Date().toISOString(),
    }, 0);
  }

  function syncQuestionNotesToSession(cfg) {
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return;
    if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
      pendingLaunchSession.contextPayload = {};
    }
    Object.assign(pendingLaunchSession.contextPayload, buildQuestionNotesContext(cfg));
    pendingLaunchSession.contextPayload = normalizeVoltageSpeechValue(pendingLaunchSession.contextPayload, 0);
    appendSessionDecision(pendingLaunchSession, "question-notes-synced", {
      threshold: getQuestionNotesThreshold(cfg),
      questions_seen: visitorQuestionCount,
      source_docs: pendingLaunchSession.contextPayload.question_notes_source_docs || [],
    });
    postToWidgetFrame({ type: "maxwellian_session_launch", payload: pendingLaunchSession });
  }

  function normalizeContextPolicyRules(cfg) {
    const source = Array.isArray(cfg && cfg.context_policy_rules) ? cfg.context_policy_rules : [];
    return source
      .map(function (rule, index) {
        if (!rule || typeof rule !== "object") return null;
        const id = coerceText(rule.id) || `context-policy-${index + 1}`;
        const actionRaw = coerceText(rule.action || rule.decision).toLowerCase();
        const action = actionRaw === "deny" || actionRaw === "ask" || actionRaw === "allow" ? actionRaw : "allow";
        const contextSources = normalizeStringArrayLower(
          rule.context_sources !== undefined ? rule.context_sources : rule.contextSources,
          24
        );
        const modes = normalizeStringArrayLower(
          rule.modes !== undefined ? rule.modes : rule.conversation_modes,
          12
        );
        const uiModes = normalizeStringArrayLower(
          rule.ui_modes !== undefined ? rule.ui_modes : rule.uiModes,
          8
        );
        const requireFields = normalizeStringArray(
          rule.require_fields !== undefined ? rule.require_fields : rule.requireFields,
          12
        );
        const message = coerceText(rule.message || rule.status_message || rule.prompt);
        const rewriteContextSource = coerceText(rule.rewrite_context_source || rule.rewriteContextSource).toLowerCase();
        return {
          id: id,
          action: action,
          contextSources: contextSources,
          modes: modes,
          uiModes: uiModes,
          requireFields: requireFields,
          message: message,
          rewriteContextSource: rewriteContextSource,
        };
      })
      .filter(Boolean);
  }

  function getContextPolicyConfig(cfg) {
    const defaultActionRaw = coerceText(cfg && cfg.context_policy_default_action).toLowerCase();
    const defaultAction =
      defaultActionRaw === "allow" || defaultActionRaw === "deny" || defaultActionRaw === "ask"
        ? defaultActionRaw
        : "allow";
    const rules = normalizeContextPolicyRules(cfg);
    return {
      enabled: Boolean(cfg && cfg.context_policy_enabled) || rules.length > 0,
      defaultAction: defaultAction,
      fallbackContextSource: coerceText(cfg && cfg.context_policy_fallback_context_source) || "general",
      blockMessage:
        coerceText(cfg && cfg.context_policy_block_message) ||
        "This Clerk launch context is currently unavailable.",
      askMessage:
        coerceText(cfg && cfg.context_policy_ask_message) ||
        "Clerk is preparing contextual awareness for this view.",
      rules: rules,
    };
  }

  function evaluateLaunchContextPolicy(launchSession, cfg) {
    const policy = getContextPolicyConfig(cfg);
    if (!policy.enabled) return null;

    const payload = launchSession && typeof launchSession.contextPayload === "object" ? launchSession.contextPayload : {};
    const contextSources = collectLaunchContextSources(launchSession);
    if (contextSources.length === 0) {
      contextSources.push(coerceText(policy.fallbackContextSource).toLowerCase() || "general");
    }
    const modes = collectLaunchModes(launchSession);
    const uiMode = coerceText(launchSession && launchSession.uiMode).toLowerCase();

    let matchedRule = null;
    let missingFields = [];

    for (let i = 0; i < policy.rules.length; i += 1) {
      const rule = policy.rules[i];
      const sourceMatch =
        rule.contextSources.length === 0 ||
        contextSources.some(function (source) { return matchesAnyPattern(source, rule.contextSources); });
      if (!sourceMatch) continue;

      const modeMatch =
        rule.modes.length === 0 ||
        modes.some(function (mode) { return matchesAnyPattern(mode, rule.modes); });
      if (!modeMatch) continue;

      const uiModeMatch = rule.uiModes.length === 0 || matchesAnyPattern(uiMode, rule.uiModes);
      if (!uiModeMatch) continue;

      matchedRule = rule;
      missingFields = getMissingContextFields(payload, rule.requireFields);
      break;
    }

    let action = policy.defaultAction;
    let source = "default";
    let message = "";
    let rewriteContextSource = "";

    if (matchedRule) {
      action = matchedRule.action;
      source = "rule";
      message = matchedRule.message;
      rewriteContextSource = matchedRule.rewriteContextSource;
    }
    if (missingFields.length > 0 && action !== "deny") {
      action = "ask";
      source = "rule-missing-context";
      if (!message) {
        message = "Additional context is needed to run this Clerk mode cleanly.";
      }
    }
    if (!message) {
      if (action === "deny") message = policy.blockMessage;
      if (action === "ask") message = policy.askMessage;
    }

    return {
      enabled: true,
      action: action,
      source: source,
      ruleId: matchedRule ? matchedRule.id : "",
      message: message,
      rewriteContextSource: rewriteContextSource,
      contextSources: contextSources,
      modes: modes,
      missingFields: missingFields,
    };
  }

  function applyLaunchContextPolicy(launchSession, cfg) {
    const decision = evaluateLaunchContextPolicy(launchSession, cfg);
    if (!decision || !launchSession || typeof launchSession !== "object") return null;
    if (!launchSession.contextPayload || typeof launchSession.contextPayload !== "object") {
      launchSession.contextPayload = {};
    }
    launchSession.policyDecision = decision;
    launchSession.contextPayload.context_policy = {
      enabled: true,
      action: decision.action,
      source: decision.source,
      rule_id: decision.ruleId || "",
      context_sources: decision.contextSources.slice(0, 6),
      modes: decision.modes.slice(0, 6),
      missing_fields: decision.missingFields.slice(0, 8),
      evaluated_at: new Date().toISOString(),
    };
    launchSession.contextPayload.context_policy_action = decision.action;
    if (decision.message) {
      launchSession.contextPayload.context_policy_message = decision.message;
    }
    if (decision.action === "ask") {
      launchSession.contextPayload.context_policy_requires_confirmation = true;
    }
    if (decision.action === "deny") {
      launchSession.contextPayload.context_policy_blocked = true;
    }
    if (decision.rewriteContextSource && decision.action !== "deny") {
      launchSession.contextSource = decision.rewriteContextSource;
      launchSession.legacyContext = decision.rewriteContextSource;
      launchSession.contextPayload.context = decision.rewriteContextSource;
    }
    appendSessionDecision(launchSession, "context-policy-evaluated", {
      action: decision.action,
      source: decision.source,
      rule_id: decision.ruleId || "",
      missing_fields: decision.missingFields || [],
    });
    return decision;
  }

  function normalizeSkillPackLibrary(cfg) {
    const source = Array.isArray(cfg && cfg.skill_packs) ? cfg.skill_packs : [];
    return source
      .map(function (entry, index) {
        if (!entry || typeof entry !== "object") return null;
        const id = coerceText(entry.id || entry.key || entry.slug || `skill-pack-${index + 1}`).toLowerCase();
        if (!id) return null;
        const title = coerceText(entry.title || entry.name) || id;
        const summary = coerceText(entry.summary || entry.description);
        const content = coerceText(entry.content || entry.notes || summary);
        if (!content && !summary) return null;
        const keywords = normalizeStringArrayLower(entry.keywords, 28);
        const contextSources = normalizeStringArrayLower(
          entry.context_sources !== undefined ? entry.context_sources : entry.contextSources,
          16
        );
        const modes = normalizeStringArrayLower(
          entry.modes !== undefined ? entry.modes : entry.conversation_modes,
          10
        );
        const sourceDocs = normalizeStringArray(
          entry.source_docs !== undefined ? entry.source_docs : entry.sourceDocs,
          16
        );
        return {
          id: id,
          title: title,
          summary: summary || content,
          content: content || summary,
          keywords: keywords,
          contextSources: contextSources,
          modes: modes,
          sourceDocs: sourceDocs,
          priority: clampNumber(entry.priority, -10, 30, 0),
          alwaysInclude: Boolean(entry.always_include || entry.alwaysInclude),
        };
      })
      .filter(Boolean);
  }

  function normalizeSkillPackSelectionRules(cfg) {
    const source = Array.isArray(cfg && cfg.skill_pack_selection_rules) ? cfg.skill_pack_selection_rules : [];
    return source
      .map(function (rule, index) {
        if (!rule || typeof rule !== "object") return null;
        const id = coerceText(rule.id) || `skill-rule-${index + 1}`;
        const contextSources = normalizeStringArrayLower(
          rule.context_sources !== undefined ? rule.context_sources : rule.contextSources,
          16
        );
        const modes = normalizeStringArrayLower(
          rule.modes !== undefined ? rule.modes : rule.conversation_modes,
          10
        );
        const includeIds = normalizeStringArrayLower(
          rule.include_ids !== undefined ? rule.include_ids : rule.includeIds,
          16
        );
        const excludeIds = normalizeStringArrayLower(
          rule.exclude_ids !== undefined ? rule.exclude_ids : rule.excludeIds,
          16
        );
        return {
          id: id,
          contextSources: contextSources,
          modes: modes,
          includeIds: includeIds,
          excludeIds: excludeIds,
          maxPacks: clampNumber(rule.max_packs !== undefined ? rule.max_packs : rule.maxPacks, 1, 8, 3),
        };
      })
      .filter(Boolean);
  }

  function getRequestedSkillPackIds(payload) {
    if (!payload || typeof payload !== "object") return [];
    const ids = [];
    [
      payload.skill_pack_ids,
      payload.skill_packs,
      payload.requested_skill_pack_ids,
      payload.requested_skill_packs,
    ].forEach(function (value) {
      normalizeStringArray(value, 12).forEach(function (entry) {
        const normalized = entry.toLowerCase();
        if (!normalized || ids.includes(normalized)) return;
        ids.push(normalized);
      });
    });
    return ids;
  }

  function buildSkillPackSelectionText(launchSession) {
    const payload = launchSession && typeof launchSession.contextPayload === "object" ? launchSession.contextPayload : {};
    const fragments = [
      launchSession && launchSession.contextSource,
      launchSession && launchSession.legacyContext,
      payload.context,
      payload.mode,
      payload.conversation_mode,
      payload.customer,
      payload.customer_slug,
      payload.customer_name,
      payload.site,
      payload.board,
      payload.guide_mode,
      payload.transformer_focus,
      payload.session_context,
      payload.system_prompt_text,
      payload.likely_user_intent,
      payload.william_summary,
    ];
    if (Array.isArray(payload.anomalies) && payload.anomalies.length > 0) {
      fragments.push(payload.anomalies.join(" "));
    }
    return coerceText(fragments.join(" ").toLowerCase());
  }

  function countSkillPackKeywordHits(text, keywords) {
    if (!text || !Array.isArray(keywords) || keywords.length === 0) return 0;
    let hits = 0;
    keywords.forEach(function (keyword) {
      const normalized = coerceText(keyword).toLowerCase();
      if (!normalized) return;
      if (text.includes(normalized)) hits += 1;
    });
    return hits;
  }

  function selectSkillPacksForLaunch(cfg, launchSession) {
    const library = normalizeSkillPackLibrary(cfg);
    const payload = launchSession && typeof launchSession.contextPayload === "object" ? launchSession.contextPayload : {};
    if (library.length === 0) {
      return { selected: [], mode: "none", reasons: {} };
    }

    const maxSelectedRaw =
      payload.skill_packs_max_selected !== undefined
        ? payload.skill_packs_max_selected
        : cfg && cfg.skill_packs_max_selected;
    const maxSelected = clampNumber(maxSelectedRaw, 1, 8, 3);
    const selectionRules = normalizeSkillPackSelectionRules(cfg);
    const contextSources = collectLaunchContextSources(launchSession);
    const modes = collectLaunchModes(launchSession);
    const requestedIds = getRequestedSkillPackIds(payload);
    const fallbackIds = normalizeStringArrayLower(cfg && cfg.skill_packs_fallback_ids, 8);
    const selectionText = buildSkillPackSelectionText(launchSession);
    const includeByRule = [];
    const excludeByRule = [];
    let maxByRule = maxSelected;

    selectionRules.forEach(function (rule) {
      const sourceMatch =
        rule.contextSources.length === 0 ||
        contextSources.some(function (source) { return matchesAnyPattern(source, rule.contextSources); });
      if (!sourceMatch) return;
      const modeMatch =
        rule.modes.length === 0 ||
        modes.some(function (mode) { return matchesAnyPattern(mode, rule.modes); });
      if (!modeMatch) return;

      rule.includeIds.forEach(function (id) {
        if (!id || includeByRule.includes(id)) return;
        includeByRule.push(id);
      });
      rule.excludeIds.forEach(function (id) {
        if (!id || excludeByRule.includes(id)) return;
        excludeByRule.push(id);
      });
      maxByRule = Math.min(maxByRule, rule.maxPacks);
    });

    const candidates = library
      .filter(function (pack) { return !excludeByRule.includes(pack.id); })
      .map(function (pack) {
        let score = pack.priority;
        const reasons = [];
        if (requestedIds.includes(pack.id)) {
          score += 100;
          reasons.push("explicit-request");
        }
        if (pack.alwaysInclude) {
          score += 60;
          reasons.push("always-include");
        }
        if (
          pack.contextSources.length > 0 &&
          contextSources.some(function (source) { return matchesAnyPattern(source, pack.contextSources); })
        ) {
          score += 20;
          reasons.push("context-source-match");
        }
        if (
          pack.modes.length > 0 &&
          modes.some(function (mode) { return matchesAnyPattern(mode, pack.modes); })
        ) {
          score += 14;
          reasons.push("mode-match");
        }
        const keywordHits = countSkillPackKeywordHits(selectionText, pack.keywords);
        if (keywordHits > 0) {
          score += keywordHits * 3;
          reasons.push(`keyword-hit:${keywordHits}`);
        }
        if (includeByRule.includes(pack.id)) {
          score += 80;
          reasons.push("rule-include");
        }
        return { pack: pack, score: score, reasons: reasons };
      })
      .sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return a.pack.id.localeCompare(b.pack.id);
      });

    const selected = [];
    const reasonsById = {};
    const limit = Math.max(1, Math.min(maxByRule, maxSelected));
    const addPack = function (pack, reasons) {
      if (!pack || selected.length >= limit) return;
      if (selected.some(function (entry) { return entry.id === pack.id; })) return;
      selected.push(pack);
      reasonsById[pack.id] = Array.isArray(reasons) ? reasons.slice(0, 4) : [];
    };

    requestedIds.forEach(function (id) {
      const found = candidates.find(function (candidate) { return candidate.pack.id === id; });
      if (found) addPack(found.pack, found.reasons.concat(["requested"]));
    });
    includeByRule.forEach(function (id) {
      const found = candidates.find(function (candidate) { return candidate.pack.id === id; });
      if (found) addPack(found.pack, found.reasons.concat(["selection-rule"]));
    });
    candidates.forEach(function (candidate) {
      if (selected.length >= limit) return;
      if (candidate.score <= 0 && selected.length > 0) return;
      addPack(candidate.pack, candidate.reasons);
    });
    if (selected.length === 0) {
      fallbackIds.forEach(function (id) {
        const found = candidates.find(function (candidate) { return candidate.pack.id === id; });
        if (found) addPack(found.pack, found.reasons.concat(["fallback"]));
      });
    }

    return {
      selected: selected.slice(0, limit),
      mode:
        requestedIds.length > 0
          ? "explicit"
          : includeByRule.length > 0
            ? "rule"
            : selected.length > 0
              ? "scored"
              : "none",
      reasons: reasonsById,
      contextSources: contextSources,
      modes: modes,
    };
  }

  function buildSkillPackContext(cfg, launchSession) {
    const skillPacksEnabled = cfg && cfg.skill_packs_enabled !== false;
    const payload = launchSession && typeof launchSession.contextPayload === "object" ? launchSession.contextPayload : {};
    if (!skillPacksEnabled) {
      return { active: false, payload: {}, selection: { selected: [], mode: "disabled", reasons: {} } };
    }
    const selection = selectSkillPacksForLaunch(cfg, launchSession);
    if (!selection.selected || selection.selected.length === 0) {
      return { active: false, payload: {}, selection: selection };
    }

    const sourceDocs = [];
    const excerpts = [];
    selection.selected.forEach(function (pack) {
      const body = coerceText(pack.content || pack.summary);
      if (body) excerpts.push(`${pack.title}: ${body}`);
      pack.sourceDocs.forEach(function (doc) {
        if (!doc || sourceDocs.includes(doc)) return;
        sourceDocs.push(doc);
      });
    });
    const excerptLimitRaw =
      payload.skill_pack_excerpt_char_limit !== undefined
        ? payload.skill_pack_excerpt_char_limit
        : cfg && cfg.skill_pack_excerpt_char_limit;
    const excerptLimit = clampNumber(excerptLimitRaw, 600, 6000, 2400);
    let excerptText = excerpts.join("\n\n");
    if (excerptText.length > excerptLimit) {
      excerptText = `${excerptText.slice(0, excerptLimit)}…`;
    }

    return {
      active: true,
      selection: selection,
      payload: {
        skill_packs_active: true,
        skill_pack_count: selection.selected.length,
        skill_pack_ids: selection.selected.map(function (pack) { return pack.id; }),
        skill_pack_titles: selection.selected.map(function (pack) { return pack.title; }),
        skill_pack_excerpt: excerptText,
        skill_pack_source_docs: sourceDocs,
        skill_pack_selection_mode: selection.mode,
        skill_pack_reasons: selection.reasons,
        skill_pack_selected_at: new Date().toISOString(),
      },
    };
  }

  function applySkillPackContext(launchSession, cfg) {
    if (!launchSession || typeof launchSession !== "object") return null;
    if (!launchSession.contextPayload || typeof launchSession.contextPayload !== "object") {
      launchSession.contextPayload = {};
    }
    const built = buildSkillPackContext(cfg, launchSession);
    if (!built || !built.active) {
      appendSessionDecision(launchSession, "skill-packs-selected", {
        active: false,
        selection_mode: built && built.selection ? built.selection.mode : "none",
      });
      return built;
    }
    Object.entries(built.payload).forEach(function ([key, value]) {
      assignContextValueIfMissing(launchSession.contextPayload, key, value);
    });
    appendSessionDecision(launchSession, "skill-packs-selected", {
      active: true,
      selection_mode: built.selection.mode,
      skill_pack_ids: built.payload.skill_pack_ids || [],
    });
    return built;
  }

  function normalizeLaunchPayload(launchInput, cfg) {
    const base = {
      characterId: getDefaultCharacterId(cfg),
      contextSource: normalizeContextSource("", cfg),
      contextPayload: {},
      uiMode: normalizeUiMode("", cfg),
      legacyContext: "general",
      decisionLog: [],
    };

    if (typeof launchInput === "string") {
      const context = coerceText(launchInput) || "general";
      base.contextSource = context;
      base.contextPayload = { context: context };
      base.legacyContext = context;
    } else if (launchInput && typeof launchInput === "object") {
      const candidateCharacterId = coerceText(launchInput.characterId || launchInput.character_id);
      if (candidateCharacterId && !shouldLockCharacterSelection(cfg)) {
        base.characterId = candidateCharacterId;
      }

      const sourceCandidate = launchInput.contextSource || launchInput.context_source || launchInput.source;
      const payloadCandidate =
        launchInput.contextPayload !== undefined
          ? launchInput.contextPayload
          : launchInput.context_payload !== undefined
            ? launchInput.context_payload
            : launchInput.payload;
      const legacyContext = coerceText(launchInput.context || launchInput.launchContext);

      base.contextSource = normalizeContextSource(sourceCandidate || legacyContext, cfg);
      base.contextPayload = coerceLaunchContextPayload(
        payloadCandidate !== undefined ? payloadCandidate : legacyContext || sourceCandidate || ""
      );
      base.uiMode = normalizeUiMode(launchInput.uiMode || launchInput.ui_mode || launchInput.mode, cfg);
      base.legacyContext = resolveLegacyContext(base.contextSource, base.contextPayload);
    } else {
      base.contextPayload = { context: base.contextSource };
      base.legacyContext = resolveLegacyContext(base.contextSource, base.contextPayload);
    }

    base.characterId = resolveCharacterId(base.characterId, cfg);
    const guideScope = applyGuideContextToLaunchSession(base, cfg);
    if (guideScope && guideScope.guideMode === "customer") {
      const memoryExcerpt = buildCustomerMemoryExcerpt(guideScope, cfg);
      if (memoryExcerpt) {
        base.contextPayload.customer_memory_excerpt = memoryExcerpt;
        base.contextPayload.customer_memory_recap_available = true;
      } else {
        base.contextPayload.customer_memory_recap_available = false;
      }
    }
    applyLaunchContextPolicy(base, cfg);
    applyIntelligenceProfile(base, cfg);
    applySharedContextAwareness(base, cfg);
    const engagementProtocol = getTrimmedConfigText(cfg, "engagement_protocol");
    if (engagementProtocol) {
      base.contextPayload.engagement_protocol = engagementProtocol;
    }
    const maxwellianKnowledgeSeed = getTrimmedConfigText(cfg, "maxwellian_knowledge_seed");
    if (maxwellianKnowledgeSeed) {
      base.contextPayload.maxwellian_knowledge_seed = maxwellianKnowledgeSeed;
    }
    const responsePrecedenceGuidance = getTrimmedConfigText(cfg, "response_precedence_guidance");
    if (responsePrecedenceGuidance && !coerceText(base.contextPayload.response_precedence_guidance)) {
      base.contextPayload.response_precedence_guidance = responsePrecedenceGuidance;
    }
    const voltageUnitSpeechRule = getVoltageUnitSpeechRule(cfg);
    if (voltageUnitSpeechRule && !coerceText(base.contextPayload.voltage_unit_speech_rule)) {
      base.contextPayload.voltage_unit_speech_rule = voltageUnitSpeechRule;
    }
    const mptsSpeechRule = getMptsSpeechRule(cfg);
    if (mptsSpeechRule && !coerceText(base.contextPayload.mpts_speech_rule)) {
      base.contextPayload.mpts_speech_rule = mptsSpeechRule;
    }
    const mptsFailSafeRule = getMptsFailSafeRule(cfg);
    if (mptsFailSafeRule && !coerceText(base.contextPayload.mpts_fail_safe_rule)) {
      base.contextPayload.mpts_fail_safe_rule = mptsFailSafeRule;
    }
    if (!coerceText(base.contextPayload.mpts_canonical_acronym)) {
      base.contextPayload.mpts_canonical_acronym = "M P T S";
    }
    if (!coerceText(base.contextPayload.mpts_full_name)) {
      base.contextPayload.mpts_full_name = "Maximum Power Transfer Solution";
    }
    if (!coerceText(base.contextPayload.mpts_manage_layer_positioning)) {
      base.contextPayload.mpts_manage_layer_positioning =
        "M P T S lives in Unity's Manage layer inside Measure-Manage-Exchange.";
    }
    const knowledgeReferenceSpine = getTrimmedConfigText(cfg, "knowledge_reference_spine");
    if (knowledgeReferenceSpine && !coerceText(base.contextPayload.knowledge_reference_spine)) {
      base.contextPayload.knowledge_reference_spine = knowledgeReferenceSpine;
    }
    const leadCaptureWorkflow = getTrimmedConfigText(cfg, "lead_capture_workflow");
    if (leadCaptureWorkflow && !coerceText(base.contextPayload.lead_capture_workflow)) {
      base.contextPayload.lead_capture_workflow = leadCaptureWorkflow;
    }
    base.contextPayload.lead_capture_enabled = cfg.lead_capture_enabled !== false;
    base.contextPayload.lead_capture_collect_company = cfg.lead_capture_collect_company !== false;
    base.contextPayload.lead_capture_prompt_intent = cfg.lead_capture_prompt_intent !== false;
    base.contextPayload.lead_capture_require_confirmation_email_consent =
      cfg.lead_capture_require_confirmation_email_consent !== false;
    base.contextPayload.lead_capture_prompt_newsletter =
      cfg.lead_capture_prompt_newsletter !== false;
    base.contextPayload.lead_capture_prompt_text_notifications =
      cfg.lead_capture_prompt_text_notifications !== false;
    base.contextPayload.lead_capture_prompt_sales_outreach =
      cfg.lead_capture_prompt_sales_outreach !== false;
    const systemPromptText = getTrimmedConfigText(cfg, "system_prompt_text");
    if (systemPromptText && !coerceText(base.contextPayload.system_prompt_text)) {
      base.contextPayload.system_prompt_text = systemPromptText;
    }
    const sessionVariables = normalizeSessionVariables(cfg);
    if (sessionVariables) {
      [
        "opening_line",
        "name_request_line",
        "identity_line",
        "engagement_order",
        "mpts_core_definition",
        "character_name",
        "character_role",
        "character_style",
      ].forEach(function (key) {
        const value = coerceText(sessionVariables[key]);
        if (value && !base.contextPayload[key]) {
          base.contextPayload[key] = value;
        }
      });
    }
    base.contextPayload.question_notes_threshold = getQuestionNotesThreshold(cfg);
    base.contextPayload.question_notes_hold_line = getQuestionNotesHoldLine(cfg);
    if (currentVisitorName && !base.contextPayload.visitor_name) {
      base.contextPayload.visitor_name = currentVisitorName;
      base.contextPayload.visitor_name_known = true;
    }
    const leadState = ensureLeadCaptureState(currentVisitorName);
    if (coerceText(leadState.name) && !base.contextPayload.lead_capture_name) {
      base.contextPayload.lead_capture_name = leadState.name;
    }
    if (coerceText(leadState.company) && !base.contextPayload.lead_capture_company) {
      base.contextPayload.lead_capture_company = leadState.company;
      base.contextPayload.visitor_company = leadState.company;
      base.contextPayload.visitor_company_known = true;
    }
    if (coerceText(leadState.email) && !base.contextPayload.lead_capture_email) {
      base.contextPayload.lead_capture_email = leadState.email;
      base.contextPayload.visitor_email = leadState.email;
      base.contextPayload.visitor_email_known = true;
    }
    if (coerceText(leadState.visitorIntent) && !base.contextPayload.lead_capture_intent) {
      base.contextPayload.lead_capture_intent = leadState.visitorIntent;
      base.contextPayload.visitor_intent = leadState.visitorIntent;
      base.contextPayload.visitor_intent_known = true;
      if (!coerceText(base.contextPayload.likely_user_intent)) {
        base.contextPayload.likely_user_intent = leadState.visitorIntent;
      }
    }
    if (leadState.confirmationEmailConsent !== null) {
      base.contextPayload.lead_capture_confirmation_email_consent =
        leadState.confirmationEmailConsent;
    }
    if (leadState.newsletterOptIn !== null) {
      base.contextPayload.lead_capture_newsletter_opt_in = leadState.newsletterOptIn;
    }
    if (leadState.textNotificationsInterest !== null) {
      base.contextPayload.lead_capture_text_notifications_interest =
        leadState.textNotificationsInterest;
    }
    if (leadState.salesOutreachConsent !== null) {
      base.contextPayload.lead_capture_sales_outreach_consent =
        leadState.salesOutreachConsent;
      base.contextPayload.visitor_sales_outreach_consent =
        leadState.salesOutreachConsent;
    }
    base.contextPayload.lead_capture_confirmation_email_sent = Boolean(
      leadState.confirmationEmailSent
    );
    if (base.characterId && !base.contextPayload.character_id) {
      base.contextPayload.character_id = base.characterId;
    }
    if (!base.contextPayload.context) {
      base.contextPayload.context = base.legacyContext;
    }
    base.legacyContext = normalizeVoltageSpeechText(base.legacyContext);
    base.contextPayload = normalizeVoltageSpeechValue(base.contextPayload, 0);
    appendSessionDecision(base, "launch-normalized", {
      character_id: base.characterId,
      context_source: base.contextSource,
      ui_mode: base.uiMode,
      context_keys: Object.keys(base.contextPayload || {}).slice(0, 30),
    });
    applySkillPackContext(base, cfg);
    applySkillPackGroundingContext(base, cfg);
    applyContentFileScope(base, cfg);
    applyTourGuideLaunchContext(base, cfg);
    base.contextPayload = normalizeVoltageSpeechValue(base.contextPayload, 0);
    appendSessionDecision(base, "launch-ready", {
      policy_action:
        base.policyDecision && typeof base.policyDecision === "object" ? base.policyDecision.action : "none",
      skill_pack_count: Array.isArray(base.contextPayload && base.contextPayload.skill_pack_ids)
        ? base.contextPayload.skill_pack_ids.length
        : 0,
      content_scope_mode: coerceText(base.contextPayload && base.contextPayload.content_scope_mode),
      content_scope_lock_enabled: Boolean(base.contextPayload && base.contextPayload.content_scope_lock_enabled),
      allowed_source_file_count: Array.isArray(base.contextPayload && base.contextPayload.allowed_source_files)
        ? base.contextPayload.allowed_source_files.length
        : 0,
    });
    return base;
  }

  function parseLaunchInput(rawValue) {
    if (rawValue && typeof rawValue === "object") return rawValue;
    const raw = coerceText(rawValue);
    if (!raw) return "general";
    if (!(raw.startsWith("{") || raw.startsWith("["))) {
      return raw;
    }
    try {
      return JSON.parse(raw);
    } catch (_err) {
      return raw;
    }
  }

  function cleanReinterpretationText(value, maxLength) {
    const text = coerceText(value);
    if (!text) return "";
    const capped = Number.isFinite(maxLength) ? Math.max(120, Math.floor(maxLength)) : 1200;
    return text.length > capped ? `${text.slice(0, capped)}…` : text;
  }

  function buildReinterpretationContext(input) {
    const source = input && typeof input === "object" ? input : {};
    const context = {
      mode: "reinterpretation",
      transformer_id: cleanReinterpretationText(source.transformerId || source.transformer_id, 120),
      transformer_name: cleanReinterpretationText(source.transformerName || source.transformer_name, 180),
      study_id: cleanReinterpretationText(source.studyId || source.study_id, 140),
      ask: cleanReinterpretationText(source.ask || source.prompt || "Reinterpret this transformer in simple business terms.", 420),
      pattern_summary: cleanReinterpretationText(source.patternSummary || source.pattern_summary, 1600),
      pattern_part1: cleanReinterpretationText(source.patternPart1 || source.pattern_part1, 1400),
      pattern_part2: cleanReinterpretationText(source.patternPart2 || source.pattern_part2, 1400),
      pattern_part3: cleanReinterpretationText(source.patternPart3 || source.pattern_part3, 1400),
      baseline_snapshot: source.baselineSnapshot && typeof source.baselineSnapshot === "object" ? source.baselineSnapshot : null,
      requested_at: new Date().toISOString(),
    };
    Object.keys(context).forEach(function (key) {
      if (context[key] === null || context[key] === undefined || context[key] === "") {
        delete context[key];
      }
    });
    return normalizeVoltageSpeechValue(context, 0);
  }

  function buildReinterpretationLaunch(input) {
    const cfg = getVoiceConfig();
    const source = input && typeof input === "object" ? input : {};
    return {
      characterId: resolveCharacterId(source.characterId || source.character_id || "clerk-maxwell", cfg),
      contextSource: "reinterpretation",
      contextPayload: buildReinterpretationContext(source),
      uiMode: "modal",
    };
  }

  function buildClerkPageLaunchPayload(input) {
    const cfg = getVoiceConfig();
    const source = input && typeof input === "object" ? input : {};
    const sourcePage = (
      normalizePageSlugToken(source.sourcePage || source.source_page) ||
      normalizePageSlugToken(getCurrentPageSlug()) ||
      "index"
    );
    const contextSource = normalizeContextSource(
      source.contextSource || source.context_source || sourcePage,
      cfg
    );
    const contextValue =
      coerceText(source.context) ||
      coerceText(source.mode) ||
      coerceText(source.contextMode || source.context_mode) ||
      "technical-follow-up";
    const modeValue = coerceText(source.mode) || contextValue;
    const conversationMode =
      coerceText(source.conversationMode || source.conversation_mode) || "followup";
    const entryPoint =
      coerceText(source.entryPoint || source.entry_point) || `${sourcePage}-clerk-launch`;
    const payload = {
      context: contextValue,
      context_source: contextSource,
      mode: modeValue,
      conversation_mode: conversationMode,
      source_page: sourcePage,
      entry_point: entryPoint,
    };
    const pathContext = parseCustomerPathContext(getCurrentPagePathname());
    const sourceCustomer = extractCustomerFieldsFromPayload(source);
    const customerSlug =
      sourceCustomer.customerSlug ||
      (pathContext.isCustomerPath ? pathContext.customerSlug : "");
    const customerName =
      sourceCustomer.customerName ||
      (pathContext.isCustomerPath ? pathContext.customerName : "");
    const siteSlug =
      sourceCustomer.siteSlug ||
      (pathContext.isCustomerPath ? pathContext.siteSlug : "");
    const requestedGuideMode = coerceText(source.guideMode || source.guide_mode).toLowerCase();
    if ((requestedGuideMode === "customer" || customerSlug) && isCustomerGuideEnabled(cfg)) {
      payload.guide_mode = "customer";
      if (customerSlug) payload.customer_slug = customerSlug;
      if (customerName) payload.customer_name = customerName;
      if (siteSlug) payload.site_slug = siteSlug;
    }
    assignContextValueIfMissing(payload, "source_media", coerceText(source.sourceMedia || source.source_media));
    if (Number.isFinite(Number(source.sourceMediaSeconds || source.source_media_seconds))) {
      payload.source_media_seconds = Math.max(
        0,
        Math.floor(Number(source.sourceMediaSeconds || source.source_media_seconds))
      );
    }
    assignContextValueIfMissing(payload, "opening_line", coerceText(source.openingLine || source.opening_line));
    assignContextValueIfMissing(
      payload,
      "name_request_line",
      coerceText(source.nameRequestLine || source.name_request_line)
    );
    assignContextValueIfMissing(
      payload,
      "likely_user_intent",
      coerceText(source.likelyUserIntent || source.likely_user_intent)
    );
    assignContextValueIfMissing(
      payload,
      "response_style_hint",
      coerceText(source.responseStyleHint || source.response_style_hint)
    );
    assignContextValueIfMissing(
      payload,
      "speech_mode",
      coerceText(source.speechMode || source.speech_mode)
    );
    assignContextValueIfMissing(
      payload,
      "session_context",
      coerceText(source.sessionContext || source.session_context)
    );
    assignContextValueIfMissing(
      payload,
      "post_conversation_redirect_url",
      coerceText(source.postConversationRedirectUrl || source.post_conversation_redirect_url)
    );
    assignContextValueIfMissing(
      payload,
      "selected_story_type",
      coerceText(source.selectedStoryType || source.selected_story_type)
    );
    assignContextValueIfMissing(
      payload,
      "selected_story_title",
      coerceText(source.selectedStoryTitle || source.selected_story_title)
    );
    assignContextValueIfMissing(
      payload,
      "selected_story_id",
      coerceText(source.selectedStoryId || source.selected_story_id)
    );
    assignContextValueIfMissing(
      payload,
      "selected_story_summary",
      coerceText(source.selectedStorySummary || source.selected_story_summary)
    );
    assignContextValueIfMissing(
      payload,
      "selected_story_url",
      coerceText(source.selectedStoryUrl || source.selected_story_url)
    );

    const extraPayload = coerceLaunchContextPayload(
      source.extraPayload !== undefined
        ? source.extraPayload
        : source.extra_payload !== undefined
          ? source.extra_payload
          : source.contextPayload !== undefined
            ? source.contextPayload
            : source.context_payload
    );
    Object.entries(extraPayload).forEach(function ([key, value]) {
      if (!key) return;
      payload[key] = value;
    });

    const requestedSkillPackIds = normalizeStringArrayLower(
      source.requestedSkillPackIds !== undefined
        ? source.requestedSkillPackIds
        : source.requested_skill_pack_ids,
      12
    );
    if (requestedSkillPackIds.length > 0) {
      payload.requested_skill_pack_ids = requestedSkillPackIds;
    }

    return {
      contextSource: contextSource,
      contextPayload: payload,
      uiMode: normalizeUiMode(source.uiMode || source.ui_mode || "modal", cfg),
    };
  }

  function openClerkWithPageContext(input) {
    if (!isClerkVoiceFeatureEnabled()) return false;
    const cfg = getVoiceConfig();
    if (!isClerkVoiceAllowedOnCurrentPage(cfg)) return false;
    const source = input && typeof input === "object" ? input : {};
    const launchPayload = buildClerkPageLaunchPayload(source);
    try {
      if (source.closeExistingSession !== false && typeof closeClerkVoiceModal === "function") {
        closeClerkVoiceModal({
          preserveRoaming: true,
          preserveDailyMeter: true,
          reason: "relaunch",
        });
      }
      openClerkVoiceModal(launchPayload);
      const modal = document.getElementById("clerkVoiceModal");
      return Boolean(modal && modal.classList.contains("active"));
    } catch (_err) {
      return false;
    }
  }

  function openClerkReinterpretation(input) {
    openClerkVoiceModal(buildReinterpretationLaunch(input));
  }

  function buildSessionDiagnostics(session, cfg, url, phase) {
    if (!session || typeof session !== "object") return "";
    const contextPayload = session && typeof session.contextPayload === "object" ? session.contextPayload : {};
    const intelligenceProfileId = coerceText(contextPayload.intelligence_profile_id);
    const tokenBudgetProfile =
      contextPayload.token_budget_profile && typeof contextPayload.token_budget_profile === "object"
        ? contextPayload.token_budget_profile
        : {};
    const policyAction =
      session.policyDecision && typeof session.policyDecision === "object"
        ? session.policyDecision.action
        : coerceText(contextPayload.context_policy_action);
    const skillPackIds = Array.isArray(contextPayload.skill_pack_ids) ? contextPayload.skill_pack_ids.slice(0, 6) : [];
    const allowedSourceFiles = Array.isArray(contextPayload.allowed_source_files)
      ? contextPayload.allowed_source_files.slice(0, 8)
      : [];
    const diagnostics = {
      phase: phase || "launch",
      characterId: session.characterId || getDefaultCharacterId(cfg),
      uiMode: session.uiMode || normalizeUiMode("", cfg),
      contextSource: session.contextSource || normalizeContextSource("", cfg),
      contextKeys: Object.keys(contextPayload || {}),
      legacyContext: session.legacyContext || "general",
      intelligenceProfileId: intelligenceProfileId || "default",
      tokenBudgetProfile: hasMeaningfulValue(tokenBudgetProfile) ? tokenBudgetProfile : {},
      policyAction: policyAction || "none",
      skillPackIds: skillPackIds,
      contentScopeMode: coerceText(contextPayload.content_scope_mode),
      contentScopeLockEnabled: Boolean(contextPayload.content_scope_lock_enabled),
      activePageFile: coerceText(contextPayload.active_page_file),
      activePagePathname: coerceText(contextPayload.active_page_pathname),
      allowedSourceFileCount: allowedSourceFiles.length,
      allowedSourceFiles: allowedSourceFiles,
      decisionCount: Array.isArray(session.decisionLog) ? session.decisionLog.length : 0,
      embedOrigin: getEmbedOrigin(url || ""),
      timestamp: new Date().toISOString(),
    };
    return JSON.stringify(diagnostics, null, 2);
  }

  function shouldShowDiagnostics(cfg) {
    return Boolean(cfg && (cfg.show_session_diagnostics || cfg.debug));
  }

  function shouldEnableCharacterSwitcher(cfg) {
    return Boolean(cfg && cfg.enable_character_switcher);
  }
  function shouldLockCharacterSelection(cfg) {
    return !cfg || cfg.lock_character_to_default !== false;
  }
  function isAppleMobileWebKitBrowser() {
    const ua = typeof navigator !== "undefined" && typeof navigator.userAgent === "string" ? navigator.userAgent : "";
    const platform =
      typeof navigator !== "undefined" && typeof navigator.platform === "string" ? navigator.platform : "";
    const maxTouchPoints =
      typeof navigator !== "undefined" && Number.isFinite(navigator.maxTouchPoints)
        ? Number(navigator.maxTouchPoints)
        : 0;
    const isIOSDevice = /iPhone|iPad|iPod/i.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
    if (!isIOSDevice) return false;
    const isAppleWebKit = /AppleWebKit/i.test(ua);
    return isAppleWebKit;
  }

  function shouldUseUnityStartGate(cfg) {
    if (cfg && typeof cfg.force_unity_start_gate === "boolean") {
      return cfg.force_unity_start_gate;
    }
    if (cfg && typeof cfg.use_unity_start_gate === "boolean") {
      return cfg.use_unity_start_gate;
    }
    return isAppleMobileWebKitBrowser();
  }
  function shouldRunMicPreflight(cfg) {
    if (cfg && typeof cfg.preflight_microphone_on_launch === "boolean") {
      return cfg.preflight_microphone_on_launch;
    }
    return false;
  }
  function getUnityStartGateStallRetryLimit(cfg) {
    const configured = Number(cfg && cfg.unity_start_gate_max_stall_retries);
    if (Number.isFinite(configured)) {
      return Math.max(1, Math.min(8, Math.floor(configured)));
    }
    return isAppleMobileWebKitBrowser()
      ? UNITY_START_GATE_MOBILE_MAX_STALL_RETRIES
      : UNITY_START_GATE_MAX_STALL_RETRIES;
  }

  function getUnityStartGateStallTimeoutMs(cfg) {
    const configured = Number(cfg && cfg.unity_start_gate_stall_timeout_ms);
    if (Number.isFinite(configured)) {
      return Math.max(1800, Math.min(24000, Math.floor(configured)));
    }
    return isAppleMobileWebKitBrowser()
      ? UNITY_START_GATE_STALL_TIMEOUT_MOBILE_MS
      : UNITY_START_GATE_STALL_TIMEOUT_MS;
  }

  function getUnityStartGateProgressGraceMs(cfg) {
    const configured = Number(cfg && cfg.unity_start_gate_progress_grace_ms);
    if (Number.isFinite(configured)) {
      return Math.max(1000, Math.min(24000, Math.floor(configured)));
    }
    return isAppleMobileWebKitBrowser()
      ? UNITY_START_GATE_PROGRESS_GRACE_MOBILE_MS
      : UNITY_START_GATE_PROGRESS_GRACE_MS;
  }

  function getUnityStartGatePostReadyPromptDelayMs(cfg) {
    const configured = Number(cfg && cfg.unity_start_gate_post_ready_prompt_delay_ms);
    if (Number.isFinite(configured)) {
      return Math.max(1200, Math.min(16000, Math.floor(configured)));
    }
    return isAppleMobileWebKitBrowser()
      ? UNITY_START_GATE_POST_READY_PROMPT_DELAY_MOBILE_MS
      : UNITY_START_GATE_POST_READY_PROMPT_DELAY_MS;
  }

  function getUnityStartGateResendDelayMs(cfg) {
    const configured = Number(cfg && cfg.unity_start_gate_resend_delay_ms);
    if (Number.isFinite(configured)) {
      return Math.max(500, Math.min(10000, Math.floor(configured)));
    }
    return isAppleMobileWebKitBrowser()
      ? UNITY_START_GATE_RETRY_RESEND_DELAY_MOBILE_MS
      : UNITY_START_GATE_RETRY_RESEND_DELAY_MS;
  }

  function getUnityStartGateRetrySchedule(cfg, phase) {
    const isAppleMobile = shouldUseUnityStartGate(cfg) && isAppleMobileWebKitBrowser();
    if (phase === "ready") {
      return isAppleMobile ? { maxAttempts: 42, delayMs: 210 } : { maxAttempts: 28, delayMs: 170 };
    }
    if (phase === "tap") {
      return isAppleMobile ? { maxAttempts: 52, delayMs: 220 } : { maxAttempts: 34, delayMs: 170 };
    }
    if (phase === "resend") {
      return isAppleMobile ? { maxAttempts: 26, delayMs: 240 } : { maxAttempts: 14, delayMs: 190 };
    }
    return { maxAttempts: 24, delayMs: 180 };
  }

  function getExperimentTelemetryConfig(cfg) {
    const sourceCfg = cfg && typeof cfg === "object" ? cfg : getVoiceConfig();
    const rawCfg =
      sourceCfg && sourceCfg.experimental_telemetry && typeof sourceCfg.experimental_telemetry === "object"
        ? sourceCfg.experimental_telemetry
        : {};
    const sessionHistoryLimit = Number(rawCfg.session_history_limit);
    const eventLimit = Number(rawCfg.event_limit_per_session);
    return {
      enabled: rawCfg.enabled !== false,
      storageKey:
        coerceText(rawCfg.storage_key) || EXPERIMENT_TELEMETRY_DEFAULT_STORAGE_KEY,
      sessionHistoryLimit: Number.isFinite(sessionHistoryLimit)
        ? Math.max(3, Math.min(80, Math.floor(sessionHistoryLimit)))
        : EXPERIMENT_TELEMETRY_DEFAULT_HISTORY_LIMIT,
      eventLimitPerSession: Number.isFinite(eventLimit)
        ? Math.max(60, Math.min(3000, Math.floor(eventLimit)))
        : EXPERIMENT_TELEMETRY_DEFAULT_EVENT_LIMIT,
      persistOnEveryEvent: rawCfg.persist_on_every_event !== false,
      includeConsoleDiagnostics: rawCfg.include_console_diagnostics !== false,
    };
  }

  function isExperimentTelemetryEnabled(cfg) {
    const telemetryCfg = getExperimentTelemetryConfig(cfg);
    return telemetryCfg.enabled !== false;
  }

  function summarizeLaunchSessionForTelemetry(launchSession) {
    if (!launchSession || typeof launchSession !== "object") return {};
    const contextPayload =
      launchSession.contextPayload && typeof launchSession.contextPayload === "object"
        ? launchSession.contextPayload
        : {};
    const contextPayloadJson = JSON.stringify(contextPayload);
    return {
      context_source: coerceText(launchSession.contextSource),
      context_mode: coerceText(launchSession.mode),
      entry_point: coerceText(launchSession.entryPoint),
      source_page: coerceText(launchSession.sourcePage),
      source_media: coerceText(launchSession.sourceMedia),
      has_context_payload: Object.keys(contextPayload).length > 0,
      context_payload_keys: Object.keys(contextPayload).sort(),
      context_payload_chars: contextPayloadJson.length,
      launch_notes_count: Array.isArray(launchSession.launchNotes)
        ? launchSession.launchNotes.length
        : 0,
      session_decision_count: Array.isArray(launchSession.sessionDecisions)
        ? launchSession.sessionDecisions.length
        : 0,
    };
  }

  function buildBaselineConfigSnapshot(cfg, launchSession) {
    const sessionVars = cfg && cfg.session_variables && typeof cfg.session_variables === "object"
      ? cfg.session_variables
      : {};
    const turnDetection = cfg && cfg.openai_turn_detection && typeof cfg.openai_turn_detection === "object"
      ? cfg.openai_turn_detection
      : {};
    const characterRegistry = cfg && cfg.characters && typeof cfg.characters === "object" ? cfg.characters : {};
    return {
      captured_at: new Date().toISOString(),
      character_name: coerceText(cfg && cfg.character_name),
      character_id: coerceText(cfg && (cfg.default_character_id || cfg.character_id)),
      voice_engine: detectVoiceEngine(cfg),
      config_id: coerceText(cfg && cfg.config_id),
      config_version: Number.isFinite(Number(cfg && cfg.config_version))
        ? Number(cfg.config_version)
        : null,
      voice_id: coerceText(cfg && cfg.voice_id),
      embed_url: coerceText(cfg && cfg.embed_url),
      hume_runtime_auth_endpoint: coerceText(cfg && cfg.hume_runtime_auth_endpoint),
      allow_hume_authless_connect: Boolean(cfg && cfg.allow_hume_authless_connect),
      use_unity_start_gate: shouldUseUnityStartGate(cfg),
      preflight_microphone_on_launch: shouldRunMicPreflight(cfg),
      show_session_diagnostics: Boolean(cfg && cfg.show_session_diagnostics),
      system_prompt_chars: coerceText(cfg && cfg.system_prompt_text).length,
      session_context_chars: coerceText(cfg && cfg.session_context).length,
      response_precedence_guidance_chars: coerceText(cfg && cfg.response_precedence_guidance).length,
      engagement_protocol_chars: coerceText(cfg && cfg.engagement_protocol).length,
      session_variable_keys: Object.keys(sessionVars).sort(),
      session_variable_count: Object.keys(sessionVars).length,
      turn_detection: {
        type: coerceText(turnDetection.type),
        threshold: Number.isFinite(Number(turnDetection.threshold))
          ? Number(turnDetection.threshold)
          : null,
        prefix_padding_ms: Number.isFinite(Number(turnDetection.prefix_padding_ms))
          ? Number(turnDetection.prefix_padding_ms)
          : null,
        silence_duration_ms: Number.isFinite(Number(turnDetection.silence_duration_ms))
          ? Number(turnDetection.silence_duration_ms)
          : null,
        create_response: Boolean(turnDetection.create_response),
        interrupt_response: Boolean(turnDetection.interrupt_response),
      },
      guardrail_flags: {
        enabled: Boolean(cfg && cfg.guardrails_enabled),
        max_questions_per_session: Number.isFinite(Number(cfg && cfg.guardrails_max_questions_per_session))
          ? Number(cfg.guardrails_max_questions_per_session)
          : null,
        max_session_minutes: Number.isFinite(Number(cfg && cfg.guardrails_max_session_minutes))
          ? Number(cfg.guardrails_max_session_minutes)
          : null,
      },
      registered_characters: Object.keys(characterRegistry).sort(),
      launch_session: summarizeLaunchSessionForTelemetry(launchSession),
    };
  }

  function trimTelemetryValue(value, depth) {
    if (depth > 3) return "[truncated]";
    if (value == null) return value;
    if (typeof value === "string") {
      return value.length > 260 ? `${value.slice(0, 260)}…` : value;
    }
    if (typeof value === "number" || typeof value === "boolean") return value;
    if (Array.isArray(value)) {
      return value.slice(0, 20).map(function (item) {
        return trimTelemetryValue(item, depth + 1);
      });
    }
    if (typeof value === "object") {
      const next = {};
      Object.keys(value)
        .slice(0, 30)
        .forEach(function (key) {
          next[key] = trimTelemetryValue(value[key], depth + 1);
        });
      return next;
    }
    return coerceText(value);
  }

  function readStoredExperimentSessions(storageKey) {
    if (typeof window === "undefined" || !window.localStorage) return [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      return [];
    }
  }

  function persistExperimentTelemetry(opts) {
    if (!experimentTelemetrySession) return;
    const options = opts && typeof opts === "object" ? opts : {};
    const telemetryCfg = getExperimentTelemetryConfig(options.cfg);
    const now = Date.now();
    experimentTelemetrySession.updated_at = new Date(now).toISOString();
    experimentTelemetrySession.ended_at = options.finalize
      ? experimentTelemetrySession.updated_at
      : "";
    experimentTelemetrySession.status = options.finalize
      ? coerceText(options.status || "closed") || "closed"
      : "active";
    experimentTelemetrySession.event_count = experimentTelemetryEvents.length;
    experimentTelemetrySession.timeline = experimentTelemetryEvents.slice();
    if (typeof window !== "undefined") {
      try {
        window.dispatchEvent(
          new CustomEvent(EXPERIMENT_TELEMETRY_DISPATCH_EVENT, {
            detail: {
              session: experimentTelemetrySession,
              eventCount: experimentTelemetryEvents.length,
              latestEvent:
                experimentTelemetryEvents.length > 0
                  ? experimentTelemetryEvents[experimentTelemetryEvents.length - 1]
                  : null,
            },
          })
        );
      } catch (_err) {}
    }
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      const sessions = readStoredExperimentSessions(telemetryCfg.storageKey).filter(function (entry) {
        return entry && typeof entry === "object" && entry.session_id !== experimentTelemetrySession.session_id;
      });
      sessions.unshift(experimentTelemetrySession);
      if (sessions.length > telemetryCfg.sessionHistoryLimit) {
        sessions.length = telemetryCfg.sessionHistoryLimit;
      }
      window.localStorage.setItem(telemetryCfg.storageKey, JSON.stringify(sessions));
    } catch (_err) {}
  }

  function startExperimentTelemetrySession(reason, cfg, launchSession) {
    if (!isExperimentTelemetryEnabled(cfg)) {
      experimentTelemetrySession = null;
      experimentTelemetryEvents = [];
      return;
    }
    const now = Date.now();
    experimentTelemetrySessionCounter += 1;
    experimentTelemetryEvents = [];
    experimentTelemetrySession = {
      schema_version: "clerk-rev2-baseline-v1",
      session_id: `clerk-rev2-${now}-${experimentTelemetrySessionCounter}`,
      started_at: new Date(now).toISOString(),
      updated_at: new Date(now).toISOString(),
      ended_at: "",
      status: "active",
      reason: coerceText(reason) || "manual",
      baseline_snapshot: buildBaselineConfigSnapshot(cfg, launchSession),
      event_count: 0,
      timeline: [],
    };
    persistExperimentTelemetry({ cfg: cfg });
  }

  function trackExperimentTelemetryEvent(type, detail, opts) {
    if (!experimentTelemetrySession) return;
    if (!isExperimentTelemetryEnabled(opts && opts.cfg ? opts.cfg : null)) return;
    const telemetryCfg = getExperimentTelemetryConfig(opts && opts.cfg ? opts.cfg : null);
    const now = Date.now();
    const startedAtMs = Date.parse(experimentTelemetrySession.started_at);
    const elapsedMs = Number.isFinite(startedAtMs) ? Math.max(0, now - startedAtMs) : 0;
    experimentTelemetryEvents.push({
      event: coerceText(type).toLowerCase(),
      at: new Date(now).toISOString(),
      elapsed_ms: elapsedMs,
      detail: trimTelemetryValue(detail, 0),
    });
    if (experimentTelemetryEvents.length > telemetryCfg.eventLimitPerSession) {
      experimentTelemetryEvents.shift();
    }
    if (telemetryCfg.persistOnEveryEvent) {
      persistExperimentTelemetry({ cfg: opts && opts.cfg ? opts.cfg : null });
    }
  }

  function closeExperimentTelemetrySession(reason, cfg) {
    if (!experimentTelemetrySession) return;
    trackExperimentTelemetryEvent("session-close", { reason: coerceText(reason) || "closed" }, { cfg: cfg });
    persistExperimentTelemetry({
      cfg: cfg,
      finalize: true,
      status: coerceText(reason) || "closed",
    });
    experimentTelemetrySession = null;
    experimentTelemetryEvents = [];
  }

  function noteUnityStartGateProgress(eventType) {
    unityStartGateLastProgressAt = Date.now();
    const normalizedType = coerceText(eventType).toLowerCase();
    if (!normalizedType) return;
    if (
      unityStartGateRecentProgressEvents.length > 0 &&
      unityStartGateRecentProgressEvents[unityStartGateRecentProgressEvents.length - 1] === normalizedType
    ) {
      return;
    }
    unityStartGateRecentProgressEvents.push(normalizedType);
    if (unityStartGateRecentProgressEvents.length > 6) {
      unityStartGateRecentProgressEvents.shift();
    }
    trackExperimentTelemetryEvent("start-gate-progress", { event: normalizedType });
  }

  function resetUnityStartGateProgressLog() {
    unityStartGateLastProgressAt = 0;
    unityStartGateRecentProgressEvents = [];
  }

  function getUnityStartGateProgressSummary() {
    if (!Array.isArray(unityStartGateRecentProgressEvents) || unityStartGateRecentProgressEvents.length === 0) {
      return "";
    }
    return unityStartGateRecentProgressEvents.slice(-3).join(", ");
  }

  function shouldTrackUnityStartGateProgressEvent(eventType) {
    const normalized = coerceText(eventType).toLowerCase();
    if (!normalized) return false;
    if (
      normalized === "resize_frame" ||
      normalized === "collapse_widget" ||
      normalized === "minimize_widget" ||
      normalized === "mic_error" ||
      normalized === "socket_error" ||
      normalized === "audio_error" ||
      normalized === "error"
    ) {
      return false;
    }
    return true;
  }

  function isLikelyUnityConversationStartedEventType(eventType) {
    const normalized = coerceText(eventType).toLowerCase();
    if (!normalized) return false;
    if (
      normalized === "widget_iframe_is_ready" ||
      normalized === "widget_iframe_ready" ||
      normalized === "widget_ready" ||
      normalized === "iframe_ready" ||
      normalized === "resize_frame" ||
      normalized === "expand_widget" ||
      normalized === "collapse_widget" ||
      normalized === "minimize_widget" ||
      normalized === "mic_error" ||
      normalized === "socket_error" ||
      normalized === "audio_error" ||
      normalized === "transcript_message" ||
      normalized === "audio_output" ||
      normalized === "error"
    ) {
      return false;
    }
    if (/(conversation|session|voice|call)[_-]?(started|start|ready|active|open|connected)/.test(normalized)) {
      return true;
    }
    return /(assistant_ready|connection_open|socket_open|joined_room|joined_call|agent_connected)/.test(
      normalized
    );
  }

  function isClerkVoiceFeatureEnabled() {
    const flags = window.UNITY_PUBLIC_RELEASE_FLAGS;
    if (!flags || typeof flags !== "object") return true;
    const features = flags.features && typeof flags.features === "object" ? flags.features : {};
    if (typeof features.clerk_voice === "boolean") {
      return features.clerk_voice;
    }
    if (typeof window.isUnityFeatureEnabled === "function") {
      try {
        return Boolean(window.isUnityFeatureEnabled("clerk_voice"));
      } catch (_err) {
        return true;
      }
    }
    return true;
  }

  function cloneAuth(auth) {
    if (!auth || typeof auth !== "object") return { type: "", value: "" };
    return {
      type: typeof auth.type === "string" ? auth.type : "",
      value: typeof auth.value === "string" ? auth.value : "",
    };
  }

  function cloneSessionVariables(vars) {
    if (!vars || typeof vars !== "object") return {};
    return Object.assign({}, vars);
  }

  function getCharacterRegistry(cfg) {
    const registry = {};
    const source = cfg && cfg.characters && typeof cfg.characters === "object" ? cfg.characters : {};

    Object.entries(source).forEach(function ([id, value]) {
      const normalizedId = coerceText(id);
      if (!normalizedId || !value || typeof value !== "object") return;
      registry[normalizedId] = value;
    });

    const defaultId = coerceText((cfg && cfg.default_character_id) || (cfg && cfg.character_id) || "clerk-maxwell");
    if (!registry[defaultId]) {
      registry[defaultId] = {
        character_name: cfg && cfg.character_name ? cfg.character_name : "Clerk Maxwell",
        character_avatar_url: cfg && cfg.character_avatar_url ? cfg.character_avatar_url : "",
        character_background_url: cfg && cfg.character_background_url ? cfg.character_background_url : "",
        embed_url: cfg && cfg.embed_url ? cfg.embed_url : "",
        config_id: cfg && cfg.config_id ? cfg.config_id : "",
        voice_id: cfg && cfg.voice_id ? cfg.voice_id : "",
      };
    }
    return registry;
  }

  function resolveCharacterId(characterId, cfg) {
    const registry = getCharacterRegistry(cfg);
    if (shouldLockCharacterSelection(cfg)) {
      const lockedId = coerceText((cfg && cfg.default_character_id) || (cfg && cfg.character_id) || "clerk-maxwell");
      if (lockedId && registry[lockedId]) return lockedId;
    }
    const candidate = coerceText(characterId);
    if (candidate && registry[candidate]) return candidate;
    const fallback = coerceText((cfg && cfg.default_character_id) || (cfg && cfg.character_id) || "clerk-maxwell");
    if (fallback && registry[fallback]) return fallback;
    const keys = Object.keys(registry);
    return keys.length > 0 ? keys[0] : "clerk-maxwell";
  }

  function resolveActiveCharacterConfig(cfg, launchSession) {
    const registry = getCharacterRegistry(cfg);
    const resolvedCharacterId = resolveCharacterId(launchSession && launchSession.characterId, cfg);
    const characterConfig =
      registry && typeof registry === "object" && registry[resolvedCharacterId] && typeof registry[resolvedCharacterId] === "object"
        ? registry[resolvedCharacterId]
        : {};
    const merged = Object.assign({}, cfg, characterConfig);
    merged.character_id = resolvedCharacterId;
    merged.character_name = coerceText(merged.character_name) || resolvedCharacterId;
    merged.auth = cloneAuth(characterConfig.auth || cfg.auth);
    merged.session_variables = Object.assign(
      {},
      cloneSessionVariables(cfg.session_variables),
      cloneSessionVariables(characterConfig.session_variables)
    );
    const intelligenceProfile =
      launchSession && launchSession.intelligenceProfile && typeof launchSession.intelligenceProfile === "object"
        ? launchSession.intelligenceProfile
        : null;
    if (intelligenceProfile) {
      const profileConfigId = coerceText(intelligenceProfile.configId);
      const profileVoiceId = coerceText(intelligenceProfile.voiceId);
      if (profileConfigId) merged.config_id = profileConfigId;
      if (profileVoiceId) {
        merged.voice_id = profileVoiceId;
        merged.openai_voice = profileVoiceId;
      }
      const profileId = coerceText(intelligenceProfile.id);
      const profileLabel = coerceText(intelligenceProfile.label);
      const responseStyle = coerceText(intelligenceProfile.responseStyle);
      if (profileId && !coerceText(merged.session_variables.intelligence_profile_id)) {
        merged.session_variables.intelligence_profile_id = profileId;
      }
      if (profileLabel && !coerceText(merged.session_variables.intelligence_profile_label)) {
        merged.session_variables.intelligence_profile_label = profileLabel;
      }
      if (responseStyle && !coerceText(merged.session_variables.response_style_hint)) {
        merged.session_variables.response_style_hint = responseStyle;
      }
      if (
        intelligenceProfile.tokenBudget &&
        typeof intelligenceProfile.tokenBudget === "object" &&
        !coerceText(merged.session_variables.token_budget_profile)
      ) {
        try {
          merged.session_variables.token_budget_profile = JSON.stringify(intelligenceProfile.tokenBudget);
        } catch (_err) {}
      }
    }
    if (!coerceText(merged.embed_url)) merged.embed_url = coerceText(cfg.embed_url);
    if (!coerceText(merged.config_id)) merged.config_id = coerceText(cfg.config_id);
    if (!coerceText(merged.voice_id)) merged.voice_id = coerceText(cfg.voice_id);
    if (!coerceText(merged.openai_voice)) {
      merged.openai_voice = coerceText(cfg.openai_voice) || coerceText(merged.voice_id);
    }
    if (!coerceText(merged.openai_realtime_model)) {
      merged.openai_realtime_model = coerceText(cfg.openai_realtime_model);
    }
    if (!coerceText(merged.openai_session_endpoint)) {
      merged.openai_session_endpoint = coerceText(cfg.openai_session_endpoint);
    }
    const launchEnginePreference = coerceText(
      launchSession &&
        launchSession.contextPayload &&
        (launchSession.contextPayload.voice_engine_preference ||
          launchSession.contextPayload.voiceEnginePreference ||
          launchSession.contextPayload.engine_preference ||
          launchSession.contextPayload.enginePreference)
    ).toLowerCase();
    if (launchEnginePreference === "openai") {
      const forcedOpenAiFallback = buildOpenAiFallbackConfig(merged);
      if (forcedOpenAiFallback) {
        Object.assign(merged, forcedOpenAiFallback);
      }
    }
    if (!coerceText(merged.session_context)) merged.session_context = coerceText(cfg.session_context);
    return merged;
  }

  function getRuntimeVoiceConfig() {
    return resolveActiveCharacterConfig(getVoiceConfig(), pendingLaunchSession);
  }
  function getUnityFooterMessage(cfg) {
    const configured = coerceText(cfg && cfg.unity_footer_message);
    if (configured) return configured;
    return "Ask Clerk how Unity makes the invisible field visible.";
  }

  function getUnityLaunchTitle(cfg) {
    const characterName = coerceText(cfg && cfg.character_name) || "Clerk";
    return `Meet with ${characterName}`;
  }

  function getUnityLaunchRingCandidates(cfg) {
    const configured = coerceText(cfg && cfg.unity_launch_ring_image_url);
    const options = [
      configured,
      coerceText(cfg && cfg.openai_center_visual_url),
      coerceText(cfg && cfg.character_avatar_url),
      "/UnityEnergy/assets/images/ClerkMaxwell_60423t.png",
      "assets/images/ClerkMaxwell_60423t.png",
      "assets/images/unity-icon-ring-white-2048.png",
      "unity-icon-ring-white-2048.png",
      "assets/images/unity-icon-ring-white-512.png",
      "unity-icon-ring-white-512.png",
      "assets/images/unity-icon-ring-white-192.png",
      "unity-icon-ring-white-192.png",
    ].filter(Boolean);
    const candidates = [];
    options.forEach(function (option) {
      buildFloatingLauncherAssetCandidateVariants(option).forEach(function (variant) {
        if (!variant || candidates.includes(variant)) return;
        candidates.push(variant);
      });
    });
    return candidates;
  }

  function syncUnityLaunchEmblem(cfg) {
    const title = document.getElementById("clerkVoiceLaunchTitle");
    const ring = document.getElementById("clerkVoiceLaunchRing");
    if (title) {
      title.textContent = getUnityLaunchTitle(cfg);
    }
    if (!ring) return;
    const candidates = getUnityLaunchRingCandidates(cfg);
    if (candidates.length === 0) {
      ring.removeAttribute("src");
      ring.hidden = true;
      return;
    }
    ring.hidden = false;
    ring.dataset.fallbackIndex = "0";
    ring.onerror = function () {
      const currentIndex = Number(ring.dataset.fallbackIndex || "0");
      const nextIndex = currentIndex + 1;
      if (nextIndex >= candidates.length) {
        ring.onerror = null;
        return;
      }
      ring.dataset.fallbackIndex = String(nextIndex);
      ring.src = candidates[nextIndex];
    };
    ring.src = candidates[0];
  }
  function getUnityFooterQuestions(cfg) {
    const questions = Array.isArray(cfg && cfg.unity_footer_questions)
      ? cfg.unity_footer_questions
          .map(function (value) {
            return coerceText(value);
          })
          .filter(Boolean)
      : [];
    if (questions.length > 0) return questions.slice(0, 12);
    return [getUnityFooterMessage(cfg)];
  }

  function getUnityFooterRotateSeconds(cfg) {
    const raw = Number(cfg && cfg.unity_footer_rotate_seconds);
    if (!Number.isFinite(raw)) return 15;
    return Math.max(6, Math.min(60, Math.floor(raw)));
  }

  function formatUnityFooterQuestion(question) {
    const text = coerceText(question);
    if (!text) return "Ask Clerk this: How does Unity reduce hidden electrical waste?";
    if (/^ask\s+clerk/i.test(text)) return text;
    return `Ask Clerk this: ${text}`;
  }

  function getFooterQuestionSignature(questions, rotateSeconds) {
    return `${rotateSeconds}|${questions.join("|")}`;
  }

  function stopUnityFooterRotation() {
    if (!footerQuestionTimer) return;
    window.clearInterval(footerQuestionTimer);
    footerQuestionTimer = null;
  }

  function setUnityBottomMaskVisible(visible) {
    const mask = document.getElementById("clerkVoiceBottomMask");
    if (!mask) return;
    mask.hidden = !visible;
  }

  function setUnityOverlayVisible(visible) {
    const overlay = document.getElementById("clerkVoiceUnityOverlay");
    if (!overlay) return;
    overlay.hidden = !visible;
  }

  function setLaunchEmblemVisible(visible) {
    try {
      if (document.body && document.body.classList.contains("page6-kuranda-voice-page")) {
        visible = false;
      }
    } catch (_e) {}

    const emblem = document.getElementById("clerkVoiceLaunchEmblem");
    if (!emblem) return;
    emblem.hidden = true;
    if (visible && !hasConversationStarted) {
      startSignalFormationSequence(getRuntimeVoiceConfig());
    }
  }

  function setUnityOverlayMessage(message) {
    const label = document.getElementById("clerkVoiceUnityMessage");
    if (!label) return;
    label.textContent = message;
  }

  function clearSignalSpeakingDecayTimer() {
    if (!signalSpeakingDecayTimer) return;
    window.clearTimeout(signalSpeakingDecayTimer);
    signalSpeakingDecayTimer = null;
  }

  function clearSignalFormationTimer() {
    if (!signalFormationTimer) return;
    window.clearTimeout(signalFormationTimer);
    signalFormationTimer = null;
  }

  function setSignalStageVisible(visible) {
    try {
      if (document.body && document.body.classList.contains("page6-kuranda-voice-page")) {
        visible = false;
      }
    } catch (_e) {}

    const stage = document.getElementById("clerkVoiceSignalStage");
    if (!stage) return;
    stage.hidden = !visible;
    if (visible) {
      syncSignalPortraitContrastMode();
    }
  }

  function getSignalPortraitCandidates(cfg) {
    const seeds = [
      coerceText(cfg && cfg.signal_portrait_url),
      coerceText(cfg && cfg.character_avatar_url),
    ].filter(Boolean);
    const candidates = [];
    seeds.forEach(function (seed) {
      buildFloatingLauncherAssetCandidateVariants(seed).forEach(function (variant) {
        if (!variant || candidates.includes(variant)) return;
        candidates.push(variant);
      });
    });
    return candidates;
  }

  function parseRgbaChannels(colorText) {
    const sample = coerceText(colorText).toLowerCase();
    if (!sample || sample === "transparent") return null;
    const channelMatches = sample.match(/[\d.]+%?/g);
    if (!channelMatches || channelMatches.length < 3) return null;
    const parseChannel = function (value) {
      const normalized = coerceText(value);
      if (!normalized) return null;
      if (normalized.endsWith("%")) {
        const percent = Number(normalized.slice(0, -1));
        if (!Number.isFinite(percent)) return null;
        return Math.max(0, Math.min(255, Math.round((percent / 100) * 255)));
      }
      const numeric = Number(normalized);
      if (!Number.isFinite(numeric)) return null;
      return Math.max(0, Math.min(255, Math.round(numeric)));
    };
    const red = parseChannel(channelMatches[0]);
    const green = parseChannel(channelMatches[1]);
    const blue = parseChannel(channelMatches[2]);
    if (red === null || green === null || blue === null) return null;
    let alpha = 1;
    if (channelMatches.length >= 4) {
      const alphaRaw = coerceText(channelMatches[3]);
      if (alphaRaw.endsWith("%")) {
        const alphaPercent = Number(alphaRaw.slice(0, -1));
        if (Number.isFinite(alphaPercent)) {
          alpha = Math.max(0, Math.min(1, alphaPercent / 100));
        }
      } else {
        const alphaNumeric = Number(alphaRaw);
        if (Number.isFinite(alphaNumeric)) {
          alpha = Math.max(0, Math.min(1, alphaNumeric));
        }
      }
    }
    return { r: red, g: green, b: blue, a: alpha };
  }

  function calculateRelativeLuminance(colorChannels) {
    if (!colorChannels || colorChannels.a <= 0.04) return null;
    const toLinear = function (channel) {
      const normalized = channel / 255;
      if (normalized <= 0.03928) return normalized / 12.92;
      return Math.pow((normalized + 0.055) / 1.055, 2.4);
    };
    const red = toLinear(colorChannels.r);
    const green = toLinear(colorChannels.g);
    const blue = toLinear(colorChannels.b);
    return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue);
  }

  function resolveElementBackgroundLuminance(startNode) {
    let node = startNode;
    while (node && node.nodeType === 1) {
      const styles = window.getComputedStyle(node);
      const backgroundLuminance = calculateRelativeLuminance(
        parseRgbaChannels(styles && styles.backgroundColor)
      );
      if (backgroundLuminance !== null) return backgroundLuminance;
      const backgroundImage = coerceText(styles && styles.backgroundImage).toLowerCase();
      const textLuminance = calculateRelativeLuminance(
        parseRgbaChannels(styles && styles.color)
      );
      if (backgroundImage && backgroundImage !== "none" && textLuminance !== null) {
        if (textLuminance >= 0.58) return 0.24;
        if (textLuminance <= 0.42) return 0.78;
      }
      node = node.parentElement;
    }
    if (document && document.body) {
      const bodyLuminance = calculateRelativeLuminance(
        parseRgbaChannels(window.getComputedStyle(document.body).backgroundColor)
      );
      if (bodyLuminance !== null) return bodyLuminance;
    }
    return null;
  }

  function syncSignalPortraitContrastMode() {
    const stage = document.getElementById("clerkVoiceSignalStage");
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 1;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const sampleX = Math.max(0, Math.min(viewportWidth - 1, Math.round(rect.left + (rect.width / 2))));
    const sampleY = Math.max(0, Math.min(viewportHeight - 1, Math.round(rect.top + (rect.height * 0.42))));
    let sampleNode = document.elementFromPoint(sampleX, sampleY);
    if (sampleNode && stage.contains(sampleNode)) {
      sampleNode = stage.parentElement || document.body;
    }
    if (!sampleNode) sampleNode = stage.parentElement || document.body;
    const luminance = resolveElementBackgroundLuminance(sampleNode);
    const prefersDark =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDarkBackgroundMode = luminance !== null ? luminance < 0.52 : prefersDark;
    stage.classList.toggle("contrast-dark-bg", useDarkBackgroundMode);
    stage.classList.toggle("contrast-light-bg", !useDarkBackgroundMode);
  }

  function setSignalPortraitSource(cfg) {
    const portrait = document.getElementById("clerkVoiceSignalPortrait");
    if (!portrait) return;
    const candidates = getSignalPortraitCandidates(cfg);
    if (!Array.isArray(candidates) || candidates.length === 0) {
      portrait.removeAttribute("src");
      portrait.hidden = true;
      return;
    }
    portrait.hidden = false;
    portrait.dataset.fallbackIndex = "0";
    portrait.onload = syncSignalPortraitContrastMode;
    portrait.onerror = function () {
      const currentIndex = Number(portrait.dataset.fallbackIndex || "0");
      const nextIndex = currentIndex + 1;
      if (nextIndex >= candidates.length) {
        portrait.onerror = null;
        portrait.hidden = true;
        return;
      }
      portrait.dataset.fallbackIndex = String(nextIndex);
      portrait.src = candidates[nextIndex];
    };
    portrait.src = candidates[0];
    portrait.hidden = false;
    syncSignalPortraitContrastMode();
  }

  function resolveSignalWaveTuning(cfg) {
    const barCount = clampNumber(
      cfg && (cfg.signal_wave_bar_count !== undefined ? cfg.signal_wave_bar_count : cfg.voice_signal_bar_count),
      6,
      40,
      30
    );
    const minWidth = clampNumber(
      cfg && (cfg.signal_wave_bar_min_width !== undefined ? cfg.signal_wave_bar_min_width : cfg.voice_signal_bar_min_width),
      2,
      16,
      3
    );
    const maxWidth = clampNumber(
      cfg && (cfg.signal_wave_bar_max_width !== undefined ? cfg.signal_wave_bar_max_width : cfg.voice_signal_bar_max_width),
      minWidth,
      24,
      6
    );
    const gap = clampNumber(
      cfg && (cfg.signal_wave_bar_gap !== undefined ? cfg.signal_wave_bar_gap : cfg.voice_signal_bar_gap),
      1,
      14,
      2
    );
    const waveMaxWidth = clampNumber(
      cfg && (cfg.signal_wave_max_width !== undefined ? cfg.signal_wave_max_width : cfg.voice_signal_wave_max_width),
      140,
      420,
      188
    );
    const minHeight = clampNumber(
      cfg && (cfg.signal_wave_min_height !== undefined ? cfg.signal_wave_min_height : cfg.voice_signal_wave_min_height),
      6,
      30,
      12
    );
    const idleHeight = clampNumber(
      cfg && (cfg.signal_wave_idle_height !== undefined ? cfg.signal_wave_idle_height : cfg.voice_signal_wave_idle_height),
      minHeight,
      60,
      16
    );
    return {
      barCount: barCount,
      minWidth: minWidth,
      maxWidth: maxWidth,
      gap: gap,
      waveMaxWidth: waveMaxWidth,
      minHeight: minHeight,
      idleHeight: idleHeight,
    };
  }

  function syncSignalWaveBars(cfgInput) {
    const wave = document.querySelector("#clerkVoiceSignalStage .clerk-voice-signal-wave");
    if (!wave) return;
    const cfg = cfgInput && typeof cfgInput === "object" ? cfgInput : getRuntimeVoiceConfig();
    const tuning = resolveSignalWaveTuning(cfg);
    wave.style.setProperty("--clerk-signal-wave-max-width", `${tuning.waveMaxWidth}px`);
    wave.style.setProperty("--clerk-signal-gap", `${tuning.gap}px`);
    wave.style.setProperty("--clerk-signal-bar-min-height", `${tuning.minHeight}px`);
    wave.style.setProperty("--clerk-signal-bar-idle-height", `${tuning.idleHeight}px`);
    const fragment = document.createDocumentFragment();
    const centerIndex = (tuning.barCount - 1) / 2;
    const widthRange = Math.max(0, tuning.maxWidth - tuning.minWidth);
    for (let i = 0; i < tuning.barCount; i += 1) {
      const bar = document.createElement("span");
      bar.className = "clerk-voice-signal-bar";
      const normalizedDistance =
        centerIndex > 0 ? Math.abs(i - centerIndex) / centerIndex : 0;
      const centerBias = Math.pow(Math.max(0, 1 - normalizedDistance), 0.72);
      const width = Math.round(tuning.minWidth + (widthRange * centerBias));
      const delaySeconds = ((i % 8) * 0.075).toFixed(3);
      bar.style.setProperty("--signal-bar-width", `${width}px`);
      bar.style.setProperty("--signal-delay", `${delaySeconds}s`);
      fragment.appendChild(bar);
    }
    wave.replaceChildren(fragment);
  }

  function resolveSignalDisplayName(cfg) {
    const configuredName = coerceText(cfg && cfg.character_name);
    if (!configuredName || /^clerk\s+maxwell$/i.test(configuredName)) {
      return "J. Clerk Maxwell";
    }
    return configuredName;
  }
  function resolveSignalDisplayTitle(cfg) {
    const configuredName = coerceText(cfg && cfg.character_name);
    if (!configuredName || /^clerk\s+maxwell$/i.test(configuredName)) {
      return "Unity Chief Scientist";
    }
    return "";
  }

  function syncSignalDisplayName(cfg) {
    const nameplate = document.getElementById("clerkVoiceSignalName");
    const titleBadge = document.getElementById("clerkVoiceSignalTitle");
    const runtimeCfg = cfg && typeof cfg === "object" ? cfg : getRuntimeVoiceConfig();
    if (nameplate) {
      nameplate.textContent = resolveSignalDisplayName(runtimeCfg);
    }
    if (titleBadge) {
      const resolvedTitle = resolveSignalDisplayTitle(runtimeCfg);
      titleBadge.textContent = resolvedTitle;
      titleBadge.hidden = !resolvedTitle;
    }
  }

  function setSignalNameVisible(visible) {
    const stage = document.getElementById("clerkVoiceSignalStage");
    const nameplate = document.getElementById("clerkVoiceSignalNameplate");
    const shouldShow = Boolean(visible);
    if (stage) {
      stage.classList.toggle("show-clerk-name", shouldShow);
    }
    if (nameplate) {
      nameplate.hidden = !shouldShow;
    }
  }

  function setSignalMode(mode) {
    const stage = document.getElementById("clerkVoiceSignalStage");
    const label = document.getElementById("clerkVoiceSignalLabel");
    const normalizedMode =
      mode === SIGNAL_MODE_SPEAKING
        ? SIGNAL_MODE_SPEAKING
        : mode === SIGNAL_MODE_LISTENING
          ? SIGNAL_MODE_LISTENING
          : SIGNAL_MODE_IDLE;
    voiceSignalMode = normalizedMode;
    if (!stage) return;
    stage.dataset.mode = normalizedMode;
    stage.classList.toggle("is-idle", normalizedMode === SIGNAL_MODE_IDLE);
    stage.classList.toggle("is-listening", normalizedMode === SIGNAL_MODE_LISTENING);
    stage.classList.toggle("is-speaking", normalizedMode === SIGNAL_MODE_SPEAKING);
    if (label) {
      if (!hasConversationStarted && preConversationSignalVisible) {
        label.textContent = stage.classList.contains("is-forming")
          ? "Clerk is forming…"
          : "Clerk is ready.";
        return;
      }
      if (normalizedMode === SIGNAL_MODE_SPEAKING) {
        label.textContent = "Clerk is speaking…";
      } else if (normalizedMode === SIGNAL_MODE_LISTENING) {
        label.textContent = "Clerk is listening…";
      } else {
        label.textContent = "Clerk is ready.";
      }
    }
  }

  function startSignalFormationSequence(cfgInput) {
    const stage = document.getElementById("clerkVoiceSignalStage");
    if (!stage) return;
    if (
      preConversationSignalVisible &&
      !hasConversationStarted &&
      (stage.classList.contains("is-forming") || stage.classList.contains("is-formed"))
    ) {
      setSignalStageVisible(true);
      setSignalMode(SIGNAL_MODE_IDLE);
      return;
    }
    const cfg = cfgInput && typeof cfgInput === "object" ? cfgInput : getRuntimeVoiceConfig();
    clearSignalFormationTimer();
    preConversationSignalVisible = true;
    setSignalPortraitSource(cfg);
    setSignalStageVisible(true);
    stage.classList.remove("is-formed");
    stage.classList.add("is-forming");
    setSignalMode(SIGNAL_MODE_IDLE);
    signalFormationTimer = window.setTimeout(function () {
      signalFormationTimer = null;
      if (hasConversationStarted) return;
      stage.classList.remove("is-forming");
      stage.classList.add("is-formed");
      setSignalMode(SIGNAL_MODE_IDLE);
      syncSignalPortraitContrastMode();
    }, SIGNAL_FORMATION_DURATION_MS);
  }

  function syncSignalStageForConversation() {
    const stage = document.getElementById("clerkVoiceSignalStage");
    if (!hasConversationStarted) {
      if (preConversationSignalVisible) {
        if (stage) {
          if (!stage.classList.contains("is-forming")) {
            stage.classList.add("is-formed");
          }
        }
        setSignalMode(SIGNAL_MODE_IDLE);
        setSignalStageVisible(true);
        return;
      }
      setSignalMode(SIGNAL_MODE_IDLE);
      setSignalStageVisible(false);
      return;
    }
    preConversationSignalVisible = false;
    clearSignalFormationTimer();
    if (stage) {
      stage.classList.remove("is-forming");
      stage.classList.add("is-formed");
    }
    const cfg = getRuntimeVoiceConfig();
    setSignalPortraitSource(cfg);
    setSignalStageVisible(true);
    if (voiceSignalMode === SIGNAL_MODE_IDLE) {
      setSignalMode(SIGNAL_MODE_LISTENING);
      return;
    }
    setSignalMode(voiceSignalMode);
    syncSignalPortraitContrastMode();
  }

  function markSignalListening() {
    if (!hasConversationStarted) return;
    clearSignalSpeakingDecayTimer();
    syncSignalStageForConversation();
    setSignalMode(SIGNAL_MODE_LISTENING);
  }

  function pulseSignalSpeaking() {
    if (!hasConversationStarted) return;
    clearSignalSpeakingDecayTimer();
    syncSignalStageForConversation();
    setSignalNameVisible(true);
    setSignalMode(SIGNAL_MODE_SPEAKING);
    signalSpeakingDecayTimer = window.setTimeout(function () {
      signalSpeakingDecayTimer = null;
      if (!hasConversationStarted) return;
      setSignalMode(SIGNAL_MODE_LISTENING);
    }, SIGNAL_SPEAKING_DECAY_MS);
  }

  function resetSignalStage() {
    clearSignalSpeakingDecayTimer();
    clearSignalFormationTimer();
    preConversationSignalVisible = false;
    const stage = document.getElementById("clerkVoiceSignalStage");
    if (stage) {
      stage.classList.remove("is-forming");
      stage.classList.remove("is-formed");
    }
    setSignalNameVisible(false);
    setSignalMode(SIGNAL_MODE_IDLE);
    setSignalStageVisible(false);
  }
  function syncUnityFooterQuestion(questions) {
    if (!Array.isArray(questions) || questions.length === 0) return;
    const normalizedIndex = footerQuestionIndex % questions.length;
    setUnityOverlayMessage(formatUnityFooterQuestion(questions[normalizedIndex]));
  }


  function syncUnityOverlayState() {
    stopUnityFooterRotation();
    setUnityBottomMaskVisible(false);
    setUnityOverlayVisible(false);
  }


  function buildWidgetConnectConfig(cfg, launchSession) {
    if (!cfg || typeof cfg !== "object") return null;
    if (detectVoiceEngine(cfg) === "hume") {
      return buildHumeConnectConfig(cfg, launchSession);
    }
    const sessionEndpoint =
      coerceText(cfg.openai_session_endpoint || cfg.openai_session_url || cfg.session_endpoint) ||
      "/api/openai/realtime/session";
    const model =
      coerceText(cfg.openai_realtime_model || cfg.openai_model || cfg.model) ||
      "gpt-4o-realtime-preview";
    const voice =
      coerceText(cfg.openai_voice || cfg.voice_id || cfg.voice) ||
      "ash";
    if (!sessionEndpoint || !model) return null;
    const connectConfig = {
      sessionEndpoint: sessionEndpoint,
      openai_session_endpoint: sessionEndpoint,
      model: model,
      openai_realtime_model: model,
      voice: voice,
      openai_voice: voice,
      openai_voice_instruction_set: coerceText(cfg.openai_voice_instruction_set),
      openai_voice_style_hint: coerceText(cfg.openai_voice_style_hint || cfg.voice_style_hint),
      openai_center_visual_url: coerceText(cfg.openai_center_visual_url || cfg.character_avatar_url),
      contact_page_auto_greeting_text: coerceText(cfg.contact_page_auto_greeting_text),
      openai_auto_greeting_enabled: cfg.openai_auto_greeting_enabled !== false,
      openai_auto_greeting_text: coerceText(cfg.openai_auto_greeting_text),
      openai_delayed_followup_enabled: cfg.openai_delayed_followup_enabled !== false,
      openai_delayed_followup_seconds: Number.isFinite(Number(cfg.openai_delayed_followup_seconds))
        ? Math.max(4, Math.min(30, Math.floor(Number(cfg.openai_delayed_followup_seconds))))
        : 10,
      openai_delayed_followup_text: coerceText(cfg.openai_delayed_followup_text),
      openai_decline_followup_text: coerceText(cfg.openai_decline_followup_text),
      turnDetection:
        cfg.openai_turn_detection && typeof cfg.openai_turn_detection === "object"
          ? Object.assign({}, cfg.openai_turn_detection)
          : {},
      system_prompt_text: coerceText(cfg.system_prompt_text),
      session_context: coerceText(cfg.session_context),
    };
    const auth = normalizeAuthConfig(cfg);
    if (auth) connectConfig.auth = auth;
    const temperature = Number(cfg.temperature);
    if (Number.isFinite(temperature)) {
      connectConfig.temperature = Math.max(0, Math.min(2, temperature));
    }
    const debug = Boolean(cfg.debug);
    if (debug) connectConfig.debug = true;
    return connectConfig;
  }

  function getViewportDimensions() {
    const width = (window.screen && window.screen.availWidth) || window.innerWidth || 1200;
    const height = (window.screen && window.screen.availHeight) || window.innerHeight || 800;
    return { width: width, height: height };
  }

  function postToWidgetFrame(action) {
    const frame = document.getElementById("clerkVoiceFrame");
    if (!frame || !frame.contentWindow || !activeFrameOrigin) return false;
    frame.contentWindow.postMessage(action, activeFrameOrigin);
    trackExperimentTelemetryEvent("widget-postmessage-outbound", {
      message_type: coerceText(action && action.type).toLowerCase(),
      has_payload: Boolean(action && Object.prototype.hasOwnProperty.call(action, "payload")),
    });
    return true;
  }

  function sendWidgetConfig(cfg, launchSession) {
    const payload = buildWidgetConnectConfig(cfg, launchSession);
    if (!payload) return false;

    const dims = getViewportDimensions();
    if (launchSession && typeof launchSession === "object") {
      postToWidgetFrame({ type: "maxwellian_session_launch", payload: launchSession });
    }
    postToWidgetFrame({ type: "update_config", payload: payload });
    postToWidgetFrame({ type: "send_window_size", payload: dims });
    postToWidgetFrame({ type: "expand_widget_from_client", payload: dims });
    if (!hasConversationStarted) {
      noteUnityStartGateProgress("config-dispatched");
    }
    return true;
  }
  function clickIframeStartConversationButton() {
    const frame = document.getElementById("clerkVoiceFrame");
    if (!frame) return false;
    try {
      const doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
      if (!doc) return false;
      const interactiveElements = Array.from(
        doc.querySelectorAll("button, [role=\"button\"], input[type=\"button\"], input[type=\"submit\"]")
      );
      const candidates = interactiveElements
        .filter(function (element) {
          return (
            isStartGateInteractiveElementVisible(element) &&
            !isStartGateInteractiveElementDisabled(element)
          );
        })
        .map(function (element) {
          const signature = buildStartConversationCandidateSignature(element);
          return {
            element: element,
            signature: signature,
            score: scoreStartConversationCandidate(signature),
          };
        })
        .sort(function (a, b) {
          return b.score - a.score;
        });
      const startCandidate =
        candidates.find(function (candidate) {
          return /start conversation/.test(candidate.signature);
        }) ||
        candidates.find(function (candidate) {
          return candidate.score >= 56;
        }) ||
        (candidates.length === 1 && candidates[0].score >= 24 ? candidates[0] : null);
      if (!startCandidate || !startCandidate.element) return false;
      try {
        if (typeof startCandidate.element.focus === "function") {
          startCandidate.element.focus({ preventScroll: true });
        }
      } catch (_focusErr) {}
      startCandidate.element.click();
      noteUnityStartGateProgress("start-button-clicked");
      return true;
    } catch (_err) {
      return false;
    }
  }

  function scheduleIframeStartConversationRetry(maxAttempts, delayMs) {
    const attemptLimit = Number.isFinite(Number(maxAttempts)) ? Math.max(1, Math.floor(Number(maxAttempts))) : 24;
    const retryDelay = Number.isFinite(Number(delayMs)) ? Math.max(90, Math.floor(Number(delayMs))) : 180;
    let attempts = 0;
    const runAttempt = function () {
      const modalEl = document.getElementById("clerkVoiceModal");
      if (!modalEl || !modalEl.classList.contains("active")) return;
      if (hasConversationStarted) return;
      const clicked = clickIframeStartConversationButton();
      attempts += 1;
      if (hasConversationStarted) return;
      if (attempts >= attemptLimit) return;
      window.setTimeout(runAttempt, clicked ? Math.max(240, retryDelay) : retryDelay);
    };
    window.setTimeout(runAttempt, 60);
  }

  function syncVisitorIdentityToSession(visitorName) {
    if (!visitorName) return;
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return;
    if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
      pendingLaunchSession.contextPayload = {};
    }
    pendingLaunchSession.contextPayload.visitor_name = visitorName;
    pendingLaunchSession.contextPayload.visitor_name_known = true;
    const leadState = ensureLeadCaptureState(visitorName);
    if (leadState && leadState.name !== visitorName) {
      leadState.name = visitorName;
      leadState.updatedAt = new Date().toISOString();
    }
    appendSessionDecision(pendingLaunchSession, "visitor-identity-captured", {
      visitor_name: visitorName,
    });
    postToWidgetFrame({ type: "maxwellian_session_launch", payload: pendingLaunchSession });
  }

  function syncFounderModeToSession(cfg, triggerText) {
    if (!pendingLaunchSession || typeof pendingLaunchSession !== "object") return;
    if (!pendingLaunchSession.contextPayload || typeof pendingLaunchSession.contextPayload !== "object") {
      pendingLaunchSession.contextPayload = {};
    }
    const founderName = founderModeIdentity || coerceText(cfg && cfg.founder_identity_name) || "Founder";
    const founderGuidance =
      coerceText(cfg && cfg.founder_mode_guidance) ||
      "Founder identified. Prioritize attentive listening, concise note capture, and adapt response dialect to founder tone while preserving technical precision.";
    Object.assign(pendingLaunchSession.contextPayload, {
      founder_mode_active: true,
      conversation_mode: "founder",
      founder_identity_name: founderName,
      founder_role: "Founder",
      founder_note_capture: true,
      founder_dialect_tuning: true,
      founder_mode_guidance: founderGuidance,
      founder_trigger_utterance: cleanReinterpretationText(triggerText, 360),
      question_notes_active: true,
      question_notes_threshold: 1,
      question_notes_hold_line: getQuestionNotesHoldLine(cfg),
    });
    if (founderName && founderName !== "Founder") {
      pendingLaunchSession.contextPayload.visitor_name = founderName;
      pendingLaunchSession.contextPayload.visitor_name_known = true;
    }
    pendingLaunchSession.contextPayload = normalizeVoltageSpeechValue(pendingLaunchSession.contextPayload, 0);
    appendSessionDecision(pendingLaunchSession, "founder-mode-activated", {
      founder_identity_name: founderName,
      trigger: cleanReinterpretationText(triggerText, 200),
    });
    postToWidgetFrame({ type: "maxwellian_session_launch", payload: pendingLaunchSession });
  }

  function expandWidgetFromClient() {
    const dims = getViewportDimensions();
    postToWidgetFrame({ type: "send_window_size", payload: dims });
    postToWidgetFrame({ type: "expand_widget_from_client", payload: dims });
  }

  async function requestTopLevelMicAccess() {
    if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
      throw new Error("Microphone API not available in this browser.");
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach(function (track) {
      try {
        track.stop();
      } catch (_err) {}
    });
  }
  function getMicrophoneErrorSignature(payloadOrMessage) {
    if (!payloadOrMessage) return "";
    if (typeof payloadOrMessage === "string") {
      return payloadOrMessage.toLowerCase();
    }
    if (typeof payloadOrMessage !== "object") return "";
    return [
      payloadOrMessage.type,
      payloadOrMessage.error_type,
      payloadOrMessage.errorType,
      payloadOrMessage.code,
      payloadOrMessage.name,
      payloadOrMessage.message,
      payloadOrMessage.detail,
      payloadOrMessage.reason,
    ]
      .map(function (value) {
        return coerceText(value).toLowerCase();
      })
      .filter(Boolean)
      .join(" ");
  }
  function isLikelyMicrophoneError(payloadOrMessage) {
    const signature = getMicrophoneErrorSignature(payloadOrMessage);
    if (!signature) return false;
    return /(mic|microphone|audio input|audio source|getusermedia|media devices|notallowederror|notfounderror|notreadableerror|securityerror|permission denied|denied permission|user denied|permission blocked|permission policy|not allowed by (the )?(user agent|platform|browser)|unable to connect)/.test(
      signature
    );
  }
  function isLikelyMicrophonePermissionError(payloadOrMessage) {
    const signature = getMicrophoneErrorSignature(payloadOrMessage);
    if (!signature) return false;
    return /(notallowederror|securityerror|permission denied|denied permission|user denied|permission blocked|not allowed by (the )?(user agent|platform|browser)|permission policy)/.test(
      signature
    );
  }
  function getMicrophoneRecoveryMessage(payloadOrMessage) {
    const signature = getMicrophoneErrorSignature(payloadOrMessage);
    if (/secure context|insecure|https|localhost/.test(signature)) {
      return "Microphone requires a secure page. Open this site with https:// or localhost, then tap Waiting on Clerk again.";
    }
    if (/notfounderror|no microphone|device not found|audio input/.test(signature)) {
      return "No microphone was found. Connect a microphone, allow access for this site, then tap Waiting on Clerk again.";
    }
    if (/notreadableerror|could not start audio source|hardware|busy/.test(signature)) {
      return "Microphone is busy or unavailable. Close other apps using the microphone, then tap Waiting on Clerk again.";
    }
    if (isLikelyMicrophonePermissionError(signature)) {
      return "Microphone access is blocked. Tap Waiting on Clerk, allow access for this site in browser settings, and try again.";
    }
    return "Microphone is unavailable. Tap Waiting on Clerk, verify browser microphone access, and try again.";
  }
  function getWidgetIframeLaunchDiagnostic() {
    const frame = document.getElementById("clerkVoiceFrame");
    if (!frame) return null;
    try {
      const doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
      if (!doc || !doc.body) return null;
      const bodyText = coerceText(doc.body.innerText).replace(/\s+/g, " ").trim();
      const controls = Array.from(
        doc.querySelectorAll("button, [role=\"button\"], input[type=\"button\"], input[type=\"submit\"]")
      ).slice(0, 16);
      const controlSignatures = controls.map(function (element) {
        return buildStartConversationCandidateSignature(element);
      });
      const disabledConnectingControl = controls.some(function (element) {
        const signatureText = buildStartConversationCandidateSignature(element);
        return /connecting|starting/.test(signatureText) && isStartGateInteractiveElementDisabled(element);
      });
      const combinedSignature = [bodyText, controlSignatures.join(" | ")]
        .map(function (chunk) {
          return coerceText(chunk).toLowerCase();
        })
        .filter(Boolean)
        .join(" ");
      if (!combinedSignature) return null;
      if (
        isLikelyMicrophoneError(combinedSignature) ||
        /allow microphone|microphone permission denied|microphone access|permission blocked|notallowederror|securityerror/.test(
          combinedSignature
        )
      ) {
        return {
          kind: "microphone",
          detail:
            coerceText(bodyText).slice(0, 320) ||
            coerceText(controlSignatures.join(" | ")).slice(0, 240) ||
            "Microphone permission denied",
        };
      }
      if (
        /could not connect to (the )?voice|could not connect to audio|socket[_\s-]?error|audio[_\s-]?error|voice session error/.test(
          combinedSignature
        )
      ) {
        return {
          kind: "connection",
          detail:
            coerceText(bodyText).slice(0, 320) ||
            coerceText(controlSignatures.join(" | ")).slice(0, 240) ||
            "Voice session connection failed",
        };
      }
      if (disabledConnectingControl) {
        return { kind: "connecting", detail: "Connecting..." };
      }
      return null;
    } catch (_err) {
      return null;
    }
  }
  function handleWidgetRuntimeErrorSignal(payloadOrMessage, fallbackType) {
    const payload =
      payloadOrMessage &&
      typeof payloadOrMessage === "object" &&
      payloadOrMessage.payload &&
      typeof payloadOrMessage.payload === "object"
        ? payloadOrMessage.payload
        : payloadOrMessage;
    const detail =
      coerceText(
        payload &&
          (payload.message ||
            payload.detail ||
            payload.reason ||
            payload.slug ||
            payload.error ||
            payload.code)
      ) || coerceText(fallbackType) || "Voice session error.";
    trackExperimentTelemetryEvent("runtime-error", {
      fallback_type: coerceText(fallbackType),
      detail: detail,
    });
    resetSignalStage();
    clearUnityStartGateLaunchTimers();
    noteUnityStartGateProgress("runtime-error");
    if (isLikelyMicrophoneError(payload || detail)) {
      const recoveryMessage = getMicrophoneRecoveryMessage(payload || detail);
      const retryBtn = document.getElementById("clerkVoiceStartBtn");
      if (retryBtn) retryBtn.textContent = START_BUTTON_WAITING_LABEL;
      unityStartGatePreflightReady = false;
      unityStartGatePreflightAttempted = true;
      unityStartGatePreflightFailed = true;
      unityStartGatePending = true;
      unityStartGatePendingRequiresRecovery = true;
      unityStartGatePreflightStatusMessage = recoveryMessage;
      setWidgetFrameVisible(true);
      setStartButtonVisible(true);
      setLaunchEmblemVisible(false);
      setPanelMode("centered");
      setStatus(recoveryMessage, true, true);
      return;
    }

    if (!hasConversationStarted) {
      unityStartGatePending = true;
      unityStartGatePendingRequiresRecovery = false;
      unityStartGatePreflightStatusMessage = detail;
      const retryBtn = document.getElementById("clerkVoiceStartBtn");
      if (retryBtn) retryBtn.textContent = START_BUTTON_WAITING_LABEL;
      setWidgetFrameVisible(true);
      setStartButtonVisible(true);
      setLaunchEmblemVisible(false);
      setPanelMode("centered");
    }
    setStatus(`Voice session error: ${detail}`, true, true);
  }
  function handleWidgetReadySignal(progressEventType) {
    if (widgetReady) return;
    widgetReady = true;
    trackExperimentTelemetryEvent("widget-ready", {
      progress_event_type: coerceText(progressEventType),
    });
    noteUnityStartGateProgress(
      coerceText(progressEventType) || "widget-iframe-ready"
    );
    clearFrameLoadTimer();
    const cfg = getRuntimeVoiceConfig();
    if (unityStartGatePending) {
      const gateMessage =
        coerceText(unityStartGatePreflightStatusMessage) ||
        "Tap Waiting on Clerk to begin speaking with Clerk.";
      const startBtn = document.getElementById("clerkVoiceStartBtn");
      if (startBtn) startBtn.textContent = START_BUTTON_WAITING_LABEL;
      setStatus(gateMessage, unityStartGatePendingRequiresRecovery, true);
      setWidgetFrameVisible(false);
      setStartButtonVisible(true);
      setLaunchEmblemVisible(true);
      setCompactSquareFrameSize();
      setPanelMode("centered");
      setSessionDiagnostics(
        buildSessionDiagnostics(
          pendingLaunchSession,
          cfg,
          document.getElementById("clerkVoiceFrame")?.src || "",
          "ready-awaiting-mic"
        ),
        false
      );
      return;
    }
    const configured = sendWidgetConfig(cfg, pendingLaunchSession);
    if (!configured) {
      setStatus(getVoiceEngineMissingConfigMessage(cfg), true);
      setHelpLink(document.getElementById("clerkVoiceFrame")?.src || "", true);
      setWidgetFrameVisible(false);
      return;
    }
    setWidgetFrameVisible(false);
    setStatus(`${cfg.character_name} is ready. Initializing voice session…`, false, true);
    setStartButtonVisible(false);
    setLaunchEmblemVisible(true);
    setCompactSquareFrameSize();
    setPanelMode("centered");
    const readyRetrySchedule = getUnityStartGateRetrySchedule(cfg, "ready");
    scheduleIframeStartConversationRetry(
      readyRetrySchedule.maxAttempts,
      readyRetrySchedule.delayMs
    );
    window.setTimeout(function () {
      const modalEl = document.getElementById("clerkVoiceModal");
      if (!modalEl || !modalEl.classList.contains("active")) return;
      if (hasConversationStarted) return;
      unityStartGatePending = true;
      unityStartGatePendingRequiresRecovery = false;
      unityStartGatePreflightStatusMessage = "Tap Waiting on Clerk to begin speaking with Clerk.";
      const retryBtn = document.getElementById("clerkVoiceStartBtn");
      if (retryBtn) retryBtn.textContent = START_BUTTON_WAITING_LABEL;
      setStartButtonVisible(true);
      setLaunchEmblemVisible(true);
      setStatus("Tap Waiting on Clerk to begin speaking with Clerk.", false, true);
    }, getUnityStartGatePostReadyPromptDelayMs(cfg));
    setSessionDiagnostics(
      buildSessionDiagnostics(
        pendingLaunchSession,
        cfg,
        document.getElementById("clerkVoiceFrame")?.src || "",
        "ready-awaiting-session-start"
      ),
      false
    );
  }

  function bindFrameMessaging() {
    if (frameMessagingBound) return;
    frameMessagingBound = true;

    window.addEventListener("message", function (event) {
      if (!activeFrameOrigin || event.origin !== activeFrameOrigin) return;
      const data = event.data;
      if (!data || typeof data !== "object" || typeof data.type !== "string") return;
      const eventType = coerceText(data.type).toLowerCase();
      if (!eventType) return;
      trackExperimentTelemetryEvent("widget-postmessage-inbound", {
        message_type: eventType,
        origin: coerceText(event.origin),
      });
      if (eventType === "maxwellian_probe") {
        trackExperimentTelemetryEvent(
          "renderer-probe",
          data && data.payload && typeof data.payload === "object" ? data.payload : {},
          { cfg: getRuntimeVoiceConfig() }
        );
        return;
      }
      if (!hasConversationStarted && shouldTrackUnityStartGateProgressEvent(eventType)) {
        noteUnityStartGateProgress(eventType);
        if (isLikelyUnityConversationStartedEventType(eventType)) {
          markConversationStartedFromWidgetSignal();
        } else if (unityStartGatePending && unityStartGateStallTimer) {
          scheduleUnityStartGateStallTimer(getRuntimeVoiceConfig());
        }
      }

      if (isWidgetReadyEventType(eventType)) {
        handleWidgetReadySignal("widget-iframe-ready");
        return;
      }
      if (
        eventType === "error" ||
        eventType === "mic_error" ||
        eventType === "socket_error" ||
        eventType === "audio_error"
      ) {
        handleWidgetRuntimeErrorSignal(data && data.payload ? data.payload : data, eventType);
        return;
      }
      if (eventType === "resize_frame" && data.payload) {
        setWidgetFrameSize(data.payload.width, data.payload.height);
        return;
      }
      if (eventType === "expand_widget") {
        if (!hasConversationStarted) {
          if (!unityStartGatePending) {
            setStatus("", false);
          }
          setWidgetFrameVisible(true);
          setStartButtonVisible(Boolean(unityStartGatePending));
          setLaunchEmblemVisible(false);
          setPanelMode("centered");
          return;
        }
        setWidgetFrameVisible(true);
        setStartButtonVisible(false);
        setLaunchEmblemVisible(false);
        setPanelMode("centered");
        return;
      }
      if (eventType === "collapse_widget" || eventType === "minimize_widget") {
        if (!hasConversationStarted) {
          const shouldKeepRendererVisible =
            !unityStartGatePending ||
            unityStartGatePreflightAttempted ||
            unityStartGatePreflightReady;
          setWidgetFrameVisible(shouldKeepRendererVisible);
          setStartButtonVisible(Boolean(unityStartGatePending));
          setLaunchEmblemVisible(!shouldKeepRendererVisible);
          setPanelMode("centered");
          return;
        }
        setStartButtonVisible(false);
        setLaunchEmblemVisible(false);
        setPanelMode("docked");
        return;
      }

      if (eventType === "transcript_message") {
        const transcriptPayload = data && data.payload ? data.payload : null;
        if (transcriptPayload && typeof transcriptPayload === "object") {
          const transcriptType = coerceText(transcriptPayload.type).toLowerCase();
          if (
            transcriptType === "error" ||
            transcriptType === "mic_error" ||
            transcriptType === "socket_error" ||
            transcriptType === "audio_error"
          ) {
            handleWidgetRuntimeErrorSignal(transcriptPayload, transcriptType || "transcript_error");
            return;
          }
        }
        markConversationStartedFromWidgetSignal();
        const transcriptRole = extractTranscriptRole(transcriptPayload);
        const transcriptTextRaw = extractTranscriptText(transcriptPayload);
        const transcriptText = normalizeMptsSpeechText(transcriptTextRaw);
        const cfg = getRuntimeVoiceConfig();
        syncMptsSpeechGuardrailToSession(
          cfg,
          transcriptTextRaw,
          transcriptText,
          isLikelyAssistantRole(transcriptRole)
            ? "assistant-transcript-message"
            : "visitor-transcript-message"
        );
        if (isLikelyAssistantRole(transcriptRole)) {
          pulseSignalSpeaking();
        } else {
          markSignalListening();
        }
        appendCrossPageRoamingTranscript(transcriptRole, transcriptText);
        const canCaptureName = !isLikelyAssistantRole(transcriptRole);
        const guardrailSettings = getGuardrailSettings(cfg);
        markGuardrailActivity();
        scheduleGuardrailIdleTimer(guardrailSettings, cfg);
        const heartbeatState = enforceGuardrailHeartbeat(guardrailSettings);
        if (!heartbeatState.allow) {
          triggerGuardrailOffboarding(heartbeatState.reason || "session-time-limit", guardrailSettings, cfg);
          return;
        }
        let shouldHoldForNotes = false;
        let tourGuideIntentResult = null;
        let electricalStoryResult = null;
        let interestedOnboardingResult = null;
        let questionLogged = false;
        if (canCaptureName) {
          if (coerceText(transcriptText)) {
            clearGuardrailIdlePromptFlow(
              cfg,
              "guardrail-idle-flow-reset-on-visitor-response",
              true
            );
          }
          const detectedVisitorName = parseVisitorNameFromText(transcriptText);
          if (detectedVisitorName && detectedVisitorName !== currentVisitorName) {
            currentVisitorName = detectedVisitorName;
            syncVisitorIdentityToSession(currentVisitorName);
          }
          const founderSignal = detectFounderSignal(transcriptText, cfg);
          if (founderSignal.active && !founderModeActive) {
            founderModeActive = true;
            founderModeIdentity = founderSignal.identity || currentVisitorName || "Founder";
            if (founderModeIdentity && founderModeIdentity !== "Founder") {
              currentVisitorName = founderModeIdentity;
              syncVisitorIdentityToSession(currentVisitorName);
            }
            questionNotesActivated = true;
            syncFounderModeToSession(cfg, transcriptText);
            shouldHoldForNotes = true;
          }
          const leadCaptureUpdated = updateLeadCaptureFromTranscript(transcriptText, cfg);
          questionLogged = registerVisitorQuestion(transcriptText);
          if (questionLogged) {
            const guardrailDecision = evaluateGuardrailQuestion(transcriptText, guardrailSettings);
            if (!guardrailDecision.allow) {
              triggerGuardrailOffboarding(guardrailDecision.reason || "question-limit", guardrailSettings, cfg);
              return;
            }
            if (!questionNotesActivated && visitorQuestionCount >= getQuestionNotesThreshold(cfg)) {
              questionNotesActivated = true;
              shouldHoldForNotes = true;
              syncQuestionNotesToSession(cfg);
            } else if (questionNotesActivated) {
              syncQuestionNotesToSession(cfg);
            }
          }
          if (leadCaptureUpdated && isElectricalStorySession(pendingLaunchSession)) {
            syncElectricalStoryGuardrailToSession(
              cfg,
              "electrical-story-identity-updated",
              true
            );
          }
          electricalStoryResult = handleElectricalStoryGuardrailTurn(
            transcriptText,
            cfg,
            questionLogged
          );
          if (electricalStoryResult && electricalStoryResult.closeTriggered) {
            return;
          }
          tourGuideIntentResult = handleTourGuideTranscriptIntent(transcriptText, cfg);
          if (tourGuideIntentResult && tourGuideIntentResult.navigated) {
            return;
          }
          interestedOnboardingResult = maybeHandleInterestedVisitorOnboarding(
            transcriptText,
            cfg,
            questionLogged,
            guardrailSettings
          );
        }
        if (electricalStoryResult && coerceText(electricalStoryResult.statusText)) {
          clearQuestionNotesStatusTimer();
          setStatus(electricalStoryResult.statusText, false, true);
          questionNotesStatusTimer = window.setTimeout(function () {
            setStatus("", false);
          }, clampNumber(electricalStoryResult.statusDurationMs, 1200, 8000, 3200));
        } else if (tourGuideIntentResult && coerceText(tourGuideIntentResult.statusText)) {
          clearQuestionNotesStatusTimer();
          setStatus(tourGuideIntentResult.statusText, false, true);
          questionNotesStatusTimer = window.setTimeout(function () {
            setStatus("", false);
          }, 2400);
        } else if (
          interestedOnboardingResult &&
          coerceText(interestedOnboardingResult.statusText)
        ) {
          clearQuestionNotesStatusTimer();
          setStatus(interestedOnboardingResult.statusText, false, true);
          questionNotesStatusTimer = window.setTimeout(function () {
            setStatus("", false);
          }, clampNumber(interestedOnboardingResult.statusDurationMs, 1400, 7000, 3200));
        } else if (shouldHoldForNotes) {
          clearQuestionNotesStatusTimer();
          setStatus(getQuestionNotesHoldLine(cfg), false, true);
          questionNotesStatusTimer = window.setTimeout(function () {
            setStatus("", false);
          }, 1200);
        } else {
          setStatus("", false);
        }
        if (canCaptureName) {
          triggerContentRetrievalFromTranscript(transcriptText, cfg);
        }
        setStartButtonVisible(false);
        setLaunchEmblemVisible(false);
        setPanelMode("centered");
        return;
      }
      if (eventType === "audio_output") {
        markConversationStartedFromWidgetSignal();
        pulseSignalSpeaking();
        const cfg = getRuntimeVoiceConfig();
        const guardrailSettings = getGuardrailSettings(cfg);
        markGuardrailActivity();
        scheduleGuardrailIdleTimer(guardrailSettings, cfg);
        const heartbeatState = enforceGuardrailHeartbeat(guardrailSettings);
        if (!heartbeatState.allow) {
          triggerGuardrailOffboarding(heartbeatState.reason || "session-time-limit", guardrailSettings, cfg);
          return;
        }
        setStartButtonVisible(false);
        setLaunchEmblemVisible(false);
        setPanelMode("centered");
        return;
      }
      if (eventType === "error") {
        const payload = data && data.payload && typeof data.payload === "object" ? data.payload : {};
        const detail = typeof payload.message === "string" ? payload.message : "Unknown voice session error.";
        const cfg = getRuntimeVoiceConfig();
        clearUnityStartGateLaunchTimers();
        unityStartGateStallRetryCount = 0;
        if (isLikelyMicrophoneError(payload) || isLikelyMicrophoneError(detail)) {
          const micRecoveryMessage = getMicrophoneRecoveryMessage(payload.message ? payload : detail);
          const startBtn = document.getElementById("clerkVoiceStartBtn");
          if (startBtn) {
            startBtn.textContent = START_BUTTON_WAITING_LABEL;
          }
          unityStartGatePending = true;
          unityStartGatePendingRequiresRecovery = true;
          unityStartGatePreflightStatusMessage = micRecoveryMessage;
          resetSignalStage();
          setStatus(micRecoveryMessage, true, true);
          setWidgetFrameVisible(false);
          setStartButtonVisible(true);
          setLaunchEmblemVisible(true);
          setHelpLink(document.getElementById("clerkVoiceFrame")?.src || "", true);
          setPanelMode("centered");
          return;
        }
        resetSignalStage();
        setStatus(`Voice session error: ${detail}`, true, true);
        setWidgetFrameVisible(false);
        setStartButtonVisible(true);
        setLaunchEmblemVisible(true);
      }
    });
  }

  function composeEmbedUrl(cfg, launchSession) {
    const rawUrl = (cfg.embed_url || "").trim();
    if (!rawUrl) return "";
    let url;
    try {
      url = new URL(rawUrl, window.location.href);
    } catch (_err) {
      return "";
    }

    const params = url.searchParams;
    const characterName = coerceText(cfg && cfg.character_name);
    if (characterName) params.set("character_name", characterName);
    const humeConfigId = coerceText(cfg && (cfg.hume_config_id || cfg.config_id));
    if (humeConfigId) params.set("config_id", humeConfigId);
    const humeConfigVersion = Number(cfg && cfg.config_version);
    if (Number.isFinite(humeConfigVersion)) {
      params.set("config_version", String(Math.max(0, Math.floor(humeConfigVersion))));
    }
    const voiceOverrideId = coerceText(cfg && (cfg.hume_voice_id || cfg.voice_id || cfg.openai_voice));
    if (voiceOverrideId) params.set("voice_id", voiceOverrideId);
    if (launchSession && typeof launchSession === "object") {
      const legacyContext = cleanReinterpretationText(launchSession.legacyContext, 240);
      if (legacyContext) params.set("context", legacyContext);
      if (launchSession.characterId) params.set("character_id", launchSession.characterId);
      if (launchSession.contextSource) params.set("context_source", launchSession.contextSource);
      if (launchSession.uiMode) params.set("ui_mode", launchSession.uiMode);
      if (launchSession.intelligenceProfile && launchSession.intelligenceProfile.id) {
        params.set("intelligence_profile_id", launchSession.intelligenceProfile.id);
      }
    } else if (typeof launchSession === "string" && launchSession.trim()) {
      params.set("context", launchSession.trim());
    }
    return url.toString();
  }

  function injectModalStyles() {
    if (document.getElementById("clerkVoiceModalStyles")) return;

    const style = document.createElement("style");
    style.id = "clerkVoiceModalStyles";
    style.textContent = `
      .clerk-voice-modal {
        display: none;
        position: fixed;
        right: 18px;
        bottom: 118px;
        z-index: 12000;
        background: transparent;
        padding: 0;
      }
      .clerk-voice-modal.active { display: block; }
      .clerk-voice-modal-content {
        width: min(320px, calc(100vw - 24px));
        height: min(320px, calc(100vh - 24px));
        background: transparent;
        border-radius: 0;
        border: none;
        box-shadow: none;
        display: flex;
        flex-direction: column;
        overflow: visible;
      }
      .clerk-voice-modal-header {
        position: absolute;
        top: 2px;
        right: 2px;
        z-index: 6;
        background: transparent;
        color: transparent;
        padding: 0;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        border: none;
        pointer-events: none;
      }
      .clerk-voice-header-actions {
        display: inline-flex;
        align-items: center;
        gap: 0;
        pointer-events: auto;
      }
      .clerk-voice-modal-title-row {
        display: none;
      }
      .clerk-voice-character-wrap {
        display: none !important;
        align-items: center;
        gap: 8px;
        margin-left: 12px;
      }
      .clerk-voice-character-label {
        font-size: 0.76em;
        font-weight: 700;
        color: rgba(245, 240, 190, 0.95);
        letter-spacing: 0.2px;
      }
      .clerk-voice-character-select {
        min-width: 150px;
        max-width: 220px;
        background: rgba(25, 35, 0, 0.85);
        color: rgba(245, 240, 190, 1);
        border: 1px solid rgba(180, 210, 120, 0.75);
        border-radius: 8px;
        padding: 4px 8px;
        font-size: 0.8em;
        font-weight: 600;
      }
      .clerk-voice-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid rgba(250, 240, 160, 0.8);
        object-fit: cover;
        background: rgba(25, 35, 0, 0.8);
        flex-shrink: 0;
      }
      .clerk-voice-modal-title {
        font-size: 1.0em;
        font-weight: 700;
        margin: 0;
        letter-spacing: 0.4px;
      }
      .clerk-voice-close {
        background: rgba(255, 255, 255, 0.92);
        color: rgba(54, 54, 54, 0.92);
        border: 1px solid rgba(168, 168, 168, 0.55);
        font-size: 1.12em;
        line-height: 1;
        cursor: pointer;
        opacity: 0.74;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .clerk-voice-close:hover { opacity: 1; }
      .clerk-voice-toggle {
        display: none;
        background: rgba(20, 28, 0, 0.65);
        color: rgba(250, 240, 180, 1);
        border: 1px solid rgba(190, 220, 120, 0.8);
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 0.74em;
        font-weight: 700;
        letter-spacing: 0.2px;
        cursor: pointer;
      }
      .clerk-voice-toggle:hover { filter: brightness(1.08); }
      .clerk-voice-status {
        display: none;
        position: absolute;
        left: 50%;
        bottom: 68px;
        transform: translateX(-50%);
        z-index: 8;
        width: min(88%, 420px);
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid rgba(190, 220, 120, 0.55);
        background: rgba(14, 22, 4, 0.9);
        color: rgba(244, 247, 214, 0.96);
        font-size: 0.78em;
        font-weight: 700;
        line-height: 1.35;
        text-align: center;
      }
      .clerk-voice-status.error {
        display: block;
        border-color: rgba(255, 188, 110, 0.72);
        background: rgba(48, 26, 10, 0.93);
        color: rgba(255, 229, 197, 0.98);
      }
      .clerk-voice-help {
        display: none !important;
      }
      .clerk-voice-help[hidden] { display: none !important; }
      .clerk-voice-help a {
        color: rgba(49, 65, 0, 1);
        font-weight: 700;
        text-decoration: underline;
      }
      .clerk-voice-diagnostics {
        display: none !important;
      }
      .clerk-voice-diagnostics.error {
        display: none !important;
      }
      .clerk-voice-diagnostics[hidden] { display: none !important; }
      .clerk-voice-frame-wrap {
        position: relative;
        width: 100%;
        flex: 1;
        background: transparent;
        overflow: hidden;
      }
      .clerk-voice-backdrop {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-repeat: no-repeat;
        background-position: center 58%;
        background-size: min(84%, 460px) auto;
        opacity: 0.34;
        filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.32));
        transition: opacity 180ms ease, background-image 180ms ease;
      }
      .clerk-voice-backdrop.calm-page {
        background-position: center center;
        background-size: cover;
        opacity: 1;
        filter: none;
      }
      .clerk-voice-backdrop.docked {
        opacity: 0.22;
      }
      .clerk-voice-watermark {
        position: absolute;
        right: 12px;
        top: 12px;
        z-index: 2;
        width: 96px;
        height: 96px;
        border-radius: 14px;
        overflow: hidden;
        border: 1px solid rgba(170, 205, 80, 0.55);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
        opacity: 0.55;
        pointer-events: none;
      }
      .clerk-voice-watermark img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .clerk-voice-presence-chip {
        position: absolute;
        top: 12px;
        left: 12px;
        z-index: 2;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 999px;
        border: 1px solid rgba(170, 205, 80, 0.6);
        background: rgba(18, 35, 0, 0.72);
        color: rgba(235, 245, 180, 1);
        font-size: 0.78em;
        letter-spacing: 0.3px;
        pointer-events: none;
      }
      .clerk-voice-presence-chip img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid rgba(220, 240, 140, 0.8);
        background: rgba(10, 14, 20, 1);
      }
      .clerk-voice-unity-overlay {
        position: absolute;
        left: 50%;
        bottom: 74px;
        transform: translateX(-50%);
        z-index: 4;
        width: min(96%, 980px);
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        pointer-events: none;
      }
      .clerk-voice-unity-bottom-mask {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 118px;
        z-index: 3;
        pointer-events: none;
        background: linear-gradient(
          180deg,
          rgba(8, 12, 18, 0) 0%,
          rgba(8, 12, 18, 0.58) 42%,
          rgba(8, 12, 18, 0.94) 82%,
          rgba(8, 12, 18, 0.98) 100%
        );
      }
      .clerk-voice-unity-overlay.docked { display: none; }
      .clerk-voice-unity-bottom-mask.docked { display: none; }
      .clerk-voice-unity-message {
        width: 100%;
        padding: 4px 12px;
        border: none;
        background: transparent;
        color: rgba(250, 247, 220, 0.98);
        text-align: center;
        font-size: 1.34em;
        font-family: "Times New Roman", Times, serif;
        font-style: italic;
        font-weight: 700;
        line-height: 1.35;
        letter-spacing: 0.2px;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.78);
      }
      .clerk-voice-frame {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        width: 50px;
        height: 50px;
        border: none;
        background: transparent;
        border-radius: 0;
        overflow: hidden;
        transition: all 220ms ease;
      }
      .clerk-voice-frame.docked {
        left: auto;
        top: auto;
        right: 18px;
        bottom: 18px;
        transform: none;
      }
      .clerk-voice-signal-stage {
        position: absolute;
        inset: 0;
        z-index: 5;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
        gap: 14px;
        pointer-events: none;
      }
      .clerk-voice-signal-stage[hidden] {
        display: none;
      }
      .clerk-voice-signal-portrait {
        position: absolute;
        left: 50%;
        top: 44%;
        width: min(122%, 284px);
        max-height: 100%;
        transform: translate(-50%, -50%);
        object-fit: contain;
        object-position: center;
        opacity: 0.78;
        filter:
          brightness(0.34)
          contrast(1.38)
          saturate(0.96)
          drop-shadow(0 12px 24px rgba(0, 0, 0, 0.48));
      }
      .clerk-voice-signal-stage.contrast-light-bg .clerk-voice-signal-portrait {
        opacity: 0.82;
        filter:
          brightness(0.27)
          contrast(1.52)
          saturate(0.92)
          drop-shadow(0 13px 26px rgba(0, 0, 0, 0.52));
      }
      .clerk-voice-signal-stage.contrast-dark-bg .clerk-voice-signal-portrait {
        opacity: 0.76;
        filter:
          brightness(0.45)
          contrast(1.22)
          saturate(0.8)
          drop-shadow(0 14px 28px rgba(0, 0, 0, 0.5));
      }
      .clerk-voice-signal-stage.is-forming .clerk-voice-signal-portrait {
        animation: clerkSignalPortraitFormIn ${SIGNAL_FORMATION_DURATION_MS}ms cubic-bezier(0.2, 0.62, 0.18, 1) forwards;
      }
      .clerk-voice-signal-stage.is-forming .clerk-voice-signal-wave {
        animation: clerkSignalWaveFormIn ${SIGNAL_FORMATION_DURATION_MS}ms ease-out forwards;
      }
      .clerk-voice-signal-stage.is-forming .clerk-voice-signal-bar {
        animation-name: clerkSignalBarFormIn;
        animation-duration: ${SIGNAL_FORMATION_DURATION_MS}ms;
        animation-timing-function: ease-out;
        animation-fill-mode: forwards;
      }
      .clerk-voice-signal-wave {
        position: absolute;
        left: 50%;
        bottom: 54px;
        transform: translateX(-50%);
        z-index: 2;
        width: min(82%, var(--clerk-signal-wave-max-width, 236px));
        max-width: calc(100% - 22px);
        height: 72px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        gap: var(--clerk-signal-gap, 4px);
        padding: 0 4px;
      }
      .clerk-voice-signal-bar {
        width: var(--signal-bar-width, 7px);
        min-height: var(--clerk-signal-bar-min-height, 12px);
        height: var(--clerk-signal-bar-idle-height, 16px);
        border-radius: 999px;
        background: linear-gradient(180deg, rgba(74, 132, 40, 0.98) 0%, rgba(34, 84, 22, 0.98) 100%);
        box-shadow: 0 0 10px rgba(44, 102, 28, 0.48);
        transform-origin: center bottom;
        animation: clerkSignalListening 1.2s ease-in-out infinite;
        animation-delay: var(--signal-delay, 0s);
        flex: 0 0 auto;
      }
      .clerk-voice-signal-stage.is-speaking .clerk-voice-signal-bar {
        animation-name: clerkSignalSpeaking;
        animation-duration: 520ms;
      }
      .clerk-voice-signal-stage.is-idle .clerk-voice-signal-bar {
        opacity: 0.46;
      }
      .clerk-voice-signal-nameplate {
        position: absolute;
        left: 50%;
        bottom: 14px;
        transform: translateX(-50%);
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1px;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 180ms ease;
      }
      .clerk-voice-signal-name {
        font-family: "Times New Roman", Times, serif;
        font-size: 1.03em;
        font-style: italic;
        font-weight: 700;
        line-height: 1.1;
        letter-spacing: 0.28px;
        color: rgba(48, 71, 35, 0.98);
        text-shadow: 0 1px 2px rgba(24, 39, 16, 0.34);
      }
      .clerk-voice-signal-title {
        font-family: "Helvetica Neue", Arial, sans-serif;
        font-size: 0.55em;
        font-style: normal;
        font-weight: 700;
        line-height: 1.05;
        letter-spacing: 0.82px;
        color: rgba(72, 96, 54, 0.96);
        text-shadow: 0 1px 2px rgba(24, 39, 16, 0.28);
      }
      .clerk-voice-signal-stage.show-clerk-name .clerk-voice-signal-nameplate {
        opacity: 0.98;
      }
      .clerk-voice-signal-label {
        display: none;
      }
      @keyframes clerkSignalPortraitFormIn {
        0% {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.72);
          filter:
            blur(16px)
            brightness(1.2)
            contrast(0.24)
            saturate(0.78)
            drop-shadow(0 3px 10px rgba(0, 0, 0, 0.16));
        }
        58% {
          opacity: 0.52;
          transform: translate(-50%, -50%) scale(0.9);
          filter:
            blur(5px)
            brightness(0.55)
            contrast(0.82)
            saturate(0.9)
            drop-shadow(0 8px 20px rgba(0, 0, 0, 0.28));
        }
        100% {
          opacity: 0.84;
          transform: translate(-50%, -50%) scale(1);
          filter:
            blur(0)
            brightness(0.31)
            contrast(1.46)
            saturate(0.94)
            drop-shadow(0 14px 28px rgba(0, 0, 0, 0.56));
        }
      }
      @keyframes clerkSignalWaveFormIn {
        0% {
          opacity: 0;
          transform: translateX(-50%) scale(0.7);
        }
        55% {
          opacity: 0.62;
          transform: translateX(-50%) scale(0.92);
        }
        100% {
          opacity: 1;
          transform: translateX(-50%) scale(1);
        }
      }
      @keyframes clerkSignalBarFormIn {
        0% {
          height: 6px;
          opacity: 0.08;
        }
        60% {
          height: 34px;
          opacity: 0.68;
        }
        100% {
          height: 16px;
          opacity: 0.88;
        }
      }
      @keyframes clerkSignalListening {
        0%, 100% {
          height: 14px;
          opacity: 0.82;
        }
        40% {
          height: 24px;
          opacity: 1;
        }
        70% {
          height: 18px;
          opacity: 0.9;
        }
      }
      @keyframes clerkSignalSpeaking {
        0% {
          height: 16px;
          opacity: 0.86;
        }
        25% {
          height: 52px;
          opacity: 1;
        }
        50% {
          height: 28px;
          opacity: 0.92;
        }
        75% {
          height: 58px;
          opacity: 1;
        }
        100% {
          height: 18px;
          opacity: 0.85;
        }
      }
      .clerk-voice-start-btn {
        position: absolute;
        left: 50%;
        bottom: -2px;
        transform: translateX(-50%);
        z-index: 3;
        width: min(76%, 184px);
        max-width: calc(100% - 20px);
        min-width: 0;
        min-height: 52px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(180deg, rgba(76, 116, 58, 0.98) 0%, rgba(52, 90, 41, 0.98) 100%);
        color: rgba(255, 255, 255, 0.99) !important;
        -webkit-text-fill-color: rgba(255, 255, 255, 0.99);
        border: 2px solid rgba(173, 204, 84, 0.96);
        border-radius: 999px;
        padding: 8px 16px 8px;
        font-weight: 760;
        font-size: 0.9em;
        line-height: 1.05;
        letter-spacing: 0.01em;
        text-align: center;
        white-space: nowrap;
        text-shadow: 0 1px 0 rgba(16, 28, 11, 0.42);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          0 8px 20px rgba(0, 0, 0, 0.44);
        cursor: pointer;
      }
      .clerk-voice-start-btn::after {
        display: block;
        content: "SELECT" !important;
        margin-top: 2px;
        font-size: 0.62em;
        font-weight: 800;
        font-style: normal;
        letter-spacing: 1.15px;
        color: rgba(250, 240, 160, 0.98);
        line-height: 1;
      }
      .clerk-voice-start-btn:hover {
        filter: brightness(1.05);
      }
      .clerk-voice-start-btn[hidden] {
        display: none;
      }
      .clerk-voice-launch-emblem {
        display: none;
        position: absolute;
        inset: 0;
        z-index: 2;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .clerk-voice-launch-ring-wrap {
        position: relative;
        width: min(44vw, 340px);
        max-width: 340px;
        min-width: 170px;
        aspect-ratio: 1 / 1;
      }
      .clerk-voice-launch-ring {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: brightness(0.5) drop-shadow(0 14px 34px rgba(0, 0, 0, 0.35));
      }
      .clerk-voice-launch-title {
        display: none;
      }
      .clerk-voice-launch-emblem[hidden] {
        display: none;
      }
      .clerk-floating-launcher-wrap {
        position: fixed;
        right: 18px;
        bottom: 18px;
        z-index: 11950;
        display: inline-flex;
        flex-direction: row-reverse;
        align-items: center;
        gap: 10px;
      }
      .clerk-floating-launcher-wrap[hidden] {
        display: none;
      }
      .clerk-floating-launcher-btn {
        position: relative;
        width: 138px;
        height: 138px;
        border-radius: 50%;
        border: 6px solid rgba(84, 143, 65, 0.97);
        background: rgba(255, 255, 255, 0.99);
        box-shadow:
          inset 0 0 0 2px rgba(242, 245, 236, 0.98),
          0 10px 22px rgba(0, 0, 0, 0.22);
        cursor: pointer;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: box-shadow 160ms ease, filter 160ms ease;
      }
      .clerk-floating-launcher-btn:hover,
      .clerk-floating-launcher-btn:focus-visible {
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.26), 0 0 0 1px rgba(84, 143, 65, 0.56);
        filter: none;
      }
      .clerk-floating-launcher-btn:focus-visible {
        outline: 2px solid rgba(246, 233, 162, 0.95);
        outline-offset: 2px;
      }
      .clerk-floating-launcher-img {
        width: 105%;
        height: 105%;
        border-radius: 50%;
        object-fit: contain;
        object-position: center 57%;
        border: none;
        background: transparent;
        filter: brightness(0.5) contrast(1.05);
        transition: transform 180ms ease, filter 180ms ease;
        transform-origin: center center;
      }
      .clerk-floating-launcher-btn:hover .clerk-floating-launcher-img,
      .clerk-floating-launcher-btn:focus-visible .clerk-floating-launcher-img {
        transform: scale(1.25);
        filter: brightness(0.51) contrast(1.18);
      }
      .clerk-floating-launcher-pulse {
        display: none;
      }
      @keyframes clerkFloatingPulse {
        0% {
          transform: scale(0.94);
          opacity: 0.72;
        }
        70% {
          transform: scale(1.12);
          opacity: 0;
        }
        100% {
          opacity: 0;
        }
      }
      .clerk-floating-launcher-tooltip {
        opacity: 0;
        transform: translateX(8px);
        visibility: hidden;
        transition: opacity 140ms ease, transform 140ms ease;
        pointer-events: none;
        padding: 8px 12px 9px;
        min-height: 44px;
        border-radius: 999px;
        border: 1px solid rgba(173, 204, 84, 0.94);
        background: linear-gradient(180deg, rgba(86, 128, 64, 0.97) 0%, rgba(58, 99, 45, 0.97) 100%);
        color: rgba(255, 255, 255, 0.98);
        text-shadow: 0 1px 0 rgba(34, 49, 22, 0.45);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        line-height: 1.05;
        font-size: 0.78em;
        font-weight: 700;
        font-style: italic;
        letter-spacing: 0.2px;
        white-space: nowrap;
      }
      .clerk-floating-launcher-tooltip::after {
        content: "SELECT";
        margin-top: 2px;
        font-size: 0.62em;
        font-weight: 800;
        font-style: normal;
        letter-spacing: 1.15px;
        color: rgba(250, 240, 160, 0.98);
        line-height: 1;
      }
      .clerk-floating-launcher-btn:hover + .clerk-floating-launcher-tooltip,
      .clerk-floating-launcher-btn:focus-visible + .clerk-floating-launcher-tooltip {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
      }
      @media (max-width: 820px) {
        .clerk-voice-modal {
          right: 10px;
          bottom: 92px;
        }
        .clerk-voice-modal-content {
          width: min(296px, calc(100vw - 14px));
          height: min(296px, calc(100vh - 14px));
        }
        .clerk-floating-launcher-wrap {
          right: 14px;
          bottom: 14px;
        }
        .clerk-floating-launcher-btn {
          width: 112px;
          height: 112px;
        }
        .clerk-floating-launcher-img {
          width: 105%;
          height: 105%;
        }
      }
      @media (max-width: 520px) {
        .clerk-voice-modal {
          left: 8px;
          right: 8px;
          bottom: 84px;
        }
        .clerk-voice-modal-content {
          width: min(274px, calc(100vw - 16px));
          max-width: calc(100vw - 16px);
          height: min(274px, calc(100vh - 16px));
          margin: 0 auto;
        }
        .clerk-voice-modal-header {
          padding: 10px 12px;
        }
        .clerk-voice-modal-title {
          font-size: 0.92em;
        }
        .clerk-voice-status {
          padding: 8px 10px;
          min-height: 34px;
          font-size: 0.8em;
        }
        .clerk-voice-help {
          padding: 8px 10px;
          font-size: 0.78em;
        }
        .clerk-floating-launcher-wrap {
          right: 10px;
          bottom: 10px;
        }
        .clerk-floating-launcher-btn {
          width: 96px;
          height: 96px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function setPresence(cfg) {
    const avatarUrl = typeof cfg.character_avatar_url === "string" ? cfg.character_avatar_url.trim() : "";
    const headerAvatar = document.getElementById("clerkVoiceHeaderAvatar");
    const backdrop = document.getElementById("clerkVoiceBackdrop");
    const watermark = document.getElementById("clerkVoiceWatermark");
    const watermarkImg = document.getElementById("clerkVoiceWatermarkImg");
    if (headerAvatar) {
      if (avatarUrl) {
        headerAvatar.src = avatarUrl;
        headerAvatar.hidden = false;
      } else {
        headerAvatar.removeAttribute("src");
        headerAvatar.hidden = true;
      }
    }
    if (backdrop) {
      const backgroundCandidates = buildFloatingLauncherAssetCandidateVariants(
        coerceText(cfg && cfg.character_background_url)
      );
      if (backgroundCandidates.length > 0) {
        backdrop.style.backgroundImage = `url("${backgroundCandidates[0]}")`;
        backdrop.classList.add("calm-page");
      } else {
        backdrop.style.backgroundImage = "";
        backdrop.classList.remove("calm-page");
      }
    }
    if (watermarkImg) {
      watermarkImg.removeAttribute("src");
    }
    if (watermark) {
      watermark.hidden = true;
    }
    setSignalPortraitSource(cfg);
    syncSignalDisplayName(cfg);
    syncSignalWaveBars(cfg);
    syncFloatingLauncherIcon(cfg);
    syncUnityLaunchEmblem(cfg);
  }

  function bindPageTransitionCleanup() {
    if (lifecycleCleanupBound) return;
    lifecycleCleanupBound = true;
    const handlePageTransition = function () {
      const modal = document.getElementById("clerkVoiceModal");
      if (!modal || !modal.classList.contains("active")) return;
      try {
        pageTransitionInProgress = true;
        closeClerkVoiceModal({
          preserveRoaming: true,
          preserveDailyMeter: true,
          reason: "page-transition",
        });
      } catch (_err) {}
    };
    window.addEventListener("pagehide", handlePageTransition);
    window.addEventListener("beforeunload", handlePageTransition);
  }

  function ensureModal() {
    injectModalStyles();
    ensureFloatingLauncher();
    if (document.getElementById("clerkVoiceModal")) return;
    bindFrameMessaging();
    bindPageTransitionCleanup();

    const modal = document.createElement("div");
    modal.id = "clerkVoiceModal";
    modal.className = "clerk-voice-modal";
    modal.innerHTML = `
      <div class="clerk-voice-modal-content" role="dialog" aria-modal="false" aria-label="Meet with Clerk">
        <div class="clerk-voice-modal-header">
          <div class="clerk-voice-modal-title-row">
            <h2 class="clerk-voice-modal-title" id="clerkVoiceTitle">Meet with Clerk</h2>
            <div id="clerkVoiceCharacterWrap" class="clerk-voice-character-wrap" hidden>
              <span class="clerk-voice-character-label">Character</span>
              <select id="clerkVoiceCharacterSelect" class="clerk-voice-character-select" aria-label="Select voice character"></select>
            </div>
          </div>
          <div class="clerk-voice-header-actions">
            <button class="clerk-voice-toggle" id="clerkVoicePanelToggleBtn" type="button">Dock Panel</button>
            <button class="clerk-voice-close" id="clerkVoiceCloseBtn" aria-label="Close">&times;</button>
          </div>
        </div>
        <p class="clerk-voice-status" id="clerkVoiceStatus" aria-live="polite"></p>
        <p class="clerk-voice-help" id="clerkVoiceHelp" hidden>
          <a id="clerkVoiceHelpLink" href="#" target="_blank" rel="noopener noreferrer">Open voice session in a new tab</a>
        </p>
        <pre class="clerk-voice-diagnostics" id="clerkVoiceDiagnostics" hidden></pre>
        <div class="clerk-voice-frame-wrap">
          <div id="clerkVoiceBackdrop" class="clerk-voice-backdrop"></div>
          <div id="clerkVoiceWatermark" class="clerk-voice-watermark" hidden>
            <img id="clerkVoiceWatermarkImg" alt="Clerk Watermark" />
          </div>
          <div id="clerkVoiceBottomMask" class="clerk-voice-unity-bottom-mask" hidden></div>
          <div id="clerkVoiceUnityOverlay" class="clerk-voice-unity-overlay" hidden>
            <div id="clerkVoiceUnityMessage" class="clerk-voice-unity-message"></div>
          </div>
          <div id="clerkVoiceLaunchEmblem" class="clerk-voice-launch-emblem" hidden>
            <div class="clerk-voice-launch-ring-wrap">
              <img id="clerkVoiceLaunchRing" class="clerk-voice-launch-ring" alt="Unity Energy launch emblem" />
              <div id="clerkVoiceLaunchTitle" class="clerk-voice-launch-title">Meet with Clerk</div>
            </div>
          </div>
          <div id="clerkVoiceSignalStage" class="clerk-voice-signal-stage" data-mode="idle" hidden>
            <img id="clerkVoiceSignalPortrait" class="clerk-voice-signal-portrait" alt="Clerk portrait" hidden />
            <div class="clerk-voice-signal-wave" aria-hidden="true">
              <span class="clerk-voice-signal-bar"></span>
              <span class="clerk-voice-signal-bar"></span>
              <span class="clerk-voice-signal-bar"></span>
              <span class="clerk-voice-signal-bar"></span>
              <span class="clerk-voice-signal-bar"></span>
              <span class="clerk-voice-signal-bar"></span>
              <span class="clerk-voice-signal-bar"></span>
            </div>
            <div id="clerkVoiceSignalNameplate" class="clerk-voice-signal-nameplate" hidden>
              <div id="clerkVoiceSignalName" class="clerk-voice-signal-name">J. Clerk Maxwell</div>
              <div id="clerkVoiceSignalTitle" class="clerk-voice-signal-title">Unity Chief Scientist</div>
            </div>
            <div id="clerkVoiceSignalLabel" class="clerk-voice-signal-label">Clerk is ready.</div>
          </div>
          <button id="clerkVoiceStartBtn" class="clerk-voice-start-btn" type="button">Waiting on Claire</button>
          <iframe
            id="clerkVoiceFrame"
            class="clerk-voice-frame"
            title="Meet with Clerk"
            loading="lazy"
            allow="microphone; autoplay; clipboard-read; clipboard-write"
            referrerpolicy="strict-origin-when-cross-origin"></iframe>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    const telemetryFrame = document.getElementById("clerkVoiceFrame");
    if (telemetryFrame && telemetryFrame.dataset.telemetryBound !== "1") {
      telemetryFrame.dataset.telemetryBound = "1";
      telemetryFrame.addEventListener("load", function () {
        trackExperimentTelemetryEvent("widget-iframe-load", {
          src: coerceText(telemetryFrame.getAttribute("src")),
        });
      });
      telemetryFrame.addEventListener("error", function () {
        trackExperimentTelemetryEvent("widget-iframe-error", {
          src: coerceText(telemetryFrame.getAttribute("src")),
        });
      });
    }
    syncSignalWaveBars(getVoiceConfig());
    setPanelMode("docked");

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeClerkVoiceModal();
    });

    document.getElementById("clerkVoiceCloseBtn").addEventListener("click", closeClerkVoiceModal);
    document.getElementById("clerkVoicePanelToggleBtn").addEventListener("click", function () {
      setPanelMode(panelMode === "docked" ? "centered" : "docked");
    });
    document.getElementById("clerkVoiceStartBtn").addEventListener("click", async function () {
      const startBtnEl = document.getElementById("clerkVoiceStartBtn");
      try {
        const st = startBtnEl ? String(startBtnEl.getAttribute("data-claire-state") || "") : "";
        const label = startBtnEl ? String(startBtnEl.textContent || "").trim().toLowerCase() : "";
        if (st === "close-ready" || label === "stop-listening") {
          try { if (typeof window.stopKurandaClaireBubble === "function") window.stopKurandaClaireBubble(); } catch (_e) {}
          try { document.body.classList.remove("claire-is-speaking"); } catch (_e) {}
          // Full stop + reset control to Waiting. Page can soft re-arm without Back.
          closeClerkVoiceModal({ reason: "stop-listening-button", preserveDailyMeter: true });
          try { showWaitingClaireButton(); } catch (_e) {}
          try {
            window.dispatchEvent(new CustomEvent("claireStopListeningReset", {
              detail: { reason: "stop-listening-button" }
            }));
          } catch (_e) {}
          return;
        }
      } catch (_e) {}

      let cfg = getRuntimeVoiceConfig();
      clearUnityStartGateLaunchTimers();
      noteUnityStartGateProgress("start-button-tap");
      setLaunchEmblemVisible(true);
      setWidgetFrameVisible(false);
      setStatus("Requesting microphone access…", false, true);
      try {
        await requestTopLevelMicAccess();
      } catch (err) {
        const recoveryMessage = getMicrophoneRecoveryMessage(err);
        unityStartGatePreflightReady = false;
        unityStartGatePreflightAttempted = true;
        unityStartGatePreflightFailed = true;
        unityStartGatePending = true;
        unityStartGatePendingRequiresRecovery = true;
        unityStartGatePreflightStatusMessage = recoveryMessage;
        const startBtn = document.getElementById("clerkVoiceStartBtn");
        if (startBtn) startBtn.textContent = START_BUTTON_WAITING_LABEL;
        setStatus(recoveryMessage, true, true);
        setStartButtonVisible(true);
        setLaunchEmblemVisible(true);
        return;
      }
      unityStartGatePreflightReady = true;
      unityStartGatePreflightAttempted = true;
      unityStartGatePreflightFailed = false;
      unityStartGatePreflightStatusMessage = "";
      unityStartGatePending = false;
      unityStartGatePendingRequiresRecovery = false;
      try { showStopListeningButton(); } catch (_e) {}
      try {
        const frameEl = document.getElementById("clerkVoiceFrame");
        if (frameEl) {
          frameEl.style.display = "block";
          frameEl.style.width = "360px";
          frameEl.style.height = "280px";
          frameEl.style.opacity = "0";
          frameEl.style.pointerEvents = "none";
        }
      } catch (_e) {}
      if (
        detectVoiceEngine(cfg) === "hume" &&
        !normalizeAuthConfig(cfg) &&
        shouldFetchServerRuntimeAuth()
      ) {
        setStatus("Refreshing secure runtime auth for Clerk…", false, true);
        await fetchRuntimeAuthFromServer({ force: true, cfg: cfg }).catch(function () {
          return null;
        });
        cfg = getRuntimeVoiceConfig();
      }

      const configured = sendWidgetConfig(cfg, pendingLaunchSession);
      if (!configured) {
        setStatus(getVoiceEngineMissingConfigMessage(cfg), true, true);
        setHelpLink(document.getElementById("clerkVoiceFrame")?.src || "", true);
        setStartButtonVisible(true);
        setWidgetFrameVisible(false);
        return;
      }
      setCompactSquareFrameSize();
      setWidgetFrameVisible(false);
      setLaunchEmblemVisible(true);
      expandWidgetFromClient();
      const tapRetrySchedule = getUnityStartGateRetrySchedule(cfg, "tap");
      scheduleIframeStartConversationRetry(
        tapRetrySchedule.maxAttempts,
        tapRetrySchedule.delayMs
      );
      setStatus(
        `${cfg.character_name} is starting your voice session…`,
        false,
        true
      );
      setStartButtonVisible(false);
      window.setTimeout(function () {
        const modalEl = document.getElementById("clerkVoiceModal");
        if (!modalEl || !modalEl.classList.contains("active")) return;
        if (hasConversationStarted) return;
        if (unityStartGatePendingRequiresRecovery) return;
        setWidgetFrameVisible(true);
        setLaunchEmblemVisible(false);
      }, 900);
      const resendDelayMs = getUnityStartGateResendDelayMs(cfg);
      unityStartGateResendTimer = window.setTimeout(function () {
        unityStartGateResendTimer = null;
        const modalEl = document.getElementById("clerkVoiceModal");
        if (!modalEl || !modalEl.classList.contains("active")) return;
        if (hasConversationStarted) return;
        noteUnityStartGateProgress("config-resend");
        sendWidgetConfig(cfg, pendingLaunchSession);
        expandWidgetFromClient();
        const resendRetrySchedule = getUnityStartGateRetrySchedule(cfg, "resend");
        scheduleIframeStartConversationRetry(
          resendRetrySchedule.maxAttempts,
          resendRetrySchedule.delayMs
        );
        scheduleUnityStartGateStallTimer(cfg);
      }, resendDelayMs);
      scheduleUnityStartGateStallTimer(cfg);
    });
    document.getElementById("clerkVoiceCharacterSelect").addEventListener("change", function (event) {
      const selectedCharacterId =
        event && event.target && typeof event.target.value === "string" ? event.target.value : "";
      const cfg = getVoiceConfig();
      const nextCharacterId = resolveCharacterId(selectedCharacterId, cfg);
      if (!pendingLaunchSession || pendingLaunchSession.characterId === nextCharacterId) return;
      const nextSession = Object.assign({}, pendingLaunchSession, { characterId: nextCharacterId });
      openClerkVoiceModal(nextSession);
    });
    const frame = document.getElementById("clerkVoiceFrame");
    frame.addEventListener("load", function () {
      const modalEl = document.getElementById("clerkVoiceModal");
      if (!modalEl || !modalEl.classList.contains("active")) return;
      applyFrameTransparencyOverrides(frame);
      if (!widgetReady) {
        setStatus("Voice widget loaded. Initializing Clerk session…", false, true);
        window.setTimeout(function () {
          const activeModal = document.getElementById("clerkVoiceModal");
          if (!activeModal || !activeModal.classList.contains("active")) return;
          if (widgetReady || hasConversationStarted) return;
          handleWidgetReadySignal("widget-iframe-load-fallback-ready");
        }, 220);
      }
    });

    frame.addEventListener("error", function () {
      clearFrameLoadTimer();
      setStatus("The voice widget could not be loaded in this modal. Try opening the session in a new tab.", true);
      setHelpLink(frame.src, true);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeClerkVoiceModal();
    });
    try {
      mountClaireStartButtonToBody();
      showWaitingClaireButton();
    } catch (_e) {}
  }

  function getCharacterLabel(characterId, characterConfig) {
    const explicitLabel =
      characterConfig && typeof characterConfig.label === "string" ? characterConfig.label.trim() : "";
    if (explicitLabel) return explicitLabel;
    const name =
      characterConfig && typeof characterConfig.character_name === "string"
        ? characterConfig.character_name.trim()
        : "";
    if (name) return name;
    return characterId;
  }

  function syncCharacterSelector(cfg, selectedCharacterId) {
    const wrap = document.getElementById("clerkVoiceCharacterWrap");
    if (!wrap) return;
    wrap.hidden = true;
  }

  function setPanelMode(mode) {
    const frame = document.getElementById("clerkVoiceFrame");
    const backdrop = document.getElementById("clerkVoiceBackdrop");
    const toggleBtn = document.getElementById("clerkVoicePanelToggleBtn");
    const overlay = document.getElementById("clerkVoiceUnityOverlay");
    const bottomMask = document.getElementById("clerkVoiceBottomMask");
    panelMode = mode === "docked" ? "docked" : "centered";
    if (frame) {
      frame.classList.toggle("docked", panelMode === "docked");
    }
    if (backdrop) {
      backdrop.classList.toggle("docked", panelMode === "docked");
    }
    if (overlay) {
      overlay.classList.toggle("docked", panelMode === "docked");
    }
    if (bottomMask) {
      bottomMask.classList.toggle("docked", panelMode === "docked");
    }
    if (toggleBtn) {
      toggleBtn.textContent = panelMode === "docked" ? "Center Panel" : "Dock Panel";
    }
    syncUnityOverlayState();
  }

  function setStatus(message, isError, allowInfo) {
    const status = document.getElementById("clerkVoiceStatus");
    if (!status) return;
    const safeMessage = coerceText(message);
    if (!isError && !allowInfo) {
      status.textContent = "";
      status.classList.remove("error");
      return;
    }
    status.textContent = safeMessage;
    status.classList.toggle("error", Boolean(isError));
  }

  function setHelpLink(url, visible) {
    const help = document.getElementById("clerkVoiceHelp");
    const link = document.getElementById("clerkVoiceHelpLink");
    if (!help || !link) return;
    if (!visible || !url) {
      help.hidden = true;
      link.removeAttribute("href");
      return;
    }
    link.href = url;
    help.hidden = false;
  }

  function setSessionDiagnostics(message, isError) {
    const cfg = getRuntimeVoiceConfig();
    const diagnostics = document.getElementById("clerkVoiceDiagnostics");
    if (!diagnostics) return;
    if (!shouldShowDiagnostics(cfg) || !message) {
      diagnostics.hidden = true;
      diagnostics.textContent = "";
      diagnostics.classList.remove("error");
      return;
    }
    diagnostics.textContent = message;
    diagnostics.hidden = false;
    diagnostics.classList.toggle("error", Boolean(isError));
  }

  
  // CLAIRE_SIMPLE_STOP_BUTTON
  
  function mountClaireStartButtonToBody() {
    try {
      const btn = document.getElementById("clerkVoiceStartBtn");
      if (!btn) return null;
      if (btn.parentElement !== document.body) {
        document.body.appendChild(btn);
      }
      btn.hidden = false;
      btn.style.display = "flex";
      btn.style.visibility = "visible";
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
      btn.style.zIndex = "15000";
      return btn;
    } catch (_e) {
      return null;
    }
  }

  function showStopListeningButton() {
    try { mountClaireStartButtonToBody(); } catch (_e) {}
    const btn = document.getElementById("clerkVoiceStartBtn");
    if (!btn) return;
    btn.textContent = START_BUTTON_CLOSE_LABEL || "Stop-Listening";
    btn.setAttribute("data-claire-state", "close-ready");
    btn.disabled = false;
    btn.removeAttribute("disabled");
    btn.hidden = false;
    btn.style.display = "flex";
    btn.style.visibility = "visible";
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
  }

  function showWaitingClaireButton() {
    try { mountClaireStartButtonToBody(); } catch (_e) {}
    const btn = document.getElementById("clerkVoiceStartBtn");
    if (!btn) return;
    btn.textContent = START_BUTTON_WAITING_LABEL || "Waiting on Claire";
    btn.setAttribute("data-claire-state", "waiting");
    btn.disabled = false;
    btn.removeAttribute("disabled");
    btn.hidden = false;
    btn.style.display = "flex";
    btn.style.visibility = "visible";
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
  }

  function setStartButtonVisible(visible) {
    const btn = document.getElementById("clerkVoiceStartBtn");
    if (!btn) return;
    btn.hidden = !visible;
  }

  function setWidgetFrameSize(width, height) {
    const frame = document.getElementById("clerkVoiceFrame");
    if (!frame) return;
    const safeW = Number.isFinite(width) ? Math.max(50, Math.min(900, Math.floor(width))) : 50;
    const safeH = Number.isFinite(height) ? Math.max(50, Math.min(760, Math.floor(height))) : 50;
    frame.style.width = `${safeW}px`;
    frame.style.height = `${safeH}px`;
  }

  function setCompactSquareFrameSize() {
    setWidgetFrameSize(COMPACT_SQUARE_FRAME_SIZE, COMPACT_SQUARE_FRAME_SIZE);
  }
  function setWidgetFrameVisible(visible) {
    const frame = document.getElementById("clerkVoiceFrame");
    const keepRendererVisibleAfterStartGateTap = Boolean(
      !hasConversationStarted &&
        unityStartGatePreflightAttempted &&
        !unityStartGatePendingRequiresRecovery
    );
    const shouldExposeRenderer = Boolean(
      (visible || keepRendererVisibleAfterStartGateTap) &&
        !hasConversationStarted
    );
    const shouldShowSignalStage = Boolean(hasConversationStarted || preConversationSignalVisible);
    if (frame) {
      frame.style.opacity = shouldExposeRenderer ? "1" : "0";
      frame.style.pointerEvents = shouldExposeRenderer ? "auto" : "none";
    }
    if (!shouldShowSignalStage || (!visible && !preConversationSignalVisible)) {
      setSignalStageVisible(false);
      return;
    }
    syncSignalStageForConversation();
  }

  function applyFrameTransparencyOverrides(frame) {
    if (!frame) return;
    try {
      const doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
      if (!doc) return;
      const styleId = "clerkVoiceTransparencyOverride";
      let style = doc.getElementById(styleId);
      if (!style) {
        style = doc.createElement("style");
        style.id = styleId;
        (doc.head || doc.documentElement).appendChild(style);
      }
      style.textContent = `
        html, body, #root {
          background: transparent !important;
        }
      `;
      const replaceLaunchHeading = function () {
        const spans = doc.querySelectorAll("span");
        spans.forEach(function (node) {
          const text = coerceText(node.textContent).trim();
          if (!/^speak with;?$/i.test(text)) return;
          node.textContent = "Meet with;";
        });
      };
      replaceLaunchHeading();
      window.setTimeout(replaceLaunchHeading, 120);
      window.setTimeout(replaceLaunchHeading, 420);
      window.setTimeout(replaceLaunchHeading, 900);
    } catch (_err) {}
  }


  function clearFrameLoadTimer() {
    if (!frameLoadTimer) return;
    window.clearTimeout(frameLoadTimer);
    frameLoadTimer = null;
  }

  function clearUnityStartGateLaunchTimers() {
    unityStartGateStallSequence += 1;
    if (unityStartGateResendTimer) {
      window.clearTimeout(unityStartGateResendTimer);
      unityStartGateResendTimer = null;
    }
    if (unityStartGateStallTimer) {
      window.clearTimeout(unityStartGateStallTimer);
      unityStartGateStallTimer = null;
    }
  }

  function markConversationStartedFromWidgetSignal() {
    trackExperimentTelemetryEvent("conversation-started", {
      start_gate_pending_before: unityStartGatePending,
      widget_ready: widgetReady,
    });
    clearUnityStartGateLaunchTimers();
    unityStartGateStallRetryCount = 0;
    unityStartGatePending = false;
    unityStartGatePendingRequiresRecovery = false;
    unityStartGatePreflightStatusMessage = "";
    hasConversationStarted = true;
    try { showStopListeningButton(); } catch (_e) {}
    noteUnityStartGateProgress("conversation-started");
    syncSignalStageForConversation();
    setWidgetFrameVisible(true);
    setStartButtonVisible(false);
    setLaunchEmblemVisible(false);
    setPanelMode("centered");
  }

  function scheduleUnityStartGateStallTimer(cfg) {
    if (unityStartGateStallTimer) {
      window.clearTimeout(unityStartGateStallTimer);
      unityStartGateStallTimer = null;
    }
    const timeoutMs = getUnityStartGateStallTimeoutMs(cfg);
    unityStartGateStallTimer = window.setTimeout(function () {
      unityStartGateStallTimer = null;
      const modalEl = document.getElementById("clerkVoiceModal");
      if (!modalEl || !modalEl.classList.contains("active")) return;
      if (hasConversationStarted) return;
      handleUnityStartGateLaunchStall(cfg);
    }, timeoutMs);
  }

  function probeRuntimeAuthEndpointStatus(cfgOrOptions) {
    if (typeof window === "undefined" || typeof window.fetch !== "function") {
      return Promise.resolve({ ok: false, status: 0 });
    }
    const endpoints = buildRuntimeAuthEndpointCandidates(cfgOrOptions);
    if (!endpoints.length) {
      return Promise.resolve({ ok: false, status: 0, endpoint: getRuntimeAuthEndpoint(cfgOrOptions) });
    }
    let firstAuthFailure = null;
    let firstNotFound = null;
    let lastResult = { ok: false, status: 0, endpoint: endpoints[0] };

    function probeEndpointAt(index) {
      const endpoint = endpoints[index];
      return window
        .fetch(endpoint, {
          method: "GET",
          credentials: "same-origin",
          headers: { Accept: "application/json" },
        })
        .then(function (response) {
          const status =
            response && Number.isFinite(Number(response.status))
              ? Number(response.status)
              : 0;
          const result = {
            ok: Boolean(response && response.ok),
            status: status,
            endpoint: endpoint,
          };
          if (result.ok) {
            if (typeof window !== "undefined") {
              window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT = endpoint;
            }
            return result;
          }
          if ((status === 401 || status === 403) && !firstAuthFailure) {
            firstAuthFailure = result;
          }
          if (status === 404 && !firstNotFound) {
            firstNotFound = result;
          }
          lastResult = result;
          if (index + 1 >= endpoints.length) {
            return firstAuthFailure || firstNotFound || lastResult;
          }
          return probeEndpointAt(index + 1);
        })
        .catch(function () {
          lastResult = { ok: false, status: 0, endpoint: endpoint };
          if (index + 1 >= endpoints.length) {
            return firstAuthFailure || firstNotFound || lastResult;
          }
          return probeEndpointAt(index + 1);
        });
    }

    return probeEndpointAt(0);
  }

  function showUnityStartGateLaunchFailure(cfg, frameSrc, message) {
    unityStartGatePending = false;
    unityStartGatePendingRequiresRecovery = false;
    unityStartGatePreflightStatusMessage = "";
    setStartButtonVisible(false);
    setLaunchEmblemVisible(false);
    setStatus(message, true, true);
    setHelpLink(frameSrc, true);
    setSessionDiagnostics(
      buildSessionDiagnostics(pendingLaunchSession, cfg, frameSrc, "session-start-failed"),
      true
    );
  }

  function handleUnityStartGateLaunchStall(cfg) {
    const modalEl = document.getElementById("clerkVoiceModal");
    if (!modalEl || !modalEl.classList.contains("active")) return;
    if (hasConversationStarted) return;
    const iframeDiagnostic = getWidgetIframeLaunchDiagnostic();
    if (iframeDiagnostic && iframeDiagnostic.kind === "microphone") {
      handleWidgetRuntimeErrorSignal(
        { type: "mic_error", message: iframeDiagnostic.detail },
        "iframe-microphone-error"
      );
      return;
    }
    if (iframeDiagnostic && iframeDiagnostic.kind === "connection") {
      handleWidgetRuntimeErrorSignal(
        { type: "socket_error", message: iframeDiagnostic.detail },
        "iframe-connection-error"
      );
      return;
    }
    const progressGraceMs = getUnityStartGateProgressGraceMs(cfg);
    const progressAgeMs =
      unityStartGateLastProgressAt > 0
        ? Date.now() - unityStartGateLastProgressAt
        : Number.POSITIVE_INFINITY;
    if (progressAgeMs <= progressGraceMs) {
      const progressSummary = getUnityStartGateProgressSummary();
      const holdMessage = progressSummary
        ? `Clerk is still connecting (${progressSummary}). Please hold a moment…`
        : "Clerk is still connecting. Please hold a moment…";
      setStatus(holdMessage, false, true);
      scheduleUnityStartGateStallTimer(cfg);
      return;
    }
    unityStartGateStallRetryCount += 1;
    unityStartGateStallSequence += 1;
    const stallSequence = unityStartGateStallSequence;
    const frameSrc = document.getElementById("clerkVoiceFrame")?.src || "";
    const waitingMessage = "Still waiting on Clerk. Tap Waiting on Clerk again if needed.";
    const retryLimit = getUnityStartGateStallRetryLimit(cfg);
    const authlessHumeMode =
      detectVoiceEngine(cfg) === "hume" && allowsHumeAuthlessConnect(cfg);
    const exceededRetryLimit = unityStartGateStallRetryCount > retryLimit;
    const shouldHardFail = exceededRetryLimit && !authlessHumeMode;

    const showRetryPrompt = function () {
      if (shouldHardFail) {
        const progressSummary = getUnityStartGateProgressSummary();
        const finalMessageBase =
          detectVoiceEngine(cfg) === "hume"
            ? "Clerk could not start a Hume voice session after multiple attempts. Restore runtime auth/connectivity, then relaunch."
            : "Clerk could not start the voice session after multiple attempts. Check realtime session connectivity, then relaunch.";
        const finalMessage = progressSummary
          ? `${finalMessageBase} Recent widget activity: ${progressSummary}.`
          : finalMessageBase;
        showUnityStartGateLaunchFailure(cfg, frameSrc, finalMessage);
        return;
      }
      const retryMessage =
        exceededRetryLimit && authlessHumeMode
          ? "Clerk is still connecting on this device. Tap Waiting on Clerk again in a moment."
          : waitingMessage;
      const retryBtn = document.getElementById("clerkVoiceStartBtn");
      if (retryBtn) retryBtn.textContent = START_BUTTON_WAITING_LABEL;
      unityStartGatePending = true;
      unityStartGatePendingRequiresRecovery = false;
      unityStartGatePreflightStatusMessage = retryMessage;
      setWidgetFrameVisible(true);
      setStartButtonVisible(true);
      setLaunchEmblemVisible(false);
      setStatus(retryMessage, false, true);
    };

    if (detectVoiceEngine(cfg) !== "hume" || normalizeAuthConfig(cfg)) {
      showRetryPrompt();
      return;
    }
    if (!shouldFetchServerRuntimeAuth()) {
      showRetryPrompt();
      return;
    }
    if (authlessHumeMode) {
      trackExperimentTelemetryEvent("runtime-auth-probe-skipped-authless", {
        reason: "allow_hume_authless_connect",
      }, { cfg: cfg });
      showRetryPrompt();
      return;
    }


    setStatus("Still waiting on Clerk. Checking runtime auth bridge…", false, true);
    probeRuntimeAuthEndpointStatus(cfg).then(function (probeResult) {
      if (stallSequence !== unityStartGateStallSequence) return;
      const activeModal = document.getElementById("clerkVoiceModal");
      if (!activeModal || !activeModal.classList.contains("active")) return;
      if (hasConversationStarted) return;
      const runtimeAuthEndpointLabel = getRuntimeAuthEndpointDisplayLabel(
        cfg,
        probeResult && probeResult.endpoint
      );
      if (probeResult.status === 404) {
        const shouldFailForMissingBridge =
          !authlessHumeMode ||
          unityStartGateStallRetryCount >= Math.max(1, Math.min(3, retryLimit));
        if (shouldFailForMissingBridge) {
          showUnityStartGateLaunchFailure(
            cfg,
            frameSrc,
            `Clerk runtime auth endpoint is missing on this site (${runtimeAuthEndpointLabel} returned 404). Voice cannot start until that bridge is restored.`
          );
          return;
        }
        showRetryPrompt();
        return;
      }
      if (probeResult.status === 401 || probeResult.status === 403) {
        if (detectVoiceEngine(cfg) === "hume" && shouldFetchServerRuntimeAuth()) {
          setStatus(
            "Runtime auth bridge rejected authorization. Refreshing secure runtime auth…",
            false,
            true
          );
          fetchRuntimeAuthFromServer({ force: true, cfg: cfg })
            .then(function (runtimeAuth) {
              if (stallSequence !== unityStartGateStallSequence) return;
              const activeModalAfterRefresh = document.getElementById("clerkVoiceModal");
              if (!activeModalAfterRefresh || !activeModalAfterRefresh.classList.contains("active")) return;
              if (hasConversationStarted) return;
              const refreshedCfg = getRuntimeVoiceConfig();
              if (runtimeAuth && normalizeAuthConfig(refreshedCfg)) {
                const configured = sendWidgetConfig(refreshedCfg, pendingLaunchSession);
                if (!configured) {
                  showUnityStartGateLaunchFailure(
                    refreshedCfg,
                    frameSrc,
                    getVoiceEngineMissingConfigMessage(refreshedCfg)
                  );
                  return;
                }
                noteUnityStartGateProgress("runtime-auth-refreshed");
                expandWidgetFromClient();
                const refreshRetrySchedule = getUnityStartGateRetrySchedule(
                  refreshedCfg,
                  "resend"
                );
                scheduleIframeStartConversationRetry(
                  refreshRetrySchedule.maxAttempts,
                  refreshRetrySchedule.delayMs
                );
                scheduleUnityStartGateStallTimer(refreshedCfg);
                setStatus("Runtime auth refreshed. Retrying Clerk voice session…", false, true);
                return;
              }
              showUnityStartGateLaunchFailure(
                refreshedCfg,
                frameSrc,
                `Clerk runtime auth endpoint rejected authorization (${runtimeAuthEndpointLabel} returned ${probeResult.status}). Voice cannot start until valid runtime auth is provided.`
              );
            })
            .catch(function () {
              if (stallSequence !== unityStartGateStallSequence) return;
              showUnityStartGateLaunchFailure(
                cfg,
                frameSrc,
                `Clerk runtime auth endpoint rejected authorization (${runtimeAuthEndpointLabel} returned ${probeResult.status}). Voice cannot start until valid runtime auth is provided.`
              );
            });
          return;
        }
        showUnityStartGateLaunchFailure(
          cfg,
          frameSrc,
          `Clerk runtime auth endpoint rejected authorization (${runtimeAuthEndpointLabel} returned ${probeResult.status}). Voice cannot start until valid runtime auth is provided.`
        );
        return;
      }
      showRetryPrompt();
    });
  }

  function openClerkVoiceModal(launchInput) {
    const baseCfg = getVoiceConfig();
    if (!isClerkVoiceAllowedOnCurrentPage(baseCfg)) return;
    ensureModal();
    setFloatingLauncherVisible(false);
    pageTransitionInProgress = false;
    resetSignalStage();
    clearTourGuideNavigationState("modal-open-reset");
    const modal = document.getElementById("clerkVoiceModal");
    const frame = document.getElementById("clerkVoiceFrame");
    if (!isClerkVoiceFeatureEnabled()) {
      if (modal) modal.classList.add("active");
      if (frame) frame.removeAttribute("src");
      setHelpLink("", false);
      setStartButtonVisible(false);
      setLaunchEmblemVisible(false);
      setSessionDiagnostics("", false);
      setStatus("Meet with Clerk is currently unavailable in this release.", false, true);
      return;
    }
    clearUnityStartGateLaunchTimers();
    resetUnityStartGateProgressLog();
    noteUnityStartGateProgress("launch-opened");
    unityStartGateStallRetryCount = 0;
    clearQuestionNotesStatusTimer();
    clearLeadCaptureStatusTimer();
    resetGuardrailState();
    currentVisitorName = "";
    resetLeadCaptureState("");
    visitorQuestionCount = 0;
    questionNotesActivated = false;
    visitorQuestionLog = [];
    lastVisitorQuestionFingerprint = "";
    founderModeActive = false;
    founderModeIdentity = "";
    mptsDriftEventCount = 0;
    lastMptsDriftFingerprint = "";
    resetLeadCaptureState("");
    const previousLaunchSignature = activeLaunchSignature;
    const hadExistingSession = Boolean(
      widgetReady || hasConversationStarted || (frame && coerceText(frame.getAttribute("src")))
    );
    pendingLaunchSession = normalizeLaunchPayload(parseLaunchInput(launchInput), baseCfg);
    const nextLaunchSignature = buildLaunchSessionSignature(pendingLaunchSession);
    if (hadExistingSession && previousLaunchSignature && previousLaunchSignature !== nextLaunchSignature) {
      postToWidgetFrame({ type: "cancel" });
      widgetReady = false;
      hasConversationStarted = false;
    }
    activeLaunchSignature = nextLaunchSignature;
    let cfg = resolveActiveCharacterConfig(baseCfg, pendingLaunchSession);
    startExperimentTelemetrySession("modal-open", cfg, pendingLaunchSession);
    trackExperimentTelemetryEvent(
      "modal-open",
      {
        launch_signature: nextLaunchSignature,
        had_existing_session: hadExistingSession,
      },
      { cfg: cfg }
    );
    const launchVisitorName = coerceText(
      pendingLaunchSession &&
        pendingLaunchSession.contextPayload &&
        pendingLaunchSession.contextPayload.visitor_name
    );
    if (launchVisitorName) {
      currentVisitorName = normalizeVisitorName(launchVisitorName);
    }
    resetLeadCaptureState(currentVisitorName);
    syncLeadCaptureStateToSession(cfg, "lead-capture-launch-initialized");
    const preflightReady = unityStartGatePreflightReady;
    const preflightAttempted = unityStartGatePreflightAttempted;
    const preflightFailed = unityStartGatePreflightFailed && preflightAttempted && !preflightReady;
    const preflightStatusMessage = coerceText(unityStartGatePreflightStatusMessage);
    unityStartGatePreflightReady = false;
    unityStartGatePreflightAttempted = false;
    unityStartGatePreflightFailed = false;
    unityStartGatePreflightStatusMessage = "";
    const requiresStartGate = shouldUseUnityStartGate(cfg);
    unityStartGatePending = (requiresStartGate && !preflightReady) || preflightFailed;
    unityStartGatePendingRequiresRecovery = preflightFailed;
    if (unityStartGatePending) {
      unityStartGatePreflightStatusMessage = preflightFailed
        ? preflightStatusMessage || "Microphone access is blocked. Tap Waiting on Clerk and allow access for this site."
        : "Tap Waiting on Clerk to begin speaking with Clerk.";
    }
    setWidgetFrameVisible(false);
    const policyDecision =
      pendingLaunchSession && typeof pendingLaunchSession.policyDecision === "object"
        ? pendingLaunchSession.policyDecision
        : null;
    const guardrailSettings = getGuardrailSettings(cfg);
    let guardrailInit = { allowed: true };
    const title = document.getElementById("clerkVoiceTitle");
    const startBtn = document.getElementById("clerkVoiceStartBtn");

    const voiceDescriptor = getExperimentalVoiceDescriptor(cfg);
    if (title) {
      title.textContent = voiceDescriptor
        ? `Meet with ${cfg.character_name} · ${voiceDescriptor}`
        : `Meet with ${cfg.character_name}`;
    }
    if (startBtn) startBtn.textContent = START_BUTTON_WAITING_LABEL;
    syncCharacterSelector(baseCfg, pendingLaunchSession.characterId);
    setPresence(cfg);
    setSignalPortraitSource(cfg);
    modal.classList.add("active");
    modal.dataset.humeAuthRetryAttempted = "";
    modal.dataset.voiceEngineFallbackAttempted = "";
    clearFrameLoadTimer();
    setHelpLink("", false);
    setStartButtonVisible(false);
    hasConversationStarted = false;
    setLaunchEmblemVisible(true);
    customerExitSweepCaptured = false;
    setCompactSquareFrameSize();
    widgetReady = false;
    setPanelMode("centered");
    setSessionDiagnostics(buildSessionDiagnostics(pendingLaunchSession, cfg, "", "prepared"), false);
    if (policyDecision && policyDecision.action === "deny") {
      trackExperimentTelemetryEvent(
        "launch-blocked",
        {
          reason: "context-policy-deny",
          rule_id: policyDecision.ruleId || "",
        },
        { cfg: cfg }
      );
      frame.removeAttribute("src");
      setStatus(policyDecision.message || "This Clerk launch context is currently unavailable.", false, true);
      setStartButtonVisible(false);
      setLaunchEmblemVisible(false);
      appendSessionDecision(pendingLaunchSession, "launch-blocked", {
        reason: "context-policy-deny",
        rule_id: policyDecision.ruleId || "",
      });
      clearGuardrailIdleTimer();
      return;
    }
    if (policyDecision && policyDecision.action === "ask") {
      appendSessionDecision(pendingLaunchSession, "launch-policy-ask", {
        rule_id: policyDecision.ruleId || "",
      });
      setStatus(policyDecision.message || "Clerk is preparing contextual awareness for this view.", false, true);
    }
    guardrailInit = initializeGuardrailSession(guardrailSettings, cfg);
    scheduleGuardrailIdleTimer(guardrailSettings, cfg);

    if (!guardrailInit.allowed) {
      frame.removeAttribute("src");
      setStatus(guardrailInit.message || buildGuardrailOffboardMessage(guardrailSettings, "guardrail-block"), false, true);
      setStartButtonVisible(false);
      setLaunchEmblemVisible(false);
      guardrailOffboarded = true;
      clearGuardrailIdleTimer();
      return;
    }
    initializeElectricalStoryGuardrailSession(cfg);

    if (!window.isSecureContext) {
      trackExperimentTelemetryEvent("launch-blocked", { reason: "insecure-context" }, { cfg: cfg });
      frame.removeAttribute("src");
      setLaunchEmblemVisible(false);
      setStatus(
        "Microphone requires a secure page. Open this site via https:// or localhost and try Meet with Clerk again.",
        true
      );
      return;
    }

    let engineValidation = validateVoiceEngineConfig(cfg);
    if (!engineValidation.ok) {
      if (detectVoiceEngine(cfg) === "hume" && modal.dataset.humeAuthRetryAttempted !== "1") {
        modal.dataset.humeAuthRetryAttempted = "1";
        frame.removeAttribute("src");
        setLaunchEmblemVisible(true);
        setStatus("Checking secure runtime auth for Clerk…", false, true);
        fetchRuntimeAuthFromServer({ force: true, cfg: cfg }).then(function (runtimeAuth) {
          modal.dataset.humeAuthRetryAttempted = "";
          if (runtimeAuth) {
            openClerkVoiceModal(launchInput);
            return;
          }
          const fallbackLaunchInput = parseLaunchInput(launchInput);
          if (!fallbackLaunchInput.contextPayload || typeof fallbackLaunchInput.contextPayload !== "object") {
            fallbackLaunchInput.contextPayload = {};
          }
          fallbackLaunchInput.contextPayload.voice_engine_preference = "openai";
          if (buildOpenAiFallbackConfig(cfg)) {
            setStatus(
              "Hume auth is unavailable right now. Launching Clerk with OpenAI voice fallback.",
              true,
              true
            );
            openClerkVoiceModal(fallbackLaunchInput);
            return;
          }
          setLaunchEmblemVisible(false);
          const runtimeAuthEndpointLabel = getRuntimeAuthEndpointDisplayLabel(cfg);
          setStatus(
            `Clerk runtime auth is unavailable on this device. Configure ${runtimeAuthEndpointLabel} or inject runtime auth before launching.`,
            true
          );
        });
        return;
      }
      if (detectVoiceEngine(cfg) === "hume" && modal.dataset.voiceEngineFallbackAttempted !== "1") {
        const fallbackCfg = buildOpenAiFallbackConfig(cfg);
        if (fallbackCfg) {
          cfg = fallbackCfg;
          modal.dataset.voiceEngineFallbackAttempted = "1";
          engineValidation = validateVoiceEngineConfig(cfg);
          if (engineValidation.ok) {
            setStatus(
              "Hume auth is unavailable right now. Launching Clerk with OpenAI voice fallback.",
              true,
              true
            );
          }
        }
      }
      if (!engineValidation.ok) {
        frame.removeAttribute("src");
        setLaunchEmblemVisible(false);
        setStatus(engineValidation.message || "Voice engine config is incomplete.", true);
        return;
      }
    }
    const url = composeEmbedUrl(cfg, pendingLaunchSession);
    if (!url) {
      frame.removeAttribute("src");
      setLaunchEmblemVisible(false);
      setStatus(
        "Voice session URL is not configured. Set embed_url in hume_character_config.js to activate Meet with Clerk.",
        true
      );
      return;
    }
    activateCrossPageRoamingFromLaunch(pendingLaunchSession, cfg);

    activeFrameOrigin = getEmbedOrigin(url);
    frame.src = url;
    trackExperimentTelemetryEvent(
      "iframe-src-set",
      {
        embed_url: url,
        embed_origin: activeFrameOrigin,
      },
      { cfg: cfg }
    );
    setStatus(
      voiceDescriptor
        ? `${cfg.character_name} (${voiceDescriptor}) is connecting to ${getVoiceEngineLabel(cfg)}. Preparing voice panel…`
        : `${cfg.character_name} is connecting to ${getVoiceEngineLabel(cfg)}. Preparing voice panel…`,
      false
    );
    setSessionDiagnostics(buildSessionDiagnostics(pendingLaunchSession, cfg, url, "connecting"), false);

    frameLoadTimer = window.setTimeout(function () {
      const modalEl = document.getElementById("clerkVoiceModal");
      if (!modalEl || !modalEl.classList.contains("active")) return;
      const timeoutStatus =
        detectVoiceEngine(cfg) === "hume"
          ? "Voice widget loaded but Hume session did not initialize. Check Hume auth/runtime token and renderer connectivity, then retry."
          : "Voice widget loaded but session did not initialize. Check realtime session endpoint and server API key, then retry.";
      trackExperimentTelemetryEvent(
        "launch-timeout",
        {
          timeout_ms: 12000,
          voice_engine: detectVoiceEngine(cfg),
        },
        { cfg: cfg }
      );
      setStatus(
        timeoutStatus,
        true
      );
      setHelpLink(url, true);
      setSessionDiagnostics(buildSessionDiagnostics(pendingLaunchSession, cfg, url, "timeout"), true);
    }, 12000);
  }

  function closeClerkVoiceModal(closeInput) {
    try { if (typeof window.stopKurandaClaireBubble === "function") window.stopKurandaClaireBubble(); } catch (_e) {}
    const closeOptions =
      closeInput &&
      typeof closeInput === "object" &&
      (Object.prototype.hasOwnProperty.call(closeInput, "preserveRoaming") ||
        Object.prototype.hasOwnProperty.call(closeInput, "preserveDailyMeter") ||
        Object.prototype.hasOwnProperty.call(closeInput, "reason"))
        ? closeInput
        : {};
    const preserveRoaming = Boolean(closeOptions.preserveRoaming);
    const preserveDailyMeter = Boolean(closeOptions.preserveDailyMeter);
    const closeReason = coerceText(closeOptions.reason);
    const closeReasonToken = closeReason.toLowerCase();
    const cfg = getVoiceConfig();
    const modal = document.getElementById("clerkVoiceModal");
    const frame = document.getElementById("clerkVoiceFrame");
    if (!modal) return;
    const launchSessionAtClose = pendingLaunchSession;
    const hadConversationStarted = hasConversationStarted;
    const redirectAfterCloseUrl = resolvePostConversationRedirectUrl(launchSessionAtClose);
    const shouldRedirectAfterClose = Boolean(
      redirectAfterCloseUrl &&
        hadConversationStarted &&
        !preserveRoaming &&
        !pageTransitionInProgress &&
        closeReasonToken !== "page-transition" &&
        closeReasonToken !== "relaunch"
    );
    if (preserveRoaming) {
      if (closeReasonToken === "page-transition" || pageTransitionInProgress) {
        markCrossPageRoamingForPageTransition(pendingLaunchSession);
      } else {
        activateCrossPageRoamingFromLaunch(pendingLaunchSession, cfg);
      }
    } else {
      clearCrossPageRoamingState(pendingLaunchSession, cfg);
    }
    clearFrameLoadTimer();
    clearUnityStartGateLaunchTimers();
    clearQuestionNotesStatusTimer();
    clearLeadCaptureStatusTimer();
    resetGuardrailState();
    resetSignalStage();
    clearTourGuideNavigationState("modal-closed");
    postToWidgetFrame({ type: "cancel" });
    modal.classList.remove("active");
    if (frame) frame.removeAttribute("src");
    activeFrameOrigin = "";
    widgetReady = false;
    hasConversationStarted = false;
    currentVisitorName = "";
    visitorQuestionCount = 0;
    questionNotesActivated = false;
    visitorQuestionLog = [];
    lastVisitorQuestionFingerprint = "";
    founderModeActive = false;
    founderModeIdentity = "";
    mptsDriftEventCount = 0;
    lastMptsDriftFingerprint = "";
    resetLeadCaptureState("");
    pendingLaunchSession = null;
    activeLaunchSignature = "";
    unityStartGatePending = false;
    unityStartGatePendingRequiresRecovery = false;
    unityStartGatePreflightReady = false;
    unityStartGatePreflightAttempted = false;
    unityStartGatePreflightFailed = false;
    unityStartGatePreflightStatusMessage = "";
    unityStartGateStallRetryCount = 0;
    resetUnityStartGateProgressLog();
    customerExitSweepCaptured = false;
    setHelpLink("", false);
    setSessionDiagnostics("", false);
    setStartButtonVisible(false);
    setLaunchEmblemVisible(false);
    setWidgetFrameVisible(true);
    setWidgetFrameSize(50, 50);
    setPanelMode("docked");
    const shouldPersistDailyMeter = Boolean(
      cfg &&
        cfg.guardrails_enabled &&
        cfg.guardrails_enable_daily_metering !== false
    );
    if (!preserveDailyMeter && !shouldPersistDailyMeter) {
      clearDailyMeter();
    }
    closeExperimentTelemetrySession(closeReasonToken || "modal-closed", cfg);
    pageTransitionInProgress = false;
    setFloatingLauncherVisible(true);
    try {
      window.dispatchEvent(new CustomEvent("clerkVoiceModalClosed"));
      if (closeReasonToken === "stop-listening-button") {
        try { showWaitingClaireButton(); } catch (_e2) {}
        try {
          window.dispatchEvent(new CustomEvent("claireStopListeningReset", {
            detail: { reason: closeReasonToken }
          }));
        } catch (_e3) {}
      }
    } catch (_) {}
    if (shouldRedirectAfterClose) {
      window.setTimeout(function () {
        try {
          window.location.assign(redirectAfterCloseUrl);
        } catch (_err) {
          window.location.href = redirectAfterCloseUrl;
        }
      }, 24);
    }
  }

  function bindLaunchButtons() {
    document.querySelectorAll("[data-clerk-voice]").forEach(function (button) {
      if (button.dataset.clerkVoiceBound === "1") return;
      button.dataset.clerkVoiceBound = "1";
      button.addEventListener("click", async function (event) {
        if (event && typeof event.preventDefault === "function") {
          event.preventDefault();
        }
        const pageSlug = getCurrentPageSlug();
        const explicitEntryPoint = coerceText(button.getAttribute("data-clerk-entry-point"));
        const triggerToken = normalizeLaunchToken(
          button.id ||
            button.getAttribute("name") ||
            button.getAttribute("aria-label") ||
            button.textContent,
          "launch-button"
        );
        const fallbackLaunch = {
          contextSource: coerceText(button.getAttribute("data-clerk-context-source")) || pageSlug,
          context: coerceText(button.getAttribute("data-clerk-context")) || "technical-follow-up",
          mode:
            coerceText(button.getAttribute("data-clerk-mode")) ||
            coerceText(button.getAttribute("data-clerk-context")) ||
            "technical-follow-up",
          sourcePage: coerceText(button.getAttribute("data-clerk-source-page")) || pageSlug,
          sourceMedia: coerceText(button.getAttribute("data-clerk-source-media")),
          entryPoint: explicitEntryPoint ? normalizeLaunchToken(explicitEntryPoint, triggerToken) : `${pageSlug}-${triggerToken}`,
          likelyUserIntent: coerceText(button.getAttribute("data-clerk-likely-intent")),
          responseStyleHint: coerceText(button.getAttribute("data-clerk-response-style-hint")),
          uiMode: "modal",
        };
        const sourceMediaSeconds = Number(button.getAttribute("data-clerk-source-media-seconds"));
        if (Number.isFinite(sourceMediaSeconds)) {
          fallbackLaunch.sourceMediaSeconds = Math.max(0, Math.floor(sourceMediaSeconds));
        }
        const cfg = getVoiceConfig();
        trackExperimentTelemetryEvent(
          "launch-button-click",
          {
            entry_point: fallbackLaunch.entryPoint,
            context_source: fallbackLaunch.contextSource,
            mode: fallbackLaunch.mode,
            source_page: fallbackLaunch.sourcePage,
          },
          { cfg: cfg }
        );
        await runUnityStartGatePreflight(cfg);
        const patternPrefetchPromise = prefetchActivePagePatternContext().catch(function (_err) {
          return null;
        });
        if (isLikelySummaryboardPage()) {
          await Promise.race([
            patternPrefetchPromise,
            new Promise(function (resolve) {
              window.setTimeout(resolve, PATTERN_CONTEXT_PREFETCH_LAUNCH_BUDGET_MS);
            }),
          ]);
        }
        const launchInput = parseLaunchInput(button.getAttribute("data-clerk-voice") || "");
        openClerkFromLaunchInput(launchInput, fallbackLaunch);
      });
    });
  }

  window.openClerkVoiceModal = openClerkVoiceModal;
  window.closeClerkVoiceModal = closeClerkVoiceModal;
  window.openClerkReinterpretation = openClerkReinterpretation;
  window.buildClerkReinterpretationLaunch = buildReinterpretationLaunch;
  window.buildClerkPageLaunchPayload = buildClerkPageLaunchPayload;
  window.openClerkWithPageContext = openClerkWithPageContext;
  window.launchClerkWithPageContext = launchClerkWithPageContext;
  window.readClerkRev2TelemetrySessions = function () {
    const cfg = getExperimentTelemetryConfig(getVoiceConfig());
    return readStoredExperimentSessions(cfg.storageKey);
  };
  window.clearClerkRev2TelemetrySessions = function () {
    const cfg = getExperimentTelemetryConfig(getVoiceConfig());
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.removeItem(cfg.storageKey);
      } catch (_err) {}
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    ensureModal();
    ensureFloatingLauncher();
    bindLaunchButtons();
    bindCrossPageRoamingNavigation();
    prefetchActivePagePatternContext().catch(function (_err) {});
    maybeResumeCrossPageRoamingOnLoad();
  });
})();
