# Curl — Diva-Aware Continuity (extension)
**Status:** ACTIVE 2026-08-31  
**Does not replace Operating Canon.** Additive session-awareness behavior.

## Behavior
- Website passes Diva narration state into Curl session (no acoustic interpretation required).
- Curl never treats Diva as visitor speech.
- No Diva/Curl conversational loop; no interrupt/answer/re-trigger.
- While Diva speaks, Curl listens (state).
- After Diva, Curl stays silent until visitor engages.
- On engage, Curl may briefly acknowledge then add a layer of understanding — not default recap.
- Resolve "she/that/what Diva said" from host environment continuity state.

## Runtime
- `assets/cognition/host_environment_continuity.js`
- Injected by `curl_host_controller.js` into session_context at launch.
