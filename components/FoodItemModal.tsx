"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import Banner from "@/public/Banner.png";
import { Button } from "@/components/ui/button";
import { FoodItem, AddOnOption, Portion } from "@/lib/mockdata";
import { useCart } from "@/context/CartContext";

interface SelectedAddOnOption extends AddOnOption {
  quantity: number;
}

interface FoodItemModalProps {
  item: FoodItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FoodItemModal({ item, open, onOpenChange }: FoodItemModalProps) {
  const { addToCart } = useCart();

  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);
  const [selectedServingType, setSelectedServingType] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, SelectedAddOnOption[]>>({});

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (item) {
      setImageIndex(0);
      setQuantity(1);
      setSelectedPortion(null);
      setSelectedServingType("");
      setSelectedAddOns({});

      if (item.type === "Simple" && item.portion.length > 0) {
        setSelectedPortion(item.portion[0]);
      }
      if (item.type === "Customizable") {
        const firstServingType =
          item.servingTypePricing?.[0]?.servingType ||
          item.servingType?.[0] ||
          "";
        setSelectedServingType(firstServingType);
      }
    }
  }, [item]);

  // Only render when open is true - prevents flash on page load
  if (!open || !item) return null;

  const isUnavailable = item.status === "Out of Stock";

  const getAddOnQuantity = (groupUid: string, optionUid: string) =>
    (selectedAddOns[groupUid] || []).find((o) => o.uid === optionUid)?.quantity || 0;

  const toggleAddOn = (
    group: FoodItem["addOnGroup"][number],
    option: AddOnOption
  ) => {
    setSelectedAddOns((prev) => {
      const current = prev[group.uid] || [];
      const isSelected = current.some((o) => o.uid === option.uid);

      if (group.selection === "single") {
        return {
          ...prev,
          [group.uid]: isSelected ? [] : [{ ...option, quantity: 1 }],
        };
      }

      if (isSelected) {
        return {
          ...prev,
          [group.uid]: current.filter((o) => o.uid !== option.uid),
        };
      }

      const maxSelection = group.maxSelection || group.addOnOptions.length;
      if (current.length >= maxSelection) return prev;

      return {
        ...prev,
        [group.uid]: [...current, { ...option, quantity: 1 }],
      };
    });
  };

  const updateAddOnQuantity = (groupUid: string, optionUid: string, change: number) => {
    setSelectedAddOns((prev) => {
      const current = prev[groupUid] || [];
      const next = current
        .map((option) =>
          option.uid === optionUid
            ? { ...option, quantity: option.quantity + change }
            : option
        )
        .filter((option) => option.quantity > 0);
      return { ...prev, [groupUid]: next };
    });
  };

  const basePrice = (() => {
    if (!item) return 0;
    if (item.type === "Simple") return selectedPortion?.price || 0;
    if (item.type === "Customizable") {
      const servingTypePrice = item.servingTypePricing?.find(
        (entry) => entry.servingType === selectedServingType
      )?.price || 0;
      const addOnTotal = Object.values(selectedAddOns)
        .flat()
        .reduce((sum, o) => sum + o.price * (o.quantity || 0), 0);
      return servingTypePrice + addOnTotal;
    }
    if (item.type === "Bundle") {
      const bundleTotal = item.bundleConfig.reduce((sum, b) => sum + b.price, 0);
      const addOnTotal = Object.values(selectedAddOns)
        .flat()
        .reduce((sum, o) => sum + o.price * (o.quantity || 0), 0);
      return bundleTotal + addOnTotal;
    }
    return 0;
  })();

  const totalPrice = basePrice * quantity;
  const isReadyToAdd = (() => {
    if (isUnavailable) return false;
    if (item.type === "Simple") return !!selectedPortion;
    if (item.type === "Customizable") {
      if (!selectedServingType) return false;
      return item.addOnGroup
        .filter((group) => group.isRequired)
        .every((group) => (selectedAddOns[group.uid] || []).length > 0);
    }
    return true;
  })();

  const cartId = (() => {
    if (item.type === "Simple" && selectedPortion) return `${item.uid}-${selectedPortion.uid}`;
    if (item.type === "Customizable") {
      const addOnKey = Object.values(selectedAddOns)
        .flat()
        .map((option) => `${option.uid}:${option.quantity}`)
        .sort()
        .join("-");
      return `${item.uid}-${selectedServingType}-${addOnKey}`;
    }
    if (item.type === "Bundle") {
      const addOnKey = Object.values(selectedAddOns)
        .flat()
        .map((option) => `${option.uid}:${option.quantity}`)
        .sort()
        .join("-");
      return `${item.uid}-${addOnKey}`;
    }
    return item.uid;
  })();

  const handleAddToCart = () => {
    if (!isReadyToAdd) return;

    const foodSelection: import("@/context/CartContext").FoodSelection = {
      type: item.type,
      productUid: item.uid,
    };

    if (item.type === "Simple" && selectedPortion) {
      foodSelection.portion = [{ uid: selectedPortion.uid, quantity: 1 }];
    }
    if (item.type === "Customizable") {
      foodSelection.servingType = selectedServingType;
      foodSelection.addOnGroup = Object.entries(selectedAddOns)
        .filter(([, options]) => options.length > 0)
        .map(([groupUid, options]) => ({
          uid: groupUid,
          addOnGroupOption: options.map((o) => ({ uid: o.uid, quantity: o.quantity || 0 })),
        }));
    }
    if (item.type === "Bundle" && item.bundleConfig.length > 0) {
      foodSelection.bundleConfig = { uid: item.bundleConfig[0].uid, quantity: 1 };
      foodSelection.addOnGroup = Object.entries(selectedAddOns)
        .filter(([, options]) => options.length > 0)
        .map(([groupUid, options]) => ({
          uid: groupUid,
          addOnGroupOption: options.map((o) => ({ uid: o.uid, quantity: o.quantity || 0 })),
        }));
    }

    const addOnNames = Object.values(selectedAddOns)
      .flat()
      .map((option) => option.quantity > 1 ? `${option.name} x${option.quantity}` : option.name)
      .join(", ");

    const cartName = item.type === "Simple" && selectedPortion
      ? `${item.name} (${selectedPortion.name})`
      : item.type === "Customizable" && selectedServingType && addOnNames
        ? `${item.name} (${selectedServingType}) + ${addOnNames}`
        : item.type === "Customizable" && selectedServingType
          ? `${item.name} (${selectedServingType})`
          : addOnNames
            ? `${item.name} + ${addOnNames}`
            : item.name;

    const cartProduct = {
      id: cartId,
      originalProductId: item.uid,
      product_id: item.uid,
      name: cartName,
      price: basePrice,
      image: item.product_images[0] || Banner,
      description: item.description,
      foodSelection,
    };

    addToCart(cartProduct, quantity);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 backdrop-blur-xs bg-black/50" onClick={() => onOpenChange(false)} />

      {/* Modal */}
      <div className="relative flex max-h-[100dvh] w-full max-w-5xl flex-col overflow-hidden bg-white shadow-xl sm:max-h-[92vh] sm:rounded-3xl">
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#71717A] shadow-sm hover:bg-gray-50"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex min-h-0 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          {/* Left - Product image */}
          <div className="relative min-h-[260px] w-full shrink-0 overflow-hidden bg-gray-100 sm:min-h-[320px] lg:h-auto lg:min-h-[620px] lg:w-[48%]">
            <Image
              src={item.product_images[imageIndex] || Banner}
              alt={item.name}
              fill
              className="object-cover"
            />
            {item.product_images.length > 1 && (
              <div className="absolute right-3 bottom-3 flex gap-2">
                {item.product_images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === imageIndex ? "bg-white scale-125" : "bg-white/60"}`}
                    aria-label={`Show image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right - Customization */}
          <div className="w-full space-y-6 p-5 lg:flex-1 lg:overflow-y-auto lg:p-8">
            {/* Product name & base price */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#71717A]">{item.type}</p>
              <h2 className="mt-1 text-2xl font-bold text-[#111827]">{item.name}</h2>
              {item.description && <p className="mt-2 text-sm leading-6 text-[#71717A]">{item.description}</p>}
              <p className="mt-3 text-lg font-bold text-[#111827]">From ₦{basePrice.toLocaleString()}</p>
            </div>

            {/* Portion selection for Simple items */}
            {(item.type === "Simple" && item.portion.length > 0) && (
              <div>
                <h3 className="mb-3 text-base font-semibold">Choose a portion</h3>
                <div className="space-y-2">
                  {item.portion.map((p) => (
                    <button
                      key={p.uid}
                      onClick={() => setSelectedPortion(p)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${selectedPortion?.uid === p.uid ? "border-[#005B14] bg-[#005B14]/5" : "border-[#ECECEC] hover:border-[#C9D4CA]"}`}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{p.name}</span>
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                          {p.startPrepTime}–{p.endPrepTime} mins
                        </span>
                      </div>
                      <span className="font-semibold text-[#111827]">₦{p.price.toLocaleString()}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Serving type for Customizable items */}
            {(item.type === "Customizable" && item.servingType.length > 0) && (
              <div>
                <h3 className="mb-3 text-base font-semibold">Choose a serving type</h3>
                <div className="space-y-2">
                  {item.servingType.map((type) => {
                    const price = item.servingTypePricing?.find((entry) => entry.servingType === type)?.price || 0;
                    const isSelected = selectedServingType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setSelectedServingType(type)}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${isSelected ? "border-[#005B14] bg-[#005B14]/5" : "border-[#ECECEC] hover:border-[#C9D4CA]"}`}
                      >
                        <span className="font-medium capitalize">{type}</span>
                        <span className="font-semibold text-[#111827]">₦{price.toLocaleString()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add-ons marked as Optional (like Daash) */}
            {item.addOnGroup.map((group) => {
              const selected = selectedAddOns[group.uid] || [];
              return (
                <div key={group.uid}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">{group.name}</h3>
                      <p className="text-xs text-gray-400">
                        {group.isRequired ? "Select an option" : "Optional"}
                      </p>
                    </div>
                    {selected.length > 0 && (
                      <span className="text-xs text-[#4FCA6A] font-medium">
                        {selected.map((o) => o.quantity > 1 ? `${o.name} x${o.quantity}` : o.name).join(", ")}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {group.addOnOptions.map((option) => {
                      const isSelected = (selectedAddOns[group.uid] || []).some((o) => o.uid === option.uid);
                      const addOnQuantity = getAddOnQuantity(group.uid, option.uid);
                      return (
                        <div
                          role="button"
                          tabIndex={0}
                          key={option.uid}
                          onClick={() => toggleAddOn(group, option)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              toggleAddOn(group, option);
                            }
                          }}
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all ${isSelected ? "border-[#005B14] bg-[#005B14]/5" : "border-[#ECECEC] hover:border-[#C9D4CA]"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border-2 ${isSelected ? "border-[#005B14] bg-[#005B14]" : "border-gray-300"}`}
                            >
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="font-medium">{option.name} (+₦{option.price.toLocaleString()})</span>
                          </div>
                          {isSelected && (
                            <div className="flex items-center gap-1 rounded-lg border border-[#4FCA6A]/30 bg-white p-0.5">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateAddOnQuantity(group.uid, option.uid, -1);
                                }}
                                className="rounded p-1 text-gray-500 hover:bg-gray-100"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-5 text-center text-xs font-semibold">{addOnQuantity}</span>
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  updateAddOnQuantity(group.uid, option.uid, 1);
                                }}
                                className="rounded p-1 text-[#005B14] hover:bg-[#005B14]/10"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Price and quantity summary */}
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-5">
              <div>
                <p className="text-xs text-gray-500">Your total</p>
                <p className="text-2xl font-bold text-[#111827]">₦{totalPrice.toLocaleString()}</p>
              </div>

              {!isUnavailable && (
                <div className="flex items-center border rounded-xl p-1 bg-[#E0E0E0] text-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-1 hover:bg-gray-200 rounded"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 bg-card h-full flex items-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 hover:bg-gray-200 rounded"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Primary action */}
            <div className="border-t border-gray-100 pt-3">
              <div className="flex w-full">
                {!isUnavailable && (
                  <Button
                    onClick={handleAddToCart}
                    disabled={!isReadyToAdd}
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    {`Add ${quantity} to cart (₦${totalPrice.toLocaleString()})`}
                  </Button>
                )}
                {isUnavailable && (
                  <Button disabled className="w-full bg-gray-100 text-gray-400">
                    Sold Out
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodItemModal;
