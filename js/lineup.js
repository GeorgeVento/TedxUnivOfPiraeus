/* =========================================
   TEDxUniversityofPiraeus — Line-up & Workshops

   ┌───────────────────────────────────────────────────────────────┐
   │  ΓΙΑ ΝΑ ΠΡΟΣΘΕΣΕΙΣ ΑΤΟΜΟ: μία γραμμή στη σωστή λίστα κάτω.    │
   │  ΓΙΑ ΝΑ ΑΦΑΙΡΕΣΕΙΣ: σβήσε τη γραμμή. Τίποτα άλλο.             │
   │  Ο κώδικας από κάτω δεν χρειάζεται να αγγιχτεί ποτέ.          │
   └───────────────────────────────────────────────────────────────┘

   Κάθε άτομο θέλει 2 αρχεία στο images/lineup/ :
       <slug>.webp        η φωτογραφία   (cut-out, ~760px ύψος)
       <slug>-name.png    το όνομα σε χειρόγραφο banner
   Αν λείπει το banner, εμφανίζεται αυτόματα το όνομα ως κείμενο.
   Αν λείπει η φωτογραφία, η κάρτα γίνεται "Announcing Soon".

   Οι αριθμοί (2 Hosts, 7 Speakers…) υπολογίζονται μόνοι τους.
   ========================================= */

const LINEUP = {

  hosts: [
    // { slug: 'onoma-eponymo', name: 'Όνομα Επώνυμο' },
  ],

  backstageHosts: [
    { slug: 'panos-skoufezis', name: 'Πάνος Σκουφέζης' },
    { slug: 'louisa-piccuto',  name: 'Louisa Piccuto' },
  ],

  speakers: [
    { slug: 'anastasia-ntragkomirova', name: 'Αναστασία Ντραγκομίροβα' },
    { slug: 'angelina-sourlantzi',     name: 'Αγγελίνα Σουρλαντζή' },
    { slug: 'apostolos-chouliaras',    name: 'Απόστολος Χουλιάρας' },
    { slug: 'marina-fasaki',           name: 'Μαρίνα Φασάκη' },
    { slug: 'lazaros-thomas',          name: 'Λάζαρος Θωμάς' },
    { slug: 'erato-tsairi',            name: 'Ερατώ Τσαΐρη' },
    { slug: 'charis-tremetousiotis',   name: 'Χάρης Τρεμετουσιώτης' },
  ],

  performances: [
    { slug: 'marilena-anastasiadou', name: 'Μαριλένα Αναστασιάδου' },
  ],

  workshopHosts: [
    // { slug: 'onoma-eponymo', name: 'Όνομα Επώνυμο' },
  ],
};

/* Τα workshops της σελίδας Agenda — μία γραμμή το καθένα.
   Όσα δεν έχουν μπει ακόμα εμφανίζονται ως "Coming Soon". */
const WORKSHOPS = [
  // { by: 'Όνομα Επώνυμο', title: 'Τίτλος Workshop', about: 'Μια πρόταση περιγραφής.', meta: '90 λεπτά · 20 θέσεις' },
];

/* ═════════════════════════════════════════
   Από εδώ και κάτω δεν χρειάζεται αλλαγή.
   ═════════════════════════════════════════ */

/* `slots` = πόσες κάρτες να δείχνει ΤΟ ΛΙΓΟΤΕΡΟ.
   Αν τα άτομα είναι λιγότερα, η διαφορά γεμίζει με "Announcing Soon".
   Αν είναι περισσότερα, μπαίνουν όλα. slots: 0 = δείξε μόνο όσους υπάρχουν.
   Ομάδα χωρίς καμία κάρτα κρύβεται εντελώς. */
const LINEUP_GROUPS = [
  { key: 'hosts',          art: 'host',            label: 'Hosts',           one: 'Host',        many: 'Hosts',        slots: 2 },
  { key: 'backstageHosts', art: 'backstage-hosts', label: 'Backstage Hosts', one: 'Host',        many: 'Hosts',        slots: 2 },
  { key: 'speakers',       art: 'speakers',        label: 'Speakers',        one: 'Speaker',     many: 'Speakers',     slots: 0 },
  { key: 'performances',   art: 'performance',     label: 'Performances',    one: 'Performance', many: 'Performances', slots: 1 },
  { key: 'workshopHosts',  art: 'workshops',       label: 'Workshops',       one: 'Workshop',    many: 'Workshops',    slots: 4 },
];

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function personCard(p) {
  return `
        <article class="lineup-card reveal">
          <div class="lineup-photo">
            <img src="images/lineup/${esc(p.slug)}.webp" alt="${esc(p.name)}" loading="lazy">
          </div>
          <div class="lineup-info">
            <div class="lineup-name wordmark">
              <img class="wordmark-img" src="images/lineup/${esc(p.slug)}-name.png" alt="${esc(p.name)}">
              <span class="wordmark-text">${esc(p.name)}</span>
            </div>
          </div>
        </article>`;
}

