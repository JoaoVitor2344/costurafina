import { Component, ChangeDetectionStrategy, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

type AuthMode = 'login' | 'signup';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class AuthComponent {
  isOpen = input.required<boolean>();
  close = output<void>();
  loginSuccess = output<void>();

  authService = inject(AuthService);

  mode = signal<AuthMode>('login');
  error = signal<string | null>(null);
  isSubmitting = signal(false);

  setMode(newMode: AuthMode): void {
    this.mode.set(newMode);
    this.error.set(null);
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).id === 'auth-backdrop') {
      this.close.emit();
    }
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.isSubmitting.set(true);
    this.error.set(null);
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    let success = false;
    if (this.mode() === 'login') {
      success = this.authService.login(email, password);
      if (!success) {
        this.error.set('E-mail ou senha inválidos.');
      }
    } else {
      const name = formData.get('name') as string;
      success = this.authService.register(name, email, password);
       if (!success) {
        this.error.set('Por favor, preencha todos os campos.');
      }
    }
    
    setTimeout(() => { // Simulate network latency
        this.isSubmitting.set(false);
        if (success) {
            this.loginSuccess.emit();
        }
    }, 1000);
  }
}