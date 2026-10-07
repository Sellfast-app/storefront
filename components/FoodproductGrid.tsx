"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FoodItem } from "@/lib/mockdata";
import { getFoodCardPrice } from "@/lib/foodPricing";
import FoodItemModal from "./FoodItemModal";

interface FoodProductGridProps {
  items: FoodItem[];
  isLoading?: boolean;
  searchQuery?: string;
}

function FoodCard({ item }: { item: FoodItem }) {
  const [modalOpen, setModalOpen] = useState(false);
  const price = getFoodCardPrice(item);
  const isUnavailable = item.status === "Out of Stock";

  return (
    <>
      <article
        className={`group cursor-pointer ${isUnavailable ? "opacity-60" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => setModalOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setModalOpen(true);
          }
        }}
        aria-label={`View ${item.name}`}
      >
        <div className="relative aspect-[1.12/1] overflow-hidden rounded-2xl bg-[#F3F4F2]">
          <Image
            src={item.product_images[0] || "/placeholder-food.jpg"}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
          />
          {isUnavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#111827]">
                Sold out
              </span>
            </div>
          )}
        </div>

        <div className="px-0.5 pt-3">
          <h3 className="line-clamp-1 text-sm font-semibold text-[#111827] sm:text-base">
            {item.name}
          </h3>
          {item.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#71717A] sm:text-sm">
              {item.description}
            </p>
          )}
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-xs text-[#71717A]">From</span>
            <span className="text-sm font-bold text-[#111827] sm:text-base">
              {price === null ? "-" : `₦${price.toLocaleString()}`}
            </span>
          </div>
        </div>
      </article>

      <FoodItemModal item={item} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}

function FoodCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[1.12/1] rounded-2xl bg-gray-100" />
      <div className="space-y-2 px-0.5 pt-3">
        <div className="h-4 w-3/4 rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
        <div className="h-4 w-1/3 rounded bg-gray-100" />
      </div>
    </div>
  );
}

export default function FoodProductGrid({
  items,
  isLoading = false,
  searchQuery = "",
}: FoodProductGridProps) {
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <FoodCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="col-span-full py-16 text-center">
        <p className="text-sm text-[#71717A]">
          {searchQuery
            ? `No food items found matching "${searchQuery}"`
            : "No food items available right now"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
      {filtered.map((item) => (
        <FoodCard key={item.uid} item={item} />
      ))}
    </div>
  );
}
