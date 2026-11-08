import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) return NextResponse.json({ status: "error", message: "Analytics service is not configured" }, { status: 503 });
  const body = await request.json().catch(() => null);
  if (!body || !uuidPattern.test(String(body.storeId || "")) || !uuidPattern.test(String(body.checkoutSessionId || ""))) {
    return NextResponse.json({ status: "error", message: "Valid store and checkout session identifiers are required" }, { status: 400 });
  }
  try {
    const response = await fetch(`${API_BASE_URL}/api/linkinbio/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeId: body.storeId,
        type: "checkout.started",
        payload: {
          checkout_session_id: body.checkoutSessionId,
          sales_channel: "website",
          sales_source: body.salesSource === "linkinbio" ? "linkinbio" : "direct",
        },
      }),
      cache: "no-store",
    });
    const result = await response.json().catch(() => null);
    return NextResponse.json(result || { status: "error", message: "Invalid analytics response" }, { status: response.status });
  } catch {
    return NextResponse.json({ status: "error", message: "Unable to record checkout activity" }, { status: 502 });
  }
}
