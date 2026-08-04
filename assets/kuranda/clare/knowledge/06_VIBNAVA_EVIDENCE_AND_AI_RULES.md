---
**File**: `VIBNAVA_EVIDENCE_AND_AI_RULES.md`
**Tag**: `kuranda.library.knowledge.vibnava_evidence_ai_rules`
**Category**: Library/Knowledge
**Source**: Evidence & AI Rules sheet
**Installed**: 2026-08-03
**Status**: WORKING DRAFT — critical for Isaiah reasoning guardrails and future Claire bounds
**CSV**: `assets/data/vibnava_master_csv/05_Evidence_AI_Rules.csv`
**Related**:
  - `Library/Foundations/VIBNAVA_ADAPTIVE_OPTIMIZATION_ARCHITECTURE.md`
  - `Library/Systems/WORKFLOW_VIBNAVA_Adaptive_Control_Loop.md`
---

# VIBNAVA Evidence & AI Rules

Rules governing evidence interpretation, AI recommendations, and claim discipline.

**Record count:** 28

## Index
- `EVIDENCE ALIGNMENT SCORE` — WEIGHT
- `Root Evidence` — 25
- `Diagnosis Specificity` — 20
- `Adjacent Intervention Evidence` — 20
- `VIBNAVA Directness` — 20
- `Biomarker Measurability` — 10
- `Safety / Applicability` — 5
- `Score Range` — Interpretation
- `80–100` — High evidence alignment; still not proof of VIBNAVA efficacy unless Directness is 4–5.
- `65–79.9` — Moderate–high alignment; rationale is strong but protocol-specific gaps remain.
- `50–64.9` — Moderate alignment; useful as a monitored research or adjunctive hypothesis.
- `35–49.9` — Low–moderate alignment; describe as exploratory and emphasize uncertainty.
- `0–34.9` — Insufficient alignment for individualized therapeutic claims.
- `Critical rule` — The AI must display all six component ratings and must not use the composite score alone.
- `FIELD` — AI INSTRUCTION
- `Patient diagnosis` — Use the exact clinician-confirmed diagnosis supplied by the user; otherwise label it 'reported' or 'suspected'.
- `Subphenotype selection` — Select only pathway rows matching the patient's actual manifestations, biomarkers, medications, and contraindications.
- `Causal language` — Describe mechanisms as established, contributory, associated, plausible, or exploratory according to component scores.
- `VIBNAVA language` — Use 'may support,' 'is designed to influence,' or 'could be evaluated for.' Do not use cure, reverse, heal, restore, or disease-modifying unless direct trials support it.
- `Composite score` — Report Evidence Alignment Score /100 and the Evidence Tier, followed immediately by the six component ratings.
- `Personalization` — Explain why each chosen pathway is relevant to the person's symptoms, medication timing, sleep, glucose, HRV, pain, mobility, and measured data.
- `Research citations` — Resolve every Reference ID through the References sheet and include the paper title, year, evidence type, and URL.
- `Conflict handling` — When pathways conflict (e.g., vagal calming vs hypotension risk), explicitly prioritize safety and recommend measurement.
- `Medical boundaries` — State that the output is an evidence-guided adjunctive rationale, not a diagnosis or medication-management plan.
- `Required output order` — 1. Diagnostic context; 2. Individual manifestations; 3. Mechanistic chain; 4. VIBNAVA mapping; 5. Evidence score breakdown; 6. Monitoring plan; 7. Safety limitations; 8. Relevant papers.
- `Mechanistic chain format` — Diagnosis → manifestation/subphenotype → intermediate mechanism → upstream root cause → VIBNAVA layer → proposed proximal biomarker → expected functional outcome.
- `Exclusion rule` — Exclude pathways that do not match the individual, even when they share the same diagnosis.
- `Update rule` — Recalculate summaries when new objective data or new research changes any component rating.

---

### EVIDENCE ALIGNMENT SCORE: 5

- **:** 5
- **:** 5
- **:** 5
- **:** 5
- **:** 5
- **:** 5
- **:** 5

---

### Root Evidence: Established/replicated

- **:** Established/replicated
- **:** Established/replicated
- **:** Established/replicated
- **:** Established/replicated
- **:** Established/replicated
- **:** Established/replicated
- **:** Established/replicated

---

### Diagnosis Specificity: Core/clinically established

- **:** Core/clinically established
- **:** Core/clinically established
- **:** Core/clinically established
- **:** Core/clinically established
- **:** Core/clinically established
- **:** Core/clinically established
- **:** Core/clinically established

---

### Adjacent Intervention Evidence: Replicated/high-quality

- **:** Replicated/high-quality
- **:** Replicated/high-quality
- **:** Replicated/high-quality
- **:** Replicated/high-quality
- **:** Replicated/high-quality
- **:** Replicated/high-quality
- **:** Replicated/high-quality

---

### VIBNAVA Directness: Replicated protocol

- **:** Replicated protocol
- **:** Replicated protocol
- **:** Replicated protocol
- **:** Replicated protocol
- **:** Replicated protocol
- **:** Replicated protocol
- **:** Replicated protocol

---

### Biomarker Measurability: Direct target measure

- **:** Direct target measure
- **:** Direct target measure
- **:** Direct target measure
- **:** Direct target measure
- **:** Direct target measure
- **:** Direct target measure
- **:** Direct target measure

---

### Safety / Applicability: Low-risk with clear monitoring

- **:** Low-risk with clear monitoring
- **:** Low-risk with clear monitoring
- **:** Low-risk with clear monitoring
- **:** Low-risk with clear monitoring
- **:** Low-risk with clear monitoring
- **:** Low-risk with clear monitoring
- **:** Low-risk with clear monitoring

