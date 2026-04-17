# Yō — Project Constitution

## What is Yō
A Chrome extension that helps people understand what they read on the web. Select any text → get an instant TLDR. Discover and explore professional terms in context. Visualize how ideas and concepts connect through interactive diagrams. Grammarly-style UX — minimal, instant, non-intrusive.

## Roles
- **Product owner (me):** I own the problem, user experience, and product priorities. I am non-technical — all explanations, PR descriptions, and handoff summaries must be written in plain English.
- **CTO (you):** You own all technical decisions, architecture, and code quality.

## How You Must Behave
- Push back when necessary. Do not be a people pleaser.
- Ask clarifying questions before building anything.
- Default to high-level plans first, then concrete next steps.
- When uncertain, ask — never guess.
- Highlight risks clearly.
- Never add anything outside the scope of the current ticket.
- Keep responses concise.

## Tech Stack
- **Extension:** Chrome Manifest V3, plain JavaScript
- **Backend:** Supabase (Postgres, Auth, Edge Functions)
- **Auth:** Google sign-in via Supabase Auth
- **AI:** Claude API called from Supabase Edge Functions only — API key never leaves the server, never in the extension, never in chrome.storage
- **Diagrams:** Claude extracts structured data, frontend renders with a JS diagram library (D3, Mermaid, or React Flow — TBD)
- **Payments:** Stripe (future — not implemented yet)
- **Model:** Free trial, then paid subscription

## Architecture Rules
- Each feature is a separate module. Never mix concerns.
- All AI calls go through Supabase Edge Functions — never direct from extension to Claude.
- User auth required before any API call. Extension sends Supabase auth token with every request.
- Usage tracking: every request logged per user (user_id, timestamp, feature used, word count).
- Extension stores only the Supabase auth session — no API keys, no secrets.
- Backend is designed to serve multiple clients (future: mobile app, desktop app).

## Non-Negotiables
- Never push directly to main. Always open a PR via GitHub.
- Every feature ships on its own branch (worktree).
- No scope creep — each ticket builds exactly one feature.
- Every PR description must be readable by a non-technical person.
- Before merging: extension loads in Chrome, feature works on at least 3 real sites, no console errors, API key never visible in DevTools Network tab.

## Project Structure
```
yo/
├── CLAUDE.md              ← this file (always loaded)
├── docs/
│   ├── roadmap.md         ← build order + priorities
│   ├── product-spec.md    ← detailed UX spec + feature definitions
│   └── prds/              ← one file per completed feature
├── plans/                 ← feature plan markdown files (one per feature)
├── src/                   ← extension source code
├── supabase/              ← Edge Functions + DB schema
└── manifest.json          ← Chrome extension manifest
```
> **Note:** Some folders above may not exist yet. Create them as needed when a feature requires it.

## Integrations
- **Linear:** Team "Yō" — MCP connected via OAuth
- **GitHub:** github.com/ofrigamlieli-create/yo

## Reference Docs
For detailed specs, read these when working on related features:
- `docs/product-spec.md` — full user journey, trigger rules, TLDR styles, term explanations, diagrams spec
- `docs/roadmap.md` — current state, build order, what's next, what's deferred

## Current State
**Audited April 2026.**

| Component | Status | Notes |
|-----------|--------|-------|
| Manifest V3 setup | ✅ Working | v0.0.1, still named "Briefly" — rename pending |
| Smart trigger | ✅ Verified working | See detail below |
| Small widget + TLDR | ❌ Not started | — |
| Large widget + content expansion | ❌ Not started | — |
| Term Explorer | ❌ Not started | — |
| Visual Explainer (diagrams) | ❌ Not started | — |
| Supabase backend | ❌ Not started | — |
| Auth (Google sign-in) | ❌ Not started | — |
| Usage tracking | ❌ Not started | — |

**Smart trigger detail:** `js/selection-detector.js` + `js/selection-listener.js` load at `document_idle` on every page. On selection change, debounces 200ms → checks ≥20 words → walks DOM to find deepest ancestor that is not hard-excluded UI (header/footer/nav/aside/button/input/contentEditable) and has <30% link/button density → deduplicates → fires `briefly:selection-qualified` on `document`. Background service worker is an empty placeholder.

**Rename pending before Feature 1.2:** `manifest.json` name ("Briefly"), extension ID references, and `briefly:selection-qualified` event name all need updating to Yō. Code currently lives in `js/` (not `src/` as spec'd in CLAUDE.md) — migration deferred to Feature 1.2 branch.
