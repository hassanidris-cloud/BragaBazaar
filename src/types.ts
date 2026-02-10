/* ── Category ───────────────────────────────────────────── */
export type Category =
  | "Fresh"
  | "Bakery"
  | "Beverages"
  | "Pantry"
  | "Braga Specialties";

export const ALL_CATEGORIES: Category[] = [
  "Fresh",
  "Bakery",
  "Beverages",
  "Pantry",
  "Braga Specialties",
];

/* ── Nutritional ───────────────────────────────────────── */
export type NutritionalInfo = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

/* ── Product ───────────────────────────────────────────── */
export type Product = {
  id: string;
  name: string;
  /** Bazaar (loyalty) price */
  bazaarPrice: number;
  /** Regular (non-loyalty) price */
  regularPrice: number;
  stock_level: number;
  category: Category;
  image_url: string;
  nutritional_info: NutritionalInfo;
  barcode?: string;
  imageAsset?: number;
  /** Pingo Doce-style sale flag */
  on_sale?: boolean;
  /** Original price before sale */
  old_price?: number;
  /** Loyalty points earned per purchase */
  member_points_earned?: number;
};

/* ── Recipe ─────────────────────────────────────────────── */
export type Recipe = {
  id: string;
  name: string;
  description: string;
  productIds: string[];
};

/* ── Cart ───────────────────────────────────────────────── */
export type CartItem = {
  productId: string;
  quantity: number;
};

/* ── Shopping List ──────────────────────────────────────── */
export type ShoppingListItem = {
  id: string;
  productId: string;
  quantity: number;
  checked: boolean;
};

export type ShoppingList = {
  id: string;
  name: string;
  items: ShoppingListItem[];
};

/* ── Profile / Loyalty ──────────────────────────────────── */
export type Profile = {
  id: string;
  username: string;
  loyalty_points: number;
  loyalty_tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  name: string;
  total_saved: number;
  preferences: string[];
};

/* ── Orders ─────────────────────────────────────────────── */
export type OrderStatus = "Pending" | "Packing" | "Ready" | "Delivered";

export type FulfillmentType = "delivery" | "click_collect";

export type PaymentMethod = "stripe" | "multibanco" | "mbway" | "cash_on_delivery";

export type PickupSlot = {
  id: string;
  date: string;
  window: string;
  available: boolean;
};

/* ── Loyalty Transactions ────────────────────────────────── */
export type LoyaltyTransaction = {
  id: string;
  user_id: string;
  points_change: number;
  description: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_price: number;
  fulfillment: FulfillmentType;
  payment_method: PaymentMethod;
  pickup_slot_id?: string;
};
