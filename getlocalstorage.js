(function () {
  // Readable version of getLocalStorageRF.js
  // Shows selected localStorage values and allows comparison with pasted JSON

  const storage = localStorage;

  const css = `
    *{box-sizing:border-box}
    .__backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.38);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);z-index:9998}
    .__p{position:fixed;left:50%;top:50%;width:90%;max-width:640px;height:auto;max-height:90vh;transform:translate(-50%,-50%);background:#0b0e14;color:#e5e7eb;font:12px ui-monospace,monospace;border:1px solid #1f2430;border-radius:8px;box-shadow:0 8px 24px rgba(2,6,23,0.6);overflow:hidden;z-index:9999}
    /* Use flex layout so header takes its space and textarea fills remaining height */
    .__w{position:relative;min-height:160px;padding-top:38px;display:flex;flex-direction:column}
    .__t{width:100%;flex:1;height:auto;min-height:120px;background:transparent;color:inherit;border:0;padding:14px;resize:vertical;outline:none;line-height:1.4;font-family:inherit;box-sizing:border-box;overflow:auto}

    /* Header / topbar */
    .__topbar{position:absolute;left:0;top:0;right:0;height:38px;display:flex;align-items:center;justify-content:space-between;padding:6px 12px;background:linear-gradient(180deg,rgba(255,255,255,0.02),transparent);border-bottom:1px solid rgba(255,255,255,0.03)}
    .__title{font-size:13px;color:#c7d2fe;opacity:0.95}
    .__actions{display:flex;gap:8px;align-items:center}
    .__btn{background:#111827;color:inherit;border:1px solid #1f2430;border-radius:6px;padding:6px 8px;font-size:12px;cursor:pointer}
    .__btn:hover{background:#131827}
    .__close{width:28px;height:28px;display:flex;align-items:center;justify-content:center}

    .__c{position:relative;width:26px;height:26px;border:1px solid #1f2430;border-radius:6px;background:#111827;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .__c:hover{background:#1f2937}

    .__toast{position:absolute;top:8px;right:48px;font-size:12px;padding:6px 10px;border-radius:6px;background:#1f2937;opacity:0;transform:translateY(-6px);transition:.2s}
    .__show{opacity:1;transform:none}
    .__diff{background:#120b0d}

    @media(min-width:640px){
      .__p{width:640px;left:50%;transform:translateX(-50%);border-radius:8px;overflow:hidden;height:320px}
      .__p.__bottom{top:calc(100% + 12px)}
    }
  `;

  const svg = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#c7d2fe" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /**
   * Create a UI box showing the provided value and label.
   * options: { showActions, closable }
   * Returns the outer container element so the caller can adjust it.
   */
  function createBox(value, label, options) {
    options = options || {};
    const container = document.createElement('div');
    const wrapper = document.createElement('div');
    const textarea = document.createElement('textarea');
    const copyBtn = document.createElement('button');
    const header = document.createElement('div');
    const toastEl = document.createElement('div');

    function showToast(message) {
      toastEl.textContent = message;
      toastEl.classList.add('__show');
      setTimeout(() => toastEl.classList.remove('__show'), 1400);
    }

    container.className = '__p';
    if (options.bottom) container.classList.add('__bottom');

    wrapper.className = '__w';
    textarea.className = '__t';
    copyBtn.className = '__c';
    header.className = '__topbar';
    toastEl.className = '__toast';

    // Header left (title)
    const title = document.createElement('div');
    title.className = '__title';
    title.textContent = label || '';

    // Action buttons
    const actions = document.createElement('div');
    actions.className = '__actions';

    // Copy button (icon-style)
    copyBtn.title = 'Salin ke clipboard';
    copyBtn.innerHTML = svg;
    copyBtn.onclick = () => navigator.clipboard.writeText(textarea.value)
      .then(() => showToast('Selesai.'));

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = '__btn __close';
    closeBtn.title = 'Tutup';
    closeBtn.textContent = '✕';
    closeBtn.onclick = () => container.remove();

    // Download button
    const downloadBtn = document.createElement('button');
    downloadBtn.className = '__btn';
    downloadBtn.textContent = 'Download';
    downloadBtn.onclick = () => {
      const blob = new Blob([textarea.value], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = (options.filename || 'data') + '.json';
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      showToast('Berhasil.');
    };

    // Compose header (compare removed)
    actions.append(copyBtn, downloadBtn, closeBtn);

    header.append(title, actions);

    // Body
    textarea.value = value || '';
    textarea.readOnly = true;



    // Append elements
    wrapper.append(header, textarea, toastEl);
    container.append(wrapper);
    document.body.appendChild(container);

    // Expose some controls via dataset for external wiring
    container._controls = { textarea, copyBtn, downloadBtn, closeBtn, showToast };

    return container;
  }

  const localData = {
    user_id: storage.getItem('user_id'),
    session_id: storage.getItem('session_id'),
    uuid: storage.getItem('uuid')
  };

  const localDataJson = JSON.stringify(localData, null, 2);

  // Create top box with Download/Close actions (compare removed)
  const topBox = createBox(localDataJson, 'LocalStorage', { filename: 'localStorage' });
  // Center the box on screen
  topBox.style.left = '50%';
  topBox.style.top = '50%';
  topBox.style.transform = 'translate(-50%, -50%)';

  // Add a fullscreen blurred backdrop behind the modal
  const backdrop = document.createElement('div');
  backdrop.className = '__backdrop';
  document.body.appendChild(backdrop);

  // Clicking the backdrop removes both backdrop and the modal
  backdrop.addEventListener('click', () => { backdrop.remove(); topBox.remove(); });

  // Ensure the modal's close button also removes the backdrop
  if (topBox._controls && topBox._controls.closeBtn) {
    const originalClose = topBox._controls.closeBtn.onclick;
    topBox._controls.closeBtn.onclick = () => { backdrop.remove(); if (typeof originalClose === 'function') originalClose(); };
  }

  // Compare functionality removed — this tool now only shows local storage and allows copy/download/close.
})();
