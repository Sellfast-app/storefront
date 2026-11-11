import { NextRequest, NextResponse } from "next/server";

const RESERVED_SUBDOMAINS = new Set([
  "admin",
  "api",
  "crmbookshop",
  "staging",
  "storefront",
  "subscription",
  "vendor",
  "www",
]);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const ORG_CODE = "39fda25f3410a85a0fe5e2a2d81ac2c7d8c8694bf43304fe0db413e6494f024b";

export async function middleware(request: NextRequest) {
  const hostname = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const suffix = ".swiftree.app";

  if (!hostname.endsWith(suffix)) {
    if (hostname === "swiftree.app" || hostname === "www.swiftree.app" || hostname === "localhost") return NextResponse.next();

    const pathname = request.nextUrl.pathname;
    if (
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname === "/favicon.ico" ||
      /\.[a-z0-9]+$/i.test(pathname) ||
      pathname.startsWith("/public/")
    ) return NextResponse.next();

    try {
      const response = await fetch(
        `${API_BASE_URL.replace(/\/+$/, "")}/api/stores/resolve-domain/${encodeURIComponent(hostname)}`,
        { headers: { "x-stf-org-c": ORG_CODE }, cache: "no-store" },
      );
      if (!response.ok) return new NextResponse("Store not found", { status: 404 });
      const payload = await response.json();
      const storeId = payload?.data?.store_id;
      if (payload?.status !== "success" || typeof storeId !== "string") {
        return new NextResponse("Store not found", { status: 404 });
      }
      if (pathname === "/storefront" || pathname.startsWith("/storefront/")) return NextResponse.next();
      const destination = request.nextUrl.clone();
      destination.pathname = `/storefront/${storeId}${pathname === "/" ? "" : pathname}`;
      return NextResponse.rewrite(destination);
    } catch {
      return new NextResponse("Storefront temporarily unavailable", { status: 503 });
    }
  }

  const slug = hostname.slice(0, -suffix.length);
  if (
    !slug ||
    slug.includes(".") ||
    RESERVED_SUBDOMAINS.has(slug) ||
    !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(slug)
  ) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    /\.[a-z0-9]+$/i.test(pathname) ||
    pathname.startsWith("/public/")
  ) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(
      `${API_BASE_URL.replace(/\/+$/, "")}/api/stores/resolve/${encodeURIComponent(slug)}`,
      {
        headers: { "x-stf-org-c": ORG_CODE },
        cache: "no-store",
      },
    );

    if (!response.ok) return new NextResponse("Store not found", { status: 404 });

    const payload = await response.json();
    const storeId = payload?.data?.store_id;
    if (payload?.status !== "success" || typeof storeId !== "string") {
      return new NextResponse("Store not found", { status: 404 });
    }

    const customDomain = payload?.data?.custom_domain;
    if (typeof customDomain === "string" && customDomain && hostname !== customDomain) {
      const destination = request.nextUrl.clone();
      destination.protocol = "https:";
      destination.hostname = customDomain;
      destination.port = "";
      return NextResponse.redirect(destination, 308);
    }

    // Existing explicit store-ID URLs continue to work unchanged.
    if (pathname === "/storefront" || pathname.startsWith("/storefront/")) {
      return NextResponse.next();
    }

    const destination = request.nextUrl.clone();
    destination.pathname = `/storefront/${storeId}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(destination);
  } catch {
    return new NextResponse("Storefront temporarily unavailable", { status: 503 });
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
