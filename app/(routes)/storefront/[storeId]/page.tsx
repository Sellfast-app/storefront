// app/storefront/[storeId]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Banner from "@/public/Banner.png";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import CartButton from "@/components/CartButton";
import CartView from "@/components/CartView";
import FoodProductGrid from "@/components/FoodproductGrid";
import BannerCarousel from "@/components/BannerCarousel";
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";
import { AvailabilityModal } from "@/components/AvailabilityModal";
import type { StoreAvailabilityEntry } from "@/hooks/useStoreAvailability";
import { useStoreAvailability } from "@/hooks/useStoreAvailability";
import { FoodItem } from "@/lib/mockdata";
import {
  isMockEventStorefront,
  isMockFoodStorefront,
  isMockRetailStorefront,
  mockEventStoreDetails,
  mockFoodStoreDetails,
  mockRetailProducts,
  mockRetailStoreDetails,
  mockStorefrontFoodItems,
  mockStoreReviews,
} from "@/lib/storefront-mock";
import { Event, getPublishedEvents } from "@/lib/events-data";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Store,
  Ticket,
  Truck,
  Twitter,
  UserRound,
  X,
  Users,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

interface StoreDetails {
  id: string;
  vendor_id: string;
  store_name: string;
  business_type: string;
  store_description: string;
  store_url: string;
  qr_url: string | null;
  bot_url: string | null;
  logo: string | null;
  banner: string | null;
  banner_style?: "portrait" | "carousel";
  banner_images?: string[];
  cac: string | null;
  tin: string | null;
  doctype: string | null;
  cert_media: string | null;
  metadata: {
    city: string;
    phone: string;
    state: string;
    bot_qr: string;
    address: string;
    country: string;
    latitude: number;
    longitude: number;
    post_code: string;
    owner_name: string;
    brand_color: {
      accent: string;
      primary: string;
      secondary: string;
    };
    address_line_2: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    x?: string;
    email?: string;
  };
  updated_at: string;
  subaccount_code: string | null;
  availability?: StoreAvailabilityEntry[];
}

interface StoreReview {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Product {
  id: string;
  store_id: string;
  variants: string;
  created_at: string;
  updated_at: string;
  product_sku: string;
  product_name: string;
  product_type: string;
  product_price: number;
  product_images: string[];
  product_status: string;
  est_prod_days_to: number;
  product_quantity: number;
  est_prod_days_from: number;
  product_description: string;
}

type ratings = string | number;
type totalListings = number;

const getImageUrl = (imagePath: string | null): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith("/")) return imagePath;
  if (imagePath.startsWith("http")) return imagePath;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return `${API_BASE_URL}${imagePath}`;
};

const isFoodBusinessType = (businessType?: string) => {
  const normalized = businessType?.toLowerCase() || "";
  return normalized.includes("restaurant") || normalized.includes("food");
};

// ─── Shared Header ────────────────────────────────────────────────────────────

interface V2TemplateProps {
  storeId: string;
  storeDetails: StoreDetails;
  storeReviews: StoreReview[];
  listings: number;
  ratings: ratings;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  toggleCart: () => void;
  showCart: boolean;
  logoUrl: string | null;
  bannerUrl: string | null;
  getWhatsAppUrl: (phoneNumber: string) => string;
}

interface V2RetailTemplateProps extends V2TemplateProps {
  filteredProducts: Product[];
  allProducts: Product[];
  isLoadingProducts: boolean;
  handleAddToCart: (event: React.MouseEvent, product: Product) => void;
}

interface V2FoodTemplateProps extends V2TemplateProps {
  foodItems: FoodItem[];
  isLoadingProducts: boolean;
}

interface V2EventTemplateProps extends V2TemplateProps {
  events: Event[];
}

