# Curl Operating Canon — Implementation + QA Status
**Date:** 2026-08-31
**For:** Mike Howell / Cove Faraday
**Agent:** Clerk

## What changed
1. Created `CURL_OPERATING_CANON.md` — durable cognitive constitution.
2. Rewrote `CURL_BOOT_SEQUENCE.md` with Cove semantic authority hierarchy.
3. Host controller injects Boot + Operating Canon + identity + Journey 1–13 + Demo with RANK labels; stamp `20260831-curl-operating-canon-1`.
4. Character configs cleaned of Claire/Kuranda clinical monologue, VIBNAVA allow-lists, Unity page profiles/tour routes/notes debris; CP page profiles 1–13 + About.
5. `curl_hume_config.json` authority_hierarchy + knowledge_files updated.

## Final semantic authority
1. BOOT SEQUENCE
2. CURL IDENTITY AND ROLE
3. CURL OPERATING CANON
4. COGNITION PARTNER CANON / ARCHITECTURE
5. JOURNEY PAGES 1–13 (narrative context)
6. DEMONSTRATIONS AND EXAMPLES
7. CURRENT PAGE / SESSION CONTEXT

## Legacy removed / isolated
- Clinical Chief Scientist / Parkinson / French neurologist monologue paths
- VIBNAVA knowledge allow-list
- Unity Measure-Manage-Exchange page profiles and tour routes as Curl identity context
- Unity sales offboard copy softened to CP
- `curl-charcot` registry key retained only as backward-compat alias mirroring curl-maxwell (not a Claire identity)

## Implementation check results
- PASS: operating_canon_file
- PASS: boot_has_hierarchy
- PASS: canon_identity_not_diva
- PASS: canon_host_not_private_partner
- PASS: canon_vs_demo
- PASS: canon_epistemic
- PASS: canon_handoffs
- PASS: journey_13_pages
- PASS: controller_injects_canon
- PASS: controller_authority_line
- PASS: controller_ranks
- PASS: config_hierarchy
- PASS: config_knowledge_includes_canon
- PASS: cc_no_clinical_title
- PASS: cc_no_parkinson
- PASS: cc_no_vibnava
- PASS: cc_no_not_page_aware
- PASS: cc_has_operating_canon
- PASS: cc_cp_page_profiles
- PASS: cc_js_syntax_already_checked
- PASS: probe_coverage::Who are you?
- PASS: probe_coverage::Are you my Cognition Partner?
- PASS: probe_coverage::Are you Diva?
- PASS: probe_coverage::Are you Claire?
- PASS: probe_coverage::Are you Clerk?
- PASS: probe_coverage::Who is Cove?
- PASS: probe_coverage::What is a Living Library?
- PASS: probe_coverage::Does my Living Library remember everythi
- PASS: probe_coverage::Where is my information actually stored?
- PASS: probe_coverage::Can you tell me what my purpose is?
- PASS: probe_coverage::Is Unity Energy the same thing as Cognit
- PASS: probe_coverage::Which of the three Possibilities should 

## Live conversational QA
**Status:** NOT YET COMPLETE on live visitor mic path.
Reason: production Hume `api/runtime-auth` intentionally not published; live voice is a separate infrastructure track per Cove directive.

### Static cognitive readiness (packs + injection)
Operating Canon contains explicit answers/guidance for the Cove probe set (identity, Host vs Partner, Diva/Claire/Clerk, Cove, Living Library epistemology, purpose non-prescription, Unity demo≠CP, Possibilities).

### Required before promote of this cognitive pass
1. Local or production auth path available for one full visitor session.
2. Run Cove probe battery live on index + page12 + page13 at minimum.
3. Verify no identity leakage under Kuranda/Claire/Unity/clinical bait questions.
4. Then promote REV2 Curl knowledge delta to `cpwebsite` / GitHub.

## Unresolved / needs Mike-Cove judgment
1. Whether identity narrative file still needs a full rewrite (absorb-only; may still contain older Curl story tone).
2. Production Hume auth strategy for cognitionpartner.ai.
3. Whether `curl-charcot` legacy key should be deleted entirely after one proven launch on `curl-maxwell` only.

## Promote
**Not promoted yet** — cognitive environment ready for live QA; site journey promote from earlier remains live without this Operating Canon delta until you approve push.

— Clerk
