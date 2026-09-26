/* =========================================
   TEDxUniversityofPiraeus — Partners
   Renders the partner wall, grouped by category.

   To add a partner: drop the logo in images/sponsors/
   (SVG preferred, otherwise a PNG ~800px wide with a
   transparent or white background — the tiles are white),
   then add one line to the right category below:

     { name: 'Company', logo: 'company.svg' }

   Optional fields per partner:
     note: 'Powerbanks'          → small caption under the name
     url:  'https://example.com' → makes the tile a link

   Optional fields per category:
     size: 'feature' | 'large'   → bigger tiles for top tiers
     note: '...'                 → intro line under the heading

   Category order on the page = order of this array.
   ========================================= */

const SPONSOR_CATEGORIES = [
  {
    id: 'strategic',
    label: 'Strategic Partner',
    size: 'feature',
    items: [
      { name: 'L’Oréal Hellas', logo: 'loreal-hellas.png' },
    ],
  },
  {
    id: 'gold',
    label: 'Gold Partner',
    size: 'large',
    items: [
      { name: 'Enerwave', logo: 'enerwave.png' },
    ],
  },
  {
    id: 'silver',
    label: 'Silver Partner',
    size: 'large',
    items: [
      { name: 'Hotel Grande Bretagne & King George', logo: 'grande-bretagne-king-george.png' },
    ],
  },
  {
    id: 'bronze',
    label: 'Bronze Partner',
    items: [
      { name: 'Neurosoft', logo: 'neurosoft.svg' },
    ],
  },
  {
    id: 'supporter',
    label: 'Supporter',
    items: [
      { name: 'WinMedica', logo: 'winmedica.png' },
    ],
  },
  {
    id: 'activities',
    label: 'Experience · Activities',
    note: 'The people making the breaks as good as the talks.',
    items: [
      { name: 'Sivissidis', logo: 'sivissidis.png', note: 'Table football' },
      { name: 'Zeus', logo: 'zeus.png', note: 'Powerbanks' },
    ],
  },
  {
    id: 'workshops',
    label: 'Experience · Workshops',
    note: 'Hands-on sessions running alongside the main stage.',
    items: [
      { name: 'L’Oréal Hellas', logo: 'loreal-hellas.png' },
      { name: 'Kuro Neko', logo: 'kuro-neko.png', note: 'Ceramics' },
      { name: 'Πειραϊκή Φυταγορά', logo: 'peiraiki-fytagora.png', note: 'Paint & Plant' },
      { name: 'Samba Coffee Roasters', logo: 'samba.png', note: 'Coffee' },
      { name: 'Tales of Ales', logo: 'tales-of-ales.jpg', note: 'Beer tasting' },
      { name: 'ΣΔΕ', logo: 'sde.png', note: 'Σύνδεσμος Διαφημιζομένων Ελλάδος' },
      { name: 'ΣΕΕ', logo: 'see.png', note: 'Συμβούλιο Ελέγχου Επικοινωνίας' },
      { name: 'Stardust Family Care', logo: 'stardust-family-care.png', note: 'Ψυχολογία' },
    ],
  },
  {
    id: 'giveaways',
    label: 'Giveaways',
    items: [
      { name: 'Athina Luxury Suites', logo: 'athina-suites.png' },
      { name: 'Rizes Gastro Taverna', logo: 'rizes.png' },
      { name: 'Fit Buddy', logo: 'fit-buddy.png' },
    ],
  },
  {
    id: 'in-kind',
    label: 'In-Kind Partners',
    note: 'Products and services that keep the day running.',
    items: [
      { name: 'Belino', logo: 'belino.png' },
      { name: 'Dentyne', logo: 'dentyne.png' },
      { name: 'Fit Buddy', logo: 'fit-buddy.png' },
      { name: 'GAEA', logo: 'gaea.png' },
      { name: 'L’Oréal Hellas', logo: 'loreal-hellas.png' },
      { name: 'Polis Hammam', logo: 'polis-hammam.png' },
      { name: 'Septona', logo: 'septona.png' },
      { name: 'Softex', logo: 'softex.png' },
      { name: 'Zeus', logo: 'zeus.png' },
    ],
  },
  {
    id: 'cooling',
    label: 'Cooling Partner',
    items: [
      { name: 'Frigostar', logo: 'frigostar.svg' },
    ],
  },
  {
    id: 'speakers-gifts',
    label: 'Speakers’ Gifts',
    items: [
      { name: 'GAEA', logo: 'gaea.png' },
      { name: 'L’Oréal Hellas', logo: 'loreal-hellas.png' },
      { name: 'Θεοφύλακτος', logo: 'theofylaktos.svg' },
    ],
  },
];

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function sponsorTile(item) {
  const name = escapeHtml(item.name);
  const note = item.note ? `<span class="spon-note">${escapeHtml(item.note)}</span>` : '';
  const inner = `
    <div class="spon-plate">
      <img src="images/sponsors/${encodeURI(item.logo)}" alt="${name}" loading="lazy" decoding="async">
    </div>
    <div class="spon-meta">
      <span class="spon-name">${name}</span>
      ${note}
    </div>
  `;

  return item.url
    ? `<a class="spon-tile" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${inner}</a>`
    : `<div class="spon-tile">${inner}</div>`;
}

function renderSponsors() {
  const root = document.getElementById('sponsors-root');
  if (!root) return;

  root.innerHTML = SPONSOR_CATEGORIES.map((cat, i) => `
    <section class="spon-cat spon-cat--${cat.size || 'normal'}" id="cat-${cat.id}">
      <header class="spon-cat-head reveal">
        <span class="spon-cat-num">${String(i + 1).padStart(2, '0')}</span>
        <h2 class="spon-cat-title">${escapeHtml(cat.label)}</h2>
        <span class="spon-cat-rule" aria-hidden="true"></span>
        <span class="spon-cat-count">${cat.items.length}</span>
      </header>
      ${cat.note ? `<p class="spon-cat-note reveal">${escapeHtml(cat.note)}</p>` : ''}
      <div class="spon-row stagger-group${cat.items.length === 1 ? ' spon-row--single' : ''}">
        ${cat.items.map(item => `<div class="reveal">${sponsorTile(item)}</div>`).join('')}
      </div>
    </section>
  `).join('');

  // Totals for the hero counters
  const companies = new Set();
  SPONSOR_CATEGORIES.forEach(c => c.items.forEach(i => companies.add(i.name)));

  const elCompanies = document.querySelector('[data-sponsor-count="companies"]');
  const elCategories = document.querySelector('[data-sponsor-count="categories"]');
  if (elCompanies) elCompanies.dataset.count = companies.size;
  if (elCategories) elCategories.dataset.count = SPONSOR_CATEGORIES.length;
}

document.addEventListener('DOMContentLoaded', renderSponsors);
