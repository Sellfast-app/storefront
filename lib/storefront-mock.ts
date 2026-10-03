import { mockFoodItems } from "@/lib/mockdata";

export const MOCK_RETAIL_STORE_ID = "mock-retail";
export const MOCK_FOOD_STORE_ID = "mock-food";
export const MOCK_EVENT_STORE_ID = "mockevent";

const mockRetailStoreIds = new Set(["mock", "demo", "v2-mock", MOCK_RETAIL_STORE_ID]);
const mockFoodStoreIds = new Set([MOCK_FOOD_STORE_ID, "food-demo"]);
const mockEventStoreIds = new Set([MOCK_EVENT_STORE_ID, "mock-event", "event-demo"]);

export function isMockRetailStorefront(storeId?: string) {
  return !!storeId && mockRetailStoreIds.has(storeId);
}

export function isMockFoodStorefront(storeId?: string) {
  return !!storeId && mockFoodStoreIds.has(storeId);
}

export function isMockEventStorefront(storeId?: string) {
  return !!storeId && mockEventStoreIds.has(storeId);
}

export function isMockStorefront(storeId?: string) {
  return (
    isMockRetailStorefront(storeId) ||
    isMockFoodStorefront(storeId) ||
    isMockEventStorefront(storeId)
  );
}

export const mockRetailStoreDetails = {
  id: MOCK_RETAIL_STORE_ID,
  vendor_id: "mock-vendor-retail",
  store_name: "Luna Atelier",
  business_type: "Fashion & Lifestyle",
  store_description:
    "Curated essentials, handmade accessories and limited lifestyle pieces for modern everyday shopping.",
  store_url: "https://swiftree.app/storefront/mock-retail",
  qr_url: null,
  bot_url: "https://wa.me/2348012345678",
  logo: "/profile.png",
  banner: "/Banner.png",
  banner_style: "portrait",
  banner_images: ["/Banner.png"],
  cac: null,
  tin: null,
  doctype: null,
  cert_media: null,
  metadata: {
    city: "Lekki",
    phone: "08012345678",
    state: "Lagos",
    bot_qr: "",
    address: "24 Admiralty Way",
    country: "Nigeria",
    latitude: 6.4474,
    longitude: 3.4723,
    post_code: "106104",
    owner_name: "Luna Atelier",
    brand_color: {
      accent: "#4FCA6A",
      primary: "#061400",
      secondary: "#F6F7F6",
    },
    address_line_2: "Suite 4",
  },
  updated_at: "2026-10-01T00:00:00.000Z",
  subaccount_code: null,
  availability: [],
};

export const mockFoodStoreDetails = {
  ...mockRetailStoreDetails,
  id: MOCK_FOOD_STORE_ID,
  vendor_id: "mock-vendor-food",
  store_name: "Green Bowl Kitchen",
  business_type: "Restaurant / Food Service",
  store_description:
    "Fresh bowls, rice plates and chef-prepared meals available for pickup or delivery.",
  store_url: "https://swiftree.app/storefront/mock-food",
  bot_url: "https://wa.me/2348098765432",
  metadata: {
    ...mockRetailStoreDetails.metadata,
    address: "18 Bourdillon Road",
    city: "Ikoyi",
    phone: "08098765432",
    owner_name: "Green Bowl Kitchen",
  },
  banner_style: "carousel",
  banner_images: ["/Banner.png", "/Rice.png"],
};

export const mockEventStoreDetails = {
  ...mockRetailStoreDetails,
  id: MOCK_EVENT_STORE_ID,
  vendor_id: "mock-vendor-events",
  store_name: "Apex Events NG",
  business_type: "Events & Ticketing",
  store_description:
    "Discover live shows, conferences and ticketed experiences with checkout-ready ticket tiers.",
  store_url: "https://swiftree.app/storefront/mockevent",
  bot_url: "https://wa.me/2348012345678",
  metadata: {
    ...mockRetailStoreDetails.metadata,
    address: "Eko Convention Centre",
    city: "Victoria Island",
    phone: "08012345678",
    owner_name: "Apex Events NG",
  },
};

