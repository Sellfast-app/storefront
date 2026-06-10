import type { FoodItem } from "@/lib/mockdata";

export function getFoodCardPrice(item: FoodItem): number | null {
  if (item.type === "Simple" && item.portion.length > 0) {
    return Math.min(...item.portion.map((portion) => portion.price));
  }

  if (item.type === "Customizable") {
    return item.servingTypePricing?.[0]?.price ?? null;
  }

  return null;
}
