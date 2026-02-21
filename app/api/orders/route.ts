// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const INTERNAL_SECRET = process.env.SWIFTREE_INTERNAL_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Check if internal secret is configured
    if (!INTERNAL_SECRET) {
      console.error('❌ SWIFTREE_INTERNAL_SECRET is not configured');
      return NextResponse.json(
        { status: "error", message: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    console.log('🔍 Creating order with data:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.store_id) {
      return NextResponse.json(
        { status: "error", message: "Store ID is required" },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { status: "error", message: "Items are required and must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!body.customer_info || !body.customer_info.email) {
      return NextResponse.json(
        { status: "error", message: "Customer information with email is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Secret": INTERNAL_SECRET, // Add internal secret here
        },
        body: JSON.stringify(body),
      }
    );

    const responseText = await response.text();
    console.log('🔍 Order creation response status:', response.status);
    console.log('🔍 Order creation response:', responseText);

    if (!response.ok) {
      let errorMessage = `Failed to create order: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }

      return NextResponse.json(
        { status: "error", message: errorMessage },
        { status: response.status }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      result = { status: "success", message: "Order created successfully" };
    }

    console.log('✅ Order created successfully:', result);
    return NextResponse.json(result);

  }  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      status: "error", 
      message: "Orders list endpoint not available. The API only supports creating orders.",
    },
    { status: 501 }
  );
}