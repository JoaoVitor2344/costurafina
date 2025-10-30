import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  isSubscribed = signal(false);
  email = signal('');

  onSubscribe(event: Event): void {
    event.preventDefault();
    if (this.email().includes('@')) { // simple validation
      console.log(`Subscribing email: ${this.email()}`);
      this.isSubscribed.set(true);
    }
  }
}
