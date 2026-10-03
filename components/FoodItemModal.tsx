"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { X, Clock, Minus, Plus, ShoppingBag, MapPin, Truck, CreditCard, MessageCircle } from "lucide-react";
import Banner from "@/public/Banner.png";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogOverlay } from "@/components/ui/dialog";
import { FoodItem, AddOnOption, Portion } from "@/lib/mockdata";
import { getFoodCardPrice } from "@/lib/foodPricing";
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
  const params = useParams();
  const pageStoreId = params.storeId as string;

  const { addToCart } = useCart();

  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedPortion, setSelectedPortion] = useState<Portion | null>(null);
  const [selectedServingType, setSelectedServingType] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, SelectedAddOnOption[]>>({});

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

  if (!item) return null;

  const isUnavailable = item.status === "Out of Stock";

  const getAddOnQuantity = (groupUid: string, optionUid: string) =>
    (selectedAddOns[groupUid] || []).find((o) => o.uid === optionUid)?.quantity || 0;

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

  const handleAddToCart = () => {
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

    const cartProduct = {
      id: item.type === "Simple" && selectedPortion ? `${item.uid}-${selectedPortion.uid}` : item.uid,
      originalProductId: item.uid,
      product_id: item.uid,
      name: item.type === "Simple" && selectedPortion ? `${item.name} (${selectedPortion.name})` : item.name,
      price: totalPrice,
      image: item.product_images[0] || Banner,
      description: item.description,
      foodSelection,
    };

    addToCart(cartProduct, quantity);
    window.location.href = `/storefront/${pageStoreId}/food/${item.uid}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay />
      <DialogContent className="max-w-5xl overflow-hidden sm:max-w-6xl">
        <DialogHeader className="px-0 pt-0 pb-0">
          <DialogTitle className="sr-only">{item.name}</DialogTitle>
          <DialogDescription className="sr-only">Full product details and add-ons for {item.name}.</DialogDescription>
        </DialogHeader>

        <div className="grid flex-1 gap-0 lg:grid-cols-[minmax(0,1fr)_420px)] lg:gap-0">
          {/* Left image + details */}
          <div className="flex flex-col">
            <div className="relative w-full min-h-[260px] overflow-hidden rounded-t-2xl bg-gray-100">
              <Image
                src={item.product_images[imageIndex] || Banner}
                alt={item.name}
                fill
                className="object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              {item.product_images.length > 1 && (
                <div className="absolute right-3 bottom-3 flex gap-2">
                  {item.product_images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${i === imageIndex ? "bg-white scale-125" : "bg-white/60"}`}
                      aria-label={`Show image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-[#111827]">{item.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full text-white ${isUnavailable ? "bg-red-500" : "bg-green-500"}`}>
                      {isUnavailable ? "Sold Out" : item.status}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#4FCA6A]/10 text-[#4FCA6A] border border-[#4FCA6A]/30 capitalize">
                      {item.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] text-[#71717A] hover:bg-gray-100"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-[#71717A] leading-relaxed">{item.description}</p>

              <div className="flex flex-wrap gap-3 text-xs text-[#71717A]">
                <span className="capitalize">{item.servingType.join(", ")}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.availability}</span>
                {item.labels.length > 0 && (
                  <span className="flex gap-1.5 flex-wrap">
                    {item.labels.map((label) => (
                      <span key={label} className="flex items-center gap-0.5 bg-gray-100 px-1.5 py-0.5 rounded-full text-[10px]">
                        {label}
                      </span>
                    ))}
                  </span>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { icon: Truck, label: "Vendor delivery", text: "Food orders can be fulfilled directly by the vendor." },
                  { icon: CreditCard, label: "Coupon-ready", text: "Free-delivery coupons can skip payment at zero balance." },
                  { icon: MessageCircle, label: "Chat checkout", text: "Menu ordering can extend to WhatsApp and web chat." },
                ].map((itemMeta) => (
                  <div key={itemMeta.label} className="rounded-xl border border-gray-100 bg-white p-3">
                    <itemMeta.icon className="h-4 w-4 text-[#4FCA6A]" />
                    <p className="mt-2 text-xs font-semibold">{itemMeta.label}</p>
                    <p className="mt-1 text-[11px] leading-4 text-gray-500">{itemMeta.text}</p>
                  </div>
                ))}
              </div>

              {/* Portion / serving type */}
              {(item.type === "Simple" && item.portion.length > 0) && (
                <div>
                  <h3 className="text-sm font-semibold mb-2">Choose a Portion</h3>
                  <div className="space-y-2">
                    {item.portion.map((p) => (
                      <button
                        key={p.uid}
                        onClick={() => setSelectedPortion(p)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${selectedPortion?.uid === p.uid ? "border-[#4FCA6A] bg-[#4FCA6A]/5" : "border-gray-100 hover:border-gray-200"}`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{p.name}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {p.startPrepTime}–{p.endPrepTime} mins · {p.servingPerServingType} {p.servingType}
                          </span>
                        </div>
                        <span className="font-semibold text-[#4FCA6A]">₦{p.price.toLocaleString()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(item.type === "Customizable" && (item.servingType.length > 0 || item.addOnGroup.length > 0)) && (
                <div className="space-y-5">
                  {item.servingType.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Choose a Serving Type</h3>
                      <div className="space-y-2">
                        {item.servingType.map((type) => {
                          const price = item.servingTypePricing?.find((entry) => entry.servingType === type)?.price || 0;
                          const isSelected = selectedServingType === type;
                          return (
                            <button
                              key={type}
                              onClick={() => setSelectedServingType(type)}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${isSelected ? "border-[#4FCA6A] bg-[#4FCA6A]/5" : "border-gray-100 hover:border-gray-200"}`}
                            >
                              <span className="font-medium capitalize">{type}</span>
                              <span className="font-semibold text-[#4FCA6A]">₦{price.toLocaleString()}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {item.addOnGroup.map((group) => {
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
                                key={option.uid}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${isSelected ? "border-[#4FCA6A] bg-[#4FCA6A]/5" : "border-gray-100 hover:border-gray-200"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? "border-[#4FCA6A] bg-[#4FCA6A]" : "border-gray-300"}`}
                                    aria-label={isSelected ? `Deselect ${option.name}` : `Select ${option.name}`}
                                  >
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                  <span className="font-medium">{option.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[#4FCA6A] font-semibold">+₦{option.price.toLocaleString()}</span>
                                  {isSelected && (
                                    <div className="flex items-center gap-1 rounded-lg border border-[#4FCA6A]/30 bg-white p-0.5">
                                      <button
                                        type="button"
                                        aria-label={`Increase ${option.name} quantity`}
                                        onClick={() => updateAddOnQuantity(group.uid, option.uid, 1)}
                                        className="rounded p-1 text-[#4FCA6A] hover:bg-[#4FCA6A]/10"
                                      >
                                        <Plus className="h-3.5 w-3.5" />
                                      </button>
                                      <span className="min-w-5 text-center text-xs font-semibold">{addOnQuantity}</span>
                                      <button
                                        type="button"
                                        aria-label={`Decrease ${option.name} quantity`}
                                        onClick={() => updateAddOnQuantity(group.uid, option.uid, -1)}
                                        className="rounded p-1 text-gray-500 hover:bg-gray-100"
                                      >
                                        <Minus className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Price + CTA */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div>
                  <p className="text-xs text-gray-500">Total Price</p>
                  <p className="text-3xl font-bold text-[#111827]">₦{totalPrice.toLocaleString()}</p>
                  {quantity > 1 && basePrice > 0 && <p className="text-xs text-gray-400">₦{basePrice.toLocaleString()} × {quantity}</p>}
                </div>

                <div className="flex flex-col items-end gap-2">
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
                  <Button
                    onClick={handleAddToCart}
                    disabled={isUnavailable}
                    className="min-w-[120px]"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {isUnavailable ? "Sold Out" : "Add to Cart"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right option summary */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-3">
              {/* Quick price summary */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <h3 className="text-xs font-semibold text-[#71717A] uppercase tracking-wide">Price Summary</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">From</span>
                    <span className="font-semibold">₦{getFoodCardPrice(item)?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71717A]">You select</span>
                    <span className="font-semibold">₦{basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#F3F4F6] pt-2">
                    <span className="font-semibold">Total × {quantity}</span>
                    <span className="font-bold text-[#111827]">₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Pre-order / note card */}
              {item.status === "Seasonal" && (
                <div className="rounded-2xl border border-[#F59E0B]/30 bg-yellow-50 px-4 py-3 text-sm text-[#71717A]">
                  <p className="font-semibold text-[#71717A]">Pre-order</p>
                  <p className="mt-1 text-xs">Items marked pre-order will be restocked automatically on release.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FoodItemModal;
