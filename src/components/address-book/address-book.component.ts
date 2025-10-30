import { Component, ChangeDetectionStrategy, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AddressBookComponent {
  isOpen = input.required<boolean>();
  close = output<void>();

  authService = inject(AuthService);

  isAdding = signal(false);

  // Form state
  name = signal('');
  address = signal('');
  city = signal('');
  postalCode = signal('');
  
  startAddNewAddress(): void {
    const user = this.authService.currentUser();
    this.name.set(user?.name || '');
    this.address.set('');
    this.city.set('');
    this.postalCode.set('');
    this.isAdding.set(true);
  }

  cancelAddNewAddress(): void {
    this.isAdding.set(false);
  }

  saveAddress(event: Event): void {
    event.preventDefault();
    if (this.name() && this.address() && this.city() && this.postalCode()) {
      this.authService.addAddress({
        name: this.name(),
        address: this.address(),
        city: this.city(),
        postalCode: this.postalCode()
      });
      this.isAdding.set(false);
    }
  }
}
