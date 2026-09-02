import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const INTERNAL_SECRET = process.env.SWIFTREE_INTERNAL_SECRET || process.env.INTERNAL_SECRET;

const parseResponse = (responseText: string) => {
  if (!responseText) return {};
  try {
    return JSON.parse(responseText);
  } catch {
    return { status: "error", message: responseText };
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const { storeId } = await params;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "x-stf-org-c": "39fda25f3410a85a0fe5e2a2d81ac2c7d8c8694bf43304fe0db413e6494f024b",
    };

    if (INTERNAL_SECRET) {
      headers["X-Internal-Secret"] = INTERNAL_SECRET;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/payments/${storeId}/payment-methods`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    const responseText = await response.text();
    const data = parseResponse(responseText);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching storefront payment methods:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error while fetching payment methods",
      },
      { status: 500 }
    );
  }
}
