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
import { useSubscriptionCheck } from "@/hooks/useSubscriptionCheck";
// import { SubscriptionModal } from "@/components/SubscriptionModal";
import { AvailabilityModal } from "@/components/AvailabilityModal";
import {
  StoreAvailabilityEntry,
  useStoreAvailability,
} from "@/hooks/useStoreAvailability";
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
import { TicketSelection } from "@/app/(routes)/events/[eventId]/_components/TicketSelection";
import FoodProductGrid from "@/components/FoodproductGrid";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Menu,
  CreditCard,
  Globe2,
  MessageCircle,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Store,
  Ticket,
  Truck,
  UserRound,
  Users,
  WalletCards,
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

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={
            star <= fullStars
              ? "#FEA436"
              : star === fullStars + 1 && hasHalfStar
                ? "url(#half)"
                : "#FFE0BA"
          }
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#FEA436" />
              <stop offset="50%" stopColor="#FFE0BA" />
            </linearGradient>
          </defs>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ))}
    </div>
  );
};

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
}: Pick<
  V2TemplateProps,
  "storeDetails" | "logoUrl" | "searchQuery" | "setSearchQuery" | "toggleCart"
>) {
  return (
    <header className="sticky top-0 z-20 border-b border-[#F1F1F1] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:px-6">
        <Link href="#" className="flex items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${storeDetails.store_name} logo`}
              width={42}
              height={42}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#061400] text-white">
              <Store className="h-4 w-4" />
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold">{storeDetails.store_name}</p>
            <p className="text-xs text-[#71717A]">{storeDetails.business_type}</p>
          </div>
        </Link>

        <div className="hidden flex-1 justify-center px-4 md:flex">
          <div className="relative w-full max-w-xl">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products"
              className="h-11 rounded-full border-[#ECECEC] bg-[#F6F7F6] pl-11 pr-12"
            />
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
            <SlidersHorizontal className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <UserRound className="h-4 w-4" />
          </Button>
          <CartButton onClick={toggleCart} />
        </div>
      </div>
    </header>
  );
}

function V2LocalizationStrip({
  storeDetails,
}: {
  storeDetails: StoreDetails;
}) {
  const country = storeDetails.metadata?.country || "Nigeria";
  const state = storeDetails.metadata?.state || storeDetails.metadata?.city || "Lagos";
  const currency =
    country.toLowerCase().includes("ghana")
      ? "GHS"
      : country.toLowerCase().includes("kenya")
        ? "KES"
        : country.toLowerCase().includes("united kingdom")
          ? "GBP"
          : country.toLowerCase().includes("rwanda")
            ? "RWF"
            : "NGN";

  return (
    <section className="border-b border-[#EEF1EE] bg-white">
      <div className="mx-auto grid max-w-7xl gap-3 px-4 py-3 text-sm text-[#4B5563] md:grid-cols-3 lg:px-6">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-primary" />
          <span>{country} storefront</span>
        </div>
        <div className="flex items-center gap-2">
          <WalletCards className="h-4 w-4 text-primary" />
          <span>Prices shown in {currency}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span>Pickup and delivery for {state}</span>
        </div>
      </div>
    </section>
  );
}

function V2CheckoutRoutes() {
  const routes = [
    {
      icon: ShoppingBag,
      title: "Website checkout",
      description: "Browse, add to cart and pay directly on the storefront.",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp ordering",
      description: "Continue the conversation with the vendor's AI sales assistant.",
    },
    {
      icon: CreditCard,
      title: "Secure payments",
      description: "Paystack, Nomba and crypto-ready checkout surfaces.",
    },
  ];

  return (
    <section className="mt-10 grid gap-4 md:grid-cols-3">
      {routes.map((route) => (
        <div key={route.title} className="rounded-2xl border bg-white p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <route.icon className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-semibold">{route.title}</h3>
          <p className="mt-2 text-sm text-[#71717A]">{route.description}</p>
        </div>
      ))}
    </section>
  );
}

