import { Address } from './address.model';

export interface User {
  id: string;
  name: string;
  email: string;
  addresses: Address[];
}
