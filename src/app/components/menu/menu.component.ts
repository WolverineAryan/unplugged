import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { MenuCategoryId } from '../../models/cafe.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="menu" class="py-8 sm:py-12 relative">
      <div class="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
              Digital Menu
            </h2>
            <p class="text-xs text-stone-400 mt-0.5">
              Handcrafted in Pimpalgaon Baswant
            </p>
          </div>

          <!-- Tray quick pill on desktop -->
          @if (orderService.totalItemsCount() > 0) {
            <button
              type="button"
              (click)="orderService.toggleTray()"
              class="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition-all cursor-pointer"
            >
              <span class="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center text-[10px]">
                {{ orderService.totalItemsCount() }}
              </span>
              <span>{{ orderService.orderType() === 'dine-in' ? orderService.tableNumber() : 'Takeaway' }} Tray: ₹{{ orderService.grandTotal() }}</span>
            </button>
          }
        </div>

        <!-- Search Bar -->
        <div class="mb-4">
          <div class="relative w-full">
            <span class="material-icons absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-lg">search</span>
            <input
              type="text"
              [ngModel]="orderService.searchQuery()"
              (ngModelChange)="onSearchChange($event)"
              placeholder="Search pizzas, burgers, shakes, fries, coffees..."
              class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-stone-900/90 border border-stone-800 focus:border-amber-500/60 focus:outline-none text-stone-100 placeholder-stone-500 text-xs sm:text-sm shadow-sm"
            />
            @if (orderService.searchQuery()) {
              <button
                type="button"
                (click)="orderService.searchQuery.set('')"
                class="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-base cursor-pointer"
                aria-label="Clear search"
              >
                close
              </button>
            }
          </div>
        </div>

        <!-- Category Scroll Bar (Clean, no overlapping transparency bugs) -->
        <div class="sticky top-16 sm:top-18 z-20 py-2.5 bg-[#0d0b09] border-b border-stone-800/90 mb-5">
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
            @for (cat of orderService.categories; track cat.id) {
              <button
                type="button"
                (click)="selectCategory(cat.id)"
                [class.bg-amber-500]="orderService.selectedCategory() === cat.id"
                [class.text-stone-950]="orderService.selectedCategory() === cat.id"
                [class.font-bold]="orderService.selectedCategory() === cat.id"
                [class.shadow-md]="orderService.selectedCategory() === cat.id"
                [class.bg-stone-900]="orderService.selectedCategory() !== cat.id"
                [class.text-stone-300]="orderService.selectedCategory() !== cat.id"
                class="whitespace-nowrap px-3 py-1.5 rounded-xl border border-stone-800 text-xs transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer active:scale-95"
              >
                <span class="material-icons text-sm">{{ cat.icon }}</span>
                <span>{{ cat.name }}</span>
                <span
                  [class.bg-stone-950/20]="orderService.selectedCategory() === cat.id"
                  [class.text-stone-950]="orderService.selectedCategory() === cat.id"
                  [class.bg-stone-800]="orderService.selectedCategory() !== cat.id"
                  [class.text-stone-400]="orderService.selectedCategory() !== cat.id"
                  class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                >
                  {{ orderService.getCategoryCount(cat.id) }}
                </span>
              </button>
            }
          </div>

          <!-- Quick Veg / Bestseller Filter Chips -->
          <div class="flex items-center gap-2 pt-2 text-xs overflow-x-auto no-scrollbar">
            <button
              type="button"
              (click)="toggleVegOnly()"
              [class.bg-emerald-600]="orderService.filterVegOnly()"
              [class.text-white]="orderService.filterVegOnly()"
              [class.bg-stone-900]="!orderService.filterVegOnly()"
              [class.text-stone-300]="!orderService.filterVegOnly()"
              class="px-2.5 py-1 rounded-lg border border-stone-800 text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>100% Veg</span>
            </button>

            <button
              type="button"
              (click)="toggleBestsellerOnly()"
              [class.bg-amber-600]="orderService.filterBestsellerOnly()"
              [class.text-stone-950]="orderService.filterBestsellerOnly()"
              [class.font-bold]="orderService.filterBestsellerOnly()"
              [class.bg-stone-900]="!orderService.filterBestsellerOnly()"
              [class.text-stone-300]="!orderService.filterBestsellerOnly()"
              class="px-2.5 py-1 rounded-lg border border-stone-800 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span class="material-icons text-xs text-amber-400">local_fire_department</span>
              <span>Bestsellers</span>
            </button>

            @if (hasActiveFilters()) {
              <button
                type="button"
                (click)="resetFilters()"
                class="text-amber-400 text-[11px] underline cursor-pointer ml-auto whitespace-nowrap"
              >
                Reset
              </button>
            }
          </div>
        </div>

        <!-- 2 Products In Single Row Grid -->
        @if (orderService.filteredItems().length > 0) {
          <div class="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            @for (item of orderService.filteredItems(); track item.id) {
              <div class="glass-card rounded-xl sm:rounded-2xl overflow-hidden border border-stone-800/90 hover:border-amber-500/40 transition-all flex flex-col justify-between group">
                <!-- Top Image -->
                <div class="relative h-28 sm:h-36 md:h-44 w-full overflow-hidden bg-stone-900">
                  <img
                    [src]="item.image"
                    [alt]="item.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-[#120e0b] via-transparent to-black/20"></div>

                  <!-- Veg Indicator -->
                  <div class="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-emerald-500/50 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span class="text-[9px] font-bold text-emerald-300">Veg</span>
                  </div>

                  <!-- Bestseller Ribbon -->
                  @if (item.isBestseller) {
                    <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500 text-stone-950 text-[9px] font-extrabold uppercase">
                      Best
                    </span>
                  }

                  <span class="absolute bottom-1.5 left-2 text-[9px] text-stone-300 bg-black/60 px-1.5 py-0.2 rounded backdrop-blur-sm">
                    {{ item.prepTimeMinutes }}m
                  </span>
                </div>

                <!-- Card Content -->
                <div class="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 class="font-bold text-xs sm:text-sm md:text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug">
                      {{ item.name }}
                    </h3>

                    @if (item.marathiName) {
                      <p class="text-[10px] sm:text-xs text-amber-300/80 mb-1 font-medium truncate">
                        {{ item.marathiName }}
                      </p>
                    }

                    <p class="text-[11px] text-stone-400 line-clamp-2 leading-tight hidden xs:block mb-2">
                      {{ item.description }}
                    </p>
                  </div>

                  <!-- Price & Add Button Row -->
                  <div class="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-1.5 mt-1">
                    <span class="text-xs sm:text-sm md:text-base font-extrabold text-amber-400 whitespace-nowrap">
                      ₹{{ item.price }}
                    </span>

                    <div class="flex items-center gap-1">
                      @if (getItemCountInTray(item.id) > 0) {
                        <!-- In Tray Stepper -->
                        <div class="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 rounded-lg p-0.5">
                          <button
                            type="button"
                            (click)="decreaseItem(item.id)"
                            class="w-5 h-5 sm:w-6 sm:h-6 rounded bg-stone-900 text-amber-300 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span class="text-xs font-bold text-amber-300 px-1">
                            {{ getItemCountInTray(item.id) }}
                          </span>
                          <button
                            type="button"
                            (click)="orderService.addItemQuick(item)"
                            class="w-5 h-5 sm:w-6 sm:h-6 rounded bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      } @else {
                        <!-- Add Button -->
                        <button
                          type="button"
                          (click)="orderService.addItemQuick(item)"
                          class="py-1 px-2.5 sm:px-3 rounded-lg sm:rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-colors shadow-sm"
                        >
                          <span class="material-icons text-sm">add</span>
                          <span class="text-[11px] sm:text-xs">Add</span>
                        </button>
                      }

                      <!-- Customize Button -->
                      @if (item.customizations) {
                        <button
                          type="button"
                          (click)="orderService.openCustomizationModal(item)"
                          class="p-1 sm:p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 text-xs transition-colors cursor-pointer"
                          title="Customize"
                          aria-label="Customize"
                        >
                          <span class="material-icons text-sm">tune</span>
                        </button>
                      }
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="text-center py-12 px-4 glass-card rounded-2xl border border-stone-800 max-w-sm mx-auto">
            <span class="material-icons text-4xl text-amber-400/60 mb-2">search_off</span>
            <h4 class="font-bold text-white text-sm mb-1">No Items Found</h4>
            <p class="text-stone-400 text-xs mb-3">Try searching another dish or category.</p>
            <button
              type="button"
              (click)="resetFilters()"
              class="px-4 py-1.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        }
      </div>
    </section>
  `,
})
export class MenuComponent {
  readonly orderService = inject(OrderService);

  selectCategory(cat: MenuCategoryId) {
    this.orderService.selectedCategory.set(cat);
  }

  onSearchChange(val: string) {
    this.orderService.searchQuery.set(val);
  }

  toggleVegOnly() {
    this.orderService.filterVegOnly.update((v) => !v);
  }

  toggleBestsellerOnly() {
    this.orderService.filterBestsellerOnly.update((v) => !v);
  }

  hasActiveFilters(): boolean {
    return (
      this.orderService.searchQuery() !== '' ||
      this.orderService.filterVegOnly() ||
      this.orderService.filterBestsellerOnly() ||
      this.orderService.selectedCategory() !== 'all'
    );
  }

  resetFilters() {
    this.orderService.searchQuery.set('');
    this.orderService.filterVegOnly.set(false);
    this.orderService.filterBestsellerOnly.set(false);
    this.orderService.selectedCategory.set('all');
  }

  getItemCountInTray(itemId: string): number {
    return this.orderService
      .trayItems()
      .filter((i) => i.item.id === itemId)
      .reduce((sum, curr) => sum + curr.quantity, 0);
  }

  decreaseItem(itemId: string) {
    const idx = this.orderService.trayItems().findIndex((i) => i.item.id === itemId);
    if (idx > -1) {
      this.orderService.decreaseQuantity(idx);
    }
  }
}
