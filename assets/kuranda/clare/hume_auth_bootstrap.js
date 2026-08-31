// Unity Energy Clerk voice auth bootstrap
// This file intentionally keeps repository sources key-free while supporting
// persistent runtime auth hydration from local storage and optional server bootstrap.
(function () {
  if (typeof window === "undefined") return;

  var runtimeAuthStorageKeys = [
    "MAXWELLIAN_OPENAI_RUNTIME_AUTH",
    "MAXWELLIAN_HUME_RUNTIME_AUTH",
  ];

  function coerceText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function normalizeRuntimeAuthType(value) {
    var normalized = coerceText(value).toLowerCase();
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

  function readTrimmedAuthString(source, keys) {
    if (!source || typeof source !== "object" || !Array.isArray(keys)) return "";
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      if (!key) continue;
      var value = source[key];
      if (typeof value !== "string") continue;
      var trimmed = value.trim();
      if (trimmed) return trimmed;
    }
    return "";
  }

  function normalizeRuntimeAuthCandidate(candidate) {
    if (!candidate) return null;
    if (typeof candidate === "string") {
      var tokenCandidate = candidate.trim();
      return tokenCandidate ? { type: "accessToken", value: tokenCandidate } : null;
    }
    if (typeof candidate !== "object") return null;

    var explicitType = normalizeRuntimeAuthType(candidate.type);
    var explicitValue = readTrimmedAuthString(candidate, ["value"]);
    var accessToken = readTrimmedAuthString(candidate, [
      "accessToken",
      "access_token",
      "access-token",
      "token",
    ]);
    var apiKey = readTrimmedAuthString(candidate, [
      "apiKey",
      "apikey",
      "api_key",
      "api-key",
      "key",
    ]);

    var type = explicitType;
    var value = explicitValue;
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
    if (!window.localStorage) return null;
    try {
      for (var i = 0; i < runtimeAuthStorageKeys.length; i += 1) {
        var storageKey = runtimeAuthStorageKeys[i];
        var raw = window.localStorage.getItem(storageKey);
        if (!raw) continue;
        var parsed = null;
        try {
          parsed = JSON.parse(raw);
        } catch (_parseErr) {
          parsed = raw;
        }
        var normalized = normalizeRuntimeAuthCandidate(parsed);
        if (normalized) return normalized;
      }
    } catch (_err) {
      return null;
    }
    return null;
  }

  function writeRuntimeAuthToStorage(auth) {
    if (!window.localStorage) return false;
    var normalized = normalizeRuntimeAuthCandidate(auth);
    if (!normalized) return false;
    try {
      for (var i = 0; i < runtimeAuthStorageKeys.length; i += 1) {
        window.localStorage.setItem(runtimeAuthStorageKeys[i], JSON.stringify(normalized));
      }
      return true;
    } catch (_err) {
      return false;
    }
  }

  function clearRuntimeAuthStorage() {
    if (!window.localStorage) return;
    try {
      for (var i = 0; i < runtimeAuthStorageKeys.length; i += 1) {
        window.localStorage.removeItem(runtimeAuthStorageKeys[i]);
      }
    } catch (_err) {}
  }

  function readRuntimeAuthFromWindow() {
    var objectCandidate =
      window.MAXWELLIAN_OPENAI_RUNTIME_AUTH && typeof window.MAXWELLIAN_OPENAI_RUNTIME_AUTH === "object"
        ? window.MAXWELLIAN_OPENAI_RUNTIME_AUTH
        : window.MAXWELLIAN_OPENAI_AUTH && typeof window.MAXWELLIAN_OPENAI_AUTH === "object"
          ? window.MAXWELLIAN_OPENAI_AUTH
          : window.MAXWELLIAN_HUME_RUNTIME_AUTH && typeof window.MAXWELLIAN_HUME_RUNTIME_AUTH === "object"
            ? window.MAXWELLIAN_HUME_RUNTIME_AUTH
            : window.MAXWELLIAN_HUME_AUTH && typeof window.MAXWELLIAN_HUME_AUTH === "object"
              ? window.MAXWELLIAN_HUME_AUTH
              : null;
    var objectAuth = normalizeRuntimeAuthCandidate(objectCandidate);
    if (objectAuth) return objectAuth;

    var accessToken =
      typeof window.MAXWELLIAN_OPENAI_ACCESS_TOKEN === "string"
        ? window.MAXWELLIAN_OPENAI_ACCESS_TOKEN.trim()
        : typeof window.MAXWELLIAN_HUME_ACCESS_TOKEN === "string"
          ? window.MAXWELLIAN_HUME_ACCESS_TOKEN.trim()
          : "";
    if (accessToken) return { type: "accessToken", value: accessToken };

    var apiKey =
      typeof window.MAXWELLIAN_OPENAI_API_KEY === "string"
        ? window.MAXWELLIAN_OPENAI_API_KEY.trim()
        : typeof window.MAXWELLIAN_HUME_API_KEY === "string"
          ? window.MAXWELLIAN_HUME_API_KEY.trim()
          : "";
    if (apiKey) return { type: "apiKey", value: apiKey };
    return null;
  }

  function applyRuntimeAuthToWindow(auth) {
    var normalized = normalizeRuntimeAuthCandidate(auth);
    var shared = normalized
      ? { type: normalized.type, value: normalized.value }
      : { type: "", value: "" };
    window.MAXWELLIAN_OPENAI_RUNTIME_AUTH = shared;
    window.MAXWELLIAN_OPENAI_AUTH = shared;
    window.MAXWELLIAN_HUME_RUNTIME_AUTH = shared;
    window.MAXWELLIAN_HUME_AUTH = shared;
    if (!normalized) return null;
    if (normalized.type === "accessToken") {
      window.MAXWELLIAN_OPENAI_ACCESS_TOKEN = normalized.value;
      window.MAXWELLIAN_HUME_ACCESS_TOKEN = normalized.value;
    } else if (normalized.type === "apiKey") {
      window.MAXWELLIAN_OPENAI_API_KEY = normalized.value;
      window.MAXWELLIAN_HUME_API_KEY = normalized.value;
    }
    return normalized;
  }

  function setRuntimeAuth(typeOrObject, value, options) {
    var candidate = null;
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
    var shouldPersist = !(options && typeof options === "object" && options.persist === false);
    if (shouldPersist) {
      writeRuntimeAuthToStorage(candidate);
    }
    return true;
  }

  function clearRuntimeAuth() {
    clearRuntimeAuthStorage();
    applyRuntimeAuthToWindow(null);
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
  }

  function exposeRuntimeAuthHelpers() {
    window.setMaxwellianOpenAIAuth = setRuntimeAuth;
    window.setMaxwellianHumeAuth = setRuntimeAuth;
    window.clearMaxwellianOpenAIAuth = clearRuntimeAuth;
    window.clearMaxwellianHumeAuth = clearRuntimeAuth;
  }

  function readServerAuthPayload(payload) {
    if (!payload || typeof payload !== "object") return null;
    return normalizeRuntimeAuthCandidate(
      payload.auth || payload.runtime_auth || payload.runtimeAuth || payload
    );
  }
  function shouldFetchServerRuntimeAuth() {
    if (window.MAXWELLIAN_FORCE_RUNTIME_AUTH_BOOTSTRAP === true) return true;
    if (window.MAXWELLIAN_DISABLE_RUNTIME_AUTH_BOOTSTRAP === true) return false;
    var locationRef = window.location || {};
    var protocol = coerceText(locationRef.protocol).toLowerCase();
    if (protocol === "file:") return false;
    return Boolean(coerceText(locationRef.hostname));
  }
  function resolveRuntimeAuthEndpointCandidate(endpointCandidate) {
    var normalizedCandidate = coerceText(endpointCandidate);
    if (!normalizedCandidate) return "";
    try {
      var baseHref = window.location && window.location.href ? window.location.href : "";
      return new URL(normalizedCandidate, baseHref || undefined).toString();
    } catch (_err) {
      return normalizedCandidate;
    }
  }

  function appendRuntimeAuthEndpointCandidate(candidates, endpointCandidate) {
    if (!Array.isArray(candidates)) return;
    var resolved = resolveRuntimeAuthEndpointCandidate(endpointCandidate);
    if (!resolved) return;
    if (candidates.indexOf(resolved) !== -1) return;
    candidates.push(resolved);
  }

  function getRuntimeAuthEndpointPathPrefixes() {
    var locationRef = window.location || {};
    var pathname = coerceText(locationRef.pathname);
    if (!pathname) return [];
    var prefixes = [];
    var lowerPathname = pathname.toLowerCase();
    var unitySegment = "/unityenergy/";
    var unityIndex = lowerPathname.indexOf(unitySegment);
    if (unityIndex > 0) {
      var unityPrefix = pathname.slice(0, unityIndex).replace(/\/+$/, "");
      if (unityPrefix && unityPrefix !== "/" && prefixes.indexOf(unityPrefix) === -1) {
        prefixes.push(unityPrefix);
      }
    }
    var segments = pathname.split("/").filter(Boolean);
    if (segments.length > 1) {
      var firstSegmentPrefix = "/" + segments[0];
      if (
        firstSegmentPrefix &&
        firstSegmentPrefix !== "/" &&
        firstSegmentPrefix.toLowerCase() !== "/unityenergy" &&
        prefixes.indexOf(firstSegmentPrefix) === -1
      ) {
        prefixes.push(firstSegmentPrefix);
      }
    }
    // FILTER_CP_PREFIXES: avoid /CognitionPartner/api 404s on local static host
    prefixes = (prefixes || []).filter(function (p) {
      var s = String(p || '');
      return s.indexOf('/CognitionPartner') === -1 && s.indexOf('/UnityEnergy') === -1;
    });
    return prefixes;
  }

  function buildRuntimeAuthEndpointCandidates() {
    var endpointCandidate = coerceText(
      window.MAXWELLIAN_HUME_RUNTIME_AUTH_ENDPOINT ||
      window.MAXWELLIAN_RUNTIME_AUTH_ENDPOINT
    );
    var candidates = [];
    appendRuntimeAuthEndpointCandidate(candidates, endpointCandidate);
    appendRuntimeAuthEndpointCandidate(
      candidates,
      coerceText(window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT)
    );
    // CP GitHub Pages has no local /api/hume/runtime-auth. Prefer Unity public auth (CORS *).
    appendRuntimeAuthEndpointCandidate(candidates, "https://unityenergy.com/api/hume/runtime-auth");
    appendRuntimeAuthEndpointCandidate(candidates, "https://unityenergy.com/api/hume/runtime-auth.json");
    // Local/dev fallbacks (may 404 on static CP host — try after Unity).
    appendRuntimeAuthEndpointCandidate(candidates, "/api/hume/runtime-auth");
    appendRuntimeAuthEndpointCandidate(candidates, "/api/hume/runtime-auth.json");
    appendRuntimeAuthEndpointCandidate(candidates, "../api/hume/runtime-auth");
    appendRuntimeAuthEndpointCandidate(candidates, "../api/hume/runtime-auth.json");
    var pathPrefixes = getRuntimeAuthEndpointPathPrefixes();
    pathPrefixes.forEach(function (prefix) {
      appendRuntimeAuthEndpointCandidate(candidates, prefix + "/api/hume/runtime-auth");
      appendRuntimeAuthEndpointCandidate(candidates, prefix + "/api/hume/runtime-auth.json");
    });
    return candidates;
  }

  function resolveRuntimeAuthEndpoint() {
    var candidates = buildRuntimeAuthEndpointCandidates();
    return candidates[0] || "/api/hume/runtime-auth";
  }

  function fetchServerRuntimeAuth() {
    if (typeof window.fetch !== "function") return;
    if (!shouldFetchServerRuntimeAuth()) return;
    var endpoints = buildRuntimeAuthEndpointCandidates();
    if (!endpoints.length) return;

    function fetchEndpointAt(index) {
      if (index >= endpoints.length) return Promise.resolve(null);
      var endpoint = endpoints[index];
      return window
        .fetch(endpoint, {
          method: "GET",
          credentials: "omit",
          mode: "cors",
          headers: { Accept: "application/json" },
        })
        .then(function (response) {
          if (!response || !response.ok) return null;
          return response.json().catch(function () {
            return null;
          });
        })
        .then(function (payload) {
          var candidate = readServerAuthPayload(payload);
          if (!candidate) return null;
          var active = readRuntimeAuthFromWindow();
          if (
            active &&
            active.type === candidate.type &&
            active.value === candidate.value
          ) {
            window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT = endpoint;
            return candidate;
          }
          applyRuntimeAuthToWindow(candidate);
          writeRuntimeAuthToStorage(candidate);
          window.MAXWELLIAN_ACTIVE_RUNTIME_AUTH_ENDPOINT = endpoint;
          return candidate;
        })
        .catch(function () {
          return null;
        })
        .then(function (candidate) {
          if (candidate) return candidate;
          return fetchEndpointAt(index + 1);
        });
    }

    fetchEndpointAt(0).catch(function () {});
  }

  exposeRuntimeAuthHelpers();
  var initialRuntimeAuth = readRuntimeAuthFromWindow() || readRuntimeAuthFromStorage();
  if (initialRuntimeAuth) {
    applyRuntimeAuthToWindow(initialRuntimeAuth);
    writeRuntimeAuthToStorage(initialRuntimeAuth);
    return;
  }
  applyRuntimeAuthToWindow(null);
  fetchServerRuntimeAuth();
})();
