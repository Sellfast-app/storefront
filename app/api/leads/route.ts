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

    const payload = {
      email,
      source: "storefront",
      store_id: storeId,
      storeId,
    };

    const attempts = [
      `${API_BASE_URL}/api/stores/${encodeURIComponent(storeId)}/leads`,
      `${API_BASE_URL}/api/leads`,
    ];

    let lastStatus = 502;
    let lastMessage = "Unable to submit lead";

    for (const url of attempts) {
      const response = await fetch(url, {
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });

      const responseText = await response.text();
      if (!response.ok) {
        lastStatus = response.status;
        lastMessage = responseText || lastMessage;
        if (response.status === 404) continue;
        break;
      }

      const data = responseText ? JSON.parse(responseText) : { status: "success" };
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(
      { status: "error", message: lastMessage },
      { status: lastStatus }
    );
  } catch (error) {
    console.error("Lead capture error:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}
