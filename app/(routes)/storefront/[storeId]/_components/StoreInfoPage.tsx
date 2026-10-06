"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Banner from "@/public/Banner.png";
import { Button } from "@/components/ui/button";
import CartButton from "@/components/CartButton";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Search,
  Store,
  Twitter,
  UserRound,
  X,
} from "lucide-react";

interface StoreInfo {
  store_name: string;
  store_description?: string;
  business_type?: string;
  logo?: string | null;
  banner?: string | null;
  metadata?: {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    phone?: string;
    email?: string;
    owner_name?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
    x?: string;
  };
}

type PageKind = "about" | "contact" | "return";

const getImageUrl = (imagePath?: string | null): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith("/") || imagePath.startsWith("http")) return imagePath;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return `${apiBaseUrl}${imagePath}`;
};

const normalizeExternalUrl = (value?: string | null) => {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
};

function StoreInfoHeader({
  storeId,
  store,
  logoUrl,
  storeName,
  searchQuery,
  setSearchQuery,
  showMobileSearch,
  setShowMobileSearch,
}: {
  storeId: string;
  store: StoreInfo | null;
  logoUrl: string | null;
  storeName: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  showMobileSearch: boolean;
  setShowMobileSearch: (value: boolean) => void;
}) {
  const goToStore = () => {
    window.location.href = `/storefront/${storeId}#all-products`;
  };

  return (
    <header className="sticky top-0 z-20 border-b border-[#F1F1F1] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <Link href={`/storefront/${storeId}`} className="flex shrink-0 items-center gap-3">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${storeName} logo`}
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
            <p className="text-sm font-bold tracking-tight text-[#111827]">{storeName}</p>
            <p className="text-[11px] uppercase tracking-wide text-[#71717A]">
              {store?.business_type || "Storefront"}
            </p>
          </div>
        </Link>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            goToStore();
          }}
          className="hidden flex-1 justify-center px-6 md:flex"
        >
          <div className="relative w-full max-w-lg">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              className="h-10 rounded-full border-[#E5E7EB] bg-[#F6F7F6] pl-10 pr-4 text-sm focus-visible:ring-[#005B14]/30"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          </div>
        </form>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white md:hidden"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            {showMobileSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-[#E5E7EB]">
            <UserRound className="h-4 w-4" />
          </Button>
          <CartButton onClick={goToStore} />
        </div>
      </div>

      {showMobileSearch && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            goToStore();
          }}
          className="border-t border-[#F1F1F1] px-4 py-3 md:hidden"
        >
          <div className="relative">
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search products..."
              autoFocus
              className="h-10 rounded-full border-[#E5E7EB] bg-[#F6F7F6] pl-10 pr-4 text-sm"
            />
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          </div>
        </form>
      )}
    </header>
  );
}

function StoreInfoRetailFooter({
  storeId,
  store,
  logoUrl,
  storeName,
}: {
  storeId: string;
  store: StoreInfo | null;
  logoUrl: string | null;
  storeName: string;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const socialLinks = [
    {
      label: "Instagram",
      href: normalizeExternalUrl(store?.metadata?.instagram),
      icon: Instagram,
    },
    {
      label: "Facebook",
      href: normalizeExternalUrl(store?.metadata?.facebook),
      icon: Facebook,
    },
    {
      label: "X",
      href: normalizeExternalUrl(store?.metadata?.x || store?.metadata?.twitter),
      icon: Twitter,
    },
  ].filter((item) => item.href);
  const address = [
    store?.metadata?.address,
    store?.metadata?.city,
    store?.metadata?.state,
    store?.metadata?.country,
  ].filter(Boolean).join(", ");

  return (
    <footer className="mt-16 bg-[url('/storefront-footer-bg.png')] bg-cover bg-center text-white">
      <div className="bg-[#061400]/20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[1.2fr_0.8fr_0.9fr_1.25fr] lg:px-8">
          <div>
            <div className="mb-8 flex items-center gap-3">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={storeName}
                  width={56}
                  height={56}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white ring-2 ring-white/20">
                  <Store className="h-5 w-5" />
                </div>
              )}
              <p className="text-base font-semibold">{storeName}</p>
            </div>
            {store?.store_description && (
              <p className="mb-7 max-w-xs text-sm leading-6 text-white/70">
                {store.store_description}
              </p>
            )}
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{address || "Store address unavailable"}</span>
              </div>
              {store?.metadata?.phone && (
                <a href={`tel:${store.metadata.phone}`} className="flex items-center gap-3 hover:text-white">
                  <Phone className="h-4 w-4" />
                  {store.metadata.phone}
                </a>
              )}
            </div>
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
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
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Store Links</h3>
            <div className="mt-6 space-y-4 text-sm font-medium text-white/70">
              <Link href={`/storefront/${storeId}#top`} className="block hover:text-white">
                Home
              </Link>
              <Link href={`/storefront/${storeId}#all-products`} className="block hover:text-white">
                Shop
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">Useful Links</h3>
            <div className="mt-6 space-y-4 text-sm font-medium text-white/70">
              <Link href={`/storefront/${storeId}/about`} className="block hover:text-white">
                About Us
              </Link>
              <Link href={`/storefront/${storeId}/contact`} className="block hover:text-white">
                Contact Us
              </Link>
              <Link href={`/storefront/${storeId}/terms`} className="block hover:text-white">
                Terms of Use
              </Link>
              <Link href={`/storefront/${storeId}/return-policy`} className="block hover:text-white">
                Return Policy
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-white">
              Stay Updated
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/70">
              Get new arrivals, restocks and store updates from {storeName}.
            </p>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setEmail("");
                setMessage("You're on the list.");
              }}
              className="mt-5"
            >
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
                  className="h-11 shrink-0 rounded-xl bg-[#4FCA6A] px-5 text-sm font-semibold text-white hover:bg-[#3DBA57]"
                >
                  Join
                </Button>
              </div>
              {message && <p className="mt-2 text-xs text-white/80">{message}</p>}
            </form>
          </div>
        </div>
        <div className="border-t border-white/15">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/65 md:flex-row md:items-center md:justify-between lg:px-8">
            <p>{storeName} © {new Date().getFullYear()}</p>
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

