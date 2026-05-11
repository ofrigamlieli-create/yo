window.KaniWidgetShadow = {
  create() {
    const hostEl = document.createElement('div');
    hostEl.id = 'kani-widget-host';
    hostEl.style.cssText = 'position:fixed;z-index:2147483647;display:none;';
    const shadowRoot = hostEl.attachShadow({ mode: 'closed' });
    return { hostEl, shadowRoot };
  },

  injectStyles(shadowRoot) {
    return fetch(chrome.runtime.getURL('css/widget.css'))
      .then(r => r.text())
      .then(css => {
        const style = document.createElement('style');
        style.textContent = css;
        shadowRoot.appendChild(style);
      });
  }
};
