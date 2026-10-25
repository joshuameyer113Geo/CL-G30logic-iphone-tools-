// G30 Logic Field Geology - service worker v0.3: app, compass and saved map tiles work offline
const APP='g30-app-v3', TILES='g30-tiles';
const CORE=['./','index.html','compass.html','export.js','manifest.json',
 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
 'https://unpkg.com/proj4@2.11.0/dist/proj4.js','https://unpkg.com/@turf/turf@6.5.0/turf.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(APP).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('g30-app')&&k!==APP).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const u=e.request.url;
 if(e.request.method!=='GET'||u.includes('api.anthropic.com'))return;
 const isTile=/\/tile\/|tile\.opentopomap/.test(u);
 e.respondWith(caches.match(e.request,{ignoreVary:true,ignoreSearch:!isTile}).then(hit=>hit||fetch(e.request).then(r=>{
  if(r.ok){const copy=r.clone();caches.open(isTile?TILES:APP).then(c=>c.put(e.request,copy))}
  return r;
 }).catch(()=>new Response('',{status:504}))));
});
