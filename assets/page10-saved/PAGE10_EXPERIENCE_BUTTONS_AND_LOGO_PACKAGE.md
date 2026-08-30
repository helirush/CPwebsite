# PAGE10 — Saved Experience Buttons + Center Logo Package
**Saved:** 2026-08-21  
**Source:** page5.html overlays removed for new p5r6 art  
**Purpose:** reuse on page 10 later  

## HTML (paste into page10 body over art)
```html
<!-- PAGE10 SAVED from page5 (2026-08-21) — Experience CTAs + center logo overlay
     Restore onto page10 when ready. Destinations were:
       Clerk  -> ./page8.html?v=20260830-p8-2"cp-r1-page5-center-logo-wrap" aria-hidden="true">
  <span class="cp-r1-page5-center-logo-under"></span>
  <img class="cp-r1-page5-center-logo" src="./CPlogo_60715.png?v=20260810-bottom-logo-down10" alt="" />
</div>
<a class="cp-r1-page5-experience-link cp-r1-page5-experience-clerk" href="./page8.html?v=20260830-p8-2" aria-label="Experience Clerk">
  <span class="cp-r1-page5-experience-label">EXPERIENCE CLERK</span>
  <span class="cp-r1-page5-experience-chevron" aria-hidden="true">›</span>
</a>
<a class="cp-r1-page5-experience-link cp-r1-page5-experience-claire" href="./page6.html" aria-label="Experience Claire">
  <span class="cp-r1-page5-experience-label">EXPERIENCE CLAIRE</span>
  <span class="cp-r1-page5-experience-chevron" aria-hidden="true">›</span>
</a>

```

## CSS — Experience buttons (from styles.css)
```css
.cp-r1-page5-experience-link {
  position: absolute;
  top: 64.7%;
  width: 14.2%;
  height: 5.0%;
  z-index: 6;
  border-radius: 999px;
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: clamp(5px, 0.4vw, 8px);
  box-sizing: border-box;
  padding: 0 clamp(6px, 0.45vw, 10px); /* tighter so larger type fills pill */
  text-decoration: none;
  border: 1.5px solid transparent;
  box-shadow:
    0 8px 18px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transition: filter 140ms ease, transform 120ms ease, box-shadow 140ms ease;
}
.cp-r1-page5-experience-label {
  font-size: clamp(12px, 0.936vw, 18px); /* +20% */
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 1;
}
.cp-r1-page5-experience-chevron {
  font-size: 1.45em; /* scales with larger label */
  font-weight: 400;
  line-height: 1;
  transform: translateY(-0.5px);
}
/* Gold filled CTA — Experience Clerk */
.cp-r1-page5-experience-clerk {
  left: 26.5%;
  color: rgba(28, 18, 6, 0.96);
  border-color: rgba(210, 168, 92, 0.95);
  background: linear-gradient(
    180deg,
    rgba(232, 196, 122, 0.98) 0%,
    rgba(198, 148, 74, 0.96) 48%,
    rgba(168, 120, 52, 0.98) 100%
  );
}
.cp-r1-page5-experience-clerk .cp-r1-page5-experience-label,
.cp-r1-page5-experience-clerk .cp-r1-page5-experience-chevron {
  color: rgba(28, 18, 6, 0.96);
  text-shadow: 0 1px 0 rgba(255, 236, 190, 0.28);
}
/* Green filled CTA — Experience Claire */
.cp-r1-page5-experience-claire {
  left: 67.7%;
  color: rgba(236, 248, 232, 0.98);
  border-color: rgba(142, 205, 111, 0.88);
  background: linear-gradient(
    180deg,
    rgba(110, 168, 86, 0.98) 0%,
    rgba(78, 132, 58, 0.96) 48%,
    rgba(56, 104, 42, 0.98) 100%
  );
}
.cp-r1-page5-experience-claire .cp-r1-page5-experience-label,
.cp-r1-page5-experience-claire .cp-r1-page5-experience-chevron {
  color: rgba(236, 248, 232, 0.98);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.22);
}
.cp-r1-page5-experience-link:hover {
  filter: brightness(1.08);
  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.24);
}
.cp-r1-page5-experience-link:active {
  transform: translateY(1px);
  filter: brightness(0.98);
}
.cp-r1-page5-experience-link:focus-visible {
  outline: 2px solid rgba(125, 211, 252, 0.98);
  outline-offset: 2px;
}

```

