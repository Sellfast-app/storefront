import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");

export async function POST(request: NextRequest) {
  if (!API_BASE_URL) return NextResponse.json({ status: "failed", message: "API base URL is not configured" }, { status: 500 });
  try {
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}/api/tickets/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const text = await response.text();
    let data: unknown;
    try { data = text ? JSON.parse(text) : {}; }
    catch { data = { status: "failed", message: "Unexpected response from ticket quote" }; }
    return NextResponse.json(data, { status: response.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "failed", message: "Unable to calculate ticket total" }, { status: 503 });
  }
}
