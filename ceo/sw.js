/**
 * STEADY ECO — COMMAND CENTRE SERVICE WORKER
 * Cache-first for app shell. Network-first for data.
 * Relative paths for subdirectory deployment.
 */

const CACHE_APP = 'se-command-v2'

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
  event.waitUntil(
    caches.open(CACHE_APP).then(cache => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_APP).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const { request } = event
  if (request.method !== 'GET') return

  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_APP).then(cache => cache.put(request, clone))
        }
        return response
      }).catch(() => cached || new Response(
        '<html><body style="background:#0a0f0a;color:#e8ede6;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center"><div><h1 style="font-size:24px;margin-bottom:16px">You\'re offline</h1><p style="color:#7a8f76">Steady Eco will reconnect when you\'re back online.</p></div></body></html>',
        { headers: { 'Content-Type': 'text/html' } }
      ))
      return cached || fetchPromise
    })
  )
})

self.addEventListener('sync', event => {
  if (event.tag === 'sync-mutations') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SYNC_REQUESTED' }))
      })
    )
  }
})
