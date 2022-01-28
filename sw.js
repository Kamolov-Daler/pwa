const staticCacheName = 's-app-v3';
const dynamicCacheName = 'd-app-v3';

const assetUrls = [
    'https://progresive-web-app.netlify.app',
    '/js/app.js',
    '/css/style.css',
    '/icons/logo-16x16.png'
]

self.addEventListener('install', async(e) => {
    const cache = await caches.open(staticCacheName)
    await cache.addAll(assetUrls)

})

self.addEventListener('activate', async(e) => {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
        .filter(name => name !== staticCacheName && name !== dynamicCacheName)
        .map(name => caches.delete(name))
    ) 
})

self.addEventListener('fetch', e => {
    const {request} = e;
    
    const url = new URL(request.url);
    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(e.request))
    } else {
        e.respondWith(networkFirst(e.request))
    }
})


async function cacheFirst(req) {
    const cached = await caches.match(req);
    return cached ?? await fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open(dynamicCacheName);
    try {
        const response = await fetch(req);
        await cache.put(req, response.clone())
        return response;
    } catch(e) {
        const cached = await cache.match(req)
        return cached ?? await caches.match('/offline.html');
    }
} 