/**
 * STEADY ECO — CLIENT PORTAL SERVICE WORKER
 * Relative paths for subdirectory deployment.
 */

const CACHE = 'se-client-v2'

const SHELL = ['./', './index.html']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    caches.match(e.request).then(c =>
      fetch(e.request).then(r => {
        if (r.ok) { const cl = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, cl)) }
        return r
      }).catch(() => c || new Response(
        '<html><body style="background:#0a0f0a;color:#e8ede6;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center"><div><h1 style="font-size:24px;margin-bottom:16px">You\'re offline</h1><p style="color:#7a8f76">This page will load when you\'re back online.</p></div></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      ))
    )
  )
})
