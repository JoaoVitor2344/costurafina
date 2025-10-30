import { Injectable, signal, inject } from '@angular/core';
import { Product, Review } from '../models/product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private authService = inject(AuthService);

  private initialProducts: Product[] = [
    {
      id: 1,
      name: 'Camiseta Gola Careca Clássica',
      category: 'Blusas',
      imageUrls: ['https://picsum.photos/seed/product1/800/1000', 'https://picsum.photos/seed/product1b/800/1000', 'https://picsum.photos/seed/product1c/800/1000'],
      description: 'Uma camiseta gola careca atemporal feita de algodão premium macio ao toque. Perfeita para o uso diário, oferece conforto e estilo. Disponível em várias cores essenciais.',
      rating: 4.5,
      reviews: [
        { userId: 'user-1', author: 'Ana S.', rating: 5, date: '15/05/2023', comment: 'Muito macia e veste perfeitamente! Comprei em três cores.' },
        { userId: 'user-2', author: 'João P.', rating: 4, date: '12/05/2023', comment: 'Ótima camiseta básica. O tecido é um pouco fino, mas muito confortável.' },
      ],
      availableSizes: ['P', 'M', 'G', 'GG'],
      availableColors: [
        { name: 'Branco', hex: '#FFFFFF' },
        { name: 'Preto', hex: '#111827' },
        { name: 'Cinza Ardósia', hex: '#4B5563' },
      ],
      variants: [
        { sku: 'TS001-S-WH', size: 'P', color: { name: 'Branco', hex: '#FFFFFF' }, price: 89.90, stock: 15, image: 'https://picsum.photos/seed/product1wh/800/1000' },
        { sku: 'TS001-M-WH', size: 'M', color: { name: 'Branco', hex: '#FFFFFF' }, price: 89.90, stock: 20, image: 'https://picsum.photos/seed/product1wh/800/1000' },
        { sku: 'TS001-L-WH', size: 'G', color: { name: 'Branco', hex: '#FFFFFF' }, price: 89.90, stock: 10, image: 'https://picsum.photos/seed/product1wh/800/1000' },
        { sku: 'TS001-XL-WH', size: 'GG', color: { name: 'Branco', hex: '#FFFFFF' }, price: 89.90, stock: 0, image: 'https://picsum.photos/seed/product1wh/800/1000' },
        { sku: 'TS001-S-BK', size: 'P', color: { name: 'Preto', hex: '#111827' }, price: 89.90, stock: 12, image: 'https://picsum.photos/seed/product1bk/800/1000' },
        { sku: 'TS001-M-BK', size: 'M', color: { name: 'Preto', hex: '#111827' }, price: 89.90, stock: 18, image: 'https://picsum.photos/seed/product1bk/800/1000' },
        { sku: 'TS001-L-BK', size: 'G', color: { name: 'Preto', hex: '#111827' }, price: 89.90, stock: 5, image: 'https://picsum.photos/seed/product1bk/800/1000' },
        { sku: 'TS001-XL-BK', size: 'GG', color: { name: 'Preto', hex: '#111827' }, price: 89.90, stock: 9, image: 'https://picsum.photos/seed/product1bk/800/1000' },
        { sku: 'TS001-M-SG', size: 'M', color: { name: 'Cinza Ardósia', hex: '#4B5563' }, price: 99.90, stock: 8, image: 'https://picsum.photos/seed/product1gy/800/1000' },
        { sku: 'TS001-L-SG', size: 'G', color: { name: 'Cinza Ardósia', hex: '#4B5563' }, price: 99.90, stock: 11, image: 'https://picsum.photos/seed/product1gy/800/1000' },
      ],
    },
    {
      id: 2,
      name: 'Calça Chino Slim-Fit',
      category: 'Calças',
      imageUrls: ['https://picsum.photos/seed/product2/600/800', 'https://picsum.photos/seed/product2b/600/800'],
      description: 'Calças chino slim-fit versáteis, feitas de sarja de algodão com elastano. Um item essencial moderno que pode ser usado em ocasiões formais ou casuais.',
      rating: 4.8,
      reviews: [
        { userId: 'user-3', author: 'Miguel R.', rating: 5, date: '20/04/2023', comment: 'O caimento é perfeito e o material parece de alta qualidade. Recomendo muito.' },
      ],
      availableSizes: ['40', '42', '44', '46'],
      availableColors: [
        { name: 'Caqui', hex: '#C3B091' },
        { name: 'Azul Marinho', hex: '#000080' },
      ],
      variants: [
        { sku: 'CH001-30-KH', size: '40', color: { name: 'Caqui', hex: '#C3B091' }, price: 289.50, stock: 10, image: 'https://picsum.photos/seed/product2kh/800/1000' },
        { sku: 'CH001-32-KH', size: '42', color: { name: 'Caqui', hex: '#C3B091' }, price: 289.50, stock: 15, image: 'https://picsum.photos/seed/product2kh/800/1000' },
        { sku: 'CH001-32-NA', size: '44', color: { name: 'Azul Marinho', hex: '#000080' }, price: 289.50, stock: 12, image: 'https://picsum.photos/seed/product2na/800/1000' },
      ]
    },
    {
      id: 3,
      name: 'Bolsa de Viagem de Couro',
      category: 'Acessórios',
      imageUrls: ['https://picsum.photos/seed/product3/600/800'],
      description: 'Uma bolsa de viagem espaçosa e elegante, feita de couro genuíno. Possui forro de lona durável, vários bolsos e uma alça de ombro removível.',
      rating: 4.9,
      reviews: [
        { userId: 'user-4', author: 'Emília C.', rating: 5, date: '01/06/2023', comment: 'Bolsa absolutamente linda. A qualidade é excepcional e é o tamanho perfeito para uma viagem de fim de semana.' },
      ],
      availableSizes: ['Tamanho Único'],
      availableColors: [{ name: 'Conhaque', hex: '#834333' }],
      variants: [
        { sku: 'BG001-OS-CO', size: 'Tamanho Único', color: { name: 'Conhaque', hex: '#834333' }, price: 749.00, stock: 5, image: 'https://picsum.photos/seed/product3/600/800' }
      ]
    },
    {
      id: 4,
      name: 'Cachecol de Lã Merino',
      category: 'Acessórios',
      imageUrls: ['https://picsum.photos/seed/product4/600/800', 'https://picsum.photos/seed/product4b/600/800'],
      description: 'Mantenha-se aquecido com este cachecol luxuosamente macio, tecido com 100% de lã merino extrafina. Suas propriedades leves e isolantes o tornam um item essencial para o frio.',
      rating: 4.7,
      reviews: [
         { userId: 'user-5', author: 'Cris G.', rating: 5, date: '10/01/2023', comment: 'Incrivelmente macio e quente sem ser volumoso.' },
         { userId: 'user-1', author: 'Ana S.', rating: 4, date: '12/01/2023', comment: 'Ótimo cachecol, embora eu gostaria que tivesse mais cores.' },
      ],
      availableSizes: ['Tamanho Único'],
      availableColors: [{ name: 'Carvão', hex: '#36454F' }],
      variants: [
        { sku: 'SC001-OS-CH', size: 'Tamanho Único', color: { name: 'Carvão', hex: '#36454F' }, price: 159.90, stock: 25, image: 'https://picsum.photos/seed/product4/600/800' }
      ]
    },
     {
      id: 5,
      name: 'Camisa de Linho',
      category: 'Blusas',
      imageUrls: ['https://picsum.photos/seed/product5/600/800', 'https://picsum.photos/seed/product5b/600/800'],
      description: 'Fique fresco e confortável nesta camisa de linho respirável. Seu corte relaxado e design clássico a tornam a escolha perfeita para o clima quente.',
      rating: 4.6,
      reviews: [
        { userId: 'user-6', author: 'Sara P.', rating: 5, date: '25/05/2023', comment: 'Amei esta camisa! O linho é de alta qualidade e fica ótima.' },
      ],
      availableSizes: ['P', 'M', 'G'],
      availableColors: [{ name: 'Azul Claro', hex: '#ADD8E6' }],
      variants: [
        { sku: 'SH002-S-LB', size: 'P', color: { name: 'Azul Claro', hex: '#ADD8E6' }, price: 329.95, stock: 8, image: 'https://picsum.photos/seed/product5/600/800' },
        { sku: 'SH002-M-LB', size: 'M', color: { name: 'Azul Claro', hex: '#ADD8E6' }, price: 329.95, stock: 0, image: 'https://picsum.photos/seed/product5/600/800' },
        { sku: 'SH002-L-LB', size: 'G', color: { name: 'Azul Claro', hex: '#ADD8E6' }, price: 329.95, stock: 6, image: 'https://picsum.photos/seed/product5/600/800' },
      ]
    },
    {
      id: 6,
      name: 'Jaqueta Jeans Trucker',
      category: 'Agasalhos',
      imageUrls: ['https://picsum.photos/seed/product6/600/800'],
      description: 'Uma jaqueta jeans icônica com um caimento moderno. Feita de jeans resistente e sem elasticidade que se moldará lindamente ao corpo com o tempo. Um verdadeiro item básico do guarda-roupa.',
      rating: 4.8,
      reviews: [],
      availableSizes: ['P', 'M', 'G', 'GG'],
      availableColors: [{ name: 'Lavagem Clássica', hex: '#3B82F6' }],
      variants: [
        { sku: 'JK001-M-CW', size: 'M', color: { name: 'Lavagem Clássica', hex: '#3B82F6' }, price: 419.00, stock: 10, image: 'https://picsum.photos/seed/product6/600/800' }
      ]
    },
     {
      id: 7,
      name: 'Tênis Slip-On de Lona',
      category: 'Calçados',
      imageUrls: ['https://picsum.photos/seed/product7/600/800', 'https://picsum.photos/seed/product7b/600/800'],
      description: 'Estilo descomplicado encontra conforto nestes tênis slip-on clássicos. Com cabedal de lona durável e palmilha acolchoada para uso o dia todo.',
      rating: 4.4,
      reviews: [
        { userId: 'user-2', author: 'João P.', rating: 4, date: '18/03/2023', comment: 'Confortável e fácil de usar. A forma é um pouco grande, considere um número menor.' },
      ],
      availableSizes: ['39', '40', '41', '42'],
      availableColors: [{ name: 'Branco Óptico', hex: '#F8F8F8' }],
      variants: [
        { sku: 'SN001-9-OW', size: '40', color: { name: 'Branco Óptico', hex: '#F8F8F8' }, price: 255.00, stock: 14, image: 'https://picsum.photos/seed/product7/600/800' },
        { sku: 'SN001-10-OW', size: '41', color: { name: 'Branco Óptico', hex: '#F8F8F8' }, price: 255.00, stock: 20, image: 'https://picsum.photos/seed/product7/600/800' }
      ]
    },
    {
      id: 8,
      name: 'Shorts de Performance Tech',
      category: 'Shorts',
      imageUrls: ['https://picsum.photos/seed/product8/600/800'],
      description: 'Shorts leves que absorvem a umidade, projetados para estilos de vida ativos. O tecido com elasticidade em quatro direções oferece movimento irrestrito para treinos ou uso casual.',
      rating: 4.9,
      reviews: [],
      availableSizes: ['P', 'M', 'G'],
      availableColors: [{ name: 'Grafite', hex: '#333333' }],
      variants: [
        { sku: 'SH003-M-GR', size: 'M', color: { name: 'Grafite', hex: '#333333' }, price: 149.50, stock: 30, image: 'https://picsum.photos/seed/product8/600/800' }
      ]
    }
  ];

  private readonly _products = signal<Product[]>(this.initialProducts);
  public readonly products = this._products.asReadonly();

  getProductListForAI(): { name: string, category: string }[] {
    return this.products().map(p => ({ name: p.name, category: p.category }));
  }

  addReview(productId: number, review: Review): void {
    this._products.update(products => {
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex === -1) return products;

      const productToUpdate = { ...products[productIndex] };
      // Prepend new review to the beginning of the array
      const updatedReviews = [review, ...productToUpdate.reviews];
      
      const totalRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
      const newAverageRating = totalRating / updatedReviews.length;

      productToUpdate.reviews = updatedReviews;
      productToUpdate.rating = newAverageRating;

      const updatedProducts = [...products];
      updatedProducts[productIndex] = productToUpdate;
      
      return updatedProducts;
    });
  }

  hasUserReviewed(productId: number): boolean {
    const currentUser = this.authService.currentUser();
    if (!currentUser) return false;
    
    const product = this._products().find(p => p.id === productId);
    if (!product) return false;

    return product.reviews.some(review => review.userId === currentUser.id);
  }
}