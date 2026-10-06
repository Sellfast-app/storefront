"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Banner from "@/public/Banner.png";
import { ArrowLeft, Mail, MapPin, Phone, Store } from "lucide-react";

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
  };
}

type PageKind = "about" | "contact" | "return";

const getImageUrl = (imagePath?: string | null): string | null => {
  if (!imagePath) return null;
  if (imagePath.startsWith("/") || imagePath.startsWith("http")) return imagePath;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return `${apiBaseUrl}${imagePath}`;
};

export default function StoreInfoPage({ kind }: { kind: PageKind }) {
  const params = useParams();
  const storeId = params.storeId as string;
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          <Link
            href={`/storefront/${storeId}`}
            className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#2D333A] shadow-sm transition hover:bg-white md:left-8 md:top-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Store
          </Link>
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

        <section className="bg-[#F5F6F7] px-4 py-12 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-3">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={storeName}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#005B14]">
                    <Store className="h-5 w-5" />
                  </div>
                )}
                <p className="text-lg font-bold text-[#2D333A]">{storeName}</p>
              </div>
              <p className="max-w-sm text-sm leading-6 text-[#667085]">
                {store?.store_description ||
                  "Shop directly from this Swiftree-powered storefront."}
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold uppercase text-[#2D333A]">Store Links</h3>
              <div className="mt-5 space-y-3 text-sm text-[#667085]">
                <Link href={`/storefront/${storeId}#top`} className="block hover:text-[#005B14]">
                  Home
                </Link>
                <Link href={`/storefront/${storeId}#all-products`} className="block hover:text-[#005B14]">
                  Shop
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold uppercase text-[#2D333A]">Useful Links</h3>
              <div className="mt-5 space-y-3 text-sm text-[#667085]">
                <Link href={`/storefront/${storeId}/about`} className="block hover:text-[#005B14]">
                  About Us
                </Link>
                <Link href={`/storefront/${storeId}/contact`} className="block hover:text-[#005B14]">
                  Contact Us
                </Link>
                <Link href={`/storefront/${storeId}/return-policy`} className="block hover:text-[#005B14]">
                  Return Policy
                </Link>
              </div>
            </div>
          </div>
        </section>
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
