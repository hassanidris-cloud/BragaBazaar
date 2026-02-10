import { PickupSlot, Product, Profile, Recipe, ShoppingList } from "../types";

const icon = require("../../assets/icon.png");
const adaptive = require("../../assets/adaptive-icon.png");
const splash = require("../../assets/splash-icon.png");
const strawberries = require("../../assets/strawberries.jpg");

/* ── Products ───────────────────────────────────────────── */
export const products: Product[] = [
  // Fresh
  { id: "p1", name: "Luna Strawberries", bazaarPrice: 4.99, regularPrice: 6.40, stock_level: 3, category: "Fresh", image_url: "", imageAsset: strawberries, nutritional_info: { calories: 45, protein_g: 1, carbs_g: 11, fat_g: 0 }, barcode: "100000000001", on_sale: true, old_price: 6.40, member_points_earned: 10 },
  { id: "p2", name: "Aurora Avocados", bazaarPrice: 3.25, regularPrice: 4.25, stock_level: 9, category: "Fresh", image_url: "", imageAsset: icon, nutritional_info: { calories: 160, protein_g: 2, carbs_g: 8, fat_g: 15 }, barcode: "100000000002", member_points_earned: 5 },
  { id: "p3", name: "Minho Tomatoes", bazaarPrice: 2.10, regularPrice: 2.85, stock_level: 15, category: "Fresh", image_url: "", imageAsset: splash, nutritional_info: { calories: 22, protein_g: 1, carbs_g: 5, fat_g: 0 }, barcode: "100000000010" },
  // Bakery
  { id: "p4", name: "Nimbus Sourdough", bazaarPrice: 5.50, regularPrice: 7.10, stock_level: 4, category: "Bakery", image_url: "", imageAsset: splash, nutritional_info: { calories: 190, protein_g: 6, carbs_g: 34, fat_g: 2 }, barcode: "100000000003" },
  { id: "p5", name: "Velvet Croissant", bazaarPrice: 2.80, regularPrice: 3.50, stock_level: 14, category: "Bakery", image_url: "", imageAsset: adaptive, nutritional_info: { calories: 230, protein_g: 5, carbs_g: 28, fat_g: 12 }, barcode: "100000000004", on_sale: true, old_price: 3.50, member_points_earned: 8 },
  { id: "p6", name: "Pão de Deus", bazaarPrice: 1.60, regularPrice: 2.20, stock_level: 8, category: "Bakery", image_url: "", imageAsset: icon, nutritional_info: { calories: 210, protein_g: 4, carbs_g: 32, fat_g: 8 }, barcode: "100000000011" },
  // Beverages
  { id: "p7", name: "Obsidian Espresso", bazaarPrice: 9.90, regularPrice: 12.00, stock_level: 6, category: "Beverages", image_url: "", imageAsset: icon, nutritional_info: { calories: 5, protein_g: 0, carbs_g: 1, fat_g: 0 }, barcode: "100000000005" },
  { id: "p8", name: "Vinho Verde 750ml", bazaarPrice: 5.99, regularPrice: 8.50, stock_level: 11, category: "Beverages", image_url: "", imageAsset: splash, nutritional_info: { calories: 82, protein_g: 0, carbs_g: 3, fat_g: 0 }, barcode: "100000000012", on_sale: true, old_price: 8.50, member_points_earned: 15 },
  { id: "p9", name: "Sumol Laranja", bazaarPrice: 1.20, regularPrice: 1.75, stock_level: 20, category: "Beverages", image_url: "", imageAsset: adaptive, nutritional_info: { calories: 48, protein_g: 0, carbs_g: 12, fat_g: 0 }, barcode: "100000000013" },
  // Pantry
  { id: "p10", name: "Stellar Olive Oil", bazaarPrice: 14.50, regularPrice: 18.50, stock_level: 2, category: "Pantry", image_url: "", imageAsset: splash, nutritional_info: { calories: 120, protein_g: 0, carbs_g: 0, fat_g: 14 }, barcode: "100000000006", on_sale: true, old_price: 18.50, member_points_earned: 20 },
  { id: "p11", name: "Arroz Carolino 1kg", bazaarPrice: 1.89, regularPrice: 2.45, stock_level: 30, category: "Pantry", image_url: "", imageAsset: icon, nutritional_info: { calories: 130, protein_g: 3, carbs_g: 28, fat_g: 0 }, barcode: "100000000014" },
  // Braga Specialties
  { id: "p12", name: "Bolo de Bolacha", bazaarPrice: 6.50, regularPrice: 8.90, stock_level: 1, category: "Braga Specialties", image_url: "", imageAsset: adaptive, nutritional_info: { calories: 310, protein_g: 4, carbs_g: 42, fat_g: 14 }, barcode: "100000000015" },
  { id: "p13", name: "Pudim Abade Priscos", bazaarPrice: 7.20, regularPrice: 9.80, stock_level: 5, category: "Braga Specialties", image_url: "", imageAsset: splash, nutritional_info: { calories: 280, protein_g: 6, carbs_g: 38, fat_g: 12 }, barcode: "100000000016", on_sale: true, old_price: 9.80, member_points_earned: 12 },
  { id: "p14", name: "Papas de Sarrabulho", bazaarPrice: 8.90, regularPrice: 11.50, stock_level: 3, category: "Braga Specialties", image_url: "", imageAsset: icon, nutritional_info: { calories: 350, protein_g: 18, carbs_g: 20, fat_g: 22 }, barcode: "100000000017" },
];

/* ── Recipes ────────────────────────────────────────────── */
export const recipes: Recipe[] = [
  { id: "r1", name: "Moonlight Brunch", description: "Avocado toast with espresso pairing.", productIds: ["p2", "p4", "p7"] },
  { id: "r2", name: "Braga Feast", description: "Pudim, Bolo de Bolacha & Vinho Verde.", productIds: ["p12", "p13", "p8"] },
  { id: "r3", name: "Solar Picnic", description: "Berry bowl, croissants, and olive oil dip.", productIds: ["p1", "p5", "p10"] },
];

/* ── Mock Profile ───────────────────────────────────────── */
export const mockProfile: Profile = {
  id: "u1",
  username: "Maria B.",
  name: "Maria Braga",
  loyalty_points: 1240,
  loyalty_tier: "Gold",
  total_saved: 47.30,
  preferences: ["Fresh", "Braga Specialties"],
};

/* ── Pickup Slots ───────────────────────────────────────── */
export const pickupSlots: PickupSlot[] = [
  { id: "s1", date: "Hoje", window: "09:00 – 10:00", available: true },
  { id: "s2", date: "Hoje", window: "10:00 – 11:00", available: true },
  { id: "s3", date: "Hoje", window: "11:00 – 12:00", available: false },
  { id: "s4", date: "Hoje", window: "14:00 – 15:00", available: true },
  { id: "s5", date: "Amanhã", window: "15:00 – 16:00", available: true },
  { id: "s6", date: "Amanhã", window: "17:00 – 18:00", available: false },
  { id: "s7", date: "Amanhã", window: "18:00 – 19:00", available: true },
];

/* ── Default Shopping List ──────────────────────────────── */
export const defaultShoppingList: ShoppingList = {
  id: "sl1",
  name: "Semanal",
  items: [
    { id: "sli1", productId: "p1", quantity: 2, checked: false },
    { id: "sli2", productId: "p4", quantity: 1, checked: false },
    { id: "sli3", productId: "p7", quantity: 1, checked: true },
    { id: "sli4", productId: "p12", quantity: 1, checked: false },
  ],
};
