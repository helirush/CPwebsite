# GitHub Agent Sync Handoff — iPad/phone bottom dock pin
Prepared: 2026-08-12
Prepared by: Clerk/Oz (local sync only; **no commit / no push** from this agent)

## Intent
Follow-up after `9e2a6c9` (r2 art + chrome already on `origin/main`).
Fix iPad/phone layout where bottom media + logo cards crept up into the hero art and crushed Why It Matters / Understanding.

Do **not** promote to `/Users/mdhowell/uewebsite` unless explicitly requested.

## Source → target
- Source: `/Users/mdhowell/eestream/eWebmaster/CognitionPartner/cpwebsite/`
- Target: `/Users/mdhowell/cpwebsite/` (`https://github.com/helirush/CPwebsite.git`, branch `main`)
- Byte parity verified for staged files

## Staged now (ready to commit)
- `styles.css` — tablet/phone dock pin + in-bar flex control row
- `index.html`, `page2.html`, `page3.html`, `page4.html`, `page5.html` — cache bust `styles.css?v=20260812-ipad-dock-pin`

## Already on origin (do not re-add unless changed)
- `assets/CognitionPartner_p{1-5}r2.png`
- Prior chrome from commit `9e2a6c9`

## What the CSS fix does (≤1180px / ≤760px)
1. **Pins bottom dock** to viewport bottom using `env(safe-area-inset-bottom)` — removes the desktop `+150px` lift on tablet/phone.
2. **Stops height ballooning** — media bar uses fixed `clamp()` height (~72–92px), not 20–37% of page.
3. **Logo strip** sits under media on the same dock pad (pages 2–5); page 1 media docks without the solid logo strip.
4. **In-bar flex row** for speaker → Why It Matters → Play/Pause/Restart → Understanding → Prev/Next so absolute px offsets stop colliding on iPad.
5. **Understanding** flexes within the bar with **max-height ~64px** (no giant expansion).
6. Phone further tightens labels (hides Why body + audio labels) to keep one clean row.

## Suggested commit message
```
CP: pin bottom dock on iPad/phone; uncrush media controls

- Lock media + logo strips to safe-area bottom (no +150px lift)
- Cap media bar height; flex in-bar control row
- Keep Understanding sized; Why It Matters beside speaker
- Cache bust styles.css?v=20260812-ipad-dock-pin

Co-Authored-By: Oz <oz-agent@warp.dev>
```

## Agent actions
1. `cd /Users/mdhowell/cpwebsite`
2. `git status` / `git diff --cached --stat`
3. Commit staged files only
4. `git push origin main` (no `--force`)
5. Optional: leave `GITHUB_AGENT_SYNC_HANDOFF.md` untracked or add in a docs commit

## Validation
- [ ] iPad Safari/Chrome hard-refresh page 2: bottom cards on bottom, not mid-art
- [ ] Why It Matters stays next to speaker (no overlap on Play)
- [ ] Understanding readable, not oversized
- [ ] Pages 1–5 desktop still look as before (this pass is primarily ≤1180px)
- [ ] Page6–9 untouched

Co-Authored-By: Oz <oz-agent@warp.dev>
