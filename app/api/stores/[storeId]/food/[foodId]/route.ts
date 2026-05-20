// app/api/stores/[storeId]/food/[foodId]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; foodId: string }> }
) {
  try {
    const { storeId, foodId } = await params;

    if (!storeId || !foodId) {
      return NextResponse.json(
        { status: "error", message: "Store ID and Food ID are required" },
        { status: 400 }
      );
    }

    // Call our own working food list route internally instead of hitting upstream directly
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      `${request.nextUrl.protocol}//${request.nextUrl.host}`;

    const listResponse = await fetch(
      `${baseUrl}/api/stores/${storeId}/food`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          cookie: request.headers.get("cookie") || "",
        },
        cache: "no-store",
      }
    );

    if (!listResponse.ok) {
      return NextResponse.json(
        { status: "error", message: "Failed to fetch food items" },
        { status: listResponse.status }
      );
    }

    const result = await listResponse.json();

    const items = Array.isArray(result.data)
      ? result.data
      : Array.isArray(result)
      ? result
      : [];

    const item = items.find(
      (f: any) => f.uid === foodId || String(f.id) === foodId
    );

    if (!item) {
      return NextResponse.json(
        { status: "error", message: "Food item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "success", data: item });

  } catch (error: any) {
    console.error("Error fetching food item:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}