export default function StoreInfoPage({ kind }: { kind: PageKind }) {
  const params = useParams();
  const storeId = params.storeId as string;
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadStore() {
      try {
        const response = await fetch(`/api/stores/${storeId}`);
        const result = await response.json();
        const nextStore = result?.data || result?.store || result;
        if (mounted) setStore(nextStore);
      } catch {
        if (mounted) setStore(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadStore();
    return () => {
      mounted = false;
    };
  }, [storeId]);

  const logoUrl = getImageUrl(store?.logo);
  const bannerUrl = getImageUrl(store?.banner);
  const storeName = store?.store_name || "This Store";
  const address = [
    store?.metadata?.address,
    store?.metadata?.city,
    store?.metadata?.state,
    store?.metadata?.country,
  ].filter(Boolean).join(", ");

  const pageTitle =
    kind === "about"
      ? `About ${storeName}`
      : kind === "contact"
        ? `Contact ${storeName}`
        : "Return Policy";

  if (kind === "contact") {
    return (
      <main className="min-h-screen bg-white text-[#2D333A]">
        <StoreInfoHeader
          storeId={storeId}
          store={store}
          logoUrl={logoUrl}
          storeName={storeName}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showMobileSearch={showMobileSearch}
          setShowMobileSearch={setShowMobileSearch}
        />

        <section className="relative h-48 overflow-hidden bg-[#2D2D2D] md:h-56">
          <Image
            src={bannerUrl || Banner}
            alt={`${storeName} banner`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
            <h1 className="text-5xl font-bold text-white md:text-6xl">Contact Us</h1>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[0.95fr_1.25fr] md:px-8 lg:gap-16 lg:py-20">
          <div className="md:border-r md:border-[#E7E9EC] md:pr-12">
            <div className="mb-10 flex items-center gap-5">
              <h2 className="shrink-0 text-xl font-bold uppercase tracking-wide text-[#2D333A]">
                Customer Service
              </h2>
              <div className="h-px flex-1 bg-[#E2E5E9]" />
            </div>

            {isLoading ? (
              <div className="space-y-6">
                <div className="h-12 w-3/4 animate-pulse rounded bg-[#EEF0F2]" />
                <div className="h-12 w-1/2 animate-pulse rounded bg-[#EEF0F2]" />
                <div className="h-12 w-2/3 animate-pulse rounded bg-[#EEF0F2]" />
              </div>
            ) : (
              <div className="space-y-5 text-lg text-[#353A40]">
                <div>
                  <MapPin className="mb-2 h-6 w-6 text-[#2D333A]" />
                  <p className="font-medium">Visit Us</p>
                  <p className="mt-1 text-base text-[#3F454B]">
                    {address || "Store address unavailable"}
                  </p>
                </div>

                <div>
                  <Phone className="mb-2 h-6 w-6 text-[#2D333A]" />
                  <p className="font-medium">Call Us</p>
                  {store?.metadata?.phone ? (
                    <a
                      href={`tel:${store.metadata.phone}`}
                      className="mt-1 block text-base text-[#3F454B] hover:text-[#005B14]"
                    >
                      {store.metadata.phone}
                    </a>
                  ) : null}
                </div>

                <div>
                  <Mail className="mb-2 h-6 w-6 text-[#2D333A]" />
                  <p className="font-medium">Mail Us</p>
                  {store?.metadata?.email ? (
                    <a
                      href={`mailto:${store.metadata.email}`}
                      className="mt-1 block text-base text-[#3F454B] hover:text-[#005B14]"
                    >
                      {store.metadata.email}
                    </a>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="mb-8 flex items-center gap-5">
              <h2 className="shrink-0 text-xl font-bold uppercase tracking-wide text-[#2D333A]">
                Contact Us Form
              </h2>
              <div className="h-px flex-1 bg-[#E2E5E9]" />
            </div>

            <form
              onSubmit={(event) => event.preventDefault()}
              className="space-y-6"
            >
              <label className="block">
                <span className="mb-3 block text-base font-medium text-[#343A40]">
                  Name *
                </span>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  className="h-16 w-full rounded-2xl border border-[#DADDE2] bg-white px-5 text-base outline-none transition placeholder:text-[#C9CED5] focus:border-[#005B14] focus:ring-2 focus:ring-[#005B14]/10"
                />
              </label>

              <label className="block">
                <span className="mb-3 block text-base font-medium text-[#343A40]">
                  Phone number *
                </span>
                <input
                  type="tel"
                  required
                  placeholder="Enter phone number"
                  className="h-16 w-full rounded-2xl border border-[#DADDE2] bg-white px-5 text-base outline-none transition placeholder:text-[#C9CED5] focus:border-[#005B14] focus:ring-2 focus:ring-[#005B14]/10"
                />
              </label>

              <label className="block">
                <span className="mb-3 block text-base font-medium text-[#343A40]">
                  Email address *
                </span>
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  className="h-16 w-full rounded-2xl border border-[#DADDE2] bg-white px-5 text-base outline-none transition placeholder:text-[#C9CED5] focus:border-[#005B14] focus:ring-2 focus:ring-[#005B14]/10"
                />
              </label>

              <label className="block">
                <span className="mb-3 block text-base font-medium text-[#343A40]">
                  Message *
                </span>
                <textarea
                  required
                  placeholder="Tell us what you need"
                  rows={4}
                  className="min-h-28 w-full resize-y rounded-2xl border border-[#DADDE2] bg-white px-5 py-4 text-base outline-none transition placeholder:text-[#C9CED5] focus:border-[#005B14] focus:ring-2 focus:ring-[#005B14]/10"
                />
              </label>

              <button
                type="submit"
                className="inline-flex h-14 min-w-56 items-center justify-center rounded-2xl bg-[#555555] px-8 text-base font-semibold text-white transition hover:bg-[#3F3F3F]"
              >
                Send message
              </button>
            </form>
          </div>
        </section>

        <StoreInfoRetailFooter
          storeId={storeId}
          store={store}
          logoUrl={logoUrl}
          storeName={storeName}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9F8] text-[#111827]">
      <header className="border-b border-[#E8E8E8] bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 md:px-6">
          <Link
            href={`/storefront/${storeId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#005B14] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <div className="rounded-2xl border border-[#E8E8E8] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 flex items-center gap-4 border-b border-[#EFEFEF] pb-6">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={storeName}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F8F2] text-[#005B14]">
                <Store className="h-6 w-6" />
              </div>
            )}
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#4FCA6A]">
                {store?.business_type || "Storefront"}
              </p>
              <h1 className="mt-1 text-2xl font-bold md:text-4xl">{pageTitle}</h1>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#E5E7EB]" />
              <div className="h-4 w-full animate-pulse rounded bg-[#E5E7EB]" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#E5E7EB]" />
            </div>
          ) : kind === "about" ? (
            <div className="space-y-5 text-sm leading-7 text-[#5F665D] md:text-base">
              <p>
                {store?.store_description ||
                  `${storeName} is a Swiftree-powered retail storefront built to make shopping simple, secure, and convenient.`}
              </p>
              <p>
                Browse available products, add items to your cart, and complete checkout directly from this storefront.
              </p>
            </div>
          ) : (
            <div className="space-y-5 text-sm leading-7 text-[#5F665D] md:text-base">
              <p>
                Returns and exchanges are handled by {storeName}. Please contact the store as soon as possible if there is an issue with your order.
              </p>
              <p>
                Items must be unused, in their original condition, and reported within the return window communicated by the store.
              </p>
            </div>
          )}
        </div>
      </article>
    </main>
  );
}
