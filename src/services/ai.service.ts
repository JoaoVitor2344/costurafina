import { Injectable, inject } from '@angular/core';
import { GoogleGenAI, Chat } from '@google/genai';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private productService = inject(ProductService);
  private ai: GoogleGenAI | undefined;

  constructor() {
    try {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    } catch(e) {
      console.error("Failed to initialize GoogleGenAI. Is API_KEY set?", e);
    }
  }

  startChatSession(): Chat | null {
    if (!this.ai) {
        console.error("GoogleGenAI instance not available.");
        return null;
    };

    const productList = this.productService.getProductListForAI()
      .map(p => `- ${p.name} (${p.category})`)
      .join('\n');

    const systemInstruction = `Você é o/a 'Consultor(a) de Estilo Costura Fina', um(a) especialista em moda amigável, experiente e chique para a marca Costura Fina. Seu tom é prestativo, sofisticado e um pouco informal. Você deve recomendar produtos da coleção Costura Fina quando for relevante. Mantenha suas respostas concisas, fáceis de ler e use markdown para formatação, como listas ou texto em negrito.

Aqui estão alguns dos produtos disponíveis:
${productList}`;

    const chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
    });
    return chat;
  }
}