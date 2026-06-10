// app/api/stores/[storeId]/food/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;

    if (!storeId) {
      return NextResponse.json(
        { status: "error", message: "Store ID is required" },
        { status: 400 }
      );
    }

    // Get token from cookies (set during store page load)
    const cookieHeader = request.headers.get("cookie");
    let token: string | null = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split("=");
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);
      token = cookies.accessToken || null;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Fetch from the external food API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products/food/global/${storeId}`,
        {
          method: "GET",
          headers,
          signal: controller.signal,
          cache: "no-store",
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        return NextResponse.json(
          { 
            status: "error", 
            message: error.message || "Failed to fetch food items" 
          },
          { status: response.status }
        );
      }

      const result = await response.json();
      
      console.log(`🍔 Storefront: Fetched ${result.data?.length || 0} food items for store ${storeId}`);
      
      return NextResponse.json(result, { headers: NO_STORE_HEADERS });

    }   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          { status: "error", message: "Request timeout. Please try again." },
          { status: 408 }
        );
      }
      
      console.error("❌ API connection error:", fetchError);
      return NextResponse.json(
        { status: "error", message: "Unable to connect to food service." },
        { status: 503 }
      );
    }

  }    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("❌ Error fetching storefront food items:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
