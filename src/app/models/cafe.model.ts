export interface MenuItem {
  id: string;
  name: string;
  marathiName?: string;
  category: MenuCategoryId;
  price: number;
  description: string;
  image: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isChefSpecial?: boolean;
  isSpicy?: boolean;
  prepTimeMinutes: number;
  tags?: string[];
  customizations?: {
    extraCheese?: boolean;
    spiceLevels?: ('Mild' | 'Medium' | 'Spicy')[];
    addons?: { name: string; price: number }[];
  };
}

export type MenuCategoryId = 
  | 'all'
  | 'beverages'
  | 'pizza'
  | 'burger-sandwich'
  | 'bites'
  | 'shakes'
  | 'coffee-coolers'
  | 'pasta-mains'
  | 'desserts';

export interface MenuCategory {
  id: MenuCategoryId;
  name: string;
  icon: string;
  description: string;
  itemCount?: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  avatarBg: string;
  favoriteItem?: string;
  verified?: boolean;
}

export interface OrderItem {
  item: MenuItem;
  quantity: number;
  selectedSpice?: 'Mild' | 'Medium' | 'Spicy';
  selectedAddons: { name: string; price: number }[];
  itemTotal: number;
  notes?: string;
}

export interface CafeInfo {
  name: string;
  tagline: string;
  address: string;
  landmark: string;
  city: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  googleMapsUrl: string;
  timings: {
    openingTime: string; // "11:00"
    closingTime: string; // "22:30"
    displayTimings: string;
    kitchenCloses: string;
    openDays: string;
  };
  pricingForTwo: string;
  rating: number;
  reviewCount: number;
  features: {
    icon: string;
    title: string;
    desc: string;
  }[];
}
