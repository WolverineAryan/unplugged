import { Injectable, computed, signal } from '@angular/core';
import { CAFE_INFO, CAFE_REVIEWS, MENU_CATEGORIES, MENU_ITEMS } from '../data/cafe-data';
import { MenuCategoryId, MenuItem, OrderItem, Review } from '../models/cafe.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  readonly cafeInfo = CAFE_INFO;
  readonly categories = MENU_CATEGORIES;
  readonly allMenuItems = MENU_ITEMS;

  // Active filters
  selectedCategory = signal<MenuCategoryId>('all');
  searchQuery = signal<string>('');
  filterVegOnly = signal<boolean>(false);
  filterBestsellerOnly = signal<boolean>(false);
  filterChefSpecialOnly = signal<boolean>(false);
  filterUnder150Only = signal<boolean>(false);
  sortBy = signal<'featured' | 'price-asc' | 'price-desc' | 'prep-time'>('featured');

  // Interactive Tray / Cart
  trayItems = signal<OrderItem[]>([]);
  isTrayOpen = signal<boolean>(false);
  orderType = signal<'dine-in' | 'takeaway'>('dine-in');
  tableNumber = signal<string>('Table 3');
  specialInstructions = signal<string>('');
  customerName = signal<string>('');
  splitCount = signal<number>(2);

  // Item customization modal
  selectedItemForModal = signal<MenuItem | null>(null);

  // Reviews
  reviews = signal<Review[]>(CAFE_REVIEWS);
  isReviewModalOpen = signal<boolean>(false);

  // Order summary calculations
  totalItemsCount = computed(() => {
    return this.trayItems().reduce((acc, curr) => acc + curr.quantity, 0);
  });

  subtotal = computed(() => {
    return this.trayItems().reduce((acc, curr) => acc + curr.itemTotal, 0);
  });

  gstAmount = computed(() => {
    // 5% GST for restaurant services
    return Math.round(this.subtotal() * 0.05);
  });

  grandTotal = computed(() => {
    return this.subtotal() + this.gstAmount();
  });

  splitAmountPerPerson = computed(() => {
    const total = this.grandTotal();
    const count = Math.max(1, this.splitCount());
    return Math.ceil(total / count);
  });

  // Filtered Menu Items
  filteredItems = computed(() => {
    const cat = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();
    const vegOnly = this.filterVegOnly();
    const bestsellerOnly = this.filterBestsellerOnly();
    const chefOnly = this.filterChefSpecialOnly();
    const under150 = this.filterUnder150Only();
    const sort = this.sortBy();

    let items = [...this.allMenuItems];

    if (cat !== 'all') {
      items = items.filter((item) => item.category === cat);
    }

    if (query) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.marathiName?.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (vegOnly) {
      items = items.filter((item) => item.isVeg);
    }

    if (bestsellerOnly) {
      items = items.filter((item) => item.isBestseller);
    }

    if (chefOnly) {
      items = items.filter((item) => item.isChefSpecial);
    }

    if (under150) {
      items = items.filter((item) => item.price <= 150);
    }

    // Sorting
    if (sort === 'price-asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (sort === 'prep-time') {
      items.sort((a, b) => a.prepTimeMinutes - b.prepTimeMinutes);
    }

    return items;
  });

  // Category counts
  getCategoryCount(categoryId: MenuCategoryId): number {
    if (categoryId === 'all') return this.allMenuItems.length;
    return this.allMenuItems.filter((i) => i.category === categoryId).length;
  }

  // Live status evaluation
  isCurrentlyOpen(): { isOpen: boolean; message: string; subMessage: string } {
    try {
      const now = new Date();
      // Current hours & minutes
      const hours = now.getHours();
      const mins = now.getMinutes();
      const currentVal = hours * 60 + mins;

      const openVal = 11 * 60; // 11:00 AM
      const closeVal = 22 * 60 + 30; // 10:30 PM

      if (currentVal >= openVal && currentVal < closeVal) {
        const remainingMinutes = closeVal - currentVal;
        const remainingHours = Math.floor(remainingMinutes / 60);
        const remMins = remainingMinutes % 60;
        const timeStr = remainingHours > 0 ? `${remainingHours}h ${remMins}m` : `${remMins}m`;

        return {
          isOpen: true,
          message: 'Open Now',
          subMessage: `Closes at 10:30 PM (${timeStr} left)`,
        };
      } else {
        return {
          isOpen: false,
          message: 'Currently Closed',
          subMessage: 'Opens today at 11:00 AM',
        };
      }
    } catch {
      return {
        isOpen: true,
        message: 'Open Now',
        subMessage: '11:00 AM – 10:30 PM',
      };
    }
  }

  // Cart operations
  addItemQuick(item: MenuItem) {
    const existingIndex = this.trayItems().findIndex(
      (entry) =>
        entry.item.id === item.id &&
        entry.selectedAddons.length === 0 &&
        !entry.selectedSpice
    );

    if (existingIndex > -1) {
      const updated = [...this.trayItems()];
      updated[existingIndex].quantity += 1;
      updated[existingIndex].itemTotal = updated[existingIndex].quantity * item.price;
      this.trayItems.set(updated);
    } else {
      const newItem: OrderItem = {
        item,
        quantity: 1,
        selectedAddons: [],
        itemTotal: item.price,
      };
      this.trayItems.set([...this.trayItems(), newItem]);
    }
  }

  addCustomizedItem(
    item: MenuItem,
    quantity: number,
    spice?: 'Mild' | 'Medium' | 'Spicy',
    addons: { name: string; price: number }[] = [],
    notes?: string
  ) {
    const addonSum = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = item.price + addonSum;
    const itemTotal = unitPrice * quantity;

    const newOrderItem: OrderItem = {
      item,
      quantity,
      selectedSpice: spice,
      selectedAddons: addons,
      itemTotal,
      notes,
    };

    this.trayItems.set([...this.trayItems(), newOrderItem]);
    this.closeCustomizationModal();
    this.isTrayOpen.set(true);
  }

  increaseQuantity(index: number) {
    const list = [...this.trayItems()];
    if (list[index]) {
      list[index].quantity += 1;
      const unit =
        list[index].item.price +
        list[index].selectedAddons.reduce((s, a) => s + a.price, 0);
      list[index].itemTotal = unit * list[index].quantity;
      this.trayItems.set(list);
    }
  }

  decreaseQuantity(index: number) {
    const list = [...this.trayItems()];
    if (list[index]) {
      if (list[index].quantity > 1) {
        list[index].quantity -= 1;
        const unit =
          list[index].item.price +
          list[index].selectedAddons.reduce((s, a) => s + a.price, 0);
        list[index].itemTotal = unit * list[index].quantity;
        this.trayItems.set(list);
      } else {
        list.splice(index, 1);
        this.trayItems.set(list);
      }
    }
  }

  removeItem(index: number) {
    const list = [...this.trayItems()];
    list.splice(index, 1);
    this.trayItems.set(list);
  }

  clearTray() {
    this.trayItems.set([]);
  }

  // Modal controls
  openCustomizationModal(item: MenuItem) {
    this.selectedItemForModal.set(item);
  }

  closeCustomizationModal() {
    this.selectedItemForModal.set(null);
  }

  toggleTray() {
    this.isTrayOpen.update((v) => !v);
  }

  // WhatsApp Order generator
  generateWhatsAppOrderUrl(): string {
    const items = this.trayItems();
    if (items.length === 0) return '';

    let text = `*☕ NEW ORDER - CAFE UNPLUGGED*\n`;
    text += `*Location:* Pimpalgaon Baswant\n`;
    text += `*Type:* ${this.orderType() === 'dine-in' ? `Dine-In (${this.tableNumber()})` : 'Takeaway / Parcel'}\n`;
    if (this.customerName().trim()) {
      text += `*Customer:* ${this.customerName().trim()}\n`;
    }
    text += `--------------------------\n`;

    items.forEach((entry, idx) => {
      text += `${idx + 1}. *${entry.item.name}* x ${entry.quantity} - ₹${entry.itemTotal}\n`;
      if (entry.selectedSpice) {
        text += `   • Spice: ${entry.selectedSpice}\n`;
      }
      if (entry.selectedAddons && entry.selectedAddons.length > 0) {
        const addonNames = entry.selectedAddons.map((a) => `${a.name} (+₹${a.price})`).join(', ');
        text += `   • Add-ons: ${addonNames}\n`;
      }
      if (entry.notes) {
        text += `   • Note: ${entry.notes}\n`;
      }
    });

    text += `--------------------------\n`;
    text += `*Subtotal:* ₹${this.subtotal()}\n`;
    text += `*GST (5%):* ₹${this.gstAmount()}\n`;
    text += `*GRAND TOTAL:* ₹${this.grandTotal()}\n`;

    if (this.specialInstructions().trim()) {
      text += `\n*Cooking Instructions:* ${this.specialInstructions().trim()}\n`;
    }

    text += `\n_Generated via Cafe Unplugged Digital Menu_`;

    const encoded = encodeURIComponent(text);
    return `https://wa.me/${this.cafeInfo.whatsapp}?text=${encoded}`;
  }

  // Add review
  addReview(author: string, location: string, rating: number, comment: string, favoriteItem?: string) {
    const newRev: Review = {
      id: 'rev-' + Date.now(),
      author: author.trim() || 'Happy Guest',
      location: location.trim() || 'Pimpalgaon Baswant',
      rating,
      date: 'Just now',
      comment: comment.trim(),
      avatarBg: 'bg-amber-600',
      favoriteItem: favoriteItem?.trim() || undefined,
      verified: true,
    };

    this.reviews.update((current) => [newRev, ...current]);
    this.isReviewModalOpen.set(false);
  }
}
