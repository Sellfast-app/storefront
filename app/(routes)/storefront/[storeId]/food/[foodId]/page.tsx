// app/storefront/[storeId]/food/[foodId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Banner from "@/public/Banner.png";
import Logo from "@/components/svgIcons/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchIcon from "@/components/svgIcons/SearchIcon";
import FilterIcon from "@/components/svgIcons/FilterIcon";
import CartButton from "@/components/CartButton";
import CartView from "@/components/CartView";
import { useCart } from "@/context/CartContext";
import { PlusIcon, Clock, Flame, Leaf, ChevronLeft, ChevronRight } from "lucide-react";
import MinusIcon from "@/components/svgIcons/MinusIcon";
import { FoodItem, Portion, AddOnGroup, AddOnOption, BundleConfig } from "@/lib/mock-data/food-items";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SelectedAddOns {
  [groupUid: string]: AddOnOption[];
}

interface SelectedBundleItems {
  [bundleUid: string]: number; // count selected for each bundle slot
}

// ─── Image Carousel ───────────────────────────────────────────────────────────

function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative w-full h-80 md:h-96 rounded-2xl overflow-hidden group">
      <Image
        src={images[current] || Banner}
        alt={name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => setCurrent((c) => (c + 1) % images.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 justify-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === current ? "border-[#4FCA6A]" : "border-white/50"
              }`}
            >
              <Image src={img || Banner} alt="" fill className="object-cover" sizes="48px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Label Icons ──────────────────────────────────────────────────────────────

const LABEL_ICONS: Record<string, React.ReactNode> = {
  Spicy: <Flame className="w-3 h-3 text-red-500" />,
  Vegetarian: <Leaf className="w-3 h-3 text-green-500" />,
  "Gluten-Free": <span className="text-[10px] font-bold text-amber-600">GF</span>,
  Halal: <span className="text-[10px] font-bold text-teal-600">H</span>,
  "Dairy-Free": <span className="text-[10px] font-bold text-blue-500">DF</span>,
  "Contains Nuts": <span className="text-[10px] font-bold text-orange-500">N</span>,
};

// ─── Main Page ────────────────────────────────────────────────────────────────

function Page() {
  const params = useParams();
  const storeId = params.storeId as string;
  const foodId = params.foodId as string;

  const { addToCart, cart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [food, setFood] = useState<FoodItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Selection state ──────────────────────────────────────────────────────
  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOns>({});
  const [quantity, setQuantity] = useState(1);

  // ── Fetch food item ──────────────────────────────────────────────────────
  useEffect(() => {
    const fetchFood = async () => {
      if (!storeId || !foodId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/stores/${storeId}/food/${foodId}`);
        if (!response.ok) throw new Error("Failed to fetch food item");
        const result = await response.json();
        if (result.status === "success" && result.data) {
          setFood(result.data);
          // Auto-select first portion for Simple items
          if (result.data.type === "Simple" && result.data.portion?.length > 0) {
            setSelectedPortion(result.data.portion[0]);
          }
        } else {
          throw new Error("Food item not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Food item not found");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFood();
  }, [storeId, foodId]);

  // ── Fetch related food items ─────────────────────────────────────────────
  useEffect(() => {
    const fetchRelated = async () => {
      if (!storeId) return;
      try {
        const response = await fetch(`/api/stores/${storeId}/food`);
        if (!response.ok) return;
        const result = await response.json();
        if (result.status === "success" && Array.isArray(result.data)) {
          setRelatedItems(
            result.data
              .filter((item: FoodItem) => item.uid !== foodId)
              .slice(0, 6)
          );
        }
      } catch (err) {
        console.error("Error fetching related food items:", err);
      }
    };
    fetchRelated();
  }, [storeId, foodId]);

  // ── Add-on handlers ──────────────────────────────────────────────────────

  const handleAddOnToggle = (group: AddOnGroup, option: AddOnOption) => {
    setSelectedAddOns((prev) => {
      const current = prev[group.uid] || [];
      if (group.selection === "single") {
        // Single choice — replace
        return { ...prev, [group.uid]: [option] };
      } else {
        // Multiple — toggle, respect maxSelection
        const isSelected = current.some((o) => o.uid === option.uid);
        if (isSelected) {
          return { ...prev, [group.uid]: current.filter((o) => o.uid !== option.uid) };
        } else if (current.length < group.maxSelection) {
          return { ...prev, [group.uid]: [...current, option] };
        }
        return prev;
      }
    });
  };

  const isAddOnSelected = (groupUid: string, optionUid: string) =>
    (selectedAddOns[groupUid] || []).some((o) => o.uid === optionUid);

  // ── Price calculation ────────────────────────────────────────────────────

  const basePrice = (() => {
    if (!food) return 0;
    if (food.type === "Simple") return selectedPortion?.price || 0;
    if (food.type === "Customizable") {
      return Object.values(selectedAddOns)
        .flat()
        .reduce((sum, o) => sum + o.price, 0);
    }
    if (food.type === "Bundle") {
      return food.bundleConfig.reduce((sum, b) => sum + b.price, 0);
    }
    return 0;
  })();

  const totalPrice = basePrice * quantity;

  // ── Validation ───────────────────────────────────────────────────────────

  const isReadyToAdd = (() => {
    if (!food) return false;
    if (food.status === "Out of Stock") return false;
    if (food.type === "Simple") return !!selectedPortion;
    if (food.type === "Customizable") {
      return food.addOnGroup
        .filter((g) => g.isRequired)
        .every((g) => (selectedAddOns[g.uid] || []).length > 0);
    }
    return true;
  })();

  // ── Cart ─────────────────────────────────────────────────────────────────

  const getCartId = () => {
    if (!food) return "";
    if (food.type === "Simple" && selectedPortion) {
      return `${food.uid}-${selectedPortion.uid}`;
    }
    if (food.type === "Customizable") {
      const addOnKey = Object.values(selectedAddOns)
        .flat()
        .map((o) => o.uid)
        .sort()
        .join("-");
      return `${food.uid}-${addOnKey}`;
    }
    return food.uid;
  };

  const currentCartQty = (() => {
    const id = getCartId();
    const item = cart.find((c) => c.id === id);
    return item?.quantity || 0;
  })();

  const handleAddToCart = () => {
    if (!food || !isReadyToAdd) return;

    const addOnNames = Object.values(selectedAddOns)
      .flat()
      .map((o) => o.name)
      .join(", ");

    const itemName = food.type === "Simple" && selectedPortion
      ? `${food.name} (${selectedPortion.name})`
      : addOnNames
      ? `${food.name} + ${addOnNames}`
      : food.name;

    addToCart(
      {
        id: getCartId(),
        name: itemName,
        price: basePrice,
        image: food.product_images[0] || Banner,
        description: food.description,
      },
      quantity
    );
  };

  const toggleCart = () => {
    setShowCart(!showCart);
    if (!showCart && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ── Loading / Error ──────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FCFCFC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FCA6A] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The food item you are looking for does not exist."}</p>
          <Link href={`/storefront/${storeId}`}>
            <Button>Back to Store</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isUnavailable = food.status === "Out of Stock";

  return (
    <div className="flex flex-col bg-[#FCFCFC]">
      {/* Mobile Header */}
      <div className="md:hidden p-4 sticky top-0 bg-white dark:bg-background z-10">
        <div className="flex items-center justify-between">
          <Link href={`/storefront/${storeId}`}><Logo /></Link>
          <div className="flex gap-2">
            <div className="relative flex items-center">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-xs dark:bg-background rounded-lg border-[#F5F5F5] dark:border-[#1F1F1F]"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <CartButton onClick={toggleCart} />
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col md:flex-row justify-between gap-4 md:h-screen md:overflow-hidden">

        {/* ── Left Column ─────────────────────────────────────────────────── */}
        <div className="w-full md:w-[45%] md:overflow-y-auto md:h-full">
          {showCart ? (
            <CartView />
          ) : (
            <>
              <ImageCarousel images={food.product_images} name={food.name} />

              <div className="mt-6 space-y-4">
                {/* Name + status badges */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h1 className="text-lg font-semibold">{food.name}</h1>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${
                        food.status === "Available Today" ? "bg-green-500"
                        : food.status === "Out of Stock" ? "bg-red-500"
                        : "bg-orange-400"
                      }`}>
                        {food.status === "Out of Stock" ? "Sold Out"
                          : food.status === "Seasonal" ? "Pre-order"
                          : food.status}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#4FCA6A]/10 text-[#4FCA6A] border border-[#4FCA6A]/30">
                        {food.type}
                      </span>
                    </div>
                  </div>

                  {/* Quantity selector */}
                  {!isUnavailable && (
                    <div className="flex items-center border rounded-xl p-1 bg-[#E0E0E0] text-xs">
                      <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-1 hover:bg-gray-200 rounded">
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="px-4 bg-card h-full flex items-center">{quantity}</span>
                      <button onClick={() => setQuantity((q) => q + 1)} className="p-1 hover:bg-gray-200 rounded">
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500">{food.description}</p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                  <span className="capitalize">{food.servingType.join(", ")}</span>
                  <span>·</span>
                  <span>{food.availability}</span>
                  {food.labels.length > 0 && (
                    <>
                      <span>·</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {food.labels.map((label) => (
                          <span key={label} className="flex items-center gap-0.5 bg-gray-100 px-1.5 py-0.5 rounded-full">
                            {LABEL_ICONS[label] ?? null}
                            {label}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* ── SIMPLE: Portion selector ───────────────────────────── */}
                {food.type === "Simple" && food.portion.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Choose a Portion</h3>
                    <div className="space-y-2">
                      {food.portion.map((p) => (
                        <button
                          key={p.uid}
                          onClick={() => setSelectedPortion(p)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                            selectedPortion?.uid === p.uid
                              ? "border-[#4FCA6A] bg-[#4FCA6A]/5"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{p.name}</span>
                            <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {p.startPrepTime}–{p.endPrepTime} mins · {p.servingPerServingType} {p.servingType}
                            </span>
                          </div>
                          <span className="font-semibold text-[#4FCA6A]">
                            ₦{p.price.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── CUSTOMIZABLE: Add-on groups ────────────────────────── */}
                {food.type === "Customizable" && food.addOnGroup.length > 0 && (
                  <div className="space-y-5">
                    {food.addOnGroup.map((group) => {
                      const selected = selectedAddOns[group.uid] || [];
                      return (
                        <div key={group.uid}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="text-sm font-semibold">{group.name}</h3>
                              <p className="text-xs text-gray-400">
                                {group.selection === "single" ? "Choose one" : `Choose up to ${group.maxSelection}`}
                                {group.isRequired && <span className="text-red-500 ml-1">*</span>}
                              </p>
                            </div>
                            {selected.length > 0 && (
                              <span className="text-xs text-[#4FCA6A] font-medium">
                                {selected.map((o) => o.name).join(", ")}
                              </span>
                            )}
                          </div>
                          <div className="space-y-2">
                            {group.addOnOptions.map((option) => {
                              const isSelected = isAddOnSelected(group.uid, option.uid);
                              return (
                                <button
                                  key={option.uid}
                                  onClick={() => handleAddOnToggle(group, option)}
                                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                                    isSelected
                                      ? "border-[#4FCA6A] bg-[#4FCA6A]/5"
                                      : "border-gray-100 hover:border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                      isSelected ? "border-[#4FCA6A] bg-[#4FCA6A]" : "border-gray-300"
                                    }`}>
                                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <span className="font-medium">{option.name}</span>
                                  </div>
                                  <span className="text-[#4FCA6A] font-semibold">
                                    +₦{option.price.toLocaleString()}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── BUNDLE: Bundle slots ───────────────────────────────── */}
                {food.type === "Bundle" && food.bundleConfig.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Bundle Includes</h3>
                    <div className="space-y-2">
                      {food.bundleConfig.map((bundle) => (
                        <div
                          key={bundle.uid}
                          className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-gray-50"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{bundle.name}</span>
                            <span className="text-xs text-gray-400">{bundle.category} · up to {bundle.maxCount} items</span>
                          </div>
                          <span className="text-sm font-semibold text-[#4FCA6A]">
                            ₦{bundle.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Price + Add to Cart ────────────────────────────────── */}
                <Card className="shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]">
                  <CardContent className="flex items-center justify-between pt-6">
                    <div>
                      <span className="text-xs text-gray-500">Total Price</span>
                      <h3 className="text-xl font-bold">
                        {totalPrice > 0 ? `₦${totalPrice.toLocaleString()}` : "—"}
                      </h3>
                      {quantity > 1 && basePrice > 0 && (
                        <p className="text-xs text-gray-400">
                          ₦{basePrice.toLocaleString()} × {quantity}
                        </p>
                      )}
                    </div>

                    {isUnavailable ? (
                      <span className="text-sm px-4 py-2 rounded-xl bg-gray-100 text-gray-400 font-medium">
                        Sold Out
                      </span>
                    ) : (
                      <Button onClick={handleAddToCart} disabled={!isReadyToAdd}>
                        {currentCartQty > 0 ? `In Cart (${currentCartQty})` : "Add to Cart"}
                      </Button>
                    )}
                  </CardContent>
                  {currentCartQty > 0 && (
                    <div className="px-6 pb-4 text-xs text-green-600 text-center">
                      ✓ {currentCartQty} of this selection already in cart
                    </div>
                  )}
                </Card>

                {/* Product details card */}
                <Card className="shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]">
                  <CardHeader className="border-b border-[#F5F5F5] text-sm font-semibold">
                    <h3>Item Details</h3>
                  </CardHeader>
                  <CardContent className="pt-4 grid grid-cols-2 gap-2 text-xs">
                    <div><span className="font-semibold">Type:</span> {food.type}</div>
                    <div><span className="font-semibold">Status:</span> {food.status}</div>
                    <div><span className="font-semibold">Availability:</span> {food.availability}</div>
                    <div><span className="font-semibold">Category:</span> {food.category.join(", ")}</div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>

        {/* ── Right Column — Related Items ─────────────────────────────────── */}
        <div className="w-full md:w-[55%] md:overflow-y-auto md:h-full">
          <div className="hidden md:flex items-center justify-between mb-6 sticky top-0 bg-[#FCFCFC] z-10 pb-4">
            <Link href={`/storefront/${storeId}`}><Logo /></Link>
            <div className="flex gap-2">
              <div className="relative flex items-center">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 md:w-84 pl-8 pr-8 py-2 text-xs sm:text-sm dark:bg-background rounded-lg border-[#F5F5F5] dark:border-[#1F1F1F]"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <CartButton onClick={toggleCart} />
            </div>
          </div>

          <h3 className="font-semibold mb-4">You might also like</h3>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedItems
              .filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((item) => {
                const minPrice = item.type === "Simple" && item.portion.length > 0
                  ? Math.min(...item.portion.map((p) => p.price))
                  : item.type === "Customizable" && item.addOnGroup.length > 0
                  ? Math.min(...item.addOnGroup.flatMap((g) => g.addOnOptions.map((o) => o.price)))
                  : null;

                return (
                  <Link key={item.uid} href={`/storefront/${storeId}/food/${item.uid}`}>
                    <div className="flex flex-col rounded-2xl border border-[#F5F5F5] hover:border-[#4FCA6A] transition-colors cursor-pointer">
                      <div className="relative w-full h-36 rounded-t-2xl overflow-hidden">
                        <Image
                          src={item.product_images[0] || Banner}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium line-clamp-2">{item.name}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          {minPrice !== null && (
                            <span className="text-sm font-semibold">₦{minPrice.toLocaleString()}</span>
                          )}
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                            item.type === "Customizable"
                              ? "bg-[#4FCA6A]/10 text-[#4FCA6A]"
                              : item.type === "Bundle"
                              ? "bg-purple-50 text-purple-600"
                              : "bg-blue-50 text-blue-600"
                          }`}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;