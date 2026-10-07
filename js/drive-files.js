/* =========================================
   TEDxUniversityofPiraeus — Live Drive files
   Polls the Apps Script feed (apps-script/Code.gs) and renders the
   shared Drive folder. New uploads appear without a reload, get a
   "NEW" badge and a toast; the tab title shows the unseen count.

   "New" = uploaded since this browser last opened the page
   (remembered in localStorage), so each visitor sees their own news.
   ========================================= */

// Paste the Web app "/exec" URL from the Apps Script deployment here.
const DRIVE_FEED_URL = 'PASTE_APPS_SCRIPT_EXEC_URL_HERE';

const POLL_MS = 30000;
const SEEN_KEY = 'driveFiles.lastSeen';

(() => {
  const root = document.getElementById('files-root');
  if (!root) return;

  const statusEl = document.getElementById('files-status');
  const countEl = document.getElementById('files-count');
  const baseTitle = document.title;

  let knownIds = null;         // ids from the previous poll (null = first load)
  let newIds = new Set();      // ids badged as NEW this session
  let lastSeen = readSeen();

  function readSeen() {
    try { return parseInt(localStorage.getItem(SEEN_KEY), 10) || 0; } catch { return 0; }
  }
  function writeSeen(ts) {
    try { localStorage.setItem(SEEN_KEY, String(ts)); } catch { /* private mode */ }
  }

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function fmtSize(bytes) {
    if (!bytes) return '';
    const u = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (bytes >= 1024 && i < u.length - 1) { bytes /= 1024; i++; }
    return `${bytes.toFixed(i ? 1 : 0)} ${u[i]}`;
  }

  function fmtDate(ts) {
    return new Date(ts).toLocaleString('el-GR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function kind(mime) {
    if (mime.startsWith('image/')) return 'IMG';
    if (mime.startsWith('video/')) return 'VIDEO';
    if (mime === 'application/pdf') return 'PDF';
    if (mime.includes('spreadsheet') || mime.includes('excel')) return 'SHEET';
    if (mime.includes('presentation') || mime.includes('powerpoint')) return 'SLIDES';
    if (mime.includes('document') || mime.includes('word')) return 'DOC';
    if (mime.includes('zip')) return 'ZIP';
    return 'FILE';
  }

  function card(f) {
    const isNew = newIds.has(f.id);
    const k = kind(f.mime);
    const preview = (k === 'IMG' || k === 'VIDEO' || k === 'PDF')
      ? `<img src="${esc(f.thumb)}" alt="" loading="lazy" onerror="this.remove()">`
      : '';
    return `
      <a class="file-card${isNew ? ' is-new' : ''}" href="${esc(f.url)}" target="_blank" rel="noopener" data-id="${esc(f.id)}">
        <div class="file-thumb"><span class="file-kind">${k}</span>${preview}</div>
        <div class="file-meta">
          ${isNew ? '<span class="file-new">NEW</span>' : ''}
          <span class="file-name">${esc(f.name)}</span>
          <span class="file-sub">${fmtDate(f.created)}${f.size ? ' · ' + fmtSize(f.size) : ''}</span>
        </div>
      </a>`;
  }

  function render(files) {
    if (!files.length) {
      root.innerHTML = '<p class="files-empty">Δεν υπάρχουν αρχεία ακόμα.</p>';
      return;
    }
    // Group by sub-folder, keeping newest-first order inside each group
    const groups = new Map();
    files.forEach(f => {
      const g = f.folder || '';
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(f);
    });
    root.innerHTML = [...groups].map(([name, list]) => `
      <section class="files-group">
        ${name ? `<h2 class="files-group-title">${esc(name)}</h2>` : ''}
        <div class="files-grid">${list.map(card).join('')}</div>
      </section>`).join('');
  }

  function toast(text) {
    const t = document.createElement('div');
    t.className = 'files-toast';
    t.setAttribute('role', 'status');
    t.textContent = text;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('show'));
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 6000);
  }

  function updateTitle() {
    document.title = newIds.size ? `(${newIds.size}) ${baseTitle}` : baseTitle;
  }

  async function poll() {
    try {
      const res = await fetch(DRIVE_FEED_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      const files = data.files || [];

      const fresh = knownIds === null
        // first load: anything uploaded since the last visit
        ? files.filter(f => lastSeen && f.created > lastSeen)
        // later polls: anything that wasn't there a moment ago
        : files.filter(f => !knownIds.has(f.id));

      fresh.forEach(f => newIds.add(f.id));
      knownIds = new Set(files.map(f => f.id));

      if (knownIds.size || fresh.length) render(files);
      else render([]);

      if (fresh.length) {
        toast(fresh.length === 1
          ? `Νέο αρχείο: ${fresh[0].name}`
          : `${fresh.length} νέα αρχεία στον φάκελο`);
      }

      updateTitle();
      if (countEl) countEl.textContent = files.length;
      if (statusEl) statusEl.textContent = `Live · τελευταίος έλεγχος ${new Date().toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;

      const newest = files.reduce((m, f) => Math.max(m, f.created), 0);
      if (newest) writeSeen(Math.max(newest, lastSeen));
    } catch (err) {
      if (statusEl) statusEl.textContent = 'Δεν ήταν δυνατή η σύνδεση με το Drive — νέα προσπάθεια σε λίγο';
      if (knownIds === null) root.innerHTML = '<p class="files-empty">Τα αρχεία δεν φορτώθηκαν.</p>';
    }
  }

  // Clear the tab counter once the visitor has actually looked
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) setTimeout(() => { newIds.size && (document.title = baseTitle); }, 3000);
  });

  poll();
  setInterval(poll, POLL_MS);
})();
