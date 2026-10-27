import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { MenuComponent } from './components/menu/menu.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { LocationComponent } from './components/location/location.component';
import { FooterComponent } from './components/footer/footer.component';
import { ItemModalComponent } from './components/item-modal/item-modal.component';
import { OrderDrawerComponent } from './components/order-drawer/order-drawer.component';
import { OrderService } from './services/order.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    MenuComponent,
    ReviewsComponent,
    LocationComponent,
    FooterComponent,
    ItemModalComponent,
    OrderDrawerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly orderService = inject(OrderService);
}
