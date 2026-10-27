import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-drawer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (orderService.isTrayOpen()) {
      <!-- Backdrop Button -->
      <button
        type="button"
        (click)="orderService.toggleTray()"
        class="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity w-full h-full border-0 cursor-default p-0"
        aria-label="Close table tray backdrop"
      ></button>

      <!-- Slide-over Drawer Panel -->
      <div
        class="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#120e0b] border-l border-amber-500/20 shadow-2xl flex flex-col transform transition-transform duration-300"
      >
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/70">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <span class="material-icons text-xl">receipt_long</span>
            </div>
            <div>
              <h3 class="font-serif text-lg font-bold text-white">Your Table Tray</h3>
              <p class="text-[11px] text-stone-400">Review items & send to kitchen</p>
            </div>
          </div>

          <button
            type="button"
            (click)="orderService.toggleTray()"
            class="w-8 h-8 rounded-full bg-stone-900 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close tray"
          >
            <span class="material-icons text-base">close</span>
          </button>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          <!-- Order Type & Table Selection -->
          <div class="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                (click)="orderService.orderType.set('dine-in')"
                [class.bg-amber-500]="orderService.orderType() === 'dine-in'"
                [class.text-stone-950]="orderService.orderType() === 'dine-in'"
                [class.font-bold]="orderService.orderType() === 'dine-in'"
                [class.bg-stone-950]="orderService.orderType() !== 'dine-in'"
                [class.text-stone-300]="orderService.orderType() !== 'dine-in'"
                class="py-2 px-3 rounded-xl border border-stone-800 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span class="material-icons text-sm">table_restaurant</span>
                <span>Dine-In</span>
              </button>

              <button
                type="button"
                (click)="orderService.orderType.set('takeaway')"
                [class.bg-amber-500]="orderService.orderType() === 'takeaway'"
                [class.text-stone-950]="orderService.orderType() === 'takeaway'"
                [class.font-bold]="orderService.orderType() === 'takeaway'"
                [class.bg-stone-950]="orderService.orderType() !== 'takeaway'"
                [class.text-stone-300]="orderService.orderType() !== 'takeaway'"
                class="py-2 px-3 rounded-xl border border-stone-800 text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span class="material-icons text-sm">takeout_dining</span>
                <span>Takeaway</span>
              </button>
            </div>

            @if (orderService.orderType() === 'dine-in') {
              <div class="flex items-center justify-between gap-3 pt-2 border-t border-stone-800/80 text-xs">
                <label for="tray-table-select" class="text-stone-400 font-medium">Select Table:</label>
                <select
                  id="tray-table-select"
                  [ngModel]="orderService.tableNumber()"
                  (ngModelChange)="orderService.tableNumber.set($event)"
                  class="py-1.5 px-3 rounded-xl bg-stone-950 border border-stone-800 text-amber-300 font-bold text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="Table 1">Table 1 (Window Side)</option>
                  <option value="Table 2">Table 2 (Cozy Booth)</option>
                  <option value="Table 3">Table 3 (Central Lounge)</option>
                  <option value="Table 4">Table 4 (Central Lounge)</option>
                  <option value="Table 5">Table 5 (Acoustic Corner)</option>
                  <option value="Table 6">Table 6 (Celebration Area)</option>
                  <option value="Table 7">Table 7 (Terrace / Outdoor)</option>
                  <option value="Table 8">Table 8 (Terrace / Outdoor)</option>
                </select>
              </div>
            }

            <div class="pt-2 border-t border-stone-800/80 flex items-center gap-2">
              <input
                type="text"
                [ngModel]="orderService.customerName()"
                (ngModelChange)="orderService.customerName.set($event)"
                placeholder="Your Name (Optional)"
                aria-label="Customer Name"
                class="w-full py-1.5 px-3 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 placeholder-stone-500 text-xs focus:border-amber-500/60 focus:outline-none"
              />
            </div>
          </div>

          <!-- Items List -->
          @if (orderService.trayItems().length > 0) {
            <div class="space-y-3">
              <div class="flex items-center justify-between text-xs text-stone-400">
                <span>Selected Delights ({{ orderService.totalItemsCount() }})</span>
                <button
                  type="button"
                  (click)="orderService.clearTray()"
                  class="text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              @for (entry of orderService.trayItems(); track $index) {
                <div class="p-3 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <img
                      [src]="entry.item.image"
                      [alt]="entry.item.name"
                      class="w-12 h-12 rounded-xl object-cover bg-stone-800 flex-shrink-0"
                    />
                    <div class="min-w-0">
                      <h4 class="text-xs sm:text-sm font-bold text-stone-200 truncate">
                        {{ entry.item.name }}
                      </h4>
                      @if (entry.selectedSpice || entry.selectedAddons.length > 0) {
                        <p class="text-[11px] text-amber-300/80 truncate">
                          @if (entry.selectedSpice) {
                            <span>{{ entry.selectedSpice }} spice</span>
                          }
                          @if (entry.selectedAddons.length > 0) {
                            <span> • {{ entry.selectedAddons.length }} add-on</span>
                          }
                        </p>
                      }
                      <span class="text-xs font-black text-amber-400">
                        ₹{{ entry.itemTotal }}
                      </span>
                    </div>
                  </div>

                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-xl px-2 py-1 flex-shrink-0">
                    <button
                      type="button"
                      (click)="orderService.decreaseQuantity($index)"
                      class="w-6 h-6 rounded-lg bg-stone-900 text-stone-300 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span class="text-xs font-bold text-white px-1">
                      {{ entry.quantity }}
                    </span>
                    <button
                      type="button"
                      (click)="orderService.increaseQuantity($index)"
                      class="w-6 h-6 rounded-lg bg-stone-900 text-stone-300 hover:text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>
              }
            </div>

            <!-- Cooking Instructions -->
            <div>
              <label for="tray-special-instructions" class="block text-xs font-bold text-stone-300 mb-1.5">
                Special Kitchen Note
              </label>
              <textarea
                id="tray-special-instructions"
                [ngModel]="orderService.specialInstructions()"
                (ngModelChange)="orderService.specialInstructions.set($event)"
                rows="2"
                placeholder="e.g. Extra napkins, make it spicy, serve coffee first..."
                class="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-500/60 focus:outline-none"
              ></textarea>
            </div>

            <!-- Bill Breakdown -->
            <div class="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
              <div class="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span>₹{{ orderService.subtotal() }}</span>
              </div>
              <div class="flex justify-between text-stone-400">
                <span>Restaurant GST (5%)</span>
                <span>₹{{ orderService.gstAmount() }}</span>
              </div>
              <div class="pt-2 border-t border-stone-800 flex justify-between items-center text-sm font-bold text-white">
                <span>Total Amount</span>
                <span class="text-lg font-black text-amber-400">₹{{ orderService.grandTotal() }}</span>
              </div>
            </div>

            <!-- Split Bill Tool -->
            <div class="p-3 rounded-2xl bg-stone-900/70 border border-stone-800 text-xs space-y-2">
              <div class="flex items-center justify-between text-stone-300 font-semibold">
                <span class="flex items-center gap-1.5">
                  <span class="material-icons text-amber-400 text-sm">group</span>
                  <span>Split Bill with Friends</span>
                </span>
                <span class="text-amber-400 font-bold">₹{{ orderService.splitAmountPerPerson() }} / person</span>
              </div>

              <div class="flex items-center gap-1.5">
                @for (count of [2, 3, 4, 5, 6]; track count) {
                  <button
                    type="button"
                    (click)="orderService.splitCount.set(count)"
                    [class.bg-amber-500]="orderService.splitCount() === count"
                    [class.text-stone-950]="orderService.splitCount() === count"
                    [class.font-bold]="orderService.splitCount() === count"
                    [class.bg-stone-950]="orderService.splitCount() !== count"
                    [class.text-stone-400]="orderService.splitCount() !== count"
                    class="flex-1 py-1 rounded-lg border border-stone-800 text-xs text-center cursor-pointer transition-colors"
                  >
                    {{ count }}
                  </button>
                }
              </div>
            </div>
          } @else {
            <!-- Empty Tray -->
            <div class="text-center py-12 px-4 space-y-3">
              <div class="w-16 h-16 rounded-full bg-stone-900 text-amber-400/60 mx-auto flex items-center justify-center">
                <span class="material-icons text-3xl">shopping_basket</span>
              </div>
              <h4 class="font-serif text-lg font-bold text-white">Your Tray is Empty</h4>
              <p class="text-xs text-stone-400 max-w-xs mx-auto">
                Explore our stone-baked pizzas, thick shakes, burgers, and coolers to add delicious items here.
              </p>
              <button
                type="button"
                (click)="orderService.toggleTray()"
                class="mt-2 px-4 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
              >
                Start Adding Items
              </button>
            </div>
          }
        </div>

        <!-- Sticky Footer with Action Buttons -->
        @if (orderService.trayItems().length > 0) {
          <div class="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 space-y-2.5">
            <!-- WhatsApp Order Button -->
            <a
              [href]="orderService.generateWhatsAppOrderUrl()"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 cursor-pointer transition-all transform active:scale-95"
            >
              <span class="material-icons text-lg">send</span>
              <span>Send Order to Cafe WhatsApp</span>
            </a>

            <!-- Quick Table Call -->
            <div class="flex items-center justify-between text-xs text-stone-400 px-1 pt-1">
              <span>Need Waiter Assistance?</span>
              <a
                [href]="'tel:' + orderService.cafeInfo.phone"
                class="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span class="material-icons text-xs">call</span>
                <span>Call: {{ orderService.cafeInfo.phone }}</span>
              </a>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class OrderDrawerComponent {
  readonly orderService = inject(OrderService);
}
