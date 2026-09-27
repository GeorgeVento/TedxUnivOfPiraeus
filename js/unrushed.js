/* =========================================
   TEDxUniversityofPiraeus — Un-rushed page

   The trailer starts as a plain poster image ("facade"). The real
   YouTube player is only injected when someone actually clicks play,
   so the page doesn't load YouTube's scripts and cookies for every
   visitor who never watches it.

   To swap the trailer: change TRAILER_ID below and drop a new poster
   at images/unrushed/trailer-poster.jpg (grab it from
   https://img.youtube.com/vi/<VIDEO_ID>/maxresdefault.jpg).
   ========================================= */

const TRAILER_ID = 'fdyRlwINinQ';

document.addEventListener('DOMContentLoaded', () => {
  const player = document.getElementById('trailer-player');
  if (!player) return;

  const facade = player.querySelector('.trailer-facade');
  if (!facade) return;

  facade.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${TRAILER_ID}?autoplay=1&rel=0&modestbranding=1`;
    iframe.title = 'TEDxUniversityofPiraeus 2026 — Un-rushed trailer';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'eager';
    player.replaceChildren(iframe);
  }, { once: true });
});
