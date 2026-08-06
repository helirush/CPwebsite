# GitHub Agent Sync Handoff — Claire / Kuranda CP
Prepared: 2026-08-05T23:50:34
Prepared by: Clerk/Oz (local sync only; no force-push)

## Intent
Synchronize validated **eWebmaster CognitionPartner Claire trial** work to GitHub.
Do **not** promote to `/Users/mdhowell/uewebsite` unless Mr. Howell explicitly requests production promotion.

## Source of truth (local)
- Website trial page: `eestream/eWebmaster/CognitionPartner/cpwebsite/page7.html`
- Styles: `eestream/eWebmaster/CognitionPartner/cpwebsite/styles.css`
- Claire package: `eestream/eWebmaster/CognitionPartner/cpwebsite/assets/kuranda/clare/`
- Page art: `eestream/eWebmaster/CognitionPartner/cpwebsite/assets/kuranda_p2.png` (updated; cache-bust on page7)
- Kuranda mirror package: `/Users/mdhowell/Kuranda/Claire/`
- Kuranda library canon: `/Users/mdhowell/Kuranda/Library/SpeakWithClaireOnBoard.md` + identity narrative

## Claire behavior locked for this sync
1. **Not page-aware** — must never say page 7 / page numbers / website layout.
2. **First turn monologue** — recite Dr. Claire Charcot bio/history (Jean-Martin Charcot, vibratory chairs, Delton Hyatt), end with: "Now, how might I answer your questions?"
3. Control: Waiting on Claire / Stop-Listening under orb; donor corner chrome hidden; iframe remains alive for voice.
4. Identity pack: `knowledge/CLAIRE_IDENTITY_PACK.md` (+ brief alias).

## Repo notes / branch caution
- `/Users/mdhowell/eestream` working tree currently on branch `backup/eestream-snapshot-20260728-235107` (NOT `main`).
- CP Claire site files are present on disk; `page7.html` may be untracked relative to older main history.
- `/Users/mdhowell/Kuranda` is on `main` and should receive Claire package + library canon updates.

## Suggested GitHub agent commit scopes
### A) Kuranda repo (`/Users/mdhowell/Kuranda`) on `main`
Include at least:
- `Claire/claire_character_config.js`
- `Claire/hume_character_config.js`
- `Claire/claire_voice_widget.js`
- `Claire/hume_auth_bootstrap.js` (if changed)
- `Claire/clare_hume_config.json` (if changed)
- `Claire/knowledge/CLAIRE_IDENTITY_PACK.md`
- `Claire/knowledge/CLAIRE_DEMO_RUNTIME_BRIEF.md`
- `Claire/knowledge/00_SpeakWithClaireOnBoard.md`
- `Claire/knowledge/00b_Claire_Internal_Identity_Narrative.md`
- `Library/SpeakWithClaireOnBoard.md`
- `Library/Claire_Internal_Identity_Narrative.md` (+ `.txt` if present)

Suggested message:
`Claire: lock no-page-awareness, bio monologue open, identity pack sync`

### B) eestream repo (`/Users/mdhowell/eestream`)
Confirm target branch with operator before commit:
- Prefer a webmaster/Claire working branch or explicit backup branch — avoid accidental overwrite of unrelated Unity `main` history.
Include at least:
- `eWebmaster/CognitionPartner/cpwebsite/page7.html`
- `eWebmaster/CognitionPartner/cpwebsite/styles.css`
- `eWebmaster/CognitionPartner/cpwebsite/assets/kuranda_p2.png`
- `eWebmaster/CognitionPartner/cpwebsite/assets/kuranda/clare/**` (Claire package)

Suggested message:
`CP Claire trial: monologue open, strip page context, refresh kuranda_p2 art`

## Validation checklist before push
- [ ] `node --check` Claire widget + character configs pass
- [ ] page7 hard-refresh loads `kuranda_p2.png?v=...` new art
- [ ] Waiting → mic → first turn is bio monologue (not page-7 greeting)
- [ ] Stop-Listening returns to Waiting and can relaunch without Back
- [ ] No uewebsite files modified

## Explicit non-goals
- No `/Users/mdhowell/uewebsite` promotion in this handoff
- No broad unrelated eestream Unity churn in the Claire commit if avoidable

Co-Authored-By: Oz <oz-agent@warp.dev>
