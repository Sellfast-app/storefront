// app/api/payments/crypto/chains/route.ts
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/payments/get-supported-chain`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 },
    });

    const responseText = await response.text();

    if (!response.ok) {
      let errorMessage = `Failed to fetch supported chains: ${response.status}`;
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
    console.error("Error fetching supported crypto chains:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error while fetching supported chains" },
      { status: 500 }
    );
  }
}
