# Host Environment Continuity — Architectural Principle
**Status:** ACTIVE seed 2026-08-31 (Curl Diva-aware pass)  
**Origin:** Mike Howell / Cove Faraday additive instruction after Operating Canon  
**Operating Canon:** Unchanged — this is session/environment awareness, not identity doctrine.

## Principle
A Cognition Host should understand the human's **immediate environment**:
- page / screen context
- narration or media just experienced
- selected experience
- recent interaction state

so the human does not continually explain what they are looking at or what just happened.

## Curl implementation (this pass)
- Module: `assets/cognition/host_environment_continuity.js`
- Captures Diva narration selected/playing/paused/completed + page identity + script path
- Injects into Curl `session_context` at launch (RANK7+ environment block)
- Hard rules: Diva ≠ visitor speech; no interrupt/answer/trigger/loop; silence after Diva until visitor engages; optional brief acknowledge then add a layer; resolve "she/that" from session state
- SELECT deferred while Diva is playing (Curl listens)

## Future reuse (NOT implemented here)
### Claire
Same environment continuity for Kuranda visit context.

### Clerk / Unity Energy
Desired behavior: electrician or engineer viewing an electrical-field visualization or measurement can ask naturally:
- "Clerk, what am I looking at?"
- "What is this field telling me?"
- "Why did that change?"
- "What should I pay attention to here?"

Clerk should already know the relevant screen, field, visualization, transformer, dataset, or selected context and reason from that environment rather than forcing the human to reconstruct it verbally.

### Visual host states (later)
Listening / reasoning / speaking may eventually have distinguishable orb behavior.  
Visual/audio state must **not** create conversational triggers or loops by itself.
