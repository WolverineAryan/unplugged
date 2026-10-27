import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  template: `
    <!-- Main Clean Navigation Bar -->
    <header class="sticky top-0 z-40 bg-[#0e0b09]/95 backdrop-blur-md border-b border-stone-800/80 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between">
        <!-- Actual Brand Logo -->
        <a href="#hero" class="flex items-center group cursor-pointer">
          <app-logo size="sm" />
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-stone-300">
          <a href="#menu" class="hover:text-amber-400 transition-colors">Digital Menu</a>
          <a href="#reviews" class="hover:text-amber-400 transition-colors">Reviews (4.3★)</a>
          <a href="#location" class="hover:text-amber-400 transition-colors">Location & Hours</a>
        </nav>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Live Open Status -->
          <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Open (11 AM - 10:30 PM)</span>
          </div>

          <!-- Directions Map Link -->
          <a
            [href]="cafeInfo.googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden xs:inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 hover:border-amber-500/40 transition-colors"
            title="Google Maps"
          >
            <span class="material-icons text-sm text-amber-400">directions</span>
            <span class="hidden md:inline">Map</span>
          </a>

          <!-- Table Tray / Cart Trigger -->
          <button
            type="button"
            (click)="orderService.toggleTray()"
            class="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            aria-label="View Order Tray"
          >
            <span class="material-icons text-lg">receipt_long</span>
            <span class="hidden sm:inline">Tray</span>
            @if (orderService.totalItemsCount() > 0) {
              <span class="flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-stone-950 text-amber-300 text-xs font-extrabold">
                {{ orderService.totalItemsCount() }}
              </span>
            }
          </button>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  readonly orderService = inject(OrderService);
  readonly cafeInfo = this.orderService.cafeInfo;
  readonly openStatus = this.orderService.isCurrentlyOpen();
}
