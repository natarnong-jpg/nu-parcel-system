const CACHE_NAME = 'nu-parcel-v1';
const ASSETS = [
  '/nu-parcel-system/',
  '/nu-parcel-system/index.html',
  '/nu-parcel-system/manifest.json'
];

// Install Event - เก็บ Cache หน้าเว็บและไฟล์สำคัญ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch Event - เมื่อมีการเรียกหน้าเว็บ ให้ใช้ Cache ก่อน ถ้าไม่มีค่อยดึงจาก Network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});