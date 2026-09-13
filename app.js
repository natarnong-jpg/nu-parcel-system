if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // ใช้ new URL(...) เพื่อบอกให้ Parcel รู้ว่านี่คือไฟล์ภายนอก ไม่ต้องแปลงเป็น Blob
    navigator.serviceWorker.register(
      new URL('./sw.js', import.meta.url), 
      { type: 'module' }
    )
    .then(reg => console.log('SW Registered successfully:', reg))
    .catch(err => console.error('SW Registration failed:', err));
  });
}