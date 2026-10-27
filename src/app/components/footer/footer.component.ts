import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { LogoComponent } from '../logo/logo.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  template: `
    <footer class="bg-[#090705] border-t border-stone-800 py-10 text-stone-400 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-stone-800">
          <!-- Logo & Location -->
          <div class="flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <app-logo size="sm" />
            <p class="text-xs text-stone-400 max-w-sm mt-1">
              Ranveer Plaza, Ghodke Nagar Road, Behind Hotel Rucha, Punam Saras Nagar, Pimpalgaon Baswant, MH 422209.
            </p>
          </div>

          <!-- Quick Navigation -->
          <div class="flex flex-wrap justify-center gap-6 text-xs text-stone-300 font-medium">
            <a href="#hero" class="hover:text-amber-400 transition-colors">Home</a>
            <a href="#specialties" class="hover:text-amber-400 transition-colors">Specialties</a>
            <a href="#menu" class="hover:text-amber-400 transition-colors">Digital Menu</a>
            <a href="#reviews" class="hover:text-amber-400 transition-colors">Reviews</a>
            <a [href]="cafeInfo.googleMapsUrl" target="_blank" rel="noopener noreferrer" class="hover:text-amber-400 transition-colors">Google Maps</a>
            <a [href]="'https://wa.me/' + cafeInfo.whatsapp" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300">WhatsApp Order</a>
          </div>
        </div>

        <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500 text-center sm:text-left">
          <p>© 2026 Cafe Unplugged, Pimpalgaon Baswant. All rights reserved.</p>
          <p>Hours: 11:00 AM – 10:30 PM (Mon – Sun) • Phone: {{ cafeInfo.phone }}</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly orderService = inject(OrderService);
  readonly cafeInfo = this.orderService.cafeInfo;
}
