// โค้ดสำหรับจัดการ Cache หรือรองรับ Offline
self.addEventListener('install', (event) => {
  console.log('Service Worker installed!');
});

self.addEventListener('fetch', (event) => {
  // รับ request ต่างๆ ของหน้าเว็บ
});