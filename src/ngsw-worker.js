self.addEventListener('install', (event) => {
    self.skipWaiting(); // Az új verzió telepítése
  });
  
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      clients.claim() // Az új verzióra való váltás
    );
  });
  
  // A service worker ellenőrzi, hogy új verzió érkezett-e
  self.addEventListener('controllerchange', () => {
    sendUpdateNotification();
  });
  
  // Üzenet küldése a fő szál felé, amikor új verzió érkezik
  function sendUpdateNotification() {
    self.clients.matchAll({ includeUncontrolled: true }).then((clients) => {
      clients.forEach(client => {
        client.postMessage('new-version'); // Küldjük az üzenetet a fő szálnak
      });
    });
  }
  