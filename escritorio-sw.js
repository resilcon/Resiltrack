/* Service worker do app Escritório Virtual (escopo: ./escritorio). Sempre busca na rede; guarda a última versão só para abrir sem internet. */
const CACHE='escritorio-v1',ARQ=['escritorio.html','escritorio.webmanifest','escritorio-icon-192.png','escritorio-icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQ)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok&&ARQ.some(a=>u.pathname.endsWith('/'+a))){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return r;}).catch(()=>caches.match(e.request)));});
