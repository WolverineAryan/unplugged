import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: `
    <div class="flex items-center gap-3 select-none">
      <!-- Scalable Vector Brand Emblem -->
      <div
        class="relative flex-shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#231a14] via-[#15110d] to-[#0a0806] border border-amber-500/40 p-2 shadow-lg shadow-black/60 group-hover:border-amber-400 transition-colors"
        [class.w-12]="size() === 'md'"
        [class.h-12]="size() === 'md'"
        [class.w-10]="size() === 'sm'"
        [class.h-10]="size() === 'sm'"
        [class.w-16]="size() === 'lg'"
        [class.h-16]="size() === 'lg'"
      >
        <svg
          viewBox="0 0 100 100"
          class="w-full h-full drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FDE68A" />
              <stop offset="50%" stop-color="#F59E0B" />
              <stop offset="100%" stop-color="#D97706" />
            </linearGradient>
            <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFA827" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#FFA827" stop-opacity="0" />
            </linearGradient>
          </defs>

          <!-- Outer decorative ring -->
          <circle cx="50" cy="50" r="46" stroke="url(#goldGrad)" stroke-width="1.8" stroke-dasharray="2 1.5" />
          <circle cx="50" cy="50" r="42" stroke="url(#goldGrad)" stroke-width="1.2" opacity="0.6" />

          <!-- Acoustic Guitar Body & Coffee Cup Fusion -->
          <!-- Coffee cup silhouette -->
          <path
            d="M26 44 C26 38 74 38 74 44 L70 68 C68 76 32 76 30 68 Z"
            fill="#1C140E"
            stroke="url(#goldGrad)"
            stroke-width="2.5"
          />

          <!-- Coffee Cup Saucer -->
          <path
            d="M22 78 C35 83 65 83 78 78"
            stroke="url(#goldGrad)"
            stroke-width="2.5"
            stroke-linecap="round"
          />

          <!-- Cup Handle -->
          <path
            d="M72 48 C81 48 83 60 70 63"
            stroke="url(#goldGrad)"
            stroke-width="2.2"
            stroke-linecap="round"
          />

          <!-- Acoustic Guitar Pick / Unplugged Audio Jack in the Center -->
          <!-- Guitar Pick shape inside cup -->
          <path
            d="M50 46 C57 46 61 51 57 58 L50 67 L43 58 C39 51 43 46 50 46 Z"
            fill="url(#goldGrad)"
          />
          <circle cx="50" cy="54" r="2.8" fill="#15110D" />

          <!-- Unplug Jack Prongs (symbolizing Unplugged) -->
          <path
            d="M47 34 L47 39 M53 34 L53 39"
            stroke="url(#goldGrad)"
            stroke-width="2"
            stroke-linecap="round"
          />

          <!-- Rising steam waves mimicking sound waves / acoustic vibrations -->
          <path
            d="M40 32 C38 27 42 24 39 19"
            stroke="url(#goldGrad)"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M50 30 C48 24 53 21 50 16"
            stroke="url(#goldGrad)"
            stroke-width="2.2"
            stroke-linecap="round"
          />
          <path
            d="M60 32 C62 27 58 24 61 19"
            stroke="url(#goldGrad)"
            stroke-width="1.8"
            stroke-linecap="round"
          />

          <!-- Tiny Sparkles -->
          <circle cx="34" cy="22" r="1.2" fill="#FDE68A" />
          <circle cx="66" cy="24" r="1.2" fill="#FDE68A" />
        </svg>
      </div>

      <!-- Typography -->
      @if (showText()) {
        <div class="flex flex-col">
          <div class="flex items-center gap-1.5 leading-none">
            <span class="font-serif font-black tracking-tight text-white group-hover:text-amber-300 transition-colors"
              [class.text-xl]="size() === 'md'"
              [class.text-lg]="size() === 'sm'"
              [class.text-2xl]="size() === 'lg'"
            >
              CAFE UNPLUGGED
            </span>
          </div>
          <span class="text-[10px] sm:text-[11px] uppercase tracking-widest text-amber-400/80 font-bold mt-1">
            Pimpalgaon Baswant
          </span>
        </div>
      }
    </div>
  `,
})
export class LogoComponent {
  size = input<'sm' | 'md' | 'lg'>('md');
  showText = input<boolean>(true);
}
