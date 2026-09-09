// app/api/payments/crypto/converted-price/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.network || !body.currency || !body.amount) {
      return NextResponse.json(
        { status: "error", message: "network, currency and amount are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/payments/get-converted-price`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = `Failed to convert price: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      return NextResponse.json({ status: "error", message: errorMessage }, { status: response.status });
    }

    const result = JSON.parse(responseText);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error converting crypto price:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error while converting price" },
      { status: 500 }
    );
  }
}
