/* =========================================
   TEDxUniversityofPiraeus — TikTok Corner
   Renders a grid of official TikTok embeds.

   To add a new video: paste its numeric video ID below
   (open the TikTok link, the ID is the long number in the
   URL — https://www.tiktok.com/@.../video/THIS_NUMBER) and
   give it a short caption. No other changes needed.
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

function renderTikTokCorner() {
  const grid = document.getElementById('tiktok-grid');
  if (!grid) return;

  grid.innerHTML = TIKTOK_VIDEOS.map((v, i) => `
    <div class="tiktok-card">
      <div class="tiktok-card-embed">
        <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@${TIKTOK_HANDLE}/video/${v.id}" data-video-id="${v.id}" style="max-width: 325px; min-width: 220px;">
          <section></section>
        </blockquote>
      </div>
      <div class="tiktok-card-caption">${v.caption}</div>
    </div>
  `).join('');

  // (re)inject the official embed script so it picks up the fresh blockquotes
  const existing = document.getElementById('tiktok-embed-script');
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.id = 'tiktok-embed-script';
  script.src = 'https://www.tiktok.com/embed.js';
  script.async = true;
  document.body.appendChild(script);
}

document.addEventListener('DOMContentLoaded', renderTikTokCorner);
