# GitHub Agent Handoff — Cognition Partner REV2 → production
Prepared: 2026-08-30T22:45:19Z
Prepared by: Clerk (orchestrator)
Status: Local staging synced; ready for commit/push verification

## Scope
- **CP only** (Unity/uewebsite deferred)
- Source: `/Users/mdhowell/eestream/eWebmaster/CognitionPartner/cpwebsite-rev2`
- Staging/publish: `/Users/mdhowell/cpwebsite` → `https://github.com/helirush/CPwebsite.git` branch `main`
- Rollback freeze: `/Users/mdhowell/eestream/eWebmaster/CognitionPartner/CognitionPartner_Original_Site`

## Included
- Full journey pages index + page2–page13 + about
- Curl host stack (`assets/cognition/curl/**`)
- Diva/Shimmer narration scripts + `assets/audio/**` MP3s (pages 1–13)
- Kuranda/Claire two-step entry + trial (`experience-claire-entry`, `experience-claire`, kuranda assets)
- Unity/Clerk direct experience (`experience-clerk`, unity/clerk assets)
- Header/footer chrome, styles, icons, CNAME

## Excluded (intentional)
- `api/` and Hume `runtime-auth` (contains local live auth value — do not publish)
- `*.psd`, bak shells, `README_REV2_DEV.md`
- UE website lane (not in this push)

## Operator note
- Unity homepage CTA → Cognition Partner remains the only UE→CP entry to verify after CP is live.
- Claire path: page12 → Kuranda P1 entry → Claire trial
- Clerk path: page13 → experience-clerk direct (no Unity interim)

## Git actions
1. `cd /Users/mdhowell/cpwebsite`
2. Review `git status` / `git diff --stat`
3. Commit full REV2 promote (no force)
4. `git push origin main`
5. Smoke: cognitionpartner.ai hard-refresh journey + Claire/Clerk/Curl

Co-Authored-By: Warp <agent@warp.dev>
