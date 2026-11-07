import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    if (!API_BASE_URL) {
      return NextResponse.json(
        { status: "error", message: "API base URL is not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const storeId = typeof body.storeId === "string" ? body.storeId.trim() : "";

    if (!email || !storeId) {
      return NextResponse.json(
        { status: "error", message: "Email and store ID are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/stores/${encodeURIComponent(storeId)}/leads`,
      {
        body: JSON.stringify({ email, source: "storefront_footer", consent: body.consent === true }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }
    );
    const responseText = await response.text();
    let data: unknown;
    try {
      data = responseText ? JSON.parse(responseText) : { status: "success" };
    } catch {
      data = { status: "error", message: "Unexpected response from lead service" };
    }
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
