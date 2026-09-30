/* HA Views demo — serves background images for api/background/file|download (bundled ones from backgrounds/,
   uploaded ones from IndexedDB) and integration logos. All other requests go to the network as usual. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
const API = new URL('api/', self.registration.scope).pathname;
const fileFromDb = name => new Promise(resolve => {
  const r = indexedDB.open('ha-views-demo', 1);
  r.onupgradeneeded = () => r.result.createObjectStore('files');
  r.onerror = () => resolve(null);
  r.onsuccess = () => { try { const get = r.result.transaction('files').objectStore('files').get(name); get.onsuccess = () => resolve(get.result?.blob || null); get.onerror = () => resolve(null); } catch { resolve(null); } };
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== location.origin || !url.pathname.startsWith(API)) return;
  const path = url.pathname.slice(API.length);
  if (path === 'integration_icon') {
    const domain = url.searchParams.get('domain') || '';
    event.respondWith(Response.redirect(`https://brands.home-assistant.io/_/${encodeURIComponent(domain)}/dark_icon.png`, 302));
    return;
  }
  if (path !== 'background/file' && path !== 'background/download') return;
  const name = url.searchParams.get('name') || '';
  event.respondWith((async () => {
    const blob = await fileFromDb(name);
    const response = blob ? new Response(blob, { headers: { 'Content-Type': blob.type || 'image/png' } }) : await fetch(new URL(`backgrounds/${encodeURIComponent(name)}`, self.registration.scope));
    if (path === 'background/file' || !response.ok) return response;
    const headers = new Headers(response.headers); headers.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(name)}`);
    return new Response(await response.blob(), { headers });
  })());
});
