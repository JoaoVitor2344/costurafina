import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<User | null>(null);

  isLoggedIn = computed(() => !!this.currentUser());

  // Mock login. In a real app, this would make an HTTP request.
  login(email: string, password: string): boolean {
    if (email && password) { // Simple validation
      // Simulate successful login with a static user for demo purposes
      const mockUser: User = {
        id: 'mock-user-123',
        name: 'Alex Silva', // Hardcoded name for simplicity
        email: email,
        addresses: [
          {
            id: 'addr-1',
            name: 'Alex Silva',
            address: 'Avenida Paulista, 123',
            city: 'São Paulo',
            postalCode: '01311-000'
          }
        ]
      };
      this.currentUser.set(mockUser);
      return true;
    }
    return false;
  }

  // Mock registration
  register(name: string, email: string, password: string): boolean {
     if (name && email && password) {
       const newUser: User = {
         id: `usr-${Date.now()}`,
         name: name,
         email: email,
         addresses: [],
       };
       this.currentUser.set(newUser);
       return true;
     }
     return false;
  }

  logout(): void {
    this.currentUser.set(null);
  }
  
  addAddress(address: Omit<Address, 'id'>): void {
    this.currentUser.update(user => {
      if (!user) return null;
      const newAddress: Address = {
        ...address,
        id: `addr-${Date.now()}`
      };
      return {
        ...user,
        addresses: [...user.addresses, newAddress]
      };
    });
  }

  deleteAddress(addressId: string): void {
    this.currentUser.update(user => {
      if (!user) return null;
      return {
        ...user,
        addresses: user.addresses.filter(a => a.id !== addressId)
      };
    });
  }
}