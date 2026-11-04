# Cognition Partner HTTPS canonicalization checklist

Prepared: 2026-10-25
Status: staging metadata uses https://cognitionpartner.ai canonicals

## Required at promote / hosting (Mike approval)
1. GitHub Pages custom domain: enable **Enforce HTTPS** for cognitionpartner.ai.
2. Confirm `http://cognitionpartner.ai` **301** → `https://cognitionpartner.ai/`.
3. Confirm `http://www` and `https://www` **301** → `https://cognitionpartner.ai/`.
4. Certificate valid; no mixed-content console errors on home.
5. Re-check with curl after DNS/Pages settings (Clerk can re-verify post-promote).

Clerk cannot flip GitHub/DNS toggles without Mike access.
