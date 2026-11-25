import { isMockFoodStorefront, isMockRetailStorefront, mockRetailProducts, mockStorefrontFoodItems } from "./storefront-mock";

export const previewBranches = [
  { id: "main", name: "Redemption Camp", address: "Redemption Camp, Ogun", isDefault: true },
  { id: "lagos", name: "Lagos", address: "Ikeja, Lagos", isDefault: false },
] as const;
export type BranchId = typeof previewBranches[number]["id"];
export const supportsBranches = (storeId: string) => isMockFoodStorefront(storeId) || isMockRetailStorefront(storeId);
export const branchKey = (storeId: string) => "swiftree:branch:" + storeId;
export const validBranch = (value: string | null): value is BranchId => previewBranches.some(branch => branch.id === value);
export function resolveBranch(requested: string | null, remembered: string | null): BranchId | "all" {
  const validSelection = (value: string | null): value is BranchId | "all" => value === "all" || validBranch(value);
  return validSelection(requested) ? requested : validSelection(remembered) ? remembered : "main";
}
export function selectedBranch(storeId: string): BranchId | "all" {
  try { return resolveBranch(null, localStorage.getItem(branchKey(storeId))); } catch { return "main"; }
}
export function currentBranchSelection(storeId: string): string | null {
  try { return localStorage.getItem(branchKey(storeId)); } catch { return null; }
}
export function currentBranchId(storeId: string): string | null {
  try {
    const branchId = currentBranchSelection(storeId);
    return branchId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(branchId) ? branchId : null;
  } catch { return null; }
}
// Explicit demo overrides, not exchange rates or production pricing rules.
export function retailBranchProducts(branch: BranchId | "all") {
  return mockRetailProducts.filter((_, index) => branch === "main" || branch === "all" || index !== 4).map((product, index) => ({
    ...product,
    product_price: branch === "lagos" && index === 0 ? 20000 : product.product_price,
    variants: JSON.stringify((JSON.parse(product.variants || "[]") as { size: string; color: string; quantity: number; price: string }[]).map(variant => ({
      ...variant, price: branch === "lagos" && index === 0 ? String(Number(variant.price) + 1500) : variant.price,
    }))),
  }));
}
export function foodBranchProducts(branch: BranchId | "all") {
  return mockStorefrontFoodItems.filter((_, index) => branch === "main" || branch === "all" || index !== 1).map((item, index) => ({
    ...item,
    portion: item.portion.map(portion => ({ ...portion, price: branch === "lagos" && index === 0 ? portion.price + 300 : portion.price })),
    servingTypePricing: item.servingTypePricing?.map(serving => ({ ...serving, price: branch === "lagos" && index === 0 ? serving.price + 300 : serving.price })),
  }));
}
