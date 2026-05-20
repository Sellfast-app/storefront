"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Clock, Flame, Leaf } from "lucide-react";
import { FoodItem } from "@/lib/mockdata";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FoodProductGridProps {
  items: FoodItem[];
  storeId: string;
  isLoading?: boolean;
  searchQuery?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; dot: string; text: string }
> = {
  "Available Today": {
    label: "Available Today",
    bg: "bg-green-500",
    dot: "bg-white",
    text: "text-white",
  },
  "Out of Stock": {
    label: "Sold Out",
    bg: "bg-red-500",
    dot: "bg-white",
    text: "text-white",
  },
  Seasonal: {
    label: "Pre-order",
    bg: "bg-orange-400",
    dot: "bg-white",
    text: "text-white",
  },
};

const TYPE_CONFIG: Record<string, { label: string; style: string }> = {
  Customizable: {
    label: "Customizable",
    style: "bg-[#4FCA6A]/10 text-[#4FCA6A] border border-[#4FCA6A]/30",
  },
  Bundle: {
    label: "Bundle Meal",
    style: "bg-purple-50 text-purple-600 border border-purple-200",
  },
  Simple: {
    label: "Simple",
    style: "bg-blue-50 text-blue-600 border border-blue-200",
  },
};

// Dietary label icons
const LABEL_ICONS: Record<string, React.ReactNode> = {
  Spicy: <Flame className="w-3 h-3 text-red-500" />,
  Vegetarian: <Leaf className="w-3 h-3 text-green-500" />,
  "Gluten-Free": <span className="text-[10px] font-bold text-amber-600">GF</span>,
  Halal: <span className="text-[10px] font-bold text-teal-600">H</span>,
  "Dairy-Free": <span className="text-[10px] font-bold text-blue-500">DF</span>,
  "Contains Nuts": <span className="text-[10px] font-bold text-orange-500">N</span>,
};

function getPrepTimeRange(item: FoodItem): string | null {
  if (item.type === "Simple" && item.portion.length > 0) {
    const min = Math.min(...item.portion.map((p) => p.startPrepTime));
    const max = Math.max(...item.portion.map((p) => p.endPrepTime));
    return `${min} - ${max} mins`;
  }
  return null;
}

function getBasePrice(item: FoodItem): number | null {
  if (item.type === "Simple" && item.portion.length > 0) {
    return Math.min(...item.portion.map((p) => p.price));
  }
  if (item.type === "Customizable" && item.addOnGroup.length > 0) {
    const minAddOn = Math.min(
      ...item.addOnGroup.flatMap((g) => g.addOnOptions.map((o) => o.price))
    );
    return minAddOn;
  }
  return null;
}

function getServingLabel(item: FoodItem): string {
  const unit = item.servingType[0] || "plate";
  if (item.type === "Simple" && item.portion.length > 0) {
    return `${unit}`;
  }
  return unit;
}

// ─── Image Carousel ───────────────────────────────────────────────────────────

function ImageCarousel({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [current, setCurrent] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };

  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

  return (
    <div className="relative w-full h-44 overflow-hidden rounded-t-2xl group">
      <Image
        src={images[current] || "/placeholder-food.jpg"}
        alt={name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 33vw"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Carousel controls — only if multiple images */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-gray-700" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <ChevronRight className="w-3.5 h-3.5 text-gray-700" />
          </button>
          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Food Card ────────────────────────────────────────────────────────────────

function FoodCard({
  item,
  storeId,
}: {
  item: FoodItem;
  storeId: string;
}) {
  const status = STATUS_CONFIG[item.status] || STATUS_CONFIG["Available Today"];
  const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG["Simple"];
  const prepTime = getPrepTimeRange(item);
  const basePrice = getBasePrice(item);
  const servingLabel = getServingLabel(item);
  const isUnavailable = item.status === "Out of Stock";

  const actionLabel =
    item.type === "Customizable"
      ? "Customize"
      : item.type === "Bundle"
        ? "Build Pack"
        : "+ Add";

  const actionStyle =
    item.type === "Customizable"
      ? "bg-[#4FCA6A] text-white hover:bg-[#3db55a]"
      : item.type === "Bundle"
        ? "bg-purple-600 text-white hover:bg-purple-700"
        : "bg-[#4FCA6A] text-white hover:bg-[#3db55a]";

  return (
    <a
      href={`/storefront/${storeId}/food/${item.uid}`}
      className={`flex flex-col rounded-2xl border border-[#F0F0F0] bg-white overflow-hidden hover:border-[#4FCA6A] hover:shadow-md transition-all duration-200 ${isUnavailable ? "opacity-70" : ""
        }`}
    >
      {/* Image with status badge */}
      <div className="relative">
        <ImageCarousel images={item.product_images} name={item.name} />

        {/* Status badge — top left */}
        <div
          className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.bg} ${status.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-1.5 p-2.5 flex-1">
        {/* Food name */}
        <p className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
          {item.name}
        </p>

        {/* Type badge + dietary labels */}
        <div className="flex flex-wrap items-center gap-1">
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${typeConfig.style}`}
          >
            {typeConfig.label}
          </span>
          {item.labels.slice(0, 2).map((label) => (
            <span
              key={label}
              className="flex items-center gap-0.5 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full"
            >
              {LABEL_ICONS[label] ?? null}
              {label}
            </span>
          ))}
        </div>

        {/* Serving + prep time row */}
        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <span className="capitalize">{servingLabel}</span>
          {item.labels[0] && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                {LABEL_ICONS[item.labels[0]] ?? null}
                {item.labels[0]}
              </span>
            </>
          )}
          {prepTime && (
            <>
              <span>·</span>
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />
                {prepTime}
              </span>
            </>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="flex flex-col">
            {basePrice !== null && (
              <span className="text-sm font-bold text-gray-900">
                ₦{basePrice.toLocaleString()}
              </span>
            )}
            <span className="text-[10px] text-gray-400">
              per {servingLabel}
            </span>
          </div>

          {isUnavailable ? (
            <span className="text-[11px] px-3 py-1.5 rounded-xl bg-gray-100 text-gray-400 font-medium">
              Sold Out
            </span>
          ) : (
            <button
              onClick={(e) => e.preventDefault()}
              className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-colors ${actionStyle}`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </a>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function FoodCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-[#F0F0F0] bg-white overflow-hidden animate-pulse">
      <div className="w-full h-44 bg-gray-100" />
      <div className="p-2.5 flex flex-col gap-2">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-7 bg-gray-100 rounded-xl w-1/4" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function FoodProductGrid({
  items,
  storeId,
  isLoading = false,
  searchQuery = "",
}: FoodProductGridProps) {
  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <FoodCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="col-span-2 lg:col-span-3 text-center py-12">
        <p className="text-gray-500 text-sm">
          {searchQuery
            ? `No food items found matching "${searchQuery}"`
            : "No food items available right now"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {filtered.map((item) => (
        <FoodCard key={item.uid} item={item} storeId={storeId} />
      ))}
    </div>
  );
}