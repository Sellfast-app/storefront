import type { FoodItem } from "@/lib/mockdata";

export function getFoodCardPrice(item: FoodItem): number | null {
  if (item.type === "Simple" && item.portion.length > 0) {
    return Math.min(...item.portion.map((portion) => portion.price));
  }

  if (item.type === "Customizable") {
    return item.servingTypePricing?.[0]?.price ?? null;
  }

  if (item.type === "Bundle") {
    return item.bundleConfig[0]?.price ?? null;
  }

  return null;
}

export function getFoodCardPriceDetails(item: FoodItem): { price: number | null; originalPrice?: number } {
  const options = item.type === "Simple" ? item.portion
    : item.type === "Customizable" ? item.servingTypePricing || []
      : item.bundleConfig;
  if (options.length === 0) return { price: null };
  const lowest = [...options].sort((a, b) => a.price - b.price)[0];
  return {
    price: lowest.price,
    ...(Number(lowest.discount_amount || 0) > 0 ? { originalPrice: Number(lowest.base_price ?? lowest.price) } : {}),
  };
}
