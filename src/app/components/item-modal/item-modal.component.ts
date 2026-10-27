import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-item-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (item(); as currentItem) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
        <!-- Backdrop dismiss button for accessibility -->
        <button
          type="button"
          (click)="closeModal()"
          class="fixed inset-0 w-full h-full bg-transparent border-0 cursor-default -z-10"
          aria-label="Close modal"
        ></button>

        <div
          class="relative w-full max-w-lg glass-card rounded-3xl border border-amber-500/30 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          <!-- Header with Image -->
          <div class="relative h-48 sm:h-56 bg-stone-900 overflow-hidden flex-shrink-0">
            <img
              [src]="currentItem.image"
              [alt]="currentItem.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#14100c] via-black/30 to-transparent"></div>

            <!-- Close Button -->
            <button
              type="button"
              (click)="closeModal()"
              class="absolute top-3 right-3 w-9 h-9 rounded-full bg-stone-950/80 hover:bg-stone-900 text-stone-200 hover:text-white flex items-center justify-center border border-stone-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <span class="material-icons text-lg">close</span>
            </button>

            <!-- Title & Price Overlay -->
            <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
                  Pure Veg
                </span>
                <h3 class="font-serif text-xl sm:text-2xl font-bold text-white mt-1">
                  {{ currentItem.name }}
                </h3>
              </div>
              <span class="text-xl sm:text-2xl font-black text-amber-400">
                ₹{{ currentItem.price }}
              </span>
            </div>
          </div>

          <!-- Body with Options -->
          <div class="p-5 overflow-y-auto space-y-5 text-stone-200 text-sm">
            <p class="text-xs text-stone-400 leading-relaxed">
              {{ currentItem.description }}
            </p>

            <!-- Spice Level Selection -->
            @if (currentItem.customizations?.spiceLevels?.length) {
              <div>
                <span class="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Select Spice Level
                </span>
                <div class="grid grid-cols-3 gap-2">
                  @for (level of currentItem.customizations?.spiceLevels; track level) {
                    <button
                      type="button"
                      (click)="selectedSpice.set(level)"
                      [class.bg-amber-500]="selectedSpice() === level"
                      [class.text-stone-950]="selectedSpice() === level"
                      [class.font-bold]="selectedSpice() === level"
                      [class.bg-stone-900]="selectedSpice() !== level"
                      [class.text-stone-300]="selectedSpice() !== level"
                      class="py-2 px-3 rounded-xl border border-stone-800 text-xs font-medium transition-all text-center cursor-pointer"
                    >
                      {{ level }}
                    </button>
                  }
                </div>
              </div>
            }

            <!-- Add-ons Selection -->
            @if (currentItem.customizations?.addons?.length) {
              <div>
                <span class="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Upgrade & Add-ons
                </span>
                <div class="space-y-2">
                  @for (addon of currentItem.customizations?.addons; track addon.name) {
                    <label class="flex items-center justify-between p-3 rounded-xl bg-stone-900/90 border border-stone-800 hover:border-amber-500/30 transition-colors cursor-pointer">
                      <div class="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          [checked]="isAddonSelected(addon.name)"
                          (change)="toggleAddon(addon)"
                          class="w-4 h-4 rounded text-amber-500 accent-amber-500 focus:ring-0 cursor-pointer"
                        />
                        <span class="text-xs sm:text-sm text-stone-200">{{ addon.name }}</span>
                      </div>
                      <span class="text-xs font-bold text-amber-400">+₹{{ addon.price }}</span>
                    </label>
                  }
                </div>
              </div>
            }

            <!-- Special Chef Instructions -->
            <div>
              <label for="custom-item-notes" class="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Special Requests / Notes
              </label>
              <input
                id="custom-item-notes"
                type="text"
                [(ngModel)]="customNotes"
                placeholder="e.g. Extra crispy, less sugar, separate dips..."
                class="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500/60 focus:outline-none"
              />
            </div>

            <!-- Quantity Counter -->
            <div class="flex items-center justify-between pt-2 border-t border-stone-800">
              <span class="text-xs font-bold text-stone-300 uppercase tracking-wider">Quantity</span>
              <div class="flex items-center gap-3 bg-stone-900 border border-stone-800 rounded-xl px-3 py-1.5">
                <button
                  type="button"
                  (click)="decreaseQty()"
                  class="w-7 h-7 rounded-lg bg-stone-950 text-stone-200 hover:text-white flex items-center justify-center font-bold cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span class="text-sm font-extrabold text-amber-400 w-6 text-center">
                  {{ quantity() }}
                </span>
                <button
                  type="button"
                  (click)="increaseQty()"
                  class="w-7 h-7 rounded-lg bg-stone-950 text-stone-200 hover:text-white flex items-center justify-center font-bold cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <!-- Footer with Add to Tray -->
          <div class="p-4 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-3">
            <div>
              <div class="text-[10px] text-stone-400 uppercase font-semibold">Total Price</div>
              <div class="text-xl font-black text-amber-400">₹{{ calculatedTotal() }}</div>
            </div>

            <button
              type="button"
              (click)="addToTray()"
              class="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm shadow-lg shadow-amber-950 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <span class="material-icons text-lg">check_circle</span>
              <span>Add to Table Tray</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ItemModalComponent {
  readonly orderService = inject(OrderService);
  readonly item = this.orderService.selectedItemForModal;

  quantity = signal<number>(1);
  selectedSpice = signal<'Mild' | 'Medium' | 'Spicy' | undefined>('Medium');
  selectedAddons = signal<{ name: string; price: number }[]>([]);
  customNotes = '';

  calculatedTotal = computed(() => {
    const cur = this.item();
    if (!cur) return 0;
    const base = cur.price;
    const addonSum = this.selectedAddons().reduce((sum, a) => sum + a.price, 0);
    return (base + addonSum) * this.quantity();
  });

  isAddonSelected(name: string): boolean {
    return this.selectedAddons().some((a) => a.name === name);
  }

  toggleAddon(addon: { name: string; price: number }) {
    if (this.isAddonSelected(addon.name)) {
      this.selectedAddons.set(this.selectedAddons().filter((a) => a.name !== addon.name));
    } else {
      this.selectedAddons.set([...this.selectedAddons(), addon]);
    }
  }

  increaseQty() {
    this.quantity.update((q) => q + 1);
  }

  decreaseQty() {
    this.quantity.update((q) => (q > 1 ? q - 1 : 1));
  }

  closeModal() {
    this.quantity.set(1);
    this.selectedAddons.set([]);
    this.customNotes = '';
    this.orderService.closeCustomizationModal();
  }

  addToTray() {
    const cur = this.item();
    if (cur) {
      this.orderService.addCustomizedItem(
        cur,
        this.quantity(),
        this.selectedSpice(),
        this.selectedAddons(),
        this.customNotes
      );
      this.closeModal();
    }
  }
}