function slotCard(label, n) {
  const num = String(n).padStart(2, '0');
  return `
        <article class="lineup-card is-soon reveal">
          <div class="lineup-photo"><svg width="34" height="34"><use href="#icon-user"></use></svg></div>
          <div class="lineup-info">
            <div class="lineup-name">${esc(label)} ${num}</div>
            <div class="lineup-role"><span class="soon-dot"></span>Announcing Soon</div>
          </div>
        </article>`;
}

function renderLineup() {
  const host = document.getElementById('lineup-groups');
  if (!host) return;

  let n = 0;
  host.innerHTML = LINEUP_GROUPS.map((g) => {
    const people = LINEUP[g.key] || [];
    const pad = Math.max(0, (g.slots || 0) - people.length);
    if (people.length + pad === 0) return '';   // empty group: hide it entirely
    const i = n++;
    const cards = people.map(personCard)
      .concat(Array.from({ length: pad }, (_, k) => slotCard(g.one, people.length + k + 1)))
      .join('\n');

    const total = people.length + pad;
    const count = pad === 0
      ? `${total} ${total === 1 ? g.one : g.many}`
      : `${total} ${total === 1 ? 'Slot' : 'Slots'}`;

    const note = g.key === 'workshopHosts'
      ? `\n      <p class="lineup-group-note">Times and rooms for each workshop are on the <a href="agenda.html#workshops">agenda</a>.</p>`
      : '';

    return `
    <div class="lineup-group reveal">
      <div class="lineup-group-header">
        <div class="lineup-group-number">${String(i + 1).padStart(2, '0')}</div>
        <h3 class="lineup-group-name wordmark">
          <img class="wordmark-img" src="images/wordmarks/${g.art}.png" alt="${esc(g.label)}">
          <span class="wordmark-text">${esc(g.label)}</span>
        </h3>
        <div class="lineup-group-count">${count}</div>
      </div>
      <div class="lineup-grid stagger-group">${cards}
      </div>${note}
    </div>`;
  }).join('\n');
}

function renderWorkshops() {
  const host = document.getElementById('workshops-grid');
  if (!host) return;

  const SLOTS = 4;
  const pad = Math.max(0, SLOTS - WORKSHOPS.length);
  const total = WORKSHOPS.length + pad;

  host.innerHTML = WORKSHOPS.map((w, i) => `
      <article class="workshop-card reveal">
        <div class="workshop-index">${String(i + 1).padStart(2, '0')}</div>
        <div class="workshop-eyebrow">${esc(w.by)}</div>
        <h3 class="workshop-title">${esc(w.title)}</h3>
        <p class="workshop-desc">${esc(w.about)}</p>
        <div class="workshop-meta">${esc(w.meta || '')}</div>
      </article>`)
    .concat(Array.from({ length: pad }, (_, k) => {
      const n = String(WORKSHOPS.length + k + 1).padStart(2, '0');
      return `
      <article class="workshop-card is-soon reveal">
        <div class="workshop-index">${n}</div>
        <div class="workshop-eyebrow">Facilitator TBA</div>
        <h3 class="workshop-title">Coming Soon</h3>
        <p class="workshop-desc">This workshop is being finalized — topic and facilitator announced soon.</p>
        <div class="workshop-meta"><span class="soon-dot"></span>Announcing Soon</div>
      </article>`;
    }))
    .join('\n');

  const count = document.querySelector('.workshops-group-count');
  if (count) {
    count.textContent = pad === 0
      ? `${total} ${total === 1 ? 'Workshop' : 'Workshops'}`
      : `${total} ${total === 1 ? 'Slot' : 'Slots'}`;
  }
}

// Runs before main.js, so its reveal/stagger observers pick up these cards.
document.addEventListener('DOMContentLoaded', () => {
  renderLineup();
  renderWorkshops();
});
