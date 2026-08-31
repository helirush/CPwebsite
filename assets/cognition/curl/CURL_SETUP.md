# Curl Maxwell — Setup Checklist

## Done
- [x] Runtime package copied from Claire pattern → `assets/cognition/curl/`
- [x] Identity renamed to Curl Maxwell / `curl-maxwell`
- [x] Claire Hume voice/config UUIDs blanked (await new IDs)
- [x] Knowledge scaffold created
- [x] **2026-08-19:** Initial Cognition Host knowledge seed loaded from Cove/operator
  - `knowledge/SpeakWithCurlOnBoard.md`
  - `knowledge/Curl_Internal_Identity_Narrative.md`
  - `knowledge/CURL_IDENTITY_PACK.md`
  - `knowledge/CURL_DEMO_KNOWLEDGE_PACK.md`
- [x] eSpeak `curlmaxwell` host modules + registry entry
- [x] Footer orb host UI standardized (UNDERSTAND WITH / CURL.)
- [x] Voice scripts intentionally unloaded on pages until IDs + safe re-enable

## Waiting on operator
- [x] Hume voice_id received 2026-08-19: `6b530c02-5a80-4e60-bb68-f2c171c5029f`
- [x] Hume `voice_id` for Curl: `6b530c02-5a80-4e60-bb68-f2c171c5029f`
- [x] Hume `config_id` for Curl (shared Claire/Clerk): `242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf`
- [ ] First live conversation pass after IDs (listen, then expand knowledge)

## When IDs arrive
1. Put them in `curl_hume_config.json` (`hume_voice_id`, `hume_config_id`)
2. Mirror into `hume_character_config.js` / `curl_character_config.js`
3. Mirror into `eSpeak/curlmaxwell/voice.module.js`
4. Re-enable voice scripts carefully on page 1 only first (blank-page guard on)
5. Hard-refresh rev2 and tap CURL host
6. Listen to real conversations; grow next knowledge layer from gaps

## Knowledge authority order
1. `SpeakWithCurlOnBoard.md` — behavior + speaking contract
2. `Curl_Internal_Identity_Narrative.md` — absorb identity/history
3. `CURL_DEMO_KNOWLEDGE_PACK.md` — journey/philosophy/examples
4. `CURL_IDENTITY_PACK.md` — short card


## LIVE ENABLE 20260819-curl-live-1
- Pages 1–5 now load: hume_auth_bootstrap + curl_character_config + curl_voice_widget + curl_host_controller
- embed_url fixed to `./assets/cognition/curl/hume_renderer/`
- Visible-guard allows modal only when `body.curl-host-active`
- Halo contract: selected glow on arm; radiate rings only while speaking
- IDs: voice `6b530c02-5a80-4e60-bb68-f2c171c5029f` / config `242d8c4f-bb9c-49e2-9e3e-2a4bc59061cf`


## STAGE FIX 20260819-curl-stage-2
- Character registry now includes `curl-maxwell` (was only curl-charcot) — launch ID mismatch fixed
- Host controller rewritten for Claire-like staging:
  - idle breath dark↔bright
  - selected brilliant lock + SELECT
  - SELECT triggers mic permission + connecting state
  - speaking rings only on audio-start
- Cache: `?v=20260819-curl-stage-2`


## CLAIRE PARITY AUTH FIX 20260819-curl-claire-parity-1
Why local failed: python http.server has no `/api/hume/runtime-auth` (404). Claire/Clerk demos that work either run where that API exists or already have runtime auth hydrated.
Curl now:
1. Preloads Unity auth in page head (absolute URL)
2. Bootstrap prefers Unity auth first
3. Voice widget auth candidates prefer Unity first (SELECT path)
4. Host controller awaits Unity auth before launch
Unity endpoint verified live earlier.

## BOOT + JOURNEY PAGES 20260831-curl-boot-journey-1
- Added `knowledge/CURL_BOOT_SEQUENCE.md` (mandatory pre-speech boot)
- Added `knowledge/CURL_JOURNEY_PAGES_1_13.md` (all 13 Diva page scripts Curl must know)
- Host controller now injects boot + journey + onboard + identity + demo pack into session_context before launch
- Character configs point content awareness at CP journey packs (VIBNAVA leftovers removed from allowed list)
- Cache stamp: `20260831-curl-boot-journey-1`

## OPERATING CANON 20260831-curl-operating-canon-1
- Added knowledge/CURL_OPERATING_CANON.md (Cove/Mike directive)
- Boot sequence rewritten with semantic authority hierarchy
- Host controller injects ranked packs including Operating Canon
- Character configs de-Claire/de-clinical/de-Unity-identity; CP page profiles
- QA status: knowledge/CURL_OPERATING_CANON_QA_STATUS.md
- Do not promote until live conversational QA with auth path


## DIVA-AWARE CONTINUITY 20260831-curl-diva-continuity-1
- Added `assets/cognition/host_environment_continuity.js` (reusable Host principle)
- Principle doc: `assets/cognition/HOST_ENVIRONMENT_CONTINUITY_PRINCIPLE.md`
- Curl launch injects environment block; SELECT deferred while Diva playing
- Operating Canon untouched
