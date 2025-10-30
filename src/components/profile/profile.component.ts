import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ProfileComponent {
  isOpen = input.required<boolean>();
  close = output<void>();
  orderHistoryClicked = output<void>();
  supportClicked = output<void>();
  addressBookClicked = output<void>();

  authService = inject(AuthService);

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'profile-backdrop') {
      this.close.emit();
    }
  }

  onOrderHistory(): void {
    this.orderHistoryClicked.emit();
  }

  onSupport(): void {
    this.supportClicked.emit();
  }

  onAddressBook(): void {
    this.addressBookClicked.emit();
  }
  
  logout(): void {
    this.authService.logout();
    this.close.emit();
  }
}
