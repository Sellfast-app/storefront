import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  // Await the params Promise
  const { storeId } = await params;

  // Get query parameters from the request
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "50";
  const status = searchParams.get("status") || "";
  const sort = searchParams.get("sort") || "created_at";
  const dir = searchParams.get("dir") || "desc";
  const minPrice = searchParams.get("minPrice") || "0";
  const maxPrice = searchParams.get("maxPrice") || "1000000";
  const search = searchParams.get("search") || "";

  try {
    // Build query string
    const queryParams = new URLSearchParams({
      page,
      pageSize,
      status,
      sort,
      dir,
      minPrice,
      maxPrice,
      ...(search && { search }),
    });

    // Use the global endpoint that doesn't require auth
    const response = await fetch(
      `${API_BASE_URL}/api/products/store/global/${storeId}?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: `Failed to fetch products: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error while fetching products",
      },
      { status: 500 }
    );
  }
}
