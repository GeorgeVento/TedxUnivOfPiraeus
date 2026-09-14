/* =========================================
   TEDxUniversityofPiraeus — TikTok Corner
   Renders a grid of TikTok video thumbnails.
   Each card loads the real (heavy) TikTok embed
   only when clicked, so the page doesn't open with
   12 simultaneous TikTok cookie-consent iframes.

   To add a new video: paste its numeric video ID below
   (open the TikTok link, the ID is the long number in the
   URL — https://www.tiktok.com/@.../video/THIS_NUMBER),
   give it a short caption, and drop a poster image at
   images/tiktok/<id>.jpg (grab it once via TikTok's oEmbed
   API's "thumbnail_url" field). No other changes needed.
   ========================================= */

const TIKTOK_VIDEOS = [
  { id: '7669954037390773526', caption: 'Δεν είστε έτοιμοι για αυτό 🤭' },
  { id: '7668373213889596694', caption: 'Η ομάδα θέλει νησάκι 🫣' },
  { id: '7667276307637538070', caption: 'Θες να μπεις στην ομάδα; 😊' },
  { id: '7664278604171185430', caption: 'TEDVlogakiii ep. 2 📸' },
  { id: '7662794072440065302', caption: 'Η αλήθεια πίσω από τους managers 🫣' },
  { id: '7662099915614588182', caption: 'Επικρατεί κατάσταση τρόμου 🙂‍↔️' },
  { id: '7660974436807380246', caption: 'Οι managers αγαπάνε τα meetings 🤭' },
  { id: '7659132535573597462', caption: 'Λίγο ακόμα πρόβα θέλει 😌' },
  { id: '7657595728667102486', caption: 'Συνεννοήθηκαν νομίζω 🙄' },
  { id: '7656477074625924374', caption: 'Οφείλαμε να κάνουμε και εμείς το trend' },
  { id: '7655363768339156227', caption: 'Μια ερωτησούλα έκανε μόνο 🤷🏼‍♀️' },
  { id: '7653927762654137622', caption: 'Κάτσε ρε συ τι με ρώτησες; 🤔' },
];

const TIKTOK_HANDLE = 'tedxuniversityofpiraeus';

function loadTikTokEmbed(card) {
  const id = card.dataset.videoId;
  const embedHost = card.querySelector('.tiktok-card-embed');
  embedHost.innerHTML = `
    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@${TIKTOK_HANDLE}/video/${id}" data-video-id="${id}" style="max-width: 325px; min-width: 220px;">
      <section></section>
    </blockquote>
  `;

  const existing = document.getElementById('tiktok-embed-script');
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = 'tiktok-embed-script';
  script.src = 'https://www.tiktok.com/embed.js';
  script.async = true;
  document.body.appendChild(script);
}

function renderTikTokCorner() {
  const grid = document.getElementById('tiktok-grid');
  if (!grid) return;

  grid.innerHTML = TIKTOK_VIDEOS.map((v) => `
    <div class="tiktok-card" data-video-id="${v.id}">
      <button type="button" class="tiktok-card-embed tiktok-card-facade" aria-label="Αναπαραγωγή βίντεο TikTok">
        <img src="images/tiktok/${v.id}.jpg" alt="" loading="lazy">
        <span class="tiktok-play-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </span>
      </button>
      <div class="tiktok-card-caption">${v.caption}</div>
    </div>
  `).join('');

  grid.querySelectorAll('.tiktok-card-facade').forEach((btn) => {
    btn.addEventListener('click', () => loadTikTokEmbed(btn.closest('.tiktok-card')), { once: true });
  });
}

document.addEventListener('DOMContentLoaded', renderTikTokCorner);
