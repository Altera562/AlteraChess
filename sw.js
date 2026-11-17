const V='chess-v3',F=['./','index.html','style.css','engine.js','bot.js','app.js','manifest.webmanifest','icon-192.png','icon-512.png','move.mp3','capture.mp3','check.mp3','promote.mp3'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(F)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
e.respondWith(caches.match(e.request).then(r=>{const n=fetch(e.request).then(res=>{if(res.ok){const c=res.clone();caches.open(V).then(x=>x.put(e.request,c))}return res}).catch(()=>r);return r||n}))});