export const mockStoreReviews = [
  {
    id: "review-1",
    user_name: "Amara",
    rating: 5,
    comment: "Checkout was smooth and delivery updates were clear from start to finish.",
    created_at: "2026-09-22T10:00:00.000Z",
  },
  {
    id: "review-2",
    user_name: "Tobi",
    rating: 4.5,
    comment: "The storefront feels premium and the product photos made choosing easy.",
    created_at: "2026-09-24T12:00:00.000Z",
  },
  {
    id: "review-3",
    user_name: "Nadine",
    rating: 5,
    comment: "I liked being able to shop online and still message the vendor on WhatsApp.",
    created_at: "2026-09-26T15:00:00.000Z",
  },
];

export const mockRetailProducts = [
  {
    id: "mock-product-1",
    store_id: MOCK_RETAIL_STORE_ID,
    variants: JSON.stringify([
      { size: "S", color: "Olive", quantity: 8, price: "18500" },
      { size: "M", color: "Olive", quantity: 12, price: "18500" },
      { size: "L", color: "Black", quantity: 6, price: "19500" },
    ]),
    created_at: "2026-09-20T08:00:00.000Z",
    updated_at: "2026-09-29T08:00:00.000Z",
    product_sku: "LUNA-TOTE-001",
    product_name: "Everyday Canvas Tote",
    product_type: "Bags",
    product_price: 18500,
    product_images: ["/Banner.png", "/image.png"],
    product_status: "ready",
    est_prod_days_to: 3,
    product_quantity: 26,
    est_prod_days_from: 1,
    product_description:
      "Structured canvas tote with reinforced handles, inner pocket and a clean everyday finish.",
  },
  {
    id: "mock-product-2",
    store_id: MOCK_RETAIL_STORE_ID,
    variants: "[]",
    created_at: "2026-09-18T08:00:00.000Z",
    updated_at: "2026-09-29T08:00:00.000Z",
    product_sku: "LUNA-CANDLE-002",
    product_name: "Cedar & Citrus Candle",
    product_type: "Home",
    product_price: 12000,
    product_images: ["/image.png", "/Banner.png"],
    product_status: "ready",
    est_prod_days_to: 2,
    product_quantity: 40,
    est_prod_days_from: 1,
    product_description:
      "Hand-poured candle with cedar, citrus and warm amber notes for calm interior spaces.",
  },
  {
    id: "mock-product-3",
    store_id: MOCK_RETAIL_STORE_ID,
    variants: "[]",
    created_at: "2026-09-16T08:00:00.000Z",
    updated_at: "2026-09-29T08:00:00.000Z",
    product_sku: "LUNA-JOURNAL-003",
    product_name: "Soft Cover Studio Journal",
    product_type: "Stationery",
    product_price: 8500,
    product_images: ["/profile.png", "/image.png"],
    product_status: "ready",
    est_prod_days_to: 2,
    product_quantity: 34,
    est_prod_days_from: 1,
    product_description:
      "A5 studio journal with smooth dotted pages, flexible cover and lay-flat binding.",
  },
  {
    id: "mock-product-4",
    store_id: MOCK_RETAIL_STORE_ID,
    variants: "[]",
    created_at: "2026-09-12T08:00:00.000Z",
    updated_at: "2026-09-29T08:00:00.000Z",
    product_sku: "LUNA-SCARF-004",
    product_name: "Lightweight Print Scarf",
    product_type: "Accessories",
    product_price: 15000,
    product_images: ["/Banner.png"],
    product_status: "ready",
    est_prod_days_to: 4,
    product_quantity: 18,
    est_prod_days_from: 2,
    product_description:
      "Soft printed scarf designed for layering, gifting and travel-friendly styling.",
  },
  {
    id: "mock-product-5",
    store_id: MOCK_RETAIL_STORE_ID,
    variants: "[]",
    created_at: "2026-09-10T08:00:00.000Z",
    updated_at: "2026-09-29T08:00:00.000Z",
    product_sku: "LUNA-TRAY-005",
    product_name: "Minimal Catchall Tray",
    product_type: "Home",
    product_price: 9800,
    product_images: ["/image.png"],
    product_status: "ready",
    est_prod_days_to: 3,
    product_quantity: 22,
    est_prod_days_from: 1,
    product_description:
      "Compact tray for keys, jewelry and small desk essentials with a matte finish.",
  },
];

export const mockStorefrontFoodItems = mockFoodItems.data.map((item) => ({
  ...item,
  storeId: MOCK_FOOD_STORE_ID,
}));
