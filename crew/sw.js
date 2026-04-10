/**
 * STEADY ECO — CREW PORTAL SERVICE WORKER
 * Offline-first. Relative paths for subdirectory deployment.
 */

const CACHE_APP = 'se-crew-v2'

const APP_SHELL = [
  './',
  './index.html',
  '../steady-eco-platform/shared/css/tokens.css',
  '../steady-eco-platform/shared/css/reset.css',
  '../steady-eco-platform/shared/css/typography.css',
  '../steady-eco-platform/shared/css/components.css',
  '../steady-eco-platform/shared/css/utilities.css',
]

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_APP).then(cache => cache.addAll(APP_SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_APP).map(k => caches.delete(k)))))
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response.ok) { const cl = response.clone(); caches.open(CACHE_APP).then(c => c.put(event.request, cl)) }
        return response
      }).catch(() => cached || new Response(
        '<html><body style="background:#0a0f0a;color:#e8ede6;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center"><div><h1 style="font-size:24px;margin-bottom:16px">You\'re offline</h1><p style="color:#7a8f76">Changes will sync when you\'re back online.</p></div></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      ))
      return cached || fetchPromise
    })
  )
})

self.addEventListener('sync', event => {
  if (event.tag === 'sync-crew-mutations') {
    event.waitUntil(self.clients.matchAll().then(clients => { clients.forEach(c => c.postMessage({ type: 'SYNC_REQUESTED' })) }))
  }
})
