/* =========================================
   TEDxUniversityofPiraeus — Drive folder feed
   Google Apps Script web app that lists the files of one shared
   Drive folder as JSON. files.html polls it to show new uploads live.

   Setup (once):
     1. https://script.google.com → New project → paste this file.
     2. Set FOLDER_ID below (the long id at the end of the folder URL:
        drive.google.com/drive/folders/<FOLDER_ID>).
     3. Deploy → New deployment → type "Web app"
          Execute as:     Me
          Who has access: Anyone
        Authorize, then copy the "/exec" URL into js/drive-files.js
        (DRIVE_FEED_URL).
     4. Make the folder's files viewable by visitors: Share the folder →
        General access → "Anyone with the link" (Viewer). Otherwise the
        list shows up but visitors can't open/download the files.

   After editing this script: Deploy → Manage deployments → edit →
   Version "New version" — the /exec URL stays the same.
   ========================================= */

const FOLDER_ID = 'PASTE_FOLDER_ID_HERE';

// Also list files inside sub-folders (the sub-folder name is returned
// as "folder" so the page can group them).
const INCLUDE_SUBFOLDERS = true;

// Short cache so many visitors polling at once don't hit Drive every time.
const CACHE_SECONDS = 20;

function doGet() {
  const cache = CacheService.getScriptCache();
  let body = cache.get('feed');

  if (!body) {
    const root = DriveApp.getFolderById(FOLDER_ID);
    const files = [];
    collect_(root, '', files);
    files.sort((a, b) => b.created - a.created);
    body = JSON.stringify({ folder: root.getName(), updated: Date.now(), files });
    // CacheService caps values at 100KB — skip caching rather than fail
    if (body.length < 100000) cache.put('feed', body, CACHE_SECONDS);
  }

  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

function collect_(folder, path, out) {
  const it = folder.getFiles();
  while (it.hasNext()) {
    const f = it.next();
    if (f.isTrashed()) continue;
    const id = f.getId();
    out.push({
      id,
      name: f.getName(),
      mime: f.getMimeType(),
      size: f.getSize(),
      created: f.getDateCreated().getTime(),
      modified: f.getLastUpdated().getTime(),
      folder: path,
      url: f.getUrl(),
      thumb: 'https://drive.google.com/thumbnail?id=' + id + '&sz=w600',
    });
  }

  if (!INCLUDE_SUBFOLDERS) return;
  const subs = folder.getFolders();
  while (subs.hasNext()) {
    const sub = subs.next();
    collect_(sub, path ? path + ' / ' + sub.getName() : sub.getName(), out);
  }
}
