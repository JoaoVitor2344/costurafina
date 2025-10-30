import { Component, ChangeDetectionStrategy, input, output, signal, inject, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai.service';
import { Chat } from '@google/genai';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SafeHtmlPipe],
})
export class SupportComponent {
  isOpen = input.required<boolean>();
  close = output<void>();

  @ViewChild('chatMessages') chatMessagesContainer: ElementRef<HTMLDivElement> | undefined;

  aiService = inject(AiService);

  expandedFaqId = signal<number | null>(null);
  chatSession = signal<Chat | null>(null);
  messages = signal<ChatMessage[]>([]);
  isLoading = signal(false);
  chatError = signal<string | null>(null);

  faqs: FaqItem[] = [
    {
      id: 1,
      question: 'Quais são as opções de frete?',
      answer: 'Oferecemos frete padrão (5-7 dias úteis), expresso (2-3 dias úteis) e entrega no dia seguinte. Todos os pedidos acima de R$ 500,00 têm frete padrão gratuito.'
    },
    {
      id: 2,
      question: 'Como rastreio meu pedido?',
      answer: 'Assim que seu pedido for enviado, você receberá um e-mail com o código de rastreamento e um link para o site da transportadora. Você também pode encontrar as informações de rastreamento na sua página "Meus Pedidos".'
    },
    {
      id: 3,
      question: 'Qual é a política de devolução?',
      answer: 'Aceitamos devoluções de itens não usados, não lavados e com as etiquetas ainda anexadas no prazo de 30 dias após a entrega. Para iniciar uma devolução, visite nosso portal de devoluções ou entre em contato com o suporte.'
    },
    {
      id: 4,
      question: 'Como cuido das minhas roupas?',
      answer: 'As instruções de cuidado são específicas para cada peça. Por favor, consulte a etiqueta de cuidados anexada no interior do seu item para instruções detalhadas de lavagem e secagem para garantir a longevidade.'
    },
    {
      id: 5,
      question: 'Vocês fazem entregas internacionais?',
      answer: 'Sim, enviamos para mais de 50 países. As taxas de envio internacional e os prazos de entrega variam de acordo com o destino e serão calculados no checkout.'
    }
  ];

  constructor() {
    effect(() => {
      // effect runs when messages() signal changes
      this.messages(); 
      this.scrollToBottom();
    });
  }

  toggleFaq(id: number) {
    this.expandedFaqId.update(currentId => (currentId === id ? null : id));
  }

  startChat(): void {
    const session = this.aiService.startChatSession();
    if (session) {
      this.chatSession.set(session);
      this.messages.set([
        { role: 'model', text: "Olá! Sou seu/sua Consultor(a) de Estilo Costura Fina. Como posso te ajudar a encontrar o look perfeito hoje?" }
      ]);
      this.chatError.set(null);
    } else {
      this.chatError.set('O Consultor de Estilo AI está indisponível no momento. Por favor, verifique a configuração da sua chave de API.');
      console.error("Failed to start AI chat session.");
    }
  }

  async sendMessage(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    if (!input || !input.value.trim() || this.isLoading()) return;

    const prompt = input.value.trim();
    input.value = '';

    const session = this.chatSession();
    if (!session) return;

    this.isLoading.set(true);
    this.messages.update(m => [...m, { role: 'user', text: prompt }]);
    
    // Add a placeholder for the model's response
    this.messages.update(m => [...m, { role: 'model', text: '' }]);

    try {
      const result = await session.sendMessageStream({ message: prompt });
      for await (const chunk of result) {
        // Update the last message (the model's response) with the new chunk
        this.messages.update(m => {
          const lastMessage = m[m.length - 1];
          if(lastMessage) {
            lastMessage.text += chunk.text;
            return [...m.slice(0, -1), lastMessage];
          }
          return m;
        });
      }
    } catch (e) {
      console.error(e);
      this.messages.update(m => {
        const lastMessage = m[m.length - 1];
        if (lastMessage) {
            lastMessage.text = "Desculpe, encontrei um erro. Por favor, tente novamente.";
            return [...m.slice(0, -1), lastMessage];
        }
        return m;
      });
    } finally {
      this.isLoading.set(false);
    }
  }
  
  private scrollToBottom(): void {
    // Use a timeout to wait for the DOM to update
    setTimeout(() => {
      try {
        if (this.chatMessagesContainer) {
          const element = this.chatMessagesContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
        }
      } catch (err) {
        console.error('Could not scroll to bottom:', err);
      }
    }, 0);
  }
}