function StorefrontLeadForm({
  storeId,
  storeName,
}: {
  storeId: string;
  storeName: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

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
      if (!response.ok) {
        throw new Error(result?.message || "Unable to join list right now");
      }

      setStatus("success");
      setMessage("You're on the list. We'll keep you updated.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to join list right now");
    }
  }

  return (
    <section className="mt-10 rounded-3xl border border-[#E7EFE5] bg-[#061400] p-5 text-white md:p-8">
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Stay connected
          </div>
          <h2 className="text-2xl font-semibold">Get updates from {storeName}</h2>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Drop your email for restocks, offers and new product announcements.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full md:w-[420px]">
          <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 sm:flex-row">
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              placeholder="Enter your email"
              className="h-11 flex-1 border-0 bg-transparent text-[#111827] shadow-none focus-visible:ring-0"
            />
            <Button disabled={status === "loading"} className="h-11 rounded-xl px-5">
              {status === "loading" ? "Submitting..." : "Submit"}
            </Button>
          </div>
          {message && (
            <p className={`mt-2 text-xs ${status === "error" ? "text-red-200" : "text-white/70"}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function V2RetailStorefront({
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
  filteredProducts,
  isLoadingProducts,
  handleAddToCart,
  getWhatsAppUrl,
}: V2RetailTemplateProps) {
  const featuredProducts = filteredProducts.slice(0, 4);
  const categories = Array.from(
    new Set(filteredProducts.map((product) => product.product_type).filter(Boolean))
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      <V2StoreHeader
        storeDetails={storeDetails}
        logoUrl={logoUrl}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleCart={toggleCart}
      />
      <V2LocalizationStrip storeDetails={storeDetails} />

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        {showCart ? (
          <div className="mx-auto max-w-2xl">
            <CartView />
          </div>
        ) : (
          <>
            <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[360px] overflow-hidden rounded-2xl bg-[#061400]">
                <Image
                  src={bannerUrl || Banner}
                  alt={`${storeDetails.store_name} banner`}
                  fill
                  priority
                  className="object-cover opacity-70"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#061400]/90 via-[#061400]/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Retail & wholesale storefront
                  </div>
                  <h1 className="max-w-xl text-3xl font-semibold md:text-5xl">
                    {storeDetails.store_name}
                  </h1>
                  <p className="mt-3 max-w-lg text-sm text-white/80 md:text-base">
                    {storeDetails.store_description || "Shop curated products and checkout securely with Swiftree."}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button className="rounded-full">Shop collection</Button>
                    {storeDetails.metadata?.phone && (
                      <a
                        href={getWhatsAppUrl(storeDetails.metadata.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="rounded-full bg-white text-[#061400] hover:bg-white/90">
                          Chat on WhatsApp
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ["Listings", listings],
                  ["Rating", ratings],
                  ["Orders", "Web + Chat"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border bg-white p-5">
                    <p className="text-xs text-[#71717A]">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-6 flex gap-3 overflow-x-auto pb-2">
              {["All products", ...categories].map((category, index) => (
                <button
                  key={category}
                  className={`h-11 shrink-0 rounded-full px-5 text-sm font-medium ${
                    index === 0 ? "bg-[#061400] text-white" : "border bg-white text-[#111827]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </section>

            {featuredProducts.length > 0 && (
              <section className="mt-4 grid gap-4 md:grid-cols-4">
                {featuredProducts.map((product) => (
                  <Link
                    href={`/storefront/${storeId}/product/${product.id}`}
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border bg-white"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={product.product_images[0] || Banner}
                        alt={product.product_name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-2 text-sm font-medium">{product.product_name}</p>
                      <p className="mt-2 text-lg font-semibold">
                        ₦{product.product_price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </section>
            )}

            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Shop all products</h2>
                  <p className="text-sm text-[#71717A]">Browse the full catalog.</p>
                </div>
                <Button variant="outline" className="hidden rounded-full md:inline-flex">
                  <Menu className="h-4 w-4" />
                  <span className="ml-2">Collections</span>
                </Button>
              </div>

              {isLoadingProducts ? (
                <div className="py-20 text-center text-sm text-[#71717A]">Loading products...</div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <Link
                      href={`/storefront/${storeId}/product/${product.id}`}
                      key={product.id}
                      className="group overflow-hidden rounded-2xl border bg-white"
                    >
                      <div className="relative aspect-square overflow-hidden bg-[#F5F5F5]">
                        <Image
                          src={product.product_images[0] || Banner}
                          alt={product.product_name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <div className="space-y-3 p-3">
                        <p className="line-clamp-2 min-h-10 text-sm font-medium">
                          {product.product_name}
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold">
                            ₦{product.product_price.toLocaleString()}
                          </span>
                          <Button
                            size="sm"
                            className="h-9 rounded-full px-3 text-xs"
                            onClick={(event) => handleAddToCart(event, product)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-10 rounded-2xl border bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Customer reviews</h2>
                <div className="flex items-center gap-1 text-sm text-primary">
                  <Star className="h-4 w-4 fill-primary" />
                  {ratings}
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {storeReviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="rounded-xl border p-4">
                    <p className="text-sm font-medium">{review.user_name}</p>
                    <StarRating rating={review.rating} />
                    <p className="mt-3 line-clamp-3 text-sm text-[#71717A]">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <V2CheckoutRoutes />
            <StorefrontLeadForm storeId={storeId} storeName={storeDetails.store_name} />
          </>
        )}
      </main>
    </div>
  );
}

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
  const categories = Array.from(
    new Set(foodItems.flatMap((item) => item.category || []).filter(Boolean))
  ).slice(0, 10);

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <V2StoreHeader
        storeDetails={storeDetails}
        logoUrl={logoUrl}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleCart={toggleCart}
      />
      <V2LocalizationStrip storeDetails={storeDetails} />

      {showCart ? (
        <main className="mx-auto max-w-2xl px-4 py-6 lg:px-6">
          <CartView />
        </main>
      ) : (
        <main>
          <section className="relative h-[360px] overflow-hidden md:h-[430px]">
            <Image
              src={bannerUrl || Banner}
              alt={`${storeDetails.store_name} banner`}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 lg:px-6">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex rounded-full bg-[#061400] px-3 py-1 text-xs font-medium text-white">
                  Food & Restaurant
                </div>
                <h1 className="text-4xl font-semibold md:text-6xl">
                  {storeDetails.store_name}
                </h1>
                <p className="mt-3 max-w-xl text-base text-[#71717A]">
                  {storeDetails.store_description || "Order fresh meals for pickup or vendor delivery."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button className="rounded-full">Start order</Button>
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
                          ? "bg-[#061400] text-white"
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
                  storeId={storeId}
                  isLoading={isLoadingProducts}
                  searchQuery={searchQuery}
                />
                <V2CheckoutRoutes />
                <StorefrontLeadForm storeId={storeId} storeName={storeDetails.store_name} />
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

function V2EventStorefront({
  storeId,
  storeDetails,
  searchQuery,
  setSearchQuery,
  toggleCart,
  showCart,
  logoUrl,
  events,
}: V2EventTemplateProps) {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || "");
  const filteredEvents = events.filter((event) =>
    `${event.name} ${event.location} ${event.organizerName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );
  const selectedEvent =
    events.find((event) => event.id === selectedEventId) || filteredEvents[0] || events[0];
  const featuredEvent = selectedEvent || events[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      <V2StoreHeader
        storeDetails={storeDetails}
        logoUrl={logoUrl}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleCart={toggleCart}
      />
      <V2LocalizationStrip storeDetails={storeDetails} />

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        {showCart ? (
          <div className="mx-auto max-w-2xl">
            <CartView />
          </div>
        ) : (
          <>
            <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[390px] overflow-hidden rounded-2xl bg-[#061400]">
                {featuredEvent && (
                  <Image
                    src={featuredEvent.coverImage}
                    alt={featuredEvent.name}
                    fill
                    priority
                    className="object-cover opacity-75"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#061400]/95 via-[#061400]/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                    <Ticket className="h-3.5 w-3.5" />
                    Events & ticketing storefront
                  </div>
                  <h1 className="max-w-2xl text-3xl font-semibold md:text-5xl">
                    {featuredEvent?.name || storeDetails.store_name}
                  </h1>
                  <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">
                    {featuredEvent?.description || storeDetails.store_description}
                  </p>
                  {featuredEvent && (
                    <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/85">
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2">
                        <CalendarDays className="h-4 w-4" />
                        {format(new Date(featuredEvent.startDate), "dd MMM yyyy")}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2">
                        <Clock className="h-4 w-4" />
                        {featuredEvent.startTime} - {featuredEvent.endTime}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-2">
                        <MapPin className="h-4 w-4" />
                        {featuredEvent.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ["Events", events.length],
                  [
                    "Tickets sold",
                    events
                      .reduce(
                        (sum, event) =>
                          sum + event.tickets.reduce((ticketSum, ticket) => ticketSum + ticket.sold, 0),
                        0
                      )
                      .toLocaleString(),
                  ],
                  ["Channels", "Web + Chat"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border bg-white p-5">
                    <p className="text-xs text-[#71717A]">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
              <div>
                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Upcoming events</h2>
                    <p className="text-sm text-[#71717A]">
                      Select an event to preview ticket tiers and checkout.
                    </p>
                  </div>
                  <div className="relative md:w-80">
                    <Input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search events"
                      className="h-11 rounded-full border-[#ECECEC] bg-white pl-11"
                    />
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71717A]" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {filteredEvents.map((event) => {
                    const lowestPaidTicket = event.tickets
                      .filter((ticket) => ticket.type === "paid")
                      .reduce<number | null>((lowest, ticket) => {
                        const price = ticket.price ?? 0;
                        if (lowest === null) return price;
                        return Math.min(lowest, price);
                      }, null);

                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEventId(event.id)}
                        className={`group overflow-hidden rounded-2xl border bg-white text-left transition ${
                          selectedEvent?.id === event.id
                            ? "border-[#4FCA6A] shadow-sm"
                            : "border-[#F0F0F0] hover:border-[#DDE7DD]"
                        }`}
                      >
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <Image
                            src={event.coverImage}
                            alt={event.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                          <div className="absolute bottom-3 left-3 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                            {format(new Date(event.startDate), "dd MMM yyyy")}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="line-clamp-2 text-base font-semibold">{event.name}</h3>
                          <p className="mt-2 line-clamp-2 text-xs text-[#71717A]">
                            {event.description}
                          </p>
                          <div className="mt-4 grid gap-2 text-xs text-[#71717A]">
                            <span className="inline-flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5" />
                              {event.location}
                            </span>
                            <span className="inline-flex items-center gap-2">
                              <Users className="h-3.5 w-3.5" />
                              {event.organizerName}
                            </span>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t pt-3">
                            <div>
                              <p className="text-[11px] text-[#71717A]">Tickets from</p>
                              <p className="text-sm font-semibold">
                                {lowestPaidTicket === null
                                  ? "Free"
                                  : `₦${lowestPaidTicket.toLocaleString()}`}
                              </p>
                            </div>
                            <span className="rounded-full bg-[#005B1414] px-3 py-1 text-xs font-medium text-primary">
                              Select
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                {selectedEvent ? (
                  <TicketSelection event={selectedEvent} />
                ) : (
                  <div className="rounded-2xl border bg-white p-6 text-sm text-[#71717A]">
                    No event selected.
                  </div>
                )}
              </aside>
            </section>

            <V2CheckoutRoutes />
            <StorefrontLeadForm storeId={storeId} storeName={storeDetails.store_name} />
          </>
        )}
      </main>
    </div>
  );
}

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
  const {
    hasActiveSubscription,
    isLoading: isCheckingSubscription,
  } = useSubscriptionCheck(vendorId);
  const { hasAvailability, isOpen, nextOpening } = useStoreAvailability(
    storeDetails?.availability
  );
  const showAvailabilityModal =
    !isCheckingSubscription &&
    hasActiveSubscription &&
    hasAvailability &&
    !isOpen;

  const { addToCart } = useCart();
  const isMockRetailStore = isMockRetailStorefront(storeId);
  const isMockFoodStore = isMockFoodStorefront(storeId);
  const isMockEventStore = isMockEventStorefront(storeId);
  const isMockStore = isMockRetailStore || isMockFoodStore || isMockEventStore;
  const mockEvents = getPublishedEvents();

  // Fetch store details
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
          setStoreDetails({ ...details, id: storeId });
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
          setStoreDetails(result.data.storeDetails);
          setStoreReviews(result.data.reviews.items || []);
          setListings(result.data.total_listings || 0);
          setRatings(result.data.ratings || 0);

          const vendorId = result.data.storeDetails.vendor_id;
          const vendorEmail = result.data.storeDetails.vendor_email;

          if (vendorId) {
            document.cookie = `vendor_id=${vendorId}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
            setVendorId(vendorId);
          }
          if (vendorEmail) {
            document.cookie = `vendor_email=${encodeURIComponent(vendorEmail)}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          }
          if (storeId) {
            document.cookie = `storefront_store_id=${storeId}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
          }
        } else {
          throw new Error(result.message || "Failed to load store details");
        }
      } catch (err) {
        console.error("Error fetching store:", err);
        setError(
          err instanceof Error ? err.message : "Store not found or unavailable"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [isMockEventStore, isMockFoodStore, isMockStore, mockEvents.length, storeId]);

  // Fetch products — regular stores
  useEffect(() => {
    if (!storeId || isMockEventStore || isFoodBusinessType(storeDetails?.business_type)) {
      if (isMockEventStore) setIsLoadingProducts(false);
      return;
    }

    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        if (isMockRetailStore) {
          setProducts(mockRetailProducts.map((product) => ({ ...product, store_id: storeId })));
          return;
        }

        const queryParams = new URLSearchParams({
          page: "1",
          pageSize: "50",
          status: "",
          sort: "created_at",
          dir: "desc",
        });

        const response = await fetch(
          `/api/stores/${storeId}/products?${queryParams.toString()}`
        );

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

  // Fetch food items — Restaurant/Food Service stores
  useEffect(() => {
    if (!storeId || !isFoodBusinessType(storeDetails?.business_type)) return;

    const fetchFoodItems = async () => {
      setIsLoadingProducts(true);
      try {
        if (isMockFoodStore) {
          setFoodItems(mockStorefrontFoodItems.map((item) => ({ ...item, storeId })));
          return;
        }

        const response = await fetch(`/api/stores/${storeId}/food`, {
          cache: "no-store",
        });

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

  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isFoodStore = isFoodBusinessType(storeDetails?.business_type);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    let hasVariants = false;
    try {
      const variants = typeof product.variants === 'string'
        ? JSON.parse(product.variants)
        : product.variants;
      hasVariants = Array.isArray(variants) && variants.length > 0;
    } catch {
      hasVariants = false;
    }

    if (hasVariants) {
      window.location.href = `/storefront/${storeId}/product/${product.id}`;
      return;
    }

    const cartProduct = {
      id: product.id,
      name: product.product_name,
      price: product.product_price,
      image: product.product_images[0] || Banner,
      description: product.product_description,
    };
    addToCart(cartProduct, 1);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
    if (!showCart && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const logoUrl = storeDetails?.logo ? getImageUrl(storeDetails.logo) : null;
  const bannerUrl = storeDetails?.banner ? getImageUrl(storeDetails.banner) : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FCFCFC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FCA6A] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    );
  }

  const getWhatsAppUrl = (phoneNumber: string): string => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    let formattedPhone = cleanPhone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '234' + formattedPhone.substring(1);
    }
    if (!formattedPhone.startsWith('234') && !formattedPhone.startsWith('+')) {
      formattedPhone = '234' + formattedPhone;
    }
    return `https://wa.me/${formattedPhone}`;
  };

  if (error || !storeDetails) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FCFCFC]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Store Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The store you are looking for does not exist."}
          </p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isMockEventStore) {
    return (
      <>
        <V2EventStorefront
          storeId={storeId}
          storeDetails={storeDetails}
          storeReviews={storeReviews}
          listings={listings}
          ratings={ratings}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleCart={toggleCart}
          showCart={showCart}
          logoUrl={logoUrl}
          bannerUrl={bannerUrl}
          getWhatsAppUrl={getWhatsAppUrl}
          events={mockEvents}
        />
        {/* Temporarily disabled for V2 storefront previews.
        <SubscriptionModal
          isOpen={showModal}
          storeName={storeDetails.store_name}
        /> */}
        <AvailabilityModal
          isOpen={showAvailabilityModal}
          storeName={storeDetails.store_name}
          nextOpening={nextOpening}
        />
      </>
    );
  }

  if (isFoodStore) {
    return (
      <>
        <V2FoodStorefront
          storeId={storeId}
          storeDetails={storeDetails}
          storeReviews={storeReviews}
          listings={listings}
          ratings={ratings}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleCart={toggleCart}
          showCart={showCart}
          logoUrl={logoUrl}
          bannerUrl={bannerUrl}
          getWhatsAppUrl={getWhatsAppUrl}
          foodItems={foodItems}
          isLoadingProducts={isLoadingProducts}
        />
        {/* Temporarily disabled for V2 storefront previews.
        <SubscriptionModal
          isOpen={showModal}
          storeName={storeDetails.store_name}
        /> */}
        <AvailabilityModal
          isOpen={showAvailabilityModal}
          storeName={storeDetails.store_name}
          nextOpening={nextOpening}
        />
      </>
    );
  }

  return (
    <>
      <V2RetailStorefront
        storeId={storeId}
        storeDetails={storeDetails}
        storeReviews={storeReviews}
        listings={listings}
        ratings={ratings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleCart={toggleCart}
        showCart={showCart}
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
        getWhatsAppUrl={getWhatsAppUrl}
        filteredProducts={filteredProducts}
        isLoadingProducts={isLoadingProducts}
        handleAddToCart={handleAddToCart}
      />
      {/* Temporarily disabled for V2 storefront previews.
      <SubscriptionModal
        isOpen={showModal}
        storeName={storeDetails.store_name}
      /> */}
      <AvailabilityModal
        isOpen={showAvailabilityModal}
        storeName={storeDetails.store_name}
        nextOpening={nextOpening}
      />
    </>
  );

}

export default Page;