---

### Score Range: 


---

### 80–100: 


---

### 65–79.9: 


---

### 50–64.9: 


---

### 35–49.9: 


---

### 0–34.9: 


---

### Critical rule: 


---

### FIELD: 


---

### Patient diagnosis: 


---

### Subphenotype selection: 


---

### Causal language: 


---

### VIBNAVA language: 


---

### Composite score: 


---

### Personalization: 


---

### Research citations: 


---

### Conflict handling: 


---

### Medical boundaries: 


---

### Required output order: 


---

### Mechanistic chain format: 


---

### Exclusion rule: 


---

### Update rule: 


## Full tabular view
| Evidence Scoring, AI Language and Governance Rules | Col2 | Col3 | Col4 | Col5 | Col6 | Col7 | Col8 | Col9 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| EVIDENCE ALIGNMENT SCORE | WEIGHT | QUESTION ANSWERED | 0 | 1 | 2 | 3 | 4 | 5 |
| Root Evidence | 25 | How established is the upstream mechanism itself? | Unsupported | Speculative | Preclinical | Mixed human | Strong human | Established/replicated |
| Diagnosis Specificity | 20 | How directly does this mechanism explain this diagnosis or subphenotype? | Unrelated | Weak association | Broad association | Plausible contributor | Strong contributor | Core/clinically established |
| Adjacent Intervention Evidence | 20 | How much evidence supports a related intervention class (e.g., breathing, VNS, WBV)? | None | Conceptual | Preclinical | Small human | Controlled human | Replicated/high-quality |
| VIBNAVA Directness | 20 | How directly has the intended VIBNAVA dose/device/sequence been tested? | None | Mechanistic inference | Component evidence | Prototype/observational | Controlled protocol | Replicated protocol |
| Biomarker Measurability | 10 | Can the proposed proximal effect be objectively measured? | No measure | Subjective only | Indirect measure | Feasible surrogate | Validated biomarker | Direct target measure |
| Safety / Applicability | 5 | How suitable is the pathway for monitored adjunctive use? | Contraindicated | High risk | Major constraints | Moderate constraints | Generally suitable | Low-risk with clear monitoring |
| Score Range | Interpretation |  |  |  |  |  |  |  |
| 80–100 | High evidence alignment; still not proof of VIBNAVA efficacy unless Directness is 4–5. |  |  |  |  |  |  |  |
| 65–79.9 | Moderate–high alignment; rationale is strong but protocol-specific gaps remain. |  |  |  |  |  |  |  |
| 50–64.9 | Moderate alignment; useful as a monitored research or adjunctive hypothesis. |  |  |  |  |  |  |  |
| 35–49.9 | Low–moderate alignment; describe as exploratory and emphasize uncertainty. |  |  |  |  |  |  |  |
| 0–34.9 | Insufficient alignment for individualized therapeutic claims. |  |  |  |  |  |  |  |
| Critical rule | The AI must display all six component ratings and must not use the composite score alone. |  |  |  |  |  |  |  |
| FIELD | AI INSTRUCTION |  |  |  |  |  |  |  |
| Patient diagnosis | Use the exact clinician-confirmed diagnosis supplied by the user; otherwise label it 'reported' or 'suspected'. |  |  |  |  |  |  |  |
| Subphenotype selection | Select only pathway rows matching the patient's actual manifestations, biomarkers, medications, and contraindications. |  |  |  |  |  |  |  |
| Causal language | Describe mechanisms as established, contributory, associated, plausible, or exploratory according to component scores. |  |  |  |  |  |  |  |
| VIBNAVA language | Use 'may support,' 'is designed to influence,' or 'could be evaluated for.' Do not use cure, reverse, heal, restore, or disease-modifying unless direct trials support it. |  |  |  |  |  |  |  |
| Composite score | Report Evidence Alignment Score /100 and the Evidence Tier, followed immediately by the six component ratings. |  |  |  |  |  |  |  |
| Personalization | Explain why each chosen pathway is relevant to the person's symptoms, medication timing, sleep, glucose, HRV, pain, mobility, and measured data. |  |  |  |  |  |  |  |
| Research citations | Resolve every Reference ID through the References sheet and include the paper title, year, evidence type, and URL. |  |  |  |  |  |  |  |
| Conflict handling | When pathways conflict (e.g., vagal calming vs hypotension risk), explicitly prioritize safety and recommend measurement. |  |  |  |  |  |  |  |
| Medical boundaries | State that the output is an evidence-guided adjunctive rationale, not a diagnosis or medication-management plan. |  |  |  |  |  |  |  |
| Required output order | 1. Diagnostic context; 2. Individual manifestations; 3. Mechanistic chain; 4. VIBNAVA mapping; 5. Evidence score breakdown; 6. Monitoring plan; 7. Safety limitations; 8. Relevant papers. |  |  |  |  |  |  |  |
| Mechanistic chain format | Diagnosis → manifestation/subphenotype → intermediate mechanism → upstream root cause → VIBNAVA layer → proposed proximal biomarker → expected functional outcome. |  |  |  |  |  |  |  |
| Exclusion rule | Exclude pathways that do not match the individual, even when they share the same diagnosis. |  |  |  |  |  |  |  |
| Update rule | Recalculate summaries when new objective data or new research changes any component rating. |  |  |  |  |  |  |  |

## Kuranda Library Notes
- These rules bind Isaiah's internal reasoning style and any automated protocol suggestions.
- Claire may only surface Delton-approved plain-language derivatives of these rules.
