import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'tomoney';

  ngOnInit() {
    // Ha a böngésző támogatja a Service Worker-t
    if ('serviceWorker' in navigator) {
      // Hallgatunk az üzenetekre a Service Worker-től
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data === 'new-version') {
          // Az új verzió érkezett
          this.showUpdateNotification();
        }
      });
    }
  }

  // Az új verzióról értesítő üzenet
  showUpdateNotification() {
    // A felhasználónak megjelenítjük az üzenetet
    if (confirm('Új verzió érhető el! Kérjük, frissítse az alkalmazást.')) {
      window.location.reload(); // A felhasználó rákattintott a frissítésre, így frissítjük az oldalt
    }
  }
}
