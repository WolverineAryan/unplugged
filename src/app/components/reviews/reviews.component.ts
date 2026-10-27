import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="reviews" class="py-12 sm:py-16 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs uppercase tracking-wider text-amber-400 font-bold">Google & Diner Ratings</span>
              <span class="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
                4.3 ★ (300+ Reviews)
              </span>
            </div>
            <h2 class="font-serif text-2xl sm:text-3xl font-bold text-white">
              Customer Feedback
            </h2>
          </div>

          <button
            type="button"
            (click)="isWriteModalOpen.set(true)"
            class="self-start sm:self-auto px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-icons text-sm">rate_review</span>
            <span>Write a Review</span>
          </button>
        </div>

        <!-- Reviews Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          @for (review of orderService.reviews(); track review.id) {
            <div class="glass-card rounded-2xl p-4 sm:p-5 border border-stone-800 flex flex-col justify-between">
              <div>
                <!-- Header -->
                <div class="flex items-center justify-between mb-2.5">
                  <div>
                    <h4 class="text-sm font-bold text-white">{{ review.author }}</h4>
                    <span class="text-[11px] text-stone-400">{{ review.location }}</span>
                  </div>
                  <div class="flex items-center text-amber-400 text-sm">
                    <span class="font-bold mr-1 text-xs text-amber-300">{{ review.rating }}★</span>
                  </div>
                </div>

                <!-- Comment -->
                <p class="text-xs sm:text-sm text-stone-300 leading-relaxed mb-3">
                  "{{ review.comment }}"
                </p>
              </div>

              <!-- Loved dish -->
              @if (review.favoriteItem) {
                <div class="pt-2.5 border-t border-stone-800/80 text-[11px] text-amber-300/80 flex items-center gap-1">
                  <span class="material-icons text-xs text-amber-400">favorite</span>
                  <span class="truncate">{{ review.favoriteItem }}</span>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Write Review Modal -->
      @if (isWriteModalOpen()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <button
            type="button"
            (click)="isWriteModalOpen.set(false)"
            class="fixed inset-0 w-full h-full bg-transparent border-0 cursor-default -z-10"
            aria-label="Close modal"
          ></button>

          <div
            class="relative w-full max-w-md glass-card rounded-3xl border border-amber-500/30 p-5 sm:p-6 shadow-2xl"
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-serif text-lg font-bold text-white">Share Your Review</h3>
              <button
                type="button"
                (click)="isWriteModalOpen.set(false)"
                class="material-icons text-stone-400 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                close
              </button>
            </div>

            <form (submit)="submitReview($event)" class="space-y-3.5 text-xs">
              <div>
                <label for="review-author" class="block text-stone-300 font-semibold mb-1">Name</label>
                <input
                  id="review-author"
                  type="text"
                  [(ngModel)]="newAuthor"
                  name="author"
                  required
                  placeholder="Your Name"
                  class="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-500/60 focus:outline-none"
                />
              </div>

              <div>
                <label for="review-location" class="block text-stone-300 font-semibold mb-1">City / Area</label>
                <input
                  id="review-location"
                  type="text"
                  [(ngModel)]="newLocation"
                  name="location"
                  placeholder="e.g. Pimpalgaon Baswant"
                  class="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-500/60 focus:outline-none"
                />
              </div>

              <div>
                <span class="block text-stone-300 font-semibold mb-1">Rating</span>
                <div class="flex items-center gap-1.5">
                  @for (r of [1, 2, 3, 4, 5]; track r) {
                    <button
                      type="button"
                      (click)="newRating.set(r)"
                      class="text-amber-400 text-xl cursor-pointer"
                      [attr.aria-label]="r + ' Stars'"
                    >
                      <span class="material-icons">
                        {{ r <= newRating() ? 'star' : 'star_border' }}
                      </span>
                    </button>
                  }
                  <span class="text-stone-300 font-bold ml-2">{{ newRating() }} / 5</span>
                </div>
              </div>

              <div>
                <label for="review-favorite-item" class="block text-stone-300 font-semibold mb-1">Item You Liked</label>
                <input
                  id="review-favorite-item"
                  type="text"
                  [(ngModel)]="newFavoriteItem"
                  name="favoriteItem"
                  placeholder="e.g. Tandoori Paneer Pizza, Sizzling Brownie"
                  class="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-500/60 focus:outline-none"
                />
              </div>

              <div>
                <label for="review-comment" class="block text-stone-300 font-semibold mb-1">Feedback</label>
                <textarea
                  id="review-comment"
                  [(ngModel)]="newComment"
                  name="comment"
                  required
                  rows="3"
                  placeholder="Taste, portion size, cafe vibe..."
                  class="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-amber-500/60 focus:outline-none"
                ></textarea>
              </div>

              <div class="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  (click)="isWriteModalOpen.set(false)"
                  class="px-3.5 py-1.5 rounded-xl bg-stone-900 text-stone-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="px-4 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold hover:bg-amber-400 cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </section>
  `,
})
export class ReviewsComponent {
  readonly orderService = inject(OrderService);

  isWriteModalOpen = signal<boolean>(false);
  newAuthor = '';
  newLocation = 'Pimpalgaon Baswant';
  newRating = signal<number>(5);
  newFavoriteItem = '';
  newComment = '';

  submitReview(e: Event) {
    e.preventDefault();
    if (!this.newComment.trim()) return;

    this.orderService.addReview(
      this.newAuthor,
      this.newLocation,
      this.newRating(),
      this.newComment,
      this.newFavoriteItem
    );

    this.newAuthor = '';
    this.newFavoriteItem = '';
    this.newComment = '';
    this.isWriteModalOpen.set(false);
  }
}