function V2StoreHeader({
  storeDetails,
  logoUrl,
  searchQuery,
  setSearchQuery,
  toggleCart,
  showMobileSearch,
  setShowMobileSearch,
}: Pick<
  V2TemplateProps,
  "storeDetails" | "logoUrl" | "searchQuery" | "setSearchQuery" | "toggleCart"
> & {
  showMobileSearch: boolean;
  setShowMobileSearch: (v: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#F1F1F1] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link href="#" className="flex items-center gap-3 shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${storeDetails.store_name} logo`}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[#E8F5E9]"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#005B14] text-white">
              <Store className="h-4 w-4" />
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-bold tracking-tight">{storeDetails.store_name}</p>
            <p className="text-[11px] text-[#71717A] uppercase tracking-wide">{storeDetails.business_type}</p>
          </div>
        </Link>

        <div className="hidden flex-1 justify-center px-6 md:flex">
          <div className="relative w-full max-w-lg">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="h-10 rounded-full border-[#E5E7EB] bg-[#F6F7F6] pl-10 pr-4 text-sm focus-visible:ring-[#005B14]/30"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white md:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            {showMobileSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-[#E5E7EB]">
            <UserRound className="h-4 w-4" />
          </Button>
          <CartButton onClick={toggleCart} />
        </div>
      </div>

      {showMobileSearch && (
        <div className="border-t border-[#F1F1F1] px-4 py-3 md:hidden">
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="h-10 rounded-full border-[#E5E7EB] bg-[#F6F7F6] pl-10 pr-4 text-sm"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          </div>
        </div>
      )}
    </header>
  );
}

function StorefrontFooter({
  storeDetails,
  logoUrl,
}: Pick<V2TemplateProps, "storeDetails" | "logoUrl">) {
  return (
    <footer className="mt-16 bg-[url('/storefront-footer-bg.png')] bg-cover bg-center text-white">
      <div className="bg-[#061400]/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={storeDetails.store_name}
                width={38}
                height={38}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/20"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white ring-2 ring-white/20">
                <Store className="h-4 w-4" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">{storeDetails.store_name}</p>
              <p className="text-xs text-white/60">{storeDetails.business_type}</p>
            </div>
          </div>
          <p className="text-xs text-white/70 md:text-right">
            Powered by{" "}
            <a href="https://swiftree.app" className="font-semibold text-white hover:underline">
              Swiftree
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function RetailStorefrontFooter({
  storeId,
  storeDetails,
  logoUrl,
}: Pick<V2TemplateProps, "storeId" | "storeDetails" | "logoUrl">) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const normalizeExternalUrl = (value?: string | null) => {
    if (!value) return null;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `https://${value}`;
  };

  const socialLinks = [
    {
      label: "Instagram",
      href: normalizeExternalUrl(storeDetails.metadata?.instagram),
      icon: Instagram,
    },
    {
      label: "Facebook",
      href: normalizeExternalUrl(storeDetails.metadata?.facebook),
      icon: Facebook,
    },
    {
      label: "X",
      href: normalizeExternalUrl(storeDetails.metadata?.x || storeDetails.metadata?.twitter),
      icon: Twitter,
    },
  ].filter((item) => item.href);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/leads", {
        body: JSON.stringify({ email, storeId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "Unable to join list right now");
      setStatus("success");
      setMessage("You're on the list.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to join list right now");
    }
  }

  const storeLinks = [
    { label: "Home", href: `/storefront/${storeId}#top` },
    { label: "Shop", href: `/storefront/${storeId}#all-products` },
  ];
  const usefulLinks = [
    { label: "About Us", href: `/storefront/${storeId}/about` },
    { label: "Contact Us", href: `/storefront/${storeId}/contact` },
    { label: "Terms of Use", href: `/storefront/${storeId}/terms` },
    { label: "Return Policy", href: `/storefront/${storeId}/return-policy` },
  ];

  return (
    <footer className="mt-16 bg-[url('/storefront-footer-bg.png')] bg-cover bg-center text-white">
      <div className="bg-[#061400]/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_0.8fr_0.9fr_1.25fr] lg:px-8">
          <div>
            <div className="mb-8 flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={storeDetails.store_name}
                  width={56}
                  height={56}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white ring-2 ring-white/20">
                  <Store className="h-5 w-5" />
                </div>
              )}
              <p className="text-base font-semibold">{storeDetails.store_name}</p>
            </div>
            {storeDetails.store_description && (
              <p className="mb-7 max-w-xs text-sm leading-6 text-white/70">
                {storeDetails.store_description}
              </p>
            )}
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {[storeDetails.metadata?.address, storeDetails.metadata?.city, storeDetails.metadata?.state, storeDetails.metadata?.country]
                    .filter(Boolean)
                    .join(", ") || "Store address unavailable"}
                </span>
              </div>
              {storeDetails.metadata?.phone && (
                <a href={`tel:${storeDetails.metadata.phone}`} className="flex items-center gap-3 hover:text-white">
                  <Phone className="h-4 w-4" />
                  {storeDetails.metadata.phone}
                </a>
              )}
            </div>
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/75 transition-colors hover:border-white hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))
              ) : storeDetails.metadata?.phone ? (
                <a
                  href={`https://wa.me/${storeDetails.metadata.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact store"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white/75 transition-colors hover:border-white hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>

          <FooterLinkColumn title="Store Links" links={storeLinks} variant="dark" />
          <FooterLinkColumn title="Useful Links" links={usefulLinks} variant="dark" />

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Stay Updated
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Get new arrivals, restocks and store updates from {storeDetails.store_name}.
            </p>
            <form onSubmit={handleSubmit} className="mt-5">
              <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 shadow-sm backdrop-blur sm:flex-row lg:flex-col xl:flex-row">
                <Input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="h-11 flex-1 rounded-xl border-0 bg-white px-4 text-sm text-[#111827] shadow-none focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-11 shrink-0 rounded-xl bg-[#4FCA6A] px-5 text-sm font-semibold text-white hover:bg-[#3DBA57]"
                >
                  {status === "loading" ? "..." : "Join"}
                </Button>
              </div>
              {message && (
                <p className={`mt-2 text-xs ${status === "error" ? "text-red-200" : "text-white/80"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/65 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>{storeDetails.store_name} © {new Date().getFullYear()}</p>
            <p>
              Powered by{" "}
              <a
                href="https://swiftree.app"
                className="font-semibold text-white hover:underline"
              >
                Swiftree
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FoodStorefrontFooter({
  storeId,
  storeDetails,
  logoUrl,
}: Pick<V2TemplateProps, "storeId" | "storeDetails" | "logoUrl">) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const normalizeExternalUrl = (value?: string | null) => {
    if (!value) return null;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `https://${value}`;
  };

  const formatFooterTime = (value: string) => {
    const [hourValue, minuteValue] = value.split(":").map(Number);
    if (Number.isNaN(hourValue) || Number.isNaN(minuteValue)) return value;
    const period = hourValue >= 12 ? "PM" : "AM";
    const hour = hourValue % 12 || 12;
    return `${String(hour).padStart(2, "0")}:${String(minuteValue).padStart(2, "0")} ${period}`;
  };

  const workingHours = storeDetails.availability?.length
    ? storeDetails.availability.slice(0, 4).map((entry) => ({
        day: entry.day,
        hours: `${formatFooterTime(entry.openTime)} - ${formatFooterTime(entry.closeTime)}`,
      }))
    : [
        { day: "Monday - Friday", hours: "09:00 AM - 09:30 PM" },
        { day: "Saturday", hours: "09:00 AM - 08:30 PM" },
        { day: "Sunday", hours: "10:00 AM - 08:30 PM" },
      ];

  const socialLinks = [
    {
      label: "Instagram",
      href: normalizeExternalUrl(storeDetails.metadata?.instagram),
      icon: Instagram,
    },
    {
      label: "Facebook",
      href: normalizeExternalUrl(storeDetails.metadata?.facebook),
      icon: Facebook,
    },
    {
      label: "X",
      href: normalizeExternalUrl(storeDetails.metadata?.x || storeDetails.metadata?.twitter),
      icon: Twitter,
    },
  ].filter((item) => item.href);

  const addressParts = [
    storeDetails.metadata?.address,
    storeDetails.metadata?.city,
    storeDetails.metadata?.state,
    storeDetails.metadata?.country,
  ].filter(Boolean);
  const locationItems = [
    storeDetails.metadata?.city ? `${storeDetails.metadata.city} Branch` : null,
    storeDetails.metadata?.address,
    [storeDetails.metadata?.state, storeDetails.metadata?.country].filter(Boolean).join(", "),
  ].filter(Boolean);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/leads", {
        body: JSON.stringify({ email, storeId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.message || "Unable to join list right now");
      setStatus("success");
      setMessage("You're on the list.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to join list right now");
    }
  }

  return (
    <footer className="mt-16 bg-[url('/storefront-footer-bg.png')] bg-cover bg-center text-white">
      <div className="bg-[#061400]/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_0.85fr_1fr_1.25fr] lg:px-8">
          <div>
            <div className="mb-5 flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={storeDetails.store_name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white ring-2 ring-white/20">
                  <Store className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="text-base font-semibold">{storeDetails.store_name}</p>
                <p className="text-xs text-white/65">{storeDetails.business_type}</p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-6 text-white/70">
              {storeDetails.store_description || "Fresh meals available for pickup and vendor delivery."}
            </p>
            {storeDetails.metadata?.phone && (
              <a href={`tel:${storeDetails.metadata.phone}`} className="mt-5 flex items-center gap-3 text-sm text-white/75 hover:text-white">
                <Phone className="h-4 w-4" />
                {storeDetails.metadata.phone}
              </a>
            )}
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.length > 0 ? (
                socialLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/75 transition-colors hover:border-white hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))
              ) : storeDetails.metadata?.phone ? (
                <a
                  href={`https://wa.me/${storeDetails.metadata.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact store"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/75 transition-colors hover:border-white hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">Working Hours</h3>
            <div className="mt-5 space-y-4">
              {workingHours.map((entry) => (
                <div key={`${entry.day}-${entry.hours}`} className="text-sm">
                  <p className="font-semibold text-white">{entry.day}</p>
                  <p className="mt-1 text-white/65">{entry.hours}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">Delivery Type</h3>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              <p className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Pickup
              </p>
              <p className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                Vendor Delivery
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">Locations</h3>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              {(locationItems.length > 0 ? locationItems : addressParts).map((item) => (
                <p key={item} className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">Stay Updated</h3>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Get menu updates and fresh offers from {storeDetails.store_name}.
            </p>
            <form onSubmit={handleSubmit} className="mt-5">
              <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-white/10 p-2 backdrop-blur sm:flex-row lg:flex-col xl:flex-row">
                <Input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="h-11 flex-1 rounded-xl border-0 bg-white text-sm text-[#111827] shadow-none focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-11 shrink-0 rounded-xl bg-[#4FCA6A] px-5 text-sm font-semibold text-white hover:bg-[#3DBA57]"
                >
                  {status === "loading" ? "..." : "Join"}
                </Button>
              </div>
              {message && (
                <p className={`mt-2 text-xs ${status === "error" ? "text-red-200" : "text-white/80"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-white/15">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/65 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>{storeDetails.store_name} © {new Date().getFullYear()}</p>
            <p>
              Powered by{" "}
              <a href="https://swiftree.app" className="font-semibold text-white hover:underline">
                Swiftree
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkColumn({
  title,
  links,
  variant = "light",
}: {
  title: string;
  links: { label: string; href: string }[];
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";

  return (
    <div>
      <h3 className={`text-sm font-bold uppercase tracking-wide ${isDark ? "text-white" : "text-[#272B2A]"}`}>
        {title}
      </h3>
      <ul className={`mt-6 space-y-4 text-sm font-medium ${isDark ? "text-white/70" : "text-[#666D69]"}`}>
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-[#005B14]"}`}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Retail Storefront (KM Taylor inspired) ───────────────────────────────────

function V2RetailStorefront({
  storeId,
  storeDetails,
  listings,
  ratings,
  searchQuery,
  setSearchQuery,
  toggleCart,
  showCart,
  logoUrl,
  bannerUrl,
  filteredProducts,
  allProducts,
  isLoadingProducts,
  handleAddToCart,
}: V2RetailTemplateProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [heroBannerIndex, setHeroBannerIndex] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState<"none" | "low-high" | "high-low" | "custom">("none");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const categories = ["All", ...Array.from(
    new Set(allProducts.map((p) => p.product_type).filter(Boolean))
  ).slice(0, 8)];

  const heroBanners: { image: string | null; headline: string; sub: string }[] =
    storeDetails.banner_images && storeDetails.banner_images.length > 0
      ? storeDetails.banner_images.map((img, i) => ({
          image: getImageUrl(img),
          headline: i === 0 ? storeDetails.store_name : `${storeDetails.store_name} Collection`,
          sub: storeDetails.store_description || "Shop curated products and checkout securely.",
        }))
      : [
          {
            image: bannerUrl,
            headline: storeDetails.store_name,
            sub: storeDetails.store_description || "Shop curated products and checkout securely.",
          },
          {
            image: bannerUrl,
            headline: `${storeDetails.store_name} Collection`,
            sub: "Explore our latest arrivals and bestsellers.",
          },
        ];

  const prevBanner = () =>
    setHeroBannerIndex((i) => (i === 0 ? heroBanners.length - 1 : i - 1));
  const nextBanner = () =>
    setHeroBannerIndex((i) => (i === heroBanners.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const t = setInterval(nextBanner, 5000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroBanners.length]);

  const baseProducts = searchQuery.trim()
    ? filteredProducts
    : allProducts;
  const categoryProducts = activeCategory === "All"
    ? baseProducts
    : baseProducts.filter((p) => p.product_type === activeCategory);
  const minPriceValue = Number(minPrice);
  const maxPriceValue = Number(maxPrice);
  const displayProducts = [...categoryProducts]
    .filter((product) => {
      if (priceFilter !== "custom") return true;
      const aboveMin = minPrice ? product.product_price >= minPriceValue : true;
      const belowMax = maxPrice ? product.product_price <= maxPriceValue : true;
      return aboveMin && belowMax;
    })
    .sort((a, b) => {
      if (priceFilter === "low-high") return a.product_price - b.product_price;
      if (priceFilter === "high-low") return b.product_price - a.product_price;
      return 0;
    });
  const totalPages = Math.max(1, Math.ceil(displayProducts.length / productsPerPage));
  const paginatedProducts = displayProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, priceFilter, minPrice, maxPrice]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  return (
    <div id="top" className="min-h-screen bg-white text-[#111827]">
      <V2StoreHeader
        storeDetails={storeDetails}
        logoUrl={logoUrl}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleCart={toggleCart}
        showMobileSearch={showMobileSearch}
        setShowMobileSearch={setShowMobileSearch}
      />

      <main>
        {showCart ? (
          <div className="mx-auto max-w-2xl px-4 py-8">
            <CartView />
          </div>
        ) : (
          <>
            {/* ── Hero Banner Carousel ── */}
            <section className="relative h-[420px] overflow-hidden bg-[#061400] md:h-[520px]">
              {heroBanners.map((banner, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === heroBannerIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Image
                    src={banner.image || Banner}
                    alt={banner.headline}
                    fill
                    priority={index === 0}
                    className="object-cover opacity-60"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#061400]/85 via-[#061400]/50 to-transparent" />
                  <div className="relative z-10 flex h-full items-end pb-12 px-6 md:px-12 lg:px-16">
                    <div className="max-w-xl text-white">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#4FCA6A]">
                        {storeDetails.business_type}
                      </p>
                      <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                        {banner.headline}
                      </h1>
                      <p className="mt-3 text-sm text-white/75 md:text-base">{banner.sub}</p>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                {heroBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroBannerIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === heroBannerIndex ? "w-6 bg-white" : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </section>

            {/* ── Store Stats Bar ── */}
            <section className="border-b border-[#F1F1F1] bg-[#FAFAFA]">
              <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-x-auto px-6 py-4 lg:px-8">
                {[
                  { label: "Total Listings", value: listings },
                  { label: "Avg. Rating", value: `${ratings} ★` },
                  { label: "Est. Delivery", value: "2–5 days" },
                  { label: "Secure Checkout", value: "Paystack & more" },
                ].map((stat) => (
                  <div key={stat.label} className="shrink-0 text-center">
                    <p className="text-xs text-[#9CA3AF]">{stat.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#111827]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Category Pills ── */}
            <section className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`h-9 shrink-0 rounded-full px-5 text-sm font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-[#005B14] text-white"
                        : "border border-[#E5E7EB] bg-white text-[#374151] hover:border-[#005B14]/40 hover:text-[#005B14]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* ── All Products ── */}
            <section id="all-products" className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    {searchQuery ? `Results for "${searchQuery}"` : "All Products"}
                  </h2>
                  <p className="text-sm text-[#6B7280]">
                    {displayProducts.length} item{displayProducts.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-[#D8EBDD] text-[#005B14] hover:bg-[#F2FBF4] md:inline-flex gap-2"
                    onClick={() => setFilterOpen((open) => !open)}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filter
                  </Button>
                  {filterOpen && (
                    <div className="absolute right-0 top-11 z-10 w-[280px] rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-xl">
                      <p className="mb-3 text-sm font-semibold text-[#111827]">Price filter</p>
                      <div className="grid gap-2">
                        {[
                          ["none", "Default"],
                          ["low-high", "Price: low to high"],
                          ["high-low", "Price: high to low"],
                          ["custom", "Custom range"],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setPriceFilter(value as typeof priceFilter)}
                            className={`rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                              priceFilter === value
                                ? "bg-[#005B14] text-white"
                                : "bg-[#F9FAFB] text-[#374151] hover:bg-[#F2FBF4]"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      {priceFilter === "custom" && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={minPrice}
                            onChange={(event) => setMinPrice(event.target.value)}
                            placeholder="Min"
                            className="h-10 rounded-xl border-[#E5E7EB]"
                          />
                          <Input
                            type="number"
                            min="0"
                            value={maxPrice}
                            onChange={(event) => setMaxPrice(event.target.value)}
                            placeholder="Max"
                            className="h-10 rounded-xl border-[#E5E7EB]"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isLoadingProducts ? (
                <div className="py-20 text-center text-sm text-[#9CA3AF]">Loading products...</div>
              ) : displayProducts.length === 0 ? (
                <div className="py-16 text-center text-sm text-[#9CA3AF]">No products found.</div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {paginatedProducts.map((product) => (
                      <RetailProductCard
                        key={product.id}
                        product={product}
                        storeId={storeId}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[#F1F1F1] pt-5 sm:flex-row">
                      <p className="text-sm text-[#6B7280]">
                        Page {currentPage} of {totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-[#D8EBDD] text-[#005B14]"
                          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: totalPages }).map((_, index) => {
                          const page = index + 1;
                          return (
                            <button
                              key={page}
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                                currentPage === page
                                  ? "bg-[#005B14] text-white"
                                  : "border border-[#E5E7EB] text-[#374151] hover:border-[#005B14]/40"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-[#D8EBDD] text-[#005B14]"
                          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </section>

            <RetailStorefrontFooter
              storeId={storeId}
              storeDetails={storeDetails}
              logoUrl={logoUrl}
            />
          </>
        )}
      </main>
    </div>
  );
}

// ─── Retail Product Card ──────────────────────────────────────────────────────

function RetailProductCard({
  product,
  storeId,
  onAddToCart,
}: {
  product: Product;
  storeId: string;
  onAddToCart: (e: React.MouseEvent, product: Product) => void;
}) {
  const hasVariants = (() => {
    try {
      const v = typeof product.variants === "string"
        ? JSON.parse(product.variants)
        : product.variants;
      return Array.isArray(v) && v.length > 0;
    } catch {
      return false;
    }
  })();

  return (
    <Link href={`/storefront/${storeId}/product/${product.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-[#F1F1F1] bg-white transition-shadow hover:shadow-md">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F9FAFB]">
          <Image
            src={product.product_images[0] || Banner}
            alt={product.product_name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.product_quantity === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#374151]">
                Sold Out
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-[#111827]">
            {product.product_name}
          </p>
          <p className="mt-1.5 text-base font-bold text-[#111827]">
            ₦{product.product_price.toLocaleString()}
          </p>
          <Button
            size="sm"
            className="mt-3 h-8 w-full rounded-full bg-[#4FCA6A] text-xs text-white hover:bg-[#3DBA57] disabled:bg-[#D1D5DB]"
            onClick={(e) => onAddToCart(e, product)}
            disabled={product.product_quantity === 0}
          >
            {hasVariants ? "Select Options" : product.product_quantity === 0 ? "Sold Out" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </Link>
  );
}

// ─── Food Storefront (Daash / CitySubs inspired) ──────────────────────────────

function V2FoodStorefront({
  storeId,
  storeDetails,
  listings,
  ratings,
  searchQuery,
  setSearchQuery,
  toggleCart,
  showCart,
  logoUrl,
  bannerUrl,
  foodItems,
  isLoadingProducts,
}: V2FoodTemplateProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const categories = Array.from(
    new Set(
      foodItems
        .flatMap((item) =>
          Array.isArray(item.category)
            ? item.category
            : item.category
              ? [item.category as string]
              : []
        )
        .filter(Boolean)
    )
  );

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <V2StoreHeader
        storeDetails={storeDetails}
        logoUrl={logoUrl}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleCart={toggleCart}
        showMobileSearch={showMobileSearch}
        setShowMobileSearch={setShowMobileSearch}
      />

      {showCart ? (
        <main className="mx-auto max-w-2xl px-4 py-6 lg:px-6">
          <CartView />
        </main>
      ) : (
        <main>
          <section className="relative h-[360px] overflow-hidden md:h-[430px]">
            {storeDetails.banner_style === "carousel" ? (
              <BannerCarousel
                images={storeDetails.banner_images || []}
                autoplayInterval={5000}
              />
            ) : (
              <Image
                src={bannerUrl || Banner}
                alt={`${storeDetails.store_name} banner`}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 lg:px-6">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex rounded-full bg-[#005B14] px-3 py-1 text-xs font-medium text-white">
                  Food & Restaurant
                </div>
                <h1 className="text-4xl font-semibold md:text-6xl">
                  {storeDetails.store_name}
                </h1>
                <p className="mt-3 max-w-xl text-base text-[#71717A]">
                  {storeDetails.store_description || "Order fresh meals for pickup or vendor delivery."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button className="rounded-full bg-[#005B14] hover:bg-[#004610]">
                    Start order
                  </Button>
                  <div className="inline-flex rounded-full bg-[#F1F3F1] p-1 text-sm">
                    <button className="rounded-full bg-white px-5 py-2 font-medium shadow-sm">
                      Pickup
                    </button>
                    <button className="px-5 py-2 text-[#71717A]">Delivery</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="text-2xl font-semibold">
                  {storeDetails.store_name}
                  {storeDetails.metadata?.city ? (
                    <span className="text-[#71717A]"> - {storeDetails.metadata.city}</span>
                  ) : null}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-[#71717A]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F7F6] px-3 py-2">
                    <MapPin className="h-4 w-4" />
                    {storeDetails.metadata?.address || "Select location"}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F6F7F6] px-3 py-2">
                    <Truck className="h-4 w-4" />
                    Vendor delivery available
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {[
                  ["Items", listings || foodItems.length],
                  ["Rating", ratings],
                  ["Open", "Today"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border bg-white px-4 py-3">
                    <p className="text-xs text-[#71717A]">{label}</p>
                    <p className="mt-1 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
              <aside className="hidden lg:block">
                <div className="sticky top-24 space-y-2">
                  {["All meals", ...categories].map((category, index) => (
                    <button
                      key={category}
                      className={`w-full rounded-full px-5 py-3 text-left text-sm font-medium ${
                        index === 0
                          ? "bg-[#005B14] text-white"
                          : "text-[#111827] hover:bg-[#F6F7F6]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </aside>

              <div>
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Menu</h3>
                    <p className="text-sm text-[#71717A]">
                      Choose a meal, customize options and checkout securely.
                    </p>
                  </div>
                  <div className="relative md:w-80">
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search menu"
                      className="h-11 rounded-full border-[#ECECEC] bg-[#F6F7F6] pl-11"
                    />
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
                  </div>
                </div>
                <FoodProductGrid
                  items={foodItems}
                  isLoading={isLoadingProducts}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          </section>
          <FoodStorefrontFooter
            storeId={storeId}
            storeDetails={storeDetails}
            logoUrl={logoUrl}
          />
        </main>
      )}
    </div>
  );
}

// ─── Event Storefront (Tix Africa inspired) ───────────────────────────────────

function V2EventStorefront({
  storeDetails,
  searchQuery,
  setSearchQuery,
  toggleCart,
  showCart,
  logoUrl,
  events,
}: V2EventTemplateProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || "");
  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
  const [showFullDescription, setShowFullDescription] = useState(false);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const otherEvents = events.filter((e) => e.id !== selectedEvent?.id);

  const activeTickets = selectedEvent?.tickets.filter((t) => t.type !== "invite") || [];

  const selectedTickets = activeTickets
    .map((t) => ({ ticket: t, quantity: ticketQuantities[t.id] || 0 }))
    .filter((item) => item.quantity > 0);

  const ticketSubtotal = selectedTickets.reduce(
    (sum, item) => sum + (item.ticket.price || 0) * item.quantity,
    0
  );
  const serviceFee = selectedTickets.reduce(
    (sum, item) => sum + (item.ticket.type === "paid" ? 740 * item.quantity : 0),
    0
  );
  const ticketTotal = ticketSubtotal + serviceFee;
  const totalTickets = selectedTickets.reduce((sum, item) => sum + item.quantity, 0);

  const updateTicketQuantity = (ticketId: string, next: number, limit: number) => {
    setTicketQuantities((cur) => ({
      ...cur,
      [ticketId]: Math.max(0, Math.min(next, limit)),
    }));
  };

  const resetForEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setTicketQuantities({});
    setShowFullDescription(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const lowestPrice = activeTickets.reduce((min, t) => {
    if (t.type === "free") return min;
    return Math.min(min, t.price || Infinity);
  }, Infinity);

  const hasFreeTicket = activeTickets.some((t) => t.type === "free");

  return (
    <div className="min-h-screen bg-[#F7F7F7] text-[#111827]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-[#EBEBEB] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <Link href="#" className="flex items-center gap-2.5 shrink-0">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={storeDetails.store_name}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#005B14] text-white">
                <Ticket className="h-3.5 w-3.5" />
              </div>
            )}
            <span className="hidden text-sm font-bold sm:block">{storeDetails.store_name}</span>
          </Link>

          <div className="hidden flex-1 justify-center px-6 md:flex">
            <div className="relative w-full max-w-md">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="h-9 rounded-full border-[#E5E7EB] bg-[#F6F7F6] pl-9 pr-4 text-sm"
              />
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              {showMobileSearch ? <X className="h-3.5 w-3.5" /> : <Search className="h-3.5 w-3.5" />}
            </button>
            <CartButton onClick={toggleCart} />
          </div>
        </div>

        {showMobileSearch && (
          <div className="border-t border-[#EBEBEB] px-4 py-2 md:hidden">
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                autoFocus
                className="h-9 rounded-full border-[#E5E7EB] bg-[#F6F7F6] pl-9 pr-4 text-sm"
              />
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9CA3AF]" />
            </div>
          </div>
        )}
      </header>

      {showCart ? (
        <div className="mx-auto max-w-2xl px-4 py-8">
          <CartView />
        </div>
      ) : (
        <main className="mx-auto max-w-6xl px-4 py-6 lg:px-6">

          {selectedEvent && (
            <>
              {/* ── Breadcrumb ── */}
              <nav className="mb-4 flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                <span>Events</span>
                <ChevronRight className="h-3 w-3" />
                <span className="line-clamp-1 text-[#374151] font-medium">{selectedEvent.name}</span>
              </nav>

              {/* ── Main Event Layout ── */}
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">

                {/* ── Left Column ── */}
                <div className="space-y-5">

                  {/* Cover Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#1A1A1A] md:aspect-[2/1]">
                    <Image
                      src={selectedEvent.coverImage}
                      alt={selectedEvent.name}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    {/* Price badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#111827] shadow-sm">
                        {hasFreeTicket && lowestPrice === Infinity
                          ? "Free"
                          : hasFreeTicket
                            ? `From Free`
                            : lowestPrice !== Infinity
                              ? `From ₦${lowestPrice.toLocaleString()}`
                              : "Tickets available"}
                      </span>
                    </div>
                  </div>

                  {/* Event Title + Quick Info */}
                  <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5 md:p-6">
                    <h1 className="text-xl font-bold leading-snug md:text-2xl">
                      {selectedEvent.name}
                    </h1>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-start gap-3 text-sm text-[#374151]">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#005B14]" />
                        <span>{format(new Date(selectedEvent.startDate), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-[#374151]">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#005B14]" />
                        <span>{selectedEvent.startTime} – {selectedEvent.endTime}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-[#374151]">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#005B14]" />
                        <span>{selectedEvent.location}</span>
                      </div>
                    </div>

                    {/* Mobile CTA */}
                    <a href="#tickets" className="mt-5 block lg:hidden">
                      <Button className="h-11 w-full rounded-full bg-[#005B14] text-sm font-semibold hover:bg-[#004610]">
                        Get a Ticket
                      </Button>
                    </a>
                  </div>

                  {/* About this event */}
                  {selectedEvent.description && (
                    <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5 md:p-6">
                      <h2 className="mb-3 text-base font-bold">About this event</h2>
                      <div className={`text-sm leading-relaxed text-[#4B5563] ${!showFullDescription ? "line-clamp-5" : ""}`}>
                        {selectedEvent.description}
                      </div>
                      {selectedEvent.description.length > 300 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="mt-2 text-xs font-semibold text-[#005B14] hover:underline"
                        >
                          {showFullDescription ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Hosted by */}
                  <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5 md:p-6">
                    <h2 className="mb-3 text-base font-bold">Hosted by</h2>
                    <div className="flex items-center gap-3">
                      {logoUrl ? (
                        <Image
                          src={logoUrl}
                          alt={storeDetails.store_name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#005B14]/10">
                          <Users className="h-5 w-5 text-[#005B14]" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold">{selectedEvent.organizerName || storeDetails.store_name}</p>
                        <p className="text-xs text-[#9CA3AF]">Event organizer</p>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5 md:p-6">
                    <h2 className="mb-3 text-base font-bold">Location</h2>
                    <div className="flex items-start gap-3 text-sm text-[#374151]">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#005B14]" />
                      <div>
                        <p className="font-medium">{selectedEvent.location}</p>
                        {selectedEvent.locationDetails && (
                          <p className="mt-0.5 text-xs text-[#9CA3AF]">{selectedEvent.locationDetails}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Right Column: Ticket Selector + Summary ── */}
                <div id="tickets" className="lg:sticky lg:top-[72px] lg:self-start">
                  <div className="rounded-2xl border border-[#E8E8E8] bg-white p-5">
                    <h2 className="mb-1 text-lg font-bold">Get Tickets</h2>
                    <p className="mb-5 text-xs text-[#9CA3AF]">
                      {format(new Date(selectedEvent.startDate), "EEE, MMM d · ")}
                      {selectedEvent.startTime}
                    </p>

                    {/* Ticket rows */}
                    <div className="space-y-4">
                      {activeTickets.map((ticket) => {
                        const quantity = ticketQuantities[ticket.id] || 0;
                        const available = Math.max(ticket.quantity - ticket.sold, 0);
                        const limit = Math.min(ticket.orderLimitPerPerson, available);
                        const isSoldOut = available === 0;

                        return (
                          <div
                            key={ticket.id}
                            className={`rounded-xl border p-4 transition-colors ${
                              quantity > 0
                                ? "border-[#005B14] bg-[#F0F7F1]"
                                : isSoldOut
                                  ? "border-[#F3F4F6] bg-[#FAFAFA] opacity-60"
                                  : "border-[#E8E8E8] bg-white"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-[#111827]">{ticket.name}</p>
                                <p className="mt-0.5 text-base font-bold text-[#005B14]">
                                  {ticket.type === "free" ? "Free" : `₦${(ticket.price || 0).toLocaleString()}`}
                                </p>
                                {isSoldOut && (
                                  <p className="mt-1 text-xs font-medium text-red-500">Sold out</p>
                                )}
                                {!isSoldOut && available <= 10 && (
                                  <p className="mt-1 text-xs text-orange-500">{available} left</p>
                                )}
                              </div>

                              {/* Quantity stepper */}
                              {!isSoldOut && (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    disabled={quantity === 0}
                                    onClick={() => updateTicketQuantity(ticket.id, quantity - 1, limit)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-sm font-bold text-[#374151] transition-colors hover:border-[#005B14] hover:text-[#005B14] disabled:opacity-30"
                                  >
                                    −
                                  </button>
                                  <span className="w-5 text-center text-sm font-semibold">{quantity}</span>
                                  <button
                                    type="button"
                                    disabled={quantity >= limit}
                                    onClick={() => updateTicketQuantity(ticket.id, quantity + 1, limit)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-sm font-bold text-[#374151] transition-colors hover:border-[#005B14] hover:text-[#005B14] disabled:opacity-30"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order summary */}
                    {selectedTickets.length > 0 && (
                      <div className="mt-5 space-y-2 border-t border-[#F0F0F0] pt-4 text-sm">
                        {selectedTickets.map(({ ticket, quantity }) => (
                          <div key={ticket.id} className="flex justify-between text-[#6B7280]">
                            <span>{quantity}× {ticket.name}</span>
                            <span>
                              {ticket.type === "free"
                                ? "Free"
                                : `₦${((ticket.price || 0) * quantity).toLocaleString()}`}
                            </span>
                          </div>
                        ))}
                        {serviceFee > 0 && (
                          <div className="flex justify-between text-[#9CA3AF]">
                            <span>Service fee</span>
                            <span>₦{serviceFee.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t border-[#F0F0F0] pt-2 font-bold text-[#111827]">
                          <span>Total</span>
                          <span>
                            {ticketTotal === 0 ? "Free" : `₦${ticketTotal.toLocaleString()}`}
                          </span>
                        </div>
                      </div>
                    )}

                    <Button
                      className="mt-5 h-11 w-full rounded-full bg-[#005B14] text-sm font-semibold hover:bg-[#004610] disabled:opacity-40"
                      disabled={totalTickets === 0}
                    >
                      {totalTickets === 0 ? "Select tickets to continue" : `Continue · ${totalTickets} ticket${totalTickets > 1 ? "s" : ""}`}
                    </Button>

                    <p className="mt-3 text-center text-[10px] text-[#9CA3AF]">
                      Secure checkout · Instant confirmation by email
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Other Events ── */}
              {otherEvents.length > 0 && (
                <section className="mt-10">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-bold">Other Events</h2>
                    <button className="flex items-center gap-1 text-xs font-semibold text-[#005B14] hover:underline">
                      See all <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {otherEvents.slice(0, 3).map((event) => {
                      const eventLowest = event.tickets
                        .filter((t) => t.type !== "invite")
                        .reduce((min, t) => {
                          if (t.type === "free") return 0;
                          return Math.min(min, t.price || Infinity);
                        }, Infinity);
                      const eventFree = event.tickets.some((t) => t.type === "free");

                      return (
                        <button
                          key={event.id}
                          onClick={() => resetForEvent(event.id)}
                          className="group overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white text-left transition-shadow hover:shadow-md"
                        >
                          <div className="relative aspect-[16/9] overflow-hidden bg-[#F3F4F6]">
                            <Image
                              src={event.coverImage}
                              alt={event.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, 33vw"
                            />
                          </div>
                          <div className="p-4">
                            <p className="line-clamp-2 text-sm font-semibold leading-snug text-[#111827]">
                              {event.name}
                            </p>
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                              <CalendarDays className="h-3 w-3 shrink-0" />
                              <span>{format(new Date(event.startDate), "EEE, MMM d")}</span>
                              <span>·</span>
                              <span>{event.startTime}</span>
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                            <p className="mt-3 text-sm font-bold text-[#005B14]">
                              {eventFree && eventLowest === 0
                                ? "Free"
                                : eventLowest !== Infinity
                                  ? `From ₦${eventLowest.toLocaleString()}`
                                  : "Tickets available"}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

            </>
          )}
        </main>
      )}

      <StorefrontFooter storeDetails={storeDetails} logoUrl={logoUrl} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function Page() {
  const params = useParams();
  const storeId = params.storeId as string;

  const [searchQuery, setSearchQuery] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [storeDetails, setStoreDetails] = useState<StoreDetails | null>(null);
  const [storeReviews, setStoreReviews] = useState<StoreReview[]>([]);
  const [listings, setListings] = useState<totalListings>(0);
  const [ratings, setRatings] = useState<ratings>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendorId, setVendorId] = useState<string | undefined>(undefined);

  const { hasActiveSubscription, isLoading: isCheckingSubscription } = useSubscriptionCheck(vendorId);
  const { hasAvailability, isOpen, nextOpening } = useStoreAvailability(storeDetails?.availability);
  const showAvailabilityModal =
    !isCheckingSubscription && hasActiveSubscription && hasAvailability && !isOpen;

  const { addToCart } = useCart();
  const isMockRetailStore = isMockRetailStorefront(storeId);
  const isMockFoodStore = isMockFoodStorefront(storeId);
  const isMockEventStore = isMockEventStorefront(storeId);
  const isMockStore = isMockRetailStore || isMockFoodStore || isMockEventStore;
  const mockEvents = getPublishedEvents();

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!storeId) return;
      setIsLoading(true);
      setError(null);
      try {
        if (isMockStore) {
          const details = isMockEventStore
            ? mockEventStoreDetails
            : isMockFoodStore
              ? mockFoodStoreDetails
              : mockRetailStoreDetails;
          setStoreDetails({ ...details, id: storeId } as StoreDetails);
          setStoreReviews(mockStoreReviews);
          setListings(
            isMockEventStore
              ? mockEvents.length
              : isMockFoodStore
                ? mockStorefrontFoodItems.length
                : mockRetailProducts.length
          );
          setRatings(4.8);
          setVendorId(details.vendor_id);
          document.cookie = `vendor_id=${details.vendor_id}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          document.cookie = `vendor_email=${encodeURIComponent("demo@swiftree.app")}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          document.cookie = `storefront_store_id=${storeId}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          return;
        }

        const response = await fetch(`/api/stores/${storeId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch store details");
        }
        const result = await response.json();
        if (result.status === "success" && result.data) {
          setStoreDetails(result.data.storeDetails as StoreDetails);
          setStoreReviews(result.data.reviews.items || []);
          setListings(result.data.total_listings || 0);
          setRatings(result.data.ratings || 0);
          const vid = result.data.storeDetails.vendor_id;
          const vemail = result.data.storeDetails.vendor_email;
          if (vid) {
            document.cookie = `vendor_id=${vid}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
            setVendorId(vid);
          }
          if (vemail) {
            document.cookie = `vendor_email=${encodeURIComponent(vemail)}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          }
          if (storeId) {
            document.cookie = `storefront_store_id=${storeId}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          }
        } else {
          throw new Error(result.message || "Failed to load store details");
        }
      } catch (err) {
        console.error("Error fetching store:", err);
        setError(err instanceof Error ? err.message : "Store not found or unavailable");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoreData();
  }, [isMockEventStore, isMockFoodStore, isMockStore, mockEvents.length, storeId]);

  useEffect(() => {
    if (!storeId || isMockEventStore || isFoodBusinessType(storeDetails?.business_type)) {
      if (isMockEventStore) setIsLoadingProducts(false);
      return;
    }
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        if (isMockRetailStore) {
          setProducts(mockRetailProducts.map((p) => ({ ...p, store_id: storeId })));
          return;
        }
        const queryParams = new URLSearchParams({
          page: "1", pageSize: "50", status: "", sort: "created_at", dir: "desc",
        });
        const response = await fetch(`/api/stores/${storeId}/products?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const result = await response.json();
        if (result.status === "success" && result.data) {
          setProducts(result.data.items || []);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [isMockEventStore, isMockRetailStore, storeId, storeDetails?.business_type]);

  useEffect(() => {
    if (!storeId || !isFoodBusinessType(storeDetails?.business_type)) return;
    const fetchFoodItems = async () => {
      setIsLoadingProducts(true);
      try {
        if (isMockFoodStore) {
          setFoodItems(mockStorefrontFoodItems.map((item) => ({ ...item, storeId })));
          return;
        }
        const response = await fetch(`/api/stores/${storeId}/food`, { cache: "no-store" });
        if (!response.ok) throw new Error("Failed to fetch food items");
        const result = await response.json();
        if (result.status === "success" && result.data) {
          setFoodItems(result.data);
        }
      } catch (err) {
        console.error("Error fetching food items:", err);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchFoodItems();
  }, [isMockFoodStore, storeId, storeDetails?.business_type]);

  const filteredProducts = products.filter((p) =>
    p.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    let hasVariants = false;
    try {
      const v = typeof product.variants === "string" ? JSON.parse(product.variants) : product.variants;
      hasVariants = Array.isArray(v) && v.length > 0;
    } catch {
      hasVariants = false;
    }
    if (hasVariants) {
      window.location.href = `/storefront/${storeId}/product/${product.id}`;
      return;
    }
    addToCart({
      id: product.id,
      name: product.product_name,
      price: product.product_price,
      image: product.product_images[0] || Banner,
      description: product.product_description,
    }, 1);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
    if (!showCart && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const logoUrl = storeDetails?.logo ? getImageUrl(storeDetails.logo) : null;
  const bannerUrl =
    storeDetails?.banner && storeDetails.banner_style !== "carousel"
      ? getImageUrl(storeDetails.banner)
      : null;

  const getWhatsAppUrl = (phoneNumber: string): string => {
    const clean = phoneNumber.replace(/\D/g, "");
    let formatted = clean;
    if (formatted.startsWith("0")) formatted = "234" + formatted.substring(1);
    if (!formatted.startsWith("234") && !formatted.startsWith("+")) formatted = "234" + formatted;
    return `https://wa.me/${formatted}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#005B14] mx-auto mb-4" />
          <p className="text-sm text-[#6B7280]">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !storeDetails) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Store Not Found</h2>
          <p className="text-[#6B7280] mb-6">{error || "The store you are looking for does not exist."}</p>
          <Link href="/"><Button className="bg-[#005B14] hover:bg-[#004610]">Go Home</Button></Link>
        </div>
      </div>
    );
  }

  const sharedProps: V2TemplateProps = {
    storeId,
    storeDetails,
    storeReviews,
    listings,
    ratings,
    searchQuery,
    setSearchQuery,
    toggleCart,
    showCart,
    logoUrl,
    bannerUrl,
    getWhatsAppUrl,
  };

  if (isMockEventStore) {
    return (
      <>
        <V2EventStorefront {...sharedProps} events={mockEvents} />
        <AvailabilityModal isOpen={showAvailabilityModal} storeName={storeDetails.store_name} nextOpening={nextOpening} />
      </>
    );
  }

  if (isFoodBusinessType(storeDetails.business_type)) {
    return (
      <>
        <V2FoodStorefront {...sharedProps} foodItems={foodItems} isLoadingProducts={isLoadingProducts} />
        <AvailabilityModal isOpen={showAvailabilityModal} storeName={storeDetails.store_name} nextOpening={nextOpening} />
      </>
    );
  }

  return (
    <>
      <V2RetailStorefront
        {...sharedProps}
        filteredProducts={filteredProducts}
        allProducts={products}
        isLoadingProducts={isLoadingProducts}
        handleAddToCart={handleAddToCart}
      />
      <AvailabilityModal isOpen={showAvailabilityModal} storeName={storeDetails.store_name} nextOpening={nextOpening} />
    </>
  );
}

export default Page;
