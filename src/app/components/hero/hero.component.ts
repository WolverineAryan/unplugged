import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  template: `
    <section id="hero" class="relative overflow-hidden min-h-[460px] sm:min-h-[520px] flex items-center justify-center py-12 sm:py-20 border-b border-stone-800">
      <!-- Background Cafe Image with Gradient Overlay -->
      <div class="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1920&q=80"
          alt="Cafe Unplugged Ambience"
          class="w-full h-full object-cover filter brightness-[0.4] contrast-[1.1] scale-105"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0d0b09] via-[#0d0b09]/80 to-[#0d0b09]/60"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0,transparent_70%)]"></div>
      </div>

      <!-- Hero Content -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-5">
        <!-- Logo Badge -->
        <div class="inline-flex items-center justify-center mb-1">
          <app-logo size="lg" [showText]="false" />
        </div>

        <!-- Clean Location & Rating Badges -->
        <div class="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span class="px-3 py-1 rounded-full bg-stone-900/90 border border-stone-700/80 text-stone-200 flex items-center gap-1.5 backdrop-blur-md">
            <span class="material-icons text-amber-400 text-sm">place</span>
            <span>Behind Hotel Rucha, Pimpalgaon Baswant</span>
          </span>

          <span class="px-3 py-1 rounded-full bg-stone-900/90 border border-stone-700/80 text-amber-300 font-bold flex items-center gap-1 backdrop-blur-md">
            <span class="material-icons text-amber-400 text-sm">star</span>
            <span>4.3★ Rating</span>
          </span>

          <span class="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center gap-1.5 backdrop-blur-md">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>11:00 AM – 10:30 PM</span>
          </span>
        </div>

        <!-- Headline & Tagline -->
        <div class="space-y-2">
          <h1 class="font-serif text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
            CAFE <span class="text-amber-400">UNPLUGGED</span>
          </h1>
          <p class="text-sm sm:text-base text-stone-300 font-medium max-w-xl mx-auto">
            Stone-Baked Pizzas • Thick Milkshakes • Gourmet Burgers • Signature Cold Coffee
          </p>
        </div>

        <!-- Mobile Optimized Quick Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          <a
            href="#menu"
            class="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <span class="material-icons text-base">restaurant_menu</span>
            <span>View Digital Menu</span>
          </a>

          <button
            type="button"
            (click)="orderService.toggleTray()"
            class="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-700 hover:border-amber-500/40 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md transition-all"
          >
            <span class="material-icons text-base text-amber-400">receipt_long</span>
            <span>Table Order / Tray</span>
          </button>

          <a
            [href]="cafeInfo.googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full sm:w-auto px-4 py-3 rounded-xl bg-stone-900/60 hover:bg-stone-800 text-stone-300 border border-stone-800 text-sm flex items-center justify-center gap-1.5"
            title="Open in Google Maps"
          >
            <span class="material-icons text-base text-amber-400">directions</span>
            <span>Maps</span>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  readonly orderService = inject(OrderService);
  readonly cafeInfo = this.orderService.cafeInfo;
}
