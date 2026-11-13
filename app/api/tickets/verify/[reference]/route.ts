import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");

export async function POST(_request: NextRequest, { params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  if (!API_BASE_URL) return NextResponse.json({ status: "failed", message: "API base URL is not configured" }, { status: 500 });
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/verify/${encodeURIComponent(reference)}`, { method: "POST", cache: "no-store" });
    const responseText = await response.text();
    let data: unknown;
    try { data = responseText ? JSON.parse(responseText) : {}; }
    catch { data = { status: "failed", message: "Unexpected response from ticket verification" }; }
    return NextResponse.json(data, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "failed", message: "Unable to verify ticket payment" }, { status: 503 });
  }
}
