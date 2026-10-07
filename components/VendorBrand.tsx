"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  isMockEventStorefront,
  isMockFoodStorefront,
  isMockRetailStorefront,
  mockEventStoreDetails,
  mockFoodStoreDetails,
  mockRetailStoreDetails,
} from "@/lib/storefront-mock";

interface Brand {
  name: string;
  logo: string | null;
}

export default function VendorBrand({ storeId, brand }: { storeId: string; brand?: Brand }) {
  const [savedBrand, setSavedBrand] = useState<Brand | null>(null);
  const [failedLogo, setFailedLogo] = useState<string | null>(null);

  useEffect(() => {
    setSavedBrand(null);
    try {
      const saved = sessionStorage.getItem(`storefront_brand_${storeId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedBrand({
          name: typeof parsed.name === "string" ? parsed.name : "Store",
          logo: typeof parsed.logo === "string" ? parsed.logo : null,
        });
      }
    } catch {
      setSavedBrand(null);
    }
  }, [storeId]);

  const previewStore = isMockFoodStorefront(storeId)
    ? mockFoodStoreDetails
    : isMockRetailStorefront(storeId)
      ? mockRetailStoreDetails
      : isMockEventStorefront(storeId)
        ? mockEventStoreDetails
        : null;
  const resolved = brand?.name
    ? brand
    : previewStore
      ? { name: previewStore.store_name, logo: previewStore.logo }
      : savedBrand;

  return (
    <Link href={`/storefront/${storeId}`} aria-label={`${resolved?.name || "Store"} home`} className="flex h-12 min-w-0 max-w-[200px] items-center">
      {resolved?.logo && resolved.logo !== failedLogo ? (
        <Image
          src={resolved.logo}
          alt={`${resolved.name} logo`}
          width={160}
          height={48}
          className="h-12 w-auto max-w-full object-contain object-left"
          onError={() => setFailedLogo(resolved.logo)}
        />
      ) : (
        <span className="truncate text-base font-semibold">{resolved?.name || "Store"}</span>
      )}
    </Link>
  );
}
