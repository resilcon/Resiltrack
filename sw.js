/* Service worker do app Resiltrack. Sempre busca na rede (os dados vêm ao vivo do Supabase);
   guarda só a última versão da tela e dos ícones para o app abrir mesmo sem internet. Não mexe no Escritório Virtual (tem o próprio). */
const CACHE = 'resiltrack-v1';
const ARQ = ['./', 'index.html', 'manifest.webmanifest', 'resiltrack-icon-192.png', 'resiltrack-icon-512.png', 'resiltrack-icon-maskable-512.png', 'resiltrack-apple-touch-180.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQ)).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('resiltrack-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || /escritorio/i.test(u.pathname)) return;
  const tela = e.request.mode === 'navigate';
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && (tela || ARQ.some(a => u.pathname.endsWith('/' + a.replace('./', ''))))) { const c = r.clone(); caches.open(CACHE).then(x => x.put(tela ? 'index.html' : e.request, c)); }
    return r;
  }).catch(() => caches.match(tela ? 'index.html' : e.request).then(r => r || caches.match('./'))));
});
