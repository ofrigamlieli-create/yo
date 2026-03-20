## Title
Smart trigger: Fire Briefly only for 20+ word selections inside meaningful content zones

## TL;DR
Add detection logic so Briefly triggers only when the user selects 20+ words inside meaningful content (posts/articles/knowledge base), and remains completely silent everywhere else.

## Current state vs expected state
- Current state: Trigger logic does not exist yet; Briefly should not fire at all.
- Expected state: Briefly triggers only when all trigger conditions are met: (1) selection is 20+ words, and (2) selection is inside a meaningful content zone (posts, articles, Reddit threads, or knowledge base content as detected by heuristics).

## Acceptance criteria
- Selecting 20+ words inside a `LinkedIn` post, `article`, or `Reddit` thread triggers Briefly.
- Selecting 20+ words inside a `nav bar`, `header`, `footer`, `sidebar`, or `button` does NOT trigger Briefly.
- Selecting fewer than 20 words anywhere does NOT trigger Briefly.
- Selecting text inside a `form field` or `input` does NOT trigger Briefly.
- “Exactly 20 words” is treated as inclusive (it fires).

## Scope / non-goals
- In scope: trigger *detection only* (content-zone detection + 20-word minimum gating).
- Out of scope: no UI/widget, no TL;DR generation, no API calls, no highlight rendering, no session state beyond what’s required for detection.

## Definition of “meaningful content zone”
- Any element that appears to be primary reading content based on heuristics:
  - contains high text density (20+ words) and low button/link ratio
  - selection occurs inside containers like `article`, `main`, `[role="main"]`, or high text-density `div`s
  - Twitter/LinkedIn “post” bodies count as content zones even if not traditional `<article>` elements

## Edge cases / risks
- Heuristic false positives: reading-like text inside headers/sidebars that look content-dense.
- Heuristic false negatives: posts/articles with heavy media, short paragraphs, or atypical DOM structure.
- “20 words” counting must be deterministic (word tokenization rules should be defined in implementation).

## Relevant areas of the codebase
- Selection handling (the code that observes user text selection / determines when to evaluate triggering)
- Trigger gating logic (20+ word minimum)
- Content-zone detection module (heuristics for posts/articles/KB content vs UI chrome)

