import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { status: "error", message: "Email is required." },
        { status: 400 }
      );
    }

    // Get store ID from cookies
    const cookieHeader = request.headers.get("cookie");
    let storeId = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split("=");
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);

      storeId = cookies.storefront_store_id || null;
    }

    if (!storeId) {
      return NextResponse.json(
        { status: "error", message: "Store not found. Please refresh and try again." },
        { status: 400 }
      );
    }

    console.log("[WAITLIST] Submitting waitlist entry:", { email, storeId });

    const response = await fetch(`${API_BASE_URL}/api/stores/join-waitlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, storeId }),
    });

    const result = await response.json();

    console.log("[WAITLIST] API response:", result);

    if (!response.ok) {
      return NextResponse.json(
        { status: "error", message: result.message || "Failed to join waitlist." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      status: "success",
      message: result.message || "Successfully joined waitlist!",
    });

  } catch (error) {
    console.error("[WAITLIST] Error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}