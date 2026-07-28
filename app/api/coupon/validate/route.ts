import { NextRequest, NextResponse } from "next/server";

const COUPON_API_BASE_URL =
  process.env.NEXT_PUBLIC_COUPON_API_BASE_URL || "https://staging.swiftree.app";
const INTERNAL_SECRET = process.env.SWIFTREE_INTERNAL_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!INTERNAL_SECRET) {
      return NextResponse.json(
        { status: "failed", message: "Server configuration error", data: null },
        { status: 500 }
      );
    }

    const body = await request.json();
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const storeId = typeof body.storeId === "string" ? body.storeId.trim() : "";

    if (!storeId) {
      return NextResponse.json(
        { status: "failed", message: "Storefront ID is required", data: null },
        { status: 400 }
      );
    }

    if (!code) {
      return NextResponse.json(
        { status: "failed", message: "Coupon code is required", data: null },
        { status: 400 }
      );
    }

    const response = await fetch(`${COUPON_API_BASE_URL}/api/coupon/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": INTERNAL_SECRET,
      },
      body: JSON.stringify({ storeId, code }),
    });

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
      ? await response.json()
      : { status: "failed", message: (await response.text()).slice(0, 200), data: null };

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { status: "failed", message: "Unable to validate coupon", data: null },
      { status: 500 }
    );
  }
}
