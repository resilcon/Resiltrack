/* Service worker do app Escritório Virtual (escopo: ./escritorio). Sempre busca na rede; guarda a última versão só para abrir sem internet. */
const CACHE='escritorio-v2',ARQ=['escritorio.html','escritorio.webmanifest','escritorio-icon-192.png','escritorio-icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQ)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok&&ARQ.some(a=>u.pathname.endsWith('/'+a))){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return r;}).catch(()=>caches.match(e.request)));});

/* Notificações (Web Push) */
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{};}catch(_){d={corpo:e.data?e.data.text():''};}
  e.waitUntil(self.registration.showNotification(d.titulo||'Escritório Virtual',{body:d.corpo||'',icon:'escritorio-icon-192.png',badge:'escritorio-icon-192.png',tag:d.tag||undefined,data:{url:d.url||'escritorio.html'}}));});
self.addEventListener('notificationclick',e=>{e.notification.close();const u=new URL((e.notification.data&&e.notification.data.url)||'escritorio.html',self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{for(const c of cs){if(c.url.indexOf('escritorio')>=0&&'focus' in c)return c.focus();}return self.clients.openWindow(u);}));});