## CSS — Center logo overlay
```css
/* Page 5 — finished center Cognition Partner mark over baked-in badge */
.cp-r1-page5-center-logo-wrap {
  position: absolute;
  left: 53.2%;
  top: 43.67%;
  /* Sized to fully cover baked-in circular badge */
  width: 7.515%;
  aspect-ratio: 1 / 1;
  transform: translate(-50%, -50%);
  z-index: 5;
  pointer-events: none;
}
.cp-r1-page5-center-logo-under {
  position: absolute;
  inset: 8%;
  border-radius: 999px;
  /* Light circular veil only — logo file is now transparent, no black square */
  background: radial-gradient(circle, rgba(4, 10, 24, 0.55) 0%, rgba(6, 14, 30, 0.22) 58%, rgba(6, 14, 30, 0) 78%);
}
.cp-r1-page5-center-logo {
  position: relative;
  z-index: 1;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.45));
}
@media (max-width: 1100px) {
  .cp-r1-page5-center-logo-wrap {
    width: 7.380%;
  }
}
@media (max-width: 760px) {
  .cp-r1-page5-center-logo-wrap {
    width: 9.450%;
  }
}

```

## Related media-query fragments (as found)
```css
/* from styles.css ~285 */
  width: 93.6% /* match top card */; /* match top card width */
  height: 10.56% /* unified panel height across pages 1-5 */;
  z-index: 7;
  pointer-events: none;
}
.cp-r1-page5-experience-link {
  position: absolute;
  top: 64.7%;
  width: 14.2%;
  height: 5.0%;
  z-index: 6;
  border-radius: 999px;
  pointer-events: auto;

/* from styles.css ~306 */
  box-shadow:
    0 8px 18px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.18);
  transition: filter 140ms ease, transform 120ms ease, box-shadow 140ms ease;
}
.cp-r1-page5-experience-label {
  font-size: clamp(12px, 0.936vw, 18px); /* +20% */
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 1;
}

/* from styles.css ~314 */
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  line-height: 1;
}
.cp-r1-page5-experience-chevron {
  font-size: 1.45em; /* scales with larger label */
  font-weight: 400;
  line-height: 1;
  transform: translateY(-0.5px);
}
/* Gold filled CTA — Experience Clerk */
.cp-r1-page5-experience-clerk {

/* from styles.css ~321 */
  font-weight: 400;
  line-height: 1;
  transform: translateY(-0.5px);
}
/* Gold filled CTA — Experience Clerk */
.cp-r1-page5-experience-clerk {
  left: 26.5%;
  color: rgba(28, 18, 6, 0.96);
  border-color: rgba(210, 168, 92, 0.95);
  background: linear-gradient(
    180deg,
    rgba(232, 196, 122, 0.98) 0%,
    rgba(198, 148, 74, 0.96) 48%,

/* from styles.css ~332 */
    rgba(232, 196, 122, 0.98) 0%,
    rgba(198, 148, 74, 0.96) 48%,
    rgba(168, 120, 52, 0.98) 100%
  );
}
.cp-r1-page5-experience-clerk .cp-r1-page5-experience-label,
.cp-r1-page5-experience-clerk .cp-r1-page5-experience-chevron {
  color: rgba(28, 18, 6, 0.96);
  text-shadow: 0 1px 0 rgba(255, 236, 190, 0.28);
}
/* Green filled CTA — Experience Claire */
.cp-r1-page5-experience-claire {
  left: 67.7%;

/* from styles.css ~333 */
    rgba(198, 148, 74, 0.96) 48%,
    rgba(168, 120, 52, 0.98) 100%
  );
}
.cp-r1-page5-experience-clerk .cp-r1-page5-experience-label,
.cp-r1-page5-experience-clerk .cp-r1-page5-experience-chevron {
  color: rgba(28, 18, 6, 0.96);
  text-shadow: 0 1px 0 rgba(255, 236, 190, 0.28);
}
/* Green filled CTA — Experience Claire */
.cp-r1-page5-experience-claire {
  left: 67.7%;
  color: rgba(236, 248, 232, 0.98);

/* from styles.css ~338 */
.cp-r1-page5-experience-clerk .cp-r1-page5-experience-chevron {
  color: rgba(28, 18, 6, 0.96);
  text-shadow: 0 1px 0 rgba(255, 236, 190, 0.28);
}
/* Green filled CTA — Experience Claire */
.cp-r1-page5-experience-claire {
  left: 67.7%;
  color: rgba(236, 248, 232, 0.98);
  border-color: rgba(142, 205, 111, 0.88);
  background: linear-gradient(
    180deg,
    rgba(110, 168, 86, 0.98) 0%,
    rgba(78, 132, 58, 0.96) 48%,

/* from styles.css ~349 */
    rgba(110, 168, 86, 0.98) 0%,
    rgba(78, 132, 58, 0.96) 48%,
    rgba(56, 104, 42, 0.98) 100%
  );
}
.cp-r1-page5-experience-claire .cp-r1-page5-experience-label,
.cp-r1-page5-experience-claire .cp-r1-page5-experience-chevron {
  color: rgba(236, 248, 232, 0.98);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.22);
}
.cp-r1-page5-experience-link:hover {
  filter: brightness(1.08);
  box-shadow:

/* from styles.css ~350 */
    rgba(78, 132, 58, 0.96) 48%,
    rgba(56, 104, 42, 0.98) 100%
  );
}
.cp-r1-page5-experience-claire .cp-r1-page5-experience-label,
.cp-r1-page5-experience-claire .cp-r1-page5-experience-chevron {
  color: rgba(236, 248, 232, 0.98);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.22);
}
.cp-r1-page5-experience-link:hover {
  filter: brightness(1.08);
  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.34),

/* from styles.css ~354 */
.cp-r1-page5-experience-claire .cp-r1-page5-experience-label,
.cp-r1-page5-experience-claire .cp-r1-page5-experience-chevron {
  color: rgba(236, 248, 232, 0.98);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.22);
}
.cp-r1-page5-experience-link:hover {
  filter: brightness(1.08);
  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.24);
}
.cp-r1-page5-experience-link:active {
  transform: translateY(1px);

/* from styles.css ~360 */
  filter: brightness(1.08);
  box-shadow:
    0 10px 22px rgba(0, 0, 0, 0.34),
    inset 0 1px 0 rgba(255, 255, 255, 0.24);
}
.cp-r1-page5-experience-link:active {
  transform: translateY(1px);
  filter: brightness(0.98);
}
.cp-r1-page5-experience-link:focus-visible {
  outline: 2px solid rgba(125, 211, 252, 0.98);
  outline-offset: 2px;
}

/* from styles.css ~364 */
}
.cp-r1-page5-experience-link:active {
  transform: translateY(1px);
  filter: brightness(0.98);
}
.cp-r1-page5-experience-link:focus-visible {
  outline: 2px solid rgba(125, 211, 252, 0.98);
  outline-offset: 2px;
}
.cp-r1-headphone-glyph-wrap {
  position: absolute;
  left: calc(2.9% + 20px);
  top: calc(27.5% + 10px);

/* from styles.css ~774 */
  .cp-r1-top-item.is-active::after {
    width: clamp(58px, 5.8vw, 120px);
    left: calc(clamp(29px, 2.2vw, 46px) - 20px);
  }
  /* Do NOT inflate play-card height on tablet — dock handled below */
  .cp-r1-page5-experience-link {
    top: 64.7%;
    height: 5.0%;
  }
  .cp-r1-page5-experience-clerk {
    left: 26.5%;
    width: 14.2%;
  }

/* from styles.css ~778 */
  /* Do NOT inflate play-card height on tablet — dock handled below */
  .cp-r1-page5-experience-link {
    top: 64.7%;
    height: 5.0%;
  }
  .cp-r1-page5-experience-clerk {
    left: 26.5%;
    width: 14.2%;
  }
  .cp-r1-page5-experience-claire {
    left: 67.7%;
    width: 14.2%;
  }

/* from styles.css ~782 */
  }
  .cp-r1-page5-experience-clerk {
    left: 26.5%;
    width: 14.2%;
  }
  .cp-r1-page5-experience-claire {
    left: 67.7%;
    width: 14.2%;
  }
}
@media (max-width: 860px) {
  .cp-r1-brand-lockup-logo {
    width: clamp(31px, 2.95vw, 46px);

/* from styles.css ~832 */
  }
  .cp-r1-top-item.is-active::after {
    width: clamp(45px, 4.9vw, 95px);
    left: calc(clamp(22px, 1.9vw, 34px) - 20px);
  }
  .cp-r1-page5-experience-link {
    top: 64.7%;
    height: 5.0%;
    border-radius: 10px;
  }
  .cp-r1-page5-experience-clerk {
    left: 26.5%;
    width: 14.2%;

/* from styles.css ~837 */
  .cp-r1-page5-experience-link {
    top: 64.7%;
    height: 5.0%;
    border-radius: 10px;
  }
  .cp-r1-page5-experience-clerk {
    left: 26.5%;
    width: 14.2%;
  }
  .cp-r1-page5-experience-claire {
    left: 67.7%;
    width: 14.2%;
  }

/* from styles.css ~841 */
  }
  .cp-r1-page5-experience-clerk {
    left: 26.5%;
    width: 14.2%;
  }
  .cp-r1-page5-experience-claire {
    left: 67.7%;
    width: 14.2%;
  }
}
#cpR1NarrationAudio {
  display: none;
}


```

## Notes
- Gold pill = Experience Clerk (left ~26.5%)
- Green pill = Experience Claire (left ~67.7%)
- Both top ~64.7% of page-card
- Class names still use page5 prefix; rename to page10 when wiring
- Logo asset path: `CPlogo_60715.png`
