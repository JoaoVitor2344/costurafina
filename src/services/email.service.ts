// Implemented EmailService to replace placeholder content.
import { Injectable } from '@angular/core';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  
  sendOrderConfirmation(user: User, order: Order): void {
    // In a real application, this would use an HTTP client to send an email via a backend service.
    // For this demo, we'll just log to the console.
    console.log('--- Confirmação de Email ---');
    console.log(`Para: ${user.email}`);
    console.log(`De: vendas@costurafina.com`);
    console.log(`Assunto: Seu pedido #${order.id.split('-')[1]} foi realizado!`);
    console.log('');
    console.log(`Olá ${user.name},`);
    console.log('');
    console.log('Obrigado pela sua compra. Recebemos seu pedido e já estamos preparando-o.');
    console.log('Detalhes do Pedido:');
    order.items.forEach(item => {
      console.log(`- ${item.name} (x${item.quantity}) - R$${(item.price * item.quantity).toFixed(2).replace('.', ',')}`);
    });
    console.log(`Total: R$${order.totalAmount.toFixed(2).replace('.', ',')}`);
    console.log('');
    console.log('Nós o notificaremos novamente assim que seu pedido for enviado.');
    console.log('--- Fim do Email ---');
  }
}