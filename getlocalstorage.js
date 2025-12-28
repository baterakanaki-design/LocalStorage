(function () {
  /**
   * 1. KONFIGURASI & DATA
   */
  const storage = localStorage;
  const SESSION_KEYS = {
    user_id: storage.getItem('user_id'),
    session_id: storage.getItem('session_id'),
    uuid: storage.getItem('uuid')
  };
  const jsonContent = JSON.stringify(SESSION_KEYS, null, 2);

  /**
   * 2. DESAIN UI (CSS)
   */
  const css = `
    /* Overlay Latar Belakang */
    .rf-backdrop {
      position: fixed; inset: 0; 
      background: rgba(2, 6, 23, 0.85); 
      backdrop-filter: blur(10px); 
      z-index: 9998; 
      animation: fadeIn 0.3s ease;
    }

    /* Kontainer Utama Modal */
    .rf-modal {
      position: fixed; left: 50%; top: 50%; 
      width: 90%; max-width: 480px; 
      transform: translate(-50%, -50%); 
      background: #0f172a; color: #f8fafc; 
      font-family: 'Inter', system-ui, sans-serif; 
      border: 1px solid rgba(255,255,255,0.1); 
      border-radius: 24px; 
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); 
      z-index: 9999; 
      overflow: hidden;
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Area Konten */
    .rf-content { padding: 24px; }
    .rf-header { margin-bottom: 16px; }
    .rf-title { font-size: 18px; font-weight: 700; color: #818cf8; }
    
    /* Editor / Textarea */
    .rf-textarea {
      width: 100%; height: 180px; 
      background: #1e293b; color: #38bdf8; 
      border: 1px solid rgba(255,255,255,0.05); 
      border-radius: 16px; 
      padding: 16px; 
      font-family: 'JetBrains Mono', monospace; 
      font-size: 13px; line-height: 1.5; 
      resize: none; outline: none;
    }

    /* Panel Tombol (Footer) */
    .rf-footer {
      display: flex; gap: 12px; 
      padding: 0 24px 24px;
    }

    .rf-btn {
      flex: 1; height: 48px; 
      display: flex; align-items: center; justify-content: center; gap: 8px;
      border: none; border-radius: 14px; 
      font-size: 14px; font-weight: 600; 
      cursor: pointer; transition: all 0.2s ease;
    }

    .rf-btn-primary { background: #4f46e5; color: white; }
    .rf-btn-primary:hover { background: #6366f1; transform: translateY(-2px); }
    
    .rf-btn-secondary { background: #334155; color: #f8fafc; }
    .rf-btn-secondary:hover { background: #475569; }

    .rf-btn-danger { flex: 0 0 48px; background: #ef4444; color: white; }
    .rf-btn-danger:hover { background: #f87171; }

    /* Notifikasi Toast */
    .rf-toast {
      position: absolute; bottom: 90px; left: 50%; 
      transform: translateX(-50%); 
      background: #10b981; color: white; 
      padding: 8px 20px; border-radius: 99px; 
      font-size: 12px; font-weight: 600;
      opacity: 0; transition: 0.3s; pointer-events: none;
    }
    .rf-toast.active { opacity: 1; transform: translateX(-50%) translateY(-10px); }

    /* Animasi */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { 
      from { opacity: 0; transform: translate(-50%, -40%); } 
      to { opacity: 1; transform: translate(-50%, -50%); } 
    }
  `;

  /**
   * 3. INJEKSI STYLE & MODAL
   */
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const backdrop = document.createElement('div');
  backdrop.className = 'rf-backdrop';
  
  const modal = document.createElement('div');
  modal.className = 'rf-modal';
  
  modal.innerHTML = `
    <div class="rf-content">
      <div class="rf-header">
        <div class="rf-title">Session Data</div>
      </div>
      <textarea class="rf-textarea" readonly>${jsonContent}</textarea>
    </div>
    <div class="rf-toast" id="rfToast">Berhasil Disalin!</div>
    <div class="rf-footer">
      <button class="rf-btn rf-btn-primary" id="btnCopy">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        Copy JSON
      </button>
      <button class="rf-btn rf-btn-secondary" id="btnDown">Download</button>
      <button class="rf-btn rf-btn-danger" id="btnClose" title="Close">✕</button>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(modal);

  /**
   * 4. LOGIKA FUNGSIONAL
   */
  const toast = document.getElementById('rfToast');
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 2000);
  };

  const closeUI = () => {
    backdrop.style.opacity = '0';
    modal.style.opacity = '0';
    setTimeout(() => { backdrop.remove(); modal.remove(); }, 300);
  };

  // Event Handlers
  document.getElementById('btnCopy').onclick = () => {
    navigator.clipboard.writeText(jsonContent).then(() => showToast('Salin Berhasil!'));
  };

  document.getElementById('btnDown').onclick = () => {
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'session_cloud.json';
    a.click();
    showToast('Mendownload...');
  };

  document.getElementById('btnClose').onclick = closeUI;
  backdrop.onclick = closeUI;

})();
