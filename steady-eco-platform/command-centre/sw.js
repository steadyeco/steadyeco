/**
 * STEADY ECO — COMMAND CENTRE SERVICE WORKER
 * Network-first for HTML (prevents iOS white-screen).
 * Cache-first for static assets (CSS, fonts, images).
 * Relative paths for subdirectory deployment.
 */

const CACHE_APP = 'se-command-v3'

const APP_SHELL = [
  '../shared/css/tokens.css',
  '../shared/css/reset.css',
  '../shared/css/typography.css',
  '../shared/css/components.css',
  '../shared/css/utilities.css',
]

const OFFLINE_HTML = '<html><body style="background:#0a0f0a;color:#e8ede6;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center"><div><h1 style="font-size:24px;margin-bottom:16px">You\'re offline</h1><p style="color:#7a8f76">Steady Eco will reconnect when you\'re back online.</p><p style="margin-top:16px"><button onclick="location.reload()" style="background:#4a9e3f;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-size:16px;cursor:pointer">Try Again</button></p></div></body></html>'

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

  // HTML navigation requests: NETWORK-FIRST (fixes iOS white screen)
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_APP).then(cache => cache.put(request, clone))
        }
        return response
      }).catch(() =>
        caches.match(request).then(cached =>
          cached || new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html' } })
        )
      )
    )
    return
  }

  // Static assets: stale-while-revalidate
  event.respondWith(
    caches.match(request).then(cached => {
      const fetchPromise = fetch(request).then(response => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_APP).then(cache => cache.put(request, clone))
        }
        return response
      }).catch(() => cached)
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
