(function () {
  const storage = localStorage;

  const css = `
    .__backdrop { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.8); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 9998; transition: all 0.3s; }
    .__p { position: fixed; left: 50%; top: 50%; width: 90%; max-width: 500px; transform: translate(-50%, -50%); background: #0f172a; color: #f8fafc; font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); overflow: hidden; z-index: 9999; animation: modalIn 0.3s ease-out; }
    
    .__w { display: flex; flex-direction: column; height: 100%; }
    
    /* Header */
    .__header { padding: 20px 24px 10px; display: flex; align-items: center; justify-content: space-between; }
    .__title { font-size: 16px; font-weight: 600; color: #818cf8; letter-spacing: -0.01em; }
    
    /* Textarea Area */
    .__t_container { padding: 0 24px; margin-top: 10px; }
    .__t { width: 100%; height: 160px; background: #1e293b; color: #38bdf8; border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 13px; line-height: 1.6; outline: none; resize: none; }
    
    /* Footer Actions (Tombol di Bawah) */
    .__footer { padding: 20px 24px 24px; display: flex; gap: 10px; align-items: center; }
    .__btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; height: 40px; background: #334155; color: #f8fafc; border: none; border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .__btn:hover { background: #475569; transform: translateY(-1px); }
    .__btn_primary { background: #4f46e5; }
    .__btn_primary:hover { background: #6366f1; }
    .__btn_close { flex: 0 0 40px; background: #ef4444; color: white; }
    .__btn_close:hover { background: #f87171; }

    .__toast { position: absolute; bottom: 85px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; opacity: 0; transition: 0.3s; pointer-events: none; }
    .__toast.__show { opacity: 1; transform: translateX(-50%) translateY(-10px); }

    @keyframes modalIn { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }
  `;

  // Inject Styles
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // Data LocalStorage
  const localData = {
    user_id: storage.getItem('user_id'),
    session_id: storage.getItem('session_id'),
    uuid: storage.getItem('uuid')
  };
  const jsonContent = JSON.stringify(localData, null, 2);

  // Create UI
  const backdrop = document.createElement('div');
  backdrop.className = '__backdrop';
  
  const modal = document.createElement('div');
  modal.className = '__p';
  
  modal.innerHTML = `
    <div class="__w">
      <div class="__header">
        <div class="__title">LocalStorage Data</div>
      </div>
      <div class="__t_container">
        <textarea class="__t" readonly>${jsonContent}</textarea>
      </div>
      <div class="__toast" id="rf_toast">Copied to clipboard!</div>
      <div class="__footer">
        <button class="__btn __btn_primary" id="rf_copy">
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          Copy JSON
        </button>
        <button class="__btn" id="rf_down">Download</button>
        <button class="__btn __btn_close" id="rf_close" title="Close">✕</button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(modal);

  // Functionality
  const toast = document.getElementById('rf_toast');
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('__show');
    setTimeout(() => toast.classList.remove('__show'), 2000);
  };

  const closeAll = () => { backdrop.remove(); modal.remove(); };

  document.getElementById('rf_copy').onclick = () => {
    navigator.clipboard.writeText(jsonContent).then(() => showToast('Copied Successfully!'));
  };

  document.getElementById('rf_down').onclick = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'session_rf.json';
    a.click();
    showToast('Download Started!');
  };

  document.getElementById('rf_close').onclick = closeAll;
  backdrop.onclick = closeAll;

})();
