// Selection qualification helpers for the "Smart trigger" feature.
// Pure functions only (no event listeners, no DOM mutation).

(function () {
  const WORD_MIN = 20;
  const HARD_EXCLUDED_SELECTOR =
    'header,footer,nav,aside,button,input,select,[role="navigation"],textarea,[role="textbox"]';

  function asElement(node) {
    if (!node) return null;
    if (node.nodeType === Node.ELEMENT_NODE) return node;
    return node.parentElement || null;
  }

  /**
   * Returns true when the provided node is inside a "hard excluded" UI region.
   * Used for complete-silence boundaries and content-zone rejection.
   */
  function isInHardExcludedUI(node) {
    const el = asElement(node);
    if (!el || typeof el.closest !== "function") return false;
    return !!el.closest(HARD_EXCLUDED_SELECTOR) || el.isContentEditable === true;
  }

  /**
   * Count words by splitting on whitespace.
   * - "Exactly 20 words" is inclusive and requires >= 20.
   */
  function countWords(text) {
    const trimmed = (text || "").trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }

  /**
   * Safely read the current selection range for the main document frame.
   * Returns null when selection is empty or range cannot be read.
   */
  function getSelectionRange() {
    try {
      const sel = window.getSelection && window.getSelection();
      if (!sel || sel.rangeCount === 0) return null;
      return sel.getRangeAt(0) || null;
    } catch {
      return null;
    }
  }

  /**
   * Gate that enforces the 20+ word minimum for the selection.
   */
  function selectionWordCountGate(range) {
    if (!range) return false;
    const selectionText = range.toString();
    return countWords(selectionText) >= WORD_MIN;
  }

  /**
   * Find the deepest ancestor element that qualifies as a "meaningful content zone"
   * for the given selection range.
   *
   * Heuristics (must all pass):
   * - both selection boundary nodes are inside the same candidate element
   * - candidate is not within hard excluded UI
   * - candidate has >= 20 words of text
   * - candidate has link/button density < 30% of all descendant elements
   */
  function findDeepestContentZone(range) {
    if (!range) return null;

    const startNode = range.startContainer;
    const endNode = range.endContainer;

    // Hard boundary: both selection boundaries must not be in excluded UI.
    if (isInHardExcludedUI(startNode) || isInHardExcludedUI(endNode)) return null;

    let candidate = asElement(startNode);
    if (!candidate) return null;

    // Walk deepest-first through ancestors.
    while (candidate) {
      const startInside = candidate.contains(startNode);
      const endInside = candidate.contains(endNode);

      if (startInside && endInside) {
        // Exclude any candidate that is inside excluded UI as well.
        if (!isInHardExcludedUI(candidate)) {
          const text = (candidate.innerText || candidate.textContent || "").trim();
          const wordCount = countWords(text);

          if (wordCount >= WORD_MIN) {
            const linkButtonCount = candidate.querySelectorAll("a,button").length;
            const totalElementCount = candidate.querySelectorAll("*").length;

            // Guard: if something is weird and returns 0, treat as non-qualifying.
            if (totalElementCount > 0) {
              const ratio = linkButtonCount / totalElementCount;
              if (ratio < 0.30) return candidate;
            }
          }
        }
      }

      candidate = candidate.parentElement;
    }

    return null;
  }

  // Expose helpers to `selection-listener.js` (loaded after this file).
  window.YoSelectionDetector = {
    WORD_MIN,
    HARD_EXCLUDED_SELECTOR,
    asElement,
    isInHardExcludedUI,
    countWords,
    getSelectionRange,
    selectionWordCountGate,
    findDeepestContentZone
  };
})();

