const CACHE_NAME = 'nu-parcel-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Install & Cache ไฟล์สแตติกตั้งต้น
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Clear แคชเก่าเมื่อมีการอัปเดตเวอร์ชัน
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. จัดการ Fetch Request
self.addEventListener('fetch', (event) => {
  const reqUrl = new URL(event.request.url);

  // 🔴 [Network Only] ถ้าเป็นการดึงข้อมูล Supabase ให้ข้าม SW และยิงตรงหา Cloud เสมอ
  if (reqUrl.hostname.includes('supabase.co')) {
    return; // ให้ Browser จัดการดึงจากเครือข่ายตรงๆ ไม่ยุ่งกับ Cache
  }

  // 🔵 [Stale-While-Revalidate] สำหรับไฟล์สแตติก (HTML, CSS, JS, Images)
  // ดึงไฟล์จาก Cache มาแสดงทันที + แอบยิงไปโหลดเวอร์ชันใหม่จาก Cloud มาอัปเดตทับใน Cache
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // อัปเดต Cache ด้วยไฟล์ใหม่จาก Cloud ถ้าดึงสำเร็จ
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // กรณีไม่มีเน็ต ให้ข้ามไปใช้ Cache ต่อไป
        });

        // คืนค่า Cache ออกไปแสดงผลก่อน (ถ้ามี) ถ้าไม่มีให้รอ Network
        return cachedResponse || fetchPromise;
      });
    })
  );
});