import { Component, ChangeDetectionStrategy, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Review } from '../../models/product.model';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ReviewFormComponent {
  close = output<void>();
  reviewSubmitted = output<Review>();

  authService = inject(AuthService);

  rating = signal(0);
  comment = signal('');
  hoverRating = signal(0);

  setRating(newRating: number): void {
    this.rating.set(newRating);
  }

  setHoverRating(rating: number): void {
    this.hoverRating.set(rating);
  }

  onCommentInput(event: Event): void {
    this.comment.set((event.target as HTMLTextAreaElement).value);
  }

  onSubmit(): void {
    const user = this.authService.currentUser();
    if (this.rating() > 0 && this.comment().trim().length > 0 && user) {
      const newReview: Review = {
        userId: user.id,
        author: user.name,
        rating: this.rating(),
        comment: this.comment().trim(),
        date: 'Agora mesmo',
      };
      this.reviewSubmitted.emit(newReview);
    }
  }
}