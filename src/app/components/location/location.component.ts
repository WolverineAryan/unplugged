import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="location" class="py-12 sm:py-16 bg-[#0f0c0a] border-t border-stone-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header -->
        <div class="mb-8">
          <span class="text-xs uppercase tracking-wider text-amber-400 font-bold">Directions & Schedule</span>
          <h2 class="font-serif text-2xl sm:text-3xl font-bold text-white mt-0.5">
            Visit Cafe Unplugged
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <!-- Address & Hours -->
          <div class="glass-card rounded-2xl p-5 sm:p-6 border border-stone-800 space-y-5 flex flex-col justify-between">
            <div class="space-y-4">
              <div>
                <span class="text-xs text-stone-400 uppercase font-semibold">Address</span>
                <h3 class="text-base sm:text-lg font-bold text-white mt-1">
                  {{ cafeInfo.address }}
                </h3>
                <p class="text-xs text-amber-300/80 font-medium mt-1">
                  Landmark: Behind Hotel Rucha, Punam Saras Nagar
                </p>
                <p class="text-xs text-stone-400">
                  {{ cafeInfo.city }} – {{ cafeInfo.pincode }}
                </p>
              </div>

              <!-- Timings table -->
              <div class="pt-3 border-t border-stone-800 space-y-2 text-xs">
                <div class="flex items-center justify-between text-stone-300">
                  <span class="font-medium">Opening Hours</span>
                  <span class="font-bold text-amber-400">11:00 AM – 10:30 PM (Daily)</span>
                </div>
                <div class="flex items-center justify-between text-stone-400">
                  <span>Last Kitchen Order</span>
                  <span>10:00 PM</span>
                </div>
                <div class="flex items-center justify-between text-stone-400">
                  <span>Contact Phone</span>
                  <a [href]="'tel:' + cafeInfo.phone" class="text-stone-300 hover:text-amber-400 font-semibold">
                    {{ cafeInfo.phone }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="pt-4 border-t border-stone-800 flex flex-col sm:flex-row items-center gap-3">
              <a
                [href]="cafeInfo.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs text-center flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <span class="material-icons text-base">directions</span>
                <span>Open in Google Maps</span>
              </a>

              <a
                [href]="'https://wa.me/' + cafeInfo.whatsapp + '?text=Hi%20Cafe%20Unplugged!'"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span class="material-icons text-base text-emerald-400">chat</span>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          <!-- Location Map Card -->
          <div class="glass-card rounded-2xl p-4 sm:p-5 border border-stone-800 flex flex-col justify-between overflow-hidden">
            <div class="relative rounded-xl overflow-hidden aspect-[16/9] sm:aspect-[16/10] bg-stone-900 border border-stone-800 mb-4 group">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1000&q=80"
                alt="Cafe Unplugged Location Pimpalgaon Baswant"
                class="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-black/30"></div>

              <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-3">
                <div class="w-11 h-11 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg mb-1.5">
                  <span class="material-icons text-2xl">place</span>
                </div>
                <div class="px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/30">
                  <p class="text-xs font-black text-amber-300">CAFE UNPLUGGED</p>
                  <p class="text-[10px] text-stone-300">Behind Hotel Rucha, Ghodke Nagar Rd</p>
                </div>
              </div>

              <a
                [href]="cafeInfo.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="absolute inset-0"
                title="Open in Google Maps"
              ></a>
            </div>

            <div class="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
              <span class="flex items-center gap-1">
                <span class="material-icons text-amber-400 text-sm">local_parking</span>
                <span>Parking Available</span>
              </span>
              <a
                [href]="cafeInfo.googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-amber-400 hover:text-amber-300 font-semibold"
              >
                Get Live Directions &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class LocationComponent {
  readonly orderService = inject(OrderService);
  readonly cafeInfo = this.orderService.cafeInfo;
  readonly openStatus = this.orderService.isCurrentlyOpen();
}
