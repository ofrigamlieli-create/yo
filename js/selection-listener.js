// Selection listener + debounce + dispatch for the "Smart trigger" feature.
// No UI/widget, only dispatches `yo:selection-qualified` when conditions match.

(function () {
  const DETECTOR = window.YoSelectionDetector;
  if (!DETECTOR) return;

  const DISPATCH_EVENT = "yo:selection-qualified";
  const DEBOUNCE_MS = 200;

  let debounceTimer = null;
  let lastSelectionText = null;
  let lastContainerElement = null;

  function buildSerializableDetail(selectionText, wordCount, containerElement) {
    return {
      selectionText,
      wordCount,
      // Keep payload serializable across extension/page worlds.
      containerElement: {
        tagName: containerElement && containerElement.tagName ? containerElement.tagName.toLowerCase() : null,
        id: containerElement && containerElement.id ? containerElement.id : null,
        className: containerElement && containerElement.className ? String(containerElement.className) : "",
        role: containerElement && containerElement.getAttribute ? containerElement.getAttribute("role") : null
      }
    };
  }

  function dispatchQualifiedSelection(detail) {
    try {
      document.dispatchEvent(new CustomEvent(DISPATCH_EVENT, { detail }));
      return;
    } catch {
      // Fallback for environments with CustomEvent constructor quirks.
    }

    const event = document.createEvent("CustomEvent");
    event.initCustomEvent(DISPATCH_EVENT, false, false, detail);
    document.dispatchEvent(event);
  }

  function resetDedupCache() {
    lastSelectionText = null;
    lastContainerElement = null;
  }

  function scheduleCheck() {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(checkAndDispatch, DEBOUNCE_MS);
  }

  function checkAndDispatch() {
    try {
      const sel = window.getSelection && window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        resetDedupCache();
        return;
      }

      const range = sel.getRangeAt(0);
      if (!range || sel.isCollapsed) {
        resetDedupCache();
        return;
      }

      const selectionText = sel.toString() || "";
      if (!selectionText.trim()) {
        resetDedupCache();
        return;
      }

      const wordCount = DETECTOR.countWords(selectionText);
      if (wordCount < DETECTOR.WORD_MIN) return;

      const containerElement = DETECTOR.findDeepestContentZone(range);
      if (!containerElement) return;

      const isDistinct = selectionText !== lastSelectionText || containerElement !== lastContainerElement;
      if (!isDistinct) return;

      lastSelectionText = selectionText;
      lastContainerElement = containerElement;

      const detail = buildSerializableDetail(selectionText, wordCount, containerElement);
      dispatchQualifiedSelection(detail);
    } catch {
      // Complete silence: swallow errors to avoid console noise.
    }
  }

  document.addEventListener("selectionchange", scheduleCheck, false);
})();

