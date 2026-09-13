if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // ระบุเป็น path String ตรงๆ เพื่อไม่ให้ Parcel แปลงเป็น Blob
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW Registered successfully!', reg))
      .catch(err => console.error('SW Registration failed:', err));
  });
}