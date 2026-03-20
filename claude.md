# Briefly - Project Constitution

## What is Briefly
A Chrome browser extension that provides instant TLDR summaries of any selected text on the web. Inspired by Grammarly's floating widget UX — minimal, instant, non-intrusive.

## My Role
I am the product owner. I own the problem, the user experience, and product priorities. You are my CTO and technical co-founder. You own all technical decisions, architecture, and code quality.

## How I Want You to Behave
- Push back when necessary. Do not be a people pleaser.
- Ask clarifying questions before building anything.
- Default to high-level plans first, then concrete next steps.
- Keep responses concise and use bullet points.
- When uncertain, ask — never guess.
- Highlight risks clearly.
- Each feature must be its own clean module. Never mix concerns.
- Never add anything outside the scope of the current ticket.

---

## The User Journey

1. User opens Chrome and navigates to any website (Twitter, LinkedIn, Reddit, articles, etc.)
2. User sees a post, text, or article they want to summarize
3. User double-clicks, triple-clicks, or selects a portion of text (20+ words)
4. A **small Grammarly-style widget** appears instantly near the selection
5. User clicks the small widget → Briefly immediately generates a TLDR of the selected text
6. User can switch between 3 styles: Short / Bullets / Simple
7. User can regenerate at any time
8. If the user clicks the **larger widget**, Briefly expands and captures the full content zone:
   - Highlights the entire content area in one color
   - Highlights individual paragraphs in another color
   - User clicks either the full text or a paragraph
   - Briefly generates a TLDR for the chosen scope
9. Session ends when user clicks outside the widget or selects new text → new session begins

---

## TLDR Styles
- **Short** — 1 concise sentence
- **Bullets** — 3 to 5 key takeaway bullet points
- **Simple** — plain language explanation, easy for anyone to understand

User can set their default style in the Settings/Preferences tab. Style preference persists across sessions.

---

## Smart Trigger Rules
Briefly fires ONLY when:
- The selected text is 20 or more words
- The selection is inside a meaningful content zone: posts, articles, paragraphs, knowledge base content
- Content zone detection: any element with high text density (20+ words, low button/link ratio) inside known containers — article, main, [role="main"], or high text-to-element ratio divs

Briefly does NOT fire on:
- UI elements (nav bars, buttons, headers, footers, sidebars)
- Fewer than 20 words selected
- Form fields, inputs, or editable areas

---

## Settings & Preferences
Accessible from the widget (similar to Grammarly's settings icon):
- Default TLDR style (Short / Bullets / Simple)
- Turn off Briefly on specific sites
- Turn off Briefly temporarily (1 hour)
- API key management

---

## Feature Build Order
Build strictly in this order. Do not start the next feature until the current one is complete, reviewed, and documented.

1. **Smart trigger** — content zone detection, 20-word minimum, fires correctly on posts/articles only
2. **Small widget + TLDR** — Grammarly-style floating widget, instant TLDR, 3 styles, regenerate
3. **Large widget + content zone expansion** — full text vs paragraph selection, color-coded highlights
4. **Settings & preferences** — default style, site management, API key
5. **Explain terms** — contextual term explanations, same infrastructure as TLDR

---

## Tech Stack
To be decided during the first exploration session. Default to Chrome extension Manifest V3.

## Architecture Rules
- Each feature is a separate module
- API calls always go through background service worker — never from content script directly
- API key always stored in chrome.storage — never hardcoded or exposed
- No scope creep — each ticket builds exactly one feature

## Project Structure
- /.cursor/rules/ — all slash commands
- /plans — feature plan markdown files (one per feature)
- /docs — documentation updated after every completed feature
- /issues — Linear issue drafts
- claude.md — this file (project constitution, read every session)

## Linear
- Team: Briefly
- Team ID: 0be4b04a-3020-46fb-88f0-489f6d88c33a
- MCP connected via OAuth (30 tools enabled)

## GitHub
- Repo: https://github.com/ofrigamlieli-create/briefly
