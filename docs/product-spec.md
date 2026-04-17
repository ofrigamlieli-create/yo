# Yō — Product Spec

> This is the detailed product specification. It is NOT loaded every session. Read this when working on specific features. The always-loaded summary lives in `CLAUDE.md`.

---

## Product Vision
Yō is a reading comprehension layer for the web. It helps anyone understand what they're reading — faster and deeper. Three capabilities, one seamless experience:
1. **TLDR** — instant summaries of selected text
2. **Term Explorer** — detect and explain professional/technical terms in context
3. **Visual Explainer** — interactive diagrams showing how concepts in the text relate to each other

All three surface through a Grammarly-style widget that appears contextually. Minimal, instant, non-intrusive.

---

## Core User Journey

### Selection → Small Widget → TLDR
1. User navigates to any website (Twitter, LinkedIn, Reddit, articles, knowledge bases, etc.)
2. User selects text (double-click, triple-click, or drag-select) — minimum 20 words
3. A **small floating widget** appears near the selection (Grammarly-style)
4. User clicks the widget → Yō generates a TLDR immediately
5. User can switch between 3 TLDR styles: **Short / Bullets / Simple**
6. User can regenerate at any time

### Large Widget → Content Zone Expansion
7. If the user clicks the **expand button** on the widget, Yō expands and scans the full content zone:
   - Highlights the entire content area in one color
   - Highlights individual paragraphs in a different color
8. User clicks either the full highlighted area or a single paragraph
9. Yō generates a TLDR for the chosen scope
10. Session ends when user clicks outside the widget or selects new text (new session begins)

### Term Explorer (within any TLDR or selected text)
11. When a TLDR is generated, Yō auto-detects professional/technical terms and highlights them within the TLDR text
12. User can also manually select any term in the original page text or in the TLDR
13. Clicking/tapping a highlighted term shows a contextual explanation — what the term means **in the context of the surrounding text**, not a generic dictionary definition
14. Term explanations appear inline (tooltip or expandable section within the widget)

### Visual Explainer (side panel)
15. From any TLDR or term view, user can tap a "Visualize" button
16. A **side panel or overlay** opens showing an interactive diagram
17. The diagram shows concepts extracted from the text and how they relate to each other (causes, is-part-of, leads-to, contrasts-with, etc.)
18. Implementation: Claude extracts structured concept data → frontend renders interactive diagram using a JS library
19. Diagram types may include: flowchart, mind map, timeline, comparison — Claude picks the best fit or user can switch
20. Image generation (DALL-E style) is a future roadmap item, not part of v1

---

## TLDR Styles
- **Short** — 1 concise sentence
- **Bullets** — 3 to 5 key takeaway bullet points
- **Simple** — plain language explanation, easy for anyone to understand

User can set a default style in Settings. Preference persists across sessions.

---

## Smart Trigger Rules

### Yō fires ONLY when:
- Selected text is 20 or more words
- Selection is inside a meaningful content zone: posts, articles, paragraphs, knowledge base content
- Content zone detection: any element with high text density (20+ words, low button/link ratio) inside known containers — `article`, `main`, `[role="main"]`, or high text-to-element ratio divs

### Yō does NOT fire on:
- UI elements (nav bars, buttons, headers, footers, sidebars)
- Fewer than 20 words selected
- Form fields, inputs, or editable areas

---

## Settings & Preferences
Accessible from the widget (similar to Grammarly's settings icon):
- Default TLDR style (Short / Bullets / Simple)
- Turn off Yō on specific sites (site blocklist)
- Turn off Yō temporarily (1 hour)
- Account management (sign in / sign out)
- Subscription management (future — Stripe integration)

---

## Platform Strategy
- **Phase 1:** Chrome extension (current)
- **Phase 2:** Web app companion (if business validates)
- **Phase 3:** Mobile app + Mac/Windows desktop app (only if Phase 2 validates)

Backend is architected to serve multiple clients from day one. The Supabase Edge Function layer is client-agnostic — extension, web app, and mobile app all call the same endpoints.

---

## Business Model
- **Free trial** with full feature access for a limited period (duration TBD)
- **Paid subscription** after trial ends (pricing TBD)
- Stripe integration for payments (future — not built yet)

---

## API Flow
```
User action in extension
  → Extension sends request + Supabase auth token
  → Supabase Edge Function validates auth + checks usage limits
  → Edge Function calls Claude API (API key server-side only)
  → Response returned to extension
  → Extension renders TLDR / term explanation / diagram data
```

The Claude API key NEVER leaves the server. The extension NEVER makes direct calls to Claude.
