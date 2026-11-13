import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");

export async function GET(_request: NextRequest, { params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;
  if (!API_BASE_URL) return NextResponse.json({ status: "failed", message: "API base URL is not configured" }, { status: 500 });
  try {
    const response = await fetch(`${API_BASE_URL}/api/tickets/stores/${encodeURIComponent(storeId)}/events`, { cache: "no-store" });
    const body = await response.text();
    let data: unknown;
    try { data = body ? JSON.parse(body) : {}; }
    catch { data = { status: "failed", message: "Unexpected response from events service" }; }
    return NextResponse.json(data, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "failed", message: "Unable to load events" }, { status: 503 });
  }
}
