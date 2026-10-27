const COUNTRY_CURRENCY: Record<string, string> = {
  NG: "NGN",
  KE: "KES",
  GH: "GHS",
  ZA: "ZAR",
};

type StoreCurrencyMetadata = Record<string, unknown> & { v2?: { currency?: string; country?: string } };

export function resolveStoreCurrency(metadata?: StoreCurrencyMetadata | null) {
  const v2 = metadata?.v2 || {};
  return String(v2.currency || COUNTRY_CURRENCY[String(v2.country || "").toUpperCase()] || "NGN").toUpperCase();
}

export function setStoreCurrency(storeId: string, metadata?: StoreCurrencyMetadata | null) {
  const currency = resolveStoreCurrency(metadata);
  if (typeof window !== "undefined") {
    sessionStorage.setItem(`storefront_currency_${storeId}`, currency);
    document.documentElement.dataset.storeCurrency = currency;
  }
  return currency;
}

export function getStoreCurrency() {
  if (typeof window === "undefined") return "NGN";
  const storeId = window.location.pathname.match(/\/storefront\/([^/]+)/)?.[1];
  return (storeId && sessionStorage.getItem(`storefront_currency_${storeId}`)) ||
    document.documentElement.dataset.storeCurrency || "NGN";
}

export function formatStoreCurrency(value: number, currency = getStoreCurrency()) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}
