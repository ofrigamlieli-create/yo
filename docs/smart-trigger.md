## Smart Trigger (Feature 1)

### Feature overview
Smart Trigger is the first part of Briefly. It checks whether selected text is valid for Briefly before anything else happens.

What it does:
- Watches text selection changes on the page.
- Qualifies selection only when:
  - selected text has 20 or more words, and
  - selection is inside a meaningful content area.
- Sends one internal event (`briefly:selection-qualified`) when the selection is valid.

What it does not do:
- No widget UI.
- No TL;DR generation.
- No API calls.
- No highlights.

### User flow (step by step)
1. User selects text on a webpage.
2. Briefly checks if the selection is empty/collapsed. If yes, it does nothing.
3. Briefly counts selected words (minimum is 20, inclusive).
4. Briefly checks exclusions (navigation and form/editable areas).
5. Briefly finds the deepest valid content container around the selection.
6. If the selection qualifies, Briefly dispatches `briefly:selection-qualified` on `document`.
7. If it does not qualify, Briefly stays silent.

### Architecture (which files do what)
- `manifest.json`
  - Registers the extension as Manifest V3.
  - Loads content scripts on all pages in the main frame.
- `background.js`
  - Placeholder service worker for later features.
- `js/selection-detector.js`
  - Selection rules: word counting, hard exclusions, content-zone qualification.
- `js/selection-listener.js`
  - Listens to `selectionchange`, debounces checks (200ms), deduplicates repeats, dispatches the custom event.

### Setup and configuration
- Load this folder as an unpacked extension in Chrome (`chrome://extensions`).
- Ensure Developer mode is on.
- Reload extension after any code update.
- No API key or external service is required for this feature.

### Known limitations and edge cases
- Main frame only (no iframe support yet).
- No shadow DOM handling yet.
- Heuristic detection can still have false positives/false negatives on unusual page structures.
- Event payload uses serializable container metadata (not a live DOM element reference).

### Troubleshooting
- Event not firing:
  - Check selected text has at least 20 words.
  - Check selection is not inside excluded areas (`header`, `footer`, `nav`, `aside`, `button`, `input`, `select`, `textarea`, `[role="navigation"]`, `[role="textbox"]`, or contenteditable areas).
  - Check both start and end of selection are inside the same qualifying content container.
- Event fires but payload missing:
  - Listen for `briefly:selection-qualified` on `document`.
  - Read `e.detail.selectionText`, `e.detail.wordCount`, `e.detail.containerElement`.
- Same selection does not fire repeatedly:
  - This is expected. Briefly deduplicates repeated identical qualified selections.

